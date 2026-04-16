import { Injectable } from '@nestjs/common';
import {
  AllocationResultDto,
  InventoryPoolDto,
  OrderDto,
} from './types/index.js';
import type {
  AllocationTemplate,
  RankingDimension,
} from '../allocation-template/types.js';
import { AllocationTemplateService } from '../allocation-template/allocation-template.service.js';
import { DemandTypeService } from '../demand-type/demand-type.service.js';
import type { DemandType } from '../demand-type/types.js';
import { SupplyService } from '../supply/supply.service.js';

const CUSTOMER_TIER_RANK: Record<string, number> = {
  VIP: 1,
  PREMIUM: 2,
  STANDARD: 3,
};

const SHIPPING_METHOD_RANK: Record<string, number> = {
  EXPRESS: 1,
  STANDARD: 2,
  GROUND: 3,
};

const ATS_KEY_SEPARATOR = '::';

const FALLBACK_LEVELS: RankingDimension[] = [
  {
    id: 'dim-fallback-created-at',
    label: 'Order Seniority',
    level: 'createdAt',
  },
];

@Injectable()
export class AllocationEngineService {
  constructor(
    private readonly allocationTemplateService: AllocationTemplateService,
    private readonly demandTypeService: DemandTypeService,
    private readonly supplyService: SupplyService,
  ) {}

  async allocate(
    orders: OrderDto[],
    inventory: InventoryPoolDto[],
  ): Promise<AllocationResultDto[]> {
    const atsByPoolKey = this.buildAtsLookup(inventory);
    const ordersByPoolKey = this.groupOrdersByPoolKey(orders);
    const demandTypes = await this.demandTypeService.findAll();
    const demandTypePriorityByOrderDemandType =
      this.buildDemandTypePriorityLookup(demandTypes);
    const templatesByDemandType = await this.buildDemandTypeTemplateLookup(
      orders,
      demandTypes,
    );
    const source = (await this.supplyService.getConfig()).sequence[0]?.name ?? 'Unknown';

    const results: AllocationResultDto[] = [];

    for (const [poolKey, groupedOrders] of ordersByPoolKey) {
      const rankedOrders = [...groupedOrders].sort((left, right) =>
        this.compareOrders(
          left,
          right,
          templatesByDemandType,
          demandTypePriorityByOrderDemandType,
        ),
      );

      for (let index = 0; index < rankedOrders.length; index += 1) {
        const order = rankedOrders[index];
        const priorityRank = index + 1;
        const availableBeforeAllocation = atsByPoolKey.get(poolKey) ?? 0;

        let allocatedQty = 0;
        let status: 'allocated' | 'partial' | 'unallocated';

        if (availableBeforeAllocation >= order.quantityRequested) {
          allocatedQty = order.quantityRequested;
          status = 'allocated';
        } else if (availableBeforeAllocation > 0) {
          allocatedQty = availableBeforeAllocation;
          status = 'partial';
        } else {
          status = 'unallocated';
        }

        const template = templatesByDemandType.get(order.demandType);

        // Clearance drop-out: if template uses drop-out mode and order
        // can't be fully filled, reject the entire allocation.
        let reason: string | undefined;
        if (
          status !== 'allocated' &&
          template?.clearanceLogic === true &&
          template.clearanceMode === 'drop-out'
        ) {
          allocatedQty = 0;
          status = 'unallocated';
          reason = 'Dropped: clearance drop-out mode, insufficient supply';
        }

        atsByPoolKey.set(poolKey, availableBeforeAllocation - allocatedQty);

        results.push({
          id: `res-${order.orderId}-${order.skuId}`,
          orderId: order.orderId,
          sku: order.skuId,
          productName: order.productName,
          channel: order.channel,
          requestedQty: order.quantityRequested,
          allocatedQty,
          status,
          source,
          reason: reason ?? this.buildReasonCode({
            status,
            order,
            priorityRank,
            template,
            availableBeforeAllocation,
          }),
          customer: order.customer,
          orderDate: order.createdAt,
          priority: priorityRank,
        });
      }
    }

    return results.sort((left, right) => {
      const skuComparison = left.sku.localeCompare(right.sku);
      if (skuComparison !== 0) {
        return skuComparison;
      }

      const rankComparison = left.priority - right.priority;
      if (rankComparison !== 0) {
        return rankComparison;
      }

      return left.orderId.localeCompare(right.orderId);
    });
  }

  private buildAtsLookup(inventory: InventoryPoolDto[]): Map<string, number> {
    const atsByPoolKey = new Map<string, number>();

    for (const pool of inventory) {
      const key = this.buildPoolKey(pool.skuId, pool.warehouseId);
      const runningAts = atsByPoolKey.get(key) ?? 0;
      atsByPoolKey.set(key, runningAts + pool.availableToSell);
    }

    return atsByPoolKey;
  }

  private groupOrdersByPoolKey(orders: OrderDto[]): Map<string, OrderDto[]> {
    const ordersByPoolKey = new Map<string, OrderDto[]>();

    for (const order of orders) {
      const key = this.buildPoolKey(order.skuId, order.warehouseId);
      const existingGroup = ordersByPoolKey.get(key);

      if (existingGroup) {
        existingGroup.push(order);
        continue;
      }

      ordersByPoolKey.set(key, [order]);
    }

    return ordersByPoolKey;
  }

  private async buildDemandTypeTemplateLookup(
    orders: OrderDto[],
    demandTypes: DemandType[],
  ): Promise<Map<string, AllocationTemplate | undefined>> {
    const templatesByDemandType = new Map<
      string,
      AllocationTemplate | undefined
    >();

    for (const order of orders) {
      if (!templatesByDemandType.has(order.demandType)) {
        const matchingDemandType = demandTypes.find(
          (demandType) =>
            demandType.displayName.toUpperCase() === order.demandType,
        );

        templatesByDemandType.set(
          order.demandType,
          matchingDemandType
            ? await this.allocationTemplateService.findById(
                matchingDemandType.allocationTemplate,
              )
            : undefined,
        );
      }
    }

    return templatesByDemandType;
  }

  private compareOrders(
    left: OrderDto,
    right: OrderDto,
    templatesByDemandType: Map<string, AllocationTemplate | undefined>,
    demandTypePriorityByOrderDemandType: Map<string, number>,
  ): number {
    if (left.demandType !== right.demandType) {
      const demandPriorityComparison =
        this.getDemandTypePriority(
          left.demandType,
          demandTypePriorityByOrderDemandType,
        ) -
        this.getDemandTypePriority(
          right.demandType,
          demandTypePriorityByOrderDemandType,
        );

      if (demandPriorityComparison !== 0) {
        return demandPriorityComparison;
      }

      const demandTypeComparison = left.demandType.localeCompare(
        right.demandType,
      );
      if (demandTypeComparison !== 0) {
        return demandTypeComparison;
      }

      return left.orderId.localeCompare(right.orderId);
    }

    const template = templatesByDemandType.get(left.demandType);
    const levels = this.getSortedLevels(template);

    for (const level of levels) {
      const levelComparison = this.compareByLevel(left, right, level);
      if (levelComparison !== 0) {
        return levelComparison;
      }
    }

    return left.orderId.localeCompare(right.orderId);
  }

  private compareByLevel(
    left: OrderDto,
    right: OrderDto,
    level: RankingDimension,
  ): number {
    const leftValue = this.getComparableFieldValue(left, level.level);
    const rightValue = this.getComparableFieldValue(right, level.level);

    const comparison = this.compareComparableValues(leftValue, rightValue);
    if (comparison === 0) {
      return 0;
    }

    return comparison;
  }

  private compareComparableValues(
    left: string | number,
    right: string | number,
  ): number {
    if (typeof left === 'number' && typeof right === 'number') {
      return left - right;
    }

    return String(left).localeCompare(String(right));
  }

  private getComparableFieldValue(order: OrderDto, field: string): string | number {
    switch (field) {
      case 'customerTier':
        return CUSTOMER_TIER_RANK[order.customerTier] ?? Number.MAX_SAFE_INTEGER;
      case 'shippingMethod':
        return (
          SHIPPING_METHOD_RANK[order.shippingMethod] ?? Number.MAX_SAFE_INTEGER
        );
      case 'totalOrderValue':
        return order.totalOrderValue;
      case 'quantityRequested':
        return order.quantityRequested;
      case 'orderId':
        return order.orderId;
      case 'demandType':
        return order.demandType;
      case 'channel':
        return order.channel;
      case 'createdAt':
        return order.createdAt;
      case 'requestedDeliveryDate':
        return order.requestedDeliveryDate;
      case 'skuId':
        return order.skuId;
      case 'warehouseId':
        return order.warehouseId;
      default:
        return '';
    }
  }

  private getReasonFieldValue(order: OrderDto, field: string): string | number {
    switch (field) {
      case 'customerTier':
        return order.customerTier;
      case 'shippingMethod':
        return order.shippingMethod;
      default:
        return this.getComparableFieldValue(order, field);
    }
  }

  private buildDemandTypePriorityLookup(
    demandTypes: DemandType[],
  ): Map<string, number> {
    const demandTypePriorityByOrderDemandType = new Map<string, number>();

    for (const demandType of demandTypes) {
      demandTypePriorityByOrderDemandType.set(
        demandType.channel.toUpperCase(),
        demandType.priority,
      );
      demandTypePriorityByOrderDemandType.set(
        demandType.displayName.toUpperCase(),
        demandType.priority,
      );
    }

    return demandTypePriorityByOrderDemandType;
  }

  private getDemandTypePriority(
    demandType: string,
    demandTypePriorityByOrderDemandType: Map<string, number>,
  ): number {
    return (
      demandTypePriorityByOrderDemandType.get(demandType) ??
      Number.MAX_SAFE_INTEGER
    );
  }

  private getSortedLevels(
    template: AllocationTemplate | undefined,
  ): RankingDimension[] {
    if (!template) {
      return FALLBACK_LEVELS;
    }

    return template.dimensions;
  }

  private buildPoolKey(skuId: string, warehouseId: string): string {
    return `${skuId}${ATS_KEY_SEPARATOR}${warehouseId}`;
  }

  private buildReasonCode(params: {
    status: 'allocated' | 'partial' | 'unallocated';
    order: OrderDto;
    priorityRank: number;
    template: AllocationTemplate | undefined;
    availableBeforeAllocation: number;
  }): string {
    const {
      status,
      order,
      priorityRank,
      template,
      availableBeforeAllocation,
    } = params;

    if (status === 'allocated') {
      return `Allocated via ${order.demandType} template: tier=${order.customerTier}, rank=${priorityRank}`;
    }

    if (status === 'partial') {
      return `Partial allocation: requested=${order.quantityRequested}, available=${availableBeforeAllocation}`;
    }

    return `Unallocated: no remaining inventory`;
  }
}

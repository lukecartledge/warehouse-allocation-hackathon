import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AllocationResultEntity } from './entities/allocation-result.entity.js';
import { InventoryPoolEntity } from './entities/inventory-pool.entity.js';
import { OrderEntity } from './entities/order.entity.js';
import { SupplyService } from '../supply/supply.service.js';
import { AllocationEngineService } from './allocation-engine.service.js';
import { demoInventory, demoOrders } from './demo.fixture.js';
import {
  AllocateRequestDto,
  AllocateResponseDto,
  AllocationResultDto,
  AllocationSummaryDto,
  InventoryPoolDto,
  OrderDto,
} from './types/index.js';

@Injectable()
export class AllocationService {
  constructor(
    private readonly engine: AllocationEngineService,
    private readonly supplyService: SupplyService,
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
    @InjectRepository(InventoryPoolEntity)
    private readonly inventoryRepo: Repository<InventoryPoolEntity>,
    @InjectRepository(AllocationResultEntity)
    private readonly resultRepo: Repository<AllocationResultEntity>,
  ) {}

  async setOrders(orders: OrderDto[]): Promise<void> {
    await this.orderRepo.clear();
    await this.orderRepo.save(orders);
  }

  async setInventory(inventory: InventoryPoolDto[]): Promise<void> {
    await this.inventoryRepo.clear();
    await this.inventoryRepo.save(inventory);
  }

  async getResults(): Promise<AllocationResultDto[]> {
    const results = await this.resultRepo.find();
    return results.map(result => this.toResultDto(result));
  }

  async run(request: AllocateRequestDto): Promise<AllocateResponseDto> {
    const activePreset = request.strategyPreset ?? 'balanced';

    if (request.strategyPreset) {
      await this.supplyService.setPreset(request.strategyPreset);
    }

    const allOrders = await this.orderRepo.find();
    const allInventory = await this.inventoryRepo.find();

    const filteredOrders = this.filterOrders(
      allOrders.map(order => ({
        ...order,
        demandType: order.demandType as OrderDto['demandType'],
        customerTier: order.customerTier as OrderDto['customerTier'],
        shippingMethod: order.shippingMethod as OrderDto['shippingMethod'],
      })),
      request,
    );
    const inventory = this.buildInventoryWithOverrides(
      allInventory.map(pool => ({
        skuId: pool.skuId,
        warehouseId: pool.warehouseId,
        availableToSell: pool.availableToSell,
      })),
      request.supplyOverrides,
    );
    const results = await this.engine.allocate(filteredOrders, inventory, activePreset);
    const summary = this.buildSummary(results);
    const runId = randomUUID();
    const dryRun = request.dryRun ?? false;

    if (!dryRun) {
      await this.resultRepo.clear();
      await this.resultRepo.save(
        results.map(result => ({
          ...result,
          runId,
          source: result.source ?? undefined,
          reason: result.reason ?? undefined,
        })),
      );
    }

    return {
      runId,
      timestamp: new Date().toISOString(),
      dryRun,
      summary,
      results,
    };
  }

  async queryResults(status?: string, channel?: string): Promise<AllocationResultDto[]> {
    const allResults = await this.resultRepo.find();
    return allResults
      .map(result => this.toResultDto(result))
      .filter((result) => {
        const matchesStatus = status
          ? result.status.toLowerCase() === status.toLowerCase()
          : true;
        const matchesChannel = channel
          ? result.channel.toLowerCase() === channel.toLowerCase()
          : true;

        return matchesStatus && matchesChannel;
      });
  }

  async seedDemo(): Promise<AllocateResponseDto> {
    await this.setOrders(demoOrders);
    await this.setInventory(demoInventory);
    return this.run({ dryRun: false });
  }

  private filterOrders(
    orders: OrderDto[],
    request: AllocateRequestDto,
  ): OrderDto[] {
    const skuFilter = request.skus ? new Set(request.skus) : null;
    const channelFilter = request.channels
      ? new Set(request.channels.map((value) => value.toLowerCase()))
      : null;

    return orders.filter((order) => {
      const matchesSku = skuFilter ? skuFilter.has(order.skuId) : true;
      const matchesChannel = channelFilter
        ? channelFilter.has(order.channel.toLowerCase())
        : true;

      return matchesSku && matchesChannel;
    });
  }

  private buildInventoryWithOverrides(
    inventory: InventoryPoolDto[],
    overrides?: Record<string, number>,
  ): InventoryPoolDto[] {
    if (!overrides) {
      return [...inventory];
    }

    return inventory.map((pool) => {
      const override = overrides[pool.skuId];
      if (override === undefined) {
        return { ...pool };
      }

      return {
        ...pool,
        availableToSell: Math.max(0, Math.floor(override)),
      };
    });
  }

  private buildSummary(results: AllocationResultDto[]): AllocationSummaryDto {
    const initialSummary: AllocationSummaryDto = {
      totalOrders: results.length,
      totalRequested: 0,
      totalAllocated: 0,
      fillRate: 0,
      allocated: 0,
      partial: 0,
      unallocated: 0,
    };

    const summary = results.reduce((accumulator, result) => {
      accumulator.totalRequested += result.requestedQty;
      accumulator.totalAllocated += result.allocatedQty;

      if (result.status === 'allocated') {
        accumulator.allocated += 1;
      } else if (result.status === 'partial') {
        accumulator.partial += 1;
      } else {
        accumulator.unallocated += 1;
      }

      return accumulator;
    }, initialSummary);

    summary.fillRate =
      summary.totalRequested > 0
        ? summary.totalAllocated / summary.totalRequested
        : 0;

    return summary;
  }

  private toResultDto(entity: AllocationResultEntity): AllocationResultDto {
    return {
      id: entity.id,
      orderId: entity.orderId,
      sku: entity.sku,
      productName: entity.productName,
      channel: entity.channel,
      requestedQty: entity.requestedQty,
      allocatedQty: entity.allocatedQty,
      status: entity.status as AllocationResultDto['status'],
      source: entity.source ?? null,
      reason: entity.reason ?? null,
      customer: entity.customer,
      orderDate: entity.orderDate,
      priority: entity.priority,
    };
  }
}

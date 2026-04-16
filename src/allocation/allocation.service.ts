import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
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
  private orders: OrderDto[] = [];
  private inventory: InventoryPoolDto[] = [];
  private results: AllocationResultDto[] = [];
  private lastRunId: string | null = null;

  constructor(
    private readonly engine: AllocationEngineService,
    private readonly supplyService: SupplyService,
  ) {}

  setOrders(orders: OrderDto[]): void {
    this.orders = [...orders];
  }

  setInventory(inventory: InventoryPoolDto[]): void {
    this.inventory = [...inventory];
  }

  getResults(): AllocationResultDto[] {
    return [...this.results];
  }

  run(request: AllocateRequestDto): AllocateResponseDto {
    if (request.strategyPreset) {
      this.supplyService.setPreset(request.strategyPreset);
    }

    const filteredOrders = this.filterOrders(request);
    const inventory = this.buildInventoryWithOverrides(request.supplyOverrides);
    const results = this.engine.allocate(filteredOrders, inventory);
    const summary = this.buildSummary(results);
    const runId = randomUUID();
    const dryRun = request.dryRun ?? false;

    if (!dryRun) {
      this.results = [...results];
      this.lastRunId = runId;
    }

    return {
      runId,
      timestamp: new Date().toISOString(),
      dryRun,
      summary,
      results,
    };
  }

  queryResults(status?: string, channel?: string): AllocationResultDto[] {
    return this.results.filter((result) => {
      const matchesStatus = status
        ? result.status.toLowerCase() === status.toLowerCase()
        : true;
      const matchesChannel = channel
        ? result.channel.toLowerCase() === channel.toLowerCase()
        : true;

      return matchesStatus && matchesChannel;
    });
  }

  seedDemo(): AllocateResponseDto {
    this.setOrders(demoOrders);
    this.setInventory(demoInventory);
    return this.run({ dryRun: false });
  }

  private filterOrders(request: AllocateRequestDto): OrderDto[] {
    const skuFilter = request.skus ? new Set(request.skus) : null;
    const channelFilter = request.channels
      ? new Set(request.channels.map((value) => value.toLowerCase()))
      : null;

    return this.orders.filter((order) => {
      const matchesSku = skuFilter ? skuFilter.has(order.skuId) : true;
      const matchesChannel = channelFilter
        ? channelFilter.has(order.channel.toLowerCase())
        : true;

      return matchesSku && matchesChannel;
    });
  }

  private buildInventoryWithOverrides(
    overrides?: Record<string, number>,
  ): InventoryPoolDto[] {
    if (!overrides) {
      return [...this.inventory];
    }

    return this.inventory.map((pool) => {
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
}

import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AllocationTemplateEntity } from '../allocation-template/allocation-template.entity.js';
import { DemandTypeEntity } from '../demand-type/demand-type.entity.js';
import { SupplyConfigEntity } from '../supply/supply-config.entity.js';
import { SupplySourceEntity } from '../supply/supply-source.entity.js';
import { AllocationResultEntity } from './entities/allocation-result.entity.js';
import { InventoryPoolEntity } from './entities/inventory-pool.entity.js';
import { OrderEntity } from './entities/order.entity.js';
import { AllocationModule } from './allocation.module.js';
import { AllocationService } from './allocation.service.js';
import { demoInventory, demoOrders } from './demo.fixture.js';

describe('AllocationService integration', () => {
  let moduleRef: TestingModule;
  let allocationService: AllocationService;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database: ':memory:',
          entities: [
            DemandTypeEntity,
            SupplySourceEntity,
            SupplyConfigEntity,
            AllocationTemplateEntity,
            OrderEntity,
            InventoryPoolEntity,
            AllocationResultEntity,
          ],
          synchronize: true,
        }),
        AllocationModule,
      ],
    }).compile();

    await moduleRef.init();

    allocationService = moduleRef.get<AllocationService>(AllocationService);
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  it('produces deterministic ordering for top-ranked jacket order', async () => {
    await allocationService.seedDemo();

    const response = await allocationService.run({});

    expect(response.results[0]).toMatchObject({
      orderId: 'ORD-2024-RET-006',
      sku: 'SKU-JACKET-002',
    });
  });

  it('computes summary totals correctly', async () => {
    await allocationService.seedDemo();

    const response = await allocationService.run({});
    const { summary } = response;

    expect(summary.totalOrders).toBe(20);
    expect(summary.allocated + summary.partial + summary.unallocated).toBe(20);
  });

  it('computes fill rate from allocated and requested totals', async () => {
    await allocationService.seedDemo();

    const response = await allocationService.run({});
    const { summary } = response;

    expect(summary.fillRate).toBe(summary.totalAllocated / summary.totalRequested);
  });

  it('filters persisted results by status', async () => {
    await allocationService.seedDemo();

    await allocationService.run({});
    const allocatedOnly = await allocationService.queryResults('allocated');

    expect(allocatedOnly.length).toBeGreaterThan(0);
    expect(allocatedOnly.every((result) => result.status === 'allocated')).toBe(true);
  });

  it('filters persisted results by channel', async () => {
    await allocationService.seedDemo();

    await allocationService.run({});
    const wholesaleOnly = await allocationService.queryResults(undefined, 'wholesale');

    expect(wholesaleOnly.length).toBeGreaterThan(0);
    expect(
      wholesaleOnly.every(
        (result) => result.channel.toLowerCase() === 'wholesale',
      ),
    ).toBe(true);
  });

  it('returns results for dry run without persisting queryable results', async () => {
    await allocationService.setOrders(demoOrders);
    await allocationService.setInventory(demoInventory);

    const response = await allocationService.run({ dryRun: true });

    expect(response.results.length).toBeGreaterThan(0);
    expect((await allocationService.queryResults()).length).toBe(0);
  });

  it('applies SKU filter to allocation run', async () => {
    await allocationService.seedDemo();

    const response = await allocationService.run({ skus: ['SKU-RUNNER-001'] });

    expect(response.results.length).toBeGreaterThan(0);
    expect(response.results.every((result) => result.sku === 'SKU-RUNNER-001')).toBe(
      true,
    );
  });
});

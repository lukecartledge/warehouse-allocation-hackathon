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

  it('prioritises D2C orders over Retail and Wholesale for same SKU', async () => {
    await allocationService.seedDemo();

    const response = await allocationService.run({});

    // D2C has priority 1, so D2C jacket orders should be allocated first
    const jacketResults = response.results.filter(
      (result) => result.sku === 'SKU-JACKET-002',
    );
    const firstJacket = jacketResults[0];
    expect(firstJacket.channel).toBe('D2C');
  });

  it('allocates D2C runner orders before Wholesale runner orders', async () => {
    await allocationService.seedDemo();

    const response = await allocationService.run({
      skus: ['SKU-RUNNER-001'],
    });

    // Find the first D2C and first Wholesale result
    const d2cResult = response.results.find(
      (result) => result.channel === 'D2C',
    );
    const wholesaleResult = response.results.find(
      (result) => result.channel === 'Wholesale',
    );

    expect(d2cResult).toBeDefined();
    expect(wholesaleResult).toBeDefined();
    // D2C priority rank should be lower (better) than Wholesale
    expect(d2cResult!.priority).toBeLessThan(wholesaleResult!.priority);
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

  it('conservative preset reduces total allocation via safety stock hold-back', async () => {
    await allocationService.seedDemo();

    const balancedResponse = await allocationService.run({ dryRun: true });
    const conservativeResponse = await allocationService.run({
      dryRun: true,
      strategyPreset: 'conservative',
    });

    // Conservative should allocate less due to 20% ATS reduction
    expect(conservativeResponse.summary.totalAllocated).toBeLessThan(
      balancedResponse.summary.totalAllocated,
    );
  });

  it('records supply source name on allocation results', async () => {
    await allocationService.seedDemo();

    const response = await allocationService.run({});

    // All results should have a source
    expect(
      response.results.every((result) => typeof result.source === 'string' && result.source.length > 0),
    ).toBe(true);
  });

  it('multi-source fallthrough uses secondary source when primary is exhausted', async () => {
    // Set up minimal inventory: only 5 on-hand, 10 transfer
    await allocationService.setOrders([
      {
        orderId: 'ORD-TEST-001',
        demandType: 'D2C' as any,
        channel: 'D2C',
        customerTier: 'STANDARD' as any,
        shippingMethod: 'STANDARD' as any,
        totalOrderValue: 10000,
        createdAt: '2024-01-01T00:00:00Z',
        requestedDeliveryDate: '2024-01-05T00:00:00Z',
        skuId: 'SKU-TEST',
        warehouseId: 'WH-TEST',
        quantityRequested: 12,
        productName: 'Test Product',
        customer: 'Test Customer',
      },
    ]);
    await allocationService.setInventory([
      {
        skuId: 'SKU-TEST',
        warehouseId: 'WH-TEST',
        availableToSell: 5,
        source: 'On-hand Inventory',
      },
      {
        skuId: 'SKU-TEST',
        warehouseId: 'WH-TEST',
        availableToSell: 10,
        source: 'Transfer Orders',
      },
    ]);

    const response = await allocationService.run({ dryRun: true });

    // Should get 12 (5 from on-hand + 7 from transfer)
    expect(response.results[0].allocatedQty).toBe(12);
    expect(response.results[0].status).toBe('allocated');
  });
});

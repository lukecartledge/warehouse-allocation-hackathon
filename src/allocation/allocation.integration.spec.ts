import { Test, TestingModule } from '@nestjs/testing';
import { AllocationModule } from './allocation.module.js';
import { AllocationService } from './allocation.service.js';
import { demoInventory, demoOrders } from './demo.fixture.js';

describe('AllocationService integration', () => {
  let moduleRef: TestingModule;
  let allocationService: AllocationService;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AllocationModule],
    }).compile();

    allocationService = moduleRef.get<AllocationService>(AllocationService);
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  it('produces deterministic ordering for top-ranked jacket order', () => {
    allocationService.seedDemo();

    const response = allocationService.run({});

    expect(response.results[0]).toMatchObject({
      orderId: 'ORD-2024-RET-006',
      sku: 'SKU-JACKET-002',
    });
  });

  it('computes summary totals correctly', () => {
    allocationService.seedDemo();

    const response = allocationService.run({});
    const { summary } = response;

    expect(summary.totalOrders).toBe(20);
    expect(summary.allocated + summary.partial + summary.unallocated).toBe(20);
  });

  it('computes fill rate from allocated and requested totals', () => {
    allocationService.seedDemo();

    const response = allocationService.run({});
    const { summary } = response;

    expect(summary.fillRate).toBe(summary.totalAllocated / summary.totalRequested);
  });

  it('filters persisted results by status', () => {
    allocationService.seedDemo();

    allocationService.run({});
    const allocatedOnly = allocationService.queryResults('allocated');

    expect(allocatedOnly.length).toBeGreaterThan(0);
    expect(allocatedOnly.every((result) => result.status === 'allocated')).toBe(true);
  });

  it('filters persisted results by channel', () => {
    allocationService.seedDemo();

    allocationService.run({});
    const wholesaleOnly = allocationService.queryResults(undefined, 'wholesale');

    expect(wholesaleOnly.length).toBeGreaterThan(0);
    expect(
      wholesaleOnly.every(
        (result) => result.channel.toLowerCase() === 'wholesale',
      ),
    ).toBe(true);
  });

  it('returns results for dry run without persisting queryable results', () => {
    allocationService.setOrders(demoOrders);
    allocationService.setInventory(demoInventory);

    const response = allocationService.run({ dryRun: true });

    expect(response.results.length).toBeGreaterThan(0);
    expect(allocationService.queryResults().length).toBe(0);
  });

  it('applies SKU filter to allocation run', () => {
    allocationService.seedDemo();

    const response = allocationService.run({ skus: ['SKU-RUNNER-001'] });

    expect(response.results.length).toBeGreaterThan(0);
    expect(response.results.every((result) => result.sku === 'SKU-RUNNER-001')).toBe(
      true,
    );
  });
});

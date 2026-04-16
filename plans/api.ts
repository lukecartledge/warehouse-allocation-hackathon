/**
 * Shared types for InventoryEngine API
 *
 * These interfaces define the contract between the frontend and the NestJS backend.
 * Copy this file into the backend project to ensure type alignment.
 */

// ─── Demand ──────────────────────────────────────────────────────────────────

export interface DemandType {
  id: string;
  displayName: string;
  channel: string;
  orderType: string;
  allocationTemplate: string;
}

export interface CreateDemandTypeDto {
  displayName: string;
  channel: string;
  orderType: string;
  allocationTemplate: string;
}

export type UpdateDemandTypeDto = Partial<CreateDemandTypeDto>;

/** GET  /api/demand-types          → DemandType[]       */
/** POST /api/demand-types          → DemandType         (body: CreateDemandTypeDto) */
/** PUT  /api/demand-types/:id      → DemandType         (body: UpdateDemandTypeDto) */
/** DEL  /api/demand-types/:id      → void               */

export const CHANNELS = ['D2C', 'Wholesale', 'Retail', 'Marketplace'] as const;
export type Channel = (typeof CHANNELS)[number];

export const ORDER_TYPES = ['Standard Ship', 'Express', 'Click & Collect', 'Pre-order'] as const;
export type OrderType = (typeof ORDER_TYPES)[number];

// ─── Supply ──────────────────────────────────────────────────────────────────

export interface SupplySource {
  id: string;
  name: string;
  description: string;
  priority: number;
}

export interface CreateSupplySourceDto {
  name: string;
  description: string;
  priority: number;
}

export type UpdateSupplySourceDto = Partial<CreateSupplySourceDto>;

export type StrategyPreset = 'conservative' | 'fast' | 'balanced';

export interface SupplyConfig {
  activePreset: StrategyPreset;
  sequence: SupplySource[];
}

/** GET  /api/supply/config                → SupplyConfig       */
/** PUT  /api/supply/config/preset         → SupplyConfig       (body: { preset: StrategyPreset }) */
/** PUT  /api/supply/config/sequence       → SupplyConfig       (body: { sequence: SupplySource[] }) */
/** POST /api/supply/sources               → SupplySource       (body: CreateSupplySourceDto) */
/** PUT  /api/supply/sources/:id           → SupplySource       (body: UpdateSupplySourceDto) */
/** DEL  /api/supply/sources/:id           → void               */

// ─── Prioritization ──────────────────────────────────────────────────────────

export interface RankingDimension {
  id: string;
  label: string;
  level: string;
}

export interface AllocationTemplate {
  id: string;
  name: string;
  dimensions: RankingDimension[];
  clearanceLogic: boolean;
  clearanceMode: 'in-season' | 'drop-out';
}

export interface CreateAllocationTemplateDto {
  name: string;
  dimensions: Omit<RankingDimension, 'id'>[];
  clearanceLogic: boolean;
  clearanceMode: 'in-season' | 'drop-out';
}

export type UpdateAllocationTemplateDto = Partial<CreateAllocationTemplateDto>;

/** GET  /api/allocation-templates          → AllocationTemplate[]   */
/** POST /api/allocation-templates          → AllocationTemplate     (body: CreateAllocationTemplateDto) */
/** PUT  /api/allocation-templates/:id      → AllocationTemplate     (body: UpdateAllocationTemplateDto) */
/** DEL  /api/allocation-templates/:id      → void                   */

// ─── Allocation Results (read-only from frontend) ────────────────────────────

export type AllocationStatus = 'allocated' | 'partial' | 'unallocated';

export interface AllocationResult {
  id: string;
  orderId: string;
  sku: string;
  productName: string;
  channel: string;
  requestedQty: number;
  allocatedQty: number;
  status: AllocationStatus;
  source: string | null;
  reason: string | null;
  customer: string;
  orderDate: string;
  priority: number;
}

/** GET  /api/allocations                   → AllocationResult[]     */
/** GET  /api/allocations?status=unallocated&channel=D2C → filtered  */

// ─── Allocation Engine (run) ─────────────────────────────────────────────────

export interface AllocateRequest {
  /** Optional filter — only allocate for these SKUs. Omit to allocate all. */
  skus?: string[];
  /** Optional filter — only allocate for these channels. */
  channels?: Channel[];
  /** Override available supply per SKU. If omitted, uses current inventory. */
  supplyOverrides?: Record<string, number>;
  /** Which strategy preset to use. Defaults to the active config. */
  strategyPreset?: StrategyPreset;
  /** If true, simulate only — don't persist results. */
  dryRun?: boolean;
}

export interface AllocateResponse {
  runId: string;
  timestamp: string;
  dryRun: boolean;
  summary: {
    totalOrders: number;
    totalRequested: number;
    totalAllocated: number;
    fillRate: number;
    allocated: number;
    partial: number;
    unallocated: number;
  };
  results: AllocationResult[];
}

/** POST /api/allocations/run               → AllocateResponse       (body: AllocateRequest) */

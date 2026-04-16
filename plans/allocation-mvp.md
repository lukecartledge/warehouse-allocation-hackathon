# Plan: Priority & Segmentation-Driven Allocation MVP

## Approach

Build a NestJS REST API that serves as the backend for the Inventory Allocation
Engine frontend. All endpoints conform to the shared API contract defined in
`plans/api.ts`. The API covers demand type management, supply source configuration,
allocation template CRUD, engine execution with summary stats, and queryable
allocation results. In-memory stores throughout — no database required.

## API Contract Reference

See `plans/api.ts` for the canonical type definitions. All endpoints are prefixed
with `/api` via Swagger setup.

## Scope

### In
- NestJS project scaffold with Swagger UI at `/api` ✅ (done)
- **Demand Types module** — CRUD for demand type entities at `/api/demand-types`
- **Supply module** — Supply source CRUD + config presets at `/api/supply/*`
- **Allocation Templates module** — CRUD with dimensions + clearance at `/api/allocation-templates`
- **Allocation Engine** — `POST /api/allocations/run` with filters, dry-run, summary stats
- **Allocation Results** — `GET /api/allocations` with `?status=&channel=` filtering
- **Demo seed** — `POST /api/demo/seed` populates all stores with realistic data
- Integration test asserting deterministic output

### Out
- Database persistence
- Auth / RBAC
- Pegging windows, allocation horizons, intra-day triggers
- Hard vs Soft allocation state machine
- D365 / Anaplan / IVS integrations

---

## Progress

- [x] **T1 — Scaffold** ✅
- [x] **T2 — Core types** ✅ (needs reshaping — see T2b)
- [x] **T3 — RankingTemplate module** ✅ (needs reshaping — see T3b)

---

## TODOs

### Reshaping existing code to match api.ts

- [ ] **T2b — Reshape core types to match api.ts contract**:
  - **`src/allocation/types/allocation-result.model.ts`** — Update `AllocationResultDto` to match frontend `AllocationResult`:
    - Add fields: `id`, `sku` (rename from `skuId`), `productName`, `channel`, `source: string | null`, `reason: string | null` (rename from `reasonCode`), `customer`, `orderDate`, `priority` (rename from `priorityRank`)
    - Remove: `warehouseId`, `demandType`, `reasonCode`, `priorityRank`
    - Change `AllocationStatus` to lowercase: `'allocated' | 'partial' | 'unallocated'`
    - Rename `quantityRequested` → `requestedQty`, `allocatedQty` stays
  - **`src/allocation/types/order.dto.ts`** — Add `productName: string` and `customer: string` fields (needed to populate result). Keep existing fields.
  - **`src/allocation/types/inventory.dto.ts`** — Keep as-is (internal model for engine, not exposed to frontend)
  - **New `src/allocation/types/allocate-request.dto.ts`**:
    ```
    AllocateRequestDto {
      skus?: string[]
      channels?: string[]
      supplyOverrides?: Record<string, number>
      strategyPreset?: 'conservative' | 'fast' | 'balanced'
      dryRun?: boolean
    }
    ```
  - **New `src/allocation/types/allocate-response.dto.ts`**:
    ```
    AllocateResponseDto {
      runId: string
      timestamp: string
      dryRun: boolean
      summary: {
        totalOrders: number
        totalRequested: number
        totalAllocated: number
        fillRate: number
        allocated: number
        partial: number
        unallocated: number
      }
      results: AllocationResultDto[]
    }
    ```
  - Update barrel `index.ts` with new exports
  - Remove `ranking-template.model.ts` (replaced by allocation-template types in T3b)

- [ ] **T3b — Reshape templates → Allocation Templates module**:
  - **Rename/replace** `src/ranking-template/` → `src/allocation-template/`
  - **New model** `AllocationTemplate`:
    ```
    { id, name, dimensions: RankingDimension[], clearanceLogic: boolean, clearanceMode: 'in-season' | 'drop-out' }
    ```
    where `RankingDimension` = `{ id, label, level }`
  - **Routes change** from `/templates/:demandType` → `/allocation-templates/:id`
  - **Full CRUD**: GET all, POST create, PUT update by id, DELETE by id
  - **DTOs**: `CreateAllocationTemplateDto`, `UpdateAllocationTemplateDto` (Partial)
  - **Seed 3 defaults**: Retail, Wholesale, D2C templates with appropriate dimensions
  - **Service**: keyed by `id` not `demandType`
  - Update `AppModule` imports

### New modules

- [ ] **T4 — Demand Types module** (`src/demand-type/`):
  - **Model**: `DemandType { id, displayName, channel, orderType, allocationTemplate }`
  - **DTOs**: `CreateDemandTypeDto { displayName, channel, orderType, allocationTemplate }`, `UpdateDemandTypeDto = Partial<Create>`
  - **Service**: In-memory `Map<string, DemandType>`, full CRUD + seed defaults
  - **Controller** at `/demand-types`: GET all, POST create, PUT `:id`, DELETE `:id`
  - **Seed defaults** on startup:
    - `{ id: 'dt-retail', displayName: 'Retail', channel: 'Retail', orderType: 'Standard Ship', allocationTemplate: 'tpl-retail' }`
    - `{ id: 'dt-wholesale', displayName: 'Wholesale', channel: 'Wholesale', orderType: 'Standard Ship', allocationTemplate: 'tpl-wholesale' }`
    - `{ id: 'dt-d2c', displayName: 'D2C', channel: 'D2C', orderType: 'Express', allocationTemplate: 'tpl-d2c' }`
    - `{ id: 'dt-marketplace', displayName: 'Marketplace', channel: 'Marketplace', orderType: 'Standard Ship', allocationTemplate: 'tpl-retail' }`
  - Register in `AppModule`

- [ ] **T5 — Supply module** (`src/supply/`):
  - **Models**: `SupplySource { id, name, description, priority }`, `SupplyConfig { activePreset, sequence: SupplySource[] }`, `StrategyPreset = 'conservative' | 'fast' | 'balanced'`
  - **DTOs**: `CreateSupplySourceDto`, `UpdateSupplySourceDto` (Partial)
  - **Service**: In-memory store for sources + config. Methods for preset switching + custom sequence.
  - **Controller** at `/supply`:
    - `GET /supply/config` → SupplyConfig
    - `PUT /supply/config/preset` → SupplyConfig (body: `{ preset }`)
    - `PUT /supply/config/sequence` → SupplyConfig (body: `{ sequence }`)
    - `POST /supply/sources` → SupplySource
    - `PUT /supply/sources/:id` → SupplySource
    - `DELETE /supply/sources/:id` → void
  - **Seed defaults**: 3 supply sources (On-hand, Transfer Orders, Inbound POs) with preset configs
  - Register in `AppModule`

### Engine + Results

- [ ] **T6 — Allocation Engine service** (`src/allocation/allocation-engine.service.ts`):
  - Method: `run(request: AllocateRequestDto): AllocateResponseDto`
  - Injects `AllocationTemplateService`, `DemandTypeService`, `SupplyService`
  - Uses seeded orders from in-memory store (populated via demo seed)
  - Algorithm: group by SKU → rank by template dimensions → greedy ATS → tag with reason
  - Generates `runId` (uuid), `timestamp`, `summary` with fillRate + counts
  - Respects `dryRun` flag (if false, persists results to in-memory store)
  - Supports `skus[]` and `channels[]` filters on the request
  - Returns `AllocateResponseDto` matching the api.ts contract

- [ ] **T7 — Allocation Results + Engine endpoints** (`src/allocation/`):
  - **Allocation module** with controller at `/allocations`:
    - `POST /allocations/run` → `AllocateResponseDto` (body: `AllocateRequestDto`)
    - `GET /allocations` → `AllocationResultDto[]` with query filters `?status=&channel=`
  - **In-memory results store**: persists last run's results for GET queries
  - **Demo seed endpoint**: `POST /demo/seed` — populates orders, inventory, and runs allocation
  - Register in `AppModule`

### Finish

- [ ] **T8 — Integration test**: Assert deterministic allocation output, summary stats, filtering
- [ ] **T9 — Swagger polish + README**: Full API documentation matching api.ts

---

## Validation

- `npm run test:e2e` passes with deterministic allocation assertions
- `POST /api/demo/seed` populates all stores and returns allocation results with summary
- All endpoints from `api.ts` return expected shapes
- `GET /api/allocations?status=unallocated&channel=D2C` returns filtered results
- Changing a template via `PUT /api/allocation-templates/:id` and re-running `POST /api/allocations/run` produces different results — the "wow moment"

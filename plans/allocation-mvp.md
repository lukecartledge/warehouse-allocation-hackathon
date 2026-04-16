# Plan: Priority & Segmentation-Driven Allocation MVP

## Approach

Build a NestJS REST API that accepts competing orders and available inventory,
applies configurable multi-level priority ranking templates per demand type, and
returns deterministic allocation results with reason codes. The demo runs entirely
via Swagger UI using pre-seeded realistic scenarios — no frontend, no database,
no external integrations required.

## Scope

### In
- NestJS project scaffold with Swagger UI auto-docs
- Core domain types: `Order`, `InventoryPool`, `RankingTemplate`, `AllocationResult`, `ReasonCode`
- `RankingTemplateModule` — in-memory CRUD store, seeded with 3 default templates (Retail, Wholesale, D2C)
- `AllocationEngine` service — multi-level sort → greedy ATS consumption → reason code tagging
- `POST /allocate` — run the engine against a supplied order list + inventory snapshot
- `GET/POST/PATCH /templates` — view and update ranking templates at runtime
- `POST /demo/seed` — instantly loads a 20-order / 3-channel / 2-SKU scenario
- Integration test asserting deterministic output for a fixed input

### Out
- Database persistence (SQLite, Postgres, etc.)
- Frontend / UI (Swagger is the demo surface)
- Auth / RBAC
- Pegging windows, allocation horizons, intra-day triggers
- Hard vs Soft allocation state machine
- D365 / Anaplan / IVS integrations

---

## TODOs

- [ ] **T1 — Scaffold**: Initialise NestJS project in `allocation-engine/`, enable strict TypeScript, install and configure `@nestjs/swagger`, add `class-validator` + `class-transformer`, wire `ValidationPipe` globally, confirm `GET /` returns 200 and Swagger UI loads at `/api`.

- [ ] **T2 — Core types**: Create `src/allocation/types/` containing:
  - `order.dto.ts` — `OrderDto` with fields: `orderId`, `demandType` (`RETAIL|WHOLESALE|D2C`), `channel`, `customerTier`, `shippingMethod`, `totalOrderValue`, `createdAt`, `requestedDeliveryDate`, `skuId`, `quantityRequested`
  - `inventory.dto.ts` — `InventoryPoolDto` with fields: `skuId`, `warehouseId`, `availableToSell`
  - `ranking-template.model.ts` — `RankingTemplate` with `id`, `demandType`, `levels: RankingLevel[]` where `RankingLevel` has `field: keyof OrderDto`, `direction: 'ASC'|'DESC'`, `order: number`
  - `allocation-result.model.ts` — `AllocationResult` with `orderId`, `skuId`, `allocatedQty`, `status: 'ALLOCATED'|'PARTIAL'|'UNALLOCATED'`, `priorityRank`, `reasonCode: string`

- [ ] **T3 — RankingTemplate module**: Create `src/ranking-template/` module with:
  - `RankingTemplateService` — in-memory `Map<string, RankingTemplate>`, methods: `findAll()`, `findByDemandType(type)`, `upsert(template)`, `seed()` (loads 3 defaults below)
  - Default templates seeded on app bootstrap:
    - **Retail**: `[segment ASC, createdAt ASC, requestedDeliveryDate ASC]`
    - **Wholesale**: `[customerTier ASC, createdAt ASC, requestedDeliveryDate ASC]`
    - **D2C**: `[shippingMethod ASC, createdAt ASC, totalOrderValue DESC]`
  - `RankingTemplateController` — `GET /templates`, `GET /templates/:demandType`, `PUT /templates/:demandType`
  - Full Swagger decorators on all endpoints

- [ ] **T4 — Allocation Engine**: Create `src/allocation/allocation-engine.service.ts`:
  - Method: `allocate(orders: OrderDto[], inventory: InventoryPoolDto[]): AllocationResult[]`
  - Step 1 — Group orders by `skuId + warehouseId`
  - Step 2 — For each group, look up the `RankingTemplate` for the order's `demandType`
  - Step 3 — Sort orders using the template's `levels` array (multi-key sort, deterministic tie-breaker = `orderId` lexicographic)
  - Step 4 — Iterate sorted orders, greedily consume ATS: full fill → `ALLOCATED`, partial → `PARTIAL`, zero → `UNALLOCATED`
  - Step 5 — Attach `priorityRank` (1-based position in sorted list) and `reasonCode` string (e.g. `"ALLOCATED via WHOLESALE template: tier=VIP, rank=1"`)
  - Return full `AllocationResult[]` sorted by `priorityRank`

- [ ] **T5 — Allocate endpoint + Demo seed**: Create `src/allocation/allocation.controller.ts`:
  - `POST /allocate` — accepts `{ orders: OrderDto[], inventory: InventoryPoolDto[] }`, calls engine, returns results. Add Swagger `@ApiBody` with a minimal inline example.
  - `POST /demo/seed` — no body required; loads the pre-built scenario (see below) and runs allocation, returning results directly so the demo is a single button click in Swagger.
  - **Demo scenario** (hardcoded in a `demo.fixture.ts` file):
    - 2 SKUs: `SKU-RUNNER-001`, `SKU-JACKET-002`
    - 1 warehouse: `WH-ZURICH`
    - ATS: `SKU-RUNNER-001 = 50 units`, `SKU-JACKET-002 = 30 units`
    - 20 orders spread across RETAIL (8), WHOLESALE (7), D2C (5) with varying tiers, shipping methods, values, and dates — total demand intentionally exceeds ATS to show prioritisation in action

- [ ] **T6 — Integration test**: Create `test/allocation.e2e-spec.ts`:
  - Seed the default templates
  - POST a fixed set of 5 orders (2 WHOLESALE VIP, 2 WHOLESALE STANDARD, 1 D2C) against 10 units ATS
  - Assert: VIP orders allocated first, STANDARD partially/unallocated, reason codes present, output is deterministic across 3 repeated calls
  - Run with `npm run test:e2e`

- [ ] **T7 — Swagger polish + README**: 
  - Add `@ApiOperation`, `@ApiResponse`, `@ApiProperty` descriptions to all DTOs and controllers so Swagger tells the business story
  - Write a `README.md` in `allocation-engine/` with: what it does, how to run (`npm run start:dev`), how to demo (open `/api`, hit `/demo/seed` first, then explore `/templates`)

---

## Parallelisation Map

```
Hour 0:00–0:30  →  P1: T1 (scaffold) — unblocks everyone
Hour 0:30–1:30  →  P2: T3 (templates module)  |  P3: T4 (engine)  [parallel]
                →  P1: T2 (types)              [feeds P2+P3]
Hour 1:30–2:30  →  P4: T5 (endpoints, integrates T3+T4)
                →  P5: T6 (integration test)   [parallel with P4]
Hour 2:30–3:00  →  All: T7 (Swagger polish + README)
Hour 3:00–3:30  →  Buffer: bug fixes, demo rehearsal
```

---

## Validation

- `npm run test:e2e` passes with deterministic allocation assertions
- `POST /demo/seed` returns 20 allocation results with reason codes in < 200ms
- Changing a ranking template via `PUT /templates/WHOLESALE` and re-running `/demo/seed` produces a visibly different allocation order — this is the "wow moment" for the demo

---

## Open Questions

- Should `customerTier` be a free-form string or an enum (`VIP | PREMIUM | STANDARD`)? Assuming enum for deterministic sorting.
- Do we want the demo scenario to include a "before/after template change" story baked into `/demo/seed`, or keep it as two separate calls?

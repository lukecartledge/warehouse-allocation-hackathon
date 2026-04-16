# API Endpoints

## Demand Types — `/demand-types`

| Method | Path | Description |
|---|---|---|
| `GET` | `/demand-types` | Returns all demand types. A demand type defines a channel + order type combination (e.g. "Retail / Standard Ship") and links it to an allocation template that controls how orders in that channel get prioritized. 4 seeded by default. |
| `POST` | `/demand-types` | Create a new demand type. Body: `{ displayName, channel, orderType, allocationTemplate }` |
| `PUT` | `/demand-types/:id` | Update any field on an existing demand type. Partial updates allowed. |
| `DELETE` | `/demand-types/:id` | Remove a demand type. |

## Supply — `/supply`

| Method | Path | Description |
|---|---|---|
| `GET` | `/supply/config` | Returns the current supply configuration: which strategy preset is active (`conservative`, `balanced`, `fast`) and the ordered sequence of supply sources to draw from. |
| `PUT` | `/supply/config/preset` | Switch the active strategy preset. Body: `{ preset: 'conservative' | 'balanced' | 'fast' }` |
| `PUT` | `/supply/config/sequence` | Reorder or replace the supply source sequence. Body: `{ sequence: SupplySource[] }` |
| `POST` | `/supply/sources` | Add a new supply source. Body: `{ name, description, priority }` |
| `PUT` | `/supply/sources/:id` | Update a supply source. Partial updates allowed. |
| `DELETE` | `/supply/sources/:id` | Remove a supply source. |

## Allocation Templates — `/allocation-templates`

| Method | Path | Description |
|---|---|---|
| `GET` | `/allocation-templates` | Returns all allocation templates. Each template defines the **ranking dimensions** (e.g. Customer Tier → Order Seniority → Delivery Urgency) that determine priority order when multiple orders compete for the same inventory. Also includes clearance mode settings. 3 seeded by default (Retail, Wholesale, D2C). |
| `POST` | `/allocation-templates` | Create a new template. Body: `{ name, dimensions: [{ label, level }], clearanceLogic, clearanceMode }` |
| `PUT` | `/allocation-templates/:id` | Update a template. Partial updates allowed. |
| `DELETE` | `/allocation-templates/:id` | Remove a template. |

## Allocations — `/allocations`

| Method | Path | Description |
|---|---|---|
| `POST` | `/allocations/run` | **Run the allocation engine.** Takes the current orders + inventory in memory, ranks orders by demand type priority and template dimensions, then does greedy allocation (highest priority first, decrement inventory). Returns a full response with `runId`, `timestamp`, `dryRun` flag, `summary` stats (totalOrders, totalRequested, totalAllocated, fillRate, counts by status), and the full `results[]` array. Optional filters: `skus`, `channels`, `supplyOverrides`, `strategyPreset`, `dryRun`. |
| `GET` | `/allocations` | Query the results from the last allocation run. Supports `?status=allocated|partial|unallocated` and `?channel=Retail|Wholesale|D2C` query params for filtering. Returns `AllocationResult[]`. |

## Demo — `/demo`

| Method | Path | Description |
|---|---|---|
| `POST` | `/demo/seed` | **One-shot demo setup.** Loads 20 realistic orders (8 Retail, 7 Wholesale, 5 D2C) across 2 SKUs (Cloud Runner 2: 50 units, Performance Jacket: 30 units) into memory, then immediately runs the allocation engine and returns the full `AllocateResponse`. This is the fastest way to get a working demo — hit this once, then browse results via `GET /allocations` or re-run with different filters via `POST /allocations/run`. |

## The allocation flow in practice

1. **Seed** → `POST /demo/seed` (or manually load orders/inventory)
2. **Run** → `POST /allocations/run` with optional filters
3. **Browse** → `GET /allocations?status=unallocated` to see what didn't get stock
4. **Tweak** → Change a template's dimensions, adjust supply config, re-run
5. **Compare** → Run with `dryRun: true` to simulate without overwriting results

Here's what the backend should be doing for each endpoint — focusing on the business logic the allocation engine needs, not just CRUD storage:
---
Expected Backend Business Logic per Endpoint
Demand Types (/demand-types)
CRUD is fine as-is. Key linkage: Each demand type has an allocationTemplate field that references an allocation template by name/id. When POST /allocations/run runs, the engine should:
- Look up each order's channel/orderType to find the matching DemandType
- Use that demand type's allocationTemplate to determine which prioritization rules apply to that order
Supply Config (/supply/config)
- GET /supply/config — returns the active preset + ordered source sequence. Fine as-is.
- PUT /supply/config/preset — should store the preset AND change the behavior of the allocation engine:
  - conservative: allocate from cheapest/nearest source first, hold back safety stock
  - fast: allocate from fastest-to-ship source first, ignore safety stock
  - balanced: blend of cost and speed
- Supply sequence — the priority order should be respected during allocation: try source #1 first, if insufficient, fall through to source #2, etc.
Allocation Templates (/allocation-templates)
These define the prioritization rules for how orders are ranked within a channel. The engine should:
- Use dimensions (e.g. customer tier, order value, order date) to sort/rank orders within each demand type group
- dimensions[].level defines the ranking value (e.g. "VIP", "Standard")
- clearanceLogic: if true, apply clearance rules:
  - clearanceMode: 'in-season' — allocate in-season stock before clearance
  - clearanceMode: 'drop-out' — drop low-priority orders entirely when supply is constrained instead of partial-filling them
POST /allocations/run (the core engine)
This is where all config comes together. Expected flow:
1. Gather orders — all pending orders (optionally filtered by skus and channels from the request)
2. Match demand types — for each order, find its DemandType by channel/orderType, which gives the allocation template to use
3. Rank orders — within each template group, sort orders by the template's dimensions (e.g. tier first, then order value, then date)
4. Get supply — load available inventory per SKU from supply sources, ordered by the supply sequence priority. If supplyOverrides is provided, use those quantities instead
5. Apply strategy preset — adjust allocation behavior based on conservative/fast/balanced
6. Allocate — walk through ranked orders, consuming supply from sources in priority order:
   - Full fill → status: 'allocated'
   - Partial fill → status: 'partial', with reason explaining shortfall
   - No fill → status: 'unallocated', with reason
   - If clearanceLogic is on with drop-out mode, skip low-priority orders entirely instead of partial-filling
7. Record source — each result should note which source the inventory came from
8. Persist or not — if dryRun: true, return results without saving; if false, persist to the allocations store
9. Return summary stats (fill rate, counts) + full results array
GET /allocations
- Should return previously persisted allocation results (from non-dry-run runs)
- Filter by ?status= and ?channel= query params
POST /demo/seed
- Should create sample demand types, supply sources with realistic inventory quantities, allocation templates with dimensions, and sample orders — enough to demonstrate a meaningful allocation run
---
What's likely missing today: The backend stores config but POST /allocations/run probably has a simplified/hardcoded allocation algorithm that doesn't actually read demand types → templates → dimensions → supply sequence. It likely just does a basic priority sort and flat inventory deduction.


Also see this note: so basically - yes, my frontend was a bit too eager and implemented a rather complex engine. But actually, I feel that we can get by with just implementing the suggestion from above, and fix the issue that the override param for inventory stock is not taken into account when simulating

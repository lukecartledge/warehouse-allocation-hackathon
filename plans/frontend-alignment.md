# Frontend Alignment Plan

## Context
The frontend was built expecting richer engine behaviour than the backend currently provides.
This plan closes the gaps identified in `plans/missing.md` plus a D2C > B2B prioritisation ask.

## Tasks

### T1: Explicit priority field on DemandType
- Add `priority: number` column to `DemandTypeEntity` (default 0)
- Add `priority` to `CreateDemandTypeDto` with `@ApiProperty`
- Add `priority` to `DemandType` interface in `types.ts`
- Update `findAll()` to sort by `priority ASC` instead of `id ASC`
- Update engine's `buildDemandTypePriorityLookup` to use `demandType.priority` instead of array index
- Update seed: D2C (priority 1) > Retail (2) > Wholesale (3) > Marketplace (4)

### T2: Clearance drop-out mode (G1)
In `allocation-engine.service.ts`, during the allocation loop:
- Look up the template for each order's demand type
- If `template.clearanceLogic === true && template.clearanceMode === 'drop-out'`:
  - If order can't be fully filled → set `allocatedQty = 0`, `status = 'unallocated'`
  - Reason: "Dropped: clearance drop-out mode, insufficient supply"

### T3: Strategy preset behaviour (G2)
Pass the active preset into the engine. Modify allocation:
- `conservative`: reduce effective ATS by 20% (safety stock hold-back)
- `fast`: no safety stock, prefer orders with earliest `requestedDeliveryDate`
- `balanced`: current behaviour (no modification)

### T4: Multi-source supply fallthrough (G3)
- Pass full supply source sequence into engine (not just source[0].name)
- For each order, walk through sources in priority order
- Deduct from source #1 first; if insufficient, try source #2, etc.
- Record which source filled each allocation in the `source` field
- If split across sources, record first source name

### T5: Supply overrides investigation (G4)
- Verify the override key format matches what FE sends
- Current: keyed by `skuId` — check if FE sends same key
- Ensure overrides work correctly in dry-run mode

### T6: Seed data update
- Reorder demand type priorities: D2C=1, Retail=2, Wholesale=3, Marketplace=4
- Add multi-source inventory pools (on-hand + transfer) for richer demo

### T7: Swagger docs
- Add descriptions for new `priority` field on DemandType
- Document strategy preset effects in controller descriptions
- Document clearance mode behaviour
- Document supply override format

### T8: Integration tests
- Test D2C orders prioritised over Wholesale for same SKU
- Test drop-out mode skips partial fills
- Test conservative preset reduces allocation
- Test multi-source fallthrough

### T9: Build + verify + commit + push

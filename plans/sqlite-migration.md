# Plan: Migrate from In-Memory to SQLite

High-level approach: Replace the in-memory `Map`/array stores in each NestJS service with SQLite tables via TypeORM (or Drizzle/better-sqlite3). Since every service already has clean CRUD interfaces, the change is isolated to service internals — controllers and the engine don't need to change.

## Effort Estimate

**~2-3 hours for one person.** Low risk — the service interfaces are already clean, so it's a swap-the-guts refactor.

| Area | Effort | Risk |
|------|--------|------|
| DB setup + schema | 30 min | Low |
| DemandTypeService migration | 20 min | Low |
| SupplyService migration | 30 min | Low (two tables) |
| AllocationTemplateService migration | 30 min | Medium (nested dimensions JSON) |
| AllocationService migration | 30 min | Medium (orders + inventory + results) |
| Seeding logic | 15 min | Low |
| Test updates | 20 min | Low |

## Scope

**In:**
- SQLite file-based database (`data/allocation.db`)
- TypeORM entities for all domain objects
- Auto-sync schema (no manual migrations for MVP)
- Seed data on first boot (same defaults as current)

**Out:**
- Full migration framework (overkill for hackathon)
- Connection pooling / production hardening
- Changing any controller routes or response shapes

## Action Items

- [ ] Install dependencies: `@nestjs/typeorm typeorm better-sqlite3`
- [ ] Create TypeORM entities for each domain object:
  - `DemandTypeEntity` — straightforward 1:1 mapping
  - `SupplySourceEntity` — straightforward 1:1 mapping
  - `SupplyConfigEntity` — single-row table (activePreset + FK to sources via join)
  - `AllocationTemplateEntity` — store `dimensions` as JSON column (simplest for MVP), clearanceLogic, clearanceMode
  - `OrderEntity` — maps OrderDto fields
  - `InventoryPoolEntity` — maps InventoryPoolDto fields
  - `AllocationResultEntity` — maps AllocationResultDto fields, plus `runId` for grouping
- [ ] Configure TypeORM in `AppModule` with SQLite driver:
  ```typescript
  TypeOrmModule.forRoot({
    type: 'better-sqlite3',
    database: 'data/allocation.db',
    entities: [/* all entities */],
    synchronize: true, // MVP only — auto-create tables
  })
  ```
- [ ] Add `data/` to `.gitignore`
- [ ] Refactor `DemandTypeService` — inject `Repository<DemandTypeEntity>`, replace `Map` with TypeORM calls. Keep the same public API (`findAll`, `findById`, `create`, `update`, `remove`).
- [ ] Refactor `SupplyService` — inject repositories for SupplySource + SupplyConfig. The `getSequenceForPreset()` logic stays the same, just reads from DB.
- [ ] Refactor `AllocationTemplateService` — inject repository. `dimensions` stored as JSON column, parsed on read.
- [ ] Refactor `AllocationService` — inject repositories for Order, InventoryPool, AllocationResult. `seedDemo()` writes to DB instead of arrays. `queryResults()` becomes a TypeORM `find()` with `where` clauses.
- [ ] Add seed-on-boot logic: check if DemandType table is empty on module init → insert defaults. Same for SupplySource and AllocationTemplate.
- [ ] Verify all 7 integration tests still pass
- [ ] Verify `npx tsc --noEmit` clean
- [ ] Swagger documentation pass — add full `description` and `example` values to every `@ApiProperty` on all TypeORM entities/DTOs, add `@ApiPropertyOptional` where fields are nullable, add `description` to all `@ApiOperation` decorators explaining what each endpoint does and what side-effects it has, add `@ApiResponse` descriptions for error cases (400, 404, 409). Goal: a new developer can understand the entire API from Swagger UI alone without reading source code.

## Key Decisions

### TypeORM vs Drizzle vs raw better-sqlite3

| Option | Pros | Cons |
|--------|------|------|
| **TypeORM** (recommended) | NestJS first-class support (`@nestjs/typeorm`), decorators match NestJS style, auto-sync schema | Heavier, more boilerplate |
| **Drizzle** | Lighter, type-safe queries | No official NestJS module, more manual wiring |
| **Raw better-sqlite3** | Zero overhead, full control | Manual SQL, no entity mapping, more code |

**Recommendation: TypeORM** — least friction with NestJS, `synchronize: true` means zero migration files for MVP.

### Dimensions storage

AllocationTemplate has a `dimensions: RankingDimension[]` field. Two options:
1. **JSON column** (recommended for MVP) — store as `TEXT`, parse on read. Simple, no join tables.
2. **Separate table** with FK — normalized, but adds complexity for no MVP benefit.

### Supply config as single-row

SupplyConfig is a singleton (one active config). Store as a single-row table with:
- `id: 1` (always)
- `activePreset: string`
- Sequence derived at runtime from `SupplySource` table + preset logic (same as current)

This avoids a many-to-many join table for the sequence.

## Open Questions

- Should the DB file be committed (checked-in seed data) or gitignored (recreated on boot)?
- Do we want to persist allocation run history (multiple runs) or just the latest like today?

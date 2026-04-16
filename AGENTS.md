## Project

Inventory Allocation Engine — hackathon MVP. NestJS backend API serving a React frontend built by a colleague.

## Tech stack

- NestJS (TypeScript, strict mode)
- TypeORM + SQLite (better-sqlite3)
- class-validator, class-transformer
- @nestjs/swagger (Swagger UI at `/api`)

## Module resolution

`tsconfig.json` uses `module: "nodenext"` and `moduleResolution: "nodenext"`. **All relative imports must use `.js` extensions** (e.g. `import { Foo } from './foo.js'`).

## Build & run

```bash
# Build (required — ts-node doesn't work with nodenext .js imports)
npx nest build

# Run
node dist/src/main.js

# Tests
npx jest --config jest.config.ts --forceExit

# Seed demo data (after server is running)
curl -X POST http://localhost:3000/demo/seed
```

## API contract

The frontend is built against `plans/api.ts`. All endpoints must match that contract. When in doubt, the contract is canonical.

## Key conventions

- Entities live in `src/<module>/entities/`
- DTOs live in `src/<module>/types/` (not `dto/` — exception: `demand-type/dto/`)
- Every DTO property must have `@ApiProperty()` with a meaningful `description`
- JSON columns in SQLite use `type: 'simple-json'` in TypeORM entities
- Enums are TypeScript string enums but stored as plain strings in SQLite — cast on read
- No `as any`, `@ts-ignore`, or `@ts-expect-error`

## Database

SQLite file at `data/allocation.db`. TypeORM `synchronize: true` for dev — no migrations.

To reset: delete `data/allocation.db` and restart, then re-seed.

## Allocation engine behaviour

- Demand types are processed in `priority` order (1 = highest, D2C first)
- Strategy presets: `conservative` = 20% ATS holdback, `fast` = earliest delivery sort, `balanced` = no-op
- Clearance mode `drop-out`: orders that can't be fully filled get allocatedQty=0
- Multi-source: walks inventory sources in priority order, records primary source
- Supply overrides key by `skuId` and apply per-pool

## Plans & docs

- `plans/allocation-mvp.md` — original implementation plan
- `plans/api.ts` — canonical frontend API contract
- `plans/api-endpoints.md` — endpoint documentation
- `plans/frontend-alignment.md` — frontend alignment task list
- `plans/missing.md` — gap analysis from frontend review

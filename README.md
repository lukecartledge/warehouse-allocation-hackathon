# Warehouse Allocation Engine — Hackathon MVP

A NestJS backend that runs a configurable warehouse allocation algorithm. Given a set of orders, inventory pools, demand-type rules, and supply-source priorities, the engine assigns stock to orders and returns per-order allocation results with a summary of fill rates. All state is held in-memory — no database required.

---

## Quick Start

```bash
npm install
npm run start:dev
```

Open the interactive Swagger UI at **http://localhost:3000/api**

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/demo/seed` | Seed demo data and run allocation in one shot |
| `POST` | `/allocations/run` | Run the allocation engine (body: `AllocateRequest`) |
| `GET` | `/allocations` | Get results from the last run (optional `?status=` / `?channel=` filters) |
| `GET` | `/demand-types` | List all demand types |
| `POST` | `/demand-types` | Create a demand type |
| `PUT` | `/demand-types/:id` | Update a demand type |
| `DELETE` | `/demand-types/:id` | Delete a demand type |
| `GET` | `/allocation-templates` | List all allocation templates |
| `POST` | `/allocation-templates` | Create an allocation template |
| `PUT` | `/allocation-templates/:id` | Update an allocation template |
| `DELETE` | `/allocation-templates/:id` | Delete an allocation template |
| `GET` | `/supply/config` | Get current supply configuration |
| `PUT` | `/supply/config/preset` | Set strategy preset (`conservative` / `fast` / `balanced`) |
| `PUT` | `/supply/config/sequence` | Set custom supply source priority sequence |
| `POST` | `/supply/sources` | Add a new supply source |
| `PUT` | `/supply/sources/:id` | Update a supply source |
| `DELETE` | `/supply/sources/:id` | Delete a supply source |

---

## Demo Instructions

1. **Seed demo data** — sends a single request that populates orders, inventory, demand types, templates, and supply sources, then runs the allocation engine:

   ```bash
   curl -X POST http://localhost:3000/demo/seed
   ```

2. **View results** — inspect the allocation outcome:

   ```bash
   curl http://localhost:3000/allocations
   # Filter to unallocated orders only:
   curl "http://localhost:3000/allocations?status=unallocated"
   ```

3. **Re-run with a different strategy** — switch to the "fast" preset and re-run:

   ```bash
   curl -X PUT http://localhost:3000/supply/config/preset \
     -H 'Content-Type: application/json' \
     -d '{"preset":"fast"}'

   curl -X POST http://localhost:3000/allocations/run \
     -H 'Content-Type: application/json' \
     -d '{}'
   ```

---

## ngrok Setup (share with frontend team)

Run ngrok to expose the local server over a public URL:

```bash
ngrok http 3000
```

Copy the `https://xxxx.ngrok-free.app` URL and share it with the frontend team. They should set it as the API base URL in their environment config. The Swagger UI will be available at `<ngrok-url>/api`.

---

## Tech Stack

- **NestJS** — opinionated Node.js framework with dependency injection
- **TypeScript** — strict mode, `module: nodenext`
- **@nestjs/swagger** — OpenAPI 3 documentation auto-generated from decorators
- **class-validator / class-transformer** — request body validation
- **In-memory stores** — no database; all state resets on server restart

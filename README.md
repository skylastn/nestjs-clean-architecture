# NestJS Clean Architecture API

Backend API built with NestJS, organized by feature and Clean Architecture layers. Bun manages packages (`bun.lock`); TypeORM manages persistence and migrations.

## Architecture

```text
src/
├── main.ts                         # Bootstrap, global interceptors/filters, HTTP listener
├── shared/
│   ├── module/                     # App, database and shared modules
│   ├── connection/                 # Database configuration
│   ├── interceptor/                # Success/error and transaction handling
│   ├── constant/                   # Shared constants
│   └── ...                         # Cross-cutting infrastructure
├── feature/
│   ├── auth/
│   │   ├── domain/                 # Entities, models, repository contracts
│   │   ├── application/            # Authentication and user use cases
│   │   ├── infrastructure/         # Repository/persistence adapters
│   │   └── presentation/           # Controllers, modules, guards, middleware
│   └── support/
│       ├── domain/                 # Support response models
│       ├── application/            # Redis, MinIO and brute-force services
│       └── presentation/           # Support controllers and modules
└── core/
    ├── data_source.ts              # TypeORM CLI data source
    ├── migrations/                 # Database migrations
    └── seeder/                     # Seed entry point
```

### Dependency direction

`presentation → application → domain`; `infrastructure` implements domain contracts and adapts external systems (database, Redis, MinIO). Domain models/contracts should not depend on NestJS, TypeORM, or transport concerns. `shared` contains cross-cutting concerns used by features.

### Feature request flow

HTTP controller/guard → application service (use case) → domain contract → infrastructure adapter → external service/database. Responses pass through shared interceptors and exception filters.

## Features

- Authentication and user endpoints under `/api/auth` and `/api/user`.
- User persistence through TypeORM and MySQL.
- Redis-backed brute-force protection.
- MinIO object storage and presigned upload/view URLs.
- Global response, error and transaction handling.

## Requirements

- Bun 1.4.2
- Node.js runtime supported by Nest CLI (Node 24.15+ or supported current LTS)
- MySQL, Redis and MinIO for full application runtime

## Setup

```sh
bun install --frozen-lockfile
cp .env.example .env
# Edit .env with local credentials and service URLs.
bun run start:dev
```

The API listens on port `3000` by default; set `PORT` to override. Never commit `.env` or real credentials.

## Commands

```sh
bun run build
bun run start:dev
bun run start:prod
bun run test
bun run migrate
bun run migrate:revert
bun run seed
```

Migration helpers:

```sh
make migration name=user_table
make migrate
make migrate-revert
```

## Database migrations

Create migration with `make migration name=<name>`. Run with `make migrate`; revert the latest with `make migrate-revert`. The TypeORM CLI data source is `src/core/data_source.ts`.

## Docker

```sh
docker compose build
docker compose up -d
```

The Compose service runs migrations and seeding before the production server. Configure `.env` and the host services first. Uploaded files persist through the `public` volume.

## Tests

```sh
bun run test
```

Tests currently include a lightweight source-layout smoke check. It does not connect to MySQL, Redis, or MinIO.

## Layer ownership

- **Domain**: business entities, value/model types, repository contracts; framework-independent.
- **Application**: use cases and orchestration; depends on domain abstractions.
- **Infrastructure**: database and external-service adapters; implements domain contracts.
- **Presentation**: HTTP controllers, guards, middleware, and Nest modules.
- **Shared/Core**: cross-cutting modules/configuration and application bootstrap/migration tooling.

Keep business rules out of controllers and persistence details out of domain/application logic.

## Security

Replace all example secrets before deployment. Use strong JWT, database and MinIO credentials; restrict network access to backing services. Never commit `.env`.

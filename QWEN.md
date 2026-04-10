# EstacionCafé Backend - QWEN Context

## Project Overview

**EstacionCafé API** is a full REST API for café/coffee shop management built with **TypeScript**, **Express.js (v5)**, and **SQLite** using **TypeORM**. The project follows **Clean Architecture** principles with manual dependency injection.

### Key Technologies
- **Runtime**: Node.js 18+
- **Language**: TypeScript 5.9 (strict mode)
- **Framework**: Express.js 5.1
- **Database**: SQLite with TypeORM 0.3
- **Validation**: Zod 4
- **Testing**: Jest 30 with ts-jest
- **Auth**: JWT (jsonwebtoken) + bcrypt
- **API Docs**: Swagger UI Express
- **Containerization**: Docker

## Architecture

The project follows Clean Architecture with clear layer separation:

```
EstacionCafe-Backend/
├── core/                          # Domain layer
│   ├── entities/                  # TypeORM entities (Bill, Product, User, etc.)
│   ├── enums/                     # System enumerations
│   ├── interfaces/                # Service interfaces (IService, ITokenService, IUserService)
│   └── dependencyInjection.ts     # Manual DI configuration
├── application/                   # Application layer
│   ├── services/                  # Business logic services
│   ├── DTOs/                      # Data Transfer Objects
│   ├── validations/               # Zod validation schemas
│   └── Routes/                    # Express route definitions
├── controller/                    # Presentation layer
│   ├── __tests__/                 # Controller unit tests
│   └── *Controller.ts             # Express controllers
├── infrastructure/                # Infrastructure layer
│   ├── db/                        # DB connection, migrations, seeders, loadEnv
│   ├── jobs/                      # Scheduled cron jobs
│   ├── security/                  # Auth middleware, TokenService
│   └── swagger/                   # Swagger documentation setup
├── main.ts                        # Application entry point
├── tsconfig.json                  # TypeScript configuration
├── jest.config.js                 # Jest test configuration
└── Dockerfile                     # Docker multi-stage build
```

### Dependency Injection Pattern

The project uses **manual dependency injection** — controllers expose a `setService` method that is called from `core/dependencyInjection.ts` during startup. Services receive repositories via constructor.

```typescript
// Controller exports setService
export const setService = (service: IService) => { ... };

// DI container wires it up
setProductService(new ProductService(productRepository));
```

## Build & Run Commands

### Development
```bash
npm install           # Install dependencies
npm run build         # Compile TypeScript (tsc) → src/compiled/
npm start             # Dev mode with nodemon (auto-reload)
npm run start:prod    # Production mode (node directly)
```

### Testing
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
npm run test:verbose  # Verbose output
```

### Database Migrations
```bash
npm run migration:run       # Execute pending migrations
npm run migration:show      # Show migration status
npm run migration:revert    # Revert last migration
npm run migration:generate  # Generate new migration
```

### Seeders
```bash
npm run seed:run      # Populate database with seed data
npm run seed:revert   # Clear seed data
```

### Docker
```bash
docker build -t estacioncafe-api .
docker run -p 3484:3484 estacioncafe-api
```

## API Details

- **Base URL**: `http://localhost:3484/api`
- **Swagger Docs**: `http://localhost:3484/api/docs`
- **Default Port**: `3484` (configurable via `PORT` env var)
- **CORS**: Configurable via `CORS_ORIGIN` env var (comma-separated origins)

### Main Resources
| Resource | Endpoint |
|---|---|
| Products | `/products`, `/products/active` |
| Bills | `/bills`, `/bills/customer/:customer`, `/bills/date-range` |
| Users | `/users`, `/users/type/:typeId` |
| Suppliers | `/suppliers`, `/suppliers/active` |
| Consumables | `/consumable` |
| Consumable Types | `/consumable-type` |
| Ingredients | `/ingredient` |
| Purchases | `/purchases` |
| Cash Registers | `/cash-registers` |
| User Types | `/user-types` |
| Bill Details | `/bill-details` |
| Tables | `/tables` |
| Product Types | `/product-types` |

> **Note**: `DELETE` endpoints require a Bearer token.

## Environment Variables

Key environment variables (see `.env.example`):

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 3484) |
| `CORS_ORIGIN` | Allowed CORS origins (comma-separated) |
| `DB_SQLITE_PATH` | Path to SQLite database file |
| `DB_SYNCHRONIZE` | Auto-sync schema (`false` in production) |
| `DB_LOGGING` | TypeORM query logging |

## Development Conventions

- **Strict TypeScript**: `strict: true` in tsconfig; no implicit any, strict null checks enabled
- **Zod Validation**: All request data validated with Zod schemas (includes custom transforms)
- **Consistent Error Responses**: Standardized error format `{ status, message, campo, error }`
- **Testing**: Unit tests for controllers using mocked services; tests colocated in `__tests__` directories
- **Decorators**: Uses `experimentalDecorators` and `emitDecoratorMetadata` for TypeORM
- **Module System**: CommonJS (`"module": "commonjs"`)
- **Output Dir**: Compiled JS goes to `./src/compiled/`
- **Excluded from compilation**: `node_modules`, `**/*.test.ts`, `**/__tests__/**`

## Entity Relationships

Key entities in the domain:
- **Bill** ↔ **BillDetails** (one-to-many)
- **Product** ↔ **Ingredient** (many-to-many via join)
- **Product** ↔ **ProductType** (many-to-one)
- **User** ↔ **UserType** (many-to-one)
- **Consumable** ↔ **ConsumableType** (many-to-one)
- **Purchase** ↔ **Supplier** (many-to-one)
- **Purchase** ↔ **Consumable** (many-to-many)
- **Table** (standalone)
- **CashRegister** (standalone)

## Security

- Passwords hashed with **bcrypt**
- JWT-based authentication via **TokenService**
- Auth middleware protects `DELETE` routes
- Cookie parser enabled for cookie-based auth if needed

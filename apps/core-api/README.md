# Core API - Booking SaaS

NestJS-based backend API for the multi-service booking platform.

## Features

- **Authentication**: JWT + API Key guards
- **Multi-tenant**: Tenant isolation at database level
- **Availability Engine**: Smart slot calculation for single and multi-service bookings
- **Booking Management**: Full CRUD with conflict detection
- **Audit Logging**: Track all system changes
- **Calendar Integration**: iCal feeds for bookings
- **Webhooks**: Event-driven notifications (stub)
- **Push Notifications**: Web Push support (stub)

## Tech Stack

- **NestJS 10**: Progressive Node.js framework
- **Prisma ORM**: Type-safe database access
- **PostgreSQL**: Primary database
- **Redis**: Caching and sessions
- **JWT**: Secure authentication
- **Swagger/OpenAPI**: Auto-generated API docs

## Project Structure

```
apps/core-api/
├── src/
│   ├── auth/              # JWT + API Key authentication
│   ├── availability/      # Slot calculation engine
│   ├── bookings/          # Booking CRUD + conflict detection
│   ├── customers/         # Customer management
│   ├── services/          # Service definitions
│   ├── venues/            # Venue management
│   ├── resources/         # Resource allocation
│   ├── forms/             # Dynamic form schemas
│   ├── config/            # Widget configuration endpoint
│   ├── calendar/          # iCal feed generation
│   ├── push/              # Push notification handlers
│   ├── webhooks/          # Webhook dispatchers
│   ├── audit/             # Audit log service
│   ├── prisma/            # Prisma service + module
│   ├── app.module.ts      # Root module
│   └── main.ts            # Application entry point
├── prisma/
│   ├── schema.prisma      # Database schema (12 models)
│   ├── migrations/        # Database migrations
│   └── seed.ts            # Demo data seeder
├── .env.sample            # Environment variables template
├── Dockerfile             # Production container
└── package.json           # Dependencies and scripts
```

## Database Schema

12 Prisma models with full multi-tenant support:

- **Tenant**: Organization/account
- **User**: Staff users (OWNER, MANAGER, STAFF)
- **Service**: Bookable services (duration, capacity, price)
- **Venue**: Physical locations
- **Resource**: Tables, rooms, equipment, staff
- **Form**: Dynamic JSON Schema forms
- **Booking**: Reservations with status workflow
- **BookingService**: Junction table (many-to-many)
- **BookingResource**: Junction table (many-to-many)
- **Customer**: Guest information (GDPR-compliant)
- **Policy**: Business rules (cancellation, booking windows)
- **AuditLog**: Change tracking
- **PushSubscription**: Web Push endpoints

## Setup Instructions

### Prerequisites

```bash
# Required
- Node.js 20+
- pnpm 8+
- PostgreSQL 15+
- Redis 7+

# Optional
- Docker (for local development)
```

### 1. Install Dependencies

```bash
cd apps/core-api
pnpm install
```

### 2. Setup Database

```bash
# Start PostgreSQL and Redis (Docker)
docker run --name booking-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:15-alpine

docker run --name booking-redis \
  -p 6379:6379 \
  -d redis:7-alpine
```

### 3. Configure Environment

```bash
cp .env.sample .env
# Edit .env with your settings
```

### 4. Generate Prisma Client

```bash
pnpm prisma:generate
```

### 5. Run Migrations

```bash
pnpm prisma:migrate
```

### 6. Seed Demo Data

```bash
pnpm prisma:seed
```

This creates:

- Demo tenant: `demo.booking-saas.local`
- Admin user: `admin@demo.local` / `password123`
- 2 services: Dinner Service (120min), Lunch Service (60min)
- 1 venue: Main Dining Room
- 1 form: Restaurant Booking Form

### 7. Start Development Server

```bash
pnpm dev
```

Server runs on `http://localhost:3000`

## API Documentation

Once running, visit:

- **Swagger UI**: `http://localhost:3000/docs`
- **Health Check**: `http://localhost:3000/health` (TODO)

## Key Endpoints

### Public (API Key Required)

- `POST /v1/availability` - Check available slots
- `POST /v1/bookings` - Create booking
- `GET /v1/config` - Get widget configuration
- `GET /v1/cal/venue/:id.ics` - iCal feed

### Protected (JWT Required)

- `POST /v1/auth/login` - Login
- `GET /v1/bookings/:id` - Get booking
- `PATCH /v1/bookings/:id/status` - Update status

## Authentication

### JWT (Internal/Admin)

```bash
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demo.local","password":"password123"}'
```

Returns:

```json
{
  "access_token": "eyJhbGc...",
  "user": {
    "id": "...",
    "email": "admin@demo.local",
    "role": "OWNER",
    "tenant": {
      "id": "...",
      "name": "Demo Restaurant"
    }
  }
}
```

Use token in subsequent requests:

```bash
curl http://localhost:3000/v1/bookings/123 \
  -H "Authorization: Bearer eyJhbGc..."
```

### API Key (Widget/External)

```bash
curl http://localhost:3000/v1/config \
  -H "x-api-key: demo-widget-key-123" \
  -H "x-tenant-id: <tenant-id>"
```

## Scripts

```bash
# Development
pnpm dev              # Start with hot-reload
pnpm build            # Build for production
pnpm start            # Run production build

# Database
pnpm prisma:generate  # Generate Prisma client
pnpm prisma:migrate   # Run migrations
pnpm prisma:seed      # Seed demo data

# Testing
pnpm test             # Run unit tests
pnpm test:watch       # Watch mode
pnpm test:cov         # Coverage report

# Code Quality
pnpm lint             # ESLint
pnpm typecheck        # TypeScript check
```

## Docker

```bash
# Build image
docker build -t booking-saas-api .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e REDIS_HOST="redis" \
  -e JWT_SECRET="..." \
  booking-saas-api
```

## Availability Engine

The availability engine supports both **classic** (single service) and **multi-service** bookings.

### Example Request

```json
POST /v1/availability
{
  "date": "2025-01-15",
  "timeRange": { "start": "12:00", "end": "22:00" },
  "serviceIds": ["service-1-id", "service-2-id"],
  "venueId": "venue-id",
  "partySize": 4
}
```

### Response

```json
{
  "slots": [
    {
      "start": "2025-01-15T12:00:00Z",
      "end": "2025-01-15T15:00:00Z",
      "status": "free"
    },
    {
      "start": "2025-01-15T12:30:00Z",
      "end": "2025-01-15T15:30:00Z",
      "status": "full",
      "reason": "Slot already booked"
    }
  ]
}
```

## Next Steps

After completing this phase, proceed to:

- **FASE-04**: Widget development (embeddable web component)
- **FASE-05**: PWA admin panel
- **FASE-06**: Deployment and monitoring

## Troubleshooting

### Prisma Generation Fails

If you encounter network issues with Prisma:

```bash
# Skip checksum validation (offline environments)
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 pnpm prisma:generate
```

### Port Already in Use

```bash
# Change port in .env
PORT=3001
```

### Database Connection Issues

```bash
# Verify PostgreSQL is running
docker ps | grep postgres

# Check connection string in .env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/booking_saas?schema=public"
```

## License

Private - Part of Booking SaaS Monorepo

# LifeOS API Architecture Documentation

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Principles](#architecture-principles)
3. [Tech Stack](#tech-stack)
4. [Folder Structure](#folder-structure)
5. [API Endpoints](#api-endpoints)
6. [Authentication & Authorization](#authentication--authorization)
7. [Data Flow](#data-flow)
8. [Error Handling](#error-handling)
9. [Testing Strategy](#testing-strategy)
10. [Deployment](#deployment)

---

## System Overview

LifeOS is a Smart Life Decision Operating System that helps users track decisions, analyze long-term outcomes, and receive AI-assisted guidance for future choices.

### Key Components

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Mobile     │  │     Web      │  │   Desktop    │   │
│  │     App      │  │     App      │  │     App      │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│              API GATEWAY (Express.js)                   │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Rate Limiting | CORS | Request Validation         │ │
│  │  Authentication | Logging | Error Handling         │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                   CORE SERVICES                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │     Auth     │  │   Decision   │  │   Outcome    │   │
│  │   Service    │  │   Service    │  │   Service    │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  Analytics   │  │      AI      │  │Notification  │   │
│  │   Service    │  │   Service    │  │   Service    │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│              BACKGROUND WORKERS                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  Reminder    │  │  Analytics   │  │   Insight    │   │
│  │   Worker     │  │   Worker     │  │   Worker     │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                  DATA LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  PostgreSQL  │  │     Redis    │  │   OpenAI     │   │
│  │  + pgvector  │  │   (Cache)    │  │     API      │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## Architecture Principles

### 1. **Separation of Concerns**

- Clear separation between routes, controllers, services, and data access layers
- Each module has a single, well-defined responsibility

### 2. **Scalability**

- Horizontal scaling through stateless API design
- Background jobs handled by worker processes
- Caching strategy with Redis

### 3. **Security First**

- JWT-based authentication
- Role-based access control (RBAC)
- Input validation at all entry points
- SQL injection prevention through parameterized queries

### 4. **Observability**

- Structured logging with Winston
- Request tracing
- Performance monitoring
- Error tracking with Sentry (optional)

### 5. **Maintainability**

- TypeScript for type safety
- Consistent code style with ESLint/Prettier
- Comprehensive test coverage
- Clear documentation

---

## Tech Stack

### Core

- **Runtime**: Node.js 20+
- **Language**: TypeScript 5+
- **Framework**: Express.js 4.x
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL 15+ with pgvector extension
- **Cache**: Redis 7+

### Validation & Security

- **Validation**: Zod
- **Authentication**: JWT (jsonwebtoken)
- **Encryption**: bcrypt, crypto
- **Rate Limiting**: express-rate-limit

### Background Jobs

- **Queue**: BullMQ
- **Scheduler**: node-cron

### AI/ML

- **LLM**: OpenAI API (GPT-4, text-embedding-ada-002)
- **Vector Search**: pgvector

### Monitoring & Logging

- **Logging**: Winston
- **Monitoring**: Prometheus (optional)
- **Error Tracking**: Sentry (optional)

### Development Tools

- **Testing**: Jest, Supertest
- **Linting**: ESLint
- **Formatting**: Prettier
- **Documentation**: TypeDoc, Swagger/OpenAPI

---

## Folder Structure

```
lifeos-api/
├── src/
│   ├── config/                    # Configuration files
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   ├── jwt.ts
│   │   ├── openai.ts
│   │   └── index.ts
│   │
│   ├── database/                  # Database layer
│   │   ├── schema/               # Drizzle schema (provided)
│   │   │   └── index.ts
│   │   ├── migrations/           # Database migrations
│   │   └── connection.ts         # DB connection setup
│   │
│   ├── modules/                   # Feature modules
│   │   ├── auth/
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.validation.ts
│   │   │   └── auth.types.ts
│   │   │
│   │   ├── decisions/
│   │   │   ├── decisions.routes.ts
│   │   │   ├── decisions.controller.ts
│   │   │   ├── decisions.service.ts
│   │   │   ├── decisions.validation.ts
│   │   │   └── decisions.types.ts
│   │   │
│   │   ├── outcomes/
│   │   │   ├── outcomes.routes.ts
│   │   │   ├── outcomes.controller.ts
│   │   │   ├── outcomes.service.ts
│   │   │   ├── outcomes.validation.ts
│   │   │   └── outcomes.types.ts
│   │   │
│   │   ├── analytics/
│   │   │   ├── analytics.routes.ts
│   │   │   ├── analytics.controller.ts
│   │   │   ├── analytics.service.ts
│   │   │   └── analytics.types.ts
│   │   │
│   │   ├── ai/
│   │   │   ├── ai.routes.ts
│   │   │   ├── ai.controller.ts
│   │   │   ├── ai.service.ts
│   │   │   ├── ai.validation.ts
│   │   │   ├── embeddings.service.ts
│   │   │   └── ai.types.ts
│   │   │
│   │   ├── notifications/
│   │   │   ├── notifications.routes.ts
│   │   │   ├── notifications.controller.ts
│   │   │   ├── notifications.service.ts
│   │   │   └── notifications.types.ts
│   │   │
│   │   └── subscriptions/
│   │       ├── subscriptions.routes.ts
│   │       ├── subscriptions.controller.ts
│   │       ├── subscriptions.service.ts
│   │       └── subscriptions.types.ts
│   │
│   ├── workers/                   # Background job workers
│   │   ├── reminder.worker.ts
│   │   ├── analytics.worker.ts
│   │   ├── insight.worker.ts
│   │   └── index.ts
│   │
│   ├── middleware/                # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── validate.middleware.ts
│   │   ├── rateLimiter.middleware.ts
│   │   └── logger.middleware.ts
│   │
│   ├── utils/                     # Utility functions
│   │   ├── logger.ts
│   │   ├── errors.ts
│   │   ├── response.ts
│   │   ├── crypto.ts
│   │   ├── jwt.ts
│   │   └── asyncHandler.ts
│   │
│   ├── types/                     # Shared TypeScript types
│   │   ├── express.d.ts
│   │   ├── common.types.ts
│   │   └── api.types.ts
│   │
│   ├── constants/                 # Application constants
│   │   ├── errors.ts
│   │   ├── messages.ts
│   │   └── index.ts
│   │
│   ├── app.ts                     # Express app setup
│   ├── server.ts                  # Server entry point
│   └── routes.ts                  # Root router
│
├── tests/                         # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── scripts/                       # Utility scripts
│   ├── seed.ts
│   ├── migrate.ts
│   └── generate-types.ts
│
├── docs/                          # Documentation
│   ├── api/
│   └── architecture/
│
├── .env.example
├── .eslintrc.js
├── .prettierrc
├── tsconfig.json
├── package.json
├── drizzle.config.ts
└── README.md
```

---

## API Endpoints

### Authentication

```
POST   /api/v1/auth/register           - Register new user
POST   /api/v1/auth/login              - Login user
POST   /api/v1/auth/logout             - Logout user
POST   /api/v1/auth/refresh            - Refresh access token
POST   /api/v1/auth/forgot-password    - Request password reset
POST   /api/v1/auth/reset-password     - Reset password
POST   /api/v1/auth/verify-email       - Verify email address
GET    /api/v1/auth/me                 - Get current user
```

### Users & Profiles

```
GET    /api/v1/users/:id               - Get user by ID
PUT    /api/v1/users/:id               - Update user
DELETE /api/v1/users/:id               - Delete user (soft delete)
GET    /api/v1/users/:id/profile       - Get user profile
PUT    /api/v1/users/:id/profile       - Update user profile
```

### Decisions

```
GET    /api/v1/decisions               - List user's decisions
POST   /api/v1/decisions               - Create new decision
GET    /api/v1/decisions/:id           - Get decision by ID
PUT    /api/v1/decisions/:id           - Update decision
DELETE /api/v1/decisions/:id           - Delete decision
GET    /api/v1/decisions/:id/outcomes  - Get decision outcomes
POST   /api/v1/decisions/:id/outcomes  - Add outcome to decision
GET    /api/v1/decisions/search        - Search decisions
GET    /api/v1/decisions/similar/:id   - Find similar decisions (vector search)
POST   /api/v1/decisions/:id/archive   - Archive decision
```

### Outcomes

```
GET    /api/v1/outcomes/:id            - Get outcome by ID
PUT    /api/v1/outcomes/:id            - Update outcome
DELETE /api/v1/outcomes/:id            - Delete outcome
```

### Reminders

```
GET    /api/v1/reminders               - List user's reminders
POST   /api/v1/reminders               - Create reminder
PUT    /api/v1/reminders/:id           - Update reminder
DELETE /api/v1/reminders/:id           - Delete reminder
POST   /api/v1/reminders/:id/skip      - Skip reminder
POST   /api/v1/reminders/:id/complete  - Mark reminder complete
```

### Analytics

```
GET    /api/v1/analytics/dashboard     - Get dashboard analytics
GET    /api/v1/analytics/patterns      - Get user patterns
GET    /api/v1/analytics/insights      - Get user insights
GET    /api/v1/analytics/trends        - Get decision trends
GET    /api/v1/analytics/category/:cat - Get category analytics
POST   /api/v1/analytics/recalculate   - Trigger analytics recalculation
```

### AI Features

```
POST   /api/v1/ai/chat                 - AI chat interaction
POST   /api/v1/ai/analyze-decision     - Analyze decision with AI
POST   /api/v1/ai/generate-insight     - Generate AI insight
POST   /api/v1/ai/simulate-decision    - Simulate future decision
GET    /api/v1/ai/chat/sessions        - List chat sessions
GET    /api/v1/ai/chat/sessions/:id    - Get chat session history
```

### Notifications

```
GET    /api/v1/notifications           - List notifications
GET    /api/v1/notifications/:id       - Get notification by ID
PUT    /api/v1/notifications/:id/read  - Mark as read
PUT    /api/v1/notifications/read-all  - Mark all as read
DELETE /api/v1/notifications/:id       - Delete notification
```

### Subscriptions

```
GET    /api/v1/subscriptions/plans     - List available plans
GET    /api/v1/subscriptions/current   - Get current subscription
POST   /api/v1/subscriptions/subscribe - Subscribe to plan
POST   /api/v1/subscriptions/cancel    - Cancel subscription
POST   /api/v1/subscriptions/upgrade   - Upgrade plan
POST   /api/v1/subscriptions/downgrade - Downgrade plan
```

### Frameworks & Templates

```
GET    /api/v1/frameworks              - List decision frameworks
GET    /api/v1/frameworks/:id          - Get framework by ID
POST   /api/v1/frameworks              - Create custom framework
PUT    /api/v1/frameworks/:id          - Update framework
DELETE /api/v1/frameworks/:id          - Delete framework

GET    /api/v1/templates               - List decision templates
GET    /api/v1/templates/:id           - Get template by ID
POST   /api/v1/templates               - Create custom template
PUT    /api/v1/templates/:id           - Update template
DELETE /api/v1/templates/:id           - Delete template
```

### Health & Monitoring

```
GET    /api/v1/health                  - Health check
GET    /api/v1/health/db               - Database health
GET    /api/v1/health/redis            - Redis health
GET    /api/v1/metrics                 - Prometheus metrics (if enabled)
```

---

## Authentication & Authorization

### JWT Strategy

**Access Token**: Short-lived (15 minutes), contains user ID, role, and permissions
**Refresh Token**: Long-lived (30 days), stored in database, used to generate new access tokens

### Token Structure

```typescript
interface JWTPayload {
  userId: string;
  email: string;
  role: "user" | "admin" | "premium";
  iat: number;
  exp: number;
}
```

### Protected Routes

All routes except `/auth/*` and `/health` require authentication via Bearer token:

```
Authorization: Bearer <access_token>
```

### Role-Based Access Control (RBAC)

| Role        | Permissions                                             |
| ----------- | ------------------------------------------------------- |
| **user**    | Basic features, limited AI requests                     |
| **premium** | All features, unlimited AI requests, advanced analytics |
| **admin**   | System administration, user management                  |

---

## Data Flow

### Decision Creation Flow

```
┌─────────┐     ┌────────────┐     ┌──────────────┐     ┌──────────┐
│ Client  │────>│ API Route  │────>│ Validation   │────>│Controller│
└─────────┘     └────────────┘     └──────────────┘     └──────────┘
                                                              │
                                                              ↓
┌─────────┐     ┌────────────┐     ┌──────────────┐     ┌──────────┐
│Database │<────│  Service   │<────│  AI Service  │<────│  Queue   │
└─────────┘     └────────────┘     └──────────────┘     └──────────┘
                                                              │
                                                              ↓
                                                    ┌─────────────────┐
                                                    │ Background Jobs │
                                                    │ - Embedding Gen │
                                                    │ - Reminders     │
                                                    └─────────────────┘
```

### Outcome Tracking Flow

```
User Adds Outcome → Validation → Store Outcome → Trigger Analytics Worker
                                                          ↓
                                    ┌─────────────────────────────────┐
                                    │ Analytics Worker                │
                                    │ - Calculate aggregates          │
                                    │ - Detect patterns               │
                                    │ - Generate insights             │
                                    │ - Update materialized views     │
                                    └─────────────────────────────────┘
                                                   ↓
                                    ┌─────────────────────────────────┐
                                    │ Notification if insight found   │
                                    └─────────────────────────────────┘
```

---

## Error Handling

### Error Response Format

All errors follow a consistent structure:

```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string; // Machine-readable error code
    message: string; // Human-readable message
    details?: any; // Additional error details
    timestamp: string; // ISO timestamp
    path: string; // Request path
    requestId: string; // Unique request ID for tracing
  };
}
```

### Error Codes

```typescript
// Authentication Errors (AUTH_*)
AUTH_INVALID_CREDENTIALS;
AUTH_TOKEN_EXPIRED;
AUTH_TOKEN_INVALID;
AUTH_UNAUTHORIZED;
AUTH_FORBIDDEN;

// Validation Errors (VAL_*)
VAL_INVALID_INPUT;
VAL_MISSING_REQUIRED_FIELD;
VAL_INVALID_FORMAT;

// Resource Errors (RES_*)
RES_NOT_FOUND;
RES_ALREADY_EXISTS;
RES_CONFLICT;

// Business Logic Errors (BIZ_*)
BIZ_SUBSCRIPTION_REQUIRED;
BIZ_LIMIT_EXCEEDED;
BIZ_OPERATION_NOT_ALLOWED;

// System Errors (SYS_*)
SYS_DATABASE_ERROR;
SYS_EXTERNAL_SERVICE_ERROR;
SYS_INTERNAL_ERROR;
```

### HTTP Status Codes

| Status | Use Case                       |
| ------ | ------------------------------ |
| 200    | Success                        |
| 201    | Resource created               |
| 204    | Success with no content        |
| 400    | Bad request / Validation error |
| 401    | Unauthorized                   |
| 403    | Forbidden                      |
| 404    | Resource not found             |
| 409    | Conflict                       |
| 422    | Unprocessable entity           |
| 429    | Rate limit exceeded            |
| 500    | Internal server error          |
| 503    | Service unavailable            |

---

## Testing Strategy

### Unit Tests

- Test individual functions and services in isolation
- Mock external dependencies (database, APIs)
- Coverage target: 80%+

### Integration Tests

- Test API endpoints with real database (test DB)
- Test service interactions
- Test middleware chain

### E2E Tests

- Test complete user workflows
- Test authentication flows
- Test critical business paths

### Test Structure

```typescript
// Example: decisions.service.test.ts
describe('DecisionsService', () => {
  describe('createDecision', () => {
    it('should create a decision with valid data', async () => {
      // Arrange
      const mockData = { ... };

      // Act
      const result = await decisionsService.createDecision(mockData);

      // Assert
      expect(result).toBeDefined();
      expect(result.title).toBe(mockData.title);
    });

    it('should throw error with invalid data', async () => {
      // Arrange
      const invalidData = { ... };

      // Act & Assert
      await expect(
        decisionsService.createDecision(invalidData)
      ).rejects.toThrow();
    });
  });
});
```

---

## Deployment

### Environment Variables

```bash
# Server
NODE_ENV=production
PORT=3000
API_VERSION=v1

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/lifeos
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# Redis
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your_redis_password

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=30d

# OpenAI
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_EMBEDDING_MODEL=text-embedding-ada-002

# Stripe (for subscriptions)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_email_password

# Monitoring (optional)
SENTRY_DSN=your_sentry_dsn

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100
```

### Docker Deployment

```yaml
# docker-compose.yml
version: "3.8"

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/lifeos
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    restart: unless-stopped

  worker:
    build: .
    command: npm run worker
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/lifeos
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    restart: unless-stopped

  db:
    image: pgvector/pgvector:pg15
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=lifeos
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "20"
      - run: npm ci
      - run: npm run lint
      - run: npm run test

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker image
        run: docker build -t lifeos-api .
      - name: Deploy to production
        run: |
          # Your deployment script here
```

---

## Performance Optimization

### Caching Strategy

- **Redis** for session storage, frequently accessed data
- **Database query caching** for expensive analytics queries
- **CDN** for static assets (if applicable)

### Database Optimization

- **Indexes** on frequently queried columns
- **Materialized views** for analytics aggregates
- **Connection pooling**
- **Query optimization** with EXPLAIN ANALYZE

### Rate Limiting

- Per-user rate limits based on subscription tier
- Global rate limits to prevent abuse
- Separate limits for AI endpoints (more expensive)

---

## Security Best Practices

1. **Input Validation**: Validate all inputs with Zod schemas
2. **SQL Injection Prevention**: Use parameterized queries (Drizzle ORM)
3. **XSS Prevention**: Sanitize user inputs, use Content Security Policy
4. **CSRF Protection**: CSRF tokens for state-changing operations
5. **Password Security**: bcrypt with appropriate salt rounds
6. **Secrets Management**: Use environment variables, never commit secrets
7. **HTTPS Only**: Enforce HTTPS in production
8. **Helmet**: Security headers with helmet middleware
9. **Rate Limiting**: Prevent brute force and DDoS attacks
10. **Audit Logging**: Log all security-relevant events

---

## Monitoring & Observability

### Metrics to Track

- Request rate, latency, error rate
- Database query performance
- Cache hit/miss ratio
- Worker job processing time
- AI API usage and costs
- User sign-ups, active users
- Decision creation rate
- Outcome tracking completion rate

### Logging Levels

- **ERROR**: System errors, exceptions
- **WARN**: Potential issues, deprecated features
- **INFO**: Important business events
- **DEBUG**: Detailed diagnostic information
- **TRACE**: Very detailed diagnostic information

---

## Conclusion

This architecture provides a solid foundation for building a production-grade LifeOS API. It emphasizes:

- **Scalability** through modular design and background workers
- **Security** through authentication, validation, and best practices
- **Maintainability** through clear structure and TypeScript
- **Observability** through comprehensive logging and monitoring
- **Reliability** through error handling and testing

The system is designed to grow with your needs, from MVP to enterprise-scale deployment.

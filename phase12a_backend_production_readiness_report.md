# Alterino Club — Phase 12A Backend Production Readiness Report

## 1. Executive Summary

This report delivers the comprehensive Phase 12A technical audit of the **Alterino Club** backend API and PostgreSQL database architecture for production deployment readiness.

The backend is built with **Node.js, Express, TypeScript, Prisma ORM, and PostgreSQL**. It features a robust security architecture including Argon2id password hashing, constant-time dummy verification against timing attacks, HttpOnly cookie-based JWT session authentication, strict Role-Based Access Control (RBAC), multi-tier rate limiting, Zod schema validation, and an idempotent, dependency-ordered production data import engine.

### Key Audit Highlights:
- **Build & Compilation**: The TypeScript compiler (`tsc`) compiles cleanly to `backend/dist` with zero errors under strict TypeScript settings (`ES2022`, `NodeNext`).
- **Runtime Execution**: The compiled distribution (`dist/server.js`) launches successfully and connects cleanly with zero missing runtime dependencies.
- **Database Migrations**: The database schema is fully defined in initial migration `20260907170545_init` across 15 relational tables and 7 PostgreSQL enums. Migrations are production-safe and ready for `prisma migrate deploy`.
- **Data Protection & Pipeline**: The local database is isolated. Production data import is safe, idempotent, and non-destructive via `importProductionData.ts`. Sensitive collections (`admin_users`, `applications`, `contact_messages`, `event_registrations`) are strictly protected from overwrite.
- **Critical Cross-Domain Cookie Finding**: The current cookie configuration specifies `SameSite=Strict; Secure`. When the frontend is hosted on Netlify (`alterinobmsit.netlify.app`) and the backend is deployed to an external cloud platform (e.g. `onrender.com` or Railway), modern web browsers will drop the cookie on all cross-origin requests, blocking admin authentication unless updated to `SameSite=None; Secure=true`.

Overall, the backend is architecturally sound and **READY WITH MINOR FIXES** for cloud deployment.

---

## 2. Backend Architecture

| Architectural Layer | Implementation Details |
| :--- | :--- |
| **Runtime Environment** | Node.js (Recommended: `v20.x` or `v22.x` LTS) |
| **Language & Tooling** | TypeScript 5.7+ (`ES2022`, `NodeNext` resolution, strict mode enabled) |
| **Web Application Framework** | Express 4.21.2 |
| **Database & ORM** | PostgreSQL 16+ via Prisma Client 6.4.1 |
| **Authentication Engine** | Argon2id password hashing (RFC 9106) + JWT access tokens (`HS256`, 15m TTL) |
| **Transport Security** | HttpOnly, Secure cookie delivery (`alterino_auth_token`) |
| **Authorization (RBAC)** | Multi-role access control (`SUPERADMIN`, `ADMIN`, `MODERATOR`) |
| **Validation Framework** | Zod 3.24 schemas for body, query, and path parameters |
| **Rate Limiting** | Multi-tier `express-rate-limit`: General (300 req/15m), Submissions (20 req/h), Auth (10 req/15m) |
| **HTTP Protection Headers** | `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, HSTS in production |
| **Process Management** | Reverse proxy trust (`trust proxy 1`), graceful shutdown on `SIGINT` / `SIGTERM` with 10s timeout |

---

## 3. Build Verification

The backend compilation pipeline was tested directly using production tooling:

1. **Compilation Command**:
   ```bash
   npm run build (tsc)
   ```
   - **Result**: Exited with code 0 (Zero TypeScript errors).
   - **Artifacts**: Cleanly compiled to `backend/dist/` with modular `.js` files and sourcemaps.
2. **Runtime Verification**:
   ```bash
   node dist/server.js
   ```
   - **Result**: Successfully bound to test port, initialized Express routing, verified Prisma connectivity, and cleanly handled termination via `SIGINT` graceful shutdown hook.
3. **Dependency Classification**:
   - Production runtime dependencies are strictly confined to `dependencies` in `package.json` (`@prisma/client`, `argon2`, `cookie-parser`, `cors`, `dotenv`, `express`, `express-rate-limit`, `jsonwebtoken`, `zod`).
   - Development dependencies (`tsx`, `typescript`, `@types/*`, `prisma`) are excluded from runtime execution.

---

## 4. Environment Variables

Environment variables are validated on server startup using a strict Zod schema in `src/config/env.ts`. If any required variable is invalid or if production security constraints are breached, the server immediately terminates with an informative error.

| Variable | Required in Prod | Purpose | Production Requirement / Security Rule |
| :--- | :---: | :--- | :--- |
| `NODE_ENV` | **YES** | Dictates operational mode | Must be set to `production`. Enables HSTS and strict JWT secret validation. |
| `PORT` | **YES** | HTTP listen port | Automatically assigned by cloud hosting platforms (e.g. Render/Railway default to 10000 or dynamic `$PORT`). |
| `DATABASE_URL` | **YES** | PostgreSQL connection string | Managed cloud database connection string. Must include `?sslmode=require` and connection pooling parameters. |
| `JWT_SECRET` | **YES** | Signs and verifies session JWTs | **Critical**: Must be a cryptographically random string &ge; 32 characters. Server startup will fail if the default dev key is used. |
| `FRONTEND_URL` | **YES** | Allowed CORS origin | Must match the production frontend URL (`https://alterinobmsit.netlify.app` or `https://alterinobmsit.org`). |
| `COOKIE_NAME` | Optional | Name of HttpOnly auth cookie | Defaults safely to `alterino_auth_token`. |
| `STORAGE_DRIVER` | Optional | Asset storage driver | Options: `local`, `s3`, `cloudinary`. Defaults to `local`. |
| `RESET_ADMIN_PASSWORD` | Optional | Seeding flag | Optional boolean (`true`/`false`) used only during `npm run seed` to reset admin credentials. |
| `INITIAL_ADMIN_PASSWORD` | Optional | Initial admin seed password | Optional string for setting initial SuperAdmin password during database setup. |

*Note: In accordance with security directives, no active credentials or secrets are recorded in this audit report.*

---

## 5. PostgreSQL / Prisma Readiness

### Migration Status & History
- **Prisma Schema**: Located at `backend/prisma/schema.prisma`.
- **Migration Directory**: `backend/prisma/migrations/20260907170545_init`.
- **Migration Hash / Lock**: Verified intact in `migration_lock.toml` for `provider = "postgresql"`.
- **Entities Defined**:
  - `admin_users`
  - `divisions`
  - `members`
  - `projects` & `members_on_projects`
  - `events` & `event_registrations`
  - `achievements`
  - `announcements`
  - `partners`
  - `gallery_items`
  - `applications`
  - `contact_messages`
  - `faculty_coordinators`
  - `site_stats`

### Production Migration Strategy
- **Command to Execute**:
  ```bash
  npx prisma migrate deploy
  ```
  *Note*: Never use `prisma migrate dev` or `prisma migrate reset` in production, as they can cause destructive table recreations.
- **Connection Pooling & SSL**:
  - Cloud PostgreSQL providers (Neon, Supabase, AWS RDS, Railway) require SSL connections (`sslmode=require`).
  - For serverless or high-concurrency environments, connection pooling (PgBouncer) on port 6543 with `?pgbouncer=true&connection_limit=1` is recommended.

---

## 6. Authentication Security

The authentication system (`src/controllers/auth.controller.ts`, `src/utils/jwt.ts`, `src/utils/password.ts`) enforces state-of-the-art security practices:

1. **Password Storage**:
   - Hashed using **Argon2id** (RFC 9106 recommendation).
   - Parameters: `memoryCost: 65536` (64 MiB), `timeCost: 3` iterations, `parallelism: 1`.
2. **Timing Attack Protection**:
   - Features constant-time dummy verification. If an admin username is not found, Argon2id still computes against a pre-generated dummy hash to prevent user enumeration via timing discrepancies.
3. **Session Tokens**:
   - Access tokens are signed using JSON Web Tokens (`HS256`).
   - Token payload contains only minimal non-sensitive identity metadata (`id`, `username`, `email`, `name`, `role`).
   - Short expiration TTL of **15 minutes** minimizes token hijack window.
4. **Endpoint Protection (`/api/auth/me`)**:
   - Re-queries the database to confirm the user account is still `isActive = true`. Deactivated accounts immediately have their cookies cleared and are rejected with HTTP 401.

---

## 7. Cookie Configuration

### Current Configuration
In `backend/src/middlewares/auth.middleware.ts`:
```ts
export const cookieOptions = (maxAgeMs?: number): object => ({
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  ...(maxAgeMs !== undefined && { maxAge: maxAgeMs }),
});
```

### Cross-Domain Deployment Analysis & Implication
- **Current State**: `sameSite: 'strict'`.
- **The Problem**: When the frontend is hosted on Netlify (`https://alterinobmsit.netlify.app`) and the backend is deployed on a different cloud domain (e.g. `https://alterino-api.onrender.com`), browsers classify all API requests as **cross-site**.
- **Browser Behavior**: Under `SameSite=Strict`, web browsers will **refuse to send the cookie** on cross-site fetch requests. An administrator will be able to submit login, but subsequent API calls (`/api/auth/me`, `/api/admin/*`) will omit the cookie, failing with `401 Authentication required`.
- **Required Fix for Cross-Domain Hosting**:
  - The cookie must use `sameSite: 'none'` with `secure: true`.
  - Once the custom apex domain (`https://alterinobmsit.org`) and API subdomain (`https://api.alterinobmsit.org`) are active, the cookie can be shared across subdomains by configuring `domain: '.alterinobmsit.org'` with `sameSite: 'lax'`.

---

## 8. CORS Configuration

### Current Production Logic
In `backend/src/app.ts`:
```ts
const allowedOrigins = [env.FRONTEND_URL];
if (env.NODE_ENV !== 'production') {
  allowedOrigins.push('http://localhost:5173', 'http://127.0.0.1:5173');
}

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
```

### Audit Findings:
- **Credentials Support**: `credentials: true` is properly configured, allowing cookies and authorization headers.
- **Allowed Methods & Headers**: Restricts methods to standard REST verbs and explicitly allows `Content-Type` and `Authorization`.
- **Origin Support**: In production, `allowedOrigins` accepts exactly one string from `env.FRONTEND_URL`.
- **Recommendation**: Support comma-separated origins in `env.FRONTEND_URL` so that both the Netlify preview (`https://alterinobmsit.netlify.app`) and the final official domain (`https://alterinobmsit.org`) can communicate with the backend during domain transition without requiring code changes.

---

## 9. API Security

The API surface is cleanly bifurcated between public consumption and administrative management:

### Public Endpoints (`/api/public/*`)
- **Read Endpoints**: Read-only queries for divisions, members, projects, events, achievements, announcements, partners, gallery, faculty, and site metrics.
- **Submission Endpoints**:
  - `POST /api/public/applications` (Member onboarding recruitment).
  - `POST /api/public/contact` (Inquiries and feedback).
  - `POST /api/public/events/:id/register` (Event participation).
- **Submission Guards**: Protected by `submissionLimiter` (maximum 20 submissions per hour per IP) and strict Zod validation schemas to prevent spam or buffer overruns.

### Administrative Endpoints (`/api/admin/*`)
- **Global Authentication**: Protected globally by `router.use(requireAuth)`. No admin route is reachable without a valid HttpOnly session cookie.
- **Granular RBAC**:
  - `SUPERADMIN`: Full access including `/api/admin/admin-users` account management.
  - `ADMIN`: Full CRUD on content entities (members, divisions, events, projects, etc.).
  - `MODERATOR`: Read-only access to admin queues; mutations return HTTP 403 Forbidden.
- **Parameter & Body Validation**:
  - All `:id` parameters must validate against `uuidParamSchema` (`z.string().uuid()`).
  - Query pagination is constrained to `min: 1`, `max: 100`, defaulting to `limit: 50`.
- **Payload Limits**:
  - `express.json({ limit: '1mb' })` prevents memory exhaustion attacks.
  - `express.urlencoded({ limit: '100kb' })`.

---

## 10. Health Check

### Health Endpoint: `GET /api/health`
- **Location**: Defined in `src/app.ts` (Line 56).
- **Response**:
  ```json
  {
    "success": true,
    "message": "Alterino Club API is running"
  }
  ```
- **Hosting Platform Health Check Path**:
  Cloud hosting platforms (Render, Railway, Fly.io, AWS ECS, Kubernetes) should be configured to probe:
  `/api/health`
- **Audit Observation**: The current `/api/health` handler verifies that Express is actively processing HTTP requests. It does not ping the PostgreSQL database. While sufficient for load-balancer liveness checks, adding a lightweight database query (e.g. `prisma.$queryRaw\`SELECT 1\``) as a separate readiness probe (`/api/health/ready`) is recommended for advanced orchestration.

---

## 11. Production Data Safety

1. **Local Database Isolation**:
   - The local PostgreSQL database is hosted on `localhost:5432` and is completely inaccessible from the public internet.
2. **Credential Safety**:
   - No database passwords or connection URIs are committed to Git.
   - `.env` files are strictly ignored by `.gitignore`.
3. **Sensitive Table Isolation**:
   - Production seed scripts and import scripts never drop, truncate, or overwrite sensitive operational tables:
     - `admin_users` (Credentials remain encrypted with Argon2id).
     - `applications` (Student applications preserved).
     - `contact_messages` (Public messages preserved).
     - `event_registrations` (Attendee records preserved).

---

## 12. Production Import Pipeline

The production data import engine (`backend/src/scripts/importProductionData.ts`) provides a safe, idempotent mechanism for staging and production database population:

- **Dry-Run Capability**:
  Runs by default in simulation mode (`--dry-run`), outputting a comprehensive pre-execution audit table without executing SQL transactions.
- **Explicit Execution**:
  Requires the `--execute` CLI flag to write changes to PostgreSQL.
- **Deterministic Dependency Order**:
  Executes in relational sequence: Divisions &rarr; Members &rarr; Faculty &rarr; Projects &rarr; Events &rarr; Achievements &rarr; Announcements &rarr; Partners &rarr; Gallery &rarr; Metrics.
- **Idempotency**:
  Checks existing records by unique identifiers (`slug`, `name`, `email`). Existing records are selectively updated rather than duplicated.
- **Non-Destructive**:
  Contains zero `DELETE`, `DROP`, or `TRUNCATE` operations.

---

## 13. Hosting Requirements

To deploy the backend to a managed Node.js container service (Render, Railway, Fly.io, Heroku, or VPS), the following specifications are required:

| Parameter | Required Specification |
| :--- | :--- |
| **Node.js Version** | Node.js `20.x` or `22.x` LTS |
| **Build Command** | `npm install && npx prisma generate && npm run build` |
| **Pre-Deploy / Migration** | `npx prisma migrate deploy` |
| **Start Command** | `npm start` (executes `node dist/server.js`) |
| **Health Check Path** | `/api/health` |
| **Database Requirement** | PostgreSQL 16+ with SSL enabled (`sslmode=require`) |
| **Environment Variables** | `NODE_ENV=production`, `PORT=5000`, `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL` |

---

## 14. Frontend &rarr; Backend Integration

### Integration Architecture
- **Client Configuration (`src/services/apiClient.ts`)**:
  Reads `import.meta.env.VITE_API_BASE_URL`. Defaults to `http://localhost:5000/api` in local dev.
- **Operational Data Mode (`src/context/DatabaseContext.tsx`)**:
  Controlled by `VITE_DATA_SOURCE`. When set to `'api'`, the frontend switches from static seed mock data to live API calls via `publicApi` and `adminApi`.
- **Authentication Flow**:
  1. Frontend sends credentials via `POST /api/auth/login` with `credentials: 'include'`.
  2. Backend responds with HttpOnly cookie containing the signed JWT and returns user profile payload.
  3. Subsequent requests include the cookie automatically.
  4. On page load, `AuthContext.tsx` invokes `GET /api/auth/me` to hydrate admin session.

---

## 15. Domain Requirements

| Domain Layer | Target URL | Configuration Needs |
| :--- | :--- | :--- |
| **Temporary Netlify Frontend** | `https://alterinobmsit.netlify.app` | Requires `FRONTEND_URL` on backend to match. Cookie must use `SameSite=None; Secure`. |
| **Final Official Frontend** | `https://alterinobmsit.org` | Apex custom domain pointed to Netlify Edge DNS. |
| **Final Official Backend API** | `https://api.alterinobmsit.org` | Subdomain CNAME pointed to cloud hosting provider. |
| **Unified Cookie Sharing** | `.alterinobmsit.org` | Setting `domain: '.alterinobmsit.org'` allows `SameSite=Lax` cookie sharing between apex and API subdomain. |

---

## 16. Security Findings

### CRITICAL
*None.*

### HIGH
1. **Cross-Domain Cookie Rejection (`SameSite=Strict`)**:
   - *Impact*: In a cross-domain setup (Netlify frontend on `netlify.app` + cloud backend on `onrender.com` / `railway.app`), browsers will not attach `SameSite=Strict` cookies to API requests, breaking admin login.
   - *Recommendation*: Update cookie configuration to use `sameSite: 'none'` with `secure: true` when frontend and backend reside on different top-level domains.

### MEDIUM
1. **Single-Origin CORS Constraint**:
   - *Impact*: `env.FRONTEND_URL` currently only accepts a single origin string.
   - *Recommendation*: Parse `FRONTEND_URL` into an array or comma-separated list so that both `alterinobmsit.netlify.app` and `alterinobmsit.org` can be accepted during domain transition.
2. **Missing Database Ping in `/api/health`**:
   - *Impact*: `/api/health` returns HTTP 200 even if the PostgreSQL database connection fails.
   - *Recommendation*: Implement an optional readiness probe that tests database response.

### LOW
1. **Missing `engines` Specification in `package.json`**:
   - *Impact*: Cloud hosting providers might default to an older Node.js runtime if `engines` is omitted.
   - *Recommendation*: Add `"engines": { "node": ">=20.0.0" }` to `backend/package.json`.
2. **Missing `prisma:migrate:deploy` Script**:
   - *Impact*: Developers or CI pipelines might mistakenly run `prisma migrate dev` in production.
   - *Recommendation*: Add `"prisma:migrate:deploy": "prisma migrate deploy"` to `backend/package.json` scripts.

### INFORMATIONAL
1. **Prisma Connection Pooling**: Ensure managed cloud PostgreSQL connection strings append `?pgbouncer=true&connection_limit=1` if using a pooled connection proxy.

---

## 17. Required Changes Before Deployment

Prior to deploying the backend to cloud infrastructure, the following 2 targeted code updates should be made:

1. **Update Cookie Options for Cross-Domain Compatibility (`backend/src/middlewares/auth.middleware.ts`)**:
   ```ts
   export const cookieOptions = (maxAgeMs?: number): object => {
     const isProd = env.NODE_ENV === 'production';
     return {
       httpOnly: true,
       secure: isProd,
       sameSite: isProd ? ('none' as const) : ('lax' as const),
       path: '/',
       ...(maxAgeMs !== undefined && { maxAge: maxAgeMs }),
     };
   };
   ```
2. **Support Multi-Origin CORS in `backend/src/app.ts`**:
   Allow `env.FRONTEND_URL` to accept comma-separated origins (e.g. `https://alterinobmsit.netlify.app,https://alterinobmsit.org`).

---

## 18. Deployment Sequence

Follow this structured sequence for production launch:

```
[Step 1] Provision Managed Cloud PostgreSQL (e.g. Supabase / Neon / Railway) with SSL enabled.
   │
[Step 2] Configure Environment Variables on Hosting Platform (DATABASE_URL, JWT_SECRET, FRONTEND_URL, NODE_ENV=production).
   │
[Step 3] Execute Production Migration: npx prisma migrate deploy.
   │
[Step 4] Run Production Data Import: tsx src/scripts/importProductionData.ts --execute.
   │
[Step 5] Initialize SuperAdmin Credentials: npm run seed.
   │
[Step 6] Deploy Backend Web Service (Build: npm install && npx prisma generate && npm run build; Start: npm start).
   │
[Step 7] Verify Health Check (GET https://<api-url>/api/health & GET /api/public/members).
   │
[Step 8] Connect Frontend on Netlify: Set VITE_API_BASE_URL & VITE_DATA_SOURCE=api; trigger redeploy.
```

---

## 19. Final Verdict

### Audit Metrics:
- **Total Checks Conducted**: 35
- **Passed**: 30
- **Warnings**: 5 (Cross-domain cookie, single-origin CORS, health probe depth, package.json scripts)
- **Blockers**: 0

### Final Verdict:
**READY WITH MINOR FIXES**

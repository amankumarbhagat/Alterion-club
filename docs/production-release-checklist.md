# Production Release Checklist & Pre-Flight Gate
**Project:** Alterino Club  
**Release Version:** 1.0.0 (Production Release)  
**Governance:** Strict Deployment Gate Protocol  
**Instructions:** Every checkbox must be validated prior to public cutover. Any unchecked item marked **[BLOCKER]** halts the deployment pipeline immediately.

---

## 1. Domain & DNS Gate

- [ ] **[BLOCKER]** Official institutional root domain or subdomain confirmed by leadership (`<FRONTEND_DOMAIN>`).
- [ ] **[BLOCKER]** Backend API domain or subdomain confirmed (`<API_DOMAIN>`).
- [ ] DNS A/CNAME records configured with low initial TTL (300s) for rapid propagation/cutover.
- [ ] Automated SSL/TLS certificates issued (Let's Encrypt / Cloudflare Edge / AWS ACM).
- [ ] HTTP to HTTPS automatic 301 redirection verified on all edge entry points.

---

## 2. Secrets & Credential Management Gate

- [ ] **[BLOCKER]** Production `JWT_SECRET` generated (48+ char base64url random bytes) and injected directly into host secret store.
- [ ] **[BLOCKER]** `INITIAL_ADMIN_PASSWORD` generated with high entropy and stored exclusively in a secure password manager.
- [ ] Production database credentials injected into host environment via `DATABASE_URL`.
- [ ] Zero `.env` files or secret values committed to Git version control.
- [ ] Developer placeholder keys confirmed purged from all production host environments.

---

## 3. Database Infrastructure & Migration Gate

- [ ] **[BLOCKER]** Managed PostgreSQL cluster provisioned with minimum PostgreSQL 16+ or 18.x.
- [ ] Connection string configured with SSL requirement parameter (`sslmode=require`).
- [ ] Connection pooling (PgBouncer / Supabase Pooler / Neon Pooler) verified if using serverless or high-concurrency Node instances.
- [ ] **[BLOCKER]** Migrations applied cleanly using `npx prisma migrate deploy` (NEVER `migrate reset`).
- [ ] Schema validation confirmed against target database with zero missing tables or enums.
- [ ] Automated daily snapshots and point-in-time recovery (PITR) enabled on managed database.
- [ ] Pre-release manual database backup snapshot taken and verified.

---

## 4. Backend Service Deployment Gate

- [ ] Node.js runtime set to LTS (v20 or v22) on hosting provider.
- [ ] Build command configured: `npm run build` (transpiling TypeScript with `tsc`).
- [ ] Start command configured: `npm run start` (`node dist/server.js`).
- [ ] Host environment variables populated (`NODE_ENV=production`, `FRONTEND_URL`, `DATABASE_URL`, `JWT_SECRET`, `PORT`).
- [ ] Reverse proxy trust verified (`app.set('trust proxy', 1)`).
- [ ] Health check probe configured on cloud host targeting `GET /api/health` with HTTP 200 pass condition.
- [ ] Graceful shutdown verified (`SIGTERM`/`SIGINT` drains active requests within 10s timeout).

---

## 5. Frontend Application Deployment Gate

- [ ] Build script verified: `npm run build` (`tsc -b && vite build`).
- [ ] Production bundle checked: vendor chunk isolation (`vendor-react`, `vendor-motion`, `vendor-icons`, `vendor-three`).
- [ ] Build-time environment variables configured: `VITE_API_BASE_URL=https://<API_DOMAIN>/api`, `VITE_DATA_SOURCE=api`.
- [ ] Static hosting CDN cache-control headers configured:
  - `dist/index.html`: `no-cache, no-store, must-revalidate`
  - `dist/assets/*`: `public, max-age=31536000, immutable` (hashed assets)
- [ ] Single-Page Application (SPA) fallback route configured (`/*` -> `/index.html`) on hosting provider.

---

## 6. Authentication, CORS & Cookie Gate

- [ ] **[BLOCKER]** CORS origin matches exact production frontend domain (`https://<FRONTEND_DOMAIN>`).
- [ ] CORS `credentials: true` verified with restricted origin (no wildcard `*`).
- [ ] Session cookie attributes verified:
  - `HttpOnly: true`
  - `Secure: true` (enforced by `NODE_ENV=production`)
  - `SameSite: strict` (or `lax` if separate subdomains; see Cookie Architecture Plan)
  - `Path: /`
- [ ] Admin login, session persistence (`/api/auth/me`), and logout lifecycle verified.
- [ ] Constant-time dummy hash verification prevents timing-attack user enumeration.

---

## 7. Security Headers & Content Security Policy (CSP) Gate

- [ ] `X-Content-Type-Options: nosniff` header verified.
- [ ] `X-Frame-Options: DENY` header verified.
- [ ] `Referrer-Policy: strict-origin-when-cross-origin` header verified.
- [ ] `Permissions-Policy: camera=(), microphone=(), geolocation=()` header verified.
- [ ] `Strict-Transport-Security: max-age=31536000; includeSubDomains` header verified.
- [ ] Production CSP configured allowing necessary Google Fonts and API origin without wildcard script execution.

---

## 8. Production Data Import Gate

- [ ] **[BLOCKER]** Official club data records finalized and signed off by club leadership.
- [ ] Dry-run executed on production database connection: `npm run data:import -- --dry-run`.
- [ ] Dry-run candidate counts, creations, skips, and conflicts reviewed.
- [ ] Protected collections confirmed untouched: `admin_users`, `applications`, `contact_messages`, `event_registrations`.
- [ ] Live import executed explicitly: `npm run data:import -- --execute`.
- [ ] Record integrity and public page rendering verified across all divisions, members, projects, and events.

---

## 9. SEO, Social & Asset Integrity Gate

- [ ] Canonical URL updated to official institutional domain in `index.html`.
- [ ] OpenGraph (`og:url`, `og:image`) and Twitter card tags updated to official domain.
- [ ] `public/robots.txt` verified (disallowing admin routes, referencing production sitemap).
- [ ] `public/sitemap.xml` updated with production URLs for all public routes.
- [ ] 3D Polyhedron asset bundles load reliably; WebGL error boundary and SVG fallback active.

---

## 10. Logging, Monitoring & Incident Readiness Gate

- [ ] Centralized cloud logging enabled (LogDNA / BetterStack / CloudWatch / host logs).
- [ ] Log hygiene verified: zero passwords, JWT tokens, cookies, or connection strings in logs.
- [ ] External uptime monitor configured (UptimeKuma / BetterStack / Pingdom) pinging `GET /api/health` every 60s.
- [ ] Alert channels configured (email / Discord webhook) for API downtime or HTTP 5xx spikes.
- [ ] Rollback procedure documented and available to on-call deployment engineer.

---

## 11. Final Smoke Test & Go/No-Go Approval

- [ ] **[BLOCKER]** Full smoke test execution completed according to `docs/production-smoke-test.md`.
- [ ] Public routes, form submissions, and admin dashboard verified.
- [ ] Lead Developer / DevOps Engineer sign-off.
- [ ] Club President / Faculty Coordinator formal release approval.

---

## Final Release Status

| Stage | Decision | Sign-off Authority | Timestamp |
| :--- | :---: | :--- | :--- |
| **Pre-Flight Review** | **HELD** | Lead DevOps Engineer | Pending User Review |
| **Production Cutover** | **BLOCKED** | Project Owner / User | Pending Decisions |

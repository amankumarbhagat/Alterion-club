# Production Environment Variables Specification & Checklist
**Project:** Alterino Club  
**Classification:** Operational Security Guidelines  
**Status:** SAFE TEMPLATE (No actual secrets or passwords included)

This document specifies all environment variables utilized across the Alterino Club frontend, backend, Prisma ORM, and deployment scripts.

---

## 1. Backend Environment Variables (`backend/.env`)

These variables are consumed by the Node.js Express server (`backend/src/config/env.ts`), Prisma ORM, and initialization scripts.

| Variable Name | Required | Current Default / Fallback | Production Requirement | Description & Format |
| :--- | :---: | :--- | :--- | :--- |
| `NODE_ENV` | **YES** | `development` | `production` | Must be set to `production` to activate HSTS headers, secure cookies, and strict JWT validation. |
| `PORT` | **YES** | `5000` | Assigned by Host / `5000` | Port for the Express server to listen on. Render, Railway, Fly.io automatically inject `PORT`. |
| `FRONTEND_URL` | **YES** | `http://localhost:5173` | `https://<FRONTEND_DOMAIN>` | Canonical URL of the frontend for strict CORS whitelisting. Must NOT have a trailing slash. |
| `DATABASE_URL` | **YES** | Local PostgreSQL connection | `<SET-IN-PRODUCTION>` | Connection string to the managed PostgreSQL database. Must enforce SSL in production (`?sslmode=require`). |
| `JWT_SECRET` | **YES** | Dev placeholder | `<SET-IN-PRODUCTION>` | Secret used to sign admin session JWT tokens. Must be at least 32 characters long. Refined validation fails server start if dev secret is used. |
| `COOKIE_NAME` | NO | `alterino_auth_token` | `alterino_auth_token` | Cookie name storing the HttpOnly session token. |
| `STORAGE_DRIVER` | NO | `local` | `local` | Upload storage provider (`local`, `s3`, `cloudinary`). |

### 1.1 Backend Admin Provisioning Variables (`backend/src/seed.ts`)

| Variable Name | Required | Default / Fallback | Production Setting | Description & Security Policy |
| :--- | :---: | :--- | :--- | :--- |
| `INITIAL_ADMIN_PASSWORD` | CONDITIONAL | `AdminPassword123!` | `<SET-IN-PRODUCTION>` | Required ONLY if provisioning the initial SuperAdmin account via script. Must be >= 16 random characters. |
| `RESET_ADMIN_PASSWORD` | NO | `false` | `false` | If set to `true`, forces password reset for the admin account on script run. Must remain unset or `false` in production. |

---

## 2. Frontend Environment Variables (`.env.production`)

These variables are baked into the static build assets at build time by Vite.

| Variable Name | Required | Development Value | Production Setting | Description |
| :--- | :---: | :--- | :--- | :--- |
| `VITE_API_BASE_URL` | **YES** | `http://localhost:5000/api` | `https://<API_DOMAIN>/api` | Complete public API endpoint URL used by `src/services/apiClient.ts`. |
| `VITE_DATA_SOURCE` | **YES** | `api` | `api` | Controls whether the frontend fetches from the live backend API or static mock fixtures. Must be `api`. |

> [!CAUTION]
> Vite embeds any variable prefixed with `VITE_` into client-side JavaScript bundles. **NEVER** place database credentials, JWT secrets, or administrative passwords in frontend `.env` files.

---

## 3. Cryptographic Secret Generation Guidelines

### 3.1 Production `JWT_SECRET` Generation
The backend strictly enforces that when `NODE_ENV=production`, `JWT_SECRET` cannot be the development key and must contain at least 32 characters.

Generate a cryptographically secure 256-bit random string via Node.js CLI on a secure local machine or host dashboard:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

### 3.2 Secure Password Policy for `INITIAL_ADMIN_PASSWORD`
Generate a high-entropy passphrase (minimum 16 alphanumeric + symbol characters):
```bash
node -e "console.log(require('crypto').randomBytes(24).toString('base64url'))"
```

---

## 4. Production Environment Configuration Checklist

Use this checklist when populating secrets in the cloud provider's dashboard (e.g. Render/Railway/Fly.io):

- [ ] `NODE_ENV` set to `production`
- [ ] `PORT` configured or automatically supplied by host
- [ ] `DATABASE_URL` configured with managed PostgreSQL connection string with SSL parameter
- [ ] `JWT_SECRET` populated with 48+ character cryptographically random string
- [ ] `FRONTEND_URL` configured to match exact frontend production domain (`https://<FRONTEND_DOMAIN>`)
- [ ] `COOKIE_NAME` verified as `alterino_auth_token`
- [ ] `STORAGE_DRIVER` set according to asset strategy
- [ ] `INITIAL_ADMIN_PASSWORD` securely generated and stored in password manager
- [ ] `RESET_ADMIN_PASSWORD` left empty or explicitly set to `false`
- [ ] Frontend build environment configured with `VITE_API_BASE_URL=https://<API_DOMAIN>/api`
- [ ] Frontend build environment configured with `VITE_DATA_SOURCE=api`
- [ ] Local `.env` files confirmed untracked and excluded in `.gitignore`

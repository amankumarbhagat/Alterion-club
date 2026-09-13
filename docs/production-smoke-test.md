# Production Smoke Test Protocol & Verification Checklist
**Project:** Alterino Club  
**Target Environment:** Staging & Production Deployment  
**Role:** Senior DevOps & QA Release Engineer  
**Objective:** End-to-end post-deployment verification protocol to confirm functional integrity, security enforcement, and infrastructure health prior to public release.

---

## 1. Infrastructure & Security Transport Tests

| Test ID | Test Case | Execution Steps | Expected Outcome | Verification Status |
| :--- | :--- | :--- | :--- | :---: |
| **INF-01** | **HTTPS Enforcement** | Navigate to `http://<FRONTEND_DOMAIN>` | Automatically redirects (301/302) to `https://<FRONTEND_DOMAIN>` | [ ] |
| **INF-02** | **HSTS Header** | Inspect HTTP response headers for backend and frontend | Header `Strict-Transport-Security: max-age=31536000; includeSubDomains` is present | [ ] |
| **INF-03** | **Security Headers** | Inspect `GET /api/health` response headers | `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin` present | [ ] |
| **INF-04** | **Fingerprint Masking** | Inspect headers on any API response | `x-powered-by` header is completely absent | [ ] |
| **INF-05** | **Health Endpoint** | `curl -i https://<API_DOMAIN>/api/health` | Returns HTTP 200 with `{ "success": true, "message": "Alterino Club API is running" }` | [ ] |
| **INF-06** | **CORS Enforcement** | Send request from unauthorized origin with `Origin: https://evil.com` | Access-Control-Allow-Origin header is omitted or does not match evil.com | [ ] |
| **INF-07** | **Rate Limiting** | Fire 10 rapid submissions to `/api/public/contact` | Submissions 6-10 return HTTP 429 with rate limit warning message | [ ] |

---

## 2. Public Route Verification (Client Hash Routes)

Verify visual rendering, dynamic telemetry loading, and responsive layouts:

| Route | Expected Content | Responsive / Mobile | Visual 3D / Fallback | Verification Status |
| :--- | :--- | :---: | :---: | :---: |
| `/#/` (Home) | Hero section, animated metrics counter, announcements ticker, highlights | [ ] | 3D Polyhedron / Fallback active | [ ] |
| `/#/about` | Club mission, leadership ethos, faculty advisor bio and department | [ ] | Fluid layout | [ ] |
| `/#/divisions` | App Dev & R&D division cards, tool badges, ongoing work sections | [ ] | Grid collapse | [ ] |
| `/#/team` | Member profile cards, leadership tags, social links (GitHub, LinkedIn) | [ ] | Avatar grid | [ ] |
| `/#/events` | Upcoming and past events, hackathon dates, winner rosters | [ ] | Cards & timeline | [ ] |
| `/#/projects` | Active & completed projects, tags, progress bars, repo/demo links | [ ] | Tags filter | [ ] |
| `/#/gallery` | Filterable campus photography, workshop snapshots, lightbox previews | [ ] | Masonry/Grid | [ ] |
| `/#/partners` | Sponsor logos, technology partner cards, institutional links | [ ] | Grid view | [ ] |
| `/#/join` | Recruitment information, department selector, application form | [ ] | Multi-step/Form | [ ] |
| `/#/contact` | Direct communication form, office location, emergency contact info | [ ] | Form layout | [ ] |
| `/#/unknown` (404) | Branded 404 error page, return to home button | [ ] | Clean message | [ ] |

---

## 3. Interactive Forms Verification

| Test ID | Form Target | Input Payload | Expected Outcome | Verification Status |
| :--- | :--- | :--- | :--- | :---: |
| **FORM-01** | **Join Application** | Valid application (name, email, division, skills, motivation) | Returns HTTP 201; displays cyber success modal with confirmation ID; clears inputs | [ ] |
| **FORM-02** | **Join Validation** | Invalid email or missing required fields | Displays localized Zod validation error below offending inputs; prevents submit | [ ] |
| **FORM-03** | **Contact Inquiry** | Valid inquiry (name, email, subject, message) | Returns HTTP 201; displays transmission sent banner; message recorded in DB | [ ] |
| **FORM-04** | **Event Registration**| Valid student registration for an active upcoming event | Returns HTTP 201; emits confirmation ticket / badge; increments participant count | [ ] |
| **FORM-05** | **Duplicate Reg** | Submit same email to same event twice | Returns HTTP 409 Conflict ("You have already registered for this event") | [ ] |

---

## 4. Authentication & Session Security Tests

| Test ID | Scenario | Procedure | Expected Outcome | Verification Status |
| :--- | :--- | :--- | :--- | :---: |
| **AUTH-01** | **Valid Admin Login** | Enter correct username/password at `/#/admin` | Returns 200; sets `alterino_auth_token` cookie with `HttpOnly; Secure; SameSite=Strict`; redirects to dashboard | [ ] |
| **AUTH-02** | **Invalid Password** | Submit incorrect password | Returns HTTP 401 ("Invalid credentials"); timing constant dummy comparison; no token set | [ ] |
| **AUTH-03** | **Session Verification** | Call `GET /api/auth/me` with cookie | Returns HTTP 200 with authenticated user profile (role, email, name; no password hash) | [ ] |
| **AUTH-04** | **Logout Lifecycle** | Click logout in Admin Dashboard | Calls `POST /api/auth/logout`; server clears cookie; client redirects to login view | [ ] |
| **AUTH-05** | **Session Expiry** | Wait for 15-minute token expiry or tamper cookie | Next API call returns 401; client prompts re-authentication | [ ] |
| **AUTH-06** | **Unauthenticated Admin** | Directly load `/#/admin` without cookie | Shows login screen; protected administrative telemetry remains unrendered | [ ] |

---

## 5. Admin Dashboard CRUD & Role-Based Access Tests

| Module | Verification Steps | Expected Result | Status |
| :--- | :--- | :--- | :---: |
| **Overview Telemetry** | Load dashboard home | Aggregated counts for applications, members, projects, events, and registrations match DB | [ ] |
| **Applications Review**| Filter by status (`PENDING`, `ACCEPTED`, `REJECTED`), update notes | State persists in DB; status badge changes immediately | [ ] |
| **Contact Inquiries** | Mark incoming message as read; send administrative reply | Status updates to read; reply saved in DB | [ ] |
| **Event Registrations**| View participant list; export/download participant CSV | List renders without pagination lag; CSV downloads correctly | [ ] |
| **Entity Management** | Create / Edit / Delete member, project, or event | Modals validate input; Prisma records updated; cache refreshed | [ ] |
| **RBAC Enforcement** | Log in with `MODERATOR` role | Administrative user management and destructive actions are hidden/disabled (HTTP 403) | [ ] |

---

## 6. Device, Browser & Graphics Resilience Tests

| Environment | Specific Check | Pass Criteria | Status |
| :--- | :--- | :--- | :---: |
| **Desktop Chrome/Edge** | WebGL 2.0 3D Hero Scene | Smooth 60fps rotation, interactive hover nodes, no console errors | [ ] |
| **Desktop Safari** | WebGL canvas & CSS backdrop filters | Glassmorphic cards render smoothly without visual artifacts | [ ] |
| **Mobile iOS / Android** | Viewport rendering & touch navigation | Hamburger menu responds smoothly; touch scroll does not clip | [ ] |
| **Low-End / Software GPU**| WebGL context disabled or unsupported | Seamlessly falls back to `ThreeSceneFallback.tsx` without crash | [ ] |
| **Reduced Motion** | Enable `prefers-reduced-motion: reduce` | 3D animations and page transitions halt/dampen according to accessibility settings | [ ] |

---

## Smoke Test Sign-Off

- **Tester Name / Role:** _______________________________________
- **Date Executed:** _______________________________________
- **Overall Result:** [ ] PASS   [ ] FAIL   [ ] PASS WITH EXCEPTIONS
- **Release Approval:** [ ] GRANTED   [ ] BLOCKED

# Alterion Club (Alterino) - Complete Project Report

## 1. Executive Summary

**Alterion Club** (referred to in code as *Alterino*) is a modern, high-performance web platform designed for an academic and technical student club at BMS Institute of Technology & Management (BMSIT&M). The platform serves as a central hub for student members, leadership teams, faculty coordinators, external partners, and potential applicants.

The application combines a visually rich, dark-themed **React + TypeScript + Vite** frontend with an **Express + TypeScript + Prisma (PostgreSQL)** backend API.

---

## 2. Architecture & Tech Stack

### Frontend Architecture
* **Framework**: React 19 with TypeScript
* **Build Tool**: Vite 8 with Hot Module Replacement (HMR)
* **Styling**: Tailwind CSS v4 & custom CSS utilities (`App.css`, `index.css`)
* **Icons & Animation**: `lucide-react` for icons, `framer-motion` for UI transitions
* **Interactive Backdrop**: `InnovationNetwork` canvas component rendering animated dynamic nodes and interconnecting physics
* **Routing**: Hash-based client routing (`#/home`, `#/about`, `#/divisions`, `#/team`, `#/events`, `#/projects`, `#/gallery`, `#/partners`, `#/join`, `#/contact`, `#/admin`)
* **State & Persistence**: `DatabaseContext` providing full client-side CRUD capabilities with `localStorage` fallback (`alterino_*` keys) and JSON import/export functionality.

### Backend Architecture
* **Runtime & Language**: Node.js, Express framework, TypeScript (`tsx` runner)
* **ORM & Database**: Prisma ORM (v6.4.1) targetting PostgreSQL
* **Security & Auth**: Argon2 password hashing, JSON Web Tokens (`jsonwebtoken`), Cookie Parser, CORS, Express Rate Limiting
* **Input Validation**: Zod schema validation

---

## 3. Database Schema & Data Models

The PostgreSQL database defined via Prisma (`schema.prisma`) consists of **13 models** and **7 enums**:

### Core Enums
* `AdminRole`: `SUPERADMIN`, `ADMIN`, `MODERATOR`
* `EventStatus`: `UPCOMING`, `ONGOING`, `PAST`
* `RegistrationStatus`: `PENDING`, `CONFIRMED`, `ATTENDED`, `CANCELLED`
* `ProjectStatus`: `ACTIVE`, `COMPLETED`, `ON_HOLD`
* `AnnouncementCategory`: `RECRUITMENT`, `EVENT`, `ALERT`, `GENERAL`
* `GalleryCategory`: `EVENTS`, `WORKSHOPS`, `MEETINGS`, `HACKATHONS`, `PROJECTS`, `COMMUNITY`
* `ApplicationStatus`: `PENDING`, `REVIEWED`, `ACCEPTED`, `REJECTED`

### Entities & Relationships
1. **`AdminUser`**: Secure authentication model storing usernames, emails, Argon2 password hashes, and admin roles.
2. **`Division`**: Club divisions (e.g., Software Development, AI/ML, Hardware/IoT, Design & Media) with lead member pointers and skill lists.
3. **`Member`**: Core member profiles linked to divisions, Github/LinkedIn links, bio, and leadership flags.
4. **`Project` & `ProjectMember`**: Featured projects with problem/solution descriptions, progress percentages, demo/github URLs, and assigned team members or faculty/member mentors.
5. **`Event` & `EventRegistration`**: Club events with venue, dates, coordinator links, registration toggle, winner tracking, and unique participant registration per event.
6. **`Achievement`**: Milestones, badges, and awards won by the club.
7. **`Announcement`**: Active noticeboard for general alerts, recruitment calls, and upcoming event notifications.
8. **`Partner`**: Industry collaborators, sponsors, and community partners with logo URLs and descriptions.
9. **`GalleryItem`**: Categorized photo showcase linked to events.
10. **`Application`**: Online member recruitment forms submitted by students, with status tracking (`PENDING`, `ACCEPTED`, `REJECTED`) and resume attachments.
11. **`ContactMessage`**: Public contact form inquiries with admin read flags and reply notes.
12. **`FacultyCoordinator` & `SiteMetricsConfig`**: Faculty mentor profiles and customizable stats counter overrides.

---

## 4. Platform Features & Pages

| Page / Feature | Path / Component | Description |
| :--- | :--- | :--- |
| **Home** | `src/pages/Home.tsx` | Hero section, animated metric counters, featured projects, latest announcements, and quick recruitment banner. |
| **About** | `src/pages/About.tsx` | Club vision, mission, timeline, core values, and Faculty Coordinator section. |
| **Divisions** | `src/pages/Divisions.tsx` | Interactive breakdown of technical & non-technical divisions with ongoing work & skills. |
| **Team Directory** | `src/pages/Team.tsx` | Directory of leadership and active club members with filters and social links. |
| **Events Hub** | `src/pages/Events.tsx` | Upcoming, ongoing, and past events calendar with instant registration modals. |
| **Projects Showcase** | `src/pages/Projects.tsx` | Filterable gallery of active & completed club projects with progress bars & live links. |
| **Gallery** | `src/pages/Gallery.tsx` | Media grid categorized by events, workshops, and hackathons. |
| **Partners** | `src/pages/Partners.tsx` | Industry sponsors, community partners, and collaboration request callout. |
| **Join Us** | `src/pages/JoinUs.tsx` | Recruitment portal with multi-step application form, division selector, and resume input. |
| **Contact** | `src/pages/Contact.tsx` | Interactive contact form, map location, and social media handles. |
| **Admin Dashboard** | `src/pages/AdminDashboard.tsx` | Comprehensive management portal for CRUD operations across members, events, applications, messages, and database backup/restore. |
| **Interactive Canvas** | `src/components/InnovationNetwork.tsx` | Dynamic background canvas with floating nodes and interactive force physics. |

---

## 5. File Structure Summary

```
club/
├── index.html                   # HTML template
├── package.json                 # Frontend dependencies (React 19, Vite, Tailwind v4)
├── vite.config.ts               # Vite configuration
├── src/
│   ├── App.tsx                  # Root component & Hash router
│   ├── App.css / index.css      # Styling tokens & Tailwind directives
│   ├── components/              # Shared UI components (Navbar, Footer, Canvas, etc.)
│   ├── context/                 # DatabaseContext state management & persistence
│   ├── data/                    # Initial seed data for fallback / initial load
│   └── pages/                   # 12 page views (Home, About, AdminDashboard, etc.)
└── backend/
    ├── package.json             # Backend dependencies (Express, Prisma, Argon2, JWT)
    ├── prisma/
    │   └── schema.prisma        # Complete PostgreSQL relational schema
    └── src/
        ├── app.ts / server.ts   # Express server initialization
        ├── controllers/         # Auth and endpoint controllers
        ├── middlewares/         # JWT Auth & error handling middlewares
        ├── routes/              # Express API route declarations
        ├── schemas/             # Zod input validation schemas
        └── utils/               # Argon2 password & JWT helpers
```

---

## 6. Current Operational Status & Deployment Readiness

1. **Frontend**: Fully constructed, responsive, and visually styled with sleek dark theme, glassmorphism UI, and interactive animations. Operates out-of-the-box using local storage persistence and mock data.
2. **Backend**: Relational database schema (`schema.prisma`), TypeScript server setup, Argon2 authentication system, and JWT token authorization structures are complete.
3. **Data Sync**: Frontend currently includes a full import/export feature for JSON backups, ready for seamless API integration when the PostgreSQL instance and backend service are online.

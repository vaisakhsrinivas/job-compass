# JobTracker — Track every job application from apply to offer, in one place.

## Why This Exists

Job hunting is chaotic. Between dozens of applications, scattered browser tabs, and lost follow-up emails, it's easy to lose track of where you stand. JobTracker gives job seekers a single, organized dashboard to log applications, monitor their status, and stay on top of every opportunity — so nothing falls through the cracks.

## Architecture

```
┌─────────────────────────────────────────────────┐
│                   Frontend                      │
│         React + Vite + Tailwind CSS             │
│                                                 │
│  ┌───────────┐  ┌────────────┐  ┌────────────┐ │
│  │ Dashboard  │  │ Add App    │  │ App List   │ │
│  │  (stats)   │  │  (form)    │  │ (table)    │ │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘ │
│        │               │               │        │
│        └───────┬───────┴───────┬───────┘        │
│                │               │                │
│         useApplications   useAuth               │
│           (React Query)   (Auth Hook)           │
│                │               │                │
│                └───────┬───────┘                │
│                        │                        │
│              Supabase JS Client                 │
└────────────────────────┬────────────────────────┘
                         │  HTTPS / REST
┌────────────────────────┴────────────────────────┐
│               Lovable Cloud                     │
│                                                 │
│   ┌──────────────┐   ┌───────────────────────┐  │
│   │ Auth Service  │   │  PostgreSQL Database  │  │
│   │ (email/pass)  │   │  ┌─────────────────┐  │  │
│   └──────────────┘   │  │  applications    │  │  │
│                       │  │  profiles        │  │  │
│   ┌──────────────┐   │  │  user_roles      │  │  │
│   │  Row-Level   │   │  └─────────────────┘  │  │
│   │  Security    │   └───────────────────────┘  │
│   └──────────────┘                              │
└─────────────────────────────────────────────────┘
```

## Key Features

- **Dashboard overview** — At-a-glance metrics showing applied, interviewing, offers, and rejections
- **Application tracking** — Log company, position, salary range, location, and job URL for every application
- **Status management** — Move applications through stages: Applied → Interview Scheduled → Offer / Rejected
- **Tag system** — Organize applications with custom tags for easy filtering
- **Secure & private** — Row-level security ensures each user can only see their own data
- **Email authentication** — Sign up, log in, and reset your password securely

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | React 18 | Component-driven UI with a mature ecosystem |
| Build Tool | Vite | Lightning-fast HMR and optimized production builds |
| Language | TypeScript | Type safety across the entire codebase |
| Styling | Tailwind CSS | Utility-first CSS for rapid, consistent design |
| UI Components | shadcn/ui + Radix | Accessible, composable primitives with full control |
| State & Fetching | TanStack React Query | Declarative server-state caching and synchronization |
| Forms | React Hook Form + Zod | Performant forms with schema-based validation |
| Routing | React Router v6 | Declarative client-side routing with protected routes |
| Backend | Lovable Cloud | Managed database, auth, and row-level security |
| Charts | Recharts | Composable charting for the dashboard metrics |

## Deployment

1. Open the project in [Lovable](https://lovable.dev)
2. Click **Share → Publish**
3. Your app is live — no additional configuration required

To connect a custom domain, go to **Project → Settings → Domains → Connect Domain**.

## Project Structure

```
src/
├── assets/              # Logo and static images
├── components/
│   ├── ui/              # shadcn/ui primitives (Button, Card, Dialog, etc.)
│   ├── AppLayout.tsx    # Navbar and page wrapper
│   ├── NavLink.tsx      # Navigation link component
│   └── StatusBadge.tsx  # Application status indicator
├── hooks/
│   ├── useApplications.tsx  # CRUD operations for job applications
│   ├── useAuth.tsx          # Authentication state management
│   └── use-mobile.tsx       # Responsive breakpoint detection
├── integrations/
│   └── supabase/        # Auto-generated client and types
├── lib/
│   └── utils.ts         # Shared utility functions
├── pages/
│   ├── Auth.tsx         # Login / Sign-up page
│   ├── Dashboard.tsx    # Overview with metrics and charts
│   ├── AddApplication.tsx   # New application form
│   ├── Applications.tsx     # Application list with filters
│   ├── ResetPassword.tsx    # Password recovery
│   └── NotFound.tsx     # 404 page
├── App.tsx              # Routes and providers
├── main.tsx             # Entry point
└── index.css            # Design tokens and global styles
```

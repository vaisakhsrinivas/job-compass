

# Job Application Tracker

## Pages & Navigation
A clean top navbar with links to **Dashboard**, **Add Application**, and **Applications** (list view), plus a user menu for logout. Mobile-responsive with a hamburger menu.

## Authentication
- **Login/Sign Up page** with email & password using Supabase Auth
- Password reset flow with forgot password and reset page
- Protected routes — unauthenticated users redirected to login

## Database (Supabase)
- **profiles** table — auto-created on signup (id, full_name, avatar_url)
- **applications** table — company, position, status (enum: applied/interview_scheduled/offer/rejected), date_applied, notes (text), user_id (FK to auth.users), tags (text array for future AI categorization), salary_range, job_url, location, created_at, updated_at
- **user_roles** table — for future role-based access
- RLS policies so users only see/edit their own applications

## Dashboard Page
- **3 Metric Cards**: Total Applications, Interviews Scheduled, Pending Responses (applied with no further status)
- **Progress Bar Visualization**: Shows breakdown of application statuses as a segmented progress bar (e.g., 40% Applied, 30% Interview, 20% Offer, 10% Rejected)
- **Recent Activity**: List of the 5 most recently added/updated applications with company, position, status badge, and date

## Add Application Page
- Clean form with fields: Company, Position, Status (dropdown), Date Applied (date picker), Notes (textarea), Tags (multi-select/input), Job URL, Location, Salary Range
- Validation with Zod
- Success toast and redirect to list view

## Applications List View
- Table/card view of all applications with company, position, status badge, date applied
- **Filter by status** dropdown at the top
- Search by company or position name
- Click to expand/edit an application (inline or modal)
- Delete with confirmation dialog

## Design
- Clean, minimal UI using shadcn/ui components
- Soft color-coded status badges (blue=Applied, yellow=Interview, green=Offer, red=Rejected)
- Fully mobile-responsive — cards stack on mobile, table collapses to card view
- Light theme with consistent spacing


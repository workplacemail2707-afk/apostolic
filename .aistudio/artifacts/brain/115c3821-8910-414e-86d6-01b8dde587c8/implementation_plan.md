# Apostolic Carmel Girls' Secondary School Website

A minimal, mobile-first multi-page institutional website and staff content portal for Apostolic Carmel Girls' Secondary School in Buru Buru Phase V, Nairobi, built around the school's Catholic Carmel heritage, parent-first admissions access within two taps, and a persistent Express + SQLite backend.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and aesthetic choices were confirmed during clarification and govern this build. Please review and approve to begin implementation.

- **Confirmed Decision 1 — Persistence & Authentication**: Full-stack Express API paired with a local SQLite database and disk-backed file storage for uploaded images and PDF newsletters, secured with server-side staff email/password authentication and role verification.
- **Confirmed Decision 2 — Core Values Feature Band**: Deep plum (`#8A3F7D`) full-color section background with high-contrast white typography and thin line icons for all nine school values.
- **Confirmed Decision 3 — Campus & Student Photography**: Realistic generated placeholder imagery across the hero, Principal's welcome portrait, life-at-Carmel showcase, and gallery slots, framed with soft arch masks on select editorial portraits and lazy loading below the fold.
- **Confirmed Decision 4 — Hero Visit Action**: Clicking "Book a School Visit" opens an on-page modal form that captures visitor details and preferred date/time and persists directly to the database.

---

## 1. Overview & Core Concept

- **What It Does**: Delivers a fast, calm, multi-page public website covering the school's identity, history, academic pathways, admissions process, fee schedules, co-curricular life, filterable photo gallery, news articles, downloadable newsletters, and contact/visit workflows, alongside a protected `/admin` portal for staff publishing and enquiry management.
- **Target Audience**: Primarily parents and prospective Grade 10 / transfer students in Nairobi and across Kenya browsing on mobile phones (often over cellular data), plus alumni, archdiocesan partners, and school staff managing communications.
- **Key Value**: Enables a parent to reach Admissions, School Fees, or Contact/WhatsApp within two taps while giving school administrators an uncluttered, single-system dashboard to publish news, upload PDFs, and track enquiries.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Parent Admissions & Fees Discovery (2-Tap Goal)**:
   - Parent lands on the Home page → taps either the hero CTA ("Grade 10 Admissions Now Open") or one of the 4 Quick Link cards ("Admissions", "School Fees", "Academic Pathways", "Contact & Location") → arrives directly at structured requirements, term-by-term fee accordions, and the downloadable application form.
   - On mobile, a compact sticky bottom bar (`Call · WhatsApp · Apply`) keeps direct contact and application one tap away at all times without crowding the viewport.
2. **School Visit Booking & Enquiries**:
   - Tapping "Book a School Visit" opens an accessible modal dialog where parents pick a preferred weekday visiting window, student entry grade, and contact info, receiving instant confirmation upon database submission.
   - On the Contact page, parents can view the Buru Buru Phase V map embed, copy postal/physical details, or submit a validated general enquiry.
3. **News, Newsletters & Gallery Browsing**:
   - Visitors browse published news filtered by category, open full single-article reader pages, download termly newsletters/magazines (PDF), and inspect Life at Carmel photos in a filterable gallery with keyboard-accessible lightbox navigation.
4. **Staff Admin Publishing (`/admin`)**:
   - Authorized staff sign in via email and password → manage News & Events (create, edit, publish/unpublish, delete, upload cover image), upload and publish PDF Newsletters & Magazines, and review parent enquiries and visit bookings.

### Visual Identity & Theme

- **Aesthetic Direction**: Calm, editorial, reverent, and welcoming—blending institutional heritage with crisp modern restraint (~85% white/cream canvas, ~15% brand accents).
- **Color Palette & Design Tokens** (defined centrally via CSS custom properties and mapped into Tailwind & `shadcn/ui` tokens):
  - `--white` (`#FFFFFF`): Main page canvas
  - `--cream` (`#FBF8F5`): Alternating section surfaces
  - `--plum` (`#8A3F7D`) & `--plum-dark` (`#6B2F60`): Primary brand identity, wordmark, key headings, interactive links, and the single full-color Core Values band on Home
  - `--orange` (`#C2561B`) & `--amber` (`#D9822B`): High-intent primary actions ("Apply Now", "Grade 10 Admissions Now Open") and subtle feature accents
  - `--brown` (`#3B2418`): Warm body copy and grounded footer surface with white text
  - `--line` (`#E9E2DA`): 1px hairline borders and section dividers
- **Typography & Hierarchy**:
  - *Display & Headings*: `Fraunces` (weights 500–600) with balanced wrapping (`text-wrap: balance`)
  - *Body & UI*: `Inter` (weights 400–600) with tabular numerals (`tabular-nums`) for all fee tables, dates, and stat counters
  - *Type Scale*: H1 `56px/62px` desktop (fluidly scaled on mobile), H2 `40px/48px`, H3 `26px/34px`, body `17px/28px`; generous vertical section rhythm (`96px` desktop, `56px` mobile) on an `8px` spacing grid.
- **Component Styling & Restraint**:
  - `12px–16px` rounded containers, hairline borders instead of heavy shadows, pill-shaped primary buttons, thin-stroke `lucide-react` icons, and soft arch-shaped photo masks (`rounded-t-full`) on select editorial portraits.
  - Clean unboxed metadata (`Category · Date`) rather than cluttered pill-badge clusters; single-row 3-zone sticky desktop header (`Brand Wordmark — Concise Nav — Apply Now`).

### Interactive Feedback & Motion

- Gentle scroll-triggered fade-up reveals (`transform` and `opacity` only, ≤ 200–350ms settle) that automatically respect `prefers-reduced-motion`.
- Inline validation states, loading indicators during API requests, toast/banner feedback in the Admin portal, and resilient fallback containers on all media slots.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1 — Express + SQLite Full-Stack Backend over External Cloud Credentials**:
  - *Chosen Approach*: Run an Express server alongside Vite/React with SQLite persistence (`better-sqlite3`), local disk storage (`/uploads`) for PDFs and uploaded cover images, and HTTP-only signed session cookies for staff auth.
  - *Why*: Guarantees zero-configuration, immediate end-to-end functionality for enquiries, visit bookings, dynamic news, downloadable PDFs, and `/admin` workflows inside the workspace without blocking on external project keys.
  - *Alternatives Considered*: Requiring external Supabase URL/anon keys or provisioning separate cloud services, which would either leave writes mocked or introduce unnecessary setup overhead.
- **Decision 2 — Single-Origin SPA + API Routing**:
  - *Chosen Approach*: Serve both the React Router frontend and `/api/*` + `/uploads/*` routes from the unified Express server on port `3000`.
  - *Why*: Eliminates CORS complexity, keeps authentication cookies first-party, and simplifies production deployment (`npm run build` + `npm start`).
- **Decision 3 — Real Generated Assets with Downloadable Document Support**:
  - *Chosen Approach*: Generate bespoke realistic campus, classroom, chapel, sports, and leadership photography via `generate_image`, plus serve real downloadable PDF brochures/newsletters and application forms from the backend.
  - *Why*: Prevents broken external image links while letting parents genuinely download the Grade 10 application form and school newsletters.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

### Architecture & Component Diagram

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                       React 19 + TypeScript SPA                         │
│  ┌──────────────────────┐  ┌─────────────────────────────────────────┐  │
│  │ Public Layout Shell  │  │ Protected Staff Portal (/admin)         │  │
│  │ · Slim Top Bar       │  │ · Staff Sign-In (Email + Password)      │  │
│  │ · Sticky Header      │  │ · News CRUD + Publish Toggle + Upload   │  │
│  │ · Mobile Full Menu   │  │ · Newsletter PDF Upload & Manager       │  │
│  │ · Mobile Sticky Bar  │  │ · Enquiries & Visit Bookings Inbox      │  │
│  │ · 4-Col Brown Footer │  └───────────────────┬─────────────────────┘  │
│  └──────────┬───────────┘                      │                        │
│             ▼                                  │                        │
│  ┌─────────────────────────────────────────┐   │                        │
│  │ Public Pages & Shared Primitives        │   │                        │
│  │ · Home (10 sections) · About · Academics│   │                        │
│  │ · Admissions (Fees Accordion, FAQs)     │   │                        │
│  │ · School Life · Gallery (Lightbox)      │   │                        │
│  │ · News & Single Post · Newsletters      │   │                        │
│  │ · Contact (Map Embed + Enquiry Form)    │   │                        │
│  │ · VisitBookingModal & Per-Route SEO     │   │                        │
│  └──────────────────┬──────────────────────┘   │                        │
└─────────────────────┼──────────────────────────┼────────────────────────┘
                      │ JSON / Multipart REST    │ Auth Cookie + Role Guard
                      ▼                          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Express Server (Port 3000)                           │
│  · Public Endpoints: GET published posts, publications, gallery         │
│                      POST contact enquiries & school visit bookings     │
│  · Auth Endpoints:   POST login / logout, GET current staff session     │
│  · Admin Endpoints:  CRUD posts, upload media/PDFs, update enquiries    │
│  · Static Serving:   /uploads/* media + Vite dev / built dist/ SPA      │
└─────────────────────────────────────┬───────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      SQLite Database & Disk Storage                     │
│  · users (id, email, name, password_hash, role, active)                 │
│  · posts (id, slug, title, category, published_at, cover_url, body,     │
│           status, created_at, updated_at)                               │
│  · publications (id, title, term, year, kind, file_url, status)         │
│  · enquiries (id, name, phone, email, message, status, created_at)      │
│  · visit_bookings (id, parent_name, phone, email, preferred_date,       │
│                    grade_level, notes, status, created_at)              │
│  · Seeded initial staff user, news posts, newsletters, & gallery items  │
└─────────────────────────────────────────────────────────────────────────┘
```

### Data Model & State

- **Users & Role Enforcement**: Staff accounts stored in SQLite with `scrypt` salted password hashes and explicit `role` (`admin` | `editor`). Middleware verifies the HMAC-signed session cookie and queries SQLite to confirm the staff member is active and authorized before permitting any `/api/admin/*` action.
- **Public Content Filtering**: Public `GET /api/posts` and `GET /api/publications` strictly filter `WHERE status = 'published'`, ensuring unpublished drafts remain visible only inside authenticated `/admin` requests.
- **File Storage**: Uploaded cover images and PDF newsletters/magazines are persisted to local disk storage and referenced by stable URLs, alongside pre-seeded printable PDFs for the Grade 10 Application Form and sample school newsletters so downloads work immediately out of the box.

### Interactive Component & State Mapping

- **VisitBookingModal & Contact Enquiry Form**: Client-side format validation (Kenyan phone numbers, email, required fields) + async submit states + explicit error banners + confirmation receipt states backed by SQLite `POST` endpoints.
- **Admissions Fee Accordion & FAQ Accordion**: Accessible `shadcn/ui` Accordion components toggling Term 1 / Term 2 / Term 3 fee schedules (Day vs. Boarding) with `tabular-nums` alignment and FAQ disclosures.
- **Gallery Filter & Lightbox**: Category filter buttons (`All`, `Campus`, `Academics`, `Liturgy`, `Music & Debate`, `Sports`, `Boarding`) updating the masonry grid immediately, paired with an accessible modal lightbox supporting keyboard arrow keys and Escape dismissal.
- **News & Publications Views**: Category filter tabs, single-post dynamic route fetching by slug with 404 recovery, and direct file download buttons for termly newsletters.
- **Admin Dashboard**: Tabbed staff workspace (`News & Events`, `Newsletters & Magazines`, `Enquiries & Visits`) with create/edit drawers, rich formatting toolbar/textarea for article bodies, instant publish/unpublish switches, drag-or-pick file uploads, and enquiry status toggles.

### Per-Route SEO & Structured Data

- Every route updates `<title>`, `<meta name="description">`, Open Graph (`og:title`, `og:description`, `og:type`), Twitter tags, and canonical URL dynamically, backed by an embedded `School` Schema.org JSON-LD block containing Apostolic Carmel Girls' Secondary School's Nairobi address, phone, email, and educational identity.

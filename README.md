# WAV CAVE Frontend

Next.js + React + TypeScript frontend scaffold for the studio booking SaaS and marketplace product.

## Setup

1. Copy `.env.example` to `.env.local`
2. Set `NEXT_PUBLIC_API_BASE_URL` to the existing backend API origin
3. Run `npm install`
4. Run `npm run dev`

## Frontend folder structure

```text
frontend/
├─ src/
│  ├─ app/
│  │  ├─ (public)/
│  │  ├─ (auth)/
│  │  └─ app/
│  ├─ components/
│  │  ├─ booking/
│  │  ├─ layouts/
│  │  ├─ navigation/
│  │  ├─ settings/
│  │  ├─ studios/
│  │  └─ ui/
│  ├─ features/
│  │  ├─ auth/
│  │  └─ dashboard/
│  ├─ hooks/
│  ├─ lib/
│  │  ├─ api/
│  │  │  ├─ adapters/
│  │  │  └─ endpoints/
│  │  └─ mocks/
│  └─ types/
├─ .env.example
├─ package.json
└─ README.md
```

## Route structure

```text
/
/studios
/studios/[slug]
/studios/[slug]/book
/login
/register
/app
/app/studio/[slug]/dashboard
/app/studio/[slug]/bookings
/app/studio/[slug]/calendar
/app/studio/[slug]/blocks
/app/studio/[slug]/settings/profile
/app/studio/[slug]/settings/contact
/app/studio/[slug]/settings/branding
/app/studio/[slug]/settings/booking
/app/studio/[slug]/settings/public-page
```

## Shared component structure

```text
layouts/
- AppLayout
- PublicLayout

navigation/
- Navbar
- Footer
- DashboardSidebar

studios/
- StudioCard
- StudioGrid
- SearchBar
- FilterPanel

booking/
- BookingForm
- BookingSummary

settings/
- SettingsFormSection
- SettingsTabs

ui/
- Button
- SurfaceCard
- StatCard
- NoticeBanner
- EmptyState
- LoadingCard
```

## API client structure

```text
lib/api/
├─ client.ts
├─ endpoints/
│  ├─ public-api.ts
│  ├─ auth-api.ts
│  └─ admin-api.ts
└─ adapters/
   ├─ booking-pricing.adapter.ts
   ├─ dashboard-insights.adapter.ts
   └─ studio-reviews.adapter.ts
```

### Real endpoint usage

- `public-api.ts`
  - marketplace home
  - studio search
  - studio profile
  - availability
  - pricing
  - payment intent creation
- `auth-api.ts`
  - login
  - register
  - logout
  - current user
  - accessible studios
- `admin-api.ts`
  - studio profile
  - publication
  - settings
  - media
  - bookings
  - team
  - blocks

### Placeholder adapters

- `studio-reviews.adapter.ts`
  - backend currently returns `501` for reviews, so the UI shows an explicit placeholder
- `booking-pricing.adapter.ts`
  - deposit pricing is intentionally treated as placeholder data until a public quote endpoint exists
- `dashboard-insights.adapter.ts`
  - analytics-style insight card is isolated behind a mock adapter instead of inventing backend behavior

## Notes

- Public marketplace and operator pages share the same design system and tokens.
- Dashboard pages are structured to keep API integration isolated from page markup.
- The scaffold builds successfully with `npm run build`.
- Lint currently reports two non-blocking warnings for raw remote `<img>` usage. Those can be replaced with `next/image` once remote image host policy is finalized.

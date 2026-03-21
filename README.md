# WAVBOOK Monorepo

This repository now contains three coordinated applications:

- the original Next.js web frontend in the repo root
- a new Railway-ready Node.js backend in `/backend`
- a new Expo React Native app in `/mobile`

The existing web UI remains in place and now targets the new backend through the existing API client layer.

## Repo structure

```text
.
├─ backend/                # Express + TypeScript + Prisma + PostgreSQL + Stripe + Auth0
├─ mobile/                 # Expo React Native app
├─ src/                    # Existing Next.js frontend
├─ package.json            # Web app scripts plus backend/mobile helpers
└─ README.md
```

## Web frontend

### Run the existing web app

1. Copy `.env.example` to `.env.local`.
2. Set `NEXT_PUBLIC_API_BASE_URL` to the backend origin.
3. Set the Auth0 public values for the web app.
4. Run `npm install`.
5. Run `npm run dev`.

### Web env vars

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=YOUR_STRIPE_PUBLISHABLE_KEY
NEXT_PUBLIC_AUTH0_DOMAIN=YOUR_AUTH0_DOMAIN
NEXT_PUBLIC_AUTH0_CLIENT_ID=YOUR_AUTH0_CLIENT_ID
NEXT_PUBLIC_AUTH0_AUDIENCE=YOUR_AUTH0_API_AUDIENCE
NEXT_PUBLIC_AUTH0_REDIRECT_URI=http://localhost:3000/callback
```

### What changed in the web app

- Public marketplace, studio detail, and booking flows still use the existing component structure.
- Operator auth now redirects through Auth0 and stores the access token client-side.
- Existing API endpoint wrappers continue to power the dashboard/settings pages, but now attach the bearer token for protected backend routes.

## Backend

See [`backend/README.md`](backend/README.md) for full setup, Railway deployment, database migration, Auth0, and Stripe webhook instructions.

### Quick start

```bash
cd backend
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
npm run dev
```

## Mobile app

See [`mobile/README.md`](mobile/README.md) for focused mobile instructions.

### Quick start

```bash
cd mobile
cp .env.example .env
npm install
npm run start
```

### Mobile env vars

```bash
EXPO_PUBLIC_API_URL=YOUR_BACKEND_URL
EXPO_PUBLIC_AUTH0_DOMAIN=YOUR_AUTH0_DOMAIN
EXPO_PUBLIC_AUTH0_CLIENT_ID=YOUR_AUTH0_CLIENT_ID
EXPO_PUBLIC_AUTH0_AUDIENCE=YOUR_AUTH0_API_AUDIENCE
```

## Root helper scripts

```bash
npm run dev            # web frontend
npm run backend:dev    # backend
npm run mobile:start   # mobile
```

# WAVBOOK Backend

Production-minded Express + TypeScript backend for WAVBOOK.

## Stack

- Node.js + Express
- TypeScript
- PostgreSQL via Prisma
- Stripe payment intents + webhooks
- Auth0 JWT protection
- Railway-friendly build/start flow

## Folder structure

```text
backend/
├─ prisma/
├─ src/
│  ├─ app.ts
│  ├─ server.ts
│  ├─ config/
│  ├─ controllers/
│  ├─ db/
│  ├─ lib/
│  ├─ middleware/
│  ├─ routes/
│  ├─ services/
│  └─ types/
├─ .env.example
├─ Dockerfile
├─ package.json
├─ railway.json
└─ tsconfig.json
```

## Required environment variables

```bash
DATABASE_URL=YOUR_DATABASE_URL
ADMIN_INVITE_CODE=YOUR_ADMIN_INVITE_CODE
ALLOWED_ORIGINS=https://your-frontend-domain.com,http://localhost:3000,exp://127.0.0.1:8081
COOKIE_SECRET=YOUR_COOKIE_SECRET
STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET_KEY
STRIPE_PUBLISHABLE_KEY=YOUR_STRIPE_PUBLISHABLE_KEY
WEBHOOK_SECRET_ACCOUNTS=YOUR_WEBHOOK_SECRET_ACCOUNTS
WEBHOOK_SECRET_PAYMENTS=YOUR_WEBHOOK_SECRET_PAYMENTS
AUTH0_DOMAIN=YOUR_AUTH0_DOMAIN
AUTH0_AUDIENCE=YOUR_AUTH0_API_AUDIENCE
AUTH0_ISSUER_BASE_URL=YOUR_AUTH0_ISSUER_BASE_URL
AUTH0_ADMIN_ROLE=admin
AUTH0_MANAGER_ROLE=manager
AUTH0_OWNER_ROLE=owner
APP_BASE_URL=https://your-frontend-domain.com
PORT=4000
```

## Local development

```bash
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
npm run dev
```

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run typecheck`
- `npm run prisma:generate`
- `npm run prisma:migrate`
- `npm run prisma:deploy`
- `npm run db:push`
- `npm run db:seed`

## Auth0 setup

1. Create one Auth0 Application for the web app and one for the Expo mobile app.
2. Create one Auth0 API and set its identifier to the value used in `AUTH0_AUDIENCE`.
3. Set the API signing algorithm to `RS256`.
4. Add allowed callback URLs:
   - Web: `http://localhost:3000/callback`
   - Mobile: `wavbook://`
5. Add allowed logout URLs:
   - Web: `http://localhost:3000/login`
   - Mobile: `wavbook://`
6. Add allowed web origins for the web frontend domain.
7. Ensure access tokens include the `email` claim or configure Auth0 actions/rules so the backend can create/sync operator profiles cleanly.
8. The backend validates bearer JWTs using `AUTH0_ISSUER_BASE_URL` and `AUTH0_AUDIENCE`.
9. Operator provisioning requires calling `POST /api/auth/register` with a valid bearer token and the `ADMIN_INVITE_CODE`.

## Stripe setup

1. Create or reuse a Stripe account.
2. Put the secret key in `STRIPE_SECRET_KEY`.
3. Point your public app(s) at the backend payment-intent route.
4. Create two webhook endpoints in Stripe:
   - `POST /api/webhooks/stripe/payments`
   - `POST /api/webhooks/stripe/accounts`
5. Copy the signing secret for each endpoint into:
   - `WEBHOOK_SECRET_PAYMENTS`
   - `WEBHOOK_SECRET_ACCOUNTS`
6. The backend uses raw request bodies on webhook routes so Stripe signature verification stays valid.

## Railway deployment

1. Create a Railway project.
2. Deploy the `/backend` directory as the service root.
3. Add all environment variables from `.env.example`.
4. Ensure `PORT` is provided by Railway or defaults correctly.
5. Run migrations with `npm run prisma:deploy`.
6. Start the app with `npm run start`.

## Railway Database Setup

1. In Railway, create a new project or open the existing project for the backend service.
2. Add a **PostgreSQL** service from Railway's service templates.
3. After Railway provisions the database, open the PostgreSQL service and copy the generated `DATABASE_URL` connection string.
4. Open your backend service variables in Railway and paste that value into the `DATABASE_URL` environment variable.
5. In the same Railway variables screen, add the remaining backend env vars from `.env.example`, including Auth0, Stripe, `ALLOWED_ORIGINS`, and `ADMIN_INVITE_CODE`.
6. Run migrations against Railway by using a Railway shell/command with `npm run prisma:deploy` from the `/backend` folder.
7. Verify the database connection by checking the backend deploy logs for a successful startup message and by requesting `GET /api/public/health` after deployment.
8. Confirm the tables were created by opening the Railway PostgreSQL data browser or connecting with any PostgreSQL client and checking for tables such as `Studio`, `Booking`, `AvailabilityBlock`, and `UserProfile`.

## API highlights

- `GET /api/public/health`
- `GET /api/public/marketplace/home`
- `GET /api/public/studios`
- `GET /api/public/studios/:slug`
- `GET /api/public/studios/:slug/availability`
- `GET /api/public/bookings/prices`
- `POST /api/public/bookings/payment-intents`
- `GET /api/public/bookings/payment-intents/:paymentIntentId/status`
- `GET /api/auth/me`
- `GET /api/auth/studios`
- `POST /api/auth/register`
- `GET /api/admin/studio`
- `PATCH /api/admin/studio`
- `GET /api/admin/bookings`
- `GET /api/admin/blocks`
- `POST /api/admin/blocks`
- `GET /api/admin/team`

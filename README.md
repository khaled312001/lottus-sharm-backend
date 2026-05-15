# Lotus Sharm — Backend

Express + TypeScript + Prisma + MySQL backend for the Lotus Sharm Tourism website.

## Quick start (local)

```bash
# 1. install deps
npm install

# 2. create .env from example, fill DATABASE_URL etc.
cp .env.example .env

# 3. generate Prisma client + run migrations
npm run prisma:generate
npm run prisma:migrate -- --name init

# 4. seed admin + first trip + static pages
npm run seed

# 5. (optional) import all images/videos from a folder into the Media library
npm run seed:media -- "E:/Lotus Sharm Tourism/Images & Videos"

# 6. start dev server
npm run dev
# → API listening on http://localhost:4000/api
```

Default admin login after seeding: `admin@lotussharm.com` / `ChangeMe!Lotus2026` (change in `.env`).

## Available scripts

| Script | Description |
|---|---|
| `npm run dev` | start dev server with tsx watch |
| `npm run build` | compile TS → `dist/` |
| `npm start` | run compiled server (`node dist/server.js`) |
| `npm run prisma:generate` | regen Prisma client |
| `npm run prisma:migrate` | create + apply a new migration (dev) |
| `npm run prisma:deploy` | apply pending migrations (prod) |
| `npm run prisma:studio` | open Prisma Studio GUI |
| `npm run seed` | seed admin, first trip (Ras Mohammed), settings, pages |
| `npm run seed:media -- <path>` | bulk-import a folder of images/videos |

## API surface

All endpoints under `/api`. Public ones under `/api/public/*`, admin ones (JWT required) under `/api/admin/*`.

- **Auth:** `POST /api/auth/login`, `POST /api/auth/refresh`, `POST /api/auth/logout`, `GET /api/auth/me`
- **Public:** `/public/trips`, `/public/trips/:slug`, `/public/bookings`, `/public/payments/stripe/checkout`, `/public/payments/manual`, `/public/contact`, `/public/newsletter/subscribe`, `/public/blog`, `/public/pages/:slug`, `/public/settings`, `/public/reviews/:tripId`
- **Admin:** `/admin/trips`, `/admin/bookings`, `/admin/payments`, `/admin/coupons`, `/admin/blog`, `/admin/pages`, `/admin/contact`, `/admin/newsletter`, `/admin/reviews`, `/admin/customers`, `/admin/users`, `/admin/settings`, `/admin/media`, `/admin/stats/dashboard`, `/admin/translate`
- **Webhooks:** `POST /api/webhooks/stripe` (raw body, Stripe signature)

## Deployment

### Auto (GitHub Actions)
Push to `main` triggers `.github/workflows/deploy.yml` which builds, uploads via SCP, then SSHs into Hostinger to extract → install → migrate → `pm2 reload`.

Required GitHub Actions secrets:
- `HOST` — `145.79.20.56`
- `SSH_USER` — `u405809647`
- `SSH_PORT` — `65002`
- `SSH_KEY` — private SSH key with access to the Hostinger account (add public part via SSH key import in hPanel)

### Manual (Python fallback)
```bash
export HOSTINGER_PASS='your-ssh-password'
pip install paramiko scp
python scripts/deploy.py --target backend
```

### First-time server bootstrap (one SSH session)
```bash
ssh -p 65002 u405809647@145.79.20.56
# Install Node 20 + PM2 if missing
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
npm i -g pm2
mkdir -p ~/lottus-backend/uploads ~/lottus-backend/logs ~/deploy
# Place your production .env at ~/lottus-backend/.env
```

## Architecture notes

- **i18n strategy:** every translatable model has a `*Translation` table keyed by `[entityId, locale]`. Saves a JOIN but keeps SEO/filtering easy.
- **Media pipeline:** Multer in-memory → Sharp → write 3 sizes (`original`, `medium-1280px`, `thumb-400px`) under `uploads/YYYY/MM/uuid.{ext}` → DB row in `Media`.
- **Auth:** JWT in httpOnly cookies + optional `Authorization: Bearer` header for clients that prefer it. Admin pages on the frontend use Bearer from localStorage.
- **Webhook safety:** Stripe webhook is mounted BEFORE `express.json()` and consumes raw body to satisfy signature verification.
- **AI translate:** `/api/admin/translate` calls Gemini 1.5 Flash with `responseMimeType: application/json` to enforce a parseable result.

## Tech stack

Node 20 · Express 4 · TypeScript · Prisma 5 · MySQL · Sharp · Stripe · Nodemailer · Zod · JWT · bcryptjs · PM2

# Dimpho ke Lesego Catering Backend

Node.js/Express backend for the Dimpho ke Lesego Catering website.

## Stack

- Node.js + Express
- TypeScript
- TypeORM
- SQLite for local/demo storage
- Free WhatsApp click-to-chat links

## Setup

```bash
npm install
npm run build
npm run dev
```

Local server:

```text
http://localhost:8080
```

## Environment

Copy `.env.example` to `.env`.

```env
NODE_ENV=development
PORT=8080
DB_PATH=data/dimpho_catering.sqlite
ADMIN_WHATSAPP_NUMBER=+27796929591
WHATSAPP_NUMBER=27796929591
```

## API

- `POST /api/contacts`
- `POST /api/bookings`
- `GET /api/availability/blocked-dates`
- `GET /api/coupons/validate`
- `POST /api/orders`
- `GET /api/bookings/lookup/:id`
- `GET /api/admin/contacts`
- `GET /api/admin/bookings`
- `GET /api/admin/orders`

## WhatsApp

Orders return a `businessWhatsappLink`. The frontend uses that link for the `Send Order on WhatsApp` button.

This is the free WhatsApp method. It opens WhatsApp with the order message filled in; the customer taps Send.

## Vercel

See `VERCEL_DEPLOY.md`.

SQLite on Vercel is temporary because serverless storage is not permanent. For production order history, use a hosted database later.

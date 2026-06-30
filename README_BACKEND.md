# Dimpho ke Lesego Catering Backend

Node.js/Express backend for the Dimpho ke Lesego Catering website.

## Stack

- Node.js + Express
- TypeScript
- MongoDB Atlas for permanent production storage
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
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=dimpho_ke_lesego_catering
ADMIN_API_KEY=change-this-long-random-secret
ADMIN_WHATSAPP_NUMBER=+27796929591
WHATSAPP_NUMBER=27796929591
```

## API

- `POST /api/contacts`
- `POST /api/bookings`
- `GET /api/availability/blocked-dates`
- `GET /api/coupons/validate`
- `POST /api/orders`
- `GET /api/bookings/lookup/:id?token=...`
- `GET /api/orders/lookup/:ref?token=...`
- `GET /api/admin/contacts`
- `GET /api/admin/bookings`
- `GET /api/admin/orders`

Order and booking lookup endpoints require the private token returned when the customer creates the order or booking.

## WhatsApp

Orders return a `businessWhatsappLink`. The frontend uses that link for the `Send Order on WhatsApp` button.

This is the free WhatsApp method. It opens WhatsApp with the order message filled in; the customer taps Send.

## Netlify

See `netlify.toml`.

Set `MONGODB_URI` on Netlify to a MongoDB Atlas connection string. Without it, the serverless API refuses to start because temporary filesystem storage is not permanent.

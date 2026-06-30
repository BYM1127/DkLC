# Vercel Deployment

## Required settings

Build command:

```bash
npm install && npm run build
```

Output directory:

Leave blank. The Express app is served through `api/index.js`.

## Environment variables

Add these in Vercel Project Settings > Environment Variables:

```env
NODE_ENV=production
ADMIN_WHATSAPP_NUMBER=+27796929591
WHATSAPP_NUMBER=27796929591
```

WhatsApp uses the free click-to-chat method. After an order is placed, the customer gets a pre-filled WhatsApp button and taps Send to deliver the order details and order reference to the business number.

## Important note

This project currently uses SQLite. On Vercel, SQLite is stored in `/tmp`, so it is fine for demos and testing but not permanent order storage. For production order history, move the data to a hosted database such as Vercel Postgres, Supabase, Neon, or Railway Postgres.

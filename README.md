# Dimpho ke Lesego Catering

Dimpho ke Lesego Catering is a catering website and backend API for handling customer enquiries, event booking requests, food orders, coupon validation, admin order management, and WhatsApp click-to-chat notifications.

The repository contains two backend implementations:

- A primary Node.js/TypeScript Express API with SQLite and TypeORM.
- A .NET backend project under `DimphoKeLesegoCateringBackend/`.

The Node.js API is the deployment-ready path used by the root `package.json`, `netlify.toml`, `render.yaml`, and `netlify/functions/api.js` serverless entry point.

## Features

- Public catering website served from `DimphoKeLesegoCateringBackend/wwwroot`.
- Contact form storage and admin lookup.
- Event booking requests with blocked-date checks.
- Online food order capture with order references.
- Coupon validation and automatic coupon seeding.
- Admin endpoints for contacts, bookings, and orders.
- Booking and order status updates.
- WhatsApp click-to-chat links for customer and business notifications.
- SQLite persistence for simple local and hosted deployments.
- Netlify and Render deployment configuration.

## Tech Stack

- Node.js
- TypeScript
- Express
- TypeORM
- SQLite
- PostgreSQL for permanent production order storage
- Nodemailer, currently used alongside notification/WhatsApp helpers
- ASP.NET Core / EF Core SQLite for the alternate .NET backend

## Repository Structure

```text
.
|-- netlify/
|   `-- functions/
|       `-- api.js                      # Netlify serverless function entry point
|-- src/                                # Node.js/TypeScript backend
|   |-- entities/                       # TypeORM database models
|   |-- routes/                         # Public and admin API routes
|   |-- services/                       # Email/WhatsApp notification services
|   |-- app.ts                          # Express app configuration
|   |-- database.ts                     # SQLite + TypeORM setup
|   `-- index.ts                        # Local server entry point
|-- DimphoKeLesegoCateringBackend/      # ASP.NET Core backend and static site
|   |-- Controllers/                    # .NET API controllers
|   |-- Data/                           # EF Core database context
|   |-- Models/                         # .NET data models
|   |-- Services/                       # .NET notification service
|   `-- wwwroot/                        # Static website files
|-- package.json                        # Node scripts and dependencies
|-- netlify.toml                        # Netlify deployment configuration
|-- render.yaml                         # Render deployment configuration
`-- .env.example                        # Example environment variables
```

## Requirements

- Node.js 18 or newer recommended.
- npm.
- SQLite support through the `sqlite3` npm package.
- Optional: .NET SDK compatible with the target framework in `DimphoKeLesegoCateringBackend/DimphoKeLesegoCateringBackend.csproj`.

## Getting Started

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

On Windows PowerShell, use:

```powershell
Copy-Item .env.example .env
```

Start the development server:

```bash
npm run dev
```

By default, the app runs at:

```text
http://localhost:3000
```

The API is available under:

```text
http://localhost:3000/api
```

## Environment Variables

The application reads environment variables from `.env` using `dotenv`.

| Variable | Default | Description |
| --- | --- | --- |
| `NODE_ENV` | `development` | Runtime environment. |
| `PORT` | `3000` | Local HTTP server port. |
| `DB_PATH` | `data/dimpho_catering.sqlite` | Local SQLite database path. Used only when `DATABASE_URL` is not set. |
| `DATABASE_URL` | none | Hosted Postgres connection string for permanent production storage. Required on Netlify. |
| `DATABASE_SSL` | `true` | Set to `false` only if your database does not require SSL. |
| `ADMIN_WHATSAPP_NUMBER` | From `.env.example` | Business WhatsApp number used for admin notification links. |
| `WHATSAPP_NUMBER` | From `.env.example` | Public/business WhatsApp number used by the website. |
| `SMTP_HOST` | `smtp.gmail.com` in example | SMTP host for email-capable notification flows. |
| `SMTP_PORT` | `587` in example | SMTP port. |
| `SMTP_USER` | none | SMTP username. |
| `SMTP_PASSWORD` | none | SMTP password or app password. |
| `SMTP_FROM` | none | Sender address. |
| `ADMIN_EMAIL` | none | Business/admin email address. |

Do not commit `.env`, local database files, generated build folders, or runtime logs.

## Database

The Node.js API uses TypeORM.

- Local default database: SQLite at `data/dimpho_catering.sqlite`
- Production database: hosted Postgres through `DATABASE_URL`
- Schema synchronization is enabled in `src/database.ts`.
- Initial coupons are seeded automatically when the coupon table is empty:
  - `WELCOME10`: 10% discount
  - `DKL50`: R50 fixed discount

Because SQLite files are local runtime data, they are ignored by Git. On Netlify, `DATABASE_URL` is required so order, booking, contact, and coupon data is stored permanently.

## Available Scripts

```bash
npm run dev
```

Starts the TypeScript development server using `ts-node`.

```bash
npm run build
```

Compiles TypeScript into `dist/`.

```bash
npm start
```

Runs the compiled app from `dist/index.js`.

```bash
npm run typeorm
```

Runs the configured TypeORM CLI.

## Public Pages

The Express app serves static files from:

```text
DimphoKeLesegoCateringBackend/wwwroot
```

Important pages:

- `/` serves `index.html`.
- `/quote.html` serves the quote/order page.
- Non-API fallback routes return `index.html`.

## API Reference

### Public Endpoints

#### `POST /api/contacts`

Creates a contact message.

Required fields:

- `name`
- `message`

Optional fields:

- `email`
- `phone`

Success response:

```json
{
  "success": true,
  "id": 1
}
```

#### `POST /api/bookings`

Creates a booking request after checking blocked dates.

Required fields:

- `name`
- `phone`

Optional fields:

- `email`
- `eventType`
- `eventDate`
- `estimatedGuests`
- `preferredPackage`
- `fulfilmentType`
- `notes`

Success response:

```json
{
  "success": true,
  "id": 1
}
```

#### `GET /api/availability/blocked-dates`

Returns an array of blocked booking dates.

Example response:

```json
["2026-07-10", "2026-07-12"]
```

#### `GET /api/coupons/validate?code=WELCOME10&amount=500`

Validates a coupon and calculates the discount.

Success response:

```json
{
  "valid": true,
  "discount": 50,
  "newTotal": 450,
  "code": "WELCOME10"
}
```

#### `POST /api/orders`

Creates a customer order.

Required fields:

- `name`
- `phone`
- `items`

Optional fields:

- `email`
- `fulfilmentType`
- `deliveryAddress`
- `dateNeeded`
- `timeNeeded`
- `notes`
- `couponApplied`

Item shape:

```json
{
  "itemId": "platter-1",
  "name": "Snack Platter",
  "price": 350,
  "quantity": 2,
  "isPackage": false
}
```

Success response includes an order reference, total, discount, and WhatsApp links:

```json
{
  "success": true,
  "orderRef": "DKL-123456",
  "total": 700,
  "discount": 0,
  "customerWhatsappLink": "https://wa.me/...",
  "businessWhatsappLink": "https://wa.me/..."
}
```

#### `GET /api/bookings/lookup/:id`

Returns a single booking request by numeric ID.

#### `GET /api/orders/lookup/:ref`

Returns a single order by reference, for example:

```text
/api/orders/lookup/DKL-123456
```

### Admin Endpoints

These routes currently do not include authentication. Add authentication before exposing the admin API publicly.

#### `GET /api/admin/contacts`

Returns contact messages ordered newest first.

#### `GET /api/admin/bookings`

Returns booking requests ordered newest first.

#### `PUT /api/admin/bookings/:id/status`

Updates a booking status.

Request body:

```json
{
  "status": "Confirmed"
}
```

#### `GET /api/admin/orders`

Returns orders ordered newest first.

#### `PUT /api/admin/orders/:id/status`

Updates an order status.

Request body:

```json
{
  "status": "Completed"
}
```

#### `POST /api/admin/send-whatsapp`

Queues or logs a manual WhatsApp message through the notification service.

Request body:

```json
{
  "to": "27790000000",
  "message": "Hello from Dimpho ke Lesego Catering"
}
```

#### `POST /api/admin/send-email`

Backward-compatible alias for the WhatsApp send endpoint.

## Deployment

### Netlify

This project includes:

- `netlify.toml`
- `netlify/functions/api.js`

Build locally before deployment:

```bash
npm run build
```

The Netlify function imports the compiled Express app from `dist/app`, so the TypeScript build must complete successfully before the serverless API can run.

Netlify settings are defined in `netlify.toml`:

- Build command: `npm install && npm run build`
- Publish directory: `DimphoKeLesegoCateringBackend/wwwroot`
- Functions directory: `netlify/functions`
- API redirect: `/api/*` to the Netlify function
- Required database variable: `DATABASE_URL`

Set production environment variables in the Netlify dashboard. Avoid relying on local `.env` files in production.

Netlify's filesystem is temporary and read-only outside `/tmp`, so this app requires a hosted Postgres database in production. Good options include Supabase, Neon, Railway, Render Postgres, or any Postgres service that gives you a connection string.

### Render

This project includes `render.yaml` and a root `Procfile`.

Typical Render setup:

- Build command: `npm install && npm run build`
- Start command: `npm start`
- Add the same environment variables from `.env.example`.

For production, use persistent storage or a hosted database if order and booking history must survive redeploys.

## Running the .NET Backend

The alternate ASP.NET Core backend lives in `DimphoKeLesegoCateringBackend/`.

From the repository root:

```bash
dotnet run --project DimphoKeLesegoCateringBackend
```

The .NET project uses EF Core with SQLite and creates the database on startup. Its static files are served from `wwwroot`.

## Notes for Contributors

- Keep `.env` local and private.
- Keep generated folders such as `dist/`, `bin/`, `obj/`, and `node_modules/` out of Git.
- Keep runtime SQLite database files out of Git.
- Keep runtime WhatsApp/email logs out of Git.
- Update `.env.example` when new environment variables are introduced.
- Add authentication before exposing admin routes in production.

## Related Documentation

Additional setup notes are included in:

- `EMAIL_SETUP.md`
- `WHATSAPP_SETUP.md`
- `README_BACKEND.md`
- `README_DEPLOY.md`
- `SETUP_COMPLETE.md`

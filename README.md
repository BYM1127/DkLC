# Dimpho ke Lesego Catering

Dimpho ke Lesego Catering is a catering website and backend API for handling customer enquiries, event booking requests, food orders, coupon validation, admin order management, and WhatsApp click-to-chat notifications.

The repository contains two backend implementations:

- A primary Node.js/TypeScript Express API with MongoDB Atlas.
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
- MongoDB Atlas persistence for permanent hosted deployments.
- Netlify and Render deployment configuration.

## Tech Stack

- Node.js
- TypeScript
- Express
- MongoDB Atlas for permanent production order storage
- Nodemailer, currently used alongside notification/WhatsApp helpers
- ASP.NET Core / EF Core SQLite for the alternate .NET backend

## Repository Structure

```text
.
|-- netlify/
|   `-- functions/
|       `-- api.js                      # Netlify serverless function entry point
|-- src/                                # Node.js/TypeScript backend
|   |-- entities/                       # API data models
|   |-- routes/                         # Public and admin API routes
|   |-- services/                       # Email/WhatsApp notification services
|   |-- app.ts                          # Express app configuration
|   |-- database.ts                     # MongoDB Atlas setup
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
- MongoDB Atlas connection string for deployed order storage.
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
| `MONGODB_URI` | none | MongoDB Atlas connection string. Required on Netlify. |
| `MONGODB_DB` | `dimpho_ke_lesego_catering` | MongoDB database name. |
| `ADMIN_API_KEY` | none | Secret required for admin API routes on Netlify. |
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

The Node.js API stores data in MongoDB Atlas through the official MongoDB driver.

- Production database: MongoDB Atlas through `MONGODB_URI`
- Data is stored in separate collections for contacts, bookings, orders, coupons, blocked dates, and counters.
- Initial coupons are seeded automatically when the coupon table is empty:
  - `WELCOME10`: 10% discount
  - `DKL50`: R50 fixed discount

On Netlify, `MONGODB_URI` is required so order, booking, contact, and coupon data is stored permanently in MongoDB Atlas.

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
  "id": 1,
  "accessToken": "private-booking-token"
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
  "accessToken": "private-order-token",
  "total": 700,
  "discount": 0,
  "customerWhatsappLink": "https://wa.me/...",
  "businessWhatsappLink": "https://wa.me/..."
}
```

#### `GET /api/bookings/lookup/:id`

Returns a single booking request by numeric ID only when the private `token` query parameter from the original booking response is provided.

#### `GET /api/orders/lookup/:ref`

Returns a single order by reference only when the private `token` query parameter from the original order response is provided, for example:

```text
/api/orders/lookup/DKL-123456?token=private-order-token
```

### Admin Endpoints

These routes require `ADMIN_API_KEY` on Netlify. Send it as an `x-admin-api-key` header or as a `Bearer` token.

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
- Required database variable: `MONGODB_URI`
- Recommended database name variable: `MONGODB_DB`
- Required admin variable: `ADMIN_API_KEY`

Set production environment variables in the Netlify dashboard. Avoid relying on local `.env` files in production.

Netlify's filesystem is temporary and read-only outside `/tmp`, so this app requires MongoDB Atlas in production. Add `MONGODB_URI` in Netlify environment variables before using order, booking, contact, coupon, or admin APIs.

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
- Keep runtime database files out of Git.
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

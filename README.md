# Dimpho ke Lesego Catering

A modern, responsive catering website and admin dashboard built for Dimpho ke Lesego Catering, based in Mamaila Village, South Africa. This application handles customer quote requests, contact form submissions, and menu building, all managed through a secure admin dashboard and backed by Google Sheets.

## Features

- **Public Customer Website**: Beautiful, responsive landing pages including Home, Menu, Portfolio, and Contact.
- **Dynamic Menu Builder**: Allows customers to build their own custom catering menu before requesting a quote.
- **Quote Generation**: Captures detailed event logistics (date, venue, guest count, provisioning preferences) and calculates travel requirements.
- **Secure Admin Dashboard**: A protected area for the business owner to manage quotes, reply to customers directly via Gmail, and manage the website's portfolio.
- **Google Sheets Integration**: All quotes and contacts are permanently stored in a connected Google Spreadsheet acting as a lightweight, free database.
- **SEO & Social Ready**: Fully optimized with a `sitemap.xml`, `robots.txt`, Open Graph meta tags, and verified with Google Search Console.
- **Legal Pages**: Professional, formal templates for Privacy Policy, Accessibility Statement, Terms & Conditions, and Refund Policy.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, CSS Grid/Flexbox
- **Backend**: Vercel Serverless Functions (Node.js)
- **Database**: Google Sheets API
- **Deployment**: Vercel (`@vercel/static-build` and `@vercel/node`)

## Repository Structure

```text
.
|-- api/                       # Vercel Serverless Functions (Backend API)
|   |-- contacts.ts            # Handles contact form submissions
|   |-- quotes.ts              # Handles quote requests
|   `-- sheets.ts              # Google Sheets API connection helper
|-- frontend/                  # React Frontend Application
|   |-- public/                # Static assets, sitemap, robots.txt
|   |-- src/
|   |   |-- components/        # Reusable React components (Navbar, Footer)
|   |   |-- context/           # React Context (Admin Auth)
|   |   |-- pages/             # Main pages (Home, Quote, BuildMenu, Legal)
|   |   `-- index.css          # Global styles, variables, and responsive design
|   |-- index.html             # Entry HTML
|   `-- package.json           # Frontend dependencies and Vite scripts
|-- vercel.json                # Vercel deployment and routing configuration
`-- .env.example               # Example environment variables
```

## Getting Started

### 1. Requirements
- Node.js 18 or newer
- npm
- A Google Cloud Service Account (for Sheets integration)

### 2. Installation
Install dependencies for both the root (if any) and the frontend:
```bash
npm install
cd frontend
npm install
cd ..
```

### 3. Environment Variables
Create a local `.env` file in the root directory based on `.env.example`:
```bash
cp .env.example .env
```
Fill in the required Google Sheets credentials:
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`: Your service account email
- `GOOGLE_PRIVATE_KEY`: Your base64 encoded private key
- `GOOGLE_SHEET_ID`: The ID of your target Google Spreadsheet
- `ADMIN_PASSWORD`: The password used to access the `/admin` dashboard

### 4. Running Locally
Start the frontend development server:
```bash
cd frontend
npm run dev
```
*(Note: To test the backend API locally, you can use `vercel dev` using the Vercel CLI).*

## Deployment

This project is configured for seamless deployment on **Vercel**.

1. Connect your GitHub repository to Vercel.
2. Vercel will automatically read the `vercel.json` file.
3. Add your Environment Variables (`GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SHEET_ID`, `ADMIN_PASSWORD`) in the Vercel Dashboard Settings.
4. Deploy!

Vercel automatically handles the routing, sending `/api/*` requests to the serverless functions in the `api/` folder, and all other requests to the built Vite frontend.

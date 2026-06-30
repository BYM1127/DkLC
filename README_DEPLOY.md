# Deployment Guide

## Local run
- Double-click start-all.bat
- Or run run-backend.bat

## Netlify deployment
1. Push this project to GitHub.
2. Create a new Netlify site from Git.
3. Connect the GitHub repository.
4. Netlify will use `netlify.toml` automatically.
5. Add the environment variables from `.env.example`.
6. Add `DATABASE_URL` from a hosted Postgres database. This is required for permanent order storage.

## Render deployment
1. Push this project to GitHub.
2. Create a new Render Web Service.
3. Connect the GitHub repository.
4. Render will use render.yaml automatically.
5. Add the environment variables from `.env.example`.

## Environment variables for production
- NODE_ENV=production
- PORT=10000
- DB_PATH=data/dimpho_catering.sqlite
- DATABASE_URL=your-hosted-postgres-connection-string
- DATABASE_SSL=true
- WHATSAPP_NUMBER=27796929591
- ADMIN_WHATSAPP_NUMBER=27796929591

## Notes
- The app uses SQLite locally and Postgres in production when `DATABASE_URL` is set.
- WhatsApp uses free click-to-chat links, so no Twilio account is required.

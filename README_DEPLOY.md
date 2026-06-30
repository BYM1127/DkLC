# Deployment Guide

## Local run
- Double-click start-all.bat
- Or run run-backend.bat

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
- WHATSAPP_NUMBER=27796929591
- ADMIN_WHATSAPP_NUMBER=27796929591

## Notes
- The app currently uses SQLite. On serverless hosting, SQLite is temporary and best for demos.
- WhatsApp uses free click-to-chat links, so no Twilio account is required.

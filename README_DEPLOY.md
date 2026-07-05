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
6. Add `MONGODB_URI` from MongoDB Atlas. This is required for permanent order storage.
7. Add `ADMIN_API_KEY` to protect admin API routes.

## Render deployment
1. Push this project to GitHub.
2. Create a new Render Web Service.
3. Connect the GitHub repository.
4. Render will use render.yaml automatically.
5. Add the environment variables from `.env.example`.

## Environment variables for production
- NODE_ENV=production
- PORT=10000
- MONGODB_URI=mongodb+srv://rainbow11272005_db_user:hhlUjTitzC75B7FQ@cluster1dimpho.jt5rd5s.mongodb.net/?appName=Cluster1Dimpho
- MONGODB_DB=dimpho_ke_lesego_catering
- ADMIN_API_KEY=change-this-long-random-secret
- WHATSAPP_NUMBER=27796929591
- ADMIN_WHATSAPP_NUMBER=27796929591

## Notes
- The app uses MongoDB Atlas for permanent production storage.
- WhatsApp uses free click-to-chat links, so no Twilio account is required.

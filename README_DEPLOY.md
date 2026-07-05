# Deployment Guide

## Local run
- Double-click start-all.bat
- Or run run-backend.bat

## Netlify deployment
1. Push this project to GitHub.
2. Create a new Netlify site from Git.
3. Connect the GitHub repository.
4. Netlify will use `netlify.toml` automatically.
5. Rotate the exposed MongoDB Atlas database user's password before deploying.
6. Add the production environment variables in Netlify site settings.
7. Trigger a fresh deploy after the variables are saved.

## Render deployment
1. Push this project to GitHub.
2. Create a new Render Web Service.
3. Connect the GitHub repository.
4. Render will use render.yaml automatically.
5. Add the environment variables from `.env.example`.

## Environment variables for production
- NODE_ENV=production
- PORT=10000
- MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
- MONGODB_DB=dimpho_ke_lesego_catering
- MONGODB_CONNECT_TIMEOUT_MS=8000
- MONGODB_SERVER_SELECTION_TIMEOUT_MS=8000
- ADMIN_API_KEY=change-this-long-random-secret
- WHATSAPP_NUMBER=27796929591
- ADMIN_WHATSAPP_NUMBER=27796929591

## Netlify environment setup

In the Netlify dashboard, open:

```text
Site configuration > Environment variables
```

Add these variables:

```env
MONGODB_URI=mongodb+srv://username:new-password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=dimpho_ke_lesego_catering
MONGODB_CONNECT_TIMEOUT_MS=8000
MONGODB_SERVER_SELECTION_TIMEOUT_MS=8000
APP_READY_TIMEOUT_MS=9000
# Optional, only if SRV DNS resolution fails:
# MONGODB_DNS_SERVERS=8.8.8.8,1.1.1.1
ADMIN_API_KEY=replace-with-a-long-random-secret
WHATSAPP_NUMBER=27796929591
ADMIN_WHATSAPP_NUMBER=27796929591
```

If the Netlify CLI is logged in and linked to the site, the equivalent commands are:

```bash
netlify env:set MONGODB_URI "mongodb+srv://username:new-password@cluster.mongodb.net/?retryWrites=true&w=majority"
netlify env:set MONGODB_DB "dimpho_ke_lesego_catering"
netlify env:set MONGODB_CONNECT_TIMEOUT_MS "8000"
netlify env:set MONGODB_SERVER_SELECTION_TIMEOUT_MS "8000"
netlify env:set APP_READY_TIMEOUT_MS "9000"
netlify env:set ADMIN_API_KEY "replace-with-a-long-random-secret"
netlify env:set WHATSAPP_NUMBER "27796929591"
netlify env:set ADMIN_WHATSAPP_NUMBER "27796929591"
netlify deploy --prod
```

Generate a strong admin key locally with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

After deployment, test:

```bash
curl https://your-site.netlify.app/api/availability/blocked-dates
```

## Notes
- The app uses MongoDB Atlas for permanent production storage.
- WhatsApp uses free click-to-chat links, so no Twilio account is required.
- MongoDB Atlas Network Access must allow Netlify functions to connect. Use `0.0.0.0/0` only if you accept that tradeoff, or move the API to hosting with stable outbound IPs.

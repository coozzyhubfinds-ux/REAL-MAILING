# Render Deployment Guide

## Quick Fix for Current Error

If you're seeing the error `Could not read package.json: Error: ENOENT: no such file or directory`, follow these steps:

### Option 1: Configure Root Directory in Render Dashboard (Recommended)

1. Go to your Render Dashboard: https://dashboard.render.com
2. Click on your **coldemail-server** service
3. Go to **Settings** tab
4. Scroll down to **Build & Deploy** section
5. Set **Root Directory** to: `server`
6. Set **Build Command** to: `npm install`
7. Set **Start Command** to: `npm start`
8. Click **Save Changes**
9. Render will automatically redeploy

### Option 2: Delete and Recreate Service (Auto-detect from render.yaml)

1. Delete your current service in Render dashboard
2. Go to your repository: https://github.com/coozzyhubfinds-ux/REAL-MAILING
3. In Render dashboard, click **New +** → **Blueprint**
4. Connect your GitHub repository
5. Render will auto-detect `render.yaml` and create services with correct settings

## Environment Variables

Make sure to set these in Render Dashboard → Your Service → Environment:

```
PORT=5000
FRONTEND_URL=https://your-client-url.onrender.com
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_app_password
OPENAI_API_KEY=sk-... (optional)
SEND_DELAY_SECONDS_MIN=45
SEND_DELAY_SECONDS_MAX=120
```

## Client Deployment (Static Site)

1. Create a new **Static Site** service in Render
2. Connect the same GitHub repository
3. Set **Root Directory** to: `client`
4. Set **Build Command** to: `npm install && npm run build`
5. Set **Publish Directory** to: `dist`
6. Add environment variable: `VITE_API_URL=https://your-server-url.onrender.com`

## Verification

After deployment, check:
- Server health: `https://your-server.onrender.com/api/health`
- Should return: `{"success":true,"data":{"status":"ok",...}}`


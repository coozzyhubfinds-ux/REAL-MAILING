# Setup for https://real-mailing.onrender.com

## Your Current Setup
- **Backend URL:** `https://real-mailing.onrender.com`
- **Status:** Backend is live ✅

## Deploy Frontend (Black & Pink Theme)

### Step 1: Create Static Site in Render

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Static Site"**
3. Connect repo: `coozzyhubfinds-ux/REAL-MAILING`
4. Configure:
   ```
   Name: real-mailing-frontend (or any name)
   Branch: main
   Root Directory: client
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```
5. **Add Environment Variable:**
   - Key: `VITE_API_URL`
   - Value: `https://real-mailing.onrender.com`
6. Click **"Create Static Site"**

### Step 2: Update Backend CORS

Once you have your frontend URL (e.g., `https://real-mailing-frontend.onrender.com`):

1. Go to your **real-mailing** service in Render
2. Go to **Environment** tab
3. Add/Update:
   - Key: `FRONTEND_URL`
   - Value: Your new frontend URL (from Step 1)
4. Save and redeploy

### Step 3: Access Your Site

Visit your frontend URL to see the black & pink dashboard! 🎨

## Quick Test

Visit: `https://real-mailing.onrender.com/api/health`

Should return: `{"success":true,"data":{"status":"ok",...}}`

If this works, your backend is ready! Just need to deploy the frontend.


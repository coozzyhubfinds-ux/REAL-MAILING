# Frontend Deployment Guide - Black & Pink Theme

## Quick Deploy Frontend to Render

Your backend is already live! Now let's deploy the beautiful black & pink frontend.

### Step 1: Get Your Backend Server URL

1. Go to Render Dashboard: https://dashboard.render.com
2. Find your **coldemail-server** service
3. Copy the URL (e.g., `https://coldemail-server-xxxx.onrender.com`)

### Step 2: Deploy Static Site in Render

#### Option A: Using Blueprint (Auto-detect from render.yaml)

1. In Render Dashboard, click **New +** → **Blueprint**
2. Connect your GitHub repo: `https://github.com/coozzyhubfinds-ux/REAL-MAILING`
3. Render will auto-detect `render.yaml` and create both services
4. **Update the environment variable** for the static site:
   - Go to **coldemail-client** service → **Environment**
   - Set `VITE_API_URL` to your actual backend URL (from Step 1)

#### Option B: Manual Static Site Creation

1. In Render Dashboard, click **New +** → **Static Site**
2. Connect your GitHub repo: `https://github.com/coozzyhubfinds-ux/REAL-MAILING`
3. Configure:
   - **Name**: `coldemail-client`
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add Environment Variable:
   - **Key**: `VITE_API_URL`
   - **Value**: Your backend URL (e.g., `https://coldemail-server-xxxx.onrender.com`)
5. Click **Create Static Site**

### Step 3: Update Backend CORS (if needed)

Make sure your backend allows requests from the frontend:

1. Go to **coldemail-server** → **Environment**
2. Set `FRONTEND_URL` to your static site URL (e.g., `https://coldemail-client-xxxx.onrender.com`)

### Step 4: Verify Deployment

Once deployed, visit your static site URL. You should see:
- ✨ Beautiful black background with pink neon accents
- 📊 Dashboard with analytics cards
- 📧 Leads management table
- 📝 Email templates editor
- 🚀 Campaign builder
- 📈 Analytics page

## Troubleshooting

### Frontend shows "Cannot connect to API"
- Check `VITE_API_URL` environment variable is set correctly
- Verify backend is running and accessible
- Check browser console for CORS errors

### Build fails
- Make sure `Root Directory` is set to `client`
- Check that `package.json` exists in `client/` folder
- Verify Node.js version (should be 18+)

### Styling not working
- Clear browser cache
- Check that Tailwind CSS is building correctly
- Verify `dist/` folder contains CSS files


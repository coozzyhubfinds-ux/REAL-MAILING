# Serve Frontend from Backend (Same Domain)

Your backend at `https://real-mailing.onrender.com` can now serve the frontend!

## Update Render Build Command

1. Go to https://dashboard.render.com
2. Click on your **real-mailing** service
3. Go to **Settings** tab
4. Find **Build Command**
5. **Replace** the current build command with:
   ```
   npm install && cd ../client && npm install && npm run build && cd ../server
   ```
6. **Add Environment Variable:**
   - Key: `VITE_API_URL`
   - Value: `https://real-mailing.onrender.com`
7. Click **Save Changes**
8. Render will automatically redeploy

## What This Does

- Builds the frontend (black & pink theme) during deployment
- Serves it from the same domain as your backend
- All routes work: `/`, `/leads`, `/templates`, `/campaigns`, `/analytics`
- API routes still work: `/api/*`

## After Deployment

Visit: `https://real-mailing.onrender.com`

You should see your beautiful black & pink dashboard! 🎨

## Troubleshooting

### Still seeing API only
- Check build logs - make sure client build succeeded
- Verify `client/dist` folder exists after build
- Check server logs for "Serving frontend from client/dist" message

### Build fails
- Make sure the build command is exactly as shown above
- Check that `client/package.json` exists
- Verify Node.js version is 18+

### Frontend shows but API doesn't work
- Check CORS settings
- Verify `VITE_API_URL` is set correctly
- Check browser console for errors


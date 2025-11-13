# ColdEmail-Automation

AI-assisted cold email automation platform with a React (Vite) frontend styled in a bold black-and-pink theme and an Express/Supabase backend. The system streamlines lead ingestion, template personalization, campaign scheduling, and analytics tracking, with optional AI intros.

## Quick Start

1. **Clone & Install**
   - `cd server && npm install`
   - `cd ../client && npm install`
2. **Configure Environment**
   - Copy `server/.env.example` to `server/.env`
   - Provide Gmail App Password (or configure Gmail API), Supabase keys, and optional OpenAI key.
   - (Optional) Create `client/.env` and set `VITE_API_URL=https://your-render-backend.onrender.com`
3. **Database Setup**
   - Create a Supabase project.
   - Run the SQL in `server/sql/schema.sql` via Supabase SQL editor.
4. **Run Locally**
   - `cd server && npm run dev`
   - In another terminal: `cd client && npm run dev`
   - Visit `http://localhost:3000` (frontend) with API defaulting to `http://localhost:5000`.

## Gmail App Password vs Gmail API

- **App Password (recommended for speed):**
  - Enable 2FA on your Google account.
  - Generate a 16-character App Password.
  - Place it in `GMAIL_PASS` inside `server/.env`.
- **Gmail API (OAuth) Option:**
  - Follow `server/gmail_oauth_example.md`.
  - Store credentials securely in environment variables.

## Supabase Configuration

1. Create a new Supabase project.
2. In the SQL editor, run `server/sql/schema.sql`.
3. Grab the **Project URL** and **Service Role Key**.
4. Paste them into `SUPABASE_URL` and `SUPABASE_KEY` in your `server/.env`.

## Render Deployment

1. Push this repo to GitHub.
2. **Backend on Render**
   - Create a new Web Service.
   - Root path: `server/`
   - Build command: `npm install`
   - Start command: `npm start`
   - Add environment variables from `server/.env.example`.
3. **Frontend on Render**
   - Create a new Static Site.
   - Root path: `client/`
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`
   - Set `VITE_API_URL` to your backend URL.

## Testing Email Delivery

Run `node server/send_test_email.js` with your `.env` configured to fire a single test message. For campaign batches:

```
cd server
node scripts/sendEmails.js <campaignId>
```

## Project Structure

Refer to the master prompt for a breakdown of directories and responsibilities across `client/`, `server/`, and `docs/`.


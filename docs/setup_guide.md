# Setup Guide

## 1. Create Supabase Project

1. Sign up at [supabase.com](https://supabase.com).
2. Create a new project and choose a secure database password.
3. Open **SQL Editor** and run the schema below:

```sql
create extension if not exists pgcrypto;

create table if not exists leads (
  id uuid default gen_random_uuid() primary key,
  name text,
  email text not null unique,
  channel_name text,
  platform text,
  recent_video_url text,
  status text default 'new',
  last_contacted timestamptz,
  metadata jsonb,
  created_at timestamptz default now()
);

create table if not exists templates (
  id uuid default gen_random_uuid() primary key,
  name text,
  subject text,
  body text,
  created_at timestamptz default now()
);

create table if not exists campaigns (
  id uuid default gen_random_uuid() primary key,
  name text,
  template_id uuid references templates(id),
  lead_ids uuid[] default '{}',
  schedule jsonb,
  created_at timestamptz default now()
);

create table if not exists emails (
  id uuid default gen_random_uuid() primary key,
  lead_id uuid references leads(id),
  campaign_id uuid references campaigns(id),
  message_id text,
  status text,
  sent_at timestamptz,
  opened_at timestamptz,
  replied_at timestamptz,
  raw_response jsonb
);
```

4. Navigate to **Project Settings → API** and copy the `Project URL` and `Service Role Key`.

## 2. Configure Gmail

### Option A: App Password (Recommended)
1. Enable 2-Step Verification for your Google account.
2. Visit [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).
3. Generate a new App Password for "Mail".
4. Store the 16-character password in `GMAIL_PASS`.

### Option B: Gmail API (OAuth)
1. Create a Google Cloud project.
2. Enable Gmail API.
3. Configure OAuth consent (internal or external).
4. Download credentials and follow `server/gmail_oauth_example.md` for integration.

## 3. Environment Variables

1. Copy `server/.env.example` to `server/.env`.
2. Fill in:
   - `SUPABASE_URL`
   - `SUPABASE_KEY` (Service Role Key)
   - `GMAIL_USER`
   - `GMAIL_PASS` or set Gmail API credentials
   - Optional `OPENAI_API_KEY`
3. (Optional) Create `client/.env` with `VITE_API_URL=https://your-backend-url`.

## 4. Install Dependencies

```bash
cd server
npm install

cd ../client
npm install
```

## 5. Run Development Servers

- Backend: `cd server && npm run dev`
- Frontend: `cd client && npm run dev`
- Open `http://localhost:3000` in your browser.

## 6. Import Leads (CSV)

1. Prepare a CSV with headers: `name,email,channel_name,platform,recent_video_url`.
2. Use the frontend **Leads** page → `Import Leads`.
3. The file is parsed on the backend using `csv-parser` and upserted into Supabase.

## 7. Using the UI

1. **Dashboard**: View key metrics and recent activity.
2. **Leads**: Add, edit, filter, and bulk-select leads.
3. **Templates**: Draft subject/body with placeholders (`{{ name }}`, `{{ personal_intro }}`, etc.).
4. **Campaigns**:
   - Choose a template and target leads.
   - Optionally define scheduling delays.
   - Trigger immediate sends or prepare for cron execution.
5. **Analytics**: Monitor totals, open rate, replies, and campaign history.

## 8. Deploy to Render

1. Push the repository to GitHub.
2. Backend: Create a Render Web Service targeting `server/`, build `npm install`, start `npm start`.
3. Frontend: Create a Render Static Site targeting `client/`, build `npm install && npm run build`, publish `dist`.
4. Set environment variables for both services as needed.

## 9. Optional AI Personalization

1. Add `OPENAI_API_KEY` to your backend `.env`.
2. Personal intros will be generated automatically when sending campaigns.

You are now ready to run cold email campaigns with a sleek black-and-pink dashboard and automated delivery pipeline.


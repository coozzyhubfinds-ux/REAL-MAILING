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

insert into leads (name, email, channel_name, platform, recent_video_url)
values ('Sample Creator', 'sample.creator@example.com', 'Sample Channel', 'YouTube', 'https://youtube.com/watch?v=example')
on conflict (email) do nothing;

insert into templates (name, subject, body)
values (
  'Sample Outreach',
  'Loved {{ channel_name }} on {{ platform }}',
  'Hi {{ name }},\n\n{{ personal_intro }}\n\nWould love to collaborate with you soon!\n\nBest,\nLoreLegends Lab'
)
on conflict (name) do nothing;


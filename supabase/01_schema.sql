-- ================================
-- AI Voice Sales Agent – DB Schema
-- ================================
-- Run this in Supabase SQL Editor

-- --------------------------------
-- TABLES
-- --------------------------------

create table sessions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  provider text not null,       -- 'openai' | 'elevenlabs'
  system_prompt text,
  rag_content text,
  status text default 'active'  -- 'active' | 'completed' | 'error'
);

create table transcripts (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade,
  role text not null,           -- 'agent' | 'user'
  content text not null,
  timestamp timestamptz default now()
);

create table ratings (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade,
  naturalness int check (naturalness between 1 and 5),
  latency int check (latency between 1 and 5),
  conversation_flow int check (conversation_flow between 1 and 5),
  objection_handling int check (objection_handling between 1 and 5),
  closing int check (closing between 1 and 5),
  errors int check (errors between 1 and 5),
  notes text,
  created_at timestamptz default now()
);

-- --------------------------------
-- ROW LEVEL SECURITY
-- --------------------------------

alter table sessions enable row level security;
alter table transcripts enable row level security;
alter table ratings enable row level security;

-- MVP: internes Tool, anon darf alles
create policy "anon_all_sessions"
  on sessions for all
  using (true)
  with check (true);

create policy "anon_all_transcripts"
  on transcripts for all
  using (true)
  with check (true);

create policy "anon_all_ratings"
  on ratings for all
  using (true)
  with check (true);

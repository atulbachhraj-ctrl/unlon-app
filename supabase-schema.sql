-- ═══════════════════════════════════════════════════
-- UNLON — Database Schema
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════════

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- ═══════ PROFILES ═══════
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  display_name text,
  avatar_emoji text default '😊',
  bio text,
  age int,
  city text,
  vibes text[] default '{}',
  is_premium boolean default false,
  is_online boolean default false,
  last_seen timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on profiles for select using (true);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_emoji)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', 'New User'),
    '😊'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ═══════ CONFESSIONS ═══════
create table public.confessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  content text not null,
  is_anonymous boolean default true,
  hearts int default 0,
  hugs int default 0,
  sads int default 0,
  wows int default 0,
  created_at timestamptz default now()
);

alter table public.confessions enable row level security;

create policy "Confessions are viewable by everyone"
  on confessions for select using (true);

create policy "Authenticated users can create confessions"
  on confessions for insert with check (auth.role() = 'authenticated');

create policy "Users can update own confessions"
  on confessions for update using (auth.uid() = user_id);

-- ═══════ CONFESSION REACTIONS ═══════
create table public.confession_reactions (
  id uuid default uuid_generate_v4() primary key,
  confession_id uuid references public.confessions(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  reaction_type text not null check (reaction_type in ('heart', 'hug', 'sad', 'wow')),
  created_at timestamptz default now(),
  unique(confession_id, user_id, reaction_type)
);

alter table public.confession_reactions enable row level security;

create policy "Reactions viewable by everyone"
  on confession_reactions for select using (true);

create policy "Authenticated users can react"
  on confession_reactions for insert with check (auth.role() = 'authenticated');

create policy "Users can remove own reactions"
  on confession_reactions for delete using (auth.uid() = user_id);

-- ═══════ MATCHES ═══════
create table public.matches (
  id uuid default uuid_generate_v4() primary key,
  user_a uuid references public.profiles(id) on delete cascade,
  user_b uuid references public.profiles(id) on delete cascade,
  status text default 'pending' check (status in ('pending', 'matched', 'rejected')),
  created_at timestamptz default now(),
  matched_at timestamptz,
  unique(user_a, user_b)
);

alter table public.matches enable row level security;

create policy "Users can see own matches"
  on matches for select using (auth.uid() = user_a or auth.uid() = user_b);

create policy "Authenticated users can create matches"
  on matches for insert with check (auth.uid() = user_a);

create policy "Users can update matches involving them"
  on matches for update using (auth.uid() = user_a or auth.uid() = user_b);

-- ═══════ MESSAGES ═══════
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  match_id uuid references public.matches(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete cascade,
  content text not null,
  message_type text default 'text' check (message_type in ('text', 'voice', 'image', 'system')),
  is_read boolean default false,
  created_at timestamptz default now()
);

alter table public.messages enable row level security;

create policy "Users can see messages from their matches"
  on messages for select using (
    exists (
      select 1 from matches
      where matches.id = messages.match_id
      and (matches.user_a = auth.uid() or matches.user_b = auth.uid())
    )
  );

create policy "Users can send messages in their matches"
  on messages for insert with check (
    auth.uid() = sender_id
    and exists (
      select 1 from matches
      where matches.id = match_id
      and matches.status = 'matched'
      and (matches.user_a = auth.uid() or matches.user_b = auth.uid())
    )
  );

-- ═══════ NIGHT OWL SESSIONS ═══════
create table public.night_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  mood_emoji text,
  status_text text,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table public.night_sessions enable row level security;

create policy "Active night sessions are viewable"
  on night_sessions for select using (is_active = true);

create policy "Users can create night sessions"
  on night_sessions for insert with check (auth.uid() = user_id);

create policy "Users can update own sessions"
  on night_sessions for update using (auth.uid() = user_id);

-- ═══════ NIGHT QUESTIONS ═══════
create table public.night_questions (
  id uuid default uuid_generate_v4() primary key,
  question text not null,
  active_date date default current_date,
  created_at timestamptz default now()
);

alter table public.night_questions enable row level security;

create policy "Questions are viewable" on night_questions for select using (true);

-- Insert a default question
insert into night_questions (question, active_date) values
  ('If you could go back and change one moment in your life — would you? And why not?', current_date);

-- ═══════ DAILY CHALLENGES ═══════
create table public.daily_challenges (
  id uuid default uuid_generate_v4() primary key,
  question text not null,
  active_date date default current_date unique,
  created_at timestamptz default now()
);

alter table public.daily_challenges enable row level security;

create policy "Challenges are viewable" on daily_challenges for select using (true);

-- Insert default challenge
insert into daily_challenges (question, active_date) values
  ('What''s one thing that made you smile today?', current_date);

-- ═══════ INDEXES ═══════
create index idx_confessions_created on confessions(created_at desc);
create index idx_messages_match on messages(match_id, created_at);
create index idx_matches_users on matches(user_a, user_b);
create index idx_night_sessions_active on night_sessions(is_active, created_at desc);
create index idx_profiles_city on profiles(city);
create index idx_profiles_online on profiles(is_online);

-- ═══════ REALTIME ═══════
-- Enable realtime for messages and confessions
alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table confessions;
alter publication supabase_realtime add table night_sessions;

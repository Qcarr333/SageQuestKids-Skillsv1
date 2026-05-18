-- Gaming + future module educational progress core schema
-- Non-destructive creation for existing projects.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.user_game_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  game_key text not null,
  grade_level text,
  xp integer not null default 0 check (xp >= 0),
  level integer not null default 1 check (level >= 1),
  best_score integer not null default 0,
  total_sessions integer not null default 0,
  total_correct integer not null default 0,
  total_attempts integer not null default 0,
  accuracy numeric not null default 0,
  current_difficulty text,
  best_streak integer not null default 0,
  unlocked_badges jsonb not null default '[]'::jsonb,
  mastered_skills jsonb not null default '[]'::jsonb,
  game_specific_stats jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, game_key)
);

create index if not exists idx_user_game_progress_user_id on public.user_game_progress(user_id);
create index if not exists idx_user_game_progress_game_key on public.user_game_progress(game_key);

create table if not exists public.user_game_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  game_key text not null,
  grade_level text,
  score integer not null default 0,
  xp_earned integer not null default 0,
  accuracy numeric not null default 0,
  duration_seconds integer not null default 0,
  session_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists idx_user_game_sessions_user_id on public.user_game_sessions(user_id);
create index if not exists idx_user_game_sessions_game_key on public.user_game_sessions(game_key);

create table if not exists public.user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  achievement_key text not null,
  achievement_name text not null,
  description text,
  unlocked_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  unique(user_id, achievement_key)
);
create index if not exists idx_user_achievements_user_id on public.user_achievements(user_id);

create table if not exists public.user_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  sound_enabled boolean not null default true,
  reduced_motion boolean not null default false,
  show_keyboard_guide boolean not null default true,
  preferred_grade text,
  accessibility_settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.assignment_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  assignment_id text not null,
  module_key text not null,
  progress_percent integer not null default 0,
  completed boolean not null default false,
  score integer,
  submitted_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.learning_skill_mastery (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  skill_key text not null,
  mastery_score numeric not null default 0,
  last_practiced_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  unique(user_id, skill_key)
);

-- update triggers
create trigger trg_user_game_progress_updated_at before update on public.user_game_progress for each row execute function public.set_updated_at();
create trigger trg_user_settings_updated_at before update on public.user_settings for each row execute function public.set_updated_at();

-- RLS
alter table public.user_game_progress enable row level security;
alter table public.user_game_sessions enable row level security;
alter table public.user_achievements enable row level security;
alter table public.user_settings enable row level security;
alter table public.assignment_progress enable row level security;
alter table public.learning_skill_mastery enable row level security;

create policy "user_game_progress_own" on public.user_game_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "user_game_sessions_own" on public.user_game_sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "user_achievements_own" on public.user_achievements for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "user_settings_own" on public.user_settings for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "assignment_progress_own" on public.assignment_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "learning_skill_mastery_own" on public.learning_skill_mastery for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- TODO: Future expansion hooks
-- parent/teacher dashboards: add role-aware policy overlays once school roles are introduced.
-- AI tutor analytics: derive aggregates from user_game_sessions and learning_skill_mastery.
-- module-generalization: reuse assignment_progress + learning_skill_mastery for reading/math/coding flows.

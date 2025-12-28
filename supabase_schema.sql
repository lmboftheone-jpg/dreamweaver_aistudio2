-- Create the stories table
create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null, -- references auth.users(id) if using Supabase Auth
  title text not null,
  author text,
  cover_url text,
  art_style text,
  is_branching boolean default false,
  is_public boolean default false,
  hero_description text,
  pages jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table public.stories enable row level security;

-- Policy: Anyone can view public stories
create policy "Public stories are viewable by everyone"
  on public.stories for select
  using ( is_public = true );

-- Policy: Users can view their own stories
create policy "Users can view their own stories"
  on public.stories for select
  using ( auth.uid() = user_id );

-- Policy: Users can insert/update/delete their own stories
create policy "Users can manage their own stories"
  on public.stories for all
  using ( auth.uid() = user_id );

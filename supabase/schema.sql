-- Create a table for public profiles (optional if you want to store extra user data, but good practice)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- Create a table for leads
create table public.leads (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  company text,
  email text,
  phone text,
  status text not null, -- check constraint or enum could be used here
  value numeric default 0,
  owner text, -- could be a reference to a profile if multi-user
  source text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  notes text,
  avatar text
);

alter table public.leads enable row level security;

create policy "Users can view their own leads." on public.leads
  for select using (auth.uid() = user_id);

create policy "Users can insert their own leads." on public.leads
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own leads." on public.leads
  for update using (auth.uid() = user_id);

create policy "Users can delete their own leads." on public.leads
  for delete using (auth.uid() = user_id);

-- Create a table for pipeline stages (optional if you want dynamic stages per user)
-- For v1, we might stick to hardcoded stages or simple per-user config. 
-- Let's enable a specific table for extensibility.
create table public.pipeline_stages (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  "order" integer not null default 0,
  pipeline_id text default 'default',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.pipeline_stages enable row level security;

create policy "Users can view their own stages." on public.pipeline_stages
  for select using (auth.uid() = user_id);

create policy "Users can insert their own stages." on public.pipeline_stages
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own stages." on public.pipeline_stages
  for update using (auth.uid() = user_id);

create policy "Users can delete their own stages." on public.pipeline_stages
  for delete using (auth.uid() = user_id);

-- Set up Realtime for leads (optional, but requested in "future" list, good to have)
alter publication supabase_realtime add table public.leads;

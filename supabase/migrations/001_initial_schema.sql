-- Enable UUID generation
create extension if not exists "pgcrypto";

-- Organisations
create table public.organisations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  industry text not null check (industry in ('construction', 'industrial', 'facilities')),
  tier text not null default 'small' check (tier in ('small', 'medium', 'large')),
  storage_used_bytes bigint not null default 0,
  ai_tokens_used bigint not null default 0,
  ai_tokens_reset_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.organisations enable row level security;

-- Profiles (one per auth.users row)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  org_id uuid references public.organisations(id) on delete cascade,
  full_name text not null,
  role text not null default 'worker' check (role in ('owner', 'admin', 'manager', 'worker')),
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Incidents
create table public.incidents (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organisations(id) on delete cascade,
  title text not null,
  description text not null default '',
  severity text not null check (severity in ('near-miss', 'minor', 'moderate', 'serious', 'critical')),
  status text not null default 'open' check (status in ('open', 'under-investigation', 'closed')),
  reported_by uuid not null references public.profiles(id),
  occurred_at timestamptz not null,
  location text,
  attachments text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.incidents enable row level security;

-- Actions (corrective/preventive)
create table public.actions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organisations(id) on delete cascade,
  title text not null,
  description text not null default '',
  status text not null default 'open' check (status in ('open', 'in-progress', 'completed', 'overdue')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  assigned_to uuid references public.profiles(id),
  due_date date,
  linked_module text,
  linked_record_id uuid,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.actions enable row level security;

-- AI token usage ledger
create table public.ai_usage (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organisations(id) on delete cascade,
  feature text not null,
  model text not null,
  input_tokens int not null default 0,
  output_tokens int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.ai_usage enable row level security;

-- RLS policies: users can only see their own org's data

-- Profiles: own row + same org
create policy "profiles_select" on public.profiles
  for select using (
    auth.uid() = id or
    org_id in (select org_id from public.profiles where id = auth.uid())
  );

create policy "profiles_insert" on public.profiles
  for insert with check (auth.uid() = id);

create policy "profiles_update" on public.profiles
  for update using (auth.uid() = id);

-- Organisations: members of the org
create policy "organisations_select" on public.organisations
  for select using (
    id in (select org_id from public.profiles where id = auth.uid())
  );

-- Incidents: own org
create policy "incidents_select" on public.incidents
  for select using (
    org_id in (select org_id from public.profiles where id = auth.uid())
  );

create policy "incidents_insert" on public.incidents
  for insert with check (
    org_id in (select org_id from public.profiles where id = auth.uid())
  );

create policy "incidents_update" on public.incidents
  for update using (
    org_id in (select org_id from public.profiles where id = auth.uid())
  );

-- Actions: own org
create policy "actions_select" on public.actions
  for select using (
    org_id in (select org_id from public.profiles where id = auth.uid())
  );

create policy "actions_insert" on public.actions
  for insert with check (
    org_id in (select org_id from public.profiles where id = auth.uid())
  );

create policy "actions_update" on public.actions
  for update using (
    org_id in (select org_id from public.profiles where id = auth.uid())
  );

-- AI usage: own org
create policy "ai_usage_select" on public.ai_usage
  for select using (
    org_id in (select org_id from public.profiles where id = auth.uid())
  );

create policy "ai_usage_insert" on public.ai_usage
  for insert with check (
    org_id in (select org_id from public.profiles where id = auth.uid())
  );

-- Auto-create profile + org on signup via trigger
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  new_org_id uuid;
begin
  -- Create organisation
  insert into public.organisations (name, industry)
  values (
    coalesce(new.raw_user_meta_data->>'org_name', 'My Organisation'),
    coalesce(new.raw_user_meta_data->>'industry', 'construction')
  )
  returning id into new_org_id;

  -- Create profile
  insert into public.profiles (id, org_id, full_name, role)
  values (
    new.id,
    new_org_id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    'owner'
  );

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger incidents_updated_at before update on public.incidents
  for each row execute function public.set_updated_at();

create trigger actions_updated_at before update on public.actions
  for each row execute function public.set_updated_at();

create trigger organisations_updated_at before update on public.organisations
  for each row execute function public.set_updated_at();

-- Storage buckets
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('documents', 'documents', false, 10485760, array['application/pdf', 'image/jpeg', 'image/png', 'image/webp']),
  ('avatars', 'avatars', true, 2097152, array['image/jpeg', 'image/png', 'image/webp']);

-- Storage RLS: users can only access their org's documents
create policy "documents_select" on storage.objects
  for select using (
    bucket_id = 'documents' and
    (storage.foldername(name))[1] in (
      select org_id::text from public.profiles where id = auth.uid()
    )
  );

create policy "documents_insert" on storage.objects
  for insert with check (
    bucket_id = 'documents' and
    (storage.foldername(name))[1] in (
      select org_id::text from public.profiles where id = auth.uid()
    )
  );

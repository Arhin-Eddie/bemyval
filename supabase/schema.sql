-- Standardized & Hardened SQL Schema for Valentine App

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES Table (Extends Auth)
create table profiles (
  id uuid references auth.users not null primary key,
  display_name text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can update their own profile" on profiles for update using (auth.uid() = id);

-- TRIGGER: Create profile on auth signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'display_name');
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. INVITES Table
create table invites (
  id uuid default uuid_generate_v4() primary key,
  creator_id uuid references profiles(id) not null,
  short_code text unique not null,
  message text not null,
  recipient_name text not null,
  responded boolean default false,
  device_token uuid, -- Standardized naming: device_token
  is_public boolean default false,
  created_at timestamptz default now()
);

alter table invites enable row level security;

create policy "Creators can view their own invites" on invites
  for select using (auth.uid() = creator_id);

create policy "Creators can create invites" on invites
  for insert with check (auth.uid() = creator_id);

create policy "Anyone can view invite by short_code" on invites
  for select using (true);

-- 3. RESPONSES Table
create table responses (
  id uuid default uuid_generate_v4() primary key,
  invite_id uuid references invites(id) not null,
  device_token uuid not null, -- Standardized naming: device_token
  responder_id uuid references profiles(id), -- New: link to profile if user is logged in
  answer text check (answer in ('yes', 'no', 'maybe')),
  reason text, -- Capture feedback for 'no' answers
  created_at timestamptz default now()
);

alter table responses enable row level security;

create policy "Creators can view responses for their invites" on responses
  for select using (
    exists (
      select 1 from invites
      where invites.id = responses.invite_id
      and invites.creator_id = auth.uid()
    )
  );

create policy "Public can insert response if link matches lock" on responses
  for insert with check (
    exists (
      select 1 from invites
      where invites.id = responses.invite_id
      and (invites.device_token is null or invites.device_token = responses.device_token)
      and invites.responded = false
    )
  );

-- 4. FUNCTION: Secure Device Locking
create or replace function claim_invite_device(p_invite_id uuid, p_device_token uuid)
returns boolean
language plpgsql
security definer
as $$
declare
  v_current_token uuid;
  v_is_public boolean;
begin
  select device_token, is_public into v_current_token, v_is_public
  from invites
  where id = p_invite_id
  for update;

  if not found then
    return false;
  end if;

  if v_is_public then
    return true;
  end if;

  if v_current_token is null then
    update invites
    set device_token = p_device_token
    where id = p_invite_id;
    return true;
  elsif v_current_token = p_device_token then
    return true;
  else
    return false;
  end if;
end;
$$;

-- 5. FUNCTION: Submit Response (SECURED)
create or replace function submit_response(
  p_invite_id uuid,
  p_device_token uuid,
  p_answer text,
  p_reason text default null -- NEW: capture reason for 'no'
)
returns boolean
language plpgsql
security definer
as $$
declare
  v_is_owner boolean;
  v_is_public boolean;
  v_auth_id uuid;
begin
  -- Get actual authenticated user ID
  v_auth_id := auth.uid();

  -- Ensure device owns the link
  v_is_owner := claim_invite_device(p_invite_id, p_device_token);
  
  if not v_is_owner then
    return false;
  end if;

  select is_public into v_is_public from invites where id = p_invite_id;

  -- Insert response with verified auth identity (v_auth_id)
  insert into responses (invite_id, device_token, answer, responder_id, reason)
  values (p_invite_id, p_device_token, p_answer, v_auth_id, p_reason);

  -- Only mark as responded if it's a final positive/maybe answer AND it's not a public invite
  if not v_is_public and p_answer in ('yes', 'maybe') then
    update invites
    set responded = true
    where id = p_invite_id;
  end if;

  return true;
end;
$$;


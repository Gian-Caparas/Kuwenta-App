-- =============================================================================
-- Kuewenta: complete database schema
-- Paste this whole file into Supabase: SQL Editor -> New query -> Run.
--
-- Safe to run on a brand-new project AND on top of the two earlier files
-- (it only adds what is missing and never deletes your data).
--
-- Contents
--   1. Tables:    customers, transactions (with due_date), notifications
--   2. Indexes
--   3. Row Level Security (each store owner sees only their own data)
--   4. Notification helper functions
-- =============================================================================


-- 1. TABLES -------------------------------------------------------------------

create table if not exists public.customers (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name        text not null check (char_length(btrim(name)) > 0),
  phone       text,
  notes       text,
  created_at  timestamptz not null default now()
);

create table if not exists public.transactions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null default auth.uid() references auth.users (id) on delete cascade,
  customer_id  uuid not null references public.customers (id) on delete cascade,
  type         text not null check (type in ('debt', 'payment')),
  amount       numeric(12, 2) not null check (amount > 0),
  note         text,
  created_at   timestamptz not null default now(),
  due_date     timestamptz                       -- when the suki is expected to pay (debts)
);

-- If transactions was created before due_date existed, add the column now.
alter table public.transactions
  add column if not exists due_date timestamptz;

create table if not exists public.notifications (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null default auth.uid() references auth.users (id) on delete cascade,
  type            text not null,                 -- allowed values are enforced below
  title           text not null,
  message         text not null,
  reference_id    uuid,                          -- the transaction or customer this is about
  reference_type  text check (reference_type in ('transaction', 'customer')),
  metadata        jsonb default '{}'::jsonb,     -- extra data (amount, customer_name, ...)
  is_read         boolean not null default false,
  is_archived     boolean not null default false,
  created_at      timestamptz not null default now(),
  read_at         timestamptz
);

alter table public.notifications
  add column if not exists is_archived boolean not null default false;

-- Allowed notification types. Dropped and re-added so it also updates an
-- existing table. (D, F and G are additions that match the planned features.)
alter table public.notifications
  drop constraint if exists notifications_type_check;

alter table public.notifications
  add constraint notifications_type_check check (type in (
    'transaction_created',     -- A. New transaction recorded
    'payment_received',        -- B. Payment received from a customer
    'expected_payment_today',  -- C. A customer is expected to pay today
    'debt_overdue',            -- D. A customer's utang is past its due date
    'software_update',         -- E. Software update announcement
    'subscription_update',     -- F. Subscription / plan news
    'report_ready'             -- G. Weekly or monthly report is ready
  ));


-- 2. INDEXES ------------------------------------------------------------------

create index if not exists customers_user_idx    on public.customers (user_id);
create index if not exists transactions_user_idx on public.transactions (user_id, created_at);
create index if not exists transactions_cust_idx on public.transactions (customer_id, created_at);

-- Speeds up "who is due today / who is overdue" lookups.
create index if not exists transactions_due_idx
  on public.transactions (user_id, due_date)
  where type = 'debt' and due_date is not null;

create index if not exists notifications_user_idx
  on public.notifications (user_id, created_at desc);

create index if not exists notifications_user_unread_idx
  on public.notifications (user_id, is_read) where is_read = false;


-- 3. ROW LEVEL SECURITY: every owner sees only their own data ------------------

alter table public.customers     enable row level security;
alter table public.transactions  enable row level security;
alter table public.notifications enable row level security;

-- customers
drop policy if exists "customers: owner can read"   on public.customers;
drop policy if exists "customers: owner can insert" on public.customers;
drop policy if exists "customers: owner can update" on public.customers;
drop policy if exists "customers: owner can delete" on public.customers;

create policy "customers: owner can read"
  on public.customers for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "customers: owner can insert"
  on public.customers for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "customers: owner can update"
  on public.customers for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "customers: owner can delete"
  on public.customers for delete to authenticated
  using ((select auth.uid()) = user_id);

-- transactions
drop policy if exists "transactions: owner can read"   on public.transactions;
drop policy if exists "transactions: owner can insert" on public.transactions;
drop policy if exists "transactions: owner can update" on public.transactions;
drop policy if exists "transactions: owner can delete" on public.transactions;

create policy "transactions: owner can read"
  on public.transactions for select to authenticated
  using ((select auth.uid()) = user_id);

-- A transaction may only be added to one of your OWN customers.
create policy "transactions: owner can insert"
  on public.transactions for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1 from public.customers c
      where c.id = customer_id and c.user_id = (select auth.uid())
    )
  );

create policy "transactions: owner can update"
  on public.transactions for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "transactions: owner can delete"
  on public.transactions for delete to authenticated
  using ((select auth.uid()) = user_id);

-- notifications
drop policy if exists "notifications: owner can read"   on public.notifications;
drop policy if exists "notifications: owner can insert" on public.notifications;
drop policy if exists "notifications: owner can update" on public.notifications;
drop policy if exists "notifications: owner can delete" on public.notifications;

create policy "notifications: owner can read"
  on public.notifications for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "notifications: owner can insert"
  on public.notifications for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "notifications: owner can update"
  on public.notifications for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "notifications: owner can delete"
  on public.notifications for delete to authenticated
  using ((select auth.uid()) = user_id);


-- 4. NOTIFICATION FUNCTIONS ------------------------------------------------------
-- These run with the caller's permissions, so Row Level Security still applies.

-- Creates a notification unless an equivalent one already exists.
--   * Pay-day and overdue notices: at most one per customer per day (Manila time).
--   * Everything else: no repeat within 1 hour.
--   * Notices with no reference (e.g. software updates) are matched by title.
create or replace function public.create_notification_if_not_exists(
  p_user_id        uuid,
  p_type           text,
  p_title          text,
  p_message        text,
  p_reference_id   uuid,
  p_reference_type text,
  p_metadata       jsonb default '{}'::jsonb
) returns uuid
language plpgsql
set search_path = public
as $$
declare
  v_id uuid;
begin
  select id into v_id
  from public.notifications
  where user_id = p_user_id
    and type = p_type
    and reference_id   is not distinct from p_reference_id
    and reference_type is not distinct from p_reference_type
    and (p_reference_id is not null or title = p_title)
    and case
          when p_type in ('expected_payment_today', 'debt_overdue')
            then (created_at at time zone 'Asia/Manila')::date
                 = (now()    at time zone 'Asia/Manila')::date
          else created_at > now() - interval '1 hour'
        end
  limit 1;

  if v_id is null then
    insert into public.notifications
      (user_id, type, title, message, reference_id, reference_type, metadata)
    values
      (p_user_id, p_type, p_title, p_message, p_reference_id, p_reference_type, p_metadata)
    returning id into v_id;
  end if;

  return v_id;
end $$;

-- Marks the given notifications as read (or all unread ones when no ids are passed).
create or replace function public.mark_notifications_read(
  p_user_id uuid,
  p_ids     uuid[] default null
) returns void
language plpgsql
set search_path = public
as $$
begin
  if p_ids is not null and array_length(p_ids, 1) > 0 then
    update public.notifications
    set is_read = true, read_at = now()
    where user_id = p_user_id and id = any(p_ids);
  else
    update public.notifications
    set is_read = true, read_at = now()
    where user_id = p_user_id and is_read = false;
  end if;
end $$;

-- Number of unread notifications (for the bell badge).
create or replace function public.get_unread_count(p_user_id uuid)
returns integer
language plpgsql
stable
set search_path = public
as $$
declare
  v_count integer;
begin
  select count(*) into v_count
  from public.notifications
  where user_id = p_user_id and is_read = false;
  return v_count;
end $$;


-- OPTIONAL: live updates for the bell badge (Supabase Realtime).
-- Uncomment and run once if the app subscribes to new notifications.
--
-- alter publication supabase_realtime add table public.notifications;
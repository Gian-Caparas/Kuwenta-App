-- Kuewenta database schema
-- Run this once in Supabase: SQL Editor -> New query -> paste -> Run.

-- 1. Tables ---------------------------------------------------------------

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
  created_at   timestamptz not null default now()
);

create index if not exists customers_user_idx    on public.customers (user_id);
create index if not exists transactions_user_idx on public.transactions (user_id, created_at);
create index if not exists transactions_cust_idx on public.transactions (customer_id, created_at);

-- 2. Row Level Security: every owner sees only their own data ---------------

alter table public.customers    enable row level security;
alter table public.transactions enable row level security;

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

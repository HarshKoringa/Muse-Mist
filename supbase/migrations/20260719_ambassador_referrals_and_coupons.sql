-- Ambassador referral codes, generic discount coupons, and global referral settings.
-- Purely additive: new tables + nullable columns on `orders`. Does not alter or
-- touch any existing table's data, existing columns, or existing behavior.

create table if not exists public.ambassadors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  referral_code text not null unique,
  self_purchase_code text not null unique,
  self_purchase_used boolean not null default false,
  order_count integer not null default 0,
  free_products_fulfilled integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_percent numeric not null,
  stacks boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.referral_settings (
  id integer primary key default 1,
  referral_discount_percent numeric not null default 5,
  self_purchase_discount_percent numeric not null default 50,
  updated_at timestamptz not null default now(),
  constraint referral_settings_single_row check (id = 1)
);

insert into public.referral_settings (id, referral_discount_percent, self_purchase_discount_percent)
values (1, 5, 50)
on conflict (id) do nothing;

alter table public.orders
  add column if not exists ambassador_id uuid references public.ambassadors(id),
  add column if not exists referral_type text check (referral_type in ('referral', 'self_purchase')),
  add column if not exists coupon_id uuid references public.coupons(id);

create or replace function public.increment_ambassador_order_count(p_ambassador_id uuid)
returns void
language sql
as $$
  update public.ambassadors
  set order_count = order_count + 1
  where id = p_ambassador_id;
$$;

alter table public.ambassadors enable row level security;
alter table public.coupons enable row level security;
alter table public.referral_settings enable row level security;

-- Service-role only (matches existing pattern: these tables are managed via
-- createAdminClient() in API routes, never read directly by the browser).
drop policy if exists "service role full access" on public.ambassadors;
create policy "service role full access" on public.ambassadors
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

drop policy if exists "service role full access" on public.coupons;
create policy "service role full access" on public.coupons
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

drop policy if exists "service role full access" on public.referral_settings;
create policy "service role full access" on public.referral_settings
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

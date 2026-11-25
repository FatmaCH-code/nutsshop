-- Golden Nuts House - database schema
-- Run in Supabase > SQL Editor. Safe to run more than once.

-- Profiles (one row per user, holds the role)
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  full_name   text,
  role        text not null default 'customer' check (role in ('customer','staff','admin')),
  created_at  timestamptz not null default now()
);

-- Create a profile on sign up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- True for admin and staff accounts
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','staff'));
$$;

-- Categories
create table if not exists public.categories (
  slug          text primary key,
  name          text not null,
  image_url     text,
  show_on_home  boolean not null default true,
  sort_order    int not null default 0
);

-- Products
create table if not exists public.products (
  id                bigint generated always as identity primary key,
  name              text not null,
  slug              text not null unique,
  description       text default '',
  base_price        numeric(10,2) not null check (base_price >= 0),
  compare_at_price  numeric(10,2),               -- previous price, shown as a sale
  has_weight        boolean not null default false, -- sold by the pound
  category          text[] not null default '{}',
  image_url         text,
  stock             int,                          -- null means unlimited
  is_active         boolean not null default true,
  sort_order        int not null default 0,
  created_at        timestamptz not null default now()
);

-- Hero slides (home page carousel)
create table if not exists public.hero_slides (
  id               bigint generated always as identity primary key,
  title            text not null,
  subtitle         text default '',
  image_url        text not null,
  cta_label        text default 'Shop Now',
  cta_href         text default '/collections/best-sellers',
  secondary_label  text default 'Explore Gifts',
  secondary_href   text default '/collections/gifts',
  sort_order       int not null default 0,
  is_active        boolean not null default true
);

-- Site settings (texts, contact info, banners…)
create table if not exists public.site_settings (
  id    int primary key default 1 check (id = 1),
  data  jsonb not null default '{}'::jsonb
);
insert into public.site_settings (id, data) values (1, '{}'::jsonb) on conflict (id) do nothing;

-- Orders
create table if not exists public.orders (
  id               bigint generated always as identity primary key,
  created_at       timestamptz not null default now(),
  user_id          uuid references auth.users(id) on delete set null,
  customer_name    text not null,
  email            text not null,
  phone            text not null,
  delivery_method  text not null default 'pickup' check (delivery_method in ('pickup','delivery')),
  address          text default '',
  notes            text default '',
  items            jsonb not null,
  subtotal         numeric(10,2) not null,
  status           text not null default 'new'
                   check (status in ('new','confirmed','preparing','ready','completed','cancelled')),
  admin_note       text default ''
);

-- Orders are created here so prices always come from the products table
create or replace function public.place_order(customer jsonb, cart jsonb)
returns bigint language plpgsql security definer set search_path = public as $$
declare
  line       jsonb;
  p          public.products;
  qty        int;
  unit       numeric(10,2);
  total      numeric(10,2) := 0;
  out_items  jsonb := '[]'::jsonb;
  new_id     bigint;
begin
  if jsonb_array_length(cart) = 0 then raise exception 'Cart is empty'; end if;

  for line in select * from jsonb_array_elements(cart) loop
    select * into p from public.products where id = (line->>'id')::bigint and is_active;
    if not found then raise exception 'A product in your cart is no longer available'; end if;
    qty := greatest(1, (line->>'qty')::int);
    if p.stock is not null and p.stock < qty then
      raise exception 'Not enough stock for %', p.name;
    end if;
    unit := case when p.has_weight and line->>'weight' = 'Half Pound'
                 then round(p.base_price * 0.6, 2) else p.base_price end;
    total := total + unit * qty;
    out_items := out_items || jsonb_build_object(
      'id', p.id, 'name', p.name, 'image', p.image_url,
      'weight', case when p.has_weight then coalesce(line->>'weight','One Pound') else null end,
      'qty', qty, 'unit_price', unit);
    if p.stock is not null then
      update public.products set stock = stock - qty where id = p.id;
    end if;
  end loop;

  insert into public.orders (user_id, customer_name, email, phone, delivery_method, address, notes, items, subtotal)
  values (auth.uid(),
          customer->>'name', customer->>'email', customer->>'phone',
          coalesce(customer->>'delivery_method','pickup'),
          coalesce(customer->>'address',''), coalesce(customer->>'notes',''),
          out_items, total)
  returning id into new_id;
  return new_id;
end $$;

grant execute on function public.place_order(jsonb, jsonb) to anon, authenticated;

-- Row level security
alter table public.profiles      enable row level security;
alter table public.categories    enable row level security;
alter table public.products      enable row level security;
alter table public.hero_slides   enable row level security;
alter table public.site_settings enable row level security;
alter table public.orders        enable row level security;

-- Profiles
drop policy if exists "profiles self read"   on public.profiles;
drop policy if exists "profiles admin all"   on public.profiles;
create policy "profiles self read" on public.profiles for select using (id = auth.uid());
create policy "profiles admin all" on public.profiles for all using (public.is_admin()) with check (public.is_admin());

-- Catalogue: public read, admin write
drop policy if exists "categories read"  on public.categories;
drop policy if exists "categories admin" on public.categories;
create policy "categories read"  on public.categories for select using (true);
create policy "categories admin" on public.categories for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "products read"  on public.products;
drop policy if exists "products admin" on public.products;
create policy "products read"  on public.products for select using (is_active or public.is_admin());
create policy "products admin" on public.products for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "slides read"  on public.hero_slides;
drop policy if exists "slides admin" on public.hero_slides;
create policy "slides read"  on public.hero_slides for select using (is_active or public.is_admin());
create policy "slides admin" on public.hero_slides for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "settings read"  on public.site_settings;
drop policy if exists "settings admin" on public.site_settings;
create policy "settings read"  on public.site_settings for select using (true);
create policy "settings admin" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());

-- Orders: customers read their own, admin manages all
drop policy if exists "orders own read" on public.orders;
drop policy if exists "orders admin"    on public.orders;
create policy "orders own read" on public.orders for select using (user_id = auth.uid());
create policy "orders admin"    on public.orders for all using (public.is_admin()) with check (public.is_admin());

-- Image storage (product / banner photos)
insert into storage.buckets (id, name, public) values ('images', 'images', true)
on conflict (id) do nothing;

drop policy if exists "images public read"  on storage.objects;
drop policy if exists "images admin write"  on storage.objects;
drop policy if exists "images admin update" on storage.objects;
drop policy if exists "images admin delete" on storage.objects;
create policy "images public read"  on storage.objects for select using (bucket_id = 'images');
create policy "images admin write"  on storage.objects for insert with check (bucket_id = 'images' and public.is_admin());
create policy "images admin update" on storage.objects for update using (bucket_id = 'images' and public.is_admin());
create policy "images admin delete" on storage.objects for delete using (bucket_id = 'images' and public.is_admin());

-- Table access for the API (rules above still apply)
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;
grant execute on all functions in schema public to anon, authenticated;
alter default privileges in schema public grant all on tables to anon, authenticated;
alter default privileges in schema public grant all on sequences to anon, authenticated;

-- Profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  phone text,
  avatar_url text,
  role text default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz default now()
);

-- Motorcycles table
create table if not exists public.motorcycles (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  type text not null,
  description text,
  price_per_day numeric not null,
  location text not null,
  image_url text,
  is_available boolean default true,
  rating numeric default 5.0,
  review_count integer default 0,
  created_at timestamptz default now()
);

-- Bookings table
create table if not exists public.bookings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  motorcycle_id uuid references public.motorcycles(id) on delete cascade not null,
  start_date date not null,
  end_date date not null,
  total_days integer not null,
  total_price numeric not null,
  status text default 'pending' check (status in ('pending','confirmed','active','completed','cancelled')),
  payment_method text default 'cash' check (payment_method in ('cash','gcash','card')),
  payment_status text default 'pending' check (payment_status in ('pending','paid')),
  notes text,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.motorcycles enable row level security;
alter table public.bookings enable row level security;

-- Profiles policies
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
drop policy if exists "profiles_admin_all" on public.profiles;
create policy "profiles_admin_all" on public.profiles for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- Motorcycles policies
drop policy if exists "motorcycles_select_all" on public.motorcycles;
create policy "motorcycles_select_all" on public.motorcycles for select using (true);
drop policy if exists "motorcycles_admin_all" on public.motorcycles;
create policy "motorcycles_admin_all" on public.motorcycles for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- Bookings policies
drop policy if exists "bookings_select_own" on public.bookings;
create policy "bookings_select_own" on public.bookings for select using (auth.uid() = user_id);
drop policy if exists "bookings_insert_own" on public.bookings;
create policy "bookings_insert_own" on public.bookings for insert with check (auth.uid() = user_id);
drop policy if exists "bookings_update_own" on public.bookings;
create policy "bookings_update_own" on public.bookings for update using (auth.uid() = user_id);
drop policy if exists "bookings_admin_all" on public.bookings;
create policy "bookings_admin_all" on public.bookings for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- Trigger: create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Seed motorcycles (idempotent)
insert into public.motorcycles (name, type, description, price_per_day, location, is_available, rating, review_count) values
  ('Honda Click 125i', 'Scooter', 'Fuel-efficient scooter perfect for city rides. Automatic transmission, great on gas.', 350, 'Cebu City', true, 4.8, 124),
  ('Yamaha NMAX 155', 'Maxi Scooter', 'Premium maxi-scooter with ABS, smart key system, and spacious under-seat storage.', 450, 'Cebu City', true, 4.9, 87),
  ('Honda ADV 160', 'Adventure', 'Adventure-ready scooter with ground clearance for city streets and light off-road.', 500, 'Lapu-Lapu City', true, 4.7, 56),
  ('Yamaha MT-15', 'Naked Sport', 'Sporty naked bike with aggressive styling and Variable Valve Actuation engine tech.', 600, 'Mandaue City', true, 4.9, 43),
  ('Honda BeAT', 'Scooter', 'Compact and lightweight scooter, ideal for quick errands and city commutes.', 300, 'Cebu City', true, 4.6, 198),
  ('Suzuki Raider R150', 'Underbone', 'Powerful underbone with sporty design, great for weekend rides and highways.', 400, 'Talisay City', true, 4.8, 72),
  ('Yamaha Aerox 155', 'Maxi Scooter', 'Sleek maxi-scooter with smart motor design and sporty aerodynamic body.', 480, 'Cebu City', true, 4.7, 61),
  ('Honda XRM 125', 'Trail', 'Versatile trail bike suitable for both urban roads and rough terrain.', 380, 'Minglanilla', true, 4.5, 33)
on conflict do nothing;

-- Kasi24 initial schema (Workstream 1: accommodation discovery + provider enquiries)
-- Apply with the Supabase CLI (`supabase db push`) or paste into the Supabase SQL editor.

-- Profile for each Supabase Auth user, holding the seeker/provider role
create table if not exists public.profiles (
    id          uuid primary key references auth.users (id) on delete cascade,
    full_name   text,
    role        text not null default 'SEEKER' check (role in ('SEEKER', 'PROVIDER')),
    created_at  timestamptz not null default now()
);

create table if not exists public.listings (
    id             uuid primary key default gen_random_uuid(),
    provider_id    uuid references auth.users (id) on delete set null,
    name           varchar(255) not null,
    area           varchar(255) not null,
    type           varchar(255) not null,
    description    text,
    max_guests     integer,
    price          numeric(38, 2),
    price_basis    varchar(255),
    amenities      varchar(255),
    provider_name  varchar(255),
    created_at     timestamptz not null default now()
);

create index if not exists idx_listings_area on public.listings (lower(area));

create table if not exists public.enquiries (
    id          uuid primary key default gen_random_uuid(),
    listing_id  uuid not null references public.listings (id) on delete cascade,
    name        varchar(255) not null,
    email       varchar(255) not null,
    phone       varchar(255),
    check_in    date,
    check_out   date,
    guests      integer,
    message     text not null,
    consent     boolean not null,
    status      varchar(255) not null default 'NEW' check (status in ('NEW', 'READ', 'REPLIED')),
    created_at  timestamptz not null default now(),
    constraint chk_enquiry_dates check (check_out is null or check_in is null or check_out > check_in)
);

create index if not exists idx_enquiries_listing on public.enquiries (listing_id);

-- Row Level Security: the Java backend connects as the database owner and bypasses RLS.
-- These policies protect the tables if anyone queries them directly with the anon key.
alter table public.profiles  enable row level security;
alter table public.listings  enable row level security;
alter table public.enquiries enable row level security;

create policy "Listings are publicly readable"
    on public.listings for select using (true);

create policy "Users can read their own profile"
    on public.profiles for select using (auth.uid() = id);

create policy "Providers can read enquiries for their listings"
    on public.enquiries for select
    using (exists (select 1 from public.listings l where l.id = listing_id and l.provider_id = auth.uid()));

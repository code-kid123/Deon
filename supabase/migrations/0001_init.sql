-- Atelier platform bootstrap. Mirrors /prisma/schema.prisma (canonical reference).
-- Runtime access uses the Supabase JS client (service role bypasses RLS).

create extension if not exists pgcrypto;

create type user_role as enum ('CUSTOMER', 'STUDENT', 'ADMIN');
create type user_status as enum ('ACTIVE', 'SUSPENDED');
create type course_status as enum ('DRAFT', 'PUBLISHED', 'ARCHIVED');
create type enrollment_status as enum ('PENDING', 'ACTIVE', 'REVOKED', 'REFUNDED');
create type product_status as enum ('DRAFT', 'ACTIVE', 'RETIRED');
create type variant_status as enum ('ACTIVE', 'HIDDEN');
create type order_status as enum ('PENDING', 'PAID', 'FULFILLED', 'PARTIALLY_FULFILLED', 'CANCELLED', 'REFUNDED', 'FAILED');
create type order_type as enum ('CART', 'COURSE', 'MENTORSHIP', 'CONSULTATION');
create type booking_type as enum ('WARDROBE_AUDIT', 'STYLE_CONSULTATION', 'BRAND_STRATEGY');
create type booking_status as enum ('CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW');
create type mentorship_application_status as enum ('PENDING', 'APPROVED', 'REJECTED', 'PAID', 'COMPLETED');

create table users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  phone text,
  auth_id uuid unique,
  role user_role not null default 'CUSTOMER',
  status user_status not null default 'ACTIVE',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text,
  description text,
  cover_image text,
  status course_status not null default 'DRAFT',
  currency text not null default 'NGN',
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table course_tiers (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  name text not null,
  price_minor integer not null check (price_minor >= 0),
  features jsonb,
  position integer not null default 0
);
create index course_tiers_course_id_idx on course_tiers (course_id);

create table course_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  title text not null,
  position integer not null default 0
);
create index course_modules_course_id_idx on course_modules (course_id);

create table course_lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references course_modules(id) on delete cascade,
  title text not null,
  video_url text,
  duration_seconds integer,
  is_preview boolean not null default false,
  position integer not null default 0
);
create index course_lessons_module_id_idx on course_lessons (module_id);

create table categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  parent_id uuid references categories(id)
);

create table products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  status product_status not null default 'DRAFT',
  currency text not null default 'NGN',
  category_id uuid references categories(id),
  highlights jsonb,
  care jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index products_category_id_idx on products (category_id);
create index products_status_idx on products (status);

create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  url text not null,
  alt text,
  position integer not null default 0
);
create index product_images_product_id_idx on product_images (product_id);

create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  sku text not null unique,
  size text,
  color text,
  price_minor integer not null check (price_minor >= 0),
  compare_at_price_minor integer,
  stock integer not null default 0 check (stock >= 0),
  status variant_status not null default 'ACTIVE'
);
create index product_variants_product_id_idx on product_variants (product_id);

create table orders (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  paystack_reference text unique,
  user_id uuid references users(id),
  type order_type not null default 'CART',
  status order_status not null default 'PENDING',
  currency text not null default 'NGN',
  subtotal_minor integer not null default 0,
  discount_minor integer not null default 0,
  shipping_minor integer not null default 0,
  total_minor integer not null default 0,
  customer_name text,
  customer_email text,
  customer_phone text,
  shipping_address jsonb,
  metadata jsonb,
  payment_channel text,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index orders_user_id_idx on orders (user_id);
create index orders_status_idx on orders (status);
create index orders_paystack_reference_idx on orders (paystack_reference);

create table enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  tier_id uuid references course_tiers(id),
  source_order_id uuid references orders(id) on delete set null,
  status enrollment_status not null default 'PENDING',
  telegram_invite_url text,
  telegram_invite_expires_at timestamptz,
  telegram_invite_revoked_at timestamptz,
  enrolled_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, course_id)
);
create index enrollments_course_id_idx on enrollments (course_id);
create index enrollments_status_idx on enrollments (status);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id),
  variant_id uuid not null references product_variants(id),
  product_name text not null,
  sku text not null,
  size text,
  color text,
  unit_price_minor integer not null,
  quantity integer not null default 1 check (quantity > 0),
  line_total_minor integer not null
);
create index order_items_order_id_idx on order_items (order_id);
create index order_items_variant_id_idx on order_items (variant_id);

create table payment_transactions (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  order_id uuid references orders(id),
  event_type text,
  amount_minor integer not null,
  currency text not null default 'NGN',
  channel text,
  status text not null,
  raw jsonb,
  created_at timestamptz not null default now()
);
create index payment_transactions_order_id_idx on payment_transactions (order_id);

create table mentorship_tiers (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  price_minor integer not null check (price_minor >= 0),
  duration_months integer not null default 1,
  features jsonb,
  position integer not null default 0
);

create table mentorship_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  tier_id uuid not null references mentorship_tiers(id),
  status mentorship_application_status not null default 'PENDING',
  experience_level text,
  portfolio_url text,
  goals text,
  notes text,
  payment_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index mentorship_applications_user_id_idx on mentorship_applications (user_id);
create index mentorship_applications_tier_id_idx on mentorship_applications (tier_id);

create table consultation_bookings (
  id uuid primary key default gen_random_uuid(),
  calendly_event_uuid text not null unique,
  user_id uuid references users(id),
  name text,
  email text,
  phone text,
  booking_type booking_type not null default 'STYLE_CONSULTATION',
  calendar_event_type text,
  calendly_scheduled_at timestamptz,
  timezone text,
  status booking_status not null default 'CONFIRMED',
  payment_reference text,
  invite_url text,
  raw_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index consultation_bookings_user_id_idx on consultation_bookings (user_id);
create index consultation_bookings_status_idx on consultation_bookings (status);

create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists users_updated_at on users;
create trigger users_updated_at before update on users for each row execute function set_updated_at();

drop trigger if exists courses_updated_at on courses;
create trigger courses_updated_at before update on courses for each row execute function set_updated_at();

drop trigger if exists products_updated_at on products;
create trigger products_updated_at before update on products for each row execute function set_updated_at();

drop trigger if exists orders_updated_at on orders;
create trigger orders_updated_at before update on orders for each row execute function set_updated_at();

drop trigger if exists enrollments_updated_at on enrollments;
create trigger enrollments_updated_at before update on enrollments for each row execute function set_updated_at();

drop trigger if exists mentorship_applications_updated_at on mentorship_applications;
create trigger mentorship_applications_updated_at before update on mentorship_applications for each row execute function set_updated_at();

drop trigger if exists consultation_bookings_updated_at on consultation_bookings;
create trigger consultation_bookings_updated_at before update on consultation_bookings for each row execute function set_updated_at();

-- RLS baseline: service_role bypasses RLS; anon is allowed read-only access to
-- published catalog data only. Tighten per-user policies as auth lands.
alter table users enable row level security;
alter table courses enable row level security;
alter table course_tiers enable row level security;
alter table course_modules enable row level security;
alter table course_lessons enable row level security;
alter table enrollments enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table product_variants enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table payment_transactions enable row level security;
alter table mentorship_tiers enable row level security;
alter table mentorship_applications enable row level security;
alter table consultation_bookings enable row level security;

create policy catalog_read_products on products for select using (status = 'ACTIVE');
create policy catalog_read_product_images on product_images for select using (true);
create policy catalog_read_product_variants on product_variants for select using (status = 'ACTIVE' and stock > 0);
create policy catalog_read_categories on categories for select using (true);
create policy catalog_read_courses on courses for select using (status = 'PUBLISHED');
create policy catalog_read_course_tiers on course_tiers for select using (true);
create policy catalog_read_course_modules on course_modules for select using (true);
create policy preview_read_course_lessons on course_lessons for select using (is_preview = true);
create policy catalog_read_mentorship_tiers on mentorship_tiers for select using (true);
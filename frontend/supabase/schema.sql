drop table if exists hue_score_history    cascade;
drop table if exists ratings              cascade;
drop table if exists disputes             cascade;
drop table if exists maintenance_requests cascade;
drop table if exists payments             cascade;
drop table if exists leases               cascade;
drop table if exists properties           cascade;
drop table if exists users                cascade;
drop table if exists system_config        cascade;

create extension if not exists "uuid-ossp";

create table users (
  id                uuid primary key default gen_random_uuid(),
  supabase_auth_id  uuid unique references auth.users(id) on delete set null,
  role              text not null check (role in ('tenant', 'landlord')),
  full_name         text not null,
  email             text unique not null,
  phone             text,
  bvn_hash          text unique,
  is_verified       boolean default false,
  hue_score         integer default 900,
  hue_tier          text default 'gold'
                      check (hue_tier in ('platinum','gold','silver','bronze','red')),
  section_1_score   integer default 0,
  section_2_score   integer default 0,
  section_3_score   integer default 0,
  section_4_score   integer default 0,
  avatar_url        text,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

create table properties (
  id                    uuid primary key default gen_random_uuid(),
  landlord_id           uuid not null references users(id) on delete cascade,
  title                 text not null,
  address               text not null,
  lga                   text,
  type                  text check (type in ('flat','apartment','duplex','bungalow','room')),
  bedrooms              integer,
  annual_rent_naira     bigint,
  features              jsonb default '{}',
  images                text[],
  is_rentwatch_verified boolean default false,
  verification_docs     text[],
  status                text default 'available'
                          check (status in ('available','occupied','unlisted')),
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

create table leases (
  id                        uuid primary key default gen_random_uuid(),
  tenant_id                 uuid not null references users(id) on delete cascade,
  landlord_id               uuid not null references users(id) on delete cascade,
  property_id               uuid not null references properties(id) on delete cascade,
  payment_frequency         text not null check (payment_frequency in ('monthly','annual')),
  rent_amount_naira         bigint not null,
  deposit_amount_naira      bigint not null,
  lease_start               date not null,
  lease_end                 date not null,
  status                    text default 'active'
                              check (status in ('pending','active','completed','terminated')),
  escrow_status             text default 'pending'
                              check (escrow_status in ('pending','locked','released','refunded','dispute_hold')),
  deposit_returned          boolean,
  deposit_return_date       date,
  deposit_return_type       text check (deposit_return_type in (
                              'full_within_7_days',
                              'full_8_to_14_days',
                              'partial_accepted',
                              'partial_tenant_disputed_won',
                              'not_returned_landlord_won',
                              'not_returned_tenant_won_dispute',
                              'unresolved'
                            )),
  landlord_signed_at        timestamptz,
  tenant_signed_at          timestamptz,
  created_at                timestamptz default now(),
  updated_at                timestamptz default now()
);

create table payments (
  id                     uuid primary key default gen_random_uuid(),
  lease_id               uuid not null references leases(id) on delete cascade,
  tenant_id              uuid not null references users(id) on delete cascade,
  payment_type           text not null default 'rent'
                           check (payment_type in ('rent','deposit')),
  amount_naira           bigint not null,
  due_date               date not null,
  paid_date              date,
  grade                  text check (grade in ('early_plus','early','on_time','late','unpaid')),
  grade_points           integer,
  interswitch_tx_ref     text unique,
  interswitch_payment_id text,
  blockchain_tx_hash     text,
  status                 text default 'pending'
                           check (status in ('pending','processing','confirmed','failed')),
  created_at             timestamptz default now()
);

create table maintenance_requests (
  id                uuid primary key default gen_random_uuid(),
  property_id       uuid not null references properties(id) on delete cascade,
  landlord_id       uuid not null references users(id) on delete cascade,
  tenant_id         uuid not null references users(id) on delete cascade,
  lease_id          uuid references leases(id) on delete set null,
  description       text not null,
  photos            text[],
  filed_at          timestamptz default now(),
  responded_at      timestamptz,
  resolved_at       timestamptz,
  response_days     integer,
  per_request_grade integer,
  status            text default 'open'
                      check (status in ('open','in_progress','resolved','unresolved'))
);

create table disputes (
  id              uuid primary key default gen_random_uuid(),
  type            text not null check (type in (
                    'property_accuracy',
                    'deposit_dispute',
                    'property_damage',
                    'lease_violation',
                    'landlord_property_damage',
                    'maintenance_negligence',
                    'other'
                  )),
  filed_by        text not null check (filed_by in ('tenant','landlord')),
  against         text not null check (against in ('tenant','landlord')),
  property_id     uuid references properties(id) on delete set null,
  landlord_id     uuid references users(id) on delete cascade,
  tenant_id       uuid references users(id) on delete cascade,
  lease_id        uuid references leases(id) on delete set null,
  description     text not null,
  evidence_urls   text[],
  filed_at        timestamptz default now(),
  resolved_at     timestamptz,
  status          text default 'active'
                    check (status in ('active','resolved','dismissed')),
  outcome         text check (outcome in (
                    'confirmed',
                    'tenant_won',
                    'landlord_won',
                    'not_upheld',
                    'dismissed'
                  )),
  is_remediated    boolean default false,
  remediation_date timestamptz,
  score_deduction  integer default 0,
  created_at       timestamptz default now()
);

create table ratings (
  id       uuid primary key default gen_random_uuid(),
  lease_id uuid not null references leases(id) on delete cascade,
  rater_id uuid not null references users(id) on delete cascade,
  rated_id uuid not null references users(id) on delete cascade,
  stars    integer not null check (stars between 1 and 5),
  comment  text,
  rated_at timestamptz default now(),
  unique (lease_id, rater_id)
);

create table hue_score_history (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references users(id) on delete cascade,
  total_score     integer not null,
  tier            text not null,
  section_1_score integer,
  section_2_score integer,
  section_3_score integer,
  section_4_score integer,
  trigger_type    text not null check (trigger_type in (
                    'initial_default',
                    'payment_recorded',
                    'rating_submitted',
                    'dispute_resolved',
                    'maintenance_updated',
                    'accuracy_complaint_resolved',
                    'accuracy_remediated',
                    'admin_correction'
                  )),
  trigger_ref_id  uuid,
  recorded_at     timestamptz default now()
);

create table system_config (
  key        text primary key,
  value      text not null,
  updated_at timestamptz default now()
);

insert into system_config (key, value)
values ('demo_date_offset_days', '0');

alter table users                enable row level security;
alter table properties           enable row level security;
alter table leases               enable row level security;
alter table payments             enable row level security;
alter table maintenance_requests enable row level security;
alter table disputes             enable row level security;
alter table ratings              enable row level security;
alter table hue_score_history    enable row level security;
alter table system_config        enable row level security;

create policy "users_public_read"
  on users for select using (true);

create policy "users_self_update"
  on users for update using (auth.uid() = supabase_auth_id);

create policy "users_self_insert"
  on users for insert with check (auth.uid() = supabase_auth_id);

create policy "properties_public_read"
  on properties for select using (true);

create policy "properties_landlord_insert"
  on properties for insert with check (
    landlord_id = (select id from users where supabase_auth_id = auth.uid())
  );

create policy "properties_landlord_update"
  on properties for update using (
    landlord_id = (select id from users where supabase_auth_id = auth.uid())
  );

create policy "leases_parties_read"
  on leases for select using (
    tenant_id   = (select id from users where supabase_auth_id = auth.uid())
    or
    landlord_id = (select id from users where supabase_auth_id = auth.uid())
  );

create policy "payments_parties_read"
  on payments for select using (
    lease_id in (
      select id from leases where
        tenant_id   = (select id from users where supabase_auth_id = auth.uid())
        or
        landlord_id = (select id from users where supabase_auth_id = auth.uid())
    )
  );

create policy "maintenance_parties_read"
  on maintenance_requests for select using (
    tenant_id   = (select id from users where supabase_auth_id = auth.uid())
    or
    landlord_id = (select id from users where supabase_auth_id = auth.uid())
  );

create policy "maintenance_tenant_insert"
  on maintenance_requests for insert with check (
    tenant_id = (select id from users where supabase_auth_id = auth.uid())
  );

create policy "disputes_parties_read"
  on disputes for select using (
    tenant_id   = (select id from users where supabase_auth_id = auth.uid())
    or
    landlord_id = (select id from users where supabase_auth_id = auth.uid())
  );

create policy "disputes_insert"
  on disputes for insert with check (
    tenant_id   = (select id from users where supabase_auth_id = auth.uid())
    or
    landlord_id = (select id from users where supabase_auth_id = auth.uid())
  );

create policy "ratings_parties_read"
  on ratings for select using (
    rater_id = (select id from users where supabase_auth_id = auth.uid())
    or
    rated_id = (select id from users where supabase_auth_id = auth.uid())
  );

create policy "ratings_insert"
  on ratings for insert with check (
    rater_id = (select id from users where supabase_auth_id = auth.uid())
  );

create policy "history_own_read"
  on hue_score_history for select using (
    user_id = (select id from users where supabase_auth_id = auth.uid())
  );

create policy "config_public_read"
  on system_config for select using (true);

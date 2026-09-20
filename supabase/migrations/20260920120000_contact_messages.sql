create table public.contact_messages (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  message text not null,
  ip_hash text,
  created_at timestamptz not null default now(),
  notified_at timestamptz,
  notify_error text,
  constraint contact_messages_name_length
    check (char_length(name) between 1 and 100),
  constraint contact_messages_email_length
    check (char_length(email) between 3 and 254),
  constraint contact_messages_message_length
    check (char_length(message) between 10 and 5000),
  constraint contact_messages_notify_error_length
    check (notify_error is null or char_length(notify_error) <= 2000)
);

create index contact_messages_created_at_idx
  on public.contact_messages (created_at desc);

create index contact_messages_rate_limit_idx
  on public.contact_messages (ip_hash, created_at desc)
  where ip_hash is not null;

create index contact_messages_pending_notify_idx
  on public.contact_messages (created_at desc)
  where notified_at is null;

alter table public.contact_messages enable row level security;

revoke all on table public.contact_messages from anon, authenticated;

grant insert (name, email, message, ip_hash)
  on table public.contact_messages to anon;

grant select, update, delete on table public.contact_messages to authenticated;

create policy contact_messages_anon_insert
  on public.contact_messages
  for insert
  to anon
  with check (true);

create policy contact_messages_owner_select
  on public.contact_messages
  for select
  to authenticated
  using (true);

create policy contact_messages_owner_update
  on public.contact_messages
  for update
  to authenticated
  using (true)
  with check (true);

create policy contact_messages_owner_delete
  on public.contact_messages
  for delete
  to authenticated
  using (true);

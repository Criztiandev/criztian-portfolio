create table public.contact_messages (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) between 3 and 254),
  message text not null check (char_length(message) between 10 and 2000),
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

revoke all on public.contact_messages from anon, authenticated;
grant insert on public.contact_messages to anon, authenticated;
grant select on public.contact_messages to authenticated;

create policy "anyone can submit a contact message"
  on public.contact_messages
  for insert
  to anon, authenticated
  with check (true);

create policy "signed-in users can read contact messages"
  on public.contact_messages
  for select
  to authenticated
  using (true);

create index contact_messages_created_at_idx
  on public.contact_messages (created_at desc);

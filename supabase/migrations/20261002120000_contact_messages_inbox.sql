alter table public.contact_messages
  add column read_at timestamptz,
  add column archived_at timestamptz;

create index contact_messages_unread_idx
  on public.contact_messages (id)
  where read_at is null and archived_at is null;

revoke select, update on table public.contact_messages from authenticated;

grant select (
  id,
  name,
  email,
  message,
  service,
  created_at,
  notified_at,
  notify_error,
  read_at,
  archived_at
) on table public.contact_messages to authenticated;

grant update (read_at, archived_at)
  on table public.contact_messages to authenticated;

drop policy if exists contact_messages_anon_insert on public.contact_messages;

revoke insert on table public.contact_messages from anon;

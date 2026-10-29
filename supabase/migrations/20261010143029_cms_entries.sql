create table public.cms_entries (
  id bigint generated always as identity primary key,
  collection text not null check (char_length(collection) between 1 and 100),
  draft jsonb check (jsonb_typeof(draft) = 'object'),
  published jsonb check (jsonb_typeof(published) = 'object'),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid default auth.uid() references auth.users (id) on delete set null,
  constraint cms_entries_has_content check (draft is not null or published is not null)
);

alter table public.cms_entries enable row level security;

revoke all on public.cms_entries from anon, authenticated;
grant select (id, collection, published) on public.cms_entries to anon;
grant select, insert, update, delete on public.cms_entries to authenticated;

create policy "anyone can read live entries"
  on public.cms_entries
  for select
  to anon
  using (published is not null);

create policy "signed-in users can read entries"
  on public.cms_entries
  for select
  to authenticated
  using (true);

create policy "signed-in users can create entries"
  on public.cms_entries
  for insert
  to authenticated
  with check (true);

create policy "signed-in users can update entries"
  on public.cms_entries
  for update
  to authenticated
  using (true)
  with check (true);

create policy "signed-in users can delete entries"
  on public.cms_entries
  for delete
  to authenticated
  using (true);

create unique index cms_entries_live_slug_key
  on public.cms_entries (collection, (published ->> 'slug'))
  where published is not null;

create index cms_entries_collection_updated_at_idx
  on public.cms_entries (collection, updated_at desc);

create index cms_entries_updated_by_idx
  on public.cms_entries (updated_by);

create function public.cms_entries_touch()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  new.updated_by = (select auth.uid());
  return new;
end;
$$;

revoke execute on function public.cms_entries_touch() from public, anon, authenticated;

create trigger cms_entries_touch
  before update on public.cms_entries
  for each row execute function public.cms_entries_touch();

create function public.cms_publish_entry(entry_id bigint)
returns bigint
language sql
set search_path = ''
as $$
  update public.cms_entries
  set published = draft, draft = null, published_at = now()
  where id = entry_id and draft is not null
  returning id;
$$;

revoke execute on function public.cms_publish_entry(bigint) from public, anon, authenticated;
grant execute on function public.cms_publish_entry(bigint) to authenticated;

create table public.site_content (
  id bigint generated always as identity primary key,
  draft jsonb not null default '{}'::jsonb,
  published jsonb,
  draft_updated_at timestamptz not null default now(),
  published_at timestamptz,
  constraint site_content_draft_size
    check (length(draft::text) <= 131072),
  constraint site_content_published_size
    check (published is null or length(published::text) <= 131072)
);

create unique index site_content_singleton_idx
  on public.site_content ((true));

alter table public.site_content enable row level security;

alter table public.site_content force row level security;

revoke all on table public.site_content from anon, authenticated;

grant select, update on table public.site_content to authenticated;

create policy site_content_owner_select
  on public.site_content
  for select
  to authenticated
  using ((select auth.uid()) is not null);

create policy site_content_owner_update
  on public.site_content
  for update
  to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

insert into public.site_content (draft) values ('{}'::jsonb);

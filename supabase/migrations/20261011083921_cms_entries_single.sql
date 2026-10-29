alter table public.cms_entries
  add column single boolean not null default false;

create unique index cms_entries_single_key
  on public.cms_entries (collection)
  where single;

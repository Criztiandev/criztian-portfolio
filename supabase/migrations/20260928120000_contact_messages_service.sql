alter table public.contact_messages
  add column service text,
  add constraint contact_messages_service_allowed
    check (
      service is null
      or service in ('branding', 'web_design', 'development', 'something_else')
    );

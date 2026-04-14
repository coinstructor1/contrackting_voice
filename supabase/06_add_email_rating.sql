alter table ratings
  add column if not exists email_attempted boolean default false,
  add column if not exists email_attempts int;

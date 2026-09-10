alter table public.recycler_users enable row level security;

create policy "recycler users can view own account"
on public.recycler_users
for select
to authenticated
using (
  profile_id = auth.uid()
);
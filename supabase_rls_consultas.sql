-- Permite que el formulario público guarde consultas en Supabase.
-- Ejecuta este script en el SQL Editor de Supabase.

alter table public.consultas enable row level security;

drop policy if exists "Public insert consultas" on public.consultas;
create policy "Public insert consultas"
on public.consultas
for insert
to anon, authenticated
with check (true);

drop policy if exists "Authenticated read consultas" on public.consultas;
create policy "Authenticated read consultas"
on public.consultas
for select
to authenticated
using (true);
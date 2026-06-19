-- Permite leer la configuración pública del sitio desde el frontend.
-- Ejecuta este script en el SQL Editor de Supabase.

alter table public.configuracion enable row level security;

drop policy if exists "Public read configuracion" on public.configuracion;
create policy "Public read configuracion"
on public.configuracion
for select
to anon, authenticated
using (true);
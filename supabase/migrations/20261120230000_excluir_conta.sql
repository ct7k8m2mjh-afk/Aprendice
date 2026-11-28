-- Excluir a conta pelo site (LGPD; decisão do dono, 20/11/2026). Ver docs/contas.md.
-- A pessoa logada apaga a PRÓPRIA conta: perfil, progresso e o usuário do serviço de contas (sessões, identidades e
-- tokens saem em cascata). A função roda no servidor com os privilégios do dono do banco (security definer) e só
-- age sobre auth.uid(); o site chama por RPC com a chave pública. Nenhuma chave de serviço vai ao navegador.
-- Aplicar no painel do Supabase (SQL Editor) ou pela ferramenta apply_migration antes de publicar o botão.
create or replace function public.excluir_minha_conta() returns void
language plpgsql security definer set search_path = '' as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'sem sessão' using errcode = '28000';
  end if;
  delete from public.progresso where user_id = uid;
  delete from public.perfis where id = uid;
  delete from auth.users where id = uid;
end $$;

revoke all on function public.excluir_minha_conta() from public, anon;
grant execute on function public.excluir_minha_conta() to authenticated;

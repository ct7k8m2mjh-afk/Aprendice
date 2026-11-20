-- Registro do que foi aplicado no projeto Supabase "aprendice" (sa-east-1) em 20/11/2026, pela ferramenta apply_migration.
-- Contas do Aprendice: perfil de estudo e progresso de cada aluno. Ver docs/contas.md.
-- O e-mail do administrador NÃO fica aqui: ele foi inserido por SQL direto em privado.admins.
create schema if not exists privado;
revoke all on schema privado from public, anon, authenticated;

-- e-mails que viram administrador ao se cadastrar (só no banco; schema fora da API)
create table privado.admins (email text primary key);
revoke all on privado.admins from public, anon, authenticated;

create table public.perfis (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null default '' check (char_length(nome) <= 80),
  provas_alvo text[] not null default '{}' check (cardinality(provas_alvo) <= 60),
  datas_prova jsonb not null default '{}'::jsonb check (jsonb_typeof(datas_prova) = 'object' and pg_column_size(datas_prova) < 8000),
  meta integer not null default 150 check (meta between 1 and 5000),
  completo boolean not null default false,
  papel text not null default 'aluno' check (papel in ('aluno', 'admin')),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table public.progresso (
  user_id uuid primary key references auth.users(id) on delete cascade,
  dados jsonb not null default '{}'::jsonb check (jsonb_typeof(dados) = 'object' and pg_column_size(dados) < 5000000),
  rev bigint not null default 0,
  atualizado_em timestamptz not null default now()
);

alter table public.perfis enable row level security;
alter table public.progresso enable row level security;

-- ninguém insere nem apaga pelo cliente (as linhas nascem no cadastro); no perfil, o papel não é atualizável
revoke all on public.perfis from anon, authenticated;
revoke all on public.progresso from anon, authenticated;
grant select on public.perfis to authenticated;
grant update (nome, provas_alvo, datas_prova, meta, completo, atualizado_em) on public.perfis to authenticated;
grant select, update on public.progresso to authenticated;

create policy "perfil: ler o próprio" on public.perfis for select to authenticated using ((select auth.uid()) = id);
create policy "perfil: alterar o próprio" on public.perfis for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "progresso: ler o próprio" on public.progresso for select to authenticated using ((select auth.uid()) = user_id);
create policy "progresso: alterar o próprio" on public.progresso for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- segunda trava: o papel só muda fora da API (SQL do dono / servidor)
create or replace function privado.trava_papel() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.papel is distinct from old.papel and coalesce(current_setting('request.jwt.claim.role', true), '') in ('anon', 'authenticated')
     or new.papel is distinct from old.papel and current_user in ('anon', 'authenticated') then
    raise exception 'o papel não pode ser alterado pelo site';
  end if;
  if new.id is distinct from old.id then raise exception 'id não muda'; end if;
  new.atualizado_em := now();
  return new;
end $$;
create trigger perfis_trava_papel before update on public.perfis for each row execute function privado.trava_papel();

create or replace function privado.trava_progresso() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.user_id is distinct from old.user_id then raise exception 'user_id não muda'; end if;
  new.atualizado_em := now();
  return new;
end $$;
create trigger progresso_trava before update on public.progresso for each row execute function privado.trava_progresso();

-- cadastro: cria o perfil e o progresso vazios; o e-mail da lista privado.admins nasce administrador
create or replace function privado.nova_conta() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.perfis (id, papel)
  values (new.id, case when exists (select 1 from privado.admins a where a.email = lower(new.email)) then 'admin' else 'aluno' end)
  on conflict (id) do nothing;
  insert into public.progresso (user_id) values (new.id) on conflict (user_id) do nothing;
  return new;
end $$;
revoke all on function privado.nova_conta() from public, anon, authenticated;
create trigger ao_criar_conta after insert on auth.users for each row execute function privado.nova_conta();

-- ===== revisão de segurança (20/11/2026, migration admin_so_com_email_confirmado) =====
-- o papel de administrador só vem depois de o e-mail ser confirmado
create or replace function privado.nova_conta() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.perfis (id, papel)
  values (new.id, case when new.email_confirmed_at is not null
                        and exists (select 1 from privado.admins a where a.email = lower(new.email)) then 'admin' else 'aluno' end)
  on conflict (id) do nothing;
  insert into public.progresso (user_id) values (new.id) on conflict (user_id) do nothing;
  return new;
end $$;

create or replace function privado.confirma_admin() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.email_confirmed_at is not null and old.email_confirmed_at is null
     and exists (select 1 from privado.admins a where a.email = lower(new.email)) then
    update public.perfis set papel = 'admin' where id = new.id;
  end if;
  return new;
end $$;
revoke all on function privado.confirma_admin() from public, anon, authenticated;
create trigger ao_confirmar_email after update of email_confirmed_at on auth.users for each row execute function privado.confirma_admin();

insert into public.perfis (id) select id from auth.users on conflict (id) do nothing;
insert into public.progresso (user_id) select id from auth.users on conflict (user_id) do nothing;

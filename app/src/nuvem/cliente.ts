/**
 * Cliente do serviço de contas na nuvem (Supabase; decisão do dono, 20/11/2026).
 * Só a URL do projeto e a chave PÚBLICA (publishable) vêm das variáveis VITE_ — elas podem estar no navegador: quem
 * protege os dados é a RLS do banco (cada aluno lê e grava só o que é dele). Nenhuma chave secreta entra no site.
 * Sem as variáveis (prévia de arquivo único) ou nos testes, não há cliente: o site segue no modo local do aparelho;
 * os testes injetam um cliente falso com defineClienteNuvem.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const URL_NUVEM = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const CHAVE_PUBLICA = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

let cliente: SupabaseClient | null | undefined;

export function nuvem(): SupabaseClient | null {
  if (cliente !== undefined) return cliente;
  if (import.meta.env.MODE === 'test' || import.meta.env.VITE_PREVIA === '1' || !URL_NUVEM || !CHAVE_PUBLICA) cliente = null;
  else cliente = createClient(URL_NUVEM, CHAVE_PUBLICA, {
    // pkce: o link do e-mail volta com ?code= (não briga com o # das rotas do site)
    auth: { flowType: 'pkce', persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
  return cliente;
}

/** testes: troca o cliente (um falso, sem rede) */
export function defineClienteNuvem(c: SupabaseClient | null | undefined) { cliente = c; }

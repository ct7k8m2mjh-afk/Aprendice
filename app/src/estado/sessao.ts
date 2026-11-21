/**
 * Contas de verdade (decisão do dono, 20/11/2026): login por e-mail e senha no serviço de contas (Supabase) e o progresso
 * guardado na nuvem.
 *
 * - O aparelho continua sendo a cópia de trabalho (estado/loja.ts): o site funciona sem internet e envia depois.
 * - Ao entrar, o progresso da nuvem é juntado ao do aparelho (estado/mescla.ts). No primeiro login, o progresso que já
 *   estava no aparelho (de antes das contas) vai junto para a conta, sem perder nada e sem mudar ids (princípio 7).
 * - Envio com controle de versão (coluna rev): se outro aparelho gravou antes, baixa, junta e envia de novo.
 * - O perfil de estudo (nome, provas-alvo, datas, meta) mora na tabela perfis; o papel (aluno ou admin) só é lido —
 *   ele só muda por SQL no servidor (a RLS e uma trava no banco impedem mudar pelo site).
 * - Sair envia o que falta, encerra a sessão e tira o progresso do aparelho. Sem internet, o que não foi enviado fica
 *   numa cópia pendente DESTA conta, juntada no próximo login dela.
 * Sem cliente configurado (prévia de arquivo único, testes sem cliente falso) a fase é 'local': o site segue como antes,
 * tudo no aparelho.
 */
import { useSyncExternalStore } from 'react';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { nuvem } from '../nuvem/cliente';
import { inscreve, limpaAparelho, pegaEstado, salvaAgora, substituiSemMarcar } from './loja';
import { estadoDaNuvem, mesclaEstados, paraNuvem } from './mescla';
import { chaveConta, voltaAConta } from './conta';
import { defineAdmin } from '../dados/modoAdmin';
import { estadoVazio, type Estado, type Perfil } from './tipos';

export type FaseConta = 'local' | 'carregando' | 'fora' | 'dentro' | 'nova-senha';
export type Sincronia = 'ok' | 'enviando' | 'pendente';

export interface Conta {
  fase: FaseConta;
  uid: string | null;
  email: string | null;
  papel: 'aluno' | 'admin';
  sinc: Sincronia;
  /** aviso para a tela de login (ex.: link do e-mail vencido) */
  aviso: string;
}

interface LinhaPerfil {
  id: string; nome: string; provas_alvo: string[]; datas_prova: Record<string, string>; meta: number;
  completo: boolean; papel: 'aluno' | 'admin'; criado_em: string;
}

const CHAVE_PENDENTE = 'aprendice.pendente.';
/** perfil mudado no aparelho e ainda não enviado (revisão de segurança, 20/11/2026): ao entrar de novo, ele vence o da nuvem */
const CHAVE_PERFIL_PENDENTE = 'aprendice.perfil-pendente.';
function marcaPerfilPendente(uid: string, p: Perfil | null) { try { if (p) localStorage.setItem(CHAVE_PERFIL_PENDENTE + uid, JSON.stringify(p)); else localStorage.removeItem(CHAVE_PERFIL_PENDENTE + uid); } catch { /* sem armazenamento */ } }
function perfilPendente(uid: string): Perfil | null {
  try { const t = localStorage.getItem(CHAVE_PERFIL_PENDENTE + uid); const p = t ? JSON.parse(t) : null; return p && typeof p === 'object' && typeof p.nome === 'string' ? (p as Perfil) : null; } catch { return null; }
}

let conta: Conta = { fase: 'local', uid: null, email: null, papel: 'aluno', sinc: 'ok', aviso: '' };
const ouvintes = new Set<() => void>();
function muda(p: Partial<Conta>) { conta = { ...conta, ...p }; ouvintes.forEach((o) => o()); }
export function pegaConta(): Conta { return conta; }
export function useConta(): Conta {
  return useSyncExternalStore((o) => { ouvintes.add(o); return () => { ouvintes.delete(o); }; }, () => conta, () => conta);
}

// ---------- cópia pendente por conta (sem internet ao sair) ----------
function lePendente(uid: string): Estado | null {
  try { const t = localStorage.getItem(CHAVE_PENDENTE + uid); return t ? estadoDaNuvem(JSON.parse(t)) : null; } catch { return null; }
}
function guardaPendente(uid: string, e: Estado) {
  try { localStorage.setItem(CHAVE_PENDENTE + uid, JSON.stringify(paraNuvem(e))); } catch { /* sem armazenamento */ }
}
function apagaPendente(uid: string) { try { localStorage.removeItem(CHAVE_PENDENTE + uid); } catch { /* sem armazenamento */ } }

// ---------- perfil ----------
function perfilDaLinha(l: LinhaPerfil, email: string): Perfil {
  return { nome: l.nome || 'Estudante', email, provasAlvo: l.provas_alvo || [], meta: l.meta || 150,
    criadoEm: Date.parse(l.criado_em) || Date.now(), datasProva: l.datas_prova || {} };
}
function linhaDoPerfil(p: Perfil) {
  return { nome: (p.nome || '').slice(0, 80), provas_alvo: p.provasAlvo || [], datas_prova: p.datasProva || {}, meta: p.meta || 150, completo: true };
}

// ---------- envio ----------
let rev = 0;
let ultimoEnviado = '';
let ultimoPerfil: Perfil | null = null;
let enviando: Promise<boolean> | null = null;
let deNovo = false;
let tEnvio: ReturnType<typeof setTimeout> | null = null;
let tPerfil: ReturnType<typeof setTimeout> | null = null;
let tRetentar: ReturnType<typeof setTimeout> | null = null;

function cli(): SupabaseClient { return nuvem()!; }

/** baixa a linha de progresso da nuvem e junta ao estado do aparelho */
async function baixaEJunta(uid: string): Promise<void> {
  const { data, error } = await cli().from('progresso').select('dados, rev').eq('user_id', uid).maybeSingle();
  if (error) throw error;
  // conta sem linha de progresso (não deveria acontecer: o cadastro cria): erro, para não repetir em silêncio
  if (!data) throw new Error('progresso sem linha na nuvem');
  rev = data?.rev ?? 0;
  const daNuvem = estadoDaNuvem(data?.dados);
  if (daNuvem) substituiSemMarcar(mesclaEstados(pegaEstado(), daNuvem));
}

async function enviaUmaVez(): Promise<boolean> {
  const uid = conta.uid;
  if (!uid || conta.fase !== 'dentro') return false;
  for (let tentativa = 0; tentativa < 4; tentativa++) {
    const dados = paraNuvem(pegaEstado());
    const txt = JSON.stringify(dados);
    if (txt === ultimoEnviado) { muda({ sinc: 'ok' }); return true; }
    muda({ sinc: 'enviando' });
    const { data, error } = await cli().from('progresso').update({ dados, rev: rev + 1 }).eq('user_id', uid).eq('rev', rev).select('rev');
    if (error) throw error;
    if (data && data.length) { rev = data[0].rev; ultimoEnviado = txt; apagaPendente(uid); muda({ sinc: 'ok' }); return true; }
    // outro aparelho gravou antes: baixa, junta e tenta de novo
    await baixaEJunta(uid);
  }
  return false;
}

/** envia o progresso agora; devolve true quando a nuvem ficou igual ao aparelho */
export function enviaAgora(): Promise<boolean> {
  if (enviando) { deNovo = true; return enviando; }
  enviando = enviaUmaVez()
    .catch(() => false)
    .then((ok) => {
      enviando = null;
      if (!ok) { muda({ sinc: 'pendente' }); retentaDepois(); }
      if (deNovo) { deNovo = false; agendaEnvio(); }
      return ok;
    });
  return enviando;
}

function agendaEnvio(ms = 2000) {
  if (tEnvio) clearTimeout(tEnvio);
  tEnvio = setTimeout(() => { tEnvio = null; void enviaAgora(); }, ms);
}
function retentaDepois() {
  if (tRetentar) return;
  tRetentar = setTimeout(() => { tRetentar = null; if (conta.fase === 'dentro') { void enviaAgora(); void enviaPerfil(); } }, 30000);
}

async function enviaPerfil(): Promise<boolean> {
  const p = pegaEstado().perfil;
  if (!p || !conta.uid || conta.fase !== 'dentro') return false;
  const uid = conta.uid;
  const r = await cli().from('perfis').update(linhaDoPerfil(p)).eq('id', uid).then((x) => x, () => ({ error: true }));
  if (r.error) { retentaDepois(); return false; }
  ultimoPerfil = p;
  if (pegaEstado().perfil === p) marcaPerfilPendente(uid, null);
  return true;
}

// o aluno mexeu no aparelho: agenda o envio (perfil e progresso)
let ouvindo = false;
function ouveLoja() {
  if (ouvindo) return;
  ouvindo = true;
  inscreve(() => {
    if (conta.fase !== 'dentro') return;
    const p = pegaEstado().perfil;
    if (p && p !== ultimoPerfil) { if (conta.uid) marcaPerfilPendente(conta.uid, p); if (tPerfil) clearTimeout(tPerfil); tPerfil = setTimeout(() => { tPerfil = null; void enviaPerfil(); }, 1500); }
    agendaEnvio();
  });
  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => { if (conta.fase === 'dentro') { void enviaAgora(); void enviaPerfil(); } });
    window.addEventListener('pagehide', () => { if (conta.fase === 'dentro' && tEnvio) { clearTimeout(tEnvio); tEnvio = null; void enviaAgora(); } });
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && conta.fase === 'dentro' && tEnvio) { clearTimeout(tEnvio); tEnvio = null; void enviaAgora(); } });
  }
}

// ---------- entrar ----------
let entrandoUid: string | null = null;
/** entrou com o que estava no aparelho sem ouvir o serviço (sem rede ou lento): a sessão que chegar depois junta tudo */
let faltaJuntar = false;

/** sessão aberta (login, link do e-mail ou sessão guardada): junta o progresso e carrega o perfil */
export async function entraNaConta(user: Pick<User, 'id' | 'email'>): Promise<void> {
  const uid = user.id, email = user.email || '';
  if ((conta.fase === 'dentro' && conta.uid === uid && !faltaJuntar) || entrandoUid === uid) return;
  faltaJuntar = false;
  entrandoUid = uid;
  ouveLoja();
  const local = pegaEstado();
  // progresso de OUTRA conta no aparelho (sessão que venceu sem sair): vai para a cópia pendente dela, nunca para esta
  let base: Estado = local;
  if (local.conta && local.conta !== uid) { guardaPendente(local.conta, local); base = { ...estadoVazio(), pref: local.pref }; }
  const herdaLocal = !local.conta || local.conta === uid;
  // mesma conta e perfil no aparelho: entra já (funciona sem internet) e junta em segundo plano
  if (local.conta === uid && local.perfil) muda({ fase: 'dentro', uid, email, sinc: 'enviando' });
  else muda({ fase: 'carregando', uid, email });
  rev = 0; ultimoEnviado = '';
  try {
    const [rp, rg] = await Promise.all([
      cli().from('perfis').select('*').eq('id', uid).maybeSingle(),
      cli().from('progresso').select('dados, rev').eq('user_id', uid).maybeSingle(),
    ]);
    if (rp.error) throw rp.error;
    if (rg.error) throw rg.error;
    const linha = rp.data as LinhaPerfil | null;
    rev = rg.data?.rev ?? 0;
    const pend = lePendente(uid);
    let junto = pend ? mesclaEstados(base, pend) : base;
    junto = mesclaEstados(junto, estadoDaNuvem(rg.data?.dados));
    // perfil: o da nuvem; conta nova com perfil no aparelho (de antes das contas, ou guardado ao sair) leva esse perfil
    let perfil: Perfil | null = null;
    let sobePerfil = false;
    const pendP = herdaLocal ? perfilPendente(uid) : null;
    if (pendP) { perfil = { ...pendP, email }; sobePerfil = true; }
    else if (linha?.completo) perfil = perfilDaLinha(linha, email);
    else if (herdaLocal) {
      const doAparelho = local.perfil || voltaAConta(local, email)?.perfil || null;
      if (doAparelho) { perfil = { ...doAparelho, email }; sobePerfil = true; }
    }
    const salvos = { ...(junto.perfisSalvos || {}) };
    delete salvos[chaveConta(email)];
    substituiSemMarcar({ ...junto, perfil, conta: uid, perfisSalvos: salvos, perfilSalvo: null });
    salvaAgora();
    ultimoPerfil = sobePerfil ? null : perfil;
    defineAdmin(linha?.papel === 'admin');
    muda({ fase: 'dentro', uid, email, papel: linha?.papel === 'admin' ? 'admin' : 'aluno' });
    if (pend) apagaPendente(uid);
    if (sobePerfil) await enviaPerfil();
    await enviaAgora();
  } catch {
    // sem internet: segue com o que está no aparelho e envia quando a conexão voltar
    if (conta.fase !== 'dentro') {
      substituiSemMarcar({ ...base, conta: uid, perfil: herdaLocal ? local.perfil : null });
      muda({ fase: 'dentro', uid, email });
    }
    muda({ sinc: 'pendente' });
    retentaDepois();
  } finally {
    entrandoUid = null;
  }
}

// ---------- sair ----------
function limitaTempo<T>(p: Promise<T>, ms: number, falha: T): Promise<T> {
  return new Promise((ok) => { const t = setTimeout(() => ok(falha), ms); p.then((v) => { clearTimeout(t); ok(v); }, () => { clearTimeout(t); ok(falha); }); });
}

function fechaConta(aviso = '') {
  const uid = conta.uid;
  if (uid && conta.sinc !== 'ok') guardaPendente(uid, pegaEstado());
  [tEnvio, tPerfil, tRetentar].forEach((t) => t && clearTimeout(t));
  tEnvio = tPerfil = tRetentar = null;
  rev = 0; ultimoEnviado = ''; ultimoPerfil = null;
  defineAdmin(false);
  // as cópias de segurança antigas do aparelho saem junto quando tudo já está na nuvem
  limpaAparelho(!(uid && conta.sinc !== 'ok'));
  muda({ fase: 'fora', uid: null, email: null, papel: 'aluno', sinc: 'ok', aviso });
}

export async function sair(): Promise<void> {
  if (conta.fase === 'local' || conta.fase === 'fora') return;
  if (!nuvem()) { fechaConta(); return; }
  salvaAgora();
  if (tPerfil) { clearTimeout(tPerfil); tPerfil = null; }
  // perfil mudado e ainda não enviado: envia agora (sem internet, a cópia pendente dele fica para o próximo login)
  if (conta.fase === 'dentro' && conta.uid && perfilPendente(conta.uid)) await limitaTempo(enviaPerfil(), 5000, false);
  const ok = conta.fase === 'dentro' ? await limitaTempo(enviaAgora(), 6000, false) : true;
  if (!ok && conta.uid) guardaPendente(conta.uid, pegaEstado());
  saindo = true;
  await limitaTempo(cli().auth.signOut({ scope: 'local' }).then(() => undefined), 4000, undefined);
  saindo = false;
  fechaConta();
}
let saindo = false;

// ---------- excluir a conta (LGPD; decisão do dono, 20/11/2026) ----------
/**
 * Apaga a conta e todos os dados do aluno. Na nuvem, a função `public.excluir_minha_conta()` (security definer,
 * supabase/migrations/20261120230000_excluir_conta.sql) apaga o perfil, o progresso e o usuário de quem está logado —
 * só dele (auth.uid()), sem chave de serviço no navegador. Depois, o aparelho é limpo: progresso, cópias de segurança,
 * cópias pendentes e o perfil guardado desta conta. Sem cliente (modo de demonstração), apaga o que está no aparelho.
 * Devolve null quando apagou, ou a mensagem de erro (nada é apagado no aparelho se a nuvem falhar).
 */
export async function excluirConta(): Promise<string | null> {
  const e = pegaEstado();
  const email = chaveConta(conta.email || e.perfil?.email || '');
  const semPerfilDesta = (x: Estado) => { const m = { ...(x.perfisSalvos || {}) }; if (email) delete m[email]; return m; };
  if (conta.fase === 'local' || !nuvem()) {
    limpaAparelho(true, { perfisSalvos: semPerfilDesta(e) });
    return null;
  }
  if (conta.fase !== 'dentro' || !conta.uid) return 'Entre na sua conta para excluí-la.';
  const uid = conta.uid;
  const r = await cli().rpc('excluir_minha_conta').then((x) => x, (err) => ({ error: err as { message?: string } }));
  if (r.error) return traduzErro(r.error);
  [tEnvio, tPerfil, tRetentar].forEach((t) => t && clearTimeout(t));
  tEnvio = tPerfil = tRetentar = null;
  apagaPendente(uid);
  marcaPerfilPendente(uid, null);
  saindo = true;
  await limitaTempo(cli().auth.signOut({ scope: 'local' }).then(() => undefined), 4000, undefined);
  saindo = false;
  rev = 0; ultimoEnviado = ''; ultimoPerfil = null;
  defineAdmin(false);
  limpaAparelho(true, { perfisSalvos: semPerfilDesta(pegaEstado()) });
  muda({ fase: 'fora', uid: null, email: null, papel: 'aluno', sinc: 'ok', aviso: 'Sua conta e todos os seus dados foram excluídos.' });
  return null;
}

// ---------- ações da tela de login ----------
function urlDoSite(): string { return location.origin + location.pathname; }

/** mensagens do serviço de contas em português */
export function traduzErro(e: { message?: string; code?: string; status?: number } | null | undefined): string {
  const m = (e?.message || '').toLowerCase();
  const c = e?.code || '';
  if (c === 'invalid_credentials' || m.includes('invalid login')) return 'E-mail ou senha incorretos.';
  if (c === 'email_not_confirmed' || m.includes('not confirmed')) return 'Antes de entrar, abra o link que enviamos para o seu e-mail.';
  if (c === 'user_already_exists' || m.includes('already registered')) return 'Já existe uma conta com este e-mail. Entre ou use “Esqueceu sua senha?”.';
  if (c === 'weak_password' || m.includes('password should')) return 'Senha fraca: use pelo menos 6 caracteres, misturando letras e números.';
  if (c === 'over_email_send_rate_limit' || c === 'over_request_rate_limit' || m.includes('rate limit') || e?.status === 429) return 'Muitas tentativas agora. Espere alguns minutos e tente de novo.';
  if (c === 'email_address_invalid' || m.includes('email address') && m.includes('invalid')) return 'Este e-mail não foi aceito. Confira se está certo.';
  if (c === 'same_password') return 'A nova senha precisa ser diferente da anterior.';
  if (m.includes('fetch') || m.includes('network') || m.includes('failed to')) return 'Sem internet. Confira a conexão e tente de novo.';
  return 'Não foi possível concluir agora. Tente de novo em instantes.';
}

export async function entrar(email: string, senha: string): Promise<string | null> {
  const { error } = await cli().auth.signInWithPassword({ email: email.trim(), password: senha });
  return error ? traduzErro(error) : null;
}

/** cria a conta; `confirmar` = a conta precisa do link de confirmação enviado por e-mail */
export async function criarConta(email: string, senha: string): Promise<{ erro?: string; confirmar?: boolean }> {
  const { data, error } = await cli().auth.signUp({ email: email.trim(), password: senha, options: { emailRedirectTo: urlDoSite() } });
  if (error) return { erro: traduzErro(error) };
  // e-mail já cadastrado e confirmado: o serviço não diz, mas devolve o usuário sem identidade
  if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) return { erro: traduzErro({ code: 'user_already_exists' }) };
  return data.session ? {} : { confirmar: true };
}

export async function esqueciSenha(email: string): Promise<string | null> {
  const { error } = await cli().auth.resetPasswordForEmail(email.trim(), { redirectTo: urlDoSite() });
  return error ? traduzErro(error) : null;
}

export async function novaSenha(senha: string): Promise<string | null> {
  const { data, error } = await cli().auth.updateUser({ password: senha });
  if (error) return traduzErro(error);
  muda({ fase: 'carregando' });
  if (data.user) await entraNaConta(data.user);
  return null;
}

// ---------- início ----------
let iniciou = false;
export function iniciaConta(): void {
  if (iniciou) return;
  iniciou = true;
  const sb = nuvem();
  if (!sb) { muda({ fase: 'local' }); return; }
  muda({ fase: 'carregando' });
  // link do e-mail vencido ou já usado: avisa na tela de login
  const q = new URLSearchParams(location.search);
  const erroLink = q.get('error_description') || q.get('error');
  const aviso = erroLink ? 'O link do e-mail venceu ou já foi usado. Peça outro e use o mais recente.' : '';
  const limpaUrl = () => { if (location.search) history.replaceState(null, '', location.pathname + location.hash); };

  sb.auth.onAuthStateChange((ev, sessao) => {
    // fora do fluxo do evento (recomendação do supabase-js: não chamar a API dentro do callback)
    setTimeout(() => {
      if (ev === 'PASSWORD_RECOVERY') { limpaUrl(); muda({ fase: 'nova-senha', aviso: '' }); return; }
      if (ev === 'SIGNED_OUT') { if (!saindo && conta.fase !== 'fora') fechaConta(); return; }
      if ((ev === 'SIGNED_IN' || ev === 'INITIAL_SESSION') && sessao?.user && conta.fase !== 'nova-senha') { limpaUrl(); void entraNaConta(sessao.user); }
    }, 0);
  });

  const local = pegaEstado();
  const semRede = typeof navigator !== 'undefined' && navigator.onLine === false;
  void limitaTempo(sb.auth.getSession(), 6000, null).then((r) => {
    const s = r && 'data' in r ? r.data.session : null;
    if (s?.user) return; // INITIAL_SESSION / SIGNED_IN cuidam
    if (conta.fase !== 'carregando') return;
    // sem internet com a conta já no aparelho: entra com o que está guardado e envia depois
    if ((semRede || !r) && local.conta && local.perfil) { faltaJuntar = true; muda({ fase: 'dentro', uid: local.conta, email: local.perfil.email, sinc: 'pendente' }); ouveLoja(); retentaDepois(); return; }
    limpaUrl();
    muda({ fase: 'fora', aviso });
  });
}

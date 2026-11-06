/**
 * MÉTODO APRENDICE DE REVISÃO — fase 1 (docs/estrategia-revisao.md, pilar 1; comandos 24 e 26 do dono).
 * Ciclo de 5 tempos para cada conteúdo, sem DOM (testado em testes/revisaoSlides.test.ts):
 *   1. pergunta primeiro — 2 ou 3 questões reais do conteúdo, no nível do aluno, ANTES dos slides, com a certeza;
 *   2. ver acontecer — os slides (menos o "fixe"); conceito com frase-chave e fórmula pedem a tentativa antes de mostrar;
 *   3. lembrar sem olhar — as 3 linhas do slide "fixe" viram 3 lacunas;
 *   4. aplicar em questão nova — 1 a 3 questões reais diferentes das do tempo 1, do mesmo conteúdo;
 *   5. voltar no dia certo — o conteúdo ganha a data de volta.
 * As respostas às questões entram também em `q[id].tent` (ctx "slides"): o que o aluno erra, chuta ou erra com certeza
 * entra na revisão espaçada que já existe (pilar 3: a certeza já decide a fila em logica/revisao.ts).
 * A agenda pela data da prova (pilar 2) é a fase 2: aqui a volta usa a escada simples abaixo.
 */
import type { Questao } from '../dados/tipos';
import type { Slide, TemaRevisao } from '../dados/revisao';
import type { AndamentoRevisao, EstadoMateria, Lembrou, RespRevisao, RevisaoConteudo, SessaoRevisao } from '../estado/tipos';
import { nivelDe, NIVEIS, type Nivel } from './nivel';
import { emNDias } from './revisao';

export const TEMPOS = ['Pergunta primeiro', 'Ver acontecer', 'Lembrar sem olhar', 'Aplicar', 'Voltar'] as const;
/** dias até o conteúdo voltar, por etapa (fase 1; a fase 2 troca pela agenda contada a partir da data da prova) */
export const VOLTA_DIAS = [1, 3, 7, 16, 35];
export const MAX_SESSOES = 20;
export const CTX_SLIDES = 'slides';

/* ============================================================ escolha das questões */

/** Nível do aluno no conteúdo: o primeiro nível (do básico ao avançado) ainda não firme (menos de 70% de acerto na
 *  última tentativa de cada questão feita, ou nada feito). Tudo firme: avançado. */
export function nivelDoAluno(qs: Questao[], s: EstadoMateria | undefined): Nivel {
  for (const { id } of NIVEIS) {
    const l = qs.filter((q) => nivelDe(q.dif) === id);
    if (!l.length) continue;
    let feitas = 0, certas = 0;
    for (const q of l) {
      const t = s?.q[q.id]?.tent;
      if (!t?.length) continue;
      feitas++;
      if (t[t.length - 1].ok) certas++;
    }
    if (!feitas || certas / feitas < 0.7) return id;
  }
  return 'avancado';
}

const ORDEM_NIVEL: Nivel[] = ['basico', 'intermediario', 'avancado'];

/** Ordena para escolher: nível mais perto do alvo, nunca respondida antes, respondida há mais tempo, mais fácil, id. */
function ordenaPara(qs: Questao[], alvo: Nivel, s: EstadoMateria | undefined): Questao[] {
  const ia = ORDEM_NIVEL.indexOf(alvo);
  const ult = (q: Questao) => { const t = s?.q[q.id]?.tent; return t?.length ? t[t.length - 1].ts : 0; };
  return [...qs].sort((a, b) => {
    const da = Math.abs(ORDEM_NIVEL.indexOf(nivelDe(a.dif)) - ia), db = Math.abs(ORDEM_NIVEL.indexOf(nivelDe(b.dif)) - ia);
    return da - db || ult(a) - ult(b) || a.dif - b.dif || a.id.localeCompare(b.id);
  });
}

/**
 * Questões do ciclo: `pre` (tempo 1) e `apl` (tempo 4), sem repetir. Com 9 ou mais questões no conteúdo, 3 antes;
 * senão 2 (1 se houver só 1 ou 2). Aplicação: até 2 (3 com 12 ou mais), um nível acima do alvo quando existe.
 */
export function escolheQuestoes(qs: Questao[], s: EstadoMateria | undefined): { nivel: Nivel; pre: string[]; apl: string[] } {
  const validas = qs.filter((q) => !q.retirada && !q.pendente);
  const nivel = nivelDoAluno(validas, s);
  const nPre = validas.length >= 9 ? 3 : validas.length >= 3 ? 2 : Math.min(1, validas.length);
  const pre = ordenaPara(validas, nivel, s).slice(0, nPre).map((q) => q.id);
  const resto = validas.filter((q) => !pre.includes(q.id));
  const acima = ORDEM_NIVEL[Math.min(2, ORDEM_NIVEL.indexOf(nivel) + 1)];
  const nApl = Math.min(resto.length, validas.length >= 12 ? 3 : 2);
  const apl = ordenaPara(resto, acima, s).slice(0, nApl).map((q) => q.id);
  return { nivel, pre, apl };
}

/* ============================================================ slides do ciclo */

export interface SlidesDoCiclo {
  /** tempo 2: tudo menos o fixe, na ordem do arquivo (o índice é o do arquivo) */
  ver: { s: Slide; k: number }[];
  /** tempo 3: o slide fixe (o último, se houver mais de um) */
  fixe: { s: Slide; k: number } | null;
}

export function slidesDoCiclo(slides: Slide[]): SlidesDoCiclo {
  const ver: { s: Slide; k: number }[] = [];
  let fixe: { s: Slide; k: number } | null = null;
  slides.forEach((s, k) => { if (s.tipo === 'fixe') fixe = { s, k }; else ver.push({ s, k }); });
  return { ver, fixe };
}

/** Slides que pedem a tentativa antes de mostrar (pilar 1, tempo 3 dentro dos slides): conceito com frase-chave
 *  (completar) e fórmula (escolher entre 3). */
export function pedeTentativa(s: Slide): 'frase' | 'formula' | null {
  if (s.tipo === 'formula' && s.formula) return 'formula';
  if (s.tipo === 'conceito' && s.destaque) return 'frase';
  return null;
}

/** 3 opções de fórmula: a certa e duas de outros slides de fórmula do tema (outros conteúdos primeiro), embaralhadas
 *  de forma estável (a mesma ordem cada vez que o slide abre). */
export function opcoesFormula(tema: TemaRevisao, sub: string, k: number): { opcoes: string[]; certa: number } {
  const certa = tema.slides[sub]?.[k]?.formula || '';
  const outras: string[] = [];
  const subs = Object.keys(tema.slides).sort((a, b) => (a === sub ? 1 : 0) - (b === sub ? 1 : 0));
  for (const x of subs) for (const s of tema.slides[x]) if (s.formula && s.formula !== certa && (s.tipo === 'formula' || s.tipo === 'conceito') && !outras.includes(s.formula)) outras.push(s.formula);
  // as distratoras: das outras, as de tamanho mais parecido (não dá para acertar pelo comprimento)
  const dist = outras.sort((a, b) => Math.abs(a.length - certa.length) - Math.abs(b.length - certa.length) || a.localeCompare(b)).slice(0, 2);
  const todas = [certa, ...dist];
  const semente = [...(sub + '#' + k)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  const ordem = todas.map((_, i) => i).sort((a, b) => ((a * 7919 + semente) % 13) - ((b * 7919 + semente) % 13) || a - b);
  return { opcoes: ordem.map((i) => todas[i]), certa: ordem.indexOf(0) };
}

/* ============================================================ lacunas ("lembrar sem olhar") */

const FUNCAO = new Set(['e', 'de', 'da', 'do', 'das', 'dos', 'o', 'a', 'os', 'as', 'com', 'no', 'na', 'nos', 'nas', 'em', 'um', 'uma', 'é', 'são', 'que', 'se', 'por', 'para', 'ao', 'à']);

/**
 * Divide a frase em pista (fica à vista) e lacuna (o aluno lembra): até o primeiro ":" na primeira metade da frase; senão
 * até o primeiro "=" no primeiro terço; senão as primeiras palavras (cerca de 30% da frase, sem terminar em "e", "de"...).
 */
export function lacuna(frase: string): { pista: string; falta: string } {
  const f = frase.trim();
  const n = f.length;
  const dp = f.indexOf(':');
  if (dp > 0 && dp <= n * 0.55 && dp < n - 3) return { pista: f.slice(0, dp + 1), falta: f.slice(dp + 1).trim() };
  const ig = f.indexOf('=');
  if (ig > 0 && ig <= n * 0.4 && ig < n - 3) return { pista: f.slice(0, ig + 1), falta: f.slice(ig + 1).trim() };
  const palavras = f.split(' ');
  let k = 1;
  while (k < palavras.length - 1 && palavras.slice(0, k).join(' ').length < n * 0.3) k++;
  while (k > 1 && FUNCAO.has(palavras[k - 1].toLowerCase())) k--;
  return { pista: palavras.slice(0, k).join(' '), falta: palavras.slice(k).join(' ') };
}

export function linhasFixe(s: Slide | null | undefined): string[] {
  return (s?.texto || '').split('\n').map((x) => x.trim()).filter(Boolean);
}

const SEM_ACENTO = (x: string) => x.normalize('NFD').replace(/[̀-ͯ]/g, '');
/** palavras e símbolos que contam na conferência (sem acento, sem pontuação, sem palavras de ligação) */
export function termos(x: string): string[] {
  const t = SEM_ACENTO(x.toLowerCase())
    .replace(/[₀-₉]/g, (c) => String(c.charCodeAt(0) - 0x2080))
    .replace(/[²³]/g, (c) => (c === '²' ? '2' : '3'))
    .replace(/[·×*]/g, ' ')
    .replace(/[^a-z0-9α-ωδθπ=+\-−/ ]/g, ' ')
    .replace(/−/g, '-');
  return t.split(/\s+/).filter((w) => w && !FUNCAO.has(w) && w.length > 0);
}

/** Confere o que o aluno escreveu na lacuna: proporção dos termos da resposta que aparecem no que ele escreveu.
 *  É sugestão: quem decide é o aluno (botões Lembrei / Quase / Não lembrei). */
export function confereLacuna(falta: string, escrito: string): Lembrou {
  const alvo = [...new Set(termos(falta))];
  if (!alvo.length || !escrito.trim()) return 'e';
  const tem = new Set(termos(escrito));
  const p = alvo.filter((w) => tem.has(w)).length / alvo.length;
  return p >= 0.6 ? 'a' : p >= 0.3 ? 'q' : 'e';
}

/* ============================================================ resultado e volta */

export function sessaoBoa(x: Pick<SessaoRevisao, 'apl' | 'lembrou' | 'pre'>): boolean {
  const lemb = Object.values(x.lembrou);
  const naoLembrou = lemb.filter((v) => v === 'e').length;
  const errouApl = x.apl.some((r) => !r.ok);
  const certezaErrada = [...x.pre, ...x.apl].some((r) => !r.ok && r.conf === 'certeza');
  return !errouApl && !certezaErrada && naoLembrou <= Math.floor(lemb.length / 4);
}

/** Próxima volta do conteúdo: sessão boa sobe um degrau (1ª boa: 3 dias); ruim volta ao começo (amanhã). */
export function proximaVolta(r: RevisaoConteudo | undefined, boa: boolean, ts: number): { etapa: number; vence: number } {
  const etapa = boa ? Math.min(VOLTA_DIAS.length - 1, r && r.hist.length ? r.etapa + 1 : 1) : 0;
  return { etapa, vence: emNDias(ts, VOLTA_DIAS[etapa]) };
}

export function novoAndamento(pre: string[], apl: string[], agora = Date.now()): AndamentoRevisao {
  return { ts0: agora, seg: 0, fase: pre.length ? 0 : 1, i: 0, idsPre: pre, idsApl: apl, pre: [], lembrou: {}, apl: [] };
}

/** Fecha a sessão: grava no histórico do conteúdo, calcula a volta e limpa o andamento. */
export function fechaSessao(r: RevisaoConteudo | undefined, a: AndamentoRevisao, agora = Date.now()): RevisaoConteudo {
  const sessao: SessaoRevisao = { ts: agora, seg: a.seg, pre: a.pre, lembrou: a.lembrou, apl: a.apl };
  const v = proximaVolta(r, sessaoBoa(sessao), agora);
  return { etapa: v.etapa, vence: v.vence, hist: [...(r?.hist || []), sessao].slice(-MAX_SESSOES), and: null };
}

export function resumoSessao(x: Pick<SessaoRevisao, 'apl' | 'lembrou' | 'pre'>) {
  const lemb = Object.values(x.lembrou);
  const conta = (l: RespRevisao[]) => ({ certas: l.filter((r) => r.ok).length, total: l.length });
  return { pre: conta(x.pre), apl: conta(x.apl), lembrou: { a: lemb.filter((v) => v === 'a').length, q: lemb.filter((v) => v === 'q').length, e: lemb.filter((v) => v === 'e').length, total: lemb.length } };
}

/** Conteúdos com revisão vencida (para a tela Revisão). */
export function revisoesVencidas(s: EstadoMateria | undefined, agora = Date.now()): string[] {
  return Object.entries(s?.revs || {}).filter(([, r]) => r.hist.length && r.vence <= agora).map(([sub]) => sub).sort();
}

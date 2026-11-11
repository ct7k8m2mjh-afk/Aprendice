/**
 * Painel de domínio real (Método Aprendice de Revisão, pilar 8; comando 24 fase 2).
 * Por matéria, tema e conteúdo: quantas questões o aluno domina, está aprendendo ou esqueceu — pela memória de cada
 * questão (acertos espaçados, estabilidade, erros depois de já ter acertado; logica/revisao.ts), não por contagem de
 * acertos. Com data de prova: a previsão de quanto ele lembra no dia da prova (média de R = e^(−t/S)).
 */
import type { MateriaCarregada } from '../dados/conteudo';
import type { EstadoMateria } from '../estado/tipos';
import { comHistorico } from './estatisticas';
import { dominioDe, memoriaDe, retencao, SEM_AGENDA, type Agenda } from './revisao';

export interface ContaDominio {
  domina: number;
  aprendendo: number;
  esqueceu: number;
  /** questões do banco ainda não feitas */
  nunca: number;
  /** questões do banco (as retiradas com histórico entram nos três estados, não no total) */
  total: number;
  /** soma de R no dia da prova (para a média) e quantas questões entraram */
  somaR: number;
  nR: number;
}

export const contaVazia = (): ContaDominio => ({ domina: 0, aprendendo: 0, esqueceu: 0, nunca: 0, total: 0, somaR: 0, nR: 0 });

export function feitasDe(c: ContaDominio): number { return c.domina + c.aprendendo + c.esqueceu; }
/** previsão para o dia da prova (0 a 100) ou null sem data/sem questão feita */
export function previsao(c: ContaDominio): number | null { return c.nR ? Math.round((c.somaR / c.nR) * 100) : null; }

function soma(a: ContaDominio, b: ContaDominio): ContaDominio {
  return { domina: a.domina + b.domina, aprendendo: a.aprendendo + b.aprendendo, esqueceu: a.esqueceu + b.esqueceu, nunca: a.nunca + b.nunca, total: a.total + b.total, somaR: a.somaR + b.somaR, nR: a.nR + b.nR };
}

export interface DominioSub { id: string; nome: string; c: ContaDominio }
export interface DominioTema { id: string; nome: string; c: ContaDominio; subs: DominioSub[] }
export interface DominioMateria { c: ContaDominio; temas: DominioTema[] }

export function dominioMateria(mc: MateriaCarregada, s: EstadoMateria, ag: Agenda = SEM_AGENDA, agora = Date.now()): DominioMateria {
  const porSub = new Map<string, ContaDominio>();
  const pega = (sub: string) => { let c = porSub.get(sub); if (!c) porSub.set(sub, (c = contaVazia())); return c; };
  const noBanco = new Set(mc.banco.map((q) => q.id));
  for (const q of comHistorico(mc)) {
    const c = pega(q.sub);
    if (noBanco.has(q.id)) c.total++;
    const m = memoriaDe(s.q[q.id], ag);
    if (!m) { if (noBanco.has(q.id)) c.nunca++; continue; }
    c[dominioDe(m, agora)]++;
    if (ag.prova) { c.somaR += retencao(m, Math.max(agora, ag.prova)); c.nR++; }
  }
  const temas: DominioTema[] = mc.conteudo.modulos.map((mod) => {
    const subs = mod.subs.map((x) => ({ id: x.id, nome: x.nome, c: porSub.get(x.id) || contaVazia() })).filter((x) => x.c.total || feitasDe(x.c));
    return { id: mod.id, nome: mod.nome, c: subs.reduce((a, x) => soma(a, x.c), contaVazia()), subs };
  }).filter((t) => t.c.total || feitasDe(t.c));
  return { c: temas.reduce((a, t) => soma(a, t.c), contaVazia()), temas };
}

export function somaContas(l: ContaDominio[]): ContaDominio { return l.reduce(soma, contaVazia()); }

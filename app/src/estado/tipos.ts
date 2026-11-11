import type { Letra, MateriaId } from '../dados/tipos';
import type { FiltroRegiao, RegiaoId } from '../logica/regiao';
import type { ProgressoGeral } from '../logica/revisaoGeral';

/** Mesmo formato do protótipo (S.q[id].tent), para a migração não perder nada. */
export interface Tentativa {
  letra: Letra;
  ok: boolean;
  ts: number;
  seg: number;
  conf?: 'certeza' | 'acho' | 'chute' | null;
  dica?: number;
  /** de onde veio a resposta (novo; opcional): escada | treino | revisao | simulado */
  ctx?: string;
}

export interface EstadoQuestao { tent: Tentativa[]; rev?: boolean }

export interface FlashRec { etapa: number; vence: number; hist: { ts: number; v: 'a' | 'q' | 'e'; c?: string }[] }

export interface Gosto { g: 1 | -1; tipo?: string; mod?: string; ts: number }

export interface SimuladoResultado { nome: string; acertos: number; total: number; seg: number; ts: number }

/** Revisão em slides (comandos 24 e 26): uma resposta de questão dentro do ciclo de 5 tempos. */
export interface RespRevisao { id: string; letra: Letra; ok: boolean; conf?: Tentativa['conf'] }
/** "lembrar sem olhar": a = lembrou, q = quase, e = não lembrou. Chave: "<conteúdo>#<slide>" ou "<conteúdo>#<slide>:<linha>" (fixe). */
export type Lembrou = 'a' | 'q' | 'e';

/** Uma sessão completa do ciclo de 5 tempos num conteúdo. */
export interface SessaoRevisao {
  ts: number;
  seg: number;
  /** 1. pergunta primeiro */
  pre: RespRevisao[];
  /** 2 e 3. ver acontecer (frase-chave, fórmula) e lembrar sem olhar (o slide fixe vira 3 lacunas) */
  lembrou: Record<string, Lembrou>;
  /** 4. aplicar em questão nova */
  apl: RespRevisao[];
}

/** Sessão em andamento (retomar de onde parou). fase: 0 pergunta · 1 ver · 2 lembrar · 3 aplicar · 4 voltar */
export interface AndamentoRevisao {
  ts0: number;
  seg: number;
  fase: 0 | 1 | 2 | 3 | 4;
  /** posição dentro da fase (questão ou slide) */
  i: number;
  /** questões escolhidas no começo (não mudam no meio da sessão) */
  idsPre: string[];
  idsApl: string[];
  pre: RespRevisao[];
  lembrou: Record<string, Lembrou>;
  apl: RespRevisao[];
}

/** Estado da revisão de um conteúdo. etapa/vence: quando o conteúdo volta (5. voltar no dia certo). */
export interface RevisaoConteudo { etapa: number; vence: number; hist: SessaoRevisao[]; and?: AndamentoRevisao | null }

export interface EstadoMateria {
  q: Record<string, EstadoQuestao>;
  ult: string | null;
  sims: SimuladoResultado[];
  flash: Record<string, FlashRec>;
  flg: Record<string, Gosto>;
  sessoes: { ts: number; seg: number }[];
  /** revisão em slides por conteúdo (sub). Opcional: estados antigos não têm; a migração v4 cria vazio. */
  revs?: Record<string, RevisaoConteudo>;
  /** revisão geral da matéria (comando 37): progresso por tópico (id do tópico em docs/revisao/<m>/geral.json; em fs os
   *  prefixos FK e SK separam Filosofia e Sociologia). Lido, marcado para rever e o momento da mudança. A migração v8
   *  cria vazio; estados antigos não têm. */
  geral?: ProgressoGeral;
}

export interface Perfil {
  nome: string;
  email: string;
  provasAlvo: string[];
  meta: number; // questões por semana
  criadoEm: number;
  /** data de cada prova-alvo, "AAAA-MM-DD" (v7, comando 24 fase 2): a agenda da revisão conta a partir da próxima */
  datasProva?: Record<string, string>;
}

/** Item de simulado. Questões do banco por matéria trazem m; questões de prova completa trazem p (id da prova),
 *  a (área segundo a própria prova) e m só quando a prova separa por matéria. Campos novos são opcionais: dados antigos seguem válidos. */
export interface ItemSimulado { m?: MateriaId; id: string; p?: string; a?: string }

export interface SimuladoAndamento {
  sid: string;
  titulo: string;
  modo: 'prova' | 'treino'; // prova: resultado no fim; treino: resolução após cada resposta
  itens: ItemSimulado[];
  resp: Record<string, { letra: Letra; seg: number; conf?: Tentativa['conf']; ts?: number }>;
  marcadas: string[];
  i: number;
  limiteSeg: number | null;
  usadoSeg: number;
  iniciadoEm: number;
  pausado: boolean;
}

export interface SimuladoFeito {
  sid: string;
  titulo: string;
  modo: 'prova' | 'treino';
  ts: number;
  seg: number;
  acertos: number;
  total: number;
  porMateria: Partial<Record<MateriaId, { acertos: number; total: number }>>;
  /** resultado por área da prova (provas completas) */
  porArea?: Record<string, { acertos: number; total: number }>;
  itens: { m?: MateriaId; id: string; letra: Letra | null; ok: boolean; p?: string; a?: string }[];
}

export interface SessaoTreino { it: { k: 'q' | 'f' | 'c'; id: string }[]; i: number; res: Record<string, 'a' | 'q' | 'e'>; t0: number }

/** Treino geral de TODAS as matérias (Início, comando 32): questões reais de prova sorteadas e misturadas.
 *  Cada item traz a matéria; a resposta conta na matéria da questão (materias[m].q[id], ctx 'misto').
 *  res: chave "<m>:<id>" -> a (acertou) | e (errou). */
export interface SessaoMisto { it: { m: MateriaId; id: string }[]; i: number; res: Record<string, 'a' | 'e'>; t0: number }

/** Sessão da tela Hoje ou do Escudo TRI (comando 24, fase 3): as questões do plano do dia, na ordem, de várias matérias.
 *  Mesmo formato do Treino geral (SessaoMisto) + de onde veio e o dia em que foi montada (no dia seguinte, refaz). */
export interface SessaoHoje extends SessaoMisto { tipo: 'hoje' | 'escudo'; dia: number }

export interface Preferencias {
  tema: 'claro' | 'escuro' | 'sistema'; menuFechado: boolean; ultimaMateria: MateriaId | null;
  /** questões por rodada do Treino geral de todas as matérias ("Personalizar"; padrão 15) */
  rodadaMisto?: number;
  /** região das minhas provas escolhida à mão (v6; null = automática, pelas provas-alvo). logica/regiao.ts */
  regioes?: RegiaoId[] | null;
  /** filtro de região onde o aluno pratica (v6): minha região (+ ENEM), todas, ou uma região só */
  filtroRegiao?: FiltroRegiao;
  /** minutos da sessão do dia na tela Hoje (15, 25 ou 40; padrão 25). Opcional: estados antigos não têm */
  minutosHoje?: number;
}

export interface Estado {
  /** 1: formato inicial; 2: Filosofia e Sociologia unidas em 'fs'; 3: questões de sites didáticos retiradas, histórico
   *  levado à questão de prova equivalente ou guardado no id antigo (migracao.ts, migraEstado); 4: revisão em slides por
   *  conteúdo (EstadoMateria.revs, comandos 24 e 26); 5: Treino geral de todas as matérias (treinoMisto, comando 32).
   *  6: região das provas (pref.regioes, pref.filtroRegiao; pedido do dono de 09/11/2026).
   *  7: agenda pela data da prova (perfil.datasProva, revisaoDesde; comando 24 fase 2).
   *  8: revisão geral da matéria (EstadoMateria.geral, comando 37). Estado novo nasce na 8. */
  versao: 2 | 3 | 4 | 5 | 6 | 7 | 8;
  perfil: Perfil | null;
  materias: Partial<Record<MateriaId, EstadoMateria>>;
  simulado: SimuladoAndamento | null;
  simuladosFeitos: SimuladoFeito[];
  treino: Partial<Record<MateriaId, SessaoTreino>>;
  /** Treino geral de todas as matérias em andamento (v5); null quando não há */
  treinoMisto: SessaoMisto | null;
  pref: Preferencias;
  migradoDe: string[];
  /** v7: momento em que a revisão passou para a regra nova (agenda pela data da prova, saída com 3 acertos espaçados).
   *  Tentativas anteriores seguem a regra antiga até esse momento (logica/revisao.ts, memoriaDe). 0 = estado novo. */
  revisaoDesde?: number;
  /** sessão da tela Hoje / Escudo TRI em andamento (fase 3). Opcional: estados antigos não têm, e nada se perde */
  sessaoHoje?: SessaoHoje | null;
}

export function estadoMateriaVazio(): EstadoMateria {
  return { q: {}, ult: null, sims: [], flash: {}, flg: {}, sessoes: [], revs: {}, geral: {} };
}

export function estadoVazio(): Estado {
  return {
    versao: 8,
    perfil: null,
    materias: {},
    simulado: null,
    simuladosFeitos: [],
    treino: {},
    treinoMisto: null,
    pref: { tema: 'claro', menuFechado: false, ultimaMateria: null, regioes: null, filtroRegiao: 'minha' },
    migradoDe: [],
    revisaoDesde: 0,
  };
}

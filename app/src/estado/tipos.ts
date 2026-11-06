import type { Letra, MateriaId } from '../dados/tipos';

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

export interface EstadoMateria {
  q: Record<string, EstadoQuestao>;
  ult: string | null;
  sims: SimuladoResultado[];
  flash: Record<string, FlashRec>;
  flg: Record<string, Gosto>;
  sessoes: { ts: number; seg: number }[];
}

export interface Perfil {
  nome: string;
  email: string;
  provasAlvo: string[];
  meta: number; // questões por semana
  criadoEm: number;
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

export interface Preferencias { tema: 'claro' | 'escuro' | 'sistema'; menuFechado: boolean; ultimaMateria: MateriaId | null }

export interface Estado {
  /** 1: formato inicial; 2: Filosofia e Sociologia unidas em 'fs' (migracao.ts, migraEstado). */
  versao: 2;
  perfil: Perfil | null;
  materias: Partial<Record<MateriaId, EstadoMateria>>;
  simulado: SimuladoAndamento | null;
  simuladosFeitos: SimuladoFeito[];
  treino: Partial<Record<MateriaId, SessaoTreino>>;
  pref: Preferencias;
  migradoDe: string[];
}

export function estadoMateriaVazio(): EstadoMateria {
  return { q: {}, ult: null, sims: [], flash: {}, flg: {}, sessoes: [] };
}

export function estadoVazio(): Estado {
  return {
    versao: 2,
    perfil: null,
    materias: {},
    simulado: null,
    simuladosFeitos: [],
    treino: {},
    pref: { tema: 'claro', menuFechado: false, ultimaMateria: null },
    migradoDe: [],
  };
}

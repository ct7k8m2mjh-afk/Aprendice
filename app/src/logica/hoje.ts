/**
 * Tela "Hoje" e Escudo TRI — MÉTODO APRENDICE DE REVISÃO, fase 3 (docs/estrategia-revisao.md, pilares 5 e 7; comando 24).
 *
 * Pilar 7: o que estudar hoje sai de três números de cada conteúdo (subtema), todos tirados dos dados reais:
 *  - peso: quanto o conteúdo cai nas provas-alvo do aluno = fatia das questões de cada prova-alvo no banco que são
 *    daquele conteúdo, na média das provas-alvo (cada prova pesa igual, para uma prova de banco grande não engolir as
 *    outras). Sem prova-alvo com questões no banco, a fatia vem do banco inteiro (da região do aluno);
 *  - fraqueza: pela memória de cada questão já feita (fase 2, logica/revisao.ts): esqueceu 1; errou e ainda não
 *    acertou 0,8 (+0,2 se errou com certeza); 1 ou 2 acertos espaçados 0,4; domina 0. Média das feitas;
 *  - risco de esquecer: 1 − R(hoje), R = e^(−t/S); questão errada por último conta 1; vencida na agenda, no mínimo 0,5.
 * Nota = (0,15 + 0,85 × peso relativo) × (0,2 + fraqueza) × (0,2 + risco). Os pisos evitam que um fator zerado
 * apague os outros. Conteúdo nunca estudado entra com fraqueza 0,5 e risco 0,6 (o aluno ainda não mostrou que sabe):
 * um conteúdo pesado e novo passa à frente de uma revisão leve, mas não de uma revisão pesada vencida.
 *
 * Pilar 5 (Escudo TRI): com o ENEM entre as provas-alvo, as questões fáceis (dificuldade 1 a 4) que o aluno errou nos
 * conteúdos que o ENEM cobra vêm primeiro: na TRI, errar a fácil e acertar a difícil vale menos que acertar a fácil
 * (coerência pedagógica do Inep). Conteúdo com fácil errada ganha ×1,5 na nota e as fáceis erradas abrem a lista dele.
 *
 * A sessão do dia junta as questões dos conteúdos na ordem da nota até o tempo escolhido (15, 25 ou 40 min), no
 * máximo 6 por conteúdo. O tempo por questão é a mediana do próprio aluno (entre 1 e 6 min); sem histórico, 3 min.
 */
import type { MateriaId, Questao } from '../dados/tipos';
import type { EstadoMateria, Tentativa } from '../estado/tipos';
import { catalogoDaQuestao } from '../dados/provas';
import { dominioDe, memoriaDe, retencao, SEM_AGENDA, type Agenda, type Memoria } from './revisao';
import { filtraRegiao, type RegiaoId } from './regiao';
import { ordemEvolucao } from './nivel';

/** O que a tela precisa de cada matéria (MateriaCarregada cabe aqui). */
export interface MateriaHoje {
  id: MateriaId;
  banco: Questao[];
  conteudo: { modulos: { id: string; nome: string; subs: { id: string; nome: string }[] }[] };
}

export const TEMPOS = [15, 25, 40] as const;
export const TEMPO_PADRAO = 25;
/** dificuldade máxima de uma questão "fácil" no Escudo TRI (níveis 1 a 4) */
export const FACIL_MAX = 4;
/** dificuldade mínima de uma questão "difícil" (alerta de incoerência) */
export const DIFICIL_MIN = 7;
export const MAX_POR_CONTEUDO = 6;
export const SEG_PADRAO = 180;
/** uma prova-alvo só define o peso se tiver pelo menos isto de questões no banco */
export const MIN_QUESTOES_PROVA = 20;
export const ENEM = 'enem';

const chave = (m: MateriaId, sub: string) => m + ':' + sub;

/* ============================================================ peso nas provas-alvo */

export interface Pesos {
  /** fatia (0 a 1) de cada conteúdo, chave "<matéria>:<conteúdo>" */
  fatia: Map<string, number>;
  /** maior fatia (para o peso relativo) */
  max: number;
  /** provas-alvo que definiram o peso (com questões no banco); [] = banco inteiro */
  provas: string[];
}

/** Questão que pode ser praticada (no ar, de prova). */
const praticavel = (q: Questao) => !q.pendente && !q.retirada && q.origem === 'prova';

export function pesosDasProvas(mats: MateriaHoje[], provasAlvo: string[], conj: Set<RegiaoId> | null = null, min = MIN_QUESTOES_PROVA): Pesos {
  const porProva = new Map<string, Map<string, number>>();
  const totProva = new Map<string, number>();
  const alvo = new Set(provasAlvo);
  for (const mc of mats) for (const q of mc.banco) {
    if (q.pendente || q.retirada) continue;
    const p = catalogoDaQuestao(q);
    if (!p || !alvo.has(p)) continue;
    let mp = porProva.get(p);
    if (!mp) porProva.set(p, (mp = new Map()));
    mp.set(chave(mc.id, q.sub), (mp.get(chave(mc.id, q.sub)) || 0) + 1);
    totProva.set(p, (totProva.get(p) || 0) + 1);
  }
  const provas = provasAlvo.filter((p) => (totProva.get(p) || 0) >= min);
  const fatia = new Map<string, number>();
  if (provas.length) {
    for (const p of provas) {
      const tot = totProva.get(p)!;
      for (const [k, n] of porProva.get(p)!) fatia.set(k, (fatia.get(k) || 0) + n / tot / provas.length);
    }
  } else {
    // sem prova-alvo com questões: a frequência no banco inteiro da região do aluno
    let tot = 0;
    for (const mc of mats) for (const q of filtraRegiao(mc.banco.filter(praticavel), conj).l) {
      fatia.set(chave(mc.id, q.sub), (fatia.get(chave(mc.id, q.sub)) || 0) + 1);
      tot++;
    }
    for (const [k, n] of fatia) fatia.set(k, n / Math.max(1, tot));
  }
  return { fatia, max: Math.max(0, ...fatia.values()), provas };
}

/* ============================================================ fraqueza e risco de uma questão */

export function fraquezaQuestao(m: Memoria, agora: number): number {
  const d = dominioDe(m, agora);
  if (d === 'esqueceu') return 1;
  if (d === 'domina') return 0;
  if (m.ultimaFraca) return Math.min(1, 0.8 + (m.certeza ? 0.2 : 0));
  return 0.4;
}

export function riscoQuestao(m: Memoria, agora: number): number {
  if (m.ultimaFraca) return 1;
  const r = 1 - retencao(m, agora);
  return m.fila && m.vence <= agora ? Math.max(0.5, r) : r;
}

export function errouPorUltimo(m: Memoria | null): boolean { return !!m && m.ultimaFraca; }

/* ============================================================ plano do dia */

export type TipoItem = 'revisar' | 'reforcar' | 'novo';

export interface ItemHoje {
  m: MateriaId;
  sub: string;
  nome: string;
  modulo: string;
  tema: string;
  tipo: TipoItem;
  /** fatia do conteúdo nas provas-alvo (0 a 1) e relativa à maior (0 a 1) */
  peso: number;
  pesoRel: number;
  fraqueza: number;
  risco: number;
  nota: number;
  /** questões vencidas na agenda (regra da fase 2) */
  vencidas: number;
  /** vencidas cujo último erro foi com certeza */
  certeza: number;
  /** feitas que o aluno esqueceu (fora da agenda) */
  esquecidas: number;
  /** questões novas sugeridas */
  novas: number;
  /** Escudo TRI: fáceis erradas neste conteúdo (só com ENEM na lista) */
  faceisErradas: number;
  feitas: number;
  /** questões para hoje, na ordem (fáceis erradas, vencidas, esquecidas, novas) */
  ids: string[];
}

export interface PlanoHoje {
  itens: ItemHoje[];
  /** a sessão do dia: questões de vários conteúdos, até o tempo escolhido */
  sessao: { m: MateriaId; id: string }[];
  /** quantos itens (conteúdos) a sessão cobre */
  nItensSessao: number;
  segPorQuestao: number;
  minutos: number;
  pesos: Pesos;
  enem: boolean;
}

/** Mediana do tempo do aluno por questão (últimas 200 respostas), entre 1 e 6 min; sem histórico, 3 min. */
export function segPorQuestao(materias: Partial<Record<MateriaId, EstadoMateria>>): number {
  const l: Tentativa[] = [];
  for (const s of Object.values(materias)) if (s) for (const eq of Object.values(s.q)) for (const t of eq.tent) if (t.seg > 0) l.push(t);
  if (l.length < 10) return SEG_PADRAO;
  const segs = l.sort((a, b) => b.ts - a.ts).slice(0, 200).map((t) => t.seg).sort((a, b) => a - b);
  const med = segs[Math.floor(segs.length / 2)];
  return Math.min(360, Math.max(60, Math.round(med)));
}

export function minutosDe(n: number, seg: number): number { return Math.max(1, Math.round((n * seg) / 60)); }

export interface OpcoesHoje {
  provasAlvo: string[];
  conj?: Set<RegiaoId> | null;
  ag?: Agenda;
  agora?: number;
  minutos?: number;
}

export function planoHoje(mats: MateriaHoje[], estado: Partial<Record<MateriaId, EstadoMateria>>, o: OpcoesHoje): PlanoHoje {
  const agora = o.agora ?? Date.now();
  const ag = o.ag || SEM_AGENDA;
  const conj = o.conj ?? null;
  const enem = o.provasAlvo.includes(ENEM);
  const pesos = pesosDasProvas(mats, o.provasAlvo, conj);
  // o que o ENEM cobra: qualquer questão do ENEM no banco basta (sem cair no banco inteiro)
  const pesosEnem = enem ? pesosDasProvas(mats, [ENEM], conj, 1) : null;
  const itens: ItemHoje[] = [];

  for (const mc of mats) {
    const s = estado[mc.id];
    const porSub = new Map<string, Questao[]>();
    for (const q of mc.banco) if (praticavel(q)) { const l = porSub.get(q.sub) || []; l.push(q); porSub.set(q.sub, l); }
    for (const mod of mc.conteudo.modulos) for (const sb of mod.subs) {
      const todas = porSub.get(sb.id);
      if (!todas?.length) continue;
      const qs = filtraRegiao(todas, conj).l;
      const peso = pesos.fatia.get(chave(mc.id, sb.id)) || 0;
      const cobraEnem = !!pesosEnem && (pesosEnem.fatia.get(chave(mc.id, sb.id)) || 0) > 0;
      let somaF = 0, somaR = 0, feitas = 0;
      const faceis: { q: Questao; certeza: boolean }[] = [], venc: { q: Questao; certeza: boolean; vence: number }[] = [], esq: Questao[] = [], novas: Questao[] = [];
      for (const q of todas) {
        const m = memoriaDe(s?.q[q.id], ag);
        if (!m) continue;
        feitas++;
        somaF += fraquezaQuestao(m, agora);
        somaR += riscoQuestao(m, agora);
      }
      for (const q of qs) {
        const m = memoriaDe(s?.q[q.id], ag);
        if (!m) { novas.push(q); continue; }
        if (cobraEnem && q.dif <= FACIL_MAX && m.ultimaFraca) faceis.push({ q, certeza: m.certeza });
        else if (m.fila && m.vence <= agora) venc.push({ q, certeza: m.certeza, vence: m.vence });
        else if (dominioDe(m, agora) === 'esqueceu') esq.push(q);
      }
      const fraqueza = feitas ? somaF / feitas : 0.5;
      const risco = feitas ? somaR / feitas : 0.6;
      // novas: no conteúdo nunca feito, ou onde o aluno ainda erra; as mais fáceis primeiro, com resolução comentada antes
      const querNovas = !feitas || fraqueza >= 0.3;
      novas.sort((a, b) => a.dif - b.dif || (a.cr ? 0 : 1) - (b.cr ? 0 : 1) || ordemEvolucao(a, b));
      const ids = [
        ...faceis.sort((a, b) => Number(b.certeza) - Number(a.certeza) || (catalogoDaQuestao(b.q) === ENEM ? 1 : 0) - (catalogoDaQuestao(a.q) === ENEM ? 1 : 0) || a.q.dif - b.q.dif).map((x) => x.q.id),
        ...venc.sort((a, b) => Number(b.certeza) - Number(a.certeza) || a.vence - b.vence).map((x) => x.q.id),
        ...esq.map((q) => q.id),
        ...(querNovas ? novas.slice(0, 3).map((q) => q.id) : []),
      ];
      if (!ids.length) continue;
      const pesoRel = pesos.max ? peso / pesos.max : 0;
      const escudo = faceis.length > 0 ? 1.5 : 1;
      const nota = (0.15 + 0.85 * pesoRel) * (0.2 + fraqueza) * (0.2 + risco) * escudo;
      const tipo: TipoItem = venc.length || faceis.length ? 'revisar' : feitas ? 'reforcar' : 'novo';
      itens.push({
        m: mc.id, sub: sb.id, nome: sb.nome, modulo: mod.id, tema: mod.nome, tipo, peso, pesoRel, fraqueza, risco, nota,
        vencidas: venc.length, certeza: venc.filter((x) => x.certeza).length + faceis.filter((x) => x.certeza).length,
        esquecidas: esq.length, novas: querNovas ? Math.min(3, novas.length) : 0, faceisErradas: faceis.length, feitas, ids,
      });
    }
  }
  itens.sort((a, b) => b.nota - a.nota || b.peso - a.peso || a.m.localeCompare(b.m) || a.sub.localeCompare(b.sub));

  const seg = segPorQuestao(estado);
  const minutos = o.minutos || TEMPO_PADRAO;
  const cabe = Math.max(1, Math.floor((minutos * 60) / seg));
  const sessao: PlanoHoje['sessao'] = [];
  let nItensSessao = 0;
  for (const it of itens) {
    if (sessao.length >= cabe) break;
    const l = it.ids.slice(0, Math.min(MAX_POR_CONTEUDO, cabe - sessao.length));
    sessao.push(...l.map((id) => ({ m: it.m, id })));
    nItensSessao++;
  }
  return { itens, sessao, nItensSessao, segPorQuestao: seg, minutos, pesos, enem };
}

/* ============================================================ Escudo TRI */

export interface EscudoConteudo {
  m: MateriaId;
  sub: string;
  nome: string;
  tema: string;
  /** fáceis já feitas e, delas, as que o aluno erra hoje (último registro errado, chute ou pista) */
  faceis: number;
  erradas: number;
  /** fáceis erradas que são do próprio ENEM */
  erradasEnem: number;
  /** acertou uma difícil (dificuldade 7 ou mais) e erra uma fácil do mesmo conteúdo */
  incoerente: boolean;
  peso: number;
  /** fáceis erradas, para revisar (as do ENEM e as erradas com certeza primeiro) */
  ids: string[];
}

export interface Escudo {
  conteudos: EscudoConteudo[];
  erradas: number;
  /** fáceis feitas nos conteúdos que o ENEM cobra */
  feitas: number;
  /** conteúdos com o básico garantido: 3 fáceis ou mais feitas e nenhuma errada */
  garantidos: number;
  /** sessão "revisar as fáceis": todas as fáceis erradas, na ordem dos conteúdos */
  sessao: { m: MateriaId; id: string }[];
}

export const GARANTIDO_MIN = 3;

/** Escudo TRI (pilar 5): só faz sentido com o ENEM entre as provas-alvo (quem chama confere). */
export function escudoTri(mats: MateriaHoje[], estado: Partial<Record<MateriaId, EstadoMateria>>, o: { conj?: Set<RegiaoId> | null; ag?: Agenda } = {}): Escudo {
  const ag = o.ag || SEM_AGENDA;
  const pesos = pesosDasProvas(mats, [ENEM], o.conj ?? null, 1);
  const conteudos: EscudoConteudo[] = [];
  let feitasTot = 0, garantidos = 0;
  for (const mc of mats) {
    const s = estado[mc.id];
    const porSub = new Map<string, Questao[]>();
    for (const q of mc.banco) if (praticavel(q)) { const l = porSub.get(q.sub) || []; l.push(q); porSub.set(q.sub, l); }
    for (const mod of mc.conteudo.modulos) for (const sb of mod.subs) {
      const peso = pesos.fatia.get(chave(mc.id, sb.id)) || 0;
      if (!peso) continue; // conteúdo que o ENEM não cobra
      const l = porSub.get(sb.id) || [];
      let faceis = 0, acertouDificil = false;
      const err: { q: Questao; certeza: boolean }[] = [];
      for (const q of l) {
        const m = memoriaDe(s?.q[q.id], ag);
        if (!m) continue;
        if (q.dif <= FACIL_MAX) { faceis++; if (m.ultimaFraca) err.push({ q, certeza: m.certeza }); }
        else if (q.dif >= DIFICIL_MIN && !m.ultimaFraca) acertouDificil = true;
      }
      feitasTot += faceis;
      if (faceis >= GARANTIDO_MIN && !err.length) garantidos++;
      if (!err.length) continue;
      // a revisão segue o filtro de região, com reserva (nunca some a questão errada se a região não tem nenhuma)
      const naRegiao = filtraRegiao(err.map((x) => ({ ...x.q, _c: x.certeza })), o.conj ?? null).l;
      const enemPrimeiro = (q: Questao) => (catalogoDaQuestao(q) === ENEM ? 0 : 1);
      conteudos.push({
        m: mc.id, sub: sb.id, nome: sb.nome, tema: mod.nome, faceis, erradas: err.length,
        erradasEnem: err.filter((x) => catalogoDaQuestao(x.q) === ENEM).length, incoerente: acertouDificil, peso,
        ids: naRegiao.sort((a, b) => Number(b._c) - Number(a._c) || enemPrimeiro(a) - enemPrimeiro(b) || a.dif - b.dif).map((q) => q.id),
      });
    }
  }
  // mais fáceis erradas primeiro; empate: incoerência, depois o que mais cai no ENEM
  conteudos.sort((a, b) => b.erradas - a.erradas || Number(b.incoerente) - Number(a.incoerente) || b.peso - a.peso || a.sub.localeCompare(b.sub));
  return {
    conteudos, erradas: conteudos.reduce((a, c) => a + c.erradas, 0), feitas: feitasTot, garantidos,
    sessao: conteudos.flatMap((c) => c.ids.map((id) => ({ m: c.m, id }))),
  };
}

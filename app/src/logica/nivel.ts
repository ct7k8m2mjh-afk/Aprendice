/**
 * Nível de dificuldade de cada questão (básico, intermediário, avançado), no lugar das escadas de 10 degraus.
 * Vem da dificuldade 1–10 já atribuída a cada questão (classificação da fábrica, revisada).
 * O "Treine sua evolução" percorre o conteúdo do mais fácil ao mais difícil, e o desempenho por nível
 * mostra ao aluno onde ele erra mais.
 */
import type { Questao } from '../dados/tipos';
import type { EstadoMateria } from '../estado/tipos';

export type Nivel = 'basico' | 'intermediario' | 'avancado';

export const NIVEIS: { id: Nivel; nome: string; faixa: [number, number] }[] = [
  { id: 'basico', nome: 'Básico', faixa: [1, 3] },
  { id: 'intermediario', nome: 'Intermediário', faixa: [4, 6] },
  { id: 'avancado', nome: 'Avançado', faixa: [7, 10] },
];

export function nivelDe(dif: number): Nivel {
  return dif <= 3 ? 'basico' : dif <= 6 ? 'intermediario' : 'avancado';
}

export function nomeNivel(n: Nivel): string {
  return NIVEIS.find((x) => x.id === n)!.nome;
}

export function ehNivel(x: string | null | undefined): x is Nivel {
  return x === 'basico' || x === 'intermediario' || x === 'avancado';
}

/** Ordem do "Treine sua evolução": dificuldade crescente; empate pela ordem antiga e pelo id (estável). */
export function ordemEvolucao(a: Questao, b: Questao): number {
  return a.dif - b.dif || (a.degrau || 99) - (b.degrau || 99) || a.id.localeCompare(b.id);
}

export interface DesempenhoNivel {
  nivel: Nivel;
  total: number;
  feitas: number;
  /** questões cuja última tentativa foi certa */
  certas: number;
  /** acerto sobre as feitas (null sem respostas) */
  acerto: number | null;
}

export function desempenhoPorNivel(qs: Questao[], s: EstadoMateria): DesempenhoNivel[] {
  return NIVEIS.map(({ id }) => {
    const l = qs.filter((q) => nivelDe(q.dif) === id);
    let feitas = 0, certas = 0;
    for (const q of l) {
      const t = s.q[q.id]?.tent;
      if (!t?.length) continue;
      feitas++;
      if (t[t.length - 1].ok) certas++;
    }
    return { nivel: id, total: l.length, feitas, certas, acerto: feitas ? certas / feitas : null };
  });
}

/** Mínimo de questões feitas num nível para o feedback falar dele. */
export const MIN_FEEDBACK = 3;

/**
 * Uma frase de feedback sobre o desempenho por nível, ou null quando ainda há poucas respostas.
 * Aponta o primeiro nível em que o acerto cai abaixo de 60%: é ali que o aluno trava.
 */
export function feedbackNiveis(d: DesempenhoNivel[]): string | null {
  const com = d.filter((x) => x.feitas >= MIN_FEEDBACK && x.acerto !== null);
  if (!com.length) return null;
  const trava = com.find((x) => x.acerto! < 0.6);
  if (!trava) {
    const falta = d.find((x) => x.total > 0 && x.feitas < MIN_FEEDBACK);
    return falta
      ? `Você vai bem no que já fez. Avance para o nível ${nomeNivel(falta.nivel).toLowerCase()}.`
      : 'Você vai bem em todos os níveis. Mantenha a revisão dos erros em dia.';
  }
  const pct = Math.round(trava.acerto! * 100);
  const antes = com.filter((x) => x !== trava && NIVEIS.findIndex((n) => n.id === x.nivel) < NIVEIS.findIndex((n) => n.id === trava.nivel));
  return antes.length
    ? `Você domina a base, mas trava no ${nomeNivel(trava.nivel).toLowerCase()} (${pct}% de acerto). Refaça as que errou desse nível antes de seguir.`
    : `Seu acerto no ${nomeNivel(trava.nivel).toLowerCase()} está em ${pct}%. Leia a teoria e refaça os erros antes de subir de nível.`;
}

export interface PontoFraco<T> {
  ref: T;
  nivel: Nivel;
  feitas: number;
  acerto: number;
}

/** Combinações (conteúdo × nível) com pior acerto, entre as que têm respostas suficientes. */
export function pontosFracos<T>(grupos: { ref: T; qs: Questao[] }[], s: EstadoMateria, n = 4): PontoFraco<T>[] {
  const l: PontoFraco<T>[] = [];
  for (const g of grupos) for (const d of desempenhoPorNivel(g.qs, s)) {
    if (d.feitas >= MIN_FEEDBACK && d.acerto !== null && d.acerto < 0.6) l.push({ ref: g.ref, nivel: d.nivel, feitas: d.feitas, acerto: d.acerto });
  }
  return l.sort((a, b) => a.acerto - b.acerto || b.feitas - a.feitas).slice(0, n);
}

/**
 * Composição de uma rodada do Treino geral de uma matéria: 6 questões reais de prova, 5 flashcards e 4 frases para
 * completar (15 itens). Matéria que ainda não tem flashcards ou frases aprovados (Física, Geografia, História, Inglês,
 * Filosofia e Sociologia) completa a rodada com mais questões reais, até o que houver.
 */
export const RODADA = { q: 6, f: 5, c: 4 } as const;

export function composicaoRodada(nQuestoes: number, nFlash: number, nFrases: number): { q: number; f: number; c: number } {
  const f = Math.min(RODADA.f, Math.max(0, nFlash));
  const c = Math.min(RODADA.c, Math.max(0, nFrases));
  const q = Math.min(Math.max(0, nQuestoes), RODADA.q + (RODADA.f - f) + (RODADA.c - c));
  return { q, f, c };
}

/** Texto da capa do Treino geral: diz só o que a matéria tem (nada de prometer flashcards ou frases que não existem). */
export function descreveTreino(nQuestoes: number, nFrases: number, nFlash: number): string {
  const partes = [nQuestoes > 0 && 'questões reais de prova', nFrases > 0 && 'frases para completar', nFlash > 0 && 'flashcards'].filter(Boolean) as string[];
  if (!partes.length) return '';
  if (partes.length === 1) return `${partes[0][0].toUpperCase()}${partes[0].slice(1)} dos temas que mais caem, em ordem sorteada a cada rodada.`;
  const lista = partes.slice(0, -1).join(', ') + ' e ' + partes[partes.length - 1];
  return `${lista[0].toUpperCase()}${lista.slice(1)} dos temas que mais caem, tudo misturado.`;
}

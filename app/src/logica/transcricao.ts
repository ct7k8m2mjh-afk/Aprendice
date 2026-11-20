import type { Transcricao } from '../dados/tipos';

/**
 * Transcrição de questão só de texto (princípio 1: "organizada como a banca organizou"; revisão de 19/11/2026, itens 4 e 5).
 * O texto dos dados não muda; muda a forma de exibir:
 * - quebra de linha que é só o fim da linha do PDF, no meio da frase, vira espaço (o parágrafo corre na largura do cartão);
 *   verso e quebra de propósito ficam. Em Português (poemas) nada se junta;
 * - a transcrição que fala de "termo sublinhado/grifado" sem a marcação no texto ("__palavra__") perderia o que a banca
 *   destacou: aí a questão abre no print fiel, e o texto fica a um toque.
 */
const limpa = (s: string) => s.replace(/\*\*|~~|__/g, '');
const FIM_SOLTO = /[a-zà-ÿ0-9,]$/;     // a linha acaba no meio da frase
const COMECO_MINUSCULO = /^[a-zà-ÿ]/;   // e a seguinte continua com minúscula

/** Um parágrafo da transcrição com as quebras do PDF desfeitas (as de propósito ficam). */
export function juntaQuebrasDoPdf(t: string, materia?: string): string {
  if (!t.includes('\n') || materia === 'por') return t;
  const ls = t.split('\n');
  const L = ls.map((x) => limpa(x).trim().length);
  // afirmativa numerada ("IV. A fermentação…", "a) …") e comando da questão ("Atente para o que se afirma…") nunca são verso
  const semMarca = limpa(t);
  const enunciado = /^\s*(?:[IVX]{1,5}\s?[.)–-]|\d{1,2}[.)]|[a-e]\))\s/.test(semMarca)
    || (!/\*\*|~~/.test(t) && /\b(assinale|afirma-se|se afirma|é correto|está correto|está correta|indique|marque|considere)\b/i.test(semMarca));
  // estrofe: muitas linhas curtas seguidas
  const ord = [...L].sort((a, b) => a - b);
  if (!enunciado && ls.length >= 4 && ord[ord.length >> 1] < 45) return t;
  const media = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
  const corpo = L.slice(0, -1), m = media(corpo), dp = Math.sqrt(media(corpo.map((x) => (x - m) ** 2)));
  // prosa: o parágrafo já corre em linhas compridas e sobraram quebras soltas, ou é todo de linhas do mesmo tamanho (justificado)
  const candidata = (i: number) => L[i] >= (enunciado ? 25 : 40) && FIM_SOLTO.test(limpa(ls[i]).trimEnd()) && COMECO_MINUSCULO.test(limpa(ls[i + 1]).trimStart());
  const todas = ls.slice(0, -1).every((_, i) => candidata(i));
  const prosa = Math.max(...L) >= 110 || (m >= 45 && dp / m < 0.2 && todas) || (enunciado && L.slice(0, -1).every((x) => x >= 25));
  if (!prosa) return t;
  // dentro de negrito ou itálico que atravessa a quebra (verso citado), não junta
  let neg = false, ita = false, out = '';
  for (let i = 0; i < ls.length; i++) {
    out += ls[i];
    for (const mk of ls[i].match(/\*\*|~~/g) || []) { if (mk === '**') neg = !neg; else ita = !ita; }
    if (i < ls.length - 1) out += candidata(i) && !neg && !ita ? ' ' : '\n';
  }
  return out;
}

/** A transcrição cita o que a banca sublinhou ou grifou, mas o texto não traz a marcação: só o print mostra. */
export function perdeDestaque(tr: Transcricao | undefined): boolean {
  if (!tr) return false;
  const tudo = [...tr.enun.map((p) => p.t), ...Object.values(tr.alts || {})].join('\n');
  return /\b(sublinhad|grifad)/i.test(tudo) && !/__[^_\n][^_\n]*__/.test(tudo);
}

/**
 * Prosa e versos no mesmo parágrafo (revisão de 20/11/2026, N13): o bloco de versos em negrito ou itálico que começa e
 * termina em linha própria ("…Chico Buarque.\n**Procurando bem\n…\nSó a bailarina que não tem**\nNeste trecho…") vira
 * um bloco separado, como na prova. O texto não muda: só é repartido nas quebras em volta do bloco.
 */
export function blocosDoParagrafo(t: string): string[] {
  if (!t.includes('\n') || !/\*\*|~~/.test(t)) return [t];
  const ls = t.split('\n');
  const out: string[] = [];
  let atual: string[] = [], neg = false, ita = false;
  for (let i = 0; i < ls.length; i++) {
    const l = ls[i];
    const abre = !neg && !ita && /^\s*(\*\*|~~)/.test(l);
    if (abre && atual.length) { out.push(atual.join('\n')); atual = []; }
    const antes = neg || ita;
    for (const mk of l.match(/\*\*|~~/g) || []) { if (mk === '**') neg = !neg; else ita = !ita; }
    atual.push(l);
    // o bloco marcado (de várias linhas) fecha no fim desta linha: o que vem depois é outro bloco
    const fecha = (antes || abre) && !neg && !ita && /(\*\*|~~)\s*$/.test(l) && (antes || atual.length > 1);
    if (fecha && i < ls.length - 1) { out.push(atual.join('\n')); atual = []; }
  }
  if (atual.length) out.push(atual.join('\n'));
  return out.filter((x) => x.trim());
}

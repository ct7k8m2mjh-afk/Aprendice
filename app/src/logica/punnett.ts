/**
 * QUADRO DE PUNNETT montado pelo motor da resolução animada (revisão 19/11, item 8c).
 *
 * Quando um passo de Biologia escreve um cruzamento ("Kenisa XᴬXᵃ × marido XᴬY", "Aa × aa", "AaBb × aabb",
 * "IᴬIᴮ × ii"), o motor lê os dois genótipos, separa os gametas de cada um e monta o quadro: os gametas saem dos pais
 * para as bordas e se juntam em cada casa. É conta mecânica (nenhuma interpretação): só entra quando os dois genótipos
 * são lidos por inteiro, com os mesmos genes, e no máximo dois genes (quadro de até 4 × 4). As casas com um genótipo
 * citado depois do cruzamento ("→ criança XᵃY") ficam marcadas.
 */

/** letra-índice sobrescrita (alelo): maiúsculas e minúsculas */
const SOBRE_MAI = 'ᴬᴮᴰᴱᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾᴿᵀᵁⱽᵂ';
const SOBRE_MIN = 'ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖʳˢᵗᵘᵛʷˣʸᶻ';
const SOBRE = SOBRE_MAI + SOBRE_MIN + '⁺⁻⁰¹²³';

export interface Alelo { base: string; idx: string }
export interface Punnett {
  /** os dois genótipos como estão escritos (pai/mãe da esquerda e da direita do "×") */
  pais: [string, string];
  /** gametas de cada um (colunas: o da esquerda; linhas: o da direita) */
  gametas: [string[], string[]];
  /** casas[linha][coluna]: genótipo do filho */
  casas: string[][];
  /** casas citadas no texto depois do cruzamento */
  alvos: string[];
}

const RE_ALELO = new RegExp(`[A-Za-z][${SOBRE}]?`, 'gu');

/** "XᴬXᵃ" → [[Xᴬ, Xᵃ]]; "AaBb" → [[A, a], [B, b]]; null se não for genótipo */
export function leGenotipo(g: string): Alelo[][] | null {
  if (!g || g.length < 2 || g.length > 12) return null;
  const as = [...g.matchAll(RE_ALELO)].map((m) => m[0]);
  if (as.join('') !== g || as.length % 2 || as.length > 4) return null;
  const pares: Alelo[][] = [];
  for (let k = 0; k < as.length; k += 2) {
    const a: Alelo = { base: as[k][0], idx: as[k].slice(1) }, b: Alelo = { base: as[k + 1][0], idx: as[k + 1].slice(1) };
    if (a.base === 'X' && (b.base === 'X' || b.base === 'Y')) {
      // cromossomo X: o alelo vem no índice (Xᴬ, Xᵃ), Y sem índice; ou só os cromossomos do sexo (XX, XY)
      if (b.base === 'Y' && b.idx) return null;
      if (b.base === 'X' && !!a.idx !== !!b.idx) return null;
    } else if (a.base.toLowerCase() !== b.base.toLowerCase() || a.base === 'X' || a.base === 'x') return null;
    else if (a.base === 'I' || a.base === 'i') {
      // grupo sanguíneo ABO: Iᴬ, Iᴮ, i
      if ((a.base === 'I') !== !!a.idx || (b.base === 'I') !== !!b.idx) return null;
    } else if (a.idx || b.idx) return null;
    pares.push([a, b]);
  }
  return pares;
}
/** o gene de um par: a letra (X para o par sexual, I para o ABO) */
const gene = (p: Alelo[]) => (p[0].base === 'X' ? 'X' : p[0].base.toUpperCase());
const txt = (a: Alelo) => a.base + a.idx;
/** ordem de escrita no genótipo: maiúscula antes de minúscula; X antes de Y; índice maiúsculo antes do minúsculo */
function ordem(a: Alelo): number {
  const mai = a.base === a.base.toUpperCase();
  const im = !a.idx || SOBRE_MAI.includes(a.idx);
  return (mai ? 0 : 4) + (im ? 0 : 2);
}
function junta(x: Alelo, y: Alelo): string {
  // par do sexo: o X vem antes do Y
  if (x.base === 'X' && y.base === 'Y') return txt(x) + txt(y);
  if (y.base === 'X' && x.base === 'Y') return txt(y) + txt(x);
  const [a, b] = [x, y].sort((p, q) => ordem(p) - ordem(q) || (p.idx < q.idx ? -1 : p.idx > q.idx ? 1 : 0));
  return txt(a) + txt(b);
}

function gametasDe(g: Alelo[][]): Alelo[][] {
  let out: Alelo[][] = [[]];
  for (const par of g) out = out.flatMap((pre) => par.map((a) => [...pre, a]));
  return out;
}

/** separa uma palavra da frase das pontuações em volta */
const limpa = (w: string) => w.replace(/^[("“]+|[)"”,.;:]+$/g, '');

/** Lê o cruzamento de uma linha ("… XᴬXᵃ × marido XᴬY → …"). null se não houver um cruzamento lido por inteiro. */
export function cruzamento(s: string): Punnett | null {
  // o primeiro "×" com um genótipo de cada lado (o "1/2 × 1/2" da mesma linha é conta, não cruzamento)
  for (let k = s.indexOf(' × '); k >= 0; k = s.indexOf(' × ', k + 3)) {
    const c = cruzaEm(s, k);
    if (c) return c;
  }
  return null;
}
function cruzaEm(s: string, k: number): Punnett | null {
  // o comentário entre parênteses não conta ("AA (amarela) × aa (verde)")
  const semPar = (x: string) => x.replace(/\([^()]*\)/g, ' ');
  const antes = semPar(s.slice(0, k)).trim().split(/\s+/), depois = semPar(s.slice(k + 3)).trim().split(/\s+/);
  const p1 = limpa(antes[antes.length - 1] || '');
  // à direita, o genótipo pode vir depois de um nome ("× marido XᴬY", "× Augusto XᴬY", "× I-2 Aa")
  let p2 = limpa(depois[0] || ''), resto = depois.slice(1);
  if (!leGenotipo(p2) && depois[1] && /^[A-Za-zÀ-ÿ0-9-]+$/.test(depois[0])) { p2 = limpa(depois[1]); resto = depois.slice(2); }
  const g1 = leGenotipo(p1), g2 = leGenotipo(p2);
  if (!g1 || !g2 || g1.length !== g2.length) return null;
  if (g1.map(gene).join() !== g2.map(gene).join()) return null;
  // X ligado: quem tem Y é o pai; o quadro precisa de um XX e um XY
  if (g1.some((p) => p[0].base === 'X')) {
    const y1 = g1.some((p) => p[1].base === 'Y'), y2 = g2.some((p) => p[1].base === 'Y');
    if (y1 === y2) return null;
  }
  const ga = gametasDe(g1), gb = gametasDe(g2);
  const casas = gb.map((b) => ga.map((a) => a.map((x, i) => junta(x, b[i])).join('')));
  const citados = new Set(resto.join(' ').split(/[\s,;:()→]+/).map(limpa).filter(Boolean));
  const alvos = [...new Set(casas.flat())].filter((c) => citados.has(c));
  return { pais: [p1, p2], gametas: [ga.map((g) => g.map(txt).join('')), gb.map((g) => g.map(txt).join(''))], casas, alvos };
}

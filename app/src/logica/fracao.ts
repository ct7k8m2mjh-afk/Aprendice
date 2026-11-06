/**
 * Fração empilhada (guia tipográfico, p. 2 e 6): "A fração da conta (520 sobre 40) é montada pelo layout do site,
 * um número em cima, a barra e o outro embaixo... nem '520/40' na linha."
 *
 * Aqui só se lê o texto: o conteúdo das resoluções NÃO muda, muda a forma de exibir. `partesFracao` acha as frações
 * numéricas ou algébricas simples ("2/5", "27x/60", "√2/2", "a/b", "(2·1)/2", "2x/(x + 1)") e deixa como estão
 * datas ("05/11", "2024/2"), unidades ("km/h", "g/mol", "10 m/s"), separadores de verso (" / ") e o resto do texto.
 */

export type ParteFracao =
  | { t: 'txt'; v: string }
  | { t: 'frac'; n: string; d: string; orig: string }
  /** notação de nuclídeo ("207/82 Pb"): número de massa em cima, número atômico embaixo, antes do símbolo; sem barra */
  | { t: 'nuc'; a: string; z: string; orig: string };

// símbolos na ordem do número atômico (Z = posição + 1), para reconhecer "207/82 Pb" e "90/38 Sr"
const ELEMENTOS = ('H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo '
  + 'Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn '
  + 'Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr Rf Db Sg Bh Hs Mt Ds Rg Cn Nh Fl Mc Lv Ts Og').split(' ');
const Z_DO_SIMBOLO = new Map(ELEMENTOS.map((s, i) => [s, i + 1]));

// operando: um grupo entre parênteses (sem parênteses dentro) ou um termo simples
// (raiz opcional, número com decimais, no máximo uma letra, expoentes)
// (coeficiente e raiz juntos: "6√5/5" é (6√5) ÷ 5, o numerador inteiro vai em cima; letras: uma, ou um segmento
// "AB", "Ab" (área da base), "xP" (abscissa de P))
const TERMO = String.raw`\([^()\n]{1,40}\)|(?:\d+(?:[.,]\d+)*)?√?(?:\d+(?:[.,]\d+)*)?(?:[A-Z]{2}|[A-Z][a-z]|[xy][A-Z]|[a-zA-Zα-ωπθ])?[²³⁴⁵⁶⁷⁸⁹¹⁰⁻]*`;
const RE = new RegExp(`(${TERMO})/(${TERMO})`, 'g');
const LETRA = /[A-Za-zÀ-ÿα-ωπθ]/;
const ANTES_PROIBIDO = /[A-Za-zÀ-ÿ0-9.,/_\\-]/; // colado a uma palavra, número, data ou link
const DEPOIS_PROIBIDO = /[A-Za-zÀ-ÿ0-9/_(]/;
// símbolos de unidade de uma letra: "m/s", "g/L" só viram fração depois de um sinal (d = m/V)
const UNIDADE = new Set(['m', 's', 'g', 'L', 'l', 'h', 'K', 'N', 'J', 'W', 'V']);

function semParenteses(x: string): string {
  return x.startsWith('(') && x.endsWith(')') ? x.slice(1, -1).trim() : x;
}

function ehFracao(texto: string, ini: number, num: string, den: string): boolean {
  if (!num || !den) return false;
  // termo vazio por dentro (só "√" ou só expoente) não conta
  const temValor = (x: string) => /[0-9a-zA-Zα-ωπθ]/.test(x);
  if (!temValor(num) || !temValor(den)) return false;
  const antes = texto.slice(0, ini);
  const fim = ini + num.length + 1 + den.length;
  const charAntes = antes.slice(-1);
  const charDepois = texto.charAt(fim);
  // "-t²/4" (sinal de menos com hífen) pode; hífen colado a palavra ou número não
  if (charAntes && ANTES_PROIBIDO.test(charAntes) && !(charAntes === '-' && /(^|[\s=(])-$/.test(antes))) return false;
  if (charDepois && DEPOIS_PROIBIDO.test(charDepois)) return false;
  const nNum = /^\d+$/.test(num), nDen = /^\d+$/.test(den);
  // datas e anos: "05/11", "12/03", "2024/2", "2020/21"
  if (nNum && nDen) {
    if (/^0\d/.test(den) || /^0\d/.test(num)) return false;
    if (/^(19|20)\d\d$/.test(num)) return false;
  }
  const letraNum = !num.startsWith('(') && LETRA.test(num);
  const letraDen = !den.startsWith('(') && LETRA.test(den);
  if (letraNum || letraDen) {
    // depois de um número com espaço é unidade ("10 m/s", "3 L/h", "1,2 × 10³ J/(kg °C)")
    if (/[\d²³⁴⁵⁶⁷⁸⁹¹⁰]\s+$/.test(antes)) return false;
  }
  // só letras dos dois lados ("a/b", "m/V", "A/a", "g/L", "L/(mol·K)"): fração só depois de um sinal de conta ou no começo;
  // depois de palavra é par de genes ("o par A/a") ou unidade ("concentração (g/L)", "R em J/(mol·K)")
  // dois grupos entre parênteses ("(m + n)/(m × n)") é fração algébrica
  if (num.startsWith('(') && den.startsWith('(')) return true;
  const soLetras = (x: string) => LETRA.test(x) && !/\d/.test(x);
  if (soLetras(num) && soLetras(den)) {
    const tira = (x: string) => x.replace(/[²³⁴⁵⁶⁷⁸⁹¹⁰⁻]/g, '');
    // depois de sinal, no começo, como argumento de função ("f(c/b)"), depois de "razão" ou antes de "=" ("a/g = 10/15")
    const depoisDeSinal = /(^|[=+−\-×·÷≈<>→])\s*$/.test(antes) || /(^|[^A-Za-zÀ-ÿ])[a-zA-Z]\($/.test(antes)
      || /\braz(ão|ões)\s+$/i.test(antes) || /^\s*[=≈]/.test(texto.slice(fim));
    if (!depoisDeSinal) return false;
    // no começo do texto, só letra de variável ou segmento ("a/b = c/d", "AB/CD"); "Wh/L (watt-hora...)" é unidade
    // e "Mg/Fe" é par de metais
    const simples = (x: string) => /^(?:[a-zα-ωπθ]|[A-Z]{1,2})$/.test(tira(x));
    if (!antes.trim() && !(simples(num) && simples(den)) && !/^\s*[=≈]/.test(texto.slice(fim))) return false;
    // letras de alternativa ("A/B")
    if (/^[A-E]$/.test(num) && /^[A-E]$/.test(den)) return false;
    // produto de unidades: "atm·L/K", "atm · L/(mol·K)"
    if (/[A-Za-zÀ-ÿ]{2,}\s*·\s*$/.test(antes)) return false;
    // dois símbolos de unidade ("m/s²", "g/L") só depois de "=": "d = m/V"
    if (UNIDADE.has(tira(num)) && UNIDADE.has(tira(den)) && !/=\s*$/.test(antes)) return false;
  }
  return true;
}

/** "207/82 Pb": massa/número atômico seguidos do símbolo do elemento com esse Z. Devolve o trecho "207/82 " ou null. */
function nuclideo(texto: string, ini: number, num: string, den: string): string | null {
  if (!/^\d{1,3}$/.test(num) || !/^\d{1,3}$/.test(den) || +num < +den) return null;
  const antes = texto.charAt(ini - 1);
  if (antes && /[A-Za-zÀ-ÿ0-9.,/]/.test(antes)) return null;
  const fim = ini + num.length + 1 + den.length;
  const m = /^\s?([A-Z][a-z]?)(?![A-Za-zÀ-ÿ])/.exec(texto.slice(fim));
  if (!m || Z_DO_SIMBOLO.get(m[1]) !== +den) return null;
  return texto.slice(ini, fim) + (m[0].startsWith(' ') ? ' ' : '');
}

/** Divide o texto em trechos de texto e frações empilháveis. Sem fração, devolve um trecho só. */
export function partesFracao(texto: string): ParteFracao[] {
  const out: ParteFracao[] = [];
  let ult = 0;
  RE.lastIndex = 0;
  for (let m = RE.exec(texto); m; m = RE.exec(texto)) {
    if (m[0].length === 0) { RE.lastIndex++; continue; }
    const [orig, num, den] = m;
    const nuc = nuclideo(texto, m.index, num, den);
    if (nuc) {
      if (m.index > ult) out.push({ t: 'txt', v: texto.slice(ult, m.index) });
      out.push({ t: 'nuc', a: num, z: den, orig: nuc });
      ult = m.index + nuc.length;
      RE.lastIndex = ult;
      continue;
    }
    if (!ehFracao(texto, m.index, num, den)) {
      // tenta de novo a partir do caractere seguinte (o denominador pode ser o numerador de outra fração)
      RE.lastIndex = m.index + 1;
      continue;
    }
    if (m.index > ult) out.push({ t: 'txt', v: texto.slice(ult, m.index) });
    out.push({ t: 'frac', n: semParenteses(num), d: semParenteses(den), orig });
    ult = m.index + orig.length;
  }
  if (ult < texto.length) out.push({ t: 'txt', v: texto.slice(ult) });
  return out.length ? out : [{ t: 'txt', v: texto }];
}

/**
 * A "conta" de um passo às vezes é texto: um trecho citado da prova (Português), uma relação entre palavras
 * ("autor → obra", "coração × tela") ou uma frase (Biologia, Química). O guia reserva a letra à mão (Caveat) para
 * conta e fórmula ("cursiva nunca em texto corrido"); texto vai na família da interface.
 * - Português, Inglês, História, Geografia e Filosofia e Sociologia: sempre texto;
 * - frase (6 a 10 palavras seguidas sem número nem sinal no meio, conforme a forma) é texto, mesmo com uma conta dentro;
 * - só números (lista, resultado: "43,18", "2, 3, 5, 7, 11, ...") é conta;
 * - é conta quando há sinal de matemática ou química junto de número, variável ou fórmula: operador junto de
 *   número, letra de variável com "=", raiz, expoente, índice; seta e "×" só contam entre fórmulas ("Aa × Aa",
 *   "2 H2O2 → 2 H2O + O2"), não entre palavras;
 * - trecho entre aspas é citação: só é conta se sobrar sinal fora das aspas.
 */
const PALAVRA = /^[A-Za-zÀ-ÿ]+(?:-[A-Za-zÀ-ÿ]+)*$/; // "alcalino-terroso" é uma palavra
// átomo de fórmula: tem algarismo, índice ou expoente, ou é variável/genótipo curto (x, n, Aa, AB), ou fórmula química (NaCl, CaCO3)
function ehAtomo(tk: string): boolean {
  const t = tk.replace(/[.,;:!?]+$/, '').replace(/\((?:aq|s|l|g|v)\)$/, '').replace(/^[(\[{“"'‘]+|[)\]}”"'’]+$/g, '');
  if (!t) return false;
  if (/[0-9²³⁴⁵⁶⁷⁸⁹¹⁰⁻⁺₀₁₂₃₄₅₆₇₈₉]/.test(t)) return true;
  if (/^[A-Za-zα-ω]{1,2}$/.test(t) && !/^(é|e|o|a|os|as|um|de|da|do|em|no|na|se|ou)$/i.test(t)) return true;
  return /^(?:[A-Z][a-z]?){2,}$/.test(t) && /[a-z]/.test(t) && !/^[A-Z][a-z]+$/.test(t);
}
function maiorFrase(t: string): number {
  // sequência de palavras sem número nem sinal de conta entre elas (vírgula, dois-pontos e parênteses não cortam)
  let maior = 0, seq = 0;
  for (const tk of t.split(/\s+/)) {
    const w = tk.replace(/^[(“"'‘—–-]+|[)”"'’.,;:!?]+$/g, '');
    const genotipo = /^([A-Z])\1?$/.test(w) || (w.length === 2 && w[0] !== w[1] && w[0].toLowerCase() === w[1]);
    const variavel = w.length === 1 && !/^[aeoéàAEOÉÀ]$/.test(w); // "n", "x": variável, não palavra
    if (PALAVRA.test(w) && !genotipo && !variavel) { seq++; maior = Math.max(maior, seq); }
    else seq = 0;
  }
  return maior;
}
/** Matéria pelo código do tema ou do conteúdo ("M10.2" → mat, "P01" → por; L e S são Filosofia e Sociologia). */
const PREFIXO_MATERIA: Record<string, string> = { M: 'mat', B: 'bio', Q: 'qui', P: 'por', F: 'fis', G: 'geo', H: 'his', I: 'ing', L: 'fs', S: 'fs' };
export function materiaDoCodigo(codigo: string | undefined | null): string | undefined {
  const m = /^([A-Z])\d/.exec(codigo || '');
  return m ? PREFIXO_MATERIA[m[1]] : undefined;
}

/** Matérias em que a "conta" do passo é sempre trecho ou relação entre palavras, nunca cálculo. */
const SEMPRE_TEXTO = new Set(['por', 'ing', 'his', 'geo', 'fs']);
/** Matérias de cálculo: seta e "×" contam como sinal de conta mesmo entre palavras ("6 lados → hexágono"). */
const CALCULO = new Set(['mat', 'fis']);
export function contaEhTexto(s: string, materia?: string): boolean {
  if (materia && SEMPRE_TEXTO.has(materia)) return true;
  let t = s.trim();
  if (!t) return true;
  if (/^[^A-Za-zÀ-ÿ]*\d[^A-Za-zÀ-ÿ]*$/.test(t)) return false; // só números e sinais
  if (/^["“”'‘’«]/.test(t)) {
    t = t.replace(/["“«][^"”»]*["”»]|['‘][^'’]*['’]/g, ' ').trim(); // tira as citações
    if (!t) return true;
  }
  const calculo = !!materia && CALCULO.has(materia);
  // em Matemática e Física, "ângulo do copo = 90° − 45°" é conta com nome por extenso; frase é só a que começa com
  // maiúscula e termina com ponto
  const frase = calculo ? /^[A-ZÀ-Ý][a-zà-ÿ]+\s/.test(t) && /[.!?]$/.test(t) : true;
  // o comentário entre parênteses não conta ("1/2 (chance de o óvulo levar o inserto) × 1 = 1/2"); frase com cara de
  // frase (maiúscula no começo, ponto no fim) precisa de 6 palavras seguidas, a conta que começa por número de 10
  const formaDeFrase = /^[A-ZÀ-Ý][a-zà-ÿ]+\s/.test(t) && /[.!?]$/.test(t);
  const minimo = formaDeFrase ? 6 : /^[\d(−-]/.test(t) ? 10 : 8;
  if (frase && maiorFrase(t.replace(/\([^()]*\)/g, ' ')) >= minimo) return true;
  const forte = /[√²³⁴⁵⁶⁷⁸⁹¹⁰⁻⁺₀₁₂₃₄₅₆₇₈₉∈≈≤≥≠ΔπΣ∑∞⇌]|\d\s*[=+−·*/^%<>÷]|[=+−·*/^<>÷]\s*\d|(?<![A-Za-zÀ-ÿ\d])-\s*\d|\d\s*-(?![A-Za-zÀ-ÿ\d])|(?<![A-Za-zÀ-ÿ])(?![aeo]\s)[a-zA-Zα-ω]\s*=(?!\s*[A-Za-zÀ-ÿ]{3})|=\s*(?![aeoé](?![A-Za-zÀ-ÿ]))[a-zA-Z](?![A-Za-zÀ-ÿ])|\b[A-Z]{2,4}\s*[+−]\s*[A-Z]{2,4}\b|[α-ω]\s*[+−]\s*[α-ω]/;
  if (forte.test(t)) return false;
  if (calculo && /[→⇒×÷]|(?<![A-Za-zÀ-ÿ])[a-zA-Zα-ωθ]\s*=|=\s*[a-zA-Zα-ωθ](?![A-Za-zÀ-ÿ])/.test(t)) return false;
  // seta e "×" entre fórmulas
  const tks = t.split(/\s+/);
  for (let i = 0; i < tks.length; i++) {
    if (/^(→|⇒|×|\+|−|=)$/.test(tks[i]) && i > 0 && i < tks.length - 1 && ehAtomo(tks[i - 1]) && ehAtomo(tks[i + 1])) return false;
  }
  return true;
}

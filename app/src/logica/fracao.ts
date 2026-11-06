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
  /** sep: o sinal escrito entre os dois ("/", " ÷ ", " / "); pn/pd: o numerador/denominador estava entre parênteses
   *  (o layout tira os parênteses; quem desenha guarda-os escondidos, para o texto continuar o mesmo) */
  | { t: 'frac'; n: string; d: string; orig: string; sep?: string; pn?: boolean; pd?: boolean }
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
    out.push({ t: 'frac', n: semParenteses(num), d: semParenteses(den), orig, sep: '/', pn: num !== semParenteses(num), pd: den !== semParenteses(den) });
    ult = m.index + orig.length;
  }
  if (ult < texto.length) out.push({ t: 'txt', v: texto.slice(ult) });
  // 2ª passada: divisão escrita com "÷" ou com "/" entre espaços também é fração empilhada (regra do dono: nunca
  // "3 ÷ 5" nem "3 / 5" na mesma linha)
  const fim: ParteFracao[] = [];
  for (const p of out) if (p.t === 'txt') fim.push(...divisoes(p.v)); else fim.push(p);
  return fim.length ? fim : [{ t: 'txt', v: texto }];
}

/* ---------------------------------------------------------------- divisão com "÷" e " / " */
// operando simples: função opcional, número (milhar com espaço, decimal), raiz, letra(s), índice, expoente, porcentagem;
// ou número com unidade ("1 g ÷ 2^4")
const EXPO = String.raw`(?:\^\([^()\n]{1,24}\)|\^[−\-+]?[0-9a-zA-Z,]+[+−]?|[²³⁴⁵⁶⁷⁸⁹¹⁰⁻⁺]+)?`;
const SIMPLES = String.raw`(?:(?:log|ln|sen|cos|tg)\s?)?(?:\d{1,3}(?:[ \u00a0\u202f]\d{3})+(?:,\d+)?|\d+(?:[.,]\d+)*)?√?(?:\d+(?:[.,]\d+)*)?(?:[A-Z]{2}|[A-Z][a-z]|[xy][A-Z]|[a-zA-Zα-ωπθμΔ](?:_[A-Za-z0-9]+)?)?[₀-₉]*` + EXPO + '%?';
const UNID = String.raw`\d+(?:[.,]\d+)?\s(?:g|mg|kg|mL|L|mol|cm|m|km|s|h|min)`;
const RE_ESQ = new RegExp(`(?:${UNID}|${SIMPLES})$`, 'u');
const RE_DIR = new RegExp(`^(?:${UNID}(?![A-Za-z])|${SIMPLES})`, 'u');
const RE_OP = /\s*÷\s*| \/ /g;
const temValor = (x: string) => /[0-9a-zA-Zα-ωπθμΔ]/.test(x);

/** operando que termina em `fim` (grupo entre parênteses com expoente, ou simples) */
function opEsq(s: string, fim: number): number | null {
  const pre = s.slice(0, fim);
  let k = fim;
  const sup = /[²³⁴⁵⁶⁷⁸⁹¹⁰⁻⁺]*$/.exec(pre)![0];
  k -= sup.length;
  if (pre[k - 1] === ')') {
    let p = 0;
    for (let i = k - 1; i >= 0; i--) {
      if (s[i] === ')') p++;
      else if (s[i] === '(') { p--; if (p === 0) return i; }
    }
    return null;
  }
  const m = RE_ESQ.exec(pre);
  if (!m || !temValor(m[0])) return null;
  return fim - m[0].length;
}
/** operando que começa em `ini` */
function opDir(s: string, ini: number): number | null {
  if (s[ini] === '(') {
    let p = 0;
    for (let i = ini; i < s.length; i++) {
      if (s[i] === '(') p++;
      else if (s[i] === ')') { p--; if (p === 0) { const sup = /^[²³⁴⁵⁶⁷⁸⁹¹⁰⁻⁺]*/.exec(s.slice(i + 1))![0]; return i + 1 + sup.length; } }
    }
    return null;
  }
  const m = RE_DIR.exec(s.slice(ini));
  if (!m || !temValor(m[0])) return null;
  return ini + m[0].length;
}
function divisoes(s: string): ParteFracao[] {
  if (!/÷| \/ /.test(s)) return [{ t: 'txt', v: s }];
  // as divisões de fora primeiro (menor profundidade de parênteses): "(x ÷ 6) ÷ (1 − x²)" empilha a de fora, e a de
  // dentro empilha dentro do numerador quando ele é desenhado
  const ops: { ini: number; fim: number; txt: string; prof: number }[] = [];
  RE_OP.lastIndex = 0;
  for (let m = RE_OP.exec(s); m; m = RE_OP.exec(s)) {
    let prof = 0;
    for (let i = 0; i < m.index; i++) { if (s[i] === '(') prof++; else if (s[i] === ')') prof--; }
    ops.push({ ini: m.index, fim: m.index + m[0].length, txt: m[0], prof });
  }
  ops.sort((x, y) => x.prof - y.prof || y.ini - x.ini);
  const feitas: { a: number; b: number; p: ParteFracao }[] = [];
  const livre = (a: number, b: number) => !feitas.some((f) => a < f.b && f.a < b);
  for (const o of ops) {
    if (!livre(o.ini, o.fim)) continue;
    let a = opEsq(s, o.ini);
    const b = opDir(s, o.fim);
    // divisão encadeada (a ÷ b ÷ c = (a ÷ b) ÷ c): o numerador leva a divisão de antes, que empilha dentro dele
    for (let m = a == null ? null : /\s*÷\s*$/.exec(s.slice(0, a)); a != null && m; m = /\s*÷\s*$/.exec(s.slice(0, a))) {
      const a2 = opEsq(s, m.index);
      if (a2 == null) break;
      a = a2;
    }
    if (a == null || b == null || !livre(a, b)) continue;
    const num = s.slice(a, o.ini), den = s.slice(o.fim, b);
    const antes = s.slice(0, a), depois = s.slice(b);
    // colado a palavra, número, índice ou outra divisão: não é um operando inteiro
    if (/[A-Za-zÀ-ÿ0-9.,_^\\/÷]$/.test(antes) || /^[A-Za-zÀ-ÿ0-9(_^/]/.test(depois)) continue;
    if (/\s\/\s*$/.test(antes)) continue;
    const espacada = !o.txt.includes('÷');
    if (espacada) {
      // "A / B" entre alternativas, unidade ("10 m / s"), verso ("enganos, / tu"), palavras
      const so = (x: string) => /^[A-Za-zα-ωμ]+$/.test(x);
      if (/^[A-E]$/.test(num) && /^[A-E]$/.test(den)) continue;
      if (new RegExp(`^${UNID}$`, 'u').test(num)) continue;
      if (so(num) && /\d\s+$/.test(antes)) continue;
      if (so(num) && so(den) && !/(^|[=+−\-×·(≈])\s*$/.test(antes) && !/^\s*[=≈]/.test(depois)) continue;
    }
    feitas.push({ a, b, p: { t: 'frac', n: semParenteses(num), d: semParenteses(den), orig: s.slice(a, b), sep: o.txt, pn: num !== semParenteses(num), pd: den !== semParenteses(den) } });
  }
  feitas.sort((x, y) => x.a - y.a);
  const out: ParteFracao[] = [];
  let ult = 0;
  for (const f of feitas) {
    if (f.a > ult) out.push({ t: 'txt', v: s.slice(ult, f.a) });
    out.push(f.p);
    ult = f.b;
  }
  if (ult < s.length) out.push({ t: 'txt', v: s.slice(ult) });
  return out;
}

/**
 * A "conta" de um passo às vezes é texto: um trecho citado da prova (Português), uma relação entre palavras
 * ("autor → obra", "coração × tela") ou uma frase (Biologia, Química). O guia reserva a letra à mão (Caveat) para
 * conta e fórmula ("cursiva nunca em texto corrido"); texto vai na família da interface.
 * - Português, Inglês, História, Geografia e Filosofia e Sociologia: sempre texto;
 * - frase (6 a 10 palavras seguidas sem número nem sinal no meio, conforme a forma) é texto, mesmo com uma conta dentro;
 * - fora de Matemática e Física, frase explicativa com poucas expressões no meio é texto (`fraseComPoucaConta`);
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
// unidades não pesam para nenhum lado ("1 mol de cobre", "23 g")
const UNIDADES = new Set(['mol', 'g', 'kg', 'mg', 'µg', 'L', 'mL', 'kJ', 'J', 'kcal', 'cal', 'pm', 'nm', 'cm', 'mm', 'm', 'km', 's', 'min', 'h',
  'atm', 'mmHg', 'Pa', 'kPa', 'K', 'C', 'M', 'u', 'Da', 'ppm', 'mol/L', 'g/mol', 'g/L', 'kJ/mol', 'kcal/mol', 'g/mL', 'g/cm³', '°C', '%']);
// palavra de ligação ou verbo de explicação: sem ela não há frase, só rótulos ("massa molar do CO2 = ...")
const LIGACAO = /^(significa|significam|ou|seja|logo|então|portanto|porque|pois|como|que|quando|se|mas|cada|é|são|tem|têm|fica|ficam|vira|viram|sobra|sobram|sai|saem|entra|entram|perde|perdeu|ganha|ganhou|há|está|estão|corresponde|indica|mostra|dá|dão|vai|vão|leva|traz|forma|formam|iguais|igual|mesmo|mesma|assim|isto|conforme|embora|libera|liberam|doa|recebe|pertence|existe|cumpre)$/i;
/**
 * Frase explicativa com poucas expressões no meio ("86 prótons significa Z = 86. Número de massa 222 significa A = 222…"):
 * conta as palavras de texto e os itens de conta (número, sinal, fórmula, variável, genótipo); unidades são neutras.
 * É frase quando há 7 palavras ou mais, metade ou mais dos itens são palavras, nenhuma expressão seguida passa de 6
 * itens (equação química ou conta comprida continua conta) e há palavra de ligação ou verbo; sem "=" nem seta, a
 * frase dispensa a palavra de ligação ("Arrhenius: ácido libera H⁺ em água"). A igualdade entre nomes sem ligação é
 * fórmula por extenso e fica à mão ("carga total do cátion + carga total do ânion = 0").
 */
function fraseComPoucaConta(t: string): boolean {
  let pal = 0, conta = 0, seq = 0, maiorSeq = 0, liga = false;
  const tks = t.split(/\s+/);
  for (let i = 0; i < tks.length; i++) {
    const w = tks[i].replace(/^[(\[“"'‘—–]+|[)\]”"'’.,;:!?]+$/g, '');
    if (!w || /^[—–-]$/.test(w)) continue;
    if (UNIDADES.has(w)) continue;
    // "E", "A", "O" no começo da frase são palavra ("E 86 elétrons"), a não ser antes de um sinal ("A = 222")
    const vogal = /^[EAOÉÀ]$/.test(w) && (i === 0 || /[.!?:;]$/.test(tks[i - 1])) && !/^[=+−×÷·→≈<>]/.test(tks[i + 1] || '');
    const genotipo = !vogal && /^([A-Z])\1?$/.test(w) || /^([a-z])\1$/.test(w) || (w.length === 2 && w[0] !== w[1] && w[0].toLowerCase() === w[1]) || /^I[AB][iAB]?[AB]?$/.test(w);
    const variavel = w.length === 1 && !/^[eoaéàEOAÉÀ]$/.test(w);
    const elemento = /^[A-Z][a-z]?$/.test(w) && Z_DO_SIMBOLO.has(w) && !/^(No|Na|Se|As|Em|O)$/.test(w);
    const formula = /^(?:[A-Z][a-z]?){2,}$/.test(w) && !/^[A-Z][a-zà-ÿ]+$/.test(w);
    if (PALAVRA.test(w) && !genotipo && !variavel && !elemento && !formula) {
      pal++; seq = 0;
      if (LIGACAO.test(w)) liga = true;
    } else { conta++; seq++; maiorSeq = Math.max(maiorSeq, seq); }
  }
  return pal >= 7 && pal >= conta && maiorSeq <= 6 && (liga || !/[=→⇒]/.test(t));
}
/**
 * A linha que COMEÇA com uma conta continua à mão, mesmo com a explicação depois ("22 átomos × 12 g/mol = 264 g de
 * carbono…", "14 ÷ 24 = 0,583, ou seja…", "[H⁺] = 1 × 10⁻¹⁵ mol/L, logo pH = 15"), e também a que tem equação com
 * seta entre fórmulas ("C2H2 + 1 HCl → C2H3Cl, ou seja…"). Começar com conta é:
 * - número ou expressão (fórmula, variável) seguido de ×, ÷, +, −, = ou → nas primeiras palavras, antes de pontuação
 *   e de palavra de ligação ("16 pares × 2 cromossomos por par = 32", "8 elétrons do octeto − 6 elétrons…");
 * - nome seguido de "=" e de uma operação logo depois (fórmula por extenso: "ordem global = 2 + 1 = 3",
 *   "entalpia dos produtos = entalpia dos reagentes − 888 kcal");
 * - um rótulo curto com dois-pontos antes disso ("H: 2 × 4 = 8", "200 L da solução 2: 0,01 mol/L × 200 L = 2 mol"),
 *   desde que a conta depois do rótulo chegue a um "=", "≈" ou seta antes de fechar o trecho
 *   ("enxofre da família VI A: 2 ligações + 2 pares isolados, logo…" é frase);
 * - equação química escrita com "dá" no lugar da seta ("C16H34 dá C8H16 + C8H18", "2 H2O com corrente elétrica dá
 *   2 H2 + O2"): fórmula pouco antes do "dá" e fórmula logo depois.
 * Dado solto não é conta: "Z = 7 e o átomo é neutro…", "ΔH⁰ de reação = − 727 kJ/mol, valor negativo…" ficam texto;
 * lista de reagentes e produtos também não ("2 H2 + O2 (reagentes) no nível Y; topo da curva…": a soma não chega a
 * "=" nem a seta).
 */
const OPERADOR = /^(?:×|÷|\+|−|=|≈|→)$/;
const OPERACAO = /^(?:×|÷|\+|−|→)$/;
const FIM_DE_TRECHO = /[,;.:!?|]$/;
function cabecaDeConta(t: string): boolean {
  const tks = t.split(/\s+/).filter(Boolean);
  if (tks.length < 3) return false;
  const numero = /^[[(]*[−+-]?\d/.test(tks[0]);
  const expressao = numero || /^\[/.test(tks[0]) || ehAtomo(tks[0]);
  let k = -1;
  for (let i = 0; i < Math.min(tks.length, 7); i++) {
    const w = tks[i];
    if (OPERADOR.test(w)) { k = i; break; }
    // depois de "de" é substantivo ("3 classes de forma × 2 classes de cor")
    if (i > 0 && LIGACAO.test(w.replace(/[.,;:!?]+$/, '')) && !/^(de|da|do)$/i.test(tks[i - 1])) return false;
    if (FIM_DE_TRECHO.test(w)) return false;
  }
  if (k <= 0) return false;
  if (tks[k] === '+') {
    // soma sem resultado no mesmo trecho é lista ("2 H2 + O2 no nível Y;", "2 ligações + 2 pares isolados,"), não conta;
    // com "=", seta ou outra fórmula depois da parcela é conta ou reação ("H2SO4 + 2 NaOH:", "H⁺ + OH⁻ forma H2O")
    let fecha = false;
    for (let j = k + 1; j < tks.length; j++) {
      if (/^(?:=|≈|→)$/.test(tks[j]) || (j > k + 1 && ehFormulaQuimica(tks[j]))) { fecha = true; break; }
      if (FIM_DE_TRECHO.test(tks[j])) break;
    }
    if (!fecha) return false;
  }
  if (tks[k] !== '=') return expressao;
  if (numero) return true;
  // "nome = operando operação ...": a operação vem logo depois do "=", antes de pontuação
  for (let j = k + 2; j < Math.min(tks.length, k + 9); j++) {
    if (OPERACAO.test(tks[j])) return true;
    if (tks[j] === '=' || FIM_DE_TRECHO.test(tks[j - 1])) return false;
  }
  return false;
}
// fórmula química ou esquema de reação: "H2O", "C8H16", "HOH", "R-C(OH)=CH-R'" (sem palavra minúscula comprida)
function ehFormulaQuimica(tk: string): boolean {
  const t = tk.replace(/[.,;:!?]+$/, '');
  if (!/^[A-Z][A-Za-z0-9()=≡'+⁺⁻²³-]*$/.test(t) || /[a-z]{3}/.test(t)) return false;
  return /\d/.test(t) || (t.match(/[A-Z]/g) || []).length >= 2;
}
function comecaComConta(s: string): boolean {
  const semFase = s.replace(/\s?\((?:aq|s|l|g|v)\)/g, '');
  // equação com seta entre fórmulas, em qualquer lugar ("B é consumido na etapa 2 (AY + B → AB + Y)…")
  const tks = semFase.split(/\s+/);
  for (let i = 1; i < tks.length - 1; i++) if (tks[i] === '→' && ehAtomo(tks[i - 1]) && ehAtomo(tks[i + 1])) return true;
  // "dá" no lugar da seta: fórmula até 4 palavras antes e fórmula logo depois (ou depois do nome: "dá etano C2H6")
  for (let i = 1; i < tks.length - 1; i++) {
    if (tks[i] !== 'dá') continue;
    const antes = tks.slice(Math.max(0, i - 4), i), depois = tks.slice(i + 1, i + 3);
    if (antes.some(ehFormulaQuimica) && depois.some(ehFormulaQuimica)) return true;
  }
  const t = semFase.replace(/\s\([^()]*\)/g, ' ').trim(); // comentário entre parênteses não conta
  if (cabecaDeConta(t)) return true;
  const rot = /^([^:]{1,40}):\s+(.+)$/.exec(t);
  if (!rot) return false;
  const pal = rot[1].trim().split(/\s+/);
  return pal.length <= 5 && !pal.some((w) => LIGACAO.test(w)) && !/[×÷+−=→]/.test(rot[1]) && cabecaDeConta(rot[2]);
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
  // fora de Matemática e Física, frase explicativa com poucas expressões no meio também é texto
  // (a não ser que a linha comece com uma conta ou tenha equação com seta: aí continua à mão)
  if (!calculo && !comecaComConta(t) && fraseComPoucaConta(t.replace(/\([^()]*\)/g, ' '))) return true;
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

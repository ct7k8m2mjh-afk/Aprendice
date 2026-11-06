/**
 * MOTOR DA RESOLUÇÃO ANIMADA (comando 20 do dono, 05/11/2026).
 *
 * Um único motor desenha toda resolução a partir dos dados (`res.passos[{faz, conta, porque}]` e `res.quadro[{linha,
 * nota, destaque}]` quando houver). Nada é feito à mão questão por questão.
 *
 * Esta parte é só lógica (sem DOM): lê cada linha da conta, quebra em termos (tokens), compara a linha anterior com a
 * seguinte e devolve um ROTEIRO: para cada termo da linha nova, de onde ele vem na linha anterior (fica, atravessa o
 * sinal de igual trocando de sinal, vai para o outro lado dividindo, viaja na multiplicação cruzada, nasce de uma conta
 * feita) e o que é riscado (cancelamento). Quem anima é `ui/motorAnima.ts`; quem desenha é `ui/ResolucaoAnimada.tsx`.
 *
 * Garantia (testada em `testes/motorConta.test.ts` com todas as resoluções do site): o texto de cada linha é o texto dos
 * dados, sem tirar nem pôr; o motor só decide COMO os termos chegam ao lugar. Quando não reconhece a transformação (ou
 * a conta feita não confere numericamente), a linha nova aparece escrita à mão (transição padrão).
 */
import { contaEhTexto, partesFracao } from './fracao';
import { ehFormulaQuimica } from './notacao';

/* ============================================================== tokens */

export type TipoTok = 'esp' | 'num' | 'var' | 'op' | 'rel' | 'seta' | 'abre' | 'fecha' | 'pont' | 'raiz' | 'frac' | 'nuc' | 'txt';
export interface Tok {
  k: TipoTok;
  /** texto exato do trecho nos dados (fração: o original com a barra, "140/35") */
  v: string;
  /** fração empilhada: numerador e denominador (texto e termos de cada um); sep: o sinal escrito ("/", " ÷ ");
   *  pn/pd: numerador/denominador entre parênteses nos dados (o layout tira, o texto guarda) */
  n?: string; d?: string; nt?: Tok[]; dt?: Tok[]; sep?: string; pn?: boolean; pd?: boolean;
  /** letra colada no coeficiente ("7a": o 7 e o a são termos separados, escritos sem espaço) */
  cola?: boolean;
}

const SOBRE = '⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺';
// expoente escrito com circunflexo ("10^−2", "2^4", "2^(1 + k)"): vai junto com o termo
const CIRC = String.raw`(?:\^\([^()\n]{1,30}\)|\^[−\-+]?[0-9a-zA-Z,]+[+−]?)?`;
const RE_TOK = new RegExp([
  String.raw`(?<esp>[\s  ]+)`,
  // número com milhar separado por espaço ("6 480", "1 000 000"), decimal com vírgula, fatorial e expoente
  String.raw`(?<num>\d{1,3}(?:[   ]\d{3})+(?![\d])(?:,\d+)?[${SOBRE}]*!?|\d+(?:[.,]\d+)*[${SOBRE}]*!?${CIRC})`,
  // variável com índice colado ("m0", "a1", "b21") é um termo só
  String.raw`(?<var>(?<![A-Za-z0-9])[a-zα-ω]\d{1,2}(?![\dA-Za-z#])${CIRC}|[A-Za-zÀ-ÖØ-öø-ÿα-ωΑ-ΩℓΔπθ∞μ][A-Za-zÀ-ÖØ-öø-ÿα-ωΑ-Ωℓμ₀-₉ₐ-ₜ_'′]*(?:_\{[^{}\n]{1,20}\})?[${SOBRE}]*${CIRC})`,
  String.raw`(?<raiz>[√∛])`,
  String.raw`(?<op>[+\-−×÷·*/±∓])`,
  String.raw`(?<rel>[=≈≅<>≤≥≠])`,
  String.raw`(?<seta>[→⇒⟹∴])`,
  String.raw`(?<abre>[(\[{])`,
  String.raw`(?<fecha>[)\]}][${SOBRE}]*${CIRC})`,
  String.raw`(?<pont>[,;:|])`,
  String.raw`(?<txt>[\s\S])`,
].join('|'), 'gu');

// fórmula química ("H2SO4", "CH(NH2)", "SO4^2−", "Cl−"): um termo só, para o índice e a carga saírem certos
const RE_FORM = /(?:[A-Z][a-z]?\d*|\((?:[A-Z][a-z]?\d*)+\)\d*)+(?:\^?\d?[+−-](?![A-Za-z0-9(]))?(?![A-Za-zÀ-ÿ0-9_^])/y;
function tokTexto(s: string, out: Tok[]) {
  RE_TOK.lastIndex = 0;
  let ant: Tok | null = null;
  for (;;) {
    const pos = RE_TOK.lastIndex;
    if (pos >= s.length) break;
    if (/[A-Z]/.test(s[pos]) && !(pos > 0 && /[A-Za-zÀ-ÿ0-9_]/.test(s[pos - 1]))) {
      RE_FORM.lastIndex = pos;
      const f = RE_FORM.exec(s);
      if (f && ehFormulaQuimica(f[0])) {
        const t: Tok = { k: 'var', v: f[0] };
        out.push(t); ant = t; RE_TOK.lastIndex = pos + f[0].length; continue;
      }
    }
    const m = RE_TOK.exec(s);
    if (!m) break;
    const g = m.groups || {};
    const k = (Object.keys(g).find((x) => g[x] !== undefined) || 'txt') as TipoTok;
    const t: Tok = { k, v: m[0] };
    // coeficiente colado na letra: "7a", "3ℓ", "2x²", "4π" (não "2ª", "3h" de hora é unidade e também cola)
    if (k === 'var' && ant && ant.k === 'num' && !/!$/.test(ant.v)) t.cola = true;
    out.push(t);
    ant = t;
  }
}

/** Quebra a linha em termos. `junta(tokeniza(s)) === s` sempre. */
export function tokeniza(linha: string): Tok[] {
  const out: Tok[] = [];
  for (const p of partesFracao(linha)) {
    if (p.t === 'txt') tokTexto(p.v, out);
    else if (p.t === 'frac') out.push({ k: 'frac', v: p.orig, n: p.n, d: p.d, nt: tokeniza(p.n), dt: tokeniza(p.d), sep: p.sep, pn: p.pn, pd: p.pd });
    else out.push({ k: 'nuc', v: p.orig });
  }
  return out;
}
export const junta = (ts: Tok[]) => ts.map((t) => t.v).join('');

/* ============================================================== números e contas */

const DIG_SOBRE: Record<string, string> = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-', '⁺': '' };
function separaExpoente(v: string): [string, string] {
  const m = new RegExp(`^(.*?)([${SOBRE}]*)$`, 'u').exec(v)!;
  return [m[1], [...m[2]].map((c) => DIG_SOBRE[c]).join('')];
}
/** "6 480" → 6480; "0,25" → 0.25; "1.250" → 1250. Sem expoente nem fatorial. */
export function valorNumero(s: string): number | null {
  let t = s.replace(/[   ]/g, '');
  if (!/^\d+(?:[.,]\d+)*$/.test(t)) return null;
  if (t.includes(',') && t.includes('.')) t = t.replace(/\./g, '').replace(',', '.');
  else if (t.includes(',')) { if ((t.match(/,/g) || []).length > 1) return null; t = t.replace(',', '.'); }
  else if (/^\d{1,3}(\.\d{3})+$/.test(t)) t = t.replace(/\./g, '');
  else if ((t.match(/\./g) || []).length > 1) return null;
  const v = Number(t);
  return Number.isFinite(v) ? v : null;
}
function casasDecimais(s: string): number {
  const m = /[.,](\d+)$/.exec(s.replace(/[   ]/g, ''));
  return m && !/^\d{1,3}(\.\d{3})+$/.test(s) ? m[1].length : 0;
}
function fatorial(n: number): number | null {
  if (!Number.isInteger(n) || n < 0 || n > 20) return null;
  let r = 1; for (let i = 2; i <= n; i++) r *= i; return r;
}
/** valor do termo-número (com expoente e fatorial): "2²" → 4, "3!" → 6 */
function valorTokNum(v: string): number | null {
  const c = v.indexOf('^');
  if (c > 0) {
    const b = valorTokNum(v.slice(0, c));
    const e = avalia(tokeniza(v.slice(c + 1).replace(/^\((.*)\)$/, '$1')));
    return b == null || e == null ? null : Math.pow(b, e);
  }
  let s = v, fat = false;
  if (s.endsWith('!')) { fat = true; s = s.slice(0, -1); }
  const [base, exp] = separaExpoente(s);
  let x = valorNumero(base);
  if (x == null) return null;
  if (exp) { const e = Number(exp); if (!Number.isFinite(e)) return null; x = Math.pow(x, e); }
  if (fat) x = fatorial(x);
  return x;
}

/** Avalia uma expressão só de números (sem letras). Devolve null se não for conta numérica completa. */
/**
 * Quantidade com nome: o que vem escrito depois do número ("36 dias", "4,86 g", "24,32 g/mol", "8 mol de H2O",
 * "1 930 C") é o nome da quantidade, não entra na conta. Coeficiente colado na letra ("7a") continua termo.
 */
const ehNome = (t: Tok) => t.k === 'var' && (UNIDADES.has(t.v) || /^[a-zà-ÿμµ]{2,}$/.test(t.v) || t.v === 'de' || /^[A-Z][a-z]?$/.test(t.v) && !t.cola || /\d/.test(t.v) && /^[A-Z]/.test(t.v));
export function semNomes(ts: Tok[]): Tok[] {
  const t = ts.filter((x) => x.k !== 'esp');
  const out: Tok[] = [];
  for (let i = 0; i < t.length; i++) {
    out.push(t[i]);
    if (t[i].k !== 'num') continue;
    let j = i + 1;
    while (j < t.length) {
      const x = t[j];
      if (ehNome(x) && !(x.cola && !UNIDADES.has(x.v)) && !(t[j + 1] && t[j + 1].k === 'abre')) { j++; continue; }
      // "g/mol", "mol·L⁻¹": barra ou ponto entre dois nomes
      if (x.k === 'op' && (x.v === '/' || x.v === '·') && j > i + 1 && t[j + 1] && ehNome(t[j + 1])) { j += 2; continue; }
      break;
    }
    i = j - 1;
  }
  return out;
}

export function avalia(ts: Tok[]): number | null {
  const t = semNomes(ts);
  let i = 0;
  const op = (...vs: string[]) => i < t.length && t[i].k === 'op' && vs.includes(t[i].v);
  function expr(): number | null {
    let a = termo(); if (a == null) return null;
    while (op('+', '−', '-')) { const s = t[i++].v; const b = termo(); if (b == null) return null; a = s === '+' ? a + b : a - b; }
    return a;
  }
  function termo(): number | null {
    let a = unario(); if (a == null) return null;
    for (;;) {
      if (op('×', '·', '*', '÷', '/')) {
        const s = t[i++].v; const b = unario(); if (b == null) return null;
        a = s === '÷' || s === '/' ? (b === 0 ? NaN : a / b) : a * b;
      } else if (i < t.length && (t[i].k === 'abre' || t[i].k === 'raiz') && i > 0 && (t[i - 1].k === 'fecha' || t[i - 1].k === 'num')) {
        const b = unario(); if (b == null) return null; a *= b; // 2(3 + 1), (a)(b), 2√3
      } else return Number.isFinite(a) ? a : null;
    }
  }
  function unario(): number | null {
    if (op('−', '-')) { i++; const a = unario(); return a == null ? null : -a; }
    if (op('+')) { i++; return unario(); }
    return atomo();
  }
  function atomo(): number | null {
    const x = t[i];
    if (!x) return null;
    if (x.k === 'num') { i++; return valorTokNum(x.v); }
    if (x.k === 'raiz') {
      i++; const a = atomo(); if (a == null || a < 0) return null;
      return x.v === '∛' ? Math.cbrt(a) : Math.sqrt(a);
    }
    if (x.k === 'frac') {
      i++;
      const n = avalia(tokeniza(x.n!)), d = avalia(tokeniza(x.d!));
      return n == null || d == null || d === 0 ? null : n / d;
    }
    if (x.k === 'abre' && x.v === '(') {
      i++; const a = expr(); if (a == null) return null;
      const f = t[i]; if (!f || f.k !== 'fecha' || !f.v.startsWith(')')) return null;
      i++;
      const [, exp] = separaExpoente(f.v);
      return exp ? Math.pow(a, Number(exp)) : a;
    }
    return null;
  }
  if (!t.length) return null;
  const r = expr();
  return i === t.length && r != null && Number.isFinite(r) ? r : null;
}

/** o valor escrito confere com a conta? Igual exato; com casas decimais escritas, aceita o arredondamento delas. */
function confere(v: number, escrito: Tok[], aprox: boolean): boolean {
  const ts = semNomes(escrito);
  let sinal = 1, k = 0;
  if (ts[0] && ts[0].k === 'op' && (ts[0].v === '−' || ts[0].v === '-')) { sinal = -1; k = 1; }
  else if (ts[0] && ts[0].k === 'op' && ts[0].v === '+') k = 1;
  if (ts.length !== k + 1) return false;
  const x = ts[k];
  let b: number | null; let dec = 0;
  if (x.k === 'num') { if (/[!⁰¹²³⁴⁵⁶⁷⁸⁹]/.test(x.v)) return false; b = valorNumero(x.v); dec = casasDecimais(x.v); }
  else if (x.k === 'frac') {
    // fração numérica que é a própria conta simplificada ("= 3/5")
    const n = avalia(tokeniza(x.n!)), d = avalia(tokeniza(x.d!));
    if (n == null || d == null || !d || valorNumero(x.n!.trim()) == null || valorNumero(x.d!.trim()) == null) return false;
    b = n / d;
  } else return false;
  if (b == null) return false;
  b *= sinal;
  const tol = dec > 0 || aprox ? 0.5 * Math.pow(10, -dec) + 1e-9 : 1e-9 * Math.max(1, Math.abs(b));
  return Math.abs(v - b) <= tol;
}

/* ============================================================== estrutura da conta */

/** endereço de um pedaço desenhado: termo i (e, numa fração, o numerador ou o denominador) */
export interface Ref { l: number; i: number; p?: 'n' | 'd'; s?: number }
const chaveRef = (i: number, p?: 'n' | 'd', s?: number) => (p ? (s != null ? `${i}:${p}:${s}` : `${i}:${p}`) : `${i}`);
/** pedaço de um termo: o termo i (numa fração, o numerador/denominador p, e nele o termo s) */
interface Slot { i: number; p?: 'n' | 'd'; s?: number }
const chaveSlot = (x: Slot) => chaveRef(x.i, x.p, x.s);
function tokSlot(ts: Tok[], x: Slot): Tok {
  const t = ts[x.i];
  if (!x.p) return t;
  if (x.s == null) return { k: 'num', v: x.p === 'n' ? t.n! : t.d! };
  return (x.p === 'n' ? t.nt! : t.dt!)[x.s];
}

const UNIDADES = new Set(['cm', 'm', 'km', 'mm', 'dm', 'cm²', 'm²', 'km²', 'mm²', 'dm²', 'cm³', 'm³', 'dm³', 'mm³', 'kg', 'g', 'mg', 't', 'L', 'mL', 'ml', 'l',
  'h', 'min', 's', 'dias', 'dia', 'anos', 'ano', 'meses', 'mês', 'reais', 'real', 'pessoas', 'graus', 'mol', 'J', 'kJ', 'W', 'kW', 'kWh', 'N', 'Pa', 'atm', 'K',
  'u', 'cal', 'kcal', 'unidades', 'litros', 'metros', 'km/h', 'm/s', 'cartas', 'alunos', 'termos', 'saltos', 'vezes', 'quadradinhos', 'cm²']);
const FUNCOES = new Set(['sen', 'cos', 'tg', 'tan', 'cotg', 'sec', 'cossec', 'log', 'ln', 'mdc', 'mmc', 'MDC', 'MMC', 'det', 'lim', 'máx', 'mín', 'max', 'min']);
/** palavra de texto no meio da conta ("ou", "logo", "saltos"): não é termo de equação */
function ehPalavra(t: Tok): boolean {
  if (t.k !== 'var') return false;
  const [b] = separaExpoente(t.v);
  if (FUNCOES.has(b)) return false;
  if (b === 'e' || b === 'é' || /^(ou|de|da|do|em|se|no|na|os|as)$/.test(b)) return true;
  // palavra de 3 letras ou mais com minúsculas ("saltos", "Área", "logo"); "SP", "PQRS", "ab", "xP" são nomes da conta
  return /^[A-Za-zÀ-ÿ]{3,}$/.test(b) && /[a-zà-ÿ]{2}/.test(b);
}
const ehSoma = (t: Tok) => t.k === 'op' && (t.v === '+' || t.v === '−' || t.v === '-');
const ehVezes = (t: Tok) => t.k === 'op' && (t.v === '×' || t.v === '·' || t.v === '*');
const ehDiv = (t: Tok) => t.k === 'op' && (t.v === '÷' || t.v === '/');
const negativo = (v: string) => v === '−' || v === '-';

interface Peca { slots: Slot[]; chave: string; op: Slot | null; tipo: 'mul' | 'div' | '+' | '−'; num: number | null; idx: number[] }

/** Lado (lista de índices sem espaço) em termos de soma. null se tiver ± ou parênteses desbalanceados. */
function termosSoma(ts: Tok[], idx: number[]): Peca[] | null {
  const out: Peca[] = [];
  let prof = 0, cur: number[] = [], sinal: '+' | '−' = '+', opI: number | null = null;
  const fecha = () => {
    if (!cur.length) return opI == null;
    out.push(peca(ts, cur, sinal, opI == null ? null : { i: opI }));
    cur = []; return true;
  };
  for (const i of idx) {
    const t = ts[i];
    if (t.k === 'op' && (t.v === '±' || t.v === '∓')) return null;
    if (t.k === 'abre') prof++;
    if (t.k === 'fecha') prof--;
    if (prof < 0) return null;
    if (prof === 0 && ehSoma(t) && !(cur.length && ts[cur[cur.length - 1]].k === 'op')) {
      if (!fecha()) return null;
      sinal = negativo(t.v) ? '−' : '+'; opI = i;
      continue;
    }
    cur.push(i);
  }
  if (prof !== 0) return null;
  if (!fecha()) return null;
  return out;
}
function peca(ts: Tok[], idx: number[], tipo: Peca['tipo'], op: Slot | null): Peca {
  // o grupo inteiro entre parênteses vale pelo de dentro na comparação ("(a + b)" é "a + b")
  // a unidade depois do número não entra na comparação ("7,0 mm" vale "7,0")
  const chave = idx.filter((i, k) => !(k > 0 && ts[i].k === 'var' && UNIDADES.has(ts[i].v) && ts[idx[k - 1]].k === 'num')).map((i) => ts[i].v).join('');
  const sem = /^\((.*)\)$/.test(chave) && parenteseExterno(ts, idx) ? chave.slice(1, -1) : chave;
  return { slots: idx.map((i) => ({ i })), chave: sem.replace(/-/g, '−'), op, tipo, num: avalia(idx.map((i) => ts[i])), idx };
}
function parenteseExterno(ts: Tok[], idx: number[]): boolean {
  if (idx.length < 2 || ts[idx[0]].k !== 'abre' || ts[idx[idx.length - 1]].v !== ')') return false;
  let p = 0;
  for (let k = 0; k < idx.length; k++) {
    const t = ts[idx[k]];
    if (t.k === 'abre') p++;
    if (t.k === 'fecha') p--;
    if (p === 0 && k < idx.length - 1) return false;
  }
  return true;
}

/** Um termo de soma em fatores (×, ÷, coeficiente colado, fração inteira vira numerador × e denominador ÷). */
function fatores(ts: Tok[], idx: number[]): Peca[] | null {
  const out: Peca[] = [];
  let prof = 0, cur: number[] = [], tipo: 'mul' | 'div' = 'mul', opI: number | null = null;
  const fecha = (): boolean => {
    if (!cur.length) return false;
    if (cur.length === 1 && ts[cur[0]].k === 'frac') {
      const t = ts[cur[0]], fi = cur[0];
      const mk = (p: 'n' | 'd', tp: 'mul' | 'div'): Peca[] => {
        const s = p === 'n' ? t.n! : t.d!;
        const sub = p === 'n' ? t.nt! : t.dt!;
        const virar = (x: 'mul' | 'div'): 'mul' | 'div' => {
          const y = tp === 'div' ? (x === 'mul' ? 'div' : 'mul') : x;
          return tipo === 'div' ? (y === 'mul' ? 'div' : 'mul') : y;
        };
        // os fatores de dentro do numerador/denominador ("18·(15 + 16 + 17)" sobre "18·3"): cada um pode cancelar
        const dentro = sub.length ? fatores(sub, semEsp(sub, 0, sub.length)) : null;
        if (dentro && dentro.length > 1) {
          return dentro.map((pc, k) => ({
            ...pc, tipo: virar(pc.tipo as 'mul' | 'div'),
            slots: pc.slots.map((x) => ({ i: fi, p, s: x.i })),
            op: pc.op ? { i: fi, p, s: pc.op.i } : (k === 0 && p === 'n' && opI != null ? { i: opI } : null),
          }));
        }
        const ch = sub.length ? peca(sub, semEsp(sub, 0, sub.length), 'mul', null).chave : s;
        return [{ slots: [{ i: fi, p }], chave: ch.replace(/^\((.*)\)$/, '$1').replace(/\s+/g, '').replace(/-/g, '−'), op: p === 'n' && opI != null ? { i: opI } : null, tipo: virar('mul'), num: avalia(tokeniza(s)), idx: [fi] }];
      };
      out.push(...mk('n', 'mul'), ...mk('d', 'div'));
    } else {
      const pc = peca(ts, cur, tipo, opI == null ? null : { i: opI });
      pc.chave = pc.chave.replace(/\s+/g, '');
      out.push(pc);
    }
    cur = []; return true;
  };
  for (const i of idx) {
    const t = ts[i];
    if (prof === 0 && (ehVezes(t) || ehDiv(t))) {
      if (!fecha()) return null;
      tipo = ehDiv(t) ? 'div' : 'mul'; opI = i; continue;
    }
    if (prof === 0 && cur.length && (t.cola || (t.k === 'abre' && ts[cur[cur.length - 1]].k === 'fecha'))) {
      if (!fecha()) return null;
      tipo = 'mul'; opI = null;
    }
    if (t.k === 'abre') prof++;
    if (t.k === 'fecha') prof--;
    cur.push(i);
  }
  if (prof !== 0 || !fecha()) return null;
  return out;
}

/* ============================================================== transições */

export type TipoTransicao = 'troca-lado' | 'divide' | 'multiplica' | 'cruzada' | 'cancela' | 'resultado' | 'reordena';
export interface Entrada {
  /** de onde vem (um pedaço: o termo viaja; vários: os pedaços se juntam no resultado) */
  de: Ref[];
  /** o termo atravessa o sinal de igual (vai em arco, na cor da caneta) */
  atravessa?: boolean;
  /** o que estava escrito antes no lugar deste sinal ("+" que vira "−", "×" que vira "÷") */
  antes?: string;
}
export interface Plano {
  tipo: TipoTransicao;
  /** chave "i" ou "i:n"/"i:d" (termo da linha nova) → de onde vem */
  entradas: Record<string, Entrada>;
  /** pedaços da linha de antes que são riscados (cancelam) */
  riscos: Ref[];
  /** faixa de termos da linha nova coberta por este plano [ini, fim) */
  ini: number; fim: number;
}

interface Equacao { L: number[]; R: number[]; eq: number }
interface Lado { toks: Tok[]; l: number }

function semEsp(ts: Tok[], a: number, b: number): number[] {
  const r: number[] = [];
  for (let i = a; i < b; i++) if (ts[i].k !== 'esp') r.push(i);
  return r;
}

/** membros de uma igualdade (separados por "=" no nível de fora); null se houver outra relação (≤, <) */
function membros(ts: Tok[], idx: number[]): { m: number[][]; rel: number[] } | null {
  const m: number[][] = [[]]; const rel: number[] = [];
  let prof = 0;
  for (const i of idx) {
    const t = ts[i];
    if (t.k === 'abre') prof++;
    if (t.k === 'fecha') prof--;
    if (prof === 0 && t.k === 'rel') {
      if (t.v !== '=' && t.v !== '≈') return null;
      rel.push(i); m.push([]); continue;
    }
    m[m.length - 1].push(i);
  }
  if (m.some((x) => !x.length)) return null;
  return { m, rel };
}

const temPalavra = (ts: Tok[], idx: number[]) => idx.some((i) => ehPalavra(ts[i]) || ts[i].k === 'txt' || ts[i].k === 'nuc' || ts[i].k === 'pont');
/** tira a unidade do fim de um membro ("8 cm" → "8"): a unidade nova é só escrita */
function tiraUnidade(ts: Tok[], idx: number[]): [number[], number[]] {
  // só depois de um número ("8 cm", "24 g"): "p + g" continua com o g
  const k = idx.length;
  if (k > 1 && ts[idx[k - 1]].k === 'var' && UNIDADES.has(ts[idx[k - 1]].v) && ts[idx[k - 2]].k === 'num') return [idx.slice(0, k - 1), [idx[k - 1]]];
  return [idx, []];
}

const refDe = (l: number, s: Slot): Ref => (s.p ? (s.s != null ? { l, i: s.i, p: s.p, s: s.s } : { l, i: s.i, p: s.p }) : { l, i: s.i });

/**
 * Compara duas equações (lado esquerdo = lado direito) e diz como os termos se moveram.
 * A: equação de antes (termos `a.toks`, linha `a.l`); B: equação nova (linha `b.l`).
 */
function planoEquacao(a: Lado, ea: Equacao, b: Lado, eb: Equacao): Omit<Plano, 'ini' | 'fim'> | null {
  let [bL] = tiraUnidade(b.toks, eb.L); const [bR] = tiraUnidade(b.toks, eb.R);
  let [aL] = tiraUnidade(a.toks, ea.L), [aR] = tiraUnidade(a.toks, ea.R); // eslint-disable-line prefer-const
  // nome por extenso igual nos dois ("média = …" → "média = …"): é um rótulo; só o lado de lá muda
  const texto = (ts: Tok[], ix: number[]) => ix.map((i) => ts[i].v).join(' ');
  let rotulo: [number[], number[]] | null = null;
  if (temPalavra(a.toks, aL) && texto(a.toks, aL) === texto(b.toks, bL)) { rotulo = [aL, bL]; aL = []; bL = []; }
  if ([aL, aR].some((x) => temPalavra(a.toks, x)) || [bL, bR].some((x) => temPalavra(b.toks, x))) return null;
  // os dois lados também podem trocar de lugar (a = b é b = a): "7,0/f = 7/800" → "7 · f = 7,0 · 800"
  const p = planoSoma(a, aL, aR, b, bL, bR) || planoProduto(a, aL, aR, b, bL, bR)
    || (rotulo ? null : planoProduto(a, aL, aR, b, bR, bL));
  if (p && rotulo) rotulo[1].forEach((j, k) => { p.entradas[chaveRef(j)] = { de: [{ l: a.l, i: rotulo![0][k] }] }; });
  // o sinal de igual fica onde está (é a âncora: os termos passam por cima dele)
  if (p) p.entradas[chaveRef(eb.eq)] = { de: [{ l: a.l, i: ea.eq }] };
  return p;
}

function planoSoma(a: Lado, aL: number[], aR: number[], b: Lado, bL: number[], bR: number[]): Omit<Plano, 'ini' | 'fim'> | null {
  const tA = [termosSoma(a.toks, aL), termosSoma(a.toks, aR)], tB = [termosSoma(b.toks, bL), termosSoma(b.toks, bR)];
  if (tA.some((x) => !x) || tB.some((x) => !x)) return null;
  const A = (tA as Peca[][]).flatMap((ts, lado) => ts.map((p) => ({ p, lado }))), B = (tB as Peca[][]).flatMap((ts, lado) => ts.map((p) => ({ p, lado })));
  if (A.length < 2 && B.length < 2) return null;
  const usado = new Set<number>(), par = new Map<number, number>();
  // mesmo lado e mesmo sinal primeiro; depois o outro lado com o sinal trocado
  for (const fase of [0, 1]) {
    B.forEach((x, j) => {
      if (par.has(j)) return;
      const k = A.findIndex((y, i) => !usado.has(i) && y.p.chave === x.p.chave &&
        (fase === 0 ? y.lado === x.lado && y.p.tipo === x.p.tipo : y.lado !== x.lado && y.p.tipo !== x.p.tipo));
      if (k >= 0) { usado.add(k); par.set(j, k); }
    });
  }
  const riscos: Ref[] = [];
  const soltosA = A.map((_, i) => i).filter((i) => !usado.has(i));
  // cancelamento: +k e −k do mesmo lado, ou o mesmo termo (mesmo sinal) dos dois lados
  const cancelados = new Set<number>();
  for (const i of soltosA) for (const k of soltosA) {
    if (i >= k || cancelados.has(i) || cancelados.has(k)) continue;
    const x = A[i], y = A[k];
    if (x.p.chave !== y.p.chave) continue;
    if ((x.lado === y.lado && x.p.tipo !== y.p.tipo) || (x.lado !== y.lado && x.p.tipo === y.p.tipo)) { cancelados.add(i); cancelados.add(k); }
  }
  for (const i of cancelados) for (const s of pedacosCom(A[i].p)) riscos.push(refDe(a.l, s));
  const restoA = soltosA.filter((i) => !cancelados.has(i) && A[i].p.chave !== '0');
  const soltosB = B.map((_, j) => j).filter((j) => !par.has(j) && B[j].p.chave !== '0');
  const entradas: Record<string, Entrada> = {};
  let atravessouNaConta = false;
  // conta feita junto: o que sobrou de A (números) vira um número só num dos lados de B
  if (restoA.length || soltosB.length) {
    // o que sobrou se anula numericamente (soma zero, de lados trocados): riscado
    if (!soltosB.length) {
      let soma = 0;
      for (const i of restoA) { const x = A[i]; if (x.p.num == null) return null; soma += (x.p.tipo === '−' ? -1 : 1) * (x.lado === 0 ? 1 : -1) * x.p.num; }
      if (Math.abs(soma) > 1e-9) return null;
      for (const i of restoA) for (const z of pedacosCom(A[i].p)) riscos.push(refDe(a.l, z));
      restoA.length = 0;
    } else if (soltosB.length !== 1 || !restoA.length) return null;
  }
  if (soltosB.length) {
    const j = soltosB[0], lado = B[j].lado;
    let soma = 0;
    for (const i of restoA) {
      const x = A[i]; if (x.p.num == null) return null;
      const s = x.p.tipo === '−' ? -1 : 1;
      soma += x.lado === lado ? s * x.p.num : -s * x.p.num;
    }
    const sB = B[j].p.tipo === '−' ? -1 : 1;
    if (B[j].p.num == null || Math.abs(soma - sB * B[j].p.num) > 1e-9 * Math.max(1, Math.abs(soma))) return null;
    const de = restoA.flatMap((i) => pedacosCom(A[i].p).map((s) => refDe(a.l, s)));
    const cruza = restoA.some((i) => A[i].lado !== lado) || undefined;
    if (cruza) atravessouNaConta = true;
    for (const s of B[j].p.slots) entradas[chaveSlot(s)] = { de, atravessa: cruza };
    if (B[j].p.op != null) entradas[chaveSlot(B[j].p.op)] = { de, atravessa: cruza };
  }
  let atravessou = 0, mudouOrdem = false;
  for (const [j, i] of par) {
    const x = B[j], y = A[i], cruza = x.lado !== y.lado;
    if (cruza) atravessou++;
    liga(entradas, a.l, x.p, y.p, cruza);
    if (x.p.op != null) {
      const antes = y.p.op != null ? tokSlot(a.toks, y.p.op).v : '+';
      const de = y.p.op != null ? [refDe(a.l, y.p.op)] : [refDe(a.l, y.p.slots[0])];
      entradas[chaveSlot(x.p.op)] = { de, atravessa: cruza || undefined, antes: antes !== tokSlot(b.toks, x.p.op).v ? antes : undefined };
    }
  }
  // posições mudaram dentro do mesmo lado? (comparando a ordem dos pares)
  const ordem = [...par.entries()].filter(([j, i]) => B[j].lado === A[i].lado).sort((x, y) => x[0] - y[0]).map(([, i]) => i);
  if (ordem.some((v, k) => k > 0 && v < ordem[k - 1])) mudouOrdem = true;
  const conta = Object.keys(entradas).some((k) => entradas[k].de.length > 1);
  if (!atravessou && !riscos.length && !conta && !mudouOrdem) return null;
  const tipo: TipoTransicao = atravessou || atravessouNaConta ? 'troca-lado' : riscos.length ? 'cancela' : conta ? 'resultado' : 'reordena';
  return { tipo, entradas, riscos };
}

/** liga os pedaços de um termo da linha nova aos do termo igual da linha de antes */
function liga(entradas: Record<string, Entrada>, l: number, x: Peca, y: Peca, cruza: boolean) {
  const mesmo = x.slots.length === y.slots.length;
  x.slots.forEach((s, k) => {
    entradas[chaveSlot(s)] = { de: mesmo ? [refDe(l, y.slots[k])] : y.slots.map((z) => refDe(l, z)), atravessa: cruza || undefined };
  });
}

/** os pedaços de um termo, com o sinal que o acompanha */
function pedacosCom(p: Peca): Slot[] {
  return p.op != null ? [p.op, ...p.slots] : p.slots;
}

function planoProduto(a: Lado, aL: number[], aR: number[], b: Lado, bL: number[], bR: number[]): Omit<Plano, 'ini' | 'fim'> | null {
  const umTermo = (ts: Tok[], idx: number[]): Peca[] | null => {
    if (!idx.length) return [];
    const t = termosSoma(ts, idx);
    if (!t) return null;
    if (t.length === 1 && t[0].tipo === '+' && t[0].op == null) return fatores(ts, idx);
    // lado com vários termos vale como um fator só ("a + b")
    const p = peca(ts, idx, 'mul', null); p.chave = p.chave.replace(/\s+/g, '');
    return [p];
  };
  const fA = [umTermo(a.toks, aL), umTermo(a.toks, aR)], fB = [umTermo(b.toks, bL), umTermo(b.toks, bR)];
  if (fA.some((x) => !x) || fB.some((x) => !x)) return null;
  const A = (fA as Peca[][]).flatMap((ts, lado) => ts.map((p) => ({ p, lado }))), B = (fB as Peca[][]).flatMap((ts, lado) => ts.map((p) => ({ p, lado })));
  if (A.length < 3 && B.length < 3) return null;
  const usado = new Set<number>(), par = new Map<number, number>();
  for (const fase of [0, 1]) {
    B.forEach((x, j) => {
      if (par.has(j)) return;
      const k = A.findIndex((y, i) => !usado.has(i) && y.p.chave === x.p.chave &&
        (fase === 0 ? y.lado === x.lado && y.p.tipo === x.p.tipo : y.lado !== x.lado && y.p.tipo !== x.p.tipo));
      if (k >= 0) { usado.add(k); par.set(j, k); }
    });
  }
  const riscos: Ref[] = [];
  const soltosA = A.map((_, i) => i).filter((i) => !usado.has(i));
  const cancelados = new Set<number>();
  for (const i of soltosA) for (const k of soltosA) {
    if (i >= k || cancelados.has(i) || cancelados.has(k)) continue;
    const x = A[i], y = A[k];
    if (x.p.chave !== y.p.chave) continue;
    if ((x.lado === y.lado && x.p.tipo !== y.p.tipo) || (x.lado !== y.lado && x.p.tipo === y.p.tipo)) { cancelados.add(i); cancelados.add(k); }
  }
  for (const i of cancelados) for (const s of A[i].p.slots) riscos.push(refDe(a.l, s));
  const restoA = soltosA.filter((i) => !cancelados.has(i) && A[i].p.chave !== '1');
  // um "1" novo só pode nascer como numerador ("AB ÷ AE = 1 ÷ 4", "a = 1"); "1 × 7 × 6" no lugar de "8 × 7 × 6" é outro caso, não conta
  for (let j = 0; j < B.length; j++) {
    if (par.has(j) || B[j].p.chave !== '1') continue;
    if (B.some((x, k) => k !== j && x.lado === B[j].lado && x.p.tipo === 'mul')) return null;
  }
  const soltosB = B.map((_, j) => j).filter((j) => !par.has(j) && B[j].p.chave !== '1');
  const entradas: Record<string, Entrada> = {};
  let atravessouNaConta = false, viraDivConta = 0, viraMulConta = 0;
  const ladosQueCruzam = new Set<number>();
  if (restoA.length || soltosB.length) {
    // o que sobrou se anula numericamente (produto 1: "7 · f = 7,0 · 800" → "f = 800"): riscado
    if (!soltosB.length) {
      let v = 1;
      for (const i of restoA) { const x = A[i]; if (x.p.num == null || !x.p.num) return null; v *= ((x.p.tipo === 'mul') === (x.lado === 0)) ? x.p.num : 1 / x.p.num; }
      if (Math.abs(v - 1) > 1e-9) return null;
      for (const i of restoA) for (const z of A[i].p.slots) riscos.push(refDe(a.l, z));
      restoA.length = 0;
    } else if (soltosB.length !== 1 || !restoA.length) return null;
  }
  if (soltosB.length) {
    const j = soltosB[0], lado = B[j].lado;
    let v = 1;
    for (const i of restoA) {
      const x = A[i]; if (x.p.num == null || x.p.num === 0) return null;
      const mul = (x.p.tipo === 'mul') === (x.lado === lado);
      v = mul ? v * x.p.num : v / x.p.num;
    }
    const y = B[j].p; if (y.num == null) return null;
    const alvo = y.tipo === 'div' ? 1 / y.num : y.num;
    const dec = casasDecimais(y.slots.map((s) => (s.p && s.s == null ? '' : tokSlot(b.toks, s).v)).join(''));
    if (Math.abs(v - alvo) > (dec ? 0.5 * Math.pow(10, -dec) : 1e-9 * Math.max(1, Math.abs(alvo)))) return null;
    const de = restoA.flatMap((i) => pedacosCom(A[i].p).map((s) => refDe(a.l, s)));
    const cruza = restoA.filter((i) => A[i].lado !== lado);
    if (cruza.length) { atravessouNaConta = true; for (const i of cruza) { ladosQueCruzam.add(A[i].lado); if (A[i].p.tipo === 'mul') viraDivConta++; else viraMulConta++; } }
    for (const s of y.slots) entradas[chaveSlot(s)] = { de, atravessa: cruza.length > 0 || undefined };
    if (y.op != null) entradas[chaveSlot(y.op)] = { de, atravessa: cruza.length > 0 || undefined };
  }
  let atravessou = 0, viraDiv = 0, viraMul = 0;
  for (const [j, i] of par) {
    const x = B[j], y = A[i], cruza = x.lado !== y.lado;
    if (cruza) { atravessou++; ladosQueCruzam.add(y.lado); if (x.p.tipo === 'div') viraDiv++; else viraMul++; }
    liga(entradas, a.l, x.p, y.p, cruza);
    if (x.p.op != null) {
      const antes = y.p.op != null ? tokSlot(a.toks, y.p.op).v : '×';
      const de = y.p.op != null ? [refDe(a.l, y.p.op)] : [refDe(a.l, y.p.slots[0])];
      const vb = tokSlot(b.toks, x.p.op).v;
      entradas[chaveSlot(x.p.op)] = { de, atravessa: cruza || undefined, antes: (ehDiv({ k: 'op', v: antes }) !== ehDiv({ k: 'op', v: vb })) ? antes : undefined };
    }
  }
  const conta = Object.keys(entradas).some((k) => entradas[k].de.length > 1);
  if (!atravessou && !riscos.length && !conta) return null;
  const fracNosDois = [aL, aR].every((lado) => lado.some((i) => a.toks[i].k === 'frac' || ehDiv(a.toks[i])));
  const tipo: TipoTransicao = ladosQueCruzam.size === 2 && fracNosDois ? 'cruzada'
    : atravessou || atravessouNaConta ? (viraDiv + viraDivConta >= viraMul + viraMulConta ? 'divide' : 'multiplica') : riscos.length ? 'cancela' : 'resultado';
  return { tipo, entradas, riscos };
}

/** "a operação foi feita": prefixo e sufixo iguais, o meio de A é conta numérica e o meio de B é o valor dela */
function planoResultado(a: Lado, ia: number[], b: Lado, ib: number[], aprox: boolean): Omit<Plano, 'ini' | 'fim'> | null {
  // unidade nova no fim do resultado ("= 6 cm") é só escrita
  if (!(a.toks[ia[ia.length - 1]].k === 'var' && UNIDADES.has(a.toks[ia[ia.length - 1]].v))) ib = tiraUnidade(b.toks, ib)[0];
  const A = ia.map((i) => a.toks[i]), B = ib.map((i) => b.toks[i]);
  let p = 0;
  while (p < A.length && p < B.length && A[p].v === B[p].v) p++;
  let s = 0;
  while (s < A.length - p && s < B.length - p && A[A.length - 1 - s].v === B[B.length - 1 - s].v) s++;
  // o resultado pode ser igual a um pedaço da conta ("8 − 4 = 4", "7 · 2 ÷ 2 = 7"): devolve o que for preciso ao meio
  const bom = () => B.length - s - p > 0 && (A.length - s - p >= 2 || (A.length - s - p === 1 && A[p].k === 'frac')) && A[p].k !== 'op' && A[A.length - s - 1].k !== 'op';
  while (!bom() && (s > 0 || p > 0)) { if (s > 0) s--; else p--; }
  const mA = A.slice(p, A.length - s), mB = B.slice(p, B.length - s);
  if ((mA.length < 2 && !(mA.length === 1 && mA[0].k === 'frac')) || !mB.length || mA[0].k === 'op' || mA[mA.length - 1].k === 'op') return null;
  const v = avalia(mA);
  if (v == null || !confere(v, mB, aprox)) return null;
  // o meio tem de ser uma conta inteira dentro da expressão (precedência): 10 − 3 + 2 não vira 10 − 5
  const antes = A[p - 1], depois = A[A.length - s];
  const somaFora = topoTem(mA, ehSoma);
  if (antes && (antes.k === 'op' || antes.k === 'raiz')) {
    if (antes.k === 'raiz' && !parenteseExterno(mA, mA.map((_, i) => i))) return null;
    if (somaFora && (negativo(antes.v) || ehVezes(antes) || ehDiv(antes))) return null;
    if (!somaFora && ehDiv(antes)) return null;
  }
  if (antes && (antes.k === 'num' || antes.k === 'var' || antes.k === 'fecha')) return null;
  if (depois) {
    if (/^[⁰¹²³⁴⁵⁶⁷⁸⁹]/.test(depois.v)) return null;
    if (depois.k === 'fecha' && /[⁰¹²³⁴⁵⁶⁷⁸⁹]/.test(depois.v)) return null;
    if (somaFora && (ehVezes(depois) || ehDiv(depois) || depois.k === 'abre')) return null;
    if (depois.k === 'num' || depois.k === 'var' || depois.k === 'frac') return null;
  }
  const entradas: Record<string, Entrada> = {};
  const de = ia.slice(p, A.length - s).map((i) => ({ l: a.l, i }));
  // só o número (com o sinal) nasce da conta; o nome da quantidade depois dele ("kcal/mol", "de CO2") é escrito
  const meio = ib.slice(p, B.length - s);
  const kNum = meio.findIndex((i) => b.toks[i].k === 'num' || b.toks[i].k === 'frac');
  meio.slice(0, kNum + 1).forEach((i) => { entradas[chaveRef(i)] = { de }; });
  // o que fica igual escorrega para o lugar novo
  for (let k = 0; k < p; k++) entradas[chaveRef(ib[k])] = { de: [{ l: a.l, i: ia[k] }] };
  for (let k = 0; k < s; k++) entradas[chaveRef(ib[B.length - 1 - k])] = { de: [{ l: a.l, i: ia[A.length - 1 - k] }] };
  return { tipo: 'resultado', entradas, riscos: [] };
}
function topoTem(ts: Tok[], f: (t: Tok) => boolean): boolean {
  let p = 0;
  for (let k = 0; k < ts.length; k++) {
    const t = ts[k];
    if (t.k === 'abre') p++;
    if (t.k === 'fecha') p--;
    if (p === 0 && k > 0 && f(t) && ts[k - 1].k !== 'op') return true;
  }
  return false;
}

/* ============================================================== linhas e segmentos */

interface Segmento { ini: number; fim: number }
/** trechos da linha separados por seta ("A → B"); cada um pode ter uma igualdade */
function segmentos(ts: Tok[]): Segmento[] {
  const out: Segmento[] = [];
  let ini = 0, prof = 0;
  ts.forEach((t, i) => {
    if (t.k === 'abre') prof++;
    if (t.k === 'fecha') prof--;
    if (t.k === 'seta' && prof <= 0) { out.push({ ini, fim: i }); ini = i + 1; }
  });
  out.push({ ini, fim: ts.length });
  return out;
}
/** a zona de conta de um trecho: depois do último rótulo ("r = 4: …", "a, b") para quem vem antes; antes do primeiro para quem vem depois */
function zona(ts: Tok[], sg: Segmento, lado: 'fim' | 'ini'): number[] {
  const idx = semEsp(ts, sg.ini, sg.fim);
  let prof = 0; const cortes: number[] = [];
  idx.forEach((i, k) => {
    const t = ts[i];
    if (t.k === 'abre') prof++;
    if (t.k === 'fecha') prof--;
    // rótulo, lista e conjunção separam contas ("r = 4: …", "25 − 20 = 5 e 30 − 25 = 5", "…, logo Z = 19")
    if (prof === 0 && (t.k === 'pont' || (t.k === 'var' && /^(e|ou|logo|então|portanto|assim)$/.test(t.v)))) cortes.push(k);
  });
  if (!cortes.length) return idx;
  return lado === 'fim' ? idx.slice(cortes[cortes.length - 1] + 1) : idx.slice(0, cortes[0]);
}

/* ============================================================== roteiro */

export interface LinhaRot {
  texto: string;
  toks: Tok[];
  /** conta à mão (Caveat) ou texto (trecho, frase) */
  conta: boolean;
  nota?: string;
  /** faixa de caracteres marcada com o marca-texto (termo-chave ou resultado) */
  marca?: [number, number];
  /** transições que trazem termos para esta linha, em ordem */
  planos: Plano[];
  /** processo desenhado (Biologia, Química, Física, texto): fluxo, reação, cadeia, pares, contraste */
  diagrama?: Diagrama;
}

/**
 * LINGUAGEM DE PASSOS que o motor desenha para "o que acontece" (CLAUDE.md: Biologia e Química — processo, reação,
 * estrutura, fluxo), lida do próprio texto do passo, sem desenho feito à mão por questão:
 * - fluxo     "zigoto → mitoses → células somáticas": etapas que acendem em sequência, com a seta desenhada entre elas;
 * - reação    "aminoácido + aminoácido → peptídeo + água", "H2SO4 → 2 H+ + SO4^2−": os reagentes se juntam e viram
 *             os produtos do outro lado da seta;
 * - cadeia    "HS–CH2–CH2–CH(NH2)–COOH", "algas – nutrientes – amensalismo": os grupos entram um a um, ligados;
 * - pares     "algas: 0 | peixes: −", "esporófito = 2n | gametófito = n": cada rótulo recebe o seu valor;
 * - contraste "genes ativados × genes inativados": um de cada lado, frente a frente;
 * - etapas    explicação em várias frases ("O vírus se liga… Libera o RNA… Replica…"): cada etapa acende em sequência,
 *             ligada à anterior por um fio.
 * As peças cobrem o texto inteiro, na ordem (o texto desenhado é o dos dados).
 */
export type PapelPeca = 'item' | 'seta' | 'mais' | 'liga' | 'div' | 'rotulo' | 'valor' | 'vs' | 'txt';
export interface Diagrama { tipo: 'fluxo' | 'reacao' | 'cadeia' | 'pares' | 'contraste' | 'etapas'; pecas: { ini: number; fim: number; papel: PapelPeca; lado?: 0 | 1 }[] }

/** quebra no nível de fora (fora de parênteses e aspas) */
function cortes(s: string, re: RegExp): [number, number][] {
  const out: [number, number][] = [];
  let prof = 0, aspas = false;
  const r = new RegExp(re.source, 'g');
  const prof_em: number[] = [];
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '"' || c === '“' || c === '”') aspas = !aspas;
    if (c === '(' || c === '[') prof++;
    if (c === ')' || c === ']') prof--;
    prof_em.push(aspas ? 99 : prof);
  }
  for (let m = r.exec(s); m; m = r.exec(s)) if (!prof_em[m.index]) out.push([m.index, m.index + m[0].length]);
  return out;
}
function pecasDe(s: string, seps: [number, number][], papelSep: PapelPeca, papelItem: PapelPeca = 'item'): Diagrama['pecas'] {
  const out: Diagrama['pecas'] = [];
  let ult = 0;
  for (const [a, b] of seps) { out.push({ ini: ult, fim: a, papel: papelItem }); out.push({ ini: a, fim: b, papel: papelSep }); ult = b; }
  out.push({ ini: ult, fim: s.length, papel: papelItem });
  return out;
}
const palavras = (x: string) => x.trim().split(/\s+/).filter(Boolean).length;

export function diagrama(s: string, conta: boolean): Diagrama | undefined {
  if (/^["“]/.test(s.trim())) return undefined;
  if (s.length > 140) return conta ? undefined : etapas(s);
  // rótulo curto no começo ("inversa: C + D → A + B")
  const rot = /^([^:→=|]{1,24}):\s+(?=\S)/.exec(s);
  const corpo0 = rot && /→|⇒/.test(s.slice(rot[0].length)) ? rot[0].length : 0;
  const corpo = s.slice(corpo0);
  const desloca = (ps: Diagrama['pecas']) => ps.map((p) => ({ ...p, ini: p.ini + corpo0, fim: p.fim + corpo0 }));
  const comRotulo = (ps: Diagrama['pecas']): Diagrama['pecas'] => (corpo0 ? [{ ini: 0, fim: corpo0, papel: 'rotulo' as PapelPeca }, ...desloca(ps)] : ps);
  // cadeia carbônica escrita com traços ("HS–CH2–CH2–CH(NH2)–COOH", "CH3−CO−CH2")
  const lig = cortes(s, /[–−](?=[A-Z])/);
  if (lig.length >= 2 && !/\s/.test(s.trim())) return { tipo: 'cadeia', pecas: pecasDe(s, lig, 'liga') };

  // 1) seta: fluxo ou reação (só se nenhum trecho for conta com "=" nem frase comprida)
  const setas = cortes(corpo, /\s*(?:→|⇒)\s*/);
  if (setas.length) {
    const ps = pecasDe(corpo, setas, 'seta');
    const itens = ps.filter((p) => p.papel === 'item').map((p) => corpo.slice(p.ini, p.fim));
    if (itens.some((x) => !x.trim() || palavras(x) > 7 || /=|:|;|\|/.test(x))) return undefined;
    const temMais = itens.some((x) => / \+ /.test(x));
    if (!temMais) return { tipo: 'fluxo', pecas: comRotulo(ps) };
    // reação: os termos de cada lado separados por " + "
    const out: Diagrama['pecas'] = [];
    let lado: 0 | 1 = 0;
    for (const p of ps) {
      if (p.papel === 'seta') { out.push(p); lado = 1; continue; }
      const t = corpo.slice(p.ini, p.fim);
      const mais = cortes(t, / \+ /);
      for (const q of pecasDe(t, mais, 'mais')) out.push({ ini: q.ini + p.ini, fim: q.fim + p.ini, papel: q.papel, lado });
    }
    if (setas.length !== 1) return { tipo: 'fluxo', pecas: comRotulo(ps) };
    return { tipo: 'reacao', pecas: comRotulo(out) };
  }

  if (conta) return undefined;
  // 2) pares rótulo: valor (separados por "|" ou ";")
  const barras = cortes(s, /\s*[|;]\s*/);
  if (barras.length) {
    const ps = pecasDe(s, barras, 'div');
    const itens = ps.filter((p) => p.papel === 'item');
    if (itens.every((p) => /^[^:=]{1,40}(?::|=)\s*\S/.test(s.slice(p.ini, p.fim)) && palavras(s.slice(p.ini, p.fim)) <= 8)) {
      const out: Diagrama['pecas'] = [];
      for (const p of ps) {
        if (p.papel !== 'item') { out.push(p); continue; }
        const t = s.slice(p.ini, p.fim);
        const m = /^([^:=]{1,40}(?::|=)\s*)(.*)$/.exec(t)!;
        out.push({ ini: p.ini, fim: p.ini + m[1].length, papel: 'rotulo' }, { ini: p.ini + m[1].length, fim: p.fim, papel: 'valor' });
      }
      return { tipo: 'pares', pecas: out };
    }
    return undefined;
  }
  // 3) cadeia com traço ("algas – excesso de nutrientes – amensalismo")
  const tracos = cortes(s, /\s+–\s+/);
  if (tracos.length >= 1 && pecasDe(s, tracos, 'liga').every((p) => p.papel !== 'item' || palavras(s.slice(p.ini, p.fim)) <= 6)) return { tipo: 'cadeia', pecas: pecasDe(s, tracos, 'liga') };
  // 4) contraste "X × Y"
  const vs = cortes(s, /\s+×\s+/);
  if (vs.length === 1) {
    const ps = pecasDe(s, vs, 'vs');
    if (ps.every((p) => p.papel !== 'item' || (palavras(s.slice(p.ini, p.fim)) <= 6 && /[A-Za-zÀ-ÿ]{3}/.test(s.slice(p.ini, p.fim))))) return { tipo: 'contraste', pecas: ps.map((p, k) => (p.papel === 'item' ? { ...p, lado: (k === 0 ? 0 : 1) as 0 | 1 } : p)) };
  }
  return etapas(s);
}

/** frases em sequência: cada uma acende por vez */
function etapas(s: string): Diagrama | undefined {
  const frases = cortes(s, /(?<=[.!?;])\s+(?=[A-ZÀ-Ý0-9])/);
  // uma frase só: é uma etapa do processo (acende e liga à anterior)
  if (!frases.length) return palavras(s) >= 2 ? { tipo: 'etapas', pecas: [{ ini: 0, fim: s.length, papel: 'item' }] } : undefined;
  if (frases.length >= 1 && frases.length <= 6) {
    const ps = pecasDe(s, frases, 'div');
    if (ps.every((p) => p.papel !== 'item' || palavras(s.slice(p.ini, p.fim)) >= 2)) return { tipo: 'etapas', pecas: ps };
  }
  return undefined;
}
export interface PassoRot { faz?: string; porque?: string; linhas: number[] }
export interface Roteiro { linhas: LinhaRot[]; passos: PassoRot[]; origem: 'quadro' | 'passos' }

interface Fonte { passos?: { faz?: string; conta?: string; porque?: string }[]; quadro?: { linha: string; nota?: string; destaque?: string }[] }

/**
 * Onde fica o destaque na linha (auditoria M1): casa por termo inteiro, nunca no meio de outro ("SQ" não marca
 * dentro de "SQR"; o "4" de "= 4" não é o 4 de "240"). Sinais nas pontas do destaque ("18·", "÷ 3") não contam.
 * Em texto, casa por palavra inteira. Sem lugar certo, sem destaque.
 */
function localiza(L: LinhaRot, destaque: string): [number, number] | undefined {
  const d = destaque.replace(/^[\s=+−\-×÷·*/]+|[\s=+−\-×÷·*/]+$/g, '');
  if (!d) return undefined;
  const achados: number[] = [];
  for (let i = L.texto.indexOf(d); i >= 0; i = L.texto.indexOf(d, i + 1)) achados.push(i);
  if (!achados.length) return undefined;
  if (!L.conta) {
    const i = achados.find((x) => !/[A-Za-zÀ-ÿ0-9]/.test(L.texto[x - 1] || '') && !/[A-Za-zÀ-ÿ0-9]/.test(L.texto[x + d.length] || ''));
    return i == null ? undefined : [i, i + d.length];
  }
  const ini: number[] = [], fim: number[] = [];
  let pos = 0;
  for (const t of L.toks) { ini.push(pos); pos += t.v.length; fim.push(pos); }
  // começo e fim batem com o começo e o fim de termos
  const certo = achados.find((x) => ini.includes(x) && fim.includes(x + d.length));
  if (certo != null) return [certo, certo + d.length];
  // dentro de um termo só (o denominador de uma fração empilhada): marca o termo inteiro, se for a maior parte dele
  for (const x of achados) {
    const k = ini.findIndex((a, j) => a <= x && fim[j] >= x + d.length);
    if (k >= 0 && (L.toks[k].k === 'frac' || d.length * 2 > L.toks[k].v.length)) return [ini[k], fim[k]];
  }
  return undefined;
}

/** termo-chave de um passo de texto (Biologia, Química, Português): o que vem depois da última seta, "=" ou ":" */
function termoChave(s: string): [number, number] | undefined {
  const m = /(?:→|⇒|=|:)\s*([^→⇒=:]+)$/.exec(s);
  if (m) {
    const t = m[1].replace(/[.\s]+$/, '');
    if (/[A-Za-zÀ-ÿ0-9].*[A-Za-zÀ-ÿ0-9]/.test(t) && t.length <= 48) { const i = s.lastIndexOf(t); return [i, i + t.length]; }
  }
  const t = s.trim();
  if (t.length <= 60 && t.length > 0) { const i = s.indexOf(t); return [i, i + t.length]; }
  return undefined;
}
/** resultado de uma conta: o trecho depois do último "=", "≈" ou "→" (curto) */
function resultado(s: string): [number, number] | undefined {
  const m = /(?:=|≈|→)\s*([^=≈→]+)$/.exec(s);
  if (!m) return undefined;
  const t = m[1].replace(/[\s.]+$/, '');
  if (!t || t.length > 36 || !/\d/.test(t)) return undefined;
  const i = s.lastIndexOf(t);
  return [i, i + t.length];
}

function planejaLinha(linhas: LinhaRot[], l: number, anterior: number | null) {
  const L = linhas[l];
  if (!L.conta || L.diagrama) return;
  const ts = L.toks;
  const segs = segmentos(ts);
  const planos: Plano[] = [];
  const faixa = (idx: number[]) => ({ ini: idx[0], fim: idx[idx.length - 1] + 1 });
  // equação de um trecho: primeiro e último membro (quem vem antes) / primeiro e segundo (quem vem depois)
  const eqDe = (toks: Tok[], sg: Segmento, lado: 'fim' | 'ini') => {
    const z = zona(toks, sg, lado);
    const mm = z.length ? membros(toks, z) : null;
    if (!mm || mm.m.length < 2 || mm.rel.some((i) => toks[i].v !== '=')) return null;
    return lado === 'fim' ? { L: mm.m[0], R: mm.m[mm.m.length - 1], eq: mm.rel[mm.rel.length - 1] } : { L: mm.m[0], R: mm.m[1], eq: mm.rel[0] };
  };
  const ocupados: [number, number][] = [];
  const livre = (a: number, b: number) => !ocupados.some(([x, y]) => a < y && x < b);
  const tenta = (de: Lado, segDe: Segmento, sg: Segmento) => {
    const ea = eqDe(de.toks, segDe, 'fim'), eb = eqDe(ts, sg, 'ini');
    if (ea && eb) {
      const p = planoEquacao(de, ea, { toks: ts, l }, eb);
      if (p) { const f = faixa([...eb.L, ...eb.R]); planos.push({ ...p, ...f }); ocupados.push([f.ini, f.fim]); return; }
    }
    // a última expressão de antes, calculada, no começo do trecho novo ("183 − 43 → 140")
    const za = zona(de.toks, segDe, 'fim'), zb = zona(ts, sg, 'ini');
    const ma = za.length ? membros(de.toks, za) : null, mb = zb.length ? membros(ts, zb) : null;
    if (ma && mb && ma.m.length === 1 && mb.m.length === 1 && !temPalavra(de.toks, ma.m[0])) {
      const p = planoResultado(de, ma.m[0], { toks: ts, l }, mb.m[0], false);
      if (p) { const f = faixa(mb.m[0]); planos.push({ ...p, ...f }); ocupados.push([f.ini, f.fim]); }
    }
    // mesmo nome dos dois lados ("ΔH = 20 − 5" → "ΔH = +15 kcal/mol"): a conta da direita foi feita
    if (ea && eb && ma && mb && ma.m.length === 2 && mb.m.length >= 2) {
      const t1 = ea.L.map((i) => de.toks[i].v).join(' '), t2 = eb.L.map((i) => ts[i].v).join(' ');
      if (t1 === t2 && !temPalavra(de.toks, ea.R)) {
        const p = planoResultado(de, ea.R, { toks: ts, l }, eb.R, false);
        if (p) {
          eb.L.forEach((j, k) => { p.entradas[chaveRef(j)] = { de: [{ l: de.l, i: ea.L[k] }] }; });
          p.entradas[chaveRef(eb.eq)] = { de: [{ l: de.l, i: ea.eq }] };
          const f = faixa([...eb.L, ...eb.R]); planos.push({ ...p, ...f }); ocupados.push([f.ini, f.fim]);
        }
      }
    }
  };
  // 1) da linha anterior para o primeiro trecho desta
  if (anterior != null && linhas[anterior].conta) {
    const A = linhas[anterior], sa = segmentos(A.toks);
    tenta({ toks: A.toks, l: anterior }, sa[sa.length - 1], segs[0]);
  }
  // 2) de um trecho para o seguinte na mesma linha ("A → B")
  for (let k = 1; k < segs.length; k++) tenta({ toks: ts, l }, segs[k - 1], segs[k]);
  // 3) dentro de uma igualdade encadeada: cada membro é a conta do anterior feita ("= 183 − 43 = 140")
  for (const sg of segs) {
    for (const lado of ['ini', 'fim'] as const) {
      const z = zona(ts, sg, lado);
      const mm = z.length ? membros(ts, z) : null;
      if (!mm) continue;
      for (let k = 0; k + 1 < mm.m.length; k++) {
        const ma = mm.m[k], mb = mm.m[k + 1];
        const f = faixa(mb);
        if (!livre(f.ini, f.fim)) continue;
        const aprox = ts[mm.rel[k]].v === '≈';
        const p = planoResultado({ toks: ts, l }, ma, { toks: ts, l }, mb, aprox);
        if (p) { planos.push({ ...p, ...f }); ocupados.push([f.ini, f.fim]); }
      }
    }
  }
  planos.sort((x, y) => x.ini - y.ini);
  L.planos = planos;
}

/** Monta o roteiro da resolução animada a partir dos dados. `materia`: mat, qui, bio, por, fis… */
export function montaRoteiro(r: Fonte, materia?: string): Roteiro {
  const linhas: LinhaRot[] = [];
  const passos: PassoRot[] = [];
  const nova = (texto: string, extra: Partial<LinhaRot> = {}): number => {
    const conta = !contaEhTexto(texto, materia);
    // o processo só é desenhado em Biologia, Química e Física (Português e humanas: o trecho fica como texto)
    const ciencia = !materia || ['bio', 'qui', 'fis'].includes(materia);
    // conta de Química com seta e sem "=" é reação (desenhada); conta com "=" fica com o motor da conta
    const dg = ciencia && (!conta || (materia !== 'mat' && !/=/.test(texto))) ? diagrama(texto, conta) : undefined;
    linhas.push({ texto, toks: tokeniza(texto), conta, planos: [], diagrama: dg, ...extra });
    return linhas.length - 1;
  };
  const usaQuadro = !!(r.quadro && r.quadro.length);
  if (usaQuadro) {
    for (const q of r.quadro!) {
      if (!q.linha) continue;
      const l = nova(q.linha, { nota: q.nota || undefined });
      if (q.destaque) linhas[l].marca = localiza(linhas[l], q.destaque);
      passos.push({ linhas: [l] });
    }
  } else {
    for (const p of r.passos || []) {
      const ls = (p.conta || '').split('\n').filter((x) => x.trim()).map((t) => nova(t));
      // termo-chave do passo: o resultado da conta, ou (texto) o que vem depois da seta
      const ult = ls[ls.length - 1];
      if (ult != null) {
        const L = linhas[ult];
        L.marca = L.conta ? resultado(L.texto) : termoChave(L.texto);
      }
      passos.push({ faz: p.faz || undefined, porque: p.porque || undefined, linhas: ls });
    }
  }
  let ant: number | null = null;
  for (let l = 0; l < linhas.length; l++) {
    planejaLinha(linhas, l, ant);
    ant = l;
  }
  return { linhas, passos, origem: usaQuadro ? 'quadro' : 'passos' };
}

/** quantas transições animadas (com termos se movendo) o roteiro tem, por tipo */
export function contaTransicoes(rt: Roteiro): Partial<Record<TipoTransicao, number>> {
  const c: Partial<Record<TipoTransicao, number>> = {};
  for (const l of rt.linhas) for (const p of l.planos) c[p.tipo] = (c[p.tipo] || 0) + 1;
  return c;
}

/** chave de um pedaço desenhado */
export { chaveRef };

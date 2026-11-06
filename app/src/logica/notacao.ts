/**
 * Expoente, índice e fórmula química de verdade (comando 20, auditoria A7). O texto dos dados NÃO muda: só se acha
 * onde há expoente ("10^−2", "2^4", "2^(1 + k)", "SO4^2−"), índice ("V_R", "a_n", "h_{máx}", "m0", "a1", "b21"),
 * fórmula química com subscrito automático ("H2SO4", "C6H12O6", "CH2", "NH2", "Na2SO4") e carga ("H+", "Cl−", "Fe2+").
 * Quem desenha (ui/Fracao.tsx) põe o pedaço em <sup>/<sub> e guarda escondido o sinal escrito ("^", "_", "_{", "}"),
 * para o texto (leitor de tela, copiar e colar, testes) continuar idêntico ao dos dados.
 */
export type ParteNotacao =
  | { t: 'txt'; v: string }
  /** pre/pos: o que estava escrito em volta e fica escondido ("^", "^(" e ")", "_", "_{" e "}") */
  | { t: 'sup' | 'sub'; v: string; pre: string; pos: string };

const SIMBOLOS = new Set(('H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb '
  + 'Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At '
  + 'Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr').split(' '));

// fórmula: símbolos (com índice) e grupos entre parênteses, seguida opcionalmente de carga ("+", "−", "2+", "^2−")
const RE_FORMULA = /(?<![A-Za-zÀ-ÿ0-9_#])((?:[A-Z][a-z]?\d*|\((?:[A-Z][a-z]?\d*)+\)\d*)+)(\^?\d?[+−-](?![A-Za-zÀ-ÿ0-9(]))?(?![A-Za-zÀ-ÿ0-9_#^])/g;
// expoente com circunflexo
const RE_EXPO = /\^\(([^()\n]{1,30})\)|\^([−\-+]?[0-9a-zA-Z,]+[+−]?)/g;
// índice com sublinhado
const RE_INDICE = /_\{([^{}\n]{1,20})\}|_([A-Za-z0-9áéíóúâêôãõç]+)/g;
// variável de uma letra com número colado: "m0", "v0", "a1", "x2", "b21"
const RE_VARIND = /(?<![A-Za-zÀ-ÿ0-9_#.,])([a-zα-ω])(\d{1,2})(?![A-Za-zÀ-ÿ0-9#_^]|[.,]\d)/g;

/** é uma fórmula química de verdade (todos os pedaços são símbolos de elementos; tem índice ou carga)? */
function ehFormula(f: string, carga: string | undefined): boolean {
  const simb = f.replace(/[()\d]/g, ' ').trim().split(/\s+|(?=[A-Z])/).filter(Boolean);
  if (!simb.length || !simb.every((x) => SIMBOLOS.has(x))) return false;
  if (!/\d/.test(f) && !carga) return false;
  // uma letra só seguida de número ("C1", "B12", "P1") é índice também, mas sem carga só se o símbolo for de elemento
  return true;
}

interface Pedaco { ini: number; fim: number; partes: ParteNotacao[] }

/** Divide o texto em trechos normais e pedaços de expoente/índice. Sem notação, devolve um trecho só. */
export function partesNotacao(s: string): ParteNotacao[] {
  if (!/[\^_\d+−-]/.test(s)) return [{ t: 'txt', v: s }];
  const pedacos: Pedaco[] = [];
  const livre = (a: number, b: number) => !pedacos.some((p) => a < p.fim && p.ini < b);
  // 1) expoente e índice escritos ("^", "_")
  for (const [re, t] of [[RE_EXPO, 'sup'], [RE_INDICE, 'sub']] as const) {
    re.lastIndex = 0;
    for (let m = re.exec(s); m; m = re.exec(s)) {
      if (m.index === 0 || /\s/.test(s[m.index - 1])) continue; // "^" solto não é expoente
      const chave = m[1] != null;
      const v = chave ? m[1] : m[2];
      const pre = t === 'sup' ? (chave ? '^(' : '^') : (chave ? '_{' : '_');
      const pos = chave ? (t === 'sup' ? ')' : '}') : '';
      if (livre(m.index, m.index + m[0].length)) pedacos.push({ ini: m.index, fim: m.index + m[0].length, partes: [{ t, v, pre, pos }] });
    }
  }
  // 2) fórmula química: o número depois do símbolo (ou do parêntese) desce; a carga sobe
  RE_FORMULA.lastIndex = 0;
  for (let m = RE_FORMULA.exec(s); m; m = RE_FORMULA.exec(s)) {
    const f = m[1], carga = m[2];
    if (!ehFormula(f, carga)) continue;
    const ini = m.index, fim = m.index + m[0].length;
    if (!livre(ini, fim)) continue;
    const partes: ParteNotacao[] = [];
    // íon de um elemento só com número antes da carga ("Fe2+", "Ca2+"): o número é da carga
    const monoCarga = carga && /^[A-Z][a-z]?\d$/.test(f) && !carga.startsWith('^');
    const corpo = monoCarga ? f.replace(/\d$/, '') : f;
    const re = /(\d+)/g;
    let ult = 0;
    for (let k = re.exec(corpo); k; k = re.exec(corpo)) {
      if (k.index > ult) partes.push({ t: 'txt', v: corpo.slice(ult, k.index) });
      partes.push({ t: 'sub', v: k[1], pre: '', pos: '' });
      ult = k.index + k[1].length;
    }
    if (ult < corpo.length) partes.push({ t: 'txt', v: corpo.slice(ult) });
    if (carga) {
      const c = monoCarga ? f.slice(-1) + carga : carga;
      partes.push(c.startsWith('^') ? { t: 'sup', v: c.slice(1), pre: '^', pos: '' } : { t: 'sup', v: c, pre: '', pos: '' });
    }
    pedacos.push({ ini, fim, partes });
  }
  // 3) variável com índice colado ("m0", "a1")
  RE_VARIND.lastIndex = 0;
  for (let m = RE_VARIND.exec(s); m; m = RE_VARIND.exec(s)) {
    const ini = m.index, fim = m.index + m[0].length;
    if (livre(ini, fim)) pedacos.push({ ini, fim, partes: [{ t: 'txt', v: m[1] }, { t: 'sub', v: m[2], pre: '', pos: '' }] });
  }
  if (!pedacos.length) return [{ t: 'txt', v: s }];
  pedacos.sort((a, b) => a.ini - b.ini);
  const out: ParteNotacao[] = [];
  let ult = 0;
  for (const p of pedacos) {
    if (p.ini > ult) out.push({ t: 'txt', v: s.slice(ult, p.ini) });
    out.push(...p.partes);
    ult = p.fim;
  }
  if (ult < s.length) out.push({ t: 'txt', v: s.slice(ult) });
  return out;
}

/** texto de volta (para conferir que nada mudou) */
export const juntaNotacao = (ps: ParteNotacao[]) => ps.map((p) => (p.t === 'txt' ? p.v : p.pre + p.v + p.pos)).join('');

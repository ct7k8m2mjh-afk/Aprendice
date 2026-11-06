/**
 * Correção local de respostas escritas (flashcards e frases para completar), sem IA.
 * Portada do protótipo (app-atual/design/materia.js, versão de 01/11) sem mudar o comportamento:
 * compara números pelo VALOR (sinal, fração, vírgula decimal, milhar, %, π, potência, raiz, notação científica),
 * tolera plural e um erro de digitação no meio da palavra, e detecta inversão de sentido ("de A para B").
 * O resultado é só uma sugestão: o aluno confirma.
 */
import type { Completar, Flashcard } from '../dados/tipos';

export type Veredito = 'certo' | 'quase' | 'errado';
export interface Correcao { veredito: Veredito; faltou: string[]; comentario: string }

interface Num { v: number; pc: boolean; pi: boolean; dec: number }

const STOP: Record<string, 1> = {};
('de do da dos das o os as um uma uns umas e ou que se em no na nos nas num numa para pra por pelo pela pelos pelas com sem ao aos ' +
  'a é eh igual ser sao sua seu suas seus isso esse essa este esta ele ela eles elas lhe muito como quando onde qual quais ja tambem so entao porque pois logo ha tem')
  .split(' ').forEach((w) => { STOP[w] = 1; });
const NUMS: Record<string, string> = { zero: '0', um: '1', uma: '1', dois: '2', duas: '2', tres: '3', quatro: '4', cinco: '5', seis: '6', sete: '7', oito: '8', nove: '9', dez: '10', metade: '1 2', dobro: '2' };

export function nums(s: string): Num[] {
  let t = ' ' + String(s || '').replace(/[º°]/g, ' ').replace(/−|–/g, '-').replace(/\bmenos\s+(?=\d)/gi, '-') + ' ';
  t = t.replace(/(\d)\.(\d{3})(?!\d)/g, '$1$2').replace(/(\d),(\d)/g, '$1.$2');
  const CALC: number[] = [];
  const SUPM: Record<string, string> = { '⁻': '-', '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' };
  t = t.replace(/(\d+(?:[.,]\d+)?)\s*[x×·*.]\s*10\s*(?:\^\s*(-?\d+)|([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+))/g, (_m, a: string, e1?: string, e2?: string) => {
    const e = e1 != null ? e1 : (e2 || '').split('').map((ch) => SUPM[ch]).join('');
    return ' #' + (CALC.push(parseFloat(a.replace(',', '.')) * Math.pow(10, parseInt(e, 10))) - 1) + '# ';
  });
  const SUP: Record<string, number> = { '⁰': 0, '¹': 1, '²': 2, '³': 3, '⁴': 4, '⁵': 5, '⁶': 6, '⁷': 7, '⁸': 8, '⁹': 9 };
  t = t.replace(/(\d+(?:\.\d+)?)\s*(⁻?)([⁰¹²³⁴⁵⁶⁷⁸⁹]+)/g, (_m, a: string, ng: string, e: string) => {
    let n = 0; for (let i = 0; i < e.length; i++) n = n * 10 + SUP[e[i]]; if (ng) n = -n;
    return ' #' + (CALC.push(Math.pow(parseFloat(a), n)) - 1) + '# ';
  }).replace(/(\d+(?:\.\d+)?)\s*\^\s*(-?\d+)/g, (_m, a: string, e: string) => ' #' + (CALC.push(Math.pow(parseFloat(a), parseInt(e, 10))) - 1) + '# ');
  t = t.replace(/\s*\braiz\s*(?:quadrada\s*)?(?:de\s*)?(?=\d)/gi, '√').replace(/(\d)raiz\s*(?:de\s*)?(?=\d)/gi, '$1√');
  t = t.replace(/(\d+(?:\.\d+)?)?\s*√\s*\(?\s*(\d+(?:\.\d+)?)\s*\)?/g, (_m, a: string | undefined, b: string) => ' ' + ((a ? parseFloat(a) : 1) * Math.sqrt(parseFloat(b))).toFixed(9) + 'R ');
  const out: Num[] = [];
  t = t.replace(/(-?)\s*#(\d+)#/g, (_m, sg: string, k: string) => { out.push({ v: (sg ? -1 : 1) * CALC[+k], pc: false, pi: false, dec: 99 }); return ' '; });
  const re = /([^\w.]|[a-z)\]])(\s*)([-+]?)\s*(\d+(?:\.\d+)?)(R)?(?:\s*\/\s*(\d+(?:\.\d+)?))?(?:\s*(%|pi\b|π))?/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(t))) {
    const colado = /[a-z)\]]/i.test(m[1]) && !m[2];
    if (colado && !m[3]) continue; // dígito colado em letra (Na2SO4, CH3): índice, não número
    let v = parseFloat(m[4]);
    if (m[6]) { const d = parseFloat(m[6]); if (!d) continue; v = v / d; }
    const bin = /[a-z)\]]/i.test(m[1]);
    if (m[3] === '-') v = -v;
    if (bin && m[3] === '+') v = Math.abs(v);
    const suf = (m[7] || '').toLowerCase();
    out.push({ v, pc: suf === '%', pi: suf === 'pi' || suf === 'π', dec: m[5] ? 99 : (m[4].split('.')[1] || '').length });
    re.lastIndex = m.index + m[0].length;
  }
  return out;
}

export function mesmoNum(a: Num, b: Num): boolean {
  if (a.pi !== b.pi) return false;
  const eq = (x: number, y: number) => Math.abs(x - y) <= 1e-6 * Math.max(1, Math.abs(x));
  const dA = a.dec == null ? 99 : a.dec, dB = b.dec == null ? 99 : b.dec;
  if (a.pc === b.pc && Math.min(dA, dB) >= 1 && Math.min(dA, dB) <= 3 && Math.max(dA, dB) >= 5) {
    const r = Math.min(dA, dB);
    if (Math.abs(a.v - b.v) <= 0.5 * Math.pow(10, -r) + 1e-9) return true;
  }
  if (a.pc === b.pc) return eq(a.v, b.v);
  const p = a.pc ? a : b, q = a.pc ? b : a; // 25% = 0,25 = 25
  return eq(p.v / 100, q.v) || eq(p.v, q.v);
}

const contemNums = (alvo: Num[], resp: Num[]) => alvo.every((x) => resp.some((y) => mesmoNum(x, y)));

export function norm(s: string): string {
  s = String(s || '').replace(/[º°]/g, ' graus ').replace(/π/g, ' pi ').replace(/√/g, ' raiz ').replace(/(^|[\s([])-(?=[\dπ√(])/g, '$1 menos ');
  return s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/≠/g, ' diferente ').replace(/≥|>=/g, ' maior igual ').replace(/≤|<=/g, ' menor igual ').replace(/>/g, ' maior ').replace(/</g, ' menor ')
    .replace(/=/g, ' igual ').replace(/−|\s-\s/g, ' menos ').replace(/[·×*]/g, ' vezes ').replace(/\+/g, ' mais ').replace(/\^/g, ' elevado ').replace(/\//g, ' sobre ').replace(/→/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ').trim();
}

function toks(s: string, guardaLetra?: boolean): string[] {
  const l = norm(s).split(' ').filter(Boolean).map((w) => NUMS[w] || w).join(' ').split(' ');
  const f = l.filter((w) => !STOP[w] || (guardaLetra && w.length === 1));
  return f.length ? f : l.filter(Boolean);
}

export function lev1(a: string, b: string): boolean {
  if (a[0] !== b[0] || a.slice(-3) !== b.slice(-3)) return false;
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0, j = 0, dif = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; continue; }
    if (++dif > 1) return false;
    if (a.length > b.length) i++; else if (b.length > a.length) j++; else { i++; j++; }
  }
  return dif + (a.length - i) + (b.length - j) <= 1;
}

const OPOSTO = /^(a|an|des|in|im|ir|i|nao)(.+)$/;
function oposto(w: string, k: string) { const m1 = OPOSTO.exec(w), m2 = OPOSTO.exec(k); return !!((m1 && m1[2] === k) || (m2 && m2[2] === w)); }

function casa(w: string, set: Record<string, 1>): boolean {
  if (set[w]) return true;
  for (const k in set) {
    if (oposto(w, k)) continue;
    if (w.length >= 5 && k.length >= 5 && lev1(w, k)) return true;
    if (Math.min(w.length, k.length) >= 4 && Math.abs(w.length - k.length) <= 2 && (k.indexOf(w) === 0 || w.indexOf(k) === 0)) return true;
    if (w.length >= 6 && k.length >= 6) { let p = 0; while (p < w.length && w[p] === k[p]) p++; if (p >= 6 && p >= 0.8 * Math.min(w.length, k.length)) return true; }
  }
  return false;
}

function invertida(frase: string, seq: string[]): boolean {
  const m = norm(frase).match(/\b(?:de|do|da|dos|das)\s+(.+?)\s+(?:para|pra|pro|ao|a|ate)\s+(?:o\s+|a\s+|os\s+|as\s+)?(.+)$/);
  if (!m) return false;
  const x = toks(m[1])[0], y = toks(m[2])[0];
  if (!x || !y || x === y) return false;
  let px = -1, py = -1;
  seq.forEach((w, i) => { const u: Record<string, 1> = { [w]: 1 }; if (px < 0 && casa(x, u)) px = i; if (py < 0 && casa(y, u)) py = i; });
  return px >= 0 && py >= 0 && py < px;
}

/** Cria o corretor de flashcards de uma matéria (o peso das palavras depende do conjunto de cartões). */
export function criaCorretor(cartoes: Flashcard[]) {
  const DF: Record<string, number> = {};
  let NDOC = 0;
  cartoes.forEach((c) => {
    NDOC++;
    const vis: Record<string, 1> = {};
    toks(c.frente + ' ' + c.verso + ' ' + (c.essencial || []).join(' ')).forEach((w) => { if (!vis[w]) { vis[w] = 1; DF[w] = (DF[w] || 0) + 1; } });
  });
  const peso = (w: string) => Math.log(1 + NDOC / (1 + (DF[w] || 0)));
  function cobre(frase: string, set: Record<string, 1>) {
    const guarda = /[<>=≠≥≤^/+·×0-9]/.test(frase), t = toks(frase, guarda);
    let tot = 0, ok = 0;
    t.forEach((w) => { const p2 = peso(w); tot += p2; if (casa(w, set)) ok += p2; });
    return tot ? ok / tot : 0;
  }

  return function corrige(c: Flashcard, resp: string): Correcao {
    let seq = toks(resp, true);
    const set: Record<string, 1> = {};
    seq.forEach((w) => { set[w] = 1; });
    const ess = c.essencial && c.essencial.length ? c.essencial : [c.verso];
    let sc = ess.map((x) => cobre(x, set));
    const contra = ess.concat(c.aceita || []).some((x) => invertida(x, seq));
    (c.aceita || []).forEach((a) => {
      if (cobre(a, set) < 0.75) return;
      const ta = toks(a);
      let melhor = -1, mv = 0;
      ess.forEach((x, i) => { const tx: Record<string, 1> = {}; toks(x).forEach((w) => { tx[w] = 1; }); const o = ta.filter((w) => casa(w, tx)).length; if (o > mv) { mv = o; melhor = i; } });
      if (melhor < 0) { if (ess.length === 1) melhor = 0; else ess.some((_x, i) => { if (sc[i] < 0.7) { melhor = i; return true; } return false; }); }
      if (melhor >= 0) sc[melhor] = 1;
    });
    if (cobre(c.verso, set) >= 0.8) sc = sc.map(() => 1);
    if (contra) sc = ess.map((x, i) => (invertida(x, seq) || ess.length === 1 ? 0 : sc[i]));
    const cob: number[] = sc.map((s) => (s >= 0.7 ? 1 : s >= 0.34 ? 0.5 : 0));
    const media = cob.reduce((a, b) => a + b, 0) / cob.length;
    const faltou = ess.filter((_x, i) => cob[i] < 1);
    let v: Veredito = contra ? 'errado' : media === 1 ? 'certo' : media >= 0.4 ? 'quase' : 'errado';
    let nR = nums(resp), numErr = false;
    const canon = (x: string) => String(x || '').toLowerCase().replace(/[−–]/g, '-').replace(/[·×*]/g, '').replace(/\s+/g, '').replace(/^.*=/, '').replace(/,/g, '.');
    const expr = ess.some((x) => /\d/.test(x) && /(^|[^a-z])[xy]([^a-z]|$)/i.test(x) && /[-−+/]/.test(x));
    if (expr && /\d/.test(resp)) {
      const cr = canon(resp.replace(/\([^()]*[a-zà-ú]{3,}[^()]*\)/gi, ''));
      const okE = ess.concat(c.aceita || []).some((x) => { const cx = canon(x); return cx && (cx === cr || cr.indexOf(cx) === 0); });
      if (okE) v = 'certo'; else { v = 'errado'; numErr = true; }
      nR = [];
    }
    if (nR.length) {
      const nE = nums(ess.join(' '));
      const alvosN = [nE].concat((c.aceita || []).map(nums).filter((x) => x.length && x.length >= nE.length)).filter((x) => x.length);
      if (alvosN.length) {
        const conhecidos = ([] as Num[]).concat(nums(c.verso), ...alvosN);
        const bate = alvosN.some((x) => contemNums(x, nR));
        const sobra = nR.some((y) => !conhecidos.some((x) => mesmoNum(x, y)));
        const essNum = ess.every((x) => norm(x).replace(/\d+|\b(pi|raiz|graus|menos|sobre|vezes|mais|elevado|igual|x|y)\b|\s/g, '').length <= 3);
        const soBons = nR.every((y) => conhecidos.some((x) => mesmoNum(x, y)));
        if (!bate) { if (soBons) { if (v === 'certo' || v === 'errado') v = 'quase'; } else { v = 'errado'; numErr = true; } }
        else if (sobra) { if (v === 'certo') v = 'quase'; }
        else if (essNum) v = 'certo';
        else if (v === 'errado') v = 'quase';
      }
    }
    seq = [];
    const comentario = numErr ? 'O número da sua resposta não confere com o da resposta-modelo. Compare e decida.'
      : contra ? 'Parece que a sua resposta inverte o sentido (de onde para onde). Compare com a resposta-modelo e decida.'
        : v === 'certo' ? 'Sua resposta traz as ideias essenciais. Confira com a resposta-modelo e confirme.'
          : v === 'quase' ? 'Sua resposta tem parte do essencial. Compare com a resposta-modelo: se você disse o mesmo com outras palavras, marque Acertei.'
            : 'Não encontrei as ideias essenciais na sua resposta. Compare com a resposta-modelo: se você disse o mesmo com outras palavras, marque Acertei.';
    return { veredito: v, faltou, comentario };
  };
}

function igualSimples(s: string) { return String(s || '').trim().toLowerCase().replace(/\s+/g, ' ').replace(/[.;:!?,]+$/, ''); }

/** Confere a lacuna de uma frase para completar. */
export function confereCompletar(c: Completar, r: string): Veredito {
  const alvos = [c.resp].concat(c.aceita || []), nr = norm(r), sr = igualSimples(r);
  let quase = false;
  const ok = alvos.some((a) => {
    if (igualSimples(a) === sr) return true;
    const na = norm(a);
    if (!na || !nr) return false;
    if (na === nr) return true;
    const nA = nums(a), nRr = nums(r);
    if (nA.length || nRr.length) return !!(nA.length && nA.length === nRr.length && contemNums(nA, nRr));
    const pa = na.replace(/(es|s)\b/g, ''), pr = nr.replace(/(es|s)\b/g, '');
    if (pa === pr) return true;
    if (na.length >= 6 && nr.length >= 6 && Math.abs(na.length - nr.length) <= 2 && (na.indexOf(nr) === 0 || nr.indexOf(na) === 0) && !/ /.test(na + nr)) return true;
    if (na.length >= 5 && !/(^| )\S( |$)/.test(na) && !/(^| )\S( |$)/.test(nr) && lev1(na, nr)) return true;
    if (nr.length >= 4 && ((' ' + na + ' ').indexOf(' ' + nr + ' ') >= 0 || (' ' + nr + ' ').indexOf(' ' + na + ' ') >= 0)) quase = true;
    return false;
  });
  return ok ? 'certo' : quase ? 'quase' : 'errado';
}

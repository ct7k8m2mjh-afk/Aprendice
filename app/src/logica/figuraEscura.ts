/**
 * Figura de teoria no tema escuro (revisão de 21/11/2026, matérias-2 R3; passada 3 N2).
 *
 * As figuras de Biologia (app-atual/bio/img, que não se altera) trazem duas paletas no próprio <style>: a escura, como
 * padrão (texto #E7E9F5, cores vivas), e a clara, num bloco "@media (prefers-color-scheme: light)" repetido logo depois
 * sem o @media, para valer sempre. Dentro de <img> a figura não sabe do botão Dia/Noite do site e fica sempre clara:
 * texto #1E2440 sem fundo, ilegível sobre o cartão escuro.
 *
 * Aqui se monta, a partir da mesma figura, a versão com a paleta escura que ela já tem (tira só as regras da clara), e
 * a tela mostra uma ou outra pelo tema do site. O tema claro continua a figura original, sem nenhuma mudança.
 * Figuras sem as duas paletas (Mat, Quí e os ícones de Bio) devolvem null: ficam como estão.
 *
 * Contraste (passada 3 N2): todo texto da versão escura fica ≥ 4,5:1 sobre o que está DE FATO atrás dele — o cartão ou a
 * forma colorida pintada embaixo (etiqueta, faixa, pirâmide). Para isso:
 *  - os tons de letra da paleta escura que ficavam abaixo sobem um pouco (TONS_ESCURO, só em texto);
 *  - a letra escura (#0F1529) das etiquetas coloridas continua escura, e a forma embaixo dela fica um pouco mais opaca
 *    (ou um pouco mais clara, se nem opaca chega a 4,5:1), só onde precisa (`fundosDosTextos` acha a forma).
 */
import { contraste, mistura } from './contraste';
import { MATERIAS } from '../dados/materias';

const MEDIA_CLARO = '@media (prefers-color-scheme: light){';
export const ALVO_FIGURA = 4.5;
/** letra escura das etiquetas coloridas (a mesma nas duas paletas) */
export const LETRA_ESCURA_FIG = '#0F1529';

/** Cartão da figura de Bio no escuro (.fig-teoria, var(--folha)): color-mix(in srgb, --p 11%, #121417) (base.css) */
export const CARTAO_BIO_ESCURO = mistura(MATERIAS.find((x) => x.id === 'bio')!.escuro.p, 0.11, '#121417');

/**
 * Tons de letra da paleta escura que sobem no escuro (só em <text>/<tspan>; formas e linhas não mudam). Cada novo tom é
 * a mesma cor misturada com branco no menor passo que dá ≥ 4,5:1 sobre todos os fundos onde aquela cor aparece.
 * #6C7DF0 → #7989F1 (matérias-2 R3); o resto, passada 3 N2.
 */
export const TONS_ESCURO: Record<string, string> = {
  '#6C7DF0': '#7989F1',
  '#F0566E': '#F26F84', // vermelho: "✗", "parada", "47,XX…", "A"/"AB", "+ / −", "1A 1V", "O₂", "menstruação"
  '#9AA0BD': '#A4AAC4', // cinza: "(estroma)", "(parede mais espessa)", legenda do efeito estufa
  '#5AA9F0': '#74B7F2', // azul: "O₂ → H₂O"
  '#C084FC': '#D0A3FD', // lilás: "GCU"
};
const sel = (c: string) => `text[fill="${c}" i],tspan[fill="${c}" i],text[style*="fill: ${c}" i],tspan[style*="fill: ${c}" i]`;
const AJUSTE_ESCURO =
  Object.entries(TONS_ESCURO).map(([de, para]) => `${sel(de)}{fill:${para}!important}`).join('') +
  // texto cinza pela classe .s (a classe vale também para formas: só o texto muda)
  `text.s,tspan.s{fill:${TONS_ESCURO['#9AA0BD']}}`;

function decodifica(u: string): string | null {
  if (!u.startsWith('data:image/svg+xml')) return null;
  const i = u.indexOf(',');
  const cab = u.slice(0, i), dados = u.slice(i + 1);
  try {
    if (!cab.includes(';base64')) return decodeURIComponent(dados);
    const bin = atob(dados);
    const bytes = new Uint8Array(bin.length);
    for (let k = 0; k < bin.length; k++) bytes[k] = bin.charCodeAt(k);
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------------------------------------------------
// Geometria mínima do SVG: o que está pintado atrás de cada texto.
// Formas com preenchimento de cor (rect, circle, ellipse, polygon, path), na ordem do documento, com transform, opacity e
// fill-opacity herdados; o que está em <defs>, <clipPath>, <marker>, <mask>, <pattern> e <symbol> não é pintado direto.
// Degradê (url(#…)) e "none" não contam como fundo. O texto é uma caixa estimada pela fonte; a cor de fundo é medida em
// vários pontos dentro dela, e vale o pior.

type M = [number, number, number, number, number, number]; // a b c d e f
const ID: M = [1, 0, 0, 1, 0, 0];
const mult = (m: M, n: M): M => [
  m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1],
  m[0] * n[2] + m[2] * n[3], m[1] * n[2] + m[3] * n[3],
  m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5],
];
const aplica = (m: M, x: number, y: number): [number, number] => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
function inversa(m: M): M | null {
  const det = m[0] * m[3] - m[1] * m[2];
  if (Math.abs(det) < 1e-12) return null;
  return [m[3] / det, -m[1] / det, -m[2] / det, m[0] / det, (m[2] * m[5] - m[3] * m[4]) / det, (m[1] * m[4] - m[0] * m[5]) / det];
}
const nums = (s: string) => (s.match(/-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/gi) || []).map(Number);
function transforma(t: string | undefined): M {
  let m = ID;
  if (!t) return m;
  for (const [, f, a] of t.matchAll(/(\w+)\s*\(([^)]*)\)/g)) {
    const v = nums(a);
    let n: M = ID;
    if (f === 'translate') n = [1, 0, 0, 1, v[0] || 0, v[1] || 0];
    else if (f === 'scale') n = [v[0], 0, 0, v[1] ?? v[0], 0, 0];
    else if (f === 'matrix' && v.length === 6) n = v as M;
    else if (f === 'rotate') {
      const r = ((v[0] || 0) * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r);
      const rot: M = [c, s, -s, c, 0, 0];
      n = v.length >= 3 ? mult(mult([1, 0, 0, 1, v[1], v[2]], rot), [1, 0, 0, 1, -v[1], -v[2]]) : rot;
    } else if (f === 'skewX') n = [1, 0, Math.tan(((v[0] || 0) * Math.PI) / 180), 1, 0, 0];
    else if (f === 'skewY') n = [1, Math.tan(((v[0] || 0) * Math.PI) / 180), 0, 1, 0, 0];
    m = mult(m, n);
  }
  return m;
}

/** pontos de um arco do SVG (forma de ponta a ponta → centro e ângulos; SVG 1.1, apêndice F.6) */
function pontosArco(x1: number, y1: number, rx: number, ry: number, phi: number, fa: number, fs: number, x2: number, y2: number): [number, number][] {
  rx = Math.abs(rx); ry = Math.abs(ry);
  if (!rx || !ry) return [[x2, y2]];
  const f = (phi * Math.PI) / 180, cf = Math.cos(f), sf = Math.sin(f);
  const dx = (x1 - x2) / 2, dy = (y1 - y2) / 2;
  const x1p = cf * dx + sf * dy, y1p = -sf * dx + cf * dy;
  const lam = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
  if (lam > 1) { rx *= Math.sqrt(lam); ry *= Math.sqrt(lam); }
  const num = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p;
  const co = (fa === fs ? -1 : 1) * Math.sqrt(Math.max(0, num / (rx * rx * y1p * y1p + ry * ry * x1p * x1p)));
  const cxp = (co * rx * y1p) / ry, cyp = (-co * ry * x1p) / rx;
  const cx = cf * cxp - sf * cyp + (x1 + x2) / 2, cy = sf * cxp + cf * cyp + (y1 + y2) / 2;
  const ang = (ux: number, uy: number, vx: number, vy: number) => Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy);
  const t1 = ang(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry);
  let dt = ang((x1p - cxp) / rx, (y1p - cyp) / ry, (-x1p - cxp) / rx, (-y1p - cyp) / ry);
  if (!fs && dt > 0) dt -= 2 * Math.PI;
  if (fs && dt < 0) dt += 2 * Math.PI;
  const n = Math.max(2, Math.ceil(Math.abs(dt) / (Math.PI / 16)));
  const pts: [number, number][] = [];
  for (let i = 1; i <= n; i++) {
    const t = t1 + (dt * i) / n, ex = rx * Math.cos(t), ey = ry * Math.sin(t);
    pts.push([cf * ex - sf * ey + cx, sf * ex + cf * ey + cy]);
  }
  return pts;
}

/** contorno de um path em polígonos (curvas e arcos amostrados) — basta para "o ponto está dentro?" */
function verticesPath(d: string): [number, number][][] {
  const partes: [number, number][][] = [];
  let atual: [number, number][] = [];
  let x = 0, y = 0, x0 = 0, y0 = 0;
  for (const [, cmd, args] of d.matchAll(/([MLHVCSQTAZmlhvcsqtaz])([^MLHVCSQTAZmlhvcsqtaz]*)/g)) {
    const v = nums(args);
    const rel = cmd === cmd.toLowerCase();
    const C = cmd.toUpperCase();
    const passo = { M: 2, L: 2, T: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, A: 7, Z: 0 }[C]!;
    if (C === 'Z') { x = x0; y = y0; if (atual.length) partes.push(atual); atual = []; continue; }
    for (let i = 0; i + passo <= v.length; i += passo) {
      const g = v.slice(i, i + passo);
      if (C === 'H') x = rel ? x + g[0] : g[0];
      else if (C === 'V') y = rel ? y + g[0] : g[0];
      else {
        const px = x, py = y, ox = rel ? x : 0, oy = rel ? y : 0;
        const nx = g[passo - 2], ny = g[passo - 1]; x = ox + nx; y = oy + ny;
        if (C === 'A') { atual.push(...pontosArco(px, py, g[0], g[1], g[2], g[3], g[4], x, y)); continue; }
        if (C === 'C' || C === 'Q') {
          const ctl = C === 'C' ? [[ox + g[0], oy + g[1]], [ox + g[2], oy + g[3]]] : [[ox + g[0], oy + g[1]]];
          for (let k = 1; k <= 8; k++) {
            const t = k / 8, u = 1 - t;
            const p = C === 'C'
              ? [u ** 3 * px + 3 * u * u * t * ctl[0][0] + 3 * u * t * t * ctl[1][0] + t ** 3 * x, u ** 3 * py + 3 * u * u * t * ctl[0][1] + 3 * u * t * t * ctl[1][1] + t ** 3 * y]
              : [u * u * px + 2 * u * t * ctl[0][0] + t * t * x, u * u * py + 2 * u * t * ctl[0][1] + t * t * y];
            atual.push(p as [number, number]);
          }
          continue;
        }
      }
      if (C === 'M' && i === 0) { if (atual.length) partes.push(atual); atual = []; x0 = x; y0 = y; }
      atual.push([x, y]);
    }
  }
  if (atual.length) partes.push(atual);
  return partes;
}
function dentroPoligonos(ps: [number, number][][], x: number, y: number): boolean {
  let dentro = false; // par-ímpar, somando todos os sub-caminhos
  for (const p of ps) for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    const [xi, yi] = p[i], [xj, yj] = p[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) dentro = !dentro;
  }
  return dentro;
}

const atributos = (s: string) => {
  const a: Record<string, string> = {};
  for (const m of s.matchAll(/([\w:-]+)\s*=\s*"([^"]*)"/g)) a[m[1]] = m[2];
  a.fillAttr = a.fill;
  // o estilo em linha vence o atributo de apresentação
  for (const m of (a.style || '').matchAll(/([\w-]+)\s*:\s*([^;]+)/g)) a[m[1]] = m[2].trim();
  return a;
};
const HEX = /^#[0-9A-F]{6}$/i;
const hex6 = (c: string) => (/^#[0-9A-F]{3}$/i.test(c) ? '#' + c.slice(1).split('').map((x) => x + x).join('') : c).toUpperCase();

interface Forma {
  ini: number; fim: number; tag: string;
  /** cor sólida da forma ('' quando é degradê) e a opacidade final (fill-opacity × opacity herdada) */
  cor: string; alfa: number;
  inv: M | null; dentro: (x: number, y: number) => boolean;
  /** cor e opacidade num ponto (coordenadas da forma): a sólida, ou a do degradê naquele ponto */
  corEm: (x: number, y: number) => [string, number];
}
interface Degrade { radial: boolean; cx: number; cy: number; r: number; stops: { o: number; cor: string; a: number }[] }
const fracao = (v: string | undefined, padrao: number) => (v === undefined ? padrao : v.trim().endsWith('%') ? parseFloat(v) / 100 : parseFloat(v));
/** degradês do SVG por id (unidades da caixa da forma, o padrão) */
function degrades(svg: string): Map<string, Degrade> {
  const d = new Map<string, Degrade>();
  for (const g of svg.matchAll(/<(radialGradient|linearGradient)\b([^>]*)>([\s\S]*?)<\/\1>/g)) {
    const a = atributos(g[2]);
    if (!a.id) continue;
    const stops = [...g[3].matchAll(/<stop\b([^>]*)>/g)].map((s) => {
      const b = atributos(s[1]);
      return { o: fracao(b.offset, 0), cor: hex6(b['stop-color'] || '#000000'), a: b['stop-opacity'] !== undefined ? parseFloat(b['stop-opacity']) : 1 };
    }).filter((s) => HEX.test(s.cor));
    if (stops.length) d.set(a.id, { radial: g[1] === 'radialGradient', cx: fracao(a.cx, 0.5), cy: fracao(a.cy, 0.5), r: fracao(a.r, 0.5), stops });
  }
  return d;
}
function corDoDegrade(g: Degrade, t: number): [string, number] {
  const s = g.stops;
  if (t <= s[0].o) return [s[0].cor, s[0].a];
  for (let i = 1; i < s.length; i++) if (t <= s[i].o) {
    const k = (t - s[i - 1].o) / (s[i].o - s[i - 1].o || 1);
    return [mistura(s[i].cor, k, s[i - 1].cor), s[i - 1].a + (s[i].a - s[i - 1].a) * k];
  }
  return [s[s.length - 1].cor, s[s.length - 1].a];
}
export interface TextoFigura {
  texto: string; cor: string; forma: Forma | null; fundo: string; contraste: number;
}

/** regras de classe do <style> (só ".x{fill:#…}") e a cor do texto padrão (svg{color}) */
function estilo(svg: string) {
  const est = /<style>([\s\S]*?)<\/style>/.exec(svg)?.[1] ?? '';
  const classes = new Map<string, string>();
  for (const m of est.matchAll(/(?:^|})\s*\.([\w-]+)\{fill:(#[0-9A-F]{3,6})\}/gi)) classes.set(m[1], hex6(m[2]));
  const corTexto = hex6(/svg\{color:(#[0-9A-F]{6})\}/i.exec(est)?.[1] ?? '#000000');
  // trocas de tom só do texto, lidas do próprio <style> (as de AJUSTE_ESCURO, ou nenhuma)
  const tonsTexto = new Map<string, string>();
  for (const m of est.matchAll(/text\[fill="(#[0-9A-F]{6})" i\][^{]*\{fill:(#[0-9A-F]{6})/gi)) tonsTexto.set(hex6(m[1]), hex6(m[2]));
  const classeTexto = new Map<string, string>();
  for (const m of est.matchAll(/text\.([\w-]+),tspan\.\1\{fill:(#[0-9A-F]{6})\}/gi)) classeTexto.set(m[1], hex6(m[2]));
  return { classes, corTexto, tonsTexto, classeTexto };
}

/**
 * Para cada texto da figura (já na versão escura): a cor dele, a forma colorida mais alta atrás dele, a cor de fundo
 * pior e o contraste. `cartao` é a cor atrás da figura inteira.
 */
export function fundosDosTextos(svg: string, cartao = CARTAO_BIO_ESCURO): TextoFigura[] {
  const { classes, corTexto, tonsTexto, classeTexto } = estilo(svg);
  const degs = degrades(svg);
  const troca = (c: string) => tonsTexto.get(c) ?? c;
  const corDe = (a: Record<string, string>, herdada: string | null, ehTexto: boolean): string | null => {
    // estilo em linha > regra de classe do <style> > atributo fill (o CSS vence o atributo de apresentação)
    let f = /(?:^|;)\s*fill\s*:\s*([^;]+)/.exec(a.style || '')?.[1]?.trim();
    if (!f && a.class && ehTexto) for (const k of a.class.split(/\s+/)) if (classeTexto.has(k)) f = classeTexto.get(k)!;
    if (!f && a.class) for (const k of a.class.split(/\s+/)) if (classes.has(k)) f = classes.get(k)!;
    if (!f) f = a.fillAttr;
    if (!f) return herdada;
    if (/^currentColor$/i.test(f)) return corTexto;
    const u = /^url\(\s*['"]?#([^'")\s]+)/i.exec(f);
    if (u) return degs.has(u[1]) ? 'url:' + u[1] : 'none';
    if (/^none$/i.test(f)) return 'none';
    const h = hex6(f);
    return HEX.test(h) ? h : 'none';
  };
  const formas: Forma[] = [];
  const res: TextoFigura[] = [];
  type Ctx = { m: M; op: number; fill: string | null; oculto: boolean; tag: string; textoAt?: { x: number; y: number; fs: number; anc: string; base: string; cor: string } };
  const pilha: Ctx[] = [{ m: ID, op: 1, fill: null, oculto: false, tag: 'raiz' }];
  const corpo = svg.replace(/<style>[\s\S]*?<\/style>/g, (s) => ' '.repeat(s.length)); // mesmas posições
  const re = /<(\/?)([\w:-]+)\b([^>]*?)(\/?)>|([^<]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(corpo))) {
    const topo = pilha[pilha.length - 1];
    if (m[5] !== undefined) {
      // texto de verdade dentro de <text>/<tspan>
      const s = m[5].replace(/&[a-z#0-9]+;/gi, 'x').trim();
      const t = topo.textoAt;
      if (!s || !t || topo.oculto || t.cor === 'none') continue;
      const larg = 0.56 * t.fs * s.length, alt = t.fs;
      const x0 = t.anc === 'middle' ? t.x - larg / 2 : t.anc === 'end' ? t.x - larg : t.x;
      const y0 = /middle|central/.test(t.base) ? t.y - alt / 2 : /hanging|text-before/.test(t.base) ? t.y : t.y - 0.72 * alt;
      let pior = Infinity, fundoPior = cartao, formaPior: Forma | null = null;
      // pontos dentro da caixa (miolo das letras), em coordenadas da tela
      for (const fx of [0.2, 0.5, 0.8]) for (const fy of [0.35, 0.65]) {
        const [px, py] = aplica(topo.m, x0 + fx * larg, y0 + fy * alt);
        let fundo = cartao, alta: Forma | null = null;
        for (const f of formas) {
          if (!f.inv) continue;
          const [lx, ly] = aplica(f.inv, px, py);
          if (f.dentro(lx, ly)) { const [c, al] = f.corEm(lx, ly); fundo = mistura(c, al, fundo); alta = f; }
        }
        const c = contraste(t.cor, fundo);
        if (c < pior) { pior = c; fundoPior = fundo; formaPior = alta; }
      }
      res.push({ texto: s, cor: t.cor, forma: formaPior, fundo: fundoPior, contraste: pior });
      continue;
    }
    const [, fecha, tag0, resto, auto] = m;
    const tag = tag0.toLowerCase();
    if (fecha) { if (pilha.length > 1 && !/^(br)$/.test(tag)) pilha.pop(); continue; }
    if (tag.startsWith('!') || tag.startsWith('?')) continue;
    const a = atributos(resto);
    let mm = mult(topo.m, transforma(a.transform));
    if (tag === 'svg' && pilha.length > 1) {
      // <svg> dentro da figura (ilustração encaixada): x/y/width/height + viewBox, xMidYMid meet
      const vb = nums(a.viewBox || '');
      const [x, y, w, h] = ['x', 'y', 'width', 'height'].map((k) => parseFloat(a[k] ?? '0') || 0);
      if (vb.length === 4 && vb[2] > 0 && vb[3] > 0 && w > 0 && h > 0) {
        const e = Math.min(w / vb[2], h / vb[3]);
        mm = mult(mm, [e, 0, 0, e, x + (w - vb[2] * e) / 2 - vb[0] * e, y + (h - vb[3] * e) / 2 - vb[1] * e]);
      } else mm = mult(mm, [1, 0, 0, 1, x, y]);
    }
    const op = topo.op * (a.opacity !== undefined ? parseFloat(a.opacity) : 1);
    const oculto = topo.oculto || /^(defs|clippath|marker|mask|pattern|symbol|lineargradient|radialgradient|title|desc|metadata)$/.test(tag) || a.display === 'none' || a.visibility === 'hidden';
    const ehTexto = tag === 'text' || tag === 'tspan';
    const fill = corDe(a, topo.fill, ehTexto);
    const ctx: Ctx = { m: mm, op, fill, oculto, tag };
    if (ehTexto) {
      const p = topo.textoAt;
      const fsTxt = a['font-size'] ? parseFloat(a['font-size']) : p?.fs ?? 16;
      const cor = fill === null ? corTexto : fill;
      ctx.textoAt = {
        x: a.x !== undefined ? nums(a.x)[0] : (p?.x ?? 0) + (a.dx ? nums(a.dx)[0] : 0),
        y: a.y !== undefined ? nums(a.y)[0] : (p?.y ?? 0) + (a.dy ? nums(a.dy)[0] : 0),
        fs: isNaN(fsTxt) ? 16 : fsTxt,
        anc: a['text-anchor'] ?? p?.anc ?? 'start',
        base: a['dominant-baseline'] ?? p?.base ?? 'auto',
        cor: cor === 'none' ? 'none' : troca(cor),
      };
    } else if (!oculto && /^(rect|circle|ellipse|polygon|path)$/.test(tag) && fill && fill !== 'none') {
      const alfa = op * (a['fill-opacity'] !== undefined ? parseFloat(a['fill-opacity']) : 1);
      let dentro: (x: number, y: number) => boolean;
      let caixa: [number, number, number, number]; // x, y, largura, altura (para o degradê)
      const n = (k: string) => parseFloat(a[k] ?? '0') || 0;
      if (tag === 'rect') { const [x, y, w, h] = [n('x'), n('y'), n('width'), n('height')]; caixa = [x, y, w, h]; dentro = (px, py) => px >= x && px <= x + w && py >= y && py <= y + h; }
      else if (tag === 'circle') { const [cx, cy, r] = [n('cx'), n('cy'), n('r')]; caixa = [cx - r, cy - r, 2 * r, 2 * r]; dentro = (px, py) => (px - cx) ** 2 + (py - cy) ** 2 <= r * r; }
      else if (tag === 'ellipse') { const [cx, cy, rx, ry] = [n('cx'), n('cy'), n('rx'), n('ry')]; caixa = [cx - rx, cy - ry, 2 * rx, 2 * ry]; dentro = (px, py) => rx > 0 && ry > 0 && ((px - cx) / rx) ** 2 + ((py - cy) / ry) ** 2 <= 1; }
      else {
        let ps: [number, number][][];
        if (tag === 'polygon') { const v = nums(a.points || ''); const p: [number, number][] = []; for (let i = 0; i + 1 < v.length; i += 2) p.push([v[i], v[i + 1]]); ps = [p]; }
        else ps = verticesPath(a.d || '');
        const xs = ps.flat().map((p) => p[0]), ys = ps.flat().map((p) => p[1]);
        caixa = xs.length ? [Math.min(...xs), Math.min(...ys), Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)] : [0, 0, 0, 0];
        dentro = (px, py) => dentroPoligonos(ps, px, py);
      }
      const al = Math.min(1, alfa);
      const g = fill.startsWith('url:') ? degs.get(fill.slice(4))! : null;
      const corEm = (px: number, py: number): [string, number] => {
        if (!g) return [fill, al];
        const u = caixa[2] ? (px - caixa[0]) / caixa[2] : 0.5, v = caixa[3] ? (py - caixa[1]) / caixa[3] : 0.5;
        const t = g.radial ? Math.min(1, Math.hypot(u - g.cx, v - g.cy) / (g.r || 1)) : Math.max(0, Math.min(1, u));
        const [c, ga] = corDoDegrade(g, t);
        return [c, al * ga];
      };
      if (alfa > 0) formas.push({ ini: m.index, fim: m.index + m[0].length, tag, cor: g ? '' : fill, alfa: al, inv: inversa(mm), dentro, corEm });
    }
    if (!auto) pilha.push(ctx);
  }
  return res;
}

/**
 * Letra escura sobre forma colorida abaixo de 4,5:1: a forma fica mais opaca (de 0,05 em 0,05) e, se nem opaca basta,
 * um pouco mais clara (misturada com branco). Só a forma de cima, atrás da letra; o resto da figura não muda.
 */
function reforcaEtiquetas(svg: string, cartao: string): string {
  const ajustes = new Map<Forma, { alfa: number; cor: string }>();
  for (const t of fundosDosTextos(svg, cartao)) {
    if (t.cor !== LETRA_ESCURA_FIG || t.contraste >= ALVO_FIGURA || !t.forma || !t.forma.cor) continue;
    const f = t.forma;
    // fundo atrás da forma, nesse ponto: desfaz a mistura dela
    const atras = (() => {
      const [fr, fg, fb] = [1, 3, 5].map((i) => parseInt(t.fundo.slice(i, i + 2), 16));
      const [cr, cg, cb] = [1, 3, 5].map((i) => parseInt(f.cor.slice(i, i + 2), 16));
      const des = (v: number, c: number) => (f.alfa >= 1 ? 0 : Math.max(0, Math.min(255, (v - c * f.alfa) / (1 - f.alfa))));
      return '#' + [des(fr, cr), des(fg, cg), des(fb, cb)].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
    })();
    let alfa = f.alfa, cor = f.cor;
    while (alfa < 1 && contraste(LETRA_ESCURA_FIG, mistura(cor, alfa, atras)) < ALVO_FIGURA + 0.05) alfa = Math.min(1, Math.round((alfa + 0.05) * 100) / 100);
    for (let k = 1; k <= 100 && contraste(LETRA_ESCURA_FIG, mistura(cor, alfa, atras)) < ALVO_FIGURA + 0.05; k++) cor = mistura('#FFFFFF', k / 100, f.cor);
    const ant = ajustes.get(f);
    if (!ant || alfa > ant.alfa || cor !== ant.cor) ajustes.set(f, { alfa: Math.max(alfa, ant?.alfa ?? 0), cor: ant && contraste('#FFFFFF', ant.cor) < contraste('#FFFFFF', cor) ? ant.cor : cor });
  }
  if (!ajustes.size) return svg;
  let out = '', pos = 0;
  for (const [f, { alfa, cor }] of [...ajustes].sort((x, y) => x[0].ini - y[0].ini)) {
    let el = svg.slice(f.ini, f.fim);
    // a opacidade herdada de <g opacity> não muda: o ajuste vai no fill-opacity da própria forma
    const op = f.alfa / (parseFloat(/fill-opacity="([^"]*)"/.exec(el)?.[1] ?? '1') || 1);
    const fo = Math.min(1, +(alfa / op).toFixed(2));
    el = /fill-opacity="[^"]*"/.test(el) ? el.replace(/fill-opacity="[^"]*"/, `fill-opacity="${fo}"`) : el.replace(/^<[\w:-]+/, (t) => `${t} fill-opacity="${fo}"`);
    if (cor !== f.cor) el = el.replace(/(\sfill=")[^"]*"/i, `$1${cor}"`);
    out += svg.slice(pos, f.ini) + el;
    pos = f.fim;
  }
  return out + svg.slice(pos);
}

/** SVG com a paleta escura (o <style> muda; formas atrás de letra escura podem ficar mais opacas), ou null se a figura
 *  não tem as duas paletas */
export function svgEscuro(svg: string, cartao = CARTAO_BIO_ESCURO): string | null {
  const m = /<style>([\s\S]*?)<\/style>/.exec(svg);
  if (!m) return null;
  const est = m[1];
  const i = est.indexOf(MEDIA_CLARO);
  if (i <= 0) return null;
  // o que vem antes do @media é a paleta escura; o @media e a cópia dele sem @media são a clara
  const escuro = est.slice(0, i);
  if (!/svg\{color:#[0-9A-F]{6}\}/i.test(escuro)) return null;
  const novo = svg.slice(0, m.index) + `<style>${escuro}${AJUSTE_ESCURO}</style>` + svg.slice(m.index + m[0].length);
  return reforcaEtiquetas(novo, cartao);
}

const cache = new Map<string, string | null>();

/** data URI da figura com a paleta escura, ou null (a figura serve aos dois temas) */
export function figuraEscura(u: string): string | null {
  if (cache.has(u)) return cache.get(u)!;
  const svg = decodifica(u);
  const esc = svg && svg.includes(MEDIA_CLARO) ? svgEscuro(svg) : null;
  const r = esc ? 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(esc) : null;
  cache.set(u, r);
  return r;
}

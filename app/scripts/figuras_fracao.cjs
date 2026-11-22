/*
 * Revisão de 21/11/2026 (matérias N1): fração empilhada e expoente sobrescrito no texto desenhado das figuras de teoria.
 *
 * CLAUDE.md: "Fração sempre empilhada: numerador em cima, barra, denominador embaixo — nunca 3/5 na mesma linha".
 * As figuras vêm de app-atual/<m>/img/<tema>.json, que não se altera. Este programa lê essas figuras, troca só as linhas
 * de texto listadas em app/conteudo-fonte/figuras-corrigidas/marcacao.json e grava a figura refeita em
 * app/conteudo-fonte/figuras-corrigidas/<m>/<tema>.json. O converte.py usa essa versão no lugar da original.
 *
 * O resto da figura fica idêntico: mesmos traços, mesmas cores, mesma fonte, mesma posição de cada linha (a linha nova
 * ocupa o mesmo ponto de ancoragem da antiga). Cada trecho de texto vira um <text> centrado no próprio meio, para que a
 * diferença de largura da fonte do sistema entre aparelhos se divida para os dois lados, sem encavalar.
 *
 * Conferência de valores: a marcação, lida em linha (fração vira a/b), tem de ser igual ao texto original fora
 * parênteses e espaços; se não for, o programa para.
 *
 * Uso (de dentro de app/): node scripts/figuras_fracao.cjs [--previa <arquivo.html>]
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { chromium } = require('playwright');

const APP = path.resolve(__dirname, '..');
const RAIZ = path.resolve(APP, '..');
const PASTA = path.join(APP, 'conteudo-fonte', 'figuras-corrigidas');
const SIMBOLO = "'DejaVu Sans','Noto Sans Math','Noto Sans Symbols','Segoe UI Symbol','Apple Symbols',sans-serif";

// ---------- marcação ----------
function analisa(s) {
  let i = 0;
  function grupo(paradas) {
    const nos = [];
    let txt = '';
    const solta = () => { if (txt) { nos.push({ t: 'txt', s: txt }); txt = ''; } };
    while (i < s.length) {
      const c = s[i];
      if (paradas.includes(c)) break;
      if (c === '\\') {
        const cmd = s[i + 1];
        if ((cmd === 's' || cmd === 'T') && s[i + 2] === '{') {
          solta();
          i += 3;
          const fim = s.indexOf('}', i);
          nos.push({ t: cmd === 's' ? 'sym' : 'alto', s: s.slice(i, fim) });
          i = fim + 1;
          continue;
        }
        throw new Error('marcação inválida: ' + s);
      }
      if ((c === '^' || c === '_') && s[i + 1] === '{') {
        solta();
        i += 2;
        const c2 = grupo(['}']);
        i++;
        nos.push({ t: c === '^' ? 'sup' : 'sub', c: c2 });
        continue;
      }
      if (c === '{') {
        solta();
        i++;
        const n = grupo(['¦']);
        if (s[i] !== '¦') throw new Error('fração sem ¦: ' + s);
        i++;
        const d = grupo(['}']);
        i++;
        nos.push({ t: 'frac', n, d });
        continue;
      }
      txt += c;
      i++;
    }
    solta();
    return nos;
  }
  const r = grupo([]);
  if (i !== s.length) throw new Error('marcação com chave sobrando: ' + s);
  return r;
}

function emLinha(nos) {
  return nos.map((n) => {
    if (n.t === 'txt' || n.t === 'sym' || n.t === 'alto') return n.s;
    if (n.t === 'sup' || n.t === 'sub') return emLinha(n.c);
    return emLinha(n.n) + '/' + emLinha(n.d);
  }).join('');
}

const desescapa = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
const escapa = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const textoPuro = (html) => desescapa(html.replace(/<[^>]+>/g, ''));
const exato = (s) => s.replace(/ⁿ/g, 'n').replace(/\s+/g, ' ').trim();
const solto = (s) => exato(s).replace(/[\s()[\]]/g, '');

// ---------- medidas ----------
function attrs(tag) {
  const o = {};
  for (const m of tag.matchAll(/([\w:-]+)=(?:"([^"]*)"|'([^']*)')/g)) o[m[1]] = m[2] !== undefined ? m[2] : m[3];
  return o;
}
// propriedades de texto que podem vir no atributo ou no style="" (o style manda, como no navegador)
const PROPS_FONTE = ['font-size', 'font-family', 'font-style', 'text-anchor', 'dominant-baseline'];
function leTexto(tag) {
  const a = attrs(tag);
  const est = [];
  for (const d of (a.style || '').split(';')) {
    const i = d.indexOf(':');
    if (i > 0) est.push([d.slice(0, i).trim(), d.slice(i + 1).trim()]);
  }
  const ef = (k) => { const e = est.filter(([n]) => n === k).pop(); return e ? e[1] : a[k]; };
  const tam = parseFloat(ef('font-size') || '16');
  const fonte = { family: ef('font-family') || 'sans-serif', weight: ef('font-weight') || 'normal', style: ef('font-style') || 'normal' };
  return { a, est, ef, tam, fonte };
}

// folhas a medir: [texto, família, peso, estilo, tamanho]
function folhas(nos, fonte, tam, out, dentro) {
  out.push([' ', fonte, tam]);
  for (const n of nos) {
    if (n.t === 'txt' || n.t === 'sym') {
      const f = n.t === 'sym' ? { ...fonte, family: SIMBOLO, style: 'normal' } : fonte;
      const s = n.s.replace(/\s+/g, ' ').trim();
      if (s) out.push([s, f, tam]);
      out.push([' ', f, tam]);
    } else if (n.t === 'alto') out.push([n.s, fonte, tam * ALTO]);
    else if (n.t === 'sup' || n.t === 'sub') folhas(n.c, fonte, tam * IND, out, true);
    else { const p = tamParte(tam, dentro); folhas(n.n, fonte, p, out, true); folhas(n.d, fonte, p, out, true); }
  }
}
const chave = (s, f, tam) => [s, f.family, f.weight, f.style, Math.round(tam * 100) / 100].join('\u0001');

// ---------- diagramação ----------
const FR = 0.78; // tamanho de numerador e denominador
const FR_DENTRO = 0.9; // fração dentro de expoente, índice ou outra fração: já está menor, encolhe menos
// numerador e denominador nunca abaixo de 11,5 px (nem acima do texto de fora): legível no celular
const tamParte = (tam, dentro) => Math.max(tam * (dentro ? FR_DENTRO : FR), Math.min(tam, 11.5));
const IND = 0.68; // expoente e índice (igual ao do original: 14,96 / 22)
const ALTO = 1.32; // parêntese, colchete e raiz em volta de fração
const DESCE = /[()[\]{}|gjpqyçQ,;]/;

function diagrama(nos, fonte, tam, base, larg, dentro) {
  // devolve { w, itens: [{tipo:'t', x (meio), y (linha de base relativa), s, tam, fonte} | {tipo:'l', x1, x2, y, esp}] }
  let x = 0;
  const itens = [];
  const espaco = larg(' ', fonte, tam);
  for (const n of nos) {
    if (n.t === 'txt' || n.t === 'sym') {
      const f = n.t === 'sym' ? { ...fonte, family: SIMBOLO, style: 'normal' } : fonte;
      const bruto = n.s.replace(/\s+/g, ' ');
      const ini = bruto.startsWith(' ') ? 1 : 0;
      const fim = bruto.endsWith(' ') && bruto.trim() ? 1 : 0;
      const s = bruto.trim();
      x += ini * espaco;
      if (s) {
        const w = larg(s, f, tam);
        itens.push({ tipo: 't', x: x + w / 2, y: base, s, tam, fonte: f });
        x += w;
      }
      x += fim * espaco;
    } else if (n.t === 'alto') {
      const t2 = tam * ALTO;
      const w = larg(n.s, fonte, t2);
      // o meio do sinal alto (cerca de 0,28 do corpo acima da base) fica no eixo da fração (0,30 do corpo de fora)
      itens.push({ tipo: 't', x: x + w / 2, y: base - 0.30 * tam + 0.28 * t2, s: n.s, tam: t2, fonte });
      x += w;
    } else if (n.t === 'sup' || n.t === 'sub') {
      const t2 = tam * IND;
      const dy = n.t === 'sup' ? -0.42 * tam : 0.26 * tam;
      const r = diagrama(n.c, fonte, t2, base + dy, larg, true);
      for (const it of r.itens) itens.push(desloca(it, x));
      x += r.w + 0.04 * tam;
    } else {
      const p = tamParte(tam, dentro);
      const eixo = base - 0.30 * tam;
      const lin = (l) => emLinha(l);
      const baseN = eixo - 0.11 * tam - (DESCE.test(lin(n.n)) ? 0.21 * p : 0.03 * p);
      const baseD = eixo + 0.11 * tam + 0.74 * p;
      const rn = diagrama(n.n, fonte, p, baseN, larg, true);
      const rd = diagrama(n.d, fonte, p, baseD, larg, true);
      // fração dentro do numerador ou do denominador (revisão de 21/11/2026, matérias-2 R2: "64 sobre ½"): a parte
      // interna é mais alta que uma linha só; afasta-a da barra principal pela altura real, para nada encostar na barra
      const aninhada = n.n.some((x) => x.t === 'frac') || n.d.some((x) => x.t === 'frac');
      if (aninhada) {
        const folga = 0.16 * tam;
        const topoD = Math.min(...rd.itens.map((it) => (it.tipo === 't' ? it.y - 0.74 * it.tam : it.y - it.esp / 2)));
        const fundoN = Math.max(...rn.itens.map((it) => (it.tipo === 't' ? it.y + (DESCE.test(it.s) ? 0.21 : 0.03) * it.tam : it.y + it.esp / 2)));
        const descer = Math.max(0, eixo + folga - topoD), subir = Math.max(0, fundoN - (eixo - folga));
        for (const it of rd.itens) it.y += descer;
        for (const it of rn.itens) it.y -= subir;
      }
      // barra principal bem mais larga que a da fração interna, para se ver qual divide qual
      const sobra = (aninhada ? 0.24 : 0.10) * tam;
      const w = Math.max(rn.w, rd.w) + 2 * sobra;
      for (const it of rn.itens) itens.push(desloca(it, x + (w - rn.w) / 2));
      for (const it of rd.itens) itens.push(desloca(it, x + (w - rd.w) / 2));
      const negrito = /^(bold|[6-9]00)$/.test(fonte.weight || '');
      itens.push({ tipo: 'l', x1: x + 0.05 * tam, x2: x + w - 0.05 * tam, y: eixo, esp: Math.max(1.2, tam * (negrito ? 0.075 : 0.06)) });
      x += w;
    }
  }
  return { w: x, itens };
}
function desloca(it, dx) {
  return it.tipo === 't' ? { ...it, x: it.x + dx } : { ...it, x1: it.x1 + dx, x2: it.x2 + dx };
}

const r2 = (v) => String(Math.round(v * 100) / 100);

function monta(tagAbre, nos, larg, desce) {
  const { a, est, ef, tam, fonte } = leTexto(tagAbre);
  const r = diagrama(nos, fonte, tam, 0, larg);
  const x = parseFloat(a.x || '0');
  // dominant-baseline="middle": o y do original é o meio da letra; aqui cada trecho usa a linha de base
  const meio = /^(middle|central)$/.test(ef('dominant-baseline') || '');
  const y = parseFloat(a.y || '0') + (desce || 0) + (meio ? 0.30 * tam : 0);
  const ancora = ef('text-anchor') || 'start';
  const x0 = ancora === 'middle' ? x - r.w / 2 : ancora === 'end' ? x - r.w : x;
  const fora = new Set(['x', 'y', 'style', ...PROPS_FONTE]);
  const resto = Object.entries(a).filter(([k]) => !fora.has(k));
  const estilo = est.filter(([k]) => !PROPS_FONTE.includes(k)).map(([k, v]) => `${k}: ${v}`).join('; ');
  const halo = !!a.stroke;
  const partes = [];
  for (const it of r.itens) {
    if (it.tipo === 't') {
      const extra = resto.map(([k, v]) => {
        if (k === 'stroke-width') return ` ${k}="${r2(parseFloat(v) * it.tam / tam)}"`; // contorno na mesma proporção
        return ` ${k}="${v}"`;
      }).join('') + (estilo ? ` style="${estilo}"` : '');
      const estiloFonte = it.fonte.style !== 'normal' || ef('font-style') ? ` font-style="${it.fonte.style}"` : '';
      partes.push(`<text x="${r2(x0 + it.x)}" y="${r2(y + it.y)}" font-size="${r2(it.tam)}" text-anchor="middle" font-family="${it.fonte.family}"${estiloFonte}${extra}>${escapa(it.s)}</text>`);
    } else {
      const cor = halo ? a.stroke : ef('fill') || '#000';
      const esp = halo ? it.esp + parseFloat(a['stroke-width'] || '0') : it.esp;
      const op = a.opacity ? ` opacity="${a.opacity}"` : '';
      const tr = a.transform ? ` transform="${a.transform}"` : '';
      partes.push(`<line x1="${r2(x0 + it.x1)}" y1="${r2(y + it.y)}" x2="${r2(x0 + it.x2)}" y2="${r2(y + it.y)}" stroke="${cor}" stroke-width="${r2(esp)}" stroke-linecap="${halo ? 'round' : 'butt'}"${op}${tr}/>`);
    }
  }
  return `<g>${partes.join('')}</g>`;
}

// ---------- principal ----------
// \\y{n} no começo da linha: desce (n > 0) ou sobe a linha n px, só onde a fração empilhada encostaria no vizinho
function linha(s) {
  const m = s.match(/^\\y\{(-?[\d.]+)\}/);
  const resto = m ? s.slice(m[0].length) : s;
  return { s, nos: analisa(resto), dy: m ? parseFloat(m[1]) : 0 };
}
function decodifica(u) {
  const [cab, dados] = u.split(',', 2);
  return cab.includes(';base64') ? Buffer.from(dados, 'base64').toString('utf8') : decodeURIComponent(dados);
}
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex').slice(0, 16);

async function principal() {
  const marc = JSON.parse(fs.readFileSync(path.join(PASTA, 'marcacao.json'), 'utf8'));
  const trabalhos = []; // {m, mod, idx, fig, svg, linhas:[{markup, nos}]}
  const usados = new Set();
  for (const m of Object.keys(marc).filter((k) => !k.startsWith('_'))) {
    const pasta = path.join(RAIZ, 'app-atual', m, 'img');
    for (const arq of fs.readdirSync(pasta).filter((f) => f.endsWith('.json')).sort()) {
      const lista = JSON.parse(fs.readFileSync(path.join(pasta, arq), 'utf8'));
      lista.forEach((fig, idx) => {
        const linhas = marc[m][fig.t];
        if (!linhas || !String(fig.u).startsWith('data:image/svg')) return;
        usados.add(m + '\u0001' + fig.t);
        trabalhos.push({ m, mod: arq.slice(0, -5), idx, fig, svg: decodifica(fig.u), linhas: linhas.map(linha) });
      });
    }
    for (const t of Object.keys(marc[m])) if (!usados.has(m + '\u0001' + t)) throw new Error(`${m}: figura "${t}" não existe em app-atual`);
  }

  // casa cada <text> com uma linha da marcação
  const RE_TEXT = /(<text\b[^>]*>)([\s\S]*?)<\/text>/g;
  const medir = [];
  for (const tb of trabalhos) {
    tb.trocas = [];
    const usadas = new Set();
    for (const mt of tb.svg.matchAll(RE_TEXT)) {
      const puro = textoPuro(mt[2]);
      let achou = tb.linhas.filter((l) => exato(emLinha(l.nos)) === exato(puro));
      if (!achou.length) achou = tb.linhas.filter((l) => solto(emLinha(l.nos)) === solto(puro));
      if (achou.length > 1) throw new Error(`${tb.mod} "${tb.fig.t}": "${puro}" casa com mais de uma linha`);
      if (!achou.length) continue;
      usadas.add(achou[0].s);
      tb.trocas.push({ ini: mt.index, fim: mt.index + mt[0].length, abre: mt[1], nos: achou[0].nos, dy: achou[0].dy, puro });
      const lt = leTexto(mt[1]);
      folhas(achou[0].nos, lt.fonte, lt.tam, medir);
    }
    for (const l of tb.linhas) if (!usadas.has(l.s)) throw new Error(`${tb.mod} "${tb.fig.t}": a linha "${l.s}" não casou com nenhum texto da figura`);
  }

  // mede no navegador, com a mesma fonte que a figura pede
  const navegador = await chromium.launch();
  const pagina = await navegador.newPage();
  await pagina.setContent('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"></svg>');
  const unicos = new Map();
  for (const [s, f, tam] of medir) unicos.set(chave(s, f, tam), [s, f, tam]);
  const larguras = await pagina.evaluate((lista) => {
    const svg = document.querySelector('svg');
    const out = {};
    for (const [k, s, f, tam] of lista) {
      const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t.setAttribute('font-family', f.family);
      t.setAttribute('font-weight', f.weight);
      t.setAttribute('font-style', f.style);
      t.setAttribute('font-size', String(tam));
      t.setAttribute('style', 'white-space:pre');
      t.textContent = s;
      svg.appendChild(t);
      out[k] = t.getComputedTextLength();
      svg.removeChild(t);
    }
    return out;
  }, [...unicos.entries()].map(([k, [s, f, tam]]) => [k, s, f, tam]));
  const larg = (s, f, tam) => {
    const v = larguras[chave(s, f, tam)];
    if (v === undefined) throw new Error('sem medida: ' + s);
    return v;
  };

  // monta e grava por matéria/tema
  const saida = {};
  for (const tb of trabalhos) {
    let svg = tb.svg;
    for (const tr of [...tb.trocas].sort((a, b) => b.ini - a.ini)) svg = svg.slice(0, tr.ini) + monta(tr.abre, tr.nos, larg, tr.dy) + svg.slice(tr.fim);
    const k = tb.m + '/' + tb.mod;
    (saida[k] = saida[k] || []).push({ t: tb.fig.t, orig: sha(tb.fig.u), u: 'data:image/svg+xml;base64,' + Buffer.from(svg, 'utf8').toString('base64') });
    tb.novo = svg;
  }
  // limpa as saídas antigas e grava as novas
  for (const m of Object.keys(marc).filter((k) => !k.startsWith('_'))) {
    const p = path.join(PASTA, m);
    if (fs.existsSync(p)) for (const f of fs.readdirSync(p)) if (f.endsWith('.json')) fs.unlinkSync(path.join(p, f));
  }
  for (const [k, lista] of Object.entries(saida)) {
    const p = path.join(PASTA, k + '.json');
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, JSON.stringify(lista, null, 1) + '\n');
  }
  const porMateria = {};
  for (const tb of trabalhos) porMateria[tb.m] = (porMateria[tb.m] || 0) + 1;
  console.log('figuras refeitas (contando as repetidas em mais de um tema):', porMateria);

  const iPrevia = process.argv.indexOf('--previa');
  if (iPrevia > 0) {
    const arq = process.argv[iPrevia + 1];
    const blocos = trabalhos.map((tb, n) => `<section id="f${n}"><h2>${tb.m} ${tb.mod}#${tb.idx} ${escapa(tb.fig.t)}</h2><div class="par"><div class="c claro"><img src="data:image/svg+xml;base64,${Buffer.from(tb.svg).toString('base64')}"><img src="data:image/svg+xml;base64,${Buffer.from(tb.novo).toString('base64')}"></div><div class="c escuro"><img src="data:image/svg+xml;base64,${Buffer.from(tb.novo).toString('base64')}"></div></div></section>`).join('\n');
    fs.writeFileSync(arq, `<!doctype html><meta charset="utf-8"><style>body{font-family:sans-serif;margin:0;background:#eee}section{padding:8px;border-bottom:2px solid #999}h2{font-size:14px;margin:4px}.par{display:flex;gap:8px}.c{display:flex;gap:8px;padding:10px;border-radius:10px}.claro{background:#FCFAF5}.escuro{background:#24201A}img{width:640px;height:auto;display:block}</style>${blocos}`);
    console.log('prévia:', arq, trabalhos.length, 'figuras');
  }
  await navegador.close();
}

principal().catch((e) => { console.error(e.message || e); process.exit(1); });

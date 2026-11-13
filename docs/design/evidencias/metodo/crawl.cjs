// uso: node crawl.cjs <largura> <claro|escuro>
// Inventário de estilos computados por tela. Saída: out/<largura>-<tema>.jsonl (+ capturas jpg em shots/)
const { chromium } = require('playwright');
const fs = require('fs');
const S = __dirname;
const W = Number(process.argv[2]); const TEMA = process.argv[3];
const H = { 390: 844, 768: 1024, 1280: 800, 1440: 900 }[W];
const picks = JSON.parse(fs.readFileSync(S + '/picks.json', 'utf8'));
const MATS = ['bio', 'qui', 'mat', 'por', 'fis', 'geo', 'his', 'ing', 'fs'];
fs.mkdirSync(S + '/out', { recursive: true }); fs.mkdirSync(S + '/shots', { recursive: true });
const saida = S + `/out/${W}-${TEMA}.jsonl`; fs.writeFileSync(saida, '');

function coleta() {
  const VW = document.documentElement.clientWidth;
  const num = (s) => parseFloat(s) || 0;
  const parseCor = (s) => {
    if (!s) return null;
    let m = s.match(/^rgba?\(([^)]+)\)/);
    if (m) { const p = m[1].split(/[,\s\/]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]; }
    m = s.match(/^color\(srgb ([^)]+)\)/);
    if (m) { const p = m[1].split(/[\s\/]+/).filter(Boolean).map(Number); return [p[0] * 255, p[1] * 255, p[2] * 255, p.length > 3 ? p[3] : 1]; }
    return null;
  };
  const sobre = (c, f) => { const a = c[3]; return [c[0] * a + f[0] * (1 - a), c[1] * a + f[1] * (1 - a), c[2] * a + f[2] * (1 - a), 1]; };
  const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
  const hex = (c) => '#' + c.slice(0, 3).map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
  // fundo efetivo: sobe pelos ancestrais compondo cores translúcidas; para em imagem/gradiente (não medido)
  const fundo = (el) => {
    const pilha = []; let e = el; let img = false;
    while (e && e.nodeType === 1) {
      const cs = getComputedStyle(e);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') { img = true; }
      const c = parseCor(cs.backgroundColor);
      if (c && c[3] > 0) { pilha.push(c); if (c[3] >= 0.999 && !img) break; if (c[3] >= 0.999) break; }
      e = e.parentElement;
    }
    let base = [255, 255, 255, 1];
    for (let i = pilha.length - 1; i >= 0; i--) base = sobre(pilha[i], base);
    return { c: base, img };
  };
  const opac = (el) => { let o = 1; let e = el; while (e && e.nodeType === 1) { o *= num(getComputedStyle(e).opacity); e = e.parentElement; } return o; };
  const selDe = (el) => {
    const cls = (x) => (typeof x.className === 'string' ? x.className : (x.className && x.className.baseVal) || '').trim().split(/\s+/).filter((c) => c && !/^m-/.test(c)).slice(0, 2);
    const proprio = (x) => { const c = cls(x); return x.tagName.toLowerCase() + (c.length ? '.' + c.join('.') : ''); };
    const c = cls(el);
    if (c.length) return proprio(el);
    let p = el.parentElement; let passo = 0; let cam = el.tagName.toLowerCase();
    while (p && passo < 3) { if (cls(p).length) return proprio(p) + ' ' + cam; cam = p.tagName.toLowerCase() + '>' + cam; p = p.parentElement; passo++; }
    return cam;
  };
  const zona = (el) => (el.closest('.lado') ? 'casca' : el.closest('.topo') ? 'casca' : el.closest('.tabs') ? 'casca' : 'tela');
  const visivel = (el, cs, r) => r.width > 0.5 && r.height > 0.5 && cs.visibility !== 'hidden' && cs.display !== 'none' && !el.closest('.sr') && !el.closest('[hidden]') && !el.closest('[aria-hidden="true"].sr');
  const rolavelX = (el) => { let e = el.parentElement; while (e && e !== document.body) { const cs = getComputedStyle(e); if (/(auto|scroll|hidden|clip)/.test(cs.overflowX)) return true; e = e.parentElement; } return false; };
  const fixo = (el) => { let e = el; while (e && e.nodeType === 1) { const p = getComputedStyle(e).position; if (p === 'fixed') return true; e = e.parentElement; } return false; };

  const txt = new Map(), ctl = new Map(), rad = new Map(), sh = new Map(), bw = new Map(), pad = new Map(), mar = new Map(), gap = new Map();
  const medida = [], frac = [], emoji = [], fora = [], elip = [], semNome = [];
  const soma = (mapa, k, ex) => { const o = mapa.get(k); if (o) { o.n++; if (o.ex.length < 3 && !o.ex.includes(ex)) o.ex.push(ex); } else mapa.set(k, { n: 1, ex: [ex] }); };
  const todos = document.body.querySelectorAll('*');
  for (const el of todos) {
    const tag = el.tagName.toLowerCase();
    if (['script', 'style', 'noscript', 'path', 'g', 'defs', 'circle', 'line', 'rect', 'polyline', 'polygon', 'ellipse', 'use', 'clippath', 'lineargradient', 'stop', 'br'].includes(tag)) continue;
    const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
    if (!visivel(el, cs, r)) continue;
    if (opac(el) < 0.02) continue;
    const s = selDe(el); const z = zona(el);
    // caixas
    const rr = [cs.borderTopLeftRadius, cs.borderTopRightRadius, cs.borderBottomRightRadius, cs.borderBottomLeftRadius];
    const rtxt = rr.every((x) => x === rr[0]) ? rr[0] : rr.join(' ');
    if (rtxt !== '0px' && tag !== 'svg') soma(rad, z + '|' + rtxt, s);
    if (cs.boxShadow && cs.boxShadow !== 'none') soma(sh, z + '|' + cs.boxShadow, s);
    const larg = ['Top', 'Right', 'Bottom', 'Left'].map((l) => (cs['border' + l + 'Style'] !== 'none' ? num(cs['border' + l + 'Width']) : 0));
    const mb = Math.max(...larg); if (mb > 0) soma(bw, z + '|' + mb + 'px', s);
    for (const l of ['Top', 'Right', 'Bottom', 'Left']) { const v = num(cs['padding' + l]); if (v) soma(pad, z + '|' + (Math.round(v * 100) / 100) + 'px', s); const m2 = num(cs['margin' + l]); if (m2 && Math.abs(m2) < 400) soma(mar, z + '|' + (Math.round(m2 * 100) / 100) + 'px', s); }
    if (/flex|grid/.test(cs.display)) { for (const g of [cs.rowGap, cs.columnGap]) { const v = num(g); if (v) soma(gap, z + '|' + (Math.round(v * 100) / 100) + 'px', s); } }
    // fora da tela
    if ((r.right > VW + 1.5 || r.left < -1.5) && !rolavelX(el) && !fixo(el) && r.width < VW * 3) { if (fora.length < 12) fora.push(s + ' [' + Math.round(r.left) + '..' + Math.round(r.right) + ']'); }
    // texto
    let direto = ''; for (const n of el.childNodes) if (n.nodeType === 3) direto += n.nodeValue;
    direto = direto.replace(/\s+/g, ' ').trim();
    if (direto && tag !== 'option') {
      const fs_ = num(cs.fontSize); const fw = cs.fontWeight; const fam = cs.fontFamily.split(',')[0].replace(/["']/g, '').trim();
      const lh = cs.lineHeight === 'normal' ? 'normal' : (Math.round((num(cs.lineHeight) / fs_) * 100) / 100).toString();
      const ls = cs.letterSpacing === 'normal' ? '0' : (Math.round((num(cs.letterSpacing) / fs_) * 1000) / 1000) + 'em';
      const cor0 = parseCor(cs.color); const f = fundo(el); const o = opac(el);
      let cr = null; let corHex = cs.color;
      if (cor0) { const c1 = sobre([cor0[0], cor0[1], cor0[2], cor0[3] * o], f.c); corHex = hex(c1); const a = lum(c1), b = lum(f.c); cr = Math.round(((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)) * 100) / 100; }
      const grande = fs_ >= 24 || (fs_ >= 18.66 && Number(fw) >= 700);
      const k = [z, s, fam, fs_, fw, lh, ls, cs.textTransform, corHex, hex(f.c), f.img ? 'img' : '', cr, grande ? 'G' : '', cs.fontVariantNumeric.includes('tabular') ? 'tab' : '', cs.textAlign, cs.fontStyle].join('|');
      soma(txt, k, direto.slice(0, 40));
      if (cs.textOverflow === 'ellipsis' && el.scrollWidth > el.clientWidth + 1 && elip.length < 12) elip.push(s + ' «' + direto.slice(0, 50) + '»');
      if (cs.webkitLineClamp && cs.webkitLineClamp !== 'none' && el.scrollHeight > el.clientHeight + 2 && elip.length < 12) elip.push(s + ' (clamp ' + cs.webkitLineClamp + ') «' + direto.slice(0, 50) + '»');
      const tudo = el.textContent.replace(/\s+/g, ' ').trim();
      if (tudo.length >= 140 && !['div', 'section', 'article', 'main', 'ul', 'ol'].includes(tag) && cs.lineHeight !== 'normal') {
        const linhas = Math.round(r.height / num(cs.lineHeight)); if (linhas >= 3) medida.push({ s, fs: fs_, fam, cpl: Math.round(tudo.length / linhas), larg: Math.round(r.width) });
      }
      if (/\d\s?[\/÷]\s?\d/.test(direto) && !el.closest('.fr, .frac, .fracao, [class*="frac"]') && frac.length < 15) frac.push(s + ' [' + fam + '] «' + direto.slice(0, 70) + '»');
      if (/\p{Extended_Pictographic}/u.test(direto) && emoji.length < 10) emoji.push(s + ' «' + direto.slice(0, 40) + '»');
    }
    // controles
    if (el.matches('button, a[href], input, select, textarea, summary, [role=button], [role=tab], [tabindex]:not([tabindex="-1"])')) {
      const tipo = tag === 'input' ? 'input[' + el.type + ']' : tag;
      const nome = (el.getAttribute('aria-label') || '').trim() || (el.getAttribute('aria-labelledby') ? 'lb' : '') || el.textContent.replace(/\s+/g, ' ').trim() || (el.getAttribute('title') || '').trim() ||
        (el.querySelector('img[alt]') ? el.querySelector('img[alt]').alt : '') || (el.id && document.querySelector('label[for="' + el.id + '"]') ? 'label' : '') || (el.closest('label') ? 'label' : '');
      if (!nome && semNome.length < 10) semNome.push(s + (el.placeholder ? ' (só placeholder: ' + el.placeholder.slice(0, 30) + ')' : ''));
      const f = fundo(el);
      const k = [z, s, tipo, Math.round(r.width), Math.round(r.height), cs.paddingTop + ' ' + cs.paddingRight + ' ' + cs.paddingBottom + ' ' + cs.paddingLeft, rtxt, mb + 'px', cs.boxShadow === 'none' ? '' : 'sombra', num(cs.fontSize), cs.fontWeight, el.disabled ? 'dis' : '', cs.display, hex(parseCor(cs.backgroundColor) && parseCor(cs.backgroundColor)[3] > 0 ? sobre(parseCor(cs.backgroundColor), f.c) : f.c)].join('|');
      soma(ctl, k, (nome || '').slice(0, 30));
    }
  }
  const lista = (m) => [...m.entries()].map(([k, v]) => [k, v.n, v.ex]);
  return {
    vw: VW, sw: document.documentElement.scrollWidth, bodySw: document.body.scrollWidth,
    txt: lista(txt), ctl: lista(ctl), rad: lista(rad), sh: lista(sh), bw: lista(bw), pad: lista(pad), mar: lista(mar), gap: lista(gap),
    medida, frac, emoji, fora, elip, semNome,
    h1: [...document.querySelectorAll('h1')].filter((x) => x.getBoundingClientRect().width > 0).map((x) => x.textContent.trim().slice(0, 50)),
    niveis: [...document.querySelectorAll('.conteudo-wrap h1, .conteudo-wrap h2, .conteudo-wrap h3, .conteudo-wrap h4')].filter((x) => x.getBoundingClientRect().width > 0).map((x) => x.tagName[1]).join(''),
  };
}

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1, hasTouch: W < 800, reducedMotion: 'no-preference' });
  const erros = [];
  let p = await ctx.newPage(); p.on('pageerror', (e) => erros.push(e.message));
  const grava = async (nome, extra) => {
    await p.waitForTimeout(250);
    let d; try { d = await p.evaluate(coleta); } catch (e) { d = { erro: e.message }; }
    d.tela = nome; d.url = p.url().replace(/^[^#]*/, ''); d.w = W; d.tema = TEMA; if (extra) Object.assign(d, extra);
    fs.appendFileSync(saida, JSON.stringify(d) + '\n');
    try { await p.screenshot({ path: `${S}/shots/${W}-${TEMA}-${nome}.jpg`, type: 'jpeg', quality: 55, fullPage: true }); } catch (e) { /* sem captura */ }
  };
  const vai = async (h, espera = 900) => { await p.evaluate((h) => { location.hash = h; window.scrollTo(0, 0); }, h); try { await p.waitForLoadState('networkidle', { timeout: 6000 }); } catch (e) { /* segue */ } await p.waitForTimeout(espera); };
  const tenta = async (f) => { try { await f(); return true; } catch (e) { erros.push('acao: ' + e.message.split('\n')[0]); return false; } };
  const tema = async () => { await p.evaluate((t) => { try { const e = JSON.parse(localStorage.getItem('aprendice.v1')); if (e) { e.pref.tema = t; localStorage.setItem('aprendice.v1', JSON.stringify(e)); } } catch (e) { /* */ } document.documentElement.setAttribute('data-theme', t === 'escuro' ? 'dark' : 'light'); }, TEMA); };

  // 1. LOGIN e BOAS-VINDAS (sem estado)
  await p.goto('http://localhost:8911/'); await p.waitForTimeout(3600);
  await p.evaluate((t) => document.documentElement.setAttribute('data-theme', t === 'escuro' ? 'dark' : 'light'), TEMA);
  await grava('login');
  await tenta(async () => { await p.click('.l-botao'); await p.waitForTimeout(400); await p.evaluate((t) => document.documentElement.setAttribute('data-theme', t === 'escuro' ? 'dark' : 'light'), TEMA); await grava('login-erro'); });
  await tenta(async () => { await p.fill('#ent-email', 'teste@exemplo.com'); await p.fill('#ent-senha', '123456'); await p.click('.l-botao'); await p.waitForTimeout(1200); });
  await p.evaluate((t) => document.documentElement.setAttribute('data-theme', t === 'escuro' ? 'dark' : 'light'), TEMA);
  await grava('boasvindas-1');
  await tenta(async () => { await p.getByRole('button', { name: 'Continuar' }).first().click(); await p.waitForTimeout(800); });
  await p.evaluate((t) => document.documentElement.setAttribute('data-theme', t === 'escuro' ? 'dark' : 'light'), TEMA);
  await grava('boasvindas-2');
  await tenta(async () => { await p.getByRole('button', { name: 'Começar a estudar' }).first().click(); await p.waitForTimeout(1200); });
  await tema(); await p.reload(); await p.waitForTimeout(3600);

  // 2. ESTADOS VAZIOS (aluno novo)
  await vai('/'); await grava('inicio-vazio');
  await vai('/revisao'); await grava('revisao-vazia');
  await vai('/desempenho'); await grava('desempenho-vazio');
  await vai('/m/fis/flashcards'); await grava('flashcards-vazio-fis');
  await vai('/m/mat/q/nao-existe'); await grava('questao-nao-encontrada');

  // 3. MATÉRIAS
  await vai('/materias'); await grava('materias');
  for (const m of MATS) { await vai('/m/' + m, 1300); await grava('materia-' + m); }
  for (const m of MATS) { await vai('/m/' + m + '/tema/' + picks[m].mod, 1100); await grava('tema-' + m); }
  for (const m of ['mat', 'bio', 'por', 'fis']) { await vai('/m/' + m + '/escada/' + picks[m].sub, 1100); await grava('escada-' + m); }

  // 4. QUESTÃO: antes, selecionada, correção em 4 blocos, resolução
  for (const m of MATS) {
    const k = picks[m];
    await vai(`/m/${m}/q/${k.id}`, 1400);
    await grava('questao-' + m);
    const ok = await tenta(async () => {
      await p.locator('.q-acoes .alt, .alt').filter({ hasText: new RegExp('^' + k.errada) }).first().click({ timeout: 3000 });
      await p.waitForTimeout(250);
    });
    if (ok && m === 'mat') await grava('questao-mat-selecionada');
    await tenta(async () => { await p.locator('.btn-conf').first().click({ timeout: 3000 }); await p.waitForTimeout(900); });
    await grava('correcao-' + m);
    // resolução animada no estado final ("Ver sem animação") ou tocando
    if (['mat', 'bio', 'qui', 'fis'].includes(m)) {
      const viu = await tenta(async () => { await p.locator('.ra-link').first().click({ timeout: 2500 }); await p.waitForTimeout(900); });
      if (viu) await grava('resolucao-final-' + m);
    }
    // bloco 4 aberto
    await tenta(async () => { await p.locator('.cor-outras summary').first().click({ timeout: 2000 }); await p.waitForTimeout(400); });
    await grava('correcao-aberta-' + m);
    if (m === 'mat') {
      for (const aba of ['Teoria', 'Fonte']) { await tenta(async () => { await p.locator('.q-abas button', { hasText: aba }).first().click({ timeout: 2000 }); await p.waitForTimeout(500); }); await grava('questao-aba-' + aba.toLowerCase()); }
    }
  }
  // resolução animada tocando (barra de controles)
  await vai(`/m/mat/q/${picks.mat.id}`, 1200);
  await tenta(async () => { await p.locator('.alt').filter({ hasText: /^A/ }).first().click({ timeout: 3000 }); await p.locator('.btn-conf').first().click(); await p.waitForTimeout(700); await p.locator('.ra-assistir .btn').first().click({ timeout: 3000 }); await p.waitForTimeout(2500); });
  await grava('resolucao-tocando-mat');
  // questão pausada
  await vai(`/m/bio/q/${picks.bio.id}`, 1200);

  // 5. TREINOS
  await vai('/m/mat/treino', 1500); await grava('treino-mat');
  await vai('/treino-geral', 1500); await grava('treino-geral');
  await tenta(async () => { await p.locator('.alt').first().click({ timeout: 3000 }); await p.locator('.btn-conf').first().click(); await p.waitForTimeout(800); }); await grava('treino-geral-correcao');
  await vai('/hoje', 1300); await grava('hoje');

  // 6. FLASHCARDS
  await vai('/m/bio/flashcards', 1200); await grava('flashcards-lista');
  await vai('/m/bio/flashcards/sessao', 1200); await grava('flashcards-sessao');
  await tenta(async () => { await p.locator('.fc-acoes .btn.sec').first().click({ timeout: 3000 }); await p.waitForTimeout(700); }); await grava('flashcards-verso');
  await vai('/m/mat/flashcards/sessao', 1200); await grava('flashcards-sessao-mat');

  // 7. SIMULADOS
  await vai('/simulados', 1300); await grava('simulados');
  await vai('/simulados/prova/enem-2023', 1500); await grava('simulado-novo');
  await tenta(async () => { await p.locator('.conteudo-wrap .btn').first().click({ timeout: 3000 }); await p.waitForTimeout(1800); }); await grava('simulado-exec');

  // 8. REVISÃO
  await vai('/revisao', 1200); await grava('revisao-questoes');
  for (const aba of ['Flashcards', 'Marcadas', 'Conteúdos', 'Domínio']) { await tenta(async () => { await p.locator('.conteudo-wrap button', { hasText: new RegExp('^' + aba) }).first().click({ timeout: 2000 }); await p.waitForTimeout(600); }); await grava('revisao-' + aba.toLowerCase().normalize('NFD').replace(/[^a-z]/g, '')); }
  await vai('/m/fis/revisao/' + picks.fis.sub, 1500); await grava('revisao-slides-fis');
  await vai('/m/qui/essencial', 1200); await grava('essencial-lista-qui');
  await vai('/m/qui/essencial/Q01', 1500); await grava('essencial-qui');
  await tenta(async () => { await p.keyboard.press('ArrowRight'); await p.waitForTimeout(600); await p.keyboard.press('ArrowRight'); await p.waitForTimeout(600); }); await grava('essencial-qui-3');

  // 9. DEMAIS
  await vai('/desempenho', 1200); await grava('desempenho');
  await vai('/provas', 1200); await grava('provas');
  await vai('/provas/enem', 1200); await grava('prova-detalhe');
  await vai('/perfil', 1200); await grava('perfil');
  await vai('/config', 1000); await grava('config');
  await vai('/', 1500); await grava('inicio');
  // busca
  await tenta(async () => { await p.locator('.busca-btn').first().click({ timeout: 3000 }); await p.waitForTimeout(500); await p.keyboard.type('celula', { delay: 20 }); await p.waitForTimeout(900); }); await grava('busca-resultados');
  await tenta(async () => { for (let i = 0; i < 6; i++) await p.keyboard.press('Backspace'); await p.keyboard.type('zzqqxx', { delay: 20 }); await p.waitForTimeout(700); }); await grava('busca-vazia');
  await p.keyboard.press('Escape');
  // menu "Outras matérias" (computador)
  await tenta(async () => { await p.locator('.item-nav.outras').first().click({ timeout: 1500 }); await p.waitForTimeout(400); }); await grava('menu-outras');

  fs.appendFileSync(saida, JSON.stringify({ tela: '_erros', erros }) + '\n');
  const ls = await p.evaluate(() => JSON.stringify(Object.fromEntries(Object.entries(localStorage))));
  fs.writeFileSync(`${S}/out/ls-${W}-${TEMA}.json`, ls);
  await b.close();
  console.log(W, TEMA, 'ok', erros.length, 'erros');
})();

// Teste dos flashcards (30/10). Uso: node teste_flash.js <saida>
// O stub da IA (window.claude.use('sample')) e' injetado SO aqui, so na pagina principal; nao existe no codigo do app.
const { chromium } = require('playwright');
const fs = require('fs');
const OUT = process.argv[2] || '/tmp/fl';
fs.mkdirSync(OUT, { recursive: true });
const URL = 'http://localhost:8766/index.html';
const bioDados = JSON.parse(fs.readFileSync('/home/claude/esc_test/bio/dados.json', 'utf8'));
const IDS = bioDados.banco.slice(0, 3).map(q => q.id);
const CART = {}; for (const m of ['bio', 'qui', 'mat']) { const d = JSON.parse(fs.readFileSync('/home/claude/esc_test/' + m + '/dados.json', 'utf8')); (d.flash || []).forEach(c => CART[c.frente] = c); }

const STUB = `(() => {
  if (window.top !== window) return;
  window.__ia = [];
  const sample = function () { return Promise.reject({ code: 'invalid_request', message: 'stub' }); };
  sample.json = function (input, opts) {
    window.__ia.push({ input, opts });
    const resp = (input.split('<<<\\n')[1] || '').split('\\n>>>')[0];
    if (/LIMITE/.test(resp)) return Promise.reject({ code: 'rate_limited', message: 'stub' });
    if (/NEGA/.test(resp)) return Promise.reject({ code: 'not_granted', message: 'stub' });
    return new Promise(ok => setTimeout(() => {
      if (/QUASE/.test(resp)) ok({ veredito: 'quase', faltou: ['uma das ideias essenciais'], comentario: 'Você acertou a direção, mas faltou completar a ideia principal.' });
      else if (/ERRADO/.test(resp)) ok({ veredito: 'errado', faltou: ['o conceito central'], comentario: 'O que você escreveu troca o conceito: compare com a resposta-modelo.' });
      else ok({ veredito: 'certo', faltou: [], comentario: 'Certo: você disse com outras palavras exatamente a ideia essencial.' });
    }, 400));
  };
  window.claude = { use: (n) => Promise.resolve(n === 'sample' ? sample : null) };
})();`;

async function rodada(nome, vp, opts) {
  const log = { nome, erros: [], cons: [], passos: [] };
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, hasTouch: !!opts.toque, isMobile: !!opts.toque, colorScheme: 'light' });
  if (opts.ia) await ctx.addInitScript(STUB);
  if (opts.zeroPor) {   /* Portugues sem cartoes (como estava antes dos dados): tira D.flash da materia e do indice do shell */
    const tira = (t, re, f) => t.replace(re, (m0, a, b, c) => a + JSON.stringify(f(JSON.parse(b))).replace(/<\//g, '<\\/') + c);
    await ctx.route('http://localhost:8766/por/index.html', async r => { const resp = await r.fetch(); const t = tira(await resp.text(), /(<script id="dados" type="application\/json">)([\s\S]*?)(<\/script>)/, d => { delete d.flash; return d; }); await r.fulfill({ response: resp, body: t }); });
    await ctx.route('http://localhost:8766/index.html', async r => { const resp = await r.fetch(); const t = tira(await resp.text(), /(<script id="indice" type="application\/json">)([\s\S]*?)(<\/script>)/, d => { d.por.fl = []; return d; }); await r.fulfill({ response: resp, body: t }); });
  }
  const page = await ctx.newPage();
  page.on('pageerror', e => log.erros.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') log.cons.push(m.text()); });
  const shot = async (n) => page.screenshot({ path: `${OUT}/${nome}_${n}.png` });
  const P = (s) => log.passos.push(s);

  /* progresso antigo: 3 questoes respondidas em Biologia */
  await page.goto(URL); await page.waitForTimeout(500);
  const antigo = { q: {}, ult: IDS[0], sims: [], tema: null };
  IDS.forEach((id, i) => antigo.q[id] = { tent: [{ ts: Date.now() - 86400000 * 2 - i * 1000, ok: i !== 0, letra: 'A', seg: 30 }], rev: false });
  await page.evaluate(([v]) => { localStorage.setItem('saocamilo.bio.v1', v); localStorage.setItem('ad-tema', 'light'); }, [JSON.stringify(antigo)]);
  await page.reload(); await page.waitForTimeout(1200);

  const linha = page.locator('#painel .lin-hoje[data-cmd="flash"]');
  P('linha Flashcards de hoje: ' + (await linha.count() ? (await linha.innerText()).replace(/\s+/g, ' ') : 'AUSENTE'));
  await shot('01_inicio');
  if (opts.toque) { await page.locator('#painel .lin-hoje[data-cmd="flash"]').scrollIntoViewIfNeeded(); await shot('01b_inicio_linha'); }
  await linha.click();
  const mat = await linha.getAttribute('data-m');
  const fr = page.frameLocator(`iframe[data-m="${mat}"]`);
  await fr.locator('.ad-fl-capa').waitFor({ timeout: 15000 });
  await page.waitForTimeout(600);
  P('materia aberta: ' + mat + ' · capa: ' + (await fr.locator('.ad-fl-nums').innerText()).replace(/\s+/g, ' '));
  await shot('02_home');
  /* filtros: area e tema */
  const areas = fr.locator('.ad-fl-areas [data-fa]');
  P('areas: ' + await areas.count());
  await areas.nth(2).click(); await page.waitForTimeout(300);
  await fr.locator('.ad-fl-m[data-fm]').nth(1).click(); await page.waitForTimeout(400);
  P('filtro tema: ' + (await fr.locator('.ad-mp-comp').innerText().catch(() => '-')));
  await shot('03_filtros');
  await fr.locator('.ad-fl-areas [data-fa=""]').click(); await page.waitForTimeout(300);
  await fr.locator('#ad-fl-comecar').scrollIntoViewIfNeeded();
  await fr.locator('#ad-fl-comecar').click();
  await fr.locator('.ad-fl-card').waitFor();
  await page.waitForTimeout(300);
  await shot('04_cartao');

  const respostas = opts.ia
    ? [['certo', c => 'com outras palavras: ' + c.verso.split(' ').slice(0, 12).join(' ')], ['quase', c => 'QUASE ' + c.verso.split(' ').slice(0, 4).join(' ')], ['errado', c => 'ERRADO nao lembro direito'], ['limite', c => 'LIMITE ' + c.verso], ['naosei', null], ['nega', c => 'NEGA ' + c.verso], ['depois_nega', c => c.verso]]
    : [['exato', c => c.verso], ['outras', c => (c.aceita && c.aceita[0]) || c.verso], ['vazio_errado', c => 'não sei bem, acho que é outra coisa'], ['naosei', null]];
  let k = 0;
  for (const [tipo, f] of respostas) {
    k++;
    const frente = await fr.locator('#ad-fl-frente').innerText();
    const c = CART[frente] || { verso: 'x', essencial: [] };
    if (f) {
      await fr.locator('#ad-fl-resp').fill(f(c));
      await fr.locator('#ad-fl-resp').press('Enter');
    } else await fr.locator('#ad-fl-nao').click();
    await fr.locator('.ad-fl-ver').waitFor({ timeout: 10000 });
    await page.waitForTimeout(350);
    const ver = (await fr.locator('.ad-fl-ver .cab').innerText()).replace(/\s+/g, ' ');
    const aviso = await fr.locator('.ad-fl-aviso').count() ? (await fr.locator('.ad-fl-aviso').innerText()) : '';
    const sug = await fr.locator('.ad-fl-b.sug b').innerText();
    P(`cartao ${k} [${tipo}] "${frente.slice(0, 60)}" -> ${ver} · sugerido: ${sug}${aviso ? ' · aviso: ' + aviso.slice(0, 60) : ''}`);
    if (k <= 3 || tipo === 'limite' || tipo === 'vazio_errado') await shot(`05_correcao_${k}_${tipo}`);
    if (k === 1) { await fr.locator('.ad-fl-nota').scrollIntoViewIfNeeded(); await shot('05b_botoes'); }
    /* o aluno discorda da correcao no 2o cartao: marca Acertei em vez de Quase */
    if (k === 2) await fr.locator('.ad-fl-b.a').click();
    else if (k % 3 === 0 && !opts.toque) { await page.keyboard.press('1'); }
    else await fr.locator('.ad-fl-b.sug').click();
    await page.waitForTimeout(250);
  }
  if (opts.ia) {
    const calls = await page.evaluate(() => (window.__ia || []).map(x => ({ tier: x.opts && x.opts.modelTier, tem: /Ideias essenciais/.test(x.input) && /Também vale/.test(x.input) && /Erro comum/.test(x.input) && /"veredito"/.test(x.input) })));
    P('chamadas IA: ' + calls.length + ' · ' + JSON.stringify(calls.slice(0, 2)));
  }
  /* sair no meio: resultado da sessao */
  await fr.locator('.ad-fl-sai').click();
  await fr.locator('.ad-fl-fim').waitFor();
  await page.waitForTimeout(500);
  P('resultado: ' + (await fr.locator('.ad-fl-fim .ad-fatos').innerText()).replace(/\s+/g, ' '));
  await shot('06_resultado');
  const est = await page.evaluate((m) => { const s = JSON.parse(localStorage.getItem('saocamilo.' + m + '.v1') || '{}'); return { q: Object.keys(s.q || {}).length, flash: Object.keys(s.flash || {}).length, ex: Object.values(s.flash || {})[0] }; }, mat);
  P('estado salvo: ' + JSON.stringify(est));
  /* recarregar: progresso antigo e flashcards continuam */
  await page.reload(); await page.waitForTimeout(1500);
  const bioAntes = await page.evaluate(() => JSON.parse(localStorage.getItem('saocamilo.bio.v1') || '{}'));
  P('apos reload: bio.q=' + Object.keys(bioAntes.q || {}).length + ' (ids antigos: ' + IDS.filter(id => bioAntes.q && bioAntes.q[id]).length + '/3) · ' + mat + '.flash=' + await page.evaluate((m) => Object.keys((JSON.parse(localStorage.getItem('saocamilo.' + m + '.v1') || '{}').flash) || {}).length, mat));
  P('linha apos reload: ' + (await page.locator('#painel .lin-hoje[data-cmd="flash"]').innerText()).replace(/\s+/g, ' '));
  await shot('07_inicio_reload');
  /* Revisao -> aba Flashcards */
  await page.locator('#painel .lin-hoje[data-cmd="flash"]').click();
  await fr.locator('.ad-fl-capa').waitFor({ timeout: 15000 }); await page.waitForTimeout(500);
  P('capa apos reload: ' + (await fr.locator('.ad-fl-nums').innerText()).replace(/\s+/g, ' ') + ' · aba: ' + (await fr.locator('.ad-rev-abas').innerText()).replace(/\s+/g, ' '));
  await fr.locator('.ad-rev-abas [data-rab="q"]').click(); await page.waitForTimeout(300);
  P('aba questoes: ' + (await fr.locator('#v-revisao .ad-rev-capa h1').innerText()));
  await fr.locator('.ad-rev-abas [data-rab="flash"]').click(); await page.waitForTimeout(300);
  await shot('08_revisao_flash');
  /* Portugues sem cartoes: sem aba, sem item no menu */
  if (!opts.toque) {
    await page.locator('#menu .item[data-m="por"]').click(); await page.waitForTimeout(1500);
    const pf = page.frameLocator('iframe[data-m="por"]');
    P('por: menu Flashcards visivel=' + await page.locator('#menu .item[data-acao="flash"]').isVisible());
    await page.locator('#menu .item[data-acao="revisao"]').click(); await page.waitForTimeout(800);
    P('por: abas na revisao=' + await pf.locator('.ad-rev-abas').count() + ' · titulo=' + await pf.locator('#v-revisao h1').first().innerText());
    await page.locator('#menu .item[data-m="bio"]').click(); await page.waitForTimeout(1500);
    P('por: flash cmd -> ' + await page.evaluate(() => { const f = document.querySelector('iframe[data-m="por"]'); f.contentWindow.postMessage({ ad: 'ir', v: 'flash' }, '*'); return 'enviado'; }));
    await page.waitForTimeout(500);
    P('por: depois do comando flash: capa fl=' + await pf.locator('.ad-fl-capa').count() + ' · h1=' + await pf.locator('#v-revisao h1').first().innerText());
    P('bio: menu Flashcards visivel=' + await page.locator('#menu .item[data-acao="flash"]').isVisible());
    /* busca */
    await page.keyboard.press('Control+k'); await page.keyboard.type('flashcards qui'); await page.waitForTimeout(300);
    P('busca: ' + (await page.locator('#res-busca').innerText()).replace(/\s+/g, ' ').slice(0, 120));
    await page.keyboard.press('Enter'); await page.waitForTimeout(1500);
    P('busca abriu qui flash: ' + await page.frameLocator('iframe[data-m="qui"]').locator('.ad-fl-capa').count());
  }
  /* rolagem horizontal */
  const hs = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
  P('rolagem horizontal shell: ' + hs);
  await browser.close();
  return log;
}

(async () => {
  const R = [];
  R.push(await rodada('ia1366', { width: 1366, height: 768 }, { ia: true }));
  R.push(await rodada('man1366', { width: 1366, height: 768 }, { ia: false }));
  R.push(await rodada('ia1920', { width: 1920, height: 1080 }, { ia: true }));
  R.push(await rodada('ia390', { width: 390, height: 844 }, { ia: true, toque: true }));
  R.push(await rodada('man390', { width: 390, height: 844 }, { ia: false, toque: true }));
  R.push(await rodada('zero1366', { width: 1366, height: 768 }, { ia: false, zeroPor: true }));
  for (const r of R) { console.log('\n== ' + r.nome + ' · pageerror ' + r.erros.length + ' · console.error ' + r.cons.length); r.erros.concat(r.cons).forEach(x => console.log('  ERRO ' + x.slice(0, 300))); r.passos.forEach(p => console.log('  ' + p)); }
})();

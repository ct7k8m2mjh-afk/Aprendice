const { chromium, BASE, nova } = require('./comum.cjs');
const fs = require('fs');
const TELAS = [['tema-m08', '#/m/mat/tema/M08'], ['questao-frac', '#/m/mat/q/P5cb97bb6', 'B'], ['simulado-uerj', '#/simulados/prova/uerj-2021'], ['flash-bio', '#/m/bio/flashcards/sessao', 'flash'], ['resumo-q04', '#/m/qui/revisao/Q04.2'], ['tema-s06', '#/m/fs/tema/S06']];
(async () => {
  const b = await chromium.launch();
  const out = [];
  for (const tema of ['claro', 'escuro']) for (const w of [390, 768, 1280, 1440]) {
    for (const [nome, rota, acao] of TELAS) {
      const { ctx, p, erros } = await nova(b, { w, h: 900, tema });
      await p.goto(BASE + rota); await p.waitForTimeout(1800);
      if (acao === 'flash') { const ns = p.locator('button', { hasText: 'Não sei' }); if (await ns.count()) { await ns.first().click(); await p.waitForTimeout(600); } }
      else if (acao) { await p.keyboard.press(acao); await p.keyboard.press('Enter'); await p.waitForTimeout(1500); const ver = p.locator('button.ra-link', { hasText: 'Ver sem animação' }); if (await ver.count()) { await ver.first().click(); await p.waitForTimeout(600); } await p.evaluate(() => document.querySelector('.cor-resposta')?.scrollIntoView()); }
      const r = await p.evaluate(() => {
        const puros = [];
        for (const el of document.querySelectorAll('body, body *')) {
          const cs = getComputedStyle(el); const bg = cs.backgroundColor;
          if ((bg === 'rgb(255, 255, 255)' || bg === 'rgb(0, 0, 0)')) { const rc = el.getBoundingClientRect(); if (rc.width * rc.height > 20000) puros.push(el.tagName + '.' + el.className + ' ' + bg + ' ' + Math.round(rc.width) + 'x' + Math.round(rc.height)); }
        }
        const t = document.body.innerText;
        const emo = t.match(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu) || [];
        const cortes = [...document.querySelectorAll('.frac, .cor-resp, .cor-expl, .fc-fonte, p, h1, h2, h3')].filter((e) => e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).overflowX !== 'visible').map((e) => e.className || e.tagName).slice(0, 5);
        return { scrollLat: document.scrollingElement.scrollWidth > innerWidth, sw: document.scrollingElement.scrollWidth, puros: puros.slice(0, 5), emo, cortes,
          sitesDid: (t.match(/[^\n]*(Brasil Escola|Mundo Educa|Prepara Enem|InfoEscola|Toda Mat[ée]ria)[^\n]*/gi) || []).map((x) => x.slice(0, 80)), div: (t.match(/[^\n]{0,40}÷[^\n]{0,30}/g) || []) };
      });
      await p.screenshot({ path: `../r3-dados-${nome}-${w}-${tema}.png`, fullPage: false });
      out.push({ nome, w, tema, ...r, erros });
      await ctx.close();
    }
  }
  fs.writeFileSync('resp-out.json', JSON.stringify(out, null, 1));
  for (const r of out) if (r.scrollLat || r.puros.length || r.emo.length || r.cortes.length || r.sitesDid.length || r.div.length || r.erros.length) console.log(r.nome, r.w, r.tema, JSON.stringify({ sl: r.scrollLat, sw: r.sw, puros: r.puros, emo: r.emo, cortes: r.cortes, sites: r.sitesDid, div: r.div, erros: r.erros }));
  await b.close();
})();

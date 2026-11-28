const { chromium, BASE, nova } = require('./comum.cjs');
const fs = require('fs');
(async () => {
  const b = await chromium.launch();
  const out = {};
  const { ctx, p, erros } = await nova(b);
  for (const id of ['ime', 'ufrr']) { await p.goto(BASE + '#/provas/' + id); await p.waitForTimeout(1200);
    out['ficha-' + id] = await p.evaluate(() => [...document.querySelectorAll('.fontes, .fontes a')].map((e) => e.innerText + ' ' + (e.href || '')).join(' | ')); }
  for (const m of ['mat', 'bio']) {
    await p.goto(BASE + `#/m/${m}/flashcards/sessao`); await p.waitForTimeout(1500);
    const versos = [];
    for (let i = 0; i < 30; i++) {
      const t = await p.evaluate(() => (document.querySelector('main') || document.body).innerText);
      if (/conclu[íi]da/i.test(t)) break;
      const ns = p.locator('button', { hasText: 'Não sei' });
      if (await ns.count()) { await ns.first().click(); await p.waitForTimeout(400); }
      versos.push(await p.evaluate(() => document.querySelector('.fc-fonte')?.innerText || '(sem fonte) ' + (document.querySelector('main') || document.body).innerText.slice(0, 120)));
      if (i === 0) await p.screenshot({ path: `../r3-dados-flash-verso-${m}.png` });
      const er = p.locator('button', { hasText: /^Errei|Errei/ });
      if (await er.count()) { await er.first().click(); await p.waitForTimeout(400); }
      else { const prox = p.locator('button', { hasText: /Próxim|Continuar|Seguir/ }); if (await prox.count()) { await prox.first().click(); await p.waitForTimeout(400); } else { versos.push('travou: ' + t.slice(0, 200)); break; } }
    }
    out['flash-' + m] = { versos, fim: (await p.evaluate(() => (document.querySelector('main') || document.body).innerText)).slice(0, 200) };
  }
  await p.goto(BASE + '#/m/por/flashcards'); await p.waitForTimeout(1200);
  const com = p.locator('.tp-comecar');
  if (await com.count()) { await com.first().click(); await p.waitForTimeout(1500); }
  out.porDepois = (await p.evaluate(() => (document.querySelector('main') || document.body).innerText)).slice(0, 200);
  await p.goto(BASE + '#/m/geo/flashcards/sessao'); await p.waitForTimeout(1500);
  out.geoDireto = (await p.evaluate(() => (document.querySelector('main') || document.body).innerText)).slice(0, 200);
  out.erros = erros;
  fs.writeFileSync('flash-out.json', JSON.stringify(out, null, 1));
  await b.close();
})();

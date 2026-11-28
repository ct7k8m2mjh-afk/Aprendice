const { chromium, BASE, nova } = require('./comum.cjs');
const fs = require('fs');
(async () => {
  const b = await chromium.launch();
  const out = {};
  // 1. nota do simulado
  { const { ctx, p, erros } = await nova(b);
    for (const id of ['uerj-2021', 'unicamp-2021', 'anhembi-2022', 'uea-2025', 'ime-2024', 'enem-2023']) {
      await p.goto(BASE + '#/simulados/prova/' + id); await p.waitForTimeout(1500);
      const t = await p.evaluate(() => (document.querySelector('main') || document.body).innerText);
      out['sim-' + id] = { site: (t.match(/[^\n]*(Brasil Escola|brasilescola)[^\n]*/g) || []), inicio: t.slice(0, 200) };
      if (id === 'uerj-2021') await p.screenshot({ path: '../r3-dados-simulado-nota-uerj.png' });
    }
    // 2. fichas
    for (const id of ['ime', 'ufrr', 'uerj', 'unicamp', 'anhembi']) {
      await p.goto(BASE + '#/provas/' + id); await p.waitForTimeout(1200);
      const t = await p.evaluate(() => ({ t: (document.querySelector('main') || document.body).innerText, links: [...document.querySelectorAll('a')].map((a) => a.href).filter((h) => /brasilescola|mundoeduca|preparaenem|infoescola|todamateria/.test(h)) }));
      out['ficha-' + id] = { site: (t.t.match(/[^\n]*(Brasil Escola|brasilescola|Mundo Educa|Toda Mat)[^\n]*/gi) || []), links: t.links, fontes: (t.t.match(/[^\n]*Fontes?:[^\n]*/g) || []) };
    }
    out.errosSim = erros; await ctx.close(); }
  // 3. flashcards: sessão de mat até o fim e depois por
  { const { ctx, p, erros } = await nova(b);
    await p.goto(BASE + '#/m/mat/flashcards/sessao'); await p.waitForTimeout(1500);
    const versos = [];
    for (let i = 0; i < 40; i++) {
      const t = await p.evaluate(() => (document.querySelector('main') || document.body).innerText);
      if (/Sessão concluída/i.test(t)) break;
      const virar = p.locator('button', { hasText: /Ver resposta|Virar|Mostrar/ });
      if (await virar.count()) { await virar.first().click(); await p.waitForTimeout(300); }
      else { await p.keyboard.press('Space'); await p.waitForTimeout(300); }
      const v = await p.evaluate(() => ({ fonte: document.querySelector('.fc-fonte')?.innerText || '', t: (document.querySelector('main') || document.body).innerText.slice(0, 200) }));
      versos.push(v.fonte);
      const nota = p.locator('button', { hasText: /Errei/ });
      if (await nota.count()) { await nota.first().click(); await p.waitForTimeout(300); } else break;
    }
    out.flashMat = { versos, fim: (await p.evaluate(() => (document.querySelector('main') || document.body).innerText)).slice(0, 200) };
    await p.goto(BASE + '#/m/por/flashcards'); await p.waitForTimeout(1200);
    const com = p.locator('button.tp-comecar, a.tp-comecar, button:has-text("Começar"), a:has-text("Começar")');
    if (await com.count()) { await com.first().click(); await p.waitForTimeout(1500); }
    out.flashPorDepois = { url: p.url(), t: (await p.evaluate(() => (document.querySelector('main') || document.body).innerText)).slice(0, 300) };
    await p.goto(BASE + '#/m/fis/flashcards/sessao'); await p.waitForTimeout(1500);
    out.flashFisDireto = (await p.evaluate(() => (document.querySelector('main') || document.body).innerText)).slice(0, 300);
    await p.screenshot({ path: '../r3-dados-flash-fis.png' });
    out.errosFlash = erros; await ctx.close(); }
  fs.writeFileSync('telas-out.json', JSON.stringify(out, null, 1));
  await b.close();
})();

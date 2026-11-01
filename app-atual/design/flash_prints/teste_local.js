const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage(); const err = [];
  p.on('pageerror', e => err.push(String(e)));
  for (const m of ['bio', 'qui', 'mat', 'por']) {
    await p.goto('http://localhost:8766/' + m + '/index.html'); await p.waitForTimeout(800);
    const r = await p.evaluate(() => {
      const A = window.adFlashcards, C = D.flash || [], o = { n: C.length, verso: {}, aceita: {}, nada: {}, essencial: {}, ruins: [] };
      C.forEach(c => {
        const v1 = A.local(c, c.verso).veredito; o.verso[v1] = (o.verso[v1] || 0) + 1; if (v1 !== 'certo') o.ruins.push(['verso', c.id, v1]);
        const v4 = A.local(c, (c.essencial || []).join('; ')).veredito; o.essencial[v4] = (o.essencial[v4] || 0) + 1; if (v4 !== 'certo') o.ruins.push(['essencial', c.id, v4, (c.essencial||[]).join(' | ')]);
        if (c.aceita && c.aceita.length && c.essencial.length === 1) { const v2 = A.local(c, c.aceita[0]).veredito; o.aceita[v2] = (o.aceita[v2] || 0) + 1; }
        const v3 = A.local(c, 'não lembro, acho que é outra coisa').veredito; o.nada[v3] = (o.nada[v3] || 0) + 1;
      });
      return o;
    });
    console.log(m, r.n, 'verso:', JSON.stringify(r.verso), 'essencial:', JSON.stringify(r.essencial), 'aceita(1 ess):', JSON.stringify(r.aceita), 'lixo:', JSON.stringify(r.nada));
    r.ruins.slice(0, 6).forEach(x => console.log('   ', JSON.stringify(x)));
  }
  console.log('pageerrors', err.length, err.slice(0, 3));
  await b.close();
})();

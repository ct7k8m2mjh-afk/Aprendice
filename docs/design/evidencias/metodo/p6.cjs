const { abre } = require('./lib.cjs');
(async () => { const { b, p } = await abre(1280, 'claro');
  const mede = () => [...document.querySelectorAll('.cor-expl, .ra-porque')].map((el) => { const c = getComputedStyle(el); const r = el.getBoundingClientRect(); const t = el.textContent.replace(/\s+/g, ' ').trim(); const l = Math.round(r.height / parseFloat(c.lineHeight)); return l >= 3 ? Math.round(t.length / l) : null; }).filter(Boolean);
  for (const id of ['por/q/Pa563c0a', 'mat/q/857e13da', 'ing/q/Pc60692c0']) { await p.vai('/m/' + id, 1300); await p.locator('.alt').first().click(); await p.locator('.btn-conf').first().click(); await p.waitForTimeout(800); await p.locator('.cor-outras summary').first().click().catch(() => {}); await p.locator('.ra-link').first().click().catch(() => {}); await p.waitForTimeout(600);
    const a = await p.evaluate(mede); const st = await p.addStyleTag({ content: '.cor-expl,.ra-porque{max-width:68ch}' }); await p.waitForTimeout(200); const d = await p.evaluate(mede); await st.evaluate((n) => n.remove());
    console.log(id, 'antes', Math.min(...a), '-', Math.max(...a), 'com 68ch', Math.min(...d), '-', Math.max(...d), 'larg', await p.evaluate(() => Math.round(document.querySelector('.cor-expl').getBoundingClientRect().width))); }
  await p.vai('/hoje', 1200); const m2 = (sel) => { const el = document.querySelector(sel); if (!el) return null; const c = getComputedStyle(el); const r = el.getBoundingClientRect(); const t = el.textContent.replace(/\s+/g, ' ').trim(); return Math.round(t.length / Math.round(r.height / parseFloat(c.lineHeight))); };
  const a = await p.evaluate(m2, '.hj-como p'); await p.addStyleTag({ content: '.hj-como p,.dm-expl{max-width:72ch}' }); await p.waitForTimeout(200); console.log('hj-como antes', a, 'com 72ch', await p.evaluate(m2, '.hj-como p'));
  await p.vai('/revisao?aba=dominio', 1200); console.log('dm-expl com 72ch', await p.evaluate(m2, '.dm-expl'));
  await b.close(); })();

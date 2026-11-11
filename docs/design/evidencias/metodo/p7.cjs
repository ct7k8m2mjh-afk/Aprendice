const { abre } = require('./lib.cjs');
(async () => { const { b, p } = await abre(1280, 'claro');
  const m2 = (sel) => [...document.querySelectorAll(sel)].map((el) => { const c = getComputedStyle(el); const r = el.getBoundingClientRect(); const t = el.textContent.replace(/\s+/g, ' ').trim(); const l = Math.round(r.height / parseFloat(c.lineHeight)); return l >= 3 ? el.tagName + ':' + c.display + ':' + Math.round(t.length / l) : null; }).filter(Boolean).join(' ');
  await p.vai('/m/por/q/Pa563c0a', 1300); await p.locator('.alt').first().click(); await p.locator('.btn-conf').first().click(); await p.waitForTimeout(800); await p.locator('.cor-outras summary').first().click().catch(() => {}); await p.waitForTimeout(400);
  await p.addStyleTag({ content: '.cor-expl,.ra-porque{max-width:68ch}' }); await p.waitForTimeout(200); console.log('por 68ch:', await p.evaluate(m2, '.cor-expl, .ra-porque'));
  await p.vai('/hoje', 1200); await p.addStyleTag({ content: '.hj-como p,.dm-expl{max-width:62ch}' }); await p.waitForTimeout(200); console.log('hj-como 62ch:', await p.evaluate(m2, '.hj-como p'));
  await p.vai('/revisao?aba=dominio', 1200); console.log('dm-expl 62ch:', await p.evaluate(m2, '.dm-expl'));
  await b.close(); })();

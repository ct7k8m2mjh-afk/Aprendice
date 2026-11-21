const { abre } = require('./lib.cjs');
const est = (sel) => { const el = document.querySelector(sel); if (!el) return null; const c = getComputedStyle(el); const r = el.getBoundingClientRect();
  return { w: Math.round(r.width), h: Math.round(r.height), rad: c.borderRadius, borda: c.borderTopWidth + ' ' + c.borderTopStyle + ' ' + c.borderTopColor, sh: c.boxShadow, bg: c.backgroundColor, bgi: c.backgroundImage.slice(0, 110), cor: c.color, out: c.outlineStyle + ' ' + c.outlineWidth + ' ' + c.outlineColor + ' off ' + c.outlineOffset, pad: c.padding, fs: c.fontSize, fw: c.fontWeight, tr: c.transition.slice(0, 80), transf: c.transform, filt: c.filter, cur: c.cursor }; };
(async () => {
  // (a) foco na faixa de temas
  { const { b, p } = await abre(1280, 'claro'); await p.vai('/m/mat');
    await p.locator('.ft-item').first().focus(); const res = [];
    for (let i = 0; i < 16; i++) { await p.keyboard.press('Tab'); await p.waitForTimeout(450); res.push(await p.evaluate(() => { const e = document.activeElement; const r = e.getBoundingClientRect(); const f = e.closest('.faixa-temas, .ft-rolo, [class*="ft-"]'); const pai = e.parentElement.getBoundingClientRect(); return (e.className || '').toString().slice(0, 12) + ':' + Math.round(r.left) + '..' + Math.round(r.right) + '/pai ' + Math.round(pai.left) + '..' + Math.round(pai.right); })); }
    console.log('(a) foco faixa 1280:', res.join(' | ')); 
    // (d) barra da questão cortada
    for (const id of ['fs/q/P8ff3c488', 'por/q/Pa563c0a']) { await p.vai('/m/' + id); console.log('(d)', id, await p.evaluate(() => { const t = document.querySelector('.q-barq .t'); const c = getComputedStyle(t); return { txt: t.textContent, sw: t.scrollWidth, cw: t.clientWidth, sh: t.scrollHeight, ch: t.clientHeight, ws: c.whiteSpace, to: c.textOverflow, clamp: c.webkitLineClamp, title: t.getAttribute('title') }; })); }
    await b.close(); }
  // (b) reduzir movimento
  { const { b, p } = await abre(1280, 'claro', { reduz: true }); await p.vai('/m/mat/q/857e13da', 1200);
    await p.locator('.alt').first().click(); await p.locator('.btn-conf').first().click(); await p.waitForTimeout(700);
    const antes = await p.evaluate(() => ({ assistir: !!document.querySelector('.ra-assistir'), passos: document.querySelectorAll('.ra-passo').length, txt: (document.querySelector('.ra') || {}).textContent?.slice(0, 90) }));
    let depois = null; if (antes.assistir) { await p.locator('.ra-assistir .btn').first().click(); await p.waitForTimeout(400); depois = await p.evaluate(() => ({ passos: document.querySelectorAll('.ra-passo').length, ctl: !!document.querySelector('.ra-ctl'), anim: document.getAnimations().length })); }
    console.log('(b) reduzir movimento:', JSON.stringify(antes), JSON.stringify(depois));
    await p.vai('/m/mat'); await p.hover('.ft-item'); await p.waitForTimeout(500);
    console.log('(b2) salto do ícone com reduzir:', await p.evaluate(() => getComputedStyle(document.querySelector('.ft-item:hover .ic-tema, .ft-item:hover img') || document.body).transform));
    await b.close(); }
  // (c) Treino geral: estados
  for (const [W, tema] of [[1280, 'claro'], [1280, 'escuro'], [390, 'claro']]) {
    const { b, p } = await abre(W, tema); await p.vai('/m/mat', 1300);
    const o = {}; o.capa = await p.evaluate(est, '.capa-tg'); o.btn = await p.evaluate(est, '.capa-tg .btn-capa'); o.arte = await p.evaluate(est, '.capa-tg .arte-tg'); o.mp = await p.evaluate(est, '.mp');
    if (W > 800) { await p.hover('.capa-tg .btn-capa'); await p.waitForTimeout(350); o.capaHover = await p.evaluate(est, '.capa-tg'); o.btnHover = await p.evaluate(est, '.capa-tg .btn-capa'); }
    await p.locator('.capa-tg').focus(); await p.keyboard.press('Shift+Tab'); await p.keyboard.press('Tab'); await p.waitForTimeout(300); o.capaFoco = await p.evaluate(est, '.capa-tg');
    await p.vai('/', 1300); o.inTreino = await p.evaluate(est, '.in-treino'); o.inBtn = await p.evaluate(est, '.in-btn-treino'); o.inCont = await p.evaluate(est, '.in-continue'); o.inBtnCont = await p.evaluate(est, '.in-continue .btn');
    if (W > 800) { await p.hover('.in-btn-treino'); await p.waitForTimeout(350); o.inBtnHover = await p.evaluate(est, '.in-btn-treino'); }
    await p.locator('.in-btn-treino').focus(); await p.keyboard.press('Shift+Tab'); await p.keyboard.press('Tab'); await p.waitForTimeout(300); o.inBtnFoco = await p.evaluate(est, '.in-btn-treino');
    console.log(`\n(c) ${W} ${tema}`); for (const k in o) console.log(' ', k, JSON.stringify(o[k]));
    await b.close();
  }
})();

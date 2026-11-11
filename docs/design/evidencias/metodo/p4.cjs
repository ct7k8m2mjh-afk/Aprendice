const { abre } = require('./lib.cjs');
const op = (sel) => [...document.querySelectorAll(sel)].slice(0, 3).map((el) => { const ch = []; let e = el; while (e && e.nodeType === 1) { const c = getComputedStyle(e); if (c.opacity !== '1') ch.push(e.tagName.toLowerCase() + '.' + String(e.className).split(' ').slice(0, 2).join('.') + ' op ' + c.opacity); e = e.parentElement; } const c = getComputedStyle(el); return { t: el.textContent.trim().slice(0, 30), cor: c.color, bg: c.backgroundColor, dis: !!el.closest('[disabled],[aria-disabled=true]'), ch }; });
(async () => {
  const { b, p } = await abre(1280, 'claro');
  await p.vai('/m/bio/escada/B01.1'); console.log('nivel-etq', JSON.stringify(await p.evaluate(op, '.nivel-etq'))); console.log('nv-outras', JSON.stringify(await p.evaluate(op, '.nv-outras')));
  await p.vai('/m/fis/flashcards'); console.log('tp-comecar fis', JSON.stringify(await p.evaluate(op, '.btn.tp-comecar')));
  await p.vai('/m/qui/essencial/Q01', 1300); console.log('essencial sec', JSON.stringify(await p.evaluate(op, '.btn.sec')));
  await p.vai('/m/mat/q/Pb2623f68'); console.log('crono', JSON.stringify(await p.evaluate(op, '.crono-tot small, .crono small')));
  await b.close();
})();

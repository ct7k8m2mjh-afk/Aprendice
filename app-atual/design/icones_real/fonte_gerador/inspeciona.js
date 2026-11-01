// lista cada <path> de um SVG com caixa e cor: ajuda a recortar um objeto de uma cena da Servier
const { chromium } = require('playwright'); const fs = require('fs');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.setContent(fs.readFileSync(process.argv[2], 'utf8'));
  const r = await p.evaluate(() => [...document.querySelectorAll('svg > path, svg > g > path')].map((e, i) => { const bb = e.getBBox(); return [i, Math.round(bb.x), Math.round(bb.y), Math.round(bb.width), Math.round(bb.height), e.getAttribute('fill'), e.getAttribute('stroke')]; }));
  console.log(r.map(x => x.join(' ')).join('\n')); await b.close();
})();

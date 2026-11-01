const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1032, height: 800 } });
  for (const k of ['bio', 'qui', 'mat', 'por']) { const f = require('path').resolve(process.argv[2]) + '/folha_' + k;
    await p.goto('file://' + f + '.html'); await p.waitForTimeout(300); await p.screenshot({ path: f + '.png', fullPage: true }); }
  await b.close(); })();

const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
(async () => { const d = path.resolve(process.argv[2]); const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 790, height: 600 } });
  for (const f of fs.readdirSync(d).filter(x => x.endsWith('.html'))) { await p.goto('file://' + d + '/' + f); await p.waitForTimeout(250);
    await p.screenshot({ path: d + '/' + f.replace('.html', '.png'), fullPage: true }); }
  await b.close(); })();

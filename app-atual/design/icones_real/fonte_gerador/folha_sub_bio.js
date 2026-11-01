const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
(async () => { const d = path.resolve(process.argv[2]); const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1030, height: 600 } });
  for (const f of fs.readdirSync(d).filter(f => /^folha_B\d\d\.html$/.test(f))) {
    await p.goto('file://' + path.join(d, f)); await p.waitForTimeout(400); await p.screenshot({ path: path.join(d, f.replace('.html', '.png')), fullPage: true }); }
  await b.close(); })();

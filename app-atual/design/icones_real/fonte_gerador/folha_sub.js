// fotografa as folhas de contato dos conteudos: node folha_sub.js <dir com .html>
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
(async () => { const d = path.resolve(process.argv[2]); const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1032, height: 600 } });
  for (const f of fs.readdirSync(d).filter(f => f.endsWith('.html'))) { await p.goto('file://' + path.join(d, f)); await p.waitForTimeout(300);
    await p.screenshot({ path: path.join(d, f.replace('.html', '.png')), fullPage: true }); }
  await b.close(); })();

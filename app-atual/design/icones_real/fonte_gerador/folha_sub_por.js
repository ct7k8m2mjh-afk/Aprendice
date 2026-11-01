// fotografa as folhas de contato dos conteudos: node folha_sub.js <dir_folhas> <prefixo_materia> [modulos...]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
(async () => { const [, , dir, m, ...so] = process.argv; const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1032, height: 800 } });
  for (const f of fs.readdirSync(dir).filter(f => f.startsWith(m + '_') && f.endsWith('.html'))) {
    if (so.length && !so.includes(f.slice(m.length + 1, -5))) continue;
    await p.goto('file://' + path.resolve(dir, f)); await p.waitForTimeout(250);
    await p.screenshot({ path: path.resolve(dir, f.replace('.html', '.png')), fullPage: true }); }
  await b.close(); })();

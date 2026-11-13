const { chromium } = require('playwright'); const fs = require('fs');
exports.abre = async (W, TEMA, opt = {}) => {
  const H = { 390: 844, 768: 1024, 1280: 800, 1440: 900 }[W];
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: opt.dpr || 1, hasTouch: W < 800, reducedMotion: opt.reduz ? 'reduce' : 'no-preference' });
  const ls = JSON.parse(fs.readFileSync(__dirname + '/out/ls-1280-claro.json', 'utf8'));
  const e = JSON.parse(ls['aprendice.v1']); e.pref.tema = TEMA; ls['aprendice.v1'] = JSON.stringify(e);
  await ctx.addInitScript((ls) => { if (!localStorage.getItem('aprendice.v1')) for (const k in ls) localStorage.setItem(k, ls[k]); }, ls);
  const p = await ctx.newPage(); await p.goto('http://localhost:8911/'); await p.waitForTimeout(3300);
  p.vai = async (h, espera = 1000) => { await p.evaluate((h) => { location.hash = h; window.scrollTo(0, 0); }, h); try { await p.waitForLoadState('networkidle', { timeout: 5000 }); } catch (e) {} await p.waitForTimeout(espera); };
  return { b, p };
};

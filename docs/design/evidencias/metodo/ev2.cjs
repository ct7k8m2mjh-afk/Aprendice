const { abre } = require('./lib.cjs');
const E = '/home/user/aprendice/docs/design/evidencias/';
const tiro = async (p, nome, sel, margem = 8) => { const el = p.locator(sel).first(); await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(200); const bx = await el.boundingBox(); const vw = p.viewportSize(); 
  const clip = { x: Math.max(0, bx.x - margem), y: Math.max(0, bx.y - margem), width: Math.min(vw.width - Math.max(0, bx.x - margem), bx.width + 2 * margem), height: Math.min(vw.height - Math.max(0, bx.y - margem), bx.height + 2 * margem) };
  await p.screenshot({ path: E + nome, type: 'jpeg', quality: 80, clip }); console.log(nome, Math.round(clip.width) + 'x' + Math.round(clip.height)); };
const marca44 = () => { document.querySelectorAll('button, a[href], summary, [role=button], input, select').forEach((el) => { const r = el.getBoundingClientRect(); const c = getComputedStyle(el); if (r.width > 0 && c.display !== 'inline' && (r.width < 44 || r.height < 44)) { el.style.outline = '2px dashed #D0021B'; el.style.outlineOffset = '1px'; } }); };
const ESC = `[data-theme='dark'] .capa-tg{border-color:color-mix(in srgb,var(--c) 24%,transparent)!important}`;
const PROP = {
  A: ESC + `.capa-tg{box-shadow:var(--sombra-folha)!important}
      .capa-tg .btn.btn-capa{box-shadow:0 1px 2px rgba(0,0,0,.08)!important}
      .capa-tg.simula-hover{border-color:color-mix(in srgb,var(--c) 45%,var(--linha))!important;transform:translateY(-1px)}
      .capa-tg.simula-hover .btn.btn-capa{filter:brightness(1.05);transform:translateY(-1px)}`,
  B: ESC + `.capa-tg .btn.btn-capa{box-shadow:0 0 0 3px color-mix(in srgb,var(--c) 16%,transparent)!important}
      .capa-tg.simula-hover .btn.btn-capa{box-shadow:0 0 0 3px color-mix(in srgb,var(--c) 22%,transparent)!important;filter:brightness(1.05)}`,
  C: ESC + `.capa-tg{box-shadow:var(--sombra-folha)!important}
      .capa-tg .btn.btn-capa{border-radius:999px!important;box-shadow:0 1px 2px rgba(0,0,0,.08)!important}
      .capa-tg.simula-hover{border-color:color-mix(in srgb,var(--c) 45%,var(--linha))!important;transform:translateY(-1px)}
      .capa-tg.simula-hover .btn.btn-capa{filter:brightness(1.05);transform:translateY(-1px)}`,
};
const PROP_ANTIGA = {
  A: `.capa-tg{border:1px solid color-mix(in srgb,var(--c) 30%,transparent)!important;box-shadow:var(--sombra-folha)!important}
      .capa-tg .btn.btn-capa{border-radius:13px!important;box-shadow:0 1px 2px rgba(0,0,0,.08)!important}
      .capa-tg.simula-hover{border-color:color-mix(in srgb,var(--c) 45%,transparent)!important;transform:translateY(-1px)}
      .capa-tg.simula-hover .btn.btn-capa{filter:brightness(1.05);transform:translateY(-1px)}`,
  B: `.capa-tg{border:1px solid color-mix(in srgb,var(--c) 30%,transparent)!important}
      .capa-tg .btn.btn-capa{border-radius:16px!important;box-shadow:0 0 0 3px color-mix(in srgb,var(--c) 16%,transparent)!important}
      .capa-tg.simula-hover .btn.btn-capa{box-shadow:0 0 0 3px color-mix(in srgb,var(--c) 22%,transparent)!important;filter:brightness(1.05)}`,
  C: `.capa-tg{border:1px solid color-mix(in srgb,var(--c) 30%,transparent)!important;box-shadow:var(--sombra-folha)!important}
      .capa-tg .btn.btn-capa{border-radius:999px!important;box-shadow:0 1px 2px rgba(0,0,0,.08)!important}
      .capa-tg.simula-hover .btn.btn-capa{filter:brightness(1.05);transform:translateY(-1px)}`,
};
(async () => {
  // Treino geral: atual e propostas
  for (const [W, tema, dpr] of [[1280, 'claro', 1.5], [1280, 'escuro', 1.5], [390, 'claro', 1.5]]) {
    const { b, p } = await abre(W, tema, { dpr });
    await p.vai('/m/mat', 1500);
    await tiro(p, `tg-atual-${W}-${tema}.jpg`, '.capa-tg', 10);
    if (W === 1280 && tema === 'claro') { await p.locator('.capa-tg').focus(); await p.keyboard.press('Shift+Tab'); await p.keyboard.press('Tab'); await p.waitForTimeout(250); await tiro(p, 'tg-atual-foco-1280-claro.jpg', '.capa-tg', 10); await p.evaluate(() => document.activeElement.blur()); }
    for (const k of ['A', 'B', 'C']) {
      const st = await p.addStyleTag({ content: PROP[k] }); await p.waitForTimeout(200);
      await tiro(p, `tg-proposta-${k}-${W}-${tema}.jpg`, '.capa-tg', 10);
      if (W === 1280 && tema === 'claro') { await p.evaluate(() => document.querySelector('.capa-tg').classList.add('simula-hover')); await p.waitForTimeout(250); await tiro(p, `tg-proposta-${k}-hover-1280-claro.jpg`, '.capa-tg', 10); await p.evaluate(() => document.querySelector('.capa-tg').classList.remove('simula-hover')); }
      await st.evaluate((n) => n.remove());
    }
    await p.vai('/', 1400); await tiro(p, `tg-inicio-atual-${W}-${tema}.jpg`, '.in-treino', 10);
    await b.close();
  }
})();

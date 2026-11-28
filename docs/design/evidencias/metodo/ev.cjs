const { abre } = require('./lib.cjs');
const E = '/home/user/aprendice/docs/design/evidencias/';
const tiro = async (p, nome, sel, margem = 8) => { const el = p.locator(sel).first(); await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(200); const bx = await el.boundingBox(); const vw = p.viewportSize(); 
  const clip = { x: Math.max(0, bx.x - margem), y: Math.max(0, bx.y - margem), width: Math.min(vw.width - Math.max(0, bx.x - margem), bx.width + 2 * margem), height: Math.min(vw.height - Math.max(0, bx.y - margem), bx.height + 2 * margem) };
  await p.screenshot({ path: E + nome, type: 'jpeg', quality: 80, clip }); console.log(nome, Math.round(clip.width) + 'x' + Math.round(clip.height)); };
const marca44 = () => { document.querySelectorAll('button, a[href], summary, [role=button], input, select').forEach((el) => { const r = el.getBoundingClientRect(); const c = getComputedStyle(el); if (r.width > 0 && c.display !== 'inline' && (r.width < 44 || r.height < 44)) { el.style.outline = '2px dashed #D0021B'; el.style.outlineOffset = '1px'; } }); };
const PROP = {
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
  // alvos de toque 390
  { const { b, p } = await abre(390, 'claro', { dpr: 1.5 });
    await p.vai('/m/mat/q/Pb2623f68', 1300); await p.evaluate(marca44); await p.screenshot({ path: E + 'toque-390-questao.jpg', type: 'jpeg', quality: 78 }); console.log('toque-390-questao.jpg');
    await p.vai('/m/mat/tema/M02', 1300); await p.evaluate(marca44); await p.screenshot({ path: E + 'toque-390-tema.jpg', type: 'jpeg', quality: 78 });
    await p.vai('/revisao', 1200); await p.evaluate(marca44); await p.screenshot({ path: E + 'toque-390-revisao.jpg', type: 'jpeg', quality: 78 });
    await b.close(); }
  // 1280 claro: rótulos, barra cortada, medida de linha, fração em linha, foco na faixa
  { const { b, p } = await abre(1280, 'claro', { dpr: 1.5 });
    await p.vai('/m/fs/q/P8ff3c488', 1300); await tiro(p, 'barra-questao-cortada-1280.jpg', '.q-barra', 4);
    await p.vai('/m/qui/q/Pd553910', 1300); await tiro(p, 'contraste-etiqueta-qui-1280.jpg', '.q-meta', 6);
    await p.vai('/m/por/q/Pa563c0a', 1300); await p.locator('.cor-outras summary').first().click().catch(() => {}); await p.waitForTimeout(400); await tiro(p, 'medida-linha-correcao-1280.jpg', '.q-lado-corpo', 4);
    await p.vai('/m/mat/q/857e13da', 1300); await p.locator('.q-abas button', { hasText: 'Teoria' }).first().click(); await p.waitForTimeout(500);
    const h = await p.evaluateHandle(() => [...document.querySelectorAll('.cuidado')].find((e) => /2\/5/.test(e.textContent)));
    if (h.asElement()) { await h.asElement().scrollIntoViewIfNeeded(); const bx = await h.asElement().boundingBox(); await p.screenshot({ path: E + 'fracao-em-linha-teoria-mat.jpg', type: 'jpeg', quality: 82, clip: { x: bx.x - 6, y: bx.y - 6, width: bx.width + 12, height: bx.height + 12 } }); console.log('fracao ok'); } else console.log('fracao NAO ACHADA');
    await p.vai('/m/mat', 1300); await p.locator('.ft-item').first().focus(); for (let i = 0; i < 4; i++) { await p.keyboard.press('Tab'); await p.waitForTimeout(450); } await tiro(p, 'foco-faixa-temas-1280.jpg', '.faixa-temas', 6);
    await p.vai('/m/bio/escada/B01.1', 1300); await tiro(p, 'niveis-apagados-escada-1280.jpg', '.nivel-cartao.vazio', 6);
    await p.vai('/m/bio/tema/B01', 1300); await tiro(p, 'tema-contador-barra-1280.jpg', '.tp-enc li', 4);
    await b.close(); }
  { const { b, p } = await abre(1440, 'claro', { dpr: 1 }); await p.vai('/m/por/q/Pa563c0a', 1300); await p.screenshot({ path: E + 'medida-linha-correcao-1440.jpg', type: 'jpeg', quality: 78 }); await b.close(); }
})();

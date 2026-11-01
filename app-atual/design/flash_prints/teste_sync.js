// Conta simulada (db + user) SO no teste: confere que S.flash vai para a conta pela ponte e volta ao recarregar
const { chromium } = require('playwright');
const STUB = `(() => {
  if (window.top !== window) return;
  const ler = () => { try { return JSON.parse(localStorage.getItem('__stubdb') || '{}'); } catch (e) { return {}; } };
  const db = { doc: (p) => ({ get: async () => { const d = ler()[p]; return { exists: !!d, data: () => d }; }, set: async (d) => { const t = ler(); t[p] = JSON.parse(JSON.stringify(d)); localStorage.setItem('__stubdb', JSON.stringify(t)); }, delete: async () => { const t = ler(); delete t[p]; localStorage.setItem('__stubdb', JSON.stringify(t)); } }) };
  window.claude = { use: (n) => Promise.resolve(n === 'db' ? db : n === 'user' ? { id: async () => 'u1' } : null) };
})();`;
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1366, height: 768 } }); await ctx.addInitScript(STUB);
  const p = await ctx.newPage(); const err = []; p.on('pageerror', e => err.push(String(e)));
  await p.goto('http://localhost:8766/index.html'); await p.waitForTimeout(500);
  /* conta ja tem progresso antigo de questoes em Quimica (sem flash) */
  const qid = await p.evaluate(() => Object.keys(JSON.parse(document.getElementById('indice').textContent).qui.q)[0]);
  await p.evaluate((qid) => { localStorage.clear(); localStorage.setItem('__stubdb', JSON.stringify({ 'data/users/u1/prog_qui': { q: { [qid]: { tent: [{ ts: Date.now() - 864e5, ok: false, letra: 'B' }], rev: false } }, sims: [], atualizado: 1 } })); }, qid);
  await p.reload(); await p.waitForTimeout(1500);
  await p.locator('#menu .item[data-m="qui"]').click(); await p.waitForTimeout(2500);
  await p.locator('#menu .item[data-acao="flash"]').click();
  const fr = p.frameLocator('iframe[data-m="qui"]');
  await fr.locator('#ad-fl-comecar').click();
  for (let i = 0; i < 3; i++) { await fr.locator('#ad-fl-nao').click(); await fr.locator('.ad-fl-b.sug').click(); await p.waitForTimeout(200); }
  await p.waitForTimeout(2500);   /* agendaSync: 1,5 s */
  const conta = await p.evaluate(() => JSON.parse(localStorage.getItem('__stubdb'))['data/users/u1/prog_qui']);
  console.log('conta: q=' + Object.keys(conta.q || {}).length + ' flash=' + Object.keys(conta.flash || {}).length + ' (questao antiga presente: ' + !!(conta.q || {})[qid] + ')');
  console.log('sync shell: ' + await p.locator('#sync').innerText());
  /* outro aparelho: navegador limpo, so a conta */
  await p.evaluate(() => { const s = localStorage.getItem('__stubdb'); localStorage.clear(); localStorage.setItem('__stubdb', s); });
  await p.reload(); await p.waitForTimeout(1500);
  console.log('inicio (so conta): ' + (await p.locator('#painel .lin-hoje[data-cmd="flash"]').innerText()).replace(/\s+/g, ' '));
  await p.locator('#menu .item[data-m="qui"]').click(); await p.waitForTimeout(3000);
  const loc = await p.evaluate(() => JSON.parse(localStorage.getItem('saocamilo.qui.v1') || '{}'));
  console.log('navegador apos abrir qui: q=' + Object.keys(loc.q || {}).length + ' flash=' + Object.keys(loc.flash || {}).length);
  await p.locator('#menu .item[data-acao="flash"]').click(); await p.waitForTimeout(800);
  console.log('capa: ' + (await fr.locator('.ad-fl-nums').innerText()).replace(/\s+/g, ' '));
  console.log('pageerrors', err.length, err.slice(0, 3));
  await b.close();
})();

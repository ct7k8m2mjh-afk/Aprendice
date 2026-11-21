const { chromium } = require('playwright');
const BASE = 'http://localhost:4191/';
const PERFIL = { nome: 'Revisor', email: 'r@x.com', provasAlvo: ['enem'], meta: 150, criadoEm: Date.now() };
async function nova(b, { w = 1280, h = 900, tema = 'claro', filtro = 'todas', extra = null } = {}) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await ctx.addInitScript(([perfil, tema, filtro, extra]) => {
    if (sessionStorage.getItem('__prep')) return;
    sessionStorage.setItem('__prep', '1');
    const e = JSON.parse(localStorage.getItem('aprendice.v1') || 'null') || { versao: 8, materias: {}, simulado: null, simuladosFeitos: [], treino: {}, migradoDe: [] };
    e.perfil = perfil; e.pref = Object.assign(e.pref || {}, { tema, menuFechado: false, ultimaMateria: null, filtroRegiao: filtro });
    if (extra) Object.assign(e, extra);
    localStorage.setItem('aprendice.v1', JSON.stringify(e));
  }, [PERFIL, tema, filtro, extra]);
  const p = await ctx.newPage();
  const erros = [];
  p.on('pageerror', (e) => erros.push('pageerror ' + e.message));
  p.on('console', (m) => { if (m.type() === 'error') erros.push('console ' + m.text()); });
  p.on('requestfailed', (r) => erros.push('reqfail ' + r.url()));
  p.on('response', (r) => { if (r.status() >= 400) erros.push('http ' + r.status() + ' ' + r.url()); });
  return { ctx, p, erros };
}
module.exports = { chromium, BASE, nova };

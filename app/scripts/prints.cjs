// Tira prints das telas (claro, escuro, 390 px e computador). Uso: node scripts/prints.cjs [saida] [filtro]
const { chromium } = require('playwright');
const SAIDA = process.argv[2] || 'prints';
const FILTRO = process.argv[3] || '';
const BASE = process.env.BASE || 'http://localhost:5173/';
const DEMO = process.env.DEMO === '1' ? require('./demo.cjs')() : null;
const PERFIL = { nome: 'Ana Souza', email: '', provasAlvo: ['enem', 'fuvest', 'unesp', 'santacasa'], meta: 150, criadoEm: Date.now() };
const TELAS = [
  ['boas-vindas', '#/boas-vindas', { semPerfil: true }],
  ['inicio', '#/'],
  ['materia-bio', '#/m/bio'],
  ['tema', '#/m/qui/tema/Q01'],
  ['escada', '#/m/bio/escada/B01.1'],
  ['questao', '#/m/bio/q/P0e6c3a7?ctx=escada'],
  ['questao-resolucao', '#/m/bio/q/P0e6c3a7?ctx=escada', { responder: 'A' }],
  ['treino', '#/m/mat/treino'],
  ['flashcards', '#/m/qui/flashcards'],
  ['flash-sessao', '#/m/bio/flashcards/sessao'],
  ['simulados', '#/simulados'],
  ['revisao', '#/revisao'],
  ['desempenho', '#/desempenho'],
  ['provas', '#/provas'],
  ['prova-detalhe', '#/provas/fuvest'],
  ['materia-fisica', '#/m/fis'],
  ['tema-fisica', '#/m/fis/tema/F02'],
  ['materia-geografia', '#/m/geo'],
  ['perfil', '#/perfil'],
  ['config', '#/config'],
];
const VISTAS = [['pc', 1366, 860, 'claro'], ['cel', 390, 844, 'claro'], ['cel-escuro', 390, 844, 'escuro'], ['pc-escuro', 1366, 860, 'escuro']];
(async () => {
  require('fs').mkdirSync(SAIDA, { recursive: true });
  const b = await chromium.launch();
  const erros = [];
  for (const [vn, w, h, tema] of VISTAS) {
    for (const [nome, rota, op = {}] of TELAS) {
      if (FILTRO && !nome.includes(FILTRO) && !vn.includes(FILTRO)) continue;
      const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
      const p = await ctx.newPage();
      p.on('pageerror', (e) => erros.push(`${vn}/${nome}: ${e.message}`));
      p.on('console', (m) => { if (m.type() === 'error') erros.push(`${vn}/${nome} console: ${m.text()}`); });
      await ctx.addInitScript(([perfil, tema, sem, demo]) => {
        if (sessionStorage.getItem('__prep')) return;
        sessionStorage.setItem('__prep', '1');
        const e = JSON.parse(localStorage.getItem('aprendice.v1') || 'null') || { versao: 1, materias: {}, simulado: null, simuladosFeitos: [], treino: {}, migradoDe: [] };
        e.perfil = sem ? null : perfil; e.pref = { tema, menuFechado: false, ultimaMateria: null };
        if (demo && !sem) Object.assign(e, demo);
        localStorage.setItem('aprendice.v1', JSON.stringify(e));
      }, [PERFIL, tema, !!op.semPerfil, DEMO]);
      await p.goto(BASE + rota);
      await p.waitForTimeout(1200);
      if (op.responder) { await p.keyboard.press(op.responder); await p.keyboard.press('Enter'); await p.waitForTimeout(900); await p.evaluate(() => scrollTo(0, 0)); }
      await p.screenshot({ path: `${SAIDA}/${nome}-${vn}.png`, fullPage: !!op.inteira });
      await ctx.close();
    }
  }
  await b.close();
  console.log(erros.length ? erros.join('\n') : 'sem erros');
})();

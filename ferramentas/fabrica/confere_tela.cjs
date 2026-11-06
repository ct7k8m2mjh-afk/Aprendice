// Conferência na tela das resoluções da fábrica (CLAUDE.md, princípio 9): abre cada questão no site local,
// responde uma letra errada, mostra a resolução inteira ("Ver sem animação") e mede, em 390/768/1280/1440 px,
// nos temas claro e escuro: rolagem lateral da página, linha cortada dentro da folha da conta e erro de página.
// Uso (com o site rodando em BASE, padrão http://localhost:5173/):
//   node ferramentas/fabrica/confere_tela.cjs <prova-id> [id1,id2,...]
// Saída: lista de problemas; código de saída 1 se houver algum.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const BASE = process.env.BASE || 'http://localhost:5173/';
const RAIZ = path.resolve(__dirname, '..', '..');
const [prova, filtro] = process.argv.slice(2);
const res = JSON.parse(fs.readFileSync(path.join(RAIZ, 'app/conteudo-fonte/provas', prova, 'resolucoes.json'), 'utf8'));
const dados = JSON.parse(fs.readFileSync(path.join(RAIZ, 'app/conteudo-fonte/provas', prova, 'prova.json'), 'utf8'));
const gab = Object.fromEntries(dados.questoes.map((q) => [q.id, q.gab]));
const MATERIA = { fil: 'fs', soc: 'fs' };
const ids = (filtro ? filtro.split(',') : Object.keys(res)).filter((i) => res[i] && res[i].aprovada);
const VISTAS = [[390, 844], [768, 1024], [1280, 860], [1440, 900]];
// RAPIDO=1: toda questão em 390 e 1440 (claro), e as 8 vistas completas em 1 de cada 10 (amostra fixa pela posição)
const RAPIDO = process.env.RAPIDO === '1';
const PARALELO = Number(process.env.PARALELO || 6);

(async () => {
  const b = await chromium.launch();
  const problemas = [];
  const tarefas = [];
  ids.forEach((id, k) => {
    const completo = !RAPIDO || k % 10 === 0;
    for (const [w, h] of VISTAS) for (const tema of ['claro', 'escuro']) {
      if (!completo && (tema === 'escuro' || (w !== 390 && w !== 1440))) continue;
      tarefas.push([id, w, h, tema]);
    }
  });
  async function trabalha() {
    while (tarefas.length) {
      const [id, w, h, tema] = tarefas.shift();
      await confere(id, w, h, tema);
    }
  }
  async function confere(id, w, h, tema) {
    const mat = MATERIA[res[id].materia] || res[id].materia;
    const errada = 'ABCDE'.split('').find((l) => l !== gab[id]);
    {
      const ctx = await b.newContext({ viewport: { width: w, height: h } });
      const p = await ctx.newPage();
      const onde = `${prova} q${res[id].n} (${id}) ${w}px ${tema}`;
      p.on('pageerror', (e) => problemas.push(`${onde}: erro na página: ${e.message}`));
      await ctx.addInitScript(([tema]) => {
        if (sessionStorage.getItem('__p')) return; sessionStorage.setItem('__p', '1');
        localStorage.setItem('aprendice.v1', JSON.stringify({ versao: 1, materias: {}, simulado: null, simuladosFeitos: [], treino: {},
          migradoDe: [], perfil: { nome: 'Conferência', email: '', provasAlvo: ['enem'], meta: 150, criadoEm: 1 },
          pref: { tema, menuFechado: false, ultimaMateria: null } }));
      }, [tema]);
      await p.goto(`${BASE}#/m/${mat}/q/${id}?ctx=escada`);
      await p.waitForTimeout(1300);
      if (await p.getByText('Questão não encontrada').count()) { problemas.push(`${onde}: questão não encontrada no site`); await ctx.close(); return; }
      await p.keyboard.press(errada); await p.keyboard.press('Enter'); await p.waitForTimeout(900);
      const sem = p.getByText(/Ver sem anima/);
      if (await sem.count()) { await sem.first().click(); await p.waitForTimeout(600); }
      const m = await p.evaluate(() => ({
        lateral: document.documentElement.scrollWidth - innerWidth,
        folhas: [...document.querySelectorAll('.ra-folha')].map((e) => e.scrollWidth - e.clientWidth),
        latex: /\\[a-zA-Z]+\{|\\frac/.test(document.body.innerText),
      }));
      if (m.lateral > 0) problemas.push(`${onde}: rolagem lateral de ${m.lateral}px`);
      m.folhas.forEach((x, k) => { if (x > 0) problemas.push(`${onde}: folha da conta ${k + 1} corta ${x}px`); });
      if (m.latex) problemas.push(`${onde}: código LaTeX aparecendo no texto`);
      await ctx.close();
    }
  }
  console.error(`${tarefas.length} vistas para conferir`);
  await Promise.all(Array.from({ length: PARALELO }, trabalha));
  await b.close();
  console.log(problemas.length ? problemas.join('\n') : `sem problemas (${ids.length} questões × 8 vistas)`);
  process.exit(problemas.length ? 1 : 0);
})();

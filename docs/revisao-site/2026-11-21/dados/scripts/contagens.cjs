const { chromium, BASE, nova } = require('./comum.cjs');
const fs = require('fs');
const D = '/home/user/Aprendice/app/dist/conteudo';
const MS = 'bio qui mat por fis geo his fs ing'.split(' ');
(async () => {
  const b = await chromium.launch();
  const out = {};
  for (const filtro of ['todas', 'minha']) {
    const { p, erros } = await nova(b, { filtro });
    out[filtro] = { erros, m: {} };
    for (const m of MS) {
      const mat = JSON.parse(fs.readFileSync(`${D}/${m}/materia.json`));
      await p.goto(BASE + '#/m/' + m); await p.waitForTimeout(1500);
      const txtM = await p.evaluate(() => document.body.innerText);
      out[filtro].m[m] = { materiaNums: (txtM.match(/[^\n]*\d+ quest[õo]es?[^\n]*/g) || []), temas: {} };
      for (const md of mat.modulos) {
        await p.goto(BASE + `#/m/${m}/tema/${md.id}`); await p.waitForTimeout(700);
        const r = await p.evaluate(() => {
          const t = document.body.innerText;
          const nums = [...t.matchAll(/^(\d+) de (\d+)$/gm)].map((x) => +x[2]);
          const aviso = (t.match(/[^\n]*[Ss]ó \d+[^\n]*/g) || []);
          const regiao = (t.match(/[^\n]*região:[^\n]*/g) || []);
          return { nums, aviso, regiao, qtTema: (t.match(/[^\n]*\d+ quest[õo]es[^\n]*/g) || []) };
        });
        out[filtro].m[m].temas[md.id] = r;
      }
    }
  }
  fs.writeFileSync('contagens.json', JSON.stringify(out, null, 1));
  await b.close();
})();

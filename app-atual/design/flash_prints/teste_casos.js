const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('http://localhost:8766/bio/index.html'); await p.waitForTimeout(800);
  const casos = [['bio-f001','a água vai do meio hipotônico para o hipertônico'],['bio-f001','do hipertônico para o hipotônico'],['bio-f001','sai de onde tem menos soluto e vai para onde tem mais soluto'],['bio-f001','do mais concentrado pro menos concentrado'],['bio-f001','do hipotonico pro hipertonico'],['bio-f058','vai pro polo positivo e o fragmento menor anda mais'],['bio-f058','polo positivo'],['bio-f058','vai pro negativo e o maior anda mais'],['bio-f058','anodo; os menores andam mais']];
  const r = await p.evaluate((casos) => casos.map(([id, t]) => { const c = D.flash.find(x => x.id === id); const o = window.adFlashcards.local(c, t); return id + ' | ' + t + ' -> ' + o.veredito + ' | faltou: ' + o.faltou.join('; '); }), casos);
  r.forEach(x => console.log(x));
  await p.goto('http://localhost:8766/mat/index.html'); await p.waitForTimeout(800);
  const c2 = [['mat-f001','inverte a segunda fração e multiplica'],['mat-f001','inverte a primeira e multiplica'],['mat-f058','a maior que zero, b maior que zero e b diferente de 1'],['mat-f058','a > 0 e b > 0']];
  (await p.evaluate((casos) => casos.map(([id, t]) => { const c = D.flash.find(x => x.id === id); const o = window.adFlashcards.local(c, t); return id + ' | ' + t + ' -> ' + o.veredito + ' | faltou: ' + o.faltou.join('; '); }), c2)).forEach(x => console.log(x));
  await b.close();
})();

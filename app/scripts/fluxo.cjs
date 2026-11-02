// Teste de ponta a ponta no navegador: percorre os fluxos principais como um aluno.
// Uso: node scripts/fluxo.cjs   (com o app rodando em http://localhost:5173)
const { chromium } = require('playwright');
const assert = require('assert');
const BASE = process.env.BASE || 'http://localhost:5173/';

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 860 } });
  const p = await ctx.newPage();
  const erros = [];
  p.on('pageerror', (e) => erros.push(e.message));
  const estado = () => p.evaluate(() => JSON.parse(localStorage.getItem('aprendice.v1') || 'null'));
  const passo = (t) => console.log('  ok  ' + t);

  // 1. boas-vindas
  await p.goto(BASE);
  await p.waitForSelector('#bv-nome');
  await p.fill('#bv-nome', 'Teste');
  await p.click('text=Continuar');
  await p.click('.ep-item:has-text("Fuvest")');
  await p.click('text=Continuar');
  await p.click('text=Começar a estudar');
  await p.waitForSelector('.ini-cab h1');
  assert.match(await p.textContent('.ini-cab h1'), /Teste/);
  await p.waitForTimeout(500);
  let e = await estado();
  assert.deepStrictEqual(e.perfil.provasAlvo.sort(), ['enem', 'fuvest']);
  passo('boas-vindas: nome, provas-alvo (ENEM + Fuvest) e meta salvos');

  // 2. responder uma questão errando, com certeza
  await p.goto(BASE + '#/m/bio/q/P0e6c3a7?ctx=escada');
  await p.waitForSelector('.alts');
  await p.keyboard.press('A');
  await p.click('.certeza button:has-text("Tenho certeza")');
  await p.keyboard.press('Enter');
  await p.waitForSelector('.resolucao');
  assert.match(await p.textContent('.res-cab h2'), /Você marcou A\. A resposta é B/);
  assert.ok(await p.isVisible('.res-marcada'), 'explica a alternativa marcada');
  passo('questão: erro registrado e resolução começa pela alternativa marcada');

  // 3. recarregar e conferir que o progresso ficou
  await p.waitForTimeout(500);
  await p.reload();
  await p.waitForTimeout(800);
  e = await estado();
  const t = e.materias.bio.q.P0e6c3a7.tent;
  assert.strictEqual(t.length, 1); assert.strictEqual(t[0].letra, 'A'); assert.strictEqual(t[0].ok, false); assert.strictEqual(t[0].conf, 'certeza');
  passo('progresso persiste depois de recarregar a página');

  // 4. revisão mostra a questão (vence amanhã: força a data para ver a fila)
  await p.evaluate(() => { const e = JSON.parse(localStorage.getItem('aprendice.v1')); e.materias.bio.q.P0e6c3a7.tent[0].ts -= 2 * 864e5; localStorage.setItem('aprendice.v1', JSON.stringify(e)); });
  await p.goto(BASE + '#/revisao'); await p.reload();
  await p.waitForSelector('text=Errou com certeza');
  passo('revisão espaçada: questão errada com certeza aparece vencida');

  // 5. flashcard com correção (IA simulada)
  await p.goto(BASE + '#/m/bio/flashcards/sessao');
  await p.waitForSelector('.fc-resp');
  await p.fill('.fc-resp', 'o meio é hipotônico e a água entra por osmose');
  await p.click('.fc-acoes >> text=Corrigir');
  await p.waitForSelector('.fc-veredito');
  const ver = await p.textContent('.fc-veredito b');
  await p.click('.gosto >> text=Sim');
  await p.click('.nota.n-a');
  await p.waitForTimeout(400);
  e = await estado();
  assert.ok(Object.keys(e.materias.bio.flash).length === 1, 'cartão registrado');
  assert.ok(Object.values(e.materias.bio.flg)[0].g === 1, 'voto Curtiu registrado');
  passo(`flashcard: correção (“${ver}”), voto e agendamento salvos`);

  // 6. treino geral: responder o primeiro item e sair; ao voltar, retoma
  await p.goto(BASE + '#/m/qui/treino');
  await p.waitForSelector('.q-painel .alts, .fc-resp, .cz-in');
  if (await p.isVisible('.q-painel .alts')) { await p.keyboard.press('C'); await p.keyboard.press('Enter'); await p.waitForSelector('.resolucao'); await p.click('.q-nav >> text=Continuar'); }
  else if (await p.isVisible('.fc-resp')) { await p.click('text=Não sei: ver a resposta'); await p.click('.nota.n-e'); }
  else { await p.click('text=Não sei: ver a resposta'); await p.click('.nota.n-e'); }
  await p.waitForTimeout(400);
  e = await estado();
  assert.strictEqual(e.treino.qui.i, 1);
  await p.goto(BASE + '#/m/qui');
  await p.waitForSelector('text=Retomar (1 de');
  passo('treino geral: salvo no meio e oferece “Retomar”');

  // 7. simulados: só prova inteira. Edição parcial (Fuvest 2020 tem só parte das questões no banco) não abre;
  //    a lista mostra as provas completas em preparação. O fluxo de responder/entregar volta a ser exercitado
  //    aqui quando a primeira prova completa entrar no banco.
  await p.goto(BASE + '#/simulados/prova/' + encodeURIComponent('Fuvest|2020|1ª fase'));
  await p.waitForSelector('text=Simulado não encontrado');
  await p.goto(BASE + '#/simulados');
  await p.waitForSelector('text=Em preparação');
  await p.waitForSelector('text=ENEM 2025');
  assert.strictEqual(await p.locator('text=Por objetivo').count(), 0, 'sem simulado por objetivo');
  passo('simulados: só prova completa; parcial não abre; provas em preparação listadas');

  // 8. importar progresso no formato do protótipo
  const S = { q: { P0a240e7: { tent: [{ letra: 'D', ok: true, ts: 1761900000000, seg: 40 }] } }, ult: 'P0a240e7', sims: [], flash: {}, flg: {}, sessoes: [] };
  await p.goto(BASE + '#/config');
  const [fc] = await Promise.all([p.waitForEvent('filechooser'), p.click('text=Importar progresso')]);
  await fc.setFiles({ name: 'progresso.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(S)) });
  await p.waitForSelector('.toast');
  assert.match(await p.textContent('.toast'), /Progresso importado: 1 questões/);
  await p.waitForTimeout(400);
  e = await estado();
  assert.ok(e.materias.bio.q.P0a240e7 && e.materias.bio.q.P0e6c3a7, 'importou sem apagar o que havia');
  passo('importação do arquivo do protótipo: junta sem apagar');

  // 9. tema escuro e busca
  await p.goto(BASE + '#/');
  await p.click('.tema-seg button[title="Tema escuro"]');
  assert.strictEqual(await p.evaluate(() => document.documentElement.dataset.theme), 'dark');
  await p.keyboard.press('Control+K');
  await p.fill('.busca input', 'osmose');
  await p.waitForSelector('.busca-item');
  passo('tema escuro e busca (Ctrl K) funcionando');

  await b.close();
  if (erros.length) { console.log('ERROS NA PÁGINA:\n' + erros.join('\n')); process.exit(1); }
  console.log('Todos os fluxos passaram.');
})().catch((err) => { console.error('FALHOU:', err.message); process.exit(1); });

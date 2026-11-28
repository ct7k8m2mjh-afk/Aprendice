const { chromium, BASE, nova } = require('./comum.cjs');
const fs = require('fs');
const D = '/home/user/Aprendice/app/dist/conteudo';
const bancos = {};
const banco = (m) => bancos[m] || (bancos[m] = Object.fromEntries(JSON.parse(fs.readFileSync(`${D}/${m}/banco.json`)).map((q) => [q.id, q])));
(async () => {
  const b = await chromium.launch();
  const amostra = JSON.parse(fs.readFileSync('amostra.json'));
  const out = [];
  for (const [m, id, tipo] of amostra) {
    const q = banco(m)[id];
    const { ctx, p, erros } = await nova(b, { w: 1280 });
    await p.goto(BASE + `#/m/${m}/q/${id}`); await p.waitForTimeout(1800);
    const r = { m, id, tipo };
    r.antes = await p.evaluate(() => {
      const main = document.querySelector('main') || document.body;
      const t = main.innerText;
      return { titulo: t.slice(0, 300), naoEncontrada: /não encontrad|não existe/i.test(t), indisp: /indispon/i.test(t), gabAp: /Gabarito do Aprendice/.test(t),
        imgsQuebradas: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src), scrollLat: document.scrollingElement.scrollWidth > innerWidth,
        botoes: [...document.querySelectorAll('button')].map((x) => x.innerText.trim()).filter((x) => /^[A-E]\b/.test(x)).length };
    });
    if (q && q.gab && !q.indisponivel && !q.pendente) {
      const letras = Object.keys(q.alts).length ? Object.keys(q.alts) : ['A', 'B', 'C', 'D', 'E'];
      const errada = letras.find((l) => l !== q.gab);
      r.marcou = errada;
      await p.keyboard.press(errada); await p.keyboard.press('Enter'); await p.waitForTimeout(1200);
      const ver = p.locator('button.ra-link', { hasText: 'Ver sem animação' });
      if (await ver.count()) { await ver.first().click(); await p.waitForTimeout(800); }
      const det = p.locator('details.cor-outras');
      if (await det.count()) { await det.first().evaluate((d) => { d.open = true; }); }
      await p.waitForTimeout(300);
      r.depois = await p.evaluate(() => {
        const sec = document.querySelector('section.resolucao');
        if (!sec) return { semSecao: true, txt: (document.querySelector('main') || document.body).innerText.slice(0, 400) };
        const tw = document.createTreeWalker(sec, NodeFilter.SHOW_TEXT);
        const resid = [];
        for (let n = tw.nextNode(); n; n = tw.nextNode()) {
          if (n.parentElement.closest('.frac,.nuc,.sr,.katex,a,.res-fonte')) continue;
          const s = n.textContent;
          if (/÷/.test(s) || /[\d)²³]\/[\d(]/.test(s)) resid.push(s.slice(0, 120));
        }
        const t = sec.innerText;
        return { cab: sec.querySelector('.res-cab')?.innerText, errei: !!sec.querySelector('.cor-errei'), resposta: !!sec.querySelector('.cor-resposta'),
          passos: !!sec.querySelector('.cor-passos, .ra, [class*="ra-"]'), outras: !!sec.querySelector('.cor-outras'), semRes: /ainda está em revisão/.test(t),
          fonte: sec.querySelector('.res-fonte')?.innerText, nFrac: sec.querySelectorAll('.frac').length, resid,
          proib: (t.match(/[^.]*\b(talvez|provavelmente|chuta)\b[^.]*/gi) || []).slice(0, 3), site: /brasil ?escola|mundo ?educa|prepara ?enem|infoescola|toda ?mat[ée]ria/i.test(t) };
      });
      r.scrollLatDepois = await p.evaluate(() => document.scrollingElement.scrollWidth > innerWidth);
      if (/frac/.test(tipo)) await p.screenshot({ path: `../r3-dados-${tipo}-${m}-${id}.png`, fullPage: true });
    }
    r.erros = erros;
    out.push(r);
    await ctx.close();
  }
  fs.writeFileSync('amostra-out.json', JSON.stringify(out, null, 1));
  await b.close();
})();

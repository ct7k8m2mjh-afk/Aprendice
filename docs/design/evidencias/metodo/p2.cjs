const { abre } = require('./lib.cjs');
(async () => {
  for (const [W, tema] of [[1280, 'claro'], [1280, 'escuro'], [390, 'claro']]) {
    const { b, p } = await abre(W, tema);
    for (const h of ['/', '/m/mat', '/m/mat/tema/M02', '/m/mat/escada/M02.1', '/m/mat/q/Pb2623f68', '/revisao', '/m/bio/flashcards', '/m/bio/flashcards/sessao', '/simulados', '/perfil', '/config', '/hoje', '/desempenho', '/provas']) {
      await p.vai(h, 900);
      await p.evaluate(() => { document.activeElement && document.activeElement.blur(); window.scrollTo(0, 0); });
      const semFoco = [], fora = [], ordem = []; let n = 0; let antY = -1e9; let voltas = 0; const vistos = new Set();
      for (let i = 0; i < 70; i++) {
        await p.keyboard.press('Tab'); await p.waitForTimeout(25);
        const r = await p.evaluate(() => {
          const el = document.activeElement; if (!el || el === document.body) return null;
          const cs = getComputedStyle(el); const rc = el.getBoundingClientRect();
          const cls = (typeof el.className === 'string' ? el.className : '').trim().split(/\s+/).filter(c => c && !/^m-/.test(c)).slice(0, 2).join('.');
          let par = el.parentElement; let pc = ''; while (par && !pc) { pc = (typeof par.className === 'string' ? par.className : '').trim().split(/\s+/)[0] || ''; par = par.parentElement; }
          return { s: el.tagName.toLowerCase() + (cls ? '.' + cls : ' <' + pc), os: cs.outlineStyle, ow: cs.outlineWidth, oc: cs.outlineColor, oo: cs.outlineOffset, sh: cs.boxShadow, bc: cs.borderColor, w: rc.width, h: rc.height, x: rc.left, y: rc.top + window.scrollY, vis: rc.width > 0 && rc.height > 0 && cs.visibility !== 'hidden' && Number(cs.opacity) > 0.05, naTela: rc.bottom > 0 && rc.top < innerHeight && rc.right > 0 && rc.left < innerWidth, t: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 24) };
        });
        if (!r) continue; n++;
        const k = r.s + '|' + r.t; if (vistos.has(k) && i > 5) { voltas++; if (voltas > 2) break; } vistos.add(k);
        const temAnel = (r.os !== 'none' && parseFloat(r.ow) > 0) || (r.sh !== 'none' && /0px 0px 0px [2-9]/.test(r.sh));
        if (!temAnel) semFoco.push(r.s + ' «' + r.t + '» sh=' + r.sh.slice(0, 40));
        if (!r.vis || !r.naTela) fora.push(r.s + ' «' + r.t + '» vis=' + r.vis + ' naTela=' + r.naTela);
        if (i < 12) ordem.push(r.s + '«' + r.t.slice(0, 14) + '»');
      }
      console.log(`\n[${W} ${tema}] ${h} tabs=${n}\n  ordem: ${ordem.join(' > ')}\n  SEM INDICADOR: ${[...new Set(semFoco)].join(' ; ')}\n  FOCO INVISÍVEL: ${[...new Set(fora)].join(' ; ')}`);
    }
    await b.close();
  }
})();

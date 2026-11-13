// Gera um progresso de DEMONSTRAÇÃO (uma semana de estudo simulada) só para os prints das telas.
// Não entra no app: é usado por scripts/prints.cjs com DEMO=1.
const fs = require('fs');
const path = require('path');
const DIA = 864e5;

function rnd(seed) { let s = seed; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }

module.exports = function demo(agora = Date.now()) {
  const r = rnd(42);
  const materias = {};
  const base = path.join(__dirname, '..', 'public', 'conteudo');
  for (const m of ['bio', 'qui', 'mat', 'por']) {
    const banco = JSON.parse(fs.readFileSync(path.join(base, m, 'banco.json'), 'utf-8')).filter((q) => !q.pendente);
    const mat = JSON.parse(fs.readFileSync(path.join(base, m, 'materia.json'), 'utf-8'));
    const n = { bio: 46, qui: 34, mat: 28, por: 22 }[m];
    const q = {};
    // percorre escadas dos primeiros módulos em ordem de degrau (como um aluno faria)
    const porSub = {};
    for (const x of banco) (porSub[x.sub] = porSub[x.sub] || []).push(x);
    const subs = Object.keys(porSub).sort();
    let feitas = 0, ult = null;
    for (const s of subs) {
      const l = porSub[s].sort((a, b) => (a.degrau || 99) - (b.degrau || 99));
      for (const x of l.slice(0, 4)) {
        if (feitas >= n) break;
        const dias = Math.floor(r() * 7);
        const ts = agora - dias * DIA - Math.floor(r() * 8) * 36e5 - 2 * 36e5;
        const ok = r() < 0.68;
        const letras = ['A', 'B', 'C', 'D', 'E'].filter((y) => y !== x.gab);
        const conf = ok ? (r() < 0.75 ? 'certeza' : r() < 0.5 ? 'acho' : 'chute') : (r() < 0.35 ? 'certeza' : 'acho');
        q[x.id] = { tent: [{ letra: ok ? x.gab : letras[Math.floor(r() * 4)], ok, ts, seg: 40 + Math.floor(r() * 150), conf, ctx: 'escada' }], rev: r() < 0.05 };
        if (!ult || ts > q[ult].tent[0].ts) ult = x.id;
        feitas++;
      }
      if (feitas >= n) break;
    }
    const flash = {};
    for (const c of mat.flash.slice(0, 14)) {
      const ts = agora - Math.floor(r() * 5) * DIA - 36e5;
      const v = r() < 0.6 ? 'a' : r() < 0.6 ? 'q' : 'e';
      const etapa = v === 'a' ? 0 : v === 'q' ? 0 : -1;
      flash[c.id] = { etapa, vence: v === 'e' ? ts : ts + (r() < 0.4 ? -DIA : DIA * 2), hist: [{ ts, v }] };
    }
    const sessoes = [...Array(4)].map((_, i) => ({ ts: agora - i * 1.6 * DIA, seg: 600 + Math.floor(r() * 900) }));
    materias[m] = { q, ult, sims: [], flash, flg: {}, sessoes };
  }
  return { materias, simuladosFeitos: [], treino: {}, simulado: null };
};

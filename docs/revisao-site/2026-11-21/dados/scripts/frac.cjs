const fs = require('fs'), path = require('path');
const { partesFracao } = require('./fracao.cjs');
const D = '/home/user/Aprendice/app/dist/conteudo';
const MS = 'bio qui mat por fis geo his fs ing'.split(' ');
function* walk(o, p = '') {
  if (typeof o === 'string') yield [p, o];
  else if (Array.isArray(o)) for (let i = 0; i < o.length; i++) yield* walk(o[i], `${p}[${i}]`);
  else if (o && typeof o === 'object') for (const k of Object.keys(o)) yield* walk(o[k], p ? `${p}.${k}` : k);
}
const SKIP = /(^|\.)(img|tipo|id|sub|mod|fonte|url|credito|arquivo|print)$/;
// barra numérica/algébrica que sobra: exclui datas, leis, códigos, unidades e links
function residuos(t) {
  const out = [];
  for (const p of partesFracao(t)) {
    if (p.t !== 'txt') continue;
    const s = p.v;
    if (s.includes('÷')) for (const m of s.matchAll(/÷/g)) { const antes = s.slice(0, m.index); const anot = /(^|[(;:,·|]|\be|\bdepois|\bentão)\s*$/.test(antes) || /^\s*$/.test(antes); out.push([anot ? '÷anot' : '÷', s.slice(Math.max(0, m.index - 50), m.index + 40)]); }
    for (const m of s.matchAll(/(\S*)\/(\S*)/g)) {
      const tok = m[0].replace(/^["“'(«]+|["”'».,;:)]+$/g, ''), a = m[1], b = m[2];
      const ant = s.slice(0, m.index + m[1].length); if (/\^\([^)]*$/.test(ant)) continue;
      if (/https?:|www\.|\.(com|br|org|gov)/.test(tok)) continue;
      if (!/[\d)]$/.test(a.replace(/[²³]$/, '')) || !/^[\d(]/.test(b)) continue; // só número/grupo / número/grupo
      if (/^\d{1,2}\/\d{1,2}(\/\d{2,4})?[).,;:]?$/.test(tok.replace(/^\(/, ''))) continue; // data
      if (/^\(?\d{1,2}\/\d{4}/.test(tok)) continue; // mês/ano
      if (/^\(?(19|20)\d\d\/\d{1,2}[).,;:]?$/.test(tok)) continue; // 2024/2
      if (/\d\.\d{3}\/(19|20)\d\d/.test(tok) || /\d+\/(19|20)\d\d[).,;:]?$/.test(tok)) continue; // lei
      out.push(['/', s.slice(Math.max(0, m.index - 50), m.index + tok.length + 30)]);
    }
  }
  return out;
}
const R = { res: {}, teoria: {}, flash: {}, frases: {}, revisao: {}, provas: [] };
const qids = {};
for (const m of MS) {
  R.res[m] = []; R.teoria[m] = []; R.flash[m] = []; R.frases[m] = []; R.revisao[m] = [];
  const banco = JSON.parse(fs.readFileSync(`${D}/${m}/banco.json`));
  const vis = new Set(banco.filter((q) => !q.pendente && !q.outraMateria && !q.anuladaAprendice && !q.indisponivel).map((q) => q.id));
  const ids = new Set();
  for (const f of fs.readdirSync(`${D}/${m}/res`)) {
    const res = JSON.parse(fs.readFileSync(`${D}/${m}/res/${f}`));
    for (const [id, r] of Object.entries(res)) {
      if (!vis.has(id)) continue;
      for (const [p, s] of walk(r)) {
        if (SKIP.test(p) || !/^(resposta|armadilha|erradas\.|passos\[\d+\]\.(faz|conta|porque)|quadro\[\d+\]\.(linha|nota))/.test(p)) continue;
        for (const [k, tr] of residuos(s)) { R.res[m].push(`${id} ${p}: "${k}" em «${tr}»`); ids.add(id); }
      }
    }
  }
  qids[m] = [...ids].sort();
  const mat = JSON.parse(fs.readFileSync(`${D}/${m}/materia.json`));
  for (const [p, s] of walk(mat.modulos)) { if (SKIP.test(p) || s.includes('\\')) continue; for (const [k, tr] of residuos(s)) R.teoria[m].push(`${p}: "${k}" em «${tr}»`); }
  for (const f of [...(mat.flash || []), ...(mat.flashImg || [])]) for (const [p, s] of walk(f)) { if (SKIP.test(p)) continue; for (const [k, tr] of residuos(s)) R.flash[m].push(`${f.id} ${p}: "${k}" em «${tr}»`); }
  for (const f of mat.essencial?.completar || []) for (const [p, s] of walk(f)) { if (SKIP.test(p)) continue; for (const [k, tr] of residuos(s)) R.frases[m].push(`${f.id} ${p}: "${k}" em «${tr}»`); }
  const rd = `${D}/${m}/revisao`;
  for (const f of fs.readdirSync(rd).filter((x) => x.endsWith('.json'))) {
    for (const [p, s] of walk(JSON.parse(fs.readFileSync(`${rd}/${f}`)))) { if (SKIP.test(p) || /pendencias|fontes|movimento|roteiro|legenda_fonte/.test(p) || s.includes('\\') || /\.(webp|png|jpg|svg)$/i.test(s) || s.startsWith('File:')) continue; for (const [k, tr] of residuos(s)) R.revisao[m].push(`${f} ${p}: "${k}" em «${tr}»`); }
  }
}
const resumo = {};
for (const k of ['res', 'teoria', 'flash', 'frases', 'revisao']) resumo[k] = Object.fromEntries(MS.map((m) => [m, R[k][m].length]));
resumo.questoes = Object.fromEntries(MS.map((m) => [m, qids[m].length]));
fs.writeFileSync(process.argv[2], JSON.stringify({ resumo, qids, ...R }, null, 1));
console.log(JSON.stringify(resumo));

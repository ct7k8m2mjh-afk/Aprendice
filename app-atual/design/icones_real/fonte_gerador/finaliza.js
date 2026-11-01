// Enquadra cada SVG bruto: mede a caixa real do desenho no navegador (getBBox), monta um viewBox quadrado com o
// objeto ocupando ~85% e centralizado, otimiza com SVGO (ids prefixados com o id do modulo) e grava em icones_real/.
// uso: node finaliza.js <dir_bruto> <dir_saida> [ids...]
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const { optimize } = require(process.env.SVGO || 'svgo');
(async () => {
  const [, , dirIn, dirOut, ...so] = process.argv;
  const arqs = fs.readdirSync(dirIn).filter(f => f.endsWith('.svg') && (!so.length || so.includes(f.slice(0, -4))));
  const b = await chromium.launch(); const p = await b.newPage();
  const rel = [];
  for (const f of arqs) {
    const id = f.slice(0, -4); const src = fs.readFileSync(path.join(dirIn, f), 'utf8');
    await p.setContent('<!doctype html><body style="margin:0">' + src + '</body>');
    const bb = await p.evaluate(() => { const g = document.querySelector('#raiz'); const r = g.getBBox(); return [r.x, r.y, r.width, r.height]; });
    const ocup = parseFloat((src.match(/data-ocupa="([\d.]+)"/) || [0, '0.85'])[1]);
    const lado = Math.max(bb[2], bb[3]) / ocup; const cx = bb[0] + bb[2] / 2, cy = bb[1] + bb[3] / 2;
    const vb = [cx - lado / 2, cy - lado / 2, lado, lado].map(v => +v.toFixed(2)).join(' ');
    let s = src.replace(/<svg[^>]*>/, `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="${vb}">`);
    const prec = +(process.env.PREC || 1);
    const r = optimize(s, { multipass: true, floatPrecision: prec, plugins: [
      { name: 'preset-default', params: { overrides: { removeViewBox: false, cleanupIds: { minify: true } } } },
      { name: 'prefixIds', params: { prefix: id, delim: '-' } }, 'removeDimensions'] });
    fs.writeFileSync(path.join(dirOut, f), r.data);
    rel.push(`${id}\t${(r.data.length / 1024).toFixed(1)} KB\tbbox ${bb.map(v => v.toFixed(0)).join(',')}`);
  }
  await b.close(); console.log(rel.join('\n'));
})();

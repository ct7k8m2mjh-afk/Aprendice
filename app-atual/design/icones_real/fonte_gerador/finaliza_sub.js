// Variante do finaliza.js para os icones dos CONTEUDOS (subtemas): a caixa do desenho e medida pelos PIXELS
// pintados (alfa > LIM), e nao por getBBox, para que recortes (clipPath), filtros e sombras desfocadas entrem
// certo no enquadramento. Depois: viewBox quadrado com o objeto ocupando ~85%, SVGO com ids prefixados pelo id.
// uso: SVGO=<pacote svgo> node finaliza_sub.js <dir_bruto> <dir_saida> [ids...]
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
    // area de medicao: -200..400 nas coordenadas de trabalho (0..200), 2 px por unidade
    const med = src.replace(/<svg[^>]*>/, '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-200 -200 600 600" width="1200" height="1200">');
    // poda: dentro de <g data-poda="x y w h"> (coordenadas de trabalho), remove os desenhos que ficam fora do recorte
    await p.setContent('<!doctype html><body style="margin:0">' + med + '</body>');
    const med2 = await p.evaluate(() => {
      const svg = document.querySelector('svg'); const M = svg.getScreenCTM();
      for (const g of svg.querySelectorAll('[data-poda]')) {
        const [x, y, w, h] = g.getAttribute('data-poda').split(/[ ,]+/).map(Number);
        const a = new DOMPoint(x, y).matrixTransform(M), z = new DOMPoint(x + w, y + h).matrixTransform(M);
        for (const e of [...g.querySelectorAll('path,circle,ellipse,rect,polygon,polyline,line,use,image,text')]) {
          if (e.closest('defs,clipPath,mask,pattern,linearGradient,radialGradient,filter')) continue;
          const r = e.getBoundingClientRect();
          if (r.right < a.x || r.left > z.x || r.bottom < a.y || r.top > z.y) e.remove();
        }
        for (const e of [...g.querySelectorAll('g')].reverse()) if (!e.children.length) e.remove();
        g.removeAttribute('data-poda');
      }
      return new XMLSerializer().serializeToString(svg);
    });
    const src2 = med2.replace(/<svg[^>]*>/, src.match(/<svg[^>]*>/)[0]);
    const bb = await p.evaluate(async (s) => {
      const img = new Image(); img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
      await img.decode(); const c = document.createElement('canvas'); c.width = c.height = 1200;
      const g = c.getContext('2d'); g.drawImage(img, 0, 0, 1200, 1200); const d = g.getImageData(0, 0, 1200, 1200).data;
      let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
      for (let y = 0; y < 1200; y++) for (let x = 0; x < 1200; x++) if (d[(y * 1200 + x) * 4 + 3] > 20) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      return [x0 / 2 - 200, y0 / 2 - 200, (x1 - x0 + 1) / 2, (y1 - y0 + 1) / 2];
    }, med2);
    const ocup = parseFloat((src.match(/data-ocupa="([\d.]+)"/) || [0, '0.85'])[1]);
    const lado = Math.max(bb[2], bb[3]) / ocup; const cx = bb[0] + bb[2] / 2, cy = bb[1] + bb[3] / 2;
    const vb = [cx - lado / 2, cy - lado / 2, lado, lado].map(v => +v.toFixed(2)).join(' ');
    let s = src2.replace(/<svg[^>]*>/, `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="${vb}">`);
    const prec = +(process.env.PREC || (src.match(/data-prec="(\d)"/) || [0, 1])[1]);
    const opt = (txt, pr, pfx, semCPD) => optimize(txt, { multipass: true, floatPrecision: pr, plugins: [
      { name: 'preset-default', params: { overrides: { removeViewBox: false, cleanupIds: { minify: true }, ...(semCPD ? { convertPathData: false } : {}) } } },
      ...(semCPD ? [{ name: 'convertPathData', params: { floatPrecision: pr, makeArcs: false, utilizeAbsolute: false, removeUseless: false, collapseRepeated: false, curveSmoothShorthands: false, straightCurves: false, convertToQ: false, convertToZ: false } }] : []),
      ...(pfx ? [{ name: 'prefixIds', params: { prefix: id, delim: '-' } }] : []), 'removeDimensions'] });
    let r;
    try { r = opt(s, prec, true); }
    catch (e) { try { r = opt(opt(s, prec + 1, false).data, prec, true); } catch (e2) { r = opt(s, prec, true, true); } }   // contorna um erro do SVGO em curvas degeneradas
    fs.writeFileSync(path.join(dirOut, f), r.data);
    rel.push(`${id}\t${(r.data.length / 1024).toFixed(1)} KB\tbbox ${bb.map(v => v.toFixed(0)).join(',')}`);
  }
  await b.close(); console.log(rel.join('\n'));
})();

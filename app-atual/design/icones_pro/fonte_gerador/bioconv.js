// Converte ilustracoes do bioicons para o tratamento unico (silhueta a 25% + linhas a 100%, traco 3/48).
// uso: node bioconv.js in.json out.json   (in: [{key,file,opts}])
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const items = JSON.parse(fs.readFileSync(process.argv[2]));
  const out = fs.existsSync(process.argv[3]) ? JSON.parse(fs.readFileSync(process.argv[3])) : {};
  const b = await chromium.launch();
  const p = await b.newPage();
  for (const it of items) {
    try {
      await p.goto('file://' + it.file);
      const r = await p.evaluate((o) => {
        o = o || {};
        const root = document.documentElement;
        const SH = 'path,rect,circle,ellipse,polygon,polyline,line';
        const inv = root.getScreenCTM().inverse();
        const lum = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return 1; const v = m[1].split(',').map(parseFloat); if (v.length > 3 && v[3] === 0) return -1; return (0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]) / 255; };
        const els = [...root.querySelectorAll(SH)].filter(e => !e.closest('defs,clipPath,mask,symbol,marker,pattern,metadata'));
        const recs = [];
        let i = -1;
        for (const e of els) {
          i++;
          const cs = getComputedStyle(e);
          if (cs.display === 'none' || cs.visibility === 'hidden') continue;
          let op = parseFloat(cs.opacity); let a = e.parentElement; while (a && a !== root) { op *= parseFloat(getComputedStyle(a).opacity); a = a.parentElement; }
          if (op < 0.15) continue;
          const sc = e.getScreenCTM(); if (!sc) continue;
          const M = inv.multiply(sc);
          const bb = e.getBBox();
          const det = Math.sqrt(Math.abs(M.a * M.d - M.b * M.c)) || 1;
          const area = bb.width * bb.height * det * det;
          const fillL = cs.fill === 'none' ? -1 : lum(cs.fill);
          const hasStroke = cs.stroke !== 'none' && parseFloat(cs.strokeWidth) > 0 && lum(cs.stroke) >= 0;
          const strokeL = hasStroke ? lum(cs.stroke) : -1;
          if (fillL < 0 && !hasStroke) continue;
          recs.push({ i, e, M, det, area, fillL, hasStroke, strokeL, fr: cs.fillRule, sw: parseFloat(cs.strokeWidth) * det });
        }
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        root.appendChild(g);
        const tot = root.getBBox();
        const big = Math.max(tot.width, tot.height);
        const drop = new Set(o.drop || []);
        const keep = recs.filter(r => !drop.has(r.i) && r.area >= (o.minArea || 0) * big * big);
        // bbox only of kept shapes
        let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
        for (const r of keep) {
          const bb = r.e.getBBox();
          for (const [x, y] of [[bb.x, bb.y], [bb.x + bb.width, bb.y], [bb.x, bb.y + bb.height], [bb.x + bb.width, bb.y + bb.height]]) {
            const X = r.M.a * x + r.M.c * y + r.M.e, Y = r.M.b * x + r.M.d * y + r.M.f;
            x0 = Math.min(x0, X); y0 = Math.min(y0, Y); x1 = Math.max(x1, X); y1 = Math.max(y1, Y);
          }
        }
        const box = o.box || 40;
        const s = box / Math.max(x1 - x0, y1 - y0);
        const tx = 24 - s * (x0 + x1) / 2, ty = 24 - s * (y0 + y1) / 2;
        const W = (o.w || 3) / s; // largura em unidades da raiz
        const geo = (r) => {
          const c = r.e.cloneNode(false);
          for (const at of [...c.attributes]) if (!['d', 'x', 'y', 'width', 'height', 'rx', 'ry', 'cx', 'cy', 'r', 'points', 'x1', 'y1', 'x2', 'y2'].includes(at.name)) c.removeAttribute(at.name);
          const M = r.M; c.setAttribute('transform', `matrix(${M.a} ${M.b} ${M.c} ${M.d} ${M.e} ${M.f})`);
          return c;
        };
        const ser = new XMLSerializer();
        const tint = [], solid = [], line = [];
        const dark = o.dark == null ? 0.3 : o.dark;
        const solidSet = new Set(o.solid || []), noLine = new Set(o.noline || []), noTint = new Set(o.notint || []);
        for (const r of keep) {
          const isLineOnly = r.fillL < 0;
          if (!isLineOnly) {
            const c = geo(r); c.setAttribute('fill-rule', r.fr);
            if (solidSet.has(r.i) || (o.darkSolid && r.fillL < dark)) solid.push(ser.serializeToString(c));
            else if (!noTint.has(r.i)) tint.push(ser.serializeToString(c));
          }
          if (!noLine.has(r.i) && !(o.lineOnlyStroked && !r.hasStroke)) {
            const c = geo(r);
            c.setAttribute('stroke-width', (isLineOnly && o.keepStrokeW ? r.sw : W) / r.det);
            line.push(ser.serializeToString(c));
          }
        }
        const clean = (s) => s.replace(/ xmlns="[^"]*"/g, '');
        return {
          svg: `<g transform="matrix(${s} 0 0 ${s} ${tx} ${ty})">` +
            (tint.length ? `<g fill="currentColor" opacity=".25">${clean(tint.join(''))}</g>` : '') +
            (solid.length ? `<g fill="currentColor">${clean(solid.join(''))}</g>` : '') +
            (line.length ? `<g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-linecap="round">${clean(line.join(''))}</g>` : '') + '</g>',
          n: recs.length, kept: keep.length,
          idx: recs.map(r => [r.i, Math.round(r.area / big / big * 1000) / 1000, Math.round(r.fillL * 100) / 100])
        };
      }, it.opts || {});
      out[it.key] = r;
    } catch (err) { out[it.key] = { err: String(err) }; }
  }
  await b.close();
  fs.writeFileSync(process.argv[3], JSON.stringify(out));
})();

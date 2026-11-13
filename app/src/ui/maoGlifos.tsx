import { Fragment, type ReactNode } from 'react';
import { partesNotacao } from '../logica/notacao';

/**
 * A letra à mão (Caveat) não tem alguns sinais da conta: "√", "→", "⇒", "≈", "≤", "≥", "≠", "Δ", "π", "μ" e os
 * números pequenos "⁴…⁹", "⁻", "⁺", "₀…₉" (auditoria M2: o navegador trocava de letra no meio da conta).
 * Aqui eles são desenhados com o mesmo traço da caneta (SVG de traço único, na cor da tinta), ou escritos com os
 * algarismos da própria Caveat em <sup>/<sub>. O caractere dos dados fica escondido ao lado (leitor de tela, copiar e
 * colar); o desenho é aria-hidden.
 */
const G: Record<string, { w: number; d: string }> = {
  '√': { w: 64, d: 'M4 58 Q11 53 17 51 L32 88 Q41 52 50 12 Q56 10 64 10' },
  '→': { w: 92, d: 'M6 53 Q44 50 84 53 M64 37 Q75 46 85 53 Q75 60 64 69' },
  '⇒': { w: 92, d: 'M6 43 Q40 41 74 43 M6 63 Q40 61 74 63 M60 27 Q74 41 86 53 Q74 65 60 79' },
  '⟹': { w: 100, d: 'M6 43 Q44 41 82 43 M6 63 Q44 61 82 63 M68 27 Q82 41 94 53 Q82 65 68 79' },
  '≈': { w: 74, d: 'M8 44 Q20 32 34 43 Q48 54 64 40 M8 64 Q20 52 34 63 Q48 74 64 60' },
  '≤': { w: 72, d: 'M62 20 L12 42 L62 62 M12 80 Q38 78 62 80' },
  '≥': { w: 72, d: 'M12 20 L62 42 L12 62 M12 80 Q38 78 62 80' },
  '≠': { w: 72, d: 'M8 44 Q36 42 64 44 M8 64 Q36 62 64 64 M48 18 L24 88' },
  'Δ': { w: 80, d: 'M8 84 Q24 50 40 14 Q56 50 72 84 Q40 82 8 84' },
  'π': { w: 76, d: 'M6 32 Q36 24 70 28 M26 30 Q25 60 16 84 M52 30 Q50 62 60 84' },
  '∴': { w: 70, d: 'M33 26 l0.1 0 M14 74 l0.1 0 M54 74 l0.1 0' },
  '∝': { w: 84, d: 'M78 34 Q60 28 46 48 Q32 70 18 66 Q6 62 8 50 Q10 36 24 36 Q38 38 50 56 Q62 72 78 66' },
};
const PEQ_SOBE: Record<string, string> = { '⁰': '0', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '−', '⁺': '+' };
const PEQ_DESCE: Record<string, string> = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9', 'ₙ': 'n' };
const TROCA: Record<string, string> = { 'μ': 'µ' }; // o "micro" da Caveat é o mesmo desenho

const RE = new RegExp(`[${Object.keys(G).join('')}${Object.keys(PEQ_SOBE).join('')}${Object.keys(PEQ_DESCE).join('')}${Object.keys(TROCA).join('')}]+`, 'gu');

function glifo(ch: string, k: string | number): ReactNode {
  const g = G[ch];
  if (g) {
    return (
      <Fragment key={k}>
        <svg className="mao-g" viewBox={`0 0 ${g.w} 100`} style={{ width: `${g.w / 100}em` }} aria-hidden focusable="false"><path d={g.d} /></svg>
        <span className="sr">{ch}</span>
      </Fragment>
    );
  }
  const vis = TROCA[ch];
  if (vis) return <Fragment key={k}><span aria-hidden className="mao-troca">{vis}</span><span className="sr">{ch}</span></Fragment>;
  return null;
}

/** um trecho de texto na letra à mão, com os sinais que faltam desenhados */
function trechoMao(s: string, chave: string): ReactNode[] {
  const out: ReactNode[] = [];
  let ult = 0;
  RE.lastIndex = 0;
  for (let m = RE.exec(s); m; m = RE.exec(s)) {
    if (m.index > ult) out.push(s.slice(ult, m.index));
    // sequência de números pequenos vira um <sup>/<sub> só
    const run = m[0];
    let i = 0;
    while (i < run.length) {
      const ch = run[i];
      if (PEQ_SOBE[ch] || PEQ_DESCE[ch]) {
        const tab = PEQ_SOBE[ch] ? PEQ_SOBE : PEQ_DESCE;
        let j = i;
        while (j < run.length && tab[run[j]]) j++;
        const orig = run.slice(i, j), vis = [...orig].map((c) => tab[c]).join('');
        out.push(<Fragment key={`${chave}-${m.index}-${i}`}>{tab === PEQ_SOBE ? <sup className="nt-sup" aria-hidden>{vis}</sup> : <sub className="nt-sub" aria-hidden>{vis}</sub>}<span className="sr">{orig}</span></Fragment>);
        i = j;
      } else { out.push(glifo(ch, `${chave}-${m.index}-${i}`)); i++; }
    }
    ult = m.index + run.length;
  }
  if (ult < s.length) out.push(s.slice(ult));
  return out;
}

/** texto da conta na letra à mão: expoente, índice e fórmula química (logica/notacao.ts) + sinais desenhados */
export function textoMao(s: string): ReactNode {
  const ps = partesNotacao(s);
  return ps.map((p, i) => p.t === 'txt' ? <Fragment key={i}>{trechoMao(p.v, String(i))}</Fragment> : (
    <Fragment key={i}>
      {p.pre && <span className="sr">{p.pre}</span>}
      {p.t === 'sup' ? <sup className="nt-sup">{trechoMao(p.v, `${i}s`)}</sup> : <sub className="nt-sub">{trechoMao(p.v, `${i}s`)}</sub>}
      {p.pos && <span className="sr">{p.pos}</span>}
    </Fragment>
  ));
}

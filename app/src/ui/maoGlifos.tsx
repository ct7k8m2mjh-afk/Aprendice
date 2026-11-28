import { Fragment, type ReactNode } from 'react';
import { partesNotacao } from '../logica/notacao';

/**
 * A letra à mão (Caveat) não tem alguns sinais da conta: "√", "→", "⇒", "≈", "≤", "≥", "≠", "Δ", "π", "μ" e os
 * números pequenos "⁴…⁹", "⁻", "⁺", "₀…₉" (auditoria M2: o navegador trocava de letra no meio da conta).
 * Aqui eles são desenhados com o mesmo traço da caneta (SVG de traço único, na cor da tinta), ou escritos com os
 * algarismos da própria Caveat em <sup>/<sub>. O caractere dos dados fica escondido ao lado (leitor de tela, copiar e
 * colar); o desenho é aria-hidden.
 */
// Medidas da Caveat (conferidas no navegador, 27/11/2026): no desenho de 100 de altura (1em), a linha de base fica em
// y = 84; a altura do x em y ≈ 48 (0,36em), a dos algarismos em y ≈ 28 (0,56em), a das maiúsculas em y ≈ 16 (0,68em),
// e o meio do "=" e do "−" (eixo da conta) em y ≈ 63. Cada sinal desenhado segue essas alturas (pedido do dono, 27/11:
// "todos os caracteres devem estar alinhados e ser do mesmo tamanho"): o Δ da altura de uma maiúscula da Caveat, a seta e o
// "≈" no eixo do "=", as letras gregas minúsculas na altura do x, e o traço com a espessura do traço da Caveat 500.
const G: Record<string, { w: number; d: string }> = {
  'Δ': { w: 62, d: 'M8 84 Q18 54 30 22 Q42 54 54 84 Q31 82 8 84' },
  '√': { w: 60, d: 'M4 60 Q9 56 14 55 L27 87 Q35 54 44 18 Q50 16 58 17' },
  '→': { w: 84, d: 'M6 63 Q40 61 76 63 M62 52 Q70 58 77 63 Q70 68 62 74' },
  '←': { w: 84, d: 'M8 63 Q42 61 78 63 M22 52 Q14 58 7 63 Q14 68 22 74' },
  '↔': { w: 86, d: 'M8 63 Q43 61 78 63 M20 52 Q13 58 7 63 Q13 68 20 74 M66 52 Q73 58 79 63 Q73 68 66 74' },
  '↑': { w: 52, d: 'M26 84 Q27 52 26 20 M14 34 Q20 26 26 18 Q32 26 38 34' },
  '↓': { w: 52, d: 'M26 18 Q27 50 26 82 M14 68 Q20 76 26 84 Q32 76 38 68' },
  '⇒': { w: 86, d: 'M6 56 Q36 55 66 56 M6 70 Q36 69 66 70 M56 44 Q68 54 78 63 Q68 72 56 82' },
  '⟹': { w: 96, d: 'M6 56 Q41 55 76 56 M6 70 Q41 69 76 70 M66 44 Q78 54 88 63 Q78 72 66 82' },
  '⇌': { w: 84, d: 'M6 56 Q40 55 74 56 M62 47 L76 56 M10 70 Q44 69 78 70 M22 79 L8 70' },
  '≈': { w: 66, d: 'M8 55 Q19 47 32 55 Q45 63 58 54 M8 71 Q19 63 32 71 Q45 79 58 70' },
  '≤': { w: 66, d: 'M56 32 L12 50 L56 68 M12 82 Q34 81 56 82' },
  '≥': { w: 66, d: 'M12 32 L56 50 L12 68 M12 82 Q34 81 56 82' },
  '≠': { w: 66, d: 'M8 54 Q33 53 58 54 M8 70 Q33 69 58 70 M44 38 L22 88' },
  '∞': { w: 74, d: 'M37 63 Q27 51 17 52 Q7 53 7 63 Q7 73 17 74 Q27 75 37 63 Q47 51 57 52 Q67 53 67 63 Q67 73 57 74 Q47 75 37 63' },
  '∴': { w: 58, d: 'M29 50 l0.1 0 M13 81 l0.1 0 M45 81 l0.1 0' },
  '∝': { w: 74, d: 'M66 52 Q54 48 44 60 Q34 74 22 72 Q10 70 11 62 Q12 52 22 52 Q34 53 44 64 Q54 76 66 72' },
  // letras gregas: minúsculas na altura do x (com haste quando a letra tem), maiúsculas na altura da maiúscula
  'π': { w: 66, d: 'M6 52 Q32 46 60 49 M24 50 Q23 70 16 84 M45 50 Q43 70 53 84' },
  'θ': { w: 56, d: 'M28 18 Q9 20 9 51 Q10 84 28 84 Q46 84 46 51 Q46 18 28 18 M11 51 Q28 50 45 51' },
  'α': { w: 62, d: 'M50 52 Q44 84 26 84 Q10 84 10 67 Q10 48 28 48 Q44 48 48 66 Q52 84 58 84' },
  'β': { w: 56, d: 'M14 102 L14 34 Q14 16 30 16 Q44 16 44 32 Q44 46 28 48 Q48 50 48 66 Q48 84 30 84 Q20 84 14 76' },
  'γ': { w: 54, d: 'M6 50 Q16 48 24 64 L34 84 Q40 98 34 102 Q28 98 34 84 L48 50' },
  'δ': { w: 56, d: 'M40 22 Q30 16 22 20 Q14 26 26 38 L36 48 Q48 58 46 70 Q44 84 28 84 Q10 84 10 68 Q10 52 28 46' },
  'ε': { w: 52, d: 'M44 52 Q36 47 26 48 Q12 50 13 59 Q14 66 26 66 M24 66 Q10 67 10 75 Q10 84 26 84 Q38 84 46 79' },
  'η': { w: 56, d: 'M8 52 Q16 47 18 56 L18 84 M18 62 Q24 48 35 48 Q46 48 46 62 L46 102' },
  'λ': { w: 58, d: 'M10 18 Q20 18 28 34 L52 84 M32 44 L12 84' },
  'ρ': { w: 56, d: 'M14 102 L14 66 Q14 48 30 48 Q46 48 46 66 Q46 84 30 84 Q18 84 14 74' },
  'σ': { w: 60, d: 'M54 48 L30 48 Q10 48 10 66 Q10 84 28 84 Q44 84 44 66 Q44 52 30 48' },
  'τ': { w: 58, d: 'M6 52 Q30 46 54 50 M30 50 Q28 72 34 84 Q40 86 46 80' },
  'φ': { w: 60, d: 'M33 30 L29 102 M24 48 Q9 52 9 66 Q10 84 30 84 Q50 84 50 66 Q50 48 36 48' },
  'ω': { w: 66, d: 'M16 50 Q8 66 14 78 Q22 88 32 74 Q34 66 33 60 Q34 66 36 74 Q44 88 52 78 Q58 66 50 50' },
  'ℓ': { w: 52, d: 'M16 78 Q30 66 35 46 Q40 22 33 18 Q24 18 22 46 Q20 84 34 84 Q42 84 47 76' },
  'Ω': { w: 72, d: 'M8 84 L24 84 Q10 70 10 50 Q10 18 36 18 Q62 18 62 50 Q62 70 48 84 L64 84' },
  'Σ': { w: 64, d: 'M56 20 L12 20 L36 52 L12 84 L56 84' },
  'Φ': { w: 68, d: 'M34 12 L34 92 M34 32 Q10 34 10 52 Q10 70 34 72 Q58 70 58 52 Q58 34 34 32' },
};
G['∆'] = G['Δ']; // o "incremento" do Unicode (U+2206) também aparece nos dados
// "¹²³" entram também (revisão de 19/11/2026, item 21): misturados com os outros ("3d¹⁰"), o "¹" miúdo da Caveat ao lado do
// "0" escrito em <sup> se lia como "ᴾ"; e as letras pequenas dos índices ("XᴬXᵃ") saem com as letras da própria Caveat
const PEQ_SOBE: Record<string, string> = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '−', '⁺': '+',
  ...Object.fromEntries([...'ᴬᴮᴰᴱᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾᴿᵀᵁᵂ'].map((c, i) => [c, 'ABDEGHIJKLMNOPRTUW'[i]])),
  ...Object.fromEntries([...'ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖʳˢᵗᵘᵛʷˣʸᶻ'].map((c, i) => [c, 'abcdefghijklmnoprstuvwxyz'[i]])) };
const PEQ_DESCE: Record<string, string> = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9', 'ₙ': 'n' };
const TROCA: Record<string, string> = { 'μ': 'µ', '⋅': '·' }; // o "micro" e o ponto da Caveat são o mesmo desenho

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

/** um trecho de texto na letra à mão, com os sinais que faltam desenhados (também nas fórmulas e no caderno da teoria) */
export function trechoMao(s: string, chave: string): ReactNode[] {
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
        out.push(<Fragment key={`${chave}-${m.index}-${i}`}>{tab === PEQ_SOBE ? <sup className={'nt-sup' + (/^[A-Za-z]+$/.test(vis) ? ' nt-letra' : '')} aria-hidden>{vis}</sup> : <sub className="nt-sub" aria-hidden>{vis}</sub>}<span className="sr">{orig}</span></Fragment>);
        i = j;
      } else { out.push(glifo(ch, `${chave}-${m.index}-${i}`)); i++; }
    }
    ult = m.index + run.length;
  }
  if (ult < s.length) out.push(s.slice(ult));
  return out;
}

const RE_MIUDO = new RegExp(`[${Object.keys(PEQ_SOBE).join('')}]+|[${Object.keys(PEQ_DESCE).join('')}]+`, 'gu');
/** Números e letras pequenos do Unicode ("v₀", "s₁", "10⁻⁹", "Xᴴ") no texto da interface e da explicação: a Familjen e a
 *  Literata não têm esses caracteres, e o navegador trocava de fonte (pedido do dono, 27/11/2026: o índice tem de ser
 *  claramente menor e mais baixo que a letra). Viram <sub>/<sup> na letra do próprio texto; o algarismo desenhado vem do
 *  CSS (data-v), e o caractere dos dados continua no documento (leitor de tela, copiar e colar, testes). */
export function miudos(s: string, k = 'u'): ReactNode {
  if (!RE_MIUDO.test(s)) return s;
  RE_MIUDO.lastIndex = 0;
  const out: ReactNode[] = [];
  let ult = 0;
  for (let m = RE_MIUDO.exec(s); m; m = RE_MIUDO.exec(s)) {
    if (m.index > ult) out.push(s.slice(ult, m.index));
    const sobe = !!PEQ_SOBE[m[0][0]];
    const tab = sobe ? PEQ_SOBE : PEQ_DESCE;
    const vis = [...m[0]].map((c) => tab[c]).join('');
    const Tag = sobe ? 'sup' : 'sub';
    // o desenho vem do CSS (.frac-v, data-v), como os algarismos da fração miúda ("₁/₂"): fora do texto do documento
    out.push(<Tag key={`${k}${m.index}`} className={(sobe ? 'nt-sup' : 'nt-sub') + (sobe && /^[A-Za-z]+$/.test(vis) ? ' nt-letra' : '')}><span className="frac-v" data-v={vis} /><span className="sr">{m[0]}</span></Tag>);
    ult = m.index + m[0].length;
  }
  if (ult < s.length) out.push(s.slice(ult));
  return out;
}

/** texto da conta na letra à mão: expoente, índice e fórmula química (logica/notacao.ts) + sinais desenhados */
export function textoMao(s: string, maiusculas = false): ReactNode {
  const ps = partesNotacao(s, maiusculas);
  return ps.map((p, i) => p.t === 'txt' ? <Fragment key={i}>{trechoMao(p.v, String(i))}</Fragment> : (
    <Fragment key={i}>
      {p.pre && <span className="sr">{p.pre}</span>}
      {p.t === 'sup' ? <sup className="nt-sup">{trechoMao(p.v, `${i}s`)}</sup> : <sub className="nt-sub">{trechoMao(p.v, `${i}s`)}</sub>}
      {p.pos && <span className="sr">{p.pos}</span>}
    </Fragment>
  ));
}

import { Fragment, type ReactNode } from 'react';
import { partesFracao, type ParteFracao } from '../logica/fracao';
import { partesNotacao } from '../logica/notacao';

/**
 * Mostra o texto com as frações empilhadas (numerador, barra, denominador), montadas pelo layout (guia tipográfico),
 * e com expoente, índice e fórmula química de verdade (logica/notacao.ts: "10^−2", "V_R", "H2SO4", "H+").
 * Divisão com "÷" ou "/" entre espaços também empilha (comando 20). Notação de nuclídeo ("207/82 Pb") sai como
 * índices antes do símbolo, sem barra.
 * O texto não muda: o sinal escrito ("/", " ÷ ", "^", "_") e os parênteses que o layout tira continuam no documento,
 * escondidos, para leitor de tela, copiar e colar e testes.
 */
export function comFracoes(texto: string): ReactNode {
  const partes = partesFracao(texto);
  if (partes.length === 1 && partes[0].t === 'txt') return comNotacao(texto);
  return partes.map((p, i) => p.t === 'txt' ? <Fragment key={i}>{comNotacao(p.v)}</Fragment> : p.t === 'nuc' ? (
    // nuclídeo: número de massa em cima e número atômico embaixo, à esquerda do símbolo, sem barra
    <span key={i} className="nuc">
      <span className="nuc-a">{p.a}</span><span className="sr">/</span><span className="nuc-z">{p.z}</span><span className="sr"> </span>
    </span>
  ) : <Fracao key={i} p={p} />);
}

/** fração empilhada; numerador e denominador podem ter outra fração dentro ("(x ÷ 6) ÷ (1 − x²)") */
export function Fracao({ p, n, d, className = 'frac', props }: {
  p: Extract<ParteFracao, { t: 'frac' }>; n?: ReactNode; d?: ReactNode; className?: string; props?: Record<string, unknown>;
}) {
  return (
    <span className={className} {...props}>
      {p.pn && <span className="sr">(</span>}
      <span className="frac-n" data-p="n">{n ?? comFracoes(p.n)}</span>
      {p.pn && <span className="sr">)</span>}
      <span className="sr">{p.sep ?? '/'}</span>
      {p.pd && <span className="sr">(</span>}
      <span className="frac-d" data-p="d">{d ?? comFracoes(p.d)}</span>
      {p.pd && <span className="sr">)</span>}
    </span>
  );
}

/** expoente, índice e fórmula química (o sinal escrito fica escondido). Fração dentro do expoente ou do índice
 *  ("(½)^(t/6)", "2^(t/20)", "log₁/₂ x") também sai empilhada, pequena (revisão de 21/11/2026, matérias-2 R1). */
export function comNotacao(s: string): ReactNode {
  const ps = partesNotacao(s);
  if (ps.length === 1 && ps[0].t === 'txt') return comFracaoMiuda(s);
  return ps.map((p, i) => {
    if (p.t === 'txt') return <Fragment key={i}>{comFracaoMiuda(p.v)}</Fragment>;
    const temFrac = p.v.includes('/') && partesFracao(p.v).some((x) => x.t === 'frac');
    const v = temFrac ? comFracoes(p.v) : p.v;
    const cls = temFrac ? ' nt-frac' : '';
    return (
      <Fragment key={i}>
        {p.pre && <span className="sr">{p.pre}</span>}
        {p.t === 'sup' ? <sup className={'nt-sup' + cls}>{v}</sup> : <sub className={'nt-sub' + cls}>{v}</sub>}
        {p.pos && <span className="sr">{p.pos}</span>}
      </Fragment>
    );
  });
}

// fração escrita com algarismos já sobrescritos ou subscritos do Unicode ("log₁/₂ x", "t₁/₂", "x¹/²")
const SUBS = '₀₁₂₃₄₅₆₇₈₉', SUPS = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const RE_FRAC_MIUDA = /([₀-₉]+)\/([₀-₉]+)|([⁰¹²³⁴-⁹]+)\/([⁰¹²³⁴-⁹]+)/g;
const algarismos = (x: string) => [...x].map((c) => String(Math.max(SUBS.indexOf(c), SUPS.indexOf(c)))).join('');

/** "₁/₂" vira índice com a fração empilhada. O texto do documento continua o dos dados ("₁/₂", escondido para leitor
 *  de tela, copiar e colar e testes); os algarismos desenhados vêm do CSS (atributo data-v), fora do texto. */
function comFracaoMiuda(s: string): ReactNode {
  if (!/[₀-₉⁰-⁹¹²³]\/[₀-₉⁰-⁹¹²³]/.test(s)) return s;
  const out: ReactNode[] = [];
  let ult = 0;
  RE_FRAC_MIUDA.lastIndex = 0;
  for (let m = RE_FRAC_MIUDA.exec(s); m; m = RE_FRAC_MIUDA.exec(s)) {
    const sub = m[1] != null;
    const n = algarismos(sub ? m[1] : m[3]), d = algarismos(sub ? m[2] : m[4]);
    if (m.index > ult) out.push(s.slice(ult, m.index));
    const Tag = sub ? 'sub' : 'sup';
    out.push(
      <Fragment key={m.index}>
        <Tag className={(sub ? 'nt-sub' : 'nt-sup') + ' nt-frac'} aria-hidden="true">
          <span className="frac"><span className="frac-n frac-v" data-v={n} /><span className="frac-d frac-v" data-v={d} /></span>
        </Tag>
        <span className="sr">{m[0]}</span>
      </Fragment>,
    );
    ult = m.index + m[0].length;
  }
  if (ult < s.length) out.push(s.slice(ult));
  return out;
}

/** Texto com negrito marcado por **…** (cartões de teoria de Português; revisão de 19/11/2026, item 2): o trecho sai em
 *  <b>, o resto pelas frações e notação de sempre. Os ** ficam nos dados; asterisco solto (sem par) continua texto. */
export function comNegrito(texto: string): ReactNode {
  if (!texto.includes('**')) return comFracoes(texto);
  const ps = texto.split(/\*\*(.+?)\*\*/);
  return ps.map((v, i) => (i % 2 ? <b key={i} className="negrito">{comFracoes(v)}</b> : <Fragment key={i}>{comFracoes(v)}</Fragment>));
}

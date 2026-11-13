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

/** expoente, índice e fórmula química (o sinal escrito fica escondido) */
export function comNotacao(s: string): ReactNode {
  const ps = partesNotacao(s);
  if (ps.length === 1 && ps[0].t === 'txt') return s;
  return ps.map((p, i) => p.t === 'txt' ? <Fragment key={i}>{p.v}</Fragment> : (
    <Fragment key={i}>
      {p.pre && <span className="sr">{p.pre}</span>}
      {p.t === 'sup' ? <sup className="nt-sup">{p.v}</sup> : <sub className="nt-sub">{p.v}</sub>}
      {p.pos && <span className="sr">{p.pos}</span>}
    </Fragment>
  ));
}

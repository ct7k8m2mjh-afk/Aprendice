import { Fragment, type ReactNode } from 'react';
import { partesFracao } from '../logica/fracao';

/**
 * Mostra o texto com as frações empilhadas (numerador, barra, denominador), montadas pelo layout (guia tipográfico).
 * Notação de nuclídeo ("207/82 Pb") sai como índices antes do símbolo, sem barra.
 * O texto não muda: a barra "/" continua no documento, escondida, para leitor de tela e para copiar e colar.
 */
export function comFracoes(texto: string): ReactNode {
  const partes = partesFracao(texto);
  if (partes.length === 1 && partes[0].t === 'txt') return texto;
  return partes.map((p, i) => p.t === 'txt' ? <Fragment key={i}>{p.v}</Fragment> : p.t === 'nuc' ? (
    // nuclídeo: número de massa em cima e número atômico embaixo, à esquerda do símbolo, sem barra
    <span key={i} className="nuc">
      <span className="nuc-a">{p.a}</span><span className="sr">/</span><span className="nuc-z">{p.z}</span><span className="sr"> </span>
    </span>
  ) : (
    <span key={i} className="frac">
      <span className="frac-n">{p.n}</span><span className="sr">/</span><span className="frac-d">{p.d}</span>
    </span>
  ));
}

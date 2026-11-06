import { Fragment, type ReactNode } from 'react';
import { analisaLatex, latexParaLeitura, type NoMat } from '../logica/latex';
import { comFracoes } from './Fracao';
import '../estilo/revisao.css'; // fórmulas e revisão em slides (comandos 24 e 26)

/**
 * Fórmula das revisões (LaTeX das fichas) desenhada como no caderno: letra à mão (Caveat), fração SEMPRE empilhada com
 * as mesmas peças de ui/Fracao.tsx (.frac, .frac-n, .frac-d: numerador, barra, denominador), expoente e índice no lugar.
 * O texto da fórmula fica no documento para leitor de tela (aria-label com "sobre" no lugar da barra).
 */
export function Formula({ tex, className, bloco = true }: { tex: string; className?: string; bloco?: boolean }) {
  const linhas = analisaLatex(tex);
  const Tag = bloco ? 'div' : 'span';
  return (
    <Tag className={'fm' + (bloco ? ' fm-bloco' : '') + (className ? ' ' + className : '')} role="math" aria-label={latexParaLeitura(tex)}>
      {linhas.map((l, k) => <span key={k} className="fm-linha" aria-hidden>{nos(l)}</span>)}
    </Tag>
  );
}

function nos(ns: NoMat[]): ReactNode[] {
  return ns.map((n, i) => {
    switch (n.t) {
      case 'txt': return n.texto ? <span key={i} className="fm-texto">{n.v}</span> : <Fragment key={i}>{n.v}</Fragment>;
      case 'esp': return <span key={i} className={'fm-esp e' + n.w} />;
      case 'sup': return <sup key={i}>{nos(n.v)}</sup>;
      case 'sub': return <sub key={i}>{nos(n.v)}</sub>;
      case 'raiz': return <span key={i} className="fm-raiz"><span className="fm-raiz-s">√</span><span className="fm-raiz-v">{nos(n.v)}</span></span>;
      case 'vet': return <span key={i} className="fm-vet">{nos(n.v)}</span>;
      case 'sobre': return <span key={i} className="fm-sobre"><span className="fm-sobre-t">{nos(n.topo)}</span><span>{nos(n.v)}</span></span>;
      case 'frac': return (
        <span key={i} className="frac">
          <span className="frac-n">{nos(n.n)}</span><span className="sr">/</span><span className="frac-d">{nos(n.d)}</span>
        </span>
      );
    }
    return null;
  });
}

/**
 * Texto com fórmulas entre $…$ (caderno dos cartões das revisões): o texto na letra da interface, a fórmula à mão.
 * Sem $, cai no comFracoes (texto simples com as frações empilhadas).
 */
export function TextoMat({ t }: { t: string }) {
  if (!t.includes('$')) return <>{comFracoes(t)}</>;
  const partes = t.split(/\$([^$]+)\$/);
  return <>{partes.map((p, i) => (i % 2 ? <Formula key={i} tex={p} bloco={false} className="fm-em-linha" /> : <Fragment key={i}>{comFracoes(p)}</Fragment>))}</>;
}

/** O texto parece LaTeX (vem de uma revisão) e não texto simples do protótipo? */
export function ehLatex(t: string): boolean {
  return /\\[A-Za-z]+|[_^]\{|\$/.test(t);
}

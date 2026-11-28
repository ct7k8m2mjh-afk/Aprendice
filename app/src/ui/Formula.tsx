import { Fragment, type ReactNode } from 'react';
import { analisaLatex, continuaFrase, latexParaLeitura, type NoMat } from '../logica/latex';
import { comFracoes } from './Fracao';
import { trechoMao } from './maoGlifos';
import '../estilo/revisao.css'; // fórmulas e revisão em slides (comandos 24 e 26)

/**
 * Fórmula das revisões (LaTeX das fichas) desenhada como no caderno: letra à mão (Caveat), fração SEMPRE empilhada com
 * as mesmas peças de ui/Fracao.tsx (.frac, .frac-n, .frac-d: numerador, barra, denominador), expoente e índice no lugar.
 * O texto da fórmula fica no documento para leitor de tela (aria-label com "sobre" no lugar da barra).
 */
export function Formula({ tex, className, bloco = true, prosa = false, rotulosNaMao = false }: { tex: string; className?: string; bloco?: boolean;
  /** Humanas (Filosofia e Sociologia, História...): a "fórmula" é frase em \text{}: vai na letra da interface, nunca à mão
   *  (guia: cursiva nunca em texto corrido); as quebras "\\" que só cortam a frase somem */ prosa?: boolean;
  /** "No caderno" de matéria de cálculo (revisão de 21/11, 4ª passada T2): o \text{} do rótulo vai na letra da fórmula,
   *  com uma palavra ou com várias, para a lista ter uma letra só */ rotulosNaMao?: boolean }) {
  const linhas = prosa ? juntaFrases(analisaLatex(tex)) : analisaLatex(tex);
  const Tag = bloco ? 'div' : 'span';
  return (
    <Tag className={'fm' + (prosa ? ' fm-prosa' : '') + (bloco ? ' fm-bloco' : '') + (className ? ' ' + className : '')} role={prosa ? undefined : 'math'} aria-label={prosa ? undefined : latexParaLeitura(tex)}>
      {linhas.map((l, k) => <span key={k} className="fm-linha" aria-hidden={prosa ? undefined : true}>{nos(l, rotulosNaMao && !prosa, !prosa)}</span>)}
    </Tag>
  );
}

/** linha que continua a frase de cima (começa em minúscula) volta para a linha de cima */
function juntaFrases(ls: NoMat[][]): NoMat[][] {
  const out: NoMat[][] = [];
  for (const l of ls) {
    const txt = (x: NoMat[]) => x.map((n) => (n.t === 'txt' ? n.v : ' ')).join('').trim();
    if (out.length && continuaFrase(txt(out[out.length - 1]), txt(l))) out[out.length - 1] = [...out[out.length - 1], { t: 'txt', v: ' ' }, ...l];
    else out.push(l);
  }
  return out;
}

const WJ = String.fromCharCode(0x2060);
/** `mao`: o \\text{} do rótulo vai na letra da fórmula; `caneta`: a fórmula é à mão (não é prosa), e os sinais que a
 *  Caveat não tem (Δ, θ, ω, π, setas...) saem desenhados no traço da caneta, na altura das letras vizinhas (ui/maoGlifos.tsx;
 *  pedido do dono, 27/11/2026: antes vinham de outra fonte, maiores e fora da linha) */
function nos(ns: NoMat[], mao = false, caneta = false): ReactNode[] {
  const out: ReactNode[] = [];
  for (let i = 0; i < ns.length; i++) {
    const n = ns[i];
    // índice e expoente juntos ("v_0^2"): um em cima do outro, na mesma coluna, como se escreve no caderno
    const prox = ns[i + 1];
    if ((n.t === 'sub' && prox?.t === 'sup') || (n.t === 'sup' && prox?.t === 'sub')) {
      const [sup, sub] = n.t === 'sup' ? [n, prox] : [prox, n];
      out.push(<span key={i} className="fm-ss"><sup>{nos((sup as Extract<NoMat, { t: 'sup' }>).v, mao, caneta)}</sup><sub>{nos((sub as Extract<NoMat, { t: 'sub' }>).v, mao, caneta)}</sub></span>);
      i++;
      continue;
    }
    out.push(no(n, i, mao, caneta));
  }
  return out;
}
function no(n: NoMat, i: number, mao: boolean, caneta: boolean): ReactNode {
    switch (n.t) {
      case 'txt': return n.texto && !mao ? <span key={i} className="fm-texto">{n.v}</span> : <Fragment key={i}>{caneta ? trechoMao(n.v, `t${i}`) : n.v}</Fragment>;
      // o espaço fino ("\,": "P\,\cos\,\theta") não quebra a linha: é texto, o "WORD JOINER" (U+2060), que prende a função
      // ao argumento (revisão de 21/11/2026, 5ª passada V2: "cos" no fim de uma linha e "θ" na seguinte); a largura vem do
      // CSS. O espaço largo entre duas relações continua podendo quebrar
      case 'esp': return <span key={i} className={'fm-esp e' + n.w}>{n.w === 1 ? WJ : null}</span>;
      case 'sup': return <sup key={i}>{nos(n.v, mao, caneta)}</sup>;
      case 'sub': return <sub key={i}>{nos(n.v, mao, caneta)}</sub>;
      case 'raiz': return <span key={i} className="fm-raiz"><span className="fm-raiz-s">{caneta ? trechoMao('√', `r${i}`) : '√'}</span><span className="fm-raiz-v">{nos(n.v, mao, caneta)}</span></span>;
      // seta do vetor logo acima da letra: mais baixa sobre letra sem haste ("v", "a"), acima da maiúscula ("F", "E")
      case 'vet': return <span key={i} className={'fm-vet' + (n.v.every((x) => x.t === 'txt' && /^[acemnorsuvwxzαεμνπρστυω]+$/.test(x.v)) ? ' baixa' : '')}>{nos(n.v, mao, caneta)}</span>;
      case 'sobre': return <span key={i} className="fm-sobre"><span className="fm-sobre-t">{nos(n.topo, mao, caneta)}</span><span>{nos(n.v, mao, caneta)}</span></span>;
      case 'frac': return (
        <span key={i} className="frac">
          <span className="frac-n">{nos(n.n, mao, caneta)}</span><span className="sr">/</span><span className="frac-d">{nos(n.d, mao, caneta)}</span>
        </span>
      );
    }
    return null;
}

/**
 * Texto com fórmulas entre $…$ (caderno dos cartões das revisões): o texto na letra da interface, a fórmula à mão.
 * Sem $, cai no comFracoes (texto simples com as frações empilhadas).
 */
const FRAC_UNI: Record<string, string> = { '½': '1/2', '⅓': '1/3', '⅔': '2/3', '¼': '1/4', '¾': '3/4', '⅕': '1/5', '⅛': '1/8' };
/** "½" de um caractere vira "1/2", que o site empilha (fração sempre empilhada, auditoria dos resumos M2) */
export function semFracaoUnicode(t: string): string {
  return t.replace(/[½⅓⅔¼¾⅕⅛]/g, (c) => FRAC_UNI[c]);
}
/** texto da revisão: frações empilhadas, inclusive as de um caractere */
export function textoRev(t: string): ReactNode { return comFracoes(semFracaoUnicode(t)); }

export function TextoMat({ t: t0, prosa = false }: { t: string; prosa?: boolean }) {
  const t = semFracaoUnicode(t0);
  if (!t.includes('$')) return <>{comFracoes(t)}</>;
  const partes = t.split(/\$([^$]+)\$/);
  return <>{partes.map((p, i) => (i % 2 ? <Formula key={i} tex={p} bloco={false} prosa={prosa} className={prosa ? undefined : 'fm-em-linha'} /> : <Fragment key={i}>{comFracoes(p)}</Fragment>))}</>;
}

/** O texto parece LaTeX (vem de uma revisão) e não texto simples do protótipo? */
export function ehLatex(t: string): boolean {
  return /\\[A-Za-z]+|[_^]\{|\$/.test(t);
}

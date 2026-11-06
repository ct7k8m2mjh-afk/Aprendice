import { useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import type { Resolucao } from '../dados/tipos';
import { montaRoteiro, type LinhaRot, type Roteiro } from '../logica/motorConta';
import { animaPasso, type Controle } from './motorAnima';
import { comFracoes } from './Fracao';
import { Icone } from './Icone';

/**
 * RESOLUÇÃO ANIMADA (comando 20): um único motor para todas as resoluções, a partir de `res.passos` (ou `res.quadro`).
 * A conta é escrita à mão, passo a passo; em cada passagem os termos se movem na tela (logica/motorConta.ts diz de onde
 * cada termo vem; ui/motorAnima.ts anima). Texto (Biologia, Química, Português): cada passo entra em sequência, com o
 * marca-texto no termo-chave.
 *
 * O que está no DOM é sempre o estado final de cada passo, igual ao texto dos dados (testado em motorConta.test.ts);
 * a animação só move, revela e risca por cima. Com "reduzir movimento", mostra direto o estado final.
 * Controles: tocar/pausar, passo anterior/próximo, recomeçar; teclado: espaço, ← e →.
 */
export function ResolucaoAnimada({ r, materia }: { r: Resolucao; materia?: string }) {
  const rt = useMemo(() => montaRoteiro(r, materia), [r, materia]);
  const n = rt.passos.length;
  const menos = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  // atual: -1 = ainda não começou; 0..n-1 = passo em cena; n = tudo à vista (fim)
  const [atual, setAtual] = useState(menos ? n : -1);
  const [tocando, setTocando] = useState(false);
  const [rodada, setRodada] = useState(0);
  const [animando, setAnimando] = useState(false);
  const folha = useRef<HTMLDivElement>(null);
  const ctl = useRef<Controle | null>(null);
  const tocandoRef = useRef(tocando);
  tocandoRef.current = tocando;

  // nova resolução (outra questão): volta ao começo
  useEffect(() => { setAtual(menos ? n : -1); setTocando(false); }, [rt]); // eslint-disable-line react-hooks/exhaustive-deps

  // riscos: (linha, termo, parte) → passo em que o termo é riscado
  const riscos = useMemo(() => {
    const m = new Map<string, number>();
    rt.passos.forEach((p, k) => p.linhas.forEach((l) => rt.linhas[l].planos.forEach((pl) => pl.riscos.forEach((x) => m.set(`${x.l}:${x.i}:${x.p || ''}`, k)))));
    return m;
  }, [rt]);
  const visivel = atual < 0 ? -1 : atual;

  useLayoutEffect(() => {
    if (menos || atual < 0 || atual >= n || !folha.current) return;
    const el = folha.current.querySelector<HTMLElement>(`[data-passo="${atual}"]`);
    if (!el) return;
    const c = animaPasso(el, folha.current, rt, atual);
    ctl.current = c;
    setAnimando(true);
    if (!tocandoRef.current) c.pausa();
    let vivo = true;
    c.fim.then((ok) => {
      if (!vivo) return;
      setAnimando(false);
      if (ok && tocandoRef.current) {
        if (atual + 1 >= n) { setTocando(false); setAtual(n); } else setAtual(atual + 1);
      } else if (ok && atual + 1 >= n) setAtual(n);
    });
    return () => { vivo = false; c.cancela(); if (ctl.current === c) ctl.current = null; };
  }, [atual, rodada, rt, n, menos]);

  useEffect(() => {
    const c = ctl.current;
    if (!c) return;
    if (tocando) c.toca(); else c.pausa();
  }, [tocando]);

  if (!n) return null;
  const comeca = () => { setTocando(true); setAtual(0); setRodada((x) => x + 1); };
  const vaiPara = (k: number) => {
    const alvo = Math.max(0, Math.min(n - 1, k));
    setAtual(alvo); setRodada((x) => x + 1);
    if (!tocando) setTocando(true);
  };
  const alterna = () => {
    if (atual < 0) return comeca();
    if (atual >= n) return comeca();
    if (!animando) { vaiPara(atual + 1 >= n ? 0 : atual + 1); return; }
    setTocando((x) => !x);
  };
  const tudo = () => { ctl.current?.cancela(); setTocando(false); setAtual(n); };
  const teclas = (e: KeyboardEvent<HTMLElement>) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const alvo = e.target as HTMLElement;
    if (e.key === ' ' && alvo.tagName !== 'BUTTON') { e.preventDefault(); e.stopPropagation(); alterna(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); e.stopPropagation(); if (atual < n) vaiPara(atual + 1 >= n ? n - 1 : atual + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); e.stopPropagation(); vaiPara(atual <= 0 ? 0 : (atual >= n ? n - 1 : atual - 1)); }
    else if (e.key === 'Enter' || e.key === ' ') e.stopPropagation(); // Enter/espaço num botão aciona o botão, não a próxima questão
  };
  const rotPasso = atual < 0 ? `${n} ${n === 1 ? 'passo' : 'passos'}` : atual >= n ? `${n} de ${n} passos` : `Passo ${atual + 1} de ${n}`;
  const conta = rt.linhas.some((l) => l.conta);

  return (
    <section className="ra" aria-labelledby="ra-tit" onKeyDown={teclas}>
      <h3 id="ra-tit" className="cor-tit">Resolução animada</h3>
      {!menos && (atual < 0 ? (
        <div className="ra-assistir">
          <button type="button" className="btn" onClick={comeca}><Icone nome="play" tam={17} />Assistir resolução</button>
          <span className="ra-ass-txt">{rotPasso}{conta ? ', escritos à mão na sua frente' : ', um de cada vez'}</span>
          <button type="button" className="ra-link" onClick={tudo}>Ver sem animação</button>
        </div>
      ) : (
        <div className="ra-ctl" role="toolbar" aria-label="Controles da resolução animada">
          <button type="button" className="ra-bt" onClick={alterna} aria-label={tocando && animando ? 'Pausar' : atual >= n ? 'Assistir de novo' : 'Tocar'}>
            <Icone nome={tocando && animando ? 'pausa' : 'play'} tam={15} /><span>{tocando && animando ? 'Pausar' : atual >= n ? 'De novo' : 'Tocar'}</span>
          </button>
          <button type="button" className="ra-bt ic" onClick={() => vaiPara(atual >= n ? n - 1 : atual - 1)} disabled={atual === 0} aria-label="Passo anterior" title="Passo anterior (←)"><Icone nome="esquerda" tam={17} /></button>
          <button type="button" className="ra-bt ic" onClick={() => vaiPara(atual + 1)} disabled={atual >= n - 1} aria-label="Próximo passo" title="Próximo passo (→)"><Icone nome="direita" tam={17} /></button>
          <span className="ra-pp" aria-live="polite">{rotPasso}</span>
          <button type="button" className="ra-bt ic" onClick={comeca} aria-label="Recomeçar" title="Recomeçar"><Icone nome="repetir" tam={16} /></button>
        </div>
      ))}
      <div className={'ra-folha' + (atual < 0 ? ' espera' : '')} ref={folha}>
        <ol className={'ra-passos ' + rt.origem}>
          {rt.passos.map((p, k) => (
            <li key={k} className="ra-passo" data-passo={k} hidden={atual < 0 || k > visivel ? true : undefined}>
              {rt.origem === 'passos' && <span className="ra-n" aria-hidden>{k + 1}</span>}
              <div className="ra-corpo">
                {p.faz && <b className="ra-faz">{comFracoes(p.faz)}</b>}
                {p.linhas.map((l) => (
                  <div key={l} className="ra-lin">
                    <Linha L={rt.linhas[l]} l={l} riscos={riscos} ate={atual >= n ? n : visivel} />
                    {rt.linhas[l].nota && <span className="ra-nota" data-nota={l}>{comFracoes(rt.linhas[l].nota!)}</span>}
                  </div>
                ))}
                {p.porque && <p className="ra-porque">{comFracoes(p.porque)}</p>}
              </div>
            </li>
          ))}
        </ol>
        <div className="ra-fantasmas" aria-hidden />
      </div>
    </section>
  );
}

/** Uma linha da conta no estado final: cada termo num <span data-i> (fração empilhada), com riscos e marca-texto. */
function Linha({ L, l, riscos, ate }: { L: LinhaRot; l: number; riscos: Map<string, number>; ate: number }) {
  if (!L.conta) {
    const [a, b] = L.marca || [0, 0];
    return (
      <p className="ra-linha texto" data-l={l}>
        {L.marca ? <>{comFracoes(L.texto.slice(0, a))}<mark className="ra-marca">{comFracoes(L.texto.slice(a, b))}</mark>{comFracoes(L.texto.slice(b))}</> : comFracoes(L.texto)}
      </p>
    );
  }
  const risco = (i: number, p?: 'n' | 'd') => {
    const k = riscos.get(`${l}:${i}:${p || ''}`);
    return k != null && k <= ate ? <span className="ra-risco" aria-hidden /> : null;
  };
  let pos = 0;
  const out: ReactNode[] = [];
  L.toks.forEach((t, i) => {
    const ini = pos; pos += t.v.length;
    if (t.k === 'esp') { out.push(t.v); return; }
    const marca = L.marca && ini < L.marca[1] && pos > L.marca[0] ? ' ra-marca' : '';
    const cls = 'ra-t' + (t.k === 'op' || t.k === 'rel' || t.k === 'seta' ? ' op' : '') + marca;
    if (t.k === 'frac') {
      out.push(
        <span key={i} className={cls + ' frac'} data-i={i}>
          <span className="frac-n" data-p="n">{t.n}{risco(i, 'n')}</span><span className="sr">/</span><span className="frac-d" data-p="d">{t.d}{risco(i, 'd')}</span>
        </span>,
      );
    } else if (t.k === 'nuc') {
      out.push(<span key={i} className={cls} data-i={i}>{comFracoes(t.v)}</span>);
    } else {
      out.push(<span key={i} className={cls + (t.cola ? ' cola' : '')} data-i={i}>{t.v}{risco(i)}</span>);
    }
  });
  return <p className="ra-linha conta" data-l={l}>{out}</p>;
}

export type { Roteiro };

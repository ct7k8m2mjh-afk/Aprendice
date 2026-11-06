import { useEffect, useRef, useState, type ReactNode } from 'react';
import { limpaRoteiro, urlRevisao, type VisualSlide } from '../../dados/revisao';
import type { MateriaId } from '../../dados/tipos';
import { comFracoes } from '../Fracao';
import { Icone } from '../Icone';

/**
 * "Ver a coisa acontecer" no slide: o roteiro `visual.movimento` tocado em cena, um passo de cada vez, na ordem do
 * arquivo (o que entra, o que se move, o que muda nos números). Começa sozinho quando o slide abre; tocar, pausar e
 * recomeçar; com "reduzir movimento", mostra o roteiro inteiro parado.
 *
 * Regra de ouro do motor: o que está no DOM é o estado final (todos os passos escritos, sem pular de tamanho); a
 * animação só mexe em opacidade, posição e fundo. Desenhar os objetos da cena em SVG é pedido ao motor único
 * (docs/revisao/PEDIDOS-MOTOR.md, pedido 1): quando houver `visual.cena`, o palco de texto dá lugar ao desenho.
 *
 * Foto (só as de visual.foto, Wikimedia Commons, licença livre): servida pelo próprio site, com autor, licença e a
 * página do Commons sempre visíveis.
 */
export function RoteiroAnimado({ m, v, auto = true }: { m: MateriaId; v: VisualSlide; auto?: boolean }) {
  const passos = (v.movimento || []).map(limpaRoteiro).filter(Boolean);
  const n = passos.length;
  const menos = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  // atual: -1 antes de começar; 0..n-1 passo em cena; n = fim (tudo à vista)
  const [atual, setAtual] = useState(menos || !auto ? n : 0);
  const [tocando, setTocando] = useState(!menos && auto && n > 0);
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (t.current) clearTimeout(t.current);
    if (!tocando || atual >= n || atual < 0) return;
    const dur = Math.max(2200, Math.min(5600, 1300 + passos[atual].length * 32));
    t.current = setTimeout(() => {
      if (atual + 1 >= n) { setAtual(n); setTocando(false); } else setAtual(atual + 1);
    }, dur);
    return () => { if (t.current) clearTimeout(t.current); };
  }, [atual, tocando, n]); // eslint-disable-line react-hooks/exhaustive-deps

  const foto = v.foto;
  const recomeca = () => { setAtual(0); setTocando(true); };
  const alterna = () => {
    if (atual >= n) return recomeca();
    setTocando((x) => !x);
  };
  const rot = atual >= n ? `${n} de ${n}` : `${atual + 1} de ${n}`;
  const rotTipo = foto ? 'Foto' : v.tipo === 'grafico' ? 'Gráfico' : v.tipo === 'esquema' ? 'Esquema' : 'Animação';

  return (
    <figure className={'rv-vis' + (foto ? ' com-foto' : '')} aria-label={v.alt || undefined}>
      {foto && (
        <div className="rv-foto">
          {foto.img ? <img src={urlRevisao(m, foto.img)} alt={v.alt || ''} loading="lazy" /> : <div className="rv-foto-falta" role="img" aria-label={v.alt || ''}><Icone nome="arquivo" tam={22} /><span>Foto do Wikimedia Commons</span></div>}
          <figcaption className="rv-credito">
            Foto: {foto.autor} · {foto.licenca} · <a href={foto.url} target="_blank" rel="noreferrer noopener">Wikimedia Commons <Icone nome="externo" tam={12} /></a>
          </figcaption>
        </div>
      )}
      {n > 0 && (
        <div className="rv-palco">
          <div className="rv-palco-cab">
            <span className="rv-palco-tipo">{rotTipo}</span>
            {!menos && (
              <span className="rv-palco-ctl" role="toolbar" aria-label="Controles da animação">
                <button type="button" className="ra-bt" onClick={alterna} aria-label={tocando ? 'Pausar' : atual >= n ? 'Ver de novo' : 'Tocar'}>
                  <Icone nome={tocando ? 'pausa' : 'play'} tam={15} /><span>{tocando ? 'Pausar' : atual >= n ? 'De novo' : 'Tocar'}</span>
                </button>
                <button type="button" className="ra-bt ic" onClick={recomeca} aria-label="Recomeçar" title="Recomeçar"><Icone nome="repetir" tam={16} /></button>
              </span>
            )}
            <span className="rv-palco-n num" aria-live="polite">{rot}</span>
          </div>
          {v.descricao && !foto && <p className="rv-cena">{limpaRoteiro(v.descricao)}</p>}
          <ol className="rv-beats">
            {passos.map((p, k) => {
              const est = atual >= n ? 'feito' : k < atual ? 'feito' : k === atual ? 'atual' : 'futuro';
              return (
                <li key={k + ':' + (k === atual ? 'a' : 'x')} className={'rv-beat ' + est} aria-hidden={est === 'futuro' || undefined}>
                  <span className="rv-beat-n num" aria-hidden>{k + 1}</span>
                  <span className="rv-beat-t">{marcaNumeros(p)}</span>
                </li>
              );
            })}
          </ol>
          <div className="rv-linha" aria-hidden>
            {passos.map((_, k) => (
              <i key={k + ':' + (k === atual && tocando ? 'on' : 'off')} className={k < atual || atual >= n ? 'feito' : k === atual ? (tocando ? 'atual corre' : 'atual') : ''}
                style={k === atual && tocando ? { animationDuration: `${Math.max(2200, Math.min(5600, 1300 + passos[k].length * 32))}ms` } : undefined} />
            ))}
          </div>
        </div>
      )}
    </figure>
  );
}

const RE_NUM = /(−?\d+(?:[.,]\d+)?(?:\s?(?:m\/s²|m\/s|km\/h|rad\/s|m|s|km|h|rad|Hz|rpm|°|%))?)(?![\p{L}\d])/gu;

/** Os números do passo (com a unidade) ganham a marca da cor da matéria: é o que muda na tela. */
function marcaNumeros(t: string): ReactNode[] {
  const out: ReactNode[] = [];
  let ult = 0;
  RE_NUM.lastIndex = 0;
  for (let m = RE_NUM.exec(t); m; m = RE_NUM.exec(t)) {
    const antes = t.charAt(m.index - 1);
    if (antes && /[\p{L}_]/u.test(antes)) continue; // índice colado ("v₀", "A1"), não é valor
    if (m.index > ult) out.push(...pedaco(t.slice(ult, m.index), out.length));
    out.push(<b key={'n' + m.index} className="rv-num">{m[0]}</b>);
    ult = m.index + m[0].length;
  }
  if (ult < t.length) out.push(...pedaco(t.slice(ult), out.length));
  return out;
}
function pedaco(s: string, k: number): ReactNode[] {
  const r = comFracoes(s);
  return [<span key={'t' + k}>{r}</span>];
}

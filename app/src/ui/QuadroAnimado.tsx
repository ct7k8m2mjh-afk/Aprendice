import { useEffect, useRef, useState } from 'react';
import type { Resolucao } from '../dados/tipos';
import { Icone } from './Icone';

/**
 * A conta no caderno, linha por linha: cada linha aparece "escrita à mão" depois da anterior, com a nota do que foi feito.
 * O aluno pode tocar, pausar, voltar e copiar no próprio caderno. Com "reduzir movimento", mostra tudo de uma vez.
 */
export function QuadroAnimado({ quadro }: { quadro: NonNullable<Resolucao['quadro']> }) {
  const menos = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [n, setN] = useState(menos ? quadro.length : 0);
  const [tocando, setTocando] = useState(false);
  const t = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (!tocando) return;
    if (n >= quadro.length) { setTocando(false); return; }
    t.current = window.setTimeout(() => setN((x) => x + 1), n === 0 ? 150 : 1600);
    return () => window.clearTimeout(t.current);
  }, [tocando, n, quadro.length]);
  const fim = n >= quadro.length;
  return (
    <div className="quadro" aria-label="Conta passo a passo">
      <div className="quadro-cab">
        <h3>A conta no caderno</h3>
        <div className="quadro-btns">
          {!tocando && !fim && <button className="btn peq" onClick={() => setTocando(true)}><Icone nome="play" tam={15} />{n === 0 ? 'Mostrar a conta' : 'Continuar'}</button>}
          {tocando && <button className="btn peq sec" onClick={() => setTocando(false)}><Icone nome="pausa" tam={15} />Pausar</button>}
          {!tocando && n > 0 && !fim && <button className="btn peq sec" onClick={() => setN((x) => Math.min(quadro.length, x + 1))}>Próxima linha</button>}
          {n > 0 && <button className="btn-ic" onClick={() => { setTocando(false); setN(0); }} aria-label="Recomeçar" title="Recomeçar"><Icone nome="repetir" tam={16} /></button>}
          {!fim && n === 0 && <button className="btn-ic" onClick={() => setN(quadro.length)} aria-label="Ver tudo de uma vez" title="Ver tudo"><Icone nome="lista" tam={16} /></button>}
        </div>
      </div>
      <ol className="quadro-folha" aria-live="polite">
        {quadro.slice(0, n).map((l, i) => (
          <li key={i} className={i === n - 1 && !menos ? 'nova' : ''}>
            <span className="q-linha">{realce(l.linha, l.destaque)}</span>
            {l.nota && <span className="q-nota">{l.nota}</span>}
          </li>
        ))}
        {n === 0 && <li className="quadro-vazio">Toque em “Mostrar a conta” e acompanhe linha por linha. Copie no seu caderno.</li>}
      </ol>
    </div>
  );
}

function realce(linha: string, d?: string) {
  if (!d) return linha;
  const i = linha.indexOf(d);
  if (i < 0) return linha;
  return <>{linha.slice(0, i)}<mark>{d}</mark>{linha.slice(i + d.length)}</>;
}

import { useLayoutEffect, useRef, type CSSProperties } from 'react';
import { animaEntrada } from '../motorAnima';

export interface RamoMapa { sub: string; titulo: string; chave?: string; liga?: string[] }

/**
 * MAPA MENTAL do tema (comando 33, componente do sistema de design): o tema no centro, um nó por conteúdo na cor da
 * matéria, ramos do centro a cada conteúdo e ramos tracejados entre os conteúdos que se ligam (`liga`).
 * Computador e tablet (área de 640 px ou mais): radial, os nós em volta do centro. Celular: o centro em cima e os
 * conteúdos em coluna, presos a um tronco; as ligações viram "liga com" embaixo de cada nó.
 * O motor único faz os nós entrarem um a um e os ramos se desenharem; com "reduzir movimento", tudo parado.
 */
export function MapaMental({ centro, ramos, anima = true }: { centro: string; ramos: RamoMapa[]; anima?: boolean }) {
  const raiz = useRef<HTMLDivElement>(null);
  const n = ramos.length;
  // posições (em % da caixa) num anel em volta do centro, começando em cima e girando no sentido do relógio
  const pos = ramos.map((_, i) => {
    const a = (-90 + (360 / n) * i) * (Math.PI / 180);
    return { x: 50 + 37 * Math.cos(a), y: 50 + 38 * Math.sin(a) };
  });
  const idx = new Map(ramos.map((r, i) => [r.sub, i]));
  const ligas: [number, number][] = [];
  ramos.forEach((r, i) => (r.liga || []).forEach((s) => {
    const j = idx.get(s);
    if (j != null && j !== i && !ligas.some(([a, b]) => (a === j && b === i) || (a === i && b === j))) ligas.push([i, j]);
  }));
  const titulo = (s: string) => ramos.find((r) => r.sub === s)?.titulo || s;

  useLayoutEffect(() => {
    if (!raiz.current || !anima || (typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
    // anima a caixa de dentro: a de fora guarda a posição (translate) no mapa radial
    const cs = [animaEntrada(raiz.current.querySelector<HTMLElement>('.mm-centro > span')!, 0)];
    raiz.current.querySelectorAll<HTMLElement>('.mm-in').forEach((el, i) => cs.push(animaEntrada(el, 350 + i * 220)));
    return () => cs.forEach((c) => c.cancela());
  }, [centro, n, anima]);

  return (
    <div className={'mm' + (anima ? '' : ' parado')} ref={raiz} role="group" aria-label={`Mapa mental: ${centro}`}>
      <svg className="mm-ramos" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden focusable="false">
        {pos.map((p, i) => <line key={i} className="mm-linha" x1={50} y1={50} x2={p.x} y2={p.y} style={{ animationDelay: `${300 + i * 220}ms` }} />)}
        {ligas.map(([a, b], k) => {
          const A = pos[a], B = pos[b];
          // curva por fora do anel (empurrada para longe do centro), tracejada: não cruza o tema no meio
          const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2;
          const cx = mx + (mx - 50) * 0.55, cy = my + (my - 50) * 0.55;
          return <path key={k} className="mm-liga" d={`M${A.x} ${A.y} Q${cx} ${cy} ${B.x} ${B.y}`} style={{ animationDelay: `${400 + n * 220 + k * 160}ms` }} />;
        })}
      </svg>
      <div className="mm-centro"><span>{centro}</span></div>
      <ol className="mm-nos">
        {ramos.map((r, i) => (
          <li key={r.sub + i} className="mm-no" style={{ '--x': `${pos[i].x}%`, '--y': `${pos[i].y}%` } as CSSProperties}>
            <div className="mm-in">
              <b>{r.titulo}</b>
              {r.chave && <span className="mm-chave">{r.chave}</span>}
              {r.liga && r.liga.length > 0 && <span className="mm-liga-txt">liga com {r.liga.map(titulo).join(', ')}</span>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

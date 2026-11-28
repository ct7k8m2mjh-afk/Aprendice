import { useEffect, useRef, useState } from 'react';
import { LOGO } from './logo-path';
import { TRACOS } from './abertura-tracos';

/** Abertura do site (enviada pelo dono, 05/11/2026): "Aprendice" é escrito à mão no centro (~1,1 s, traço em velocidade
 *  constante), o traço vira o logotipo exato (fade cruzado de 220 ms) e o logotipo voa até o logo da tela
 *  (elemento com data-logo-alvo: o da tela de login ou o do menu lateral). Sem alvo visível (tela estreita), some em fade.
 *  Um clique pula. Quem pede "reduzir movimento" no sistema não vê a abertura. Toca uma vez por carregamento do site. */
export function Abertura() {
  const [vivo, setVivo] = useState(() => !matchMedia('(prefers-reduced-motion: reduce)').matches && 'animate' in HTMLElement.prototype);
  const ab = useRef<HTMLDivElement>(null);
  const lg = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!vivo || !ab.current || !lg.current) return;
    const caixa = ab.current, logo = lg.current, svg = logo.querySelector('svg')!;
    const ps = Array.from(svg.querySelectorAll<SVGPathElement>('.ab-tr path'));
    const vivas: Animation[] = []; let fim = false; let alvoEl: HTMLElement | null = null;
    const lens = ps.map((p) => p.getTotalLength()); const tot = lens.reduce((a, b) => a + b, 0); const T = 1100; let t = 40;
    ps.forEach((p, i) => {
      const d = (T * lens[i]) / tot; p.style.strokeDasharray = `${lens[i]} ${lens[i] + 4}`;
      vivas.push(p.animate([{ strokeDashoffset: lens[i] }, { strokeDashoffset: 0 }], { duration: d, delay: t, easing: 'linear', fill: 'both' }));
      t += d + 12;
    });
    const tr = svg.querySelector('.ab-tr')!, ch = svg.querySelector('.ab-ch')!;
    vivas.push(ch.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220, delay: t - 40, fill: 'forwards', easing: 'ease-out' }));
    vivas.push(tr.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, delay: t - 40, fill: 'forwards', easing: 'ease-in' }));
    const termina = () => { if (alvoEl) alvoEl.style.visibility = ''; setVivo(false); };
    const voa = () => {
      if (fim) return; fim = true;
      vivas.forEach((a) => { try { a.finish(); } catch { /* já terminou */ } });
      const cands = Array.from(document.querySelectorAll<HTMLElement>('[data-logo-alvo]')).filter((e) => e.offsetParent && e.getBoundingClientRect().width > 0);
      alvoEl = cands[0] || null;
      const alvo = alvoEl?.querySelector('svg')?.getBoundingClientRect() || alvoEl?.getBoundingClientRect();
      const de = svg.getBoundingClientRect();
      if (alvoEl && alvo && alvo.width) {
        // o logo que voa é o único na tela: o do destino só aparece quando ele pousa
        const sx = alvo.width / de.width, dx = alvo.left - de.left, dy = alvo.top + alvo.height / 2 - (de.top + de.height / 2);
        alvoEl.style.visibility = 'hidden'; logo.style.transformOrigin = '0 50%';
        caixa.style.transition = 'background-color .42s ease'; caixa.style.backgroundColor = 'transparent'; caixa.style.pointerEvents = 'none';
        const v = logo.animate([{ transform: 'none' }, { transform: `translate(${dx}px,${dy}px) scale(${sx})` }], { duration: 480, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' });
        v.onfinish = termina; window.setTimeout(termina, 900);
      } else { caixa.classList.add('sai'); window.setTimeout(termina, 400); }
    };
    caixa.addEventListener('click', voa);
    const tm = window.setTimeout(voa, t + 260);
    return () => { window.clearTimeout(tm); caixa.removeEventListener('click', voa); vivas.forEach((a) => a.cancel()); if (alvoEl) alvoEl.style.visibility = ''; };
  }, [vivo]);

  if (!vivo) return null;
  const naEntrada = location.hash.includes('boas-vindas');
  return (
    <div ref={ab} className={'abertura' + (naEntrada ? ' na-entrada' : '')} aria-hidden="true">
      <div ref={lg} className="ab-lg">
        <svg viewBox={`0 0 ${LOGO.W} ${LOGO.H}`} aria-hidden="true">
          <g className="ab-tr" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            {TRACOS.map(([w, d], i) => <path key={i} d={d} strokeWidth={Math.round(w * 0.36)} />)}
          </g>
          <path className="ab-ch" d={LOGO.d} fill="currentColor" opacity={0} />
        </svg>
      </div>
    </div>
  );
}

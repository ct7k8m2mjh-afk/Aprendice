import { useEffect, type CSSProperties, type ReactNode } from 'react';
import { LOGO } from './logo-path';
import { MATERIAS, type Tons } from '../dados/materias';

/** Logo manuscrito do APRENDICE (traço único, herda a cor do texto). */
export function Logo({ className = 'logo', titulo = 'Aprendice' }: { className?: string; titulo?: string }) {
  return (
    <svg className={className} viewBox={`0 0 ${LOGO.W} ${LOGO.H}`} role="img" aria-label={titulo} fill="currentColor">
      <path d={LOGO.d} />
    </svg>
  );
}

/** Variáveis de cor da matéria para os dois temas (uma fonte de verdade: dados/materias.ts). */
export function EstiloMaterias() {
  // Tons da paleta aprovada (dados/materias.ts). Variáveis derivadas (--sv, --sv2) são recalculadas em cada .m-*,
  // porque uma variável derivada não acompanha a herança. --sv = fundo suave exato; --sv2 = o fundo suave mais leve, sobre a folha.
  const tons = (x: Tons) =>
    `--c:${x.c};--ink:${x.ink};--t:${x.t};--p:${x.p};--p-ink:${x.pInk};--s:${x.s};--sv:${x.s};--sv2:color-mix(in srgb,${x.s} 55%,var(--folha))`;
  const css = MATERIAS.map((m) =>
    `.m-${m.id},[data-theme='light'] .m-${m.id}{${tons(m.claro)}}` +
    `[data-theme='dark'] .m-${m.id}{${tons(m.escuro)}}`).join('\n');
  return <style>{css}</style>;
}

export function Carregando({ texto = 'Carregando' }: { texto?: string }) {
  return <div className="carregando" role="status"><div className="giro" /><span className="sr">{texto}</span></div>;
}

export function Barra({ valor, rotulo }: { valor: number; rotulo?: string }) {
  const v = Math.max(0, Math.min(1, valor || 0));
  return (
    <div className="barra" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(v * 100)} aria-label={rotulo}>
      <i style={{ width: `${v * 100}%` }} />
    </div>
  );
}

export function Toast({ texto, aoFechar }: { texto: string | null; aoFechar: () => void }) {
  useEffect(() => {
    if (!texto) return;
    const t = setTimeout(aoFechar, 3200);
    return () => clearTimeout(t);
  }, [texto, aoFechar]);
  if (!texto) return null;
  return <div className="toast" role="status">{texto}</div>;
}

export function useTitulo(t: string) {
  useEffect(() => { document.title = t ? `${t} · Aprendice` : 'Aprendice'; }, [t]);
}

export function Bloco({ titulo, children, className, acao }: { titulo?: ReactNode; children: ReactNode; className?: string; acao?: ReactNode }) {
  return (
    <section className={'bloco' + (className ? ' ' + className : '')}>
      {titulo && <div className="cab-sec" style={{ marginBottom: 12 }}><h2>{titulo}</h2>{acao}</div>}
      {children}
    </section>
  );
}

export function Anel({ valor, tam = 44, espessura = 5, children }: { valor: number; tam?: number; espessura?: number; children?: ReactNode }) {
  const r = (tam - espessura) / 2, c = 2 * Math.PI * r, v = Math.max(0, Math.min(1, valor));
  return (
    <span style={{ position: 'relative', width: tam, height: tam, display: 'inline-grid', placeItems: 'center', flex: 'none' } as CSSProperties}>
      <svg width={tam} height={tam} viewBox={`0 0 ${tam} ${tam}`} aria-hidden style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
        <circle cx={tam / 2} cy={tam / 2} r={r} fill="none" stroke="var(--malha)" strokeWidth={espessura} />
        <circle cx={tam / 2} cy={tam / 2} r={r} fill="none" stroke="var(--c)" strokeWidth={espessura} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - v)} style={{ transition: 'stroke-dashoffset .5s var(--curva)' }} />
      </svg>
      <span style={{ position: 'relative', fontSize: tam >= 44 ? 13 : 12, fontWeight: 600 }} className="num">{children}</span>
    </span>
  );
}

export function plural(n: number, um: string, varios: string) { return `${n.toLocaleString('pt-BR')} ${n === 1 ? um : varios}`; }

export function formataTempo(seg: number): string {
  seg = Math.max(0, Math.round(seg));
  const h = Math.floor(seg / 3600), m = Math.floor((seg % 3600) / 60), s = seg % 60;
  if (h) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function horasMin(seg: number): string {
  const h = Math.floor(seg / 3600), m = Math.round((seg % 3600) / 60);
  return h ? `${h} h ${m} min` : `${m} min`;
}

export function cap(s: string) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

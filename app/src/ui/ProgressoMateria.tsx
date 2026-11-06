import { useEffect, useState } from 'react';
import type { MateriaCarregada } from '../dados/conteudo';
import type { EstadoMateria } from '../estado/tipos';
import { DIA, iniDia } from '../logica/revisao';

/** "Meu progresso" da matéria (pedido do dono, 06/11/2026): não é botão, só mostra.
 *  Questões resolvidas por nível (barra empilhada), acerto, tempo, semana e um gráfico dos últimos 14 dias. */
const NIVEIS = [
  { nome: 'Básico', de: 1, ate: 3, tom: 'var(--p)' },
  { nome: 'Intermediário', de: 4, ate: 6, tom: 'color-mix(in srgb, var(--p) 62%, var(--folha))' },
  { nome: 'Avançado', de: 7, ate: 10, tom: 'color-mix(in srgb, var(--p) 32%, var(--folha))' },
];
const SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

function tempo(seg: number) {
  const h = Math.floor(seg / 3600), m = Math.round((seg % 3600) / 60);
  return h ? `${h}h${String(m).padStart(2, '0')}` : `${m} min`;
}

export function ProgressoMateria({ mc, s, agora = Date.now() }: { mc: MateriaCarregada; s: EstadoMateria; agora?: number }) {
  const porNivel = NIVEIS.map(() => 0);
  let feitas = 0, acertos = 0, seg = 0;
  const hoje = iniDia(agora);
  const dias = [...Array(14)].map((_, i) => ({ d: hoje - (13 - i) * DIA, n: 0 }));
  const dow = (new Date(hoje).getDay() + 6) % 7; // segunda = 0
  const iniSemana = hoje - dow * DIA;
  let semana = 0;
  for (const q of mc.banco) {
    const eq = s.q[q.id];
    if (!eq?.tent.length) continue;
    feitas++;
    if (eq.tent[eq.tent.length - 1].ok) acertos++;
    const k = NIVEIS.findIndex((n) => q.dif >= n.de && q.dif <= n.ate);
    if (k >= 0) porNivel[k]++;
    for (const t of eq.tent) {
      seg += t.seg || 0;
      if (t.ts >= iniSemana) semana++;
      const i = Math.round((iniDia(t.ts) - dias[0].d) / DIA);
      if (i >= 0 && i < 14) dias[i].n++;
    }
  }
  const total = mc.banco.length;
  const maxDia = Math.max(1, ...dias.map((x) => x.n));
  const pct = feitas ? Math.round((acertos / feitas) * 100) : 0;
  // anima ao aparecer: a barra e as colunas crescem do zero
  const [vivo, setVivo] = useState(false);
  useEffect(() => { const id = requestAnimationFrame(() => setVivo(true)); return () => cancelAnimationFrame(id); }, []);

  return (
    <section className={'mp' + (vivo ? ' vivo' : '')} aria-label="Meu progresso">
      <h2 className="mp-tit">Meu progresso</h2>
      <p className="mp-total"><b className="num">{feitas.toLocaleString('pt-BR')}</b><span>de {total.toLocaleString('pt-BR')} questões resolvidas</span></p>
      <div className="mp-barra" role="img" aria-label={NIVEIS.map((n, i) => `${n.nome}: ${porNivel[i]}`).join(', ')}>
        {NIVEIS.map((n, i) => porNivel[i] > 0 && (
          <i key={n.nome} style={{ width: vivo ? `${(porNivel[i] / Math.max(1, total)) * 100}%` : 0, background: n.tom, transitionDelay: `${i * 120}ms` }} />
        ))}
      </div>
      <ul className="mp-leg">
        {NIVEIS.map((n, i) => <li key={n.nome}><span style={{ background: n.tom }} aria-hidden />{n.nome} <b className="num">{porNivel[i]}</b></li>)}
      </ul>
      <div className="mp-baixo">
        <dl className="mp-nums">
          <div><dt className="num">{pct}%</dt><dd>de acerto</dd></div>
          <div><dt className="num">{tempo(seg)}</dt><dd>nas questões</dd></div>
          <div><dt className="num">{semana}</dt><dd>nesta semana</dd></div>
        </dl>
        <figure className="mp-graf" aria-label={`Questões por dia nos últimos 14 dias: ${dias.map((x) => x.n).join(', ')}`}>
          <div className="mp-cols">
            {dias.map((x, i) => (
              <span key={x.d} className={'mp-col' + (x.d === hoje ? ' hoje' : '')} title={`${new Date(x.d).toLocaleDateString('pt-BR')}: ${x.n}`}>
                <i style={{ height: vivo ? `${x.n ? Math.max(8, (x.n / maxDia) * 100) : 4}%` : 0, transitionDelay: `${200 + i * 35}ms` }} />
                <small aria-hidden>{SEMANA[new Date(x.d).getDay()]}</small>
              </span>
            ))}
          </div>
          <figcaption>últimos 14 dias</figcaption>
        </figure>
      </div>
    </section>
  );
}

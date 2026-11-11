import { Link } from 'react-router-dom';
import { CATALOGO } from '../../dados/provas';
import { diasEntre, fracaoIdeal, iniDia, PASSOS_Q, SAIDA, type Agenda } from '../../logica/revisao';
import { plural } from '../comum';

const SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const DATA_LONGA = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
const DATA_CURTA = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long' });

export function nomeProva(id: string | null | undefined): string {
  if (id === 'enem') return 'ENEM';
  const p = CATALOGO.find((x) => x.id === id);
  if (!p) return id || '';
  const curto = p.prova.replace(/^Vestibular /, '');
  return curto.length <= 30 || !p.sigla ? curto : p.sigla;
}

/**
 * Agenda da revisão (pilar 2, comando 24 fase 2): a data da próxima prova-alvo, quanto falta, o maior intervalo de hoje
 * e quantas questões voltam em cada um dos próximos 14 dias. Sem data de prova: a escala de sempre e o caminho para o
 * Perfil.
 */
export function AgendaRevisao({ ag, hoje, futuras, agora }: { ag: Agenda; hoje: number; futuras: number[]; agora: number }) {
  const d0 = iniDia(agora);
  const dias = [...Array(14)].map((_, i) => {
    const d = new Date(d0); d.setDate(d.getDate() + i);
    const ini = d.getTime();
    return { d: ini, n: i === 0 ? hoje : futuras.filter((v) => iniDia(v) === ini).length };
  });
  const max = Math.max(1, ...dias.map((x) => x.n));
  const falta = ag.prova ? diasEntre(agora, ag.prova) : 0;
  const maior = ag.prova ? Math.max(1, Math.min(PASSOS_Q[SAIDA - 1], Math.round(fracaoIdeal(falta) * falta), falta - 1)) : PASSOS_Q[SAIDA - 1];
  const total = dias.reduce((a, x) => a + x.n, 0);

  return (
    <section className="bloco ag" aria-labelledby="ag-tit">
      <div className="ag-cab">
        <div className="ag-txt">
          <h2 id="ag-tit" className="ag-tit">{ag.prova ? <>{nomeProva(ag.provaId)} em {DATA_LONGA.format(ag.prova)}</> : 'Sua agenda de revisão'}</h2>
          <p className="ag-sub">{ag.prova
            ? <>Faltam <b className="num">{plural(falta, 'dia', 'dias')}</b>. Cada questão volta a tempo de você chegar firme na prova: hoje, no máximo {plural(maior, 'dia', 'dias')} entre uma revisão e outra, e o intervalo encurta conforme a prova se aproxima. Nada fica marcado para depois da véspera.</>
            : <>Sem data de prova, a questão volta em 1, 3 e 7 dias. Informe a data das suas provas-alvo e a agenda passa a contar a partir da prova.</>}</p>
        </div>
        <Link to="/perfil#datas-prova" className="btn sec peq ag-btn">{ag.prova ? 'Trocar a data' : 'Informar a data da prova'}</Link>
      </div>
      <figure className="ag-graf" aria-label={`Questões que voltam nos próximos 14 dias: ${total}. ${dias.map((x) => `${DATA_CURTA.format(x.d)}: ${x.n}`).join('; ')}`}>
        <ol className="ag-dias" aria-hidden>
          {dias.map((x, i) => {
            const prova = ag.prova === x.d;
            return (
              <li key={x.d} className={'ag-dia' + (i === 0 ? ' hoje' : '') + (prova ? ' prova' : '') + (ag.prova && x.d > ag.prova ? ' depois' : '')}>
                <span className="ag-n num">{x.n || ''}</span>
                <span className="ag-col"><i style={{ height: x.n ? `${Math.max(10, (x.n / max) * 100)}%` : 0 }} /></span>
                <span className="ag-sem">{i === 0 ? 'Hoje' : prova ? 'Prova' : SEMANA[new Date(x.d).getDay()]}</span>
                <span className="ag-num num">{new Date(x.d).getDate()}</span>
              </li>
            );
          })}
        </ol>
        <figcaption className="ag-leg">{total ? <>{plural(total, 'questão volta', 'questões voltam')} nos próximos 14 dias{hoje ? <>, {hoje} hoje</> : ''}.</> : 'Nenhuma questão marcada para os próximos 14 dias.'}</figcaption>
      </figure>
    </section>
  );
}

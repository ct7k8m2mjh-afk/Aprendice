import { numeroQuestao, type Letra, type Questao, type Resolucao } from '../dados/tipos';
import { Icone } from './Icone';
import { ResolucaoAnimada } from './ResolucaoAnimada';
import { comFracoes } from './Fracao';
import { materiaDoCodigo } from '../logica/fracao';
import { materiaDaArea } from '../dados/provasCompletas';

/**
 * Correção da questão (decisão do dono, 05/11/2026): só 4 blocos, nesta ordem —
 * 1. Por que eu errei (res.erradas[letra marcada]; some quando acerta) · 2. Resposta correta + a pegadinha
 * (res.resposta + res.armadilha) · 3. Resolução animada · 4. Por que as outras estão erradas (fechado).
 * Os demais campos (antes, checagem, essencial, alerta, pista, caminhos) continuam nos dados e não ocupam a correção.
 */
export function ResolucaoView({ q, r, marcada }: { q: Questao; r: Resolucao | null | undefined; marcada: Letra | null }) {
  const acertou = marcada === q.gab;
  const erradaTxt = marcada && !acertou ? r?.erradas?.[marcada] : null;
  // a matéria decide se a "conta" de um passo é conta (letra à mão) ou texto (Português, Inglês, humanas)
  const mat = materiaDoCodigo(q.modulo) || materiaDoCodigo(q.sub) || materiaDaArea(q.conceito);
  // as outras alternativas erradas (a marcada já foi explicada no bloco 1)
  const outras = (Object.entries(r?.erradas || {}) as [Letra, string][])
    .filter(([l, t]) => t && l !== q.gab && !(erradaTxt && l === marcada)).sort(([a], [b]) => a.localeCompare(b));
  return (
    <section className={'resolucao' + (acertou ? ' ok' : marcada ? ' err' : '')} aria-labelledby="res-tit">
      <header className="res-cab">
        <span className={'res-selo ' + (acertou ? 'ok' : marcada ? 'err' : '')}>
          <Icone nome={acertou ? 'check' : marcada ? 'fechar' : 'info'} tam={18} />
        </span>
        <div>
          <h2 id="res-tit">{acertou ? 'Você acertou' : marcada ? `Você marcou ${marcada}. A resposta é ${q.gab}.` : `Gabarito: ${q.gab}`}</h2>
          <p className="fraco">Gabarito oficial publicado · {q.escola} {q.ano}{q.n ? `, questão ${numeroQuestao(q)}` : ''}</p>
        </div>
      </header>

      {!r && <p className="miolo">A resolução comentada desta questão está em revisão e entra quando passar por todas as lentes.</p>}
      {r && (
        <>
          {/* 1. Por que eu errei: o que faltou no raciocínio de quem marcou esta letra (só quando errou) */}
          {erradaTxt && (
            <div className="cor-bloco cor-errei">
              <h3 className="cor-tit">Por que eu errei</h3>
              <p className="cor-expl">{comFracoes(erradaTxt)}</p>
            </div>
          )}
          {/* 2. Resposta correta + a pegadinha */}
          {(r.resposta || r.armadilha) && (
            <div className="cor-bloco cor-resposta">
              <h3 className="cor-tit">Resposta correta</h3>
              {r.resposta && <p className="cor-resp">{comFracoes(r.resposta)}</p>}
              {r.armadilha && (
                <div className="cor-pegadinha">
                  <b>A pegadinha</b>
                  <p className="cor-expl">{comFracoes(r.armadilha)}</p>
                </div>
              )}
            </div>
          )}
          {/* 3. Resolução animada (um motor só para todas: logica/motorConta.ts) */}
          {((r.passos && r.passos.length > 0) || (r.quadro && r.quadro.length > 0)) && <ResolucaoAnimada r={r} materia={mat} />}
          {/* 4. Por que as outras estão erradas: fechado, abre ao clicar */}
          {outras.length > 0 && (
            <details className="cor-outras">
              <summary>Por que as outras estão erradas</summary>
              <ul>{outras.map(([l, t]) => <li key={l}><b>{l}</b><span className="cor-expl">{comFracoes(t)}</span></li>)}</ul>
            </details>
          )}
        </>
      )}
      <p className="res-fonte">
        Fonte: {q.origem === 'prova' ? 'caderno de prova' : 'lista pública de exercícios'} · <a href={q.url} target="_blank" rel="noreferrer noopener">{q.escola} {q.ano} <Icone nome="externo" tam={13} /></a>
      </p>
    </section>
  );
}

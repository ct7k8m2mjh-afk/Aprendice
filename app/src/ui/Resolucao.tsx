import type { Letra, Questao, Resolucao } from '../dados/tipos';
import { Icone } from './Icone';

/** Resolução comentada. Princípio 5: começa pela alternativa que o aluno marcou. */
export function ResolucaoView({ q, r, marcada }: { q: Questao; r: Resolucao | null | undefined; marcada: Letra | null }) {
  const acertou = marcada === q.gab;
  const erradaTxt = marcada && !acertou ? r?.erradas?.[marcada] : null;
  return (
    <section className={'resolucao' + (acertou ? ' ok' : marcada ? ' err' : '')} aria-labelledby="res-tit">
      <header className="res-cab">
        <span className={'res-selo ' + (acertou ? 'ok' : marcada ? 'err' : '')}>
          <Icone nome={acertou ? 'check' : marcada ? 'fechar' : 'info'} tam={18} />
        </span>
        <div>
          <h2 id="res-tit">{acertou ? 'Você acertou' : marcada ? `Você marcou ${marcada}. A resposta é ${q.gab}.` : `Gabarito: ${q.gab}`}</h2>
          <p className="fraco">Gabarito oficial publicado · {q.escola} {q.ano}{q.n ? `, questão ${q.n}` : ''}</p>
        </div>
      </header>

      {erradaTxt && (
        <div className="res-marcada">
          <h3>Por que a {marcada} parece certa (e não é)</h3>
          <p>{erradaTxt}</p>
        </div>
      )}

      {!r && <p className="miolo">A resolução comentada desta questão está em revisão e entra quando passar por todas as lentes.</p>}
      {r && (
        <>
          {r.resposta && <p className="res-resposta">{r.resposta}</p>}
          {r.essencial?.chave && (
            <div className="res-chave"><b>A ideia-chave</b><p>{r.essencial.chave}</p></div>
          )}
          {r.antes?.texto && (
            <details className="res-antes">
              <summary>O que você precisa saber antes</summary>
              <p>{r.antes.texto}</p>
              {r.antes.formulas && r.antes.formulas.length > 0 && <ul className="caderno">{r.antes.formulas.map((f, i) => <li key={i}>{f}</li>)}</ul>}
              {r.antes.simbolos && r.antes.simbolos.length > 0 && (
                <dl className="simbolos">{r.antes.simbolos.map(([t, d], i) => <div key={i}><dt>{t}</dt><dd>{d}</dd></div>)}</dl>
              )}
            </details>
          )}
          {r.passos && r.passos.length > 0 && (
            <ol className="passos">
              {r.passos.map((p, i) => (
                <li key={i}>
                  <span className="passo-n num" aria-hidden>{i + 1}</span>
                  <div>
                    <b>{p.faz}</b>
                    {p.conta && <p className="conta">{p.conta}</p>}
                    {p.porque && <p className="porque">{p.porque}</p>}
                  </div>
                </li>
              ))}
            </ol>
          )}
          {r.checagem && <div className="res-bloco"><h3>Confira em 10 segundos</h3><p>{r.checagem}</p></div>}
          {r.armadilha && <div className="res-bloco armadilha"><h3>Armadilha</h3><p>{r.armadilha}</p></div>}
          {r.alerta && <div className="res-bloco"><h3>Atenção</h3><p>{r.alerta}</p></div>}
          {r.erradas && Object.keys(r.erradas).length > 0 && (
            <details className="res-erradas" open={!marcada || acertou ? false : undefined}>
              <summary>De onde vem cada alternativa errada</summary>
              <ul>{(Object.entries(r.erradas) as [Letra, string][]).sort(([a], [b]) => a.localeCompare(b)).map(([l, t]) => (
                <li key={l} className={l === marcada ? 'marcada' : ''}><b>{l}</b><span>{t}</span></li>
              ))}</ul>
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

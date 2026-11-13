import type { MateriaCarregada } from '../../dados/conteudo';
import { nomeMateria } from '../../dados/materias';
import type { Estado } from '../../estado/tipos';
import { estadoMateriaVazio } from '../../estado/tipos';
import { dominioMateria, feitasDe, previsao, somaContas, type ContaDominio } from '../../logica/dominio';
import { SAIDA, type Agenda } from '../../logica/revisao';
import { nomeProva } from './AgendaRevisao';

const ESTADOS = [
  { k: 'domina', nome: 'Domina', cls: 'dm-d' },
  { k: 'aprendendo', nome: 'Aprendendo', cls: 'dm-a' },
  { k: 'esqueceu', nome: 'Esqueceu', cls: 'dm-e' },
] as const;

const cap = (x: string) => x.charAt(0).toUpperCase() + x.slice(1);

/** Barra empilhada das questões já feitas: domina, aprendendo, esqueceu (as não feitas aparecem só no texto). */
function Barra({ c, fina }: { c: ContaDominio; fina?: boolean }) {
  const base = Math.max(1, feitasDe(c));
  return (
    <span className={'dm-barra' + (fina ? ' fina' : '')} role="img" aria-label={`${c.domina} domina, ${c.aprendendo} aprendendo, ${c.esqueceu} esqueceu, ${c.nunca} ainda não feitas`}>
      {ESTADOS.map((x) => c[x.k] > 0 && <i key={x.k} className={x.cls} style={{ width: `${(c[x.k] / base) * 100}%` }} />)}
    </span>
  );
}

function Numeros({ c }: { c: ContaDominio }) {
  return (
    <span className="dm-nums num">
      {ESTADOS.map((x) => <span key={x.k} title={x.nome}><i className={x.cls} aria-hidden />{c[x.k]}<span className="sr"> {x.nome.toLowerCase()}</span></span>)}
    </span>
  );
}

/**
 * Painel de domínio real (pilar 8, comando 24 fase 2): por matéria, tema e conteúdo, quantas questões o aluno domina
 * (3 acertos espaçados e a lembrança firme), está aprendendo ou esqueceu. Com data de prova, a previsão para o dia.
 */
export function PainelDominio({ todas, e, ag, agora }: { todas: MateriaCarregada[]; e: Estado; ag: Agenda; agora: number }) {
  const mats = todas.map((mc) => ({ mc, d: dominioMateria(mc, e.materias[mc.id] || estadoMateriaVazio(), ag, agora) })).filter((x) => feitasDe(x.d.c) > 0);
  if (!mats.length) return (
    <div className="vazio"><h3>Ainda sem questões respondidas</h3><p>O painel mostra o que você domina, está aprendendo ou esqueceu assim que você começa a responder.</p></div>
  );
  const geral = somaContas(mats.map((x) => x.d.c));
  const prev = previsao(geral);

  return (
    <div className="dm">
      <section className="bloco dm-resumo" aria-label="Resumo do domínio">
        <dl className="dm-tot">
          {ESTADOS.map((x) => (
            <div key={x.k}><dt><i className={x.cls} aria-hidden />{x.nome}</dt><dd className="num">{geral[x.k].toLocaleString('pt-BR')}</dd></div>
          ))}
          {prev != null && <div className="dm-prev"><dt>No dia da prova</dt><dd className="num">{prev}%</dd></div>}
        </dl>
        <Barra c={geral} />
        <p className="dm-expl">
          A barra mostra as {geral.domina + geral.aprendendo + geral.esqueceu} questões que você já fez. <b>Domina</b>: {SAIDA} acertos em dias diferentes, cada um na data marcada, e a lembrança ainda firme. <b>Aprendendo</b>: errou da primeira vez ou ainda não completou os {SAIDA} acertos. <b>Esqueceu</b>: errou depois de já ter acertado, ou passou tanto tempo da data que a lembrança provavelmente caiu.
          {prev != null && <> <b>No dia da prova</b>: quanto você deve lembrar das questões que já fez no dia da prova ({nomeProva(ag.provaId)}), se fizer as revisões marcadas.</>}
        </p>
      </section>

      {mats.map(({ mc, d }) => {
        const p = previsao(d.c);
        return (
          <section key={mc.id} className={`bloco dm-mat m-${mc.id}`} aria-labelledby={`dm-${mc.id}`}>
            <div className="dm-mat-cab">
              <h2 id={`dm-${mc.id}`}><i className="ponto" aria-hidden />{nomeMateria(mc.id)}</h2>
              <Numeros c={d.c} />
              {p != null && <span className="dm-mat-prev num">{p}% no dia da prova</span>}
            </div>
            <Barra c={d.c} />
            <ul className="dm-temas">
              {d.temas.filter((t) => feitasDe(t.c) > 0).map((t) => (
                <li key={t.id}>
                  <details className="dm-tema">
                    <summary>
                      <span className="dm-nome">{cap(t.nome)}</span>
                      <Barra c={t.c} fina />
                      <Numeros c={t.c} />
                    </summary>
                    <ul className="dm-subs">
                      {t.subs.map((x) => (
                        <li key={x.id} className={feitasDe(x.c) ? '' : 'nada'}>
                          <span className="dm-nome"><i className="ponto-sub" aria-hidden />{cap(x.nome)}</span>
                          {feitasDe(x.c) ? <><Barra c={x.c} fina /><Numeros c={x.c} /></> : <span className="dm-nada">ainda não feito</span>}
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

import { Link, useSearchParams } from 'react-router-dom';
import { useTodasMaterias } from '../dados/conteudo';
import { MATERIAS_ATIVAS, nomeMateria } from '../dados/materias';
import { useEstado } from '../estado/loja';
import { filaRetirada, questoesVencidas, resumoMateria } from '../logica/estatisticas';
import { filaDe, emDias, DIA, iniDia, PASSOS_Q } from '../logica/revisao';
import { Carregando, plural, useTitulo } from '../ui/comum';
import { Icone } from '../ui/Icone';
import { estadoMateriaVazio } from '../estado/tipos';
import { numeroQuestao } from '../dados/tipos';

export function Revisao() {
  useTitulo('Revisão');
  const todas = useTodasMaterias();
  const e = useEstado();
  const [qs, setQs] = useSearchParams();
  const aba = qs.get('aba') || 'questoes';
  if (!todas) return <div className="conteudo"><Carregando /></div>;
  const agora = Date.now();
  const amanha7 = iniDia(agora) + 8 * DIA;

  const porMat = todas.map((mc) => {
    const s = e.materias[mc.id] || estadoMateriaVazio();
    const venc = questoesVencidas(mc, s, agora);
    const prox = mc.banco.filter((q) => { const f = filaDe(s.q[q.id]); return f && f.vence > agora && f.vence < amanha7; })
      .concat((mc.retiradas || []).filter((q) => { const f = filaRetirada(mc, s, q); return f && f.vence > agora && f.vence < amanha7; }));
    const marcadas = mc.banco.filter((q) => s.q[q.id]?.rev);
    return { mc, s, venc, prox, marcadas, r: resumoMateria(mc, s, agora) };
  });
  const totVenc = porMat.reduce((a, x) => a + x.venc.length, 0);
  const totFlash = porMat.reduce((a, x) => a + x.r.flashVencidos, 0);
  const totMarc = porMat.reduce((a, x) => a + x.marcadas.length, 0);

  return (
    <div className="conteudo">
      <div className="titulo-pag"><div><h1>Revisão</h1><p className="sub">Errou, chutou ou pediu pista: a questão volta em {PASSOS_Q.join(', ')} dias. Acertou na data, ela avança.</p></div></div>
      <div className="abas" role="group" aria-label="Seções">
        <button aria-pressed={aba === 'questoes'} onClick={() => setQs({}, { replace: true })}>Questões <small>{totVenc}</small></button>
        <button aria-pressed={aba === 'flash'} onClick={() => setQs({ aba: 'flash' }, { replace: true })}>Flashcards <small>{totFlash}</small></button>
        <button aria-pressed={aba === 'marcadas'} onClick={() => setQs({ aba: 'marcadas' }, { replace: true })}>Marcadas <small>{totMarc}</small></button>
      </div>

      {aba === 'questoes' && (totVenc === 0 && !porMat.some((x) => x.prox.length) ? (
        <div className="vazio"><h3>Nada para revisar hoje</h3><p>Quando você errar, chutar ou usar uma pista, a questão aparece aqui no dia certo.</p><Link to="/" className="btn sec">Voltar ao início</Link></div>
      ) : (
        <div className="grade g2">
          {porMat.filter((x) => x.venc.length || x.prox.length).map(({ mc, venc, prox, s }) => (
            <section key={mc.id} className={`bloco m-${mc.id}`}>
              <div className="cab-sec"><h2 style={{ fontSize: 19 }}><i className="ponto" style={{ marginRight: 8 }} />{nomeMateria(mc.id)}</h2>
                {venc.length > 0 && <Link to={`/m/${mc.id}/q/${venc[0].id}?ctx=revisao`} className="btn peq">Revisar {venc.length}</Link>}</div>
              {venc.slice(0, 5).map((q) => {
                const f = filaDe(s.q[q.id]);
                return (
                  <Link key={q.id} to={`/m/${mc.id}/q/${q.id}?ctx=revisao`} className="linha-lista">
                    <span className={'etq ' + (f?.certeza ? 'err' : 'aviso')}>{f?.certeza ? 'Errou com certeza' : 'Vencida'}</span>
                    <span><span className="tit" style={{ fontSize: 15 }}>{q.escola} {q.ano}{q.n ? ` · questão ${numeroQuestao(q)}` : ''}</span><br /><span className="det">{mc.conteudo.modulos.find((x) => x.id === q.modulo)?.nome}</span></span>
                    <Icone nome="direita" />
                  </Link>
                );
              })}
              {venc.length > 5 && <p className="fraco" style={{ fontSize: 14, paddingTop: 8 }}>e mais {venc.length - 5}</p>}
              {prox.length > 0 && <p className="fraco" style={{ fontSize: 14, paddingTop: 10 }}>Próximos 7 dias: {plural(prox.length, 'questão', 'questões')}</p>}
            </section>
          ))}
        </div>
      ))}

      {aba === 'flash' && (
        <div className="grade g2">
          {MATERIAS_ATIVAS.map((m) => {
            const x = porMat.find((y) => y.mc.id === m.id)!;
            return (
              <Link key={m.id} to={`/m/${m.id}/flashcards`} className={`cartao-obj m-${m.id}`}>
                <span className="mini"><Icone nome="cartas" /></span>
                <span><b>{m.nome}</b><small>{x.r.flashVencidos ? plural(x.r.flashVencidos, 'cartão para hoje', 'cartões para hoje') : 'Nada vencido'} · {x.r.flashNovos} novos</small></span>
                <Icone nome="direita" />
              </Link>
            );
          })}
        </div>
      )}

      {aba === 'marcadas' && (totMarc === 0 ? (
        <div className="vazio"><h3>Nenhuma questão marcada</h3><p>Use o marcador na tela da questão para guardar as que você quer rever.</p></div>
      ) : (
        <div className="bloco">
          {porMat.flatMap(({ mc, marcadas, s }) => marcadas.map((q) => {
            const f = filaDe(s.q[q.id]);
            return (
              <Link key={q.id} to={`/m/${mc.id}/q/${q.id}?ctx=escada`} className={`linha-lista m-${mc.id}`}>
                <span className="mini"><Icone nome="marcador" /></span>
                <span><span className="tit" style={{ fontSize: 15 }}>{q.escola} {q.ano}{q.n ? ` · questão ${numeroQuestao(q)}` : ''}</span><br /><span className="det">{nomeMateria(mc.id)} · {q.conceito.slice(0, 80)}{f ? ` · revisão ${emDias(f.vence)}` : ''}</span></span>
                <Icone nome="direita" />
              </Link>
            );
          }))}
        </div>
      ))}
    </div>
  );
}

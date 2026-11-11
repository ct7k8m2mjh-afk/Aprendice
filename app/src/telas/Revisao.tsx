import { Link, useSearchParams } from 'react-router-dom';
import { useTodasMaterias } from '../dados/conteudo';
import { MATERIAS_ATIVAS, nomeMateria } from '../dados/materias';
import { useEstado } from '../estado/loja';
import { filaRetirada, questoesVencidas, resumoMateria } from '../logica/estatisticas';
import { agendaDe, filaDe, emDias, DIA, iniDia, SAIDA } from '../logica/revisao';
import { AgendaRevisao } from '../ui/revisao/AgendaRevisao';
import { PainelDominio } from '../ui/revisao/PainelDominio';
import { Carregando, plural, useTitulo } from '../ui/comum';
import { Icone, type NomeIcone } from '../ui/Icone';
import { estadoMateriaVazio } from '../estado/tipos';
import { revisoesVencidas } from '../logica/cicloRevisao';
import { numeroQuestao } from '../dados/tipos';
import { FiltroRegiaoChips, defineFiltroRegiao, useRegiao } from '../ui/FiltroRegiao';
import { deFiltro, filtraRegiao } from '../logica/regiao';
import { CartoesGeral } from './RevisaoGeral';

export function Revisao() {
  useTitulo('Revisão');
  const todas = useTodasMaterias();
  const e = useEstado();
  const [qs, setQs] = useSearchParams();
  const aba = qs.get('aba') || 'questoes';
  const rg = useRegiao();
  if (!todas) return <div className="conteudo"><Carregando /></div>;
  const agora = Date.now();
  const ag = agendaDe(e, agora);
  const ate14 = iniDia(agora) + 14 * DIA;
  const amanha7 = iniDia(agora) + 8 * DIA;

  const porMat = todas.map((mc) => {
    const s = e.materias[mc.id] || estadoMateriaVazio();
    // pedido do dono (09/11/2026): a revisão segue o filtro de região; sem nenhuma da região, mostra todas (reserva)
    const vencTodas = questoesVencidas(mc, s, agora, ag);
    const venc = filtraRegiao(vencTodas, rg.conj).l;
    // agenda dos próximos 14 dias (pilar 2): o dia em que cada questão volta, pela regra nova
    const futuras = filtraRegiao(mc.banco.filter((q) => { const f = filaDe(s.q[q.id], ag); return f && f.vence > agora && f.vence < ate14; }), rg.conj).l
      .map((q) => filaDe(s.q[q.id], ag)!.vence)
      .concat((mc.retiradas || []).map((q) => filaRetirada(mc, s, q, ag)?.vence || 0).filter((v) => v > agora && v < ate14));
    const prox = futuras.filter((v) => v < amanha7);
    const marcadas = mc.banco.filter((q) => s.q[q.id]?.rev);
    // revisão em slides (ciclo de 5 tempos): conteúdos que voltam hoje e os que ficaram no meio
    const nomeSub = (sub: string) => mc.conteudo.modulos.flatMap((x) => x.subs).find((x) => x.id === sub)?.nome || sub;
    const conteudos = [...new Set([...revisoesVencidas(s, agora), ...Object.entries(s.revs || {}).filter(([, r]) => r.and).map(([sub]) => sub)])]
      .map((sub) => ({ sub, nome: nomeSub(sub), andamento: !!s.revs?.[sub]?.and }));
    return { mc, s, venc, outras: vencTodas.length - venc.length, prox, futuras, marcadas, conteudos, r: resumoMateria(mc, s, agora, ag) };
  });
  const totVenc = porMat.reduce((a, x) => a + x.venc.length, 0);
  const totOutras = porMat.reduce((a, x) => a + x.outras, 0);
  const totFlash = porMat.reduce((a, x) => a + x.r.flashVencidos, 0);
  const totMarc = porMat.reduce((a, x) => a + x.marcadas.length, 0);
  const totCont = porMat.reduce((a, x) => a + x.conteudos.length, 0);
  const futuras = porMat.flatMap((x) => x.futuras);

  return (
    <div className="conteudo">
      <div className="titulo-pag"><div><h1>Revisão</h1><p className="sub">{aba === 'conteudos'
        ? 'Cada conteúdo revisado em slides volta no dia marcado no fim da revisão: amanhã quando algo não firmou, mais tarde quando firmou.'
        : aba === 'geral'
          ? 'A matéria inteira em tópicos curtos, com busca: o essencial, a pegadinha da banca e a imagem de cada tópico. Filosofia e Sociologia em duas listas.'
          : aba === 'dominio'
          ? 'O que você domina, está aprendendo ou esqueceu, pelos acertos em dias diferentes, cada um na data marcada.'
          : `Errou, chutou ou pediu pista: a questão volta no dia certo. Sai da revisão depois de ${SAIDA} acertos em dias diferentes, cada um na data marcada.`}</p></div>
        <Link to="/hoje" className="btn sec peq rv-hoje"><Icone nome="calendario" />O que estudar hoje</Link></div>
      {/* pedido do dono (11/11/2026): a revisão geral em destaque, porque nela está o conteúdo de todas as questões */}
      {aba !== 'geral' && (
        <section className="bloco rv-geral-dest" aria-labelledby="rv-gd-tit">
          <div className="rv-gd-txt">
            <h2 id="rv-gd-tit">Revisão geral</h2>
            <p>Todo o conteúdo de cada matéria em tópicos curtos, com o essencial, a pegadinha da banca e busca. É o que você precisa saber para responder as questões das provas.</p>
          </div>
          <div className="rv-gd-acao">
            <button type="button" className="btn grande" onClick={() => { setQs({ aba: 'geral' }, { replace: true }); window.scrollTo({ top: 0 }); }}>Abrir a revisão geral <Icone nome="direita" /></button>
          </div>
          <nav className="rv-gd-mats" aria-label="Revisão geral por matéria">
            {MATERIAS_ATIVAS.map((m) => <Link key={m.id} to={`/m/${m.id}/geral`} className={`chip m-${m.id}`}><i className="ponto" />{m.nome}</Link>)}
          </nav>
        </section>
      )}
      <AgendaRevisao ag={ag} hoje={totVenc} futuras={futuras} agora={agora} />
      <div className="abas abas-rev" role="group" aria-label="Seções">
        <button aria-pressed={aba === 'questoes'} onClick={() => setQs({}, { replace: true })}>Questões <small>{totVenc}</small></button>
        <button aria-pressed={aba === 'flash'} onClick={() => setQs({ aba: 'flash' }, { replace: true })}>Flashcards <small>{totFlash}</small></button>
        <button aria-pressed={aba === 'marcadas'} onClick={() => setQs({ aba: 'marcadas' }, { replace: true })}>Marcadas <small>{totMarc}</small></button>
        <button aria-pressed={aba === 'conteudos'} onClick={() => setQs({ aba: 'conteudos' }, { replace: true })}>Conteúdos <small>{totCont}</small></button>
        <button aria-pressed={aba === 'dominio'} onClick={() => setQs({ aba: 'dominio' }, { replace: true })}>Domínio</button>
        <button aria-pressed={aba === 'geral'} onClick={() => setQs({ aba: 'geral' }, { replace: true })}>Revisão geral</button>
      </div>

      {aba === 'geral' && (
        <div className="grade g2 rv-geral">
          {MATERIAS_ATIVAS.map((m) => <CartoesGeral key={m.id} m={m.id} />)}
        </div>
      )}

      {aba === 'dominio' && <PainelDominio todas={todas} e={e} ag={ag} agora={agora} />}

      {aba === 'questoes' && <div className="rv-regiao"><FiltroRegiaoChips />{totOutras > 0 && (
        <p className="fr-aviso" role="status"><span>{plural(totOutras, 'questão', 'questões')} de fora {deFiltro(rg.filtro, rg.minhas)} também {totOutras === 1 ? 'vence' : 'vencem'} hoje.</span>
          <button className="link-sec" onClick={() => defineFiltroRegiao('todas')}>Ver de outras regiões</button></p>
      )}</div>}

      {aba === 'questoes' && (totVenc === 0 && !porMat.some((x) => x.prox.length) ? (
        <div className="vazio"><h3>Nada para revisar hoje</h3><p>Quando você errar, chutar ou usar uma pista, a questão aparece aqui no dia certo.</p><Link to="/" className="btn sec">Voltar ao início</Link></div>
      ) : (
        <div className="grade g2">
          {porMat.filter((x) => x.venc.length || x.prox.length).map(({ mc, venc, prox, s }) => (
            <section key={mc.id} className={`bloco m-${mc.id}`}>
              <div className="cab-sec"><h2 style={{ fontSize: 19 }}><i className="ponto" style={{ marginRight: 8 }} />{nomeMateria(mc.id)}</h2>
                {venc.length > 0 && <Link to={`/m/${mc.id}/q/${venc[0].id}?ctx=revisao`} className="btn peq">Revisar {venc.length}</Link>}</div>
              {venc.slice(0, 5).map((q) => {
                const f = filaDe(s.q[q.id], ag);
                return (
                  <Link key={q.id} to={`/m/${mc.id}/q/${q.id}?ctx=revisao`} className="linha-lista">
                    <span className={'etq ' + (f?.certeza ? 'err' : 'aviso')}>{f?.certeza ? 'Errou com certeza' : f && f.etapa > 0 ? `${f.etapa} de ${SAIDA} acertos` : 'Vencida'}</span>
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

      {aba === 'conteudos' && (totCont === 0 ? (
        <div className="vazio"><h3>Nenhum conteúdo para rever hoje</h3><p>A revisão em slides de cada conteúdo (na tela do tema) marca o dia em que ele volta. Quando chegar o dia, ele aparece aqui.</p></div>
      ) : (
        <div className="bloco">
          {porMat.flatMap(({ mc, conteudos }) => conteudos.map((c) => (
            <Link key={mc.id + c.sub} to={`/m/${mc.id}/revisao/${c.sub}`} className={`linha-lista rv-linha-cont m-${mc.id}`}>
              <span className="mini"><Icone nome={`m_${mc.id}` as NomeIcone} /></span>
              <span><span className="tit">{c.nome.charAt(0).toUpperCase() + c.nome.slice(1)}</span><br /><span className="det">{nomeMateria(mc.id)} · revisão em slides · <b className={c.andamento ? 'rv-cont-and' : 'rv-cont-hoje'}>{c.andamento ? 'continuar' : 'para hoje'}</b></span></span>
              <Icone nome="direita" />
            </Link>
          )))}
        </div>
      ))}

      {aba === 'marcadas' && (totMarc === 0 ? (
        <div className="vazio"><h3>Nenhuma questão marcada</h3><p>Use o marcador na tela da questão para guardar as que você quer rever.</p></div>
      ) : (
        <div className="bloco">
          {porMat.flatMap(({ mc, marcadas, s }) => marcadas.map((q) => {
            const f = filaDe(s.q[q.id], ag);
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

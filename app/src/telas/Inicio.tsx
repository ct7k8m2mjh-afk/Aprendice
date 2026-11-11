import { useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { urlArteTreinoGeral, useTodasMaterias, type MateriaCarregada } from '../dados/conteudo';
import { MATERIAS_ATIVAS, materia as infoMateria } from '../dados/materias';
import { atualiza, useEstado } from '../estado/loja';
import { agendaDe } from '../logica/revisao';
import { materiaDeHoje, progressoEscada, questoesVencidas, resumoMateria, atividadeRecente } from '../logica/estatisticas';
import { desempenhoPeriodo, destaque, diasDeConstancia } from '../logica/inicio';
import { RODADA_PADRAO, RODADAS } from '../logica/treinoMisto';
import { Barra, Carregando, cap, plural, useTitulo } from '../ui/comum';
import { Icone } from '../ui/Icone';
import { CirculoMateria, IluMateria } from '../ui/IconeMateria';
import { useRoloHorizontal } from '../ui/rolo';
import type { MateriaId } from '../dados/tipos';
import type { Estado, EstadoMateria } from '../estado/tipos';
import { regiaoDoEstado } from '../ui/FiltroRegiao';
import { filtraRegiao } from '../logica/regiao';
import { estadoMateriaVazio } from '../estado/tipos';

const VAZIA: EstadoMateria = estadoMateriaVazio();

/** Próxima questão da escada onde o aluno parou (a última resposta que ainda existe no site). */
export function ondeParou(todas: MateriaCarregada[], e: Estado) {
  const ult = atividadeRecente(e, 50).find((x) => todas.find((y) => y.id === x.m)?.porId.has(x.id));
  if (!ult) return null;
  const mc = todas.find((x) => x.id === ult.m);
  const q = mc?.porId.get(ult.id);
  if (!mc || !q) return null;
  const todasRegioes = mc.porSub.get(q.sub) || [];
  // a escada do conteúdo na região do aluno (+ ENEM), como a tela do conteúdo mostra (pedido do dono, 09/11/2026)
  const f = filtraRegiao(todasRegioes, regiaoDoEstado(e).conj).l;
  const escada = f.some((x) => x.id === q.id) ? f : todasRegioes;
  const s = e.materias[mc.id]!;
  const prox = escada.find((x) => !s.q[x.id]?.tent.length) || q;
  const mod = mc.conteudo.modulos.find((x) => x.id === q.modulo);
  const sub = mod?.subs.find((x) => x.id === q.sub);
  return { m: mc.id, q, prox, escada, mod, sub, prog: progressoEscada(escada, s) };
}

const PERIODOS: { v: string; dias: number | null; nome: string }[] = [
  { v: '7', dias: 7, nome: 'Últimos 7 dias' }, { v: '30', dias: 30, nome: 'Últimos 30 dias' }, { v: 'tudo', dias: null, nome: 'Desde o começo' },
];

const pctInt = (n: number, d: number) => (d ? Math.round((n / d) * 100) : 0);

/** Ordem e nomes curtos da referência da aba principal (Inglês antes de Filosofia e Sociologia; "Quím", "Fil/Soc"...). */
const ORDEM_INICIO: MateriaId[] = ['bio', 'qui', 'mat', 'por', 'fis', 'geo', 'his', 'ing', 'fs'];
const MATERIAS_INICIO = ORDEM_INICIO.map((id) => MATERIAS_ATIVAS.find((m) => m.id === id)).filter((m): m is (typeof MATERIAS_ATIVAS)[number] => !!m);
const CURTO_GRAFICO: Partial<Record<MateriaId, string>> = { bio: 'Bio', qui: 'Quím', mat: 'Mat', por: 'Port', fis: 'Fís', geo: 'Geo', his: 'Hist', ing: 'Ingl', fs: 'Fil/Soc' };

/** "Suas matérias": faixa com rolagem lateral (roda do mouse e setas), um cartão por matéria. */
function SuasMaterias({ todas, e }: { todas: MateriaCarregada[]; e: Estado }) {
  const { rolo, bordas, mede, anda } = useRoloHorizontal('inicio');
  return (
    <section className="in-mats" aria-labelledby="in-mats-tit">
      <h2 id="in-mats-tit" className="in-sec-tit">Suas matérias</h2>
      <div className={'in-mats-faixa' + (bordas.e ? ' fe' : '') + (bordas.d ? ' fd' : '')}>
        {bordas.e && <button className="in-seta esq" onClick={() => anda(-1)} aria-label="Matérias anteriores"><Icone nome="esquerda" /></button>}
        <div className="in-mats-rolo" ref={rolo} onScroll={mede} role="list">
          {MATERIAS_INICIO.map((m) => {
            const mc = todas.find((x) => x.id === m.id);
            const r = mc ? resumoMateria(mc, e.materias[m.id] || VAZIA, Date.now(), agendaDe(e)) : { total: 0, feitas: 0 };
            return (
              <Link key={m.id} to={`/m/${m.id}`} className={`in-mat m-${m.id}`} role="listitem"
                aria-label={`${m.nome}: ${r.total ? `${r.feitas.toLocaleString('pt-BR')} de ${r.total.toLocaleString('pt-BR')} questões feitas` : 'questões em preparação'}`}>
                <CirculoMateria m={m.id} tam={150} />
                <span className="in-mat-nome">{m.nome}</span>
                <Barra valor={r.total ? r.feitas / r.total : 0} />
              </Link>
            );
          })}
        </div>
        {bordas.d && <button className="in-seta dir" onClick={() => anda(1)} aria-label="Próximas matérias"><Icone nome="direita" /></button>}
      </div>
    </section>
  );
}

/** Treino geral de todas as matérias: começar (ou retomar) e "Personalizar" (tamanho da rodada; nunca a matéria). */
function CartaoTreino({ e }: { e: Estado }) {
  const [abre, setAbre] = useState(false);
  const n = e.pref.rodadaMisto || RODADA_PADRAO;
  const ses = e.treinoMisto;
  const emAndamento = !!ses && ses.i < ses.it.length;
  const arte = urlArteTreinoGeral();
  const escolhe = (k: number) => {
    // rodada nova com o tamanho escolhido; a sessão em andamento (se houver) dá lugar à nova
    atualiza((x) => ({ ...x, pref: { ...x.pref, rodadaMisto: k }, treinoMisto: x.treinoMisto && x.treinoMisto.it.length === k ? x.treinoMisto : null }));
    setAbre(false);
  };
  return (
    <section className="in-treino" aria-labelledby="in-treino-tit">
      <div className="in-dest-txt">
        <h2 id="in-treino-tit">Treino geral</h2>
        <p className="in-dest-sub">Questões aleatórias de todas as matérias.</p>
        <p className="in-dest-info num">{emAndamento ? `Rodada em andamento: ${ses!.i} de ${ses!.it.length} questões` : `${n} questões por rodada`}</p>
        <div className="in-dest-acoes">
          <Link to="/treino-geral" className="btn grande in-btn-treino"><Icone nome="misturar" tam={20} />{emAndamento ? 'Retomar treino' : 'Começar treino'}</Link>
          <button type="button" className="in-personalizar" aria-expanded={abre} aria-controls="in-rodada" onClick={() => setAbre((v) => !v)}>Personalizar</button>
        </div>
        {abre && (
          <div id="in-rodada" className="in-rodada" role="group" aria-label="Questões por rodada">
            <span>Questões por rodada</span>
            <div className="in-rodada-ops">
              {RODADAS.map((k) => <button key={k} type="button" className="chip" aria-pressed={k === n} onClick={() => escolhe(k)}>{k}</button>)}
            </div>
            <small>As questões vêm de todas as matérias, sorteadas e misturadas.</small>
          </div>
        )}
      </div>
      {arte && <img className="in-treino-arte" src={arte} alt="" decoding="async" />}
    </section>
  );
}

/** "Continue de onde parou" (ou, sem histórico, a matéria do dia). */
function CartaoContinue({ todas, e }: { todas: MateriaCarregada[]; e: Estado }) {
  const parou = ondeParou(todas, e);
  const comQuestoes = todas.filter((mc) => mc.banco.length).map((mc) => mc.id);
  const m: MateriaId = parou ? parou.m : materiaDeHoje(e, comQuestoes.length ? comQuestoes : ['bio']);
  const info = infoMateria(m)!;
  const falta = parou ? Math.max(0, parou.prog.total - parou.prog.feitas) : 0;
  return (
    <section className={`in-continue m-${m}`} aria-labelledby="in-cont-tit">
      <div className="in-dest-txt">
        <p className="in-rotulo">{parou ? 'Continue de onde parou' : 'Comece por aqui'}</p>
        <h2 id="in-cont-tit">{info.nome}</h2>
        {parou ? (<>
          <p className="in-dest-sub">{cap(parou.sub?.nome || parou.mod?.nome || '')}</p>
          <p className="in-cont-prog num"><span>{parou.prog.feitas} de {plural(parou.prog.total, 'questão', 'questões')}</span>
            <small><span className="in-ponto" aria-hidden>•</span>{falta ? `Faltam ${falta} para concluir` : 'Conteúdo concluído'}</small></p>
          <Barra valor={parou.prog.feitas / Math.max(1, parou.prog.total)} rotulo="Progresso no conteúdo" />
          <Link to={`/m/${parou.m}/q/${parou.prox.id}?ctx=escada`} className="btn grande">Continuar estudo <Icone nome="seta" /></Link>
        </>) : (<>
          <p className="in-dest-sub">{info.descricao}</p>
          <Link to={`/m/${m}`} className="btn grande">Começar estudo <Icone nome="seta" /></Link>
        </>)}
      </div>
      <IluMateria m={m} className="in-cont-arte" />
    </section>
  );
}

/** Seu desempenho por matéria: acerto (barra) e questões resolvidas no período escolhido. */
function Desempenho({ e }: { e: Estado }) {
  const [per, setPer] = useState('30');
  const p = PERIODOS.find((x) => x.v === per) || PERIODOS[1];
  const dados = desempenhoPeriodo(e, p.dias);
  const porM = new Map(dados.map((x) => [x.m, x]));
  const total = dados.reduce((a, x) => a + x.resolvidas, 0);
  const dias = diasDeConstancia(e);
  const dest = destaque(dados);
  return (
    <section className="in-desemp" aria-labelledby="in-desemp-tit">
      <h2 id="in-desemp-tit" className="in-sec-tit">Seu desempenho por matéria</h2>
      <p className="in-sec-sub">Compare seus acertos e veja onde vale reforçar.</p>
      <label className="in-periodo">
        <span className="sr">Período</span>
        <select value={per} onChange={(ev) => setPer(ev.target.value)}>
          {PERIODOS.map((x) => <option key={x.v} value={x.v}>{x.nome}</option>)}
        </select>
        <Icone nome="baixo" tam={18} />
      </label>
      <figure className="in-grafico">
        <div className="in-graf-area">
          <div className="in-graf-eixo" aria-hidden><span>100%</span><span>50%</span><span>0%</span></div>
          <ul className="in-graf-barras">
            {MATERIAS_INICIO.map((m) => {
              const d = porM.get(m.id);
              const v = d ? pctInt(d.acertos, d.resolvidas) : null;
              return (
                <li key={m.id} className={`m-${m.id}`} aria-label={`${m.nome}: ${d ? `${v}% de acerto em ${plural(d.resolvidas, 'questão resolvida', 'questões resolvidas')}` : 'sem questões resolvidas no período'}`}>
                  <span className="in-graf-col" aria-hidden>
                    {v !== null && <b className="num">{v}%</b>}
                    <i style={{ '--v': v === null ? 0 : v / 100 } as CSSProperties} className={v === null ? 'vazia' : ''} />
                  </span>
                  <span className="in-graf-nome" aria-hidden>{CURTO_GRAFICO[m.id] || m.curto}</span>
                  <span className="in-graf-n num" aria-hidden>{d ? d.resolvidas.toLocaleString('pt-BR') : '—'}</span>
                </li>
              );
            })}
          </ul>
        </div>
        <figcaption>Questões resolvidas por matéria</figcaption>
      </figure>
      <div className="in-desemp-nums">
        <span><Icone nome="camadas" tam={22} /><b className="num">{plural(total, 'questão resolvida', 'questões resolvidas')}</b></span>
        <span><Icone nome="calendario" tam={22} /><b className="num">{plural(dias, 'dia de constância', 'dias de constância')}</b></span>
      </div>
      {dest && <p className="in-destaque num"><i aria-hidden />Seu destaque: {infoMateria(dest.m)?.nome} · {pctInt(dest.acertos, dest.resolvidas)}% de acerto</p>}
    </section>
  );
}

/** Hora de revisar: as matérias de menor acerto (com pelo menos uma questão feita). */
function HoraDeRevisar({ todas, e }: { todas: MateriaCarregada[]; e: Estado }) {
  const lista = todas
    .map((mc) => { const s = e.materias[mc.id] || VAZIA; const ag = agendaDe(e); const r = resumoMateria(mc, s, Date.now(), ag); return { mc, r, venc: r.feitas ? questoesVencidas(mc, s, Date.now(), ag) : [] }; })
    .filter((x) => x.r.feitas > 0)
    .sort((a, b) => a.r.acertos / a.r.feitas - b.r.acertos / b.r.feitas || b.r.feitas - a.r.feitas)
    .slice(0, 3);
  return (
    <section className="in-revisar" aria-labelledby="in-rev-tit">
      <h2 id="in-rev-tit" className="in-sec-tit">Hora de revisar</h2>
      <p className="in-sec-sub">Transforme seus erros em aprendizado.</p>
      {lista.length ? (<>
        <p className="in-rev-chamada">Comece pelas matérias que precisam de atenção</p>
        <ul className="in-rev-lista">
          {lista.map(({ mc, r, venc }) => (
            <li key={mc.id} className={`m-${mc.id}`}>
              <IluMateria m={mc.id} className="in-rev-ic" />
              <span className="in-rev-txt"><b>{infoMateria(mc.id)?.nome}</b><small className="num">{pctInt(r.acertos, r.feitas)}% de acerto</small></span>
              <Link to={venc.length ? `/m/${mc.id}/q/${venc[0].id}?ctx=revisao` : '/revisao'} className="in-link" aria-label={`Revisar ${infoMateria(mc.id)?.nome}`}>Revisar <Icone nome="seta" tam={18} /></Link>
            </li>
          ))}
        </ul>
      </>) : (
        <p className="in-rev-chamada">Quando você responder às primeiras questões, as matérias que pedem atenção aparecem aqui.</p>
      )}
      <Link to="/revisao" className="btn grande in-btn-revisar">Revisar meus erros <Icone nome="seta" /></Link>
      <p className="in-rev-pe">Uma nova chance de fixar o conteúdo.</p>
    </section>
  );
}

export function Inicio() {
  useTitulo('Início');
  const e = useEstado();
  const todas = useTodasMaterias();
  if (!todas) return <div className="conteudo"><Carregando /></div>;
  const ultima: MateriaId = (e.pref.ultimaMateria as MateriaId) || ondeParou(todas, e)?.m || 'bio';
  return (
    <div className="conteudo inicio-novo">
      <header className="in-cab">
        <h1>Vamos avançar nos estudos?</h1>
        <p>Escolha uma matéria ou misture seus conhecimentos.</p>
      </header>
      <SuasMaterias todas={todas} e={e} />
      <div className="in-destaques">
        <CartaoTreino e={e} />
        <CartaoContinue todas={todas} e={e} />
      </div>
      <div className="in-duo">
        <Desempenho e={e} />
        <HoraDeRevisar todas={todas} e={e} />
      </div>
      <nav className="in-atalhos" aria-label="Atalhos">
        <Link to={`/m/${ultima}/flashcards`} className="in-atalho">
          <span className="in-at-ic" aria-hidden><Icone nome="cartas" tam={30} /></span>
          <span className="in-at-txt"><b>Flashcards</b><small>Revise conceitos em poucos minutos</small></span>
          <Icone nome="seta" tam={24} className="in-at-seta" />
        </Link>
        <Link to="/simulados" className="in-atalho">
          <span className="in-at-ic" aria-hidden><Icone nome="relogio" tam={30} /></span>
          <span className="in-at-txt"><b>Simulados</b><small>Pratique no ritmo da prova</small></span>
          <Icone nome="seta" tam={24} className="in-at-seta" />
        </Link>
      </nav>
    </div>
  );
}

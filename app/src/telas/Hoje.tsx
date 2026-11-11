import { useMemo } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useTodasMaterias, type MateriaCarregada } from '../dados/conteudo';
import { nomeMateria } from '../dados/materias';
import { atualiza, useEstado } from '../estado/loja';
import type { Estado, SessaoHoje } from '../estado/tipos';
import { escudoTri, minutosDe, planoHoje, TEMPOS, TEMPO_PADRAO, FACIL_MAX, type Escudo, type ItemHoje, type PlanoHoje } from '../logica/hoje';
import { agendaDe, iniDia } from '../logica/revisao';
import { chaveMisto, resultadoMisto } from '../logica/treinoMisto';
import { juntaE } from '../logica/regiao';
import { Carregando, plural, useTitulo } from '../ui/comum';
import { Icone } from '../ui/Icone';
import { nomeProva } from '../ui/revisao/AgendaRevisao';
import { FiltroRegiaoChips, useRegiao } from '../ui/FiltroRegiao';
import { RodadaQuestoes } from './TreinoMisto';

const cap = (x: string) => x.charAt(0).toUpperCase() + x.slice(1);
const pct = (x: number) => (x * 100).toLocaleString('pt-BR', { maximumFractionDigits: x * 100 < 1 ? 2 : 1 }) + '%';

function comeca(tipo: SessaoHoje['tipo'], it: SessaoHoje['it']) {
  const agora = Date.now();
  atualiza((x) => ({ ...x, sessaoHoje: { it, i: 0, res: {}, t0: agora, tipo, dia: iniDia(agora) } }));
}

/** Sessão de hoje em andamento (montada hoje e não terminada). */
function sessaoAberta(e: Estado, agora: number): SessaoHoje | null {
  const s = e.sessaoHoje;
  return s && s.dia === iniDia(agora) && s.i < s.it.length ? s : null;
}

/** Por que este conteúdo está na lista (só o que os dados do aluno mostram). */
function Motivos({ it, provas }: { it: ItemHoje; provas: string }) {
  const l: { t: string; c: string }[] = [];
  if (it.faceisErradas) l.push({ t: plural(it.faceisErradas, 'fácil errada', 'fáceis erradas'), c: 'aviso' });
  if (it.certeza) l.push({ t: 'Errou com certeza', c: 'err' });
  if (it.vencidas) l.push({ t: plural(it.vencidas, 'volta hoje', 'voltam hoje'), c: '' });
  if (it.esquecidas) l.push({ t: plural(it.esquecidas, 'esquecida', 'esquecidas'), c: '' });
  if (it.tipo === 'novo') l.push({ t: 'Ainda não estudado', c: '' });
  else if (it.tipo === 'reforcar' && !it.esquecidas) l.push({ t: 'Ainda não firmou', c: '' });
  if (it.pesoRel >= 0.5) l.push({ t: `Cai muito ${provas}`, c: 'cor' });
  return <span className="hj-motivos">{l.map((x) => <span key={x.t} className={'etq' + (x.c ? ' ' + x.c : '')}>{x.t}</span>)}</span>;
}

function EscudoTri({ esc, aoComecar }: { esc: Escudo; aoComecar: () => void }) {
  return (
    <section className="bloco hj-escudo" aria-labelledby="hj-esc-tit">
      <div className="hj-esc-cab">
        <span className="hj-esc-ic" aria-hidden><Icone nome="escudo" tam={22} /></span>
        <div className="hj-esc-txt">
          <h2 id="hj-esc-tit">Escudo TRI</h2>
          <p>No ENEM, quem erra a fácil e acerta a difícil ganha menos pontos que quem acerta as duas fáceis: a TRI confere a coerência das respostas. Garanta primeiro as questões fáceis (nível 1 a {FACIL_MAX}) dos conteúdos que o ENEM cobra.</p>
        </div>
        {esc.erradas > 0 && <button className="btn hj-esc-btn" onClick={aoComecar}>Revisar as fáceis <span className="num">({esc.sessao.length})</span></button>}
      </div>
      <dl className="hj-esc-nums">
        <div className={esc.erradas ? 'err' : ''}><dt>Fáceis erradas</dt><dd className="num">{esc.erradas}</dd></div>
        <div><dt>Fáceis feitas</dt><dd className="num">{esc.feitas}</dd></div>
        <div><dt>Conteúdos com o básico garantido</dt><dd className="num">{esc.garantidos}</dd></div>
      </dl>
      {esc.conteudos.length > 0 ? (
        <ul className="hj-esc-lista">
          {esc.conteudos.slice(0, 8).map((c) => (
            <li key={c.m + c.sub} className={`m-${c.m}`}>
              <span className="hj-nome"><i className="ponto-sub" aria-hidden />{cap(c.nome)}</span>
              <span className="hj-det">{nomeMateria(c.m)} · {cap(c.tema)}{c.erradasEnem ? ` · ${c.erradasEnem} do próprio ENEM` : ''}</span>
              {c.incoerente && <span className="etq aviso hj-incoer">Acertou a difícil e errou a fácil</span>}
              <span className="hj-esc-conta num"><b>{c.erradas}</b> {c.erradas === 1 ? 'errada' : 'erradas'} de {c.faceis} {c.faceis === 1 ? 'fácil feita' : 'fáceis feitas'}</span>
            </li>
          ))}
          {esc.conteudos.length > 8 && <li className="hj-mais">e mais {plural(esc.conteudos.length - 8, 'conteúdo', 'conteúdos')}</li>}
        </ul>
      ) : (
        <p className="hj-esc-vazio">{esc.feitas
          ? 'Nenhuma fácil errada agora. Continue: cada fácil que você acerta em dias diferentes protege a sua nota.'
          : 'Você ainda não respondeu questões fáceis dos conteúdos do ENEM. Elas aparecem aqui assim que você começar.'}</p>
      )}
    </section>
  );
}

function ListaHoje({ plano, provas, aoComecar }: { plano: PlanoHoje; provas: string; aoComecar: (it: ItemHoje) => void }) {
  const l = plano.itens.slice(0, Math.max(plano.nItensSessao + 6, 10));
  return (
    <section className="bloco hj-lista" aria-labelledby="hj-lista-tit">
      <div className="hj-lista-cab">
        <h2 id="hj-lista-tit">A ordem de hoje</h2>
        <p>Os {plural(plano.nItensSessao, 'primeiro conteúdo cabe', 'primeiros conteúdos cabem')} nos {plano.minutos} minutos. Toque num conteúdo para estudar só ele.</p>
      </div>
      <ol className="hj-itens">
        {l.map((it, i) => {
          const n = it.ids.length;
          const fora = i >= plano.nItensSessao;
          return (
            <li key={it.m + it.sub} className={`m-${it.m}` + (fora ? ' fora' : '')}>
              {i === plano.nItensSessao && <span className="hj-sobra">Se sobrar tempo</span>}
              <button className="hj-item" onClick={() => aoComecar(it)} aria-label={`${cap(it.nome)}, ${nomeMateria(it.m)}: ${plural(n, 'questão', 'questões')}, cerca de ${minutosDe(n, plano.segPorQuestao)} min. Começar só este conteúdo`}>
                <span className="hj-n num" aria-hidden>{i + 1}</span>
                <span className="hj-item-txt">
                  <span className="hj-nome"><i className="ponto-sub" aria-hidden />{cap(it.nome)}</span>
                  <span className="hj-det">{nomeMateria(it.m)} · {cap(it.tema)}{it.peso > 0 ? <> · <span className="num">{pct(it.peso)}</span> {provas === 'no banco' ? 'do banco' : 'das questões ' + provas.replace(/^n/, 'd')}</> : ''}</span>
                  <Motivos it={it} provas={provas} />
                </span>
                <span className="hj-qt num"><b>{plural(n, 'questão', 'questões')}</b><small>cerca de {minutosDe(n, plano.segPorQuestao)} min</small></span>
                <Icone nome="direita" className="hj-seta" />
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/**
 * Tela Hoje (comando 24, fase 3; pilares 5 e 7 do Método Aprendice de Revisão): o que estudar hoje, na ordem que mais
 * rende — peso nas provas-alvo × fraqueza × risco de esquecer (logica/hoje.ts) —, o tempo estimado e o botão para
 * começar. Com o ENEM entre as provas-alvo, o Escudo TRI.
 */
export function Hoje() {
  useTitulo('Hoje');
  const nav = useNavigate();
  const todas = useTodasMaterias();
  const e = useEstado();
  const rg = useRegiao();
  const agora = Date.now();
  const dia = iniDia(agora);
  const alvos = useMemo(() => e.perfil?.provasAlvo || [], [e.perfil]);
  const minutos = e.pref.minutosHoje || TEMPO_PADRAO;
  const ag = agendaDe(e, agora);
  const calc = useMemo(() => {
    if (!todas) return null;
    const plano = planoHoje(todas, e.materias, { provasAlvo: alvos, conj: rg.conj, ag, agora, minutos });
    const esc = plano.enem ? escudoTri(todas, e.materias, { conj: rg.conj, ag }) : null;
    return { plano, esc };
  }, [todas, e.materias, alvos, rg.conj, minutos, dia, ag.prova, ag.desde]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!todas || !calc) return <div className="conteudo"><Carregando /></div>;
  const { plano, esc } = calc;
  const aberta = sessaoAberta(e, agora);
  const provasPeso = plano.pesos.provas;
  const provas = provasPeso.length ? 'n' + (provasPeso.length === 1 && provasPeso[0] === 'enem' ? 'o ENEM' : 'as suas provas') : 'no banco';
  const nomesProvas = juntaE(provasPeso.map(nomeProva));
  const n = plano.sessao.length;
  const vai = (tipo: SessaoHoje['tipo'], it: SessaoHoje['it']) => { comeca(tipo, it); nav('/hoje/sessao'); };
  const defineMin = (m: number) => atualiza((x) => ({ ...x, pref: { ...x.pref, minutosHoje: m } }));

  return (
    <div className="conteudo hj">
      <div className="titulo-pag"><div><h1>Hoje</h1>
        <p className="sub">O que estudar hoje, na ordem que mais rende: primeiro o que mais cai nas suas provas, onde você mais erra e o que está para esquecer.</p></div></div>
      <div className="rv-regiao"><FiltroRegiaoChips /></div>

      <section className="bloco hj-sessao" aria-labelledby="hj-ses-tit">
        <div className="hj-ses-txt">
          <h2 id="hj-ses-tit" className="num">{n ? <>{plural(n, 'questão', 'questões')} · cerca de {minutosDe(n, plano.segPorQuestao)} min</> : 'Nada pendente agora'}</h2>
          <p>{n
            ? <>De {plural(plano.nItensSessao, 'conteúdo', 'conteúdos')}, {plano.enem && esc?.erradas ? 'começando pelas fáceis erradas do Escudo TRI, ' : ''}com o seu tempo médio de {plural(Math.round(plano.segPorQuestao / 6) / 10, 'minuto', 'minutos')} por questão.</>
            : 'Você não tem questões para revisar nem conteúdos pendentes na sua região. Escolha uma matéria para avançar.'}</p>
          <div className="hj-tempo" role="group" aria-label="Tempo de estudo hoje">
            <span className="hj-tempo-rot">Tempo de hoje</span>
            <div className="chips">{TEMPOS.map((t) => <button key={t} className="chip" aria-pressed={minutos === t} onClick={() => defineMin(t)}>{t} min</button>)}</div>
          </div>
        </div>
        <div className="hj-ses-acao">
          {aberta ? <>
            <button className="btn grande" onClick={() => nav('/hoje/sessao')}>Continuar <span className="num hj-ses-pos">{aberta.i + 1} de {aberta.it.length}</span></button>
            {n > 0 && <button className="btn fantasma peq" onClick={() => vai('hoje', plano.sessao)}>Montar de novo</button>}
          </> : n > 0
            ? <button className="btn grande" onClick={() => vai('hoje', plano.sessao)}><Icone nome="play" tam={18} />Começar</button>
            : <Link to="/materias" className="btn grande">Ver as matérias</Link>}
        </div>
      </section>

      {esc && <EscudoTri esc={esc} aoComecar={() => vai('escudo', esc.sessao)} />}

      {plano.itens.length > 0 && <ListaHoje plano={plano} provas={provas} aoComecar={(it) => vai('hoje', it.ids.map((id) => ({ m: it.m, id })))} />}

      <section className="hj-como" aria-labelledby="hj-como-tit">
        <h2 id="hj-como-tit">Como a ordem é feita</h2>
        <p>Cada conteúdo recebe três notas, todas tiradas das suas respostas e do banco de questões reais: <b>peso</b> — {provasPeso.length
          ? <>quanto ele cai {provasPeso.length === 1 ? 'na sua prova-alvo' : 'nas suas provas-alvo'} ({nomesProvas}), pela parte das questões dessa{provasPeso.length === 1 ? '' : 's'} prova{provasPeso.length === 1 ? '' : 's'} no banco</>
          : <>quanto ele cai nas provas do banco{alvos.length ? ' (as suas provas-alvo ainda têm poucas questões no banco)' : ''}</>}; <b>fraqueza</b> — o que você errou, esqueceu ou ainda não firmou; <b>risco de esquecer</b> — quanto a lembrança já caiu desde a última vez, pela agenda da revisão.
          {' '}O tempo usa a sua mediana por questão.{!alvos.length && <> <Link to="/perfil" className="hj-link">Escolha suas provas-alvo</Link> para a ordem seguir o que elas cobram.</>}</p>
      </section>
    </div>
  );
}

/** Sessão montada na tela Hoje ou no Escudo TRI: uma questão por vez, salva para retomar. */
export function SessaoHojeTela() {
  const todas = useTodasMaterias();
  const e = useEstado();
  const nav = useNavigate();
  const ses = e.sessaoHoje;
  useTitulo(ses?.tipo === 'escudo' ? 'Escudo TRI' : 'Sessão de hoje');
  if (!ses || !ses.it.length) return <Navigate to="/hoje" replace />;
  if (!todas) return <div className="conteudo"><Carregando /></div>;
  const rotulo = ses.tipo === 'escudo' ? 'Escudo TRI' : 'Sessão de hoje';
  const avanca = (k: string, ok: boolean | null) => atualiza((x) => x.sessaoHoje
    ? { ...x, sessaoHoje: { ...x.sessaoHoje, i: x.sessaoHoje.i + 1, res: ok === null ? x.sessaoHoje.res : { ...x.sessaoHoje.res, [k]: ok ? 'a' : 'e' } } } : x);

  if (ses.i >= ses.it.length) return <FimSessao ses={ses} todas={todas} aoVoltar={() => { atualiza((x) => ({ ...x, sessaoHoje: null })); nav('/hoje'); }} />;
  return <RodadaQuestoes ses={ses} rotulo={rotulo} dica={`${rotulo}: a sessão fica salva se você sair`} ctx={ses.tipo === 'escudo' ? 'escudo' : 'hoje'} voltar="/hoje" aoAvancar={avanca} todas={todas} />;
}

function FimSessao({ ses, aoVoltar }: { ses: SessaoHoje; todas: MateriaCarregada[]; aoVoltar: () => void }) {
  const r = resultadoMisto(ses);
  const ok = r.reduce((a, x) => a + x.ok, 0), n = r.reduce((a, x) => a + x.n, 0);
  const erros = ses.it.filter((x) => ses.res[chaveMisto(x)] === 'e').length;
  return (
    <div className="conteudo estreito">
      <div className="resultado-fl folha tm-fim">
        <h1>{ses.tipo === 'escudo' ? 'Escudo TRI revisado' : 'Sessão de hoje concluída'}</h1>
        <p className="miolo num">{ok} de {n} {n === 1 ? 'questão certa' : 'questões certas'}{r.length ? `, em ${plural(r.length, 'matéria', 'matérias')}` : ''}.</p>
        {r.length > 0 && <ul className="tm-mats">
          {r.map((x) => <li key={x.m} className={`m-${x.m}`}><i className="ponto" aria-hidden /><span>{nomeMateria(x.m)}</span><b className="num">{x.ok} de {x.n}</b></li>)}
        </ul>}
        <p className="miolo">{erros ? `${plural(erros, 'questão errada volta', 'questões erradas voltam')} amanhã na revisão. ` : ''}Cada resposta já conta na agenda e no domínio de cada conteúdo.</p>
        <div className="fc-acoes"><button className="btn" onClick={aoVoltar}>Voltar para Hoje</button></div>
      </div>
    </div>
  );
}

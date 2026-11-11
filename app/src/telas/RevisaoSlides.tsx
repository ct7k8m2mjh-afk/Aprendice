import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMateria, useQuestaoComTexto, useResolucoes } from '../dados/conteudo';
import { materia as infoMateria } from '../dados/materias';
import { MATERIAS_ANIMADAS, useIndiceRevisao, useResumos, useTemaRevisao, type ResumoSubtema, type TemaRevisao } from '../dados/revisao';
import { ResumoSubtemaView } from '../ui/revisao/ResumoSubtema';
import { atualizaMateria, pegaEstado, useMateriaEstado } from '../estado/loja';
import type { AndamentoRevisao, Lembrou, RespRevisao, RevisaoConteudo } from '../estado/tipos';
import { estadoMateriaVazio } from '../estado/tipos';
import type { Letra, MateriaId, Questao } from '../dados/tipos';
import {
  CTX_SLIDES, TEMPOS, escolheQuestoes, slideDaQuestao, fechaSessao, linhasFixe, novoAndamento, resumoSessao, sessaoBoa, slidesDoCiclo,
} from '../logica/cicloRevisao';
import { agendaDe, emDias } from '../logica/revisao';
import { materiaDoCodigo } from '../logica/fracao';
import { nivelDe, nomeNivel } from '../logica/nivel';
import { Carregando, cap, plural, useTitulo } from '../ui/comum';
import { Icone, type NomeIcone } from '../ui/Icone';
import { BotaoTelaCheia, Certeza, EnunciadoQuestao, RespostaCartao, type Conf } from '../ui/QuestaoCartao';
import { ResolucaoView } from '../ui/Resolucao';
import { urlPrint } from '../dados/conteudo';
import { registraTentativa } from './Questao';
import { regiaoDoEstado } from '../ui/FiltroRegiao';
import { filtraRegiao } from '../logica/regiao';
import { Lacuna, SlideRevisao } from '../ui/revisao/SlideRevisao';

/** Grava a revisão do conteúdo no estado do aluno (salvo a cada passo: fechar a aba não perde nada). */
function gravaRev(m: MateriaId, sub: string, f: (r: RevisaoConteudo | undefined) => RevisaoConteudo) {
  atualizaMateria(m, (s) => ({ ...s, revs: { ...(s.revs || {}), [sub]: f(s.revs?.[sub]) } }));
}

/**
 * REVISÃO EM SLIDES — ciclo de 5 tempos (docs/estrategia-revisao.md, pilar 1; comandos 24 e 26 do dono).
 * Rota: /m/<matéria>/revisao/<conteúdo>. Lê docs/revisao/<matéria>/<TEMA>.json (public/conteudo/<m>/revisao/).
 * 1. pergunta primeiro · 2. ver acontecer · 3. lembrar sem olhar · 4. aplicar · 5. voltar (lógica em logica/cicloRevisao.ts).
 */
export function RevisaoSlides() {
  const { m, sub } = useParams() as { m: MateriaId; sub: string };
  const nav = useNavigate();
  const mc = useMateria(m);
  const s = useMateriaEstado(m);
  const temaId = sub.split('.')[0];
  const tema = useTemaRevisao(m, temaId);
  // resolução comentada publicada para este conteúdo? (o índice diz; sem ela, nada de buscar arquivo que não existe)
  const ind = useIndiceRevisao(m);
  const temRes = !!ind?.res?.includes(sub);
  const resumos = useResumos(m);
  const mod = mc?.conteudo.modulos.find((x) => x.id === temaId);
  const nomeSub = mod?.subs.find((x) => x.id === sub)?.nome || sub;
  useTitulo(`Revisão · ${cap(nomeSub)}`);
  const rev = s.revs?.[sub];
  const and = rev?.and || null;
  // resumo da sessão que acabou de fechar (tempo 5)
  const [fechada, setFechada] = useState<number | null>(null);
  const tick = useRef(Date.now());

  const voltar = `/m/${m}/tema/${temaId}?aba=revisao`;
  const slides = tema?.slides[sub];
  const ciclo = useMemo(() => slidesDoCiclo(slides || []), [slides]);

  /** muda o andamento (somando o tempo desde a última mudança, até 10 min) */
  const muda = useCallback((f: (a: AndamentoRevisao) => AndamentoRevisao) => {
    const agora = Date.now();
    const dt = Math.min(600, Math.round((agora - tick.current) / 1000));
    tick.current = agora;
    gravaRev(m, sub, (r) => {
      const a = r?.and;
      if (!a) return r || { etapa: 0, vence: 0, hist: [] };
      return { ...(r as RevisaoConteudo), and: f({ ...a, seg: a.seg + dt }) };
    });
  }, [m, sub]);

  useEffect(() => { tick.current = Date.now(); }, [and?.fase, and?.i]);
  useEffect(() => { setFechada(null); }, [m, sub]);
  // Esc volta ao tema, como diz o botão "Voltar (Esc)" (auditoria M2)
  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      const alvo = e.target as HTMLElement;
      if (alvo && (alvo.tagName === 'INPUT' || alvo.tagName === 'TEXTAREA')) { alvo.blur(); return; }
      if (document.querySelector('.lupa')) return;
      nav(`/m/${m}/tema/${sub.split('.')[0]}?aba=revisao`);
    };
    addEventListener('keydown', f);
    return () => removeEventListener('keydown', f);
  }, [m, sub, nav]);

  if (!mc || tema === undefined) return <div className="conteudo"><Carregando /></div>;
  // só conteúdos que existem no site (conteúdo novo proposto nas pendências não vira id sem decisão do dono)
  if (!tema || !slides?.length || !mod || !mod.subs.some((x) => x.id === sub)) {
    return (
      <div className={`conteudo vazio m-${m}`}>
        <h3>Revisão em preparação</h3>
        <p>A revisão em slides deste conteúdo ainda está passando pelas lentes da banca.</p>
        <Link className="btn sec" to={mod ? `/m/${m}/tema/${mod.id}` : `/m/${m}`}>Voltar ao tema</Link>
      </div>
    );
  }

  // questões da região do aluno (+ ENEM); com menos de 4, as de todas as regiões (o ciclo usa pergunta e aplicação)
  const qsTodas = mc.porSub.get(sub) || [];
  const frg = filtraRegiao(qsTodas, regiaoDoEstado(pegaEstado()).conj);
  const qs = frg.daRegiao >= 4 ? frg.l : qsTodas;
  const comeca = () => {
    const e = escolheQuestoes(qs, pegaEstado().materias[m] || estadoMateriaVazio());
    tick.current = Date.now();
    setFechada(null);
    gravaRev(m, sub, (r) => ({ ...(r || { etapa: 0, vence: 0, hist: [] }), and: novoAndamento(e.pre, e.apl) }));
  };
  const proxFase = (a: AndamentoRevisao): AndamentoRevisao => {
    if (a.fase === 0) return { ...a, fase: 1, i: 0 };
    if (a.fase === 1) return ciclo.fixe ? { ...a, fase: 2, i: 0 } : a.idsApl.length ? { ...a, fase: 3, i: 0 } : { ...a, fase: 4, i: 0 };
    if (a.fase === 2) return a.idsApl.length ? { ...a, fase: 3, i: 0 } : { ...a, fase: 4, i: 0 };
    return { ...a, fase: 4, i: 0 };
  };
  const avanca = () => {
    if (!and) return;
    const n = proxFase(and);
    if (n.fase === 4) {
      const agora = Date.now();
      const dt = Math.min(600, Math.round((agora - tick.current) / 1000));
      gravaRev(m, sub, (r) => fechaSessao(r, { ...n, seg: n.seg + dt }, agora, agendaDe(pegaEstado(), agora)));
      setFechada(agora);
    } else muda(() => n);
    window.scrollTo({ top: 0 });
  };
  const nomeMat = infoMateria(m)?.nome || '';
  const fase = fechada ? 4 : and ? and.fase : -1;

  return (
    <div className={`questao-tela rv-tela m-${m}` + (MATERIAS_ANIMADAS.has(m) ? '' : ' sem-anima')}>
      <div className="q-barra">
        <button className="q-volta" onClick={() => nav(voltar)} aria-label="Voltar" title="Voltar (Esc)"><Icone nome="esquerda" /><span>Voltar</span></button>
        <div className="q-barq">
          <span className="g" aria-hidden><Icone nome={`m_${m}` as NomeIcone} /></span>
          <span className="n">Revisão</span>
          <span className="t"><b>{cap(nomeSub)}</b> · {mod.nome}</span>
          <span className="p" aria-hidden><i style={{ width: `${fase < 0 ? 0 : ((fase + (fase === 4 ? 1 : 0.5)) / 5) * 100}%` }} /></span>
        </div>
        <BotaoTelaCheia />
      </div>

      {fase >= 0 && <Tempos fase={fase} anima={MATERIAS_ANIMADAS.has(m)} />}

      {fase < 0 ? (
        <Capa nomeMat={nomeMat} tema={tema} sub={sub} nomeSub={nomeSub} rev={rev} nQuestoes={qs.length} ciclo={ciclo} aoComecar={comeca} />
      ) : fechada || !and ? (
        <Fim m={m} resumos={resumos?.[sub]} temRes={temRes} rev={pegaEstado().materias[m]?.revs?.[sub] || rev} temaId={temaId} mcBanco={mc.porId} aoRefazer={comeca} />
      ) : and.fase === 0 || and.fase === 3 ? (
        <FaseQuestoes key={and.fase} m={m} fase={and.fase} and={and} porId={mc.porId} sub={sub} temRes={temRes}
          aoResponder={(q, resp) => muda((a) => (a.fase === 0 ? { ...a, pre: [...a.pre.filter((x) => x.id !== q.id), resp] } : { ...a, apl: [...a.apl.filter((x) => x.id !== q.id), resp] }))}
          aoIr={(i) => muda((a) => ({ ...a, i }))} aoFim={avanca} />
      ) : and.fase === 1 ? (
        <FaseVer m={m} tema={tema} sub={sub} and={and} ciclo={ciclo} porId={mc.porId}
          aoIr={(i) => { muda((a) => ({ ...a, i })); window.scrollTo({ top: 0 }); }}
          aoLembrar={(k, v) => muda((a) => ({ ...a, lembrou: { ...a.lembrou, [k]: v } }))} aoFim={avanca} />
      ) : (
        <FaseLembrar sub={sub} and={and} fixe={ciclo.fixe} aoLembrar={(k, v) => muda((a) => ({ ...a, lembrou: { ...a.lembrou, [k]: v } }))} aoFim={avanca} />
      )}
    </div>
  );
}

/** Os 5 tempos do ciclo, com o atual marcado. */
function Tempos({ fase, anima }: { fase: number; anima: boolean }) {
  return (
    <ol className="rv-tempos" aria-label="Os 5 tempos da revisão">
      {TEMPOS.map((t0, i) => { const t = i === 1 && !anima ? 'Rever os pontos' : t0; return (
        <li key={t} className={i < fase ? 'feito' : i === fase ? 'atual' : ''} aria-current={i === fase ? 'step' : undefined}>
          <span className="rv-tp-n num">{i < fase ? <Icone nome="check" tam={13} /> : i + 1}</span><span className="rv-tp-t">{t}</span>
        </li>
      ); })}
    </ol>
  );
}

/* ================================================================= capa */

function Capa({ nomeMat, tema, sub, nomeSub, rev, nQuestoes, ciclo, aoComecar }: {
  nomeMat: string; tema: TemaRevisao; sub: string; nomeSub: string; rev?: RevisaoConteudo; nQuestoes: number;
  ciclo: ReturnType<typeof slidesDoCiclo>; aoComecar: () => void;
}) {
  const ult = rev?.hist[rev.hist.length - 1];
  const r = ult && resumoSessao(ult);
  const passos: [string, string][] = [
    ['Pergunta primeiro', nQuestoes ? 'Questões reais deste conteúdo, antes de qualquer explicação. Marque a sua certeza.' : 'Quando houver questões deste conteúdo, a revisão começa por elas.'],
    MATERIAS_ANIMADAS.has(materiaDoCodigo(sub) || '')
      ? ['Ver acontecer', `${plural(ciclo.ver.length, 'slide animado', 'slides animados')}. Nos de conceito e de fórmula, você tenta lembrar antes de ver.`]
      : ['Rever os pontos', `${plural(ciclo.ver.length, 'slide', 'slides')}. Nos de conceito, você tenta lembrar a frase-chave antes de ver.`],
    ['Lembrar sem olhar', ciclo.fixe ? 'As 3 linhas para levar viram 3 lacunas para completar de memória.' : 'As frases-chave para completar de memória.'],
    ['Aplicar', 'Questões novas do mesmo conteúdo, diferentes das do começo.'],
    ['Voltar', 'O site marca o dia em que este conteúdo volta.'],
  ];
  return (
    <section className="tp-capa rv-capa" aria-labelledby="rv-capa-tit">
      <p className="tp-rot num">Revisão em slides · {nomeMat} · {tema.nome}</p>
      <h1 id="rv-capa-tit">{cap(nomeSub)}</h1>
      <ol className="rv-capa-passos">
        {passos.map(([t, d], i) => <li key={t}><span className="rv-tp-n num">{i + 1}</span><span><b>{t}</b><small>{d}</small></span></li>)}
      </ol>
      {ult && r && (
        <p className="rv-capa-ult">
          Última revisão: {new Date(ult.ts).toLocaleDateString('pt-BR')} · pergunta {r.pre.certas} de {r.pre.total} · lembrou {r.lembrou.a} de {r.lembrou.total} · aplicação {r.apl.certas} de {r.apl.total}
          {rev && <> · volta <b>{emDias(rev.vence)}</b></>}
        </p>
      )}
      <div className="tp-acoes">
        <button className="btn tp-comecar" onClick={aoComecar}><Icone nome="play" />{ult ? 'Revisar de novo' : 'Começar a revisão'}</button>
        <span className="tp-comp num">{plural((tema.slides[sub] || []).length, 'slide', 'slides')} · cerca de {Math.max(8, Math.round(ciclo.ver.length * 1.2 + (nQuestoes ? 6 : 0)))} min</span>
      </div>
    </section>
  );
}

/* ================================================================= tempos 1 e 4: questões */

function FaseQuestoes({ m, fase, and, porId, sub, temRes, aoResponder, aoIr, aoFim }: {
  temRes: boolean;
  m: MateriaId; fase: 0 | 3; and: AndamentoRevisao; porId: Map<string, Questao>; sub: string;
  aoResponder: (q: Questao, r: RespRevisao) => void; aoIr: (i: number) => void; aoFim: () => void;
}) {
  const ids = (fase === 0 ? and.idsPre : and.idsApl).filter((id) => porId.has(id));
  const resps = fase === 0 ? and.pre : and.apl;
  const i = Math.min(and.i, Math.max(0, ids.length - 1));
  const q0 = porId.get(ids[i]);
  const q = useQuestaoComTexto(m, q0) || q0;
  const res = useResolucoes(m, temRes ? sub : undefined);
  const feita = resps.find((r) => r.id === q0?.id);
  const [escolha, setEscolha] = useState<Letra | null>(feita?.letra || null);
  const [conf, setConf] = useState<Conf | null>(feita?.conf || null);
  const [riscadas, setRiscadas] = useState<Set<Letra>>(new Set());
  const t0 = useRef(Date.now());
  useEffect(() => { setEscolha(feita?.letra || null); setConf(feita?.conf || null); setRiscadas(new Set()); t0.current = Date.now(); }, [q0?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const confirma = useCallback(() => {
    if (!q || !escolha || feita) return;
    const ok = escolha === q.gab;
    registraTentativa(m, q.id, { letra: escolha, ok, ts: Date.now(), seg: Math.round((Date.now() - t0.current) / 1000), conf, ctx: CTX_SLIDES });
    aoResponder(q, { id: q.id, letra: escolha, ok, conf });
  }, [q, escolha, feita, conf, m, aoResponder]);
  const segue = useCallback(() => { if (i + 1 < ids.length) aoIr(i + 1); else aoFim(); }, [i, ids.length, aoIr, aoFim]);

  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      const alvo = e.target as HTMLElement;
      if (alvo && (alvo.tagName === 'INPUT' || alvo.tagName === 'TEXTAREA') || e.ctrlKey || e.metaKey || e.altKey) return;
      const k = e.key.toUpperCase();
      const mapa: Record<string, Letra> = { '1': 'A', '2': 'B', '3': 'C', '4': 'D', '5': 'E' };
      const l = (['A', 'B', 'C', 'D', 'E'].includes(k) ? k : mapa[k]) as Letra | undefined;
      if (l && !feita) { e.preventDefault(); if (e.shiftKey) setRiscadas((r) => { const n = new Set(r); n.has(l) ? n.delete(l) : n.add(l); return n; }); else setEscolha(l); }
      else if (e.key === 'Enter' && (alvo?.tagName !== 'BUTTON')) { e.preventDefault(); if (feita) segue(); else confirma(); }
    };
    addEventListener('keydown', f);
    return () => removeEventListener('keydown', f);
  }, [feita, confirma, segue]);

  if (!ids.length || !q) {
    return (
      <section className="tp-bloco rv-sem">
        <h2 className="tp-h">{fase === 0 ? 'Sem questões para começar' : 'Sem questão nova agora'}</h2>
        <p className="miolo">{fase === 0 ? 'Este conteúdo ainda não tem questões de prova no site. A revisão segue pelos slides.' : 'As questões deste conteúdo já apareceram no começo. Aplique na próxima revisão.'}</p>
        <button className="btn" onClick={aoFim}>Continuar <Icone nome="direita" /></button>
      </section>
    );
  }
  const ultima = i + 1 >= ids.length;
  return (
    <div className="rv-q">
      <div className="rv-intro">
        <h2 className="tp-h">{fase === 0 ? 'Antes de rever, tente responder' : 'Agora aplique numa questão nova'}</h2>
        <p className="miolo">{fase === 0
          ? 'Ainda sem explicação: o esforço de tentar prepara o que vem depois. Marque também a sua certeza.'
          : 'Questão real diferente das do começo, do mesmo conteúdo. Depois de responder, a correção aparece aqui embaixo.'}
          <span className="rv-intro-n num"> Questão {i + 1} de {ids.length}.</span></p>
      </div>
      <div className={'q-grade' + (feita && fase === 3 ? ' respondida' : '')}>
        <article className="folha q-cartao">
          <EnunciadoQuestao m={m} q={q} antes={<span className={`etq cor nivel n-${nivelDe(q.dif)}`}>{nomeNivel(nivelDe(q.dif))}</span>} />
          <RespostaCartao q={q} escolha={escolha} aoEscolher={setEscolha} revelado={!!feita} riscadas={riscadas}
            aoRiscar={(l) => setRiscadas((rr) => { const n = new Set(rr); n.has(l) ? n.delete(l) : n.add(l); return n; })}
            mostrarTexto={!!q.transcricao || !urlPrint(m, q.id)}>
            {!feita ? (
              <>
                <Certeza valor={conf} aoMudar={setConf} />
                <button className="btn btn-conf" onClick={confirma} disabled={!escolha}>Confirmar resposta</button>
              </>
            ) : (
              <button className="btn btn-conf" onClick={segue}>{ultima ? (fase === 0 ? <>Ver os slides <Icone nome="direita" /></> : <>Concluir <Icone nome="direita" /></>) : <>Próxima questão <Icone nome="direita" /></>}</button>
            )}
          </RespostaCartao>
        </article>
        {feita && (fase === 0 ? (
          <aside className={'folha rv-veredito ' + (feita.ok ? 'ok' : 'err')} aria-live="polite">
            <span className={'res-selo ' + (feita.ok ? 'ok' : 'err')}><Icone nome={feita.ok ? 'check' : 'fechar'} tam={18} /></span>
            <div>
              <h3>{feita.ok ? 'Você acertou' : `Você marcou ${feita.letra}. A resposta é ${q.gab}.`}</h3>
              <p className="miolo">{feita.ok
                ? (feita.conf === 'chute' ? 'Acertou no chute: para o site, ainda não é sabido. Os slides mostram o porquê.' : 'Os slides vão mostrar o porquê, passo a passo.')
                : feita.conf === 'certeza' ? 'Errou com certeza: este é o erro que mais vale corrigir. Os slides marcados mostram onde.' : 'Os slides a seguir mostram o que faltou. No fim, a questão fica na lista para você rever.'}</p>
            </div>
          </aside>
        ) : (
          <aside className="folha q-lado rv-lado" aria-label="Correção">
            <div className="q-lado-corpo">{q.res || res?.[q.id]
              ? <ResolucaoView q={q} r={q.res || res![q.id]} marcada={feita.letra} />
              : <SemResolucao q={q} marcada={feita.letra} />}</div>
          </aside>
        ))}
      </div>
    </div>
  );
}

/* ================================================================= tempo 2: ver acontecer */

function FaseVer({ m, tema, sub, and, ciclo, porId, aoIr, aoLembrar, aoFim }: {
  porId: Map<string, Questao>;
  m: MateriaId; tema: TemaRevisao; sub: string; and: AndamentoRevisao; ciclo: ReturnType<typeof slidesDoCiclo>;
  aoIr: (i: number) => void; aoLembrar: (k: string, v: Lembrou) => void; aoFim: () => void;
}) {
  const n = ciclo.ver.length;
  const i = Math.min(and.i, n - 1);
  const { s, k } = ciclo.ver[i];
  // pilar 1.2: o slide que responde a cada questão errada (ou acertada no chute) no tempo 1 aparece marcado
  const fracas = and.pre.filter((r) => !r.ok || r.conf === 'chute').map((r) => r.id);
  const q1 = useQuestaoComTexto(m, porId.get(fracas[0] || '')), q2 = useQuestaoComTexto(m, porId.get(fracas[1] || '')), q3 = useQuestaoComTexto(m, porId.get(fracas[2] || ''));
  const marcados = useMemo(() => {
    const out = new Set<number>();
    for (const q of [q1, q2, q3]) {
      if (!q) continue;
      const txt = [q.enun, ...Object.values(q.alts || {}), ...(q.transcricao?.enun.map((x) => x.t) || []), q.conceito].join(' ');
      const k = slideDaQuestao(txt, ciclo.ver);
      if (k != null) out.add(k);
    }
    return out;
  }, [q1, q2, q3, ciclo.ver]);
  const aviso = marcados.has(k) ? 'É aqui que você errou na pergunta inicial' : undefined;
  const chave = `${sub}#${k}`;
  const ant = () => { if (i > 0) aoIr(i - 1); };
  const prox = () => { if (i + 1 < n) aoIr(i + 1); else aoFim(); };

  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      const alvo = e.target as HTMLElement;
      if (alvo && (alvo.tagName === 'INPUT' || alvo.tagName === 'TEXTAREA') || e.ctrlKey || e.metaKey || e.altKey) return;
      if (alvo?.closest('.ra')) return; // setas dentro da resolução animada movem os passos dela
      if (e.key === 'ArrowRight') { e.preventDefault(); prox(); } else if (e.key === 'ArrowLeft') { e.preventDefault(); ant(); }
    };
    addEventListener('keydown', f);
    return () => removeEventListener('keydown', f);
  });

  return (
    <div className="rv-ver">
      <SlideRevisao key={chave} m={m} tema={tema} sub={sub} k={k} s={s} pos={i + 1} total={n} aviso={aviso}
        lembrou={and.lembrou[chave]} aoLembrar={(v) => aoLembrar(chave, v)} />
      <nav className="rv-nav" aria-label="Slides">
        <button className="btn sec" onClick={ant} disabled={i === 0}><Icone nome="esquerda" /> <span>Anterior</span></button>
        <div className="rv-pontos" aria-hidden>
          {ciclo.ver.map((x, j) => <i key={j} className={(j < i ? 'feito' : j === i ? 'atual' : '') + (marcados.has(x.k) ? ' marca' : '')} />)}
        </div>
        <button className="btn" onClick={prox}><span>{i + 1 < n ? 'Próximo' : ciclo.fixe ? 'Lembrar sem olhar' : 'Aplicar'}</span> <Icone nome="direita" /></button>
      </nav>
    </div>
  );
}

/* ================================================================= tempo 3: lembrar sem olhar */

function FaseLembrar({ sub, and, fixe, aoLembrar, aoFim }: {
  sub: string; and: AndamentoRevisao; fixe: ReturnType<typeof slidesDoCiclo>['fixe']; aoLembrar: (k: string, v: Lembrou) => void; aoFim: () => void;
}) {
  const linhas = linhasFixe(fixe?.s);
  const chave = (j: number) => `${sub}#${fixe?.k}:${j}`;
  const feitas = linhas.filter((_, j) => and.lembrou[chave(j)]).length;
  const primeira = linhas.findIndex((_, j) => !and.lembrou[chave(j)]);
  return (
    <section className="folha rv-slide rv-lembrar" aria-labelledby="rv-lb-tit">
      <header className="rv-cab"><span className="etq cor">Lembrar sem olhar</span><span className="rv-pos num">{feitas} de {linhas.length}</span></header>
      <h2 id="rv-lb-tit" className="rv-tit">{fixe?.s.titulo || 'Para levar'}</h2>
      <p className="rv-texto">Complete de memória as {linhas.length} linhas para levar. Escreva com as suas palavras; depois confira e diga como foi.</p>
      <ol className="rv-lacunas">
        {linhas.map((l, j) => (
          <li key={j} hidden={primeira >= 0 && j > primeira ? true : undefined}>
            <span className="rv-lac-n num" aria-hidden>{j + 1}</span>
            <Lacuna frase={l} id={`rv-lac-${j}`} valor={and.lembrou[chave(j)]} foco={j === primeira && j > 0} aoResponder={(v) => aoLembrar(chave(j), v)} />
          </li>
        ))}
      </ol>
      {primeira < 0 && (
        <div className="rv-lembrar-fim">
          <button className="btn" onClick={aoFim}>{and.idsApl.length ? 'Aplicar numa questão nova' : 'Concluir'} <Icone nome="direita" /></button>
        </div>
      )}
    </section>
  );
}

/* ================================================================= tempo 5: voltar */

function Fim({ m, resumos, temRes, rev, temaId, mcBanco, aoRefazer }: { m: MateriaId; resumos?: ResumoSubtema[]; temRes: boolean; rev?: RevisaoConteudo; temaId: string; mcBanco: Map<string, Questao>; aoRefazer: () => void }) {
  const ult = rev?.hist[rev.hist.length - 1];
  if (!ult || !rev) return null;
  const r = resumoSessao(ult);
  const boa = sessaoBoa(ult);
  const erradas = [...ult.pre, ...ult.apl].filter((x) => !x.ok).map((x) => mcBanco.get(x.id)).filter((q): q is Questao => !!q);
  const min = Math.max(1, Math.round(ult.seg / 60));
  return (
    <>
    <section className="tp-capa rv-fim" aria-labelledby="rv-fim-tit">
      <p className="tp-rot num">Revisão concluída · {plural(min, 'minuto', 'minutos')}</p>
      <h1 id="rv-fim-tit">{boa ? 'Conteúdo firme por enquanto' : 'Este conteúdo volta logo'}</h1>
      <ul className="rv-fim-nums">
        <li><b className="num">{r.pre.certas} de {r.pre.total}</b><span>Pergunta primeiro</span></li>
        <li><b className="num">{r.lembrou.a} de {r.lembrou.total}</b><span>Lembrou sem olhar{r.lembrou.q ? ` · ${r.lembrou.q} quase` : ''}</span></li>
        <li><b className="num">{r.apl.certas} de {r.apl.total}</b><span>Aplicação</span></li>
      </ul>
      <p className="rv-fim-volta"><Icone nome="relogio" tam={18} /> <span>Volta <b>{emDias(rev.vence)}</b> ({new Date(rev.vence).toLocaleDateString('pt-BR')}). {boa ? 'Acertou a aplicação e lembrou do essencial: o intervalo cresce.' : 'Algo não firmou (aplicação, certeza errada ou lacunas): volta cedo para fixar.'}</span></p>
      {erradas.length > 0 && (
        <div className="rv-fim-err">
          <h2 className="tp-h">Questões que você errou</h2>
          <ul>{erradas.map((q) => (
            <li key={q.id}><Link to={`/m/${m}/q/${q.id}?ctx=escada`}>
              <span>{q.escola} {q.ano}{q.n ? ` · questão ${q.n}` : ''}<small>{q.res || temRes ? 'Gabarito oficial e resolução comentada' : `Gabarito oficial: ${q.gab} · resolução comentada em preparação`}</small></span>
              <Icone nome="direita" />
            </Link></li>
          ))}</ul>
          <p className="fraco">Elas também entram na sua revisão espaçada de questões.</p>
        </div>
      )}
      <div className="tp-acoes">
        <Link className="btn tp-comecar" to={`/m/${m}/tema/${temaId}?aba=revisao`}><Icone nome="lista" />Outros conteúdos do tema</Link>
        <button className="btn sec" onClick={aoRefazer}><Icone nome="repetir" />Revisar de novo</button>
      </div>
    </section>
    {resumos && resumos.length > 0 && (
      <section className="tp-bloco rs-fim" aria-labelledby="rv-rs-tit">
        <h2 id="rv-rs-tit" className="tp-h">Resumo para levar</h2>
        {resumos.map((x, k) => <ResumoSubtemaView key={k} m={m} r={x} />)}
      </section>
    )}
    </>
  );
}

/** Correção sem resolução publicada: o gabarito oficial e, com honestidade, a resolução em preparação (auditoria A3). */
function SemResolucao({ q, marcada }: { q: Questao; marcada: Letra }) {
  const ok = marcada === q.gab;
  return (
    <section className={'resolucao ' + (ok ? 'ok' : 'err')} aria-labelledby="rv-sr-tit">
      <header className="res-cab">
        <span className={'res-selo ' + (ok ? 'ok' : 'err')}><Icone nome={ok ? 'check' : 'fechar'} tam={18} /></span>
        <div>
          <h2 id="rv-sr-tit">{ok ? 'Você acertou' : `Você marcou ${marcada}. A resposta é ${q.gab}.`}</h2>
          <p className="fraco">Gabarito oficial publicado · {q.escola} {q.ano}{q.n ? `, questão ${q.n}` : ''}</p>
        </div>
      </header>
      <p className="miolo rv-sr-p">A resolução comentada desta questão está em preparação: ela só entra no site depois de passar pela banca da matéria. Os slides deste conteúdo explicam a ideia que a questão cobra.</p>
    </section>
  );
}

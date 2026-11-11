import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import { carregaResolucoes, urlPrint, useMateria, useTodasMaterias, type MateriaCarregada } from '../dados/conteudo';
import { nomeMateria } from '../dados/materias';
import { comoQuestao, urlPrintProva, useProvaCompleta, type ProvaCompleta } from '../dados/provasCompletas';
import { atualiza, atualizaMateria, useEstado } from '../estado/loja';
import { planoDaProva, planoDoConteudo, type PlanoSimulado } from '../logica/simulados';
import { filtraRegiao } from '../logica/regiao';
import { useRegiao } from '../ui/FiltroRegiao';
import { Carregando, formataTempo, plural, useTitulo } from '../ui/comum';
import { Icone } from '../ui/Icone';
import { BotaoTelaCheia, Certeza, EnunciadoQuestao, RespostaCartao, mostraPainel, type Conf } from '../ui/QuestaoCartao';
import { ResolucaoView } from '../ui/Resolucao';
import { defineTelaCheia } from '../ui/telaCheia';
import type { Letra, MateriaId, Questao, Resolucao } from '../dados/tipos';
import type { ItemSimulado, SimuladoAndamento, SimuladoFeito } from '../estado/tipos';

/** Nome do grupo de um item no resultado: área da prova completa, ou a matéria. */
export function grupoDoItem(it: { m?: MateriaId; a?: string }): string { return it.a || (it.m ? nomeMateria(it.m) : 'Outras'); }

/** Questão de um item de simulado: da prova completa (p) ou do banco da matéria (m). */
export function questaoDoItem(it: ItemSimulado | undefined, prova: ProvaCompleta | null | undefined, todas: MateriaCarregada[] | null): { q: Questao; print: string | null } | undefined {
  if (!it) return undefined;
  if (it.p) {
    const qp = prova?.id === it.p ? prova.questoes.find((x) => x.id === it.id) : undefined;
    return qp && prova ? { q: comoQuestao(prova, qp), print: urlPrintProva(prova, qp) } : undefined;
  }
  const q = it.m && todas ? todas.find((x) => x.id === it.m)?.porId.get(it.id) : undefined;
  return q && it.m ? { q, print: urlPrint(it.m, q.id) } : undefined;
}

export function SimuladoNovo() {
  const { chave } = useParams();
  const prova = useProvaCompleta(chave ? decodeURIComponent(chave) : null);
  const plano = useMemo<PlanoSimulado | null>(() => (prova ? planoDaProva(prova) : null), [prova]);
  useTitulo(plano?.titulo || 'Simulado');
  if (prova === undefined) return <div className="conteudo"><Carregando /></div>;
  if (!plano) return <div className="conteudo vazio"><h3>Simulado não encontrado</h3><p>Os simulados são as provas completas. Escolha uma na lista.</p><Link className="btn sec" to="/simulados">Ver simulados</Link></div>;
  if (!plano.itens.length) return (
    <div className="conteudo estreito vazio">
      <h3>{plano.titulo}</h3>
      <p>Sem questões disponíveis para este simulado.</p>
      <Link className="btn sec" to="/simulados">Outros simulados</Link>
    </div>
  );

  return <ConfigSimulado plano={plano} nota={prova?.nota} />;
}

/** Tela de configuração (correção, cronômetro, começar): igual para prova inteira e simulado por conteúdo. */
function ConfigSimulado({ plano, nota, migalha }: { plano: PlanoSimulado; nota?: string; migalha?: string }) {
  const e = useEstado();
  const nav = useNavigate();
  const [modo, setModo] = useState<'prova' | 'treino'>('prova');
  const [cronometrado, setCron] = useState(true);
  const limite = cronometrado ? plano.itens.length * plano.segPorQuestao : null;
  const porGrupo = plano.itens.reduce<Record<string, number>>((a, x) => { const g = grupoDoItem(x); a[g] = (a[g] || 0) + 1; return a; }, {});

  const inicia = () => {
    const s: SimuladoAndamento = { sid: plano.sid, titulo: plano.titulo, modo, itens: plano.itens, resp: {}, marcadas: [], i: 0, limiteSeg: limite, usadoSeg: 0, iniciadoEm: Date.now(), pausado: false };
    atualiza((x) => ({ ...x, simulado: s }));
    nav('/simulado/agora');
  };

  return (
    <div className="conteudo estreito">
      <nav className="migalhas"><Link to={migalha ? '/simulados?aba=conteudo' : '/simulados'}>{migalha || 'Simulados'}</Link><Icone nome="direita" tam={14} /><span>{plano.titulo}</span></nav>
      <div className="titulo-pag"><div><h1>{plano.titulo}</h1><p className="sub">{plano.descricao}</p></div></div>
      <div className="sim-config folha">
        <div className="sc-linha"><span className="fraco">Questões</span><b className="num">{plano.itens.length}</b><span className="sc-mats">{Object.entries(porGrupo).map(([g, n]) => <span key={g}><i className="ponto" />{g} {n}</span>)}</span></div>
        {nota && <p className="fraco" style={{ fontSize: 14, margin: 0 }}>{nota}</p>}
        <fieldset className="sc-grupo">
          <legend>Correção</legend>
          <label className={'opcao' + (modo === 'prova' ? ' sel' : '')}><input type="radio" name="modo" checked={modo === 'prova'} onChange={() => setModo('prova')} /><span><b>Como na prova</b><small>Folha de respostas, pode pular e voltar; resultado e resoluções no fim.</small></span></label>
          <label className={'opcao' + (modo === 'treino' ? ' sel' : '')}><input type="radio" name="modo" checked={modo === 'treino'} onChange={() => setModo('treino')} /><span><b>Resolução após cada resposta</b><small>Responde, vê a resolução comentada e segue.</small></span></label>
        </fieldset>
        <label className="sc-tempo"><input type="checkbox" checked={cronometrado} onChange={(ev) => setCron(ev.target.checked)} />
          <span><b>Cronometrado</b><small className="num">{formataTempo(plano.itens.length * plano.segPorQuestao)} no total ({(Math.round(plano.segPorQuestao / 6) / 10).toLocaleString('pt-BR')} min por questão). Dá para pausar.</small></span></label>
        <button className="btn grande" onClick={inicia} disabled={!!e.simulado && e.simulado.sid !== plano.sid}>Começar simulado <Icone nome="direita" /></button>
        {e.simulado && <p className="fraco" style={{ fontSize: 14 }}>Você tem um simulado em andamento ({e.simulado.titulo}). <Link to="/simulado/agora">Retome</Link> ou encerre-o antes de começar outro.</p>}
      </div>
    </div>
  );
}

/** Simulado por conteúdo (pedido do dono, 11/11/2026): /simulados/conteudo?m=bio&c=B01.1,B01.2&n=20 */
export function SimuladoConteudo() {
  const [qs] = useSearchParams();
  const m = qs.get('m') as MateriaId | null;
  const subs = (qs.get('c') || '').split(',').filter(Boolean);
  const n = Math.max(1, Math.min(90, Number(qs.get('n')) || 20));
  const mc = useMateria(m);
  const e = useEstado();
  const rg = useRegiao();
  // sorteio feito uma vez ao abrir (recarregar a página sorteia de novo)
  const [plano, setPlano] = useState<PlanoSimulado | null>(null);
  useEffect(() => {
    if (!mc || !m || plano) return;
    const nomes = Object.fromEntries(mc.conteudo.modulos.flatMap((x) => x.subs).map((x) => [x.id, x.nome.charAt(0).toUpperCase() + x.nome.slice(1)]));
    const pool = filtraRegiao(mc.banco.filter((q) => subs.includes(q.sub)), rg.conj).l;
    const respondidas = new Set(Object.entries(e.materias[m]?.q || {}).filter(([, v]) => v.tent.length).map(([id]) => id));
    setPlano(planoDoConteudo(m, pool, subs, n, nomes, { respondidas }));
  }, [mc]); // eslint-disable-line react-hooks/exhaustive-deps
  useTitulo(plano?.titulo || 'Simulado por conteúdo');
  if (!m || !subs.length) return <div className="conteudo vazio"><h3>Escolha os conteúdos</h3><p>Monte o simulado escolhendo a matéria e os conteúdos.</p><Link className="btn sec" to="/simulados?aba=conteudo">Simulado por conteúdo</Link></div>;
  if (!plano) return <div className="conteudo"><Carregando /></div>;
  if (!plano.itens.length) return (
    <div className="conteudo estreito vazio">
      <h3>{plano.titulo}</h3>
      <p>Ainda não há questões de prova nestes conteúdos.</p>
      <Link className="btn sec" to="/simulados?aba=conteudo">Escolher outros conteúdos</Link>
    </div>
  );
  return <ConfigSimulado plano={plano} migalha="Simulado por conteúdo" />;
}

function finaliza(sim: SimuladoAndamento, todas: MateriaCarregada[], prova: ProvaCompleta | null | undefined): SimuladoFeito {
  const ts = Date.now();
  const itens: SimuladoFeito['itens'] = [];
  const porMateria: SimuladoFeito['porMateria'] = {};
  const porArea: NonNullable<SimuladoFeito['porArea']> = {};
  for (const it of sim.itens) {
    const qq = questaoDoItem(it, prova, todas);
    if (!qq) continue;
    const r = sim.resp[it.id];
    const ok = !!r && r.letra === qq.q.gab;
    itens.push({ m: it.m, id: it.id, letra: r?.letra || null, ok, p: it.p, a: it.a });
    const g = grupoDoItem(it);
    const pa = porArea[g] || { acertos: 0, total: 0 };
    pa.total++; if (ok) pa.acertos++;
    porArea[g] = pa;
    if (it.m && !it.p) {
      const pm = porMateria[it.m] || { acertos: 0, total: 0 };
      pm.total++; if (ok) pm.acertos++;
      porMateria[it.m] = pm;
    }
  }
  const acertos = itens.filter((x) => x.ok).length;
  // questões do banco por matéria: as tentativas entram na revisão espaçada (formato do protótipo)
  for (const [m, pm] of Object.entries(porMateria) as [MateriaId, { acertos: number; total: number }][]) {
    atualizaMateria(m, (s) => {
      const q = { ...s.q };
      for (const it of itens.filter((x) => x.m === m && !x.p && x.letra)) {
        const r = sim.resp[it.id];
        const eq = q[it.id] || { tent: [] };
        q[it.id] = { ...eq, tent: [...eq.tent, { letra: r.letra, ok: it.ok, ts: r.ts || ts, seg: r.seg, conf: r.conf, ctx: 'simulado' }] };
      }
      return { ...s, q, sims: [...s.sims, { nome: sim.titulo, acertos: pm.acertos, total: pm.total, seg: sim.usadoSeg, ts }] };
    });
  }
  return { sid: sim.sid, titulo: sim.titulo, modo: sim.modo, ts, seg: sim.usadoSeg, acertos, total: itens.length, porMateria, porArea, itens };
}

export function SimuladoExec() {
  const e = useEstado();
  const sim = e.simulado;
  const todas = useTodasMaterias();
  const nav = useNavigate();
  const [escolha, setEscolha] = useState<Letra | null>(null);
  const [conf, setConf] = useState<Conf | null>(null);
  const [riscadas, setRiscadas] = useState<Set<Letra>>(new Set());
  const [revelado, setRevelado] = useState(false);
  const [res, setRes] = useState<Record<string, Resolucao> | null>(null);
  const [confirmaFim, setConfirmaFim] = useState(false);
  const tQ = useRef(Date.now());
  useTitulo(sim?.titulo || 'Simulado');

  const it = sim?.itens[sim.i];
  const prova = useProvaCompleta(sim?.itens[0]?.p);
  const qq = questaoDoItem(it, prova, todas);
  const q = qq?.q;

  useEffect(() => {
    if (!sim || !it) return;
    const r = sim.resp[it.id];
    setEscolha(r?.letra || null); setConf(r?.conf || null); setRiscadas(new Set());
    setRevelado(sim.modo === 'treino' && !!r);
    tQ.current = Date.now();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sim?.i, sim?.sid]);
  useEffect(() => { if (q && it?.m && !it.p && sim?.modo === 'treino') carregaResolucoes(it.m, q.sub).then(setRes); }, [q, sim?.modo, it]);

  // relógio do simulado (conta enquanto não está pausado e a aba está visível)
  useEffect(() => {
    if (!sim || sim.pausado) return;
    const t = setInterval(() => {
      if (document.hidden) { atualiza((x) => (x.simulado ? { ...x, simulado: { ...x.simulado, pausado: true } } : x)); return; }
      atualiza((x) => (x.simulado ? { ...x, simulado: { ...x.simulado, usadoSeg: x.simulado.usadoSeg + 1 } } : x));
    }, 1000);
    return () => clearInterval(t);
  }, [sim?.pausado, sim?.sid, sim]);

  const termina = () => {
    if (!sim || !todas) return;
    const f = finaliza(sim, todas, prova);
    atualiza((x) => ({ ...x, simulado: null, simuladosFeitos: [...x.simuladosFeitos, f] }));
    nav(`/simulado/resultado/${f.ts}`, { replace: true });
  };

  useEffect(() => { if (sim?.limiteSeg && sim.usadoSeg >= sim.limiteSeg) termina(); });

  const grava = (l: Letra | null, c = conf) => {
    if (!sim || !it) return;
    setEscolha(l);
    atualiza((x) => {
      if (!x.simulado) return x;
      const resp = { ...x.simulado.resp };
      const seg = Math.round((Date.now() - tQ.current) / 1000) + (resp[it.id]?.seg || 0);
      if (l) resp[it.id] = { letra: l, seg, conf: c, ts: Date.now() } as SimuladoAndamento['resp'][string]; else delete resp[it.id];
      return { ...x, simulado: { ...x.simulado, resp } };
    });
    tQ.current = Date.now();
  };
  const vai = (i: number) => atualiza((x) => (x.simulado ? { ...x, simulado: { ...x.simulado, i: Math.max(0, Math.min(x.simulado.itens.length - 1, i)) } } : x));
  const pausa = (p: boolean) => atualiza((x) => (x.simulado ? { ...x, simulado: { ...x.simulado, pausado: p } } : x));
  const marca = () => atualiza((x) => { if (!x.simulado || !it) return x; const mk = x.simulado.marcadas.includes(it.id) ? x.simulado.marcadas.filter((y) => y !== it.id) : [...x.simulado.marcadas, it.id]; return { ...x, simulado: { ...x.simulado, marcadas: mk } }; });

  useEffect(() => {
    const f = (ev: KeyboardEvent) => {
      if (!sim || sim.pausado || confirmaFim) return;
      if ((ev.target as HTMLElement)?.tagName === 'INPUT') return;
      const k = ev.key.toUpperCase();
      if ('ABCDE'.includes(k) && k.length === 1 && !revelado && (!q || q.alts[k as Letra] !== undefined || !Object.keys(q.alts).length)) { if (ev.shiftKey) setRiscadas((r) => { const n = new Set(r); n.has(k as Letra) ? n.delete(k as Letra) : n.add(k as Letra); return n; }); else grava(k as Letra); }
      else if (ev.key === 'ArrowRight') vai(sim.i + 1);
      else if (ev.key === 'ArrowLeft') vai(sim.i - 1);
      else if (ev.key === 'Enter') { ev.preventDefault(); if (sim.modo === 'treino' && escolha && !revelado) setRevelado(true); else if (sim.i < sim.itens.length - 1) vai(sim.i + 1); else setConfirmaFim(true); }
      else if (k === 'P') pausa(true);
      else if (ev.key === 'Escape') defineTelaCheia(false);
    };
    addEventListener('keydown', f);
    return () => removeEventListener('keydown', f);
  });

  if (!sim) return <div className="conteudo vazio"><h3>Nenhum simulado em andamento</h3><Link className="btn sec" to="/simulados">Escolher um simulado</Link></div>;
  if (!todas || (sim.itens[0]?.p && prova === undefined)) return <div className="conteudo"><Carregando /></div>;

  const respondidas = Object.keys(sim.resp).length;
  const restante = sim.limiteSeg ? sim.limiteSeg - sim.usadoSeg : null;

  return (
    <div className="questao-tela simulado">
      <div className="q-barra">
        <button className="q-volta" onClick={() => nav('/simulados')} aria-label="Sair (o simulado fica salvo)" title="Sair (fica salvo)"><Icone nome="esquerda" /><span>Sair</span></button>
        <div className="q-barq">
          <span className="g" aria-hidden><Icone nome="arquivo" /></span>
          <span className="n">{sim.titulo}</span>
          <span className="t num"><span className="lg">Questão </span><b>{sim.i + 1}</b> de {sim.itens.length} · {respondidas} <span className="lg">respondidas</span><span className="cu">resp.</span></span>
          <span className="p" aria-hidden><i style={{ width: `${((sim.i + 1) / sim.itens.length) * 100}%` }} /></span>
        </div>
        <button className="btn sec peq folha-btn" onClick={() => mostraPainel()}><Icone nome="lista" tam={16} /><span>Folha de respostas</span></button>
        <button className={'crono num' + (restante !== null && restante < 300 ? ' alerta' : '')} onClick={() => pausa(true)} aria-label="Pausar simulado" title="Pausar (P)">
          <Icone nome="pausa" tam={15} />{restante !== null ? formataTempo(restante) : formataTempo(sim.usadoSeg)}
        </button>
        <button className="btn peq" onClick={() => setConfirmaFim(true)}>Entregar</button>
        <BotaoTelaCheia />
      </div>

      {sim.pausado ? (
        <div className="pausa-tela folha">
          <Icone nome="pausa" tam={28} />
          <h2>Simulado pausado</h2>
          <p className="miolo num">{restante !== null ? `Restam ${formataTempo(restante)}.` : `${formataTempo(sim.usadoSeg)} usados.`} As questões ficam escondidas até você voltar.</p>
          <button className="btn" onClick={() => pausa(false)}>Continuar <Icone nome="play" tam={16} /></button>
        </div>
      ) : q && it ? (
        <div className={'q-corpo' + (it.m ? ` m-${it.m}` : '')}>
          <div className={'q-grade' + (revelado ? ' respondida' : '')}>
            <article className="folha q-cartao">
              <EnunciadoQuestao q={q} print={qq?.print ?? null} numero={`${sim.i + 1} · ${grupoDoItem(it)}`}
                acao={<button className={'q-marca' + (sim.marcadas.includes(it.id) ? ' marcado' : '')} onClick={marca} aria-pressed={sim.marcadas.includes(it.id)} aria-label="Revisar depois" title={sim.marcadas.includes(it.id) ? 'Marcada para revisar' : 'Revisar depois'}><Icone nome="bandeira" /></button>} />
              <RespostaCartao q={q} escolha={escolha} aoEscolher={(l) => grava(l)} revelado={revelado} riscadas={riscadas}
                aoRiscar={(l) => setRiscadas((r) => { const n = new Set(r); n.has(l) ? n.delete(l) : n.add(l); return n; })} mostrarTexto={!!q.transcricao || !qq?.print}>
                {!revelado && <Certeza valor={conf} aoMudar={(c) => { setConf(c); if (escolha) grava(escolha, c); }} />}
                {escolha && !revelado && sim.modo === 'prova' && <button className="btn fantasma" onClick={() => grava(null)}>Apagar resposta</button>}
                {sim.modo === 'treino' && !revelado ? (
                  <button className="btn btn-conf" disabled={!escolha} onClick={() => setRevelado(true)}>Confirmar e ver resolução</button>
                ) : (
                  <>
                    <button className="q-ant" onClick={() => vai(sim.i - 1)} disabled={sim.i === 0} aria-label="Questão anterior" title="Anterior"><Icone nome="esquerda" /></button>
                    {sim.i < sim.itens.length - 1 ? <button className="btn btn-conf" onClick={() => vai(sim.i + 1)}>Próxima <Icone nome="direita" /></button> : <button className="btn btn-conf" onClick={() => setConfirmaFim(true)}>Entregar simulado</button>}
                  </>
                )}
              </RespostaCartao>
            </article>
            <aside className="folha q-lado" id="q-lado" aria-label="Folha de respostas">
              <h2 className="q-lado-tit">Folha de respostas</h2>
              <div className="q-lado-corpo" id="q-lado-corpo">
                  <div className="folha-resp">
                    {sim.itens.map((x, i) => {
                      const r = sim.resp[x.id];
                      return (
                        <button key={x.id} className={'fr-q' + (i === sim.i ? ' atual' : '') + (r ? ' resp' : '') + (sim.marcadas.includes(x.id) ? ' marc' : '') + (x.m ? ` m-${x.m}` : '')} onClick={() => vai(i)}
                          aria-label={`Questão ${i + 1}${r ? `, marcada ${r.letra}` : ', em branco'}${sim.marcadas.includes(x.id) ? ', para revisar' : ''}`}>
                          <span className="num">{i + 1}</span><b>{r?.letra || ''}</b>
                        </button>
                      );
                    })}
                    <p className="fraco fr-leg"><i className="fr-dot resp" /> respondida <i className="fr-dot marc" /> para revisar</p>
                  </div>
              </div>
            </aside>
          </div>
          {revelado && sim.modo === 'treino' && <ResolucaoView q={q} r={q.res || (res ? res[q.id] : undefined)} marcada={escolha} />}
        </div>
      ) : <Carregando />}

      {confirmaFim && (
        <div className="veu" onMouseDown={(ev) => { if (ev.target === ev.currentTarget) setConfirmaFim(false); }}>
          <div className="janela" role="alertdialog" aria-modal="true" aria-labelledby="fim-tit">
            <div className="cab"><h2 id="fim-tit">Entregar o simulado?</h2></div>
            <div className="corpo">
              <p className="miolo">{respondidas === sim.itens.length ? 'Todas as questões estão respondidas.' : `${plural(sim.itens.length - respondidas, 'questão está', 'questões estão')} em branco e ${sim.itens.length - respondidas === 1 ? 'conta' : 'contam'} como erro.`}{sim.marcadas.length ? ` Você marcou ${plural(sim.marcadas.length, 'questão', 'questões')} para revisar.` : ''}</p>
              <div className="fc-acoes" style={{ marginTop: 18 }}>
                <button className="btn sec" onClick={() => setConfirmaFim(false)} autoFocus>Voltar à prova</button>
                <button className="btn" onClick={termina}>Entregar e ver resultado</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

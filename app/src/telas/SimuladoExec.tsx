import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import { carregaResolucoes, urlPrint, useTodasMaterias, type MateriaCarregada } from '../dados/conteudo';
import { nomeMateria } from '../dados/materias';
import { atualiza, atualizaMateria, pegaEstado, useEstado } from '../estado/loja';
import { planoDoObjetivo, planoPorChave, type PlanoSimulado } from '../logica/simulados';
import { Carregando, formataTempo, plural, useTitulo } from '../ui/comum';
import { Icone } from '../ui/Icone';
import { Alternativas, Certeza, EnunciadoQuestao, type Conf } from '../ui/QuestaoCartao';
import { ResolucaoView } from '../ui/Resolucao';
import type { Letra, MateriaId, Resolucao } from '../dados/tipos';
import type { SimuladoAndamento, SimuladoFeito } from '../estado/tipos';

export function SimuladoNovo() {
  const { chave, obj } = useParams();
  const todas = useTodasMaterias();
  const e = useEstado();
  const nav = useNavigate();
  const [modo, setModo] = useState<'prova' | 'treino'>('prova');
  const [cronometrado, setCron] = useState(true);
  const plano = useMemo<PlanoSimulado | null>(() => {
    if (!todas) return null;
    return chave ? planoPorChave(decodeURIComponent(chave), todas) : obj ? planoDoObjetivo(obj, todas, pegaEstado()) : null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todas, chave, obj]);
  useTitulo(plano?.titulo || 'Simulado');
  if (!todas) return <div className="conteudo"><Carregando /></div>;
  if (!plano) return <div className="conteudo vazio"><h3>Simulado não encontrado</h3><Link className="btn sec" to="/simulados">Ver simulados</Link></div>;
  if (!plano.itens.length) return (
    <div className="conteudo estreito vazio">
      <h3>{plano.titulo}</h3>
      <p>{obj === 'erros' ? 'Você ainda não tem erros para refazer. Ótimo sinal, ou hora de fazer mais questões.' : obj === 'alvo' ? 'Suas provas-alvo ainda não têm questões no banco. Escolha outras no perfil ou faça um simulado por matéria.' : 'Sem questões disponíveis para este simulado hoje.'}</p>
      <Link className="btn sec" to="/simulados?aba=objetivo">Outros simulados</Link>
    </div>
  );

  const limite = cronometrado ? plano.itens.length * plano.segPorQuestao : null;
  const porMat = plano.itens.reduce<Record<string, number>>((a, x) => { a[x.m] = (a[x.m] || 0) + 1; return a; }, {});

  const inicia = () => {
    const s: SimuladoAndamento = { sid: plano.sid, titulo: plano.titulo, modo, itens: plano.itens, resp: {}, marcadas: [], i: 0, limiteSeg: limite, usadoSeg: 0, iniciadoEm: Date.now(), pausado: false };
    atualiza((x) => ({ ...x, simulado: s }));
    nav('/simulado/agora');
  };

  return (
    <div className="conteudo estreito">
      <nav className="migalhas"><Link to="/simulados">Simulados</Link><Icone nome="direita" tam={14} /><span>{plano.titulo}</span></nav>
      <div className="titulo-pag"><div><h1>{plano.titulo}</h1><p className="sub">{plano.descricao}</p></div></div>
      {plano.parcial && (
        <div className="aviso-banco">
          <Icone nome="info" tam={18} />
          <p>Este simulado cobre <b>{plural(plano.parcial.temos, 'questão', 'questões')}</b>{plano.parcial.oficiais ? ` das ${plano.parcial.oficiais} da prova oficial` : ' da prova original'} ({plano.parcial.materias.map(nomeMateria).join(', ')}). As demais matérias entram quando a prova completa for importada.</p>
        </div>
      )}
      <div className="sim-config folha">
        <div className="sc-linha"><span className="fraco">Questões</span><b className="num">{plano.itens.length}</b><span className="sc-mats">{Object.entries(porMat).map(([m, n]) => <span key={m} className={`m-${m}`}><i className="ponto" />{nomeMateria(m)} {n}</span>)}</span></div>
        <fieldset className="sc-grupo">
          <legend>Correção</legend>
          <label className={'opcao' + (modo === 'prova' ? ' sel' : '')}><input type="radio" name="modo" checked={modo === 'prova'} onChange={() => setModo('prova')} /><span><b>Como na prova</b><small>Folha de respostas, pode pular e voltar; resultado e resoluções no fim.</small></span></label>
          <label className={'opcao' + (modo === 'treino' ? ' sel' : '')}><input type="radio" name="modo" checked={modo === 'treino'} onChange={() => setModo('treino')} /><span><b>Resolução após cada resposta</b><small>Responde, vê a resolução comentada e segue.</small></span></label>
        </fieldset>
        <label className="sc-tempo"><input type="checkbox" checked={cronometrado} onChange={(ev) => setCron(ev.target.checked)} />
          <span><b>Cronometrado</b><small className="num">{formataTempo(plano.itens.length * plano.segPorQuestao)} no total ({(Math.round(plano.segPorQuestao / 6) / 10).toLocaleString('pt-BR')} min por questão{plano.parcial?.oficiais ? ', o ritmo da prova oficial' : ''}). Dá para pausar.</small></span></label>
        <button className="btn grande" onClick={inicia} disabled={!!e.simulado && e.simulado.sid !== plano.sid}>Começar simulado <Icone nome="direita" /></button>
        {e.simulado && <p className="fraco" style={{ fontSize: 14 }}>Você tem um simulado em andamento ({e.simulado.titulo}). <Link to="/simulado/agora">Retome</Link> ou encerre-o antes de começar outro.</p>}
      </div>
    </div>
  );
}

function finaliza(sim: SimuladoAndamento, todas: MateriaCarregada[]): SimuladoFeito {
  const ts = Date.now();
  const itens: SimuladoFeito['itens'] = [];
  const porMateria: SimuladoFeito['porMateria'] = {};
  for (const it of sim.itens) {
    const q = todas.find((x) => x.id === it.m)?.porId.get(it.id);
    if (!q) continue;
    const r = sim.resp[it.id];
    const ok = !!r && r.letra === q.gab;
    itens.push({ m: it.m, id: it.id, letra: r?.letra || null, ok });
    const pm = porMateria[it.m] || { acertos: 0, total: 0 };
    pm.total++; if (ok) pm.acertos++;
    porMateria[it.m] = pm;
  }
  const acertos = itens.filter((x) => x.ok).length;
  // grava as tentativas (entram na revisão espaçada) e o resumo por matéria (formato do protótipo)
  for (const [m, pm] of Object.entries(porMateria) as [MateriaId, { acertos: number; total: number }][]) {
    atualizaMateria(m, (s) => {
      const q = { ...s.q };
      for (const it of itens.filter((x) => x.m === m && x.letra)) {
        const r = sim.resp[it.id];
        const eq = q[it.id] || { tent: [] };
        q[it.id] = { ...eq, tent: [...eq.tent, { letra: r.letra, ok: it.ok, ts: r.ts || ts, seg: r.seg, conf: r.conf, ctx: 'simulado' }] };
      }
      return { ...s, q, sims: [...s.sims, { nome: sim.titulo, acertos: pm.acertos, total: pm.total, seg: sim.usadoSeg, ts }] };
    });
  }
  return { sid: sim.sid, titulo: sim.titulo, modo: sim.modo, ts, seg: sim.usadoSeg, acertos, total: itens.length, porMateria, itens };
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
  const [folhaAberta, setFolha] = useState(false);
  const [confirmaFim, setConfirmaFim] = useState(false);
  const tQ = useRef(Date.now());
  useTitulo(sim?.titulo || 'Simulado');

  const it = sim?.itens[sim.i];
  const q = it && todas ? todas.find((x) => x.id === it.m)?.porId.get(it.id) : undefined;

  useEffect(() => {
    if (!sim || !it) return;
    const r = sim.resp[it.id];
    setEscolha(r?.letra || null); setConf(r?.conf || null); setRiscadas(new Set());
    setRevelado(sim.modo === 'treino' && !!r);
    tQ.current = Date.now();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sim?.i, sim?.sid]);
  useEffect(() => { if (q && sim?.modo === 'treino') carregaResolucoes(it!.m, q.sub).then(setRes); }, [q, sim?.modo, it]);

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
    const f = finaliza(sim, todas);
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
      if ('ABCDE'.includes(k) && k.length === 1 && !revelado) { if (ev.shiftKey) setRiscadas((r) => { const n = new Set(r); n.has(k as Letra) ? n.delete(k as Letra) : n.add(k as Letra); return n; }); else grava(k as Letra); }
      else if (ev.key === 'ArrowRight') vai(sim.i + 1);
      else if (ev.key === 'ArrowLeft') vai(sim.i - 1);
      else if (ev.key === 'Enter') { ev.preventDefault(); if (sim.modo === 'treino' && escolha && !revelado) setRevelado(true); else if (sim.i < sim.itens.length - 1) vai(sim.i + 1); else setConfirmaFim(true); }
      else if (k === 'P') pausa(true);
    };
    addEventListener('keydown', f);
    return () => removeEventListener('keydown', f);
  });

  if (!sim) return <div className="conteudo vazio"><h3>Nenhum simulado em andamento</h3><Link className="btn sec" to="/simulados">Escolher um simulado</Link></div>;
  if (!todas) return <div className="conteudo"><Carregando /></div>;

  const respondidas = Object.keys(sim.resp).length;
  const restante = sim.limiteSeg ? sim.limiteSeg - sim.usadoSeg : null;

  return (
    <div className="questao-tela simulado">
      <div className="q-barra">
        <button className="btn-ic" onClick={() => nav('/simulados')} aria-label="Sair (o simulado fica salvo)" title="Sair (fica salvo)"><Icone nome="fechar" /></button>
        <div className="q-barra-txt"><b>{sim.titulo}</b><span className="fraco num">Questão {sim.i + 1} de {sim.itens.length} · {respondidas} respondidas</span></div>
        <button className="btn sec peq folha-btn" onClick={() => setFolha(!folhaAberta)} aria-expanded={folhaAberta}><Icone nome="lista" tam={16} /> Folha de respostas</button>
        <button className={'crono num' + (restante !== null && restante < 300 ? ' alerta' : '')} onClick={() => pausa(true)} aria-label="Pausar simulado" title="Pausar (P)">
          <Icone nome="pausa" tam={15} />{restante !== null ? formataTempo(restante) : formataTempo(sim.usadoSeg)}
        </button>
        <button className="btn peq" onClick={() => setConfirmaFim(true)}>Entregar</button>
      </div>

      {folhaAberta && (
        <div className="folha-resp folha" aria-label="Folha de respostas">
          {sim.itens.map((x, i) => {
            const r = sim.resp[x.id];
            return (
              <button key={x.id} className={'fr-q' + (i === sim.i ? ' atual' : '') + (r ? ' resp' : '') + (sim.marcadas.includes(x.id) ? ' marc' : '') + ` m-${x.m}`} onClick={() => { vai(i); setFolha(false); }}
                aria-label={`Questão ${i + 1}${r ? `, marcada ${r.letra}` : ', em branco'}${sim.marcadas.includes(x.id) ? ', para revisar' : ''}`}>
                <span className="num">{i + 1}</span><b>{r?.letra || ''}</b>
              </button>
            );
          })}
          <p className="fraco fr-leg"><i className="fr-dot resp" /> respondida <i className="fr-dot marc" /> para revisar</p>
        </div>
      )}

      {sim.pausado ? (
        <div className="pausa-tela folha">
          <Icone nome="pausa" tam={28} />
          <h2>Simulado pausado</h2>
          <p className="miolo num">{restante !== null ? `Restam ${formataTempo(restante)}.` : `${formataTempo(sim.usadoSeg)} usados.`} As questões ficam escondidas até você voltar.</p>
          <button className="btn" onClick={() => pausa(false)}>Continuar <Icone nome="play" tam={16} /></button>
        </div>
      ) : q && it ? (
        <div className={`q-corpo m-${it.m}`}>
          <div className="q-duas">
<article className="folha q-cartao">
            <EnunciadoQuestao m={it.m} q={q} numero={`${sim.i + 1} · ${nomeMateria(it.m)}`} /></article>
<aside className={'folha q-painel' + (revelado ? ' revelado' : '')} aria-label="Resposta">
            <Alternativas q={q} escolhida={escolha} aoEscolher={(l) => grava(l)} revelado={revelado} riscadas={riscadas}
              aoRiscar={(l) => setRiscadas((r) => { const n = new Set(r); n.has(l) ? n.delete(l) : n.add(l); return n; })} mostrarTexto={!urlPrint(it.m, q.id)} />
            {!revelado && <Certeza valor={conf} aoMudar={(c) => { setConf(c); if (escolha) grava(escolha, c); }} />}
            <div className="q-acoes">
              <button className={'btn fantasma' + (sim.marcadas.includes(it.id) ? ' marcado' : '')} onClick={marca} aria-pressed={sim.marcadas.includes(it.id)}><Icone nome="bandeira" /> {sim.marcadas.includes(it.id) ? 'Marcada para revisar' : 'Revisar depois'}</button>
              {escolha && !revelado && sim.modo === 'prova' && <button className="btn fantasma" onClick={() => grava(null)}>Apagar resposta</button>}
              <span style={{ flex: 1 }} />
              {sim.modo === 'treino' && !revelado ? (
                <button className="btn" disabled={!escolha} onClick={() => setRevelado(true)}>Confirmar e ver resolução</button>
              ) : (
                <>
                  <button className="btn sec" onClick={() => vai(sim.i - 1)} disabled={sim.i === 0}><Icone nome="esquerda" /><span className="sr">Anterior</span></button>
                  {sim.i < sim.itens.length - 1 ? <button className="btn" onClick={() => vai(sim.i + 1)}>Próxima <Icone nome="direita" /></button> : <button className="btn" onClick={() => setConfirmaFim(true)}>Entregar simulado</button>}
                </>
              )}
            </div>
          </aside>
          </div>
          {revelado && sim.modo === 'treino' && <ResolucaoView q={q} r={res ? res[q.id] : undefined} marcada={escolha} />}
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

import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useMateria, useResolucoes } from '../dados/conteudo';
import { materia as infoMateria } from '../dados/materias';
import { atualizaMateria, pegaEstado, useMateriaEstado } from '../estado/loja';
import { questoesVencidas } from '../logica/estatisticas';
import { filaDe, emDias } from '../logica/revisao';
import { ehNivel, nivelDe, nomeNivel } from '../logica/nivel';
import { Carregando, cap, formataTempo, useTitulo } from '../ui/comum';
import { IcTema } from '../ui/IconeTema';
import { Icone, type NomeIcone } from '../ui/Icone';
import { AbasPainel, BotaoTelaCheia, Certeza, EnunciadoQuestao, FonteQuestao, RespostaCartao, mostraPainel, useCronometro, type AbaPainel, type Conf } from '../ui/QuestaoCartao';
import { CartaoTeoriaView } from './Tema';
import { defineTelaCheia, useTelaCheia } from '../ui/telaCheia';
import { ResolucaoView } from '../ui/Resolucao';
import { urlPrint } from '../dados/conteudo';
import type { Letra, MateriaId, Questao } from '../dados/tipos';
import type { Tentativa } from '../estado/tipos';

export function registraTentativa(m: MateriaId, id: string, t: Tentativa) {
  atualizaMateria(m, (s) => {
    const eq = s.q[id] || { tent: [] };
    return { ...s, q: { ...s.q, [id]: { ...eq, tent: [...eq.tent, t] } }, ult: id };
  });
}

export function alternaMarcada(m: MateriaId, id: string) {
  atualizaMateria(m, (s) => {
    const eq = s.q[id] || { tent: [] };
    return { ...s, q: { ...s.q, [id]: { ...eq, rev: !eq.rev } } };
  });
}

/** Responde a uma questão: escolha, certeza, pista, confirmação e resolução. Usada no conteúdo (evolução ou um nível) e na revisão. */
export function QuestaoTela() {
  const { m, id } = useParams() as { m: MateriaId; id: string };
  const [qs] = useSearchParams();
  const ctx = qs.get('ctx') || 'escada';
  const nvParam = qs.get('nv');
  const nv = ctx === 'nivel' && ehNivel(nvParam) ? nvParam : null;
  const nav = useNavigate();
  const mc = useMateria(m);
  const s = useMateriaEstado(m);
  const q = mc?.porId.get(id);
  const res = useResolucoes(m, q?.sub);
  const [escolha, setEscolha] = useState<Letra | null>(null);
  const [conf, setConf] = useState<Conf | null>(null);
  const [revelado, setRevelado] = useState(false);
  const [pista, setPista] = useState(false);
  const [riscadas, setRiscadas] = useState<Set<Letra>>(new Set());
  const [aba, setAba] = useState<AbaPainel>('res');
  const crono = useCronometro(!revelado, id);
  // tempo total da sessão (barra da questão): soma das questões já feitas nesta tela + a atual
  const acum = useRef(0);
  const cronoRef = useRef(crono);
  cronoRef.current = crono;
  useEffect(() => () => { acum.current += cronoRef.current.total(); }, [id]);
  const telaCheia = useTelaCheia();
  useTitulo(q ? `${q.escola} ${q.ano}` : 'Questão');

  // a fila da revisão é fixada ao abrir (responder não muda a ordem no meio da sessão)
  const fila = useMemo<Questao[]>(() => {
    if (!mc || !q) return [];
    if (ctx === 'revisao') { const v = questoesVencidas(mc, pegaEstado().materias[m] || s); return v.some((x) => x.id === q.id) ? v : [q, ...v]; }
    const l = mc.porSub.get(q.sub) || [q];
    return nv ? l.filter((x) => nivelDe(x.dif) === nv) : l;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mc, q?.sub, ctx, nv]);

  useEffect(() => { setEscolha(null); setConf(null); setRevelado(false); setPista(false); setRiscadas(new Set()); setAba('res'); }, [id]);

  const pos = fila.findIndex((x) => x.id === id);
  const prox = pos >= 0 ? fila[pos + 1] : undefined;
  const ant = pos > 0 ? fila[pos - 1] : undefined;
  const voltarPara = ctx === 'revisao' ? '/revisao' : q ? `/m/${m}/escada/${q.sub}` : `/m/${m}`;

  const confirma = () => {
    if (!q || !escolha || revelado) return;
    registraTentativa(m, q.id, { letra: escolha, ok: escolha === q.gab, ts: Date.now(), seg: crono.total(), conf, dica: pista ? 1 : 0, ctx });
    setRevelado(true);
    setAba('res');
    requestAnimationFrame(() => mostraPainel(true));
  };
  const vaiPara = (x?: Questao) => { if (x) nav(`/m/${m}/q/${x.id}?ctx=${ctx}${nv ? `&nv=${nv}` : ''}`, { replace: true }); else nav(voltarPara); };

  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      const alvo = e.target as HTMLElement;
      if (alvo && (alvo.tagName === 'INPUT' || alvo.tagName === 'TEXTAREA') || e.ctrlKey || e.metaKey || e.altKey) return;
      const k = e.key.toUpperCase();
      const mapa: Record<string, Letra> = { '1': 'A', '2': 'B', '3': 'C', '4': 'D', '5': 'E' };
      const l = (['A', 'B', 'C', 'D', 'E'].includes(k) ? k : mapa[k]) as Letra | undefined;
      if (l && !revelado) {
        e.preventDefault();
        if (e.shiftKey) setRiscadas((r) => { const n = new Set(r); n.has(l) ? n.delete(l) : n.add(l); return n; });
        else setEscolha(l);
      } else if (e.key === 'Enter') { e.preventDefault(); revelado ? vaiPara(prox) : confirma(); }
      else if (k === 'H' && !revelado) { setPista(true); setAba('res'); }
      else if (k === 'P' && !revelado) crono.alterna();
      else if (e.key === 'ArrowRight' && revelado) vaiPara(prox);
      else if (e.key === 'Escape') { if (telaCheia) defineTelaCheia(false); else nav(voltarPara); }
    };
    addEventListener('keydown', f);
    return () => removeEventListener('keydown', f);
  });

  if (!mc) return <div className="conteudo"><Carregando /></div>;
  if (!q) return <div className="conteudo vazio"><h3>Questão não encontrada</h3><Link to={`/m/${m}`} className="btn sec">Voltar</Link></div>;

  const mod = mc.conteudo.modulos.find((x) => x.id === q.modulo);
  const sub = mod?.subs.find((x) => x.id === q.sub);
  const r = res?.[q.id];
  const textoPista = q.pista || r?.pista;
  const eq = s.q[q.id];
  const anteriores = (eq?.tent.length || 0) - (revelado ? 1 : 0);
  const f = filaDe(eq);

  const nomeMat = infoMateria(m)?.nome || '';
  const totalSeg = acum.current + crono.seg;
  const cartoesTeoria = (() => { const l = mod?.cartoes.filter((c) => c.sub === q.sub) || []; return l.length ? l : mod?.cartoes || []; })();
  const relacionados = (mod?.subs || []).filter((x) => x.id !== q.sub && mc.porSub.get(x.id)?.length).slice(0, 4);
  const pedeDica = () => { setPista(true); setAba('res'); requestAnimationFrame(() => mostraPainel()); };

  return (
    <div className={`questao-tela m-${m}`}>
      <div className="q-barra">
        <button className="q-volta" onClick={() => nav(voltarPara)} aria-label="Voltar" title="Voltar (Esc)"><Icone nome="esquerda" /><span>Voltar</span></button>
        <div className="q-barq">
          <span className="g" aria-hidden><Icone nome={`m_${m}` as NomeIcone} /></span>
          <span className="n">{ctx === 'revisao' ? 'Revisão' : nomeMat}</span>
          <span className="t num"><b>{cap(mod?.nome || sub?.nome || '')}</b>{nv ? ` · ${nomeNivel(nv)}` : ctx !== 'revisao' ? ` · ${nomeNivel(nivelDe(q.dif))}` : ''} · <b>{pos + 1}</b> de {fila.length}</span>
          <span className="p" aria-hidden><i style={{ width: `${fila.length ? ((pos + 1) / fila.length) * 100 : 0}%` }} /></span>
        </div>
        <span className="q-ajuda" role="img" tabIndex={0} title={TECLAS} aria-label={TECLAS}><Icone nome="teclado" /></span>
        <span className="crono-tot num" title="Tempo total desta sessão"><small>Total</small> {formataTempo(totalSeg)}</span>
        <span className={'crono num' + (crono.pausado ? ' pausado' : '')}><small>Questão</small> {formataTempo(crono.seg)}</span>
        <button className={'q-pausa' + (crono.pausado ? ' pausado' : '')} onClick={crono.alterna} disabled={revelado} aria-label={crono.pausado ? 'Retomar' : 'Pausar'} title={crono.pausado ? 'Retomar (P)' : 'Pausar (P)'}>
          <Icone nome={crono.pausado ? 'play' : 'pausa'} />
        </button>
        <BotaoTelaCheia />
      </div>

      {crono.pausado && !revelado ? (
        <div className="pausa-tela folha">
          <Icone nome="pausa" tam={28} />
          <h2>Pausado</h2>
          <p className="miolo">O cronômetro parou. A questão fica escondida até você voltar.</p>
          <button className="btn" onClick={crono.alterna}>Continuar <Icone nome="play" tam={16} /></button>
        </div>
      ) : (
        <div className={'q-grade' + (revelado ? ' respondida' : '')}>
          <article className="folha q-cartao">
            <EnunciadoQuestao m={m} q={q}
              antes={<span className={`etq cor nivel n-${nivelDe(q.dif)}`}>{nomeNivel(nivelDe(q.dif))}</span>}
              depois={sub && <span className="etq q-sub" title={cap(sub.nome)}>{cap(sub.nome)}</span>}
              acao={<button className={'q-marca' + (eq?.rev ? ' marcado' : '')} onClick={() => alternaMarcada(m, q.id)} aria-pressed={!!eq?.rev} aria-label="Revisar depois" title="Revisar depois"><Icone nome="marcador" /></button>} />
            <RespostaCartao q={q} escolha={escolha} aoEscolher={setEscolha} revelado={revelado} riscadas={riscadas}
              aoRiscar={(l) => setRiscadas((rr) => { const n = new Set(rr); n.has(l) ? n.delete(l) : n.add(l); return n; })}
              mostrarTexto={!urlPrint(m, q.id)}>
              {!revelado ? (
                <>
                  <Certeza valor={conf} aoMudar={setConf} />
                  {textoPista && <button className="q-dica" onClick={pedeDica} disabled={pista} title="Dica (H)"><Icone nome="lampada" /> Dica</button>}
                  <button className="btn btn-conf" onClick={confirma} disabled={!escolha}>Confirmar resposta</button>
                </>
              ) : (
                <>
                  {ant && <button className="q-ant" onClick={() => vaiPara(ant)} aria-label="Questão anterior" title="Anterior"><Icone nome="esquerda" /></button>}
                  <button className="btn btn-conf" onClick={() => vaiPara(prox)}>{prox ? <>Próxima questão <Icone nome="direita" /></> : 'Concluir'}</button>
                </>
              )}
            </RespostaCartao>
          </article>

          <aside className="folha q-lado" id="q-lado" aria-label="Resolução, teoria e fonte">
            <AbasPainel aba={aba} aoMudar={setAba} />
            <div className="q-lado-corpo" id="q-lado-corpo">
              {aba === 'res' && (revelado ? (
                <>
                  <ResolucaoView q={q} r={res ? r : undefined} marcada={escolha} />
                  <div className="q-lado-fim">
                    {ant ? <button className="btn sec" onClick={() => vaiPara(ant)}><Icone nome="esquerda" /> Anterior</button> : <span />}
                    <button className="btn" onClick={() => vaiPara(prox)}>{prox ? <>Próxima questão <Icone nome="direita" /></> : 'Concluir'}</button>
                  </div>
                </>
              ) : (
                <>
                  {anteriores > 0 && (
                    <p className="q-antes fraco"><Icone nome="repetir" tam={15} /> Você já respondeu esta questão {anteriores === 1 ? 'uma vez' : `${anteriores} vezes`}{f ? `; revisão ${emDias(f.vence)}` : ''}.</p>
                  )}
                  <div className="q-trava"><Icone nome="lampada" /><div><b>A resolução abre quando você confirmar</b><p>Marque uma alternativa e confirme. Se travar, peça uma dica: ela mostra o caminho sem entregar a resposta.</p></div></div>
                  {pista && textoPista && <div className="pista"><Icone nome="lampada" tam={18} /><p>{textoPista}</p></div>}
                </>
              ))}
              {aba === 'teo' && (
                <div className="q-teoria">
                  <p className="q-teo-rot"><IcTema m={m} tema={q.modulo} tam={34} /><span>Teoria desta questão · <b>{cap(sub?.nome || mod?.nome || '')}</b></span></p>
                  {cartoesTeoria.length ? cartoesTeoria.map((c, i) => <CartaoTeoriaView key={i} c={c} />) : <p className="miolo">A teoria deste conteúdo está em preparação.</p>}
                </div>
              )}
              {aba === 'fon' && <FonteQuestao q={q} />}
              {relacionados.length > 0 && (
                <nav className="q-rel" aria-label="Conteúdos relacionados">
                  <h3>Conteúdos relacionados</h3>
                  <div className="q-rel-g">
                    {relacionados.map((x) => (
                      <Link key={x.id} to={`/m/${m}/escada/${x.id}`}><span>{cap(x.nome)}</span></Link>
                    ))}
                  </div>
                </nav>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

const TECLAS = 'Teclado: A–E escolhe · Shift + letra risca · Enter confirma e avança · H dica · P pausa · Esc volta';

import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useMateria, useResolucoes } from '../dados/conteudo';
import { materia as infoMateria } from '../dados/materias';
import { atualizaMateria, pegaEstado, useMateriaEstado } from '../estado/loja';
import { questoesVencidas } from '../logica/estatisticas';
import { filaDe, emDias } from '../logica/revisao';
import { Carregando, cap, formataTempo, useTitulo } from '../ui/comum';
import { Icone } from '../ui/Icone';
import { Alternativas, Certeza, EnunciadoQuestao, useCronometro, type Conf } from '../ui/QuestaoCartao';
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

/** Responde a uma questão: escolha, certeza, pista, confirmação e resolução. Usada na escada e na revisão. */
export function QuestaoTela() {
  const { m, id } = useParams() as { m: MateriaId; id: string };
  const [qs] = useSearchParams();
  const ctx = qs.get('ctx') || 'escada';
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
  const crono = useCronometro(!revelado, id);
  useTitulo(q ? `${q.escola} ${q.ano}` : 'Questão');

  // a fila da revisão é fixada ao abrir (responder não muda a ordem no meio da sessão)
  const fila = useMemo<Questao[]>(() => {
    if (!mc || !q) return [];
    if (ctx === 'revisao') { const v = questoesVencidas(mc, pegaEstado().materias[m] || s); return v.some((x) => x.id === q.id) ? v : [q, ...v]; }
    return mc.porSub.get(q.sub) || [q];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mc, q?.sub, ctx]);

  useEffect(() => { setEscolha(null); setConf(null); setRevelado(false); setPista(false); setRiscadas(new Set()); }, [id]);

  const pos = fila.findIndex((x) => x.id === id);
  const prox = pos >= 0 ? fila[pos + 1] : undefined;
  const ant = pos > 0 ? fila[pos - 1] : undefined;
  const voltarPara = ctx === 'revisao' ? '/revisao' : q ? `/m/${m}/escada/${q.sub}` : `/m/${m}`;

  const confirma = () => {
    if (!q || !escolha || revelado) return;
    registraTentativa(m, q.id, { letra: escolha, ok: escolha === q.gab, ts: Date.now(), seg: crono.total(), conf, dica: pista ? 1 : 0, ctx });
    setRevelado(true);
    requestAnimationFrame(() => document.getElementById('res-tit')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };
  const vaiPara = (x?: Questao) => { if (x) nav(`/m/${m}/q/${x.id}?ctx=${ctx}`, { replace: true }); else nav(voltarPara); };

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
      else if (k === 'H' && !revelado) setPista(true);
      else if (k === 'P' && !revelado) crono.alterna();
      else if (e.key === 'ArrowRight' && revelado) vaiPara(prox);
      else if (e.key === 'Escape') nav(voltarPara);
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

  return (
    <div className={`questao-tela m-${m}`}>
      <div className="q-barra">
        <button className="btn-ic" onClick={() => nav(voltarPara)} aria-label="Sair da questão" title="Sair (Esc)"><Icone nome="fechar" /></button>
        <div className="q-barra-txt">
          <b>{ctx === 'revisao' ? 'Revisão espaçada' : cap(sub?.nome || '')}</b>
          <span className="fraco num">{infoMateria(m)?.nome} · {ctx === 'revisao' ? 'questão' : 'degrau'} {pos + 1} de {fila.length}</span>
        </div>
        <div className="q-progresso" aria-hidden>{fila.slice(0, 24).map((x, i) => {
          const t = s.q[x.id]?.tent; const u = t?.[t.length - 1];
          return <i key={x.id} className={(i === pos ? 'atual ' : '') + (u && (ctx !== 'revisao' || u.ts > Date.now() - 6 * 36e5) ? (u.ok ? 'ok' : 'err') : '')} />;
        })}</div>
        <button className={'crono num' + (crono.pausado ? ' pausado' : '')} onClick={crono.alterna} disabled={revelado} aria-label={crono.pausado ? 'Retomar cronômetro' : 'Pausar cronômetro'} title="Pausar (P)">
          <Icone nome={crono.pausado ? 'play' : 'pausa'} tam={15} />{formataTempo(crono.seg)}
        </button>
        <button className={'btn-ic' + (eq?.rev ? ' marcado' : '')} onClick={() => alternaMarcada(m, q.id)} aria-pressed={!!eq?.rev} aria-label="Marcar para revisar" title="Marcar para revisar">
          <Icone nome="marcador" />
        </button>
      </div>

      {crono.pausado && !revelado ? (
        <div className="pausa-tela folha">
          <Icone nome="pausa" tam={28} />
          <h2>Pausado</h2>
          <p className="miolo">O cronômetro parou. A questão fica escondida até você voltar.</p>
          <button className="btn" onClick={crono.alterna}>Continuar <Icone nome="play" tam={16} /></button>
        </div>
      ) : (
        <div className="q-corpo">
          <div className="q-duas">
<article className="folha q-cartao">
            <EnunciadoQuestao m={m} q={q} /></article>
<aside className={'folha q-painel' + (revelado ? ' revelado' : '')} aria-label="Resposta">
            {anteriores > 0 && !revelado && (
              <p className="q-antes fraco"><Icone nome="repetir" tam={15} /> Você já respondeu esta questão {anteriores === 1 ? 'uma vez' : `${anteriores} vezes`}{f ? `; revisão ${emDias(f.vence)}` : ''}.</p>
            )}
            <Alternativas q={q} escolhida={escolha} aoEscolher={setEscolha} revelado={revelado} riscadas={riscadas}
              aoRiscar={(l) => setRiscadas((rr) => { const n = new Set(rr); n.has(l) ? n.delete(l) : n.add(l); return n; })}
              mostrarTexto={!urlPrint(m, q.id)} />
            {!revelado && (
              <>
                <Certeza valor={conf} aoMudar={setConf} />
                {pista && textoPista && <div className="pista"><Icone nome="lampada" tam={18} /><p>{textoPista}</p></div>}
                <div className="q-acoes">
                  {textoPista && !pista && <button className="btn fantasma" onClick={() => setPista(true)} title="Pista (H)"><Icone nome="lampada" /> Pista</button>}
                  <span className="q-dica-tecla fraco">A–E escolhe · Shift+letra risca · Enter confirma</span>
                  <button className="btn" onClick={confirma} disabled={!escolha}>Confirmar resposta</button>
                </div>
              </>
            )}
          </aside>
          </div>

          {revelado && (
            <>
              <ResolucaoView q={q} r={res ? r : undefined} marcada={escolha} />
              <div className="q-nav">
                {ant ? <button className="btn sec" onClick={() => vaiPara(ant)}><Icone nome="esquerda" /> Anterior</button> : <span />}
                <button className="btn" onClick={() => vaiPara(prox)} >{prox ? <>Próximo degrau <Icone nome="direita" /></> : 'Concluir'}</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

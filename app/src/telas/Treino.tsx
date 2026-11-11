import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { EH_PREVIA, urlPrint, useMateria, useQuestaoComTexto, useResolucoes, type MateriaCarregada } from '../dados/conteudo';
import { materia as infoMateria } from '../dados/materias';
import { atualiza, pegaEstado, useEstado } from '../estado/loja';
import { feitaHoje } from '../logica/revisao';
import { RODADA, composicaoRodada } from '../logica/rodadaTreino';
import { Carregando, cap, useTitulo } from '../ui/comum';
import { Icone, type NomeIcone } from '../ui/Icone';
import { AbasPainel, BotaoTelaCheia, Certeza, EnunciadoQuestao, FonteQuestao, RespostaCartao, mostraPainel, useCronometro, type AbaPainel, type Conf } from '../ui/QuestaoCartao';
import { CartaoTeoriaView } from './Tema';
import { ResolucaoView } from '../ui/Resolucao';
import { CompletarView, FlashcardView, type Nota } from '../ui/Cartoes';
import { registraTentativa } from './Questao';
import { notaFlash } from './Flashcards';
import type { Letra, MateriaId, Questao } from '../dados/tipos';
import type { SessaoTreino } from '../estado/tipos';
import { FiltroRegiaoChips, regiaoDoEstado } from '../ui/FiltroRegiao';
import { questoesTreinoGeral } from '../logica/regiao';

function embaralha<T>(l: T[]): T[] { const a = [...l]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

/** Monta o treino geral: 6 questões reais do "essencial", 5 flashcards (no máximo 2 com imagem) e 4 frases, intercalados.
 *  Matéria sem flashcards ou frases aprovados completa a rodada com mais questões reais (logica/rodadaTreino.ts); as
 *  questões não respondidas hoje vêm primeiro e, se faltarem, entram as já respondidas hoje. */
export function montaTreino(mc: MateriaCarregada): SessaoTreino {
  const est = pegaEstado().materias[mc.id];
  const gosto = (id: string) => est?.flg[id]?.g !== -1;
  // pedido do dono (09/11/2026): as questões reais vêm da região do aluno (+ ENEM), com reserva (logica/regiao.ts)
  const abc = questoesTreinoGeral(mc.conteudo.essencial.abc, mc.banco, regiaoDoEstado(pegaEstado()).conj)
    .filter((id) => mc.porId.has(id) && (!EH_PREVIA || !!urlPrint(mc.id, id)));
  const comImg = embaralha(mc.conteudo.flashImg.filter((c) => gosto(c.id) && !EH_PREVIA)).slice(0, 2);
  const fs = [...comImg, ...embaralha(mc.conteudo.flash.filter((c) => gosto(c.id)))].slice(0, RODADA.f);
  const cz = embaralha(mc.conteudo.essencial.completar.filter((c) => gosto(c.id) && c.frase.split('___').length === 2)).slice(0, RODADA.c);
  const nq = composicaoRodada(abc.length, fs.length, cz.length).q;
  const qs = [...embaralha(abc.filter((id) => !feitaHoje(est?.q[id]))), ...embaralha(abc.filter((id) => feitaHoje(est?.q[id])))].slice(0, nq);
  const it: SessaoTreino['it'] = [];
  const pilhas: SessaoTreino['it'][] = [qs.map((id) => ({ k: 'q' as const, id })), embaralha(fs).map((c) => ({ k: 'f' as const, id: c.id })), cz.map((c) => ({ k: 'c' as const, id: c.id }))];
  while (pilhas.some((p) => p.length)) for (const p of pilhas) { const x = p.shift(); if (x) it.push(x); }
  return { it, i: 0, res: {}, t0: Date.now() };
}

/** Uma questão real dentro de um treino (o da matéria e o de todas as matérias, comando 32): responder, confirmar e a
 *  correção em 4 blocos. A resposta conta na matéria da questão; ctx diz de onde veio ('treino' ou 'misto'). */
export function QuestaoInline({ mc, q: q0, aoTerminar, ctx = 'treino' }: { mc: MateriaCarregada; q: Questao; aoTerminar: (ok: boolean) => void; ctx?: string }) {
  const m = mc.id;
  // questão de prova só de texto: a transcrição chega à parte (como na tela da questão); enquanto isso, o print
  const q = useQuestaoComTexto(m, q0) || q0;
  const [aba, setAba] = useState<AbaPainel>('res');
  const res = useResolucoes(m, q.sub);
  const [escolha, setEscolha] = useState<Letra | null>(null);
  const [conf, setConf] = useState<Conf | null>(null);
  const [revelado, setRevelado] = useState(false);
  const [riscadas, setRiscadas] = useState<Set<Letra>>(new Set());
  const crono = useCronometro(!revelado, q.id);
  useEffect(() => { setEscolha(null); setConf(null); setRevelado(false); setRiscadas(new Set()); setAba('res'); }, [q.id]);
  const confirma = () => {
    if (!escolha || revelado) return;
    registraTentativa(m, q.id, { letra: escolha, ok: escolha === q.gab, ts: Date.now(), seg: crono.total(), conf, ctx });
    setRevelado(true);
    setAba('res');
    requestAnimationFrame(() => mostraPainel(true));
  };
  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT' || (e.target as HTMLElement)?.tagName === 'TEXTAREA') return;
      const k = e.key.toUpperCase();
      if (!revelado && 'ABCDE'.includes(k) && k.length === 1) setEscolha(k as Letra);
      else if (e.key === 'Enter') { e.preventDefault(); revelado ? aoTerminar(escolha === q.gab) : confirma(); }
    };
    addEventListener('keydown', f);
    return () => removeEventListener('keydown', f);
  });
  const mod = mc.conteudo.modulos.find((x) => x.id === q.modulo);
  const sub = mod?.subs.find((x) => x.id === q.sub);
  const cartoes = (() => { const l = mod?.cartoes.filter((c) => c.sub === q.sub) || []; return l.length ? l : mod?.cartoes || []; })();
  return (
    <div className={'q-grade' + (revelado ? ' respondida' : '')}>
      <article className="folha q-cartao">
        <EnunciadoQuestao m={m} q={q} numero="Questão real" depois={sub && <span className="etq q-sub" title={cap(sub.nome)}>{cap(sub.nome)}</span>} />
        <RespostaCartao q={q} escolha={escolha} aoEscolher={setEscolha} revelado={revelado} riscadas={riscadas}
          aoRiscar={(l) => setRiscadas((r) => { const n = new Set(r); n.has(l) ? n.delete(l) : n.add(l); return n; })} mostrarTexto={!urlPrint(m, q.id)}>
          {!revelado ? (
            <><Certeza valor={conf} aoMudar={setConf} /><button className="btn btn-conf" disabled={!escolha} onClick={confirma}>Confirmar resposta</button></>
          ) : (
            <button className="btn btn-conf" onClick={() => aoTerminar(escolha === q.gab)}>Continuar <Icone nome="direita" /></button>
          )}
        </RespostaCartao>
      </article>
      <aside className="folha q-lado" id="q-lado" aria-label="Resolução, teoria e fonte">
        <AbasPainel aba={aba} aoMudar={setAba} />
        <div className="q-lado-corpo" id="q-lado-corpo">
          {aba === 'res' && (revelado ? <><ResolucaoView q={q} r={res ? res[q.id] : undefined} marcada={escolha} /><div className="q-lado-fim"><span /><button className="btn" onClick={() => aoTerminar(escolha === q.gab)}>Continuar <Icone nome="direita" /></button></div></> : (
            <div className="q-trava"><Icone nome="lampada" /><div><b>A resolução abre quando você confirmar</b><p>Marque uma alternativa e confirme. A resolução explica a alternativa que você marcou.</p></div></div>
          ))}
          {aba === 'teo' && (
            <div className="q-teoria">
              <p className="q-teo-rot"><i className="ponto-sub" aria-hidden /><span>Teoria desta questão · <b>{cap(sub?.nome || mod?.nome || '')}</b></span></p>
              {cartoes.length ? cartoes.map((c, i) => <CartaoTeoriaView key={i} c={c} />) : <p className="miolo">A teoria deste conteúdo está em preparação.</p>}
            </div>
          )}
          {aba === 'fon' && <FonteQuestao q={q} />}
        </div>
      </aside>
    </div>
  );
}

export function Treino() {
  const { m } = useParams() as { m: MateriaId };
  const nav = useNavigate();
  const mc = useMateria(m);
  const e = useEstado();
  useTitulo('Treino geral');
  const ses = e.treino[m];

  // matéria sem questões (ou sem nada para o treino): a tela da matéria não oferece treino, então a rota leva ao aviso "em preparação" dela
  const semTreino = !!mc && (mc.banco.length === 0 || !(mc.conteudo.essencial.abc.length + mc.conteudo.essencial.completar.length + mc.conteudo.flash.length + mc.conteudo.flashImg.length));
  useEffect(() => {
    if (mc && !ses && !semTreino) atualiza((x) => ({ ...x, treino: { ...x.treino, [m]: montaTreino(mc) } }));
  }, [mc, ses, m, semTreino]);

  if (semTreino) return <Navigate to={`/m/${m}`} replace />;
  if (!mc || !ses) return <div className="conteudo"><Carregando /></div>;
  const info = infoMateria(m)!;
  const salva = (f: (s: SessaoTreino) => SessaoTreino) => atualiza((x) => ({ ...x, treino: { ...x.treino, [m]: f(x.treino[m]!) } }));
  const avanca = (id: string, n: Nota) => salva((s) => ({ ...s, i: s.i + 1, res: { ...s.res, [id]: n } }));
  const recomecar = () => atualiza((x) => ({ ...x, treino: { ...x.treino, [m]: montaTreino(mc) } }));
  const encerrar = () => { atualiza((x) => { const t = { ...x.treino }; delete t[m]; return { ...x, treino: t }; }); nav(`/m/${m}`); };

  if (ses.i >= ses.it.length) {
    const v = ses.it.map((x) => ses.res[x.id]);
    const porK = (k: 'q' | 'f' | 'c') => { const l = ses.it.filter((x) => x.k === k); return { n: l.length, ok: l.filter((x) => ses.res[x.id] === 'a').length }; };
    const q = porK('q'), f = porK('f'), c = porK('c');
    return (
      <div className={`conteudo estreito m-${m}`}>
        <div className="resultado-fl folha">
          <h1>Treino concluído</h1>
          <p className="miolo">{v.filter((x) => x === 'a').length} de {v.length} itens certos.</p>
          <div className="rf-nums">
            {([[q, 'questões de prova'], [f, 'flashcards'], [c, 'frases']] as [{ n: number; ok: number }, string][]).filter(([x]) => x.n > 0).map(([x, t]) => (
              <div key={t}><b className="num">{x.ok}/{x.n}</b><span>{t}</span></div>
            ))}
          </div>
          <p className="miolo">Erros e chutes entram na revisão espaçada automaticamente.</p>
          <div className="tm-regiao"><FiltroRegiaoChips compacto /></div>
          <div className="fc-acoes"><button className="btn sec" onClick={encerrar}>Voltar a {info.nome}</button><button className="btn" onClick={recomecar}>Novo treino</button></div>
        </div>
      </div>
    );
  }

  const it = ses.it[ses.i];
  const todos = [...mc.conteudo.flash, ...mc.conteudo.flashImg];
  return (
    <div className={`questao-tela m-${m}`}>
      <h1 className="sr">Treino geral — item {ses.i + 1} de {ses.it.length}</h1>
      <div className="q-barra">
        <button className="q-volta" onClick={() => nav(`/m/${m}`)} aria-label="Voltar (o treino fica salvo)" title="Voltar (o treino fica salvo)"><Icone nome="esquerda" /><span>Voltar</span></button>
        <div className="q-barq">
          <span className="g" aria-hidden><Icone nome={`m_${m}` as NomeIcone} /></span>
          <span className="n">{info.nome}</span>
          <span className="t num" title="O treino fica salvo se você sair"><b>Treino geral</b> · <b>{ses.i + 1}</b> de {ses.it.length}</span>
          <span className="p" aria-hidden><i style={{ width: `${((ses.i + 1) / ses.it.length) * 100}%` }} /></span>
        </div>
        <div className="q-progresso" aria-hidden>{ses.it.map((x, k) => <i key={x.id + k} className={(k === ses.i ? 'atual ' : '') + (ses.res[x.id] ? (ses.res[x.id] === 'a' ? 'ok' : ses.res[x.id] === 'q' ? 'qs' : 'err') : '')} />)}</div>
        <button className="btn fantasma peq" onClick={recomecar}>Recomeçar</button>
        <BotaoTelaCheia />
      </div>
      {ses.i === 0 && <div className="q-regiao"><FiltroRegiaoChips compacto aoMudar={recomecar} /></div>}
      <div className="q-corpo">
        {it.k === 'q' && mc.porId.get(it.id) && <QuestaoInline mc={mc} q={mc.porId.get(it.id)!} aoTerminar={(ok) => avanca(it.id, ok ? 'a' : 'e')} />}
        {it.k === 'f' && (() => { const c = todos.find((x) => x.id === it.id); const md = c && mc.conteudo.modulos.find((x) => x.id === c.mod); return c ? <FlashcardView m={m} c={c} todos={todos} tema={md?.nome} conteudo={cap(md?.subs.find((x) => x.id === c.sub)?.nome || '') || undefined} aoNotar={(n, o) => { notaFlash(m, c.id, n, o); avanca(c.id, n); }} /> : null; })()}
        {it.k === 'c' && (() => { const c = mc.conteudo.essencial.completar.find((x) => x.id === it.id); return c ? <CompletarView m={m} c={c} aoNotar={(n, o) => { notaFlash(m, c.id, n, o); avanca(c.id, n); }} /> : null; })()}
        {((it.k === 'q' && !mc.porId.get(it.id))) && <div className="vazio"><p>Item indisponível.</p><button className="btn sec" onClick={() => avanca(it.id, 'q')}>Pular</button></div>}
      </div>
      <p className="fraco" style={{ textAlign: 'center', fontSize: 13, marginTop: 8 }}><Link to={`/m/${m}`}>Voltar a {info.nome}</Link></p>
    </div>
  );
}

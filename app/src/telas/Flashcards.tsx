import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { EH_PREVIA, useMateria } from '../dados/conteudo';
import { materia as infoMateria } from '../dados/materias';
import { atualizaMateria, pegaEstado, useMateriaEstado } from '../estado/loja';
import { cartoesAtivos } from '../logica/estatisticas';
import { flashVencido, marcaFlash } from '../logica/revisao';
import { Carregando, plural, useTitulo } from '../ui/comum';
import { Icone } from '../ui/Icone';
import { FlashcardView, type Nota } from '../ui/Cartoes';
import type { Flashcard, MateriaId } from '../dados/tipos';

const N_SESSAO = 20;

export function notaFlash(m: MateriaId, id: string, n: Nota, origem: string) {
  atualizaMateria(m, (s) => ({ ...s, flash: { ...s.flash, [id]: marcaFlash(s.flash[id], n, Date.now(), origem) } }));
}

export function Flashcards({ sessao = false }: { sessao?: boolean }) {
  const { m } = useParams() as { m: MateriaId };
  const [qs] = useSearchParams();
  const nav = useNavigate();
  const mc = useMateria(m);
  const s = useMateriaEstado(m);
  const [mod, setMod] = useState(qs.get('mod') || '');
  useTitulo('Flashcards');

  const todos = useMemo(() => (mc ? [...mc.conteudo.flash, ...mc.conteudo.flashImg].filter((c) => !(EH_PREVIA && c.img)) : []), [mc]);
  const ativos = useMemo(() => (mc ? cartoesAtivos(mc, pegaEstado().materias[m] || s).filter((c) => !(EH_PREVIA && c.img)) : []), [mc, m, s]);

  // a sessão é montada uma vez ao abrir: vencidos primeiro, depois novos
  const [fila] = useState<string[]>(() => []);
  const [i, setI] = useState(0);
  const [res, setRes] = useState<Record<string, Nota>>({});
  const montada = useMemo(() => {
    if (!sessao || !mc) return [];
    if (fila.length) return fila;
    const um = qs.get('c');
    const est = pegaEstado().materias[m] || s;
    const base = ativos.filter((c) => !qs.get('mod') || c.mod === qs.get('mod'));
    const venc = base.filter((c) => flashVencido(est.flash[c.id])).sort((a, b) => est.flash[a.id].vence - est.flash[b.id].vence);
    const novos = base.filter((c) => !est.flash[c.id]?.hist?.length).sort((a, b) => (b.peso || 0) - (a.peso || 0));
    const l = (um ? [um] : []).concat([...venc, ...novos].map((c) => c.id).filter((x) => x !== um)).slice(0, N_SESSAO);
    fila.push(...l);
    return fila;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessao, mc]);

  if (!mc) return <div className="conteudo"><Carregando /></div>;
  const info = infoMateria(m)!;

  if (!sessao) {
    const filtrados = ativos.filter((c) => !mod || c.mod === mod);
    const venc = filtrados.filter((c) => flashVencido(s.flash[c.id])).length;
    const novos = filtrados.filter((c) => !s.flash[c.id]?.hist?.length).length;
    const mods = [...new Set(todos.map((c) => c.mod))].sort();
    const ocultos = todos.filter((c) => s.flg[c.id]?.g === -1).length;
    return (
      <div className={`conteudo estreito m-${m}`}>
        <nav className="migalhas"><Link to={`/m/${m}`}>{info.nome}</Link><Icone nome="direita" tam={14} /><span>Flashcards</span></nav>
        <div className="titulo-pag"><div><h1>Flashcards de {info.nome}</h1><p className="sub">Pergunta curta no estilo das discursivas, resposta em uma frase. Você escreve, o site corrige e você confirma.</p></div></div>
        <div className="fl-resumo folha">
          <div><b className="num">{venc}</b><span>para revisar hoje</span></div>
          <div><b className="num">{novos}</b><span>novos</span></div>
          <div><b className="num">{filtrados.length}</b><span>no total</span></div>
          <button className="btn grande" disabled={!venc && !novos} onClick={() => nav(`/m/${m}/flashcards/sessao${mod ? `?mod=${mod}` : ''}`)}>
            {venc ? 'Revisar agora' : novos ? 'Começar sessão' : 'Tudo em dia'} <Icone nome="direita" />
          </button>
        </div>
        <section className="secao">
          <h2 className="sec-tit">Filtrar por tema</h2>
          <div className="chips">
            <button className="chip" aria-pressed={!mod} onClick={() => setMod('')}>Todos</button>
            {mods.map((x) => <button key={x} className="chip" aria-pressed={mod === x} onClick={() => setMod(x)}>{mc.conteudo.modulos.find((y) => y.id === x)?.nome || x}</button>)}
          </div>
        </section>
        <p className="fraco" style={{ marginTop: 24, fontSize: 14 }}>Intervalos de revisão: 1, 3, 7, 16, 35 e 80 dias. “Quase” volta amanhã; “Errei” volta hoje.{ocultos ? ` ${plural(ocultos, 'cartão tirado', 'cartões tirados')} por “Não curti”.` : ''}</p>
      </div>
    );
  }

  const ids = montada;
  if (!ids.length) return (
    <div className={`conteudo estreito m-${m}`}><div className="vazio"><h3>Nenhum cartão para agora</h3><p>Volte amanhã para a revisão dos que você já viu.</p><Link to={`/m/${m}/flashcards`} className="btn sec">Voltar</Link></div></div>
  );
  const fim = i >= ids.length;
  if (fim) {
    const v = Object.values(res);
    return (
      <div className={`conteudo estreito m-${m}`}>
        <div className="resultado-fl folha">
          <h1>Sessão concluída</h1>
          <div className="rf-nums">
            <div className="ok"><b className="num">{v.filter((x) => x === 'a').length}</b><span>Acertei</span></div>
            <div className="qs"><b className="num">{v.filter((x) => x === 'q').length}</b><span>Quase</span></div>
            <div className="er"><b className="num">{v.filter((x) => x === 'e').length}</b><span>Errei</span></div>
          </div>
          <p className="miolo">Os que você errou voltam ainda hoje; os demais, no dia certo da revisão.</p>
          <div className="fc-acoes"><Link to={`/m/${m}/flashcards`} className="btn sec">Voltar aos flashcards</Link><Link to={`/m/${m}`} className="btn">Ir para {info.nome}</Link></div>
        </div>
      </div>
    );
  }
  const c = todos.find((x) => x.id === ids[i]) as Flashcard;
  return (
    <div className={`questao-tela m-${m}`}>
      <div className="q-barra">
        <button className="btn-ic" onClick={() => nav(`/m/${m}/flashcards`)} aria-label="Sair da sessão"><Icone nome="fechar" /></button>
        <div className="q-barra-txt"><b>Flashcards</b><span className="fraco num">{info.nome} · {i + 1} de {ids.length}</span></div>
        <div className="q-progresso" aria-hidden>{ids.map((x, k) => <i key={x} className={(k === i ? 'atual ' : '') + (res[x] ? (res[x] === 'a' ? 'ok' : res[x] === 'q' ? 'qs' : 'err') : '')} />)}</div>
      </div>
      <div className="q-corpo">
        {c && <FlashcardView m={m} c={c} todos={todos} aoNotar={(n, origem) => { notaFlash(m, c.id, n, origem); setRes((r) => ({ ...r, [c.id]: n })); setI((k) => k + 1); }} />}
      </div>
    </div>
  );
}

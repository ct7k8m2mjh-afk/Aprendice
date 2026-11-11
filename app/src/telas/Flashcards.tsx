import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { EH_PREVIA, useMateria } from '../dados/conteudo';
import { materia as infoMateria } from '../dados/materias';
import { atualizaMateria, pegaEstado, useMateriaEstado } from '../estado/loja';
import { cartoesAtivos } from '../logica/estatisticas';
import { agendaDe, flashVencido, marcaFlash } from '../logica/revisao';
import { Barra, Carregando, cap, plural, useTitulo } from '../ui/comum';
import { Icone, type NomeIcone } from '../ui/Icone';
import { IcTema } from '../ui/IconeTema';
import { BotaoTelaCheia } from '../ui/QuestaoCartao';
import { FlashcardView, type Nota } from '../ui/Cartoes';
import { CabMateria, subMateria } from './Materia';
import type { Flashcard, MateriaId } from '../dados/tipos';

const N_SESSAO = 20;

export function notaFlash(m: MateriaId, id: string, n: Nota, origem: string) {
  atualizaMateria(m, (s) => ({ ...s, flash: { ...s.flash, [id]: marcaFlash(s.flash[id], n, Date.now(), origem, agendaDe(pegaEstado())) } }));
}

export function Flashcards({ sessao = false }: { sessao?: boolean }) {
  const { m } = useParams() as { m: MateriaId };
  const [qs] = useSearchParams();
  const nav = useNavigate();
  const mc = useMateria(m);
  const s = useMateriaEstado(m);
  const [mod, setMod] = useState(qs.get('mod') || '');
  const [area, setArea] = useState(qs.get('area') || '');
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
    const daArea = mc.conteudo.areas.find((a) => a.id === qs.get('area'))?.mods;
    const base = ativos.filter((c) => (!qs.get('mod') || c.mod === qs.get('mod')) && (!daArea || daArea.includes(c.mod)));
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
    // lista (sistema do protótipo): cabeçalho da matéria, capa lavada com os números e Começar, folha "Área" e folha "Tema"
    const areas = mc.conteudo.areas.filter((a) => ativos.some((c) => a.mods.includes(c.mod)));
    const modsArea = areas.find((a) => a.id === area)?.mods;
    const naArea = ativos.filter((c) => !modsArea || modsArea.includes(c.mod));
    const filtrados = naArea.filter((c) => !mod || c.mod === mod);
    const venc = filtrados.filter((c) => flashVencido(s.flash[c.id])).length;
    const novos = filtrados.filter((c) => !s.flash[c.id]?.hist?.length).length;
    const firmes = filtrados.filter((c) => (s.flash[c.id]?.etapa || 0) >= 2).length;
    const temas = mc.conteudo.modulos.filter((x) => naArea.some((c) => c.mod === x.id));
    const ocultos = todos.filter((c) => s.flg[c.id]?.g === -1).length;
    const nSessao = Math.min(N_SESSAO, venc + novos);
    const params = new URLSearchParams({ ...(area ? { area } : {}), ...(mod ? { mod } : {}) }).toString();
    const escolheArea = (a: string) => { setArea(a); setMod(''); };
    return (
      <div className={`conteudo m-${m}`}>
        <CabMateria m={m} nome={info.nome} titulo={false} sub={subMateria(mc.conteudo.modulos.length, mc.banco.length === 0)} />
        <section className="tp-capa fl-capa" aria-labelledby="fl-tit">
          <div className="fl-capa-g">
            <div className="fl-capa-txt">
              <h1 id="fl-tit">Flashcards</h1>
              <p>Pergunta curta no estilo das discursivas, resposta em uma frase. Você escreve, o site corrige e você confirma: vale a ideia, não a frase exata.</p>
            </div>
            <div className="fl-resumo" aria-label="Seus cartões">
              <div className="ven"><b className="num">{venc}</b><span>para revisar hoje</span></div>
              <div><b className="num">{novos}</b><span>{novos === 1 ? 'novo' : 'novos'}</span></div>
              <div><b className="num">{firmes}</b><span>{firmes === 1 ? 'firme' : 'firmes'}</span></div>
            </div>
          </div>
          <div className="tp-acoes">
            <button className="btn tp-comecar" disabled={!nSessao} onClick={() => nav(`/m/${m}/flashcards/sessao${params ? `?${params}` : ''}`)}>
              <Icone nome="cartas" /> {venc ? 'Revisar agora' : novos ? 'Começar' : 'Tudo em dia'}
            </button>
            <p className="tp-comp num">{nSessao ? `${plural(nSessao, 'cartão', 'cartões')} nesta sessão` : 'Volte amanhã para a revisão dos que você já viu.'}</p>
          </div>
        </section>
        {areas.length > 1 && (
          <section className="tp-bloco fl-bloco" aria-labelledby="fl-area">
            <h2 className="tp-h" id="fl-area">Área <small className="num">{plural(ativos.length, 'cartão', 'cartões')} em {info.nome}</small></h2>
            <div className="fl-areas" role="group" aria-label="Filtrar por área">
              <button className="fl-area" aria-pressed={!area} onClick={() => escolheArea('')}><span className="fl-area-ic"><Icone nome="cartas" /></span>Todas</button>
              {areas.map((a) => <button key={a.id} className="fl-area" aria-pressed={area === a.id} onClick={() => escolheArea(a.id)}><IcTema m={m} tema={a.mods[0]} tam={28} />{a.nome}</button>)}
            </div>
          </section>
        )}
        <section className="tp-bloco fl-bloco" aria-labelledby="fl-tema">
          <h2 className="tp-h" id="fl-tema">Tema <small>{mod ? mc.conteudo.modulos.find((x) => x.id === mod)?.nome : 'todos'}</small></h2>
          <div className="fl-temas" role="group" aria-label="Filtrar por tema">
            <button className="fl-tema" aria-pressed={!mod} onClick={() => setMod('')}>
              <span className="fl-tema-ic"><Icone nome="camadas" /></span>
              <span className="t"><b>Todos os temas</b><small className="num">{plural(naArea.length, 'cartão', 'cartões')}</small></span>
            </button>
            {temas.map((x) => {
              const l = naArea.filter((c) => c.mod === x.id);
              const fm = l.filter((c) => (s.flash[c.id]?.etapa || 0) >= 2).length;
              return (
                <button key={x.id} className="fl-tema" aria-pressed={mod === x.id} onClick={() => setMod(x.id)}>
                  <IcTema m={m} tema={x.id} tam={36} />
                  <span className="t"><b>{x.nome}</b><small className="num">{plural(l.length, 'cartão', 'cartões')} · {plural(fm, 'firme', 'firmes')}</small><Barra valor={l.length ? fm / l.length : 0} rotulo={`Cartões firmes em ${x.nome}`} /></span>
                </button>
              );
            })}
          </div>
        </section>
        <p className="fraco fl-nota">Intervalos de revisão: 1, 3, 7, 16, 35 e 80 dias. “Quase” volta amanhã; “Errei” volta hoje.{ocultos ? ` ${plural(ocultos, 'cartão tirado', 'cartões tirados')} por “Não curti”.` : ''}</p>
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
      <h1 className="sr">Flashcards — cartão {i + 1} de {ids.length}</h1>
      <div className="q-barra">
        <button className="q-volta" onClick={() => nav(`/m/${m}/flashcards`)} aria-label="Sair da sessão" title="Sair da sessão"><Icone nome="esquerda" /><span>Voltar</span></button>
        <div className="q-barq">
          <span className="g" aria-hidden><Icone nome={`m_${m}` as NomeIcone} /></span>
          <span className="n">{info.nome}</span>
          <span className="t num"><b>Flashcards</b> · <b>{i + 1}</b> de {ids.length}</span>
          <span className="p" aria-hidden><i style={{ width: `${((i + 1) / ids.length) * 100}%` }} /></span>
        </div>
        <div className="q-progresso" aria-hidden>{ids.map((x, k) => <i key={x} className={(k === i ? 'atual ' : '') + (res[x] ? (res[x] === 'a' ? 'ok' : res[x] === 'q' ? 'qs' : 'err') : '')} />)}</div>
        <BotaoTelaCheia />
      </div>
      <div className="q-corpo">
        {c && <FlashcardView m={m} c={c} todos={todos} tema={mc.conteudo.modulos.find((x) => x.id === c.mod)?.nome} conteudo={cap(mc.conteudo.modulos.find((x) => x.id === c.mod)?.subs.find((x) => x.id === c.sub)?.nome || '') || undefined} aoNotar={(n, origem) => { notaFlash(m, c.id, n, origem); setRes((r) => ({ ...r, [c.id]: n })); setI((k) => k + 1); }} />}
      </div>
    </div>
  );
}

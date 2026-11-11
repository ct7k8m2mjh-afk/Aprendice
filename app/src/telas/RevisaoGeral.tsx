import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useMateria } from '../dados/conteudo';
import { materia as infoMateria } from '../dados/materias';
import { urlRevisao, useGeral, useIndiceRevisao } from '../dados/revisao';
import type { MateriaId } from '../dados/tipos';
import { atualizaMateria, useMateriaEstado } from '../estado/loja';
import { contaEhTexto } from '../logica/fracao';
import {
  agrupaPorCapitulo, alternaLido, alternaMarcado, avisoImagem, buscaTopicos, contaProgresso, ehParte, escolheImagem,
  marcaTrechos, parteDoTopico, partesDe, PARTES_FS, topicosDaParte, type ImagemTopico, type ParteGeral, type TopicoGeral,
} from '../logica/revisaoGeral';
import { Carregando, cap, plural, useTitulo } from '../ui/comum';
import { TextoMat } from '../ui/Formula';
import { comFracoes } from '../ui/Fracao';
import { Icone, type NomeIcone } from '../ui/Icone';
import { CabMateria, subMateria } from './Materia';
import '../estilo/geral.css';

type Filtro = 'todos' | 'nao-lidos' | 'marcados';
const FILTROS: [Filtro, string][] = [['todos', 'Todos'], ['nao-lidos', 'Não lidos'], ['marcados', 'Marcados']];

/** Endereço da revisão geral de uma matéria (em Filosofia e Sociologia, de uma das partes). */
export function rotaGeral(m: MateriaId, parte?: ParteGeral | null, topico?: string): string {
  return `/m/${m}/geral${m === 'fs' ? '/' + (parte || 'filosofia') : ''}${topico ? '?t=' + encodeURIComponent(topico) : ''}`;
}

/** Nome da tela: a matéria, ou Filosofia / Sociologia. */
export function nomeGeral(m: MateriaId, parte?: ParteGeral | null): string {
  return m === 'fs' ? PARTES_FS[parte || 'filosofia'].nome : infoMateria(m)?.nome || '';
}

/**
 * REVISÃO GERAL DA MATÉRIA (comando 37): todos os tópicos de docs/revisao/<m>/geral.json, agrupados por capítulo, com
 * busca instantânea (título, subtemas e termos de busca; sem acento e maiúscula; pedaço de palavra vale). Rota
 * /m/<m>/geral (em Filosofia e Sociologia, /m/fs/geral/filosofia e /m/fs/geral/sociologia). ?q= guarda a busca, ?t= o
 * tópico aberto, ?f= o filtro. No computador, lista e tópico lado a lado; no celular, um de cada vez.
 * Sem animação em nenhuma matéria: é texto, fórmula (pelo renderizador do site) e a caixa de imagem.
 */
export function RevisaoGeralTela() {
  const { m, parte: parteUrl } = useParams() as { m: MateriaId; parte?: string };
  const [qs, setQs] = useSearchParams();
  const info = infoMateria(m);
  const mc = useMateria(info?.ativa ? m : null);
  const dados = useGeral(info?.ativa ? m : null);
  const s = useMateriaEstado(m);
  const parte: ParteGeral | null = m === 'fs' ? (ehParte(parteUrl) ? parteUrl : 'filosofia') : null;
  const nome = nomeGeral(m, parte);
  useTitulo(`Revisão geral · ${nome}`);
  const q = qs.get('q') || '';
  const aberto = qs.get('t');
  const filtro: Filtro = (['nao-lidos', 'marcados'] as string[]).includes(qs.get('f') || '') ? (qs.get('f') as Filtro) : 'todos';
  const tituloRef = useRef<HTMLHeadingElement>(null);
  const buscaRef = useRef<HTMLInputElement>(null);
  const focoNoTopico = useRef(false);

  const nomeSub = useMemo(() => {
    const mapa = new Map<string, string>();
    mc?.conteudo.modulos.forEach((mod) => mod.subs.forEach((x) => mapa.set(x.id, x.nome)));
    return (id: string) => mapa.get(id);
  }, [mc]);
  // ordem de exibição: por capítulo (um capítulo que reaparece adiante no arquivo junta-se ao primeiro, como na lista);
  // "N de M", Anterior e Próximo seguem essa mesma ordem
  const topicos = useMemo(() => (dados ? agrupaPorCapitulo(topicosDaParte(dados.topicos, m, parte)).flatMap((c) => c.topicos) : []), [dados, m, parte]);
  const achados = useMemo(() => buscaTopicos(topicos, q, nomeSub), [topicos, q, nomeSub]);
  const g = s.geral;
  const passa = (t: TopicoGeral) => filtro === 'todos' || (filtro === 'marcados' ? !!g?.[t.id]?.marc : !g?.[t.id]?.lido);
  const lista = (q.trim() ? achados.map((a) => a.t) : topicos).filter(passa);
  // na busca, os capítulos seguem a ordem do arquivo; o melhor achado é o que abre no computador e com Enter
  const ordemArquivo = new Map(topicos.map((t, k) => [t.id, k]));
  const grupos = agrupaPorCapitulo([...lista].sort((a, b) => ordemArquivo.get(a.id)! - ordemArquivo.get(b.id)!));
  const topico = topicos.find((t) => t.id === aberto) || null;
  const mostrado = topico || lista[0] || null;

  useEffect(() => {
    if (!topico) return;
    // computador: o item aberto fica visível na lista ao lado do tópico (chegando por link ou por Anterior/Próximo)
    const it = document.querySelector<HTMLElement>('.rg-item.atual');
    if (it && it.offsetParent && typeof matchMedia !== 'undefined' && matchMedia('(min-width: 901px)').matches) {
      const r = it.getBoundingClientRect();
      if (r.top < 80 || r.bottom > innerHeight) it.scrollIntoView({ block: 'center' });
    }
    const art = tituloRef.current?.closest<HTMLElement>('.rg-topico');
    // celular e tablet (lista e tópico um de cada vez): o tópico aberto sobe para o alto da tela
    if (art && typeof matchMedia !== 'undefined' && matchMedia('(max-width: 900px)').matches) art.scrollIntoView({ block: 'start' });
    if (!focoNoTopico.current) return;
    focoNoTopico.current = false;
    tituloRef.current?.focus({ preventScroll: true });
    art?.scrollTo({ top: 0 });
  }, [topico]);

  if (!info) return <div className="conteudo vazio"><h3>Matéria não encontrada</h3><Link to="/materias" className="btn sec">Ver matérias</Link></div>;
  // /m/fs/geral sem a parte: vai à parte do tópico pedido (?t=SK05 -> Sociologia) ou a Filosofia
  if (m === 'fs' && !ehParte(parteUrl)) return <Navigate to={rotaGeral(m, parteDoTopico(aberto || '') || 'filosofia') + (qs.toString() ? '?' + qs.toString() : '')} replace />;
  if (m !== 'fs' && parteUrl) return <Navigate to={rotaGeral(m)} replace />;
  if (dados === undefined) return <div className="conteudo"><Carregando /></div>;

  const muda = (o: { q?: string; t?: string | null; f?: Filtro }) => {
    const p = new URLSearchParams(qs);
    if (o.q !== undefined) { if (o.q) p.set('q', o.q); else p.delete('q'); }
    if (o.t !== undefined) { if (o.t) p.set('t', o.t); else p.delete('t'); }
    if (o.f !== undefined) { if (o.f !== 'todos') p.set('f', o.f); else p.delete('f'); }
    setQs(p, { replace: o.t === undefined });
  };
  const abre = (id: string) => { focoNoTopico.current = true; muda({ t: id }); };
  const teclaBusca = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && achados[0]) { e.preventDefault(); abre(achados[0].t.id); }
    else if (e.key === 'Escape' && q) { e.preventDefault(); muda({ q: '' }); }
  };
  const { lidos, marcados } = contaProgresso(topicos, g);
  const n = topicos.length;
  const idx = mostrado ? topicos.indexOf(mostrado) : -1;
  const ant = idx > 0 ? topicos[idx - 1] : null, prox = idx >= 0 && idx + 1 < n ? topicos[idx + 1] : null;

  return (
    <div className={`conteudo m-${m} rg`}>
      <CabMateria m={m} nome={info.nome} titulo={false} sub={mc ? subMateria(mc.conteudo.modulos.length, mc.banco.length === 0) : info.descricao} />
      <div className="tp-topo"><Link to={`/m/${m}`} className="tp-volta"><Icone nome="esquerda" />Todos os temas</Link></div>

      <section className="tp-capa rg-capa" aria-labelledby="rg-h1">
        <div className="rg-capa-g">
          <div className="rg-capa-txt">
            <h1 id="rg-h1">Revisão geral{m === 'fs' ? ` de ${nome}` : ''}</h1>
            <p className="rg-apoio">A matéria inteira em tópicos curtos, do simples ao complexo: o essencial de cada um, a pegadinha da banca e a imagem do tópico.</p>
            {n > 0 && <p className="tp-stat num"><b>{lidos}</b> de {n} {n === 1 ? 'tópico lido' : 'tópicos lidos'} · <b>{marcados}</b> {marcados === 1 ? 'marcado' : 'marcados'} para rever</p>}
          </div>
          {m === 'fs' && (
            <nav className="rg-partes" aria-label="Parte da revisão geral">
              {(['filosofia', 'sociologia'] as ParteGeral[]).map((p) => (
                <Link key={p} to={rotaGeral(m, p)} className="chip" aria-current={p === parte ? 'page' : undefined}>{PARTES_FS[p].nome}</Link>
              ))}
            </nav>
          )}
        </div>
        {n > 0 && (
          <div className="rg-busca">
            <label htmlFor="rg-q">Buscar na revisão geral de {nome}</label>
            <div className="rg-busca-cx">
              <Icone nome="busca" />
              <input id="rg-q" ref={buscaRef} type="search" value={q} autoComplete="off" spellCheck={false} enterKeyHint="search"
                aria-describedby="rg-q-ajuda" aria-controls="rg-lista"
                onChange={(e) => muda({ q: e.target.value, ...(aberto ? { t: null } : {}) })} onKeyDown={teclaBusca} />
              {q && <button type="button" className="rg-limpa" onClick={() => { muda({ q: '' }); buscaRef.current?.focus(); }} aria-label="Limpar a busca"><Icone nome="fechar" /></button>}
            </div>
            <small id="rg-q-ajuda">Pelo nome, pelo subtema ou pelo jeito que você lembra; acento e maiúscula não importam. Enter abre o primeiro resultado.</small>
          </div>
        )}
      </section>

      {n === 0 ? (
        <section className="tp-bloco vazio"><h3>Revisão geral em preparação</h3><p>Os tópicos desta matéria ainda estão passando pelas lentes da banca.</p></section>
      ) : (
        <div className={'rg-grade' + (topico ? ' aberto' : '')}>
          <section className="tp-bloco rg-indice" aria-labelledby="rg-ind-tit">
            <h2 className="tp-h" id="rg-ind-tit">{q.trim() ? 'Resultado da busca' : 'Tópicos por capítulo'} <small className="num">{plural(lista.length, 'tópico', 'tópicos')}</small></h2>
            <div className="chips rg-filtros" role="group" aria-label="Mostrar">
              {FILTROS.map(([f, rot]) => <button key={f} type="button" className="chip" aria-pressed={filtro === f} onClick={() => muda({ f })}>{rot}</button>)}
            </div>
            <p className="sr" role="status" aria-live="polite">{q.trim() ? (lista.length ? `${plural(lista.length, 'tópico encontrado', 'tópicos encontrados')}` : 'Nenhum tópico encontrado') : ''}</p>
            {!lista.length ? (
              <div className="rg-nada">
                <p><b>{q.trim() ? `Nada encontrado para “${q.trim()}”.` : filtro === 'marcados' ? 'Nenhum tópico marcado para rever.' : 'Você já leu todos os tópicos.'}</b></p>
                <p>{q.trim() ? 'Tente uma parte da palavra ou outro nome do assunto.' : 'Mude o filtro para ver os outros tópicos.'}</p>
                {(q.trim() || filtro !== 'todos') && <button type="button" className="btn sec peq" onClick={() => muda({ q: '', f: 'todos' })}>Ver todos os tópicos</button>}
              </div>
            ) : (
              <div id="rg-lista">
                {grupos.map((c) => (
                  <div key={c.capitulo} className="rg-cap">
                    {c.capitulo && <h3 className="rg-cap-t">{c.capitulo}</h3>}
                    <ul className="rg-lista">
                      {c.topicos.map((t) => {
                        const v = g?.[t.id];
                        const atual = topico?.id === t.id; // realce só no tópico realmente aberto (?t=)
                        return (
                          <li key={t.id}>
                            <Link to={'?' + (() => { const p = new URLSearchParams(qs); p.set('t', t.id); return p.toString(); })()}
                              onClick={(e) => { if (e.metaKey || e.ctrlKey || e.shiftKey) return; e.preventDefault(); abre(t.id); }}
                              className={'rg-item' + (atual ? ' atual' : '') + (v?.lido ? ' lido' : '')} aria-current={atual ? 'true' : undefined}>
                              <i className="ponto-sub" aria-hidden />
                              <span className="t">{marcaTrechos(t.titulo, q).map((x, k) => (x.marca ? <mark key={k}>{x.t}</mark> : <span key={k}>{x.t}</span>))}</span>
                              <span className="rg-est">
                                {v?.marc && <span className="rg-est-m" title="Marcado para rever"><Icone nome="marcador" tam={16} /><span className="sr">marcado para rever</span></span>}
                                {v?.lido && <span className="rg-est-l" title="Lido"><Icone nome="check" tam={16} /><span className="sr">lido</span></span>}
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </section>

          {mostrado && (
            <article className="tp-bloco rg-topico" aria-labelledby="rg-tit">
              {topico && <Link to={'?' + (() => { const p = new URLSearchParams(qs); p.delete('t'); return p.toString(); })()} className="tp-volta rg-volta"
                onClick={(e) => { e.preventDefault(); muda({ t: null }); }}><Icone nome="esquerda" />Todos os tópicos</Link>}
              <TopicoView m={m} t={mostrado} pos={idx + 1} n={n} nomeSub={nomeSub} tituloRef={tituloRef}
                lido={!!g?.[mostrado.id]?.lido} marc={!!g?.[mostrado.id]?.marc}
                onLido={() => atualizaMateria(m, (x) => ({ ...x, geral: alternaLido(x.geral, mostrado.id) }))}
                onMarc={() => atualizaMateria(m, (x) => ({ ...x, geral: alternaMarcado(x.geral, mostrado.id) }))} />
              <nav className="tp-viz rg-viz" aria-label="Outros tópicos">
                {ant ? <Link to={'?t=' + encodeURIComponent(ant.id)} onClick={(e) => { e.preventDefault(); abre(ant.id); }}><Icone nome="esquerda" /><span><small>Anterior</small><b>{ant.titulo}</b></span></Link> : <span />}
                {prox && <Link className="d" to={'?t=' + encodeURIComponent(prox.id)} onClick={(e) => { e.preventDefault(); abre(prox.id); }}><span><small>Próximo</small><b>{prox.titulo}</b></span><Icone nome="direita" /></Link>}
              </nav>
            </article>
          )}
        </div>
      )}
    </div>
  );
}

function TopicoView({ m, t, pos, n, nomeSub, tituloRef, lido, marc, onLido, onMarc }: {
  m: MateriaId; t: TopicoGeral; pos: number; n: number; nomeSub: (id: string) => string | undefined;
  tituloRef: React.RefObject<HTMLHeadingElement>; lido: boolean; marc: boolean; onLido: () => void; onMarc: () => void;
}) {
  const prosa = contaEhTexto('1 + 1', m);
  const subs = t.subs.filter((x) => nomeSub(x));
  return (
    <>
      <header className="rg-top-cab">
        {t.capitulo && <span className="etq cor">{t.capitulo}</span>}
        <span className="rg-pos num">{pos} de {n}</span>
      </header>
      <h2 id="rg-tit" className="rg-tit" ref={tituloRef} tabIndex={-1}>{t.titulo}</h2>
      {subs.length > 0 && (
        <ul className="rg-subs" aria-label="Subtemas deste tópico">
          {subs.map((x) => <li key={x}><Link to={`/m/${m}/escada/${x}`}><i className="ponto-sub" aria-hidden />{cap(nomeSub(x)!)}</Link></li>)}
        </ul>
      )}
      <ul className="rg-pontos">{t.pontos.map((p, k) => <li key={k}><span className="rg-p"><TextoMat t={p} prosa={prosa} /></span></li>)}</ul>
      {t.pegadinha && <p className="es-pegadinha rg-peg"><b>Pegadinha</b><TextoMat t={t.pegadinha} prosa={prosa} /></p>}
      <CaixaImagem m={m} im={t.imagem} />
      <div className="rg-acoes">
        <button type="button" className={'btn' + (lido ? ' sec' : '')} aria-pressed={lido} onClick={onLido}><Icone nome="check" />{lido ? 'Lido' : 'Marcar como lido'}</button>
        <button type="button" className="btn sec" aria-pressed={marc} onClick={onMarc}><Icone nome="marcador" />{marc ? 'Marcado para rever' : 'Marcar para rever'}</button>
      </div>
    </>
  );
}

/** Caixa de imagem do tópico: a imagem do dono (docs/imagens/<m>/<id>.png, já em WebP) ou, sem ela ou se ela não
 *  carregar, o aviso "EM CONSTRUÇÃO — <descrição>". Nenhum código por tópico: o conversor resolve pelo nome. */
function CaixaImagem({ m, im }: { m: MateriaId; im: ImagemTopico }) {
  const [falhou, setFalhou] = useState(false);
  useEffect(() => { setFalhou(false); }, [im.img]);
  const img = escolheImagem(im, falhou);
  return (
    <figure className="rg-fig">
      {img
        ? <img src={urlRevisao(m, img)} alt={im.descricao} loading="lazy" onError={() => setFalhou(true)} />
        : (
          <div className="rs-caixa rg-caixa" role="img" aria-label={avisoImagem(im)}>
            <Icone nome="olho" tam={18} />
            <span><b>EM CONSTRUÇÃO</b>{' — '}{comFracoes(im.descricao || 'imagem em preparação')}</span>
          </div>
        )}
    </figure>
  );
}

/** Atalhos da revisão geral de uma matéria (na página da matéria): um, ou dois em Filosofia e Sociologia. */
export function AtalhosGeral({ m }: { m: MateriaId }) {
  const ind = useIndiceRevisao(m);
  const s = useMateriaEstado(m);
  if (!ind?.geral?.n) return null;
  return (
    <>
      {partesDe(m).map((p) => {
        const n = p ? ind.geral!.partes?.[p] || 0 : ind.geral!.n;
        if (!n) return null;
        const pre = p ? PARTES_FS[p].prefixo : '';
        const lidos = Object.entries(s.geral || {}).filter(([id, v]) => v.lido && id.startsWith(pre)).length;
        return (
          <Link key={p || m} to={rotaGeral(m, p)} className="atalho">
            <Icone nome="lista" /><span><b>Revisão geral{p ? ` de ${PARTES_FS[p].nome}` : ''}</b><small className="num">{plural(n, 'tópico', 'tópicos')}{lidos ? ` · ${lidos} ${lidos === 1 ? 'lido' : 'lidos'}` : ', com busca'}</small></span><Icone nome="direita" className="at-seta" />
          </Link>
        );
      })}
    </>
  );
}

/** Uma linha por tela de revisão geral (na aba "Revisão geral" da Revisão): 10 telas, fs em duas. */
export function CartoesGeral({ m }: { m: MateriaId }) {
  const ind = useIndiceRevisao(m);
  const s = useMateriaEstado(m);
  if (!ind?.geral?.n) return null;
  return (
    <>
      {partesDe(m).map((p) => {
        const n = p ? ind.geral!.partes?.[p] || 0 : ind.geral!.n;
        if (!n) return null;
        const pre = p ? PARTES_FS[p].prefixo : '';
        const meus = Object.entries(s.geral || {}).filter(([id]) => id.startsWith(pre)).map(([, v]) => v);
        const lidos = meus.filter((v) => v.lido).length, marc = meus.filter((v) => v.marc).length;
        return (
          <Link key={p || m} to={rotaGeral(m, p)} className={`cartao-obj m-${m}`}>
            <span className="mini"><Icone nome={`m_${m}` as NomeIcone} /></span>
            <span><b>{nomeGeral(m, p)}</b><small className="num">{plural(n, 'tópico', 'tópicos')} · {lidos} {lidos === 1 ? 'lido' : 'lidos'}{marc ? ` · ${marc} ${marc === 1 ? 'marcado' : 'marcados'}` : ''}</small></span>
            <Icone nome="direita" />
          </Link>
        );
      })}
    </>
  );
}

import { useRegiao } from '../ui/FiltroRegiao';
import { filtraTema, questoesTreinoGeral } from '../logica/regiao';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { urlCapa, useMateria, type MateriaCarregada } from '../dados/conteudo';
import { CAIXA_CAPA } from '../dados/capas';
import { MATERIAS, ORDEM_MENU, materia as infoMateria } from '../dados/materias';
import { useEstado, useMateriaEstado } from '../estado/loja';
import { progressoEscada, resumoMateria } from '../logica/estatisticas';
import { agendaDe } from '../logica/revisao';
import { Anel, Barra, Carregando, plural, useTitulo } from '../ui/comum';
import { Icone } from '../ui/Icone';
import { ArteTreinoMateria, CirculoMateria } from '../ui/IconeMateria';
import { IcTema } from '../ui/IconeTema';
import { ProgressoMateria } from '../ui/ProgressoMateria';
import { COPIAS_CICLO, propsCopia, useRoloHorizontal } from '../ui/rolo';
import type { MateriaId } from '../dados/tipos';
import type { EstadoMateria } from '../estado/tipos';
import { useIndiceRevisao } from '../dados/revisao';
import { composicaoRodada, descreveTreino } from '../logica/rodadaTreino';
import { AtalhosGeral } from './RevisaoGeral';

export function ListaMaterias() {
  useTitulo('Matérias');
  return (
    <div className="conteudo">
      <div className="titulo-pag"><div><h1>Matérias</h1><p className="sub">Todas as matérias do ENEM e dos vestibulares.</p></div></div>
      <div className="grade g2">
        {[...MATERIAS].sort((a, b) => (ORDEM_MENU.indexOf(a.id) + 1 || 99) - (ORDEM_MENU.indexOf(b.id) + 1 || 99)).map((m) => ( /* ordem do menu (dono, 27/11/2026) */
          <Link key={m.id} to={`/m/${m.id}`} className={`linha-mat m-${m.id}` + (m.ativa ? '' : ' inativa')}>
            <CirculoMateria m={m.id} tam={56} />
            <span><b>{m.nome}</b><small>{m.ativa ? m.descricao : 'Em preparação. As questões chegam com as provas completas.'}</small></span>
            <Icone nome="direita" />
          </Link>
        ))}
      </div>
    </div>
  );
}

/** Linha de apoio do cabeçalho: número de temas e, se a matéria ainda não tem questões, "questões em preparação"
 *  (o mesmo texto em todas as telas da matéria; nunca "questões reais" numa matéria sem questão). */

/** Cabeçalho de toda tela da matéria (sistema do protótipo): nome em Dancing Script na cor da matéria e a linha de apoio. */
export function CabMateria({ m, nome, sub, titulo = true, children }: { m: MateriaId; nome: string; sub?: string; titulo?: boolean; children?: ReactNode }) {
  return (
    <div className="mat-cab">
      <div className="mat-cab-txt">
        {titulo ? <h1 className="tit-mat">{nome}</h1> : <Link to={`/m/${m}`} className="tit-mat">{nome}</Link>}
        {sub && <p className="mat-sub num">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

/** Capa da matéria (comando 32 do dono): faixa larga (3:1 nas referências REF-CLARO/REF-ESCURO de docs/capas/), fundo suave
 *  da paleta, objetos à direita (montados por scripts/capas.py, na posição e com a sombra da referência) e, à esquerda,
 *  o cabeçalho da matéria (título em Dancing Script). A caixa da arte vem de dados/capas.ts, em frações da referência. */
export function CapaMateria({ m, nome, sub, children }: { m: MateriaId; nome: string; sub?: string; children?: ReactNode }) {
  const url = urlCapa(m);
  const cx = CAIXA_CAPA[m];
  const vars = cx ? { '--cl': cx[0], '--ct': cx[1], '--cr': cx[2], '--cb': cx[3] } as CSSProperties : undefined;
  return (
    <div className="capa-mat-env">
      <header className={'capa-mat' + (url && cx ? ' com-arte' : '')} style={vars}>
        <CabMateria m={m} nome={nome} sub={sub}>{children}</CabMateria>
        {url && cx && <img className="cm-arte" src={url} alt="" decoding="async" fetchPriority="high" />}
      </header>
    </div>
  );
}

/** Faixa de temas: sempre no topo da matéria (vocabulário do produto). Compacta dentro de um tema ou conteúdo. */
export function FaixaTemas({ mc, s, atual, compacta = false }: { mc: MateriaCarregada; s: EstadoMateria; atual?: string; compacta?: boolean }) {
  // rolagem lateral, roda do mouse (girar para baixo anda para a direita) e setas: ui/rolo.ts
  // no computador com mouse, ciclo infinito: a lista é desenhada mais COPIAS_CICLO vezes (cópias fora do leitor e do Tab)
  const { rolo, bordas, mede, anda, ciclo } = useRoloHorizontal(mc.id);
  const rg = useRegiao();
  // Todos os cartões têm a mesma altura (ícone + duas linhas de nome), em todas as matérias. O nome nunca é cortado:
  // o cartão cujo nome pediria 3 ou mais linhas fica mais largo, de 10 em 10 px, até caber em duas.
  const ajusta = () => {
    const r = rolo.current; if (!r) return;
    const itens = [...r.querySelectorAll<HTMLElement>('.ft-item')];
    for (const it of itens) it.style.removeProperty('--ft-w');
    for (const it of itens) {
      const n = it.querySelector<HTMLElement>('.ft-nome'); if (!n) continue;
      const lh = parseFloat(getComputedStyle(n).lineHeight) || 20;
      const linhas = () => { const rg = document.createRange(); rg.selectNodeContents(n); return Math.round(rg.getBoundingClientRect().height / lh); };
      const base = it.getBoundingClientRect().width;
      let w = base;
      while (linhas() > 2 && w < base * 2) { w += 10; it.style.setProperty('--ft-w', `${w}px`); }
      // cartão alargado: mais 10 px de respiro, para a linha mais longa não encostar na borda
      if (w > base) it.style.setProperty('--ft-w', `${w + 10}px`);
    }
    mede();
  };
  useLayoutEffect(() => {
    ajusta();
    let vivo = true;
    document.fonts?.ready.then(() => { if (vivo) ajusta(); });
    addEventListener('resize', ajusta);
    return () => { vivo = false; removeEventListener('resize', ajusta); };
  }, [mc.id, compacta]);
  useEffect(() => {
    const el = rolo.current?.querySelector<HTMLElement>('.ft-item.atual');
    if (el && rolo.current) rolo.current.scrollLeft = el.offsetLeft - rolo.current.clientWidth / 2 + el.clientWidth / 2;
    mede();
  }, [atual]);
  return (
    <nav className={'faixa-temas' + (compacta ? ' compacta' : '') + (bordas.e ? ' fe' : '') + (bordas.d ? ' fd' : '')} aria-label="Faixa de temas">
      {bordas.e && <button className="ft-seta esq" onClick={() => anda(-1)} aria-label="Temas anteriores"><Icone nome="esquerda" /></button>}
      <div className="ft-rolo" ref={rolo} onScroll={mede}>
        {Array.from({ length: ciclo ? COPIAS_CICLO + 1 : 1 }, (_, k) => mc.conteudo.modulos.map((mod) => {
          const p = progressoEscada(questoesDoTema(mc, mod.id, rg.conj), s);
          return (
            <Link key={`${k}-${mod.id}`} to={`/m/${mc.id}/tema/${mod.id}`} className={'ft-item' + (atual === mod.id ? ' atual' : '')} aria-current={atual === mod.id && !k ? 'page' : undefined} {...propsCopia(k)}>
              <span className="ft-ic"><IcTema m={mc.id} tema={mod.id} tam={compacta ? 76 : 112} /></span>
              <span className="ft-nome">{mod.nome}</span>
              <Barra valor={p.total ? p.feitas / p.total : 0} rotulo={`Progresso em ${mod.nome}`} />
            </Link>
          );
        }))}
      </div>
      {bordas.d && <button className="ft-seta dir" onClick={() => anda(1)} aria-label="Próximos temas"><Icone nome="direita" /></button>}
    </nav>
  );
}

/** As questões de prática de um tema pelo filtro de região (soma das listas de cada conteúdo, logica/regiao.ts: filtraTema). */
export function questoesDoTema(mc: MateriaCarregada, modId: string, conj: Parameters<typeof filtraTema>[2]) {
  const mod = mc.conteudo.modulos.find((x) => x.id === modId);
  return mod ? filtraTema(mod.subs.map((x) => x.id), (id) => mc.porSub.get(id) || [], conj).l : [];
}

function EmPreparacao({ m }: { m: MateriaId }) {
  const info = infoMateria(m)!;
  useTitulo(info.nome);
  return (
    <div className={`conteudo m-${m}`}>
      <CapaMateria m={m} nome={info.nome} sub={info.descricao} />
      <section className="bloco preparo">
        <span className="preparo-ic" aria-hidden><Icone nome="camadas" tam={28} /></span>
        <h2>Questões em preparação</h2>
        <p className="miolo">
          {`As questões de ${info.nome} chegam com as provas completas, cada uma com fonte (prova, ano, número e link) e gabarito.`}
        </p>
        <ol className="preparo-passos">
          <li><b>Provas completas</b><span>ENEM e vestibulares de todas as regiões, diretamente das provas oficiais.</span></li>
          <li><b>Gabarito conferido</b><span>Oficial, quando a banca publica; sem ele, o Gabarito do Aprendice, sempre com aviso.</span></li>
          <li><b>Resolução revisada</b><span>Conferida com a fonte e revisada pela banca do Aprendice.</span></li>
        </ol>
        <div className="preparo-acoes">
          <Link to="/provas" className="btn sec">Ver o catálogo de provas</Link>
          <Link to="/simulados" className="btn fantasma">Simulados disponíveis <Icone nome="direita" /></Link>
        </div>
      </section>
    </div>
  );
}

export function Materia() {
  const { m } = useParams() as { m: MateriaId };
  const info = infoMateria(m);
  const mc = useMateria(info?.ativa ? m : null);
  const s = useMateriaEstado(m);
  const e = useEstado();
  const rg = useRegiao();
  // revisão essencial (comando 33): atalho quando algum tema da matéria já tem
  const indRev = useIndiceRevisao(info?.ativa ? m : null);
  const temEssencial = !!indRev && Object.values(indRev.temas).some((t) => t.essencial);
  useTitulo(info?.nome || 'Matéria');
  if (!info) return <div className="conteudo vazio"><h3>Matéria não encontrada</h3><Link to="/materias" className="btn sec">Ver matérias</Link></div>;
  if (!info.ativa) return <EmPreparacao m={m} />;
  if (!mc) return <div className="conteudo"><Carregando /></div>;

  const r = resumoMateria(mc, s, Date.now(), agendaDe(e));
  const ultQ = s.ult ? mc.porId.get(s.ult) : null;
  const nFlash = mc.conteudo.flash.length + mc.conteudo.flashImg.length;
  const temTreino = temTreinoGeral(mc, rg.conj);

  const vazia = mc.banco.length === 0;
  const acertoPct = r.feitas ? Math.round((r.acertos / r.feitas) * 100) : 0;

  return (
    <div className={`conteudo m-${m}`}>
      <CapaMateria m={m} nome={info.nome}>
        {r.feitas > 0 && <div className="mat-anel"><Anel valor={r.acertos / r.feitas} tam={58} espessura={6}>{acertoPct}%</Anel><span className="fraco">de acerto<br />{plural(r.feitas, 'questão feita', 'questões feitas')}</span></div>}
      </CapaMateria>

      <FaixaTemas mc={mc} s={s} />

      {vazia && (
        <section className="bloco preparo">
          <span className="preparo-ic" aria-hidden><Icone nome="camadas" tam={28} /></span>
          <h2>Questões de {info.nome} em preparação</h2>
          <p className="miolo">Os temas já estão disponíveis. As questões chegam com as provas completas, cada uma com fonte (prova, ano, número e link), gabarito e nível de dificuldade.</p>
          <div className="preparo-acoes"><Link to="/simulados" className="btn sec">Ver simulados</Link></div>
        </section>
      )}
      {/* revisão geral (comando 37): visível mesmo antes das questões chegarem */}
      {vazia && <nav className="mat-atalhos mat-atalhos-geral" aria-label={`Revisão de ${info.nome}`}><AtalhosGeral m={m} /></nav>}

      {!vazia && (
      <div className={'mat-topo' + (temTreino ? '' : ' sem-capa')}>
        <div className={'mat-duo' + (temTreino ? '' : ' so-prog')}>
        {temTreino && (
        <CapaTreinoGeral mc={mc} s={s} conj={rg.conj} />
        )}
        <ProgressoMateria mc={mc} s={s} />
        </div>
        <nav className="mat-atalhos" aria-label={`Atalhos de ${info.nome}`}>
          {ultQ && (
            <Link to={`/m/${m}/q/${ultQ.id}?ctx=escada`} className="atalho">
              <Icone nome="play" /><span><b>Continuar de onde parei</b><small>{mc.conteudo.modulos.find((x) => x.id === ultQ.modulo)?.nome} · {ultQ.escola} {ultQ.ano}</small></span><Icone nome="direita" className="at-seta" />
            </Link>
          )}
          {nFlash > 0 && (
          <Link to={`/m/${m}/flashcards`} className="atalho">
            <Icone nome="cartas" /><span><b>Flashcards</b><small>{r.flashVencidos ? `${r.flashVencidos} para revisar hoje` : `${r.flashNovos} cartões novos`}</small></span><Icone nome="direita" className="at-seta" />
          </Link>
          )}
          <AtalhosGeral m={m} />
          {temEssencial && (
            <Link to={`/m/${m}/essencial`} className="atalho">
              <Icone nome="livro" /><span><b>Revisão essencial</b><small>O que mais cai, tema a tema</small></span><Icone nome="direita" className="at-seta" />
            </Link>
          )}
          <Link to="/revisao" className="atalho">
            <Icone nome="repetir" /><span><b>Revisão dos erros</b><small>{r.vencidas ? plural(r.vencidas, 'volta hoje', 'voltam hoje') : 'Em dia'}</small></span><Icone nome="direita" className="at-seta" />
          </Link>
          <Link to="/simulados" className="atalho">
            <Icone nome="relogio" /><span><b>Simulados</b><small>Prova inteira ou por conteúdo</small></span><Icone nome="direita" className="at-seta" />
          </Link>
        </nav>
      </div>
      )}

      <BlocoAreas maxN={Math.max(1, ...mc.conteudo.areas.map((a) => a.mods.length))}>
        {mc.conteudo.areas.map((a) => (
          <div key={a.id} className="area-g" style={{ '--n': a.mods.length } as CSSProperties}>
            <div className="area-cab" title={a.resumo || undefined}><h2>{a.nome}</h2></div>
            <div className="area-lista">
              {/* ordem decrescente de conteúdos dentro da área (dono, 28/11/2026); empate mantém a ordem do programa */}
              {a.mods
                .map((mid, i) => {
                  const mod = mc.conteudo.modulos.find((x) => x.id === mid);
                  return { mid, i, mod, nCont: mod ? mod.subs.filter((x) => mc.porSub.get(x.id)?.length).length : 0 };
                })
                .sort((x, y) => y.nCont - x.nCont || x.i - y.i)
                .map(({ mid, mod, nCont }) => {
                if (!mod) return null;
                // critério único de contagem (filtraTema), o mesmo do tema; quantidade de questões só nos conteúdos (CLAUDE.md)
                const p = progressoEscada(questoesDoTema(mc, mid, rg.conj), s);
                const v = p.total ? p.feitas / p.total : 0;
                return (
                  <Link key={mid} to={`/m/${m}/tema/${mid}`} className="area-tema">
                    <IcTema m={m} tema={mid} tam={72} />
                    <span className="at-txt">
                      <b>{mod.nome}</b>
                      {/* "N conteúdos" saiu (dono, 28/11/2026: "esta informação não precisa"); só o aviso de tema vazio fica */}
                      {!nCont && <small>Em preparação</small>}
                    </span>
                    {/* progresso num círculo com a porcentagem, no lugar da barra (dono, 28/11/2026) */}
                    <span className="at-anel" role="img" aria-label={`Progresso em ${mod.nome}: ${Math.round(v * 100)}%`}>
                      <Anel valor={v} tam={52} espessura={5}>{Math.round(v * 100)}%</Anel>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </BlocoAreas>
    </div>
  );
}

/** Temas por área (dono, 28/11/2026): cada área numa caixa branca que termina onde terminam os seus temas. As colunas
 * têm a mesma largura em todas as áreas (mín. 340 px, como antes): aqui se mede quantas cabem na largura e a largura de
 * cada uma, e o CSS usa `--cols` e `--colw` para a caixa de cada área ter só as colunas dos temas dela. */
export const COL_MIN = 340, COL_MAX = 250, COL_GAP = 24, AREA_PAD = 28;
/** Todos os temas de uma área na mesma linha (dono, 28/11/2026: "na mesma linha"): as colunas têm a largura de antes
 * (mín. 340 px) quando cabem; se a área maior não couber, todas encolhem por igual até a área maior caber numa linha. */
export function colunasAreas(largura: number, maxN: number): { colw: number } {
  const util = largura - 2 * AREA_PAD - 2; // padding e borda da caixa
  const cols = Math.max(1, Math.floor((util + COL_GAP) / (COL_MIN + COL_GAP)));
  const normal = (util - (cols - 1) * COL_GAP) / cols;
  const n = Math.max(1, maxN);
  const cabe = (util - (n - 1) * COL_GAP) / n;
  // colunas estreitas (dono, 28/11/2026: "diminua a largura"): no máximo COL_MAX, tema em pé (ícone e círculo em cima)
  return { colw: Math.floor(Math.min(normal, cabe, COL_MAX) * 100) / 100 };
}

function BlocoAreas({ maxN, children }: { maxN: number; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [colw, setColw] = useState<number | null>(null);
  useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    const mede = () => setColw(colunasAreas(el.clientWidth, maxN).colw);
    mede();
    const ro = new ResizeObserver(mede); ro.observe(el);
    return () => ro.disconnect();
  }, [maxN]);
  const estilo = colw ? ({ '--colw': `${colw}px` } as CSSProperties) : undefined;
  const cls = 'bloco-areas' + (colw ? ' medido' : '') + (colw ? ' estreito' : '');
  return <section ref={ref} className={cls} style={estilo} aria-label="Temas por área">{children}</section>;
}

/** quantas questões, frases e flashcards a matéria tem para o treino geral (na região do aluno) */
function contaTreino(mc: MateriaCarregada, conj: Parameters<typeof questoesTreinoGeral>[2]) {
  const abc = questoesTreinoGeral(mc.conteudo.essencial.abc, mc.banco, conj);
  return { abc, nAbc: abc.length, nComp: mc.conteudo.essencial.completar.length, nFlash: mc.conteudo.flash.length + mc.conteudo.flashImg.length };
}
export function temTreinoGeral(mc: MateriaCarregada, conj: Parameters<typeof questoesTreinoGeral>[2]): boolean {
  const { nAbc, nComp, nFlash } = contaTreino(mc, conj);
  return nAbc + nComp + nFlash > 0;
}

/** Capa do Treino geral (protótipo: .ad-tg). Na página da matéria é um link que já começa o treino; na tela própria do
 *  treino (`/m/<m>/treino`, revisão de 19/11/2026, matérias 27; aprovado pelo dono em 20/11) é a abertura, com o botão. */
export function CapaTreinoGeral({ mc, s, conj, aoComecar }: { mc: MateriaCarregada; s: EstadoMateria; conj: Parameters<typeof questoesTreinoGeral>[2]; aoComecar?: () => void }) {
  const m = mc.id;
  const e = useEstado();
  const info = infoMateria(m)!;
  const tg = e.treino[m];
  const { abc, nAbc, nComp, nFlash } = contaTreino(mc, conj);
  // questões do treino geral na região do aluno (+ ENEM), as mesmas que a rodada sorteia (logica/regiao.ts)
  // contadores da capa do treino geral (protótipo: .ad-tg-n) e a composição de uma rodada (logica/rodadaTreino.ts: 6 questões, 4 frases, 5 flashcards; sem frases e flashcards, mais questões)
  const feitoAbc = abc.filter((id) => s.q[id]?.tent.length).length;
  const feitoComp = mc.conteudo.essencial.completar.filter((c) => s.flash[c.id]).length;
  const feitoFlash = [...mc.conteudo.flash, ...mc.conteudo.flashImg].filter((c) => s.flash[c.id]).length;
  // quantidade de questões só nos conteúdos (CLAUDE.md, vocabulário; revisão 20/11, matérias 1): o contador de questões
  // mostra as feitas e a barra, nunca "x de N"
  // acertos (última resposta certa): quarta linha de cada contador, como no protótipo
  const ultFlashOk = (id: string) => { const h = s.flash[id]?.hist; return !!h?.length && h[h.length - 1].v === 'a'; };
  const okAbc = abc.filter((id) => { const t = s.q[id]?.tent; return !!t?.length && t[t.length - 1].ok; }).length;
  const okComp = mc.conteudo.essencial.completar.filter((c) => ultFlashOk(c.id)).length;
  const okFlash = [...mc.conteudo.flash, ...mc.conteudo.flashImg].filter((c) => ultFlashOk(c.id)).length;
  const { q: nRq, c: nRc, f: nRf } = composicaoRodada(nAbc, nFlash, nComp), porRodada = nRq + nRc + nRf;
  const rotulo = tg && tg.i > 0 && tg.i < tg.it.length ? `Retomar (${tg.i + 1} de ${tg.it.length})` : 'Começar treino';
  const miolo = (
    <>
          <span className="capa-txt">
            {aoComecar ? <h1>Treino geral de {info.nome}</h1> : <h2>Treino geral de {info.nome}</h2>}
            <span className="capa-p">{tg && tg.i > 0 && tg.i < tg.it.length ? 'Seu treino está salvo onde você parou. ' : ''}{descreveTreino(nAbc, nComp, nFlash)}</span>
            <span className="tg-nums">
              {([['Questões de prova', feitoAbc, nAbc, okAbc], ['Frases a completar', feitoComp, nComp, okComp], ['Flashcards', feitoFlash, nFlash, okFlash]] as [string, number, number, number][]).filter(([, , n]) => n > 0).map(([t, f, n, ok]) => (
                <span key={t} className="tg-n"><i>{t}</i><b className="num">{f}<small>{t === 'Questões de prova' ? (f === 1 ? ' feita' : ' feitas') : ` de ${n}`}</small></b><span className="barra" aria-hidden><i style={{ width: `${n ? (f / n) * 100 : 0}%` }} /></span><small className="num">{f ? plural(ok, 'acerto', 'acertos') : '\u00a0'}</small></span>
              ))}
            </span>
            {aoComecar
              ? <button type="button" className="btn btn-capa" onClick={aoComecar}><Icone nome="alvo" /> {rotulo}</button>
              : <span className="btn btn-capa"><Icone nome="alvo" /> {rotulo}</span>}
            <span className="tg-comp num">{porRodada === nRq ? `${plural(nRq, 'questão', 'questões')} por rodada` : `${porRodada} itens por rodada: ${[nRq && plural(nRq, 'questão', 'questões'), nRc && plural(nRc, 'frase', 'frases'), nRf && plural(nRf, 'flashcard', 'flashcards')].filter(Boolean).join(', ').replace(/, ([^,]*)$/, ' e $1')}`}</span>
          </span>
          <ArteTreinoMateria m={m} className="capa-ilu" />
    </>
  );
  return aoComecar
    ? <section className="capa-tg capa-tg-tela" aria-label={`Treino geral de ${info.nome}`}>{miolo}</section>
    : <Link to={`/m/${m}/treino?comecar=1`} className="capa-tg">{miolo}</Link>;
}

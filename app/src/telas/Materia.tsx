import { useRegiao } from '../ui/FiltroRegiao';
import { questoesTreinoGeral } from '../logica/regiao';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useLayoutEffect, type CSSProperties, type ReactNode } from 'react';
import { urlCapa, useMateria, type MateriaCarregada } from '../dados/conteudo';
import { CAIXA_CAPA } from '../dados/capas';
import { MATERIAS, materia as infoMateria } from '../dados/materias';
import { useEstado, useMateriaEstado } from '../estado/loja';
import { progressoEscada, resumoMateria } from '../logica/estatisticas';
import { agendaDe } from '../logica/revisao';
import { Anel, Barra, Carregando, plural, useTitulo } from '../ui/comum';
import { Icone } from '../ui/Icone';
import { ArteTreinoMateria, CirculoMateria } from '../ui/IconeMateria';
import { IcTema } from '../ui/IconeTema';
import { ProgressoMateria } from '../ui/ProgressoMateria';
import { useRoloHorizontal } from '../ui/rolo';
import type { MateriaId } from '../dados/tipos';
import type { EstadoMateria } from '../estado/tipos';
import { useIndiceRevisao } from '../dados/revisao';
import { composicaoRodada, descreveTreino } from '../logica/rodadaTreino';
import { AtalhosGeral } from './RevisaoGeral';

export function ListaMaterias() {
  useTitulo('Matérias');
  return (
    <div className="conteudo">
      <div className="titulo-pag"><div><h1>Matérias</h1><p className="sub">Todas as matérias do vestibular.</p></div></div>
      <div className="grade g2">
        {MATERIAS.map((m) => (
          <Link key={m.id} to={`/m/${m.id}`} className={`linha-mat m-${m.id}` + (m.ativa ? '' : ' inativa')}>
            <CirculoMateria m={m.id} tam={56} />
            <span><b>{m.nome}</b><small>{m.ativa ? m.descricao : 'Em preparação: entra com as provas completas.'}</small></span>
            <Icone nome="direita" />
          </Link>
        ))}
      </div>
    </div>
  );
}

/** Linha de apoio do cabeçalho: número de temas e, se a matéria ainda não tem questões, "questões em preparação"
 *  (o mesmo texto em todas as telas da matéria; nunca "questões reais" numa matéria sem questão). */
export function subMateria(nTemas: number, vazia: boolean): string {
  return `${plural(nTemas, 'tema', 'temas')} · ${vazia ? 'questões em preparação' : 'questões reais, todas com a fonte'}`;
}

/** Cabeçalho de toda tela da matéria (sistema do protótipo): nome em Dancing Script na cor da matéria e a linha de apoio. */
export function CabMateria({ m, nome, sub, titulo = true, children }: { m: MateriaId; nome: string; sub: string; titulo?: boolean; children?: ReactNode }) {
  return (
    <div className="mat-cab">
      <div className="mat-cab-txt">
        {titulo ? <h1 className="tit-mat">{nome}</h1> : <Link to={`/m/${m}`} className="tit-mat">{nome}</Link>}
        <p className="mat-sub num">{sub}</p>
      </div>
      {children}
    </div>
  );
}

/** Capa da matéria (comando 32 do dono): faixa larga (3:1 nas referências REF-CLARO/REF-ESCURO de docs/capas/), fundo suave
 *  da paleta, objetos à direita (montados por scripts/capas.py, na posição e com a sombra da referência) e, à esquerda,
 *  o cabeçalho da matéria (título em Dancing Script). A caixa da arte vem de dados/capas.ts, em frações da referência. */
export function CapaMateria({ m, nome, sub, children }: { m: MateriaId; nome: string; sub: string; children?: ReactNode }) {
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
  const { rolo, bordas, mede, anda } = useRoloHorizontal(mc.id);
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
    <nav className={'faixa-temas' + (compacta ? ' compacta' : '') + (bordas.e ? ' fe' : '') + (bordas.d ? ' fd' : '')} aria-label="Temas">
      {bordas.e && <button className="ft-seta esq" onClick={() => anda(-1)} aria-label="Temas anteriores"><Icone nome="esquerda" /></button>}
      <div className="ft-rolo" ref={rolo} onScroll={mede}>
        {mc.conteudo.modulos.map((mod) => {
          const qs = mc.banco.filter((q) => q.modulo === mod.id);
          const p = progressoEscada(qs, s);
          return (
            <Link key={mod.id} to={`/m/${mc.id}/tema/${mod.id}`} className={'ft-item' + (atual === mod.id ? ' atual' : '')} aria-current={atual === mod.id ? 'page' : undefined}>
              <span className="ft-ic"><IcTema m={mc.id} tema={mod.id} tam={compacta ? 76 : 112} /></span>
              <span className="ft-nome">{mod.nome}</span>
              <Barra valor={p.total ? p.feitas / p.total : 0} rotulo={`Progresso em ${mod.nome}`} />
            </Link>
          );
        })}
      </div>
      {bordas.d && <button className="ft-seta dir" onClick={() => anda(1)} aria-label="Próximos temas"><Icone nome="direita" /></button>}
    </nav>
  );
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
          {`As questões de ${info.nome} chegam com a importação das provas completas: cada uma com o print fiel da prova, a fonte (prova, ano, número, link) e o gabarito oficial. Nenhuma questão é criada ou redigitada.`}
        </p>
        <ol className="preparo-passos">
          <li><b>Provas completas</b><span>ENEM e vestibulares de todas as regiões, baixados da fonte oficial.</span></li>
          <li><b>Gabarito publicado</b><span>Sem gabarito oficial ou resolução reconhecida, a questão não entra.</span></li>
          <li><b>Resolução revisada</b><span>Revisão em lentes: fatos contra a fonte, depois utilidade e estilo de prova.</span></li>
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
  const tg = e.treino[m];
  // questões do treino geral na região do aluno (+ ENEM), as mesmas que a rodada sorteia (logica/regiao.ts)
  const abc = questoesTreinoGeral(mc.conteudo.essencial.abc, mc.banco, rg.conj);
  const nAbc = abc.length, nComp = mc.conteudo.essencial.completar.length;
  const nFlash = mc.conteudo.flash.length + mc.conteudo.flashImg.length;
  const ultQ = s.ult ? mc.porId.get(s.ult) : null;
  // contadores da capa do treino geral (protótipo: .ad-tg-n) e a composição de uma rodada (logica/rodadaTreino.ts: 6 questões, 4 frases, 5 flashcards; sem frases e flashcards, mais questões)
  const feitoAbc = abc.filter((id) => s.q[id]?.tent.length).length;
  const feitoComp = mc.conteudo.essencial.completar.filter((c) => s.flash[c.id]).length;
  const feitoFlash = [...mc.conteudo.flash, ...mc.conteudo.flashImg].filter((c) => s.flash[c.id]).length;
  // acertos (última resposta certa): quarta linha de cada contador, como no protótipo
  const ultFlashOk = (id: string) => { const h = s.flash[id]?.hist; return !!h?.length && h[h.length - 1].v === 'a'; };
  const okAbc = abc.filter((id) => { const t = s.q[id]?.tent; return !!t?.length && t[t.length - 1].ok; }).length;
  const okComp = mc.conteudo.essencial.completar.filter((c) => ultFlashOk(c.id)).length;
  const okFlash = [...mc.conteudo.flash, ...mc.conteudo.flashImg].filter((c) => ultFlashOk(c.id)).length;
  const { q: nRq, c: nRc, f: nRf } = composicaoRodada(nAbc, nFlash, nComp), porRodada = nRq + nRc + nRf;

  const vazia = mc.banco.length === 0;
  const temTreino = nAbc + nComp + nFlash > 0;
  const acertoPct = r.feitas ? Math.round((r.acertos / r.feitas) * 100) : 0;

  return (
    <div className={`conteudo m-${m}`}>
      <CapaMateria m={m} nome={info.nome} sub={subMateria(mc.conteudo.modulos.length, vazia)}>
        {r.feitas > 0 && <div className="mat-anel"><Anel valor={r.acertos / r.feitas} tam={58} espessura={6}>{acertoPct}%</Anel><span className="fraco">de acerto<br />{plural(r.feitas, 'questão feita', 'questões feitas')}</span></div>}
      </CapaMateria>

      <FaixaTemas mc={mc} s={s} />

      {vazia && (
        <section className="bloco preparo">
          <span className="preparo-ic" aria-hidden><Icone nome="camadas" tam={28} /></span>
          <h2>Questões de {info.nome} em preparação</h2>
          <p className="miolo">Os temas já estão aqui. As questões entram com as provas completas: cada uma com o print fiel da prova, a fonte (prova, ano, número, link), o gabarito oficial e o nível de dificuldade. Nenhuma questão é criada ou redigitada.</p>
          <div className="preparo-acoes"><Link to="/simulados" className="btn sec">Ver simulados</Link></div>
        </section>
      )}
      {/* revisão geral (comando 37): visível mesmo antes das questões chegarem */}
      {vazia && <nav className="mat-atalhos mat-atalhos-geral" aria-label={`Revisão de ${info.nome}`}><AtalhosGeral m={m} /></nav>}

      {!vazia && (
      <div className={'mat-topo' + (temTreino ? '' : ' sem-capa')}>
        <div className={'mat-duo' + (temTreino ? '' : ' so-prog')}>
        {temTreino && (
        <Link to={`/m/${m}/treino`} className="capa-tg">
          <span className="capa-txt">
            <h2>Treino geral de {info.nome}</h2>
            <span className="capa-p">{tg ? 'Seu treino está salvo onde você parou. ' : ''}{descreveTreino(nAbc, nComp, nFlash)}</span>
            <span className="tg-nums">
              {([['Questões de prova', feitoAbc, nAbc, okAbc], ['Completar a frase', feitoComp, nComp, okComp], ['Flashcards', feitoFlash, nFlash, okFlash]] as [string, number, number, number][]).filter(([, , n]) => n > 0).map(([t, f, n, ok]) => (
                <span key={t} className="tg-n"><i>{t}</i><b className="num">{f}<small> de {n}</small></b><span className="barra" aria-hidden><i style={{ width: `${n ? (f / n) * 100 : 0}%` }} /></span><small className="num">{f ? plural(ok, 'acerto', 'acertos') : '\u00a0'}</small></span>
              ))}
            </span>
            <span className="btn btn-capa"><Icone nome="alvo" /> {tg ? `Retomar (${tg.i} de ${tg.it.length})` : 'Começar treino'}</span>
            <span className="tg-comp num">{porRodada === nRq ? `${plural(nRq, 'questão', 'questões')} por rodada` : `${porRodada} itens por rodada: ${[nRq && plural(nRq, 'questão', 'questões'), nRc && plural(nRc, 'frase', 'frases'), nRf && plural(nRf, 'flashcard', 'flashcards')].filter(Boolean).join(', ').replace(/, ([^,]*)$/, ' e $1')}`}</span>
          </span>
          <ArteTreinoMateria m={m} className="capa-ilu" />
        </Link>
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
            <Icone nome="repetir" /><span><b>Revisão dos erros</b><small>{r.vencidas ? plural(r.vencidas, 'questão vencida', 'questões vencidas') : 'Nada vencido hoje'}</small></span><Icone nome="direita" className="at-seta" />
          </Link>
          <Link to="/simulados" className="atalho">
            <Icone nome="relogio" /><span><b>Simulados</b><small>Provas completas, por ano</small></span><Icone nome="direita" className="at-seta" />
          </Link>
        </nav>
      </div>
      )}

      <section className="bloco-areas" aria-label="Temas por área">
        {mc.conteudo.areas.map((a) => (
          <div key={a.id} className="area-g">
            <div className="area-cab" title={a.resumo || undefined}><h2>{a.nome}</h2></div>
            <div className="area-lista">
              {a.mods.map((mid) => {
                const mod = mc.conteudo.modulos.find((x) => x.id === mid);
                if (!mod) return null;
                const qs = mc.banco.filter((q) => q.modulo === mid);
                const p = progressoEscada(qs, s);
                const nCont = mod.subs.filter((x) => mc.porSub.get(x.id)?.length).length;
                const v = p.total ? p.feitas / p.total : 0;
                return (
                  <Link key={mid} to={`/m/${m}/tema/${mid}`} className="area-tema">
                    <IcTema m={m} tema={mid} tam={72} />
                    <span className="at-txt">
                      <b>{mod.nome}</b>
                      <Barra valor={v} rotulo={`Progresso em ${mod.nome}`} />
                      <small className="num">{nCont ? `${plural(nCont, 'conteúdo', 'conteúdos')} · ${p.feitas} de ${p.total} feitas` : 'Em preparação'}</small>
                    </span>
                    <span className="at-pc num">{Math.round(v * 100)}%</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

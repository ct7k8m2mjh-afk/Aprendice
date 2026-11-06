import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { carregaFiguras, useMateria } from '../dados/conteudo';
import { materia as infoMateria } from '../dados/materias';
import { useMateriaEstado } from '../estado/loja';
import { progressoEscada } from '../logica/estatisticas';
import { desempenhoPorNivel, nomeNivel } from '../logica/nivel';
import { Barra, Carregando, cap, plural, useTitulo } from '../ui/comum';
import { Icone } from '../ui/Icone';
import { IcTema } from '../ui/IconeTema';
import { CabMateria, subMateria, FaixaTemas } from './Materia';
import { comFracoes } from '../ui/Fracao';
import { contaEhTexto, materiaDoCodigo } from '../logica/fracao';
import type { CartaoTeoria, Figura, MateriaId, Modulo } from '../dados/tipos';
import { Formula, TextoMat, ehLatex } from '../ui/Formula';
import { useIndiceRevisao } from '../dados/revisao';
import { emDias } from '../logica/revisao';
import type { EstadoMateria } from '../estado/tipos';

export function CartaoTeoriaView({ c, figs }: { c: CartaoTeoria; figs?: Figura[] }) {
  return (
    <article className="cartao-teoria">
      <h3>{c.titulo}</h3>
      {c.oque && <p>{c.oque}</p>}
      {c.identificar && <p><b>Como reconhecer na prova. </b>{c.identificar.replace(/^Pistas:\s*/i, '')}</p>}
      {c.exemplo && <p><b>Exemplo. </b>{c.exemplo}</p>}
      {c.caderno && c.caderno.length > 0 && (
        <ul className="caderno">{c.caderno.map((x, i) => ehLatex(x)
          // revisão (docs/revisao): texto na letra da interface com as fórmulas entre $…$ à mão
          ? <li key={i} className="texto com-fm"><TextoMat t={x} prosa={contaEhTexto('1 + 1', materiaDoCodigo(c.sub))} /></li>
          : <li key={i} className={contaEhTexto(x, materiaDoCodigo(c.sub)) ? 'texto' : undefined}>{comFracoes(x)}</li>)}</ul>
      )}
      {c.cuidado && <p className="cuidado"><Icone nome="info" tam={16} /> <span><b>Cuidado: </b>{c.cuidado}</span></p>}
      {figs && figs.map((f, i) => (
        <figure key={i} className="fig-teoria">
          <img src={f.u} alt={f.t} loading="lazy" />
          <figcaption>{f.t}<small>{f.fonte}</small></figcaption>
        </figure>
      ))}
    </article>
  );
}

export function TeoriaModulo({ m, mod }: { m: MateriaId; mod: Modulo }) {
  const [figs, setFigs] = useState<Figura[]>([]);
  useEffect(() => { carregaFiguras(m).then((f) => setFigs(f[mod.id] || [])); }, [m, mod.id]);
  return (
    <div className="teoria">
      <section className="bloco teoria-resumo">
        <p className="resumo-mod">{mod.resumo}</p>
        {mod.formulas.length > 0 && (<><h3>No caderno</h3><ul className="caderno">{mod.formulas.map((f, i) => ehLatex(f)
          ? (contaEhTexto('1 + 1', m) ? <li key={i} className="texto"><Formula tex={f} prosa /></li> : <li key={i}><Formula tex={f} bloco={false} /></li>)
          : <li key={i} className={contaEhTexto(f, m) ? 'texto' : undefined}>{comFracoes(f)}</li>)}</ul></>)}
        {mod.erro && <p className="cuidado"><Icone nome="info" tam={16} /> <span><b>Erro que mais derruba: </b>{mod.erro}</span></p>}
      </section>
      <div className="grade g2" style={{ marginTop: 16 }}>
        {mod.cartoes.map((c, i) => <CartaoTeoriaView key={i} c={c} figs={figs.filter((f) => f.subs.includes(c.sub)).slice(0, 2)} />)}
      </div>
    </div>
  );
}

/** Primeira frase do cartão de teoria do conteúdo: o resumo de uma linha em "O que você vai encontrar". */
function fraseDe(mod: Modulo, sub: string): string {
  const c = mod.cartoes.find((x) => x.sub === sub && x.oque);
  if (!c?.oque) return '';
  const m = c.oque.match(/^.+?[.!?](?=\s|$)/);
  return (m ? m[0] : c.oque).trim();
}

/** Tela do tema (sistema do protótipo, #v-modulo): "Todos os temas", capa do tema (ícone, números, barras por nível,
 *  Começar e Teoria em cartões) e "O que você vai encontrar" (os conteúdos, cada um com a sua frase). */
export function Tema() {
  const { m, mod: modId } = useParams() as { m: MateriaId; mod: string };
  const [qs, setQs] = useSearchParams();
  const abaPedida = qs.get('aba') === 'teoria' ? 'teoria' : qs.get('aba') === 'revisao' ? 'revisao' : 'conteudos';
  const mc = useMateria(m);
  const s = useMateriaEstado(m);
  const mod = mc?.conteudo.modulos.find((x) => x.id === modId);
  const indRev = useIndiceRevisao(m);
  useTitulo(mod?.nome || 'Tema');
  if (!mc) return <div className="conteudo"><Carregando /></div>;
  if (!mod) return <div className="conteudo vazio"><h3>Tema não encontrado</h3><Link className="btn sec" to={`/m/${m}`}>Voltar à matéria</Link></div>;

  const nomeMat = infoMateria(m)?.nome || '';
  const mods = mc.conteudo.modulos;
  const idx = mods.findIndex((x) => x.id === mod.id);
  const ant = idx > 0 ? mods[idx - 1] : undefined;
  const prox = idx < mods.length - 1 ? mods[idx + 1] : undefined;
  const subs = mod.subs.filter((x) => mc.porSub.get(x.id)?.length);
  const todas = mc.banco.filter((q) => q.modulo === mod.id);
  const p = progressoEscada(todas, s);
  const niveis = desempenhoPorNivel(todas, s);
  const temTeoria = mod.cartoes.length > 0 || !!mod.resumo;
  // revisão em slides do tema (docs/revisao/<m>/<TEMA>.json): conteúdos com slides
  const revTema = indRev?.temas[mod.id];
  const subsRev = revTema ? mod.subs.filter((x) => revTema.subs[x.id]) : [];
  // revisão essencial (comando 33): quando o tema tem, ela é a revisão; os slides ficam como "Aprofundar"
  const nEss = revTema?.essencial || 0;
  const temRev = subsRev.length > 0 || nEss > 0;
  const aba = abaPedida === 'teoria' && temTeoria ? 'teoria' : abaPedida === 'revisao' && temRev ? 'revisao' : 'conteudos';
  // Começar: o primeiro conteúdo com questão por fazer, na ordem do mais fácil ao mais difícil
  let alvo: string | undefined;
  for (const sub of subs) { const q = mc.porSub.get(sub.id)!.find((x) => !s.q[x.id]?.tent.length); if (q) { alvo = q.id; break; } }
  const primeira = subs.length ? mc.porSub.get(subs[0].id)![0].id : undefined;
  const destino = alvo || primeira;

  return (
    <div className={`conteudo m-${m}`}>
      <CabMateria m={m} nome={nomeMat} sub={subMateria(mods.length, mc.banco.length === 0)} titulo={false} />
      <FaixaTemas mc={mc} s={s} atual={mod.id} compacta />
      <div className="tp-topo"><Link to={`/m/${m}`} className="tp-volta"><Icone nome="esquerda" />Todos os temas</Link></div>

      <section className="tp-capa" aria-labelledby="tp-tit">
        <div className="tp-cab">
          <span className="tp-ic"><IcTema m={m} tema={mod.id} tam={100} /></span>
          <div className="tp-cab-txt">
            <p className="tp-rot num">Tema {idx + 1} de {mods.length} · {nomeMat}</p>
            <h1 id="tp-tit">{mod.nome}</h1>
            <p className="tp-stat num">
              {todas.length
                ? <><b>{p.feitas}</b> de {todas.length} respondidas · acerto <b>{p.feitas ? `${Math.round((p.certas / p.feitas) * 100)}%` : '—'}</b> · {plural(subs.length, 'conteúdo', 'conteúdos')}</>
                : 'Questões em preparação'}
            </p>
          </div>
        </div>
        {todas.length > 0 && (
          <div className="tp-niveis" role="list" aria-label="Progresso por nível">
            {niveis.map((n) => (
              <div key={n.nivel} className="tp-nivel" role="listitem">
                <span className="r">{nomeNivel(n.nivel)}</span><span className="n num">{n.feitas} de {n.total}</span>
                <Barra valor={n.total ? n.feitas / n.total : 0} rotulo={`${nomeNivel(n.nivel)}: ${n.feitas} de ${n.total}`} />
              </div>
            ))}
          </div>
        )}
        <div className="tp-acoes">
          {destino && <Link to={`/m/${m}/q/${destino}?ctx=escada`} className="btn tp-comecar"><Icone nome="raio" />{p.feitas === 0 ? 'Começar' : alvo ? 'Continuar' : 'Refazer'}</Link>}
          {todas.length > 0 && <p className="tp-comp num">{plural(todas.length, 'questão', 'questões')} de {plural(subs.length, 'conteúdo', 'conteúdos')} · do mais fácil ao mais difícil</p>}
          {temRev && (
            <button className="btn sec tp-teo tp-rev" aria-pressed={aba === 'revisao'} onClick={() => setQs(aba === 'revisao' ? {} : { aba: 'revisao' }, { replace: true })}>
              <Icone nome="play" />{aba === 'revisao' ? 'Ver os conteúdos' : nEss ? 'Revisão' : 'Revisão em slides'}
            </button>
          )}
          {temTeoria && (
            <button className={'btn sec tp-teo' + (temRev ? ' tp-teo2' : '')} aria-pressed={aba === 'teoria'} onClick={() => setQs(aba === 'teoria' ? {} : { aba: 'teoria' }, { replace: true })}>
              <Icone nome="livro" />{aba === 'teoria' ? 'Ver os conteúdos' : `Teoria em cartões · ${mod.cartoes.length}`}
            </button>
          )}
        </div>
      </section>

      {aba === 'revisao' ? (
        <>
          {nEss > 0 && (
            <section className="tp-bloco es-chamada" aria-labelledby="tp-ess-tit">
              <h2 id="tp-ess-tit" className="tp-h">Revisão essencial</h2>
              <p className="miolo tp-rev-p">Só o que todo aluno precisa saber e o que mais cai: o termômetro, o mapa mental do tema, {plural(nEss, 'tela', 'telas')} de conteúdo, uma questão resolvida e a conexão com outras matérias.</p>
              <Link className="btn tp-comecar" to={`/m/${m}/essencial/${mod.id}`}><Icone nome="play" />Começar a revisão</Link>
            </section>
          )}
          {subsRev.length > 0 && (nEss > 0
            ? <details className="tp-bloco es-aprofundar-tema"><summary className="tp-h">Aprofundar: revisão completa em slides</summary>
                <RevisaoDoTema m={m} mod={mod} subs={subsRev.map((x) => ({ ...x, n: revTema!.subs[x.id] }))} s={s} questoes={(id) => mc.porSub.get(id)?.length || 0} embutida />
              </details>
            : <RevisaoDoTema m={m} mod={mod} subs={subsRev.map((x) => ({ ...x, n: revTema!.subs[x.id] }))} s={s} questoes={(id) => mc.porSub.get(id)?.length || 0} />)}
        </>
      ) : aba === 'teoria' ? (
        <section className="tp-bloco" aria-labelledby="tp-teo-tit">
          <h2 id="tp-teo-tit" className="tp-h">Teoria em cartões <small className="num">{plural(mod.cartoes.length, 'cartão', 'cartões')}</small></h2>
          <TeoriaModulo m={m} mod={mod} />
        </section>
      ) : !subs.length ? (
        <section className="tp-bloco preparo">
          <h2 className="tp-h">Questões em preparação</h2>
          <p className="miolo">As questões de {mod.nome.toLowerCase()} entram com as provas completas: print fiel da prova, fonte (prova, ano, número, link) e gabarito oficial. Cada uma recebe o seu nível: básico, intermediário ou avançado.</p>
          <div className="preparo-acoes"><Link to="/simulados" className="btn sec">Ver simulados</Link></div>
        </section>
      ) : (
        <section className="tp-bloco" aria-labelledby="tp-enc-tit">
          <h2 id="tp-enc-tit" className="tp-h">O que você vai encontrar <small className="num">{plural(subs.length, 'conteúdo', 'conteúdos')}</small></h2>
          <ul className="tp-enc">
            {subs.map((sub) => {
              const l = mc.porSub.get(sub.id)!;
              const pe = progressoEscada(l, s);
              const frase = fraseDe(mod, sub.id);
              return (
                <li key={sub.id}>
                  <Link to={`/m/${m}/escada/${sub.id}`}>
                    <i className="ponto-sub" aria-hidden />
                    <span className="t"><b>{cap(sub.nome)}</b>{frase && <span>{frase}</span>}</span>
                    <span className="p"><span className="num">{pe.feitas}/{pe.total}</span><Barra valor={pe.total ? pe.feitas / pe.total : 0} rotulo={`Progresso em ${sub.nome}`} /></span>
                    <Icone nome="direita" className="tp-seta" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {(ant || prox) && (
        <nav className="tp-viz" aria-label="Outros temas">
          {ant ? <Link to={`/m/${m}/tema/${ant.id}`}><Icone nome="esquerda" /><span><small>Tema anterior</small><b>{ant.nome}</b></span></Link> : <span />}
          {prox && <Link to={`/m/${m}/tema/${prox.id}`} className="d"><span><small>Próximo tema</small><b>{prox.nome}</b></span><Icone nome="direita" /></Link>}
        </nav>
      )}
    </div>
  );
}

/** Aba "Revisão em slides" do tema: os conteúdos com revisão, cada um com o ciclo de 5 tempos e quando volta. */
function RevisaoDoTema({ m, mod, subs, s, questoes, embutida }: { m: MateriaId; mod: Modulo; subs: { id: string; nome: string; n: number }[]; s: EstadoMateria; questoes: (sub: string) => number; embutida?: boolean }) {
  const agora = Date.now();
  return (
    <section className={embutida ? 'tp-rev-embutida' : 'tp-bloco'} aria-labelledby="tp-rev-tit">
      {!embutida && <h2 id="tp-rev-tit" className="tp-h">Revisão em slides <small className="num">{plural(subs.length, 'conteúdo', 'conteúdos')}</small></h2>}
      <p className="miolo tp-rev-p">Cada conteúdo em 5 tempos: pergunta primeiro, ver acontecer, lembrar sem olhar, aplicar numa questão nova e voltar no dia certo.</p>
      <ul className="tp-enc tp-rev-l">
        {subs.map((sub) => {
          const r = s.revs?.[sub.id];
          const est = r?.and ? 'Continuar de onde parou' : !r?.hist.length ? 'Nova' : r.vence <= agora ? 'Para revisar hoje' : `Volta ${emDias(r.vence, agora)}`;
          const nq = questoes(sub.id);
          return (
            <li key={sub.id}>
              <Link to={`/m/${m}/revisao/${sub.id}`}>
                <i className="ponto-sub" aria-hidden />
                <span className="t"><b>{cap(sub.nome)}</b><span>{plural(sub.n, 'slide', 'slides')}{nq ? ` · ${plural(nq, 'questão', 'questões')}` : ''}{fraseDe(mod, sub.id) ? ` · ${fraseDe(mod, sub.id)}` : ''}</span></span>
                <span className="p"><span className={'etq ' + (r?.and ? 'cor' : r?.hist.length && r.vence <= agora ? 'aviso' : '')}>{est}</span></span>
                <Icone nome="direita" className="tp-seta" />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

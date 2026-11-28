import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useMateria } from '../dados/conteudo';
import { materia as infoMateria } from '../dados/materias';
import { pegaEstado, useMateriaEstado } from '../estado/loja';
import { progressoEscada } from '../logica/estatisticas';
import { NIVEIS, desempenhoPorNivel, feedbackNiveis, nivelDe, nomeNivel, ordemEvolucao } from '../logica/nivel';
import { agendaDe, filaDe, emDias } from '../logica/revisao';
import { Barra, Carregando, cap, plural, useTitulo } from '../ui/comum';
import { Icone } from '../ui/Icone';
import { CartaoTeoriaView } from './Tema';
import { CabMateria, FaixaTemas } from './Materia';
import type { MateriaId } from '../dados/tipos';
import { textoDegrau } from '../logica/escada';
import { useResumos } from '../dados/revisao';
import { ResumoSubtemaView } from '../ui/revisao/ResumoSubtema';
import { AvisoRegiao, FiltroRegiaoChips, useRegiao } from '../ui/FiltroRegiao';
import { filtraRegiao, passa } from '../logica/regiao';
import { ETIQUETA_OCULTO } from '../dados/modoAdmin';
import type { Questao } from '../dados/tipos';

/** Modo administrador (dono, 20/11/2026): questão escondida do aluno, na lista com a etiqueta "oculto para o aluno". */
function DegrauOculto({ m, q }: { m: MateriaId; q: Questao }) {
  return (
    <li>
      <Link to={`/m/${m}/q/${q.id}?ctx=escada`} className="degrau indisp">
        <span className="dg-n" aria-hidden><i className="dg-ponto" /></span>
        <span className="dg-txt">
          <b>{textoDegrau(q, false).titulo}</b>
          <span className="etq aviso">{ETIQUETA_OCULTO}</span>
          {q.pendente && <small>{q.pendente}</small>}
        </span>
        <Icone nome="direita" />
      </Link>
    </li>
  );
}

/**
 * Conteúdo (rota antiga /escada, mantida para não quebrar links e progresso): as questões reais do conteúdo,
 * cada uma com o seu nível. "Treine sua evolução" percorre do básico ao avançado; dá para treinar um nível só.
 */
export function Escada() {
  const { m, sub } = useParams() as { m: MateriaId; sub: string };
  const mc = useMateria(m);
  const s = useMateriaEstado(m);
  const ag = agendaDe(pegaEstado());
  const [teoria, setTeoria] = useState(false);
  const rg = useRegiao();
  const resumos = useResumos(m); // comando 35: resumo curto do conteúdo
  const mod = mc?.conteudo.modulos.find((x) => x.id === sub.split('.')[0]);
  const conteudo = mod?.subs.find((x) => x.id === sub);
  useTitulo(conteudo ? cap(conteudo.nome) : 'Conteúdo');
  if (!mc) return <div className="conteudo"><Carregando /></div>;
  const todasRegioes = mc.porSub.get(sub) || [];
  // pedido do dono (09/11/2026): o aluno pratica com as provas da região dele (+ ENEM); sem nenhuma, todas as regiões
  const fr = filtraRegiao(todasRegioes, rg.conj);
  const l = fr.l;
  if (!mod || !conteudo) return <div className="conteudo vazio"><h3>Conteúdo não encontrado</h3><Link className="btn sec" to={`/m/${m}`}>Voltar</Link></div>;
  // modo administrador: o que o aluno não vê (vazio para o aluno)
  const ocultas = mc.ocultasPorSub?.get(sub) || [];
  if (!l.length) return (
    <div className="conteudo vazio"><h3>{cap(conteudo.nome)}</h3><p>As questões deste conteúdo estão em preparação.</p><Link className="btn sec" to={`/m/${m}/tema/${mod.id}`}>Voltar ao tema</Link>
      {ocultas.length > 0 && <ol className="degraus">{ocultas.map((q) => <DegrauOculto key={q.id} m={m} q={q} />)}</ol>}
    </div>
  );
  const p = progressoEscada(l, s);
  const prox = l.find((q) => !s.q[q.id]?.tent.length);
  const cartoes = mod.cartoes.filter((c) => c.sub === sub);
  const niveis = desempenhoPorNivel(l, s);
  const feedback = feedbackNiveis(niveis);
  // questões indisponíveis (dono, 19/11/2026): na lista, com o selo, fora da contagem, do Treine sua evolução e dos níveis
  const indisp = (mc.indispPorSub?.get(sub) || []).filter((q) => fr.reserva || passa(q, rg.conj));

  return (
    <div className={`conteudo m-${m}`}>
      <CabMateria m={m} nome={infoMateria(m)?.nome || ''} titulo={false} />
      <FaixaTemas mc={mc} s={s} atual={mod.id} compacta />
      <div className="pag-estreita">
      <nav className="migalhas" aria-label="Você está em">
        <Link to={`/m/${m}`}>{infoMateria(m)?.nome}</Link><Icone nome="direita" tam={14} />
        <Link to={`/m/${m}/tema/${mod.id}`}>{mod.nome}</Link><Icone nome="direita" tam={14} /><span aria-current="page">{cap(conteudo.nome)}</span>
      </nav>
      <div className="tema-cab">
        <h1>{cap(conteudo!.nome)}</h1>
        <p className="sub num">{plural(l.length, 'questão real', 'questões reais')} · do básico ao avançado</p>
      </div>
      <FiltroRegiaoChips />
      <AvisoRegiao f={fr} />

      <div className="escada-acao folha">
        <div style={{ flex: 1 }}>
          <b>Treine sua evolução</b>
          <p className="fraco" style={{ fontSize: 14, margin: '2px 0 8px' }}>Do básico ao avançado: você identifica em que nível tem mais dificuldade.</p>
          <span className="num fraco" style={{ fontSize: 14 }}>{p.feitas} de {p.total} feitas · {p.certas} certas</span>
          <Barra valor={p.feitas / p.total} rotulo="Progresso no conteúdo" />
        </div>
        <Link to={`/m/${m}/q/${(prox || l[0]).id}?ctx=escada`} className="btn">{p.feitas === 0 ? 'Começar' : prox ? 'Continuar' : 'Refazer do início'} <Icone nome="direita" /></Link>
      </div>

      {resumos?.[sub]?.length ? (
        <section className="secao tp-bloco rs-secao" aria-label="Resumo do conteúdo">
          <h2 className="sec-tit">Resumo</h2>
          {resumos[sub].map((r, k) => <ResumoSubtemaView key={k} m={m} r={r} />)}
        </section>
      ) : null}

      <section className="secao">
        <h2 className="sec-tit">Por nível</h2>
        <div className="niveis">
          {niveis.map((d) => {
            const lv = l.filter((q) => nivelDe(q.dif) === d.nivel);
            // nível sem questão da região: o botão treina o nível com as de outras regiões (nunca sem questão)
            const lvOutras = lv.length ? [] : todasRegioes.filter((q) => nivelDe(q.dif) === d.nivel);
            const pv = lv.find((q) => !s.q[q.id]?.tent.length) || lv[0] || lvOutras[0];
            const fraco = d.acerto !== null && d.feitas >= 3 && d.acerto < 0.6;
            return (
              // apagado só o nível sem questão nenhuma (sem botão); o que treina com as de outras regiões fica normal, com a frase
              // em `fraco` (revisão de 21/11, N2: a opacidade derrubava o contraste e o cartão parecia desativado com botão ativo)
              <div key={d.nivel} className={'nivel-cartao' + (pv ? '' : ' vazio')}>
                <span className={`nivel-etq n-${d.nivel}`}>{nomeNivel(d.nivel)}</span>
                {lv.length > 0 && <span className="num nv-qtd">{plural(d.total, 'questão', 'questões')}</span>}
                {lv.length > 0 && <span className={'num nv-acerto' + (fraco ? ' err' : '')}>{d.acerto === null ? 'Ainda sem respostas' : `${Math.round(d.acerto * 100)}% de acerto · ${plural(d.feitas, 'feita', 'feitas')}`}</span>}
                {lvOutras.length > 0 && <span className="fraco nv-outras">{plural(lvOutras.length, 'questão', 'questões')} de outras regiões</span>}
                {pv
                  ? <Link to={`/m/${m}/q/${pv.id}?ctx=nivel&nv=${d.nivel}`} className="btn peq sec">Treinar {nomeNivel(d.nivel).toLowerCase()}</Link>
                  : <span className="fraco" style={{ fontSize: 14 }}>Ainda sem questões neste nível</span>}
              </div>
            );
          })}
        </div>
        {feedback && <p className="feedback-nivel"><Icone nome="lampada" tam={18} /><span>{feedback}</span></p>}
      </section>

      {cartoes.length > 0 && (
        <section className="secao">
          <button className="sanfona" aria-expanded={teoria} onClick={() => setTeoria(!teoria)}>
            <Icone nome="livro" /> <span>Teoria antes de começar</span><Icone nome="baixo" className={teoria ? 'gira' : ''} />
          </button>
          {teoria && cartoes.map((c, i) => <CartaoTeoriaView key={i} c={c} />)}
        </section>
      )}

      {NIVEIS.map((nv) => {
        const lv = l.filter((q) => nivelDe(q.dif) === nv.id);
        const li = indisp.filter((q) => nivelDe(q.dif) === nv.id);
        const lo = ocultas.filter((q) => nivelDe(q.dif) === nv.id);
        if (!lv.length && !li.length && !lo.length) return null;
        return (
          <section key={nv.id} className="secao">
            <h2 className="sec-tit">{nv.nome}</h2>
            <ol className="degraus">
              {/* a indisponível (dono, 19/11/2026) entra na ordem de dificuldade, com o selo */}
              {[...lv, ...li, ...lo].sort(ordemEvolucao).map((q) => {
                if (lo.includes(q)) return <DegrauOculto key={q.id} m={m} q={q} />;
                if (q.indisponivel) return (
                  <li key={q.id}>
                    <Link to={`/m/${m}/q/${q.id}?ctx=escada`} className="degrau indisp">
                      <span className="dg-n" aria-hidden><i className="dg-ponto" /></span>
                      <span className="dg-txt">
                        <b>{textoDegrau(q, false).titulo}</b>
                        <span className="etq aviso">Questão indisponível</span>
                      </span>
                      <Icone nome="direita" />
                    </Link>
                  </li>
                );
                const t = s.q[q.id]?.tent || [];
                const ult = t[t.length - 1];
                const f = filaDe(s.q[q.id], ag);
                // o conceito só depois de responder (não entrega a resposta antes; logica/escada.ts)
                const tx = textoDegrau(q, !!ult);
                const apoio = [tx.apoio, f ? `volta ${emDias(f.vence)}` : ''].filter(Boolean).join(' · ');
                return (
                  <li key={q.id}>
                    <Link to={`/m/${m}/q/${q.id}?ctx=escada`} className={'degrau' + (ult ? (ult.ok ? ' ok' : ' err') : '') + (q.id === prox?.id ? ' prox' : '')}>
                      <span className="dg-n num" aria-label={ult ? (ult.ok ? 'Acertou' : 'Errou') : 'Não feita'}>{ult ? <Icone nome={ult.ok ? 'check' : 'fechar'} tam={16} /> : <i className="dg-ponto" />}</span>
                      <span className="dg-txt">
                        <b>{tx.titulo}</b>
                        {apoio && <small>{apoio}</small>}
                      </span>
                      <Icone nome="direita" />
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}
      </div>
    </div>
  );
}

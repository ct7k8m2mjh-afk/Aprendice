import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useMateria } from '../dados/conteudo';
import { materia as infoMateria } from '../dados/materias';
import { useMateriaEstado } from '../estado/loja';
import { progressoEscada } from '../logica/estatisticas';
import { NIVEIS, desempenhoPorNivel, feedbackNiveis, nivelDe, nomeNivel } from '../logica/nivel';
import { filaDe, emDias } from '../logica/revisao';
import { Barra, Carregando, cap, plural, useTitulo } from '../ui/comum';
import { Icone } from '../ui/Icone';
import { CartaoTeoriaView } from './Tema';
import { CabMateria, subMateria, FaixaTemas } from './Materia';
import type { MateriaId } from '../dados/tipos';
import { numeroQuestao } from '../dados/tipos';

/**
 * Conteúdo (rota antiga /escada, mantida para não quebrar links e progresso): as questões reais do conteúdo,
 * cada uma com o seu nível. "Treine sua evolução" percorre do básico ao avançado; dá para treinar um nível só.
 */
export function Escada() {
  const { m, sub } = useParams() as { m: MateriaId; sub: string };
  const mc = useMateria(m);
  const s = useMateriaEstado(m);
  const [teoria, setTeoria] = useState(false);
  const mod = mc?.conteudo.modulos.find((x) => x.id === sub.split('.')[0]);
  const conteudo = mod?.subs.find((x) => x.id === sub);
  useTitulo(conteudo ? cap(conteudo.nome) : 'Conteúdo');
  if (!mc) return <div className="conteudo"><Carregando /></div>;
  const l = mc.porSub.get(sub) || [];
  if (!mod || !conteudo) return <div className="conteudo vazio"><h3>Conteúdo não encontrado</h3><Link className="btn sec" to={`/m/${m}`}>Voltar</Link></div>;
  if (!l.length) return <div className="conteudo vazio"><h3>{cap(conteudo.nome)}</h3><p>Este conteúdo está sem questões no momento. Questões novas estão em preparação.</p><Link className="btn sec" to={`/m/${m}/tema/${mod.id}`}>Voltar ao tema</Link></div>;
  const p = progressoEscada(l, s);
  const prox = l.find((q) => !s.q[q.id]?.tent.length);
  const cartoes = mod.cartoes.filter((c) => c.sub === sub);
  const niveis = desempenhoPorNivel(l, s);
  const feedback = feedbackNiveis(niveis);

  return (
    <div className={`conteudo m-${m}`}>
      <CabMateria m={m} nome={infoMateria(m)?.nome || ''} sub={subMateria(mc.conteudo.modulos.length, mc.banco.length === 0)} titulo={false} />
      <FaixaTemas mc={mc} s={s} atual={mod.id} compacta />
      <div className="pag-estreita">
      <nav className="migalhas" aria-label="Você está em">
        <Link to={`/m/${m}`}>{infoMateria(m)?.nome}</Link><Icone nome="direita" tam={14} />
        <Link to={`/m/${m}/tema/${mod.id}`}>{mod.nome}</Link><Icone nome="direita" tam={14} /><span>Conteúdo</span>
      </nav>
      <div className="tema-cab">
        <h1>{cap(conteudo!.nome)}</h1>
        <p className="sub num">{plural(l.length, 'questão real', 'questões reais')} · do básico ao avançado</p>
      </div>

      <div className="escada-acao folha">
        <div style={{ flex: 1 }}>
          <b>Treine sua evolução</b>
          <p className="fraco" style={{ fontSize: 14, margin: '2px 0 8px' }}>Do mais fácil ao mais difícil, para você subir de nível com base.</p>
          <span className="num fraco" style={{ fontSize: 14 }}>{p.feitas} de {p.total} feitas · {p.certas} certas</span>
          <Barra valor={p.feitas / p.total} rotulo="Progresso no conteúdo" />
        </div>
        <Link to={`/m/${m}/q/${(prox || l[0]).id}?ctx=escada`} className="btn">{p.feitas === 0 ? 'Começar' : prox ? 'Continuar' : 'Refazer do início'} <Icone nome="direita" /></Link>
      </div>

      <section className="secao">
        <h2 className="sec-tit">Por nível</h2>
        <div className="niveis">
          {niveis.map((d) => {
            const lv = l.filter((q) => nivelDe(q.dif) === d.nivel);
            const pv = lv.find((q) => !s.q[q.id]?.tent.length) || lv[0];
            const fraco = d.acerto !== null && d.feitas >= 3 && d.acerto < 0.6;
            return (
              <div key={d.nivel} className={'nivel-cartao' + (lv.length ? '' : ' vazio')}>
                <span className={`nivel-etq n-${d.nivel}`}>{nomeNivel(d.nivel)}</span>
                {lv.length > 0 && <span className="num nv-qtd">{plural(d.total, 'questão', 'questões')}</span>}
                {lv.length > 0 && <span className={'num nv-acerto' + (fraco ? ' err' : '')}>{d.acerto === null ? 'Ainda sem respostas' : `${Math.round(d.acerto * 100)}% de acerto · ${plural(d.feitas, 'feita', 'feitas')}`}</span>}
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
        if (!lv.length) return null;
        return (
          <section key={nv.id} className="secao">
            <h2 className="sec-tit">{nv.nome}</h2>
            <ol className="degraus">
              {lv.map((q) => {
                const t = s.q[q.id]?.tent || [];
                const ult = t[t.length - 1];
                const f = filaDe(s.q[q.id]);
                return (
                  <li key={q.id}>
                    <Link to={`/m/${m}/q/${q.id}?ctx=escada`} className={'degrau' + (ult ? (ult.ok ? ' ok' : ' err') : '') + (q.id === prox?.id ? ' prox' : '')}>
                      <span className="dg-n num" aria-label={ult ? (ult.ok ? 'Acertou' : 'Errou') : 'Não feita'}>{ult ? <Icone nome={ult.ok ? 'check' : 'fechar'} tam={16} /> : <i className="dg-ponto" />}</span>
                      <span className="dg-txt">
                        <b>{q.conceito || `${q.escola} ${q.ano}`}</b>
                        <small>{q.escola} {q.ano}{q.n ? ` · questão ${numeroQuestao(q)}` : ''}{f ? ` · revisar ${emDias(f.vence)}` : ''}</small>
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

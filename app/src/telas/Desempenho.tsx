import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useTodasMaterias } from '../dados/conteudo';
import { nomeMateria } from '../dados/materias';
import { useEstado } from '../estado/loja';
import { resumoMateria, semana, tempoTotal } from '../logica/estatisticas';
import { desempenhoPorNivel, feedbackNiveis, nomeNivel, pontosFracos } from '../logica/nivel';
import { Barra, Carregando, cap, horasMin, plural, useTitulo } from '../ui/comum';
import { IconeMateria } from '../ui/IconeMateria';
import { Icone } from '../ui/Icone';
import { estadoMateriaVazio } from '../estado/tipos';
import type { MateriaId } from '../dados/tipos';

export function Desempenho() {
  useTitulo('Desempenho');
  const todas = useTodasMaterias();
  const e = useEstado();
  const [mSel, setMSel] = useState<MateriaId>('bio');
  if (!todas) return <div className="conteudo"><Carregando /></div>;

  const sem = semana(e);
  const resumos = todas.map((mc) => ({ mc, s: e.materias[mc.id] || estadoMateriaVazio(), r: resumoMateria(mc, e.materias[mc.id] || estadoMateriaVazio()) }));
  const feitas = resumos.reduce((a, x) => a + x.r.feitas, 0);
  const tent = resumos.reduce((a, x) => a + x.r.tentativas, 0);
  const okT = resumos.reduce((a, x) => a + x.r.acertoTentativas, 0);

  // padrões de erro em todas as tentativas
  let comCerteza = 0, chuteCerto = 0, comPista = 0, segSoma = 0, segN = 0;
  const porEscola = new Map<string, { ok: number; n: number }>();
  for (const { mc, s } of resumos) for (const q of mc.banco) {
    const t = s.q[q.id]?.tent; if (!t) continue;
    for (const x of t) {
      if (!x.ok && x.conf === 'certeza') comCerteza++;
      if (x.ok && x.conf === 'chute') chuteCerto++;
      if (x.dica) comPista++;
      if (x.seg) { segSoma += x.seg; segN++; }
      const p = porEscola.get(q.escola) || { ok: 0, n: 0 }; p.n++; if (x.ok) p.ok++; porEscola.set(q.escola, p);
    }
  }
  const sel = resumos.find((x) => x.mc.id === mSel)!;
  const mods = sel.mc.conteudo.modulos.map((mod) => {
    const qs = sel.mc.banco.filter((q) => q.modulo === mod.id);
    let n = 0, ok = 0, feitasM = 0;
    for (const q of qs) { const t = sel.s.q[q.id]?.tent; if (t?.length) { feitasM++; n += t.length; ok += t.filter((x) => x.ok).length; } }
    return { mod, total: qs.length, feitas: feitasM, acerto: n ? ok / n : null };
  });
  const fracos = mods.filter((x) => x.acerto !== null && x.feitas >= 3).sort((a, b) => a.acerto! - b.acerto!).slice(0, 3);
  const niveis = desempenhoPorNivel(sel.mc.banco, sel.s);
  const feedback = feedbackNiveis(niveis);
  const grupos = sel.mc.conteudo.modulos.flatMap((mod) => mod.subs.map((sub) => ({ ref: { mod, sub }, qs: sel.mc.porSub.get(sub.id) || [] }))).filter((g) => g.qs.length);
  const ondeErra = pontosFracos(grupos, sel.s, 5);

  if (!feitas) return (
    <div className="conteudo"><div className="titulo-pag"><h1>Desempenho</h1></div>
      <div className="vazio"><h3>Ainda sem respostas</h3><p>Responda algumas questões para ver seu acerto por matéria, por tema e por prova.</p><Link to="/" className="btn sec">Começar</Link></div></div>
  );

  return (
    <div className="conteudo">
      <div className="titulo-pag"><div><h1>Desempenho</h1><p className="sub">Onde você acerta, onde erra e como erra.</p></div></div>
      <div className="grade g4 kpis">
        <div className="bloco"><b className="num">{feitas}</b><span>questões feitas</span></div>
        <div className="bloco"><b className="num">{tent ? Math.round((okT / tent) * 100) : 0}%</b><span>de acerto nas tentativas</span></div>
        <div className="bloco"><b className="num">{(segN ? Math.round(segSoma / segN / 6) / 10 : 0).toLocaleString('pt-BR')} min</b><span>por questão, em média</span></div>
        <div className="bloco"><b className="num">{horasMin(tempoTotal(e))}</b><span>de estudo no total · {sem.semana} questões nesta semana</span></div>
      </div>

      <section className="secao">
        <h2 className="sec-tit">Por matéria</h2>
        <div className="por-materia folha" style={{ padding: '8px 20px' }}>
          {resumos.map(({ mc, r }) => (
            <button key={mc.id} className={`pm m-${mc.id}` + (mSel === mc.id ? ' sel' : '')} onClick={() => setMSel(mc.id)} aria-pressed={mSel === mc.id}>
              <span className="pm-nome"><IconeMateria m={mc.id} tam={26} />{nomeMateria(mc.id)}</span>
              <Barra valor={r.tentativas ? r.acertoTentativas / r.tentativas : 0} rotulo={`Acerto em ${nomeMateria(mc.id)}`} />
              <b className="num">{r.tentativas ? `${Math.round((r.acertoTentativas / r.tentativas) * 100)}%` : '–'}</b>
              <small className="fraco num">{plural(r.feitas, 'feita', 'feitas')}</small>
            </button>
          ))}
        </div>
      </section>

      <div className="grade g2 secao">
        <section className={`bloco m-${mSel}`}>
          <h2 className="sec-tit">Temas de {nomeMateria(mSel)}</h2>
          {mods.map((x) => (
            <Link key={x.mod.id} to={`/m/${mSel}/tema/${x.mod.id}`} className="tema-desemp">
              <span>{x.mod.nome}</span>
              <Barra valor={x.acerto ?? 0} rotulo={x.mod.nome} />
              <b className="num">{x.acerto === null ? '–' : `${Math.round(x.acerto * 100)}%`}</b>
              <small className="fraco num">{plural(x.feitas, 'feita', 'feitas')}</small>
            </Link>
          ))}
        </section>
        <div className="desemp-dir">
          <section className={`bloco m-${mSel}`}>
            <h2 className="sec-tit">Por nível em {nomeMateria(mSel)}</h2>
            {niveis.map((d) => (
              <div key={d.nivel} className="tema-desemp">
                <span>{nomeNivel(d.nivel)}</span>
                <Barra valor={d.acerto ?? 0} rotulo={`Acerto no nível ${nomeNivel(d.nivel)}`} />
                <b className="num">{d.acerto === null ? '–' : `${Math.round(d.acerto * 100)}%`}</b>
                <small className="fraco num">{plural(d.feitas, 'feita', 'feitas')}</small>
              </div>
            ))}
            {feedback && <p className="feedback-nivel"><Icone nome="lampada" tam={18} /><span>{feedback}</span></p>}
          </section>
          {ondeErra.length > 0 && (
            <section className={`bloco m-${mSel}`}>
              <h2 className="sec-tit">Onde você mais erra</h2>
              {ondeErra.map((x) => (
                <Link key={x.ref.sub.id + x.nivel} to={`/m/${mSel}/escada/${x.ref.sub.id}`} className="linha-lista">
                  <span className="etq err num">{Math.round(x.acerto * 100)}%</span>
                  <span><span className="tit">{cap(x.ref.sub.nome)}</span><br /><span className="det">{x.ref.mod.nome} · nível {nomeNivel(x.nivel).toLowerCase()} · {plural(x.feitas, 'feita', 'feitas')}</span></span>
                  <Icone nome="direita" />
                </Link>
              ))}
            </section>
          )}
          <section className="bloco">
            <h2 className="sec-tit">Como você erra</h2>
            <ul className="padroes">
              <li><b className="num">{comCerteza}</b><span>erros com “tenho certeza”: o conceito está errado, não foi distração. Comece a revisão por eles.</span></li>
              <li><b className="num">{chuteCerto}</b><span>acertos no chute: não contam como sabidos e voltam na revisão.</span></li>
              <li><b className="num">{comPista}</b><span>respostas com pista: também voltam na revisão.</span></li>
            </ul>
          </section>
          {fracos.length > 0 && (
            <section className={`bloco m-${mSel}`}>
              <h2 className="sec-tit">Para reforçar em {nomeMateria(mSel)}</h2>
              {fracos.map((x) => <Link key={x.mod.id} to={`/m/${mSel}/tema/${x.mod.id}`} className="linha-lista"><span className="etq err num">{Math.round(x.acerto! * 100)}%</span><span className="tit">{x.mod.nome}</span><Icone nome="direita" /></Link>)}
            </section>
          )}
          <section className="bloco">
            <h2 className="sec-tit">Por prova</h2>
            {[...porEscola.entries()].sort((a, b) => b[1].n - a[1].n).slice(0, 8).map(([esc, p]) => (
              <div key={esc} className="tema-desemp"><span>{esc}</span><Barra valor={p.ok / p.n} rotulo={esc} /><b className="num">{Math.round((p.ok / p.n) * 100)}%</b><small className="fraco num">{p.n}</small></div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}

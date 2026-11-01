import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { carregaResolucoes, useTodasMaterias } from '../dados/conteudo';
import { nomeMateria } from '../dados/materias';
import { useEstado } from '../estado/loja';
import { Anel, Barra, Carregando, formataTempo, useTitulo } from '../ui/comum';
import { Icone } from '../ui/Icone';
import { EnunciadoQuestao } from '../ui/QuestaoCartao';
import { ResolucaoView } from '../ui/Resolucao';
import type { MateriaId, Resolucao } from '../dados/tipos';

export function SimuladoResultado() {
  const { ts } = useParams();
  const e = useEstado();
  const todas = useTodasMaterias();
  const f = e.simuladosFeitos.find((x) => String(x.ts) === ts);
  const [aberta, setAberta] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<'todas' | 'erros'>('todas');
  const [res, setRes] = useState<Record<string, Resolucao>>({});
  useTitulo('Resultado do simulado');

  const itAberto = f?.itens.find((x) => x.id === aberta);
  const qAberta = itAberto && todas ? todas.find((x) => x.id === itAberto.m)?.porId.get(itAberto.id) : undefined;
  useEffect(() => { if (itAberto && qAberta) carregaResolucoes(itAberto.m, qAberta.sub).then((r) => setRes((o) => ({ ...o, ...r }))); }, [itAberto, qAberta]);

  if (!f) return <div className="conteudo vazio"><h3>Resultado não encontrado</h3><Link className="btn sec" to="/simulados">Simulados</Link></div>;
  if (!todas) return <div className="conteudo"><Carregando /></div>;
  const pct = f.total ? f.acertos / f.total : 0;
  const lista = f.itens.map((x, i) => ({ ...x, n: i + 1 })).filter((x) => filtro === 'todas' || !x.ok);

  return (
    <div className="conteudo estreito">
      <nav className="migalhas"><Link to="/simulados?aba=historico">Simulados</Link><Icone nome="direita" tam={14} /><span>Resultado</span></nav>
      <div className="res-sim folha">
        <Anel valor={pct} tam={112} espessura={10}><span style={{ fontSize: 26 }}>{Math.round(pct * 100)}%</span></Anel>
        <div>
          <h1>{f.titulo}</h1>
          <p className="miolo num">{f.acertos} de {f.total} certas · {formataTempo(f.seg)} · {new Date(f.ts).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}</p>
          <p className="fraco" style={{ fontSize: 14, marginTop: 6 }}>Os erros e as questões em branco já entraram na revisão espaçada.</p>
        </div>
      </div>
      <section className="secao">
        <h2 className="sec-tit">Por matéria</h2>
        <div className="por-materia">
          {(Object.entries(f.porMateria) as [MateriaId, { acertos: number; total: number }][]).map(([m, p]) => (
            <div key={m} className={`pm m-${m}`}>
              <span className="pm-nome"><i className="ponto" />{nomeMateria(m)}</span>
              <Barra valor={p.acertos / p.total} rotulo={nomeMateria(m)} />
              <b className="num">{p.acertos}/{p.total}</b>
            </div>
          ))}
        </div>
      </section>
      <section className="secao">
        <div className="cab-sec"><h2>Questões</h2>
          <div className="chips"><button className="chip" aria-pressed={filtro === 'todas'} onClick={() => setFiltro('todas')}>Todas</button><button className="chip" aria-pressed={filtro === 'erros'} onClick={() => setFiltro('erros')}>Só erros ({f.itens.filter((x) => !x.ok).length})</button></div>
        </div>
        <div className="gabarito-grade">
          {lista.map((x) => (
            <button key={x.id} className={'gq ' + (x.ok ? 'ok' : x.letra ? 'err' : 'branco') + (aberta === x.id ? ' sel' : '') + ` m-${x.m}`} onClick={() => setAberta(aberta === x.id ? null : x.id)}
              aria-label={`Questão ${x.n}: ${x.ok ? 'certa' : x.letra ? `errada, marcou ${x.letra}` : 'em branco'}`} aria-expanded={aberta === x.id}>
              <span className="num">{x.n}</span><b>{x.letra || '–'}</b>
            </button>
          ))}
        </div>
        {itAberto && qAberta && (
          <div className={`m-${itAberto.m}`} style={{ marginTop: 18 }}>
            <article className="folha q-cartao"><EnunciadoQuestao m={itAberto.m} q={qAberta} numero={nomeMateria(itAberto.m)} /></article>
            <ResolucaoView q={qAberta} r={res[qAberta.id]} marcada={itAberto.letra} />
          </div>
        )}
      </section>
      <div className="fc-acoes" style={{ marginTop: 28 }}><Link to="/revisao" className="btn sec">Ir para a revisão</Link><Link to="/simulados" className="btn">Outro simulado</Link></div>
    </div>
  );
}

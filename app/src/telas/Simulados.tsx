import { Link, useSearchParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useTodasMaterias } from '../dados/conteudo';
import { CATALOGO, edicoes, provaPorId } from '../dados/provas';
import { nomeMateria } from '../dados/materias';
import { useEstado } from '../estado/loja';
import { OBJETIVOS } from '../logica/simulados';
import { Carregando, formataTempo, plural, useTitulo } from '../ui/comum';
import { Icone } from '../ui/Icone';
import type { MateriaId } from '../dados/tipos';

export function Simulados() {
  useTitulo('Simulados');
  const todas = useTodasMaterias();
  const e = useEstado();
  const [qs, setQs] = useSearchParams();
  const aba = qs.get('aba') || 'prova';
  const [so, setSo] = useState<'alvo' | 'todas'>('alvo');
  const alvo = useMemo(() => new Set(e.perfil?.provasAlvo || []), [e.perfil?.provasAlvo]);
  const eds = useMemo(() => (todas ? edicoes(todas).filter((x) => x.itens.length >= 8) : []), [todas]);
  if (!todas) return <div className="conteudo"><Carregando /></div>;

  const daAlvo = eds.filter((x) => x.catalogoId && alvo.has(x.catalogoId));
  const lista = so === 'alvo' && daAlvo.length ? daAlvo : eds;
  const alvoSemQuestoes = [...alvo].filter((id) => !eds.some((x) => x.catalogoId === id)).map((id) => provaPorId(id)).filter(Boolean);
  const andamento = e.simulado;
  const feitos = [...e.simuladosFeitos].sort((a, b) => b.ts - a.ts);

  // agrupa por instituição
  const grupos = new Map<string, typeof lista>();
  for (const ed of lista) { const l = grupos.get(ed.escola) || []; l.push(ed); grupos.set(ed.escola, l); }

  return (
    <div className="conteudo">
      <div className="titulo-pag"><div><h1>Simulados</h1><p className="sub">Prova inteira, no tempo oficial, ou montado por objetivo. Questões reais, gabarito oficial.</p></div></div>

      {andamento && (
        <Link to="/simulado/agora" className="andamento folha">
          <Icone nome="relogio" tam={22} />
          <span><b>{andamento.titulo}</b><small className="fraco num">Em andamento · {Object.keys(andamento.resp).length} de {andamento.itens.length} respondidas · {formataTempo(andamento.usadoSeg)} usados</small></span>
          <span className="btn peq">Retomar</span>
        </Link>
      )}

      <div className="abas" role="group" aria-label="Seções">
        <button aria-pressed={aba === 'prova'} onClick={() => setQs({}, { replace: true })}>Por prova <small>{eds.length}</small></button>
        <button aria-pressed={aba === 'objetivo'} onClick={() => setQs({ aba: 'objetivo' }, { replace: true })}>Por objetivo <small>{OBJETIVOS.length}</small></button>
        <button aria-pressed={aba === 'historico'} onClick={() => setQs({ aba: 'historico' }, { replace: true })}>Histórico <small>{feitos.length}</small></button>
      </div>

      {aba === 'prova' && (
        <>
          <div className="aviso-banco">
            <Icone nome="info" tam={18} />
            <p>Hoje o banco tem as questões de <b>Biologia, Química, Matemática e Português</b> de cada edição. As provas completas, com todas as matérias, entram com a importação das provas oficiais; até lá, cada simulado mostra quantas questões da prova original ele cobre.</p>
          </div>
          <div className="chips" style={{ margin: '16px 0 20px' }}>
            <button className="chip" aria-pressed={so === 'alvo'} onClick={() => setSo('alvo')}>Minhas provas-alvo{daAlvo.length ? ` (${daAlvo.length})` : ''}</button>
            <button className="chip" aria-pressed={so === 'todas'} onClick={() => setSo('todas')}>Todas as provas ({eds.length})</button>
            <Link to="/perfil" className="chip"><Icone nome="config" tam={15} /> Mudar provas-alvo</Link>
          </div>
          {so === 'alvo' && !daAlvo.length && <p className="miolo" style={{ marginBottom: 16 }}>Suas provas-alvo ainda não têm edições no banco. Mostrando todas as provas disponíveis.</p>}
          {[...grupos.entries()].map(([escola, l]) => {
            const cat = l[0].catalogoId ? provaPorId(l[0].catalogoId) : undefined;
            return (
              <section key={escola} className="grupo-prova">
                <div className="cab-sec"><div><h2 style={{ fontSize: 20 }}>{escola}</h2>{cat && <p className="fraco" style={{ fontSize: 14 }}>{cat.instituicao}{cat.banca ? ` · banca ${cat.banca}` : ''}{cat.formato?.questoes_objetivas ? ` · prova oficial com ${cat.formato.questoes_objetivas} questões` : ''}</p>}</div>
                  {cat && <Link to={`/provas/${cat.id}`}>Sobre a prova <Icone nome="direita" tam={16} /></Link>}</div>
                <div className="grade g3">
                  {l.map((ed) => {
                    const feito = feitos.find((f) => f.sid === 'prova:' + ed.chave);
                    return (
                      <Link key={ed.chave} to={`/simulados/prova/${encodeURIComponent(ed.chave)}`} className="cartao-sim">
                        <b>{ed.ano}{ed.fase ? ` · ${ed.fase}` : ''}</b>
                        <span className="num">{plural(ed.itens.length, 'questão', 'questões')}{cat?.formato?.questoes_objetivas ? ` de ${cat.formato.questoes_objetivas}` : ''}</span>
                        <span className="cs-mats">{(Object.entries(ed.porMateria) as [MateriaId, number][]).map(([m, n]) => <span key={m} className={`m-${m}`}><i className="ponto" />{nomeMateria(m).slice(0, 3)} {n}</span>)}</span>
                        {feito && <span className="etq ok num">Feito · {feito.acertos}/{feito.total}</span>}
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
          {alvoSemQuestoes.length > 0 && (
            <section className="secao">
              <h2 className="sec-tit">Suas provas-alvo em preparação</h2>
              <div className="chips">{alvoSemQuestoes.map((p) => <Link key={p!.id} to={`/provas/${p!.id}`} className="chip">{p!.prova}<span className="etq">em preparação</span></Link>)}</div>
            </section>
          )}
          <p className="fraco" style={{ fontSize: 14, marginTop: 28 }}>Catálogo com {CATALOGO.length} provas de Medicina de todo o Brasil em <Link to="/provas">Provas e faculdades</Link>.</p>
        </>
      )}

      {aba === 'objetivo' && (
        <div className="grade g2">
          {OBJETIVOS.map((o) => (
            <Link key={o.id} to={`/simulados/objetivo/${o.id}`} className={'cartao-obj' + (['bio', 'qui', 'mat', 'por'].includes(o.id) ? ` m-${o.id}` : '')}>
              <span className="mini"><Icone nome={o.id === 'erros' ? 'repetir' : o.id === 'dificeis' ? 'escada' : o.id === 'alvo' ? 'alvo' : o.id === 'rapido' ? 'raio' : 'livro'} /></span>
              <span><b>{o.titulo}</b><small>{o.descricao}</small></span>
              <Icone nome="direita" />
            </Link>
          ))}
        </div>
      )}

      {aba === 'historico' && (
        feitos.length ? (
          <div className="bloco">
            {feitos.map((f) => (
              <Link key={f.ts} to={`/simulado/resultado/${f.ts}`} className="linha-lista">
                <span className={'etq ' + (f.acertos / f.total >= 0.7 ? 'ok' : f.acertos / f.total >= 0.5 ? 'aviso' : 'err')}>{Math.round((f.acertos / f.total) * 100)}%</span>
                <span><span className="tit">{f.titulo}</span><br /><span className="det num">{new Date(f.ts).toLocaleDateString('pt-BR')} · {f.acertos} de {f.total} · {formataTempo(f.seg)}</span></span>
                <Icone nome="direita" />
              </Link>
            ))}
          </div>
        ) : <div className="vazio"><h3>Nenhum simulado feito ainda</h3><p>Seus resultados ficam aqui, com o desempenho por matéria.</p></div>
      )}
    </div>
  );
}

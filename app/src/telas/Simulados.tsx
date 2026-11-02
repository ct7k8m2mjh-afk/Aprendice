import { Link, useSearchParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useTodasMaterias } from '../dados/conteudo';
import { CATALOGO, PROVAS_EM_PREPARO, edicoes, provaPorId } from '../dados/provas';
import { nomeMateria } from '../dados/materias';
import { useEstado } from '../estado/loja';
import { Carregando, formataTempo, plural, useTitulo } from '../ui/comum';
import { Icone } from '../ui/Icone';
import type { MateriaId } from '../dados/tipos';

export function Simulados() {
  useTitulo('Simulados');
  const todas = useTodasMaterias();
  const e = useEstado();
  const [qs, setQs] = useSearchParams();
  const aba = qs.get('aba') === 'historico' ? 'historico' : 'prova';
  const [so, setSo] = useState<'alvo' | 'todas'>('alvo');
  const alvo = useMemo(() => new Set(e.perfil?.provasAlvo || []), [e.perfil?.provasAlvo]);
  // só provas inteiras, com todas as matérias
  const eds = useMemo(() => (todas ? edicoes(todas).filter((x) => x.completa) : []), [todas]);
  if (!todas) return <div className="conteudo"><Carregando /></div>;

  const daAlvo = eds.filter((x) => x.catalogoId && alvo.has(x.catalogoId));
  const lista = so === 'alvo' && daAlvo.length ? daAlvo : eds;
  const andamento = e.simulado;
  const feitos = [...e.simuladosFeitos].sort((a, b) => b.ts - a.ts);

  // agrupa por instituição; dentro, do ano mais recente ao mais antigo
  const grupos = new Map<string, typeof lista>();
  for (const ed of lista) { const l = grupos.get(ed.escola) || []; l.push(ed); grupos.set(ed.escola, l); }
  for (const l of grupos.values()) l.sort((a, b) => b.ano.localeCompare(a.ano) || a.fase.localeCompare(b.fase));

  return (
    <div className="conteudo">
      <div className="titulo-pag"><div><h1>Simulados</h1><p className="sub">Provas inteiras, com todas as matérias, no tempo oficial. Escolha a instituição e o ano.</p></div></div>

      {andamento && (
        <Link to="/simulado/agora" className="andamento folha">
          <Icone nome="relogio" tam={22} />
          <span><b>{andamento.titulo}</b><small className="fraco num">Em andamento · {Object.keys(andamento.resp).length} de {andamento.itens.length} respondidas · {formataTempo(andamento.usadoSeg)} usados</small></span>
          <span className="btn peq">Retomar</span>
        </Link>
      )}

      <div className="abas" role="group" aria-label="Seções">
        <button aria-pressed={aba === 'prova'} onClick={() => setQs({}, { replace: true })}>Provas <small>{eds.length}</small></button>
        <button aria-pressed={aba === 'historico'} onClick={() => setQs({ aba: 'historico' }, { replace: true })}>Histórico <small>{feitos.length}</small></button>
      </div>

      {aba === 'prova' && (
        <>
          {eds.length > 0 && (
            <div className="chips" style={{ margin: '16px 0 20px' }}>
              <button className="chip" aria-pressed={so === 'alvo'} onClick={() => setSo('alvo')}>Minhas provas-alvo{daAlvo.length ? ` (${daAlvo.length})` : ''}</button>
              <button className="chip" aria-pressed={so === 'todas'} onClick={() => setSo('todas')}>Todas as provas ({eds.length})</button>
              <Link to="/perfil" className="chip"><Icone nome="config" tam={15} /> Mudar provas-alvo</Link>
            </div>
          )}
          {eds.length > 0 && so === 'alvo' && !daAlvo.length && <p className="miolo" style={{ marginBottom: 16 }}>Suas provas-alvo ainda não têm prova completa. Mostrando todas.</p>}
          {[...grupos.entries()].map(([escola, l]) => {
            const cat = l[0].catalogoId ? provaPorId(l[0].catalogoId) : undefined;
            const f = cat?.formato;
            return (
              <section key={escola} className="grupo-prova">
                <div className="cab-sec"><div><h2 style={{ fontSize: 20 }}>{escola}</h2>{cat && <p className="fraco" style={{ fontSize: 14 }}>{cat.instituicao}{cat.banca ? ` · banca ${cat.banca}` : ''}</p>}</div>
                  {cat && <Link to={`/provas/${cat.id}`}>Sobre a prova <Icone nome="direita" tam={16} /></Link>}</div>
                <div className="grade g3">
                  {l.map((ed) => {
                    const feito = feitos.find((x) => x.sid === 'prova:' + ed.chave);
                    return (
                      <Link key={ed.chave} to={`/simulados/prova/${encodeURIComponent(ed.chave)}`} className="cartao-sim">
                        <b className="cs-titulo">{escola} {ed.ano}{ed.fase ? ` · ${ed.fase}` : ''}</b>
                        <span className="num">{plural(ed.itens.length, 'questão', 'questões')} · todas as matérias{f?.duracao_horas ? ` · ${String(f.duracao_horas).replace('.', ',')} h` : ''}</span>
                        <span className="cs-mats">{(Object.keys(ed.porMateria) as MateriaId[]).map((m) => <span key={m} className={`m-${m}`}><i className="ponto" />{nomeMateria(m)}</span>)}</span>
                        {feito && <span className="etq ok num">Feito · {feito.acertos}/{feito.total}</span>}
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
          {!eds.length && (
            <div className="vazio" style={{ paddingTop: 12 }}>
              <h3>As provas completas estão chegando</h3>
              <p>Cada simulado é uma prova inteira, com todas as matérias, do jeito que caiu. Elas entram aqui assim que o recorte de cada questão e o gabarito oficial forem conferidos.</p>
            </div>
          )}
          <section className="secao">
            <h2 className="sec-tit">Em preparação</h2>
            <p className="fraco" style={{ fontSize: 14, margin: '0 0 10px' }}>Já baixadas da fonte oficial, com caderno e gabarito.</p>
            <div className="chips">{PROVAS_EM_PREPARO.map((p) => <Link key={p.titulo} to={`/provas/${p.catalogoId}`} className="chip">{p.titulo}<span className="etq">em preparação</span></Link>)}</div>
          </section>
          <p className="fraco" style={{ fontSize: 14, marginTop: 28 }}>Catálogo com {CATALOGO.length} provas de Medicina de todo o Brasil em <Link to="/provas">Provas e faculdades</Link>.</p>
        </>
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

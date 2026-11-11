import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { CATALOGO, PROVAS_EM_PREPARO, provaPorId } from '../dados/provas';
import { useIndiceProvas, type IndiceProva } from '../dados/provasCompletas';
import { useEstado } from '../estado/loja';
import { Carregando, formataTempo, plural, useTitulo } from '../ui/comum';
import { Icone } from '../ui/Icone';
import { FiltroRegiaoChips, useRegiao } from '../ui/FiltroRegiao';
import { useMateria } from '../dados/conteudo';
import { MATERIAS_ATIVAS } from '../dados/materias';
import { filtraRegiao } from '../logica/regiao';
import { QTDS_CONTEUDO } from '../logica/simulados';
import type { MateriaId } from '../dados/tipos';
import { REGIOES_PRATICA, deFiltro, descreveFiltro, ehFiltro, regiaoDaProva, regiaoDaQuestao, regioesDoFiltro, type FiltroRegiao } from '../logica/regiao';

export function Simulados() {
  useTitulo('Simulados');
  const indice = useIndiceProvas();
  const e = useEstado();
  const [qs, setQs] = useSearchParams();
  const aba = qs.get('aba') === 'historico' ? 'historico' : qs.get('aba') === 'conteudo' ? 'conteudo' : 'prova';
  // pedido do dono (09/11/2026): abre na região das provas do aluno (+ ENEM); "Minhas provas-alvo" continua como opção
  const rg = useRegiao();
  const [so, setSo] = useState<'alvo' | FiltroRegiao>(rg.minhas.length ? 'minha' : 'todas');
  const alvo = useMemo(() => new Set(e.perfil?.provasAlvo || []), [e.perfil?.provasAlvo]);
  // só provas inteiras, com todas as matérias
  const eds: IndiceProva[] = useMemo(() => indice || [], [indice]);
  if (!indice) return <div className="conteudo"><Carregando /></div>;

  const daAlvo = eds.filter((x) => alvo.has(x.catalogoId));
  const conj = so === 'alvo' ? null : regioesDoFiltro(so, rg.minhas);
  const regiaoEd = (x: IndiceProva) => { const c = provaPorId(x.catalogoId); return c ? regiaoDaProva(c) : regiaoDaQuestao({ escola: x.escola }); };
  const daRegiao = conj ? eds.filter((x) => { const r = regiaoEd(x); return !r || conj.has(r); }) : eds;
  // nunca sem prova: região sem simulado ainda mostra todos (com aviso)
  const lista = so === 'alvo' ? (daAlvo.length ? daAlvo : eds) : daRegiao.length ? daRegiao : eds;
  const andamento = e.simulado;
  const feitos = [...e.simuladosFeitos].sort((a, b) => b.ts - a.ts);

  // agrupa por instituição; dentro, do ano mais recente ao mais antigo
  const grupos = new Map<string, typeof lista>();
  for (const ed of lista) { const l = grupos.get(ed.escola) || []; l.push(ed); grupos.set(ed.escola, l); }
  for (const l of grupos.values()) l.sort((a, b) => b.ano.localeCompare(a.ano) || a.fase.localeCompare(b.fase));
  const ordemGrupos = [...grupos.entries()].sort((a, b) => (a[0] === 'ENEM' ? -1 : b[0] === 'ENEM' ? 1 : a[0].localeCompare(b[0])));

  return (
    <div className="conteudo">
      <div className="titulo-pag"><div><h1>Simulados</h1><p className="sub">{aba === 'conteudo'
        ? 'Só questões reais de prova dos conteúdos que você escolher, com cronômetro e resultado no fim.'
        : 'Provas inteiras, com todas as matérias, no tempo oficial. Escolha a instituição e o ano.'}</p></div></div>

      {andamento && (
        <Link to="/simulado/agora" className="andamento folha">
          <Icone nome="relogio" tam={22} />
          <span><b>{andamento.titulo}</b><small className="fraco num">Em andamento · {Object.keys(andamento.resp).length} de {andamento.itens.length} respondidas · {formataTempo(andamento.usadoSeg)} usados</small></span>
          <span className="btn peq">Retomar</span>
        </Link>
      )}

      <div className="abas" role="group" aria-label="Seções">
        <button aria-pressed={aba === 'prova'} onClick={() => setQs({}, { replace: true })}>Provas <small>{eds.length}</small></button>
        <button aria-pressed={aba === 'conteudo'} onClick={() => setQs({ aba: 'conteudo' }, { replace: true })}>Por conteúdo</button>
        <button aria-pressed={aba === 'historico'} onClick={() => setQs({ aba: 'historico' }, { replace: true })}>Histórico <small>{feitos.length}</small></button>
      </div>

      {aba === 'prova' && (
        <>
          {eds.length > 0 && (
            <div className="chips fr-chips" style={{ marginTop: 16, marginBottom: 20 }}>
              <button className="chip" aria-pressed={so === 'alvo'} onClick={() => setSo('alvo')}>Minhas provas-alvo{daAlvo.length ? ` (${daAlvo.length})` : ''}</button>
              {rg.minhas.length > 0 && <button className="chip" aria-pressed={so === 'minha'} onClick={() => setSo('minha')} title={descreveFiltro('minha', rg.minhas)}>Minha região</button>}
              <button className="chip" aria-pressed={so === 'todas'} onClick={() => setSo('todas')}>Todas as regiões ({eds.length})</button>
              {REGIOES_PRATICA.map((r) => <button key={r.id} className="chip" aria-pressed={so === r.id} onClick={() => setSo(r.id)}>{r.curto}</button>)}
              <Link to="/perfil" className="chip"><Icone nome="config" tam={15} /> Mudar provas-alvo</Link>
            </div>
          )}
          {eds.length > 0 && ehFiltro(so) && so !== 'todas' && !daRegiao.length && <p className="miolo" style={{ marginBottom: 16 }}>Ainda não há prova completa {deFiltro(so, rg.minhas)}. Mostrando todas as regiões.</p>}
          {eds.length > 0 && so === 'alvo' && !daAlvo.length && <p className="miolo" style={{ marginBottom: 16 }}>Suas provas-alvo ainda não têm prova completa. Mostrando todas.</p>}
          {ordemGrupos.length > 0 && (
            <div className="bloco sim-folha">
              {ordemGrupos.map(([escola, l]) => {
                const cat = provaPorId(l[0].catalogoId);
                return (
                  <section key={escola} className="sim-grupo" aria-label={escola}>
                    <div className="sim-grupo-cab">
                      <div><h2>{escola}</h2>{cat && <p className="fraco">{cat.instituicao}{l[0].banca ? ` · banca ${l[0].banca}` : ''} · {plural(l.length, 'prova', 'provas')}</p>}</div>
                      {cat && <Link className="link-sec" to={`/provas/${cat.id}`}>Sobre a prova <Icone nome="direita" tam={16} /></Link>}
                    </div>
                    {l.map((ed) => {
                      const feito = feitos.filter((x) => x.sid === 'prova:' + ed.id).sort((a, b) => b.ts - a.ts)[0];
                      return (
                        <Link key={ed.id} to={`/simulados/prova/${encodeURIComponent(ed.id)}`} className="sim-linha cartao-sim">
                          <span className="sim-ic" aria-hidden><Icone nome="arquivo" tam={26} /></span>
                          <span className="sim-txt">
                            <b className="cs-titulo">{ed.titulo}</b>
                            <span className="num">{plural(ed.questoes, 'questão', 'questões')}{ed.duracao_horas ? ` · ${String(ed.duracao_horas).replace('.', ',')} h` : ''}</span>
                            <span className="cs-mats">{Object.keys(ed.areas).slice(0, 6).map((a) => <span key={a}><i className="ponto" />{a}</span>)}{Object.keys(ed.areas).length > 6 ? <span>+{Object.keys(ed.areas).length - 6}</span> : null}</span>
                          </span>
                          <span className="sim-etq">{feito && <span className="etq ok num">Feito · {feito.acertos}/{feito.total}</span>}</span>
                          <Icone nome="direita" className="sim-seta" />
                        </Link>
                      );
                    })}
                  </section>
                );
              })}
            </div>
          )}
          {!eds.length && (
            <div className="vazio" style={{ paddingTop: 12 }}>
              <h3>As provas completas estão chegando</h3>
              <p>Cada simulado é uma prova inteira, com todas as matérias, do jeito que caiu. Se esta lista não carregou, verifique a conexão e abra a página de novo.</p>
            </div>
          )}
          <section className="bloco sim-folha secao" aria-labelledby="sim-prep">
            <div className="sim-grupo-cab"><div><h2 id="sim-prep">Em preparação</h2><p className="fraco">Provas que ainda não entram como simulado, e o motivo.</p></div></div>
            {PROVAS_EM_PREPARO.map((p) => (
              <Link key={p.titulo} to={`/provas/${p.catalogoId}`} className="sim-linha prep">
                <span className="sim-ic" aria-hidden><Icone nome="relogio" tam={24} /></span>
                <span className="sim-txt"><b>{p.titulo}</b><span>{p.motivo}</span></span>
                <span className="sim-etq" />
                <Icone nome="direita" className="sim-seta" />
              </Link>
            ))}
          </section>
          <p className="fraco" style={{ fontSize: 14, marginTop: 28 }}>Catálogo com {CATALOGO.length} vestibulares de todo o Brasil em <Link to="/provas">Provas e faculdades</Link>.</p>
        </>
      )}

      {aba === 'conteudo' && <EscolhaConteudo />}

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

/** Simulado por conteúdo (pedido do dono, 11/11/2026): matéria, conteúdos e quantidade; questões reais de prova. */
function EscolhaConteudo() {
  const [m, setM] = useState<MateriaId>('bio');
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [n, setN] = useState<number>(20);
  const mc = useMateria(m);
  const rg = useRegiao();
  const nav = useNavigate();
  const conta = useMemo(() => {
    const c = new Map<string, number>();
    if (mc) for (const q of filtraRegiao(mc.banco.filter((x) => !x.pendente), rg.conj).l) c.set(q.sub, (c.get(q.sub) || 0) + 1);
    return c;
  }, [mc, rg.conj]);
  const total = [...sel].reduce((a, s) => a + (conta.get(s) || 0), 0);
  const troca = (s: string) => setSel((x) => { const y = new Set(x); y.has(s) ? y.delete(s) : y.add(s); return y; });
  const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
  const monta = () => nav(`/simulados/conteudo?m=${m}&c=${encodeURIComponent([...sel].sort().join(','))}&n=${n}`);
  return (
    <div className="sc-conteudo">
      <div className="chips fr-chips" role="group" aria-label="Matéria" style={{ marginTop: 16 }}>
        {MATERIAS_ATIVAS.map((x) => <button key={x.id} className={`chip m-${x.id}`} aria-pressed={m === x.id} onClick={() => { setM(x.id); setSel(new Set()); }}><i className="ponto" />{x.nome}</button>)}
      </div>
      <div style={{ marginTop: 12 }}><FiltroRegiaoChips /></div>
      {!mc ? <Carregando /> : (
        <div className={`bloco sim-folha m-${m}`} style={{ marginTop: 16 }}>
          {mc.conteudo.modulos.map((mod) => {
            const subs = mod.subs.filter((x) => conta.get(x.id));
            if (!subs.length) return null;
            const todos = subs.every((x) => sel.has(x.id));
            return (
              <section key={mod.id} className="sim-grupo sc-tema" aria-label={mod.nome}>
                <div className="sim-grupo-cab">
                  <div><h2>{cap(mod.nome)}</h2></div>
                  <button type="button" className="link-sec" onClick={() => setSel((x) => { const y = new Set(x); subs.forEach((s) => (todos ? y.delete(s.id) : y.add(s.id))); return y; })}>{todos ? 'Desmarcar o tema' : 'Marcar o tema'}</button>
                </div>
                {subs.map((x) => (
                  <label key={x.id} className={'sc-sub' + (sel.has(x.id) ? ' sel' : '')}>
                    <input type="checkbox" checked={sel.has(x.id)} onChange={() => troca(x.id)} />
                    <span className="ponto-sub" aria-hidden />
                    <span className="sc-sub-nome">{cap(x.nome)}</span>
                    <span className="sc-sub-n num">{plural(conta.get(x.id) || 0, 'questão', 'questões')}</span>
                  </label>
                ))}
              </section>
            );
          })}
        </div>
      )}
      <div className="sc-barra folha" role="group" aria-label="Montar simulado">
        <div className="sc-qtd"><span className="fraco">Questões</span>
          {QTDS_CONTEUDO.map((k) => <button key={k} type="button" className="chip" aria-pressed={n === k} onClick={() => setN(k)}>{k}</button>)}
        </div>
        <span className="fraco num sc-resumo">{sel.size ? `${plural(sel.size, 'conteúdo', 'conteúdos')} · ${plural(Math.min(n, total), 'questão', 'questões')}` : 'Marque um ou mais conteúdos'}</span>
        <button type="button" className="btn" disabled={!sel.size} onClick={monta}>Montar simulado <Icone nome="direita" /></button>
      </div>
    </div>
  );
}

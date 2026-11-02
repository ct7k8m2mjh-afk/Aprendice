import { Link, useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useTodasMaterias } from '../dados/conteudo';
import { CATALOGO, REGIOES, campoLegivel, escolasComQuestoes, provaPorId } from '../dados/provas';
import { useIndiceProvas } from '../dados/provasCompletas';
import { atualiza, useEstado } from '../estado/loja';
import { norm } from '../logica/correcao';
import { plural, useTitulo } from '../ui/comum';
import { Icone } from '../ui/Icone';

const INGRESSO: Record<string, string> = { vestibular_proprio: 'Vestibular próprio', enem_sisu: 'ENEM/Sisu', enem_nota: 'Nota do ENEM', seriado: 'Seriado' };

export function Provas() {
  useTitulo('Provas e faculdades');
  const todas = useTodasMaterias();
  const e = useEstado();
  const nQ = useMemo(() => (todas ? escolasComQuestoes(todas) : new Map<string, number>()), [todas]);
  const indiceL = useIndiceProvas();
  const nSim = useMemo(() => { const m = new Map<string, number>(); for (const x of indiceL || []) m.set(x.catalogoId, (m.get(x.catalogoId) || 0) + 1); return m; }, [indiceL]);
  const [regiao, setRegiao] = useState('Todas');
  const [rede, setRede] = useState('');
  const [t, setT] = useState('');
  const alvo = new Set(e.perfil?.provasAlvo || []);
  const lista = CATALOGO.filter((p) => (regiao === 'Todas' || p.regiao === regiao) && (!rede || p.rede === rede) && (!t || norm([p.prova, p.instituicao, p.sigla, p.cidade, p.uf, p.banca].join(' ')).includes(norm(t))));
  const porReg = REGIOES.map((r) => ({ r, l: lista.filter((p) => p.regiao === r) })).filter((x) => x.l.length);

  return (
    <div className="conteudo">
      <div className="titulo-pag"><div><h1>Provas e faculdades</h1><p className="sub">{CATALOGO.length} vestibulares de Medicina de todas as regiões, com banca, formato e fonte. Escolha suas provas-alvo e o app prioriza por elas.</p></div></div>
      <div className="ep-filtros" style={{ marginBottom: 20 }}>
        <label className="ep-busca"><Icone nome="busca" /><span className="sr">Buscar</span><input value={t} onChange={(ev) => setT(ev.target.value)} placeholder="Buscar faculdade, cidade, estado ou banca" /></label>
        <div className="chips">
          {['Todas', ...REGIOES].map((r) => <button key={r} className="chip" aria-pressed={regiao === r} onClick={() => setRegiao(r)}>{r}</button>)}
          <span style={{ width: 8 }} />
          <button className="chip" aria-pressed={rede === 'publica'} onClick={() => setRede(rede === 'publica' ? '' : 'publica')}>Públicas</button>
          <button className="chip" aria-pressed={rede === 'privada'} onClick={() => setRede(rede === 'privada' ? '' : 'privada')}>Privadas</button>
        </div>
      </div>
      {porReg.map(({ r, l }) => (
        <section key={r} className="secao" style={{ marginTop: 24 }}>
          <h2 className="sec-tit">{r} <span className="fraco" style={{ fontWeight: 500, fontSize: 15 }}>{l.length}</span></h2>
          <div className="grade g3">
            {l.map((p) => (
              <Link key={p.id} to={`/provas/${p.id}`} className="cartao-prova">
                <div className="cp-cab"><b>{p.prova}</b>{alvo.has(p.id) && <span className="etq cor">Prova-alvo</span>}</div>
                <small>{p.instituicao}</small>
                <small className="fraco">{[p.cidade, p.uf, p.banca && 'banca ' + p.banca].filter(Boolean).join(' · ')}</small>
                <div className="cp-pe">
                  <span className="etq">{p.rede === 'publica' ? 'Pública' : p.rede === 'privada' ? 'Privada' : 'Rede a verificar'}</span>
                  <span className={'etq' + (nSim.get(p.id) || nQ.get(p.id) ? ' ok' : '')}>{nSim.get(p.id) ? plural(nSim.get(p.id)!, 'prova completa', 'provas completas') : nQ.get(p.id) ? `${nQ.get(p.id)} questões` : 'questões em preparação'}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
      <p className="fraco" style={{ fontSize: 14, marginTop: 28 }}>Dados do ciclo 2027 levantados de fontes oficiais (editais e sites das bancas) em 01/11/2026. Itens ainda não conferidos no edital aparecem marcados em cada prova.</p>
    </div>
  );
}

export function ProvaDetalhe() {
  const { id } = useParams() as { id: string };
  const p = provaPorId(id);
  const e = useEstado();
  useTitulo(p?.prova || 'Prova');
  const indice = useIndiceProvas();
  const eds = useMemo(() => (indice || []).filter((x) => x.catalogoId === id).sort((a, b) => b.ano.localeCompare(a.ano) || a.fase.localeCompare(b.fase)), [indice, id]);
  if (!p) return <div className="conteudo vazio"><h3>Prova não encontrada</h3><Link className="btn sec" to="/provas">Catálogo</Link></div>;
  const alvo = e.perfil?.provasAlvo.includes(p.id);
  const alterna = () => atualiza((x) => x.perfil ? ({ ...x, perfil: { ...x.perfil, provasAlvo: alvo ? x.perfil.provasAlvo.filter((y) => y !== p.id) : [...x.perfil.provasAlvo, p.id] } }) : x);
  const f = p.formato;
  const linhas: [string, string | number | null | undefined][] = [
    ['Banca', p.banca], ['Rede', p.rede === 'publica' ? 'Pública' : p.rede === 'privada' ? 'Privada' : null],
    ['Ingresso', p.ingresso.map((x) => INGRESSO[x] || x).join(', ')], ['Fases', f?.fases], ['Questões objetivas', f?.questoes_objetivas],
    ['Discursivas', typeof f?.discursivas === 'number' ? f.discursivas : f?.discursivas], ['Duração', f?.duracao_horas ? `${f.duracao_horas} h` : null], ['Dias de prova', f?.dias],
    ['Matérias', f?.materias?.join(', ')],
  ];
  return (
    <div className="conteudo estreito">
      <nav className="migalhas"><Link to="/provas">Provas e faculdades</Link><Icone nome="direita" tam={14} /><span>{p.prova}</span></nav>
      <div className="titulo-pag prova-cab">
        <div><h1>{p.prova}</h1><p className="sub">{p.instituicao}{p.sigla && p.sigla !== p.prova ? ` (${p.sigla})` : ''} · {[p.cidade, p.uf].filter(Boolean).join(', ') || p.regiao}</p></div>
        <button className={'btn' + (alvo ? ' sec' : '')} onClick={alterna} aria-pressed={!!alvo}>{alvo ? <><Icone nome="check" /> Prova-alvo</> : 'Adicionar às provas-alvo'}</button>
      </div>
      <section className="bloco">
        <dl className="ficha">
          {linhas.filter(([, v]) => v !== null && v !== undefined && v !== '').map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
        </dl>
        {f?.observacao && <p className="miolo" style={{ marginTop: 14 }}>{f.observacao}</p>}
        {!p.verificado || p.a_verificar.length ? (
          <p className="aviso-linha"><Icone nome="info" tam={16} /> <span>{p.verificado ? 'Conferido no edital, exceto: ' : 'Ainda a conferir no edital: '}{p.a_verificar.map(campoLegivel).join('; ') || 'formato da prova'}.</span></p>
        ) : null}
        <p className="fontes">Fontes: {p.fontes.map((u, i) => <a key={i} href={u} target="_blank" rel="noreferrer noopener">{new URL(u).hostname.replace(/^www\./, '')}</a>)}</p>
      </section>
      <section className="secao">
        <h2 className="sec-tit">Simulados desta prova</h2>
        {eds.length ? (
          <div className="grade g3">
            {eds.map((ed) => (
              <Link key={ed.id} to={`/simulados/prova/${encodeURIComponent(ed.id)}`} className="cartao-sim">
                <b className="cs-titulo">{ed.titulo}</b>
                <span className="num">{plural(ed.questoes, 'questão', 'questões')} · prova completa</span>
                <span className="cs-mats">{Object.keys(ed.areas).slice(0, 6).map((a) => <span key={a}><i className="ponto" />{a}</span>)}</span>
              </Link>
            ))}
          </div>
        ) : <p className="miolo">Os simulados desta prova entram quando a prova inteira, com todas as matérias, estiver no banco{p.provas_anteriores ? <> (<a href={p.provas_anteriores} target="_blank" rel="noreferrer noopener">provas anteriores na fonte oficial</a>)</> : ''}.</p>}
      </section>
    </div>
  );
}

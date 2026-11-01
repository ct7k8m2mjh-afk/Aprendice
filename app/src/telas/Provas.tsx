import { Link, useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useTodasMaterias } from '../dados/conteudo';
import { CATALOGO, REGIOES, campoLegivel, edicoes, escolasComQuestoes, provaPorId } from '../dados/provas';
import { nomeMateria } from '../dados/materias';
import { atualiza, useEstado } from '../estado/loja';
import { norm } from '../logica/correcao';
import { plural, useTitulo } from '../ui/comum';
import { Icone } from '../ui/Icone';
import type { MateriaId } from '../dados/tipos';

const INGRESSO: Record<string, string> = { vestibular_proprio: 'Vestibular próprio', enem_sisu: 'ENEM/Sisu', enem_nota: 'Nota do ENEM', seriado: 'Seriado' };

export function Provas() {
  useTitulo('Provas e faculdades');
  const todas = useTodasMaterias();
  const e = useEstado();
  const nQ = useMemo(() => (todas ? escolasComQuestoes(todas) : new Map<string, number>()), [todas]);
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
        <section key={r} className="sec" style={{ marginTop: 24 }}>
          <h2 className="sec-tit">{r} <span className="fraco" style={{ fontWeight: 500, fontSize: 15 }}>{l.length}</span></h2>
          <div className="grade g3">
            {l.map((p) => (
              <Link key={p.id} to={`/provas/${p.id}`} className="cartao-prova">
                <div className="cp-cab"><b>{p.prova}</b>{alvo.has(p.id) && <span className="etq cor m-bio">Prova-alvo</span>}</div>
                <small>{p.instituicao}</small>
                <small className="fraco">{[p.cidade, p.uf].filter(Boolean).join(' · ')}{p.banca ? ` · banca ${p.banca}` : ''}</small>
                <div className="cp-pe">
                  <span className="etq">{p.rede === 'publica' ? 'Pública' : p.rede === 'privada' ? 'Privada' : 'Rede a verificar'}</span>
                  <span className={'etq' + (nQ.get(p.id) ? ' ok' : '')}>{nQ.get(p.id) ? `${nQ.get(p.id)} questões` : 'questões em preparação'}</span>
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
  const todas = useTodasMaterias();
  const e = useEstado();
  useTitulo(p?.prova || 'Prova');
  const eds = useMemo(() => (todas ? edicoes(todas).filter((x) => x.catalogoId === id) : []), [todas, id]);
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
        <button className={'btn' + (alvo ? ' sec' : '') + ' m-bio'} onClick={alterna} aria-pressed={!!alvo}>{alvo ? <><Icone nome="check" /> Prova-alvo</> : 'Adicionar às provas-alvo'}</button>
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
      <section className="sec">
        <h2 className="sec-tit">Simulados desta prova</h2>
        {eds.length ? (
          <div className="grade g3">
            {eds.map((ed) => (
              <Link key={ed.chave} to={`/simulados/prova/${encodeURIComponent(ed.chave)}`} className="cartao-sim">
                <b>{ed.ano}{ed.fase ? ` · ${ed.fase}` : ''}</b>
                <span className="num">{plural(ed.itens.length, 'questão', 'questões')}{f?.questoes_objetivas ? ` de ${f.questoes_objetivas}` : ''}</span>
                <span className="cs-mats">{(Object.entries(ed.porMateria) as [MateriaId, number][]).map(([m, n]) => <span key={m} className={`m-${m}`}><i className="ponto" />{nomeMateria(m).slice(0, 3)} {n}</span>)}</span>
              </Link>
            ))}
          </div>
        ) : <p className="miolo">As questões desta prova entram com a importação das provas oficiais completas{p.provas_anteriores ? <> (<a href={p.provas_anteriores} target="_blank" rel="noreferrer noopener">provas anteriores na fonte oficial</a>)</> : ''}.</p>}
      </section>
    </div>
  );
}

import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { EH_PREVIA, urlPrint, useTodasMaterias } from '../dados/conteudo';
import { materia as infoMateria, nomeMateria } from '../dados/materias';
import { atualiza, pegaEstado, useEstado } from '../estado/loja';
import { chaveMisto, resultadoMisto, RODADA_PADRAO, sorteiaMisto } from '../logica/treinoMisto';
import { Carregando, plural, useTitulo } from '../ui/comum';
import { Icone, type NomeIcone } from '../ui/Icone';
import { BotaoTelaCheia } from '../ui/QuestaoCartao';
import { QuestaoInline } from './Treino';
import type { MateriaCarregada } from '../dados/conteudo';
import type { SessaoMisto } from '../estado/tipos';

/** Nova rodada do treino geral de todas as matérias, com o tamanho escolhido em "Personalizar". */
export function novaRodadaMisto(todas: MateriaCarregada[]): SessaoMisto {
  const e = pegaEstado();
  return sorteiaMisto(todas, e.materias, e.pref.rodadaMisto || RODADA_PADRAO, { aceita: (m, q) => !EH_PREVIA || !!urlPrint(m, q.id) });
}

/** Treino geral de TODAS as matérias (comando 32): questões reais de prova sorteadas e misturadas, correção em 4 blocos.
 *  A sessão fica salva (treinoMisto) para retomar de onde parou; cada resposta conta na matéria da questão. */
export function TreinoMisto() {
  useTitulo('Treino geral');
  const nav = useNavigate();
  const todas = useTodasMaterias();
  const e = useEstado();
  const ses = e.treinoMisto;

  useEffect(() => {
    if (todas && !ses) atualiza((x) => ({ ...x, treinoMisto: novaRodadaMisto(todas) }));
  }, [todas, ses]);

  if (!todas || !ses) return <div className="conteudo"><Carregando /></div>;
  const recomecar = () => atualiza((x) => ({ ...x, treinoMisto: novaRodadaMisto(todas) }));
  const encerrar = () => { atualiza((x) => ({ ...x, treinoMisto: null })); nav('/'); };
  // ok null: questão indisponível pulada (não conta como erro)
  const avanca = (k: string, ok: boolean | null) => atualiza((x) => x.treinoMisto
    ? { ...x, treinoMisto: { ...x.treinoMisto, i: x.treinoMisto.i + 1, res: ok === null ? x.treinoMisto.res : { ...x.treinoMisto.res, [k]: ok ? 'a' : 'e' } } } : x);

  if (!ses.it.length) {
    return (
      <div className="conteudo estreito"><div className="vazio"><h3>Sem questões para sortear agora</h3>
        <p>As questões de prova entram com as provas completas.</p><Link to="/" className="btn sec">Voltar ao início</Link></div></div>
    );
  }

  if (ses.i >= ses.it.length) {
    const r = resultadoMisto(ses);
    const ok = r.reduce((a, x) => a + x.ok, 0), n = r.reduce((a, x) => a + x.n, 0);
    return (
      <div className="conteudo estreito">
        <div className="resultado-fl folha tm-fim">
          <h1>Treino concluído</h1>
          <p className="miolo num">{ok} de {n} {n === 1 ? 'questão certa' : 'questões certas'}, em {plural(r.length, 'matéria', 'matérias')}.</p>
          <ul className="tm-mats">
            {r.map((x) => (
              <li key={x.m} className={`m-${x.m}`}><i className="ponto" aria-hidden /><span>{nomeMateria(x.m)}</span><b className="num">{x.ok} de {x.n}</b></li>
            ))}
          </ul>
          <p className="miolo">Cada resposta já conta no progresso da matéria da questão. Erros e chutes entram na revisão espaçada.</p>
          <div className="fc-acoes"><button className="btn sec" onClick={encerrar}>Voltar ao início</button><button className="btn" onClick={recomecar}>Nova rodada</button></div>
        </div>
      </div>
    );
  }

  const it = ses.it[ses.i];
  const mc = todas.find((x) => x.id === it.m);
  const q = mc?.porId.get(it.id);
  const k = chaveMisto(it);
  const info = infoMateria(it.m);
  return (
    <div className={`questao-tela m-${it.m}`}>
      <div className="q-barra">
        <button className="q-volta" onClick={() => nav('/')} aria-label="Voltar (o treino fica salvo)" title="Voltar (o treino fica salvo)"><Icone nome="esquerda" /><span>Voltar</span></button>
        <div className="q-barq">
          <span className="g" aria-hidden><Icone nome={`m_${it.m}` as NomeIcone} /></span>
          <span className="n">{info?.nome}</span>
          <span className="t num" title="Treino geral de todas as matérias. O treino fica salvo se você sair"><b>Treino geral</b> · <b>{ses.i + 1}</b> de {ses.it.length}</span>
          <span className="p" aria-hidden><i style={{ width: `${((ses.i + 1) / ses.it.length) * 100}%` }} /></span>
        </div>
        <div className="q-progresso" aria-hidden>{ses.it.map((x, j) => { const v = ses.res[chaveMisto(x)]; return <i key={chaveMisto(x)} className={(j === ses.i ? 'atual ' : '') + (v ? (v === 'a' ? 'ok' : 'err') : '')} />; })}</div>
        <button className="btn fantasma peq" onClick={recomecar}>Nova rodada</button>
        <BotaoTelaCheia />
      </div>
      <div className="q-corpo">
        {mc && q
          ? <QuestaoInline key={k} mc={mc} q={q} ctx="misto" aoTerminar={(ok) => avanca(k, ok)} />
          : <div className="vazio"><p>Questão indisponível.</p><button className="btn sec" onClick={() => avanca(k, null)}>Pular</button></div>}
      </div>
    </div>
  );
}

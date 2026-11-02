import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { useTodasMaterias, type MateriaCarregada } from '../dados/conteudo';
import { MATERIAS, MATERIAS_ATIVAS, materia as infoMateria } from '../dados/materias';
import { edicoes, nomeEdicao } from '../dados/provas';
import { useEstado } from '../estado/loja';
import { atividadeRecente, materiaDeHoje, progressoEscada, resumoMateria, semana, tempoTotal } from '../logica/estatisticas';
import { Barra, Carregando, Ic3D, horasMin, plural, useTitulo } from '../ui/comum';
import { Icone } from '../ui/Icone';
import { nivelDe, nomeNivel } from '../logica/nivel';
import type { MateriaId } from '../dados/tipos';
import type { Estado } from '../estado/tipos';
import iluBio from '../assets/ilu/bio.webp';
import iluQui from '../assets/ilu/qui.webp';
import iluMat from '../assets/ilu/mat.webp';
import iluPor from '../assets/ilu/por.webp';

export const ILU: Record<string, string> = { bio: iluBio, qui: iluQui, mat: iluMat, por: iluPor };

function saudacao() {
  const h = new Date().getHours();
  return h < 5 ? 'Boa noite' : h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
}

/** Próxima questão da escada onde o aluno parou. */
export function ondeParou(todas: MateriaCarregada[], e: Estado) {
  const ult = atividadeRecente(e, 1)[0];
  if (!ult) return null;
  const mc = todas.find((x) => x.id === ult.m);
  const q = mc?.porId.get(ult.id);
  if (!mc || !q) return null;
  const escada = mc.porSub.get(q.sub) || [];
  const s = e.materias[mc.id]!;
  const prox = escada.find((x) => !s.q[x.id]?.tent.length) || q;
  const mod = mc.conteudo.modulos.find((x) => x.id === q.modulo);
  const sub = mod?.subs.find((x) => x.id === q.sub);
  return { m: mc.id, q, prox, escada, mod, sub, prog: progressoEscada(escada, s) };
}

function EscadaMini({ total, feitas }: { total: number; feitas: number }) {
  const n = Math.min(total, 10), passo = 100 / n;
  const f = Math.round((feitas / Math.max(1, total)) * n);
  return (
    <svg viewBox="0 0 100 60" className="escada-mini" aria-hidden>
      {[...Array(n)].map((_, i) => (
        <rect key={i} x={i * passo + 1} y={60 - ((i + 1) / n) * 56} width={passo - 2} height={((i + 1) / n) * 56} rx={2}
          fill={i < f ? 'var(--c)' : 'color-mix(in srgb, var(--c) 16%, var(--malha))'} />
      ))}
    </svg>
  );
}

export function Inicio() {
  useTitulo('Início');
  const e = useEstado();
  const todas = useTodasMaterias();
  const sem = semana(e);
  const meta = e.perfil?.meta || 150;
  const nome = (e.perfil?.nome || '').split(' ')[0];

  const sugerido = useMemo(() => {
    if (!todas) return null;
    const alvo = new Set(e.perfil?.provasAlvo || []);
    const eds = edicoes(todas).filter((x) => x.completa);
    return eds.find((x) => x.catalogoId && alvo.has(x.catalogoId)) || eds[0] || null;
  }, [todas, e.perfil?.provasAlvo]);

  if (!todas) return <div className="conteudo"><Carregando /></div>;

  // "matéria de hoje" só entre as que já têm questões
  const comQuestoes = todas.filter((mc) => mc.banco.length).map((mc) => mc.id);
  const hojeId: MateriaId = materiaDeHoje(e, comQuestoes.length ? comQuestoes : ['bio']);
  const hoje = infoMateria(hojeId)!;

  const resumos = Object.fromEntries(todas.map((mc) => [mc.id, resumoMateria(mc, e.materias[mc.id] || { q: {}, ult: null, sims: [], flash: {}, flg: {}, sessoes: [] })]));
  const parou = ondeParou(todas, e);
  const vencidasTot = Object.values(resumos).reduce((a, r) => a + r.vencidas, 0);
  const flashVenc = Object.values(resumos).reduce((a, r) => a + r.flashVencidos, 0);
  const totalFeitas = Object.values(resumos).reduce((a, r) => a + r.feitas, 0);
  const totalAcertos = Object.values(resumos).reduce((a, r) => a + r.acertos, 0);
  const recentes = atividadeRecente(e, 4);
  const maxDia = Math.max(1, ...sem.dias);

  return (
    <div className="conteudo inicio">
      <header className="ini-cab">
        <div>
          <h1>{saudacao()}{nome ? `, ${nome}` : ''}.</h1>
          <p className="miolo">Matéria de hoje: <Link to={`/m/${hojeId}`} className={`m-${hojeId} forte`}>{hoje.nome}</Link>, a que você menos praticou nos últimos 7 dias.</p>
        </div>
        <div className="ini-seq"><Icone nome="raio" /><span>{sem.sequencia ? <>Sequência: <b className="num">{plural(sem.sequencia, 'dia', 'dias')}</b></> : 'Sequência: comece hoje'}</span></div>
      </header>

      <div className="ini-topo">
        {parou ? (
          <Link to={`/m/${parou.m}/q/${parou.prox.id}?ctx=escada`} className={`heroi m-${parou.m}`}>
            <div className="heroi-txt">
              <h2>{parou.sub ? parou.sub.nome.charAt(0).toUpperCase() + parou.sub.nome.slice(1) : 'Seu conteúdo'}</h2>
              <p className="miolo">Continue de onde parou: {infoMateria(parou.m)?.nome} · {parou.mod?.nome} · nível {nomeNivel(nivelDe(parou.prox.dif)).toLowerCase()}</p>
              <span className="btn">Continuar <Icone nome="direita" /></span>
            </div>
            <div className="heroi-arte">
              <EscadaMini total={parou.prog.total} feitas={parou.prog.feitas} />
              <Ic3D m={parou.m} chave={parou.q.sub} tam={96} />
            </div>
          </Link>
        ) : (
          <Link to={`/m/${hojeId}/treino`} className={`heroi m-${hojeId}`}>
            <div className="heroi-txt">
              <h2>Treino geral de {hoje.nome}</h2>
              <p className="miolo">O essencial da matéria, tudo misturado: questões reais de prova, frases para completar e flashcards.</p>
              <span className="btn">Começar <Icone nome="direita" /></span>
            </div>
            <div className="heroi-arte"><img src={ILU[hojeId]} alt="" className="heroi-ilu" /></div>
          </Link>
        )}

        <section className="bloco hoje" aria-labelledby="hoje-tit">
          <h2 id="hoje-tit" className="sec-tit">Hoje</h2>
          <Link to="/revisao" className="linha-lista">
            <span className="mini"><Icone nome="repetir" /></span>
            <span><span className="tit">Revisão espaçada</span><br /><span className="det">{vencidasTot ? plural(vencidasTot, 'questão vencida', 'questões vencidas') : 'Nada vencido hoje'}</span></span>
            <Icone nome="direita" />
          </Link>
          <Link to={`/m/${hojeId}/flashcards`} className="linha-lista">
            <span className={`mini m-${hojeId}`}><Icone nome="cartas" /></span>
            <span><span className="tit">Flashcards de hoje</span><br /><span className="det">{flashVenc ? plural(flashVenc, 'cartão para revisar', 'cartões para revisar') : `${resumos[hojeId].flashNovos} cartões novos de ${hoje.nome}`}</span></span>
            <Icone nome="direita" />
          </Link>
          {sugerido && (
            <Link to={`/simulados/prova/${encodeURIComponent(sugerido.chave)}`} className="linha-lista">
              <span className="mini"><Icone nome="relogio" /></span>
              <span><span className="tit">Simulado {nomeEdicao(sugerido)}</span><br /><span className="det">{sugerido.itens.length} questões da prova · cronometrado</span></span>
              <Icone nome="direita" />
            </Link>
          )}
        </section>
      </div>

      <section className="secao">
        <div className="cab-sec"><h2>Matérias</h2><Link to="/materias">Ver todas <Icone nome="direita" tam={16} /></Link></div>
        <div className="grade g4">
          {MATERIAS_ATIVAS.map((m) => {
            const r = resumos[m.id];
            return (
              <Link key={m.id} to={`/m/${m.id}`} className={`cartao-mat m-${m.id}`}>
                <div className="cm-arte">{ILU[m.id] ? <img src={ILU[m.id]} alt="" /> : <span className="cm-arte-vazia" aria-hidden><Icone nome="camadas" tam={44} /></span>}</div>
                <div className="cm-txt">
                  <h3><span className="ponto" aria-hidden />{m.nome}</h3>
                  {r.total === 0
                    ? <p className="fraco">Questões em preparação</p>
                    : <p className="fraco num">{plural(r.feitas, 'questão feita', 'questões feitas')}</p>}
                  {r.feitas > 0 && <div className="cm-barra"><Barra valor={r.acertos / r.feitas} rotulo={`Acerto em ${m.nome}`} /><b className="num">{Math.round((r.acertos / r.feitas) * 100)}%</b></div>}
                </div>
              </Link>
            );
          })}
        </div>
        <div className="em-breve-faixa">
          <span className="fraco">Chegando com as provas completas:</span>
          {MATERIAS.filter((m) => !m.ativa).map((m) => <Link key={m.id} to={`/m/${m.id}`} className={`chip m-${m.id}`}><span className="ponto" aria-hidden />{m.nome}</Link>)}
        </div>
      </section>

      <div className="grade g2 secao">
        <section className="bloco">
          <h2 className="sec-tit">Meu progresso</h2>
          <div className="prog-nums">
            <div><b className="num">{totalFeitas}</b><span>questões feitas</span></div>
            <div><b className="num">{totalFeitas ? Math.round((totalAcertos / totalFeitas) * 100) : 0}%</b><span>de acerto</span></div>
            <div><b className="num">{horasMin(tempoTotal(e))}</b><span>de estudo</span></div>
          </div>
          <div className="semana" aria-label={`Respostas nesta semana: ${sem.semana} de ${meta}`}>
            {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((d, i) => (
              <div key={i} className="dia"><i style={{ height: `${(sem.dias[i] / maxDia) * 100}%` }} className={sem.dias[i] ? 'cheio' : ''} /><span>{d}</span></div>
            ))}
          </div>
          <p className="fraco num" style={{ fontSize: 14 }}>{sem.semana} de {meta} questões na meta desta semana</p>
        </section>
        <section className="bloco">
          <div className="cab-sec" style={{ marginBottom: 6 }}><h2 style={{ fontSize: 19 }}>Atividade recente</h2><Link to="/desempenho">Desempenho <Icone nome="direita" tam={16} /></Link></div>
          {!recentes.length && <p className="miolo" style={{ padding: '12px 0' }}>Suas últimas respostas aparecem aqui. Comece por um conteúdo ou pelo treino geral.</p>}
          {recentes.map((r) => {
            const mc = todas.find((x) => x.id === r.m)!; const q = mc.porId.get(r.id);
            if (!q) return null;
            return (
              <Link key={r.m + r.id + r.ts} to={`/m/${r.m}/q/${r.id}?ctx=escada`} className={`linha-lista m-${r.m}`}>
                <span className={'etq ' + (r.ok ? 'ok' : 'err')}>{r.ok ? 'Acertou' : 'Errou'}</span>
                <span><span className="tit" style={{ fontSize: 15 }}>{q.escola} {q.ano}{q.n ? ` · questão ${q.n}` : ''}</span><br /><span className="det">{infoMateria(r.m)?.nome} · {q.conceito.slice(0, 70)}{q.conceito.length > 70 ? '…' : ''}</span></span>
                <Icone nome="direita" />
              </Link>
            );
          })}
        </section>
      </div>
    </div>
  );
}

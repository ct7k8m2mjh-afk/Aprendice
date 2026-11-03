import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useTodasMaterias, type MateriaCarregada } from '../dados/conteudo';
import { MATERIAS_PRINCIPAIS, materia as infoMateria, nomeMateria } from '../dados/materias';
import { useEstado } from '../estado/loja';
import { atividadeRecente, materiaDeHoje, progressoEscada, resumoMateria } from '../logica/estatisticas';
import { Barra, Carregando, Ic3D, cap, plural, useTitulo } from '../ui/comum';
import { Icone } from '../ui/Icone';
import type { MateriaId } from '../dados/tipos';
import type { Estado, EstadoMateria } from '../estado/tipos';
import { ILU, IluMateria, temIlu } from '../ui/IconeMateria';

export { ILU };

const VAZIA: EstadoMateria = { q: {}, ult: null, sims: [], flash: {}, flg: {}, sessoes: [] };

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

/** Porcentagem inteira honesta: nunca arredonda para 0% quando já há algo feito. */
function pct(n: number, d: number): string {
  if (!d) return '0%';
  const v = (n / d) * 100;
  return v > 0 && v < 1 ? '<1%' : `${Math.round(v)}%`;
}

const TIPO_CTX: Record<string, string> = { escada: 'Questões do conteúdo', treino: 'Treino geral', revisao: 'Revisão espaçada', simulado: 'Simulado' };

/** Sessões recentes: respostas seguidas no mesmo conteúdo e no mesmo modo viram uma linha. */
function sessoesRecentes(todas: MateriaCarregada[], e: Estado, n: number) {
  const tent: { m: MateriaId; id: string; ts: number; ok: boolean; ctx: string }[] = [];
  for (const [m, s] of Object.entries(e.materias)) if (s) for (const [id, eq] of Object.entries(s.q))
    for (const t of eq.tent) tent.push({ m: m as MateriaId, id, ts: t.ts, ok: t.ok, ctx: t.ctx || 'escada' });
  tent.sort((a, b) => b.ts - a.ts);
  const grupos: { m: MateriaId; sub: string; subNome: string; ctx: string; ts: number; n: number; certas: number; concluido: boolean }[] = [];
  for (const t of tent) {
    const mc = todas.find((x) => x.id === t.m);
    const q = mc?.porId.get(t.id);
    if (!mc || !q) continue;
    const g = grupos[grupos.length - 1];
    if (g && g.m === t.m && g.sub === q.sub && g.ctx === t.ctx) { g.n++; if (t.ok) g.certas++; continue; }
    if (grupos.length === n) break;
    const mod = mc.conteudo.modulos.find((x) => x.id === q.modulo);
    const sub = mod?.subs.find((x) => x.id === q.sub);
    const p = progressoEscada(mc.porSub.get(q.sub) || [], e.materias[t.m] || VAZIA);
    grupos.push({ m: t.m, sub: q.sub, subNome: cap(sub?.nome || mod?.nome || ''), ctx: t.ctx, ts: t.ts, n: 1, certas: t.ok ? 1 : 0, concluido: p.total > 0 && p.feitas >= p.total });
  }
  return grupos;
}

function quando(ts: number): string {
  const d = new Date(ts), hoje = new Date(); hoje.setHours(0, 0, 0, 0);
  const hora = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const dia = new Date(ts); dia.setHours(0, 0, 0, 0);
  const dif = Math.round((hoje.getTime() - dia.getTime()) / 864e5);
  if (dif === 0) return `Hoje, ${hora}`;
  if (dif === 1) return `Ontem, ${hora}`;
  return `${d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}, ${hora}`;
}

/** Três traços verdes de destaque (decorativos). */
function Faisca({ className }: { className?: string }) {
  return (
    <svg className={'faisca ' + (className || '')} viewBox="0 0 48 30" aria-hidden>
      <path d="M8 22 3 12M24 20V3M40 22l6-10" />
    </svg>
  );
}

/** Ícone 3D principal da matéria; sem ilustração (Física, Geografia), o marcador neutro na cor da matéria. */
function IcMat({ m, tam, className = '' }: { m: MateriaId; tam: number; className?: string }) {
  return temIlu(m)
    ? <IluMateria m={m} tam={tam} className={'ini-ic ' + className} />
    : <span className={`ic3d ic3d-vazio m-${m} ${className}`} style={{ width: tam, height: tam }} aria-hidden><Icone nome="camadas" tam={Math.round(tam * 0.42)} /></span>;
}

function Anel({ valor, children }: { valor: number; children: ReactNode }) {
  const tam = 176, esp = 18, r = (tam - esp) / 2, c = 2 * Math.PI * r, v = Math.max(0, Math.min(1, valor));
  return (
    <div className="evo-anel">
      <svg viewBox={`0 0 ${tam} ${tam}`} aria-hidden>
        <defs>
          <linearGradient id="evo-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="var(--verde-claro)" /><stop offset="1" stopColor="var(--verde)" /></linearGradient>
        </defs>
        <circle cx={tam / 2} cy={tam / 2} r={r} fill="none" stroke="var(--verde-trilho)" strokeWidth={esp} />
        {v > 0 && <circle cx={tam / 2} cy={tam / 2} r={r} fill="none" stroke="url(#evo-grad)" strokeWidth={esp} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - Math.max(v, 0.012))} transform={`rotate(-90 ${tam / 2} ${tam / 2})`} />}
      </svg>
      <div className="evo-anel-txt">{children}</div>
    </div>
  );
}

export function Inicio() {
  useTitulo('Início');
  const e = useEstado();
  const todas = useTodasMaterias();
  const nome = (e.perfil?.nome || '').trim().split(/\s+/)[0];

  if (!todas) return <div className="conteudo"><Carregando /></div>;

  // "matéria de hoje" só entre as que já têm questões
  const comQuestoes = todas.filter((mc) => mc.banco.length).map((mc) => mc.id);
  const hojeId: MateriaId = materiaDeHoje(e, comQuestoes.length ? comQuestoes : ['bio']);
  const hoje = infoMateria(hojeId)!;

  const resumos = Object.fromEntries(todas.map((mc) => [mc.id, resumoMateria(mc, e.materias[mc.id] || VAZIA)]));
  const resumoDe = (m: MateriaId) => resumos[m] || { total: 0, feitas: 0, acertos: 0 };
  const parou = ondeParou(todas, e);
  const totalBanco = todas.reduce((a, mc) => a + mc.banco.length, 0);
  const totalFeitas = Object.values(resumos).reduce((a, r) => a + r.feitas, 0);
  const emEstudo = Object.entries(e.materias).filter(([, s]) => s && (Object.values(s.q).some((x) => x.tent.length) || Object.keys(s.flash).length)).length;
  const sessoes = sessoesRecentes(todas, e, 3);

  return (
    <div className="conteudo inicio">
      <div className="ini-grade">
        <div className="ini-col">
          <header className="ini-cab">
            <h1>Olá{nome ? `, ${nome}` : ''}!<Faisca className="faisca-ola" /></h1>
            <p>Que bom te ver por aqui! Continue firme nos seus estudos e siga evoluindo.</p>
          </header>

          {parou ? (
            <section className="ini-heroi" aria-labelledby="heroi-tit">
              <div className="ih-txt">
                <span className="ih-chip"><span className="ih-play" aria-hidden><Icone nome="play" tam={10} /></span>Continue de onde parou</span>
                <h2 id="heroi-tit">{infoMateria(parou.m)?.nome}</h2>
                <p className="ih-sub">{[parou.mod?.nome, parou.sub && cap(parou.sub.nome)].filter(Boolean).join(' — ')}</p>
                <div className="ih-prog">
                  <Barra valor={parou.prog.feitas / Math.max(1, parou.prog.total)} rotulo="Progresso no conteúdo" />
                  <span className="num">{pct(parou.prog.feitas, parou.prog.total)} concluído</span>
                </div>
                <Link to={`/m/${parou.m}/q/${parou.prox.id}?ctx=escada`} className="btn btn-verde">Retomar estudo <Icone nome="seta" /></Link>
              </div>
              <div className="ih-arte">
                {temIlu(parou.m) ? <IluMateria m={parou.m} className="ih-ilu" /> : <Ic3D m={parou.m} chave={parou.q.sub} tam={150} />}
              </div>
            </section>
          ) : (
            <section className="ini-heroi" aria-labelledby="heroi-tit">
              <div className="ih-txt">
                <span className="ih-chip"><span className="ih-play" aria-hidden><Icone nome="play" tam={10} /></span>Comece por aqui</span>
                <h2 id="heroi-tit">Treino geral de {hoje.nome}</h2>
                <p className="ih-sub">O essencial da matéria, tudo misturado: questões reais de prova, frases para completar e flashcards.</p>
                <Link to={`/m/${hojeId}/treino`} className="btn btn-verde">Começar treino <Icone nome="seta" /></Link>
              </div>
              <div className="ih-arte"><IcMat m={hojeId} tam={150} className="ih-ilu" /></div>
            </section>
          )}

          <section className="ini-mats" aria-labelledby="mats-tit">
            <div className="ini-sec-cab">
              <div>
                <h2 id="mats-tit">Minhas matérias<Faisca className="faisca-mats" /></h2>
                <p>Acesse o conteúdo, pratique questões e acompanhe seu progresso em cada disciplina.</p>
              </div>
              <Link to="/materias" className="ini-link">Ver todas as matérias <Icone nome="seta" tam={16} /></Link>
            </div>
            <div className="mats-grade">
              {MATERIAS_PRINCIPAIS.map((m) => {
                const r = resumoDe(m.id);
                return (
                  <Link key={m.id} to={`/m/${m.id}`} className="mat-cartao">
                    <IcMat m={m.id} tam={84} className="mc-ic" />
                    <span className="mc-txt">
                      <span className="mc-nome">{m.nome}</span>
                      <span className="mc-pct num">{r.total ? `${pct(r.feitas, r.total)} concluído` : 'Questões em preparação'}</span>
                      <span className="mc-linha">
                        <Barra valor={r.total ? r.feitas / r.total : 0} rotulo={`Concluído em ${m.nome}`} />
                        <span className="mc-seta" aria-hidden><Icone nome="seta" tam={15} /></span>
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="ini-painel ini-ativ" aria-labelledby="ativ-tit">
            <div className="ini-sec-cab">
              <div className="ip-tit">
                <span className="ip-ic" aria-hidden><Icone nome="relogio" tam={24} /></span>
                <div><h2 id="ativ-tit">Atividade recente</h2><p>Retome o que você fez e mantenha o ritmo.</p></div>
              </div>
              <Link to="/desempenho" className="ini-link">Ver histórico completo <Icone nome="seta" tam={16} /></Link>
            </div>
            {!sessoes.length && <p className="ativ-vazio">Suas últimas respostas aparecem aqui. Comece por um conteúdo ou pelo treino geral.</p>}
            {sessoes.map((s) => (
              <Link key={s.m + s.sub + s.ts} to={`/m/${s.m}/escada/${s.sub}`} className="ativ-linha">
                <IcMat m={s.m} tam={34} className="ativ-ic" />
                <span className="ativ-txt">
                  <span className="ativ-tit">{nomeMateria(s.m)} — {s.subNome}</span>
                  <span className="ativ-tipo">{TIPO_CTX[s.ctx] || 'Questões'} · {plural(s.n, 'resposta', 'respostas')}, {s.certas} {s.certas === 1 ? 'certa' : 'certas'}</span>
                </span>
                <span className="ativ-data num">{quando(s.ts)}</span>
                <span className={'ativ-status' + (s.concluido ? ' ok' : '')}>{s.concluido && <Icone nome="check" tam={14} />}{s.concluido ? 'Concluído' : 'Em andamento'}</span>
              </Link>
            ))}
          </section>
        </div>

        <aside className="ini-col ini-dir" aria-label="Seu progresso">
          <section className="ini-painel" aria-labelledby="evo-tit">
            <div className="ip-tit">
              <span className="ip-ic" aria-hidden><Icone nome="barras" tam={24} /></span>
              <div><h2 id="evo-tit">Acompanhe sua evolução</h2><p>Questões do banco que você já resolveu, em todas as matérias.</p></div>
            </div>
            <div className="evo-corpo">
              <Anel valor={totalBanco ? totalFeitas / totalBanco : 0}>
                <b className="num">{pct(totalFeitas, totalBanco)}</b><span>de evolução</span>
              </Anel>
              <ul className="evo-nums">
                <li><span className="evo-ic" aria-hidden><Icone nome="alvo" tam={20} /></span><span><b className="num">{emEstudo}</b>{emEstudo === 1 ? 'matéria em estudo' : 'matérias em estudo'}</span></li>
                <li><span className="evo-ic" aria-hidden><Icone nome="quadcheck" tam={20} /></span><span><b className="num">{totalFeitas.toLocaleString('pt-BR')}</b>{totalFeitas === 1 ? 'questão resolvida' : 'questões resolvidas'}</span></li>
                <li><span className="evo-ic" aria-hidden><Icone nome="raio" tam={20} /></span><span><b className="num">{e.simuladosFeitos.length}</b>{e.simuladosFeitos.length === 1 ? 'simulado realizado' : 'simulados realizados'}</span></li>
              </ul>
            </div>
          </section>

          <section className="ini-painel" aria-labelledby="desemp-tit">
            <div className="ip-tit">
              <span className="ip-ic" aria-hidden><Icone nome="medalha" tam={24} /></span>
              <div><h2 id="desemp-tit">Desempenho por matéria</h2><p>Seu acerto nas questões de cada disciplina.</p></div>
            </div>
            <ul className="desemp-lista">
              {MATERIAS_PRINCIPAIS.map((m) => {
                const r = resumoDe(m.id);
                return (
                  <li key={m.id}>
                    <IcMat m={m.id} tam={44} className="dl-ic" />
                    <span className="dl-nome">{m.nome}</span>
                    <Barra valor={r.feitas ? r.acertos / r.feitas : 0} rotulo={`Acerto em ${m.nome}`} />
                    <span className="dl-pct num" title={r.feitas ? undefined : 'Sem respostas ainda'}>{r.feitas ? pct(r.acertos, r.feitas) : '—'}</span>
                  </li>
                );
              })}
            </ul>
            <Link to="/desempenho" className="ini-link desemp-mais">Ver desempenho de todas as matérias <Icone nome="seta" tam={16} /></Link>
          </section>

          <section className="ini-motiva" aria-labelledby="motiva-tit">
            <Faisca className="faisca-motiva" />
            <h2 id="motiva-tit">Seu esforço de hoje constrói sua aprovação.</h2>
            <p>Cada sessão de estudo fortalece seu preparo. Mantenha a constância, avance por matéria e fique cada vez mais perto do seu objetivo.</p>
          </section>
        </aside>
      </div>
    </div>
  );
}

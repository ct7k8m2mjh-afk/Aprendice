import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent as TeclaReact } from 'react';
import { useMateria } from '../dados/conteudo';
import { materia as infoMateria } from '../dados/materias';
import { MATERIAS_ANIMADAS, useIndiceRevisao, useTemaRevisao, type Essencial, type TelaEssencial, type TemaRevisao } from '../dados/revisao';
import type { Letra, MateriaId, Questao, Resolucao } from '../dados/tipos';
import { contaEhTexto } from '../logica/fracao';
import { Carregando, cap, plural, useTitulo } from '../ui/comum';
import { Icone, type NomeIcone } from '../ui/Icone';
import { BotaoTelaCheia } from '../ui/QuestaoCartao';

import { Formula, textoRev } from '../ui/Formula';
import { ResolucaoView } from '../ui/Resolucao';
import { separaArmadilhas } from '../logica/questaoAprendice';
import { animaEscrita } from '../ui/motorAnima';
import { MapaMental } from '../ui/revisao/MapaMental';
import { FotoSlide } from '../ui/revisao/FotoSlide';
import { passosParaMotor } from '../ui/revisao/SlideRevisao';

type Item =
  | { t: 'termometro' } | { t: 'mapa' } | { t: 'tela'; tela: TelaEssencial; k: number } | { t: 'questao' } | { t: 'conexao' };

/** As telas da revisão essencial na ordem do FORMATO-ESSENCIAL: termômetro → mapa → conteúdos → questão → conexão. */
export function itensEssencial(e: Essencial): Item[] {
  const out: Item[] = [];
  if (e.termometro?.length) out.push({ t: 'termometro' });
  if (e.mapa?.ramos?.length) out.push({ t: 'mapa' });
  e.telas.forEach((tela, k) => out.push({ t: 'tela', tela, k }));
  if (e.questao_resolvida) out.push({ t: 'questao' });
  if (e.conexao?.length) out.push({ t: 'conexao' });
  return out;
}

const ROTULO: Record<Item['t'], string> = { termometro: 'O que mais cai', mapa: 'Mapa mental', tela: 'Conteúdo', questao: 'Questão Aprendice', conexao: 'Conexão' };

/**
 * REVISÃO ESSENCIAL de um tema (comandos 33 e 34): o que todo aluno precisa saber e o que é primordial nas provas, em
 * 8 a 12 telas. Rota /m/<matéria>/essencial/<tema>. Os slides completos, quando existem, ficam em "Aprofundar este
 * conteúdo", fechado, dentro da tela do conteúdo.
 */
export function RevisaoEssencial() {
  const { m, tema: temaId } = useParams() as { m: MateriaId; tema: string };
  const nav = useNavigate();
  const mc = useMateria(m);
  const tema = useTemaRevisao(m, temaId);
  const mod = mc?.conteudo.modulos.find((x) => x.id === temaId);
  useTitulo(`Revisão essencial · ${mod?.nome || temaId}`);
  const [i, setI] = useState(0);
  const itens = useMemo(() => (tema?.essencial ? itensEssencial(tema.essencial) : []), [tema]);
  const n = itens.length;
  const voltar = `/m/${m}/tema/${temaId}?aba=revisao`;
  const nomeSub = (s: string) => mod?.subs.find((x) => x.id === s)?.nome || s;

  useEffect(() => { setI(0); }, [m, temaId]);
  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      const alvo = e.target as HTMLElement;
      if (alvo && (alvo.tagName === 'INPUT' || alvo.tagName === 'TEXTAREA') || e.ctrlKey || e.metaKey || e.altKey) return;
      if (alvo?.closest('.ra')) return;
      if (e.key === 'ArrowRight' && i + 1 < n) { e.preventDefault(); setI(i + 1); window.scrollTo({ top: 0 }); }
      else if (e.key === 'ArrowLeft' && i > 0) { e.preventDefault(); setI(i - 1); window.scrollTo({ top: 0 }); }
      else if (e.key === 'Escape' && !document.querySelector('.lupa')) nav(voltar);
    };
    addEventListener('keydown', f);
    return () => removeEventListener('keydown', f);
  });

  if (!mc || tema === undefined) return <div className="conteudo"><Carregando /></div>;
  if (!tema?.essencial || !mod || !n) {
    return (
      <div className={`conteudo vazio m-${m}`}>
        <h3>Revisão essencial em preparação</h3>
        <p>A revisão essencial deste tema ainda está sendo conferida pela banca do Aprendice.</p>
        <Link className="btn sec" to={mod ? `/m/${m}/tema/${mod.id}` : `/m/${m}`}>Voltar ao tema</Link>
      </div>
    );
  }
  const it = itens[Math.min(i, n - 1)];
  const vai = (k: number) => { setI(k); window.scrollTo({ top: 0 }); };

  return (
    <div className={`questao-tela rv-tela es-tela m-${m}` + (MATERIAS_ANIMADAS.has(m) ? '' : ' sem-anima')}>
      <div className="q-barra">
        <button className="q-volta" onClick={() => nav(voltar)} aria-label="Voltar" title="Voltar (Esc)"><Icone nome="esquerda" /><span>Voltar</span></button>
        <div className="q-barq">
          <span className="g" aria-hidden><Icone nome={`m_${m}` as NomeIcone} /></span>
          <span className="n">Revisão essencial</span>
          <span className="t"><b>{mod.nome}</b> · {infoMateria(m)?.nome}</span>
          <span className="p" aria-hidden><i style={{ width: `${((i + 1) / n) * 100}%` }} /></span>
        </div>
        <BotaoTelaCheia />
      </div>

      <article className={'rv-slide folha es-' + it.t} aria-labelledby="es-tit" key={i}>
        <header className="rv-cab">
          <span className="etq cor">{ROTULO[it.t]}</span>
          {it.t === 'tela' && <span className="etq">{cap(nomeSub(it.tela.sub))}</span>}
          <span className="rv-pos num">{i + 1} de {n}</span>
        </header>
        {it.t === 'termometro' && <Termometro e={tema.essencial} nomeSub={nomeSub} />}
        {it.t === 'mapa' && (
          <>
            <h2 id="es-tit" className="rv-tit">{tema.essencial.mapa!.centro}</h2>
            <MapaMental centro={tema.essencial.mapa!.centro} ramos={tema.essencial.mapa!.ramos} anima={MATERIAS_ANIMADAS.has(m)} />
          </>
        )}
        {it.t === 'tela' && <TelaConteudo m={m} tema={tema} tela={it.tela} />}
        {it.t === 'questao' && <QuestaoResolvida m={m} e={tema.essencial} />}
        {it.t === 'conexao' && (
          <>
            <h2 id="es-tit" className="rv-tit">Conexão com outras matérias</h2>
            <ul className="es-conexao">{tema.essencial.conexao!.map((c, k) => <li key={k}><span className="etq">{c.materia}</span><p>{textoRev(c.frase)}</p></li>)}</ul>
          </>
        )}
      </article>

      <nav className="rv-nav" aria-label="Telas da revisão">
        <button className="btn sec" onClick={() => vai(i - 1)} disabled={i === 0}><Icone nome="esquerda" /> <span>Anterior</span></button>
        <div className="rv-pontos" aria-hidden>{itens.map((_, j) => <i key={j} className={j < i ? 'feito' : j === i ? 'atual' : ''} />)}</div>
        {i + 1 < n
          ? <button className="btn" onClick={() => vai(i + 1)}><span>Próximo</span> <Icone nome="direita" /></button>
          : <button className="btn" onClick={() => nav(voltar)}><span>Concluir</span> <Icone nome="check" /></button>}
      </nav>
    </div>
  );
}

const PESO: Record<string, [string, number]> = { alta: ['Cai muito', 3], media: ['Cai às vezes', 2], baixa: ['Cai pouco', 1] };

function Termometro({ e, nomeSub }: { e: Essencial; nomeSub: (s: string) => string }) {
  return (
    <>
      <h2 id="es-tit" className="rv-tit">O que mais cai neste tema</h2>
      <ol className="es-termo">
        {e.termometro!.map((t, k) => {
          const [rot, nv] = PESO[t.peso] || PESO.baixa;
          return (
            <li key={k}>
              <div className="es-termo-cab">
                <b>{cap(nomeSub(t.sub))}</b>
                <span className={'es-peso p' + nv} role="img" aria-label={rot}><i /><i /><i /><small>{rot}</small></span>
              </div>
              {t.como_cai && <p>{textoRev(t.como_cai)}</p>}
              {t.provas && <small className="es-provas">{t.provas}</small>}
            </li>
          );
        })}
      </ol>
    </>
  );
}

function TelaConteudo({ m, tema, tela }: { m: MateriaId; tema: TemaRevisao; tela: TelaEssencial }) {
  const prosa = contaEhTexto('1 + 1', m);
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!ref.current || !MATERIAS_ANIMADAS.has(m) || (typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
    const c = animaEscrita(ref.current, '.fm-linha', 300);
    return () => c.cancela();
  }, [tela, m]);
  const temVisual = !!tela.visual?.foto?.img;
  const slides = tema.slides?.[tela.sub]?.length || 0;
  return (
    <div className={'rv-corpo' + (temVisual ? ' es-com-vis' : '')}>
      <div className="rv-txt">
        <h2 id="es-tit" className="rv-tit">{tela.titulo}</h2>
        <ul className="es-pontos">{tela.pontos.map((p, k) => <li key={k}>{textoRev(p)}</li>)}</ul>
        {tela.formula && <div ref={ref}><Formula tex={tela.formula} prosa={prosa} className="rv-formula" /></div>}
        {tela.pegadinha && <p className="es-pegadinha"><b>Pegadinha</b>{textoRev(tela.pegadinha)}</p>}
        {slides > 0 && (
          <details className="es-aprofundar">
            <summary>Aprofundar este conteúdo</summary>
            <p>A revisão completa em slides, com as questões reais e o ciclo de 5 tempos.</p>
            <Link className="btn sec peq" to={`/m/${m}/revisao/${tela.sub}`}>{plural(slides, 'slide', 'slides')} · abrir <Icone nome="direita" tam={15} /></Link>
          </details>
        )}
      </div>
      {temVisual && <div className="rv-vis-col"><FotoSlide m={m} v={tela.visual!} anima={MATERIAS_ANIMADAS.has(m)} /></div>}
    </div>
  );
}

const LETRAS = ['A', 'B', 'C', 'D', 'E'];

/**
 * Questão Aprendice da revisão (identificada como tal; CLAUDE.md, princípio 1). Depois de responder, a correção é a mesma
 * da questão de prova, nos 4 blocos e nesta ordem (revisão de 19/11/2026, item 20): Por que eu errei · Resposta correta +
 * a pegadinha · Resolução (animada em Bio, Quí, Mat e Fís) · Por que as outras estão erradas (fechado).
 */
export function QuestaoResolvida({ m, e }: { m: MateriaId; e: Essencial }) {
  const q = e.questao_resolvida!;
  const [esc, setEsc] = useState<string | null>(null);
  const [ver, setVer] = useState(false);
  const grupo = useRef<HTMLDivElement>(null);
  const prosa = contaEhTexto('1 + 1', m);
  const res = useMemo(() => (q.passos?.length ? passosParaMotor(q.passos, prosa) : null), [q, prosa]);
  const alts = q.alternativas.map((a, k) => { const r = /^([A-E])\)\s*/.exec(a); return { l: r ? r[1] : LETRAS[k], t: r ? a.slice(r[0].length) : a }; });
  const enun = q.enunciado.replace(/^Questão Aprendice\.\s*/, '');
  // responder pelo teclado, como na questão de prova (princípio 6; revisão de 21/11, N2): A–E (ou 1–5) marca, Enter confere
  useEffect(() => {
    if (ver) return;
    const f = (ev: KeyboardEvent) => {
      const alvo = ev.target as HTMLElement | null;
      if (alvo && (alvo.tagName === 'INPUT' || alvo.tagName === 'TEXTAREA') || ev.ctrlKey || ev.metaKey || ev.altKey) return;
      const k = ev.key.toUpperCase();
      const l = ({ 1: 'A', 2: 'B', 3: 'C', 4: 'D', 5: 'E' } as Record<string, string>)[k] || k;
      if (/^[A-E]$/.test(l) && alts.some((x) => x.l === l)) { ev.preventDefault(); setEsc(l); return; }
      // Enter num outro botão (Voltar, "Ver a resolução sem responder") faz o que o botão faz
      if (ev.key === 'Enter' && esc && !(alvo?.closest('button') && !alvo.closest('.es-alts'))) { ev.preventDefault(); setVer(true); }
    };
    addEventListener('keydown', f);
    return () => removeEventListener('keydown', f);
  });
  // setas dentro do grupo de alternativas: anda entre as opções e marca (o foco acompanha), sem trocar de cartão
  const setas = (ev: TeclaReact<HTMLButtonElement>, k: number) => {
    const d = ev.key === 'ArrowDown' || ev.key === 'ArrowRight' ? 1 : ev.key === 'ArrowUp' || ev.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    ev.preventDefault(); ev.stopPropagation();
    const n = (k + d + alts.length) % alts.length;
    setEsc(alts[n].l);
    grupo.current?.querySelectorAll<HTMLButtonElement>('button[role="radio"]')[n]?.focus();
  };
  // a correção da questão de prova, com os campos que a Questão Aprendice tem (logica/questaoAprendice.ts)
  const correcao = useMemo(() => {
    const arm = separaArmadilhas(q.por_que_erram, q.gabarito);
    const certa = alts.find((x) => x.l === q.gabarito);
    const r: Resolucao = {
      ...(res || {}),
      resposta: certa ? `Alternativa ${certa.l} — ${certa.t}` : `Alternativa ${q.gabarito}`,
      armadilha: arm.pegadinha || undefined,
      erradas: arm.porLetra as Resolucao['erradas'],
    };
    const qq = { id: 'aprendice', escola: 'Questão Aprendice', ano: '', n: '', banca: '', fase: '', enun, alts: {}, gab: q.gabarito as Letra,
      modulo: '', sub: '', dif: 0, degrau: 0, conceito: '', pista: '', url: '', origem: 'prova', figura: false } as Questao;
    return { r, qq };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, res]);
  return (
    <>
      <h2 id="es-tit" className="rv-tit">Questão Aprendice</h2>
      <p className="es-qa">Criada pelo Aprendice no estilo das provas. Não é questão de vestibular.</p>
      <p className="rv-texto">{textoRev(enun)}</p>
      <div className="es-alts" role="radiogroup" aria-label="Alternativas" ref={grupo}>
        {alts.map(({ l, t }, k) => (
          <button key={l} type="button" role="radio" aria-checked={esc === l} disabled={ver}
            tabIndex={esc === l || (!esc && k === 0) ? 0 : -1} onKeyDown={(ev) => setas(ev, k)}
            className={'es-alt' + (esc === l ? ' sel' : '') + (ver && l === q.gabarito ? ' certa' : '') + (ver && esc === l && l !== q.gabarito ? ' errada' : '')}
            onClick={() => setEsc(l)}>
            <span className="alt-l">{l}</span><span>{textoRev(t)}</span>
          </button>
        ))}
      </div>
      {!ver ? (
        <div className="rv-tenta-acoes">
          <button type="button" className="btn" disabled={!esc} onClick={() => setVer(true)}>Conferir</button>
          <button type="button" className="ra-link" onClick={() => setVer(true)}>Ver a resolução sem responder</button>
        </div>
      ) : (
        <div className="es-res">
          <ResolucaoView q={correcao.qq} r={correcao.r} marcada={(esc as Letra) || null} materia={m} semFonte
            origem={<p className="fraco">Questão Aprendice: gabarito da banca do Aprendice, conferido de forma independente.</p>} />
          {!res && q.passos?.length ? (
            <ol className="rv-passos es-passos-txt">{q.passos.map((p, k) => <li key={k}><span className="rv-passo-n num" aria-hidden>{k + 1}</span><div><b>{p.faz}</b><Formula tex={p.conta} prosa={prosa} /></div></li>)}</ol>
          ) : null}
        </div>
      )}
    </>
  );
}

/** Revisão essencial de todos os temas da matéria que já a têm (atalho na tela da matéria). */
export function EssencialMateria() {
  const { m } = useParams() as { m: MateriaId };
  const mc = useMateria(m);
  const ind = useIndiceRevisao(m);
  useTitulo(`Revisão essencial · ${infoMateria(m)?.nome || ''}`);
  if (!mc || !ind) return <div className="conteudo"><Carregando /></div>;
  const temas = mc.conteudo.modulos.filter((x) => ind.temas[x.id]?.essencial);
  return (
    <div className={`conteudo m-${m}`}>
      <div className="titulo-pag"><div><h1>Revisão essencial de {infoMateria(m)?.nome}</h1><p className="sub">Por tema: o que mais cai, o mapa mental, uma tela por conteúdo, uma Questão Aprendice e a conexão com outras matérias.</p></div></div>
      {!temas.length ? <div className="vazio"><h3>Em preparação</h3><p>A revisão essencial chega tema a tema, depois de revisada pela banca do Aprendice.</p></div> : (
        <ul className="tp-enc es-lista">
          {temas.map((t) => (
            <li key={t.id}><Link to={`/m/${m}/essencial/${t.id}`}>
              <i className="ponto-sub" aria-hidden />
              <span className="t"><b>{t.nome}</b><span>{plural(ind.temas[t.id].essencial!, 'tela de conteúdo', 'telas de conteúdo')}, mapa mental e Questão Aprendice</span></span>
              <span className="p" />
              <Icone nome="direita" className="tp-seta" />
            </Link></li>
          ))}
        </ul>
      )}
    </div>
  );
}

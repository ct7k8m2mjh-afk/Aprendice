import { useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { partesFracao } from '../logica/fracao';
import { textoMao } from './maoGlifos';
import type { Resolucao } from '../dados/tipos';
import { montaRoteiro, type LinhaRot, type Roteiro, type Tok } from '../logica/motorConta';
import { animaPasso, type Controle } from './motorAnima';
import { comFracoes, Fracao } from './Fracao';
import { Icone } from './Icone';

/**
 * RESOLUÇÃO ANIMADA (comando 20): um único motor para todas as resoluções, a partir de `res.passos` (ou `res.quadro`).
 * A conta é escrita à mão, passo a passo; em cada passagem os termos se movem na tela (logica/motorConta.ts diz de onde
 * cada termo vem; ui/motorAnima.ts anima). Texto (Biologia, Química, Português): cada passo entra em sequência, com o
 * marca-texto no termo-chave.
 *
 * O que está no DOM é sempre o estado final de cada passo, igual ao texto dos dados (testado em motorConta.test.ts);
 * a animação só move, revela e risca por cima. Com "reduzir movimento", mostra direto o estado final.
 * Controles: tocar/pausar, passo anterior/próximo, velocidade (0,75× a 2×), ver tudo, recomeçar. Teclado: espaço toca e
 * pausa, ← e → mudam de passo; enquanto a resolução toca (ou o foco está nela), essas teclas são dela: não mudam de
 * questão nem rolam a página (auditoria A3).
 */
const VELS = [0.75, 1, 1.5, 2];
function velSalva(): number {
  try { const v = Number(localStorage.getItem('ra-vel')); return VELS.includes(v) ? v : 1; } catch { return 1; }
}
export function ResolucaoAnimada({ r, materia }: { r: Resolucao; materia?: string }) {
  const rt = useMemo(() => montaRoteiro(r, materia), [r, materia]);
  const n = rt.passos.length;
  const menos = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  // atual: -1 = ainda não começou; 0..n-1 = passo em cena; n = tudo à vista (fim)
  const [atual, setAtual] = useState(menos ? n : -1);
  const [tocando, setTocando] = useState(false);
  const [rodada, setRodada] = useState(0);
  const [animando, setAnimando] = useState(false);
  const [vel, setVel] = useState(velSalva);
  const folha = useRef<HTMLDivElement>(null);
  const secao = useRef<HTMLElement>(null);
  const ctl = useRef<Controle | null>(null);
  const tocandoRef = useRef(tocando);
  tocandoRef.current = tocando;

  // nova resolução (outra questão): volta ao começo
  useEffect(() => { setAtual(menos ? n : -1); setTocando(false); }, [rt]); // eslint-disable-line react-hooks/exhaustive-deps

  // riscos: (linha, termo, parte, subtermo) → passo em que o termo é riscado
  const riscos = useMemo(() => {
    const m = new Map<string, number>();
    rt.passos.forEach((p, k) => p.linhas.forEach((l) => rt.linhas[l].planos.forEach((pl) => pl.riscos.forEach((x) => m.set(`${x.l}:${x.i}:${x.p || ''}:${x.s ?? ''}`, k)))));
    return m;
  }, [rt]);
  const visivel = atual < 0 ? -1 : atual;

  useLayoutEffect(() => {
    if (menos || atual < 0 || atual >= n || !folha.current) return;
    const el = folha.current.querySelector<HTMLElement>(`[data-passo="${atual}"]`);
    if (!el) return;
    const c = animaPasso(el, folha.current, rt, atual, vel);
    ctl.current = c;
    setAnimando(true);
    if (!tocandoRef.current) c.pausa();
    let vivo = true;
    c.fim.then((ok) => {
      if (!vivo) return;
      setAnimando(false);
      if (ok && tocandoRef.current) {
        if (atual + 1 >= n) { setTocando(false); setAtual(n); } else setAtual(atual + 1);
      } else if (ok && atual + 1 >= n) setAtual(n);
    });
    return () => { vivo = false; c.cancela(); if (ctl.current === c) ctl.current = null; };
  }, [atual, rodada, rt, n, menos]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const c = ctl.current;
    if (!c) return;
    if (tocando) c.toca(); else c.pausa();
  }, [tocando]);
  useEffect(() => { ctl.current?.velocidade(vel); }, [vel]);

  const comeca = () => { setTocando(true); setAtual(0); setRodada((x) => x + 1); };
  const vaiPara = (k: number) => {
    const alvo = Math.max(0, Math.min(n - 1, k));
    setAtual(alvo); setRodada((x) => x + 1);
    if (!tocando) setTocando(true);
  };
  const alterna = () => {
    if (atual < 0 || atual >= n) return comeca();
    if (!animando) { vaiPara(atual + 1 >= n ? 0 : atual + 1); return; }
    setTocando((x) => !x);
  };
  const anterior = () => { if (atual > 0) vaiPara(atual >= n ? n - 1 : atual - 1); };
  const proximo = () => { if (atual >= 0 && atual < n - 1) vaiPara(atual + 1); };
  const tudo = () => { ctl.current?.cancela(); setTocando(false); setAtual(n); };
  const trocaVel = () => {
    const v = VELS[(VELS.indexOf(vel) + 1) % VELS.length];
    setVel(v);
    try { localStorage.setItem('ra-vel', String(v)); } catch { /* sem armazenamento */ }
  };

  // teclado: enquanto a resolução toca (de 0 ao último passo) ou o foco está nela, ←, → e espaço são dela
  const ativa = atual >= 0 && atual < n;
  const acoes = useRef({ alterna, anterior, proximo });
  acoes.current = { alterna, anterior, proximo };
  useEffect(() => {
    const f = (e: globalThis.KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const alvo = e.target as HTMLElement | null;
      if (alvo && (alvo.tagName === 'INPUT' || alvo.tagName === 'TEXTAREA' || alvo.isContentEditable)) return;
      const dentro = !!(alvo && secao.current?.contains(alvo));
      if (!ativa && !dentro) return;
      // fora da resolução, com outra coisa focada (um botão da tela), o espaço é desse botão
      if (e.key === ' ' && !dentro && alvo && alvo !== document.body && alvo.tagName === 'BUTTON') return;
      const k = e.key;
      if (k !== 'ArrowLeft' && k !== 'ArrowRight' && k !== ' ' && !(k === 'Enter' && dentro)) return;
      e.stopImmediatePropagation();
      if (k === 'Enter') return; // Enter num botão da resolução aciona o botão, não a próxima questão
      if (k === ' ' && dentro && alvo?.tagName === 'BUTTON') return; // espaço num botão: o próprio botão
      e.preventDefault();
      if (k === ' ') acoes.current.alterna();
      else if (k === 'ArrowRight') acoes.current.proximo();
      else acoes.current.anterior();
    };
    window.addEventListener('keydown', f, true);
    return () => window.removeEventListener('keydown', f, true);
  }, [ativa]);
  // barra de controles sempre à vista enquanto toca (auditoria A2): o painel da questão corta o "sticky" (overflow),
  // então a barra é presa por conta própria logo abaixo do que estiver fixo no alto (topo do site, barra da questão)
  const ctlRef = useRef<HTMLDivElement>(null);
  const lugar = useRef<HTMLDivElement>(null);
  const mostraBarra = !menos && atual >= 0;
  useEffect(() => {
    if (!mostraBarra) return;
    const bar = ctlRef.current, ph = lugar.current, sec = secao.current;
    if (!bar || !ph || !sec) return;
    let rolador: HTMLElement | null = sec.parentElement;
    while (rolador && !(/(auto|scroll)/.test(getComputedStyle(rolador).overflowY) && rolador.scrollHeight > rolador.clientHeight + 1)) rolador = rolador.parentElement;
    const ajusta = () => {
      let limite = rolador ? rolador.getBoundingClientRect().top : 0;
      for (const sel of ['.topo', '.q-barra']) {
        const e = document.querySelector<HTMLElement>(sel);
        if (!e) continue;
        const r = e.getBoundingClientRect();
        if (r.height && r.bottom > limite && r.top < limite + 140 && getComputedStyle(e).position !== 'static') limite = Math.max(limite, r.bottom);
      }
      limite += 6;
      const p = ph.getBoundingClientRect(), f = folha.current?.getBoundingClientRect();
      const h = bar.offsetHeight;
      const prende = p.top < limite && !!f && f.bottom > limite + h + 12;
      if (prende) {
        ph.style.height = `${h}px`;
        Object.assign(bar.style, { position: 'fixed', top: `${limite}px`, left: `${p.left}px`, width: `${p.width}px` });
        bar.classList.add('presa');
      } else {
        ph.style.height = '0px';
        Object.assign(bar.style, { position: '', top: '', left: '', width: '' });
        bar.classList.remove('presa');
      }
    };
    ajusta();
    window.addEventListener('scroll', ajusta, true);
    window.addEventListener('resize', ajusta);
    return () => { window.removeEventListener('scroll', ajusta, true); window.removeEventListener('resize', ajusta); Object.assign(bar.style, { position: '', top: '', left: '', width: '' }); };
  }, [mostraBarra, n]);
  // o foco nunca cai no corpo da página enquanto a resolução está ativa (botão que fica inativo segura o foco)
  const segura = (e: KeyboardEvent<HTMLElement>) => { if (e.key === 'Enter') e.stopPropagation(); };

  if (!n) return null;
  const rotPasso = atual < 0 ? `${n} ${n === 1 ? 'passo' : 'passos'}` : atual >= n ? `${n} de ${n} passos` : `Passo ${atual + 1} de ${n}`;
  const conta = rt.linhas.some((l) => l.conta);
  const rotVel = `${String(vel).replace('.', ',')}×`;

  return (
    <section className="ra" aria-labelledby="ra-tit" ref={secao} onKeyDown={segura}>
      <h3 id="ra-tit" className="cor-tit">Resolução animada</h3>
      {!menos && (atual < 0 ? (
        <div className="ra-assistir">
          <button type="button" className="btn" onClick={comeca}><Icone nome="play" tam={18} />Assistir resolução</button>
          <span className="ra-ass-txt">{rotPasso}{conta ? ', escritos à mão na sua frente' : ', um de cada vez'}</span>
          <button type="button" className="ra-link" onClick={tudo}>Ver sem animação</button>
        </div>
      ) : (
        <><div ref={lugar} aria-hidden className="ra-ctl-lugar" />
        <div className="ra-ctl" ref={ctlRef} role="toolbar" aria-label="Controles da resolução animada">
          <button type="button" className="ra-bt" onClick={alterna} aria-label={tocando && animando ? 'Pausar' : atual >= n ? 'Assistir de novo' : 'Tocar'}>
            <Icone nome={tocando && animando ? 'pausa' : 'play'} tam={15} /><span className="rot">{tocando && animando ? 'Pausar' : atual >= n ? 'De novo' : 'Tocar'}</span>
          </button>
          <button type="button" className="ra-bt ic" onClick={anterior} aria-disabled={atual <= 0} aria-label="Passo anterior" title="Passo anterior (←)"><Icone nome="esquerda" tam={17} /></button>
          <button type="button" className="ra-bt ic" onClick={proximo} aria-disabled={atual < 0 || atual >= n - 1} aria-label="Próximo passo" title="Próximo passo (→)"><Icone nome="direita" tam={17} /></button>
          <button type="button" className="ra-bt vel" onClick={trocaVel} aria-label={`Velocidade da escrita: ${rotVel}`} title="Velocidade da escrita">{rotVel}</button>
          <span className="ra-pp" aria-live="polite"><span className="longo">{rotPasso}</span><span className="curto" aria-hidden>{atual >= n ? `${n}/${n}` : `${atual + 1}/${n}`}</span></span>
          {atual < n && <button type="button" className="ra-bt ic" onClick={tudo} aria-label="Pular para o quadro final" title="Pular para o quadro final"><Icone nome="lista" tam={16} /></button>}
          <button type="button" className="ra-bt ic" onClick={comeca} aria-label="Recomeçar" title="Recomeçar"><Icone nome="repetir" tam={16} /></button>
        </div></>
      ))}
      <div className={'ra-folha' + (atual < 0 ? ' espera' : '')} ref={folha}>
        <ol className={'ra-passos de-' + rt.origem}>
          {rt.passos.map((p, k) => (
            <li key={k} className="ra-passo" data-passo={k} hidden={atual < 0 || k > visivel ? true : undefined}>
              {rt.origem === 'passos' && <span className="ra-n" aria-hidden>{k + 1}</span>}
              <div className="ra-corpo">
                {p.faz && <b className="ra-faz">{comFracoes(p.faz)}</b>}
                {p.linhas.map((l) => (
                  <div key={l} className="ra-lin">
                    <Linha L={rt.linhas[l]} l={l} riscos={riscos} ate={atual >= n ? n : visivel} />
                    {rt.linhas[l].nota && <span className="ra-nota" data-nota={l}>{comFracoes(rt.linhas[l].nota!)}</span>}
                  </div>
                ))}
                {p.porque && <p className="ra-porque">{comFracoes(p.porque)}</p>}
              </div>
            </li>
          ))}
        </ol>
        <div className="ra-fantasmas" aria-hidden />
      </div>
    </section>
  );
}

/** texto da conta na letra à mão, com fração empilhada (também aninhada), expoente, índice e sinais desenhados */
function mao(s: string): ReactNode {
  const ps = partesFracao(s);
  if (ps.length === 1 && ps[0].t === 'txt') return textoMao(s);
  return ps.map((p, i) => (p.t === 'txt' ? <span key={i}>{textoMao(p.v)}</span>
    : p.t === 'nuc' ? <span key={i}>{comFracoes(p.orig)}</span>
      : <Fracao key={i} p={p} n={mao(p.n)} d={mao(p.d)} />));
}

/** Um processo desenhado (fluxo, reação, cadeia, pares, contraste, etapas): peças com o texto dos dados, na ordem. */
function Diagrama({ L, l }: { L: LinhaRot; l: number }) {
  const dg = L.diagrama!;
  const conteudo = (x: string) => (L.conta ? mao(x) : comFracoes(x));
  const chave = (a: number, b: number) => !!L.marca && a < L.marca[1] && b > L.marca[0];
  return (
    <p className={`ra-linha diag dg-${dg.tipo} ${L.conta ? 'conta' : 'texto'}`} data-l={l} data-dg={dg.tipo}>
      {dg.pecas.map((p, k) => {
        const t = L.texto.slice(p.ini, p.fim);
        if (p.papel === 'seta') {
          return (
            <span key={k} className="dg-seta" data-k={k}>
              <svg viewBox="0 0 40 16" aria-hidden focusable="false"><path className="dg-traco" d="M2 8 Q20 7 36 8 M29 2 Q34 6 37 8 Q34 10 29 14" /></svg>
              <span className="sr">{t}</span>
            </span>
          );
        }
        if (p.papel === 'div') return <span key={k} className="dg-div" data-k={k}>{/[|;]/.test(t) ? <span className="sr">{t}</span> : t}</span>;
        if (p.papel === 'mais' || p.papel === 'liga' || p.papel === 'vs') return <span key={k} className={`dg-${p.papel}`} data-k={k}>{conteudo(t)}</span>;
        if (!t.trim()) return <span key={k}>{t}</span>;
        const cls = `dg-${p.papel === 'item' ? 'item' : p.papel}` + (chave(p.ini, p.fim) && p.papel !== 'rotulo' ? ' dg-chave' : '');
        return <span key={k} className={cls} data-k={k} data-lado={p.lado}>{conteudo(t)}</span>;
      })}
    </p>
  );
}

/** quebras de linha só em lugar de conta (auditoria M3): depois de seta, vírgula, ponto e vírgula, dois-pontos e
 *  conjunção; antes de "=" só numa igualdade encadeada e nunca antes do último "=" (o resultado não fica sozinho);
 *  nunca dentro de parênteses */
function quebras(ts: Tok[]): Set<number> {
  const ok = new Set<number>();
  const prox = (i: number) => { for (let j = i + 1; j < ts.length; j++) if (ts[j].k !== 'esp') return ts[j]; return undefined; };
  const ant = (i: number) => { for (let j = i - 1; j >= 0; j--) if (ts[j].k !== 'esp') return ts[j]; return undefined; };
  // quantos "=" há em cada trecho (entre setas e pontuação)
  const trecho: number[] = [], total: number[] = [];
  let prof = 0, tr = 0;
  ts.forEach((t, i) => {
    if (t.k === 'abre') prof++;
    if (t.k === 'fecha') prof--;
    trecho[i] = tr;
    if (prof === 0 && t.k === 'rel') total[tr] = (total[tr] || 0) + 1;
    if (prof === 0 && (t.k === 'seta' || t.k === 'pont')) tr++;
  });
  prof = 0;
  const vistos: number[] = [];
  ts.forEach((t, i) => {
    if (t.k === 'abre') prof++;
    if (t.k === 'fecha') prof--;
    if (t.k === 'rel' && prof === 0) vistos[trecho[i]] = (vistos[trecho[i]] || 0) + 1;
    if (t.k !== 'esp' || prof !== 0) return;
    const a = ant(i), p = prox(i);
    if (!a || !p) return;
    const conj = (x: Tok) => x.k === 'var' && /^(e|ou|logo|então)$/.test(x.v);
    if (a.k === 'seta' || a.k === 'pont' || conj(a) || conj(p)) ok.add(i);
    // antes de um "=" que não é o primeiro nem o último do trecho
    else if (p.k === 'rel' && (vistos[trecho[i]] || 0) >= 1 && (vistos[trecho[i]] || 0) + 1 < (total[trecho[i]] || 0)) ok.add(i);
  });
  return ok;
}

/** Uma linha da conta no estado final: cada termo num <span data-i> (fração empilhada com os termos em data-s), com
 *  riscos e marca-texto; os pedaços entre quebras permitidas ficam juntos (sem quebrar no meio). */
function Linha({ L, l, riscos, ate }: { L: LinhaRot; l: number; riscos: Map<string, number>; ate: number }) {
  if (L.diagrama) return <Diagrama L={L} l={l} />;
  if (!L.conta) {
    const [a, b] = L.marca || [0, 0];
    return (
      <p className="ra-linha texto" data-l={l}>
        {L.marca ? <>{comFracoes(L.texto.slice(0, a))}<mark className="ra-marca">{comFracoes(L.texto.slice(a, b))}</mark>{comFracoes(L.texto.slice(b))}</> : comFracoes(L.texto)}
      </p>
    );
  }
  const risco = (i: number, p?: 'n' | 'd', s?: number) => {
    const k = riscos.get(`${l}:${i}:${p || ''}:${s ?? ''}`);
    return k != null && k <= ate ? <span className="ra-risco" aria-hidden /> : null;
  };
  const termos = (ts: Tok[], i: number, p: 'n' | 'd'): ReactNode => ts.map((t, s) => (t.k === 'esp' ? t.v
    : <span key={s} className={'ra-st' + (t.k === 'op' || t.k === 'rel' ? ' op' : '')} data-s={s}>{t.k === 'frac' ? mao(t.v) : textoMao(t.v)}{risco(i, p, s)}</span>));
  const brk = quebras(L.toks);
  const unidades: ReactNode[][] = [[]];
  let pos = 0;
  L.toks.forEach((t, i) => {
    const ini = pos; pos += t.v.length;
    const marca = !!L.marca && ini >= L.marca[0] && pos <= L.marca[1] ? ' ra-marca' : '';
    const u = unidades[unidades.length - 1];
    if (t.k === 'esp') {
      if (brk.has(i)) { unidades.push([t.v]); unidades.push([]); return; }
      u.push(marca ? <span key={i} className="ra-esp ra-marca">{t.v}</span> : t.v);
      return;
    }
    const cls = 'ra-t' + (t.k === 'op' || t.k === 'rel' || t.k === 'seta' ? ' op' : '') + marca;
    if (t.k === 'frac') {
      u.push(
        <Fracao key={i} p={{ t: 'frac', n: t.n!, d: t.d!, orig: t.v, sep: t.sep, pn: t.pn, pd: t.pd }} className={cls + ' frac'} props={{ 'data-i': i }}
          n={<>{termos(t.nt!, i, 'n')}{risco(i, 'n')}</>} d={<>{termos(t.dt!, i, 'd')}{risco(i, 'd')}</>} />,
      );
    } else if (t.k === 'nuc') {
      u.push(<span key={i} className={cls} data-i={i}>{comFracoes(t.v)}</span>);
    } else {
      u.push(<span key={i} className={cls + (t.cola ? ' cola' : '')} data-i={i}>{textoMao(t.v)}{risco(i)}</span>);
    }
  });
  return (
    <p className="ra-linha conta" data-l={l}>
      {unidades.map((u, k) => (u.length === 1 && typeof u[0] === 'string' ? u[0] : u.length ? <span key={k} className="ra-u">{u}</span> : null))}
    </p>
  );
}

export type { Roteiro };

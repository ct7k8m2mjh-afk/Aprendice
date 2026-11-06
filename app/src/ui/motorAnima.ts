/**
 * Anima UM passo da resolução sobre o DOM já desenhado no estado final (ui/ResolucaoAnimada.tsx).
 *
 * Regra de ouro: o DOM é sempre o estado final (o texto dos dados). A animação só usa transform, opacity, clip-path,
 * cor e fundo, com Web Animations; quando acaba (ou é cancelada) as animações são canceladas e o que fica na tela é o
 * DOM final, intocado. Por isso pausar, pular, voltar e "reduzir movimento" nunca deixam a conta num estado errado.
 *
 * Conta (logica/motorConta.ts diz de onde vem cada termo):
 * - termo que fica: escorrega da linha de antes para o lugar novo;
 * - termo que atravessa o "=": vai em arco por cima, na cor da caneta, um de cada vez;
 * - sinal que troca ("+" → "−", "×" → "÷"): sai com o sinal antigo e troca no meio do caminho;
 * - conta feita: os pedaços voam juntos até o lugar do resultado, somem, e o resultado aparece com um pulo;
 * - cancelamento: um risco de caneta passa por cima dos termos que se cancelam;
 * - o resto é escrito à mão, da esquerda para a direita.
 * Tudo o que voa vai na mesma letra à mão e no mesmo tamanho da conta, com um halo do papel por baixo (não se mistura
 * com o texto por onde passa).
 * Processo (Biologia, Química, Física): fluxo, reação, cadeia, pares, contraste e etapas (ver `Diagrama` no motor).
 */
import type { Ref, Roteiro } from '../logica/motorConta';

export interface Controle {
  pausa(): void;
  toca(): void;
  /** velocidade da escrita (0,75× a 2×), também no meio do passo */
  velocidade(v: number): void;
  /** cancela tudo: o passo fica no estado final */
  cancela(): void;
  /** resolve true quando o passo termina sozinho; false se for cancelado */
  fim: Promise<boolean>;
}

const CURVA = 'cubic-bezier(.4,0,.2,1)';
const VOO = 'cubic-bezier(.45,0,.25,1)';

export function animaPasso(passoEl: HTMLElement, folha: HTMLElement, rt: Roteiro, k: number, vel = 1): Controle {
  const vivas: Animation[] = [];
  const fantasmas: HTMLElement[] = [];
  let acabou = false;
  let ritmo = vel;
  let resolve: (v: boolean) => void = () => {};
  const fim = new Promise<boolean>((r) => { resolve = r; });
  const anima = (el: Element, kf: Keyframe[], o: KeyframeAnimationOptions) => {
    if (!(el as HTMLElement).animate) return null;
    const a = (el as HTMLElement).animate(kf, { fill: 'both', ...o });
    a.playbackRate = ritmo;
    vivas.push(a);
    return a;
  };
  const limpa = () => {
    for (const a of vivas) { try { a.cancel(); } catch { /* já foi */ } }
    vivas.length = 0;
    for (const f of fantasmas) f.remove();
    fantasmas.length = 0;
  };

  const css = getComputedStyle(folha);
  const caneta = css.getPropertyValue('--cad-caneta').trim() || '#C0392B';
  const papel = css.getPropertyValue('--cad-papel').trim() || '#FBF7EA';
  const marcaCor = css.getPropertyValue('--cad-marca').trim() || '#FFE36E';
  const rf = folha.getBoundingClientRect();
  const camada = folha.querySelector<HTMLElement>('.ra-fantasmas') || folha;

  // tudo é medido ANTES de qualquer animação (o layout é o final e não muda: só transform/opacity mexem)
  const elDe = (r: Ref): HTMLElement | null => {
    const t = folha.querySelector<HTMLElement>(`[data-l="${r.l}"] [data-i="${r.i}"]`);
    if (!t) return null;
    if (!r.p) return t;
    const parte = t.querySelector<HTMLElement>(`:scope > [data-p="${r.p}"]`) || t;
    if (r.s == null) return parte;
    return parte.querySelector<HTMLElement>(`:scope > [data-s="${r.s}"]`) || parte;
  };
  const caixa = (el: HTMLElement) => el.getBoundingClientRect();

  const passo = rt.passos[k];
  const faz = passoEl.querySelector('.ra-faz');
  const porque = passoEl.querySelector('.ra-porque');
  let t = 0;

  // o passo entra
  anima(passoEl, [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 320, easing: CURVA });
  if (faz) t += 260;

  const segue = (el: Element, quando: number) => {
    // acompanha a escrita: rola até a linha quando ela começa (respeita pausa: é uma animação vazia)
    const a = anima(el, [], { duration: 1, delay: quando, fill: 'none' });
    if (a) a.onfinish = () => { try { (el as HTMLElement).scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch { /* sem rolagem */ } };
  };

  /** escreve à mão: a tinta corre da esquerda para a direita */
  const escreve = (el: HTMLElement, quando: number): number => {
    const n = Math.max(1, (el.textContent || '').trim().length);
    const d = Math.max(110, Math.min(900, 70 + n * 55));
    anima(el, [{ clipPath: 'inset(-.45em 100% -.45em -.2em)' }, { clipPath: 'inset(-.45em -.3em -.45em -.2em)' }], { duration: d, delay: quando, easing: 'linear' });
    return d;
  };
  /** aparece com um pulo (peça de processo) */
  const surge = (el: Element, quando: number, de = 'scale(.82)') =>
    anima(el, [{ opacity: 0, transform: de }, { opacity: 1, transform: 'none' }], { duration: 380, delay: quando, easing: 'cubic-bezier(.2,.9,.3,1.2)' });
  /** acende: um realce passa e se apaga */
  const acende = (el: Element, quando: number, dura = 900) =>
    anima(el, [{ backgroundColor: 'transparent' }, { backgroundColor: marcaCor, offset: .25 }, { backgroundColor: 'transparent' }], { duration: dura, delay: quando, fill: 'none' });

  /** cópia que voa: a mesma letra e o mesmo tamanho do original, com halo do papel */
  const fantasma = (base: HTMLElement, texto: string | null, r: DOMRect): HTMLElement => {
    const g = (texto == null ? base.cloneNode(true) : document.createElement('span')) as HTMLElement;
    if (texto != null) g.textContent = texto;
    const cs = getComputedStyle(base);
    g.removeAttribute('data-i'); g.removeAttribute('data-p'); g.removeAttribute('data-s');
    g.querySelectorAll('[data-i],[data-p],[data-s]').forEach((x) => { x.removeAttribute('data-i'); x.removeAttribute('data-p'); x.removeAttribute('data-s'); });
    g.querySelectorAll('.ra-risco').forEach((x) => x.remove());
    g.className = (texto == null ? base.className + ' ' : '') + 'ra-fantasma';
    g.classList.remove('ra-marca');
    g.setAttribute('aria-hidden', 'true');
    Object.assign(g.style, {
      position: 'absolute', left: `${r.left - rf.left}px`, top: `${r.top - rf.top}px`, minWidth: `${r.width}px`, height: `${r.height}px`,
      fontFamily: cs.fontFamily, fontSize: cs.fontSize, fontWeight: cs.fontWeight, fontStyle: cs.fontStyle, letterSpacing: cs.letterSpacing,
      lineHeight: cs.lineHeight, color: cs.color, margin: '0', pointerEvents: 'none', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center',
    });
    camada.appendChild(g);
    fantasmas.push(g);
    return g;
  };
  const halo = (on: boolean): Keyframe => (on ? { backgroundColor: papel, boxShadow: `0 0 0 3px ${papel}` } : { backgroundColor: 'transparent', boxShadow: '0 0 0 0 transparent' });

  for (const l of passo.linhas) {
    const L = rt.linhas[l];
    const linhaEl = passoEl.querySelector<HTMLElement>(`[data-l="${l}"]`);
    if (!linhaEl) continue;
    segue(linhaEl, t);
    if (L.diagrama) {
      t = animaDiagrama(linhaEl, L.diagrama.tipo, t);
    } else if (!L.conta) {
      // texto (Português, trecho citado): a linha entra escrita, depois o marca-texto passa no termo-chave
      const d = Math.max(520, Math.min(1600, 260 + L.texto.length * 14));
      anima(linhaEl, [{ clipPath: 'inset(-.3em 100% -.3em -.3em)', opacity: .4 }, { clipPath: 'inset(-.3em -.3em -.3em -.3em)', opacity: 1 }], { duration: d, delay: t, easing: CURVA });
      t += d;
    } else {
      t = animaConta(linhaEl, l, t);
    }
    // marca-texto no termo-chave / resultado
    const marcas = [...linhaEl.querySelectorAll<HTMLElement>('.ra-marca, .dg-chave')];
    if (marcas.length) {
      t += 120;
      marcas.forEach((mk, j) => anima(mk, [{ backgroundSize: '0% 100%' }, { backgroundSize: '100% 100%' }], { duration: 300, delay: t + j * 70, easing: 'cubic-bezier(.45,.05,.4,1)' }));
      t += 300 + marcas.length * 70;
    }
    const nota = linhaEl.parentElement?.querySelector(`[data-nota="${l}"]`);
    if (nota) { anima(nota, [{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], { duration: 360, delay: t, easing: CURVA }); t += 500; }
    t += 260;
  }

  /* ------------------------------------------------------------------ conta: termos em movimento */
  function animaConta(linhaEl: HTMLElement, l: number, t0: number): number {
    let t = t0;
    const L = rt.linhas[l];
    const porI = new Map<number, HTMLElement>();
    linhaEl.querySelectorAll<HTMLElement>('[data-i]').forEach((e) => porI.set(Number(e.dataset.i), e));
    const ordem = [...porI.keys()].sort((a, b) => a - b);
    const naFaixa = (x: number) => L.planos.find((p) => x >= p.ini && x < p.fim);
    let q = 0;
    while (q < ordem.length) {
      const i = ordem[q];
      const p = naFaixa(i);
      if (!p) {
        const el = porI.get(i)!;
        t += escreve(el, t);
        q++;
        continue;
      }
      // ---- fase de movimento: todos os termos do plano chegam juntos (os que atravessam, um de cada vez)
      const tIni = t + 150;
      const DUR = p.tipo === 'resultado' ? 760 : 1100;
      let ultimo = tIni;
      // riscos: os termos que se cancelam são riscados antes de tudo
      let tR = tIni;
      if (p.riscos.length) {
        for (const r of p.riscos) {
          const el = elDe(r);
          const risco = el?.querySelector<HTMLElement>(':scope > .ra-risco');
          if (risco) anima(risco, [{ transform: 'rotate(-12deg) scaleX(0)' }, { transform: 'rotate(-12deg) scaleX(1)' }], { duration: 320, delay: tR, easing: CURVA });
          tR += 110;
        }
        tR += 300;
      }
      const alvos = ordem.filter((x) => x >= p.ini && x < p.fim);
      const medidas: { el: HTMLElement; de: HTMLElement[]; atravessa: boolean; antes?: string; grupo: string }[] = [];
      const novos: HTMLElement[] = [];
      for (const x of alvos) {
        const el = porI.get(x)!;
        const inteiro = p.entradas[`${x}`];
        if (inteiro) { medidas.push(mede(el, inteiro)); continue; }
        if (!el.classList.contains('frac')) { novos.push(el); continue; }
        // fração: o numerador e o denominador (e os termos de dentro) podem vir de lugares diferentes
        let algum = false;
        for (const parte of el.querySelectorAll<HTMLElement>(':scope > [data-p]')) {
          const pp = parte.dataset.p;
          const e = p.entradas[`${x}:${pp}`];
          if (e) { medidas.push(mede(parte, e)); algum = true; continue; }
          for (const sub of parte.querySelectorAll<HTMLElement>(':scope > [data-s]')) {
            const es = p.entradas[`${x}:${pp}:${sub.dataset.s}`];
            if (es) { medidas.push(mede(sub, es)); algum = true; } else novos.push(sub);
          }
        }
        if (algum) {
          // a barra da fração aparece no fim, quando as partes chegaram
          const nEl = el.querySelector<HTMLElement>(':scope > .frac-n');
          if (nEl) anima(nEl, [{ borderBottomColor: 'transparent' }, { borderBottomColor: 'currentColor' }], { duration: 260, delay: tIni + DUR * .8 });
        } else novos.push(el);
      }
      function mede(el: HTMLElement, e: { de: Ref[]; atravessa?: boolean; antes?: string }) {
        const de = e.de.map(elDe).filter((z): z is HTMLElement => !!z);
        return { el, de, atravessa: !!e.atravessa, antes: e.antes, grupo: e.de.map((r) => `${r.l}:${r.i}:${r.p || ''}:${r.s ?? ''}`).join('|') };
      }
      const rects = new Map<HTMLElement, DOMRect>();
      for (const m of medidas) { rects.set(m.el, caixa(m.el)); for (const d of m.de) rects.set(d, caixa(d)); }
      const base = Math.max(tIni, tR);
      let ordemCruza = 0;
      // conta feita: os mesmos pedaços de origem alimentam um alvo só (o resultado, com o sinal): um voo por grupo
      const grupos = new Map<string, typeof medidas>();
      for (const m of medidas) if (m.de.length > 1) { const g = grupos.get(m.grupo) || []; g.push(m); grupos.set(m.grupo, g); }
      for (const [, ms] of grupos) {
        const cruza = ms.some((m) => m.atravessa);
        const atraso = base + (cruza ? ordemCruza * 220 : 0);
        const T = ms.map((m) => rects.get(m.el)!);
        const alvoX = (Math.min(...T.map((r) => r.left)) + Math.max(...T.map((r) => r.right))) / 2;
        const alvoY = Math.min(...T.map((r) => r.top));
        ms[0].de.forEach((d, j) => {
          const S = rects.get(d)!;
          const g = fantasma(d, null, S);
          const gx = alvoX - (S.left + S.width / 2), gy = alvoY - S.top;
          const k1: Keyframe = { opacity: 1, transform: 'none', offset: .02, ...halo(true) };
          if (cruza) k1.color = caneta;
          anima(g, [
            { opacity: 0, transform: 'none', offset: 0, ...halo(true) }, k1,
            { opacity: .95, transform: `translate(${gx * .5}px,${gy * .5 - (cruza ? 34 : 12)}px)`, offset: .5, ...halo(true) },
            { opacity: 0, transform: `translate(${gx}px,${gy}px) scale(.6)`, offset: 1, ...halo(true) },
          ], { duration: DUR * .85, delay: atraso + j * 40, easing: VOO });
        });
        for (const m of ms) {
          anima(m.el, [
            { opacity: 0, transform: 'scale(.5)', offset: 0 },
            { opacity: 0, transform: 'scale(.5)', offset: .7 },
            { opacity: 1, transform: 'scale(1.18)', color: caneta, offset: .86 },
            { opacity: 1, transform: 'none', color: caneta, offset: 1 },
          ], { duration: DUR + 260, delay: atraso, easing: CURVA });
          anima(m.el, [{ color: caneta }, { color: caneta, offset: .5 }, {}], { duration: 1000, delay: atraso + DUR + 260, fill: 'none' });
        }
        if (cruza) ordemCruza++;
        ultimo = Math.max(ultimo, atraso + DUR + 260);
      }
      for (const m of medidas) {
        if (m.de.length !== 1) continue;
        const T = rects.get(m.el)!;
        const S = rects.get(m.de[0])!;
        const cruza = m.atravessa;
        const atraso = base + (cruza ? ordemCruza * 220 : 0);
        const dx = S.left - T.left, dy = S.top - T.top;
        const alto = cruza ? -Math.max(26, Math.min(56, Math.abs(dx) * .18)) : -6;
        if (m.antes == null) {
          const kf: Keyframe[] = [
            { opacity: 0, transform: `translate(${dx}px,${dy}px)`, offset: 0, ...halo(true) },
            { opacity: 1, transform: `translate(${dx}px,${dy}px)`, offset: .02, ...halo(true) },
            { opacity: 1, transform: `translate(${dx / 2}px,${dy / 2 + alto}px)`, offset: .5, ...halo(true) },
            { opacity: 1, transform: 'none', offset: .97, ...halo(true) },
            { opacity: 1, transform: 'none', offset: 1, ...halo(false) },
          ];
          if (cruza) for (const x of kf) x.color = caneta;
          anima(m.el, kf, { duration: DUR, delay: atraso, easing: VOO });
        } else {
          // sinal que troca no meio do caminho: o antigo (fantasma) vai até a metade e some; o novo aparece no lugar
          const g = fantasma(m.el, m.antes, S);
          const gx = T.left - S.left, gy = T.top - S.top;
          anima(g, [
            { opacity: 0, transform: 'none', color: caneta, offset: 0, ...halo(true) },
            { opacity: 1, transform: 'none', color: caneta, offset: .02, ...halo(true) },
            { opacity: 1, transform: `translate(${gx / 2}px,${gy / 2 + alto}px)`, color: caneta, offset: .5, ...halo(true) },
            { opacity: 0, transform: `translate(${gx / 2}px,${gy / 2 + alto}px) scale(.6)`, color: caneta, offset: .58, ...halo(true) },
            { opacity: 0, transform: `translate(${gx}px,${gy}px)`, color: caneta, offset: 1, ...halo(true) },
          ], { duration: DUR, delay: atraso, easing: VOO });
          anima(m.el, [
            { opacity: 0, transform: `translate(${dx / 2}px,${dy / 2 + alto}px) scale(.6)`, color: caneta, offset: 0, ...halo(true) },
            { opacity: 0, transform: `translate(${dx / 2}px,${dy / 2 + alto}px) scale(.6)`, color: caneta, offset: .5, ...halo(true) },
            { opacity: 1, transform: `translate(${dx / 2}px,${dy / 2 + alto}px) scale(1.25)`, color: caneta, offset: .6, ...halo(true) },
            { opacity: 1, transform: 'none', color: caneta, offset: .97, ...halo(true) },
            { opacity: 1, transform: 'none', color: caneta, offset: 1, ...halo(false) },
          ], { duration: DUR, delay: atraso, easing: VOO });
        }
        if (cruza) anima(m.el, [{ color: caneta }, { color: caneta, offset: .6 }, {}], { duration: 900, delay: atraso + DUR, fill: 'none' });
        if (cruza) ordemCruza++;
        ultimo = Math.max(ultimo, atraso + DUR);
      }
      // o que é novo (o "=" de uma conta, uma unidade) é escrito depois que os termos chegam
      let tN = ultimo + 80;
      for (const el of novos) tN += escreve(el, tN);
      t = tN + 200;
      while (q < ordem.length && ordem[q] < p.fim) q++;
    }
    return t;
  }

  /* ------------------------------------------------------------------ processo (Biologia, Química, Física) */
  function animaDiagrama(linhaEl: HTMLElement, tipo: string, t0: number): number {
    let t = t0;
    const pecas = [...linhaEl.querySelectorAll<HTMLElement>(':scope > [data-k]')];
    const traco = (seta: HTMLElement, quando: number) => {
      const path = seta.querySelector<SVGPathElement>('path');
      anima(seta, [{ opacity: 0 }, { opacity: 1 }], { duration: 120, delay: quando });
      if (path) anima(path, [{ strokeDashoffset: 60 }, { strokeDashoffset: 0 }], { duration: 420, delay: quando, easing: CURVA });
    };
    if (tipo === 'reacao') {
      // os reagentes entram; depois se juntam (vão em direção à seta) e os produtos saem do outro lado
      const seta = pecas.find((p) => p.classList.contains('dg-seta'));
      const reag = pecas.filter((p) => p.dataset.lado === '0' || (seta && pecas.indexOf(p) < pecas.indexOf(seta) && !p.classList.contains('dg-seta')));
      const prod = pecas.filter((p) => seta && pecas.indexOf(p) > pecas.indexOf(seta));
      const rotulo = pecas.filter((p) => p.classList.contains('dg-rotulo'));
      for (const r of rotulo) { surge(r, t); t += 200; }
      const reagItens = reag.filter((p) => !p.classList.contains('dg-rotulo'));
      for (const r of reagItens) { surge(r, t); t += 220; }
      t += 200;
      if (seta) {
        const S = caixa(seta);
        // juntam-se: cada reagente desliza até perto da seta e volta (choque), enquanto a seta é traçada
        for (const r of reagItens.filter((p) => p.classList.contains('dg-item'))) {
          const R = caixa(r);
          const dx = (S.left - (R.left + R.width / 2)) * .35;
          anima(r, [{ transform: 'none' }, { transform: `translateX(${dx}px) scale(.94)`, offset: .45 }, { transform: 'none' }], { duration: 760, delay: t, easing: VOO, fill: 'none' });
          acende(r, t, 760);
        }
        traco(seta, t + 320);
        t += 760;
        // os produtos nascem da seta
        for (const p2 of prod) {
          const R = caixa(p2);
          const dx = S.left + S.width / 2 - (R.left + R.width / 2);
          anima(p2, [{ opacity: 0, transform: `translateX(${dx}px) scale(.4)` }, { opacity: 1, transform: 'none' }], { duration: 560, delay: t, easing: 'cubic-bezier(.2,.9,.3,1.1)' });
          if (p2.classList.contains('dg-item')) acende(p2, t + 420, 800);
          t += 160;
        }
        t += 500;
      }
      return t;
    }
    if (tipo === 'contraste') {
      for (const p of pecas) {
        const lado = p.dataset.lado;
        if (p.classList.contains('dg-vs')) { surge(p, t, 'scale(.3) rotate(-30deg)'); t += 260; continue; }
        if (p.classList.contains('dg-item')) { anima(p, [{ opacity: 0, transform: `translateX(${lado === '1' ? 24 : -24}px)` }, { opacity: 1, transform: 'none' }], { duration: 480, delay: t, easing: CURVA }); t += 360; continue; }
        anima(p, [{ opacity: 0 }, { opacity: 1 }], { duration: 200, delay: t });
      }
      return t + 200;
    }
    // fluxo, cadeia, pares e etapas: cada peça entra na ordem; a seta (ou a ligação) é traçada antes da peça seguinte;
    // a etapa que entra acende
    for (const p of pecas) {
      if (p.classList.contains('dg-seta')) { traco(p, t); t += 380; continue; }
      if (p.classList.contains('dg-liga')) { anima(p, [{ opacity: 0, transform: 'scaleX(0)' }, { opacity: 1, transform: 'none' }], { duration: 260, delay: t, easing: CURVA }); t += 200; continue; }
      if (p.classList.contains('dg-div') || p.classList.contains('dg-mais')) { anima(p, [{ opacity: 0 }, { opacity: 1 }], { duration: 160, delay: t }); continue; }
      if (p.classList.contains('dg-rotulo')) { surge(p, t, 'translateY(4px)'); t += 260; continue; }
      if (p.classList.contains('dg-valor')) { surge(p, t, 'scale(.5)'); acende(p, t + 200, 800); t += 420; continue; }
      const n = (p.textContent || '').length;
      const d = tipo === 'etapas' ? Math.max(420, Math.min(1300, 200 + n * 9)) : 420;
      if (tipo === 'etapas') {
        anima(p, [{ opacity: 0, transform: 'translateX(-10px)', clipPath: 'inset(-.3em 100% -.3em -.3em)' }, { opacity: 1, transform: 'none', clipPath: 'inset(-.3em -.3em -.3em -.3em)' }], { duration: d, delay: t, easing: CURVA });
        // o ponto da etapa acende e o fio que a liga à anterior é traçado
        anima(p, [{ transform: 'scale(0)', backgroundColor: caneta }, { transform: 'scale(1.4)', backgroundColor: caneta, offset: .6 }, { transform: 'scale(1)' }], { duration: 520, delay: t, pseudoElement: '::before' });
        anima(p, [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], { duration: 420, delay: t, easing: CURVA, pseudoElement: '::after' });
        anima(p, [{ backgroundColor: 'transparent' }, { backgroundColor: marcaCor, offset: .3 }, { backgroundColor: 'transparent' }], { duration: 1200, delay: t + d * .5, fill: 'none' });
        t += d + 260;
      } else {
        surge(p, t);
        acende(p, t + 200, 800);
        t += d;
      }
    }
    return t + 150;
  }

  // a explicação do passo aparece depois da conta
  let leitura = 600;
  if (porque) {
    anima(porque, [{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], { duration: 380, delay: t, easing: CURVA });
    leitura = Math.max(900, Math.min(2800, 300 + (porque.textContent || '').length * 22));
    segue(porque, t);
  }
  const relogio = anima(passoEl, [], { duration: t + leitura, fill: 'none' });
  const termina = (ok: boolean) => {
    if (acabou) return; acabou = true; limpa();
    resolve(ok);
  };
  if (relogio) relogio.onfinish = () => termina(true);
  else termina(true);
  return {
    pausa() { for (const a of vivas) { try { a.pause(); } catch { /* ok */ } } },
    toca() { for (const a of vivas) { try { a.play(); } catch { /* ok */ } } },
    velocidade(v: number) { ritmo = v; for (const a of vivas) { try { a.updatePlaybackRate(v); } catch { /* ok */ } } },
    cancela() { termina(false); },
    fim,
  };
}

/* ============================================================== cena dos slides da revisão (comandos 24 e 26–31)
 * Mesmas regras do passo da conta: o DOM é o estado final; só opacity, transform e clip-path se mexem, e no fim (ou ao
 * cancelar) as animações são canceladas, ficando o DOM intacto. */

function controleDe(vivas: Animation[], total: number, el: HTMLElement): Controle {
  let acabou = false;
  let resolve: (v: boolean) => void = () => {};
  const fim = new Promise<boolean>((r) => { resolve = r; });
  const termina = (ok: boolean) => { if (acabou) return; acabou = true; for (const a of vivas) { try { a.cancel(); } catch { /* ok */ } } resolve(ok); };
  const rel = el.animate ? el.animate([], { duration: Math.max(1, total), fill: 'none' }) : null;
  if (rel) { vivas.push(rel); rel.onfinish = () => termina(true); } else termina(true);
  return {
    pausa() { for (const a of vivas) { try { a.pause(); } catch { /* ok */ } } },
    toca() { for (const a of vivas) { try { a.play(); } catch { /* ok */ } } },
    velocidade(v: number) { for (const a of vivas) { try { a.updatePlaybackRate(v); } catch { /* ok */ } } },
    cancela() { termina(false); },
    fim,
  };
}

/** A imagem do slide entra: surge e assenta (leve aproximação), como quem põe a foto na mesa. */
export function animaEntrada(el: HTMLElement, atraso = 0): Controle {
  const vivas: Animation[] = [];
  if (el.animate) vivas.push(el.animate([{ opacity: 0, transform: 'scale(1.035)' }, { opacity: 1, transform: 'none' }], { duration: 900, delay: atraso, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'both' }));
  return controleDe(vivas, atraso + 900, el);
}

/** Escreve à mão, da esquerda para a direita, cada linha de `sel` dentro de `el`, uma depois da outra (fórmula, frase-chave). */
export function animaEscrita(el: HTMLElement, sel = '.fm-linha', atraso = 0): Controle {
  const vivas: Animation[] = [];
  const linhas = [...el.querySelectorAll<HTMLElement>(sel)];
  if (!linhas.length) linhas.push(el);
  let t = atraso;
  for (const l of linhas) {
    const n = Math.max(1, (l.textContent || '').trim().length);
    const d = Math.max(380, Math.min(1500, 120 + n * 38));
    if (l.animate) vivas.push(l.animate([{ clipPath: 'inset(-.5em 100% -.5em -.3em)' }, { clipPath: 'inset(-.5em -.3em -.5em -.3em)' }], { duration: d, delay: t, easing: 'linear', fill: 'both' }));
    t += d + 120;
  }
  return controleDe(vivas, t, el);
}

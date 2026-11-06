/**
 * Anima UM passo da resolução sobre o DOM já desenhado no estado final (ui/ResolucaoAnimada.tsx).
 *
 * Regra de ouro: o DOM é sempre o estado final (o texto dos dados). A animação só usa transform, opacity, clip-path e
 * fundo, com Web Animations; quando acaba (ou é cancelada) as animações são canceladas e o que fica na tela é o DOM
 * final, intocado. Por isso pausar, pular, voltar e "reduzir movimento" nunca deixam a conta num estado errado.
 *
 * O roteiro (logica/motorConta.ts) diz, para cada termo da linha nova, de onde ele vem. Aqui:
 * - termo que fica: escorrega da linha de antes para o lugar novo;
 * - termo que atravessa o "=": vai em arco por cima, na cor da caneta, um de cada vez;
 * - sinal que troca ("+" → "−", "×" → "÷"): sai com o sinal antigo e troca no meio do caminho;
 * - conta feita: os pedaços voam até o lugar do resultado, somem, e o resultado aparece (com um "pulo");
 * - cancelamento: um risco de caneta passa por cima dos dois termos que se cancelam;
 * - o resto é escrito à mão, da esquerda para a direita (a tinta corre letra a letra).
 */
import type { Ref, Roteiro } from '../logica/motorConta';

export interface Controle {
  pausa(): void;
  toca(): void;
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
  let resolve: (v: boolean) => void = () => {};
  const fim = new Promise<boolean>((r) => { resolve = r; });
  const V = (ms: number) => ms / vel;
  const anima = (el: Element, kf: Keyframe[], o: KeyframeAnimationOptions) => {
    if (!(el as HTMLElement).animate) return null;
    const a = (el as HTMLElement).animate(kf, { fill: 'both', ...o });
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
  const rf = folha.getBoundingClientRect();
  const camada = folha.querySelector<HTMLElement>('.ra-fantasmas') || folha;

  // tudo é medido ANTES de qualquer animação (o layout é o final e não muda: só transform/opacity mexem)
  const elDe = (r: Ref): HTMLElement | null => {
    const t = folha.querySelector<HTMLElement>(`[data-l="${r.l}"] [data-i="${r.i}"]`);
    if (!t) return null;
    return r.p ? t.querySelector<HTMLElement>(`[data-p="${r.p}"]`) || t : t;
  };
  const caixa = (el: HTMLElement) => el.getBoundingClientRect();

  const passo = rt.passos[k];
  const faz = passoEl.querySelector('.ra-faz');
  const porque = passoEl.querySelector('.ra-porque');
  let t = 0;

  // o passo entra
  anima(passoEl, [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: V(320), easing: CURVA });
  if (faz) t += V(260);

  const segue = (el: Element, quando: number) => {
    // acompanha a escrita: rola até a linha quando ela começa (respeita pausa: é uma animação vazia)
    const a = anima(el, [], { duration: 1, delay: quando, fill: 'none' });
    if (a) a.onfinish = () => { try { (el as HTMLElement).scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch { /* sem rolagem */ } };
  };

  /** escreve um termo à mão: a tinta corre da esquerda para a direita */
  const escreve = (el: HTMLElement, quando: number): number => {
    const n = Math.max(1, (el.textContent || '').trim().length);
    const d = V(Math.max(110, Math.min(900, 70 + n * 55)));
    anima(el, [{ clipPath: 'inset(-.45em 100% -.45em -.2em)' }, { clipPath: 'inset(-.45em -.3em -.45em -.2em)' }], { duration: d, delay: quando, easing: 'linear' });
    return d;
  };

  const fantasma = (base: HTMLElement, texto: string | null, r: DOMRect): HTMLElement => {
    const g = (texto == null ? base.cloneNode(true) : document.createElement('span')) as HTMLElement;
    if (texto != null) g.textContent = texto;
    const cs = getComputedStyle(base);
    g.removeAttribute('data-i'); g.removeAttribute('data-p');
    g.querySelectorAll('[data-i],[data-p]').forEach((x) => { x.removeAttribute('data-i'); x.removeAttribute('data-p'); });
    g.querySelectorAll('.ra-risco').forEach((x) => x.remove());
    g.className = (texto == null ? base.className + ' ' : '') + 'ra-fantasma';
    g.setAttribute('aria-hidden', 'true');
    Object.assign(g.style, {
      position: 'absolute', left: `${r.left - rf.left}px`, top: `${r.top - rf.top}px`, width: texto == null ? `${r.width}px` : '', height: `${r.height}px`,
      font: cs.font, color: cs.color, lineHeight: `${r.height}px`, margin: '0', pointerEvents: 'none', whiteSpace: 'nowrap',
    });
    camada.appendChild(g);
    fantasmas.push(g);
    return g;
  };

  for (const l of passo.linhas) {
    const L = rt.linhas[l];
    const linhaEl = passoEl.querySelector<HTMLElement>(`[data-l="${l}"]`);
    if (!linhaEl) continue;
    segue(linhaEl, t);
    if (!L.conta) {
      // texto (Biologia, Química, Português): a linha entra escrita, depois o marca-texto passa no termo-chave
      const d = V(Math.max(520, Math.min(1600, 260 + L.texto.length * 14)));
      anima(linhaEl, [{ clipPath: 'inset(-.3em 100% -.3em -.3em)', opacity: .4 }, { clipPath: 'inset(-.3em -.3em -.3em -.3em)', opacity: 1 }], { duration: d, delay: t, easing: CURVA });
      t += d;
    } else {
      // medidas da linha nova (estado final)
      const toks = [...linhaEl.querySelectorAll<HTMLElement>('[data-i]')];
      const porI = new Map(toks.map((e) => [Number(e.dataset.i), e]));
      const planos = L.planos;
      let i: number;
      const ordem = [...porI.keys()].sort((a, b) => a - b);
      const naFaixa = (x: number) => planos.find((p) => x >= p.ini && x < p.fim);
      let q = 0;
      while (q < ordem.length) {
        i = ordem[q];
        const p = naFaixa(i);
        if (!p) {
          const el = porI.get(i)!;
          t += escreve(el, t);
          if (/\s$/.test(el.nextSibling?.textContent || '')) t += V(40);
          q++;
          continue;
        }
        // ---- fase de movimento: todos os termos do plano chegam juntos (os que atravessam, um de cada vez)
        const t0 = t + V(150);
        const DUR = V(p.tipo === 'resultado' ? 760 : 1100);
        let ultimo = t0;
        // riscos: os termos que se cancelam são riscados antes de tudo
        let tR = t0;
        if (p.riscos.length) {
          for (const r of p.riscos) {
            const el = elDe(r);
            const risco = el?.querySelector<HTMLElement>(':scope > .ra-risco');
            if (risco) anima(risco, [{ transform: 'rotate(-12deg) scaleX(0)' }, { transform: 'rotate(-12deg) scaleX(1)' }], { duration: V(320), delay: tR, easing: CURVA });
            tR += V(110);
          }
          tR += V(300);
        }
        let ordemCruza = 0;
        const novos: HTMLElement[] = [];
        const alvos = ordem.filter((x) => x >= p.ini && x < p.fim);
        const medidas: { el: HTMLElement; chave: string; de: HTMLElement[]; e: (typeof p.entradas)[string] }[] = [];
        for (const x of alvos) {
          const el = porI.get(x)!;
          const partes = [...el.querySelectorAll<HTMLElement>('[data-p]')];
          const chaves = p.entradas[`${x}`] ? [`${x}`] : partes.map((pp) => `${x}:${pp.dataset.p}`);
          let algum = false;
          for (const ch of chaves) {
            const e = p.entradas[ch];
            if (!e) continue;
            algum = true;
            const alvo = ch.includes(':') ? el.querySelector<HTMLElement>(`[data-p="${ch.split(':')[1]}"]`)! : el;
            const de = e.de.map(elDe).filter((z): z is HTMLElement => !!z);
            if (de.length) medidas.push({ el: alvo, chave: ch, de, e });
          }
          // fração cujas partes vêm de lugares diferentes: a barra aparece no fim
          if (algum && !p.entradas[`${x}`] && partes.length) {
            const n = el.querySelector<HTMLElement>('.frac-n');
            if (n) anima(n, [{ borderBottomColor: 'transparent' }, { borderBottomColor: 'currentColor' }], { duration: V(260), delay: t0 + DUR * .8 });
            if (!p.entradas[`${x}:n`] && n) novos.push(n);
            const dd = el.querySelector<HTMLElement>('.frac-d');
            if (!p.entradas[`${x}:d`] && dd) novos.push(dd);
          }
          if (!algum) novos.push(el);
        }
        const rects = new Map<HTMLElement, DOMRect>();
        for (const m of medidas) { rects.set(m.el, caixa(m.el)); for (const d of m.de) rects.set(d, caixa(d)); }
        const base = Math.max(t0, tR);
        for (const m of medidas) {
          const T = rects.get(m.el)!;
          const cruza = !!m.e.atravessa;
          const atraso = base + (cruza ? ordemCruza * V(220) : 0);
          if (m.de.length === 1 && (m.e.antes == null)) {
            const S = rects.get(m.de[0])!;
            const dx = S.left - T.left, dy = S.top - T.top;
            const alto = cruza ? -Math.max(26, Math.min(56, Math.abs(dx) * .18)) : -6;
            const kf: Keyframe[] = [
              { opacity: 0, transform: `translate(${dx}px,${dy}px)`, offset: 0 },
              { opacity: 1, transform: `translate(${dx}px,${dy}px)`, offset: .02 },
              { opacity: 1, transform: `translate(${dx / 2}px,${dy / 2 + alto}px)`, offset: .5 },
              { opacity: 1, transform: 'none', offset: 1 },
            ];
            if (cruza) { kf[1].color = caneta; kf[2].color = caneta; kf[3].color = caneta; }
            anima(m.el, kf, { duration: DUR, delay: atraso, easing: VOO });
            if (cruza) anima(m.el, [{ color: caneta }, { color: caneta, offset: .6 }, {}], { duration: V(900), delay: atraso + DUR, fill: 'none' });
          } else if (m.de.length === 1) {
            // sinal que troca no meio do caminho: o antigo (fantasma) vai até a metade e some; o novo aparece no lugar dele
            const S = rects.get(m.de[0])!;
            const dx = S.left - T.left, dy = S.top - T.top;
            const alto = -Math.max(26, Math.min(56, Math.abs(dx) * .18));
            const g = fantasma(m.el, m.e.antes!, S);
            const gx = T.left - S.left, gy = T.top - S.top;
            anima(g, [
              { opacity: 0, transform: 'none', color: caneta, offset: 0 },
              { opacity: 1, transform: 'none', color: caneta, offset: .02 },
              { opacity: 1, transform: `translate(${gx / 2}px,${gy / 2 + alto}px)`, color: caneta, offset: .5 },
              { opacity: 0, transform: `translate(${gx / 2}px,${gy / 2 + alto}px) scale(.6)`, color: caneta, offset: .58 },
              { opacity: 0, transform: `translate(${gx}px,${gy}px)`, offset: 1 },
            ], { duration: DUR, delay: atraso, easing: VOO });
            anima(m.el, [
              { opacity: 0, transform: `translate(${dx / 2}px,${dy / 2 + alto}px) scale(.6)`, color: caneta, offset: 0 },
              { opacity: 0, transform: `translate(${dx / 2}px,${dy / 2 + alto}px) scale(.6)`, color: caneta, offset: .5 },
              { opacity: 1, transform: `translate(${dx / 2}px,${dy / 2 + alto}px) scale(1.25)`, color: caneta, offset: .6 },
              { opacity: 1, transform: 'none', color: caneta, offset: 1 },
            ], { duration: DUR, delay: atraso, easing: VOO });
            anima(m.el, [{ color: caneta }, { color: caneta, offset: .6 }, {}], { duration: V(900), delay: atraso + DUR, fill: 'none' });
          } else {
            // conta feita: os pedaços voam juntos até o resultado e somem; o resultado aparece
            m.de.forEach((d, j) => {
              const S = rects.get(d)!;
              const g = fantasma(d, null, S);
              const gx = T.left + T.width / 2 - (S.left + S.width / 2), gy = T.top - S.top;
              anima(g, [
                { opacity: 0, transform: 'none', offset: 0 },
                { opacity: 1, transform: 'none', color: cruza ? caneta : undefined, offset: .02 },
                { opacity: .9, transform: `translate(${gx * .5}px,${gy * .5 - (cruza ? 30 : 10)}px)`, offset: .5 },
                { opacity: 0, transform: `translate(${gx}px,${gy}px) scale(.5)`, offset: 1 },
              ], { duration: DUR * .85, delay: atraso + j * V(40), easing: VOO });
            });
            anima(m.el, [
              { opacity: 0, transform: 'scale(.5)', offset: 0 },
              { opacity: 0, transform: 'scale(.5)', offset: .7 },
              { opacity: 1, transform: 'scale(1.18)', color: caneta, offset: .86 },
              { opacity: 1, transform: 'none', color: caneta, offset: 1 },
            ], { duration: DUR + V(260), delay: atraso, easing: CURVA });
            anima(m.el, [{ color: caneta }, { color: caneta, offset: .5 }, {}], { duration: V(1000), delay: atraso + DUR + V(260), fill: 'none' });
          }
          if (cruza) ordemCruza++;
          ultimo = Math.max(ultimo, atraso + DUR + (m.de.length > 1 ? V(260) : 0));
        }
        // o que é novo na linha (o "=" de uma conta, uma unidade) é escrito depois que os termos chegam
        let tN = ultimo + V(80);
        for (const el of novos) tN += escreve(el, tN);
        t = tN + V(200);
        while (q < ordem.length && ordem[q] < p.fim) q++;
      }
    }
    // marca-texto no termo-chave / resultado
    const marcas = [...linhaEl.querySelectorAll<HTMLElement>('.ra-marca')];
    if (marcas.length) {
      t += V(120);
      marcas.forEach((mk, j) => anima(mk, [{ backgroundSize: '0% 100%' }, { backgroundSize: '100% 100%' }], { duration: V(420), delay: t + j * V(60), easing: 'cubic-bezier(.45,.05,.4,1)' }));
      t += V(420 + marcas.length * 60);
    }
    const nota = linhaEl.parentElement?.querySelector(`[data-nota="${l}"]`);
    if (nota) { anima(nota, [{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], { duration: V(360), delay: t, easing: CURVA }); t += V(500); }
    t += V(260);
  }
  // a explicação do passo aparece depois da conta
  let leitura = V(600);
  if (porque) {
    anima(porque, [{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], { duration: V(380), delay: t, easing: CURVA });
    leitura = V(Math.max(900, Math.min(2800, 300 + (porque.textContent || '').length * 22)));
    segue(porque, t);
  }
  const relogio = anima(passoEl, [], { duration: t + leitura, fill: 'none' });
  const termina = (ok: boolean) => { if (acabou) return; acabou = true; limpa(); resolve(ok); };
  if (relogio) relogio.onfinish = () => termina(true);
  else termina(true);
  return {
    pausa() { for (const a of vivas) { try { a.pause(); } catch { /* ok */ } } },
    toca() { for (const a of vivas) { try { a.play(); } catch { /* ok */ } } },
    cancela() { termina(false); },
    fim,
  };
}

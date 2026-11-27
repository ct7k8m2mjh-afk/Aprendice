import { useEffect, useRef, useState, type RefObject } from 'react';

/**
 * Faixa com rolagem lateral (faixa de temas da matéria, a compacta de tema/escada/flashcards, e "Suas matérias" do Início).
 * - bordas: se há conteúdo escondido à esquerda (e) e à direita (d), para as setas e a máscara;
 * - roda do mouse (pedido do dono, 06/11/2026): girar para baixo anda para a direita;
 * - ciclo infinito no computador (pedido do dono, 27/11/2026): com mouse (hover + ponteiro fino) e a faixa maior que a tela,
 *   a roda sobre a faixa sempre gira a faixa (nunca a página) e, passado o último cartão, segue do primeiro (e vice-versa).
 *   A lista é desenhada COPIAS_CICLO vezes a mais (cópias com aria-hidden e fora do Tab: `propsCopia`) e a posição é
 *   reposicionada sem animação uma volta para trás/frente quando passa dos limites (`passoCiclico`), sem emenda visível.
 *   Toque, celular e teclado seguem como antes (sem cópias). Sem mouse ou sem estouro: nas pontas, a página volta a rolar;
 * - anda(±1): as setas andam 80% da largura visível (no ciclo, também dão a volta).
 */

/** Cópias extras da lista no modo ciclo: com 3 cópias (4 voltas no total) sempre cabe um passo inteiro de seta adiante. */
export const COPIAS_CICLO = 3;

/** Atributos dos cartões copiados: invisíveis para o leitor de tela e fora da ordem do Tab. */
export function propsCopia(k: number): { 'aria-hidden'?: true; tabIndex?: number; 'data-copia'?: number } {
  return k > 0 ? { 'aria-hidden': true, tabIndex: -1, 'data-copia': k } : {};
}

/**
 * Lógica pura do ciclo. `pos` é a posição atual (scrollLeft), `base` de onde o passo parte (pode ser um alvo ainda em
 * andamento), `passo` o deslocamento pedido, `volta` a largura de uma lista inteira (do 1º cartão ao 1º da cópia) e `max`
 * o limite de rolagem. Mantém a posição entre 0 e 2 voltas: passou de 2 voltas, recua uma (`salto` = −volta); o passo
 * cairia antes do 0, avança uma (`salto` = +volta). Devolve o salto instantâneo a aplicar antes e o alvo final.
 */
export function passoCiclico(pos: number, base: number, passo: number, volta: number, max: number): { salto: number; alvo: number } {
  let salto = 0;
  if (volta <= 0) return { salto, alvo: Math.max(0, Math.min(max, base + passo)) };
  if (pos >= 2 * volta) { salto -= volta; base -= volta; }
  if (base + passo < 0) { salto += volta; base += volta; }
  return { salto, alvo: Math.max(0, Math.min(max, base + passo)) };
}

const temMouse = () => typeof matchMedia === 'function' && matchMedia('(hover: hover) and (pointer: fine)').matches;
const semMovimento = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const comportamento = (): ScrollBehavior => (semMovimento() ? 'instant' : 'smooth') as ScrollBehavior;
const pula = (r: HTMLElement, d: number) => { if (d) r.scrollTo({ left: r.scrollLeft + d, behavior: 'instant' as ScrollBehavior }); };

/** Largura de uma volta (do 1º cartão original ao 1º da 1ª cópia); 0 sem cópias. */
function voltaDe(r: HTMLElement): number {
  const c = r.querySelector<HTMLElement>('[data-copia="1"]');
  const p = r.firstElementChild as HTMLElement | null;
  return c && p ? c.offsetLeft - p.offsetLeft : 0;
}

export function useRoloHorizontal(chave: unknown, opc: { semCiclo?: boolean } = {}): {
  rolo: RefObject<HTMLDivElement>; bordas: { e: boolean; d: boolean }; mede: () => void; anda: (d: number) => void;
  /** true: desenhar a lista mais COPIAS_CICLO vezes (com `propsCopia(k)`) */
  ciclo: boolean;
} {
  const rolo = useRef<HTMLDivElement>(null);
  const [bordas, setBordas] = useState({ e: false, d: false });
  const [ciclo, setCiclo] = useState(false);
  const cicloRef = useRef(false);
  const alvo = useRef({ pos: -1, quando: 0 }); // posição pedida (a faixa rola suave; giros seguidos somam)
  const mede = () => {
    const r = rolo.current;
    if (!r) return;
    const v = cicloRef.current ? voltaDe(r) : 0;
    // estouro medido sempre pela lista sem cópias, para o modo não oscilar
    const larguraUma = r.scrollWidth - COPIAS_CICLO * v;
    // "Suas matérias" do Início não cicla (dono, 27/11/2026: "só nos temas")
    const quer = !opc.semCiclo && temMouse() && larguraUma > r.clientWidth + 4;
    if (quer !== cicloRef.current) { cicloRef.current = quer; setCiclo(quer); }
    const e = r.scrollLeft > 4;
    const d = (quer && v > 0) || r.scrollLeft + r.clientWidth < r.scrollWidth - 4;
    setBordas((b) => (b.e === e && b.d === d ? b : { e, d }));
  };
  useEffect(() => {
    const r = rolo.current; if (!r) return;
    const roda = (ev: WheelEvent) => {
      if (ev.ctrlKey || Math.abs(ev.deltaX) > Math.abs(ev.deltaY)) return; // trackpad lateral e zoom seguem o padrão
      const max = r.scrollWidth - r.clientWidth; if (max <= 1) return;
      const passo = (ev.deltaMode === 1 ? ev.deltaY * 40 : ev.deltaY) * 1.4;
      const agora = performance.now();
      const a = alvo.current;
      let base = a.pos >= 0 && agora - a.quando < 400 ? a.pos : r.scrollLeft;
      const v = cicloRef.current ? voltaDe(r) : 0;
      let fim: number;
      if (v > 0) {
        const { salto, alvo: al } = passoCiclico(r.scrollLeft, base, passo, v, max);
        pula(r, salto); base += salto; fim = al;
      } else {
        if ((passo < 0 && base <= 0) || (passo > 0 && base >= max - 1)) return;
        fim = Math.max(0, Math.min(max, base + passo));
      }
      ev.preventDefault();
      alvo.current = { pos: fim, quando: agora };
      r.scrollTo({ left: fim, behavior: comportamento() });
    };
    // terminou de rolar (toque num notebook com mouse, encaixe): volta à faixa das duas primeiras voltas
    const fimRolagem = () => {
      const v = cicloRef.current ? voltaDe(r) : 0;
      if (v > 0 && r.scrollLeft >= 2 * v) { alvo.current = { pos: -1, quando: 0 }; pula(r, -v); }
    };
    const mq = typeof matchMedia === 'function' ? matchMedia('(hover: hover) and (pointer: fine)') : null;
    r.addEventListener('wheel', roda, { passive: false });
    r.addEventListener('scrollend', fimRolagem);
    mq?.addEventListener('change', mede);
    addEventListener('resize', mede);
    mede();
    return () => {
      r.removeEventListener('wheel', roda); r.removeEventListener('scrollend', fimRolagem);
      mq?.removeEventListener('change', mede); removeEventListener('resize', mede);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chave]);
  // cópias entraram ou saíram: medir de novo
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { mede(); }, [ciclo]);
  const anda = (d: number) => {
    const r = rolo.current; if (!r) return;
    const passo = d * r.clientWidth * 0.8;
    const v = cicloRef.current ? voltaDe(r) : 0;
    alvo.current = { pos: -1, quando: 0 };
    if (v > 0) {
      const { salto, alvo: al } = passoCiclico(r.scrollLeft, r.scrollLeft, passo, v, r.scrollWidth - r.clientWidth);
      pula(r, salto);
      r.scrollTo({ left: al, behavior: comportamento() });
    } else r.scrollBy({ left: passo, behavior: comportamento() });
  };
  return { rolo, bordas, mede, anda, ciclo };
}

import { useEffect, useRef, useState, type RefObject } from 'react';

/**
 * Faixa com rolagem lateral (faixa de temas da matéria e "Suas matérias" do Início).
 * - bordas: se há conteúdo escondido à esquerda (e) e à direita (d), para as setas e a máscara;
 * - roda do mouse (pedido do dono, 06/11/2026): girar para baixo anda para a direita; nas pontas, a página volta a rolar;
 * - anda(±1): as setas andam 80% da largura visível.
 */
export function useRoloHorizontal(chave: unknown): { rolo: RefObject<HTMLDivElement>; bordas: { e: boolean; d: boolean }; mede: () => void; anda: (d: number) => void } {
  const rolo = useRef<HTMLDivElement>(null);
  const [bordas, setBordas] = useState({ e: false, d: false });
  const mede = () => {
    const r = rolo.current;
    if (!r) return;
    const e = r.scrollLeft > 4, d = r.scrollLeft + r.clientWidth < r.scrollWidth - 4;
    setBordas((b) => (b.e === e && b.d === d ? b : { e, d }));
  };
  useEffect(() => {
    const r = rolo.current; if (!r) return;
    let alvo = -1, ultimo = 0; // posição pedida (a faixa rola suave; giros seguidos somam)
    const roda = (ev: WheelEvent) => {
      if (ev.ctrlKey || Math.abs(ev.deltaX) > Math.abs(ev.deltaY)) return; // trackpad lateral e zoom seguem o padrão
      const max = r.scrollWidth - r.clientWidth; if (max <= 1) return;
      const passo = (ev.deltaMode === 1 ? ev.deltaY * 40 : ev.deltaY) * 1.4;
      const agora = performance.now();
      const base = alvo >= 0 && agora - ultimo < 400 ? alvo : r.scrollLeft;
      if ((passo < 0 && base <= 0) || (passo > 0 && base >= max - 1)) return;
      ev.preventDefault();
      alvo = Math.max(0, Math.min(max, base + passo)); ultimo = agora;
      r.scrollTo({ left: alvo, behavior: 'smooth' });
    };
    r.addEventListener('wheel', roda, { passive: false });
    addEventListener('resize', mede);
    mede();
    return () => { r.removeEventListener('wheel', roda); removeEventListener('resize', mede); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chave]);
  const anda = (d: number) => rolo.current?.scrollBy({ left: d * rolo.current.clientWidth * 0.8, behavior: 'smooth' });
  return { rolo, bordas, mede, anda };
}

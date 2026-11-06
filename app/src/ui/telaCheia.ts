import { useSyncExternalStore } from 'react';

/**
 * "Tela cheia" (sistema do protótipo: botão da barra da questão): o menu some e a questão vira o centro.
 * Escolha do aluno, só durante o estudo (questão, treino geral, flashcards); Esc ou o mesmo botão saem.
 */
let ligada = false;
const ouvintes = new Set<() => void>();
const avisa = () => ouvintes.forEach((f) => f());

export function defineTelaCheia(v: boolean) {
  if (ligada === v) return;
  ligada = v;
  avisa();
  try {
    if (v) document.documentElement.requestFullscreen?.().catch(() => {});
    else if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  } catch { /* navegador sem tela cheia: fica só o modo foco */ }
}

if (typeof document !== 'undefined') {
  // saiu da tela cheia do navegador (Esc): sai também do modo foco
  document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement && ligada) { ligada = false; avisa(); } });
}

export function useTelaCheia() {
  return useSyncExternalStore((f) => { ouvintes.add(f); return () => { ouvintes.delete(f); }; }, () => ligada);
}

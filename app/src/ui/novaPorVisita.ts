import { createElement, Fragment, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Remonta a tela a cada visita (cada navegação tem uma `location.key` nova). Usado na sessão de flashcards (revisão de
 * 20/11/2026, dados 6): depois de concluir a sessão de uma matéria, abrir a de outra (ou a mesma de novo) mostrava o
 * "Sessão concluída" anterior, porque o React reaproveitava o componente com o estado do fim da sessão.
 */
export function NovaPorVisita({ children }: { children: ReactNode }) {
  const loc = useLocation();
  return createElement(Fragment, { key: loc.key }, children);
}

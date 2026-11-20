import { createElement, Fragment, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Remonta a tela a cada visita (cada navegação tem uma `location.key` nova). Usado na sessão de flashcards (revisão de
 * 20/11/2026, dados 6): depois de concluir a sessão de uma matéria, abrir a de outra (ou a mesma de novo) mostrava o
 * "Sessão concluída" anterior, porque o React reaproveitava o componente com o estado do fim da sessão. Vale também
 * para a lista de flashcards: o filtro de tema de uma matéria não passa para a outra, e a fila de uma sessão não vaza
 * para a sessão seguinte (cartão em branco "1 de 20").
 */
export function NovaPorVisita({ children }: { children: ReactNode }) {
  const loc = useLocation();
  // endereço digitado ou trocado fora do site (a chave fica "default"): o caminho e a busca também entram na chave
  return createElement(Fragment, { key: `${loc.key}|${loc.pathname}|${loc.search}` }, children);
}

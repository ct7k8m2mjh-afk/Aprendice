/**
 * Qual destino da navegação fica ativo (menu lateral e abas do celular). Revisão de 19/11/2026, casca 23 e 31:
 * - o simulado em andamento e o resultado (/simulado/...) são de "Simulados";
 * - a sessão de revisão abre a questão dentro da matéria (/m/<m>/q/<id>?ctx=revisao), mas é de "Revisão".
 */
export type Destino = '/' | '/materias' | '/simulados' | '/revisao' | '/perfil' | '/hoje' | '/desempenho' | '/provas' | '/config' | null;

export function destinoAtivo(pathname: string, search = ''): Destino {
  const ctx = new URLSearchParams(search).get('ctx');
  if (pathname === '/') return '/';
  if (/^\/simulados?(\/|$)/.test(pathname)) return '/simulados';
  if (pathname.startsWith('/revisao') || (pathname.startsWith('/m/') && ctx === 'revisao')) return '/revisao';
  if (pathname.startsWith('/m/') || pathname === '/materias' || pathname === '/treino-geral') return '/materias';
  for (const d of ['/perfil', '/hoje', '/desempenho', '/provas', '/config'] as const) if (pathname === d || pathname.startsWith(d + '/')) return d;
  return null;
}

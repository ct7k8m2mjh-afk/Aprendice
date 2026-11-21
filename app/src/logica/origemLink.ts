/**
 * De onde é o link da questão (revisão do site de 19/11/2026, questao-correcao.md item 19; princípio 10, registro da
 * origem): o caderno no site da banca ou da instituição, ou uma cópia num site de terceiros (PDF de cursinho, site de
 * questões). Decide pelo domínio do link. A decisão de publicar é do dono; aqui só se diz ao aluno de onde vem o arquivo.
 */
export type TipoLink = 'oficial' | 'cursinho' | 'terceiros' | 'hospedado' | 'lista';
export interface OrigemLink { tipo: TipoLink; nome?: string; rotulo: string }

// domínio → nome de quem publica (cursinhos e sites de professor que resolvem e republicam a prova)
const CURSINHOS: [RegExp, string][] = [
  [/(^|\.)curso-objetivo\.br$/, 'Objetivo'], [/(^|\.)estrategia\.com$/, 'Estratégia'], [/(^|\.)etapa\.com\.br$/, 'Etapa'],
  [/(^|\.)poliedro\.com\.br$/, 'Poliedro'], [/(^|\.)sistemaanglo\.com\.br$|(^|\.)anglo\w*\.com\.br$/, 'Anglo'],
  [/(^|\.)descomplica\.com\.br$/, 'Descomplica'], [/(^|\.)elitepre\.com\.br$/, 'Elite'], [/(^|\.)bernoulli\.com\.br$/, 'Bernoulli'],
  [/(^|\.)fariasbrito\.com\.br$/, 'Farias Brito'], [/(^|\.)aridesa\.com\.br$/, 'Ari de Sá'], [/(^|\.)cursinhodapoli\.com\.br$/, 'Cursinho da Poli'],
  [/(^|\.)quimicaparaovestibular\.com\.br$/, 'Química para o Vestibular'],
];
const TERCEIROS: [RegExp, string][] = [
  [/(^|\.)qconcursos\.com$/, 'Qconcursos'], [/(^|\.)pciconcursos\.com\.br$/, 'PCI Concursos'], [/(^|\.)vestibular\.brasilescola\.uol\.com\.br$|(^|\.)brasilescola\.uol\.com\.br$/, 'Brasil Escola'],
];
// armazenamento genérico: o arquivo pode ser da banca, mas o endereço não diz
const HOSPEDAGEM = /(^|\.)(storage\.googleapis\.com|blob\.core\.windows\.net|drive\.google\.com|dropbox\.com|amazonaws\.com)$/;

function host(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, '').toLowerCase(); } catch { return ''; }
}

/** o link é só a página inicial do site ("https://www.uea.edu.br/", "https://vestibular.uemg.br") */
function paginaInicial(url: string): boolean {
  try { const u = new URL(url); return /^\/?(?:index\.(?:html?|php))?$/.test(u.pathname) && !u.search; } catch { return false; }
}

export function origemDoLink(url: string | undefined, origem: 'prova' | 'site' = 'prova'): OrigemLink {
  if (origem !== 'prova') return { tipo: 'lista', rotulo: 'Lista pública de exercícios' };
  const h = host(url || '');
  for (const [re, nome] of CURSINHOS) if (re.test(h)) return { tipo: 'cursinho', nome, rotulo: 'PDF de resolução publicada, com a prova' };
  for (const [re, nome] of TERCEIROS) if (re.test(h)) return { tipo: 'terceiros', nome, rotulo: 'Cópia da prova em site de terceiros' };
  // o domínio técnico do armazenamento fica no registro (`nome`), não na tela do aluno (revisão de 20/11/2026, N11)
  if (HOSPEDAGEM.test(h)) return { tipo: 'hospedado', nome: h, rotulo: 'Caderno da prova, em arquivo hospedado na internet' };
  // link só para a página inicial da instituição: não promete o caderno (N11)
  if (h && paginaInicial(url || '')) return { tipo: 'oficial', rotulo: 'Site da instituição (sem link direto para o caderno)' };
  return { tipo: 'oficial', rotulo: 'Caderno da prova oficial' };
}

/** Site didático (CLAUDE.md, "Questões de sites didáticos saem"; dono, 05/11/2026): nem nome nem link no site.
 *  Usado para esconder a fonte na tela enquanto o dado não é trocado (revisão de 20/11/2026, dados 3: fichas IME e UFRR). */
const DIDATICOS = /(^|\.)(brasilescola\.uol\.com\.br|mundoeducacao\.uol\.com\.br|preparaenem\.com|infoescola\.com|todamateria\.com\.br)$/;
export function ehSiteDidatico(url: string | undefined): boolean {
  return DIDATICOS.test(host(url || ''));
}

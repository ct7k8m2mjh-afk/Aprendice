import type { MateriaId } from './tipos';

/**
 * As dez matérias do vestibular. Bio, Quí, Mat e Por têm conteúdo revisado do protótipo; Física e Geografia
 * estão ativas com os temas definidos e recebem as questões com as provas completas; as demais ainda em preparação.
 *
 * Sistema de cor (o mesmo do protótipo): uma cor por matéria, em dois tons por tema —
 *   c  = preenchimento (botão, barra)   t = texto sobre a página (contraste AA)   ink = texto sobre a cor.
 * Cada matéria tem uma cor bem distinta das outras (como um caderno de cada cor): verde, verde-água, amarelo, magenta,
 * azul, laranja, marrom, roxo, grafite e vermelho.
 */
export interface MateriaInfo {
  id: MateriaId;
  nome: string;
  curto: string;
  ativa: boolean;
  /** As seis matérias do menu e da tela inicial; as outras ficam em "Outras matérias". */
  principal: boolean;
  claro: { c: string; t: string; ink: string };
  escuro: { c: string; t: string; ink: string };
  descricao: string;
}

export const MATERIAS: MateriaInfo[] = [
  { id: 'bio', nome: 'Biologia', curto: 'Bio', ativa: true, principal: true,
    claro: { c: '#177E36', t: '#12692C', ink: '#FFFFFF' }, escuro: { c: '#56D364', t: '#56D364', ink: '#0C0D10' },
    descricao: 'Célula, genética, fisiologia, ecologia e evolução.' },
  { id: 'qui', nome: 'Química', curto: 'Quí', ativa: true, principal: true,
    claro: { c: '#C2185B', t: '#A3124B', ink: '#FFFFFF' }, escuro: { c: '#F45D9C', t: '#F45D9C', ink: '#0C0D10' },
    descricao: 'Estequiometria, soluções, orgânica, equilíbrio e eletroquímica.' },
  { id: 'mat', nome: 'Matemática', curto: 'Mat', ativa: true, principal: true,
    claro: { c: '#087884', t: '#066570', ink: '#FFFFFF' }, escuro: { c: '#2CCFD0', t: '#2CCFD0', ink: '#0C0D10' },
    descricao: 'Funções, geometria, probabilidade, estatística e porcentagem.' },
  { id: 'por', nome: 'Português', curto: 'Por', ativa: true, principal: true,
    claro: { c: '#F2C12E', t: '#8A6200', ink: '#17181C' }, escuro: { c: '#F7C548', t: '#F7C548', ink: '#0C0D10' },
    descricao: 'Interpretação, gramática, literatura e linguagens.' },
  { id: 'fis', nome: 'Física', curto: 'Fís', ativa: true, principal: true,
    claro: { c: '#2F5BD3', t: '#2A4FB8', ink: '#FFFFFF' }, escuro: { c: '#7EA2FF', t: '#7EA2FF', ink: '#0C0D10' },
    descricao: 'Cinemática, dinâmica, energia, termologia, óptica, ondas e eletricidade.' },
  { id: 'geo', nome: 'Geografia', curto: 'Geo', ativa: true, principal: true,
    claro: { c: '#E07010', t: '#A84F00', ink: '#FFFFFF' }, escuro: { c: '#FF9A3C', t: '#FF9A3C', ink: '#0C0D10' },
    descricao: 'Cartografia, natureza, população, espaço urbano e agrário, energia e geopolítica.' },
  { id: 'his', nome: 'História', curto: 'His', ativa: true, principal: false,
    claro: { c: '#8A5A2B', t: '#7A4E24', ink: '#FFFFFF' }, escuro: { c: '#D6A574', t: '#D6A574', ink: '#0C0D10' },
    descricao: 'Brasil, Geral, América e o mundo contemporâneo.' },
  { id: 'fil', nome: 'Filosofia', curto: 'Fil', ativa: true, principal: false,
    claro: { c: '#6A3DB8', t: '#5E35A6', ink: '#FFFFFF' }, escuro: { c: '#B79BFF', t: '#B79BFF', ink: '#0C0D10' },
    descricao: 'Dos pré-socráticos ao existencialismo: ética, lógica, política e teoria do conhecimento.' },
  { id: 'soc', nome: 'Sociologia', curto: 'Soc', ativa: true, principal: false,
    claro: { c: '#4A5568', t: '#3F4859', ink: '#FFFFFF' }, escuro: { c: '#AAB4C5', t: '#AAB4C5', ink: '#0C0D10' },
    descricao: 'Cultura, trabalho, desigualdade, poder, movimentos sociais e indústria cultural.' },
  { id: 'ing', nome: 'Inglês', curto: 'Ing', ativa: true, principal: false,
    claro: { c: '#D0312D', t: '#B0261F', ink: '#FFFFFF' }, escuro: { c: '#FF7A70', t: '#FF7A70', ink: '#0C0D10' },
    descricao: 'Leitura e interpretação de textos em inglês.' },
];

export const MATERIAS_ATIVAS = MATERIAS.filter((m) => m.ativa);
export const MATERIAS_PRINCIPAIS = MATERIAS.filter((m) => m.principal);
export const OUTRAS_MATERIAS = MATERIAS.filter((m) => m.ativa && !m.principal);

export function materia(id: string): MateriaInfo | undefined {
  return MATERIAS.find((m) => m.id === id);
}

export function nomeMateria(id: string): string {
  return materia(id)?.nome ?? id;
}

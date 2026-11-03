import type { MateriaId } from './tipos';

/**
 * As dez matérias do vestibular. Bio, Quí, Mat e Por têm conteúdo revisado do protótipo; Física e Geografia
 * estão ativas com os temas definidos e recebem as questões com as provas completas; as demais ainda em preparação.
 *
 * Sistema de cor (o mesmo do protótipo): uma cor por matéria, em dois tons por tema —
 *   c  = preenchimento (botão, barra)   t = texto sobre a página (contraste AA)   ink = texto sobre a cor.
 * Novas matérias ocupam matizes livres do círculo, longe das quatro originais e do vermelho de "errado".
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
    claro: { c: '#5E7A12', t: '#516A0F', ink: '#FFFFFF' }, escuro: { c: '#B5D94A', t: '#B5D94A', ink: '#0C0D10' },
    descricao: 'Cartografia, natureza, população, espaço urbano e agrário, energia e geopolítica.' },
  { id: 'his', nome: 'História', curto: 'His', ativa: true, principal: false,
    claro: { c: '#9A4A1C', t: '#8A4119', ink: '#FFFFFF' }, escuro: { c: '#F0965C', t: '#F0965C', ink: '#0C0D10' },
    descricao: 'Brasil, Geral, América e o mundo contemporâneo.' },
  { id: 'fil', nome: 'Filosofia', curto: 'Fil', ativa: true, principal: false,
    claro: { c: '#7A5C3E', t: '#6B5036', ink: '#FFFFFF' }, escuro: { c: '#D6B48C', t: '#D6B48C', ink: '#0C0D10' },
    descricao: 'Dos pré-socráticos ao existencialismo: ética, lógica, política e teoria do conhecimento.' },
  { id: 'soc', nome: 'Sociologia', curto: 'Soc', ativa: true, principal: false,
    claro: { c: '#8B3A8F', t: '#7A3180', ink: '#FFFFFF' }, escuro: { c: '#E08BE4', t: '#E08BE4', ink: '#0C0D10' },
    descricao: 'Cultura, trabalho, desigualdade, poder, movimentos sociais e indústria cultural.' },
  { id: 'ing', nome: 'Inglês', curto: 'Ing', ativa: true, principal: false,
    claro: { c: '#5B3FC4', t: '#5236B3', ink: '#FFFFFF' }, escuro: { c: '#A996FF', t: '#A996FF', ink: '#0C0D10' },
    descricao: 'Leitura e interpretação de textos em inglês.' },
  { id: 'red', nome: 'Redação', curto: 'Red', ativa: false, principal: false,
    claro: { c: '#3D4A5C', t: '#344051', ink: '#FFFFFF' }, escuro: { c: '#AEBBD0', t: '#AEBBD0', ink: '#0C0D10' },
    descricao: 'Propostas reais de redação e critérios de correção.' },
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

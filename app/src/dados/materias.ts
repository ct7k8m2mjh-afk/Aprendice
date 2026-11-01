import type { MateriaId } from './tipos';

/**
 * As dez matérias do vestibular. As quatro primeiras têm conteúdo revisado do protótipo;
 * as demais têm estrutura e recebem questões reais quando a fábrica de conteúdo importar as provas completas.
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
  claro: { c: string; t: string; ink: string };
  escuro: { c: string; t: string; ink: string };
  descricao: string;
}

export const MATERIAS: MateriaInfo[] = [
  { id: 'bio', nome: 'Biologia', curto: 'Bio', ativa: true,
    claro: { c: '#177E36', t: '#12692C', ink: '#FFFFFF' }, escuro: { c: '#56D364', t: '#56D364', ink: '#0C0D10' },
    descricao: 'Célula, genética, fisiologia, ecologia e evolução.' },
  { id: 'qui', nome: 'Química', curto: 'Quí', ativa: true,
    claro: { c: '#C2185B', t: '#A3124B', ink: '#FFFFFF' }, escuro: { c: '#F45D9C', t: '#F45D9C', ink: '#0C0D10' },
    descricao: 'Estequiometria, soluções, orgânica, equilíbrio e eletroquímica.' },
  { id: 'mat', nome: 'Matemática', curto: 'Mat', ativa: true,
    claro: { c: '#087884', t: '#066570', ink: '#FFFFFF' }, escuro: { c: '#2CCFD0', t: '#2CCFD0', ink: '#0C0D10' },
    descricao: 'Funções, geometria, probabilidade, estatística e porcentagem.' },
  { id: 'por', nome: 'Português', curto: 'Por', ativa: true,
    claro: { c: '#F2C12E', t: '#8A6200', ink: '#17181C' }, escuro: { c: '#F7C548', t: '#F7C548', ink: '#0C0D10' },
    descricao: 'Interpretação, gramática, literatura e linguagens.' },
  { id: 'fis', nome: 'Física', curto: 'Fís', ativa: false,
    claro: { c: '#2F5BD3', t: '#2A4FB8', ink: '#FFFFFF' }, escuro: { c: '#7EA2FF', t: '#7EA2FF', ink: '#0C0D10' },
    descricao: 'Mecânica, ondas, eletricidade, termologia e óptica.' },
  { id: 'his', nome: 'História', curto: 'His', ativa: false,
    claro: { c: '#9A4A1C', t: '#8A4119', ink: '#FFFFFF' }, escuro: { c: '#F0965C', t: '#F0965C', ink: '#0C0D10' },
    descricao: 'Brasil, Geral, América e o mundo contemporâneo.' },
  { id: 'geo', nome: 'Geografia', curto: 'Geo', ativa: false,
    claro: { c: '#5E7A12', t: '#516A0F', ink: '#FFFFFF' }, escuro: { c: '#B5D94A', t: '#B5D94A', ink: '#0C0D10' },
    descricao: 'Natureza, população, economia, cartografia e geopolítica.' },
  { id: 'ing', nome: 'Inglês', curto: 'Ing', ativa: false,
    claro: { c: '#5B3FC4', t: '#5236B3', ink: '#FFFFFF' }, escuro: { c: '#A996FF', t: '#A996FF', ink: '#0C0D10' },
    descricao: 'Leitura e interpretação de textos em inglês.' },
  { id: 'fil', nome: 'Filosofia e Sociologia', curto: 'Fil', ativa: false,
    claro: { c: '#7A5C3E', t: '#6B5036', ink: '#FFFFFF' }, escuro: { c: '#D6B48C', t: '#D6B48C', ink: '#0C0D10' },
    descricao: 'Pensadores, ética, política, cultura e sociedade.' },
  { id: 'red', nome: 'Redação', curto: 'Red', ativa: false,
    claro: { c: '#3D4A5C', t: '#344051', ink: '#FFFFFF' }, escuro: { c: '#AEBBD0', t: '#AEBBD0', ink: '#0C0D10' },
    descricao: 'Propostas reais de redação e critérios de correção.' },
];

export const MATERIAS_ATIVAS = MATERIAS.filter((m) => m.ativa);

export function materia(id: string): MateriaInfo | undefined {
  return MATERIAS.find((m) => m.id === id);
}

export function nomeMateria(id: string): string {
  return materia(id)?.nome ?? id;
}

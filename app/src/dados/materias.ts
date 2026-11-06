import { materiaAtual, type MateriaId } from './tipos';

/**
 * As nove matérias do vestibular. Bio, Quí, Mat e Por têm conteúdo revisado do protótipo; as outras estão ativas
 * com os temas definidos e recebem as questões com as provas completas. Filosofia e Sociologia são UMA matéria
 * ("Filosofia e Sociologia", id 'fs', comando 18 do dono); os ids antigos 'fil' e 'soc' só existem na migração.
 *
 * Cores: paleta aprovada pelo dono (docs/cores/paleta.json e Paleta-materias-APRENDICE.pdf, versão 3, 05/11/2026).
 * Os seis tons de cada matéria vêm EXATAMENTE do arquivo (o teste paleta.test.ts confere):
 *   principal · texto no tema claro · texto no tema escuro · fundo suave claro · fundo suave escuro · texto sobre a principal.
 * Como cada tom é usado (igual às telas de exemplo do PDF):
 *   c   = preenchimento do botão: no claro, o tom do botão da tela clara do PDF (a principal, ou o texto claro quando
 *         a principal é clara demais para letra branca, caso da Biologia); no escuro, o tom de texto escuro.
 *   ink = letra sobre c.          t = texto na cor da matéria (título, links, ícones de interface).
 *   p   = principal (barra de progresso, anel, marcas).   pInk = letra sobre a principal.
 *   s   = fundo suave (etiqueta do tema ativo, fundos de destaque).
 */
export interface Tons { c: string; ink: string; t: string; p: string; pInk: string; s: string }

export interface MateriaInfo {
  id: MateriaId;
  nome: string;
  curto: string;
  ativa: boolean;
  /** As seis matérias do menu e da tela inicial; as outras ficam em "Outras matérias". */
  principal: boolean;
  /** Os tons do arquivo da paleta, sem alteração. */
  paleta: { principal: string; textoClaro: string; textoEscuro: string; fundoClaro: string; fundoEscuro: string; sobrePrincipal: string };
  /** Botão na tela clara do PDF da paleta. */
  botaoClaro: { c: string; ink: string };
  claro: Tons;
  escuro: Tons;
  descricao: string;
}

/** Letra escura do site (a mesma "tinta" do tema claro), usada sobre os botões do tema escuro, como no PDF da paleta. */
const LETRA_ESCURA = '#17181C';

function mat(id: MateriaId, nome: string, curto: string, principal: boolean, paleta: MateriaInfo['paleta'], botaoClaro: MateriaInfo['botaoClaro'], descricao: string): MateriaInfo {
  return {
    id, nome, curto, ativa: true, principal, paleta, botaoClaro, descricao,
    claro: { c: botaoClaro.c, ink: botaoClaro.ink, t: paleta.textoClaro, p: paleta.principal, pInk: paleta.sobrePrincipal, s: paleta.fundoClaro },
    escuro: { c: paleta.textoEscuro, ink: LETRA_ESCURA, t: paleta.textoEscuro, p: paleta.principal, pInk: paleta.sobrePrincipal, s: paleta.fundoEscuro },
  };
}
const BRANCO = '#FFFFFF';

export const MATERIAS: MateriaInfo[] = [
  mat('bio', 'Biologia', 'Bio', true,
    { principal: '#3FA535', textoClaro: '#138404', textoEscuro: '#51A948', fundoClaro: '#E3FCE0', fundoEscuro: '#173613', sobrePrincipal: '#17181C' },
    { c: '#138404', ink: BRANCO }, 'Célula, genética, fisiologia, ecologia e evolução.'),
  mat('qui', 'Química', 'Quí', true,
    { principal: '#D31A8D', textoClaro: '#D31A8D', textoEscuro: '#F65BB0', fundoClaro: '#FFEEF5', fundoEscuro: '#471D33', sobrePrincipal: '#FFFFFF' },
    { c: '#D31A8D', ink: BRANCO }, 'Estequiometria, soluções, orgânica, equilíbrio e eletroquímica.'),
  mat('mat', 'Matemática', 'Mat', true,
    { principal: '#1F3FA6', textoClaro: '#1F3FA6', textoEscuro: '#6B93F6', fundoClaro: '#EEF4FF', fundoEscuro: '#1D2C51', sobrePrincipal: '#FFFFFF' },
    { c: '#1F3FA6', ink: BRANCO }, 'Funções, geometria, probabilidade, estatística e porcentagem.'),
  mat('por', 'Português', 'Por', true,
    { principal: '#8A3FD1', textoClaro: '#8A3FD1', textoEscuro: '#B679FC', fundoClaro: '#F6F0FF', fundoEscuro: '#35244A', sobrePrincipal: '#FFFFFF' },
    { c: '#8A3FD1', ink: BRANCO }, 'Interpretação, gramática, literatura e linguagens.'),
  mat('fis', 'Física', 'Fís', true,
    { principal: '#F27700', textoClaro: '#B2580D', textoEscuro: '#F27700', fundoClaro: '#FFF0E8', fundoEscuro: '#482206', sobrePrincipal: '#17181C' },
    { c: '#F27700', ink: '#17181C' }, 'Cinemática, dinâmica, energia, termologia, óptica, ondas e eletricidade.'),
  mat('geo', 'Geografia', 'Geo', true,
    { principal: '#0F6E7A', textoClaro: '#0F6E7A', textoEscuro: '#59A0AB', fundoClaro: '#DCFAFF', fundoEscuro: '#00353B', sobrePrincipal: '#FFFFFF' },
    { c: '#0F6E7A', ink: BRANCO }, 'Cartografia, natureza, população, espaço urbano e agrário, energia e geopolítica.'),
  mat('his', 'História', 'His', false,
    { principal: '#75451D', textoClaro: '#75451D', textoEscuro: '#B77B4C', fundoClaro: '#FFF0E6', fundoEscuro: '#472302', sobrePrincipal: '#FFFFFF' },
    { c: '#75451D', ink: BRANCO }, 'Brasil, Geral, América e o mundo contemporâneo.'),
  mat('fs', 'Filosofia e Sociologia', 'Fil e Soc', false,
    { principal: '#E8B616', textoClaro: '#8C6C02', textoEscuro: '#E8B616', fundoClaro: '#FFF3D5', fundoEscuro: '#3B2B00', sobrePrincipal: '#17181C' },
    { c: '#E8B616', ink: '#17181C' }, 'Filosofia, dos pré-socráticos ao existencialismo, e Sociologia: cultura, trabalho, desigualdade, poder e indústria cultural.'),
  mat('ing', 'Inglês', 'Ing', false,
    { principal: '#AC002A', textoClaro: '#AC002A', textoEscuro: '#FE3E3A', fundoClaro: '#FFEFEF', fundoEscuro: '#4B1D1F', sobrePrincipal: '#FFFFFF' },
    { c: '#AC002A', ink: BRANCO }, 'Leitura e interpretação de textos em inglês.'),
];

export const MATERIAS_ATIVAS = MATERIAS.filter((m) => m.ativa);
export const MATERIAS_PRINCIPAIS = MATERIAS.filter((m) => m.principal);
export const OUTRAS_MATERIAS = MATERIAS.filter((m) => m.ativa && !m.principal);

export function materia(id: string): MateriaInfo | undefined {
  const atual = materiaAtual(id);
  return MATERIAS.find((m) => m.id === atual);
}

export function nomeMateria(id: string): string {
  return materia(id)?.nome ?? id;
}

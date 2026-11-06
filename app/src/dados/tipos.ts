// Tipos do conteúdo (gerado por scripts/converte.py a partir de app-atual/).

export type MateriaId =
  | 'bio' | 'qui' | 'mat' | 'por'
  | 'fis' | 'his' | 'geo' | 'ing' | 'fs';

/** Ids que existiram e foram unidos (comando 18 do dono): Filosofia e Sociologia viraram 'fs'. Só a migração e as rotas antigas usam. */
export type MateriaIdAntiga = 'fil' | 'soc';
export const MATERIA_UNIDA: Record<MateriaIdAntiga, MateriaId> = { fil: 'fs', soc: 'fs' };
/** Id atual de uma matéria (traduz os ids antigos de Filosofia e de Sociologia). */
export function materiaAtual(id: string | undefined | null): MateriaId | undefined {
  if (!id) return undefined;
  return (MATERIA_UNIDA as Record<string, MateriaId>)[id] || (id as MateriaId);
}

export type Letra = 'A' | 'B' | 'C' | 'D' | 'E';

export interface Questao {
  id: string;
  escola: string;
  ano: string;
  n: string;
  banca: string;
  fase: string;
  enun: string;
  alts: Partial<Record<Letra, string>>;
  gab: Letra;
  modulo: string;
  sub: string;
  dif: number;
  degrau: number;
  conceito: string;
  pista: string;
  url: string;
  origem: 'prova' | 'site';
  figura: boolean;
  /** motivo pelo qual a questão está fora do ar (ex.: sem link da fonte) */
  pendente?: string;
  /** questão só de texto, transcrita da camada de texto da prova oficial (parágrafos como a banca organizou) */
  transcricao?: Transcricao;
  /** resolução embutida (questões de prova completa aprovadas pela banca) */
  res?: Resolucao;
  /** questão vinda de uma prova completa: print em conteudo/<print> e id da prova (provas/<prova>/) */
  print?: string;
  prova?: string;
  /** texto e transcrição ficam em <m>/txt/<conteúdo>.json (carregados com a questão, para o banco ficar leve) */
  txt?: 1;
  /** questão de site retirada (comando 21): só guarda o lugar do histórico do aluno no desempenho; nunca é mostrada */
  retirada?: true;
}

/** Texto de uma questão de prova (arquivo txt/<conteúdo>.json). */
export interface TextoQuestao { enun: string; transcricao?: Transcricao }

/** Parágrafo transcrito: a = alinhamento (e esquerda, c centro, d direita); t com **negrito**, ~~itálico~~ e quebras \n. */
export interface Transcricao { enun: { a: 'e' | 'c' | 'd'; t: string }[]; alts: Partial<Record<Letra, string>> }

export interface Passo { faz: string; conta: string; porque: string; tipo?: string }

export interface Resolucao {
  antes?: { texto?: string; formulas?: string[]; simbolos?: [string, string][] };
  pista?: string;
  passos?: Passo[];
  resposta?: string;
  checagem?: string;
  erradas?: Partial<Record<Letra, string>>;
  armadilha?: string;
  alerta?: string;
  essencial?: { pede?: string; chave?: string; cuidado?: string };
  /** a conta como no caderno, linha por linha (animada no app) */
  quadro?: { linha: string; nota?: string; destaque?: string }[];
  /** outros jeitos de resolver */
  caminhos?: { nome: string; ideia: string }[];
  /** decisão da banca sobre visual/animação extra (roteiro para produção futura) */
  visual?: { cabe: boolean; porque?: string; tipo?: string; roteiro?: string };
}

export interface CartaoTeoria {
  sub: string;
  titulo: string;
  oque?: string;
  identificar?: string;
  exemplo?: string;
  caderno?: string[];
  cuidado?: string;
}

export interface Conteudo { id: string; nome: string }

export interface Modulo {
  id: string;
  nome: string;
  resumo: string;
  formulas: string[];
  erro: string;
  cartoes: CartaoTeoria[];
  subs: Conteudo[];
}

export interface Area { id: string; nome: string; mods: string[]; resumo?: string; topicos?: string[] }

export interface Flashcard {
  id: string;
  mod: string;
  sub: string;
  tipo?: string;
  frente: string;
  verso: string;
  essencial?: string[];
  aceita?: string[];
  erro_comum?: string;
  peso?: number;
  fonte?: string;
  img?: string;
  credito?: string;
}

export interface Completar {
  id: string;
  mod: string;
  sub: string;
  frase: string;
  resp: string;
  aceita?: string[];
  fonte?: string;
}

export interface Verbete { termo: string; formas: string[]; def: string; origem?: string; exemplo?: string; fonte?: string }

export interface Figura { t: string; u: string; subs: string[]; fonte: string; licenca: string }

export interface MateriaConteudo {
  id: MateriaId;
  modulos: Modulo[];
  areas: Area[];
  glossario: Record<string, string>;
  dic: Verbete[];
  flash: Flashcard[];
  flashImg: Flashcard[];
  essencial: { abc: string[]; completar: Completar[] };
  alias: Record<string, string>;
}

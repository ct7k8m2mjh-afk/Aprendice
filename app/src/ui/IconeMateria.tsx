import { materiaAtual, type MateriaId } from '../dados/tipos';
import { urlArteMateria } from '../dados/conteudo';

/**
 * Arte da MATÉRIA (comando 32 do dono, 06/11/2026): um objeto por matéria, montado por scripts/capas.py com as peças
 * das capas do dono (docs/capas/<matéria>/): Biologia a célula, Química o frasco, Matemática os sólidos, Português o
 * livro com a caneta, Física a lâmpada, Geografia o globo, História a ampulheta, Inglês os balões de fala e Filosofia e
 * Sociologia a coruja. O WebP já vem enquadrado para caber inteiro num círculo e traz a sombra de contato.
 * Sem animação (princípio 8). Substitui as ilustrações antigas (cenas 3D, ícones em camadas e recortes das pranchas).
 */
export function temIlu(m: string): boolean { return !!materiaAtual(m); }

/** Só o objeto (sem círculo): destaques e listas. */
export function IluMateria({ m, className = '', tam }: { m: string; className?: string; tam?: number }) {
  const id = materiaAtual(m) as MateriaId | null;
  const url = id ? urlArteMateria(id) : null;
  if (!url) return <span className={'ilu-mat ' + className} style={tam ? { width: tam, height: tam } : undefined} aria-hidden />;
  return <img src={url} alt="" width={tam} height={tam} className={'ilu-mat ' + className} loading="lazy" decoding="async" />;
}

/** O objeto dentro do círculo claro na cor da matéria (cartões "Suas matérias" e linhas pequenas). */
export function CirculoMateria({ m, tam }: { m: string; tam: number }) {
  return (
    <span className={`circ-mat m-${materiaAtual(m) || m}`} style={{ width: tam, height: tam }} aria-hidden>
      <IluMateria m={m} />
    </span>
  );
}

/** Arte da matéria em tamanho pequeno (listas, desempenho). */
export function IconeMateria({ m, tam = 28 }: { m: string; tam?: number }) {
  return <IluMateria m={m} tam={tam} className="ic-materia" />;
}

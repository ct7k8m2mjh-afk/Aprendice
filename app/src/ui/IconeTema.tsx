import { ICONES_TEMA } from '../dados/iconesTema';
import { urlIcone } from '../dados/conteudo';
import type { MateriaId } from '../dados/tipos';

/** O tema tem o ícone enviado pelo dono (docs/icones/<matéria>/, comandos 19 e 23)? Hoje todos os temas das nove matérias têm. */
export function temIconeTema(m: string, tema: string): boolean {
  return !!ICONES_TEMA[m]?.includes(tema);
}

/**
 * Ícone do TEMA (módulo): o objeto aparece inteiro dentro de um círculo claro (o WebP já vem enquadrado para
 * caber no círculo); ao passar o mouse ou focar pelo teclado o elemento clicável em volta (link ou botão) faz o
 * círculo crescer ~6% e subir (CSS .ic-tema). Os ícones antigos (protótipo, pranchas) saíram do site: tema sem
 * ícone novo mostra só o círculo vazio. A classe ic3d mantém os tamanhos de cada lugar definidos no CSS.
 */
export function IcTema({ m, tema, tam = 56 }: { m: MateriaId; tema: string; tam?: number }) {
  const url = temIconeTema(m, tema) ? urlIcone(m, tema) : null;
  return (
    <span className="ic3d ic-tema" style={{ width: tam, height: tam }} aria-hidden>
      {url && <img src={url} width={tam} height={tam} alt="" loading="lazy" decoding="async" />}
    </span>
  );
}

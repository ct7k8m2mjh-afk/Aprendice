import { ICONES_TEMA } from '../dados/iconesTema';
import { urlIcone } from '../dados/conteudo';
import type { MateriaId } from '../dados/tipos';
import { Ic3D } from './comum';

/** O tema tem o ícone novo enviado pelo dono (docs/icones/<matéria>/, comando 19)? */
export function temIconeTema(m: string, tema: string): boolean {
  return !!ICONES_TEMA[m]?.includes(tema);
}

/**
 * Ícone do TEMA (módulo). Com o ícone novo do dono, o objeto aparece inteiro dentro de um círculo claro
 * (o WebP já vem enquadrado para caber no círculo); ao passar o mouse ou focar pelo teclado o elemento
 * clicável em volta (link ou botão) faz o círculo crescer ~6% e subir (CSS .ic-tema). Matéria sem ícones
 * novos: o ícone 3D atual, como antes. A classe ic3d mantém os tamanhos de cada lugar definidos no CSS.
 */
export function IcTema({ m, tema, tam = 56 }: { m: MateriaId; tema: string; tam?: number }) {
  const url = temIconeTema(m, tema) ? urlIcone(m, tema) : null;
  if (!url) return <Ic3D m={m} chave={tema} tam={tam} />;
  return (
    <span className="ic3d ic-tema" style={{ width: tam, height: tam }} aria-hidden>
      <img src={url} width={tam} height={tam} alt="" loading="lazy" decoding="async" />
    </span>
  );
}

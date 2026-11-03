import iluBio from '../assets/ilu/bio.webp';
import iluQui from '../assets/ilu/qui.webp';
import iluMat from '../assets/ilu/mat.webp';
import iluPor from '../assets/ilu/por.webp';
import iluHis from '../assets/ilu/his.webp';
import iluFil from '../assets/ilu/fil.webp';
import iluSoc from '../assets/ilu/soc.webp';
import iluIng from '../assets/ilu/ing.webp';

/**
 * Mapa central do ícone 3D principal de cada matéria (o mesmo em cartões, listas e desempenho).
 * Bio, Quí, Mat e Por: ilustrações grandes do protótipo, sem sombra própria (a interface põe a sombra).
 * His, Fil, Soc e Ing: recortados das pranchas aprovadas, já com a sombra de contato do desenho
 * e em resolução menor; por isso aparecem com a classe "ilu-propria" (sem sombra extra, tamanho contido).
 * Física e Geografia ainda não têm ilustração principal: mostram o ponto na cor da matéria.
 */
export const ILU: Record<string, string> = { bio: iluBio, qui: iluQui, mat: iluMat, por: iluPor, his: iluHis, fil: iluFil, soc: iluSoc, ing: iluIng };
export const ILU_PROPRIA = new Set(['his', 'fil', 'soc', 'ing']);

export function classeIlu(m: string, base: string): string {
  return base + (ILU_PROPRIA.has(m) ? ' ilu-propria' : '');
}

/** Ícone principal da matéria em tamanho pequeno (listas, desempenho); sem ilustração, o ponto na cor da matéria. */
export function IconeMateria({ m, tam = 28 }: { m: string; tam?: number }) {
  return ILU[m]
    ? <img className={classeIlu(m, 'ic-materia')} src={ILU[m]} alt="" width={tam} height={tam} />
    : <i className="ponto" aria-hidden />;
}

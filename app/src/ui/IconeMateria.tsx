import { IconeCamadas, temCamadas } from './IconeCamadas';
import { Icone3D } from './icones3d/Icone3D';
import type { ChaveCena } from './icones3d/cenas3d';
import iluBio from '../assets/ilu/bio.webp';
import iluQui from '../assets/ilu/qui.webp';
import iluMat from '../assets/ilu/mat.webp';
import iluPor from '../assets/ilu/por.webp';
import iluHis from '../assets/ilu/his.webp';
import iluFil from '../assets/ilu/fil.webp';
import iluSoc from '../assets/ilu/soc.webp';
import iluIng from '../assets/ilu/ing.webp';
import iluGeo from '../assets/ilu/geo.webp';

/**
 * Mapa central do ícone 3D principal de cada matéria (o mesmo em cartões, listas e desempenho).
 * Bio, Quí, Mat e Por: ilustrações grandes do protótipo, sem sombra própria (a interface põe a sombra).
 * His, Fil, Soc e Ing: recortados das pranchas aprovadas, já com a sombra de contato do desenho
 * e em resolução menor; por isso aparecem com a classe "ilu-propria" (sem sombra extra, tamanho contido).
 * Geografia: mapa com bússola da prancha do dono (G01). Física: ícone construído (circuito, F11).
 */
export const ILU: Record<string, string> = { bio: iluBio, qui: iluQui, mat: iluMat, por: iluPor, his: iluHis, fs: iluFil, fil: iluFil, soc: iluSoc, ing: iluIng, geo: iluGeo };
export const ILU_PROPRIA = new Set(['his', 'fs', 'fil', 'soc', 'ing', 'geo']);

/** Matérias cujo ícone principal já é CONSTRUÍDO em camadas 3D (animável); prevalece sobre a imagem. */
export const CAMADAS_MATERIA: Record<string, string> = { bio: 'B00', fis: 'F11' };

export function temIlu(m: string): boolean { return !!CENA_3D[m] || !!(CAMADAS_MATERIA[m] && temCamadas(CAMADAS_MATERIA[m])) || !!ILU[m]; }

/** Matérias com ícone principal em 3D de tempo real (Three.js, animado pela função). */
export const CENA_3D: Record<string, ChaveCena> = { bio: 'celula', qui: 'atomo', mat: 'solidos', por: 'livros', fis: 'circuito', geo: 'bussola' };

/** Ícone principal: 3D em tempo real nos tamanhos grandes; construído (camadas) ou imagem como reserva e nos tamanhos pequenos. */
export function IluMateria({ m, className = '', tam }: { m: string; className?: string; tam?: number }) {
  if (CENA_3D[m] && (!tam || tam >= 72)) return <Icone3D chave={CENA_3D[m]} tam={tam} className={'ilu-3d ' + className} reserva={<IluImagem m={m} className={className} tam={tam} />} />;
  return <IluImagem m={m} className={className} tam={tam} />;
}

function IluImagem({ m, className = '', tam }: { m: string; className?: string; tam?: number }) {
  const id = CAMADAS_MATERIA[m];
  if (id && temCamadas(id)) return <IconeCamadas id={id} tam={tam} className={'ilu-camadas ' + className} />;
  if (ILU[m]) return <img src={ILU[m]} alt="" width={tam} height={tam} className={classeIlu(m, className)} />;
  return null;
}

export function classeIlu(m: string, base: string): string {
  return base + (ILU_PROPRIA.has(m) ? ' ilu-propria' : '');
}

/** Ícone principal da matéria em tamanho pequeno (listas, desempenho); sem ilustração, o ponto na cor da matéria. */
export function IconeMateria({ m, tam = 28 }: { m: string; tam?: number }) {
  return temIlu(m) ? <IluMateria m={m} tam={tam} className="ic-materia" /> : <i className="ponto" aria-hidden />;
}

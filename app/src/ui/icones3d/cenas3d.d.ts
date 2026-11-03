export type ChaveCena = 'celula' | 'atomo' | 'solidos' | 'livros' | 'circuito' | 'bussola';
export const CENAS: Record<ChaveCena, () => unknown>;
export const NOMES: Record<ChaveCena, string>;
export const FUNCAO: Record<ChaveCena, string>;
export interface Vista { el: HTMLElement; ativo: boolean }
export interface Palco {
  montar(el: HTMLElement, chave: ChaveCena): Vista | null;
  desmontar(v: Vista): void;
  tema(claro: boolean): void;
  parar(): void;
}
export function criarPalco(canvas: HTMLCanvasElement, op?: { claro?: boolean; recorte?: () => { left: number; top: number; right: number; bottom: number } }): Promise<Palco>;

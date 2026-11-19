/**
 * Contraste da cor da matéria usada como LETRA (decisão do dono, 19/11/2026; revisão do site, questao-correcao.md item 12):
 * quando a cor de texto da paleta fica abaixo de 4,5:1 sobre algum fundo onde aparece (cartão, fundo da página, fundo
 * suave da etiqueta e da seleção, nos dois temas), o site usa um tom mais escuro (claro) ou mais claro (escuro) da MESMA
 * cor, só para letra (`--t-texto`). Fundos, ícones, barras e a paleta não mudam.
 * As superfícies seguem base.css ("SUPERFÍCIES") e a mistura é a do color-mix(in srgb) do navegador.
 */
export const ALVO_LETRA = 4.5;

type RGB = [number, number, number];
export function rgb(hex: string): RGB {
  const h = hex.replace('#', '');
  const x = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return [0, 2, 4].map((i) => parseInt(x.slice(i, i + 2), 16)) as RGB;
}
export function hex([r, g, b]: RGB): string {
  return '#' + [r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('').toUpperCase();
}
/** color-mix(in srgb, a p%, b) */
export function mistura(a: string, p: number, b: string): string {
  const A = rgb(a), B = rgb(b);
  return hex(A.map((v, i) => v * p + B[i] * (1 - p)) as RGB);
}
function lum(hx: string): number {
  const [r, g, b] = rgb(hx).map((v) => { const c = v / 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function contraste(a: string, b: string): number {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

/** Fundos onde a letra na cor da matéria aparece, em cada tema (base.css; comum.tsx: --sv = s, --sv2 = s 55% + folha). */
export function fundosDaLetra(p: string, s: string, tema: 'claro' | 'escuro'): string[] {
  const papelM = tema === 'claro' ? mistura(p, 0.08, '#FDFBFA') : mistura(p, 0.10, '#0A0B0E');
  const folhaM = tema === 'claro' ? mistura(p, 0.025, '#FFFEFC') : mistura(p, 0.11, '#121417');
  const creme = tema === 'claro' ? ['#F5F0E6', '#FCFAF5'] : ['#1A1712', '#24201A'];
  const sv2 = [mistura(s, 0.55, folhaM), mistura(s, 0.55, creme[1])];
  // seleção da alternativa e botão desligado usam --s; etiqueta --sv (= s); cartão e fundo, dentro e fora da matéria
  return [s, papelM, folhaM, ...creme, ...sv2];
}

/** Menor contraste da letra sobre os fundos dados. */
export function piorContraste(letra: string, fundos: string[]): number {
  return Math.min(...fundos.map((f) => contraste(letra, f)));
}

/** O tom de letra: a própria cor quando já passa; senão, a mesma cor misturada aos poucos com preto (claro) ou branco
 *  (escuro), no menor passo que chega a 4,5:1 sobre todos os fundos. */
export function tomDeLetra(t: string, fundos: string[], tema: 'claro' | 'escuro', alvo = ALVO_LETRA): string {
  if (piorContraste(t, fundos) >= alvo) return t;
  const extremo = tema === 'claro' ? '#000000' : '#FFFFFF';
  for (let k = 1; k <= 100; k++) {
    const c = mistura(extremo, k / 100, t);
    if (piorContraste(c, fundos) >= alvo) return c;
  }
  return extremo;
}

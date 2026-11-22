/**
 * Figura de teoria no tema escuro (revisão de 21/11/2026, matérias-2 R3).
 *
 * As figuras de Biologia (app-atual/bio/img, que não se altera) trazem duas paletas no próprio <style>: a escura, como
 * padrão (texto #E7E9F5, cores vivas), e a clara, num bloco "@media (prefers-color-scheme: light)" repetido logo depois
 * sem o @media, para valer sempre. Dentro de <img> a figura não sabe do botão Dia/Noite do site e fica sempre clara:
 * texto #1E2440 sem fundo, ilegível sobre o cartão escuro.
 *
 * Aqui se monta, a partir da mesma figura, a versão com a paleta escura que ela já tem (tira só as regras da clara), e
 * a tela mostra uma ou outra pelo tema do site. O tema claro continua a figura original, sem nenhuma mudança.
 * Figuras sem as duas paletas (Mat, Quí e os ícones de Bio) devolvem null: ficam como estão.
 */

const MEDIA_CLARO = '@media (prefers-color-scheme: light){';
// o único tom de letra da paleta escura abaixo de 4,5:1 no cartão escuro de Bio (#6C7DF0: 4,47:1) sobe um pouco (5,1:1)
const AJUSTE_ESCURO = 'text[fill="#6C7DF0" i],tspan[fill="#6C7DF0" i]{fill:#7989F1}';

function decodifica(u: string): string | null {
  if (!u.startsWith('data:image/svg+xml')) return null;
  const i = u.indexOf(',');
  const cab = u.slice(0, i), dados = u.slice(i + 1);
  try {
    if (!cab.includes(';base64')) return decodeURIComponent(dados);
    const bin = atob(dados);
    const bytes = new Uint8Array(bin.length);
    for (let k = 0; k < bin.length; k++) bytes[k] = bin.charCodeAt(k);
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

/** SVG com a paleta escura (só o <style> muda), ou null se a figura não tem as duas paletas */
export function svgEscuro(svg: string): string | null {
  const m = /<style>([\s\S]*?)<\/style>/.exec(svg);
  if (!m) return null;
  const est = m[1];
  const i = est.indexOf(MEDIA_CLARO);
  if (i <= 0) return null;
  // o que vem antes do @media é a paleta escura; o @media e a cópia dele sem @media são a clara
  const escuro = est.slice(0, i);
  if (!/svg\{color:#[0-9A-F]{6}\}/i.test(escuro)) return null;
  return svg.slice(0, m.index) + `<style>${escuro}${AJUSTE_ESCURO}</style>` + svg.slice(m.index + m[0].length);
}

const cache = new Map<string, string | null>();

/** data URI da figura com a paleta escura, ou null (a figura serve aos dois temas) */
export function figuraEscura(u: string): string | null {
  if (cache.has(u)) return cache.get(u)!;
  const svg = decodifica(u);
  const esc = svg && svg.includes(MEDIA_CLARO) ? svgEscuro(svg) : null;
  const r = esc ? 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(esc) : null;
  cache.set(u, r);
  return r;
}

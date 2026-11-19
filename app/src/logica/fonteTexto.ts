/**
 * Fonte de um flashcard ou de uma frase (revisão do site de 19/11/2026, dados.md item 1): o campo pode ser um link puro
 * ("https://…"), um texto com o link no meio ("Camões, soneto 5 — https://… · https://…") ou só texto ("Livro X, 3ª ed.").
 * Nunca quebra: separa o texto dos links válidos; o nome do site sai do link só quando ele é válido.
 */
export interface LinkFonte { url: string; site: string }
export interface FonteLida { texto: string; links: LinkFonte[] }

const RE_LINK = /https?:\/\/[^\s<>"'”’)\]]*/gi;
const SEP = /^[\s—–\-:·|,;]+|[\s—–\-:·|,;]+$/g;

export function leFonte(fonte: string | undefined | null): FonteLida {
  const f = (fonte || '').trim();
  if (!f) return { texto: '', links: [] };
  const links: LinkFonte[] = [];
  let ruim = false;
  const resto = f.replace(RE_LINK, (bruto) => {
    const b = bruto.replace(/[.,;:!?]+$/, '');
    try {
      const u = new URL(b);
      if (!u.hostname) throw new Error('sem site');
      links.push({ url: u.href, site: u.hostname.replace(/^www\./, '') });
      return ' ';
    } catch { ruim = true; return bruto; }   // link quebrado: fica como texto
  });
  const texto = ruim && !links.length ? f
    : resto.replace(/\(\s*\)/g, ' ').replace(/\s*[·|]\s*(?=[·|]|$)/g, ' ').replace(/\s{2,}/g, ' ').replace(SEP, '').trim();
  return { texto, links };
}

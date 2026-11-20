/**
 * Fonte de um flashcard ou de uma frase (revisão do site de 19/11/2026, dados.md item 1): o campo pode ser um link puro
 * ("https://…"), um texto com o link no meio ("Camões, soneto 5 — https://… · https://…") ou só texto ("Livro X, 3ª ed.").
 * Nunca quebra: separa o texto dos links válidos; o nome do site sai do link só quando ele é válido.
 */
export interface LinkFonte { url: string; site: string }
export interface FonteLida { texto: string; links: LinkFonte[] }

const INICIO_LINK = /https?:\/\//gi;
const PARA_LINK = /[\s<>"'”’]/;

/** Fim do link que começa em `ini`: vai até o espaço (ou aspas) e aceita parênteses e colchetes BALANCEADOS dentro dele
 *  ("…/Book:_Inorganic_Chemistry_(Wikibooks)/…"; revisão de 20/11/2026, matérias 3). Um ")" ou "]" sem par fecha o
 *  texto em volta do link ("(veja https://x.org/a)") e não entra no link. */
export function fimDoLink(f: string, ini: number): number {
  let par = 0, col = 0, k = ini;
  for (; k < f.length; k++) {
    const ch = f[k];
    if (PARA_LINK.test(ch)) break;
    if (ch === '(') par++;
    else if (ch === ')') { if (!par) break; par--; }
    else if (ch === '[') col++;
    else if (ch === ']') { if (!col) break; col--; }
  }
  return k;
}

/** troca cada link de `f` pelo que `troca` devolver (mesmo papel do antigo `replace` com expressão regular) */
function trocaLinks(f: string, troca: (bruto: string) => string): string {
  let out = '', ult = 0;
  INICIO_LINK.lastIndex = 0;
  for (let m = INICIO_LINK.exec(f); m; m = INICIO_LINK.exec(f)) {
    if (m.index < ult) continue;
    const fim = fimDoLink(f, m.index);
    out += f.slice(ult, m.index) + troca(f.slice(m.index, fim));
    ult = fim;
    INICIO_LINK.lastIndex = fim;
  }
  return out + f.slice(ult);
}
const SEP = /^[\s—–\-:·|,;]+|[\s—–\-:·|,;]+$/g;

export function leFonte(fonte: string | undefined | null): FonteLida {
  const f = (fonte || '').trim();
  if (!f) return { texto: '', links: [] };
  const links: LinkFonte[] = [];
  let ruim = false;
  const resto = trocaLinks(f, (bruto) => {
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

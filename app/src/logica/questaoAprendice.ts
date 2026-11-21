/**
 * Questão Aprendice da revisão essencial no formato da correção (CLAUDE.md, "A correção da questão"; revisão de 19/11/2026,
 * item 20): os dados trazem as armadilhas juntas (`por_que_erram`, ex.: "tomar os 36 elétrons como Z (B); subtrair 2 em
 * vez de somar, o que dá Z = 34 (A)…"). Aqui se separa o que explica cada letra, para os blocos "Por que eu errei" e
 * "Por que as outras estão erradas"; a primeira armadilha citada é "A pegadinha". O texto dos dados não muda.
 */
export interface ArmadilhasSeparadas { porLetra: Partial<Record<string, string>>; pegadinha: string }

const frase = (s: string) => {
  const t = s.trim().replace(/^(?:armadilhas?|erros? comuns?)\s*:\s*/i, '').trim();
  if (!t) return '';
  return (t.charAt(0).toUpperCase() + t.slice(1)).replace(/[;,:\s]+$/, '') + (/[.!?]$/.test(t) ? '' : '.');
};

export function separaArmadilhas(txt: string | undefined, gabarito: string): ArmadilhasSeparadas {
  const porLetra: Partial<Record<string, string>> = {};
  const t = (txt || '').trim();
  if (!t) return { porLetra, pegadinha: '' };
  // pedaços: frases e itens separados por ";" (o ponto de número decimal ou de abreviação não corta)
  const pedacos = t.split(/;\s+|(?<=[^\dA-Z]\.)\s+(?=[A-ZÀ-Ý−\-\d])/).map((x) => x.trim()).filter(Boolean);
  let primeira = '';
  for (const p of pedacos) {
    const letras = new Set<string>();
    for (const m of p.matchAll(/\(([A-E])\)/g)) letras.add(m[1]);
    for (const m of p.matchAll(/\b(?:leva (?:à|a)|levam (?:à|a)|marca a|marcam a|na alternativa|alternativa)\s+([A-E])\b/g)) letras.add(m[1]);
    letras.delete(gabarito);
    if (!letras.size) continue;
    const f = frase(p);
    for (const l of letras) porLetra[l] = porLetra[l] ? `${porLetra[l]} ${f}` : f;
    if (!primeira) primeira = f;
  }
  return { porLetra, pegadinha: primeira && Object.keys(porLetra).length > 1 ? primeira : frase(t) };
}

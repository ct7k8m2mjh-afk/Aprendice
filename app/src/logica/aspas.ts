/**
 * Aspas curvas no texto da resolução (revisão de 19/11/2026, item 22): "…" vira “…” e '…' vira ‘…’; o apóstrofo entre
 * letras ("d'água", "don't") vira ’. Só mexe no par completo (número ímpar de aspas duplas fica como está) e nunca no
 * sinal de minuto, pé ou derivada colado a número ou a letra solta ("30'", "f'(x)", "x'").
 */
export function aspasCurvas(s: string): string {
  if (!s || !/["']/.test(s)) return s;
  let t = s;
  if ((t.match(/"/g) || []).length % 2 === 0) {
    let abre = true;
    t = t.replace(/"/g, () => { const c = abre ? '“' : '”'; abre = !abre; return c; });
  }
  // par de aspas simples: abre depois de começo, espaço ou ( e fecha antes de espaço, pontuação ou fim
  t = t.replace(/(^|[\s(\[—–])'([^'\n]*?[^\s'])'(?=$|[\s.,;:!?)\]—–])/g, '$1‘$2’');
  // apóstrofo entre letras (palavra de duas ou mais letras antes, ou "d'", "l'", "n'": "d'água")
  t = t.replace(/(?<=[A-Za-zÀ-ÿ]{2}|(?:^|[^A-Za-zÀ-ÿ])[dDlLnN])'(?=[A-Za-zÀ-ÿ])/g, '’');
  return t;
}

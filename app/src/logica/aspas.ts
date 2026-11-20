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
  t = t.replace(/(^|[\s(\[—–“"«])'([^'\n]*?[^\s'])'(?=$|[\s.,;:!?)\]—–”"»])/g, '$1‘$2’');
  // apóstrofo entre letras (palavra de duas ou mais letras antes, ou "d'", "l'", "n'": "d'água")
  t = t.replace(/(?<=[A-Za-zÀ-ÿ]{2}|(?:^|[^A-Za-zÀ-ÿ])[dDlLnN])'(?=[A-Za-zÀ-ÿ])/g, '’');
  return t;
}

/**
 * Ordinal escrito com o sinal de grau ("5° período", "1° lombriga, 2° ameba") vira o ordinal "º" (revisão de 20/11/2026,
 * N12). Só número de 1 ou 2 algarismos seguido de palavra, e nunca em texto que fala de ângulo ou temperatura.
 */
export function ordinais(s: string): string {
  if (!s || !s.includes('°') || /ângulo|angulo|graus?\b|°\s?[CFK]\b|rota[çc]|inclina|latitude|longitude|temperatura|arco|setor|paralelo|meridiano/i.test(s)) return s;
  return s.replace(/(?<![\d,.])(\d{1,2})°(?=\s+(?!(?:com|para|por|pelo|pela|em|de|do|da|acima|abaixo|entre|sobre|até|ao|aos|no|na|cada|mais|menos|que)(?![a-zà-ÿ]))[a-zà-ÿ]{3,})/g, '$1º');
}

/** texto da correção como é exibido: aspas curvas e ordinal certo (mesmo tamanho do texto dos dados) */
export const textoCorrecao = (s: string) => ordinais(aspasCurvas(s));

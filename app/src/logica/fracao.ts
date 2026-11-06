/**
 * Fração empilhada (guia tipográfico, p. 2 e 6): "A fração da conta (520 sobre 40) é montada pelo layout do site,
 * um número em cima, a barra e o outro embaixo... nem '520/40' na linha."
 *
 * Aqui só se lê o texto: o conteúdo das resoluções NÃO muda, muda a forma de exibir. `partesFracao` acha as frações
 * numéricas ou algébricas simples ("2/5", "27x/60", "√2/2", "a/b", "(2·1)/2", "2x/(x + 1)") e deixa como estão
 * datas ("05/11", "2024/2"), unidades ("km/h", "g/mol", "10 m/s"), separadores de verso (" / ") e o resto do texto.
 */

export type ParteFracao = { t: 'txt'; v: string } | { t: 'frac'; n: string; d: string; orig: string };

// operando: um grupo entre parênteses (sem parênteses dentro) ou um termo simples
// (raiz opcional, número com decimais, no máximo uma letra, expoentes)
const TERMO = String.raw`\([^()\n]{1,40}\)|√?(?:\d+(?:[.,]\d+)*)?[a-zA-Zα-ωπθ]?[²³⁴⁵⁶⁷⁸⁹¹⁰⁻]*`;
const RE = new RegExp(`(${TERMO})/(${TERMO})`, 'g');
const LETRA = /[A-Za-zÀ-ÿα-ωπθ]/;
const ANTES_PROIBIDO = /[A-Za-zÀ-ÿ0-9.,/_\\-]/; // colado a uma palavra, número, data ou link
const DEPOIS_PROIBIDO = /[A-Za-zÀ-ÿ0-9/_(]/;
// símbolos de unidade de uma letra: "m/s", "g/L" só viram fração depois de um sinal (d = m/V)
const UNIDADE = new Set(['m', 's', 'g', 'L', 'l', 'h', 'K', 'N', 'J', 'W', 'V']);

function semParenteses(x: string): string {
  return x.startsWith('(') && x.endsWith(')') ? x.slice(1, -1).trim() : x;
}

function ehFracao(texto: string, ini: number, num: string, den: string): boolean {
  if (!num || !den) return false;
  // termo vazio por dentro (só "√" ou só expoente) não conta
  const temValor = (x: string) => /[0-9a-zA-Zα-ωπθ]/.test(x);
  if (!temValor(num) || !temValor(den)) return false;
  const antes = texto.slice(0, ini);
  const fim = ini + num.length + 1 + den.length;
  const charAntes = antes.slice(-1);
  const charDepois = texto.charAt(fim);
  if (charAntes && ANTES_PROIBIDO.test(charAntes)) return false;
  if (charDepois && DEPOIS_PROIBIDO.test(charDepois)) return false;
  const nNum = /^\d+$/.test(num), nDen = /^\d+$/.test(den);
  // datas e anos: "05/11", "12/03", "2024/2", "2020/21"
  if (nNum && nDen) {
    if (/^0\d/.test(den) || /^0\d/.test(num)) return false;
    if (/^(19|20)\d\d$/.test(num)) return false;
  }
  const letraNum = !num.startsWith('(') && LETRA.test(num);
  const letraDen = !den.startsWith('(') && LETRA.test(den);
  if (letraNum || letraDen) {
    // depois de um número com espaço é unidade ("10 m/s", "3 L/h", "1,2 × 10³ J/(kg °C)")
    if (/[\d²³⁴⁵⁶⁷⁸⁹¹⁰]\s+$/.test(antes)) return false;
  }
  // só letras dos dois lados ("a/b", "m/V", "A/a", "g/L", "L/(mol·K)"): fração só depois de um sinal de conta ou no começo;
  // depois de palavra é par de genes ("o par A/a") ou unidade ("concentração (g/L)", "R em J/(mol·K)")
  const soLetras = (x: string) => LETRA.test(x) && !/\d/.test(x);
  if (soLetras(num) && soLetras(den)) {
    const tira = (x: string) => x.replace(/[²³⁴⁵⁶⁷⁸⁹¹⁰⁻]/g, '');
    const depoisDeSinal = /(^|[=+−\-×·÷≈<>→])\s*$/.test(antes);
    if (!depoisDeSinal) return false;
    // letras de alternativa ("A/B")
    if (/^[A-E]$/.test(num) && /^[A-E]$/.test(den)) return false;
    // produto de unidades: "atm·L/K", "atm · L/(mol·K)"
    if (/[A-Za-zÀ-ÿ]{2,}\s*·\s*$/.test(antes)) return false;
    // dois símbolos de unidade ("m/s²", "g/L") só depois de "=": "d = m/V"
    if (UNIDADE.has(tira(num)) && UNIDADE.has(tira(den)) && !/=\s*$/.test(antes)) return false;
  }
  return true;
}

/** Divide o texto em trechos de texto e frações empilháveis. Sem fração, devolve um trecho só. */
export function partesFracao(texto: string): ParteFracao[] {
  const out: ParteFracao[] = [];
  let ult = 0;
  RE.lastIndex = 0;
  for (let m = RE.exec(texto); m; m = RE.exec(texto)) {
    if (m[0].length === 0) { RE.lastIndex++; continue; }
    const [orig, num, den] = m;
    if (!ehFracao(texto, m.index, num, den)) {
      // tenta de novo a partir do caractere seguinte (o denominador pode ser o numerador de outra fração)
      RE.lastIndex = m.index + 1;
      continue;
    }
    if (m.index > ult) out.push({ t: 'txt', v: texto.slice(ult, m.index) });
    out.push({ t: 'frac', n: semParenteses(num), d: semParenteses(den), orig });
    ult = m.index + orig.length;
  }
  if (ult < texto.length) out.push({ t: 'txt', v: texto.slice(ult) });
  return out.length ? out : [{ t: 'txt', v: texto }];
}

/**
 * A "conta" de um passo às vezes é texto: um trecho citado da prova (Português) ou uma frase (Biologia).
 * O guia reserva a letra à mão (Caveat) para conta e fórmula; texto vai na família da interface.
 * É conta quando há sinal de matemática ou química: operador junto de número, letra de variável com "=",
 * raiz, expoente, índice, seta de reação. Começar com aspas é sempre citação.
 */
export function contaEhTexto(s: string): boolean {
  const t = s.trim();
  if (/^["“”'‘’«]/.test(t)) return true;
  const sinal = /[×÷√²³⁴⁵⁶⁷⁸⁹¹⁰⁻⁺₀₁₂₃₄₅₆₇₈₉∈≈≤≥≠ΔπΣ∑∞→⇌⇒]|\d\s*[=+−·*/^%<>]|[=+−·*/^<>]\s*\d|(?<![A-Za-zÀ-ÿ])-\s*\d|\d\s*-(?![A-Za-zÀ-ÿ])|(?<![A-Za-zÀ-ÿ])[a-zA-Z]\s*=|=\s*[a-zA-Z](?![A-Za-zÀ-ÿ])/;
  return !sinal.test(t);
}

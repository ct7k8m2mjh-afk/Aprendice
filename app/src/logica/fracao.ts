/**
 * Fração empilhada (guia tipográfico, p. 2 e 6): "A fração da conta (520 sobre 40) é montada pelo layout do site,
 * um número em cima, a barra e o outro embaixo... nem '520/40' na linha."
 *
 * Aqui só se lê o texto: o conteúdo das resoluções NÃO muda, muda a forma de exibir. `partesFracao` acha as frações
 * numéricas ou algébricas simples ("2/5", "27x/60", "√2/2", "a/b", "(2·1)/2", "2x/(x + 1)") e deixa como estão
 * datas ("05/11", "2024/2"), unidades ("km/h", "g/mol", "10 m/s"), separadores de verso (" / ") e o resto do texto.
 */

export type ParteFracao =
  | { t: 'txt'; v: string }
  /** sep: o sinal escrito entre os dois ("/", " ÷ ", " / "); pn/pd: o numerador/denominador estava entre parênteses
   *  (o layout tira os parênteses; quem desenha guarda-os escondidos, para o texto continuar o mesmo) */
  | { t: 'frac'; n: string; d: string; orig: string; sep?: string; pn?: boolean; pd?: boolean }
  /** notação de nuclídeo ("207/82 Pb"): número de massa em cima, número atômico embaixo, antes do símbolo; sem barra */
  | { t: 'nuc'; a: string; z: string; orig: string };

// símbolos na ordem do número atômico (Z = posição + 1), para reconhecer "207/82 Pb" e "90/38 Sr"
const ELEMENTOS = ('H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo '
  + 'Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn '
  + 'Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr Rf Db Sg Bh Hs Mt Ds Rg Cn Nh Fl Mc Lv Ts Og').split(' ');
const Z_DO_SIMBOLO = new Map(ELEMENTOS.map((s, i) => [s, i + 1]));

// operando: um grupo entre parênteses (sem parênteses dentro) ou um termo simples
// (raiz opcional, número com decimais, no máximo uma letra, expoentes)
// (coeficiente e raiz juntos: "6√5/5" é (6√5) ÷ 5, o numerador inteiro vai em cima; letras: uma, ou um segmento
// "AB", "Ab" (área da base), "xP" (abscissa de P))
// "Δ" antes da letra ("ΔV²", "Δt", "ΔΦ") e índice depois dela ("v₂", "T₁", "B_f", "Δε_jul") fazem parte do termo
// (a meia-vida "t½" é um termo só: "t/t½", "tempo ÷ t½"; revisão de 21/11, questão-correção 2 R4)
// número com milhar separado por espaço ("27 000/96 500", "450 000/1 000 000") e grupo com um nível de parênteses dentro
// ("((1 · 1)/2 · 1)/3", "(1 × (−1) × 18)/(1 × 2)"), com coeficiente, letra ou raiz colados antes ("k(k + 1)/2",
// "√3(√3 − √2)/(3 − 2)", "Q(0)/2") (revisão de dados de 19/11/2026, item 3)
// (dois níveis de parênteses dentro: "((x(x − 1))/2)/((3x(x − 1))/2)", "(a² × √((1 + √5)/2))/2"; revisão de 21/11, dados N1)
const GRUPO = String.raw`\((?:[^()\n]|\((?:[^()\n]|\([^()\n]*\))*\)){1,60}\)`;
const MILHAR = String.raw`\d{1,3}(?:[ \u00a0\u202f]\d{3})+(?:,\d+)?`;
// (revisão de 21/11/2026, dados N1) expoente depois do grupo ("(x + 4)²/25", "(2v)^2/2") e potência escrita com "^"
// ("20^(n−1)/27^n", "10^(−7,34)/10^(−7,44)", "1×10^-4/2"): o grupo ou a potência inteira vai em cima (ou embaixo)
const EXP_POS = String.raw`(?:[²³⁴⁵⁶⁷⁸⁹¹⁰⁻]+|\^\([^()\n]{1,30}\)|\^[−\-]?\d+(?:,\d+)?)?`;
const POTENCIA = String.raw`(?:\d+(?:,\d+)?|[A-Za-zα-ωπ])\^(?:\([^()\n]{1,30}\)|[−\-]?\d+(?:,\d+)?|[a-zA-Z](?![A-Za-z]))`;
// (passada 5 U3) a letra leva os dois apóstrofos (ou o "″"): "110²/R''" tem "R''" inteiro embaixo
// (revisão de 21/11/2026, passada 5 U2) índice depois do grupo: a razão entre duas razões, "(n/V)₂/(n/V)₁", tem o
// grupo com o índice em cima e embaixo (as razões de dentro empilham dentro dele)
const IND_GRUPO = String.raw`(?:[₀-₉ₐ-ₜ]+)?`;
// coeficiente colado ao grupo: número, raiz, função ("log2(y)"), até duas letras ("Mm(ΔT − 100)", "pq(p + q)") ou outro
// grupo ("(l√19/3)(l√17/3)/2"); letra colada à raiz ("l√19/3") vai junto
const TERMO = String.raw`(?:[Δ∆]?(?:\d+(?:,\d+)?|√\d*|ln|log[₀-₉\d]*|sen|cos|tg|[A-Za-zα-ω]{1,2}[₀-₉ₐ-ₜ]*|\([^()\n]{1,30}\))|[Δ∆])?${GRUPO}${IND_GRUPO}${EXP_POS}|${POTENCIA}|${MILHAR}|(?:\d+(?:[.,]\d+)*)?(?:[a-zA-Zℓ](?=√))?√?(?:\d+(?:[.,]\d+)*)?(?:\^[−\-]?\d+)?[Δ∆]?(?:[A-Z]{2}|[A-Z][a-z]|[xy][A-Z]|[a-zA-Zα-ωπθΦℓ][\u0302\u0304\u0305]?(?:['′]{1,2}|″)?)?(?:_[A-Za-z0-9]+|[△□]|(?<=[A-Za-z]['′])[A-Za-z](?![A-Za-zÀ-ÿ])|[₀-₉ₐ-ₜ][₀-₉ₐ-ₜ₊₋]*|(?<=[A-Za-z])½|(?<=Δ[A-Za-z])\d+|(?<=(?:^|[^A-Za-zℓ])[A-Za-zℓ])\d(?!\d|[.,]\d))?[²³⁴⁵⁶⁷⁸⁹¹⁰⁻]*`;
// (revisão de 21/11/2026, N1) função com argumento ("sen θ/g", "BC/tg 30°", "log x/log 2") e produto de variáveis
// ("nRT/V", "GMm/r²", "4π²R²/T²", "vA/vB", "FX/mX"); o produto só vale com maiúscula, letra grega, índice ou expoente e
// sem ser unidade, sigla ou genótipo (validado em `produtoValido`)
const FUNCAO = String.raw`(?:\d+(?:,\d+)?)?(?:sen|cos|tg|tan|log[₀-₉]*|ln)[²³]?\s?(?:\d+(?:,\d+)?°|\d*[a-zA-Zα-ωθℓ][₀-₉]*[²³]?|\d+(?:,\d+)?)(?![\d,A-Za-zÀ-ÿ])`;
// (com Δ dentro: "fΔn", "2MΔf", "b²kΔφ"; passada 4 S5)
const PRODUTO = String.raw`(?:\d+(?:,\d+)?)?(?:[Δ∆]?[a-zA-Zα-ωπθΦℓ](?:_[A-Za-z0-9]+|[₀-₉]+)?[²³⁴⁵⁶⁷⁸⁹¹⁰⁻]*){2,4}`;
// (revisão de 21/11/2026, passada 3 N3) numerador entre colchetes: o valor posto no lugar da variável ("2·[1]/(4·[3])"),
// o grupo ("[x(x + 1) − 2x(x − 1)]/((x − 1)(x + 1))", "4[(t + Δt)² − t²]/Δt"), a concentração ("[H⁺]²/C",
// "[NH3]²/([N2] × [H2]³)", "[CO][H2]³/([CH4][H2O])") e a variação ("Δ[NH3]/Δt"). Coeficiente colado ou com "·" antes;
// vários colchetes seguidos são um produto. Só no numerador: embaixo, "[A⁻]/[HA]" e "[C]²/[A]·[B]" não mostram onde o
// denominador termina e ficam na linha, como antes
const UM_COLCHETE = String.raw`\[[^\[\]\n]{1,30}\]${EXP_POS}`;
const COLCHETE = String.raw`(?:\d+(?:,\d+)?·?|Δ)?${UM_COLCHETE}(?:·?${UM_COLCHETE})*`;
// (revisão de 21/11/2026, passada 4 S1) denominador entre colchetes só quando o colchete agrupa uma conta (tem parênteses
// ou sinal de conta entre espaços dentro: "(√3 + 1)²/[(√3 − 1)(√3 + 1)]") e termina ali (sem outro colchete ou "·" colado
// depois); a concentração embaixo ("[HA]", "[HSO4−]", "[Cu2+]") continua na linha
const COLCHETE_DEN = String.raw`\[(?=[^\[\]\n]*(?:[()]|\s[+−×·]\s))[^\[\]\n]{3,40}\]${EXP_POS}(?![·\[])`;
// (revisão de 21/11/2026, passada 4 S4) ângulo em cima ("360°/24 h", "180°/n", "360°/6", "90°/360°"): embaixo, número
// (com o grau ou com a unidade de tempo, só depois de ângulo) ou variável; "30°/h", velocidade angular, é unidade e fica na linha
const GRAU = String.raw`\d+(?:,\d+)?°`;
const GRAU_DEN_SO = String.raw`\d+(?:,\d+)?(?:°|\s(?:h|s|min)(?![A-Za-zÀ-ÿ\d]))`;
const GRAU_DEN = String.raw`(?<=°\/)${GRAU_DEN_SO}`;
const RE = new RegExp(`(${GRAU}|${FUNCAO}|${PRODUTO}|${COLCHETE}|${TERMO})/(${GRAU_DEN}|${COLCHETE_DEN}|${FUNCAO}|${PRODUTO}|${TERMO})`, 'g');
const RE_COLCHETE = new RegExp(`^(?:${COLCHETE}|${COLCHETE_DEN}|${GRAU}|${GRAU_DEN_SO})$`);
const RE_TERMO = new RegExp(`^(?:${TERMO})$`);
const RE_FUNCAO = new RegExp(`^(?:${FUNCAO})$`);
// nomes de unidade com mais de uma letra ("kJ", "mL", "mmHg"): nunca são produto de variáveis
const UNIDADES_NOME = new Set(('mmol kmol mol mA μA µA mV kV MW GW MJ GJ kN MPa GPa GHz MHz kHz hm ha mg kg μg µg mL dL mm cm dm km nm '
  + 'min kJ kcal cal atm kPa Pa kΩ kWh Wh kW Hz eV mmHg kgf ppm erg rad cd lm lx Gcal mAh Ah').split(' '));
function produtoValido(x: string, outro = ''): boolean {
  if (RE_TERMO.test(x) || RE_FUNCAO.test(x) || RE_COLCHETE.test(x)) return true;
  const letras = x.replace(/^\d+(?:,\d+)?/, '').replace(/_[A-Za-z0-9]+|[₀-₉²³⁴⁵⁶⁷⁸⁹¹⁰]/g, '');
  if (/^(?:sen|cos|tg|tan|log|ln)/.test(letras)) return false;
  if (/^[A-Z]{3,}$/.test(letras)) return false; // sigla ("VIP/VOP", "HIV/AIDS")
  if (/^[A-Z][a-zà-ÿ]{2,}$/.test(letras)) return false; // palavra ("Nilo/Mar", "1000/Sec")
  // fórmula química ("AgCl/Ag", "H₂O/CO₂", "HAc"): só símbolos de elemento, dois ou mais
  const simb = x.replace(/^\d+(?:,\d+)?/, '').replace(/[₀-₉\d²³⁴⁵⁶⁷⁸⁹¹⁰⁻⁺]/g, '').match(/[A-Z][a-z]?|./g) || [];
  // (índice ₀ ou ₁ só existe em variável: "P₁V₁" é produto; passada 4 S2)
  // (sobre ou sob uma variável que não é espécie, "P₂V₂/T₂", também é produto)
  if (simb.length >= 2 && simb.every((e) => Z_DO_SIMBOLO.has(e)) && !/[₀₁]/.test(x)
    && !(/[₀-₉]/.test(x) && /^[A-Za-zα-ω][₀-₉]+$/.test(outro) && !especie(outro))) return false;
  return /[A-Zα-ωπθΦΔ∆₀-₉²³⁴⁵⁶⁷⁸⁹¹⁰_]/.test(x.replace(/^\d+(?:,\d+)?/, ''));
}
/** produto de variáveis sobre um grupo de variáveis coladas ("2mg/(qB)", "mg/(qB)", "m³g²/(q²B²)"), só em Matemática,
 *  Física e Química; cada lado tem duas a quatro letras (com coeficiente em cima, expoente e índice) e o grupo de baixo
 *  não é só de unidades ("(kg)", "(min)", "(ms)") (revisão de 21/11/2026, passada 5 U1) */
function prodSobreGrupo(num: string, den: string, materia?: string): boolean {
  if (!materia || !/^(?:mat|fis|qui)$/.test(materia)) return false;
  const fator = String.raw`[a-zA-Zα-ωπθℓ][₀-₉²³⁴⁵⁶⁷⁸⁹¹⁰]*`;
  if (!new RegExp(`^(?:\\d+(?:,\\d+)?)?(?:${fator}){2,4}$`).test(num)) return false;
  const g = new RegExp(`^\\(((?:${fator}){2,4})\\)$`).exec(den);
  if (!g) return false;
  const letras = g[1].replace(/[₀-₉²³⁴⁵⁶⁷⁸⁹¹⁰]/g, '');
  return !UNIDADES_NOME.has(letras) && ![...letras].every((c) => UNIDADE.has(c));
}
/** par de unidades com um nome de mais de uma letra ("kJ/mol", "mL/min", "kg/m³", "Ω·mm²/m"); "mA/mB" e "dL/dS"
 *  são variáveis com índice */
function parDeUnidades(num: string, den: string): boolean {
  // (só o expoente do fim: "m³g²" é produto de variáveis, não "mg"; passada 4 S5)
  const l = (x: string) => x.replace(/[²³⁴⁵⁶⁷⁸⁹¹⁰⁻]+$/, '');
  const unid = (x: string) => UNIDADES_NOME.has(l(x)) || UNIDADE.has(l(x)) || /^(?:mol|s|g|m|L|h|t|K|J|N|W|V|A|C)$/.test(l(x));
  // nome de unidade embaixo é taxa ("R$ 0,30/kWh"); em cima, com unidade, número ou grupo embaixo ("mL/(min · kg)")
  return UNIDADES_NOME.has(l(den)) || (UNIDADES_NOME.has(l(num)) && (unid(den) || /^[\d(]/.test(den)))
    || (/^\(/.test(num) && UNIDADES_NOME.has(l(den.replace(/^\(|\)$/g, ''))));
}
/** Espécie química: só símbolos de elemento, com coeficiente, índice e carga ("O2", "OH⁻", "Cl⁻", "H₂O", "NH4+"); com
 *  `genericos`, também as letras de fórmula genérica ("HA", "A⁻", "BH⁺", "R–X") (revisão de 21/11/2026,
 *  questão-correção 2 R3) */
function especie(x: string, genericos = false): boolean {
  const t = x.replace(/^\d+/, '').replace(/[₀-₉\d²³⁴⁵⁶⁷⁸⁹¹⁰⁺⁻+−]/g, '');
  const simb = t.match(/[A-Z][a-z]?/g) || [];
  return !!t && simb.join('') === t && simb.every((e) => Z_DO_SIMBOLO.has(e) || (genericos && /^[ABRX]$/.test(e)));
}
const temCarga = (x: string) => /[⁺⁻]/.test(x) || /[A-Za-z₀-₉\d][+−]$/.test(x);
// rótulo de configuração ("(R)/(S)", "E/Z", "cis/trans"): par de nomes, não fração; entre parênteses, também "(D)/(L)"
const ROTULO_PAR = /^\((?:R|S|E|Z|D|L)\)\/\((?:R|S|E|Z|D|L)\)$|^(?:R\/S|S\/R|E\/Z|Z\/E|cis\/trans|trans\/cis)$/;
const LETRA = /[A-Za-zÀ-ÿα-ωπθℓ]/;
// (letras acentuadas sim; "×" e "÷", que caem no mesmo bloco, não: "1×10^-4/2" é conta; revisão de 21/11, dados N1)
// (Δ colado: o termo começa nele, "ΔV/V₀", "∆T/2"; passada 4 S5)
const ANTES_PROIBIDO = /[A-Za-zÀ-ÖØ-öø-ÿ0-9.,/_\\Δ∆-]/; // colado a uma palavra, número, data ou link
// (índice colado depois: o denominador continua, "1/aₖ"; passada 4 S2)
const DEPOIS_PROIBIDO = /[A-Za-zÀ-ÖØ-öø-ÿ0-9/_(ₐ-ₜ₀-₉]/;
// símbolos de unidade de uma letra: "m/s", "g/L" só viram fração depois de um sinal (d = m/V)
const UNIDADE = new Set(['m', 's', 'g', 'L', 'l', 'h', 'K', 'N', 'J', 'W', 'V']);

function semParenteses(x: string): string {
  if (!(x.startsWith('(') && x.endsWith(')'))) return x;
  // só quando o par de fora é um grupo só: "(a + b)" sim; "(a + b)(c + d)" não
  let p = 0;
  for (let i = 0; i < x.length - 1; i++) { if (x[i] === '(') p++; else if (x[i] === ')') { p--; if (p === 0) return x; } }
  return x.slice(1, -1).trim();
}

/*
 * Barra que não é fração (revisão de 21/11/2026, dados R1): ano/ano, lei com número e ano, data, linhas do texto, par de
 * siglas, itens de chave e pressão arterial. Dentro de uma conta (sinal logo antes ou logo depois: "= 1013/2026 − 1/2026",
 * "62/63 ≈ 0,98") continua fração. Nas matérias de texto (Português, História, Geografia, Filosofia e Sociologia, Inglês)
 * a regra é mais estrita: número/número fora de conta só empilha como fração própria ("cerca de 1/3 dos presos").
 */
const NUMERO_INT = /^\d{1,3}(?:[.   ]\d{3})+$|^\d+$/;
const ANO = /^(1[0-9]|20)\d\d$/;
// nome de norma, ato ou documento antes do número, também numa lista ("PL 2.338/23", "Lei Federal nº 9 605/98",
// "Edital 90/23-CPV", "LC 14/1973 (oito RMs) e 20/1974", "Resoluções Condel/Sudene 150/2021, 155/2022 e 176/2024")
const NORMA_ANTES = new RegExp(String.raw`(?:^|[^A-Za-zÀ-ÿ])(?:leis?|pl|plp|pls|pec|lc|rdc|emendas?|decretos?|decreto-lei|decreto legislativo|n[º°o]\.?|n\.|resolu[çc](?:ão|ões)|portarias?|mp|medida provisória|processos?|adi|adpf|ec|editais|edital|comunicados?|vetos?|nota técnica|circular técnica|instrução normativa|conama|súmula|acórdão|parecer)(?:\s+(?:federal|estadual|municipal|complementar(?:es)?|ordinária|[A-Z][A-Za-z]*\/[A-Z][A-Za-z]*))*\s*(?:n[º°o]\.?\s*|n\.\s*)?(?:\d[\d.   ]*(?:\/\d{2,4})?(?:\s*\([^()]{1,40}\))?\s*(?:,|e|a)\s+)*$`, 'i');
// siglas das unidades da federação: "RJ/ES" é par de estados
const UF = new Set('AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO'.split(' '));
// data com o dia maior que 12 ou com zero na frente: com certeza é data ("31/5", "13/6", "10/04")
const DATA_CERTA = /^(?:(?:1[3-9]|2\d|3[01])\/(?:[1-9]|1[0-2])|\d{1,2}\/0\d|0\d\/\d{1,2})$/;
/** Matérias de texto: a barra entre números fora de conta quase nunca é fração. */
const MATERIAS_TEXTO = new Set(['por', 'his', 'geo', 'fs', 'ing']);
function naoEhFracao(antes: string, depois: string, num: string, den: string, materia?: string): boolean {
  const txt = !!materia && MATERIAS_TEXTO.has(materia);
  const sinalAntes = /[=+−×·÷≈<>≤≥]\s*\(?\s*$/.test(antes) || /(?:^|[\s=(])-\s*$/.test(antes) || /[A-Za-z]\($/.test(antes);
  const sinalDepois = /^\s*\)?\s*[=≈<>≤≥+−×·÷]/.test(depois);
  const conta = sinalAntes || sinalDepois;
  const nNum = NUMERO_INT.test(num), nDen = NUMERO_INT.test(den);
  // pedaço de um número com milhar separado por espaço ("Nº 9 605/98" depois de recusado o número inteiro)
  if (nNum && /^\d{3}$/.test(num) && /\d[   ]$/.test(antes)) return true;
  if (nNum && nDen) {
    const a = +num.replace(/\D/g, ''), b = +den.replace(/\D/g, '');
    // período entre dois anos seguidos ("1884/1885", "safra 2009/2010", "≈1907/1909"); "1012/1013" e "ln(1001/1002)" de
    // Matemática continuam fração; nas matérias de texto, qualquer par de anos ("1054/1378")
    if (ANO.test(num) && ANO.test(den) && b > a && !/^\s*[=≈]/.test(depois)
      && (txt ? !conta || b - a <= 10 : a >= 1500 && b - a <= 10 && (!conta || /≈\s*$/.test(antes)))) return true;
    // lei, projeto, edital ou comunicado com o ano embaixo, com dois ou quatro algarismos ("PL 404/17", "LC 14/1973")
    if ((/^\d\d$/.test(den) || ANO.test(den)) && NORMA_ANTES.test(antes)) return true;
    // pressão arterial ("120/80 mmHg")
    if (/^\s?(?:mmHg|cmHg)(?![A-Za-z])/.test(depois)) return true;
    // linhas, versos ou páginas do texto ("linhas 16/17")
    if (/(?:^|[^A-Za-zÀ-ÿ])(?:linhas?|versos?|estrofes?|páginas?|pp?\.)\s*$/i.test(antes)) return true;
    if (conta) return false;
    // mosaico de cariótipos ("a mistura 46/47"): número de cromossomos, não fração
    if (a >= 44 && a <= 48 && b === a + 1 && /\b(?:mistura|mosaico|cariótipos?|cromossomos)\s+$/i.test(antes)) return true;
    // "24/7" (o dia inteiro) e "50/50" (metade e metade) depois de palavra
    if (((a === 24 && b === 7) || (a === 50 && b === 50)) && /[A-Za-zÀ-ÿ]\s+$/.test(antes)) return true;
    const dm = `${num}/${den}`;
    const data = a >= 1 && a <= 31 && b >= 1 && b <= 12;
    // "de 3/1 a 15/4", "De 31/5 a 7/6", "de 19/3 a 6/4": intervalo entre duas datas, uma delas certa
    if (data) {
      const ate = /^\s+(?:a|até)\s+(\d{1,2}\/\d{1,2})(?![\d/])/.exec(depois);
      if (ate && /(?:^|[^A-Za-zÀ-ÿ])de\s+$/i.test(antes) && (DATA_CERTA.test(dm) || DATA_CERTA.test(ate[1]))) return true;
      const de = /(?:^|[^A-Za-zÀ-ÿ])de\s+(\d{1,2}\/\d{1,2})\s+(?:a|até)\s+$/i.exec(antes);
      if (de && (DATA_CERTA.test(dm) || DATA_CERTA.test(de[1]))) return true;
    }
    if (!txt) return false;
    // nas matérias de texto, fora de conta: número/ano ("125/2007", "Veto 20/2025") e número igual em cima e embaixo
    // ("Redação 50/50", "10/10") ficam na linha; "dividir 40 pelo diâmetro, 40/20" continua fração
    if (/^(1[5-9]|20)\d\d$/.test(den) || a === b) return true;
    if (data) {
      // data entre parênteses ou antes de um nome ("(10/6)", "(13/3)", "13/6 MetLife (Nova York) → 19/6 Lincoln")
      if ((DATA_CERTA.test(dm) || a > b) && ((/\($/.test(antes) && /^\)/.test(depois)) || /^\s+[A-Z][A-Za-zÀ-ÿ]/.test(depois))) return true;
      // data depois de "em", "dia", "até", "desde" ("em 3/9", "em 3/10 e junta"); "em 3/4 dos casos" é fração
      if (/(?:^|[^A-Za-zÀ-ÿ])(?:em|dia|dias|até|desde|após)\s+$/i.test(antes) && !/^\s*(?:d[oa]s?|de)\b/.test(depois)) return true;
      // a data vizinha puxa esta ("31/3 e 1/4", "13/6 → 19/6", "levante em 3/10 e junta até 3/11/1930")
      const viz = /(\d{1,2}\/\d{1,2})(\/\d{2,4})?\s*(?:a|e|até|→|–)\s+$/.exec(antes) || /^\s*(?:a|e|até|→|–)\s+(\d{1,2}\/\d{1,2})(\/\d{2,4})?(?![\d/])/.exec(depois);
      if (viz && (DATA_CERTA.test(viz[1]) || viz[2])) return true;
    }
    return false;
  }
  // pronomes "o/a", "os/as"
  if ((num === 'o' && den === 'a') || (num === 'os' && den === 'as')) return true;
  // hormônios da tireoide ("TSH → T3/T4"), itens de chave ("1a/1b", "3a/3b") e alótropos ("O2/O3")
  if (/^(?:T3\/T4|O2\/O3)$/.test(`${num}/${den}`)) return true;
  if (/^(\d+)[a-z]$/.test(num) && /^(\d+)[a-z]$/.test(den) && num.slice(0, -1) === den.slice(0, -1) && num !== den) return true;
  // sigla com o ano embaixo ("CF/1988", "PD/1923")
  if (/^[A-Z]{1,6}$/.test(num) && /^(1[5-9]|20)\d\d$/.test(den) && !conta) return true;
  if (!txt) return false;
  // letras depois de palavra com "+" ("vogal + r/s", "vogal + m/n"): regra de grafia, não conta
  if (/^[a-z]$/.test(num) && /^[a-z]$/.test(den) && /(?:^|\s)[A-Za-zÀ-ÿ]{4,}\s*\+\s*$/.test(antes)) return true;
  // "V/F" (verdadeiro ou falso)
  if (num === 'V' && den === 'F' && !conta) return true;
  // par de estados ("RJ/ES = carvão") e de siglas no começo, antes de uma palavra ("AC/DC é banda")
  if (UF.has(num) && UF.has(den)) return true;
  if (!antes.trim() && /^[A-Z]{2,}$/.test(num) && /^[A-Z]{2,}$/.test(den) && /^\s+[a-zà-ÿ]/.test(depois)) return true;
  return false;
}

function ehFracao(texto: string, ini: number, num: string, den: string, materia?: string): boolean {
  if (!num || !den) return false;
  // termo vazio por dentro (só "√" ou só expoente) não conta; o sinal entre parênteses do quadro de sinais conta
  // ("(x − 6)/(+) ≥ 0", "(+)/(−) < 0")
  // (ângulo com acento, "(Â + Ĉ)/2", também tem valor)
  const temValor = (x: string) => /[0-9a-zA-Zα-ωπθΦℓÀ-ÖØ-öø-ÿĀ-ſ]/.test(x) || /^\([+−-]\)$/.test(x);
  if (!temValor(num) || !temValor(den)) return false;
  // denominador zero fora de conta ("4/0 e 5/0" ligações e pares, "+1/0" cargas) e sinais de interação ou de rotação
  // ("(+)/(−)") fora do quadro de sinais não empilham; "f(3) = 0/0" continua conta (revisão de 21/11/2026,
  // questão-correção 2 R6)
  // (o "+" colado ao número é o sinal dele: "+1/0"; "0/0", a indeterminação da conta, continua empilhada)
  // (só número ou sinal em cima: letra sobre zero é divisão de verdade, "a luz teria velocidade c/0"; passada 4 S3)
  // (o conjunto "{x ∈ R/0 < x < 1}" da prova é "tal que", não divisão)
  if (/^\(?0\)?$/.test(den) && LETRA.test(num) && /∈\s*$/.test(texto.slice(0, ini))) return false;
  if (/^\(?0\)?$/.test(den) && num !== '0' && !LETRA.test(num) && !/(?:[=≈×·÷]|[+−]\s)\s*$/.test(texto.slice(0, ini)) && !/^\s*[=≈+−×·÷]/.test(texto.slice(ini + num.length + 1 + den.length))) return false;
  if (/^\([+−-]\)$/.test(num) && /^\([+−-]\)$/.test(den) && !/^\s*[<>≤≥=]/.test(texto.slice(ini + num.length + 1 + den.length))) return false;
  // (revisão de 21/11/2026, passada 5 U1) em Matemática, Física e Química, produto de variáveis em minúsculas, com
  // coeficiente, sobre um grupo de variáveis coladas ("2mg/(qB)", "mg/(qB)"): é conta, mesmo que "mg" seja nome de
  // unidade; o grupo só de unidades ("mg/(kg)", "mL/(min)") continua unidade
  const prodGrupo = prodSobreGrupo(num, den, materia);
  if (!prodGrupo && (!produtoValido(num, den) || !produtoValido(den, num) || parDeUnidades(num, den))) return false;
  // ângulo sobre unidade de tempo sozinha ("30°/h") é velocidade angular
  if (/°$/.test(num) && /^(?:h|s|min)$/.test(den)) return false;
  // genótipo com as mesmas letras em cima e embaixo ("Ab/aB", "AB/ab", "RS/rs")
  if (/^[A-Za-z]{2,4}$/.test(num) && num.length === den.length && num !== den && num.toLowerCase() === den.toLowerCase()) return false;
  // (revisão de 21/11/2026, questão-correção 2 R3) barra entre espécies químicas: par redox ("O2/OH⁻", "Cu²⁺/Cu") e
  // ligação escrita colada ("C=O/P=O": o "O" é da dupla de antes, o "P" da de depois); rótulos "(R)/(S)" e "E/Z"
  if (especie(num) && especie(den) && (temCarga(num) || temCarga(den))) return false;
  if ((/[A-Z)][=≡–]$/.test(texto.slice(0, ini)) && especie(num)) || (/^[=≡–][A-Z(]/.test(texto.slice(ini + num.length + 1 + den.length)) && especie(den))) return false;
  // (dois pares de rótulos comparados, "R/S × E/Z": o "×" é "contra", não conta)
  if (ROTULO_PAR.test(`${num}/${den}`) && (num.startsWith('(') || /(?:R\/S|S\/R|E\/Z|Z\/E|cis\/trans)\s*×\s*$/.test(texto.slice(0, ini)) || (!/[=≈+−\-×·÷(]\s*$/.test(texto.slice(0, ini)) && !/^\s*[=≈]/.test(texto.slice(ini + num.length + 1 + den.length))))) return false;
  const antes = texto.slice(0, ini);
  const fim = ini + num.length + 1 + den.length;
  const charAntes = antes.slice(-1);
  const charDepois = texto.charAt(fim);
  // "-t²/4" (sinal de menos com hífen) pode; hífen colado a palavra ou número não
  if (charAntes && ANTES_PROIBIDO.test(charAntes) && !(charAntes === '-' && /(^|[\s=(])-$/.test(antes))) return false;
  // colado a um índice: é pedaço de um produto ("P₁V₁/T₁" depois de recusado o produto inteiro; passada 4 S2)
  if (/[₀-₉ₐ-ₜ]$/.test(antes)) return false;
  // apóstrofo com índice depois: o denominador continua ("pₓ/p'ₓ")
  if (/^['′][₀-₉ₐ-ₜ]/.test(texto.slice(fim))) return false;
  // apóstrofo que sobra depois do denominador com apóstrofo ("R'''"): a letra não cabe inteira embaixo (passada 5 U3)
  if (/['′]$/.test(den) && /^['′″]/.test(texto.slice(fim))) return false;
  if (charDepois && DEPOIS_PROIBIDO.test(charDepois)) return false;
  // código com hífen e número ou sigla depois ("F/A-18", nome de avião; "81/2025-CEV", "89/23-CPV")
  if (charDepois === '-' && /^-[\dA-Z]/.test(texto.slice(fim))) return false;
  if (naoEhFracao(antes, texto.slice(fim), num, den, materia)) return false;
  // tensão de rede trifásica ("220/127 V", "380/220 V") e par de valores com unidade elétrica depois
  if (/^\d+$/.test(num) && /^\d+$/.test(den) && /^\s?k?V(?![A-Za-zÀ-ÿ])/.test(texto.slice(fim))) return false;
  // "0,5 mol de H2/2": a fórmula depois de "de" não é o numerador (a conta é da quantidade inteira)
  if (/\bde\s$/.test(antes) && /^[A-Z]/.test(num) && !/[₀₁]/.test(num)) return false;
  const nNum = /^\d+$/.test(num), nDen = /^\d+$/.test(den);
  // datas e anos: "05/11", "12/03", "2024/2", "2020/21"
  if (nNum && nDen) {
    if (/^0\d/.test(den) || /^0\d/.test(num)) return false;
    // ano com o semestre ou o ano seguinte embaixo ("2024/2", "2020/21"); "2000/500" e "2048/128" são conta
    // ("(2027/1, questão 15": o parêntese seguido de vírgula não é de conta)
    if (/^(19|20)\d\d$/.test(num) && den.length <= 2 && !(/[=+−×·(]\s*$/.test(antes) && !/^,/.test(texto.slice(fim))) && !/^\s*[=≈]/.test(texto.slice(fim))) return false;
  }
  const letraNum = !num.startsWith('(') && LETRA.test(num);
  const letraDen = !den.startsWith('(') && LETRA.test(den);
  if (letraNum || letraDen) {
    // depois de um número com espaço é unidade ("10 m/s", "3 L/h", "1,2 × 10³ J/(kg °C)")
    // ("V0 sen θ/g": o algarismo colado à letra é índice, não número)
    if (/(?:^|[^A-Za-zα-ωÀ-ÿ\d_.,])\d+(?:[.,]\d+)*[²³⁴⁵⁶⁷⁸⁹¹⁰⁻⁺]*\s+$/.test(antes)) return false;
  }
  // só letras dos dois lados ("a/b", "m/V", "A/a", "g/L", "L/(mol·K)"): fração só depois de um sinal de conta ou no começo;
  // depois de palavra é par de genes ("o par A/a") ou unidade ("concentração (g/L)", "R em J/(mol·K)")
  // dois grupos entre parênteses ("(m + n)/(m × n)") é fração algébrica
  if (num.startsWith('(') && den.startsWith('(')) return true;
  const soLetras = (x: string) => LETRA.test(x) && !/\d/.test(x);
  if (soLetras(num) && soLetras(den)) {
    const tira = (x: string) => x.replace(/[²³⁴⁵⁶⁷⁸⁹¹⁰⁻]/g, '');
    // depois de sinal, no começo, como argumento de função ("f(c/b)"), depois de "razão" ou antes de "=" ("a/g = 10/15")
    const depoisDeSinal = /(^|[=≠+−\-×·÷≈<>≤≥∝→√]\s*[({\[]?)\s*$/.test(antes) || /(^|[^A-Za-zÀ-ÿ])[a-zA-Z]\($/.test(antes)
      || /\braz(ão|ões)\s+$/i.test(antes) || /^\s*[=≈]/.test(texto.slice(fim))
      // a razão com índice que é numerador ou denominador de outra ("(n/V)₂" de "(n/V)₂/(n/V)₁"; passada 5 U2)
      || (antes === '(' && /^\)[₀-₉ₐ-ₜ]+$/.test(texto.slice(fim)))
      // produto escrito com espaço, com uma variável logo depois de um sinal ("N = m v²/R", "t = 2V0 sen θ/g")
      || /(?:^|[=+−×·→(]\s*)\d*(?![aeoAEOé]\s)[A-Za-zα-ω][0-9₀-₉]?[²³]?\s+$/.test(antes);
    // (revisão de 21/11/2026, passada 4 S2) variável com índice ou letra grega num dos lados ("k₀Q/ℓ²", "v₀/g", "λ/T") é
    // conta também no meio da frase: unidade e par de genes não têm índice nem letra grega
    // (colado a índice, expoente ou letra grega é pedaço de outro termo: "H₂O/CO₂", "ΔV/V₀", "1/aₖ"; par de espécies,
    // "Li/I₂", e o par de ligações "σ/π" não são conta; índice ₀ e ₁ só existe em variável)
    const forte = (x: string) => /[₀-₉_]|[α-λν-ωπθΦℓ]/.test(x);
    const ehForte = (forte(num) || forte(den)) && !/[₀-₉ₐ-ₜ⁰¹²³⁴-⁹⁺⁻α-ωΑ-Ω∆]$/.test(antes) && !/^[ₐ-ₜ₀-₉₊₋]/.test(texto.slice(fim))
      && !/^_/.test(num) && !(especie(num) && especie(den) && !/[₀₁]/.test(num + den)) && !/^(?:σ\/π|π\/σ)$/.test(`${num}/${den}`);
    // (passada 4 S5) em Matemática, Física e Química, variável sobre variável também no texto corrido ("fica só m/q",
    // "AB/(A + B) tem unidade"): uma letra (ou segmento) em cima e, embaixo, uma letra ou um grupo com sinal de conta;
    // par de unidades ("g/L", "N/C") e o mesmo nome em maiúscula e minúscula ("A/a") continuam na linha
    const simbU = (x: string) => UNIDADE.has(tira(x)) || UNIDADES_NOME.has(tira(x)) || /^(?:C|A|T|Ω|Pa|Wb|H|F|S|Hz|kg|mol)$/.test(tira(x));
    // (não entram: rótulo de concentração "% (m/v)", "m/z", unidade ("MB/s", "KJ/g", "'m/s'"), plural "a/s", espécies e
    // eletrodos ("O/H", "OH/NH", "M/H", "pilha X/Y"), casa de tabela "G/H" e pedaço de outro termo, "ΔH/R", "U²T/R")
    const varSo = (x: string) => /^(?:[a-zA-Zα-ωπθℓ]|[A-Z]{2})′?[²³]?$/.test(x);
    const corrido = !!materia && /^(?:mat|fis|qui)$/.test(materia) && varSo(num)
      && (varSo(den) || /^\([^()]*[+−][^()]*\)$/.test(den))
      && !(simbU(num) && simbU(den)) && num.toLowerCase() !== den.toLowerCase()
      && !(/^[A-E]$/.test(num) && /^[A-E]$/.test(den)) && !/(?:^|[^A-Za-zÀ-ÿ])(?:par|pares|alelos?|genótipos?|pilhas?|eletrodos?|semicélulas?|células?|canto|colunas?|casas?)\s+$/i.test(antes)
      && !/^(?:m\/[vmz]|v\/v|p\/[vp]|[aoe]\/s|σ\/π|π\/σ)$/.test(`${num}/${den}`) && !/^(?:s|h|min)$/.test(den)
      && !(simbU(den) && /^[A-Z]{2}$/.test(num)) && !(materia === 'qui' && especie(num, true) && especie(den, true))
      && !(materia === 'qui' && (num === 'H' || den === 'H')) && !ROTULO_PAR.test(`${num}/${den}`)
      && !/[α-ωΑ-ΩΔ∆²³⁴-⁹¹⁰'%]$/.test(antes) && !/^['′]/.test(texto.slice(fim));
    if (!depoisDeSinal && !ehForte && !corrido && !prodGrupo) return false;
    // no começo do texto, só letra de variável ou segmento ("a/b = c/d", "AB/CD"); "Wh/L (watt-hora...)" é unidade
    // e "Mg/Fe" é par de metais
    const simples = (x: string) => /^(?:[a-zα-ωπθℓ]|[A-Z]{1,2})$/.test(tira(x));
    // (antes de uma comparação ou seta também é conta: "FX/mX < FY/mY", "ΔV/Δt → litros")
    if (!antes.trim() && !(simples(num) && simples(den)) && !ehForte && !corrido && !prodGrupo && !/^\s*[=≈<>≤≥→]/.test(texto.slice(fim))) return false;
    // letras de alternativa ("A/B"); antes ou depois de "=" é razão ("B/A = 2", "V = E/B")
    if (/^[A-E]$/.test(num) && /^[A-E]$/.test(den) && !/^\s*[=≈]/.test(texto.slice(fim)) && !/[=≈]\s*$/.test(antes)) return false;
    // produto de unidades: "atm·L/K", "atm · L/(mol·K)"
    // (só quando o fator antes do "·" é nome de unidade: "fA·RA/RB" é produto de variáveis)
    // par de unidades igual ao nome de uma unidade ("J/C = volt", "C/s = ampère"): é unidade, não conta (revisão de 21/11/2026,
    // questão-correção 2 R7)
    if (simbU(num) && simbU(den) && /^\s*=\s*(?:volts?|ampères?|watts?|joules?|ohms?|newtons?|pascals?|coulombs?|teslas?|webers?|henrys?|farads?|hertz|siemens|kelvins?|metros?|segundos?|quilogramas?|gramas?|litros?|mols?)(?![A-Za-zÀ-ÿ])/i.test(texto.slice(fim))) return false;
    const fatorAntes = /([A-Za-zÀ-ÿ]{2,})\s*[·×]\s*$/.exec(antes);
    if (fatorAntes && !ehForte && (UNIDADES_NOME.has(fatorAntes[1]) || !/[A-Z]/.test(fatorAntes[1]))) return false;
    // dois símbolos de unidade ("m/s²", "g/L") só depois de "=" ("d = m/V") ou depois de "·"/"×" com uma variável ou um
    // número antes ("4π² · L/g"; revisão de 21/11/2026, N1); "10 N · m/s" continua unidade
    const fatorDeConta = /(?:^|[\s=(+−\-→≈])(?:[\d,.]*\d[²³⁴⁵⁶⁷⁸⁹¹⁰]*|\d*(?:[a-zα-ωπθℓ]|[A-Z](?=[²³⁴⁵⁶⁷⁸⁹¹⁰]))[²³⁴⁵⁶⁷⁸⁹¹⁰]*(?:\d*[a-zα-ωπθℓ][²³⁴⁵⁶⁷⁸⁹¹⁰]*)*|\d*[A-Z])\s*[·×]\s*$/.exec(antes);
    // o fator antes do sinal é unidade quando vem depois de número ("10 N · m/s") ou quando é ele mesmo um símbolo de
    // unidade ("a unidade fica C · s/m", "(m × m/m)", "N · m/m³": produto de unidades)
    const unidadeAntes = fatorDeConta && (/\d\s+[A-Za-zµμΩ]{1,3}[²³]?\s*[·×]\s*$/.test(antes)
      || /^\s*(?:[msgLhKNJWVCTAΩ][²³]?)\s*[·×]\s*$/.test(fatorDeConta[0].replace(/^[\s=(+−\-→≈]/, '')));
    if (UNIDADE.has(tira(num)) && UNIDADE.has(tira(den)) && !/(=\s*|√\s*\()$/.test(antes) && !(fatorDeConta && !unidadeAntes)) return false;
  }
  return true;
}

/** "207/82 Pb": massa/número atômico seguidos do símbolo do elemento com esse Z. Devolve o trecho "207/82 " ou null. */
function nuclideo(texto: string, ini: number, num: string, den: string): string | null {
  if (!/^\d{1,3}$/.test(num) || !/^\d{1,3}$/.test(den) || +num < +den) return null;
  const antes = texto.charAt(ini - 1);
  if (antes && /[A-Za-zÀ-ÿ0-9.,/]/.test(antes)) return null;
  const fim = ini + num.length + 1 + den.length;
  const m = /^\s?([A-Z][a-z]?)(?![A-Za-zÀ-ÿ])/.exec(texto.slice(fim));
  if (!m || Z_DO_SIMBOLO.get(m[1]) !== +den) return null;
  return texto.slice(ini, fim) + (m[0].startsWith(' ') ? ' ' : '');
}

/** Divide o texto em trechos de texto e frações empilháveis. Sem fração, devolve um trecho só.
 *  1ª passada: divisão com "÷" ou com "/" entre espaços (as de fora, que podem ter "a/b" dentro do numerador ou do
 *  denominador: "(7/2) ÷ (37/10)", "800π ÷ (π/3)"); 2ª: "a/b" nos trechos de texto que sobraram. */
export function partesFracao(texto: string, materia?: string): ParteFracao[] {
  const fim: ParteFracao[] = [];
  for (const p of divisoes(texto, materia)) if (p.t === 'txt') fim.push(...barras(p.v, materia)); else fim.push(p);
  if (!fim.length) return [{ t: 'txt', v: texto }];
  // fração do Unicode ("½", "¼", "⅛") no mesmo texto de uma fração empilhada também empilha, para a mesma linha não
  // misturar as duas formas ("1 → ½ → ¼ → ⅛ → 1/16"); a letra com "½" é índice ("t½") e fica (revisão de 21/11/2026,
  // questão-correção 2 R4)
  if (!fim.some((p) => p.t === 'frac') || !RE_VULGAR.test(texto)) return fim;
  return fim.flatMap((p) => (p.t === 'txt' ? vulgares(p.v) : [p]));
}

const VULGAR: Record<string, [string, string]> = {
  '½': ['1', '2'], '⅓': ['1', '3'], '⅔': ['2', '3'], '¼': ['1', '4'], '¾': ['3', '4'], '⅕': ['1', '5'], '⅖': ['2', '5'],
  '⅗': ['3', '5'], '⅘': ['4', '5'], '⅙': ['1', '6'], '⅚': ['5', '6'], '⅛': ['1', '8'], '⅜': ['3', '8'], '⅝': ['5', '8'], '⅞': ['7', '8'],
};
const RE_VULGAR = /(?<![A-Za-zÀ-ÿα-ωℓ])[½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]/;
/** A fração do Unicode é um caractere só: `orig` guarda o caractere, `n` e `d` os algarismos desenhados. */
export const ehFracaoUnicode = (orig: string) => orig.length === 1 && orig in VULGAR;
function vulgares(s: string): ParteFracao[] {
  const out: ParteFracao[] = [];
  let ult = 0;
  for (const m of s.matchAll(new RegExp(RE_VULGAR.source, 'g'))) {
    if (m.index! > ult) out.push({ t: 'txt', v: s.slice(ult, m.index) });
    const [n, d] = VULGAR[m[0]];
    out.push({ t: 'frac', n, d, orig: m[0], sep: '' });
    ult = m.index! + 1;
  }
  if (ult < s.length) out.push({ t: 'txt', v: s.slice(ult) });
  return out;
}

/** início do numerador longo (quantidade com nome ou fórmula química inteira) sobre um número, antes de "="; ou null */
function numeradorLongo(texto: string, ult: number, ini: number, num: string, den: string): number | null {
  if (!/^\d+(?:,\d+)?$/.test(den) || !/^\s*[=≈]/.test(texto.slice(ini + num.length + 1 + den.length))) return null;
  const antes = texto.slice(ult, ini);
  if (/^[A-Z][A-Za-z0-9₀-₉]*$/.test(num)) {
    const q = new RegExp(`(?<![\\d,.A-Za-zÀ-ÿ])${CIENT}\\s(?:${UNID_NOME}|[a-zà-ÿ]{3,})\\sde\\s$`, 'u').exec(antes);
    if (q) return ult + q.index;
  }
  const f = /(?<![A-Za-z0-9])(?:[A-Z][a-z]?\d*){2,}$/.exec(antes + num);
  if (f && f[0].length > num.length) {
    const simb = f[0].match(/[A-Z][a-z]?/g) || [];
    if (/\d/.test(f[0]) && simb.every((e) => Z_DO_SIMBOLO.has(e))) return ult + f.index;
  }
  return null;
}

/** frações escritas com "/" colado ("2/5", "27x/60", "(a + b)/2") e nuclídeos ("207/82 Pb") */
function barras(texto: string, materia?: string): ParteFracao[] {
  const out: ParteFracao[] = [];
  let ult = 0;
  // a barra dentro do expoente escrito ("2744^(1/3)") fica no expoente (revisão de 20/11, N12: o "^(" saía cru)
  const expo: [number, number][] = [];
  for (const e of texto.matchAll(/\^\([^()\n]{1,30}\)/g)) expo.push([e.index!, e.index! + e[0].length]);
  RE.lastIndex = 0;
  for (let m = RE.exec(texto); m; m = RE.exec(texto)) {
    if (m[0].length === 0) { RE.lastIndex++; continue; }
    // (a potência inteira, base e expoente, pode ser numerador ou denominador: "20^(n−1)/27^n"; revisão de 21/11, dados N1)
    const ini = m.index, fimM = m.index + m[0].length, barra = m.index + m[1].length;
    if (expo.some(([a, b]) => (barra >= a && barra < b) || (ini > a && ini < b) || (fimM > a && fimM < b))) { RE.lastIndex = m.index + 1; continue; }
    const [orig, num, den] = m;
    // barra em cadeia entre números numa conta ("3 × (27,1/164/3)"): a/b/c = (a/b)/c, a primeira empilha dentro do
    // numerador; data ("21/11/2026") fica na linha (revisão de 21/11, dados N1)
    const cad = /^\/(\d+(?:,\d+)?)(?![\d,/A-Za-zÀ-ÿ(])/.exec(texto.slice(fimM));
    if (cad && /^\d+(?:,\d+)?$/.test(num) && /^\d+(?:,\d+)?$/.test(den) && /[=(×·+−]\s*$/.test(texto.slice(0, ini))
      && !/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(orig + cad[0])) {
      if (ini > ult) out.push({ t: 'txt', v: texto.slice(ult, ini) });
      out.push({ t: 'frac', n: orig, d: cad[1], orig: orig + cad[0], sep: '/' });
      ult = fimM + cad[0].length;
      RE.lastIndex = ult;
      continue;
    }
    const nuc = nuclideo(texto, m.index, num, den);
    if (nuc) {
      if (m.index > ult) out.push({ t: 'txt', v: texto.slice(ult, m.index) });
      out.push({ t: 'nuc', a: num, z: den, orig: nuc });
      ult = m.index + nuc.length;
      RE.lastIndex = ult;
      continue;
    }
    // numerador maior que o termo: a quantidade inteira ("0,5 mol de H2/2 = 0,25 mol") ou a fórmula inteira
    // ("C4H10N2O4/2 = C2H5NO2") dividida por um número antes de "=" (revisão de 21/11, dados N1)
    const ext = numeradorLongo(texto, ult, ini, num, den);
    if (ext != null) {
      if (ext > ult) out.push({ t: 'txt', v: texto.slice(ult, ext) });
      out.push({ t: 'frac', n: texto.slice(ext, barra), d: den, orig: texto.slice(ext, fimM), sep: '/' });
      ult = fimM;
      continue;
    }
    if (!ehFracao(texto, m.index, num, den, materia)) {
      // tenta de novo a partir do caractere seguinte (o denominador pode ser o numerador de outra fração)
      RE.lastIndex = m.index + 1;
      continue;
    }
    if (m.index > ult) out.push({ t: 'txt', v: texto.slice(ult, m.index) });
    // fatorial no denominador ("[n(n − 1)(n − 2)]/5!", "40320/3!") vai junto dele: o "!" é do número de baixo, não da
    // fração inteira (passada 3 N3)
    const fat = texto.charAt(fimM) === '!' && /^(?:\d+|[a-zA-Z])$/.test(den) && !/^!=/.test(texto.slice(fimM)) ? '!' : '';
    out.push({ t: 'frac', n: semParenteses(num), d: semParenteses(den) + fat, orig: orig + fat, sep: '/', pn: num !== semParenteses(num), pd: den !== semParenteses(den) });
    ult = m.index + orig.length + fat.length;
    if (fat) RE.lastIndex = ult;
  }
  if (ult < texto.length) out.push({ t: 'txt', v: texto.slice(ult) });
  return out;
}

/* ---------------------------------------------------------------- divisão com "÷" e " / " */
// operando simples: função opcional, número (milhar com espaço, decimal), raiz, letra(s), índice, expoente, fatorial,
// porcentagem; ou número com unidade ("1 g ÷ 2^4", "90 g ÷ 18 g/mol", "108 km/h ÷ 3,6", "45° ÷ 15°")
const EXPO = String.raw`(?:\^\([^()\n]{1,24}\)|\^[−\-+]?[0-9a-zA-Z,]+[+−]?|[²³⁴⁵⁶⁷⁸⁹¹⁰⁻⁺ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖʳˢᵗᵘᵛʷˣʸᶻ]+)?!?`;
const NUM = String.raw`(?:\d{1,3}(?:[   ]\d{3})+(?:,\d+)?|\d+(?:[.,]\d+)*)`;
const SIMPLES = String.raw`(?:(?:log|ln|sen|cos|tg)\s?)?Σ?(?:\d{1,3}(?:[   ]\d{3})+(?:,\d+)?|\d+(?:[.,]\d+)*)?√?(?:\d+(?:[.,]\d+)*)?Δ?(?:[A-Z]{2}|[A-Z][a-z]|[xy][A-Z]|[a-zA-Zα-ωπθμΔℓ](?:_[A-Za-z0-9]+|\d(?!\d|[.,]\d)|½)?)?[₀-₉ᵢⱼₙₐₑₒₓ]*` + EXPO + '%?';
const UBASE = 'mmol|kmol|mol|mA|μA|µA|mV|kV|MW|GW|MJ|GJ|kN|MPa|GPa|GHz|MHz|kHz|hm|ha|mg|kg|μg|µg|g|mL|dL|L|mm|cm|dm|km|nm|m|min|s|h|kJ|J|kcal|cal|atm|kPa|Pa|K|kΩ|Ω|kWh|Wh|kW|W|N|V|A|C|Hz|eV|t|dias?|anos?|horas?|bi|mi|mil|milhão|milhões|bilhão|bilhões';
const UNID_NOME = String.raw`(?:${UBASE})(?:[²³]|[23](?![\d,]))?(?:[·.\/](?:${UBASE})(?:[²³]|[23](?![\d,]))?){0,2}`;
const CIENT = String.raw`${NUM}(?:\s?×\s?10(?:[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+|\^\(?[−\-]?\d+\)?))?`;
// (ângulo por tempo, "15° ÷ 15°/h": o denominador leva a unidade inteira; revisão de 21/11, dados N1)
const UNID = String.raw`${CIENT}(?:\s(?:${UNID_NOME})|°(?:C|\/(?:h|s|min))?|\s?%)`;
const UNID_SIMPLES = String.raw`\d+(?:[.,]\d+)?\s(?:mg|kg|μg|µg|g|mL|L|mol|mm|cm|km|nm|m|min|s|h|J|kJ|kcal|atm|K|C|A|V)`;
// só com "÷" (nunca com " / ", que separa verso, par e alternativa): fração com "/" colado ("3π/4 ÷ 3", "1 ÷ 1/2"),
// número com nome ("1 900 crianças ÷ 1 000 famílias"), letra com nome ("E total ÷ E fóton") e palavra ("massa ÷ volume")
const BARRA = String.raw`[\d√a-zA-Zα-ωπ][\d,√a-zA-Zα-ωπ²³]*\/[\d√a-zA-Zα-ωπ][\d,a-zA-Zα-ωπ²³]*`;
const NUM_NOME = String.raw`${NUM}\s[a-zà-ÿ]{3,}`;
const LETRA_NOME = String.raw`[A-ZΔ]\s[a-zà-ÿ]{3,}`;
// letra com raiz ("L√3 ÷ 2", "3ℓ²√3 ÷ 2")
const LETRA_RAIZ = String.raw`\d*[A-Za-zℓ][²³]?√\d+`;
// palavra, ou nome com o adjetivo que o completa ("carga total ÷ capacitância total", "cateto oposto ÷ hipotenusa")
const ADJ = 'correspondente|interna|interno|externa|externo|recebido|recebida|cedido|cedida|elementar|possíveis|favoráveis|possível|favorável|total|totais|médio|média|oposto|adjacente|inicial|final|útil|equivalente|resultante|retirado|retirada|molar|específico|específica|elétrica|elétrico|percorrida|percorrido|gasto|gasta';
const NOME_RAZAO = String.raw`[a-zà-ÿ]{3,}(?: (?:${ADJ}))?(?: (?:de|do|da|dos|das|por) [a-zà-ÿ]+[²³]?)?`;
// (com "não" antes: "expostos ÷ não expostos"; questão-correção 2 R5)
const PALAVRA_OP = String.raw`(?:não\s)?[A-Za-zÀ-ÿ]{2,}(?:\s(?:${ADJ})(?![A-Za-zÀ-ÿ]))?`;
// valor em dinheiro, com a moeda e a escala ("US$ 37 mi", "R$ 1,2 bilhão"): um operando inteiro (questão-correção 2 R5)
const MOEDA = String.raw`(?:US\$|R\$|€)\s?${CIENT}(?:\s(?:mi|bi|mil|milhão|milhões|bilhão|bilhões)(?![A-Za-zÀ-ÿ]))?`;
// artigo, preposição ou contração nunca é numerador nem denominador ("esquecer o ÷ 2", "Cada um ÷ 14", "do total ÷ 70")
// ("a" e "e" sozinhos são variável ou o número e; "Na" é sódio: só minúsculas)
const ARTIGO = /^(?:o|os|as|um|uma|uns|umas|de|do|da|dos|das|no|na|nos|nas|em|ao|à|aos|às|pelo|pela|pelos|pelas|por|com|para|que|se)(?:\s|$)/;
const UNID_PAR = new RegExp(String.raw`^\((?:${UNID_NOME})\)$`, 'u');
const FIM_UNID = String.raw`(?![A-Za-zÀ-ÿ\d])`;
// quantidade de uma substância ou coisa ("8 mol de H+ ÷ 4 mol de ácido", "46 átomos de H ÷ 2", "15 g de sal ÷ 50 g de água")
const QTD = String.raw`${CIENT}\s(?:${UNID_NOME}|[a-zà-ÿ]{3,})\sde\s(?:[A-Z][A-Za-z0-9⁺⁻²³⁴⁵⁶⁷⁸⁹¹⁰+−]*|[a-zà-ÿ]{3,})`;
const RE_ESQ = new RegExp(`(?:${UNID_SIMPLES}|${SIMPLES})$`, 'u');
const RE_DIR = new RegExp(`^(?:${UNID_SIMPLES}(?![A-Za-z])|${SIMPLES})`, 'u');
const RE_ESQ_DIV = new RegExp(`(?:${MOEDA}|${QTD}|${UNID}|${NUM_NOME}|${LETRA_NOME}|${LETRA_RAIZ}|${BARRA}|${SIMPLES}|${PALAVRA_OP})$`, 'u');
const RE_DIR_NOME = new RegExp(`^(?:${QTD}|${NUM_NOME}|${LETRA_NOME})${FIM_UNID}`, 'u');
const RE_DIR_DIV = new RegExp(`^(?:${MOEDA}${FIM_UNID}|${UNID}${FIM_UNID}|${LETRA_RAIZ}|${BARRA}|${SIMPLES}(?![A-Za-zÀ-ÿ])|${PALAVRA_OP})`, 'u');
const RE_OP = /\s*÷\s*| \/ /g;
const temValor = (x: string) => /[0-9a-zA-Zα-ωπθμΔÀ-ÿ]/.test(x);
// (letra pequena em cima também: "[C]ᶜ·[D]ᵈ ÷ ([A]ᵃ·[B]ᵇ)")
const SOBE = /[²³⁴⁵⁶⁷⁸⁹¹⁰⁻⁺!ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖʳˢᵗᵘᵛʷˣʸᶻ]*$/;
// coeficiente, raiz ou nome de função colado antes de um grupo: "2(x − 8)", "√3(…)", "m(soluto)", "sen(…)"
const COEF = /(?:\d+(?:,\d+)?|√\d*|[A-Za-zα-ωπ]{1,4})$/;
// palavra (com o adjetivo que a completa) dos dois lados de " / " na fórmula por extenso (passada 5 V1)
const NOME_PAL = String.raw`[a-zà-ÿ]{3,}(?: (?:${ADJ}))?`;
const RE_PAL_ESQ = new RegExp(`(?<=[=≈] )${NOME_PAL}$`, 'u');
const RE_PAL_DIR = new RegExp(`^${NOME_PAL}(?=\\s*$|\\s*[,;.)]|\\s+[=≈+−×·])`, 'u');
const PAR: Record<string, string> = { ')': '(', ']': '[' };

/** operando que termina em `fim` (grupo entre parênteses, colchetes ou barras de módulo, com expoente; ou simples) */
function opEsq(s: string, fim: number, amplo: boolean): number | null {
  const pre = s.slice(0, fim);
  let k = fim;
  k -= SOBE.exec(pre)![0].length;
  const fecha = pre[k - 1];
  if (fecha === ')' || fecha === ']') {
    const abre = PAR[fecha];
    let p = 0;
    for (let i = k - 1; i >= 0; i--) {
      if (s[i] === fecha) p++;
      else if (s[i] === abre) {
        p--;
        if (p === 0) {
          // expoente entre parênteses ("3^(x + 64)"): o operando começa na base
          if (s[i - 1] === '^') { const base = /(?:\d+(?:[.,]\d+)*|[A-Za-zα-ωπ])$/.exec(s.slice(0, i - 1)); return base ? i - 1 - base[0].length : null; }
          const c = amplo ? COEF.exec(s.slice(0, i)) : null;
          // somatório colado ao grupo ("Σ(xᵢ · pᵢ) / Σpᵢ", item 10 da revisão de 20/11/2026): faz parte do numerador
          return c ? i - c[0].length : s[i - 1] === 'Σ' ? i - 1 : i;
        }
      }
    }
    return null;
  }
  if (fecha === '|' && amplo) {
    const i = s.lastIndexOf('|', k - 2);
    return i >= 0 && temValor(s.slice(i + 1, k - 1)) ? i : null;
  }
  const m = (amplo ? RE_ESQ_DIV : RE_ESQ).exec(pre);
  if (!m || !temValor(m[0])) return null;
  return fim - m[0].length;
}
/** operando que começa em `ini` */
function opDir(s: string, ini: number, amplo: boolean, nome = false): number | null {
  const resto = s.slice(ini);
  // número ou letra com nome só depois de outro igual ("1 900 crianças ÷ 1 000 famílias", "E total ÷ E fóton"):
  // sozinho, o nome depois do número é o resto da frase ("6 ÷ 2 vezes", "204 ÷ L tem")
  if (amplo && nome) { const n = RE_DIR_NOME.exec(resto); if (n) return ini + n[0].length; }
  const c = amplo ? /^(?:\d+(?:,\d+)?|√\d*|[A-Za-zα-ωπ]{1,4})?(?=[([])/.exec(resto) : /^(?=\()/.exec(resto);
  if (c) {
    const j = ini + c[0].length, abre = s[j], fecha = abre === '(' ? ')' : ']';
    let p = 0;
    for (let i = j; i < s.length; i++) {
      if (s[i] === abre) p++;
      else if (s[i] === fecha) { p--; if (p === 0) return i + 1 + /^[²³⁴⁵⁶⁷⁸⁹¹⁰⁻⁺!ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖʳˢᵗᵘᵛʷˣʸᶻ]*/.exec(s.slice(i + 1))![0].length; }
    }
    return null;
  }
  if (amplo && resto[0] === '|') {
    const i = s.indexOf('|', ini + 1);
    return i > ini + 1 && temValor(s.slice(ini + 1, i)) ? i + 1 + /^[²³⁴⁵⁶⁷⁸⁹¹⁰⁻⁺!ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖʳˢᵗᵘᵛʷˣʸᶻ]*/.exec(s.slice(i + 1))![0].length : null;
  }
  const m = (amplo ? RE_DIR_DIV : RE_DIR).exec(resto);
  if (!m || !temValor(m[0])) return null;
  return ini + m[0].length;
}
/** a divisão está dentro de um grupo que é numerador ou denominador de uma fração com "/" ("(a ÷ b)/2", "2/(a ÷ b)"):
 *  fica para a passada da barra, que empilha o grupo inteiro (e a divisão de dentro empilha dentro dele) */
function dentroDeBarra(s: string, idx: number): boolean {
  let p = 0;
  for (let i = idx - 1; i >= 0; i--) {
    if (s[i] === ')') p++;
    else if (s[i] === '(') {
      if (p > 0) { p--; continue; }
      let q = 0;
      for (let j = i; j < s.length; j++) {
        if (s[j] === '(') q++;
        else if (s[j] === ')') { q--; if (q === 0) { const dep = s.slice(j + 1).replace(/^[²³⁴⁵⁶⁷⁸⁹¹⁰⁻⁺]+/, ''); if (dep[0] === '/' || s[i - 1] === '/') return true; break; } }
      }
    }
  }
  return false;
}
function divisoes(s: string, materia?: string): ParteFracao[] {
  if (!/÷| \/ /.test(s)) return [{ t: 'txt', v: s }];
  // o texto inteiro é a razão entre dois nomes ("alcance ÷ tempo de voo", nota do quadro): cada lado inteiro, mesmo
  // com "de" no meio (revisão de 21/11, dados N1)
  // (cada lado: um nome, com o adjetivo ou com "de"/"por" e o complemento; "isola massa ÷ volume" e "Calcule L ÷ A" não)
  const nomes = new RegExp(`^(${NOME_RAZAO}) ÷ (${NOME_RAZAO})$`, 'u').exec(s);
  if (nomes) return [{ t: 'frac', n: nomes[1], d: nomes[2], orig: s, sep: ' ÷ ' }];
  // as divisões de fora primeiro (menor profundidade de parênteses): "(x ÷ 6) ÷ (1 − x²)" empilha a de fora, e a de
  // dentro empilha dentro do numerador quando ele é desenhado
  const ops: { ini: number; fim: number; txt: string; prof: number }[] = [];
  RE_OP.lastIndex = 0;
  for (let m = RE_OP.exec(s); m; m = RE_OP.exec(s)) {
    let prof = 0;
    for (let i = 0; i < m.index; i++) { if (s[i] === '(' || s[i] === '[') prof++; else if (s[i] === ')' || s[i] === ']') prof--; }
    ops.push({ ini: m.index, fim: m.index + m[0].length, txt: m[0], prof });
  }
  ops.sort((x, y) => x.prof - y.prof || y.ini - x.ini);
  const feitas: { a: number; b: number; p: ParteFracao }[] = [];
  const livre = (a: number, b: number) => !feitas.some((f) => a < f.b && f.a < b);
  for (const o of ops) {
    if (!livre(o.ini, o.fim) || dentroDeBarra(s, o.ini)) continue;
    const amplo = o.txt.includes('÷');
    let a = opEsq(s, o.ini, amplo);
    let b = opDir(s, o.fim, amplo, a != null && new RegExp(`^(?:${QTD}|${NUM_NOME}|${LETRA_NOME})$`, 'u').test(s.slice(a, o.ini)));
    // (revisão de 21/11/2026, 4ª passada T5) função de uma letra dos dois lados de " / " ("P(A ∩ B) / P(B)", "f(x) / g(x)"):
    // o nome da função vai junto do grupo, em cima e embaixo
    if (!amplo) {
      const fe = /(?<![A-Za-zÀ-ÿ0-9])[A-Za-z]\([^()\n]{1,30}\)$/.exec(s.slice(0, o.ini));
      const fd = /^[A-Za-z]\([^()\n]{1,30}\)(?![A-Za-zÀ-ÿ0-9(])/.exec(s.slice(o.fim));
      if (fe && fd) { a = fe.index; b = o.fim + fd[0].length; }
      // (revisão de 21/11/2026, passada 5 V1) em Matemática, Física e Química, palavra sobre palavra logo depois de "="
      // é a fórmula por extenso ("P(A) = favoráveis / possíveis", "sen = cateto oposto / hipotenusa"); verso, "e/ou" e
      // unidade não têm "=" antes e ficam na linha
      if (materia && /^(?:mat|fis|qui)$/.test(materia)) {
        const pe = RE_PAL_ESQ.exec(s.slice(0, o.ini)), pd = RE_PAL_DIR.exec(s.slice(o.fim));
        if (pe && pd) { a = pe.index; b = o.fim + pd[0].length; }
      }
    }
    // divisão encadeada (a ÷ b ÷ c = (a ÷ b) ÷ c): o numerador leva a divisão de antes, que empilha dentro dele
    for (let m = a == null ? null : /\s*÷\s*$/.exec(s.slice(0, a)); a != null && m; m = /\s*÷\s*$/.exec(s.slice(0, a))) {
      const a2 = opEsq(s, m.index, true);
      if (a2 == null) break;
      a = a2;
    }
    // grupo entre parênteses sobre uma palavra ("(novo − antigo) / antigo", item 10 da revisão de 20/11/2026)
    if (!amplo && a != null && /^\(.*[−+×·\-].*\)$/.test(s.slice(a, o.ini)) && (b == null || /^[A-Za-zÀ-ÿ]/.test(s.slice(b)))) {
      const w = /^[A-Za-zÀ-ÿα-ω]{2,}(?![A-Za-zÀ-ÿ0-9])/.exec(s.slice(o.fim));
      if (w) b = o.fim + w[0].length;
    }
    if (a == null || b == null || !livre(a, b)) continue;
    // operando que começa depois de um índice ou expoente é pedaço de um produto ("α²C ÷ (1 − α)", "R₁R₂ ÷ (R₂ − R₁)",
    // "2²√3 ÷ 4"): o produto inteiro vai em cima (questão-correção 2 R3)
    // (o índice da raiz vai junto: "³√x² ÷ √2", "³√(8²) ÷ √2")
    if (a != null && s[a] === '√' && /[²³⁴⁵⁶⁷⁸⁹]$/.test(s.slice(0, a)) && !/[A-Za-zÀ-ÿ0-9)]$/.test(s.slice(0, a - 1))) a -= 1;
    if (a != null && /[₀-₉⁰¹²³⁴-⁹⁺⁻]$/.test(s.slice(0, a))) {
      const pr = /(?<![A-Za-zÀ-ÿ0-9,.₀-₉⁰¹²³⁴-⁹⁺⁻])(?:(?:\d+(?:,\d+)?|[A-Za-zα-ωπℓ]|√)[₀-₉⁰¹²³⁴-⁹⁻⁺]*)+$/.exec(s.slice(0, a));
      if (pr) a = pr.index;
    }
    // "não" em cima só no começo da razão ("não utilizadas / utilizadas"); depois de palavra é a negação da frase
    // ("e não cateto ÷ cateto")
    if (s.startsWith('não ', a) && /[A-Za-zÀ-ÿ]\s$/.test(s.slice(0, a))) a += 4;
    const num = s.slice(a, o.ini), den = s.slice(o.fim, b);
    const antes = s.slice(0, a), depois = s.slice(b);
    // colado a palavra, número, índice ou outra divisão: não é um operando inteiro
    // (índice e expoente também: "H₂O / CO₂" não é "O" sobre "CO₂"; questão-correção 2 R3)
    if (/[A-Za-zÀ-ÿ0-9.,_^\\/÷₀-₉⁰¹²³⁴-⁹⁺⁻$]$/.test(antes) || /^[A-Za-zÀ-ÿ0-9(_^/₀-₉$]/.test(depois)) continue;
    // artigo ou preposição como operando, unidade entre parênteses ("massa (g) ÷ massa molar (g/mol)"): o nome da razão
    // não cabe inteiro dos dois lados, a divisão fica na linha (questão-correção 2 R5)
    // sinal de interação ecológica ("0 / 0", "− / −", "+ / 0") e denominador zero: fica na linha (questão-correção 2 R6)
    if ((/^[0+−-]$/.test(num) && /^[0+−-]$/.test(den)) || (/^0$/.test(den) && !(/^[A-Za-zα-ω]$/.test(num) && !/∈\s*$/.test(antes)) && !/[=≈×·÷+−]\s*$/.test(antes) && !/^\s*[=≈]/.test(depois))) continue;
    // ("o" sozinho só é artigo entre palavras: "i / o = p' / p" e "razão = um ÷ outro" são conta; "(m/s) ÷ (m/s²)" é
    // análise de unidade)
    if ((ARTIGO.test(num) && (/\s/.test(num) || /[A-Za-zÀ-ÿ]\s$/.test(antes))) || (ARTIGO.test(den) && /^\s+[a-zà-ÿ]/.test(depois))
      || (UNID_PAR.test(num) && /[A-Za-zÀ-ÿ]{3,}\s$/.test(antes))) continue;
    if (/\s\/\s*$/.test(antes)) continue;
    // "2 kmol de O2 ÷ 1,5", "V de Júpiter ÷ V da Terra": o operando é o complemento de um nome maior (antes de "de"
    // ou depois dele), não o número inteiro; fica na linha
    // palavra solta depois de número é unidade ("100 mA ÷ 1000"); depois de preposição é complemento ("calor por tempo")
    if (amplo && /^[A-Za-zÀ-ÿ]+(?:\s[A-Za-zÀ-ÿ]+)?$/.test(num) && (/\d\s+$/.test(antes) || /(?:^|\s)(?:por|em|no|na|nos|nas|com|para|pelo|pela)\s$/i.test(antes))) continue;
    // (uma variável sozinha depois de "de" é o numerador: "de p ÷ (p − 5) = 22 ÷ 17 sai p = 22")
    if ((/(?:^|\s)(?:de|da|do|dos|das)\s$/.test(antes) && /^[A-Za-zÀ-ÿΔ]/.test(num) && !(/^[a-zα-ω][₀-₉]?$/.test(num) && /^de\s$/.test(antes.slice(-3)) && /^[(\d]/.test(den)))
      || (/^\s(?:de|da|do|dos|das)\s/.test(depois) && /^[A-Za-zÀ-ÿΔ]/.test(den))) continue;
    if (!amplo) {
      // "A / B" entre alternativas, unidade ("10 m / s"), verso ("enganos, / tu"), palavras
      const so = (x: string) => /^[A-Za-zÀ-ÿα-ωμ]+$/.test(x);
      if (/^[A-E]$/.test(num) && /^[A-E]$/.test(den)) continue;
      // fórmulas e espécies ("HA / A⁻", "H₂O / CO₂ / Cl⁻") só empilham com sinal de conta (questão-correção 2 R3)
      if (especie(num, true) && especie(den, true) && !/[=≈×·÷+−]\s*$/.test(antes) && !/^\s*[=≈×·÷+−]/.test(depois)) continue;
      // (revisão de 21/11/2026, dados R1) verso ("Rua 15 / E o progresso": maiúscula e palavra depois da barra),
      // par de siglas ou de pontos cardeais ("E / W", "NS / NR") e enumeração ("I - H / II - D") sem sinal de conta
      if (/^[A-ZÀ-Ý][A-Za-zÀ-ÿ]*$/.test(den) && /^\s+[a-zà-ÿ]/.test(depois)) continue;
      if (/^[A-Z]+$/.test(num) && /^[A-Z]+$/.test(den) && !/[=≈×·÷+−]\s*$/.test(antes) && !/^\s*[=≈]/.test(depois)) continue;
      if (new RegExp(`^${UNID_SIMPLES}$`, 'u').test(num) && /^(?:s|h|min|L|mL|mol|kg|g|m|cm|km)$/.test(den)) continue;
      if (so(num) && /\d\s+$/.test(antes)) continue;
      if (so(num) && so(den) && !/(^|[=+−\-×·(≈])\s*$/.test(antes) && !/^\s*[=≈]/.test(depois)) continue;
    }
    feitas.push({ a, b, p: { t: 'frac', n: semParenteses(num), d: semParenteses(den), orig: s.slice(a, b), sep: o.txt, pn: num !== semParenteses(num), pd: den !== semParenteses(den) } });
  }
  feitas.sort((x, y) => x.a - y.a);
  const out: ParteFracao[] = [];
  let ult = 0;
  for (const f of feitas) {
    if (f.a > ult) out.push({ t: 'txt', v: s.slice(ult, f.a) });
    out.push(f.p);
    ult = f.b;
  }
  if (ult < s.length) out.push({ t: 'txt', v: s.slice(ult) });
  return out;
}

/**
 * A "conta" de um passo às vezes é texto: um trecho citado da prova (Português), uma relação entre palavras
 * ("autor → obra", "coração × tela") ou uma frase (Biologia, Química). O guia reserva a letra à mão (Caveat) para
 * conta e fórmula ("cursiva nunca em texto corrido"); texto vai na família da interface.
 * - Português, Inglês, História, Geografia e Filosofia e Sociologia: sempre texto;
 * - frase (6 a 10 palavras seguidas sem número nem sinal no meio, conforme a forma) é texto, mesmo com uma conta dentro;
 * - fora de Matemática e Física, frase explicativa com poucas expressões no meio é texto (`fraseComPoucaConta`);
 * - só números (lista, resultado: "43,18", "2, 3, 5, 7, 11, ...") é conta;
 * - é conta quando há sinal de matemática ou química junto de número, variável ou fórmula: operador junto de
 *   número, letra de variável com "=", raiz, expoente, índice; seta e "×" só contam entre fórmulas ("Aa × Aa",
 *   "2 H2O2 → 2 H2O + O2"), não entre palavras;
 * - trecho entre aspas é citação: só é conta se sobrar sinal fora das aspas.
 */
const PALAVRA = /^[A-Za-zÀ-ÿ]+(?:-[A-Za-zÀ-ÿ]+)*$/; // "alcalino-terroso" é uma palavra
// átomo de fórmula: tem algarismo, índice ou expoente, ou é variável/genótipo curto (x, n, Aa, AB), ou fórmula química (NaCl, CaCO3)
function ehAtomo(tk: string): boolean {
  const t = tk.replace(/[.,;:!?]+$/, '').replace(/\((?:aq|s|l|g|v)\)$/, '').replace(/^[(\[{“"'‘]+|[)\]}”"'’]+$/g, '');
  if (!t) return false;
  if (/[0-9²³⁴⁵⁶⁷⁸⁹¹⁰⁻⁺₀₁₂₃₄₅₆₇₈₉]/.test(t)) return true;
  if (/^[A-Za-zα-ω]{1,2}$/.test(t) && !/^(é|e|o|a|os|as|um|de|da|do|em|no|na|se|ou)$/i.test(t)) return true;
  return /^(?:[A-Z][a-z]?){2,}$/.test(t) && /[a-z]/.test(t) && !/^[A-Z][a-z]+$/.test(t);
}
function maiorFrase(t: string): number {
  // sequência de palavras sem número nem sinal de conta entre elas (vírgula, dois-pontos e parênteses não cortam)
  let maior = 0, seq = 0;
  for (const tk of t.split(/\s+/)) {
    const w = tk.replace(/^[(“"'‘—–-]+|[)”"'’.,;:!?]+$/g, '');
    const genotipo = /^([A-Z])\1?$/.test(w) || (w.length === 2 && w[0] !== w[1] && w[0].toLowerCase() === w[1]);
    const variavel = w.length === 1 && !/^[aeoéàAEOÉÀ]$/.test(w); // "n", "x": variável, não palavra
    if (PALAVRA.test(w) && !genotipo && !variavel) { seq++; maior = Math.max(maior, seq); }
    else seq = 0;
  }
  return maior;
}
// unidades não pesam para nenhum lado ("1 mol de cobre", "23 g")
const UNIDADES = new Set(['mol', 'g', 'kg', 'mg', 'µg', 'L', 'mL', 'kJ', 'J', 'kcal', 'cal', 'pm', 'nm', 'cm', 'mm', 'm', 'km', 's', 'min', 'h',
  'atm', 'mmHg', 'Pa', 'kPa', 'K', 'C', 'M', 'u', 'Da', 'ppm', 'mol/L', 'g/mol', 'g/L', 'kJ/mol', 'kcal/mol', 'g/mL', 'g/cm³', '°C', '%']);
// palavra de ligação ou verbo de explicação: sem ela não há frase, só rótulos ("massa molar do CO2 = ...")
const LIGACAO = /^(significa|significam|ou|seja|logo|então|portanto|porque|pois|como|que|quando|se|mas|cada|é|são|tem|têm|fica|ficam|vira|viram|sobra|sobram|sai|saem|entra|entram|perde|perdeu|ganha|ganhou|há|está|estão|corresponde|indica|mostra|dá|dão|vai|vão|leva|traz|forma|formam|iguais|igual|mesmo|mesma|assim|isto|conforme|embora|libera|liberam|doa|recebe|pertence|existe|cumpre)$/i;
/**
 * Frase explicativa com poucas expressões no meio ("86 prótons significa Z = 86. Número de massa 222 significa A = 222…"):
 * conta as palavras de texto e os itens de conta (número, sinal, fórmula, variável, genótipo); unidades são neutras.
 * É frase quando há 7 palavras ou mais, metade ou mais dos itens são palavras, nenhuma expressão seguida passa de 6
 * itens (equação química ou conta comprida continua conta) e há palavra de ligação ou verbo; sem "=" nem seta, a
 * frase dispensa a palavra de ligação ("Arrhenius: ácido libera H⁺ em água"). A igualdade entre nomes sem ligação é
 * fórmula por extenso e fica à mão ("carga total do cátion + carga total do ânion = 0").
 */
function fraseComPoucaConta(t: string): boolean {
  let pal = 0, conta = 0, seq = 0, maiorSeq = 0, liga = false;
  const tks = t.split(/\s+/);
  for (let i = 0; i < tks.length; i++) {
    const w = tks[i].replace(/^[(\[“"'‘—–]+|[)\]”"'’.,;:!?]+$/g, '');
    if (!w || /^[—–-]$/.test(w)) continue;
    if (UNIDADES.has(w)) continue;
    // "E", "A", "O" no começo da frase são palavra ("E 86 elétrons"), a não ser antes de um sinal ("A = 222")
    const vogal = /^[EAOÉÀ]$/.test(w) && (i === 0 || /[.!?:;]$/.test(tks[i - 1])) && !/^[=+−×÷·→≈<>]/.test(tks[i + 1] || '');
    const genotipo = !vogal && /^([A-Z])\1?$/.test(w) || /^([a-z])\1$/.test(w) || (w.length === 2 && w[0] !== w[1] && w[0].toLowerCase() === w[1]) || /^I[AB][iAB]?[AB]?$/.test(w);
    const variavel = w.length === 1 && !/^[eoaéàEOAÉÀ]$/.test(w);
    const elemento = /^[A-Z][a-z]?$/.test(w) && Z_DO_SIMBOLO.has(w) && !/^(No|Na|Se|As|Em|O)$/.test(w);
    const formula = /^(?:[A-Z][a-z]?){2,}$/.test(w) && !/^[A-Z][a-zà-ÿ]+$/.test(w);
    if (PALAVRA.test(w) && !genotipo && !variavel && !elemento && !formula) {
      pal++; seq = 0;
      if (LIGACAO.test(w)) liga = true;
    } else { conta++; seq++; maiorSeq = Math.max(maiorSeq, seq); }
  }
  return pal >= 7 && pal >= conta && maiorSeq <= 6 && (liga || !/[=→⇒]/.test(t));
}
/**
 * A linha que COMEÇA com uma conta continua à mão, mesmo com a explicação depois ("22 átomos × 12 g/mol = 264 g de
 * carbono…", "14 ÷ 24 = 0,583, ou seja…", "[H⁺] = 1 × 10⁻¹⁵ mol/L, logo pH = 15"), e também a que tem equação com
 * seta entre fórmulas ("C2H2 + 1 HCl → C2H3Cl, ou seja…"). Começar com conta é:
 * - número ou expressão (fórmula, variável) seguido de ×, ÷, +, −, = ou → nas primeiras palavras, antes de pontuação
 *   e de palavra de ligação ("16 pares × 2 cromossomos por par = 32", "8 elétrons do octeto − 6 elétrons…");
 * - nome seguido de "=" e de uma operação logo depois (fórmula por extenso: "ordem global = 2 + 1 = 3",
 *   "entalpia dos produtos = entalpia dos reagentes − 888 kcal");
 * - um rótulo curto com dois-pontos antes disso ("H: 2 × 4 = 8", "200 L da solução 2: 0,01 mol/L × 200 L = 2 mol"),
 *   desde que a conta depois do rótulo chegue a um "=", "≈" ou seta antes de fechar o trecho
 *   ("enxofre da família VI A: 2 ligações + 2 pares isolados, logo…" é frase);
 * - equação química escrita com "dá" no lugar da seta ("C16H34 dá C8H16 + C8H18", "2 H2O com corrente elétrica dá
 *   2 H2 + O2"): fórmula pouco antes do "dá" e fórmula logo depois.
 * Dado solto não é conta: "Z = 7 e o átomo é neutro…", "ΔH⁰ de reação = − 727 kJ/mol, valor negativo…" ficam texto;
 * lista de reagentes e produtos também não ("2 H2 + O2 (reagentes) no nível Y; topo da curva…": a soma não chega a
 * "=" nem a seta).
 */
const OPERADOR = /^(?:×|÷|\+|−|=|≈|→)$/;
const OPERACAO = /^(?:×|÷|\+|−|→)$/;
const FIM_DE_TRECHO = /[,;.:!?|]$/;
function cabecaDeConta(t: string): boolean {
  const tks = t.split(/\s+/).filter(Boolean);
  if (tks.length < 3) return false;
  const numero = /^[[(]*[−+-]?\d/.test(tks[0]);
  const expressao = numero || /^\[/.test(tks[0]) || ehAtomo(tks[0]);
  let k = -1;
  for (let i = 0; i < Math.min(tks.length, 7); i++) {
    const w = tks[i];
    if (OPERADOR.test(w)) { k = i; break; }
    // depois de "de" é substantivo ("3 classes de forma × 2 classes de cor")
    if (i > 0 && LIGACAO.test(w.replace(/[.,;:!?]+$/, '')) && !/^(de|da|do)$/i.test(tks[i - 1])) return false;
    if (FIM_DE_TRECHO.test(w)) return false;
  }
  if (k <= 0) return false;
  if (tks[k] === '+') {
    // soma sem resultado no mesmo trecho é lista ("2 H2 + O2 no nível Y;", "2 ligações + 2 pares isolados,"), não conta;
    // com "=", seta ou outra fórmula depois da parcela é conta ou reação ("H2SO4 + 2 NaOH:", "H⁺ + OH⁻ forma H2O")
    let fecha = false;
    for (let j = k + 1; j < tks.length; j++) {
      if (/^(?:=|≈|→)$/.test(tks[j]) || (j > k + 1 && ehFormulaQuimica(tks[j]))) { fecha = true; break; }
      if (FIM_DE_TRECHO.test(tks[j])) break;
    }
    if (!fecha) return false;
  }
  if (tks[k] !== '=') return expressao;
  if (numero) return true;
  // "nome = operando operação ...": a operação vem logo depois do "=", antes de pontuação
  for (let j = k + 2; j < Math.min(tks.length, k + 9); j++) {
    if (OPERACAO.test(tks[j])) return true;
    if (tks[j] === '=' || FIM_DE_TRECHO.test(tks[j - 1])) return false;
  }
  return false;
}
// fórmula química ou esquema de reação: "H2O", "C8H16", "HOH", "R-C(OH)=CH-R'" (sem palavra minúscula comprida)
function ehFormulaQuimica(tk: string): boolean {
  const t = tk.replace(/[.,;:!?]+$/, '');
  if (!/^[A-Z][A-Za-z0-9()=≡'+⁺⁻²³-]*$/.test(t) || /[a-z]{3}/.test(t)) return false;
  return /\d/.test(t) || (t.match(/[A-Z]/g) || []).length >= 2;
}
function comecaComConta(s: string): boolean {
  const semFase = s.replace(/\s?\((?:aq|s|l|g|v)\)/g, '');
  // equação com seta entre fórmulas, em qualquer lugar ("B é consumido na etapa 2 (AY + B → AB + Y)…")
  const tks = semFase.split(/\s+/);
  for (let i = 1; i < tks.length - 1; i++) if (tks[i] === '→' && ehAtomo(tks[i - 1]) && ehAtomo(tks[i + 1])) return true;
  // "dá" no lugar da seta: fórmula até 4 palavras antes e fórmula logo depois (ou depois do nome: "dá etano C2H6")
  for (let i = 1; i < tks.length - 1; i++) {
    if (tks[i] !== 'dá') continue;
    const antes = tks.slice(Math.max(0, i - 4), i), depois = tks.slice(i + 1, i + 3);
    if (antes.some(ehFormulaQuimica) && depois.some(ehFormulaQuimica)) return true;
  }
  const t = semFase.replace(/\s\([^()]*\)/g, ' ').trim(); // comentário entre parênteses não conta
  if (cabecaDeConta(t)) return true;
  const rot = /^([^:]{1,40}):\s+(.+)$/.exec(t);
  if (!rot) return false;
  const pal = rot[1].trim().split(/\s+/);
  return pal.length <= 5 && !pal.some((w) => LIGACAO.test(w)) && !/[×÷+−=→]/.test(rot[1]) && cabecaDeConta(rot[2]);
}
/** Matéria pelo código do tema ou do conteúdo ("M10.2" → mat, "P01" → por; L e S são Filosofia e Sociologia). */
const PREFIXO_MATERIA: Record<string, string> = { M: 'mat', B: 'bio', Q: 'qui', P: 'por', F: 'fis', G: 'geo', H: 'his', I: 'ing', L: 'fs', S: 'fs' };
export function materiaDoCodigo(codigo: string | undefined | null): string | undefined {
  const m = /^([A-Z])\d/.exec(codigo || '');
  return m ? PREFIXO_MATERIA[m[1]] : undefined;
}

/** Matérias em que a "conta" do passo é sempre trecho ou relação entre palavras, nunca cálculo. */
const SEMPRE_TEXTO = new Set(['por', 'ing', 'his', 'geo', 'fs']);
/** Matérias de cálculo: seta e "×" contam como sinal de conta mesmo entre palavras ("6 lados → hexágono"). */
const CALCULO = new Set(['mat', 'fis']);
export function contaEhTexto(s: string, materia?: string): boolean {
  if (materia && SEMPRE_TEXTO.has(materia)) return true;
  let t = s.trim();
  if (!t) return true;
  if (/^[^A-Za-zÀ-ÿ]*\d[^A-Za-zÀ-ÿ]*$/.test(t)) return false; // só números e sinais
  if (/^["“”'‘’«]/.test(t)) {
    t = t.replace(/["“«][^"”»]*["”»]|['‘][^'’]*['’]/g, ' ').trim(); // tira as citações
    if (!t) return true;
  }
  const calculo = !!materia && CALCULO.has(materia);
  // em Matemática e Física, "ângulo do copo = 90° − 45°" é conta com nome por extenso; frase é só a que começa com
  // maiúscula e termina com ponto
  const frase = calculo ? /^[A-ZÀ-Ý][a-zà-ÿ]+\s/.test(t) && /[.!?]$/.test(t) : true;
  // o comentário entre parênteses não conta ("1/2 (chance de o óvulo levar o inserto) × 1 = 1/2"); frase com cara de
  // frase (maiúscula no começo, ponto no fim) precisa de 6 palavras seguidas, a conta que começa por número de 10
  const formaDeFrase = /^[A-ZÀ-Ý][a-zà-ÿ]+\s/.test(t) && /[.!?]$/.test(t);
  const minimo = formaDeFrase ? 6 : /^[\d(−-]/.test(t) ? 10 : 8;
  if (frase && maiorFrase(t.replace(/\([^()]*\)/g, ' ')) >= minimo) return true;
  // fora de Matemática e Física, frase explicativa com poucas expressões no meio também é texto
  // (a não ser que a linha comece com uma conta ou tenha equação com seta: aí continua à mão)
  if (!calculo && !comecaComConta(t) && fraseComPoucaConta(t.replace(/\([^()]*\)/g, ' '))) return true;
  const forte = /[√²³⁴⁵⁶⁷⁸⁹¹⁰⁻⁺₀₁₂₃₄₅₆₇₈₉∈≈≤≥≠ΔπΣ∑∞⇌]|\d\s*[=+−·*/^%<>÷]|[=+−·*/^<>÷]\s*\d|(?<![A-Za-zÀ-ÿ\d])-\s*\d|\d\s*-(?![A-Za-zÀ-ÿ\d])|(?<![A-Za-zÀ-ÿ])(?![aeo]\s)[a-zA-Zα-ω]\s*=(?!\s*[A-Za-zÀ-ÿ]{3})|=\s*(?![aeoé](?![A-Za-zÀ-ÿ]))[a-zA-Z](?![A-Za-zÀ-ÿ])|\b[A-Z]{2,4}\s*[+−]\s*[A-Z]{2,4}\b|[α-ω]\s*[+−]\s*[α-ω]/;
  if (forte.test(t)) return false;
  if (calculo && /[→⇒×÷]|(?<![A-Za-zÀ-ÿ])[a-zA-Zα-ωθ]\s*=|=\s*[a-zA-Zα-ωθ](?![A-Za-zÀ-ÿ])/.test(t)) return false;
  // seta e "×" entre fórmulas
  const tks = t.split(/\s+/);
  for (let i = 0; i < tks.length; i++) {
    if (/^(→|⇒|×|\+|−|=)$/.test(tks[i]) && i > 0 && i < tks.length - 1 && ehAtomo(tks[i - 1]) && ehAtomo(tks[i + 1])) return false;
  }
  return true;
}

/**
 * Linha da lista de fórmulas da Teoria ("No caderno" do tema e o caderno do cartão): a igualdade com "=" vai sempre para a
 * letra da fórmula, mesmo escrita com palavras ("variação = (novo − antigo)/antigo", "sen = cateto oposto / hipotenusa"),
 * para a mesma caixa não misturar duas letras (revisão de 21/11/2026, N7). Fica em texto a linha sem "=", a explicação
 * comprida (um trecho sem "=" depois de ";" ou 7 palavras seguidas) e as matérias de texto. Só para essa lista: a conta
 * do passo continua com `contaEhTexto`.
 */
export function formulaEhTexto(s: string, materia?: string): boolean {
  if (materia && SEMPRE_TEXTO.has(materia)) return true;
  const t = s.trim();
  // duas igualdades separadas por ";" ("próton = uud; nêutron = udd") também são fórmula
  if (t.split(';').every((x) => /[=≠≈]/.test(x) && maiorFrase(x.replace(/\([^()]*\)/g, ' ')) < 7)) return false;
  return contaEhTexto(s, materia);
}

/**
 * A letra da lista inteira do caderno (revisão de 21/11/2026, questão-correção 2 R9; DESIGN.md: a mesma peça com uma letra
 * só): cada linha vota com `formulaEhTexto` e a lista toda sai na letra da maioria; no empate, na letra da fórmula (o caderno
 * é escrito à mão). Matérias de texto: sempre texto.
 */
export function cadernoEhTexto(linhas: string[], materia?: string): boolean {
  if (materia && SEMPRE_TEXTO.has(materia)) return true;
  if (!linhas.length) return false;
  const texto = linhas.filter((x) => formulaEhTexto(x, materia)).length;
  return texto > linhas.length - texto;
}

/**
 * A letra das linhas sem LaTeX de uma lista do caderno que pode ter linhas em LaTeX (revisão de 21/11/2026, 4ª passada T2:
 * a mesma peça com uma letra só). Sem LaTeX na lista, vale a maioria (`cadernoEhTexto`). Com LaTeX, as linhas sem LaTeX
 * seguem as de LaTeX: no cartão, a linha com $…$ tem a prosa na letra da interface (texto); no "No caderno", a linha em
 * LaTeX é fórmula inteira, rótulo incluído (letra da fórmula). Matérias de texto: sempre texto.
 */
export function cadernoComLatexEhTexto(linhas: string[], materia: string | undefined, ehLatex: (s: string) => boolean, latexEhTexto: boolean): boolean {
  if (materia && SEMPRE_TEXTO.has(materia)) return true;
  if (linhas.some(ehLatex)) return latexEhTexto;
  return cadernoEhTexto(linhas, materia);
}

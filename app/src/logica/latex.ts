/**
 * LaTeX das revisões (docs/revisao/<m>/<TEMA>.json: campos `formula`, `passos[].conta`, `formulas` e o `$…$` do caderno
 * dos cartões). Só o pedaço de LaTeX que as fichas usam: \frac, ^, _, \sqrt, \vec, \text, \cdot, \times, \Delta e as
 * letras gregas, \Rightarrow, \approx, espaços (\, \; \quad \qquad "\ "), \overset{N}{=}, {,} (vírgula decimal) e
 * \begin{gathered} ... \\ ... \end{gathered} (uma fórmula em várias linhas).
 *
 * Duas saídas:
 * - `analisaLatex`: árvore para desenhar (ui/Formula.tsx), com a fração SEMPRE empilhada;
 * - `latexParaMotor`: o texto no formato que o motor da resolução animada lê (logica/motorConta.ts): frações "a/b"
 *   que o site empilha (logica/fracao.ts), índices e expoentes em Unicode, uma linha por "\\" ou "⇒". Devolve null
 *   quando não dá para escrever sem perder nada (ex.: índice com letra sem forma Unicode, como f_{cat}).
 */

export type NoMat =
  | { t: 'txt'; v: string; texto?: boolean }
  | { t: 'frac'; n: NoMat[]; d: NoMat[] }
  | { t: 'sup'; v: NoMat[] }
  | { t: 'sub'; v: NoMat[] }
  | { t: 'raiz'; v: NoMat[] }
  | { t: 'vet'; v: NoMat[] }
  | { t: 'sobre'; topo: NoMat[]; v: NoMat[] }
  | { t: 'esp'; w: 1 | 2 | 3 | 4 };

const SIMBOLOS: Record<string, string> = {
  cdot: '·', times: '×', div: '÷', pm: '±', mp: '∓', Rightarrow: '⇒', Leftarrow: '⇐', rightarrow: '→', to: '→',
  leftarrow: '←', approx: '≈', neq: '≠', ne: '≠', leq: '≤', le: '≤', geq: '≥', ge: '≥', infty: '∞', circ: '°', degree: '°',
  ldots: '…', cdots: '⋯', dots: '…', propto: '∝', parallel: '∥', perp: '⊥',
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε', varepsilon: 'ε', theta: 'θ', lambda: 'λ', mu: 'μ', pi: 'π',
  rho: 'ρ', sigma: 'σ', tau: 'τ', phi: 'φ', varphi: 'φ', omega: 'ω', eta: 'η', nu: 'ν', kappa: 'κ', xi: 'ξ', zeta: 'ζ', chi: 'χ', psi: 'ψ',
  Delta: 'Δ', Omega: 'Ω', Sigma: 'Σ', Phi: 'Φ', Theta: 'Θ', Lambda: 'Λ', Pi: 'Π', Gamma: 'Γ', Psi: 'Ψ',
  // funções: escritas em pé, como no caderno
  cos: 'cos', sin: 'sen', sen: 'sen', tan: 'tg', tg: 'tg', log: 'log', ln: 'ln',
};
const ESPACOS: Record<string, 1 | 2 | 3 | 4> = { ',': 1, ':': 1, '>': 1, ';': 2, ' ': 2, quad: 3, qquad: 4 };
const IGNORA = new Set(['left', 'right', 'displaystyle', 'textstyle', 'big', 'Big', 'bigl', 'bigr', 'mathrm', 'mathit']);

/** Analisa uma fórmula. Devolve as linhas (um "\\" dentro de gathered/aligned quebra a linha). */
export function analisaLatex(src: string): NoMat[][] {
  const s = src.replace(/\\begin\{(?:gathered|aligned|array|matrix)\}(?:\{[^}]*\})?/g, '').replace(/\\end\{(?:gathered|aligned|array|matrix)\}/g, '');
  let i = 0;
  const linhas: NoMat[][] = [[]];

  const txt = (out: NoMat[], v: string, texto = false) => {
    const ult = out[out.length - 1];
    if (ult && ult.t === 'txt' && !!ult.texto === texto) ult.v += v;
    else out.push(texto ? { t: 'txt', v, texto: true } : { t: 'txt', v });
  };

  /** lê um grupo {…} ou um único símbolo (para ^, _, \frac sem chaves) */
  function argumento(): NoMat[] {
    while (s[i] === ' ') i++;
    if (s[i] === '{') { i++; const r = sequencia('}'); i++; return r; }
    if (s[i] === '\\') { const out: NoMat[] = []; comando(out); return out; }
    const c = s[i++] || '';
    return c ? [{ t: 'txt', v: c }] : [];
  }

  /** texto cru de um grupo {…} (\text, \mathrm): chaves internas só agrupam */
  function grupoTexto(): string {
    while (s[i] === ' ') i++;
    if (s[i] !== '{') return s[i++] || '';
    let prof = 0, out = '';
    for (; i < s.length; i++) {
      const c = s[i];
      if (c === '{') { if (prof++ > 0) out += ''; continue; }
      if (c === '}') { if (--prof === 0) { i++; break; } continue; }
      if (c === '\\' && s[i + 1] && /[ ,;{}%$&#_]/.test(s[i + 1])) { out += s[i + 1] === ',' || s[i + 1] === ';' ? ' ' : s[i + 1]; i++; continue; }
      out += c;
    }
    return out;
  }

  function comando(out: NoMat[]) {
    i++; // '\'
    if (s[i] === '\\') { i++; linhas.push([]); return 'quebra'; }
    const m = /^[A-Za-z]+/.exec(s.slice(i));
    if (!m) { // \, \; \  \{ \}
      const c = s[i++];
      if (c in ESPACOS) out.push({ t: 'esp', w: ESPACOS[c] });
      else if (c === '!') { /* espaço negativo: nada */ }
      else txt(out, c);
      return;
    }
    const nome = m[0];
    i += nome.length;
    // como no LaTeX, o espaço depois de um comando de letras é engolido ("\Delta s" é "Δs")
    while (s[i] === ' ') i++;
    if (nome in ESPACOS) { out.push({ t: 'esp', w: ESPACOS[nome] }); return; }
    if (nome === 'mathrm' || nome === 'mathit' || nome === 'mathbf' || nome === 'ce') {
      // fórmula em pé (H_2O): o conteúdo é lido como fórmula, com índice e expoente
      for (const x of argumento()) if (x.t === 'txt') txt(out, x.v); else out.push(x);
      return;
    }
    if (IGNORA.has(nome)) return;
    switch (nome) {
      case 'frac': case 'dfrac': case 'tfrac': { const n = argumento(); const d = argumento(); out.push({ t: 'frac', n, d }); return; }
      case 'sqrt': { out.push({ t: 'raiz', v: argumento() }); return; }
      case 'hat': case 'widehat': { const a = argumento(); for (const x of a) if (x.t === 'txt') txt(out, x.v + '\u0302'); else out.push(x); return; }
      case 'vec': case 'overrightarrow': { out.push({ t: 'vet', v: argumento() }); return; }
      case 'xrightarrow': case 'xleftarrow': {
        // seta com o que está em cima ("\xrightarrow{nitrificação}")
        while (s[i] === ' ') i++;
        if (s[i] === '[') { const f = s.indexOf(']', i); i = f < 0 ? i : f + 1; }
        const topo = argumento();
        out.push({ t: 'sobre', topo, v: [{ t: 'txt', v: nome === 'xrightarrow' ? ' → ' : ' ← ' }] });
        return;
      }
      case 'overset': case 'stackrel': { const topo = argumento(); const v = argumento(); out.push({ t: 'sobre', topo, v }); return; }
      case 'text': case 'textrm': case 'textit': case 'textbf': case 'mbox': case 'operatorname': {
        const t = grupoTexto();
        // \text{sen} e unidades ficam no corpo da fórmula; palavras (2 letras ou mais e um espaço) são texto
        txt(out, t, /[A-Za-zÀ-ÿ]{2,}\s|\s[A-Za-zÀ-ÿ]{2,}/.test(t));
        return;
      }
      default:
        if (nome in SIMBOLOS) {
          const v = SIMBOLOS[nome];
          // operação e relação ficam entre espaços ("v · t", "⇒"), como no caderno
          if (/^[·×÷±∓⇒⇐→←≈≠≤≥∝]$/.test(v)) { txt(out, ' ' + v + ' '); return; }
          // função seguida de letra: um espaço fino ("cos θ")
          txt(out, v);
          if (/^(cos|sen|tg|log|ln)$/.test(v) && /^\s*[A-Za-z0-9\\α-ω]/.test(s.slice(i))) out.push({ t: 'esp', w: 1 });
          return;
        }
        txt(out, nome); // comando desconhecido: o nome, para não sumir nada
    }
  }

  function sequencia(fim?: string): NoMat[] {
    const out: NoMat[] = [];
    while (i < s.length) {
      const c = s[i];
      if (fim && c === fim) return out;
      if (c === '\\') {
        if (s[i + 1] === '\\' && !fim) { i += 2; linhas[linhas.length - 1].push(...out); out.length = 0; linhas.push([]); continue; }
        comando(out);
        continue;
      }
      if (c === '^' || c === '_') {
        i++;
        const v = argumento();
        // ^\circ (ou ^{\circ}) é o grau: o símbolo na linha, não um expoente
        if (c === '^' && v.length === 1 && v[0].t === 'txt' && v[0].v.trim() === '°') { txt(out, '°'); continue; }
        out.push({ t: c === '^' ? 'sup' : 'sub', v });
        continue;
      }
      if (c === '{') {
        // {,} é a vírgula decimal; outro grupo só agrupa
        i++; const g = sequencia('}'); i++;
        for (const x of g) if (x.t === 'txt') txt(out, x.v, x.texto); else out.push(x);
        continue;
      }
      if (c === '}') { i++; continue; }
      if (c === '~') { out.push({ t: 'esp', w: 2 }); i++; continue; }
      if (c === ' ') { i++; if (out.length && !(out[out.length - 1].t === 'esp')) txt(out, ' '); continue; }
      txt(out, c === '-' ? '−' : c === "'" ? '′' : c);
      i++;
    }
    return out;
  }

  const resto = sequencia();
  linhas[linhas.length - 1].push(...resto);
  return linhas.map(limpaEspacos).filter((l) => l.length);
}

/** espaços repetidos viram um só; nada de espaço nas pontas */
function limpaEspacos(l: NoMat[]): NoMat[] {
  const out: NoMat[] = [];
  for (const n of l) {
    if (n.t === 'txt') {
      const v = n.v.replace(/\s+/g, ' ');
      if (!v) continue;
      const ult = out[out.length - 1];
      if (ult && ult.t === 'txt' && !!ult.texto === !!n.texto) { ult.v = (ult.v + v).replace(/\s+/g, ' '); continue; }
      out.push({ ...n, v });
    } else out.push(n);
  }
  while (out.length && ((out[0].t === 'txt' && !(out[0] as { v: string }).v.trim()) || out[0].t === 'esp')) out.shift();
  while (out.length) {
    const u = out[out.length - 1];
    if (u.t === 'esp') { out.pop(); continue; }
    if (u.t === 'txt') { u.v = u.v.replace(/\s+$/, ''); if (!u.v) { out.pop(); continue; } }
    break;
  }
  if (out[0] && out[0].t === 'txt') out[0].v = out[0].v.replace(/^\s+/, '');
  return out;
}

/* ======================================================== texto simples (motor, leitor de tela) */

const SOBRESCRITO: Record<string, string> = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', '−': '⁻', '-': '⁻', '+': '⁺', n: 'ⁿ' };
const SUBSCRITO: Record<string, string> = {
  0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉', '+': '₊', '−': '₋', '-': '₋',
  a: 'ₐ', e: 'ₑ', o: 'ₒ', x: 'ₓ', h: 'ₕ', k: 'ₖ', l: 'ₗ', m: 'ₘ', n: 'ₙ', p: 'ₚ', s: 'ₛ', t: 'ₜ', i: 'ᵢ', r: 'ᵣ', u: 'ᵤ', v: 'ᵥ', j: 'ⱼ',
};

function plano(ns: NoMat[], ok: { v: boolean }, fracao: 'barra' | 'sobre'): string {
  let out = '';
  for (const n of ns) {
    switch (n.t) {
      case 'txt': out += n.v; break;
      case 'esp': out += n.w >= 3 ? '   ' : n.w === 1 ? '\u2009' : ' '; break;
      case 'sup': case 'sub': {
        const mapa = n.t === 'sup' ? SOBRESCRITO : SUBSCRITO;
        const t = plano(n.v, ok, fracao).replace(/\s+/g, '');
        // motor: índice sempre como "_{…}" (o motor e logica/notacao.ts o descem na mesma letra à mão, várias letras
        // juntas); expoente sem forma pequena como "^(…)"
        if (fracao === 'barra' && n.t === 'sub') { out += `_{${t}}`; break; }
        if (fracao === 'barra' && n.t === 'sup' && ![...t].every((c) => mapa[c])) { out += t.length > 1 ? `^(${t})` : `^${t}`; break; }
        const u = [...t].map((c) => mapa[c]);
        if (u.every(Boolean)) out += u.join('');
        else if (n.t === 'sub' && /^(máx|mín|max|min)$/.test(t)) out += t === 'máx' || t === 'max' ? 'ₘₐₓ' : 'ₘᵢₙ';
        else { ok.v = false; out += (n.t === 'sup' ? '^' : '_') + (t.length > 1 ? `(${t})` : t); }
        break;
      }
      case 'raiz': { const t = plano(n.v, ok, fracao); out += '√' + (/^[\w,.]+$/.test(t) ? t : `(${t})`); break; }
      case 'vet': out += plano(n.v, ok, fracao) + '⃗'; break;
      case 'sobre': out += plano(n.v, ok, fracao); break;
      case 'frac': {
        const a = plano(n.n, ok, fracao).trim(), b = plano(n.d, ok, fracao).trim();
        if (fracao === 'sobre') { out += `${a} sobre ${b}`; break; }
        const emb = (x: string) => (/^\d+(?:[.,]\d+)?$|^[A-Za-zα-ωπθ]$/.test(x) || (/^\([^()]*\)$/.test(x)) ? x : `(${x})`);
        out += `${emb(a)}/${emb(b)}`;
        break;
      }
    }
  }
  return out;
}

/** Texto para leitor de tela e busca: "v igual a ..." não; só a fórmula em linha, com "sobre" no lugar da barra. */
export function latexParaLeitura(src: string): string {
  return analisaLatex(src).map((l) => plano(l, { v: true }, 'sobre').replace(/\s+/g, ' ').trim()).join('; ');
}

const CONTA_FRAC = /\\[dt]?frac/g;

/**
 * Texto de uma `conta` para o motor (uma linha por "\\" e por "⇒"): "\frac{400}{10}" vira "400/10", que o site empilha.
 * null quando não dá para escrever sem perder nada: índice sem forma Unicode, fração que o leitor de frações do site
 * não reconheceria (logo, ficaria em linha) ou fração dentro de fração.
 */
export function latexParaMotor(src: string, contaFracoes: (linha: string) => number, texto = false): string | null {
  const ok = { v: true };
  const linhas = analisaLatex(src);
  const out: string[] = [];
  if (texto) {
    // Humanas: passos de raciocínio em \text{}; a quebra que só corta a frase (linha seguinte em minúscula) some
    for (const l of linhas) {
      const t = plano(l, ok, 'barra').replace(/\s+/g, ' ').trim();
      if (out.length && continuaFrase(out[out.length - 1], t)) out[out.length - 1] += ' ' + t; else if (t) out.push(t);
    }
    return out.join('\n');
  }
  for (const l of linhas) {
    // espaço fino entre algarismos é o separador de milhar ("1\,000" → "1 000", que o motor lê como um número)
    // e entre número e letra é produto ("10\,\Delta s" → "10Δs": o coeficiente colado, como o motor reconhece)
    const txt = plano(l, ok, 'barra').replace(/(\d)\u2009(?=\d{3}(?!\d))/g, '$1\u202F').replace(/(\d)\u2009(?=[A-Za-zΔα-ω])/g, '$1')
      .replace(/[^\S\u202F]+/g, ' ').trim();
    for (const parte of txt.split(/\s*⇒\s*/)) if (parte) out.push(parte);
  }
  if (!ok.v) return null;
  const esperado = (src.match(CONTA_FRAC) || []).length;
  if (esperado !== out.reduce((a, l) => a + contaFracoes(l), 0)) return null;
  return out.join('\n');
}

/** A linha de baixo continua a frase de cima (começa em minúscula) ou é um item novo da lista (começa com a mesma palavra
 *  da de cima: "risca 'a': ..." / "risca 'b': ...")? */
export function continuaFrase(ant: string, prox: string): boolean {
  if (!/^[a-zà-ÿ]/.test(prox)) return false;
  // duas relações em paralelo ("a = b" / "c = d"): itens, não a mesma frase
  if (/[=→⇒×]/.test(ant) && /[=→⇒×]/.test(prox)) return false;
  const p1 = ant.trim().split(/\s+/)[0], p2 = prox.trim().split(/\s+/)[0];
  return p1.toLowerCase() !== p2.toLowerCase();
}

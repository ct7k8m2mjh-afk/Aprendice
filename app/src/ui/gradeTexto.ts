/* TEXTO NA GRADE DO CADERNO (aprovado pelo dono em 27/11/2026, variante compacta; estilo em estilo/grade-texto.css).
   O CSS põe cada título em quadrados inteiros (48 px) e cada texto de apoio em meios quadrados (24 px), com a base
   das letras na linha. O que o CSS não sabe é onde cada bloco começa: depois de um texto de uma linha, de abas ou de um
   cartão de altura qualquer, o próximo bloco começaria fora da linha. Aqui, a cada mudança de tela ou de tamanho, o
   topo de cada título, texto e bloco do conteúdo é levado a uma linha desenhada do quadriculado, guardando uma folga
   mínima do que vem antes (ver abaixo). Títulos e textos vão sempre para a linha do quadro (48 px); cartões e outros
   blocos, para a linha do quadro ou para a meia linha (24 px). Liga a classe `grade-texto` no <html> (o CSS depende dela). */

export const SELETOR_TITULO = '.titulo-pag h1, .tema-cab h1, .in-cab h1, .in-mats > .in-sec-tit, .conteudo > .secao:not(.bloco, .tp-bloco) > .sec-tit, .pag-estreita > .secao:not(.bloco, .tp-bloco) > .sec-tit, .vazio h3, .hj-como h2, .conteudo > .mat-cab .tit-mat';
export const SELETOR_TEXTO = '.titulo-pag .sub, .tema-cab .sub, .conteudo > .migalhas, .pag-estreita > .migalhas, .in-cab p, .fr-frase, .vazio p, .hj-como p, .conteudo > p.fraco';
/** blocos de cada tela: os filhos da coluna de conteúdo (e da coluna estreita da escada, que fica dentro dela) */
const SELETOR_BLOCOS = ':scope > *, :scope > .pag-estreita > *';
const PASSO = 48;
const FOLGA_MIN = 8;

const mexidos = new Map<HTMLElement, [string, string, string]>();
const guarda = (el: HTMLElement) => { if (!mexidos.has(el)) mexidos.set(el, [el.style.marginTop, el.style.marginBottom, el.style.display]); };

/** onde termina o que se vê de um bloco: sem fundo/borda/padding embaixo, é o fim do último filho (não a margem que ele carrega) */
function fundoVisual(el: HTMLElement): number {
  let x: Element = el;
  for (;;) {
    const s = getComputedStyle(x);
    const ult = x.lastElementChild;
    if (!ult || parseFloat(s.paddingBottom) || parseFloat(s.borderBottomWidth) || s.backgroundColor !== 'rgba(0, 0, 0, 0)' || s.overflow !== 'visible') break;
    x = ult;
  }
  return x.getBoundingClientRect().bottom;
}

/** Navegador sem `text-box` (Firefox, Chrome antigo): o corte da caixa no topo das maiúsculas e na base da última linha é
 * medido aqui. `--gt-a` (o que sobra acima das maiúsculas) desconta do padding-top (grade-texto.css) e `baixoSobra` (o que
 * sobra abaixo da base) é descontado ao medir a folga do bloco seguinte, para o texto ficar onde ficaria com o corte. */
export const SEM_TRIM = typeof CSS === 'undefined' || !CSS.supports?.('text-box', 'trim-both cap alphabetic');
const baixoSobra = new WeakMap<Element, number>();

function marcaSonda(el: HTMLElement, noFim: boolean): number {
  const s = document.createElement('span');
  s.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
  if (noFim) el.appendChild(s); else el.insertBefore(s, el.firstChild);
  const y = s.getBoundingClientRect().top;
  s.remove();
  return y;
}

function medeCorte(el: HTMLElement) {
  if (!el.firstChild) return;
  const cs = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  if (!r.height) return;
  const cap = document.createElement('span');
  cap.style.cssText = 'position:absolute;visibility:hidden;width:0;height:1cap';
  el.appendChild(cap);
  const capH = cap.getBoundingClientRect().height;
  cap.remove();
  const topoConteudo = r.top + parseFloat(cs.borderTopWidth) + parseFloat(cs.paddingTop);
  const baseConteudo = r.bottom - parseFloat(cs.borderBottomWidth) - parseFloat(cs.paddingBottom);
  const a = marcaSonda(el, false) - topoConteudo - capH;
  const b = baseConteudo - marcaSonda(el, true);
  el.style.setProperty('--gt-a', `${Math.max(0, a).toFixed(2)}px`);
  baixoSobra.set(el, Math.max(0, b));
}

function alinha() {
  if (!document.documentElement.classList.contains('grade-texto')) return;
  // volta tudo ao original antes de medir (tela nova, largura nova)
  for (const [el, [mt, mb, di]] of mexidos) { el.style.marginTop = mt; el.style.marginBottom = mb; el.style.display = di; }
  mexidos.clear();
  const cont = document.querySelector<HTMLElement>('.conteudo');
  if (!cont) return;
  const marcados = Array.from(cont.querySelectorAll<HTMLElement>(`${SELETOR_TITULO}, ${SELETOR_TEXTO}`));
  if (SEM_TRIM) for (const m of marcados) medeCorte(m);
  const alvos = new Set<HTMLElement>();
  for (const f of Array.from(cont.querySelectorAll<HTMLElement>(SELETOR_BLOCOS))) alvos.add(f);
  for (const m of marcados) {
    alvos.add(m);
    const prox = m.nextElementSibling as HTMLElement | null;
    if (prox) alvos.add(prox);
  }
  // ordem do documento: cada ajuste só mexe no que vem depois
  const lista = Array.from(alvos).sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
  // a mesma origem da grade desenhada (grade-texto.css): topo da coluna principal + barra do topo + meia linha
  const principal = cont.closest('.principal') ?? cont;
  const raizCs = getComputedStyle(document.documentElement);
  const origem = principal.getBoundingClientRect().top + parseFloat(raizCs.getPropertyValue('--topo')) + PASSO / 2; // --gt-topo = meia linha
  const passoBloco = PASSO / 2; // blocos: na linha ou na meia linha (variante compacta aprovada pelo dono)
  for (const el of lista) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.display === 'contents' || cs.position === 'absolute' || cs.position === 'fixed' || cs.position === 'sticky') continue;
    const pai = el.parentElement!;
    const pcs = getComputedStyle(pai);
    const fluxo = pcs.display === 'block' || pcs.display === 'flow-root' || pcs.display === 'list-item';
    // o topo de tudo vai para uma linha desenhada. Folga mínima até o que se vê do bloco anterior: texto de apoio, 0
    // (entra no quadrado logo abaixo do título); título, cartões e outros blocos, 8 px (um título que vem depois de um
    // apoio de uma linha entra no quadrado seguinte; depois de um apoio de duas linhas, pula um quadrado)
    const ehTexto = el.matches(SELETOR_TEXTO);
    const primeiro = el.firstElementChild;
    const comecaPorTitulo = el.matches(SELETOR_TITULO) || (!!primeiro && primeiro.matches(SELETOR_TITULO));
    const temAnterior = !!el.previousElementSibling;
    const folgaMin = ehTexto || !temAnterior ? 0 : FOLGA_MIN;
    const passo = ehTexto || comecaPorTitulo ? PASSO : passoBloco;
    for (let volta = 0; volta < 3; volta++) {
      const r = el.getBoundingClientRect();
      if (!r.height) break;
      const resto = (((r.top - origem) % passo) + passo) % passo;
      if (resto < 0.5 || resto > passo - 0.5) break;
      const ant = el.previousElementSibling as HTMLElement | null;
      const base = ant ? fundoVisual(ant) - (baixoSobra.get(ant) ?? 0) : pai.getBoundingClientRect().top + parseFloat(pcs.paddingTop) + parseFloat(pcs.borderTopWidth);
      const folga = r.top - base;
      const delta = folga - resto >= folgaMin - 0.5 && (ehTexto || comecaPorTitulo || resto < passo - resto) ? -resto : passo - resto;
      guarda(el);
      if (fluxo && ant) {
        // no fluxo de bloco as margens se somam pelo maior (colapso): zera a de baixo do anterior e põe o espaço todo aqui
        guarda(ant);
        ant.style.marginBottom = '0px';
        // a margem do último filho do anterior também "vaza" e se soma pelo maior: o anterior passa a contê-la
        if (getComputedStyle(ant).display === 'block') ant.style.display = 'flow-root';
        el.style.marginTop = `${r.top - ant.getBoundingClientRect().bottom + delta}px`;
      } else {
        el.style.marginTop = `${parseFloat(getComputedStyle(el).marginTop) + delta}px`;
      }
    }
  }
}

export function iniciaGradeTexto() {
  document.documentElement.classList.add('grade-texto');
  if (SEM_TRIM) document.documentElement.classList.add('gt-sem-trim');
  let pedido = 0;
  const agenda = () => { if (!pedido) pedido = requestAnimationFrame(() => { pedido = 0; alinha(); }); };
  const raiz = document.getElementById('raiz');
  if (raiz) new MutationObserver(agenda).observe(raiz, { childList: true, subtree: true, characterData: true });
  const ro = new ResizeObserver(agenda);
  const observa = () => { const c = document.querySelector('.conteudo'); if (c) ro.observe(c); };
  new MutationObserver(observa).observe(document.body, { childList: true, subtree: true });
  addEventListener('resize', agenda);
  // entradas animadas (translateY) mudam a medida enquanto rodam: mede de novo quando terminam
  document.addEventListener('animationend', agenda, true);
  document.addEventListener('transitionend', agenda, true);
  document.fonts?.ready.then(agenda);
  agenda();
}

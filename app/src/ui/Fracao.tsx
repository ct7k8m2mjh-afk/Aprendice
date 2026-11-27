import { createContext, Fragment, useContext, type ReactNode } from 'react';
import { ehFracaoUnicode, partesFracao, type ParteFracao } from '../logica/fracao';
import { partesNotacao } from '../logica/notacao';
import { miudos, trechoMao } from './maoGlifos';

/**
 * Mostra o texto com as frações empilhadas (numerador, barra, denominador), montadas pelo layout (guia tipográfico),
 * e com expoente, índice e fórmula química de verdade (logica/notacao.ts: "10^−2", "V_R", "H2SO4", "H+").
 * Divisão com "÷" ou "/" entre espaços também empilha (comando 20). Notação de nuclídeo ("207/82 Pb") sai como
 * índices antes do símbolo, sem barra.
 * O texto não muda: o sinal escrito ("/", " ÷ ", "^", "_") e os parênteses que o layout tira continuam no documento,
 * escondidos, para leitor de tela, copiar e colar e testes.
 */
export function comFracoes(texto: string, inteira = false, titulo = false, mao = false): ReactNode {
  if (mao) return <NaMao.Provider value><TextoComFracoes texto={texto} inteira={inteira} titulo={titulo} /></NaMao.Provider>;
  return <TextoComFracoes texto={texto} inteira={inteira} titulo={titulo} />;
}

/** O texto está na letra à mão (Caveat: item de fórmula do "No caderno"). Os sinais que a Caveat não tem (Δ, setas, √,
 *  letras gregas, números pequenos) saem desenhados no traço da caneta, na altura das letras vizinhas (ui/maoGlifos.tsx),
 *  como na resolução animada; antes vinham de outra fonte, maiores e fora da linha (pedido do dono, 27/11/2026). */
const NaMao = createContext(false);

/* Conta dentro de texto e de título (dono, 27/11/2026, opção B): "o usuário não consegue distinguir o que é conta e o
   que é texto". A expressão ("s × t", "v = λ · f", "ax² + bx + c = 0", "Δs", "Δ ≥ 0") vai num <span class="mt"> na letra à
   mão do caderno (Caveat, tinta do caderno; tipografia.css), com os sinais desenhados, e não quebra no meio. */
const MarcaConta = createContext(false);
const OP = '[×=+−·÷<>≤≥≠≈]';
const TOK = '(?:[ΔΣ√]?[A-Za-zα-ωΩΔλ]{1,2}[₀-₉⁰-⁹²³¹ⁿ]*|\\d+(?:,\\d+)?[A-Za-zα-ω]{0,2}[⁰-⁹²³¹ⁿ]*)';
const RE_EXPR = new RegExp(`(?<![\\wÀ-ÿ])(?:${TOK}(?: ?${OP} ?${TOK})+|Δ[A-Za-z]*|[A-Za-z][²³ⁿ])(?![\\wÀ-ÿ])`, 'gu');
/** expressão matemática dentro de uma frase: precisa de um operador entre termos curtos, ou de um Δ, ou de "x²" */
export function partesExpressao(s: string): { v: string; conta: boolean }[] {
  const out: { v: string; conta: boolean }[] = [];
  let ult = 0;
  RE_EXPR.lastIndex = 0;
  for (let m = RE_EXPR.exec(s); m; m = RE_EXPR.exec(s)) {
    // conta precisa de uma letra ou de um sinal ("2 + 3" entre números também é conta); palavra sozinha não é
    if (!/[A-Za-zα-ωΔ]/.test(m[0]) && !new RegExp(OP).test(m[0])) continue;
    if (m.index > ult) out.push({ v: s.slice(ult, m.index), conta: false });
    out.push({ v: m[0], conta: true });
    ult = m.index + m[0].length;
  }
  if (ult < s.length) out.push({ v: s.slice(ult), conta: false });
  return out;
}
function marcaContas(s: string, k: string): ReactNode {
  const ps = partesExpressao(s);
  if (!ps.some((p) => p.conta)) return miudos(s, k);
  return ps.map((p, i) => (p.conta
    ? <span key={`${k}${i}`} className="mt">{trechoMao(p.v, `${k}${i}m`)}</span>
    : <Fragment key={`${k}${i}`}>{miudos(p.v, `${k}${i}t`)}</Fragment>));
}
/** texto com as contas marcadas (título e texto do cartão de teoria) */
export function comContasMarcadas(texto: string, titulo = false): ReactNode {
  return <MarcaConta.Provider value><TextoComFracoes texto={texto} titulo={titulo} /></MarcaConta.Provider>;
}
/** Matéria do texto mostrado (revisão de 21/11/2026, dados R1): nas matérias de texto (Português, História, Geografia,
 *  Filosofia e Sociologia, Inglês) a barra entre números fora de conta é data, lei ou período, não fração. A tela da
 *  matéria e a correção da questão dizem qual é; fora delas vale a regra geral. */
export const MateriaDoTexto = createContext<string | undefined>(undefined);

/** Física (pedido do dono, 27/11/2026): grandeza maiúscula com índice escrito sem "_" ("R1", "V2", "E0") também tem o
 *  índice menor e mais baixo. Vale quando a matéria do texto é Física (MateriaDoTexto) ou a tela diz (teoria de Física). */
export const IndiceMaiusculo = createContext(false);

function TextoComFracoes({ texto, inteira, titulo }: { texto: string; inteira?: boolean; titulo?: boolean }) {
  const materia = useContext(MateriaDoTexto);
  const maiusc = useContext(IndiceMaiusculo) || materia === 'fis';
  return <>{desenhaFracoes(texto, materia, inteira, titulo, useContext(NaMao), useContext(MarcaConta), maiusc)}</>;
}

/** `titulo`: o texto é o título do passo (passada 10 C3: "Calcule T/V em cada ponto" empilha) */
function desenhaFracoes(texto: string, materia?: string, inteira = false, titulo = false, mao = false, marca = false, maiusc = false): ReactNode {
  const partes = partesFracao(texto, materia, inteira, titulo);
  if (partes.length === 1 && partes[0].t === 'txt') return comNotacao(texto, mao, marca, maiusc);
  return partes.map((p, i) => p.t === 'txt' ? <Fragment key={i}>{comNotacao(p.v, mao, marca, maiusc)}</Fragment> : p.t === 'nuc' ? (
    // nuclídeo: número de massa em cima e número atômico embaixo, à esquerda do símbolo, sem barra
    <span key={i} className="nuc">
      <span className="nuc-a">{p.a}</span><span className="sr">/</span><span className="nuc-z">{p.z}</span><span className="sr"> </span>
    </span>
  ) : <Fracao key={i} p={p} />);
}

/** fração empilhada; numerador e denominador podem ter outra fração dentro ("(x ÷ 6) ÷ (1 − x²)") */
export function Fracao({ p, n, d, className = 'frac', props }: {
  p: Extract<ParteFracao, { t: 'frac' }>; n?: ReactNode; d?: ReactNode; className?: string; props?: Record<string, unknown>;
}) {
  // fração do Unicode ("½"): os algarismos desenhados ficam fora do texto, que continua o caractere dos dados
  // (revisão de 21/11/2026, questão-correção 2 R4)
  if (ehFracaoUnicode(p.orig)) return (
    <span className={className} {...props}>
      <span className="frac-n" data-p="n" aria-hidden="true">{n ?? p.n}</span>
      <span className="frac-d" data-p="d" aria-hidden="true">{d ?? p.d}</span>
      <span className="sr">{p.orig}</span>
    </span>
  );
  return (
    <span className={className} {...props}>
      {p.pn && <span className="sr">(</span>}
      <span className="frac-n" data-p="n">{n ?? <MarcaConta.Provider value={false}><TextoComFracoes texto={p.n} inteira /></MarcaConta.Provider>}</span>
      {p.pn && <span className="sr">)</span>}
      <span className="sr">{p.sep ?? '/'}</span>
      {p.pd && <span className="sr">(</span>}
      <span className="frac-d" data-p="d">{d ?? <MarcaConta.Provider value={false}><TextoComFracoes texto={p.d} inteira /></MarcaConta.Provider>}</span>
      {p.pd && <span className="sr">)</span>}
    </span>
  );
}

/** expoente, índice e fórmula química (o sinal escrito fica escondido). Fração dentro do expoente ou do índice
 *  ("(½)^(t/6)", "2^(t/20)", "log₁/₂ x") também sai empilhada, pequena (revisão de 21/11/2026, matérias-2 R1). */
export function comNotacao(s: string, mao = false, marca = false, maiusc = false): ReactNode {
  const ps = partesNotacao(s, maiusc);
  if (ps.length === 1 && ps[0].t === 'txt') return comFracaoMiuda(s, mao, marca);
  return ps.map((p, i) => {
    if (p.t === 'txt') return <Fragment key={i}>{comFracaoMiuda(p.v, mao, marca)}</Fragment>;
    const temFrac = p.v.includes('/') && partesFracao(p.v).some((x) => x.t === 'frac');
    const v = temFrac ? comFracoes(p.v, false, false, mao) : mao ? trechoMao(p.v, `n${i}`) : p.v;
    const cls = temFrac ? ' nt-frac' : '';
    return (
      <Fragment key={i}>
        {p.pre && <span className="sr">{p.pre}</span>}
        {p.t === 'sup' ? <sup className={'nt-sup' + cls}>{v}</sup> : <sub className={'nt-sub' + cls}>{v}</sub>}
        {p.pos && <span className="sr">{p.pos}</span>}
      </Fragment>
    );
  });
}

// fração escrita com algarismos já sobrescritos ou subscritos do Unicode ("log₁/₂ x", "t₁/₂", "x¹/²")
const SUBS = '₀₁₂₃₄₅₆₇₈₉', SUPS = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const RE_FRAC_MIUDA = /([₀-₉]+)\/([₀-₉]+)|([⁰¹²³⁴-⁹]+)\/([⁰¹²³⁴-⁹]+)/g;
const algarismos = (x: string) => [...x].map((c) => String(Math.max(SUBS.indexOf(c), SUPS.indexOf(c)))).join('');

/** "₁/₂" vira índice com a fração empilhada. O texto do documento continua o dos dados ("₁/₂", escondido para leitor
 *  de tela, copiar e colar e testes); os algarismos desenhados vêm do CSS (atributo data-v), fora do texto. */
function comFracaoMiuda(s: string, mao = false, marca = false): ReactNode {
  if (!/[₀-₉⁰-⁹¹²³]\/[₀-₉⁰-⁹¹²³]/.test(s)) return semQuebraNaRelacao(s, mao, marca);
  const out: ReactNode[] = [];
  let ult = 0;
  RE_FRAC_MIUDA.lastIndex = 0;
  for (let m = RE_FRAC_MIUDA.exec(s); m; m = RE_FRAC_MIUDA.exec(s)) {
    const sub = m[1] != null;
    const n = algarismos(sub ? m[1] : m[3]), d = algarismos(sub ? m[2] : m[4]);
    if (m.index > ult) out.push(semQuebraNaRelacao(s.slice(ult, m.index), mao));
    const Tag = sub ? 'sub' : 'sup';
    out.push(
      <Fragment key={m.index}>
        <Tag className={(sub ? 'nt-sub' : 'nt-sup') + ' nt-frac'} aria-hidden="true">
          <span className="frac"><span className="frac-n frac-v" data-v={n} /><span className="frac-d frac-v" data-v={d} /></span>
        </Tag>
        <span className="sr">{m[0]}</span>
      </Fragment>,
    );
    ult = m.index + m[0].length;
  }
  if (ult < s.length) out.push(semQuebraNaRelacao(s.slice(ult), mao));
  return out;
}

/** Relação curta ("q < 0", "Q > 0", "x ≤ 2", "v = 0") não quebra no meio da linha (revisão de 21/11/2026, 4ª passada T4:
 *  "q <" ficava no fim de uma linha e o "0" ia para a seguinte). O texto não muda: só um <span> que não quebra. */
const RE_RELACAO = /(?<![^\s(])([^\s()]{1,8}) ([<>=≤≥≠≈]) ([^\s()]{1,8})(?=$|[\s,;.:)])/g;
function semQuebraNaRelacao(s: string, mao = false, marca = false): ReactNode {
  const tx = (x: string, k: string): ReactNode => (mao ? <Fragment key={k}>{trechoMao(x, k)}</Fragment> : marca ? <Fragment key={k}>{marcaContas(x, k)}</Fragment> : <Fragment key={k}>{miudos(x, k)}</Fragment>);
  // com a conta marcada, a expressão inteira já não quebra no meio (CSS .mt): a regra da relação curta fica de fora
  if (marca || !/ [<>=≤≥≠≈] /.test(s)) return tx(s, 'm');
  const out: ReactNode[] = [];
  let ult = 0;
  RE_RELACAO.lastIndex = 0;
  for (let m = RE_RELACAO.exec(s); m; m = RE_RELACAO.exec(s)) {
    if (m.index > ult) out.push(tx(s.slice(ult, m.index), `a${m.index}`));
    out.push(<span key={`r${m.index}`} className="nq">{tx(m[0], `b${m.index}`)}</span>);
    ult = m.index + m[0].length;
  }
  if (!out.length) return tx(s, 'm');
  if (ult < s.length) out.push(tx(s.slice(ult), 'z'));
  return out;
}

/** Texto com negrito marcado por **…** (cartões de teoria de Português; revisão de 19/11/2026, item 2): o trecho sai em
 *  <b>, o resto pelas frações e notação de sempre. Os ** ficam nos dados; asterisco solto (sem par) continua texto. */
export function comNegrito(texto: string, marca = false): ReactNode {
  const f = (v: string) => (marca ? comContasMarcadas(v) : comFracoes(v));
  if (!texto.includes('**')) return f(texto);
  const ps = texto.split(/\*\*(.+?)\*\*/);
  return ps.map((v, i) => (i % 2 ? <b key={i} className="negrito">{f(v)}</b> : <Fragment key={i}>{f(v)}</Fragment>));
}

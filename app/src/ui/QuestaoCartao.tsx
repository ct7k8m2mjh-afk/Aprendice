import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Letra, MateriaId, Questao } from '../dados/tipos';
import { avisoGabarito, numeroQuestao, origemGabarito } from '../dados/tipos';
import { creditoProva } from '../logica/creditoProva';
import { origemDoLink } from '../logica/origemLink';
import { blocosDoParagrafo, juntaQuebrasDoPdf, perdeDestaque } from '../logica/transcricao';
import { materiaDoCodigo } from '../logica/fracao';
import { urlPrint } from '../dados/conteudo';
import { Icone } from './Icone';
import { defineTelaCheia, useTelaCheia } from './telaCheia';
import type { Tentativa } from '../estado/tipos';

const LETRAS: Letra[] = ['A', 'B', 'C', 'D', 'E'];
export type Conf = NonNullable<Tentativa['conf']>;

/** Texto alternativo do print: o enunciado transcrito e as alternativas (princípio 1: o texto serve para acessibilidade e busca). */
export function textoAlternativo(q: Questao) {
  return [q.enun, ...LETRAS.filter((l) => q.alts[l]).map((l) => `${l}) ${q.alts[l]}`)].join('\n');
}

export function Lupa({ src, alt, aoFechar }: { src: string; alt: string; aoFechar: () => void }) {
  useEffect(() => {
    const f = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.stopPropagation(); aoFechar(); } };
    addEventListener('keydown', f, true);
    return () => removeEventListener('keydown', f, true);
  }, [aoFechar]);
  return (
    <div className="veu lupa" onClick={aoFechar} role="dialog" aria-modal="true" aria-label="Questão ampliada">
      <button className="btn-ic lupa-fecha" onClick={aoFechar} aria-label="Fechar"><Icone nome="fechar" /></button>
      <img src={src} alt={alt} onClick={(e) => e.stopPropagation()} />
    </div>
  );
}

/** Texto com a marcação da transcrição: **negrito**, ~~itálico~~, __sublinhado__ e quebras de linha. */
export function TextoBanca({ t }: { t: string }) {
  // "__" só marca quando cola numa palavra ("__trai__"); linha de lacuna ("_____") fica como está
  const partes = t.split(/(\*\*|~~|(?<!_)__(?=[^_\s])|(?<=[^_\s])__(?!_)|\n)/);
  const out: ReactNode[] = [];
  let neg = false, ita = false, sub = false;
  partes.forEach((p, i) => {
    if (p === '**') { neg = !neg; return; }
    if (p === '~~') { ita = !ita; return; }
    if (p === '__') { sub = !sub; return; }
    if (p === '\n') { out.push(<br key={i} />); return; }
    if (!p) return;
    let n: ReactNode = p;
    if (sub) n = <u key={'u' + i}>{n}</u>;
    if (ita) n = <i key={'i' + i}>{n}</i>;
    if (neg) n = <b key={'b' + i}>{n}</b>;
    out.push(<span key={i}>{n}</span>);
  });
  return <>{out}</>;
}

/** Questão só de texto: transcrição da prova oficial, organizada como a banca organizou, com a fonte entre parênteses. */
function EnunciadoTexto({ q }: { q: Questao }) {
  const tr = q.transcricao!;
  // quebras do PDF no meio da frase viram espaço; verso e quebra de propósito ficam (logica/transcricao.ts)
  const mat = materiaDoCodigo(q.modulo) || materiaDoCodigo(q.sub);
  return (
    <div className="q-transcricao">
      {/* o bloco de versos dentro do parágrafo sai como bloco próprio, como na prova (N13) */}
      {tr.enun.flatMap((p, i) => blocosDoParagrafo(juntaQuebrasDoPdf(p.t, mat)).map((b, j) => (
        <p key={`${i}-${j}`} className={'tr-' + p.a}>
          {i === 0 && j === 0 && <b className="tr-fonte">({q.escola} {q.ano}) </b>}
          <TextoBanca t={b} />
        </p>
      )))}
    </div>
  );
}

/** Largura do print (regra do protótipo, app-atual/design/materia.js: ajustaPrint). Acima de 700 px:
 *  - o print estreita até o print inteiro + letras + Confirmar caberem na altura da tela, sem ficar menor que 70% da
 *    escala de leitura (dono, 27/11/2026: "não é possível ver nem a metade da questão");
 *  - nunca passa de 1,3x o tamanho natural (1,05x quando a escala da letra foi medida): um print estreito não vira letra gigante;
 *  - senão fica na largura da coluna e a linha A–E + Confirmar fica presa ao pé da tela.
 *  A largura vai em --q-pw no cartão: o print fica centrado e a linha da resposta acompanha a largura dele. */
/** Distância entre as linhas do texto do print, em pixels naturais (0 se não der para medir). Os prints vêm de fontes com
 *  escalas muito diferentes (scan com ~28 px por linha, cadernos com ~10 px); com ela o print é mostrado numa escala em que
 *  a letra fica perto do mesmo tamanho em qualquer fonte. Mediana da distância entre os inícios de linhas escuras. */
const PASSO = new Map<string, number>();
function passoDasLinhas(img: HTMLImageElement): number {
  const k = img.currentSrc || img.src;
  const ja = PASSO.get(k);
  if (ja !== undefined) return ja;
  let passo = 0;
  try {
    const nW = img.naturalWidth, W = Math.min(nW, 900), H = Math.round((W * img.naturalHeight) / nW);
    if (H > 0 && H <= 4000) {
      const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
      const cx = cv.getContext('2d', { willReadFrequently: true });
      if (cx) {
        cx.drawImage(img, 0, 0, W, H);
        const px = cx.getImageData(0, 0, W, H).data, minimo = Math.max(3, W * 0.012);
        const inicios: number[] = [], alturas: number[] = [];
        let naLinha = false, y0 = 0;
        for (let y = 0; y < H; y++) {
          let escuros = 0;
          for (let x = 0; x < W; x += 2) { const o = (y * W + x) * 4; if (px[o] * 0.299 + px[o + 1] * 0.587 + px[o + 2] * 0.114 < 150) escuros += 2; }
          if (escuros >= minimo && !naLinha) { naLinha = true; y0 = y; inicios.push(y); }
          else if (escuros < minimo && naLinha) { naLinha = false; alturas.push(y - y0); }
        }
        if (inicios.length >= 4) {
          alturas.sort((a, b) => a - b);
          const hMed = alturas[alturas.length >> 1] || 1;
          const difs = inicios.slice(1).map((v, i) => v - inicios[i]).filter((v) => v > hMed * 1.05 && v < hMed * 2.6).sort((a, b) => a - b);
          if (difs.length >= 3) passo = (difs[difs.length >> 1] * nW) / W;
        }
      }
    }
  } catch { passo = 0; }   // imagem de outra origem: sem medida, escala 1
  PASSO.set(k, passo);
  return passo;
}

function useLarguraPrint(pr: HTMLDivElement | null, src: string | null) {
  useEffect(() => {
    const cartao = pr?.closest<HTMLElement>('.q-cartao');
    const img = pr?.querySelector('img');
    if (!pr || !cartao || !img) return;
    let respMax = 0, atual = 0;
    const tira = () => { atual = 0; cartao.style.removeProperty('--q-pw'); };
    const ajusta = () => {
      const resp = cartao.querySelector<HTMLElement>('.q-resp');
      if (innerWidth <= 700 || !img.naturalWidth || !img.naturalHeight || resp?.classList.contains('com-texto')) { tira(); return; }
      const cs = getComputedStyle(cartao);
      // resposta ao lado do print (simulado no computador, forma 2): o print usa a altura toda e a largura da sua coluna
      const lado = cartao.classList.contains('q-lado-a-lado') && innerWidth >= 1101;
      const interno = cartao.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      if (lado) cartao.style.setProperty('--q-in', interno + 'px'); else cartao.style.removeProperty('--q-in');
      const col = lado ? interno - 328 : interno;
      // a altura da resposta depende da largura do print e vice-versa: usar a maior já vista nesta questão evita oscilar
      respMax = Math.max(respMax, resp ? resp.offsetHeight : 0);
      const pe = pr.querySelector<HTMLElement>('.q-print-pe');
      const topo = pr.getBoundingClientRect().top + scrollY;
      const baixo = (resp && !lado ? respMax + 14 : 0) + (pe ? pe.offsetHeight : 0) + (lado ? 24 : 8);
      // largura "natural" na escala de letra comum (linha de ~25 px); com escala medida, o teto é 1,05x em vez de 1,3x
      const passo = passoDasLinhas(img), esc = passo ? Math.max(0.55, Math.min(1.9, 25 / passo)) : 1;
      const nw = img.naturalWidth * esc, ar = img.naturalWidth / img.naturalHeight;
      const cabe = (innerHeight - topo - baixo) * ar, alvo = Math.min(col, (esc !== 1 ? 1.05 : 1.3) * nw);
      // dono, 27/11/2026: a questão inteira tem de aparecer sem rolar. O print diminui até caber na altura da tela, mas
      // nunca abaixo de 40% da escala de leitura (a letra continua do tamanho do texto do site) (letra ainda legível); só o que não cabe nem assim fica para rolar.
      const piso = Math.min(alvo, (lado ? 0.3 : 0.4) * nw);
      const pw = Math.max(320, Math.round(Math.min(alvo, Math.max(piso, cabe))));
      if (pw >= col - 1) { tira(); return; }
      if (!atual || Math.abs(pw - atual) > 24) { atual = pw; cartao.style.setProperty('--q-pw', pw + 'px'); }   // sem tremer por poucos pixels
    };
    ajusta();
    img.addEventListener('load', ajusta);
    addEventListener('resize', ajusta);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => ajusta()) : null;
    ro?.observe(cartao);
    return () => { img.removeEventListener('load', ajusta); removeEventListener('resize', ajusta); ro?.disconnect(); tira(); };
  }, [pr, src]);
}

/** Print fiel da questão original. Sistema do protótipo: etiquetas no topo do cartão (nível, fonte, conteúdo) com o marcador
 *  à direita; o print em papel branco com o pé "Ampliar" e a fonte original (link). */
export function EnunciadoQuestao({ m, q, numero, print, antes, depois, acao, semFonte }: { m?: MateriaId; q: Questao; numero?: string; print?: string | null; antes?: ReactNode; depois?: ReactNode; acao?: ReactNode; semFonte?: boolean }) {
  const [lupa, setLupa] = useState(false);
  const [txt, setTxt] = useState(false);
  const src = print !== undefined ? print : m ? urlPrint(m, q.id) : null;
  // a transcrição que fala do termo sublinhado sem a marcação perderia o destaque da banca: abre no print (item 4)
  const soNoPrint = !!src && perdeDestaque(q.transcricao);
  const [original, setOriginal] = useState(soNoPrint);
  const [prEl, setPrEl] = useState<HTMLDivElement | null>(null);
  useEffect(() => setOriginal(soNoPrint), [q.id, soNoPrint]);
  useLarguraPrint(prEl, src);
  const alt = textoAlternativo(q);
  const cred = creditoProva(q);
  // sem espaço sobrando nos campos (revisão de 19/11/2026, item 16: "Cederj 2026  · 2026.2")
  const limpa = (x: string | undefined) => (x || '').replace(/\s+/g, ' ').trim();
  const fonte = limpa(`${limpa(q.escola)} ${limpa(q.ano)}`);
  const detalhe = [limpa(q.fase), q.n ? `questão ${limpa(numeroQuestao(q))}` : '', q.banca && limpa(q.banca) !== limpa(q.escola) ? limpa(q.banca) : ''].filter(Boolean).join(' · ');
  return (
    <div className="q-enun">
      <div className="q-meta">
        {numero && <span className="etq cor">{numero}</span>}
        {antes}
        {!semFonte && <span className="etq q-fonte" title={detalhe ? `${fonte} · ${detalhe}` : fonte}><b>{fonte}</b>{detalhe ? ` · ${detalhe}` : ''}</span>}
        {depois}
        {acao ? <span className="q-meta-acao">{acao}</span> : !src && cred.site && <a className="q-link" href={cred.site} target="_blank" rel="noreferrer noopener" title={cred.titulo}><Icone nome="externo" tam={15} /><span className="sr">{cred.titulo}</span></a>}
      </div>
      {/* gabarito do Aprendice (princípio 2): o aviso aparece já antes de responder, não só na correção */}
      {avisoGabarito(q) && <p className="q-gab-ap"><span className="etq aviso"><Icone nome="info" tam={14} /> {avisoGabarito(q)}</span></p>}
      {q.transcricao && !original ? (
        <>
          <EnunciadoTexto q={q} />
          {src && <button className="q-ver-txt" onClick={() => setOriginal(true)}><Icone nome="arquivo" tam={15} /> Ver a questão original (print da prova)</button>}
        </>
      ) : src ? (
        <div className="q-print" ref={setPrEl}>
          <button className="q-print-img" onClick={() => setLupa(true)} aria-label="Ampliar a questão">
            <img src={src} alt={alt} />
          </button>
          <div className="q-print-pe">
            <button className="q-amplia" onClick={() => setLupa(true)}><Icone nome="lupa" tam={14} /> Ampliar</button>
            {/* crédito de direito autoral, com o site oficial da banca (dono, 27/11/2026; logica/creditoProva.ts) */}
            {cred.site
              ? <a className="q-print-fonte" href={cred.site} target="_blank" rel="noreferrer noopener" title={cred.titulo}><span className="q-pf-t">{cred.texto}</span> <Icone nome="externo" tam={13} /></a>
              : <span className="q-print-fonte" title={cred.titulo}><span className="q-pf-t">{cred.texto}</span></span>}
          </div>
        </div>
      ) : (
        <div className="q-texto" aria-label="Texto da questão">
          <p className="aviso-previa"><Icone nome="info" tam={15} /> O print desta questão não está disponível aqui. O texto abaixo é o da prova.</p>
          <p style={{ whiteSpace: 'pre-line' }}>{q.enun}</p>
        </div>
      )}
      {src && q.transcricao && original && (
        <button className="q-ver-txt" onClick={() => setOriginal(false)}><Icone nome="arquivo" tam={15} /> {soNoPrint ? 'Ver em texto (o sublinhado da prova só aparece no print)' : 'Voltar para o texto'}</button>
      )}
      {src && !q.transcricao && (
        <button className="q-ver-txt" onClick={() => setTxt(!txt)} aria-expanded={txt}><Icone nome="arquivo" tam={15} /> {txt ? 'Esconder texto' : 'Ver em texto (leitor de tela, busca)'}</button>
      )}
      {src && txt && <div className="q-texto" style={{ whiteSpace: 'pre-line' }}>{alt}</div>}
      {lupa && src && <Lupa src={src} alt={alt} aoFechar={() => setLupa(false)} />}
    </div>
  );
}

/** Resposta dentro do cartão (sistema do protótipo): "Sua resposta" + as cinco letras numa linha e, embaixo, a linha de ações
 *  (certeza, dica, confirmar / próxima). Presa ao pé da tela enquanto o print rola. */
export function RespostaCartao({ children, ...p }: { q: Questao; escolha: Letra | null; aoEscolher: (l: Letra) => void; revelado: boolean;
  riscadas: Set<Letra>; aoRiscar: (l: Letra) => void; mostrarTexto: boolean; children?: ReactNode }) {
  return (
    <div className={'q-resp' + (p.mostrarTexto ? ' com-texto' : '')}>
      <div className="q-bolhas">
        <Alternativas q={p.q} escolhida={p.escolha} aoEscolher={p.aoEscolher} revelado={p.revelado} riscadas={p.riscadas} aoRiscar={p.aoRiscar} mostrarTexto={p.mostrarTexto} />
      </div>
      {children && <div className="q-acoes">{children}</div>}
    </div>
  );
}

export type AbaPainel = 'res' | 'teo' | 'fon';

/** Abas do painel da questão: Resolução · Teoria · Fonte. */
export function AbasPainel({ aba, aoMudar, sem }: { aba: AbaPainel; aoMudar: (a: AbaPainel) => void; sem?: AbaPainel[] }) {
  const l = ([['res', 'Resolução'], ['teo', 'Teoria'], ['fon', 'Fonte']] as [AbaPainel, string][]).filter(([k]) => !sem?.includes(k));
  return (
    <div className="q-abas" role="tablist" aria-label="Resolução, teoria e fonte">
      {l.map(([k, t]) => (
        <button key={k} role="tab" aria-selected={aba === k} tabIndex={aba === k ? 0 : -1} onClick={() => aoMudar(k)}
          onKeyDown={(e) => { if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return; e.preventDefault(); e.stopPropagation(); const i = l.findIndex(([x]) => x === k); const n = l[(i + (e.key === 'ArrowRight' ? 1 : l.length - 1)) % l.length][0]; aoMudar(n); (e.currentTarget.parentElement?.querySelectorAll('button')[l.findIndex(([x]) => x === n)] as HTMLElement | undefined)?.focus(); }}>{t}</button>
      ))}
    </div>
  );
}

/** Aba "Fonte": de onde vem a questão, com o link do site oficial da banca (dono, 27/11/2026: nunca o lugar exato de onde
 *  a cópia foi tirada; esse link fica só nos dados, em `url`). */
export function FonteQuestao({ q }: { q: Questao }) {
  const cred = creditoProva(q);
  const linhas: [string, ReactNode][] = [
    ['Prova', q.escola], ['Ano', q.ano],
    ...(q.fase ? [['Fase', q.fase] as [string, ReactNode]] : []),
    ...(q.n ? [['Questão', numeroQuestao(q)] as [string, ReactNode]] : []),
    ...(q.banca && q.banca !== q.escola ? [['Banca', q.banca] as [string, ReactNode]] : []),
    // de onde é o arquivo: caderno oficial ou cópia (revisão de 19/11/2026, item 19), sem o nome de quem publicou a cópia (dono, 27/11/2026)
    ['Origem', origemDoLink(q.url, q.origem).rotulo],
    // questão indisponível (dono, 19/11/2026); gabarito do Aprendice (princípio 2): o mesmo texto da correção
    ['Gabarito', q.indisponivel ? 'Indisponível: a banca do Aprendice encontrou erro no gabarito oficial, e a banca da prova não publicou errata. A questão fica só para consulta: sem resposta nem correção, fora dos treinos, simulados e revisões.' : origemGabarito(q)],
  ];
  return (
    <div className="q-fonte-aba">
      <dl className="q-props">{linhas.map(([t, d]) => <div key={t}><dt>{t}</dt><dd>{d}</dd></div>)}</dl>
      {cred.site && <a className="q-orig" href={cred.site} target="_blank" rel="noreferrer noopener" title={cred.titulo}><Icone nome="externo" tam={16} /> {cred.titulo}</a>}
    </div>
  );
}

/** Leva o painel Resolução · Teoria · Fonte à vista (na coluna única ele fica embaixo do cartão). */
export function mostraPainel(topo = false) {
  const el = document.getElementById('q-lado');
  const corpo = document.getElementById('q-lado-corpo');
  if (corpo && topo) corpo.scrollTop = 0;
  if (!el) return;
  const r = el.getBoundingClientRect();
  if (r.top > innerHeight * 0.55 || r.bottom < 120) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/** Botão "Tela cheia" da barra de estudo: esconde o menu e deixa só a questão. */
export function BotaoTelaCheia() {
  const on = useTelaCheia();
  return (
    <button className={'q-tela' + (on ? ' on' : '')} onClick={() => defineTelaCheia(!on)} aria-pressed={on} title={on ? 'Sair da tela cheia (Esc)' : 'Tela cheia: só a questão'}>
      <Icone nome={on ? 'sair' : 'tela'} /><span>{on ? 'Sair da tela cheia' : 'Tela cheia'}</span>
    </button>
  );
}

/** Alternativas: letra + (quando não há print) o texto. Riscar com o botão direito ou Shift+letra. */
export function Alternativas({ q, escolhida, aoEscolher, revelado, riscadas, aoRiscar, mostrarTexto }: {
  q: Questao; escolhida: Letra | null; aoEscolher: (l: Letra) => void; revelado: boolean;
  riscadas: Set<Letra>; aoRiscar: (l: Letra) => void; mostrarTexto: boolean;
}) {
  const letras = LETRAS.filter((l) => q.alts[l] !== undefined || !Object.keys(q.alts).length);
  return (
    <div className={'alts' + (mostrarTexto ? ' com-texto' : '')} role="radiogroup" aria-label="Alternativas">
      {letras.map((l) => {
        const cls = ['alt'];
        if (escolhida === l) cls.push('sel');
        if (riscadas.has(l)) cls.push('riscada');
        if (revelado && l === q.gab) cls.push('certa');
        if (revelado && escolhida === l && l !== q.gab) cls.push('errada');
        return (
          <button key={l} className={cls.join(' ')} role="radio" aria-checked={escolhida === l} disabled={revelado}
            onClick={() => aoEscolher(l)} onContextMenu={(e) => { e.preventDefault(); aoRiscar(l); }}
            aria-label={`Alternativa ${l}${mostrarTexto && q.alts[l] ? ': ' + q.alts[l]!.replace(/\*\*|~~/g, '') : ''}${riscadas.has(l) ? ' (riscada)' : ''}`}>
            <span className="alt-l">{l}</span>
            {mostrarTexto && q.alts[l] && <span className="alt-t"><TextoBanca t={q.alts[l]!} /></span>}
          </button>
        );
      })}
    </div>
  );
}

export function Certeza({ valor, aoMudar }: { valor: Conf | null; aoMudar: (c: Conf | null) => void }) {
  return (
    <div className="certeza" role="radiogroup" aria-label="Quanta certeza você tem">
      <span className="fraco">Certeza:</span>
      {([['certeza', 'Tenho certeza'], ['acho', 'Acho que é'], ['chute', 'Chutei']] as [Conf, string][]).map(([c, t]) => (
        <button key={c} role="radio" aria-checked={valor === c} className="chip" tabIndex={valor === c || (!valor && c === 'certeza') ? 0 : -1} onKeyDown={(e) => { const ord: Conf[] = ['certeza', 'acho', 'chute']; const i = ord.indexOf(c); if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); e.stopPropagation(); const n = ord[(i + (e.key === 'ArrowRight' ? 1 : 2)) % 3]; aoMudar(n); ((e.currentTarget.parentElement?.querySelectorAll('button')[ord.indexOf(n)]) as HTMLElement | undefined)?.focus(); } }} onClick={() => aoMudar(valor === c ? null : c)}>{t}</button>
      ))}
    </div>
  );
}

/** Cronômetro com pausa (pausa sozinho quando a aba fica escondida). */
export function useCronometro(ativo: boolean, chave: string) {
  const [seg, setSeg] = useState(0);
  const [pausado, setPausado] = useState(false);
  const ref = useRef({ ini: Date.now(), acum: 0 });
  useEffect(() => { ref.current = { ini: Date.now(), acum: 0 }; setSeg(0); setPausado(false); }, [chave]);
  useEffect(() => {
    if (!ativo || pausado) return;
    ref.current.ini = Date.now();
    const t = setInterval(() => setSeg(Math.floor((ref.current.acum + Date.now() - ref.current.ini) / 1000)), 500);
    const vis = () => { if (document.hidden) setPausado(true); };
    document.addEventListener('visibilitychange', vis);
    return () => { ref.current.acum += Date.now() - ref.current.ini; clearInterval(t); document.removeEventListener('visibilitychange', vis); };
  }, [ativo, pausado, chave]);
  const total = () => Math.floor((ref.current.acum + (ativo && !pausado ? Date.now() - ref.current.ini : 0)) / 1000);
  return { seg, pausado, alterna: () => setPausado((p) => !p), total };
}

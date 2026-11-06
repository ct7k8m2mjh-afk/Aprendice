import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Letra, MateriaId, Questao } from '../dados/tipos';
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

/** Texto com a marcação da transcrição: **negrito**, ~~itálico~~ e quebras de linha. */
export function TextoBanca({ t }: { t: string }) {
  const partes = t.split(/(\*\*|~~|\n)/);
  const out: ReactNode[] = [];
  let neg = false, ita = false;
  partes.forEach((p, i) => {
    if (p === '**') { neg = !neg; return; }
    if (p === '~~') { ita = !ita; return; }
    if (p === '\n') { out.push(<br key={i} />); return; }
    if (!p) return;
    let n: ReactNode = p;
    if (ita) n = <i key={'i' + i}>{n}</i>;
    if (neg) n = <b key={'b' + i}>{n}</b>;
    out.push(<span key={i}>{n}</span>);
  });
  return <>{out}</>;
}

/** Questão só de texto: transcrição da prova oficial, organizada como a banca organizou, com a fonte entre parênteses. */
function EnunciadoTexto({ q }: { q: Questao }) {
  const tr = q.transcricao!;
  return (
    <div className="q-transcricao">
      {tr.enun.map((p, i) => (
        <p key={i} className={'tr-' + p.a}>
          {i === 0 && <b className="tr-fonte">({q.escola} {q.ano}) </b>}
          <TextoBanca t={p.t} />
        </p>
      ))}
    </div>
  );
}

/** Print fiel da questão original. Sistema do protótipo: etiquetas no topo do cartão (nível, fonte, conteúdo) com o marcador
 *  à direita; o print em papel branco com o pé "Ampliar" e a fonte original (link). */
export function EnunciadoQuestao({ m, q, numero, print, antes, depois, acao }: { m?: MateriaId; q: Questao; numero?: string; print?: string | null; antes?: ReactNode; depois?: ReactNode; acao?: ReactNode }) {
  const [lupa, setLupa] = useState(false);
  const [txt, setTxt] = useState(false);
  const [original, setOriginal] = useState(false);
  useEffect(() => setOriginal(false), [q.id]);
  const src = print !== undefined ? print : m ? urlPrint(m, q.id) : null;
  const alt = textoAlternativo(q);
  const fonte = `${q.escola} ${q.ano}`;
  const detalhe = [q.fase, q.n ? `questão ${q.n}` : '', q.banca && q.banca !== q.escola ? q.banca : ''].filter(Boolean).join(' · ');
  return (
    <div className="q-enun">
      <div className="q-meta">
        {numero && <span className="etq cor">{numero}</span>}
        {antes}
        <span className="etq q-fonte" title={detalhe ? `${fonte} · ${detalhe}` : fonte}><b>{fonte}</b>{detalhe ? ` · ${detalhe}` : ''}</span>
        {depois}
        {acao ? <span className="q-meta-acao">{acao}</span> : !src && <a className="q-link" href={q.url} target="_blank" rel="noreferrer noopener" title="Abrir a fonte original"><Icone nome="externo" tam={15} /><span className="sr">Fonte original</span></a>}
      </div>
      {q.transcricao && !original ? (
        <>
          <EnunciadoTexto q={q} />
          {src && <button className="q-ver-txt" onClick={() => setOriginal(true)}><Icone nome="arquivo" tam={15} /> Ver a questão original (print da prova)</button>}
        </>
      ) : src ? (
        <div className="q-print">
          <button className="q-print-img" onClick={() => setLupa(true)} aria-label="Ampliar a questão">
            <img src={src} alt={alt} />
          </button>
          <div className="q-print-pe">
            <button className="q-amplia" onClick={() => setLupa(true)}><Icone nome="lupa" tam={14} /> Ampliar</button>
            <a className="q-print-fonte" href={q.url} target="_blank" rel="noreferrer noopener" title="Abrir a fonte original">{q.escola} <Icone nome="externo" tam={13} /></a>
          </div>
        </div>
      ) : (
        <div className="q-texto" aria-label="Texto da questão">
          <p className="aviso-previa"><Icone nome="info" tam={15} /> Nesta prévia o print original não está incluído; o site completo mostra o print fiel da prova.</p>
          <p style={{ whiteSpace: 'pre-line' }}>{q.enun}</p>
        </div>
      )}
      {src && q.transcricao && original && (
        <button className="q-ver-txt" onClick={() => setOriginal(false)}><Icone nome="arquivo" tam={15} /> Voltar para o texto</button>
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

/** Aba "Fonte": de onde vem a questão, com o link da fonte original. */
export function FonteQuestao({ q }: { q: Questao }) {
  const linhas: [string, ReactNode][] = [
    ['Prova', q.escola], ['Ano', q.ano],
    ...(q.fase ? [['Fase', q.fase] as [string, ReactNode]] : []),
    ...(q.n ? [['Questão', q.n] as [string, ReactNode]] : []),
    ...(q.banca && q.banca !== q.escola ? [['Banca', q.banca] as [string, ReactNode]] : []),
    ['Origem', q.origem === 'prova' ? 'Caderno da prova oficial' : 'Lista pública de exercícios'],
    ['Gabarito', 'Publicado (oficial ou resolução reconhecida)'],
  ];
  return (
    <div className="q-fonte-aba">
      <dl className="q-props">{linhas.map(([t, d]) => <div key={t}><dt>{t}</dt><dd>{d}</dd></div>)}</dl>
      {q.url && <a className="q-orig" href={q.url} target="_blank" rel="noreferrer noopener"><Icone nome="externo" tam={16} /> Abrir a fonte original</a>}
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

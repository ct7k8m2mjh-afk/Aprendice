import { useEffect, useRef, useState } from 'react';
import type { Letra, MateriaId, Questao } from '../dados/tipos';
import { urlPrint } from '../dados/conteudo';
import { Icone } from './Icone';
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

/** Print fiel da questão original + cabeçalho com a fonte. */
export function EnunciadoQuestao({ m, q, numero }: { m: MateriaId; q: Questao; numero?: string }) {
  const [lupa, setLupa] = useState(false);
  const [txt, setTxt] = useState(false);
  const src = urlPrint(m, q.id);
  const alt = textoAlternativo(q);
  return (
    <div className="q-enun">
      <div className="q-meta">
        {numero && <span className="etq">{numero}</span>}
        <span className="q-fonte">
          <b>{q.escola} {q.ano}</b>{q.fase ? ` · ${q.fase}` : ''}{q.n ? ` · questão ${q.n}` : ''}{q.banca && q.banca !== q.escola ? ` · ${q.banca}` : ''}
        </span>
        <a className="q-link" href={q.url} target="_blank" rel="noreferrer noopener" title="Abrir a fonte original"><Icone nome="externo" tam={15} /><span className="sr">Fonte original</span></a>
      </div>
      {src ? (
        <button className="q-print" onClick={() => setLupa(true)} aria-label="Ampliar a questão">
          <img src={src} alt={alt} />
          <span className="q-amplia"><Icone nome="lupa" tam={16} /> Ampliar</span>
        </button>
      ) : (
        <div className="q-texto" aria-label="Texto da questão">
          <p className="aviso-previa"><Icone nome="info" tam={15} /> Nesta prévia o print original não está incluído; o app completo mostra o print fiel da prova.</p>
          <p style={{ whiteSpace: 'pre-line' }}>{q.enun}</p>
        </div>
      )}
      {src && (
        <button className="q-ver-txt" onClick={() => setTxt(!txt)} aria-expanded={txt}><Icone nome="arquivo" tam={15} /> {txt ? 'Esconder texto' : 'Ver em texto (leitor de tela, busca)'}</button>
      )}
      {src && txt && <div className="q-texto" style={{ whiteSpace: 'pre-line' }}>{alt}</div>}
      {lupa && src && <Lupa src={src} alt={alt} aoFechar={() => setLupa(false)} />}
    </div>
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
            aria-label={`Alternativa ${l}${mostrarTexto && q.alts[l] ? ': ' + q.alts[l] : ''}${riscadas.has(l) ? ' (riscada)' : ''}`}>
            <span className="alt-l">{l}</span>
            {mostrarTexto && q.alts[l] && <span className="alt-t">{q.alts[l]}</span>}
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
        <button key={c} role="radio" aria-checked={valor === c} className="chip" aria-pressed={valor === c} onClick={() => aoMudar(valor === c ? null : c)}>{t}</button>
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

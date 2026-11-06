import { useEffect, useMemo, useRef, useState } from 'react';
import type { Completar, Flashcard, MateriaId } from '../dados/tipos';
import { confereCompletar, criaCorretor, type Correcao, type Veredito } from '../logica/correcao';
import { corrigeComIA } from '../logica/ia';
import { quandoVolta } from '../logica/revisao';
import { atualizaMateria, useMateriaEstado } from '../estado/loja';
import { urlFlashImg, EH_PREVIA } from '../dados/conteudo';
import { Icone } from './Icone';
import { IcTema } from './IconeTema';

export type Nota = 'a' | 'q' | 'e';

const corretores = new Map<string, ReturnType<typeof criaCorretor>>();
export function corretorDe(m: MateriaId, cartoes: Flashcard[]) {
  let c = corretores.get(m);
  if (!c) { c = criaCorretor(cartoes); corretores.set(m, c); }
  return c;
}

const TIPO: Record<string, string> = { conceito: 'Conceito', formula: 'Fórmula', identificar: 'Como identificar', comparar: 'Comparação', processo: 'Processo', exemplo: 'Exemplo', imagem: 'Com imagem' };

function rotuloVer(v: Veredito) { return v === 'certo' ? 'Parece certo' : v === 'quase' ? 'Quase' : 'Não bateu'; }

export function Gosto({ m, id, tipo, mod }: { m: MateriaId; id: string; tipo?: string; mod?: string }) {
  const s = useMateriaEstado(m);
  const g = s.flg[id]?.g;
  const vota = (v: 1 | -1) => atualizaMateria(m, (x) => ({ ...x, flg: { ...x.flg, [id]: { g: v, tipo, mod, ts: Date.now() } } }));
  return (
    <div className="gosto">
      <span>Curtiu este cartão?</span>
      <button className="chip" aria-pressed={g === 1} onClick={() => vota(1)}>Sim</button>
      <button className="chip" aria-pressed={g === -1} onClick={() => vota(-1)}>Não</button>
      {g === -1 && <small className="fraco">Ele sai das próximas sessões.</small>}
    </div>
  );
}

export function BotoesNota({ aoNotar, sugestao, rec }: { aoNotar: (n: Nota) => void; sugestao?: Nota | null; rec?: Parameters<typeof quandoVolta>[0] }) {
  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT' || (e.target as HTMLElement)?.tagName === 'TEXTAREA') return;
      if (e.key === '1') aoNotar('e'); else if (e.key === '2') aoNotar('q'); else if (e.key === '3') aoNotar('a');
    };
    addEventListener('keydown', f);
    return () => removeEventListener('keydown', f);
  }, [aoNotar]);
  return (
    <div className="notas" role="group" aria-label="Como foi">
      <span className="fraco">Como foi?</span>
      {([['e', 'Errei', 1], ['q', 'Quase', 2], ['a', 'Acertei', 3]] as [Nota, string, number][]).map(([n, t, k]) => (
        <button key={n} className={'nota n-' + n + (sugestao === n ? ' sugerida' : '')} onClick={() => aoNotar(n)}>
          <b>{t}</b><small>{quandoVolta(rec, n)}</small><kbd>{k}</kbd>
        </button>
      ))}
    </div>
  );
}

/** Flashcard: pergunta curta no estilo das discursivas; o aluno escreve, o app corrige (local ou IA simulada) e ele confirma. */
export function FlashcardView({ m, c, todos, aoNotar, usarIA = true, tema, conteudo }: { m: MateriaId; c: Flashcard; todos: Flashcard[]; aoNotar: (n: Nota, origem: string) => void; usarIA?: boolean;
  /** nome do tema e do conteúdo do cartão: faixa no topo do cartão (sistema do protótipo) */ tema?: string; conteudo?: string }) {
  const s = useMateriaEstado(m);
  const corrige = useMemo(() => corretorDe(m, todos), [m, todos]);
  const [resp, setResp] = useState('');
  const [fase, setFase] = useState<'pergunta' | 'corrigindo' | 'verso'>('pergunta');
  const [cor, setCor] = useState<Correcao | null>(null);
  const [origem, setOrigem] = useState('local');
  const inp = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { setResp(''); setFase('pergunta'); setCor(null); setTimeout(() => inp.current?.focus(), 30); }, [c.id]);

  const corrigir = async (naoSei = false) => {
    if (!naoSei && !resp.trim()) { inp.current?.focus(); return; }
    if (naoSei) { setCor(null); setOrigem('nao-sei'); setFase('verso'); return; }
    if (usarIA) {
      setFase('corrigindo');
      const r = await corrigeComIA(c, resp, corrige);
      setCor(r); setOrigem(r.origem);
    } else { setCor(corrige(c, resp)); setOrigem('local'); }
    setFase('verso');
  };
  const sug: Nota | null = cor ? (cor.veredito === 'certo' ? 'a' : cor.veredito === 'quase' ? 'q' : 'e') : origem === 'nao-sei' ? 'e' : null;
  const img = c.img ? (EH_PREVIA ? null : urlFlashImg(m, c.img)) : null;

  return (
    <article className="flashcard folha">
      {tema ? (
        <div className="fc-faixa">
          <IcTema m={m} tema={c.mod} tam={34} />
          <span className="fc-faixa-nm"><b>{tema}</b>{conteudo && <span>{conteudo}</span>}</span>
          <span className="fc-faixa-tg">
            <span className="etq">{TIPO[c.tipo || (c.img ? 'imagem' : '')] || 'Flashcard'}</span>
            {!s.flash[c.id]?.hist?.length && <span className="etq cor">Novo</span>}
          </span>
        </div>
      ) : <div className="fc-topo"><span className="etq cor">{TIPO[c.tipo || (c.img ? 'imagem' : '')] || 'Flashcard'}</span></div>}
      {img && <img className="fc-img" src={img} alt="" />}
      <h2 className="fc-frente">{c.frente}</h2>
      <label className="fc-lab" htmlFor={'fc-' + c.id}><Icone nome="caneta" tam={17} /> Sua resposta, com as suas palavras</label>
      <textarea id={'fc-' + c.id} ref={inp} className="fc-resp" rows={3} value={resp} readOnly={fase !== 'pergunta'} placeholder="Escreva aqui o que você lembra"
        onChange={(e) => setResp(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (fase === 'pergunta') corrigir(); } }} />
      {fase === 'pergunta' && (
        <div className="fc-acoes fc-acoes-ini">
          <button className="btn fc-corr" onClick={() => corrigir()}><Icone nome="check" /> Corrigir</button>
          <button className="btn sec" onClick={() => corrigir(true)}>Não sei: ver a resposta</button>
          <span className="fc-tecla fraco">Enter corrige · Shift + Enter pula linha</span>
        </div>
      )}
      {fase === 'corrigindo' && <p className="fc-corrigindo fraco" role="status"><span className="giro-p" /> Corrigindo…</p>}
      {fase === 'verso' && (
        <div className="fc-verso">
          {cor && (
            <div className={'fc-veredito v-' + cor.veredito}>
              <b>{rotuloVer(cor.veredito)}</b>
              <p>{cor.comentario}</p>
              {cor.faltou.length > 0 && cor.veredito !== 'certo' && <p className="fraco">Faltou: {cor.faltou.join('; ')}</p>}
              <small className="fraco">{origem === 'ia-simulada' ? 'Correção por IA (simulada nesta versão, feita no aparelho)' : 'Correção local'}: é uma sugestão, quem decide é você.</small>
            </div>
          )}
          <div className="fc-modelo"><span className="fraco">Resposta-modelo</span><p>{c.verso}</p></div>
          {c.erro_comum && <p className="fc-erro"><b>Erro comum: </b>{c.erro_comum}</p>}
          {(c.fonte || c.credito) && <p className="fc-fonte fraco">Fonte: {c.fonte ? <a href={c.fonte} target="_blank" rel="noreferrer noopener">{new URL(c.fonte).hostname.replace(/^www\./, '')}</a> : null}{c.credito ? ` · ${c.credito}` : ''}</p>}
          <Gosto m={m} id={c.id} tipo={c.tipo || (c.img ? 'imagem' : 'conceito')} mod={c.mod} />
          <BotoesNota aoNotar={(n) => aoNotar(n, origem)} sugestao={sug} rec={s.flash[c.id]} />
        </div>
      )}
    </article>
  );
}

/** Frase para completar: uma lacuna, conferida localmente. */
export function CompletarView({ m, c, aoNotar }: { m: MateriaId; c: Completar; aoNotar: (n: Nota, origem: string) => void }) {
  const s = useMateriaEstado(m);
  const [resp, setResp] = useState('');
  const [ver, setVer] = useState<Veredito | null>(null);
  const [naoSei, setNaoSei] = useState(false);
  const inp = useRef<HTMLInputElement>(null);
  useEffect(() => { setResp(''); setVer(null); setNaoSei(false); setTimeout(() => inp.current?.focus(), 30); }, [c.id]);
  const [a, b] = c.frase.split('___');
  const larg = Math.max(6, Math.min(26, c.resp.length + 3));
  const corrigir = (ns = false) => {
    if (!ns && !resp.trim()) { inp.current?.focus(); return; }
    setNaoSei(ns); setVer(ns ? 'errado' : confereCompletar(c, resp));
  };
  return (
    <article className="flashcard folha completar">
      <div className="fc-topo"><span className="etq cor">Complete a frase</span></div>
      <p className="cz-frase">
        {a}
        <input ref={inp} className={'cz-in' + (ver ? (ver === 'certo' ? ' ok' : ver === 'quase' ? ' qs' : ' er') : '')} style={{ width: `${larg}ch` }}
          value={resp} readOnly={!!ver} onChange={(e) => setResp(e.target.value)} aria-label="Palavra que falta"
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (!ver) corrigir(); } }} />
        {b}
      </p>
      {!ver && (
        <div className="fc-acoes">
          <button className="btn sec" onClick={() => corrigir(true)}>Não sei: ver a resposta</button>
          <button className="btn" onClick={() => corrigir()}>Corrigir</button>
        </div>
      )}
      {ver && (
        <div className="fc-verso">
          <div className={'fc-veredito v-' + ver}>
            <b>{naoSei ? 'Resposta' : rotuloVer(ver)}</b>
            <p>A palavra é <b>{c.resp}</b>{c.aceita && c.aceita.length ? ` (também vale: ${c.aceita.join(', ')})` : ''}.</p>
          </div>
          {c.fonte && <p className="fc-fonte fraco">Fonte: <a href={c.fonte} target="_blank" rel="noreferrer noopener">{new URL(c.fonte).hostname.replace(/^www\./, '')}</a></p>}
          <Gosto m={m} id={c.id} tipo="completar" mod={c.mod} />
          <BotoesNota aoNotar={(n) => aoNotar(n, naoSei ? 'nao-sei' : 'local')} sugestao={ver === 'certo' ? 'a' : ver === 'quase' ? 'q' : 'e'} rec={s.flash[c.id]} />
        </div>
      )}
    </article>
  );
}

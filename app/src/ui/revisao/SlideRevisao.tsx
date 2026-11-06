import { useMemo, useRef, useState } from 'react';
import type { Lembrou } from '../../estado/tipos';
import type { MateriaId, Resolucao } from '../../dados/tipos';
import { fonteLegivel, type PassoSlide, type Slide, type TemaRevisao } from '../../dados/revisao';
import { confereLacuna, lacuna, opcoesFormula, pedeTentativa } from '../../logica/cicloRevisao';
import { latexParaMotor } from '../../logica/latex';
import { contaEhTexto, partesFracao } from '../../logica/fracao';
import { ResolucaoAnimada } from '../ResolucaoAnimada';
import { comFracoes } from '../Fracao';
import { Formula } from '../Formula';
import { Icone } from '../Icone';
import { RoteiroAnimado } from './RoteiroAnimado';

export const NOME_TIPO: Record<Slide['tipo'], string> = {
  abertura: 'Abertura', conceito: 'Conceito', formula: 'Fórmula', grafico: 'Gráfico', exemplo: 'Exemplo',
  pegadinha: 'Pegadinha', na_prova: 'Como cai na prova', fixe: 'Para levar',
};

const contaFracoes = (l: string) => partesFracao(l).filter((p) => p.t === 'frac').length;

/** Passos do exemplo no formato do motor único (ui/ResolucaoAnimada.tsx). null: alguma conta não se escreve sem perda. */
export function passosParaMotor(passos: PassoSlide[], texto = false): Resolucao | null {
  const out: NonNullable<Resolucao['passos']> = [];
  for (const p of passos) {
    const conta = latexParaMotor(p.conta, contaFracoes, texto);
    if (conta == null) return null;
    out.push({ faz: p.faz, conta, porque: '' });
  }
  return { passos: out };
}

/**
 * Um slide da revisão (docs/revisao/FORMATO.md): etiqueta do tipo, título, texto, frase-chave, fórmula (à mão, fração
 * empilhada), legenda, a conta do exemplo pelo motor único e o visual (roteiro animado ou foto com crédito).
 * Conceito com frase-chave e fórmula pedem a tentativa antes de mostrar (lembrar sem olhar): `aoLembrar` recebe o
 * resultado; `lembrou` é o que o aluno já respondeu (volta a abrir revelado).
 */
export function SlideRevisao({ m, tema, sub, k, s, pos, total, aviso, lembrou, aoLembrar }: {
  m: MateriaId; tema: TemaRevisao; sub: string; k: number; s: Slide; pos: number; total: number;
  /** marca do pilar 1.2 ("você errou na pergunta inicial") */ aviso?: string;
  lembrou?: Lembrou; aoLembrar?: (v: Lembrou) => void;
}) {
  const t0 = aoLembrar ? pedeTentativa(s) : null;
  // fórmula sem outras do tema para comparar: não há escolha a fazer, o slide abre direto
  const tent = t0 === 'formula' && opcoesFormula(tema, sub, k).opcoes.length < 2 ? null : t0;
  const [revelado, setRevelado] = useState(!tent || lembrou !== undefined);
  // Humanas (Filosofia e Sociologia...): passos de raciocínio e "fórmulas" em frase, na letra da interface
  // ("1 + 1" é conta em Física e Matemática e texto nas matérias em que o passo é sempre texto)
  const prosa = contaEhTexto('1 + 1', m);
  const res = useMemo(() => (s.passos?.length ? passosParaMotor(s.passos, prosa) : null), [s.passos, prosa]);
  const temVisual = !!(s.visual && ((s.visual.movimento && s.visual.movimento.length) || s.visual.foto));
  const marca = (v: Lembrou) => { aoLembrar?.(v); setRevelado(true); };

  return (
    <article className={`rv-slide folha t-${s.tipo}` + (temVisual ? ' com-vis' : '')} aria-labelledby={`rv-tit-${k}`}>
      <header className="rv-cab">
        <span className="etq cor">{NOME_TIPO[s.tipo]}</span>
        {aviso && <span className="etq rv-aviso"><Icone nome="alvo" tam={14} />{aviso}</span>}
        <span className="rv-pos num">{pos} de {total}</span>
      </header>
      <div className="rv-corpo">
        <div className="rv-txt">
          <h2 id={`rv-tit-${k}`} className="rv-tit">{s.titulo}</h2>
          {s.texto && <p className="rv-texto">{comFracoes(s.texto)}</p>}
          {tent === 'formula' && !revelado ? (
            <EscolheFormula tema={tema} sub={sub} k={k} prosa={prosa} aoResponder={marca} />
          ) : tent === 'frase' && !revelado ? (
            <CompletaFrase frase={s.destaque!} aoResponder={marca} />
          ) : (
            <>
              {s.destaque && <p className={'rv-destaque' + (tent === 'frase' ? ' entra' : '')}>{comFracoes(s.destaque)}</p>}
              {s.formula && <Formula tex={s.formula} prosa={prosa} className={'rv-formula' + (tent === 'formula' ? ' entra' : '')} />}
              {tent && lembrou && <p className={'rv-lembrou v-' + lembrou}>{lembrou === 'a' ? 'Você lembrou.' : lembrou === 'q' ? 'Quase: releia com atenção.' : 'Esta volta na próxima revisão.'}</p>}
            </>
          )}
          {s.legenda && s.legenda.length > 0 && (revelado || tent !== 'formula') && (
            <ul className="rv-leg">{s.legenda.map((l, i) => <li key={i}>{comFracoes(l)}</li>)}</ul>
          )}
          {s.passos && s.passos.length > 0 && (res
            ? <div className="rv-conta"><ResolucaoAnimada r={res} materia={m} /></div>
            : <PassosFormula passos={s.passos} prosa={prosa} />)}
          {s.fonte && <p className="rv-fonte">Fonte: {fonteLegivel(s.fonte, tema.obra)}</p>}
        </div>
        {temVisual && <div className="rv-vis-col"><RoteiroAnimado key={sub + k} m={m} v={s.visual!} auto={!res} /></div>}
      </div>
    </article>
  );
}

/** Saída do pedido 2 ao motor (docs/revisao/PEDIDOS-MOTOR.md): os passos com a fórmula desenhada, um de cada vez. */
function PassosFormula({ passos, prosa }: { passos: PassoSlide[]; prosa: boolean }) {
  const [ate, setAte] = useState(0);
  return (
    <section className="rv-conta rv-passos" aria-label="Resolução passo a passo">
      <h3 className="cor-tit">Resolução passo a passo</h3>
      <ol>
        {passos.map((p, i) => (
          <li key={i} hidden={i > ate || undefined} className={i === ate ? 'entra' : undefined}>
            <span className="rv-passo-n num" aria-hidden>{i + 1}</span>
            <div><b>{p.faz}</b><Formula tex={p.conta} prosa={prosa} /></div>
          </li>
        ))}
      </ol>
      {ate < passos.length - 1
        ? <button type="button" className="btn sec peq" onClick={() => setAte(ate + 1)}>Próximo passo <Icone nome="direita" tam={15} /></button>
        : passos.length > 1 && <button type="button" className="ra-link" onClick={() => setAte(0)}>Ver do começo</button>}
    </section>
  );
}

/** Lembrar sem olhar no slide de fórmula: escolher entre 3 antes de ver. */
function EscolheFormula({ tema, sub, k, prosa, aoResponder }: { tema: TemaRevisao; sub: string; k: number; prosa: boolean; aoResponder: (v: Lembrou) => void }) {
  const { opcoes, certa } = useMemo(() => opcoesFormula(tema, sub, k), [tema, sub, k]);
  const [esc, setEsc] = useState<number | null>(null);
  if (opcoes.length < 2) return null;
  return (
    <div className="rv-tenta" role="group" aria-labelledby={`rv-tf-${k}`}>
      <p id={`rv-tf-${k}`} className="rv-tenta-p"><Icone nome="lampada" tam={17} /> {prosa ? 'Antes de ver: qual é a ideia certa?' : 'Antes de ver: qual é a fórmula?'}</p>
      <div className="rv-opcoes">
        {opcoes.map((f, i) => (
          <button key={i} type="button" className={'rv-opcao' + (esc === i ? (i === certa ? ' certa' : ' errada') : esc != null && i === certa ? ' certa' : '')}
            disabled={esc != null} onClick={() => setEsc(i)} aria-label={`Opção ${i + 1}`}>
            <Formula tex={f} prosa={prosa} />
          </button>
        ))}
      </div>
      {esc == null
        ? <button type="button" className="ra-link" onClick={() => aoResponder('e')}>Não lembro: mostrar</button>
        : <button type="button" className="btn peq" onClick={() => aoResponder(esc === certa ? 'a' : 'e')}>{esc === certa ? 'Isso. Ver o slide' : prosa ? 'Ver a resposta certa' : 'Ver a fórmula certa'} <Icone nome="direita" tam={15} /></button>}
    </div>
  );
}

/** Lembrar sem olhar no slide de conceito: completar a frase-chave antes de ver. */
function CompletaFrase({ frase, aoResponder }: { frase: string; aoResponder: (v: Lembrou) => void }) {
  return (
    <div className="rv-tenta">
      <p className="rv-tenta-p"><Icone nome="lampada" tam={17} /> Antes de ver: complete a frase-chave</p>
      <Lacuna frase={frase} id="rv-frase" aoResponder={aoResponder} />
    </div>
  );
}

const NOTAS: [Lembrou, string, string][] = [['e', 'Não lembrei', '1'], ['q', 'Quase', '2'], ['a', 'Lembrei', '3']];

/**
 * Uma lacuna: a pista fica à vista, o resto o aluno escreve de memória (ou pede para ver). Ao conferir, aparece a frase
 * inteira ao lado do que ele escreveu, com a sugestão do site; quem decide é o aluno (Não lembrei · Quase · Lembrei).
 */
export function Lacuna({ frase, id, valor, aoResponder, foco }: { frase: string; id: string; valor?: Lembrou; aoResponder: (v: Lembrou) => void; foco?: boolean }) {
  const { pista, falta } = useMemo(() => lacuna(frase), [frase]);
  const [txt, setTxt] = useState('');
  const [conf, setConf] = useState<Lembrou | null>(valor ? valor : null);
  const inp = useRef<HTMLInputElement>(null);
  const confere = (naoSei = false) => setConf(naoSei ? 'e' : confereLacuna(falta, txt));
  if (valor) {
    return (
      <div className={'rv-lacuna feita v-' + valor}>
        <p className="rv-lacuna-l"><span className="rv-pista">{comFracoes(pista)}</span> <mark className="rv-falta">{comFracoes(falta)}</mark></p>
        <span className={'rv-selo v-' + valor}>{NOTAS.find((x) => x[0] === valor)![1]}</span>
      </div>
    );
  }
  return (
    <div className="rv-lacuna">
      <p className="rv-lacuna-l">
        <span className="rv-pista">{comFracoes(pista)}</span>
        {conf == null
          ? <input id={id} ref={inp} className="rv-in" value={txt} autoFocus={foco} onChange={(e) => setTxt(e.target.value)} placeholder="complete de memória" autoComplete="off"
              aria-label={`Complete: ${pista}`} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); confere(); } }} />
          : <mark className="rv-falta">{comFracoes(falta)}</mark>}
      </p>
      {conf == null ? (
        <div className="rv-tenta-acoes">
          <button type="button" className="btn peq" onClick={() => confere()}>Conferir</button>
          <button type="button" className="ra-link" onClick={() => confere(true)}>Não lembro: mostrar</button>
        </div>
      ) : (
        <>
          {txt.trim() && <p className="rv-escreveu"><span>Você escreveu:</span> {txt}</p>}
          <div className="notas rv-notas" role="group" aria-label="Como foi">
            <span className="fraco">Como foi?</span>
            {NOTAS.map(([v, t]) => (
              <button key={v} type="button" className={'nota n-' + v + (conf === v ? ' sugerida' : '')} onClick={() => aoResponder(v)}><b>{t}</b></button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

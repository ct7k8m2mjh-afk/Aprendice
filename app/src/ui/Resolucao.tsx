import { avisoGabarito, numeroQuestao, origemGabarito, type Letra, type Questao, type Resolucao } from '../dados/tipos';
import { origemDoLink } from '../logica/origemLink';
import type { ReactNode } from 'react';
import { Icone } from './Icone';
import { MATERIAS_ANIMADAS } from '../dados/revisao';
import { ResolucaoAnimada } from './ResolucaoAnimada';
import { comFracoes } from './Fracao';
import { textoCorrecao } from '../logica/aspas';
import { itensDaConta } from '../logica/motorConta';

/** texto da correção: aspas curvas, ordinal certo e frações empilhadas (o texto dos dados não muda) */
const txt = (s: string) => comFracoes(textoCorrecao(s));
import { materiaDoCodigo } from '../logica/fracao';
import { materiaDaArea } from '../dados/provasCompletas';

/**
 * Correção da questão (decisão do dono, 05/11/2026): só 4 blocos, nesta ordem —
 * 1. Por que eu errei (res.erradas[letra marcada]; some quando acerta) · 2. Resposta correta + a pegadinha
 * (res.resposta + res.armadilha) · 3. Resolução animada · 4. Por que as outras estão erradas (fechado).
 * Os demais campos (antes, checagem, essencial, alerta, pista, caminhos) continuam nos dados e não ocupam a correção.
 */
/** Resolução animada (vídeo) só em Biologia, Química, Matemática e Física (dono, 09/11/2026);
 *  nas outras matérias a resolução é texto, passo a passo. */
// a regra das matérias animadas mora num lugar só (dados/revisao.ts, decisão do dono 09/11/2026)
const ANIMADAS = MATERIAS_ANIMADAS;

function ResolucaoTexto({ r, materia }: { r: Resolucao; materia?: string }) {
  const passos = (r.passos || []).filter((p) => p.faz || p.conta || p.porque);
  if (!passos.length) return null;
  return (
    <div className="cor-bloco cor-texto">
      <h3 className="cor-tit">Resolução</h3>
      <ol className="cor-passos">
        {passos.map((p, i) => (
          <li key={i}>
            {p.faz && <p className="cor-expl"><b>{txt(p.faz)}</b></p>}
            {p.conta && <Trecho conta={p.conta} materia={materia} />}
            {p.porque && <p className="cor-expl">{txt(p.porque)}</p>}
          </li>
        ))}
      </ol>
    </div>
  );
}

/** O trecho do passo (revisão de 20/11, N3): os itens separados nos dados por " | " (ou em lista com ";") ficam um por
 *  linha, como na resolução animada; o separador nunca aparece cru. */
function Trecho({ conta, materia }: { conta: string; materia?: string }) {
  const itens = itensDaConta(conta, materia);
  if (itens.length <= 1) return <p className="cor-expl cor-trecho">{txt(itens[0] ?? conta)}</p>;
  return <ul className="cor-expl cor-trecho cor-itens">{itens.map((x, k) => <li key={k}>{txt(x)}</li>)}</ul>;
}

export function ResolucaoView({ q, r, marcada, materia, origem, semFonte }: { q: Questao; r: Resolucao | null | undefined; marcada: Letra | null;
  /** matéria quando a questão não tem código de conteúdo (Questão Aprendice da revisão essencial) */ materia?: string;
  /** linha de origem no cabeçalho no lugar da do gabarito e da prova (Questão Aprendice) */ origem?: ReactNode;
  /** sem o rodapé da fonte (questão que não é de prova) */ semFonte?: boolean }) {
  const acertou = marcada === q.gab;
  const erradaTxt = marcada && !acertou ? r?.erradas?.[marcada] : null;
  // a matéria decide se a "conta" de um passo é conta (letra à mão) ou texto (Português, Inglês, humanas)
  const mat = materia || materiaDoCodigo(q.modulo) || materiaDoCodigo(q.sub) || materiaDaArea(q.conceito);
  // as outras alternativas erradas (a marcada já foi explicada no bloco 1)
  const outras = (Object.entries(r?.erradas || {}) as [Letra, string][])
    .filter(([l, t]) => t && l !== q.gab && !(erradaTxt && l === marcada)).sort(([a], [b]) => a.localeCompare(b));
  return (
    <section className={'resolucao' + (acertou ? ' ok' : marcada ? ' err' : '')} aria-labelledby="res-tit">
      <header className="res-cab">
        <span className={'res-selo ' + (acertou ? 'ok' : marcada ? 'err' : '')}>
          <Icone nome={acertou ? 'check' : marcada ? 'fechar' : 'info'} tam={18} />
        </span>
        <div>
          <h2 id="res-tit">{acertou ? 'Você acertou' : marcada ? `Você marcou ${marcada}. A resposta é ${q.gab}.` : `Gabarito: ${q.gab}`}</h2>
          {origem ?? (
            <>
              <p className="fraco">{avisoGabarito(q) ? '' : `${origemGabarito(q)} · `}{q.escola} {q.ano}{q.n ? `, questão ${numeroQuestao(q)}` : ''}</p>
              {avisoGabarito(q) && <p className="res-gab-ap"><span className="etq aviso"><Icone nome="info" tam={14} /> {avisoGabarito(q)}</span></p>}
            </>
          )}
        </div>
      </header>

      {!r && <p className="miolo">A resolução comentada desta questão está em revisão e entra quando passar por todas as lentes.</p>}
      {r && (
        <>
          {/* 1. Por que eu errei: o que faltou no raciocínio de quem marcou esta letra (só quando errou) */}
          {erradaTxt && (
            <div className="cor-bloco cor-errei">
              <h3 className="cor-tit">Por que eu errei</h3>
              <p className="cor-expl">{txt(erradaTxt)}</p>
            </div>
          )}
          {/* 2. Resposta correta + a pegadinha */}
          {(r.resposta || r.armadilha) && (
            <div className="cor-bloco cor-resposta">
              <h3 className="cor-tit">Resposta correta</h3>
              {r.resposta && <p className="cor-resp">{txt(r.resposta)}</p>}
              {r.armadilha && (
                <div className="cor-pegadinha">
                  <b>A pegadinha</b>
                  <p className="cor-expl">{txt(r.armadilha)}</p>
                </div>
              )}
            </div>
          )}
          {/* 3. Resolução animada (um motor só para todas: logica/motorConta.ts) */}
          {((r.passos && r.passos.length > 0) || (r.quadro && r.quadro.length > 0)) && (ANIMADAS.has(mat || '')
            ? <ResolucaoAnimada r={r} materia={mat} />
            : <ResolucaoTexto r={r} materia={mat} />)}
          {/* 4. Por que as outras estão erradas: fechado, abre ao clicar */}
          {outras.length > 0 && (
            <details className="cor-outras">
              <summary>Por que as outras estão erradas</summary>
              <ul>{outras.map(([l, t]) => <li key={l}><b>{l}</b><span className="cor-expl">{txt(t)}</span></li>)}</ul>
            </details>
          )}
        </>
      )}
      {!semFonte && <p className="res-fonte">
        Fonte: {(() => { const r = origemDoLink(q.url, q.origem).rotulo; return /^[A-Z][a-zà-ÿ]/.test(r) ? r.charAt(0).toLowerCase() + r.slice(1) : r; })()} · <a href={q.url} target="_blank" rel="noreferrer noopener">{q.escola} {q.ano} <Icone nome="externo" tam={13} /></a>
      </p>}
    </section>
  );
}

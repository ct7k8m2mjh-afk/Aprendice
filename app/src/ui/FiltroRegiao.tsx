/**
 * Filtro de região onde o aluno pratica (pedido do dono, 09/11/2026). Chips "Minha região · Todas as regiões · <cada
 * região>" e, logo abaixo, a frase com a região das provas dele e o "Trocar", que abre o seletor da região das minhas
 * provas. O filtro escolhido vale para o site inteiro (pref.filtroRegiao): Escada, tema, treinos e revisão.
 */
import { useMemo, useState } from 'react';
import { CATALOGO } from '../dados/provas';
import { atualiza, useEstado } from '../estado/loja';
import {
  REGIOES_PRATICA, descreveFiltro, ehFiltro, minhasRegioes, regioesDasProvas, regioesDoFiltro, nomeRegiao,
  type FiltroRegiao, type Filtrado, type RegiaoId,
} from '../logica/regiao';
import type { Estado } from '../estado/tipos';

export interface Regiao {
  filtro: FiltroRegiao;
  minhas: RegiaoId[];
  /** regiões que passam no filtro (null: todas) */
  conj: Set<RegiaoId> | null;
  /** a região do aluno vem das provas-alvo (não foi escolhida à mão) */
  automatica: boolean;
}

export function regiaoDoEstado(e: Pick<Estado, 'pref' | 'perfil'>): Regiao {
  const filtro = ehFiltro(e.pref.filtroRegiao) ? e.pref.filtroRegiao : 'minha';
  const minhas = minhasRegioes(e.pref, e.perfil?.provasAlvo || [], CATALOGO);
  return { filtro, minhas, conj: regioesDoFiltro(filtro, minhas), automatica: !(e.pref.regioes && e.pref.regioes.length) };
}

export function useRegiao(): Regiao {
  const e = useEstado();
  return useMemo(() => regiaoDoEstado(e), [e.pref, e.perfil]); // eslint-disable-line react-hooks/exhaustive-deps
}

export function defineFiltroRegiao(f: FiltroRegiao) {
  atualiza((x) => ({ ...x, pref: { ...x.pref, filtroRegiao: f } }));
}

/** Região das minhas provas escolhida à mão; null volta ao automático (pelas provas-alvo). */
export function defineMinhasRegioes(l: RegiaoId[] | null) {
  atualiza((x) => ({ ...x, pref: { ...x.pref, regioes: l && l.length ? l : null, filtroRegiao: 'minha' } }));
}

/** Os chips do filtro + a frase da região do aluno com o seletor. aoMudar: além de gravar (ex.: refazer a rodada). */
export function FiltroRegiaoChips({ aoMudar, compacto }: { aoMudar?: (f: FiltroRegiao) => void; compacto?: boolean }) {
  const r = useRegiao();
  const [abrir, setAbrir] = useState(false);
  const muda = (f: FiltroRegiao) => { if (f === r.filtro) return; defineFiltroRegiao(f); aoMudar?.(f); };
  return (
    <div className={'fr-regiao' + (compacto ? ' compacto' : '')}>
      <div className="chips fr-chips" role="group" aria-label="Questões de qual região">
        <button className="chip" aria-pressed={r.filtro === 'minha'} onClick={() => muda('minha')}>Minha região</button>
        <button className="chip" aria-pressed={r.filtro === 'todas'} onClick={() => muda('todas')}>Todas as regiões</button>
        {REGIOES_PRATICA.map((x) => (
          <button key={x.id} className="chip" aria-pressed={r.filtro === x.id} onClick={() => muda(x.id)}>{x.curto}</button>
        ))}
      </div>
      <p className="fr-frase">
        <span>{r.minhas.length
          ? <>Minha região: <b>{descreveFiltro('minha', r.minhas)}</b>{r.automatica ? ', pelas suas provas-alvo' : ''}.</>
          : <>Escolha suas provas-alvo ou a sua região para praticar com as provas de onde você vai prestar.</>}</span>
        <button className="link-sec fr-trocar" aria-expanded={abrir} onClick={() => setAbrir(!abrir)}>{abrir ? 'Fechar' : 'Trocar'}</button>
      </p>
      {abrir && <SeletorMinhaRegiao aoMudou={() => aoMudar?.('minha')} />}
    </div>
  );
}

/** Seletor da "região das minhas provas": automático (pelas provas-alvo) ou as regiões marcadas à mão. */
export function SeletorMinhaRegiao({ aoMudou, semTitulo }: { aoMudou?: () => void; semTitulo?: boolean }) {
  const e = useEstado();
  const r = useRegiao();
  const auto = regioesDasProvas(e.perfil?.provasAlvo || [], CATALOGO);
  const marcadas = new Set(r.automatica ? [] : r.minhas);
  const alterna = (id: RegiaoId) => {
    const n = new Set(marcadas);
    n.has(id) ? n.delete(id) : n.add(id);
    defineMinhasRegioes(REGIOES_PRATICA.map((x) => x.id).filter((x) => n.has(x)));
    aoMudou?.();
  };
  return (
    <div className="fr-seletor" role="group" aria-label="Região das minhas provas">
      {!semTitulo && <p className="fr-seletor-tit">Onde você vai prestar a prova?</p>}
      <div className="chips">
        <button className="chip" aria-pressed={r.automatica} onClick={() => { defineMinhasRegioes(null); aoMudou?.(); }}>
          Pelas provas-alvo{auto.length ? ` (${auto.map((x) => nomeRegiao(x)).join(', ')})` : ''}
        </button>
        {REGIOES_PRATICA.map((x) => (
          <button key={x.id} className="chip" aria-pressed={marcadas.has(x.id)} onClick={() => alterna(x.id)}>{x.curto}</button>
        ))}
      </div>
      <p className="fr-nota">Pode marcar mais de uma. As questões do ENEM entram sempre junto com a sua região.</p>
    </div>
  );
}

/** Aviso discreto quando a região tem poucas (ou nenhuma) questões aqui, com "ver de outras regiões". */
export function AvisoRegiao({ f, onde = 'neste conteúdo', aoVerOutras }: { f: Pick<Filtrado<unknown>, 'daRegiao' | 'total' | 'reserva' | 'poucas'>; onde?: string; aoVerOutras?: () => void }) {
  const r = useRegiao();
  if (!r.conj || (!f.reserva && !f.poucas)) return null;
  const nome = descreveFiltro(r.filtro, r.minhas);
  const ver = () => { defineFiltroRegiao('todas'); aoVerOutras?.(); };
  return (
    <p className="fr-aviso" role="status">
      <span>{f.reserva
        ? <>Ainda não há questões de {nome} {onde}. Mostrando as de todas as regiões.</>
        : <>Só {f.daRegiao === 1 ? '1 questão' : `${f.daRegiao} questões`} de {nome} {onde}.</>}</span>
      {!f.reserva && <button className="link-sec" onClick={ver}>Ver de outras regiões ({f.total - f.daRegiao})</button>}
    </p>
  );
}

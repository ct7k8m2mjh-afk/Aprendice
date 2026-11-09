import { useMemo, useState } from 'react';
import { CATALOGO, REGIOES, escolasComQuestoes } from '../dados/provas';
import { regiaoDaProva, type RegiaoId } from '../logica/regiao';
import { useTodasMaterias } from '../dados/conteudo';
import { norm } from '../logica/correcao';
import { Icone } from '../ui/Icone';

/** Seleção de provas-alvo a partir do catálogo nacional, com filtro por região e busca. */
export function EscolhaProvas({ valor, aoMudar }: { valor: string[]; aoMudar: (v: string[]) => void }) {
  const todas = useTodasMaterias();
  const nQ = useMemo(() => (todas ? escolasComQuestoes(todas) : new Map<string, number>()), [todas]);
  const [regiao, setRegiao] = useState<RegiaoId | 'todas'>('todas');
  const [t, setT] = useState('');
  const lista = useMemo(() => {
    const q = norm(t);
    return CATALOGO.filter((p) => (regiao === 'todas' || regiaoDaProva(p) === regiao) && (!q || norm([p.prova, p.instituicao, p.sigla, p.uf, p.cidade, p.banca].join(' ')).includes(q)))
      .sort((a, b) => (a.id === 'enem' ? -1 : b.id === 'enem' ? 1 : (nQ.get(b.id) || 0) - (nQ.get(a.id) || 0) || a.prova.localeCompare(b.prova)));
  }, [regiao, t, nQ]);
  const alterna = (id: string) => aoMudar(valor.includes(id) ? valor.filter((x) => x !== id) : [...valor, id]);

  return (
    <div className="escolha-provas">
      <div className="ep-filtros">
        <label className="ep-busca"><Icone nome="busca" /><span className="sr">Buscar prova</span>
          <input value={t} onChange={(e) => setT(e.target.value)} placeholder="Buscar faculdade, cidade ou banca" /></label>
        <div className="chips" role="group" aria-label="Região">
          <button className="chip" aria-pressed={regiao === 'todas'} onClick={() => setRegiao('todas')}>Todas</button>
          {REGIOES.map((r) => <button key={r.id} className="chip" aria-pressed={regiao === r.id} onClick={() => setRegiao(r.id)}>{r.curto}</button>)}
        </div>
      </div>
      <p className="fraco" style={{ fontSize: 14, margin: '4px 0 10px' }}>{valor.length ? `${valor.length} selecionada${valor.length > 1 ? 's' : ''}` : 'Escolha ao menos uma'}</p>
      <ul className="ep-lista">
        {lista.map((p) => {
          const n = nQ.get(p.id) || 0, sel = valor.includes(p.id);
          return (
            <li key={p.id}>
              <button className={'ep-item' + (sel ? ' sel' : '')} aria-pressed={sel} onClick={() => alterna(p.id)}>
                <span className="ep-caixa" aria-hidden>{sel && <Icone nome="check" tam={15} />}</span>
                <span className="ep-txt">
                  <b>{p.prova}{p.sigla && p.sigla !== p.prova ? ` · ${p.sigla}` : ''}</b>
                  <small>{[p.instituicao !== p.prova ? p.instituicao : null, [p.cidade, p.uf].filter(Boolean).join('/')].filter(Boolean).join(' · ') || p.regiao}</small>
                </span>
                <span className={'etq' + (n ? ' ok' : '')}>{n ? `${n} questões` : 'em preparação'}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

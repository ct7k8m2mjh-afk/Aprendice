import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icone } from '../ui/Icone';
import { useTodasMaterias } from '../dados/conteudo';
import { MATERIAS, nomeMateria } from '../dados/materias';
import { CATALOGO } from '../dados/provas';
import { useIndiceProvas } from '../dados/provasCompletas';
import { norm } from '../logica/correcao';
import { ordenaBusca } from '../logica/busca';
import { IcTema } from '../ui/IconeTema';
import { useRegiao } from '../ui/FiltroRegiao';
import { deFiltro, filtraRegiao } from '../logica/regiao';
import type { MateriaId } from '../dados/tipos';

interface Resultado { grupo: string; titulo: string; det: string; ir: string; m?: MateriaId; ic?: string }

export function Busca({ aoFechar }: { aoFechar: () => void }) {
  const todas = useTodasMaterias();
  const rg = useRegiao();
  const provasCompletas = useIndiceProvas();
  const nav = useNavigate();
  const [t, setT] = useState('');
  const [sel, setSel] = useState(0);
  const inp = useRef<HTMLInputElement>(null);
  useEffect(() => { inp.current?.focus(); }, []);
  // Esc fecha com o foco em qualquer lugar da janela (no Fechar, num resultado), não só no campo (casca 26)
  useEffect(() => {
    // na captura: o Esc fecha só a busca, sem chegar ao atalho da tela de baixo (sair da questão)
    const f = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); aoFechar(); } };
    addEventListener('keydown', f, true);
    return () => removeEventListener('keydown', f, true);
  }, [aoFechar]);

  const indice = useMemo<Resultado[]>(() => {
    const r: Resultado[] = [];
    for (const m of MATERIAS) r.push({ grupo: 'Matérias', titulo: m.nome, det: m.ativa ? m.descricao : 'Em preparação', ir: `/m/${m.id}` });
    if (!todas) return r;
    for (const mc of todas) {
      for (const mod of mc.conteudo.modulos) {
        r.push({ grupo: 'Temas', titulo: mod.nome, det: nomeMateria(mc.id), ir: `/m/${mc.id}/tema/${mod.id}`, m: mc.id, ic: mod.id });
        for (const s of mod.subs) {
          const fr = filtraRegiao(mc.porSub.get(s.id) || [], rg.conj), n = fr.l.length;
          // a contagem diz de onde são as questões quando segue o filtro de região (revisão de 20/11/2026, casca 29)
          const onde = rg.conj ? ` ${fr.reserva ? 'de outras regiões' : deFiltro(rg.filtro, rg.minhas)}` : '';
          if (n) r.push({ grupo: 'Conteúdos', titulo: s.nome.charAt(0).toUpperCase() + s.nome.slice(1), det: `${nomeMateria(mc.id)} · ${mod.nome} · ${n} ${n === 1 ? 'questão' : 'questões'}${onde}`, ir: `/m/${mc.id}/escada/${s.id}`, m: mc.id, ic: s.id });
        }
      }
      for (const c of mc.conteudo.flash) r.push({ grupo: 'Cartões', titulo: c.frente, det: `Flashcard · ${nomeMateria(mc.id)}`, ir: `/m/${mc.id}/flashcards?c=${c.id}`, m: mc.id });
    }
    for (const e of provasCompletas || []) r.push({ grupo: 'Simulados', titulo: e.titulo, det: `Prova completa · ${e.questoes} questões`, ir: `/simulados/prova/${encodeURIComponent(e.id)}` });
    for (const p of CATALOGO) r.push({ grupo: 'Provas e faculdades', titulo: `${p.prova} · ${p.sigla || p.instituicao}`, det: [p.cidade, p.uf].filter(Boolean).join(' · ') || p.regiao, ir: `/provas/${p.id}` });
    return r;
  }, [todas, provasCompletas, rg.conj, rg.filtro, rg.minhas]);

  const lista = useMemo(() => {
    const q = norm(t);
    if (!q) return indice.filter((x) => x.grupo === 'Matérias' || x.grupo === 'Temas').slice(0, 14);
    // singular e plural casam, e a ordem é por relevância com conteúdos e temas antes dos cartões (logica/busca.ts)
    return ordenaBusca(indice, t);
  }, [t, indice]);

  useEffect(() => setSel(0), [t]);

  const vai = (r: Resultado) => { aoFechar(); nav(r.ir); };

  let grupoAnt = '';
  return (
    <div className="veu" onMouseDown={(e) => { if (e.target === e.currentTarget) aoFechar(); }}>
      <div className="janela busca" role="dialog" aria-modal="true" aria-label="Buscar">
        <div className="cab" style={{ gap: 12 }}>
          <Icone nome="busca" />
          <input ref={inp} className="entrada" style={{ border: 0, boxShadow: 'none', height: 40, padding: 0 }} placeholder="Buscar matérias, temas, conteúdos, flashcards e provas" value={t}
            onChange={(e) => setT(e.target.value)} aria-label="O que você procura"
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(lista.length - 1, s + 1)); }
              else if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
              else if (e.key === 'Enter' && lista[sel]) vai(lista[sel]);
            }} />
          <button className="btn-ic" onClick={aoFechar} aria-label="Fechar"><Icone nome="fechar" /></button>
        </div>
        <div className="corpo" style={{ padding: '6px 10px 12px' }}>
          {!lista.length && <p className="vazio">Nada encontrado para “{t}”.</p>}
          {lista.map((r, i) => {
            const g = r.grupo !== grupoAnt ? (grupoAnt = r.grupo) : null;
            return (
              <div key={r.grupo + r.ir + i}>
                {g && <div className="busca-grupo">{g}</div>}
                <button className={'busca-item' + (i === sel ? ' sel' : '') + (r.m ? ' m-' + r.m : '')} onMouseEnter={() => setSel(i)} onClick={() => vai(r)}>
                  {r.m && r.ic ? (r.ic.includes('.') ? <span className="mini-ic mini-ponto" aria-hidden><i className="ponto-sub" aria-hidden /></span> : <IcTema m={r.m} tema={r.ic} tam={32} />) : <span className="mini-ic"><Icone nome={r.grupo === 'Simulados' ? 'relogio' : r.grupo === 'Matérias' ? 'livro' : r.grupo === 'Cartões' ? 'cartas' : 'predio'} /></span>}
                  <span><span className="tit">{r.titulo}</span><span className="det">{r.det}</span></span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

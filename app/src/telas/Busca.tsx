import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icone } from '../ui/Icone';
import { useTodasMaterias } from '../dados/conteudo';
import { MATERIAS, nomeMateria } from '../dados/materias';
import { CATALOGO, edicoes, nomeEdicao } from '../dados/provas';
import { norm } from '../logica/correcao';
import { Ic3D } from '../ui/comum';
import type { MateriaId } from '../dados/tipos';

interface Resultado { grupo: string; titulo: string; det: string; ir: string; m?: MateriaId; ic?: string }

export function Busca({ aoFechar }: { aoFechar: () => void }) {
  const todas = useTodasMaterias();
  const nav = useNavigate();
  const [t, setT] = useState('');
  const [sel, setSel] = useState(0);
  const inp = useRef<HTMLInputElement>(null);
  useEffect(() => { inp.current?.focus(); }, []);

  const indice = useMemo<Resultado[]>(() => {
    const r: Resultado[] = [];
    for (const m of MATERIAS) r.push({ grupo: 'Matérias', titulo: m.nome, det: m.ativa ? m.descricao : 'Em preparação', ir: `/m/${m.id}` });
    if (!todas) return r;
    for (const mc of todas) {
      for (const mod of mc.conteudo.modulos) {
        r.push({ grupo: 'Temas', titulo: mod.nome, det: nomeMateria(mc.id), ir: `/m/${mc.id}/tema/${mod.id}`, m: mc.id, ic: mod.id });
        for (const s of mod.subs) {
          const n = mc.porSub.get(s.id)?.length || 0;
          if (n) r.push({ grupo: 'Conteúdos', titulo: s.nome.charAt(0).toUpperCase() + s.nome.slice(1), det: `${nomeMateria(mc.id)} · ${mod.nome} · ${n} ${n === 1 ? 'questão' : 'questões'}`, ir: `/m/${mc.id}/escada/${s.id}`, m: mc.id, ic: s.id });
        }
      }
      for (const c of mc.conteudo.flash) r.push({ grupo: 'Cartões', titulo: c.frente, det: `Flashcard · ${nomeMateria(mc.id)}`, ir: `/m/${mc.id}/flashcards?c=${c.id}`, m: mc.id });
    }
    for (const e of edicoes(todas).filter((x) => x.completa)) r.push({ grupo: 'Simulados', titulo: nomeEdicao(e), det: 'Prova completa · todas as matérias', ir: `/simulados/prova/${encodeURIComponent(e.chave)}` });
    for (const p of CATALOGO) r.push({ grupo: 'Provas e faculdades', titulo: `${p.prova} · ${p.sigla || p.instituicao}`, det: [p.cidade, p.uf].filter(Boolean).join(' · ') || p.regiao, ir: `/provas/${p.id}` });
    return r;
  }, [todas]);

  const lista = useMemo(() => {
    const q = norm(t);
    if (!q) return indice.filter((x) => x.grupo === 'Matérias' || x.grupo === 'Temas').slice(0, 14);
    const ps = q.split(' ');
    return indice
      .map((x) => { const h = norm(x.titulo + ' ' + x.det); const ok = ps.every((p) => h.includes(p)); return ok ? { x, s: norm(x.titulo).startsWith(ps[0]) ? 0 : 1 } : null; })
      .filter(Boolean)
      .sort((a, b) => a!.s - b!.s)
      .slice(0, 40)
      .map((y) => y!.x);
  }, [t, indice]);

  useEffect(() => setSel(0), [t]);

  const vai = (r: Resultado) => { aoFechar(); nav(r.ir); };

  let grupoAnt = '';
  return (
    <div className="veu" onMouseDown={(e) => { if (e.target === e.currentTarget) aoFechar(); }}>
      <div className="janela busca" role="dialog" aria-modal="true" aria-label="Buscar">
        <div className="cab" style={{ gap: 12 }}>
          <Icone nome="busca" />
          <input ref={inp} className="entrada" style={{ border: 0, boxShadow: 'none', height: 40, padding: 0 }} placeholder="Buscar conteúdos, temas, provas, cartões" value={t}
            onChange={(e) => setT(e.target.value)} aria-label="O que você procura"
            onKeyDown={(e) => {
              if (e.key === 'Escape') aoFechar();
              else if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(lista.length - 1, s + 1)); }
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
                  {r.m && r.ic ? <Ic3D m={r.m} chave={r.ic} tam={32} /> : <span className="mini-ic"><Icone nome={r.grupo === 'Simulados' ? 'relogio' : r.grupo === 'Matérias' ? 'livro' : r.grupo === 'Cartões' ? 'cartas' : 'predio'} /></span>}
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

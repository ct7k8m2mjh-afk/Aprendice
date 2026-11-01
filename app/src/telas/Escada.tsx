import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useMateria } from '../dados/conteudo';
import { materia as infoMateria } from '../dados/materias';
import { useMateriaEstado } from '../estado/loja';
import { progressoEscada } from '../logica/estatisticas';
import { filaDe, emDias } from '../logica/revisao';
import { Barra, Carregando, Ic3D, cap, plural, useTitulo } from '../ui/comum';
import { Icone } from '../ui/Icone';
import { CartaoTeoriaView } from './Tema';
import type { MateriaId } from '../dados/tipos';

export function rotuloDif(d: number) { return d <= 3 ? 'fácil' : d <= 6 ? 'média' : 'difícil'; }

export function Escada() {
  const { m, sub } = useParams() as { m: MateriaId; sub: string };
  const mc = useMateria(m);
  const s = useMateriaEstado(m);
  const [teoria, setTeoria] = useState(false);
  const mod = mc?.conteudo.modulos.find((x) => x.id === sub.split('.')[0]);
  const conteudo = mod?.subs.find((x) => x.id === sub);
  useTitulo(conteudo ? cap(conteudo.nome) : 'Escada');
  if (!mc) return <div className="conteudo"><Carregando /></div>;
  const l = mc.porSub.get(sub) || [];
  if (!mod || !l.length) return <div className="conteudo vazio"><h3>Escada não encontrada</h3><Link className="btn sec" to={`/m/${m}`}>Voltar</Link></div>;
  const p = progressoEscada(l, s);
  const prox = l.find((q) => !s.q[q.id]?.tent.length);
  const cartoes = mod.cartoes.filter((c) => c.sub === sub);
  const degraus = [...new Set(l.map((q) => q.degrau))].length;

  return (
    <div className={`conteudo estreito m-${m}`}>
      <nav className="migalhas" aria-label="Você está em">
        <Link to={`/m/${m}`}>{infoMateria(m)?.nome}</Link><Icone nome="direita" tam={14} />
        <Link to={`/m/${m}/tema/${mod.id}`}>{mod.nome}</Link><Icone nome="direita" tam={14} /><span>Escada</span>
      </nav>
      <div className="tema-cab">
        <Ic3D m={m} chave={sub} tam={88} />
        <div>
          <h1>{cap(conteudo!.nome)}</h1>
          <p className="sub num">{plural(l.length, 'questão real', 'questões reais')} em {plural(degraus, 'degrau', 'degraus')}, do mais fácil ao mais difícil</p>
        </div>
      </div>
      <div className="escada-acao folha">
        <div style={{ flex: 1 }}>
          <b className="num">{p.feitas} de {p.total} feitas · {p.certas} certas</b>
          <Barra valor={p.feitas / p.total} rotulo="Progresso na escada" />
        </div>
        <Link to={`/m/${m}/q/${(prox || l[0]).id}?ctx=escada`} className="btn">{p.feitas === 0 ? 'Começar a escada' : prox ? 'Continuar' : 'Refazer do início'} <Icone nome="direita" /></Link>
      </div>

      {cartoes.length > 0 && (
        <section className="secao">
          <button className="sanfona" aria-expanded={teoria} onClick={() => setTeoria(!teoria)}>
            <Icone nome="livro" /> <span>Teoria antes de começar</span><Icone nome="baixo" className={teoria ? 'gira' : ''} />
          </button>
          {teoria && cartoes.map((c, i) => <CartaoTeoriaView key={i} c={c} />)}
        </section>
      )}

      <section className="secao">
        <h2 className="sec-tit">Degraus</h2>
        <ol className="degraus">
          {l.map((q, i) => {
            const t = s.q[q.id]?.tent || [];
            const ult = t[t.length - 1];
            const f = filaDe(s.q[q.id]);
            return (
              <li key={q.id}>
                <Link to={`/m/${m}/q/${q.id}?ctx=escada`} className={'degrau' + (ult ? (ult.ok ? ' ok' : ' err') : '') + (q.id === prox?.id ? ' prox' : '')}>
                  <span className="dg-n num" aria-label={`Degrau ${i + 1}`}>{ult ? <Icone nome={ult.ok ? 'check' : 'fechar'} tam={16} /> : i + 1}</span>
                  <span className="dg-txt">
                    <b>{q.conceito || `${q.escola} ${q.ano}`}</b>
                    <small>{q.escola} {q.ano}{q.n ? ` · questão ${q.n}` : ''} · {rotuloDif(q.dif)}{f ? ` · revisar ${emDias(f.vence)}` : ''}</small>
                  </span>
                  <Icone nome="direita" />
                </Link>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}

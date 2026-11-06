import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { carregaFiguras, useMateria } from '../dados/conteudo';
import { materia as infoMateria } from '../dados/materias';
import { useMateriaEstado } from '../estado/loja';
import { progressoEscada } from '../logica/estatisticas';
import { Barra, Carregando, Ic3D, cap, plural, useTitulo } from '../ui/comum';
import { Icone } from '../ui/Icone';
import { CabMateria, FaixaTemas } from './Materia';
import type { CartaoTeoria, Figura, MateriaId, Modulo } from '../dados/tipos';

export function CartaoTeoriaView({ c, figs }: { c: CartaoTeoria; figs?: Figura[] }) {
  return (
    <article className="cartao-teoria">
      <h3>{c.titulo}</h3>
      {c.oque && <p>{c.oque}</p>}
      {c.identificar && <p><b>Como reconhecer na prova. </b>{c.identificar.replace(/^Pistas:\s*/i, '')}</p>}
      {c.exemplo && <p><b>Exemplo. </b>{c.exemplo}</p>}
      {c.caderno && c.caderno.length > 0 && (
        <ul className="caderno">{c.caderno.map((x, i) => <li key={i}>{x}</li>)}</ul>
      )}
      {c.cuidado && <p className="cuidado"><Icone nome="info" tam={16} /> <span><b>Cuidado: </b>{c.cuidado}</span></p>}
      {figs && figs.map((f, i) => (
        <figure key={i} className="fig-teoria">
          <img src={f.u} alt={f.t} loading="lazy" />
          <figcaption>{f.t}<small>{f.fonte}</small></figcaption>
        </figure>
      ))}
    </article>
  );
}

export function TeoriaModulo({ m, mod }: { m: MateriaId; mod: Modulo }) {
  const [figs, setFigs] = useState<Figura[]>([]);
  useEffect(() => { carregaFiguras(m).then((f) => setFigs(f[mod.id] || [])); }, [m, mod.id]);
  return (
    <div className="teoria">
      <section className="bloco teoria-resumo">
        <p className="resumo-mod">{mod.resumo}</p>
        {mod.formulas.length > 0 && (<><h3>No caderno</h3><ul className="caderno">{mod.formulas.map((f, i) => <li key={i}>{f}</li>)}</ul></>)}
        {mod.erro && <p className="cuidado"><Icone nome="info" tam={16} /> <span><b>Erro que mais derruba: </b>{mod.erro}</span></p>}
      </section>
      <div className="grade g2" style={{ marginTop: 16 }}>
        {mod.cartoes.map((c, i) => <CartaoTeoriaView key={i} c={c} figs={figs.filter((f) => f.subs.includes(c.sub)).slice(0, 2)} />)}
      </div>
    </div>
  );
}

export function Tema() {
  const { m, mod: modId } = useParams() as { m: MateriaId; mod: string };
  const [qs, setQs] = useSearchParams();
  const abaPedida = qs.get('aba') === 'teoria' ? 'teoria' : 'conteudos';
  const mc = useMateria(m);
  const s = useMateriaEstado(m);
  const mod = mc?.conteudo.modulos.find((x) => x.id === modId);
  useTitulo(mod?.nome || 'Tema');
  if (!mc) return <div className="conteudo"><Carregando /></div>;
  if (!mod) return <div className="conteudo vazio"><h3>Tema não encontrado</h3><Link className="btn sec" to={`/m/${m}`}>Voltar à matéria</Link></div>;

  const subs = mod.subs.filter((x) => mc.porSub.get(x.id)?.length);
  const todas = mc.banco.filter((q) => q.modulo === mod.id);
  const p = progressoEscada(todas, s);
  const temTeoria = mod.cartoes.length > 0 || !!mod.resumo;
  const aba = temTeoria ? abaPedida : 'conteudos';

  return (
    <div className={`conteudo m-${m}`}>
      <CabMateria m={m} nome={infoMateria(m)?.nome || ''} sub={`${plural(mc.conteudo.modulos.length, 'tema', 'temas')} · questões reais, todas com a fonte`} titulo={false} />
      <FaixaTemas mc={mc} s={s} atual={mod.id} compacta />
      <nav className="migalhas" aria-label="Você está em"><Link to={`/m/${m}`}>{infoMateria(m)?.nome}</Link><Icone nome="direita" tam={14} /><span>{mod.nome}</span></nav>
      <div className="tema-cab">
        <h1><Ic3D m={m} chave={mod.id} tam={44} />{mod.nome}</h1>
        <p className="sub num">{subs.length ? `${plural(subs.length, 'conteúdo', 'conteúdos')} · ${p.feitas} ${p.feitas === 1 ? 'questão feita' : 'questões feitas'}` : 'Questões em preparação'}</p>
      </div>
      {temTeoria && (
        <div className="abas" role="group" aria-label="Seções">
          <button aria-pressed={aba === 'conteudos'} onClick={() => setQs({}, { replace: true })}>Conteúdos <small>{subs.length}</small></button>
          <button aria-pressed={aba === 'teoria'} onClick={() => setQs({ aba: 'teoria' }, { replace: true })}>Teoria <small>{mod.cartoes.length}</small></button>
        </div>
      )}
      {!subs.length && aba === 'conteudos' && (
        <section className="bloco preparo">
          <h2>Questões em preparação</h2>
          <p className="miolo">As questões de {mod.nome.toLowerCase()} entram com as provas completas: print fiel da prova, fonte (prova, ano, número, link) e gabarito oficial. Cada uma recebe o seu nível: básico, intermediário ou avançado.</p>
          <div className="preparo-acoes"><Link to="/simulados" className="btn sec">Ver simulados</Link></div>
        </section>
      )}
      {aba === 'teoria' ? <TeoriaModulo m={m} mod={mod} /> : (
        <div className="lista-escadas">
          {subs.map((sub) => {
            const l = mc.porSub.get(sub.id)!;
            const pe = progressoEscada(l, s);
            const prox = l.find((q) => !s.q[q.id]?.tent.length);
            return (
              <div key={sub.id} className="linha-escada">
                <Link to={`/m/${m}/escada/${sub.id}`} className="le-link">
                  <Ic3D m={m} chave={sub.id} tam={56} />
                  <span className="le-txt">
                    <b>{cap(sub.nome)}</b>
                    <small className="num">{plural(l.length, 'questão', 'questões')} · {pe.certas} certas de {pe.feitas} feitas</small>
                    <Barra valor={pe.feitas / pe.total} rotulo={`Progresso em ${sub.nome}`} />
                  </span>
                </Link>
                <Link to={`/m/${m}/q/${(prox || l[0]).id}?ctx=escada`} className="btn peq sec">{pe.feitas === 0 ? 'Começar' : prox ? 'Continuar' : 'Refazer'}</Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

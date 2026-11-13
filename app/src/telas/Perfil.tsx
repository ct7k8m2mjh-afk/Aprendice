import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { atualiza, useEstado } from '../estado/loja';
import { useTitulo } from '../ui/comum';
import { Icone } from '../ui/Icone';
import { EscolhaProvas } from './EscolhaProvas';
import { SeletorMinhaRegiao, useRegiao } from '../ui/FiltroRegiao';
import { descreveFiltro } from '../logica/regiao';
import { diasEntre, proximaProva } from '../logica/revisao';
import { CATALOGO } from '../dados/provas';
import { plural } from '../ui/comum';
import { nomeProva } from '../ui/revisao/AgendaRevisao';

export function Perfil() {
  useTitulo('Perfil');
  const e = useEstado();
  const nav = useNavigate();
  const p = e.perfil!;
  const [nome, setNome] = useState(p.nome);
  const [email, setEmail] = useState(p.email);
  const [salvo, setSalvo] = useState(false);
  const rg = useRegiao();
  const muda = (f: Partial<typeof p>) => atualiza((x) => (x.perfil ? { ...x, perfil: { ...x.perfil, ...f } } : x));

  return (
    <div className="conteudo estreito">
      <div className="titulo-pag perfil-cab">
        <span className="avatar grande" aria-hidden>{(p.nome || 'E').charAt(0).toUpperCase()}</span>
        <div><h1>{p.nome}</h1><p className="sub">Conta de demonstração · os dados ficam só neste aparelho</p></div>
      </div>

      <section className="bloco">
        <h2 className="sec-tit">Seus dados</h2>
        <form className="grade g2" onSubmit={(ev) => { ev.preventDefault(); muda({ nome: nome.trim() || 'Estudante', email: email.trim() }); setSalvo(true); setTimeout(() => setSalvo(false), 2000); }}>
          <div className="campo"><label htmlFor="pf-nome">Nome</label><input id="pf-nome" value={nome} onChange={(ev) => setNome(ev.target.value)} autoComplete="given-name" /></div>
          <div className="campo"><label htmlFor="pf-email">E-mail</label><input id="pf-email" type="email" value={email} onChange={(ev) => setEmail(ev.target.value)} autoComplete="email" /></div>
          <div><button className="btn sec" type="submit">{salvo ? <><Icone nome="check" /> Salvo</> : 'Salvar'}</button></div>
        </form>
      </section>

      <section className="bloco secao">
        <h2 className="sec-tit">Provas-alvo</h2>
        <p className="miolo" style={{ marginBottom: 14 }}>O início, os simulados sugeridos e o simulado “Minhas provas-alvo” seguem esta lista.</p>
        <EscolhaProvas valor={p.provasAlvo} aoMudar={(v) => muda({ provasAlvo: v })} />
      </section>

      <DatasProva />

      <section className="bloco secao">
        <h2 className="sec-tit">Região das minhas provas</h2>
        <p className="miolo" style={{ marginBottom: 14 }}>{rg.minhas.length
          ? <>Você pratica com questões de <b>{descreveFiltro('minha', rg.minhas)}</b>{rg.automatica ? ', pelas suas provas-alvo' : ''}. Nas listas de questões, os chips trocam para outra região ou para todas.</>
          : 'Sem provas-alvo nem região escolhida, você pratica com as questões de todas as regiões.'}</p>
        <SeletorMinhaRegiao semTitulo />
      </section>

      <section className="bloco secao">
        <h2 className="sec-tit">Meta semanal</h2>
        <div className="chips">
          {[70, 100, 150, 200, 300].map((n) => <button key={n} className="chip num" aria-pressed={p.meta === n} onClick={() => muda({ meta: n })}>{n} questões</button>)}
        </div>
      </section>

      <section className="secao perfil-pe">
        <Link to="/config" className="btn sec"><Icone nome="config" /> Configurações e meus dados</Link>
        <button className="btn fantasma" onClick={() => { atualiza((x) => ({ ...x, perfil: null })); nav('/boas-vindas'); }}>
          <Icone nome="sair" /> Sair da conta
        </button>
      </section>
      <p className="fraco" style={{ fontSize: 14, marginTop: 10 }}>Sair não apaga o seu progresso: ele continua salvo neste aparelho e volta quando você entrar de novo.</p>
    </div>
  );
}

const DATA_LONGA = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

/** Datas das provas-alvo (comando 24, fase 2): a agenda da revisão conta a partir da próxima. */
function DatasProva() {
  const e = useEstado();
  const p = e.perfil!;
  const datas = p.datasProva || {};
  const { hash } = useLocation();
  useEffect(() => { if (hash === '#datas-prova') document.getElementById('datas-prova')?.scrollIntoView({ block: 'start' }); }, [hash]);
  const muda = (id: string, v: string) => atualiza((x) => {
    if (!x.perfil) return x;
    const d = { ...(x.perfil.datasProva || {}) };
    if (v) d[id] = v; else delete d[id];
    return { ...x, perfil: { ...x.perfil, datasProva: d } };
  });
  const prox = proximaProva(p.provasAlvo, datas);
  return (
    <section className="bloco secao" id="datas-prova" style={{ scrollMarginTop: 80 }}>
      <h2 className="sec-tit">Datas das provas</h2>
      <p className="miolo" style={{ marginBottom: 14 }}>A revisão conta a partir da sua próxima prova: quanto mais perto, mais curto o intervalo entre uma revisão e outra. Sem data, vale a escala de 1, 3 e 7 dias.</p>
      {p.provasAlvo.length ? (
        <ul className="dp-lista">
          {p.provasAlvo.map((id) => {
            const c = CATALOGO.find((x) => x.id === id);
            return (
              <li key={id}>
                <label className="dp-nome" htmlFor={'dp-' + id}>{nomeProva(id)}{c && c.instituicao !== nomeProva(id) && <small>{c.instituicao}</small>}</label>
                <input id={'dp-' + id} type="date" value={datas[id] || ''} onChange={(ev) => muda(id, ev.target.value)} />
              </li>
            );
          })}
        </ul>
      ) : <p className="fraco" style={{ fontSize: 15 }}>Escolha suas provas-alvo acima para informar as datas.</p>}
      {prox && <p className="dp-prox" role="status">A agenda conta a partir de <b>{nomeProva(prox.id)}</b>, em {DATA_LONGA.format(prox.dia)}: faltam {plural(diasEntre(Date.now(), prox.dia), 'dia', 'dias')}.</p>}
    </section>
  );
}

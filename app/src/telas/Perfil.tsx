import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { atualiza, useEstado } from '../estado/loja';
import { useTitulo } from '../ui/comum';
import { Icone } from '../ui/Icone';
import { EscolhaProvas } from './EscolhaProvas';

export function Perfil() {
  useTitulo('Perfil');
  const e = useEstado();
  const nav = useNavigate();
  const p = e.perfil!;
  const [nome, setNome] = useState(p.nome);
  const [email, setEmail] = useState(p.email);
  const [salvo, setSalvo] = useState(false);
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

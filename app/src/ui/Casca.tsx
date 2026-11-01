import { useEffect, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Icone, type NomeIcone } from './Icone';
import { Anel, Logo } from './comum';
import { MATERIAS } from '../dados/materias';
import { atualiza, useEstado } from '../estado/loja';
import { semana } from '../logica/estatisticas';
import { Busca } from '../telas/Busca';

function usaTema() {
  const e = useEstado();
  const pref = e.pref.tema;
  const [sistemaEscuro, setSE] = useState(() => typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches);
  useEffect(() => {
    const mq = matchMedia('(prefers-color-scheme: dark)');
    const f = () => setSE(mq.matches);
    mq.addEventListener('change', f);
    return () => mq.removeEventListener('change', f);
  }, []);
  const escuro = pref === 'escuro' || (pref === 'sistema' && sistemaEscuro);
  useEffect(() => {
    document.documentElement.dataset.theme = escuro ? 'dark' : 'light';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', escuro ? '#0C0D10' : '#F1F1EE');
  }, [escuro]);
  return escuro;
}

export function defineTema(t: 'claro' | 'escuro' | 'sistema') { atualiza((e) => ({ ...e, pref: { ...e.pref, tema: t } })); }

function ItemNav({ para, icone, children, fim, extra }: { para: string; icone: NomeIcone; children: ReactNode; fim?: boolean; extra?: ReactNode }) {
  return (
    <NavLink to={para} end={fim} className={({ isActive }) => 'item-nav' + (isActive ? ' ativo' : '')} title={typeof children === 'string' ? children : undefined}>
      <Icone nome={icone} /><span className="rotulo">{children}</span>{extra}
    </NavLink>
  );
}

export function Casca({ children, foco = false }: { children: ReactNode; foco?: boolean }) {
  const e = useEstado();
  const escuro = usaTema();
  const loc = useLocation();
  const [busca, setBusca] = useState(false);
  const [rolou, setRolou] = useState(false);
  const fechado = e.pref.menuFechado;
  const meta = e.perfil?.meta || 150;
  const sem = semana(e);
  const nome = e.perfil?.nome || 'Estudante';

  useEffect(() => {
    const f = (ev: KeyboardEvent) => {
      if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 'k') { ev.preventDefault(); setBusca(true); }
    };
    addEventListener('keydown', f);
    return () => removeEventListener('keydown', f);
  }, []);
  useEffect(() => {
    const f = () => setRolou(scrollY > 4);
    addEventListener('scroll', f, { passive: true });
    return () => removeEventListener('scroll', f);
  }, []);
  useEffect(() => { setBusca(false); scrollTo(0, 0); }, [loc.pathname]);

  const mAtual = loc.pathname.match(/^\/m\/(\w+)/)?.[1];

  return (
    <div className={'casca' + (fechado ? ' menu-fechado' : '') + (foco ? ' foco' : '')}>
      <a href="#principal" className="sr">Pular para o conteúdo</a>
      <aside className="lado" aria-label="Menu principal">
        <div className="marca">
          <Link to="/" aria-label="Início"><Logo /></Link>
          <button className="btn-ic" style={{ border: 0, background: 'none' }} onClick={() => atualiza((x) => ({ ...x, pref: { ...x.pref, menuFechado: !fechado } }))}
            aria-label={fechado ? 'Abrir menu' : 'Recolher menu'} title={fechado ? 'Abrir menu' : 'Recolher menu'}>
            <Icone nome={fechado ? 'direita' : 'esquerda'} />
          </button>
        </div>
        <nav>
          <ItemNav para="/" icone="inicio" fim>Início</ItemNav>
          <ItemNav para="/simulados" icone="relogio">Simulados</ItemNav>
          <ItemNav para="/revisao" icone="repetir">Revisão</ItemNav>
          <ItemNav para="/desempenho" icone="grafico">Desempenho</ItemNav>
          <ItemNav para="/provas" icone="predio">Provas e faculdades</ItemNav>
        </nav>
        <div className="grupo">Matérias</div>
        <nav aria-label="Matérias">
          {MATERIAS.filter((m) => m.ativa).map((m) => (
            <NavLink key={m.id} to={`/m/${m.id}`} className={({ isActive }) => `item-nav m-${m.id}` + (isActive || mAtual === m.id ? ' ativo' : '')} title={m.nome}>
              <span className="ponto" aria-hidden /><span className="rotulo">{m.nome}</span>
            </NavLink>
          ))}
          <NavLink to="/materias" className={({ isActive }) => 'item-nav inativo' + (isActive || (mAtual && !MATERIAS.find((x) => x.id === mAtual)?.ativa) ? ' ativo' : '')} title="Outras matérias">
            <span className="pontos" aria-hidden>{MATERIAS.filter((m) => !m.ativa).map((m) => <i key={m.id} className={`m-${m.id}`} />)}</span>
            <span className="rotulo">Outras matérias</span><span className="em-breve">em breve</span>
          </NavLink>
        </nav>
        <div className="rodape">
          <div className="meta-lado" title="Meta da semana">
            <Anel valor={sem.semana / meta}>{Math.min(100, Math.round((sem.semana / meta) * 100))}%</Anel>
            <div><b className="num">{sem.semana} de {meta}</b><small>meta da semana · hoje {sem.hoje}</small></div>
          </div>
          <ItemNav para="/config" icone="config">Configurações</ItemNav>
        </div>
      </aside>

      <div className="principal">
        <header className={'topo' + (rolou ? ' rolou' : '')}>
          <Link to="/" className="logo-cel" aria-label="Início"><Logo /></Link>
          <button className="busca-btn" onClick={() => setBusca(true)} aria-label="Buscar">
            <Icone nome="busca" /><span className="txt">Buscar conteúdos, provas, cartões...</span><kbd>Ctrl K</kbd>
          </button>
          <div className="direita">
            <div className="tema-seg" role="group" aria-label="Tema">
              <button aria-pressed={!escuro} onClick={() => defineTema('claro')} title="Tema claro"><Icone nome="sol" /><span className="rotulo">Dia</span></button>
              <button aria-pressed={escuro} onClick={() => defineTema('escuro')} title="Tema escuro"><Icone nome="lua" /><span className="rotulo">Noite</span></button>
            </div>
            <Link to="/perfil" className="perfil-chip" aria-label="Meu perfil">
              <span className="avatar" aria-hidden>{nome.trim().charAt(0).toUpperCase()}</span><span className="nome">{nome.split(' ')[0]}</span>
            </Link>
          </div>
        </header>
        <main id="principal" className="conteudo-wrap">{children}</main>
      </div>

      <nav className="tabs" aria-label="Navegação">
        {([['/', 'inicio', 'Início'], ['/materias', 'livro', 'Matérias'], ['/simulados', 'relogio', 'Simulados'], ['/revisao', 'repetir', 'Revisão'], ['/perfil', 'usuario', 'Perfil']] as const).map(([p, ic, t]) => (
          <NavLink key={p} to={p} end={p === '/'} className={({ isActive }) => (isActive || (p === '/materias' && !!mAtual) ? 'ativo' : '')}>
            <span className="bolha-ic"><Icone nome={ic} /></span>{t}
          </NavLink>
        ))}
      </nav>
      {busca && <Busca aoFechar={() => setBusca(false)} />}
    </div>
  );
}

import { useEffect, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Icone, type NomeIcone } from './Icone';
import { Anel, Logo } from './comum';
import { MATERIAS_PRINCIPAIS, OUTRAS_MATERIAS, type MateriaInfo } from '../dados/materias';
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

function ItemMateria({ m, atual }: { m: MateriaInfo; atual?: string }) {
  return (
    <NavLink to={`/m/${m.id}`} className={({ isActive }) => `item-nav mat m-${m.id}` + (isActive || atual === m.id ? ' ativo' : '')} title={m.nome}>
      <Icone nome={`m_${m.id}` as NomeIcone} className="ic-mat" /><span className="rotulo">{m.nome}</span>
    </NavLink>
  );
}

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
  const emOutra = !!mAtual && OUTRAS_MATERIAS.some((m) => m.id === mAtual);
  const [outrasAbertas, setOutras] = useState(emOutra);
  useEffect(() => { if (emOutra) setOutras(true); }, [emOutra]);

  return (
    <div className={'casca' + (fechado ? ' menu-fechado' : '') + (foco ? ' foco' : '')}>
      <a href="#principal" className="sr">Pular para o conteúdo</a>
      <aside className="lado" aria-label="Menu principal">
        <div className="marca">
          <Link to="/" aria-label="Início" data-logo-alvo><Logo /></Link>
          <button className="btn-ic" style={{ border: 0, background: 'none' }} onClick={() => atualiza((x) => ({ ...x, pref: { ...x.pref, menuFechado: !fechado } }))}
            aria-label={fechado ? 'Abrir menu' : 'Recolher menu'} title={fechado ? 'Abrir menu' : 'Recolher menu'}>
            <Icone nome={fechado ? 'direita' : 'esquerda'} />
          </button>
        </div>
        <nav aria-label="Início e matérias">
          <ItemNav para="/" icone="inicio" fim>Início</ItemNav>
          {MATERIAS_PRINCIPAIS.map((m) => <ItemMateria key={m.id} m={m} atual={mAtual} />)}
          <button type="button" className={'item-nav outras' + (outrasAbertas ? ' aberto' : '')} aria-expanded={outrasAbertas} aria-controls="outras-materias"
            onClick={() => setOutras(!outrasAbertas)} title="Outras matérias">
            <Icone nome="grade" className="ic-mat" /><span className="rotulo">Outras matérias</span><Icone nome={outrasAbertas ? 'cima' : 'baixo'} className="seta" tam={16} />
          </button>
          <div id="outras-materias" className="sub-nav" hidden={!outrasAbertas}>
            {OUTRAS_MATERIAS.map((m) => <ItemMateria key={m.id} m={m} atual={mAtual} />)}
          </div>
        </nav>
        <div className="grupo" aria-hidden>Estudo</div>
        <nav aria-label="Estudo">
          <ItemNav para="/materias" icone="quadcheck">Questões</ItemNav>
          <ItemNav para="/simulados" icone="arquivo">Simulados</ItemNav>
          <ItemNav para="/revisao" icone="camadas">Revisão</ItemNav>
          <ItemNav para="/desempenho" icone="barras">Desempenho</ItemNav>
          <ItemNav para="/provas" icone="predio">Provas e faculdades</ItemNav>
        </nav>
        <div className="rodape">
          <div className="meta-lado" title="Meta da semana">
            <Anel valor={sem.semana / meta}>{Math.min(100, Math.round((sem.semana / meta) * 100))}%</Anel>
            <div><b className="num">{sem.semana} de {meta}</b><small>meta da semana · hoje {sem.hoje}</small></div>
          </div>
          <ItemNav para="/config" icone="config">Configurações</ItemNav>
        </div>
        <svg className="lado-onda" viewBox="0 0 260 200" preserveAspectRatio="none" aria-hidden>
          <path d="M0 40 C 60 70, 110 150, 260 200 L 0 200 Z" className="o1" />
          <path d="M0 95 C 50 120, 90 175, 170 200 L 0 200 Z" className="o2" />
        </svg>
      </aside>

      <div className="principal">
        <header className={'topo' + (rolou ? ' rolou' : '')}>
          <Link to="/" className="logo-cel" aria-label="Início"><Logo /></Link>
          <button className="busca-btn" onClick={() => setBusca(true)} aria-label="Buscar conteúdo, questões ou simulados" aria-keyshortcuts="Control+K">
            <Icone nome="busca" tam={20} /><span className="txt">Buscar conteúdo, questões ou simulados...</span><kbd>Ctrl K</kbd>
          </button>
          <div className="direita">
            <div className="tema-seg" role="group" aria-label="Tema">
              <button aria-pressed={!escuro} onClick={() => defineTema('claro')} title="Tema claro" aria-label="Tema claro"><Icone nome="sol" /><span className="rotulo-t">Dia</span></button>
              <button aria-pressed={escuro} onClick={() => defineTema('escuro')} title="Tema escuro" aria-label="Tema escuro"><Icone nome="lua" /><span className="rotulo-t">Noite</span></button>
            </div>
            <Link to="/perfil" className="perfil-chip" aria-label={`Meu perfil (${nome})`}>
              <span className="avatar" aria-hidden><Icone nome="usuario" tam={18} /></span><span className="nome">Meu perfil</span>
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

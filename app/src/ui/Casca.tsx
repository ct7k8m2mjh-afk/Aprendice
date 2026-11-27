import { useEffect, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Icone, type NomeIcone } from './Icone';
import { Anel, Logo } from './comum';
import { MATERIAS_MENU, materia, type MateriaInfo } from '../dados/materias';
import { atualiza, useEstado } from '../estado/loja';
import { semana } from '../logica/estatisticas';
import { Protecao } from './Protecao';
import { Busca } from '../telas/Busca';
import { destinoAba, destinoAtivo, materiaAtivaNoMenu } from '../logica/navAtiva';

export function usaTema() {
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
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', escuro ? '#1A1712' : '#F5F0E6');
  }, [escuro]);
  return escuro;
}

export function defineTema(t: 'claro' | 'escuro' | 'sistema') { atualiza((e) => ({ ...e, pref: { ...e.pref, tema: t } })); }

/** Dia/Noite segmentado do topo; também na entrada e nas boas-vindas (revisão de 19/11/2026, casca 2). */
export function TemaSeg({ escuro, className = '' }: { escuro: boolean; className?: string }) {
  return (
    <div className={'tema-seg ' + className} role="group" aria-label="Tema claro ou escuro">
      <button aria-pressed={!escuro} onClick={() => defineTema('claro')} title="Tema claro" aria-label="Tema claro"><Icone nome="sol" /><span className="rotulo-t">Dia</span></button>
      <button aria-pressed={escuro} onClick={() => defineTema('escuro')} title="Tema escuro" aria-label="Tema escuro"><Icone nome="lua" /><span className="rotulo-t">Noite</span></button>
    </div>
  );
}

function ItemMateria({ m, atual }: { m: MateriaInfo; atual?: string }) {
  const loc = useLocation();
  // um destino ativo só: na sessão de revisão (/m/<m>/q/…?ctx=revisao) a matéria não fica marcada junto com "Revisão"
  const ativa = destinoAtivo(loc.pathname, loc.search) === '/materias' && (materiaAtivaNoMenu(loc.pathname, loc.search, m.id) || atual === m.id);
  return (
    <NavLink to={`/m/${m.id}`} className={() => `item-nav mat m-${m.id}` + (ativa ? ' ativo' : '')} title={m.nome}>
      <Icone nome={`m_${m.id}` as NomeIcone} className="ic-mat" /><span className="rotulo">{m.nome}</span>
    </NavLink>
  );
}

function ItemNav({ para, icone, children, fim, extra }: { para: string; icone: NomeIcone; children: ReactNode; fim?: boolean; extra?: ReactNode }) {
  const loc = useLocation();
  const ativoExtra = para !== '/materias' && destinoAtivo(loc.pathname, loc.search) === para;
  return (
    <NavLink to={para} end={fim} className={({ isActive }) => 'item-nav' + (isActive || ativoExtra ? ' ativo' : '')} title={typeof children === 'string' ? children : undefined}>
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
  // trilho de ícones (641 a 1180 px): o botão do topo esconde a barra inteira e outro, no topo da página, a mostra de novo
  // (protótipo: #b-lado-fecha / .lado-abre); preferência só deste navegador
  const [oculto, setOculto] = useState(() => { try { return localStorage.getItem('ap-trilho-oculto') === '1'; } catch { return false; } });
  const poeOculto = (v: boolean) => { setOculto(v); try { localStorage.setItem('ap-trilho-oculto', v ? '1' : '0'); } catch { /* sem armazenamento */ } };
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
  // ao entrar numa matéria, o site inteiro (menu, abas, onda, anel da meta) assume a cor dela
  const corMateria = mAtual ? materia(mAtual)?.id : undefined;

  return (
    <div className={'casca' + (fechado ? ' menu-fechado' : '') + (oculto ? ' trilho-oculto' : '') + (foco ? ' foco' : '') + (corMateria ? ` em-materia m-${corMateria}` : '')}>
      <a href="#principal" className="sr">Pular para o conteúdo</a>
      <aside className="lado" aria-label="Menu principal">
        <div className="marca">
          <Link to="/" aria-label="Aprendice, ir ao início" data-logo-alvo><Logo /></Link>
          <button className="btn-ic" style={{ border: 0, background: 'none' }} onClick={() => atualiza((x) => ({ ...x, pref: { ...x.pref, menuFechado: !fechado } }))}
            aria-label={fechado ? 'Abrir menu' : 'Recolher menu'} title={fechado ? 'Abrir menu' : 'Recolher menu'}>
            <Icone nome={fechado ? 'direita' : 'esquerda'} />
          </button>
          <button className="btn-ic btn-trilho" onClick={() => poeOculto(true)} aria-label="Esconder a barra lateral" title="Esconder a barra">
            <Icone nome="esquerda" />
          </button>
        </div>
        {/* as nove matérias visíveis, todas iguais (pedido do dono, 27/11/2026); numa tela baixa só esta parte rola,
            e a meta da semana e Configurações ficam sempre à vista */}
        <div className="lado-rolo">
          <nav aria-label="Início e matérias">
            <ItemNav para="/" icone="inicio" fim>Início</ItemNav>
            {MATERIAS_MENU.map((m) => <ItemMateria key={m.id} m={m} atual={mAtual} />)}
          </nav>
          <div className="grupo" aria-hidden>Estudo</div>
          <nav aria-label="Estudo">
            <ItemNav para="/hoje" icone="calendario">Hoje</ItemNav>
            <ItemNav para="/materias" icone="quadcheck">Questões</ItemNav>
            <ItemNav para="/simulados" icone="arquivo">Simulados</ItemNav>
            <ItemNav para="/revisao" icone="camadas">Revisão</ItemNav>
            <ItemNav para="/desempenho" icone="barras">Desempenho</ItemNav>
            <ItemNav para="/provas" icone="predio">Provas e faculdades</ItemNav>
          </nav>
        </div>
        <div className="rodape">
          <div className="meta-lado" title="Meta da semana">
            <Anel valor={sem.semana / meta}>{Math.min(100, Math.round((sem.semana / meta) * 100))}%</Anel>
            <div><b className="num">{sem.semana} de {meta}</b><small>feitas na semana</small><small className="num">hoje {sem.hoje} · ontem {sem.ontem}</small></div>
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
          <button className="btn-ic abre-trilho" onClick={() => poeOculto(false)} aria-label="Mostrar a barra lateral" title="Mostrar a barra"><Icone nome="direita" /></button>
          <Link to="/" className="logo-cel" aria-label="Aprendice, ir ao início"><Logo /></Link>
          <button className="busca-btn" onClick={() => setBusca(true)} aria-label="Buscar matérias, temas, conteúdos, flashcards e provas" aria-keyshortcuts="Control+K">
            <Icone nome="busca" tam={20} /><span className="txt">Buscar conteúdos, flashcards e provas…</span><kbd>Ctrl K</kbd>
          </button>
          <div className="direita">
            <TemaSeg escuro={escuro} />
            <Link to="/perfil" className="perfil-chip" aria-label={`Meu perfil (${nome})`}>
              <span className="avatar" aria-hidden><Icone nome="usuario" tam={18} /></span><span className="nome">Meu perfil</span>
            </Link>
          </div>
        </header>
        <main id="principal" className="conteudo-wrap"><Protecao chave={loc.pathname} texto="Esta tela não abriu.">{children}</Protecao></main>
      </div>

      <nav className="tabs" aria-label="Navegação principal">
        {([['/', 'inicio', 'Início'], ['/materias', 'livro', 'Matérias'], ['/simulados', 'relogio', 'Simulados'], ['/revisao', 'repetir', 'Revisão'], ['/perfil', 'usuario', 'Perfil']] as const).map(([p, ic, t]) => (
          <NavLink key={p} to={p} end={p === '/'} className={() => (destinoAba(loc.pathname, loc.search) === p ? 'ativo' : '')}>
            <span className="bolha-ic"><Icone nome={ic} /></span>{t}
          </NavLink>
        ))}
      </nav>
      {busca && <Busca aoFechar={() => setBusca(false)} />}
    </div>
  );
}

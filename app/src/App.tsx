import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Casca } from './ui/Casca';
import { EstiloMaterias } from './ui/comum';
import { useEstado } from './estado/loja';
import { materiaAtual } from './dados/tipos';
import { BoasVindas } from './telas/BoasVindas';
import { Inicio } from './telas/Inicio';
import { ListaMaterias, Materia } from './telas/Materia';
import { Tema } from './telas/Tema';
import { Escada } from './telas/Escada';
import { QuestaoTela } from './telas/Questao';
import { Treino } from './telas/Treino';
import { TreinoMisto } from './telas/TreinoMisto';
import { Flashcards } from './telas/Flashcards';
import { Simulados } from './telas/Simulados';
import { SimuladoExec, SimuladoNovo } from './telas/SimuladoExec';
import { SimuladoResultado } from './telas/SimuladoResultado';
import { Revisao } from './telas/Revisao';
import { RevisaoSlides } from './telas/RevisaoSlides';
import { Desempenho } from './telas/Desempenho';
import { Provas, ProvaDetalhe } from './telas/Provas';
import { Perfil } from './telas/Perfil';
import { Config } from './telas/Config';
import { Abertura } from './ui/Abertura';
import { defineTelaCheia, useTelaCheia } from './ui/telaCheia';
import { useEffect } from 'react';

function Rotas() {
  const e = useEstado();
  const loc = useLocation();
  // sistema do protótipo: o menu continua visível no estudo e no simulado em andamento; some só na "Tela cheia" escolhida pelo aluno
  const telaCheia = useTelaCheia();
  const estudo = /^\/m\/\w+\/(q|treino|revisao)/.test(loc.pathname) || loc.pathname.includes('/flashcards/sessao') || loc.pathname.startsWith('/simulado/agora');
  useEffect(() => { if (!estudo) defineTelaCheia(false); }, [estudo]);
  if (!e.perfil && loc.pathname !== '/boas-vindas') return <Navigate to="/boas-vindas" replace />;
  const foco = estudo && telaCheia;
  if (loc.pathname === '/boas-vindas') return <BoasVindas />;
  // endereços antigos de Filosofia (/m/fil) e de Sociologia (/m/soc) levam à matéria unida, com o resto do caminho
  const antiga = loc.pathname.match(/^\/m\/(fil|soc)(\/.*)?$/);
  if (antiga) return <Navigate to={'/m/' + materiaAtual(antiga[1]) + (antiga[2] || '') + loc.search} replace />;
  return (
    <Casca foco={foco}>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/materias" element={<ListaMaterias />} />
        <Route path="/m/:m" element={<Materia />} />
        <Route path="/m/:m/tema/:mod" element={<Tema />} />
        <Route path="/m/:m/escada/:sub" element={<Escada />} />
        <Route path="/m/:m/q/:id" element={<QuestaoTela />} />
        <Route path="/m/:m/treino" element={<Treino />} />
        <Route path="/treino-geral" element={<TreinoMisto />} />
        <Route path="/m/:m/revisao/:sub" element={<RevisaoSlides />} />
        <Route path="/m/:m/flashcards" element={<Flashcards />} />
        <Route path="/m/:m/flashcards/sessao" element={<Flashcards sessao />} />
        <Route path="/simulados" element={<Simulados />} />
        <Route path="/simulados/prova/:chave" element={<SimuladoNovo />} />
        <Route path="/simulado/agora" element={<SimuladoExec />} />
        <Route path="/simulado/resultado/:ts" element={<SimuladoResultado />} />
        <Route path="/revisao" element={<Revisao />} />
        <Route path="/desempenho" element={<Desempenho />} />
        <Route path="/provas" element={<Provas />} />
        <Route path="/provas/:id" element={<ProvaDetalhe />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/config" element={<Config />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Casca>
  );
}

export function App() {
  return (
    <HashRouter>
      <EstiloMaterias />
      <Rotas />
      <Abertura />
    </HashRouter>
  );
}

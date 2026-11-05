import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Casca } from './ui/Casca';
import { EstiloMaterias } from './ui/comum';
import { useEstado } from './estado/loja';
import { BoasVindas } from './telas/BoasVindas';
import { Inicio } from './telas/Inicio';
import { ListaMaterias, Materia } from './telas/Materia';
import { Tema } from './telas/Tema';
import { Escada } from './telas/Escada';
import { QuestaoTela } from './telas/Questao';
import { Treino } from './telas/Treino';
import { Flashcards } from './telas/Flashcards';
import { Simulados } from './telas/Simulados';
import { SimuladoExec, SimuladoNovo } from './telas/SimuladoExec';
import { SimuladoResultado } from './telas/SimuladoResultado';
import { Revisao } from './telas/Revisao';
import { Desempenho } from './telas/Desempenho';
import { Provas, ProvaDetalhe } from './telas/Provas';
import { Perfil } from './telas/Perfil';
import { Config } from './telas/Config';
import { Abertura } from './ui/Abertura';

function Rotas() {
  const e = useEstado();
  const loc = useLocation();
  if (!e.perfil && loc.pathname !== '/boas-vindas') return <Navigate to="/boas-vindas" replace />;
  const foco = /^\/(m\/\w+\/(q|treino)|simulado\/agora)/.test(loc.pathname) || loc.pathname.includes('/flashcards/sessao');
  if (loc.pathname === '/boas-vindas') return <BoasVindas />;
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

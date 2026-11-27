import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './estilo/base.css';
import './estilo/app.css';
import './estilo/telas.css';
import './estilo/sistema.css';
import './estilo/icones-tema.css'; // ícones de tema no círculo (comando 19)
import './estilo/inicio.css'; // aba Início, capa da matéria e arte da matéria (comando 32)
import './estilo/regiao.css'; // filtro de região onde o aluno pratica (pedido do dono, 09/11/2026)
import './estilo/dominio.css'; // agenda pela data da prova e painel de domínio (comando 24, fase 2)
import './estilo/hoje.css'; // tela Hoje e Escudo TRI (comando 24, fase 3)
import './estilo/tipografia.css'; // guia tipográfico: carregado por último
import './estilo/correcao.css'; // correção em 4 blocos + resolução animada (comando 20)
import './estilo/grade-texto.css'; // texto na grade do caderno (dono, 27/11/2026)
import { App } from './App';
import { preparaConteudo } from './dados/conteudo';
import { iniciaConta } from './estado/sessao';
import { iniciaGradeTexto } from './ui/gradeTexto';

// texto direto sobre a folha sentado nas linhas do quadriculado (aprovado pelo dono, 27/11/2026)
iniciaGradeTexto();

// contas de verdade (20/11/2026): abre a sessão guardada e junta o progresso com a nuvem, sem esperar o conteúdo
iniciaConta();

preparaConteudo().then(() => {
  createRoot(document.getElementById('raiz')!).render(<StrictMode><App /></StrictMode>);
});

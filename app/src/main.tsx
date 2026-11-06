import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './estilo/base.css';
import './estilo/app.css';
import './estilo/telas.css';
import './estilo/sistema.css';
import './estilo/icones-tema.css'; // ícones de tema no círculo (comando 19)
import './estilo/inicio.css'; // aba Início, capa da matéria e arte da matéria (comando 32)
import './estilo/tipografia.css'; // guia tipográfico: carregado por último
import './estilo/correcao.css'; // correção em 4 blocos + resolução animada (comando 20)
import { App } from './App';
import { preparaConteudo } from './dados/conteudo';

preparaConteudo().then(() => {
  createRoot(document.getElementById('raiz')!).render(<StrictMode><App /></StrictMode>);
});

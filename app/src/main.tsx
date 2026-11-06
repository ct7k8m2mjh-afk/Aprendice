import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './estilo/base.css';
import './estilo/app.css';
import './estilo/telas.css';
import './estilo/sistema.css';
import './estilo/tipografia.css'; // guia tipográfico: carregado por último
import { App } from './App';
import { preparaConteudo } from './dados/conteudo';

preparaConteudo().then(() => {
  createRoot(document.getElementById('raiz')!).render(<StrictMode><App /></StrictMode>);
});

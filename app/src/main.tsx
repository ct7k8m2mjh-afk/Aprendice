import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './estilo/base.css';
import './estilo/app.css';
import './estilo/telas.css';
import { App } from './App';
import { preparaConteudo } from './dados/conteudo';

preparaConteudo().then(() => {
  createRoot(document.getElementById('raiz')!).render(<StrictMode><App /></StrictMode>);
});

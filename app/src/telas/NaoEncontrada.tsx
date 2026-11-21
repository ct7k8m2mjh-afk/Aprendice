import { Link } from 'react-router-dom';
import { useTitulo } from '../ui/comum';
import { Icone } from '../ui/Icone';

/** Endereço que não existe (revisão de 19/11/2026, casca 25; aprovado pelo dono em 20/11): antes voltava ao Início sem
 *  aviso; agora diz o que houve e oferece os caminhos de sempre, no mesmo estilo das outras telas de vazio. */
export function NaoEncontrada() {
  useTitulo('Página não encontrada');
  return (
    <div className="conteudo vazio nao-encontrada">
      <h1 className="ne-tit">Página não encontrada</h1>
      <p>O endereço pode estar incompleto ou a página pode ter mudado de lugar. O seu progresso continua salvo.</p>
      <div className="ne-acoes">
        <Link to="/" className="btn"><Icone nome="inicio" /> Ir para o início</Link>
        <Link to="/materias" className="btn sec">Ver matérias</Link>
      </div>
    </div>
  );
}

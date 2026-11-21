import { Link } from 'react-router-dom';
import { useTitulo } from '../ui/comum';
import { Icone } from '../ui/Icone';
import { useConta } from '../estado/sessao';
import { usaTema } from '../ui/Casca';

/**
 * Privacidade (LGPD; contas de verdade, decisão do dono de 20/11/2026): o que o site guarda, para quê e onde.
 * Aberta também antes de entrar (link no rodapé do login). Componentes e classes existentes, sem estilo novo.
 */
export function Privacidade() {
  useTitulo('Privacidade');
  usaTema(); // também fora da casca (antes de entrar)
  const conta = useConta();
  // modo de demonstração (sem nuvem, fase 'local'): o texto diz o que é verdade nesta versão (revisão de 21/11/2026, casca N1 e N2)
  const local = conta.fase === 'local';
  const voltar = conta.fase === 'dentro' || local ? '/perfil' : '/boas-vindas';
  return (
    <div className="conteudo estreito">
      <div className="titulo-pag"><h1>Privacidade</h1><p className="sub">O que o Aprendice guarda e para quê</p></div>

      <section className="bloco">
        <h2 className="sec-tit">O que guardamos</h2>
        <ul className="miolo">
          {local
            ? <li><b>Nome e e-mail</b> que você escreveu ao entrar, só neste aparelho. A senha não é guardada nem enviada.</li>
            : <li><b>E-mail e senha</b>, para você entrar na sua conta. A senha é guardada cifrada pelo serviço de contas; ninguém do Aprendice consegue lê-la.</li>}
          <li><b>Perfil de estudo</b>: o nome que você escolheu, as provas-alvo, as datas das provas e a meta de questões por semana.</li>
          <li><b>Progresso</b>: as respostas que você deu (letra, acerto, tempo, certeza), a revisão espaçada, os flashcards, os simulados feitos e as preferências de estudo.</li>
        </ul>
      </section>

      <section className="bloco secao">
        <h2 className="sec-tit">Para quê</h2>
        <p className="miolo">Só para o site funcionar para você: {local ? '' : 'entrar de qualquer aparelho, '}continuar de onde parou, montar a revisão e os treinos pelas suas provas-alvo e mostrar o seu desempenho. Não vendemos nem compartilhamos seus dados, não mostramos anúncios e não usamos rastreamento de terceiros (nada de análise de visitas, pixel ou cookie de propaganda).</p>
      </section>

      <section className="bloco secao">
        <h2 className="sec-tit">Onde fica</h2>
        <p className="miolo">{local
          ? 'Só neste aparelho, no navegador. Nesta versão nada é enviado para a internet: não há servidor nem conta na nuvem. Ao sair, o progresso continua guardado neste aparelho.'
          : 'Neste aparelho, para o site funcionar sem internet, e na nuvem, no serviço de contas Supabase (servidor em São Paulo). Cada conta só consegue ler e gravar os próprios dados. Ao sair da conta, o progresso sai deste aparelho e continua guardado na sua conta. Se você sair sem internet, o que ainda não foi enviado fica guardado neste aparelho, só para a sua conta, até você entrar de novo.'}</p>
      </section>

      <section className="bloco secao">
        <h2 className="sec-tit">Seus direitos</h2>
        <p className="miolo">Você pode ver e corrigir o seu perfil em Perfil, baixar uma cópia do seu progresso em Configurações e excluir a sua conta, com todos os dados, em Perfil, no botão “Excluir minha conta”: {local ? 'o perfil e o progresso são apagados deste aparelho, sem volta.' : 'a conta, o perfil e o progresso são apagados da nuvem e deste aparelho, sem volta.'} Os dados são tratados conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018).</p>
      </section>

      <div className="secao"><Link to={voltar} className="btn sec"><Icone nome="esquerda" /> Voltar</Link></div>
    </div>
  );
}

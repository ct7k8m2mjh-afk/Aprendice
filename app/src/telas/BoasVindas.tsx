import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo, useTitulo } from '../ui/comum';
import { Icone } from '../ui/Icone';
import { atualiza, pegaEstado } from '../estado/loja';
import { voltaAConta } from '../estado/conta';
import { sair, useConta } from '../estado/sessao';
import { EscolhaProvas } from './EscolhaProvas';
import { MATERIAS_PRINCIPAIS } from '../dados/materias';
import { IluMateria, temIlu } from '../ui/IconeMateria';
import { Login } from './Login';
import { TemaSeg, usaTema } from '../ui/Casca';


/** Primeira abertura: a conta (login de verdade no serviço de contas; estado/sessao.ts), provas-alvo e meta.
 *  Com a conta aberta e sem perfil de estudo na nuvem, começa direto nas provas-alvo. Sem serviço configurado (prévia),
 *  o login é o modo local de antes. */
export function BoasVindas() {
  useTitulo('Boas-vindas');
  const nav = useNavigate();
  // tema claro/escuro também antes de entrar (princípio 8; revisão de 19/11/2026, casca 2)
  const escuro = usaTema();
  const conta = useConta();
  const dentro = conta.fase === 'dentro';
  const [passo, setPasso] = useState(dentro ? 1 : 0);
  const [nome, setNome] = useState(dentro && conta.email ? nomeDoEmail(conta.email) : '');
  const [email, setEmail] = useState(conta.email || '');
  const [provas, setProvas] = useState<string[]>(['enem']);
  const [meta, setMeta] = useState(150);

  // cada etapa abre no topo (revisão de 19/11/2026, casca 9)
  useEffect(() => { window.scrollTo(0, 0); }, [passo]);
  // conta aberta sem perfil de estudo: segue para as provas-alvo; conta fechada: volta ao login
  useEffect(() => {
    if (conta.fase === 'dentro' && passo === 0) { const em = conta.email || ''; setEmail(em); if (!nome) setNome(nomeDoEmail(em)); setPasso(1); }
    if ((conta.fase === 'fora' || conta.fase === 'nova-senha') && passo !== 0) setPasso(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conta.fase]);
  const conclui = () => {
    atualiza((e) => ({ ...e, perfil: { nome: nome.trim() || 'Estudante', email: email.trim(), provasAlvo: provas, meta, criadoEm: Date.now() } }));
    nav('/', { replace: true });
  };

  // quem saiu da conta e entra de novo volta com o perfil inteiro (estado/conta.ts), sem refazer as boas-vindas
  const entra = (em: string) => {
    const volta = voltaAConta(pegaEstado(), em);
    if (volta) { atualiza(() => volta); nav('/', { replace: true }); return; }
    setEmail(em); if (!nome) setNome(nomeDoEmail(em)); setPasso(1);
  };
  // "Voltar" na primeira etapa depois do login: sai da conta e volta à tela de entrar
  const voltaAoLogin = () => { if (conta.fase === 'local') setPasso(0); else void sair(); };
  if (passo === 0) return <Login aoEntrar={entra} emailInicial={email} tema={<TemaSeg escuro={escuro} className="l-tema" />} />;

  return (
    <div className="bv">
      <div className="bv-lado" aria-hidden>
        <Logo className="bv-logo" />
        <div className="bv-ilus">
          {MATERIAS_PRINCIPAIS.filter((m) => temIlu(m.id)).map((m, i) => <span key={m.id} className="bv-ilu" style={{ animationDelay: `${i * 90}ms` }}><IluMateria m={m.id} /></span>)}
        </div>
        <p className="bv-frase">Questões reais do ENEM e dos vestibulares, do jeito que a banca cobra.</p>
      </div>
      <div className="bv-form">
        <TemaSeg escuro={escuro} className="bv-tema" />
        <Logo className="bv-logo-cel" />
        <ol className="bv-passos" aria-label="Etapas do cadastro">
          {['Sua conta', 'Provas-alvo', 'Ritmo'].map((t, i) => <li key={t} aria-current={i === passo ? 'step' : undefined} className={i < passo ? 'feito' : ''}><span>{i + 1}</span>{t}</li>)}
        </ol>

        {passo === 1 && (
          <div className="bv-corpo">
            <h1>Quais provas você vai prestar?</h1>
            <p className="miolo">Seu estudo passa a priorizar o que essas provas cobram e as questões da região delas. Você pode alterar a lista depois, no Perfil.</p>
            <EscolhaProvas valor={provas} aoMudar={setProvas} />
            <div className="bv-acoes">
              <button className="btn fantasma" onClick={voltaAoLogin}><Icone nome="esquerda" /> Voltar</button>
              <button className="btn grande" onClick={() => setPasso(2)} disabled={!provas.length}>Continuar <Icone nome="direita" /></button>
            </div>
          </div>
        )}

        {passo === 2 && (
          <div className="bv-corpo">
            <h1>Qual é o seu ritmo?</h1>
            <p className="miolo">Defina quantas questões quer resolver por semana. A meta aparece no menu lateral e pode ser alterada no Perfil.</p>
            <div className="bv-metas" role="radiogroup" aria-label="Meta semanal">
              {[[70, 'Leve', '10 por dia'], [150, 'Firme', 'cerca de 20 por dia'], [300, 'Intenso', 'cerca de 40 por dia']].map(([n, t, d]) => (
                <button key={n} role="radio" aria-checked={meta === n} className={'bv-meta' + (meta === n ? ' sel' : '')} onClick={() => setMeta(n as number)}>
                  <b className="num">{n}</b><span>{t}</span><small>{d}</small>
                </button>
              ))}
            </div>
            <div className="bv-acoes">
              <button className="btn fantasma" onClick={() => setPasso(1)}><Icone nome="esquerda" /> Voltar</button>
              <button className="btn grande" onClick={conclui}>Começar a estudar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Nome inicial a partir do e-mail (dá para trocar no perfil): "maria.silva@x.com" -> "Maria". */
function nomeDoEmail(email: string): string {
  const p = email.split('@')[0].split(/[._\-+0-9]+/).filter(Boolean)[0] || 'Estudante';
  return p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
}

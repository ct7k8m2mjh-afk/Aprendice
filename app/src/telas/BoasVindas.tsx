import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo, useTitulo } from '../ui/comum';
import { Icone } from '../ui/Icone';
import { atualiza, pegaEstado } from '../estado/loja';
import { voltaAConta } from '../estado/conta';
import { EscolhaProvas } from './EscolhaProvas';
import { MATERIAS_PRINCIPAIS } from '../dados/materias';
import { IluMateria, temIlu } from '../ui/IconeMateria';
import { Login } from './Login';
import { TemaSeg, usaTema } from '../ui/Casca';


/** Primeira abertura: conta de demonstração (login simulado, fica só no aparelho), provas-alvo e meta. */
export function BoasVindas() {
  useTitulo('Boas-vindas');
  const nav = useNavigate();
  // tema claro/escuro também antes de entrar (princípio 8; revisão de 19/11/2026, casca 2)
  const escuro = usaTema();
  const [passo, setPasso] = useState(0);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [provas, setProvas] = useState<string[]>(['enem']);
  const [meta, setMeta] = useState(150);

  // cada etapa abre no topo (revisão de 19/11/2026, casca 9)
  useEffect(() => { window.scrollTo(0, 0); }, [passo]);
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
  if (passo === 0) return <Login aoEntrar={entra} emailInicial={email} tema={<TemaSeg escuro={escuro} className="l-tema" />} />;

  return (
    <div className="bv">
      <div className="bv-lado" aria-hidden>
        <Logo className="bv-logo" />
        <div className="bv-ilus">
          {MATERIAS_PRINCIPAIS.filter((m) => temIlu(m.id)).map((m, i) => <span key={m.id} className="bv-ilu" style={{ animationDelay: `${i * 90}ms` }}><IluMateria m={m.id} /></span>)}
        </div>
        <p className="bv-frase">Questões reais dos vestibulares, do jeito que a banca cobra.</p>
      </div>
      <div className="bv-form">
        <TemaSeg escuro={escuro} className="bv-tema" />
        <Logo className="bv-logo-cel" />
        <ol className="bv-passos" aria-label="Etapas">
          {['Sua conta', 'Provas-alvo', 'Ritmo'].map((t, i) => <li key={t} aria-current={i === passo ? 'step' : undefined} className={i < passo ? 'feito' : ''}><span>{i + 1}</span>{t}</li>)}
        </ol>

        {passo === 1 && (
          <div className="bv-corpo">
            <h1>Quais provas você vai fazer?</h1>
            <p className="miolo">O site prioriza o que essas provas cobram: simulados, sugestões e treinos. Dá para mudar depois no perfil.</p>
            <EscolhaProvas valor={provas} aoMudar={setProvas} />
            <div className="bv-acoes">
              <button className="btn fantasma" onClick={() => setPasso(0)}><Icone nome="esquerda" /> Voltar</button>
              <button className="btn grande" onClick={() => setPasso(2)} disabled={!provas.length}>Continuar <Icone nome="direita" /></button>
            </div>
          </div>
        )}

        {passo === 2 && (
          <div className="bv-corpo">
            <h1>Qual o seu ritmo?</h1>
            <p className="miolo">Meta de questões por semana. Ela aparece no menu e no início; ajuste quando quiser.</p>
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

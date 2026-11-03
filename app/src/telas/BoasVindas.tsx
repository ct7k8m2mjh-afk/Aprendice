import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo, useTitulo } from '../ui/comum';
import { Icone } from '../ui/Icone';
import { atualiza } from '../estado/loja';
import { EscolhaProvas } from './EscolhaProvas';
import { MATERIAS_PRINCIPAIS } from '../dados/materias';
import { IluMateria, temIlu } from '../ui/IconeMateria';


/** Primeira abertura: conta de demonstração (login simulado, fica só no aparelho), provas-alvo e meta. */
export function BoasVindas() {
  useTitulo('Boas-vindas');
  const nav = useNavigate();
  const [passo, setPasso] = useState(0);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [provas, setProvas] = useState<string[]>(['enem']);
  const [meta, setMeta] = useState(150);
  const emailOk = useMemo(() => !email || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email), [email]);

  const conclui = () => {
    atualiza((e) => ({ ...e, perfil: { nome: nome.trim() || 'Estudante', email: email.trim(), provasAlvo: provas, meta, criadoEm: Date.now() } }));
    nav('/', { replace: true });
  };

  return (
    <div className="bv">
      <div className="bv-lado" aria-hidden>
        <Logo className="bv-logo" />
        <div className="bv-ilus">
          {MATERIAS_PRINCIPAIS.filter((m) => temIlu(m.id)).map((m, i) => <span key={m.id} className="bv-ilu" style={{ animationDelay: `${i * 90}ms` }}><IluMateria m={m.id} /></span>)}
        </div>
        <p className="bv-frase">Questões reais das provas de Medicina, do jeito que a banca cobra.</p>
      </div>
      <div className="bv-form">
        <Logo className="bv-logo-cel" />
        <ol className="bv-passos" aria-label="Etapas">
          {['Sua conta', 'Provas-alvo', 'Ritmo'].map((t, i) => <li key={t} aria-current={i === passo ? 'step' : undefined} className={i < passo ? 'feito' : ''}><span>{i + 1}</span>{t}</li>)}
        </ol>

        {passo === 0 && (
          <form className="bv-corpo" onSubmit={(e) => { e.preventDefault(); if (emailOk) setPasso(1); }}>
            <h1>Comece a estudar pelas provas</h1>
            <p className="miolo">Questões reais por nível, do básico ao avançado, resolução que explica o seu erro, flashcards e simulados de provas inteiras.</p>
            <div className="campo"><label htmlFor="bv-nome">Como você quer ser chamado</label>
              <input id="bv-nome" value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="given-name" placeholder="Seu nome" autoFocus /></div>
            <div className="campo"><label htmlFor="bv-email">E-mail <span className="fraco">(opcional)</span></label>
              <input id="bv-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="voce@exemplo.com" aria-invalid={!emailOk} />
              {!emailOk ? <small style={{ color: 'var(--errado)' }}>Confira o e-mail: falta algo como “@” ou o domínio.</small>
                : <small>Versão de demonstração: a conta e o progresso ficam só neste aparelho. Nada é enviado.</small>}</div>
            <div className="bv-acoes"><button className="btn grande" type="submit">Continuar <Icone nome="direita" /></button></div>
          </form>
        )}

        {passo === 1 && (
          <div className="bv-corpo">
            <h1>Quais provas você vai fazer?</h1>
            <p className="miolo">O app prioriza o que essas provas cobram: simulados, sugestões e treinos. Dá para mudar depois no perfil.</p>
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

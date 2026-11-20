import { useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../ui/comum';
import figura from '../assets/login/figura.webp';
import '../estilo/login.css';
import { criarConta, entrar, esqueciSenha, novaSenha, useConta } from '../estado/sessao';

/** Tela de login, construída para reproduzir a referência do dono (Aprendice_Login_Pacote, 05/11/2026); a ilustração pintada é a do pacote do dono (uso autorizado por ele em 05/11/2026).
 *  Contas de verdade (decisão do dono, 20/11/2026): entrar, criar conta (com confirmação por e-mail), "Esqueceu sua
 *  senha?" e a nova senha vão ao serviço de contas (estado/sessao.ts). A senha nunca é guardada no aparelho.
 *  Sem serviço configurado (prévia de arquivo único), segue o modo local de antes (aoEntrar). */
export function Login({ aoEntrar, tema, emailInicial = '' }: { aoEntrar: (email: string) => void; tema?: ReactNode; emailInicial?: string }) {
  const conta = useConta();
  const naNuvem = conta.fase !== 'local';
  const [modoEscolhido, setModo] = useState<'entrar' | 'criar'>('entrar');
  const modo = conta.fase === 'nova-senha' ? 'nova' : modoEscolhido;
  // "Voltar" das boas-vindas traz o e-mail já digitado (casca 10)
  const [email, setEmail] = useState(emailInicial);
  const [senha, setSenha] = useState('');
  const [ver, setVer] = useState(false);
  const [aviso, setAviso] = useState('');
  // recado que fica no lugar do subtítulo do painel (link enviado, link vencido)
  const [recado, setRecado] = useState(conta.aviso);
  const [ocupado, setOcupado] = useState(false);
  const tAviso = useRef<number>();
  const refEmail = useRef<HTMLInputElement>(null);
  const refSenha = useRef<HTMLInputElement>(null);
  const avisa = (m: string) => { setAviso(m); window.clearTimeout(tAviso.current); tAviso.current = window.setTimeout(() => setAviso(''), 4500); };
  const entrar_ = modo === 'entrar';
  const emailOk = () => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

  const envia = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (ocupado) return;
    if (modo !== 'nova' && !emailOk()) { refEmail.current?.focus(); avisa('Insira um e-mail válido para continuar.'); return; }
    if (senha.length < 6) { refSenha.current?.focus(); avisa('A senha precisa ter pelo menos 6 caracteres.'); return; }
    if (!naNuvem) { setSenha(''); aoEntrar(email.trim()); return; }
    setOcupado(true);
    try {
      if (modo === 'nova') {
        const erro = await novaSenha(senha);
        if (erro) avisa(erro); else setSenha('');
      } else if (modo === 'entrar') {
        const erro = await entrar(email, senha);
        if (erro) { avisa(erro); refSenha.current?.focus(); } else setSenha('');
      } else {
        const r = await criarConta(email, senha);
        if (r.erro) avisa(r.erro);
        else {
          setSenha('');
          if (r.confirmar) { setModo('entrar'); setRecado(`Enviamos um link de confirmação para ${email.trim()}. Abra o link e depois entre com o seu e-mail e senha.`); }
        }
      }
    } finally { setOcupado(false); }
  };

  const esqueci = async () => {
    if (!naNuvem) { avisa('A recuperação de senha será ativada quando as contas tiverem servidor.'); return; }
    if (!emailOk()) { refEmail.current?.focus(); avisa('Escreva o seu e-mail acima e toque de novo em "Esqueceu sua senha?".'); return; }
    setOcupado(true);
    const erro = await esqueciSenha(email);
    setOcupado(false);
    if (erro) avisa(erro);
    else setRecado(`Se houver uma conta com ${email.trim()}, enviamos um link para criar uma nova senha. Abra o link neste aparelho.`);
  };

  const titulo = modo === 'nova' ? 'Crie uma nova senha' : entrar_ ? 'Acesse sua conta no Aprendice' : 'Crie sua conta no Aprendice';
  const sub = recado && modo !== 'nova' ? recado : modo === 'nova' ? 'Escolha a nova senha da sua conta. Depois disso você já entra.' : entrar_ ? 'Continue seus estudos, pratique questões e acompanhe sua evolução.' : 'Comece uma rotina de estudos com foco no que importa.';
  const botao = ocupado ? 'Aguarde…' : modo === 'nova' ? 'Salvar nova senha' : entrar_ ? 'Entrar no Aprendice' : 'Criar minha conta';

  return (
    <div className="tela-login">
      <div className="l-fundo">
        <div className="l-onda-verde" aria-hidden /><div className="l-onda-canto" aria-hidden /><div className="l-onda-areia" aria-hidden /><div className="l-pontilhado cima" aria-hidden /><div className="l-pontilhado baixo" aria-hidden />
        {tema}
        <main className="l-grade">
          <section className="l-apresenta" aria-label="Conheça o Aprendice">
            <a href="#login" className="l-logo" aria-label="Aprendice, ir para o login" data-logo-alvo><Logo /></a>
            <div><span className="l-selo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="m2 9 10-5 10 5-10 5L2 9Z" /><path d="M6 11v5c4 4 8 4 12 0v-5" /><path d="M22 9v6" /></svg> Estudo organizado, prática constante, progresso real</span></div>
            <h1 className="l-titulo">Estude com foco em<br />questões reais de vestibulares <em>e evolua em cada matéria.</em></h1>
            <p className="l-lead">Organize seus estudos, pratique questões, entenda suas respostas e acompanhe seu progresso — tudo em um só lugar.</p>
            <div className="l-ilustracao">
              <div className="l-barras" aria-hidden>{[32, 44, 59, 74, 89].map((h) => <i key={h} style={{ ['--h' as string]: h + '%' }} />)}</div>
              <img className="l-figura" src={figura} alt="Célula, átomo, livros, frasco de laboratório, cubo mágico e caderno" width={660} height={395} />
            </div>
            <div className="l-vantagens">
              <div className="l-vantagem"><div className="l-vantagem-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4m10-4v4M3 10h18" /></svg></div><div><b>Organize seus estudos</b><p>Planeje matérias e revise com clareza.</p></div></div>
              <div className="l-vantagem"><div className="l-vantagem-ic ouro"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round"><path d="M12 21a9 9 0 1 0-9-9c0 2.4 1 4.5 2.5 6L5 22l4-2.5c1 .3 2 .5 3 .5Z" /><path d="M9.5 9a2.6 2.6 0 0 1 5.2.2c0 2-2.6 2-2.6 4M12 17h.01" /></svg></div><div><b>Pratique com questões</b><p>Aprenda com exercícios de provas.</p></div></div>
              <div className="l-vantagem"><div className="l-vantagem-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M4 20v-5m5 5v-9m5 9V8m5 12V3" /></svg></div><div><b>Acompanhe seu progresso</b><p>Identifique avanços e próximos passos.</p></div></div>
            </div>
          </section>

          <section className="l-acesso" id="login" aria-label="Acesso à conta">
            <div className="l-painel">
              <h2>{titulo}</h2>
              <p className="l-painel-sub" role={recado ? 'status' : undefined}>{sub}</p>
              <form onSubmit={envia} noValidate aria-busy={ocupado}>
                {modo !== 'nova' && <>
                <label htmlFor="ent-email">E-mail</label>
                <div className="l-entrada">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>
                  <input ref={refEmail} type="email" id="ent-email" name="email" autoComplete="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                </>}
                <label htmlFor="ent-senha">{modo === 'nova' ? 'Nova senha' : 'Senha'}</label>
                <div className="l-entrada">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
                  <input ref={refSenha} type={ver ? 'text' : 'password'} id="ent-senha" name="password" autoComplete={entrar_ ? 'current-password' : 'new-password'} placeholder={modo === 'nova' ? 'Pelo menos 6 caracteres' : 'Sua senha'} value={senha} onChange={(e) => setSenha(e.target.value)} required minLength={6} />
                  <button type="button" className="l-olho" onClick={() => setVer(!ver)} title={ver ? 'Ocultar senha' : 'Mostrar senha'} aria-label={ver ? 'Ocultar senha' : 'Mostrar senha'}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="3" /></svg>
                  </button>
                </div>
                {/* só no modo Entrar (revisão de 19/11/2026, casca 7) */}
                {entrar_ ? <button className="l-esqueci" type="button" onClick={esqueci}>Esqueceu sua senha?</button> : <div className="l-esqueci-vazio" />}
                <button className="l-botao" type="submit" disabled={ocupado}>{botao} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M4 12h16m-7-7 7 7-7 7" /></svg></button>
              </form>
              {/* "Entrar com o Google" fica escondido até o dono criar as credenciais do Google (OAuth) no serviço de contas */}
              {modo !== 'nova' && <p className="l-trocar">{entrar_ ? 'Ainda não tem uma conta? ' : 'Já tem uma conta? '}<button type="button" onClick={() => { setModo(entrar_ ? 'criar' : 'entrar'); setRecado(''); }}>{entrar_ ? 'Criar conta' : 'Entrar'}</button></p>}
              <div className="l-faixa"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinejoin="round"><path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z" /></svg><span>Seu próximo avanço começa aqui.</span></div>
              <div className="l-rodape">{naNuvem ? 'Guardamos só o seu e-mail, o perfil de estudo e o progresso' : 'Tudo fica salvo só neste aparelho'} • <Link to="/privacidade" style={{ color: 'inherit' }}>Privacidade</Link></div>
            </div>
          </section>
        </main>
      </div>
      <div className={'l-aviso' + (aviso ? ' ativo' : '')} role="status" aria-live="polite">{aviso}</div>
    </div>
  );
}

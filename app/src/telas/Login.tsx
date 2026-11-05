import { useRef, useState } from 'react';
import { Logo } from '../ui/comum';
import figura from '../assets/login/figura.webp';
import '../estilo/login.css';

/** Tela de login (referência do dono: Aprendice_Login_Pacote, 05/11/2026).
 *  Ainda não há servidor de contas: entrar/criar conta valida e-mail e senha e segue para as provas-alvo.
 *  A senha nunca é guardada; o progresso fica só neste aparelho. */
export function Login({ aoEntrar }: { aoEntrar: (email: string) => void }) {
  const [modo, setModo] = useState<'entrar' | 'criar'>('entrar');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [ver, setVer] = useState(false);
  const [aviso, setAviso] = useState('');
  const tAviso = useRef<number>();
  const refEmail = useRef<HTMLInputElement>(null);
  const refSenha = useRef<HTMLInputElement>(null);
  const avisa = (m: string) => { setAviso(m); window.clearTimeout(tAviso.current); tAviso.current = window.setTimeout(() => setAviso(''), 3300); };
  const entrar = modo === 'entrar';

  const envia = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) { refEmail.current?.focus(); avisa('Insira um e-mail válido para continuar.'); return; }
    if (senha.length < 6) { refSenha.current?.focus(); avisa('A senha precisa ter pelo menos 6 caracteres.'); return; }
    setSenha('');
    aoEntrar(email.trim());
  };

  return (
    <div className="tela-login">
      <div className="ent-cena">
        <div className="ent-pontos topo" aria-hidden /><div className="ent-pontos baixo" aria-hidden /><div className="ent-onda" aria-hidden />
        <main className="ent-layout">
          <section className="ent-esq" aria-label="Conheça o Aprendice">
            <a href="#login" className="ent-marca" aria-label="Aprendice, ir para o login" data-logo-alvo><Logo /></a>
            <div><span className="ent-selo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="m2 9 10-5 10 5-10 5L2 9Z" /><path d="M6 11v5c4 4 8 4 12 0v-5" /><path d="M22 9v6" /></svg> Estudo organizado, prática constante, progresso real</span></div>
            <div className="ent-texto">
              <h1>Estude com foco em<br />questões reais de vestibulares <span className="verde">e evolua em cada matéria.</span></h1>
              <p>Organize seus estudos, pratique questões, entenda suas respostas e acompanhe seu progresso — tudo em um só lugar.</p>
            </div>
            <div className="ent-arte" aria-hidden>
              <div className="ent-barras"><i style={{ ['--h' as string]: '32%' }} /><i style={{ ['--h' as string]: '44%' }} /><i style={{ ['--h' as string]: '59%' }} /><i style={{ ['--h' as string]: '74%' }} /><i style={{ ['--h' as string]: '89%' }} /></div>
              <img className="ent-figura" src={figura} alt="" width={660} height={395} />
            </div>
            <div className="ent-beneficios">
              <div className="ent-benef"><div className="ent-benef-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4m10-4v4M3 10h18" /></svg></div><div><b>Organize seus estudos</b><p>Planeje matérias e revise com clareza.</p></div></div>
              <div className="ent-benef"><div className="ent-benef-ic quente"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round"><path d="M12 21a9 9 0 1 0-9-9c0 2.4 1 4.5 2.5 6L5 22l4-2.5c1 .3 2 .5 3 .5Z" /><path d="M9.5 9a2.6 2.6 0 0 1 5.2.2c0 2-2.6 2-2.6 4M12 17h.01" /></svg></div><div><b>Pratique com questões</b><p>Aprenda com exercícios de provas.</p></div></div>
              <div className="ent-benef"><div className="ent-benef-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M4 20v-5m5 5v-9m5 9V8m5 12V3" /></svg></div><div><b>Acompanhe seu progresso</b><p>Identifique avanços e próximos passos.</p></div></div>
            </div>
          </section>

          <section className="ent-auth-lugar" id="login" aria-label="Acesso à conta">
            <div className="ent-auth">
              <h2>{entrar ? 'Acesse sua conta no Aprendice' : 'Crie sua conta no Aprendice'}</h2>
              <p className="ent-sub">{entrar ? 'Continue seus estudos, pratique questões e acompanhe sua evolução.' : 'Comece uma rotina de estudos com foco no que importa.'}</p>
              <form onSubmit={envia} noValidate>
                <label htmlFor="ent-email">E-mail</label>
                <div className="ent-campo">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>
                  <input ref={refEmail} type="email" id="ent-email" name="email" autoComplete="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <label htmlFor="ent-senha">Senha</label>
                <div className="ent-campo">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
                  <input ref={refSenha} type={ver ? 'text' : 'password'} id="ent-senha" name="password" autoComplete={entrar ? 'current-password' : 'new-password'} placeholder="••••••••" value={senha} onChange={(e) => setSenha(e.target.value)} required minLength={6} />
                  <button type="button" className="ent-ver" onClick={() => setVer(!ver)} title={ver ? 'Ocultar senha' : 'Mostrar senha'} aria-label={ver ? 'Ocultar senha' : 'Mostrar senha'}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="3" /></svg>
                  </button>
                </div>
                <button className="ent-esqueceu" type="button" onClick={() => avisa('A recuperação de senha será ativada quando as contas tiverem servidor.')}>Esqueceu sua senha?</button>
                <button className="ent-entrar" type="submit">{entrar ? 'Entrar no Aprendice' : 'Criar minha conta'} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M4 12h16m-7-7 7 7-7 7" /></svg></button>
              </form>
              <div className="ent-ou">ou</div>
              <button className="ent-google" type="button" onClick={() => avisa('O login com Google será ativado em breve.')}>
                <svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.7 2.4 30.3 0 24 0 14.6 0 6.4 5.4 2.4 13.3l7.8 6.1C12.1 13.5 17.6 9.5 24 9.5Z" /><path fill="#4285F4" d="M46.9 24.5c0-1.6-.1-3.2-.4-4.7H24v9h12.9c-.6 3-2.3 5.5-4.9 7.2l7.6 5.9c4.5-4.2 7.3-10.4 7.3-17.4Z" /><path fill="#FBBC05" d="M10.2 28.6a14.4 14.4 0 0 1 0-9.2l-7.8-6.1a24 24 0 0 0 0 21.4l7.8-6.1Z" /><path fill="#34A853" d="M24 48c6.3 0 11.6-2.1 15.5-5.7L31.9 36c-2.1 1.4-4.7 2.2-7.9 2.2-6.4 0-11.9-4-13.8-9.6l-7.8 6.1C6.4 42.6 14.6 48 24 48Z" /></svg> Entrar com o Google
              </button>
              <p className="ent-conta">{entrar ? 'Ainda não tem uma conta? ' : 'Já tem uma conta? '}<button type="button" onClick={() => setModo(entrar ? 'criar' : 'entrar')}>{entrar ? 'Criar conta' : 'Entrar'}</button></p>
              <div className="ent-motivacao"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinejoin="round"><path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z" /></svg><span>Seu próximo avanço começa aqui.</span></div>
              <div className="ent-nota">Versão de demonstração • a conta e o progresso ficam só neste aparelho</div>
            </div>
          </section>
        </main>
      </div>
      <div className={'ent-aviso' + (aviso ? ' ativo' : '')} role="status" aria-live="polite">{aviso}</div>
    </div>
  );
}

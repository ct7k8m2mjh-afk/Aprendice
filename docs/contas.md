# Contas de verdade (decisão do dono, 20/11/2026)

O site tem login real (e-mail e senha) e o progresso de cada aluno fica salvo na nuvem, no serviço de contas
**Supabase**, projeto `aprendice`, servidor em São Paulo (`sa-east-1`), plano grátis.

## Como funciona para o aluno
- **Criar conta**: e-mail + senha (mínimo 6). O serviço manda um link de confirmação; depois de abrir o link, o aluno
  entra. Conta nova passa pelas boas-vindas (provas-alvo e meta).
- **Entrar**: e-mail + senha. Erros aparecem em português (senha errada, e-mail não confirmado, sem internet).
- **Esqueceu sua senha?**: com o e-mail escrito, o serviço manda um link; ao abrir (no mesmo aparelho), o site pede a
  nova senha e já entra.
- **Entrar com o Google**: escondido até o dono criar as credenciais do Google (OAuth) no Supabase.
- **Sem internet**: o site funciona com o que está no aparelho e envia quando a conexão volta.
- **Sair**: envia o que falta, encerra a sessão e tira o progresso e o perfil do aparelho (outra pessoa no mesmo
  aparelho não vê nada). Se estiver sem internet, o que não foi enviado fica numa cópia só desta conta, juntada no
  próximo login dela.
- **Privacidade**: página `#/privacidade` (link no rodapé do login e no Perfil): o que é guardado (e-mail, perfil de
  estudo, progresso), para quê, onde, e que não há rastreamento de terceiros.

## Progresso (princípio 7: nunca perder)
- O aparelho continua sendo a cópia de trabalho (`app/src/estado/loja.ts`, chave `aprendice.v1`).
- `app/src/estado/sessao.ts`: login, envio e saída. `app/src/estado/mescla.ts`: junta aparelho + nuvem.
- **Primeiro login**: o progresso que já estava no aparelho (de antes das contas, sem dono) é juntado ao da nuvem e
  enviado; o perfil do aparelho (nome, provas-alvo, datas, meta) vira o perfil da conta se a conta ainda não tem um.
  Nenhum id muda.
- Junção: tentativas, flashcards, revisões, simulados feitos e sessões de estudo são unidos (mesmas regras da
  importação de arquivo); simulado/treino em andamento e preferências de estudo ficam com o lado mexido por último
  (`mexidoEm`); tema e menu ficam no aparelho.
- Envio com controle de versão (`progresso.rev`): se outro aparelho gravou antes, o site baixa, junta e envia de novo.
- O progresso de uma conta nunca vai para outra: o estado guarda `conta` (id da conta dona).
- "Zerar progresso" (Configurações) zera também na nuvem; outro aparelho ainda com o progresso antigo pode juntá-lo de
  volta na próxima sincronização dele.

## Banco (registro em `supabase/migrations/`)
- `perfis` (id = id da conta, nome, provas_alvo, datas_prova, meta, completo, papel `aluno`|`admin`, criado_em).
- `progresso` (user_id, dados jsonb, rev, atualizado_em).
- RLS ligada nas duas: cada conta lê e altera **só a própria linha**. Ninguém insere nem apaga pelo site: as linhas
  nascem no cadastro (gatilho `privado.nova_conta`).
- **Papel**: o site não tem permissão de alterar a coluna `papel` (privilégio por coluna) e um gatilho recusa qualquer
  mudança vinda da API. Só muda por SQL no painel do Supabase.
- `privado.admins`: lista de e-mails que nascem administradores ao se cadastrar. Fica num schema fora da API; o e-mail
  do dono está só no banco, nunca no repositório.
- Chaves: o site usa só a URL e a chave **pública** (publishable), em `VITE_SUPABASE_URL` e
  `VITE_SUPABASE_PUBLISHABLE_KEY` (Vercel: produção e prévia; local: `app/.env.local`, fora do git). Nenhuma chave
  secreta no site nem no repositório.

## Administrador
- O papel é lido do perfil na nuvem ao entrar. Com papel `admin`, o site mostra o que fica escondido do aluno:
  questões fora do ar (gabarito do Aprendice em preparação, sem link da fonte), de outra matéria (Artes, Educação
  Física) e anuladas pelo Aprendice. Elas aparecem na lista do conteúdo, na ordem de dificuldade, com a etiqueta
  "oculto para o aluno" e o motivo; abrem pelo endereço direto com a mesma etiqueta (sem gabarito, abrem só para
  consulta). Conteúdo cujas questões estão todas escondidas abre com a etiqueta na lista do tema.
- Continuam fora dos treinos, simulados, revisão e contagens (as contagens são as do aluno).
- O Perfil mostra "Administrador".
- É só exibição de conteúdo público do site; nenhum dado de aluno depende do modo administrador.

### Como o dono entra como administrador
1. Abra o site e toque em **Criar conta**.
2. Use o seu e-mail de administrador (o que foi combinado) e uma senha.
3. Abra o link de confirmação que chega por e-mail e entre com o e-mail e a senha.
4. A conta já nasce administradora. O Perfil mostra "Administrador".

Para tornar outra pessoa administradora: no painel do Supabase, SQL Editor,
`update public.perfis set papel = 'admin' where id = (select id from auth.users where email = '<e-mail>');`

## O que o dono precisa fazer no painel do Supabase (uma vez)
1. **Authentication → URL Configuration**: *Site URL* = `https://aprendice.vercel.app`; em *Redirect URLs*, adicionar
   `https://aprendice.vercel.app/**` e `https://*-aprendice*.vercel.app/**` (prévias). Sem isso, os links de
   confirmação e de nova senha voltam para `localhost`.
2. **E-mails**: o envio padrão do Supabase só entrega para e-mails da equipe do projeto e tem limite baixo por hora.
   Para alunos de verdade, configurar um SMTP próprio (Authentication → Emails → SMTP Settings; ex.: Resend, Brevo)
   ou, enquanto isso, desligar "Confirm email" (Authentication → Sign In / Providers → Email).
3. Opcional: login com Google (Authentication → Providers → Google, com as credenciais do Google Cloud do dono).
4. Opcional: proteção contra senhas vazadas (Authentication → Passwords; depende do plano).

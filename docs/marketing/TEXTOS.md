# Inventário de textos da interface

Redator publicitário, 20/11/2026; atualizado em 21/11/2026 com o código até o commit 4ed1a00b (página não encontrada, excluir conta, capa própria do Treino geral, ordem da Revisão no celular, "x de y" no lugar de "x/y"). Itens novos: T885–T906, cada um na seção da sua tela. Ramo `app-prototipo-completo`, código em `app/src` (sem `testes/`). Régua: `docs/marketing/GUIA-DE-VOZ.md`.

**Como ler.** "texto atual" é a string do código, literal, para achar com busca; trechos variáveis aparecem como no
código (`{n}`, `${...}`, `plural(...)`). "texto novo" é a proposta; "manter" quando o atual já serve; "(rec.)" marca a
opção recomendada quando há duas. "veredito" fica em branco: é do revisor de marca. Nada foi alterado no código.

**Restrições seguidas.** Botões, abas e chips: no máximo +20% de caracteres. Atalhos de teclado, nomes de matérias e de
instituições, vocabulário do `CLAUDE.md` e conteúdo de estudo não mudam. Itens que dependem de mudar lógica (texto
condicional) estão marcados "(precisa de condição no código)".

**Fatos conferidos no código antes de propor** (base das propostas):
- Contas: login, cadastro com confirmação por e-mail e "Esqueceu sua senha?" são reais quando o serviço de contas está configurado (`estado/sessao.ts`, `nuvem/cliente.ts`); sem ele, o site roda em modo local (`conta.fase === 'local'`). A correção "por IA" dos flashcards é simulada no aparelho (`logica/ia.ts`).
- Revisão de questões: entra quem errou, chutou ou usou a dica; volta em 1, 3 e 7 dias; sai depois de 3 acertos em dias diferentes; com a data da prova, os intervalos encurtam e nada fica depois da véspera (`logica/revisao.ts`). Flashcards: 1, 3, 7, 16, 35, 80 dias, também encurtados pela prova; Quase = amanhã; Errei = hoje.
- A meta semanal aparece só no menu lateral (`ui/Casca.tsx`), não no Início.
- Todas as 9 matérias estão `ativa: true` (`dados/materias.ts`): a tela "Em preparação" da matéria hoje não aparece, mas o texto existe.
- Simulado por conteúdo só usa questões com gabarito oficial ou de resolução publicada (`logica/simulados.ts`).
- Página não encontrada: tela própria desde 21/11 (`telas/NaoEncontrada.tsx`, rota `*` em `App.tsx:86`).
- Excluir conta (`estado/sessao.ts:excluirConta`, `supabase/migrations/20261120230000_excluir_conta.sql`): com conta, apaga no servidor o progresso, o perfil e o usuário do serviço de contas (e-mail e sessões) e depois limpa o aparelho; sem conta na nuvem, apaga perfil, progresso e cópias deste aparelho.

---

## 0. Página (aba do navegador e busca do Google)

| # | arquivo:linha | onde aparece | texto atual | texto novo | por quê | veredito |
|---|---|---|---|---|---|---|
| T1 | app/index.html:7 | descrição nos buscadores | `Aprendice: estude para o vestibular pelas questões reais das provas.` | `Aprendice: estude para o ENEM e o vestibular pelas questões reais das provas, com a fonte e a correção da letra que você marcou.` | Diz o diferencial e inclui ENEM, que é o que se busca. | |
| T2 | app/index.html:8 | título da aba antes de carregar | `Aprendice` | manter | | |
| T3 | ui/comum.tsx:51 | sufixo do título da aba | `${t} · Aprendice` | manter | | |
| T4 | telas/NaoEncontrada.tsx:8 (rota em App.tsx:86) | página não encontrada: título da aba | `Página não encontrada` | manter | Tela nova (antes redirecionava ao Início). | |
| T885 | telas/NaoEncontrada.tsx:11 | página não encontrada: título | `Página não encontrada` | manter | | |
| T886 | telas/NaoEncontrada.tsx:12 | página não encontrada: texto | `O endereço pode estar incompleto ou a página pode ter mudado de lugar. O seu progresso continua salvo.` | manter | Calmo, verdadeiro e tranquiliza sobre o progresso. | |
| T887 | telas/NaoEncontrada.tsx:14 | botão | `Ir para o início` | manter | | |
| T888 | telas/NaoEncontrada.tsx:15 | botão | `Ver matérias` | manter | | |

## 1. Casca: menu lateral, topo e abas do celular (ui/Casca.tsx)

| # | arquivo:linha | onde aparece | texto atual | texto novo | por quê | veredito |
|---|---|---|---|---|---|---|
| T5 | ui/Casca.tsx:35 | aria-label do seletor de tema | `Tema` | `Tema claro ou escuro` | Leitor de tela entende o grupo. | |
| T6 | ui/Casca.tsx:36 | botão Dia (title/aria) | `Tema claro` | manter | | |
| T7 | ui/Casca.tsx:36 | rótulo do botão | `Dia` | manter | | |
| T8 | ui/Casca.tsx:37 | botão Noite (title/aria) | `Tema escuro` | manter | | |
| T9 | ui/Casca.tsx:37 | rótulo do botão | `Noite` | manter | | |
| T10 | ui/Casca.tsx:101 | link oculto do teclado | `Pular para o conteúdo` | manter | | |
| T11 | ui/Casca.tsx:102 | aria-label do menu | `Menu principal` | manter | | |
| T12 | ui/Casca.tsx:104 | logo (aria) | `Início` | `Aprendice, ir ao início` | O leitor de tela diz de quem é o logo. | |
| T13 | ui/Casca.tsx:106 | botão recolher/abrir menu | `Abrir menu` / `Recolher menu` | manter | | |
| T14 | ui/Casca.tsx:109 | botão do trilho (aria) | `Esconder a barra lateral` | manter | | |
| T15 | ui/Casca.tsx:109 | botão do trilho (title) | `Esconder a barra` | manter | | |
| T16 | ui/Casca.tsx:113 | aria-label | `Início e matérias` | manter | | |
| T17 | ui/Casca.tsx:114 | item do menu | `Início` | manter | | |
| T18 | ui/Casca.tsx:117-118 | item que abre o grupo | `Outras matérias` | manter | | |
| T19 | ui/Casca.tsx:124 | grupo do menu | `Estudo` | manter | | |
| T20 | ui/Casca.tsx:126 | item do menu | `Hoje` | manter | | |
| T21 | ui/Casca.tsx:127 | item do menu (leva a /materias) | `Questões` | manter | A aba do celular diz "Matérias" para a mesma tela; unificar é decisão de produto do dono, não de texto (dúvida 7). | |
| T22 | ui/Casca.tsx:128 | item do menu | `Simulados` | manter | | |
| T23 | ui/Casca.tsx:129 | item do menu | `Revisão` | manter | | |
| T24 | ui/Casca.tsx:130 | item do menu | `Desempenho` | manter | | |
| T25 | ui/Casca.tsx:131 | item do menu | `Provas e faculdades` | manter | | |
| T26 | ui/Casca.tsx:134 | title da meta | `Meta da semana` | manter | | |
| T27 | ui/Casca.tsx:136 | meta: números | `{sem.semana} de {meta}` | manter | | |
| T28 | ui/Casca.tsx:136 | meta: rótulo | `meta da semana` | `questões na semana` | Diz o que se conta. | |
| T29 | ui/Casca.tsx:136 | meta: linha | `hoje {sem.hoje} · ontem {sem.ontem}` | manter | | |
| T30 | ui/Casca.tsx:138 | item do menu | `Configurações` | manter | | |
| T31 | ui/Casca.tsx:148 | botão mostrar barra (aria/title) | `Mostrar a barra lateral` / `Mostrar a barra` | manter | | |
| T32 | ui/Casca.tsx:149 | logo no celular (aria) | `Início` | `Aprendice, ir ao início` | Igual a T12. | |
| T33 | ui/Casca.tsx:150 | botão de busca (aria) | `Buscar matérias, temas, conteúdos, flashcards e provas` | manter | | |
| T34 | ui/Casca.tsx:151 | texto do botão de busca | `Buscar conteúdos, flashcards e provas...` | `Buscar conteúdos, flashcards e provas…` | Reticências tipográficas (um caractere). | |
| T35 | ui/Casca.tsx:151 | atalho | `Ctrl K` | manter | | |
| T36 | ui/Casca.tsx:155 | link do perfil (aria) | `Meu perfil (${nome})` | manter | | |
| T37 | ui/Casca.tsx:156 | link do perfil | `Meu perfil` | manter | | |
| T38 | ui/Casca.tsx:160 | falha de tela | `Esta tela não abriu.` | manter | | |
| T39 | ui/Casca.tsx:163 | aria-label das abas | `Navegação` | `Navegação principal` | Distingue do menu lateral. | |
| T40 | ui/Casca.tsx:164 | abas do celular | `Início` · `Matérias` · `Simulados` · `Revisão` · `Perfil` | manter | (Achado da retenção: "Hoje" não está nas abas; é decisão de navegação do dono.) | |

## 2. Peças comuns (ui/comum.tsx, ui/Protecao.tsx, ui/Abertura.tsx)

| # | arquivo:linha | onde aparece | texto atual | texto novo | por quê | veredito |
|---|---|---|---|---|---|---|
| T41 | ui/comum.tsx:6 | logo (aria) | `Aprendice` | manter | | |
| T42 | ui/comum.tsx:27 | carregando (leitor de tela) | `Carregando` | manter | | |
| T43 | ui/Protecao.tsx:19 | falha de um pedaço (padrão) | `Esta parte da tela não abriu.` | manter | | |
| T44 | ui/Protecao.tsx:19 | complemento | `O resto continua funcionando, e o seu progresso está salvo.` | manter | Calmo e verdadeiro. | |
| T45 | ui/Protecao.tsx:21 | botão | `Tentar de novo` | manter | | |
| T46 | ui/Protecao.tsx:22 | botão | `Pular` | manter | | |
| T47 | ui/Abertura.tsx | abertura animada | (sem texto; aria-hidden) | manter (registro) | | |

## 3. Entrada: Login e cadastro (telas/Login.tsx)

| # | arquivo:linha | onde aparece | texto atual | texto novo | por quê | veredito |
|---|---|---|---|---|---|---|
| T48 | telas/Login.tsx:35 | aviso: e-mail inválido | `Insira um e-mail válido para continuar.` | `Digite um e-mail válido.` | Mais curto, mesmo sentido. | |
| T49 | telas/Login.tsx:36 | aviso: senha curta | `A senha precisa ter pelo menos 6 caracteres.` | manter | | |
| T50 | telas/Login.tsx:51 | recado: cadastro feito | `Enviamos um link de confirmação para ${email.trim()}. Abra o link e depois entre com o seu e-mail e senha.` | `Enviamos um link para ${email.trim()}. Abra o link e depois entre com seu e-mail e senha.` | Mais curto. | |
| T51 | telas/Login.tsx:58 | aviso: recuperar senha sem servidor | `A recuperação de senha será ativada quando as contas tiverem servidor.` | `Nesta versão, sem conta na nuvem, não dá para recuperar a senha.` | "Servidor" é bastidor; diz o fato ao aluno. | |
| T52 | telas/Login.tsx:59 | aviso: falta e-mail para recuperar | `Escreva o seu e-mail acima e toque de novo em "Esqueceu sua senha?".` | `Escreva seu e-mail acima e toque de novo em “Esqueceu sua senha?”.` | Aspas curvas, como no resto do site. | |
| T53 | telas/Login.tsx:64 | recado: link de nova senha | `Se houver uma conta com ${email.trim()}, enviamos um link para criar uma nova senha. Abra o link neste aparelho.` | manter | Verdadeiro e seguro. | |
| T54 | telas/Login.tsx:67 | título (nova senha) | `Crie uma nova senha` | manter | | |
| T55 | telas/Login.tsx:67 | título (entrar) | `Acesse sua conta no Aprendice` | `Entre na sua conta` | Curto e direto. | |
| T56 | telas/Login.tsx:67 | título (criar) | `Crie sua conta no Aprendice` | `Crie sua conta` | Curto; o nome já está no logo. | |
| T57 | telas/Login.tsx:68 | subtítulo (nova senha) | `Escolha a nova senha da sua conta. Depois disso você já entra.` | manter | | |
| T58 | telas/Login.tsx:68 | subtítulo (entrar) | `Continue seus estudos, pratique questões e acompanhe sua evolução.` | `Continue de onde parou.` | Uma promessa que o site cumpre (Início, "Continue de onde parou"). | |
| T59 | telas/Login.tsx:68 | subtítulo (criar) | `Comece uma rotina de estudos com foco no que importa.` | `Depois, você escolhe as provas que vai fazer.` | Diz o próximo passo real (boas-vindas: provas-alvo). | |
| T60 | telas/Login.tsx:69 | botão ocupado | `Aguarde…` | manter | | |
| T61 | telas/Login.tsx:69 | botão (nova senha) | `Salvar nova senha` | manter | | |
| T62 | telas/Login.tsx:69 | botão (entrar) | `Entrar no Aprendice` | `Entrar` | Botão de 1 palavra. | |
| T63 | telas/Login.tsx:69 | botão (criar) | `Criar minha conta` | manter | | |
| T64 | telas/Login.tsx:77 | aria-label da coluna | `Conheça o Aprendice` | manter | | |
| T65 | telas/Login.tsx:78 | logo (aria) | `Aprendice, ir para o login` | manter | | |
| T66 | telas/Login.tsx:79 | selo | `Estudo organizado, prática constante, progresso real` | `Questões reais de prova, com a fonte` | Frase genérica → fato verificável. | |
| T67 | telas/Login.tsx:80 | título grande | `Estude com foco em<br />questões reais de vestibulares <em>e evolua em cada matéria.</em>` | (a) `Estude pelas<br />questões reais das provas <em>e veja onde você erra.</em>` (rec.) · (b) `Questões reais<br />do ENEM e dos vestibulares <em>com a correção da sua letra.</em>` | Benefício concreto; mantém a quebra e o itálico do desenho. | |
| T68 | telas/Login.tsx:81 | linha de apoio | `Organize seus estudos, pratique questões, entenda suas respostas e acompanhe seu progresso — tudo em um só lugar.` | `Questões do ENEM e dos vestibulares, do básico ao avançado. A correção começa pela letra que você marcou, e o erro volta no dia certo.` | Diz o que só o Aprendice faz; tira "tudo em um só lugar". | |
| T69 | telas/Login.tsx:84 | alt da ilustração | `Célula, átomo, livros, frasco de laboratório, cubo mágico e caderno` | manter | | |
| T70 | telas/Login.tsx:87 | vantagem 1, título | `Organize seus estudos` | `Saiba o que estudar hoje` | Aponta a função Hoje. | |
| T71 | telas/Login.tsx:87 | vantagem 1, texto | `Planeje matérias e revise com clareza.` | `Pelo que cai nas suas provas e pelo que você erra.` | Verdadeiro (logica/hoje.ts). | |
| T72 | telas/Login.tsx:88 | vantagem 2, título | `Pratique com questões` | `Questões reais de prova` | Concreto. | |
| T73 | telas/Login.tsx:88 | vantagem 2, texto | `Aprenda com exercícios de provas.` | `Cada uma com a fonte e o gabarito.` | Verdadeiro (aba Fonte). | |
| T74 | telas/Login.tsx:89 | vantagem 3, título | `Acompanhe seu progresso` | `Veja onde você trava` | Benefício, não função. | |
| T75 | telas/Login.tsx:89 | vantagem 3, texto | `Identifique avanços e próximos passos.` | `Acerto por matéria, tema e nível.` | É o que Desempenho mostra. | |
| T76 | telas/Login.tsx:93 | aria-label | `Acesso à conta` | manter | | |
| T77 | telas/Login.tsx:99 | rótulo | `E-mail` | manter | | |
| T78 | telas/Login.tsx:102 | placeholder | `seu@email.com` | manter | | |
| T79 | telas/Login.tsx:105 | rótulo | `Nova senha` / `Senha` | manter | | |
| T80 | telas/Login.tsx:108 | placeholder | `Pelo menos 6 caracteres` / `Sua senha` | manter | | |
| T81 | telas/Login.tsx:109 | botão olho (title/aria) | `Ocultar senha` / `Mostrar senha` | manter | | |
| T82 | telas/Login.tsx:114 | link | `Esqueceu sua senha?` | manter | | |
| T83 | telas/Login.tsx:118 | troca de modo | `Ainda não tem uma conta? ` / `Já tem uma conta? ` | manter | | |
| T84 | telas/Login.tsx:118 | botão de troca | `Criar conta` / `Entrar` | manter | | |
| T85 | telas/Login.tsx:119 | faixa | `Seu próximo avanço começa aqui.` | `Cada erro vira revisão.` | Clichê → fato do método. | |
| T86 | telas/Login.tsx:120 | rodapé (com conta) | `Guardamos só e-mail, perfil de estudo e progresso` | manter | | |
| T87 | telas/Login.tsx:120 | rodapé (sem conta) | `Tudo fica salvo só neste aparelho` | manter | | |
| T88 | telas/Login.tsx:120 | link | `Privacidade` | manter | | |

## 4. Mensagens do serviço de contas (estado/sessao.ts)

| # | arquivo:linha | onde aparece | texto atual | texto novo | por quê | veredito |
|---|---|---|---|---|---|---|
| T89 | estado/sessao.ts:309 | erro de login | `E-mail ou senha incorretos.` | manter | | |
| T90 | estado/sessao.ts:310 | e-mail não confirmado | `Confirme o seu e-mail pelo link que enviamos antes de entrar.` | `Antes de entrar, abra o link que enviamos para o seu e-mail.` | A ação vem primeiro. | |
| T91 | estado/sessao.ts:311 | conta já existe | `Já existe uma conta com este e-mail. Entre, ou use "Esqueceu sua senha?".` | `Já existe uma conta com este e-mail. Entre ou use “Esqueceu sua senha?”.` | Aspas curvas; vírgula sobrando. | |
| T92 | estado/sessao.ts:312 | senha fraca | `Senha fraca: use pelo menos 6 caracteres, misturando letras e números.` | manter | | |
| T93 | estado/sessao.ts:313 | muitas tentativas | `Muitas tentativas agora. Espere alguns minutos e tente de novo.` | manter | | |
| T94 | estado/sessao.ts:314 | e-mail recusado | `Este e-mail não foi aceito. Confira se está certo.` | manter | | |
| T95 | estado/sessao.ts:315 | senha igual | `A nova senha precisa ser diferente da anterior.` | manter | | |
| T96 | estado/sessao.ts:316 | sem rede | `Sem conexão com a internet. Confira a conexão e tente de novo.` | `Sem internet. Confira a conexão e tente de novo.` | Mais curto. | |
| T97 | estado/sessao.ts:317 | erro genérico | `Não foi possível concluir agora. Tente de novo em instantes.` | manter | | |
| T98 | estado/sessao.ts:358 | link vencido | `O link do e-mail venceu ou já foi usado. Peça outro e use o mais recente.` | manter | | |
| T889 | estado/sessao.ts:284 | erro ao excluir sem sessão | `Entre na sua conta para excluí-la.` | manter | | |
| T890 | estado/sessao.ts:298 | recado no login depois de excluir | `Sua conta e todos os seus dados foram excluídos.` | manter | Confirma o fato, sem drama. | |

## 5. Boas-vindas (telas/BoasVindas.tsx)

| # | arquivo:linha | onde aparece | texto atual | texto novo | por quê | veredito |
|---|---|---|---|---|---|---|
| T99 | telas/BoasVindas.tsx:19 | título da aba | `Boas-vindas` | manter | | |
| T100 | telas/BoasVindas.tsx:61 | frase da coluna ilustrada | `Questões reais dos vestibulares, do jeito que a banca cobra.` | manter | Concreta e curta. | |
| T101 | telas/BoasVindas.tsx:66 | aria-label | `Etapas` | `Etapas do cadastro` | Contexto para leitor de tela. | |
| T102 | telas/BoasVindas.tsx:67 | etapas | `Sua conta` · `Provas-alvo` · `Ritmo` | manter | | |
| T103 | telas/BoasVindas.tsx:72 | título passo 1 | `Quais provas você vai fazer?` | manter | | |
| T104 | telas/BoasVindas.tsx:73 | texto passo 1 | `O site prioriza o que essas provas cobram: simulados, sugestões e treinos. Dá para mudar depois no perfil.` | `O site monta o seu estudo pelo que essas provas cobram e pela região delas. Dá para mudar depois no Perfil.` | Verdadeiro: Hoje pesa pelas provas-alvo e o filtro de região vem delas. "Perfil" com maiúscula (nome da tela). | |
| T105 | telas/BoasVindas.tsx:76,94 | botão | `Voltar` | manter | | |
| T106 | telas/BoasVindas.tsx:77 | botão | `Continuar` | manter | | |
| T107 | telas/BoasVindas.tsx:84 | título passo 2 | `Qual o seu ritmo?` | manter | | |
| T108 | telas/BoasVindas.tsx:85 | texto passo 2 | `Meta de questões por semana. Ela aparece no menu e no início; ajuste quando quiser.` | `Meta de questões por semana. Ela aparece no menu lateral; dá para mudar no Perfil.` | O Início não mostra a meta (conferido em Inicio.tsx). | |
| T109 | telas/BoasVindas.tsx:86 | aria-label | `Meta semanal` | manter | | |
| T110 | telas/BoasVindas.tsx:87 | opções de meta | `Leve` / `10 por dia` · `Firme` / `cerca de 20 por dia` · `Intenso` / `cerca de 40 por dia` | manter | Contas certas (70, 150, 300 por semana). | |
| T111 | telas/BoasVindas.tsx:95 | botão final | `Começar a estudar` | manter | | |

## 6. Escolha de provas-alvo (telas/EscolhaProvas.tsx; boas-vindas e Perfil)

| # | arquivo:linha | onde aparece | texto atual | texto novo | por quê | veredito |
|---|---|---|---|---|---|---|
| T112 | telas/EscolhaProvas.tsx:24 | rótulo oculto | `Buscar prova` | manter | | |
| T113 | telas/EscolhaProvas.tsx:25 | placeholder | `Buscar faculdade, cidade ou banca` | manter | | |
| T114 | telas/EscolhaProvas.tsx:26 | aria-label | `Região` | manter | | |
| T115 | telas/EscolhaProvas.tsx:27 | chip | `Todas` | manter | | |
| T116 | telas/EscolhaProvas.tsx:31 | contador | `${valor.length} selecionada${valor.length > 1 ? 's' : ''}` | manter | | |
| T117 | telas/EscolhaProvas.tsx:31 | sem seleção | `Escolha ao menos uma` | `Escolha pelo menos uma` | Mais natural. | |
| T118 | telas/EscolhaProvas.tsx:44 | etiqueta | `${n.toLocaleString('pt-BR')} questões` / `em preparação` | manter | | |
| T119 | telas/EscolhaProvas.tsx:44 | etiqueta carregando | `carregando…` (aria `Carregando`) | manter | | |

## 7. Início (telas/Inicio.tsx)

| # | arquivo:linha | onde aparece | texto atual | texto novo | por quê | veredito |
|---|---|---|---|---|---|---|
| T120 | telas/Inicio.tsx:227 | título da aba | `Início` | manter | | |
| T121 | telas/Inicio.tsx:238 | título | `Vamos avançar nos estudos?` | (a) `O que vamos estudar hoje?` (rec.) · (b) manter | Pergunta mais concreta; mesmo tamanho. | |
| T122 | telas/Inicio.tsx:239 | subtítulo | `Escolha uma matéria ou misture seus conhecimentos.` | `Escolha uma matéria ou treine todas juntas.` | "Misture seus conhecimentos" não diz o que acontece. | |
| T123 | telas/Inicio.tsx:56 | seção | `Suas matérias` | manter | | |
| T124 | telas/Inicio.tsx:58 | seta (aria) | `Matérias anteriores` | manter | | |
| T125 | telas/Inicio.tsx:65 | cartão da matéria (aria) | `${m.nome}: ${...} de ${...} questões feitas` / `questões em preparação` | manter | | |
| T126 | telas/Inicio.tsx:73 | seta (aria) | `Próximas matérias` | manter | | |
| T127 | telas/Inicio.tsx:94 | cartão | `Treino geral` | manter | | |
| T128 | telas/Inicio.tsx:95 | cartão, texto | `Questões aleatórias de todas as matérias.` | `Questões reais de prova, de todas as matérias, misturadas.` | "Aleatórias" soa sem critério; "reais de prova" é o diferencial. | |
| T129 | telas/Inicio.tsx:96 | andamento | `Rodada em andamento: ${ses!.i} de ${ses!.it.length} questões` | manter | | |
| T130 | telas/Inicio.tsx:96 | tamanho | `${n} questões por rodada` | manter | | |
| T131 | telas/Inicio.tsx:98 | botão | `Retomar treino` / `Começar treino` | manter | | |
| T132 | telas/Inicio.tsx:99 | botão | `Personalizar` | manter | | |
| T133 | telas/Inicio.tsx:102-103 | rótulo do grupo | `Questões por rodada` | manter | | |
| T134 | telas/Inicio.tsx:107 | nota | `As questões vêm de todas as matérias, sorteadas e misturadas.` | `Trocar o tamanho começa uma rodada nova.` | O texto repetia o cartão; o que o aluno precisa saber é que a rodada em andamento dá lugar à nova (Inicio.tsx:88). | |
| T135 | telas/Inicio.tsx:126 | rótulo | `Continue de onde parou` / `Comece por aqui` | manter | | |
| T136 | telas/Inicio.tsx:130 | progresso | `{feitas} de {plural(total, 'questão', 'questões')}` | manter | | |
| T137 | telas/Inicio.tsx:131 | falta | `Faltam ${falta} para concluir` / `Conteúdo concluído` | manter | | |
| T138 | telas/Inicio.tsx:132 | barra (aria) | `Progresso no conteúdo` | manter | | |
| T139 | telas/Inicio.tsx:133 | botão | `Continuar estudo` | `Continuar` | Botão mais curto, mesmo sentido. | |
| T140 | telas/Inicio.tsx:136 | botão | `Começar estudo` | `Começar` | Idem. | |
| T141 | telas/Inicio.tsx:155 | seção | `Seu desempenho por matéria` | manter | | |
| T142 | telas/Inicio.tsx:156 | subtítulo | `Compare seus acertos e veja onde vale reforçar.` | manter | | |
| T143 | telas/Inicio.tsx:158 | rótulo oculto | `Período` | manter | | |
| T144 | telas/Inicio.tsx:41 | opções | `Últimos 7 dias` · `Últimos 30 dias` · `Desde o começo` | manter | | |
| T145 | telas/Inicio.tsx:172 | coluna (aria) | `${v}% de acerto em ...` / `sem questões resolvidas no período` | manter | | |
| T146 | telas/Inicio.tsx:184 | legenda | `Questões resolvidas por matéria` | `Acerto e questões resolvidas por matéria` | O gráfico mostra o acerto (barra) e a quantidade embaixo. | |
| T147 | telas/Inicio.tsx:187 | número | `plural(total, 'questão resolvida', 'questões resolvidas')` | manter | | |
| T148 | telas/Inicio.tsx:188 | número | `plural(dias, 'dia de constância', 'dias de constância')` | `plural(dias, 'dia seguido', 'dias seguidos')` | Conta dias seguidos com resposta (logica/inicio.ts); "constância" é vago. | |
| T149 | telas/Inicio.tsx:190 | destaque | `Seu destaque: {nome} · {pct}% de acerto` | manter | | |
| T150 | telas/Inicio.tsx:204 | seção | `Hora de revisar` | manter | | |
| T151 | telas/Inicio.tsx:205 | subtítulo | `Transforme seus erros em aprendizado.` | `Seus erros dizem o que revisar.` | Tira o clichê. | |
| T152 | telas/Inicio.tsx:207 | chamada | `Comece pelas matérias que precisam de atenção` | `Comece pelas de menor acerto` | É o critério real (ordem por acerto). | |
| T153 | telas/Inicio.tsx:212 | linha | `{pct}% de acerto` | manter | | |
| T154 | telas/Inicio.tsx:213 | link (aria) | `Revisar ${nome}` | manter | | |
| T155 | telas/Inicio.tsx:213 | link | `Revisar` | manter | | |
| T156 | telas/Inicio.tsx:218 | vazio | `Quando você responder às primeiras questões, as matérias que pedem atenção aparecem aqui.` | `Responda às primeiras questões e as matérias de menor acerto aparecem aqui.` | Mais curto, mesmo critério de T152. | |
| T157 | telas/Inicio.tsx:220 | botão | `Revisar meus erros` | manter | | |
| T158 | telas/Inicio.tsx:221 | pé | `Uma nova chance de fixar o conteúdo.` | `Cada erro volta no dia certo.` | Frase genérica → como a revisão funciona. | |
| T159 | telas/Inicio.tsx:250 | aria-label | `Atalhos` | manter | | |
| T160 | telas/Inicio.tsx:253 | atalho | `Flashcards` / `Revise conceitos em poucos minutos` | `Flashcards` / `Pergunta curta, resposta em uma frase` | "Poucos minutos" é número vago; o formato é o que diferencia. | |
| T161 | telas/Inicio.tsx:258 | atalho | `Simulados` / `Pratique no ritmo da prova` | `Simulados` / `A prova inteira, no tempo oficial` | Concreto (SimuladoExec usa o tempo da prova). | |

## 8. Hoje e sessão do dia (telas/Hoje.tsx)

| # | arquivo:linha | onde aparece | texto atual | texto novo | por quê | veredito |
|---|---|---|---|---|---|---|
| T162 | telas/Hoje.tsx:120 | título da aba | `Hoje` | manter | | |
| T163 | telas/Hoje.tsx:148 | título | `Hoje` | manter | | |
| T164 | telas/Hoje.tsx:149 | subtítulo | `O que estudar hoje, na ordem que mais rende: primeiro o que mais cai nas suas provas, onde você mais erra e o que está para esquecer.` | `O que estudar hoje, nesta ordem: o que mais cai nas suas provas, onde você mais erra e o que está para esquecer.` | "Que mais rende" é promessa vaga; a ordem já se explica. | |
| T165 | telas/Hoje.tsx:154 | título da sessão | `{plural(n, 'questão', 'questões')} · cerca de {minutosDe(...)} min` | manter | | |
| T166 | telas/Hoje.tsx:154 | sessão vazia | `Nada pendente agora` | `Revisão em dia` | Reconhece o trabalho; vazio sem cobrança. | |
| T167 | telas/Hoje.tsx:156 | linha da sessão | `De {plural(...'conteúdo','conteúdos')}, {...'começando pelas fáceis erradas do Escudo TRI, '}com o seu tempo médio de {plural(..., 'minuto', 'minutos')} por questão.` | manter | Verdadeiro e específico. | |
| T168 | telas/Hoje.tsx:157 | sessão vazia, texto | `Você não tem questões para revisar nem conteúdos pendentes na sua região. Escolha uma matéria para avançar.` | `Nenhuma questão volta hoje e não há conteúdo pendente na sua região. Escolha uma matéria para avançar.` | Mais direto. | |
| T169 | telas/Hoje.tsx:158 | aria-label | `Tempo de estudo hoje` | manter | | |
| T170 | telas/Hoje.tsx:159 | rótulo | `Tempo de hoje` | manter | | |
| T171 | telas/Hoje.tsx:160 | chips | `{t} min` | manter | | |
| T172 | telas/Hoje.tsx:165 | botão | `Continuar` + `{i} de {n}` | manter | | |
| T173 | telas/Hoje.tsx:166 | botão | `Montar de novo` | manter | | |
| T174 | telas/Hoje.tsx:168 | botão | `Começar` | manter | | |
| T175 | telas/Hoje.tsx:169 | botão | `Ver as matérias` | manter | | |
| T176 | telas/Hoje.tsx:50 | Escudo, título | `Escudo TRI` | manter | | |
| T177 | telas/Hoje.tsx:51 | Escudo, texto | `No ENEM, quem erra a fácil e acerta a difícil ganha menos pontos que quem acerta as duas fáceis: a TRI confere a coerência das respostas. Garanta primeiro as questões fáceis (nível 1 a {FACIL_MAX}) dos conteúdos que o ENEM cobra.` | `No ENEM, a TRI confere a coerência: errar a fácil e acertar a difícil vale menos pontos que o contrário. Garanta primeiro as fáceis (dificuldade 1 a {FACIL_MAX}) dos conteúdos que o ENEM cobra.` | "As duas fáceis" estava confuso; "nível" no site é básico/intermediário/avançado, e 1 a 4 é dificuldade. | |
| T178 | telas/Hoje.tsx:53 | botão do Escudo | `Revisar as fáceis (${esc.sessao.length})` | manter | | |
| T179 | telas/Hoje.tsx:56 | número | `Fáceis erradas` | manter | | |
| T180 | telas/Hoje.tsx:57 | número | `Fáceis feitas` | manter | | |
| T181 | telas/Hoje.tsx:58 | número | `Conteúdos com o básico garantido` | manter | | |
| T182 | telas/Hoje.tsx:65 | detalhe | ` · ${c.erradasEnem} do próprio ENEM` | manter | | |
| T183 | telas/Hoje.tsx:66 | etiqueta | `Acertou a difícil e errou a fácil` | manter | | |
| T184 | telas/Hoje.tsx:67 | contagem | `{erradas} errada(s) de {faceis} fácil feita / fáceis feitas` | manter | | |
| T185 | telas/Hoje.tsx:70 | mais | `e mais {plural(..., 'conteúdo', 'conteúdos')}` | manter | | |
| T186 | telas/Hoje.tsx:74 | Escudo vazio (já fez) | `Nenhuma fácil errada agora. Continue: cada fácil que você acerta em dias diferentes protege a sua nota.` | `Nenhuma fácil errada agora. Cada fácil que você acerta em dias diferentes conta como básico garantido.` | "Protege a sua nota" é promessa de resultado; o critério real é o "básico garantido". | |
| T187 | telas/Hoje.tsx:75 | Escudo vazio (não fez) | `Você ainda não respondeu questões fáceis dos conteúdos do ENEM. Elas aparecem aqui assim que você começar.` | manter | | |
| T188 | telas/Hoje.tsx:86 | lista, título | `A ordem de hoje` | manter | | |
| T189 | telas/Hoje.tsx:87 | lista, texto | `Os {plural(..., 'primeiro conteúdo cabe', 'primeiros conteúdos cabem')} nos {plano.minutos} minutos. Toque num conteúdo para estudar só ele.` | manter | | |
| T190 | telas/Hoje.tsx:95 | separador | `Se sobrar tempo` | manter | | |
| T191 | telas/Hoje.tsx:96 | item (aria) | `${nome}, ${matéria}: ${n questões}, cerca de ${min} min. Começar só este conteúdo` | manter | | |
| T192 | telas/Hoje.tsx:100 | detalhe | `do banco` / `das questões ` + provas | manter | | |
| T193 | telas/Hoje.tsx:103 | duração | `cerca de {min} min` | manter | | |
| T194 | telas/Hoje.tsx:34 | motivo | `fácil errada` / `fáceis erradas` | manter | | |
| T195 | telas/Hoje.tsx:35 | motivo | `Errou com certeza` | manter | | |
| T196 | telas/Hoje.tsx:36 | motivo | `volta hoje` / `voltam hoje` | manter | | |
| T197 | telas/Hoje.tsx:37 | motivo | `esquecida` / `esquecidas` | manter | | |
| T198 | telas/Hoje.tsx:38 | motivo | `Ainda não estudado` | manter | | |
| T199 | telas/Hoje.tsx:39 | motivo | `Ainda não firmou` | manter | | |
| T200 | telas/Hoje.tsx:40 | motivo | `Cai muito ${provas}` | manter | | |
| T201 | telas/Hoje.tsx:178 | seção | `Como a ordem é feita` | manter | | |
| T202 | telas/Hoje.tsx:179-182 | explicação | `Cada conteúdo recebe três notas, todas tiradas das suas respostas e do banco de questões reais: peso — … fraqueza — o que você errou, esqueceu ou ainda não firmou; risco de esquecer — quanto a lembrança já caiu desde a última vez, pela agenda da revisão. O tempo usa a sua mediana por questão.` | trocar só `O tempo usa a sua mediana por questão.` por `O tempo usa o seu tempo típico por questão.` | "Mediana" é termo técnico; o resto é claro e verdadeiro. | |
| T203 | telas/Hoje.tsx:180-181 | trechos do peso | `quanto ele cai na sua prova-alvo / nas suas provas-alvo ({nomes}), pela parte das questões dessa(s) prova(s) no banco` · `quanto ele cai nas provas do banco` · ` (as suas provas-alvo ainda têm poucas questões no banco)` | manter | | |
| T204 | telas/Hoje.tsx:182 | link | `Escolha suas provas-alvo` + ` para a ordem seguir o que elas cobram.` | manter | | |
| T205 | telas/Hoje.tsx:194,197 | título da aba / rótulo da sessão | `Escudo TRI` / `Sessão de hoje` | manter | | |
| T206 | telas/Hoje.tsx:202 | dica da barra | `${rotulo}: a sessão fica salva se você sair` | manter | | |
| T207 | telas/Hoje.tsx:212 | fim, título | `Escudo TRI revisado` / `Sessão de hoje concluída` | manter | | |
| T208 | telas/Hoje.tsx:213 | fim, placar | `{ok} de {n} questão certa / questões certas, em {k} matérias.` | manter | | |
| T209 | telas/Hoje.tsx:217 | fim, próximo passo | `{n} questão errada volta / questões erradas voltam amanhã na revisão. Cada resposta já conta na agenda e no domínio de cada conteúdo.` | manter | Já diz o próximo passo com data. | |
| T210 | telas/Hoje.tsx:218 | botão | `Voltar para Hoje` | manter | | |

## 9. Matérias e página da matéria (telas/Materia.tsx)

| # | arquivo:linha | onde aparece | texto atual | texto novo | por quê | veredito |
|---|---|---|---|---|---|---|
| T211 | telas/Materia.tsx:24,27 | título | `Matérias` | manter | | |
| T212 | telas/Materia.tsx:27 | subtítulo | `Todas as matérias do vestibular.` | `Todas as matérias do ENEM e do vestibular.` | Inclui o ENEM, público principal. | |
| T213 | telas/Materia.tsx:32 | matéria inativa | `Em preparação: entra com as provas completas.` | manter | (Hoje nenhuma aparece: todas ativas.) | |
| T214 | telas/Materia.tsx:44 | linha do cabeçalho | `${plural(nTemas, 'tema', 'temas')} · ${vazia ? 'questões em preparação' : 'questões reais, todas com a fonte'}` | manter | | |
| T215 | telas/Materia.tsx:113 | faixa de temas (aria) | `Temas` | `Faixa de temas` | Vocabulário do produto. | |
| T216 | telas/Materia.tsx:114 | seta (aria) | `Temas anteriores` | manter | | |
| T217 | telas/Materia.tsx:122 | barra (aria) | `Progresso em ${mod.nome}` | manter | | |
| T218 | telas/Materia.tsx:127 | seta (aria) | `Próximos temas` | manter | | |
| T219 | telas/Materia.tsx:146 | Em preparação, título | `Questões em preparação` | manter | | |
| T220 | telas/Materia.tsx:148 | Em preparação, texto | `As questões de ${info.nome} chegam com a importação das provas completas: cada uma com o print fiel da prova, a fonte (prova, ano, número, link) e o gabarito oficial. Nenhuma questão é criada ou redigitada.` | `As questões de ${info.nome} chegam com as provas completas: cada uma com a fonte (prova, ano, número, link) e o gabarito.` | Falso hoje: há Questões Aprendice, questões só de texto transcritas e gabarito do Aprendice. "Importação" é bastidor. | |
| T221 | telas/Materia.tsx:151 | passo 1 | `Provas completas` / `ENEM e vestibulares de todas as regiões, baixados da fonte oficial.` | manter | | |
| T222 | telas/Materia.tsx:152 | passo 2 | `Gabarito publicado` / `Sem gabarito oficial ou resolução reconhecida, a questão não entra.` | `Gabarito conferido` / `Oficial quando a banca publica; sem ele, o gabarito do Aprendice, com aviso.` | O texto atual contradiz o princípio 2 (decisão de 11/11/2026). | |
| T223 | telas/Materia.tsx:153 | passo 3 | `Resolução revisada` / `Revisão em lentes: fatos contra a fonte, depois utilidade e estilo de prova.` | `Resolução revisada` / `Conferida contra a fonte e revisada pela banca do Aprendice.` | "Lentes" é jargão interno. | |
| T224 | telas/Materia.tsx:156 | botão | `Ver o catálogo de provas` | manter | | |
| T225 | telas/Materia.tsx:157 | botão | `Simulados disponíveis` | manter | | |
| T226 | telas/Materia.tsx:174 | título da aba | `Matéria` | manter | | |
| T227 | telas/Materia.tsx:175 | não encontrada | `Matéria não encontrada` + botão `Ver matérias` | manter | | |
| T228 | telas/Materia.tsx:190 | anel | `de acerto` / `plural(r.feitas, 'questão feita', 'questões feitas')` | manter | | |
| T229 | telas/Materia.tsx:198 | matéria vazia, título | `Questões de {info.nome} em preparação` | manter | | |
| T230 | telas/Materia.tsx:199 | matéria vazia, texto | `Os temas já estão aqui. As questões entram com as provas completas: cada uma com o print fiel da prova, a fonte (prova, ano, número, link), o gabarito oficial e o nível de dificuldade. Nenhuma questão é criada ou redigitada.` | `Os temas já estão aqui. As questões entram com as provas completas: cada uma com a fonte (prova, ano, número, link), o gabarito e o nível de dificuldade.` | Mesmo motivo de T220. | |
| T231 | telas/Materia.tsx:200 | botão | `Ver simulados` | manter | | |
| T232 | telas/Materia.tsx:204 | aria-label | `Revisão de ${info.nome}` | manter | | |
| T233 | telas/Materia.tsx:308 | capa do treino (h2 na matéria, h1 na tela do treino) | `Treino geral de {info.nome}` | manter | | |
| T234 | telas/Materia.tsx:309 | capa, retomada | `Seu treino está salvo onde você parou. ` | manter | | |
| T235 | telas/Materia.tsx:311 | contadores | `Questões de prova` · `Completar a frase` · `Flashcards` | `Questões de prova` · `Frases para completar` · `Flashcards` | Mesmo nome do Treino geral (`descreveTreino`) e do CLAUDE.md ("frases para completar"). | |
| T236 | telas/Materia.tsx:312 | contadores | ` feita` / ` feitas` / ` de ${n}` / `plural(ok, 'acerto', 'acertos')` | manter | | |
| T237 | telas/Materia.tsx:304 | botão da capa | `Retomar (${tg.i + 1} de ${tg.it.length})` / `Começar treino` | manter | | |
| T238 | telas/Materia.tsx:318 | composição | `${plural(nRq, 'questão', 'questões')} por rodada` / `${porRodada} itens por rodada: …` | manter | | |
| T239 | telas/Materia.tsx:214 | aria-label | `Atalhos de ${info.nome}` | manter | | |
| T240 | telas/Materia.tsx:217 | atalho | `Continuar de onde parei` | manter | | |
| T241 | telas/Materia.tsx:222 | atalho | `Flashcards` / `${n} para revisar hoje` / `${n} cartões novos` | manter | | |
| T242 | telas/Materia.tsx:228 | atalho | `Revisão essencial` / `O que mais cai, tema a tema` | manter | | |
| T243 | telas/Materia.tsx:232 | atalho | `Revisão dos erros` / `plural(r.vencidas, 'questão vencida', 'questões vencidas')` / `Nada vencido hoje` | `Revisão dos erros` / `plural(r.vencidas, 'volta hoje', 'voltam hoje')` / `Nada volta hoje` | "Vencida" soa como atraso; "volta hoje" é a linguagem da Revisão. | |
| T244 | telas/Materia.tsx:235 | atalho | `Simulados` / `Provas completas, por ano` | manter | | |
| T245 | telas/Materia.tsx:241 | aria-label | `Temas por área` | manter | | |
| T246 | telas/Materia.tsx:259 | tema na área | `plural(nCont, 'conteúdo', 'conteúdos')` / `Em preparação` | manter | | |
| T902 | telas/Materia.tsx:324 | capa do treino na tela própria (aria) | `Treino geral de ${info.nome}` | manter | | |

## 10. Tema (telas/Tema.tsx)

| # | arquivo:linha | onde aparece | texto atual | texto novo | por quê | veredito |
|---|---|---|---|---|---|---|
| T247 | telas/Tema.tsx:99 | título da aba | `Tema` | manter | | |
| T248 | telas/Tema.tsx:101 | não encontrado | `Tema não encontrado` + `Voltar à matéria` | manter | | |
| T249 | telas/Tema.tsx:141 | link | `Todos os temas` | manter | | |
| T250 | telas/Tema.tsx:148 | rótulo | `Tema {idx + 1} de {mods.length} · {nomeMat}` | manter | | |
| T251 | telas/Tema.tsx:152 | números | `{pct} feito · acerto {pct} · {n conteúdos}` | manter | | |
| T252 | telas/Tema.tsx:153 | sem questões | `Questões em preparação` | manter | | |
| T253 | telas/Tema.tsx:158 | aria-label | `Progresso por nível` | manter | | |
| T254 | telas/Tema.tsx:162 | barra (aria) | `${nomeNivel}: ${pct} feito` | manter | | |
| T255 | telas/Tema.tsx:168 | botão | `Começar` / `Continuar` / `Refazer` | manter | | |
| T256 | telas/Tema.tsx:169 | apoio | `Do mais fácil ao mais difícil` | manter | | |
| T257 | telas/Tema.tsx:172 | botão | `Ver os conteúdos` / `Revisão` / `Revisão em slides` | manter | | |
| T258 | telas/Tema.tsx:177 | botão | `Teoria em cartões · ${n}` | manter | | |
| T259 | telas/Tema.tsx:187 | seção | `Revisão essencial` | manter | | |
| T260 | telas/Tema.tsx:188 | texto | `Só o que todo aluno precisa saber e o que mais cai: o termômetro, o mapa mental do tema, {n telas} de conteúdo, uma questão resolvida e a conexão com outras matérias.` | `O que todo aluno precisa saber e o que mais cai: o que mais cai no tema, o mapa mental, {n telas} de conteúdo, uma Questão Aprendice resolvida e a conexão com outras matérias.` | "Termômetro" é nome interno (a tela se chama "O que mais cai"); a questão é Questão Aprendice (princípio 1). | |
| T261 | telas/Tema.tsx:189 | botão | `Começar a revisão` | manter | | |
| T262 | telas/Tema.tsx:194 | seção | `Resumo de cada conteúdo` | manter | | |
| T263 | telas/Tema.tsx:199 | sanfona | `Aprofundar: revisão completa em slides` | manter | | |
| T264 | telas/Tema.tsx:206 | seção | `Teoria em cartões` + `plural(n, 'cartão', 'cartões')` | manter | | |
| T265 | telas/Tema.tsx:211 | sem questões | `Questões em preparação` | manter | | |
| T266 | telas/Tema.tsx:212 | sem questões, texto | `As questões de {mod.nome.toLowerCase()} entram com as provas completas: print fiel da prova, fonte (prova, ano, número, link) e gabarito oficial. Cada uma recebe o seu nível: básico, intermediário ou avançado.` | `As questões de {mod.nome.toLowerCase()} entram com as provas completas, cada uma com a fonte (prova, ano, número, link), o gabarito e o seu nível: básico, intermediário ou avançado.` | Gabarito pode ser do Aprendice; questão só de texto aparece transcrita, não em print. | |
| T267 | telas/Tema.tsx:213 | botão | `Ver simulados` | manter | | |
| T268 | telas/Tema.tsx:218 | seção | `O que você vai encontrar` | manter | | |
| T269 | telas/Tema.tsx:228 | aviso de região | `De outras regiões: nenhuma questão {deFiltro(...)} neste conteúdo` | manter | | |
| T270 | telas/Tema.tsx:229 | progresso | `{pe.feitas} de {pe.total}` | manter | Quantidade só no conteúdo, como pede o CLAUDE.md. | |
| T271 | telas/Tema.tsx:242 | conteúdo sem questão | `Ainda sem questões` | manter | | |
| T272 | telas/Tema.tsx:252 | aria-label | `Outros temas` | manter | | |
| T273 | telas/Tema.tsx:253-254 | navegação | `Tema anterior` / `Próximo tema` | manter | | |
| T274 | telas/Tema.tsx:266 | seção | `Revisão em slides` + `plural(n, 'conteúdo', 'conteúdos')` | manter | | |
| T275 | telas/Tema.tsx:267 | texto | `Cada conteúdo em 5 tempos: pergunta primeiro, ver acontecer, lembrar sem olhar, aplicar numa questão nova e voltar no dia certo.` | manter | | |
| T276 | telas/Tema.tsx:271 | estado | `Continuar de onde parou` / `Nova` / `Para revisar hoje` / `Volta ${emDias(...)}` | manter | | |
| T277 | telas/Tema.tsx:277 | detalhe | `{n slides} · {n questões} · {frase}` | manter | | |
| T278 | telas/Tema.tsx:30 | cartão de teoria | `Como reconhecer na prova. ` | manter | | |
| T279 | telas/Tema.tsx:31 | cartão de teoria | `Exemplo. ` | manter | | |
| T280 | telas/Tema.tsx:38 | cartão de teoria | `Cuidado: ` | manter | | |
| T281 | telas/Tema.tsx:56 | resumo do tema | `No caderno` | manter | | |
| T282 | telas/Tema.tsx:59 | resumo do tema | `Erro que mais derruba: ` | `O erro mais comum: ` | "Derruba" é dramático; mesmo sentido. | |

## 11. Conteúdo / Treine sua evolução (telas/Escada.tsx)

| # | arquivo:linha | onde aparece | texto atual | texto novo | por quê | veredito |
|---|---|---|---|---|---|---|
| T283 | telas/Escada.tsx:53 | título da aba | `Conteúdo` | manter | | |
| T284 | telas/Escada.tsx:59 | não encontrado | `Conteúdo não encontrado` + `Voltar` | manter | | |
| T285 | telas/Escada.tsx:63 | sem questões | `Este conteúdo está sem questões no momento. Questões novas estão em preparação.` | `Este conteúdo ainda não tem questões. Elas estão em preparação.` | Mais curto. | |
| T286 | telas/Escada.tsx:63 | botão | `Voltar ao tema` | manter | | |
| T287 | telas/Escada.tsx:80 | migalhas (aria) | `Você está em` | manter | | |
| T288 | telas/Escada.tsx:86 | subtítulo | `{plural(l.length, 'questão real', 'questões reais')} · do básico ao avançado` | manter | Aqui a quantidade é permitida (conteúdo). | |
| T289 | telas/Escada.tsx:93 | bloco | `Treine sua evolução` | manter | Vocabulário fixo. | |
| T290 | telas/Escada.tsx:94 | texto | `Do mais fácil ao mais difícil, para você subir de nível com base.` | `Do mais fácil ao mais difícil: você vê em que nível trava.` | Diz o benefício real (feedback por nível). | |
| T291 | telas/Escada.tsx:95 | progresso | `{p.feitas} de {p.total} feitas · {p.certas} certas` | manter | | |
| T292 | telas/Escada.tsx:96 | barra (aria) | `Progresso no conteúdo` | manter | | |
| T293 | telas/Escada.tsx:98 | botão | `Começar` / `Continuar` / `Refazer do início` | manter | | |
| T294 | telas/Escada.tsx:102 | aria-label | `Resumo do conteúdo` | manter | | |
| T295 | telas/Escada.tsx:103 | seção | `Resumo` | manter | | |
| T296 | telas/Escada.tsx:109 | seção | `Por nível` | manter | | |
| T297 | telas/Escada.tsx:120 | nível | `plural(d.total, 'questão', 'questões')` | manter | | |
| T298 | telas/Escada.tsx:121 | nível | `Ainda sem respostas` / `${pct}% de acerto · ${plural(d.feitas, 'feita', 'feitas')}` | manter | | |
| T299 | telas/Escada.tsx:122 | nível | `{n questões} de outras regiões` | manter | | |
| T300 | telas/Escada.tsx:124 | botão | `Treinar ${nomeNivel(...).toLowerCase()}` | manter | | |
| T301 | telas/Escada.tsx:125 | nível vazio | `Ainda sem questões neste nível` | manter | | |
| T302 | telas/Escada.tsx:136 | sanfona | `Teoria antes de começar` | manter | | |
| T303 | telas/Escada.tsx:160 | etiqueta | `Questão indisponível` | manter | | |
| T304 | telas/Escada.tsx:171 | apoio | `revisar ${emDias(f.vence)}` | `volta ${emDias(f.vence)}` | Mesmo verbo da Revisão ("volta amanhã"). | |
| T305 | telas/Escada.tsx:175 | estado (aria) | `Acertou` / `Errou` / `Não feita` | manter | | |
| T306 | dados/modoAdmin.ts:24 | etiqueta (só administrador) | `oculto para o aluno` | manter | Só o dono vê. | |

## 12. Questão (telas/Questao.tsx)

| # | arquivo:linha | onde aparece | texto atual | texto novo | por quê | veredito |
|---|---|---|---|---|---|---|
| T307 | telas/Questao.tsx:67 | título da aba | `${q.escola} ${q.ano}` / `Questão` | manter | | |
| T308 | telas/Questao.tsx:139 | não encontrada | `Questão não encontrada` + `Voltar` | manter | | |
| T309 | telas/Questao.tsx:161 | botão voltar (aria/title/rótulo) | `Voltar` / `Voltar (Esc)` | manter | | |
| T310 | telas/Questao.tsx:164 | barra | `Revisão` / nome da matéria | manter | | |
| T311 | telas/Questao.tsx:165 | barra | `{tema} · {nível} · {pos} de {n}` | manter | | |
| T312 | telas/Questao.tsx:168,324 | ajuda do teclado | `Teclado: A–E escolhe · Shift + letra risca · Enter confirma e avança · H dica · P pausa · Esc volta` | manter | Atalhos não mudam. | |
| T313 | telas/Questao.tsx:169 | cronômetro total (title) | `Tempo total desta sessão` | manter | | |
| T314 | telas/Questao.tsx:169-170 | rótulos | `Total` / `Questão` | manter | | |
| T315 | telas/Questao.tsx:171 | botão pausa (aria/title) | `Retomar` / `Pausar` / `Retomar (P)` / `Pausar (P)` | manter | | |
| T316 | telas/Questao.tsx:180 | pausa, título | `Pausado` | manter | | |
| T317 | telas/Questao.tsx:181 | pausa, texto | `O cronômetro parou. A questão fica escondida até você voltar.` | manter | | |
| T318 | telas/Questao.tsx:182 | botão | `Continuar` | manter | | |
| T319 | telas/Questao.tsx:190,291 | marcador (aria/title) | `Revisar depois` | manter | | |
| T320 | telas/Questao.tsx:197 | botão | `Dica` (title `Dica (H)`) | manter | | |
| T321 | telas/Questao.tsx:198 | botão | `Confirmar resposta` | manter | | |
| T322 | telas/Questao.tsx:202 | anterior (aria/title) | `Questão anterior` / `Anterior` | manter | | |
| T323 | telas/Questao.tsx:203,217 | botão | `Próxima questão` / `Concluir` | manter | | |
| T324 | telas/Questao.tsx:209 | aria-label do painel | `Resolução, teoria e fonte` | manter | | |
| T325 | telas/Questao.tsx:216 | botão | `Anterior` | manter | | |
| T326 | telas/Questao.tsx:223 | já respondida | `Você já respondeu esta questão {uma vez / n vezes}{; revisão amanhã}.` | `Você já respondeu esta questão {uma vez / n vezes}{; ela volta amanhã}.` | Mesmo verbo da Revisão. | |
| T327 | telas/Questao.tsx:225 | trava, título | `A resolução abre quando você confirmar` | manter | | |
| T328 | telas/Questao.tsx:225 | trava, texto | `Marque uma alternativa e confirme. Se travar, peça uma dica: ela mostra o caminho sem entregar a resposta.` | manter | | |
| T329 | telas/Questao.tsx:231,302 | teoria | `Teoria desta questão · ` | manter | | |
| T330 | telas/Questao.tsx:232,303 | teoria vazia | `A teoria deste conteúdo está em preparação.` | manter | | |
| T331 | telas/Questao.tsx:237-238,308-309 | relacionados | `Conteúdos relacionados` | manter | | |
| T332 | telas/Questao.tsx:294 | indisponível (aria) | `Questão indisponível` | manter | | |
| T333 | telas/Questao.tsx:294 | indisponível | `Gabarito oficial com erro e sem correção da banca. Só para consulta.` | `A banca do Aprendice achou erro no gabarito oficial, e a banca da prova não corrigiu. Só para consulta.` | Diz quem achou o erro (como a aba Fonte); sem parecer acusação vaga. | |
| T334 | telas/Questao.tsx:294 | oculta (só administrador) | `Oculta para o aluno: ${q.pendente \|\| 'fora do ar'}.` | manter | | |
| T335 | telas/Questao.tsx:297 | aria-label | `Teoria e fonte` | manter | | |

## 13. Cartão da questão (ui/QuestaoCartao.tsx)

| # | arquivo:linha | onde aparece | texto atual | texto novo | por quê | veredito |
|---|---|---|---|---|---|---|
| T336 | ui/QuestaoCartao.tsx:27 | lupa (aria) | `Questão ampliada` | manter | | |
| T337 | ui/QuestaoCartao.tsx:28 | fechar (aria) | `Fechar` | manter | | |
| T338 | ui/QuestaoCartao.tsx:175,191 | link (title) | `Abrir a fonte original` | manter | | |
| T339 | ui/QuestaoCartao.tsx:175 | oculto | `Fonte original` | manter | | |
| T340 | ui/QuestaoCartao.tsx:178 | aviso de gabarito | (usa `origemGabarito`, ver T581) | — | | |
| T341 | ui/QuestaoCartao.tsx:182 | botão | `Ver a questão original (print da prova)` | manter | | |
| T342 | ui/QuestaoCartao.tsx:186 | print (aria) | `Ampliar a questão` | manter | | |
| T343 | ui/QuestaoCartao.tsx:190 | botão | `Ampliar` | manter | | |
| T344 | ui/QuestaoCartao.tsx:195 | aria-label | `Texto da questão` | manter | | |
| T345 | ui/QuestaoCartao.tsx:196 | aviso sem print | `Nesta prévia o print original não está incluído; o site completo mostra o print fiel da prova.` | `O print desta questão não está disponível aqui. O texto abaixo é o da prova.` | "Prévia" e "site completo" são bastidor; diz o fato. | |
| T346 | ui/QuestaoCartao.tsx:201 | botão | `Ver em texto (o sublinhado da prova só aparece no print)` / `Voltar para o texto` | manter | | |
| T347 | ui/QuestaoCartao.tsx:204 | botão | `Esconder texto` / `Ver em texto (leitor de tela, busca)` | manter | | |
| T348 | ui/QuestaoCartao.tsx:230,232 | abas | `Resolução` · `Teoria` · `Fonte` (aria `Resolução, teoria e fonte`) | manter | | |
| T349 | ui/QuestaoCartao.tsx:244-249 | aba Fonte | `Prova` · `Ano` · `Fase` · `Questão` · `Banca` · `Origem` · `Gabarito` | manter | | |
| T350 | ui/QuestaoCartao.tsx:251 | aba Fonte, indisponível | `Indisponível: a banca do Aprendice encontrou erro no gabarito oficial, e a banca da prova não publicou errata. A questão fica só para consulta: sem resposta nem correção, fora dos treinos, simulados e revisões` | manter (pôr ponto final) | Claro e verdadeiro; falta o ponto. | |
| T351 | ui/QuestaoCartao.tsx:256 | link | `Abrir a fonte original` | manter | | |
| T352 | ui/QuestaoCartao.tsx:275 | tela cheia (title) | `Sair da tela cheia (Esc)` / `Tela cheia: só a questão` | manter | | |
| T353 | ui/QuestaoCartao.tsx:276 | botão | `Sair da tela cheia` / `Tela cheia` | manter | | |
| T354 | ui/QuestaoCartao.tsx:288 | aria-label | `Alternativas` | manter | | |
| T355 | ui/QuestaoCartao.tsx:298 | alternativa (aria) | `Alternativa ${l}…${' (riscada)'}` | manter | | |
| T356 | ui/QuestaoCartao.tsx:310 | aria-label | `Quanta certeza você tem` | manter | | |
| T357 | ui/QuestaoCartao.tsx:311 | rótulo | `Certeza:` | manter | | |
| T358 | ui/QuestaoCartao.tsx:312 | chips | `Tenho certeza` · `Acho que é` · `Chutei` | manter | | |

## 14. Correção da questão (ui/Resolucao.tsx)

| # | arquivo:linha | onde aparece | texto atual | texto novo | por quê | veredito |
|---|---|---|---|---|---|---|
| T359 | ui/Resolucao.tsx:32 | bloco (matérias em texto) | `Resolução` | manter | | |
| T360 | ui/Resolucao.tsx:72 | cabeçalho, acertou | `Você acertou` | manter | | |
| T361 | ui/Resolucao.tsx:72 | cabeçalho, errou | `Você marcou ${marcada}. A resposta é ${q.gab}.` | manter | Começa pela letra dele, como manda o método. | |
| T362 | ui/Resolucao.tsx:72 | cabeçalho, sem escolha | `Gabarito: ${q.gab}` | manter | | |
| T363 | ui/Resolucao.tsx:75 | linha da fonte | `{origemGabarito} · {escola} {ano}, questão {n}` | manter | | |
| T364 | ui/Resolucao.tsx:82 | sem resolução | `A resolução comentada desta questão está em revisão e entra quando passar por todas as lentes.` | `A resolução comentada desta questão ainda está em revisão pela banca do Aprendice. O gabarito acima já vale.` | "Lentes" é jargão; diz o que o aluno já pode usar. | |
| T365 | ui/Resolucao.tsx:88 | bloco 1 | `Por que eu errei` | manter | Vocabulário fixo da correção. | |
| T366 | ui/Resolucao.tsx:95 | bloco 2 | `Resposta correta` | manter | | |
| T367 | ui/Resolucao.tsx:99 | bloco 2 | `A pegadinha` | manter | | |
| T368 | ui/Resolucao.tsx:112 | bloco 4 | `Por que as outras estão erradas` | manter | | |
| T369 | ui/Resolucao.tsx:119 | rodapé | `Fonte: {origem} · {escola} {ano}` | manter | | |

## 15. Resolução animada (ui/ResolucaoAnimada.tsx)

| # | arquivo:linha | onde aparece | texto atual | texto novo | por quê | veredito |
|---|---|---|---|---|---|---|
| T370 | ui/ResolucaoAnimada.tsx:201 | contagem | `${n} passo(s)` / `${n} de ${n} passos` / `Passo ${atual + 1} de ${n}` | manter | | |
| T906 | ui/ResolucaoAnimada.tsx:223 | contagem curta (celular) | `${n} de ${n}` / `${atual + 1} de ${n}` | manter | | |
| T371 | ui/ResolucaoAnimada.tsx:207 | título | `Resolução animada` | manter | | |
| T372 | ui/ResolucaoAnimada.tsx:210 | botão | `Assistir resolução` | manter | Nome do protótipo. | |
| T373 | ui/ResolucaoAnimada.tsx:211 | apoio | `, escritos à mão na sua frente` / `, um de cada vez` | manter | | |
| T374 | ui/ResolucaoAnimada.tsx:212 | link | `Ver sem animação` | manter | | |
| T375 | ui/ResolucaoAnimada.tsx:216 | aria-label | `Controles da resolução animada` | manter | | |
| T376 | ui/ResolucaoAnimada.tsx:217-218 | botão | `Pausar` / `Assistir de novo` / `Tocar` · `De novo` | manter | | |
| T377 | ui/ResolucaoAnimada.tsx:220 | botão (aria/title) | `Passo anterior` / `Passo anterior (←)` | manter | | |
| T378 | ui/ResolucaoAnimada.tsx:221 | botão (aria/title) | `Próximo passo` / `Próximo passo (→)` | manter | | |
| T379 | ui/ResolucaoAnimada.tsx:222 | velocidade | `Velocidade da escrita: ${rotVel}` / `Velocidade da escrita` | manter | | |
| T380 | ui/ResolucaoAnimada.tsx:224 | botão (aria/title) | `Pular para o quadro final` | `Ver o quadro final` | Mais curto; "pular" sugere perder algo. | |
| T381 | ui/ResolucaoAnimada.tsx:225 | botão (aria/title) | `Recomeçar` | manter | | |

## 16. Treino geral da matéria (telas/Treino.tsx)

| # | arquivo:linha | onde aparece | texto atual | texto novo | por quê | veredito |
|---|---|---|---|---|---|---|
| T382 | telas/Treino.tsx:115 | título da aba | `Treino geral` | manter | | |
| T904 | telas/Treino.tsx:140 | capa própria do treino (/m/<m>/treino): link | `Todos os temas` | manter | Os demais textos da capa são os de Materia.tsx (T233–T238, T902). | |
| T383 | telas/Treino.tsx:81 | etiqueta | `Questão real` | manter | | |
| T384 | telas/Treino.tsx:85 | botão | `Confirmar resposta` | manter | | |
| T385 | telas/Treino.tsx:87,94 | botão | `Continuar` | manter | | |
| T386 | telas/Treino.tsx:91 | aria-label | `Resolução, teoria e fonte` | manter | | |
| T387 | telas/Treino.tsx:95 | trava | `A resolução abre quando você confirmar` / `Marque uma alternativa e confirme. A resolução explica a alternativa que você marcou.` | manter | | |
| T388 | telas/Treino.tsx:99-100 | teoria | `Teoria desta questão · ` / `A teoria deste conteúdo está em preparação.` | manter | | |
| T389 | telas/Treino.tsx:154 | fim, título | `Treino concluído` | manter | | |
| T390 | telas/Treino.tsx:155 | fim, placar | `{a} de {n} itens certos.` | manter | | |
| T391 | telas/Treino.tsx:157 | fim, rótulos | `questões de prova` · `flashcards` · `frases` | manter | | |
| T903 | telas/Treino.tsx:158 | fim, números | `{x.ok} de {x.n}` | manter | | |
| T392 | telas/Treino.tsx:161 | fim, próximo passo | `Erros e chutes entram na revisão espaçada automaticamente.` | `Erros e chutes voltam na revisão: as questões amanhã, os flashcards e frases no dia marcado.` | Diz quando volta (logica/revisao.ts). | |
| T393 | telas/Treino.tsx:163 | botões | `Voltar a {info.nome}` / `Novo treino` | manter | | |
| T394 | telas/Treino.tsx:174 | voltar (aria/title) | `Voltar (o treino fica salvo)` | manter | | |
| T395 | telas/Treino.tsx:178 | barra (title) | `O treino fica salvo se você sair` | manter | | |
| T396 | telas/Treino.tsx:182 | botão | `Recomeçar` | manter | | |
| T397 | telas/Treino.tsx:190 | item faltando | `Item indisponível.` + `Pular` | `Este item não está disponível.` + `Pular` | Frase completa. | |
| T398 | telas/Treino.tsx:192 | link de rodapé | `Voltar a {info.nome}` | manter | | |

## 17. Treino geral de todas as matérias e rodadas (telas/TreinoMisto.tsx)

| # | arquivo:linha | onde aparece | texto atual | texto novo | por quê | veredito |
|---|---|---|---|---|---|---|
| T399 | telas/TreinoMisto.tsx:34 | título da aba | `Treino geral` | manter | | |
| T400 | telas/TreinoMisto.tsx:53 | vazio, título | `Sem questões para sortear agora` | manter | | |
| T401 | telas/TreinoMisto.tsx:54 | vazio, texto | `As questões de prova entram com as provas completas.` | `As questões entram com as provas completas. Tente outra região no filtro.` | Dá uma saída real (o sorteio segue o filtro de região). | |
| T402 | telas/TreinoMisto.tsx:54,73 | botão | `Voltar ao início` | manter | | |
| T403 | telas/TreinoMisto.tsx:64 | fim, título | `Treino concluído` | manter | | |
| T404 | telas/TreinoMisto.tsx:65 | fim, placar | `{ok} de {n} questão certa / questões certas, em {k} matérias.` | manter | | |
| T405 | telas/TreinoMisto.tsx:71 | fim, próximo passo | `Cada resposta já conta no progresso da matéria da questão. Erros e chutes entram na revisão espaçada.` | `Cada resposta conta no progresso da matéria. Erros e chutes voltam amanhã na revisão.` | Data concreta (questões voltam amanhã). | |
| T406 | telas/TreinoMisto.tsx:73,81 | botão | `Nova rodada` | manter | | |
| T407 | telas/TreinoMisto.tsx:79 | dica da barra | `Treino geral de todas as matérias. O treino fica salvo se você sair` | manter | | |
| T408 | telas/TreinoMisto.tsx:99 | voltar (aria) | `Voltar (${rotulo.toLowerCase()} fica salvo)` | `Voltar (fica salvo)` | "Sessão de hoje fica salvo" sai com concordância errada; o title já usa esta forma. | |
| T409 | telas/TreinoMisto.tsx:99 | voltar (title) | `Voltar (fica salvo)` | manter | | |
| T410 | telas/TreinoMisto.tsx:114 | questão faltando | `Questão indisponível.` + `Pular` | manter | | |

## 18. Flashcards (telas/Flashcards.tsx)

| # | arquivo:linha | onde aparece | texto atual | texto novo | por quê | veredito |
|---|---|---|---|---|---|---|
| T411 | telas/Flashcards.tsx:30 | título da aba | `Flashcards` | manter | | |
| T412 | telas/Flashcards.tsx:64 | sem cartões, título | `Flashcards de {info.nome} em preparação` | manter | | |
| T413 | telas/Flashcards.tsx:65 | sem cartões, texto | `Os cartões desta matéria estão sendo escritos e conferidos pela banca de especialistas. Eles entram no site só depois de passar por todas as revisões.` | `Os cartões desta matéria estão sendo escritos e conferidos pela banca do Aprendice. Só entram depois de revisados.` | Mais curto; mesmo fato. | |
| T414 | telas/Flashcards.tsx:66 | botão | `Voltar para {info.nome}` | manter | | |
| T415 | telas/Flashcards.tsx:75 | quando volta | `O próximo cartão que você já viu volta ${emDias(v)}.` / `Não há cartões ativos agora.` | manter / `Nenhum cartão disponível agora.` | "Ativos" é termo interno. | |
| T416 | telas/Flashcards.tsx:99 | título | `Flashcards` | manter | | |
| T417 | telas/Flashcards.tsx:100 | texto | `Pergunta curta no estilo das discursivas, resposta em uma frase. Você escreve, o site corrige e você confirma: vale a ideia, não a frase exata.` | manter | Preciso e no vocabulário. | |
| T418 | telas/Flashcards.tsx:102 | aria-label | `Seus cartões` | manter | | |
| T419 | telas/Flashcards.tsx:103-105 | resumo | `para revisar hoje` · `novo`/`novos` · `firme`/`firmes` | manter | | |
| T420 | telas/Flashcards.tsx:110 | botão | `Revisar agora` / `Começar` / `Tudo em dia` | manter | | |
| T421 | telas/Flashcards.tsx:112 | apoio | `${plural(nSessao, 'cartão', 'cartões')} nesta sessão` | manter | | |
| T422 | telas/Flashcards.tsx:117 | seção | `Área` + `{n cartões} em {nome}` | manter | | |
| T423 | telas/Flashcards.tsx:118 | aria-label | `Filtrar por área` | manter | | |
| T424 | telas/Flashcards.tsx:119 | botão | `Todas` | manter | | |
| T425 | telas/Flashcards.tsx:125 | seção | `Tema` + `Todos os temas` | manter | | |
| T426 | telas/Flashcards.tsx:126 | aria-label | `Filtrar por tema` | manter | | |
| T427 | telas/Flashcards.tsx:129 | botão | `Todos os temas` + `{n cartões}` | manter | | |
| T428 | telas/Flashcards.tsx:137 | tema | `{n cartões} · {n firmes}` / barra `Cartões firmes em ${x.nome}` | manter | | |
| T429 | telas/Flashcards.tsx:143 | nota | `Intervalos de revisão: 1, 3, 7, 16, 35 e 80 dias. “Quase” volta amanhã; “Errei” volta hoje.{ … cartões tirados por “Não curti”.}` | `Acertei: volta em 1, 3, 7, 16, 35 e 80 dias, mais cedo se a prova estiver perto. Quase: amanhã. Errei: hoje.{ … cartões tirados por “Não”.}` | Falta dizer que a data da prova encurta (logica/revisao.ts); o botão do verso é "Não", não "Não curti". | |
| T430 | telas/Flashcards.tsx:150 | sessão vazia | `Nenhum cartão para agora` + `Voltar` | manter | | |
| T431 | telas/Flashcards.tsx:158 | fim, título | `Sessão concluída` | manter | | |
| T432 | telas/Flashcards.tsx:160-162 | fim, contadores | `Acertei` · `Quase` · `Errei` | manter | | |
| T433 | telas/Flashcards.tsx:164 | fim, próximo passo | `Os que você errou voltam ainda hoje; os demais, no dia certo da revisão.` | manter | | |
| T434 | telas/Flashcards.tsx:165 | botões | `Voltar aos flashcards` / `Ir para {info.nome}` | manter | | |
| T435 | telas/Flashcards.tsx:174 | voltar (aria/title) | `Sair da sessão` | manter | | |
| T436 | telas/Flashcards.tsx:178 | barra | `Flashcards · {i} de {n}` | manter | | |

## 19. Cartões: flashcard e frase para completar (ui/Cartoes.tsx)

| # | arquivo:linha | onde aparece | texto atual | texto novo | por quê | veredito |
|---|---|---|---|---|---|---|
| T437 | ui/Cartoes.tsx:23 | tipo do cartão | `Conceito` · `Fórmula` · `Como identificar` · `Comparação` · `Processo` · `Exemplo` · `Com imagem` | manter | | |
| T438 | ui/Cartoes.tsx:25 | veredito | `Parece certo` / `Quase` / `Não bateu` | manter | Humilde (é sugestão). | |
| T439 | ui/Cartoes.tsx:33-35 | gosto | `Curtiu este cartão?` · `Sim` · `Não` | manter | Vocabulário fixo. | |
| T440 | ui/Cartoes.tsx:36 | gosto, Não | `Ele sai das próximas sessões.` | manter | | |
| T441 | ui/Cartoes.tsx:51-52 | notas | `Como foi?` (aria `Como foi`) | manter | | |
| T442 | ui/Cartoes.tsx:53 | notas | `Errei` · `Quase` · `Acertei` | manter | | |
| T443 | ui/Cartoes.tsx:70 | fonte | `Fonte: ` | manter | | |
| T444 | ui/Cartoes.tsx:76 | falha | `Este cartão não abriu.` | manter | | |
| T445 | ui/Cartoes.tsx:79 | falha | `Esta frase não abriu.` | manter | | |
| T446 | ui/Cartoes.tsx:114,118 | etiqueta | `Flashcard` / `Novo` | manter | | |
| T447 | ui/Cartoes.tsx:121 | rótulo | `Sua resposta, com as suas palavras` | manter | | |
| T448 | ui/Cartoes.tsx:122 | placeholder | `Escreva aqui o que você lembra` | manter | | |
| T449 | ui/Cartoes.tsx:126 | botão | `Corrigir` | manter | | |
| T450 | ui/Cartoes.tsx:127,179 | botão | `Não sei: ver a resposta` | manter | | |
| T451 | ui/Cartoes.tsx:128 | dica | `Enter corrige · Shift + Enter pula linha` | manter | | |
| T452 | ui/Cartoes.tsx:131 | corrigindo | `Corrigindo…` | manter | | |
| T453 | ui/Cartoes.tsx:138 | faltou | `Faltou: ` | manter | | |
| T454 | ui/Cartoes.tsx:139 | origem da correção | `Correção por IA (simulada nesta versão, feita no aparelho)` / `Correção local` + `: é uma sugestão, quem decide é você.` | `Correção automática, feita no aparelho` / `Correção automática` + `: é uma sugestão; quem decide é você.` | Não há IA de verdade ainda (logica/ia.ts): dizer "IA (simulada)" confunde; "automática" é verdadeiro nos dois casos. | |
| T455 | ui/Cartoes.tsx:142 | verso | `Resposta-modelo` | manter | | |
| T456 | ui/Cartoes.tsx:143 | verso | `Erro comum: ` | manter | | |
| T457 | ui/Cartoes.tsx:169 | frase | `Complete a frase` | manter | | |
| T458 | ui/Cartoes.tsx:173 | campo (aria) | `Palavra que falta` | manter | | |
| T459 | ui/Cartoes.tsx:180 | botão | `Corrigir` | manter | | |
| T460 | ui/Cartoes.tsx:186 | veredito | `Resposta` | manter | | |
| T461 | ui/Cartoes.tsx:187 | resposta | `A palavra é {c.resp}{ (também vale: …)}.` | manter | | |

## 20. Comentário da correção do flashcard (logica/correcao.ts)

| # | arquivo:linha | onde aparece | texto atual | texto novo | por quê | veredito |
|---|---|---|---|---|---|---|
| T462 | logica/correcao.ts:184 | número errado | `O número da sua resposta não confere com o da resposta-modelo. Compare e decida.` | manter | | |
| T463 | logica/correcao.ts:185 | sentido invertido | `Parece que a sua resposta inverte o sentido (de onde para onde). Compare com a resposta-modelo e decida.` | manter | | |
| T464 | logica/correcao.ts:186 | certo | `Sua resposta traz as ideias essenciais. Confira com a resposta-modelo e confirme.` | manter | | |
| T465 | logica/correcao.ts:187 | quase | `Sua resposta tem parte do essencial. Compare com a resposta-modelo: se você disse o mesmo com outras palavras, marque Acertei.` | manter | | |
| T466 | logica/correcao.ts:188 | não bateu | `Não encontrei as ideias essenciais na sua resposta. Compare com a resposta-modelo: se você disse o mesmo com outras palavras, marque Acertei.` | `As ideias essenciais não apareceram na sua resposta. Compare com a resposta-modelo: se você disse o mesmo com outras palavras, marque Acertei.` | O site não fala em primeira pessoa ("encontrei") no resto da interface. | |

## 21. Simulados: lista, por conteúdo e histórico (telas/Simulados.tsx)

| # | arquivo:linha | onde aparece | texto atual | texto novo | por quê | veredito |
|---|---|---|---|---|---|---|
| T467 | telas/Simulados.tsx:17,48 | título | `Simulados` | manter | | |
| T468 | telas/Simulados.tsx:49 | subtítulo (por conteúdo) | `Só questões reais de prova dos conteúdos que você escolher, com cronômetro e resultado no fim.` | `Questões reais de prova dos conteúdos que você escolher, da mais fácil à mais difícil, com cronômetro e resultado por conteúdo.` | Inclui a ordem e o resultado por conteúdo (CLAUDE.md, verdadeiro em simulados.ts e SimuladoResultado). | |
| T469 | telas/Simulados.tsx:50 | subtítulo (histórico) | `Os simulados que você já entregou, com o resultado e a correção de cada um.` | manter | | |
| T470 | telas/Simulados.tsx:51 | subtítulo (provas) | `Provas inteiras, com todas as matérias, no tempo oficial. Escolha a instituição e o ano.` | manter | | |
| T471 | telas/Simulados.tsx:56 | em andamento | `Em andamento · {n} de {t} respondidas · {tempo} usados` | manter | | |
| T472 | telas/Simulados.tsx:57 | botão | `Retomar` | manter | | |
| T473 | telas/Simulados.tsx:61 | aria-label | `Seções` | `Seções dos simulados` | Contexto para leitor de tela. | |
| T474 | telas/Simulados.tsx:62-64 | abas | `Provas` · `Por conteúdo` · `Histórico` | manter | | |
| T475 | telas/Simulados.tsx:71 | chip | `Minhas provas-alvo{ (n)}` | manter | | |
| T476 | telas/Simulados.tsx:72 | chip | `Minha região` | manter | | |
| T477 | telas/Simulados.tsx:73 | chip | `Todas as regiões ({n})` | manter | | |
| T478 | telas/Simulados.tsx:75 | chip | `Mudar provas-alvo` | manter | | |
| T479 | telas/Simulados.tsx:78 | aviso | `Ainda não há prova completa {deFiltro(...)}. Mostrando todas as regiões.` | manter | | |
| T480 | telas/Simulados.tsx:79 | aviso | `Suas provas-alvo ainda não têm prova completa. Mostrando todas.` | manter | | |
| T481 | telas/Simulados.tsx:87 | grupo | `{instituicao} · banca {banca} · {n provas}` | manter | | |
| T482 | telas/Simulados.tsx:88 | link | `Sobre a prova` | manter | | |
| T483 | telas/Simulados.tsx:97 | linha | `{n questões} · {h} h` | manter | | |
| T484 | telas/Simulados.tsx:100 | etiqueta | `Feito · {feito.acertos} de {feito.total}` | manter | | |
| T485 | telas/Simulados.tsx:112 | vazio, título | `As provas completas estão chegando` | `Nenhuma prova completa carregou` | O texto diz duas coisas (chegando / não carregou); o caso real desta tela é falha ao carregar o índice. | |
| T486 | telas/Simulados.tsx:113 | vazio, texto | `Cada simulado é uma prova inteira, com todas as matérias, do jeito que caiu. Se esta lista não carregou, verifique a conexão e abra a página de novo.` | `Confira a conexão e abra a página de novo. Cada simulado é uma prova inteira, do jeito que caiu.` | A saída vem primeiro. | |
| T487 | telas/Simulados.tsx:117 | seção | `Em preparação` + `Provas que ainda não entram como simulado, e o motivo.` | manter | | |
| T488 | telas/Simulados.tsx:127 | rodapé | `Catálogo com {CATALOGO.length} vestibulares de todo o Brasil em ` + `Provas e faculdades` | manter | Número real (catálogo). | |
| T489 | telas/Simulados.tsx:139 | histórico | `{data} · {acertos} de {total} · {tempo}` | manter | | |
| T490 | telas/Simulados.tsx:144 | histórico vazio | `Nenhum simulado feito ainda` / `Seus resultados ficam aqui, com o desempenho por matéria.` | manter | | |
| T491 | telas/Simulados.tsx:169 | aria-label | `Matéria` | manter | | |
| T492 | telas/Simulados.tsx:183 | botão | `Desmarcar o tema` / `Marcar o tema` | manter | | |
| T493 | telas/Simulados.tsx:190 | conteúdo | `plural(n, 'questão', 'questões')` | manter | | |
| T494 | telas/Simulados.tsx:198 | aria-label | `Montar simulado` | manter | | |
| T495 | telas/Simulados.tsx:199 | rótulo | `Questões` | manter | | |
| T496 | telas/Simulados.tsx:202 | resumo | `{n conteúdos} · {n questões}` / `Marque um ou mais conteúdos` | manter | | |
| T497 | telas/Simulados.tsx:203 | botão | `Montar simulado` | manter | | |
| T498 | dados/provas.ts:98-102 | motivos "Em preparação" | `Formato de certo ou errado: o simulado está sendo adaptado para esse tipo de item.` · `Questões de somatória: o simulado está sendo adaptado para esse tipo de resposta.` · `As provas estão sendo conferidas questão por questão e entram em breve.` | manter os dois primeiros · terceiro: `As provas estão sendo conferidas questão por questão.` | "Em breve" é promessa sem data. | |

## 22. Simulado: configuração e execução (telas/SimuladoExec.tsx)

| # | arquivo:linha | onde aparece | texto atual | texto novo | por quê | veredito |
|---|---|---|---|---|---|---|
| T499 | telas/SimuladoExec.tsx:36,183 | título da aba | `Simulado` | manter | | |
| T500 | telas/SimuladoExec.tsx:38 | não encontrado | `Simulado não encontrado` / `Os simulados são as provas completas. Escolha uma na lista.` / `Ver simulados` | manter | | |
| T501 | telas/SimuladoExec.tsx:42-43 | sem questões | `Sem questões disponíveis para este simulado.` / `Outros simulados` | manter | | |
| T502 | telas/SimuladoExec.tsx:67 | migalhas | `Simulados` | manter | | |
| T503 | telas/SimuladoExec.tsx:70 | linha | `Questões` | manter | | |
| T504 | telas/SimuladoExec.tsx:73 | grupo | `Correção` | manter | | |
| T505 | telas/SimuladoExec.tsx:74 | opção | `Como na prova` / `Folha de respostas, pode pular e voltar; resultado e resoluções no fim.` | manter | | |
| T506 | telas/SimuladoExec.tsx:75 | opção | `Resolução após cada resposta` / `Responde, vê a resolução comentada e segue.` | manter | | |
| T507 | telas/SimuladoExec.tsx:78 | cronômetro | `Cronometrado` / `{tempo} no total ({x} min por questão). Dá para pausar.` | manter | | |
| T508 | telas/SimuladoExec.tsx:79 | botão | `Começar simulado` | manter | | |
| T509 | telas/SimuladoExec.tsx:80 | outro em andamento | `Você tem um simulado em andamento ({titulo}). ` + `Retome` + ` ou encerre-o antes de começar outro.` | `Você tem um simulado em andamento ({titulo}). ` + `Retome` + ` ou entregue-o antes de começar outro.` | O botão real é "Entregar"; não existe "encerrar". | |
| T510 | telas/SimuladoExec.tsx:104 | título da aba | `Simulado por conteúdo` | manter | | |
| T511 | telas/SimuladoExec.tsx:105 | sem conteúdos | `Escolha os conteúdos` / `Monte o simulado escolhendo a matéria e os conteúdos.` / `Simulado por conteúdo` | manter | | |
| T512 | telas/SimuladoExec.tsx:111-113 | conteúdo inexistente | `Conteúdo não encontrado` / `Este endereço não corresponde a nenhum conteúdo. Escolha a matéria e os conteúdos de novo.` / `Simulado por conteúdo` | manter | | |
| T513 | telas/SimuladoExec.tsx:118 | faltaram questões | `Você pediu ${n} questões; estes conteúdos têm ${k} ${região}. Para ter mais, escolha mais conteúdos ou “Todas as regiões” no filtro.` / `… por enquanto. Para ter mais, escolha mais conteúdos.` | manter | Claro e com saída. | |
| T514 | telas/SimuladoExec.tsx:123-124 | sem questões | `Ainda não há questões de prova nestes conteúdos.` / `Escolher outros conteúdos` | manter | | |
| T515 | telas/SimuladoExec.tsx:251 | sem simulado | `Nenhum simulado em andamento` / `Escolher um simulado` | manter | | |
| T516 | telas/SimuladoExec.tsx:260 | sair (aria/title/rótulo) | `Sair (o simulado fica salvo)` / `Sair (fica salvo)` / `Sair` | manter | | |
| T517 | telas/SimuladoExec.tsx:264 | barra | `Questão {i} de {n} · {r} respondidas` / `resp.` | manter | | |
| T518 | telas/SimuladoExec.tsx:268 | botão | `Folha de respostas` | manter | | |
| T519 | telas/SimuladoExec.tsx:269 | cronômetro (aria/title) | `Pausar simulado` / `Pausar (P)` | manter | | |
| T520 | telas/SimuladoExec.tsx:272 | botão | `Entregar` | manter | | |
| T521 | telas/SimuladoExec.tsx:279 | pausa, título | `Simulado pausado` | manter | | |
| T522 | telas/SimuladoExec.tsx:280 | pausa, texto | `Restam {tempo}.` / `{tempo} usados.` + ` As questões ficam escondidas até você voltar.` | manter | | |
| T523 | telas/SimuladoExec.tsx:281 | botão | `Continuar` | manter | | |
| T524 | telas/SimuladoExec.tsx:288 | marcador (aria/title) | `Revisar depois` / `Marcada para revisar` | manter | | |
| T525 | telas/SimuladoExec.tsx:292 | botão | `Apagar resposta` | manter | | |
| T526 | telas/SimuladoExec.tsx:294 | botão | `Confirmar e ver resolução` | manter | | |
| T527 | telas/SimuladoExec.tsx:297 | anterior (aria/title) | `Questão anterior` / `Anterior` | manter | | |
| T528 | telas/SimuladoExec.tsx:298 | botões | `Próxima` / `Entregar simulado` | manter | | |
| T529 | telas/SimuladoExec.tsx:303-304 | painel | `Folha de respostas` | manter | | |
| T530 | telas/SimuladoExec.tsx:311 | bolha (aria) | `Questão ${i}, marcada ${letra}` / `, em branco` / `, para revisar` | manter | | |
| T531 | telas/SimuladoExec.tsx:316 | legenda | `respondida` · `para revisar` | manter | | |
| T532 | telas/SimuladoExec.tsx:328 | confirmação, título | `Entregar o simulado?` | manter | | |
| T533 | telas/SimuladoExec.tsx:330 | confirmação, texto | `Todas as questões estão respondidas.` / `{n questão está/questões estão} em branco e conta(m) como erro.` + ` Você marcou {n} para revisar.` | manter | | |
| T534 | telas/SimuladoExec.tsx:332 | botão | `Voltar à prova` | manter | | |
| T535 | telas/SimuladoExec.tsx:333 | botão | `Entregar e ver resultado` | manter | | |
| T536 | logica/simulados.ts:29 | descrição (prova) | `Prova completa, na ordem original, com todas as matérias. Gabarito oficial.` | `Prova completa, na ordem original, com todas as matérias.` | Neutro: há manifestos de prova com gabarito preliminar em fabrica_saida/ingestao e o índice não diz a origem por prova (dúvida 2); a origem do gabarito continua visível em cada questão. | |
| T537 | logica/simulados.ts:70 | título (por conteúdo) | `Simulado de ${nome}` / `Simulado de ${matéria}: ${n} conteúdos` | manter | | |
| T538 | logica/simulados.ts:71 | descrição (por conteúdo) | `Questões reais de prova deste conteúdo / dos conteúdos escolhidos, da mais fácil à mais difícil. Só questões com gabarito publicado (oficial ou de resolução reconhecida).` | manter | Verdadeiro (entraNoSimuladoConteudo). | |

## 23. Resultado do simulado (telas/SimuladoResultado.tsx)

| # | arquivo:linha | onde aparece | texto atual | texto novo | por quê | veredito |
|---|---|---|---|---|---|---|
| T539 | telas/SimuladoResultado.tsx:22 | título da aba | `Resultado do simulado` | manter | | |
| T540 | telas/SimuladoResultado.tsx:30 | não encontrado | `Resultado não encontrado` / `Este simulado não está no seu histórico neste aparelho. Os que você entregou ficam na aba Histórico.` / `Ver o histórico` | `Resultado não encontrado` / `Este simulado não está no seu histórico. Os que você entregou ficam na aba Histórico.` / manter | Com conta, o histórico não é só "deste aparelho". | |
| T541 | telas/SimuladoResultado.tsx:37 | migalhas | `Simulados` / `Resultado` | manter | | |
| T542 | telas/SimuladoResultado.tsx:42 | placar | `{a} de {t} certas · {tempo} · {data}` | manter | | |
| T543 | telas/SimuladoResultado.tsx:43 | nota (prova completa) | `Toque em uma questão para ver o print e o gabarito oficial. A resolução comentada entra depois da revisão.` | `Toque numa questão para ver o print e o gabarito. A resolução comentada entra quando for revisada pela banca do Aprendice.` | Neutro quanto à origem do gabarito (dúvida 2); "depois da revisão" confundia com a Revisão do aluno. | |
| T544 | telas/SimuladoResultado.tsx:43 | nota (banco) | `Os erros e as questões em branco já entraram na revisão espaçada.` | `Os erros e as questões em branco voltam amanhã na revisão.` | Dá a data. | |
| T545 | telas/SimuladoResultado.tsx:47 | seção | `Por conteúdo` / `Por área da prova` / `Por matéria` | manter | | |
| T905 | telas/SimuladoResultado.tsx:54 | por área/matéria | `{p.acertos} de {p.total}` | manter | | |
| T546 | telas/SimuladoResultado.tsx:60 | seção | `Questões` | manter | | |
| T547 | telas/SimuladoResultado.tsx:61 | chips | `Todas` · `Só erros ({n})` | manter | | |
| T548 | telas/SimuladoResultado.tsx:66 | bolha (aria) | `Questão ${n}: certa` / `errada, marcou ${l}` / `em branco` | manter | | |
| T549 | telas/SimuladoResultado.tsx:78 | botões | `Ir para a revisão` / `Outro simulado` | manter | | |

## 24. Revisão: tela principal (telas/Revisao.tsx)

| # | arquivo:linha | onde aparece | texto atual | texto novo | por quê | veredito |
|---|---|---|---|---|---|---|
| T550 | telas/Revisao.tsx:20,81 | título | `Revisão` | manter | | |
| T551 | telas/Revisao.tsx:82 | subtítulo (Conteúdos) | `Cada conteúdo revisado em slides volta no dia marcado no fim da revisão: amanhã quando algo não firmou, mais tarde quando firmou.` | manter | | |
| T552 | telas/Revisao.tsx:84 | subtítulo (Revisão geral) | `A matéria inteira em tópicos curtos, com busca: o essencial, a pegadinha da banca e a imagem de cada tópico. Filosofia e Sociologia em duas listas.` | manter | | |
| T553 | telas/Revisao.tsx:86 | subtítulo (Domínio) | `O que você domina, está aprendendo ou esqueceu, pelos acertos em dias diferentes, cada um na data marcada.` | manter | | |
| T554 | telas/Revisao.tsx:87 | subtítulo (Questões) | `Errou, chutou ou pediu pista: a questão volta no dia certo. Sai da revisão depois de ${SAIDA} acertos em dias diferentes, cada um na data marcada.` | `Errou, chutou ou usou a dica: a questão volta no dia certo. Sai da revisão depois de ${SAIDA} acertos em dias diferentes, cada um na data marcada.` | Um nome só: "dica" (botão da questão). | |
| T555 | telas/Revisao.tsx:88 | botão | `O que estudar hoje` | manter | | |
| T556 | telas/Revisao.tsx:65 | destaque, título (no celular vai para o pé da tela) | `Revisão geral` | manter | | |
| T557 | telas/Revisao.tsx:66 | destaque, texto | `Todo o conteúdo de cada matéria em tópicos curtos, com o essencial, a pegadinha da banca e busca. É o que você precisa saber para responder as questões das provas.` | `Todo o conteúdo de cada matéria em tópicos curtos: o essencial, a pegadinha da banca e busca. A base para responder as questões das provas.` | Mais curto; "precisa saber" soava absoluto. | |
| T558 | telas/Revisao.tsx:69 | botão | `Abrir a revisão geral` | manter | | |
| T559 | telas/Revisao.tsx:71 | aria-label | `Revisão geral por matéria` | manter | | |
| T560 | telas/Revisao.tsx:90 | aria-label | `Seções` | `Seções da revisão` | Contexto. | |
| T561 | telas/Revisao.tsx:91-96 | abas | `Questões` · `Flashcards` · `Marcadas` · `Conteúdos` · `Domínio` · `Revisão geral` | manter | | |
| T562 | telas/Revisao.tsx:108 | aviso de região | `{n questões} de fora {região} também vence(m) hoje.` | `{n questões} de fora {região} também volta(m) hoje.` | Mesmo verbo do resto. | |
| T563 | telas/Revisao.tsx:109 | botão | `Ver de outras regiões` | manter | | |
| T564 | telas/Revisao.tsx:113 | vazio | `Nada para revisar hoje` / `Quando você errar, chutar ou usar uma pista, a questão aparece aqui no dia certo.` / `Voltar ao início` | `Nada para revisar hoje` / `Quando você errar, chutar ou usar a dica, a questão aparece aqui no dia certo.` / manter | "Dica". | |
| T565 | telas/Revisao.tsx:119 | botão | `Revisar ${venc.length}` | manter | | |
| T566 | telas/Revisao.tsx:124 | etiqueta | `Errou com certeza` / `${etapa} de ${SAIDA} acertos` / `Vencida` | `Errou com certeza` / manter / `Volta hoje` | "Vencida" soa como atraso. | |
| T567 | telas/Revisao.tsx:125 | linha | `{escola} {ano} · questão {n}` | manter | | |
| T568 | telas/Revisao.tsx:130 | mais | `e mais {n}` | manter | | |
| T569 | telas/Revisao.tsx:131 | próximos dias | `Próximos 7 dias: {n questões}` | manter | | |
| T570 | telas/Revisao.tsx:146 | flashcards | `{n cartão/cartões para hoje}` / `Nada vencido` + ` · {n} novos` | `{n cartão/cartões para hoje}` / `Nada para hoje` + ` · {n} novos` | Sem "vencido". | |
| T571 | telas/Revisao.tsx:155 | conteúdos vazio | `Nenhum conteúdo para rever hoje` / `A revisão em slides de cada conteúdo (na tela do tema) marca o dia em que ele volta. Quando chegar o dia, ele aparece aqui.` | manter | | |
| T572 | telas/Revisao.tsx:161 | conteúdo | `{matéria} · revisão em slides · continuar / para hoje` | manter | | |
| T573 | telas/Revisao.tsx:169 | marcadas vazio | `Nenhuma questão marcada` / `Use o marcador na tela da questão para guardar as que você quer rever.` | manter | | |
| T574 | telas/Revisao.tsx:177 | marcada | `{matéria} · {conceito} · revisão {emDias}` | `{matéria} · {conceito} · volta {emDias}` | Mesmo verbo. | |

## 25. Agenda da revisão (ui/revisao/AgendaRevisao.tsx)

| # | arquivo:linha | onde aparece | texto atual | texto novo | por quê | veredito |
|---|---|---|---|---|---|---|
| T575 | ui/revisao/AgendaRevisao.tsx:41 | título | `{prova} em {data}` / `Sua agenda de revisão` | manter | | |
| T576 | ui/revisao/AgendaRevisao.tsx:43 | texto com data | `Faltam {n dias}. Cada questão volta a tempo de você chegar firme na prova: hoje, no máximo {n dias} entre uma revisão e outra, e o intervalo encurta conforme a prova se aproxima. Nada fica marcado para depois da véspera.` | manter | Verdadeiro (fracaoIdeal, intervalo). | |
| T577 | ui/revisao/AgendaRevisao.tsx:44 | texto sem data | `Sem data de prova, a questão volta em 1, 3 e 7 dias. Informe a data das suas provas-alvo e a agenda passa a contar a partir da prova.` | manter | | |
| T578 | ui/revisao/AgendaRevisao.tsx:46 | botão | `Trocar a data` / `Informar a data da prova` | `Trocar a data` / `Informar a data` | Botão ≤3 palavras; o contexto já diz "prova". | |
| T579 | ui/revisao/AgendaRevisao.tsx:48 | gráfico (aria) | `Questões que voltam nos próximos 14 dias: ${total}. …` | manter | | |
| T580 | ui/revisao/AgendaRevisao.tsx:56 | coluna | `Hoje` / `Prova` / dia da semana | manter | | |
| T581 | ui/revisao/AgendaRevisao.tsx:64 | legenda | `{n questão volta / questões voltam} nos próximos {n} dias{, contando a de hoje / as de hoje / {n} de hoje}.` / `Nenhuma questão marcada para os próximos {n} dias.` | manter | | |

## 26. Painel de domínio (ui/revisao/PainelDominio.tsx)

| # | arquivo:linha | onde aparece | texto atual | texto novo | por quê | veredito |
|---|---|---|---|---|---|---|
| T582 | ui/revisao/PainelDominio.tsx:10-12 | estados | `Domina` · `Aprendendo` · `Esqueceu` | manter | | |
| T583 | ui/revisao/PainelDominio.tsx:21 | barra (aria) | `${n} domina, ${n} aprendendo, ${n} esqueceu, ${n} ainda não feitas` | manter | | |
| T584 | ui/revisao/PainelDominio.tsx:42 | vazio | `Ainda sem questões respondidas` / `O painel mostra o que você domina, está aprendendo ou esqueceu assim que você começa a responder.` | manter | | |
| T585 | ui/revisao/PainelDominio.tsx:49 | aria-label | `Resumo do domínio` | manter | | |
| T586 | ui/revisao/PainelDominio.tsx:54 | previsão | `No dia da prova` | manter | | |
| T587 | ui/revisao/PainelDominio.tsx:58 | explicação | `A barra mostra as {n} questões que você já fez. Domina: {SAIDA} acertos em dias diferentes, cada um na data marcada, e a lembrança ainda firme. Aprendendo: errou da primeira vez ou ainda não completou os {SAIDA} acertos. Esqueceu: errou depois de já ter acertado, ou passou tanto tempo da data que a lembrança provavelmente caiu.` | manter | Preciso. | |
| T588 | ui/revisao/PainelDominio.tsx:59 | previsão, explicação | `No dia da prova: quanto você deve lembrar das questões que já fez no dia da prova ({prova}), se fizer as revisões marcadas.` | `No dia da prova: estimativa de quanto você lembra, no dia da prova ({prova}), das questões que já fez, se fizer as revisões marcadas.` | "Estimativa" deixa claro que é previsão, não promessa; tira a repetição. | |
| T589 | ui/revisao/PainelDominio.tsx:70 | previsão | `{p}% no dia da prova` | manter | | |
| T590 | ui/revisao/PainelDominio.tsx:86 | conteúdo | `ainda não feito` | manter | | |

## 27. Revisão em slides (telas/RevisaoSlides.tsx; logica/cicloRevisao.ts)

| # | arquivo:linha | onde aparece | texto atual | texto novo | por quê | veredito |
|---|---|---|---|---|---|---|
| T591 | telas/RevisaoSlides.tsx:50 | título da aba | `Revisão · ${cap(nomeSub)}` | manter | | |
| T592 | telas/RevisaoSlides.tsx:93-95 | em preparação | `Revisão em preparação` / `A revisão em slides deste conteúdo ainda está passando pelas lentes da banca.` / `Voltar ao tema` | `Revisão em preparação` / `A revisão em slides deste conteúdo ainda está em revisão pela banca do Aprendice.` / manter | "Lentes" é jargão. | |
| T593 | telas/RevisaoSlides.tsx:133 | voltar | `Voltar` / `Voltar (Esc)` | manter | | |
| T594 | telas/RevisaoSlides.tsx:136 | barra | `Revisão` | manter | | |
| T595 | logica/cicloRevisao.ts:19 + RevisaoSlides.tsx:168 | 5 tempos | `Pergunta primeiro` · `Ver acontecer` (`Rever os pontos` sem animação) · `Lembrar sem olhar` · `Aplicar` · `Voltar` | manter | Nomes do Método. | |
| T596 | telas/RevisaoSlides.tsx:167 | aria-label | `Os 5 tempos da revisão` | manter | | |
| T597 | telas/RevisaoSlides.tsx:186 | capa, passo 1 | `Questões reais deste conteúdo, antes de qualquer explicação. Marque a sua certeza.` / `Quando houver questões deste conteúdo, a revisão começa por elas.` | manter | | |
| T598 | telas/RevisaoSlides.tsx:188-189 | capa, passo 2 | `{n slides animados}. Nos de conceito e de fórmula, você tenta lembrar antes de ver.` / `{n slides}. Nos de conceito, você tenta lembrar a frase-chave antes de ver.` | manter | | |
| T599 | telas/RevisaoSlides.tsx:190 | capa, passo 3 | `As 3 linhas para levar viram 3 lacunas para completar de memória.` / `As frases-chave para completar de memória.` | manter | | |
| T600 | telas/RevisaoSlides.tsx:191 | capa, passo 4 | `Questões novas do mesmo conteúdo, diferentes das do começo.` | manter | | |
| T601 | telas/RevisaoSlides.tsx:192 | capa, passo 5 | `O site marca o dia em que este conteúdo volta.` | manter | | |
| T602 | telas/RevisaoSlides.tsx:196 | capa, rótulo | `Revisão em slides · {matéria} · {tema}` | manter | | |
| T603 | telas/RevisaoSlides.tsx:203-204 | última revisão | `Última revisão: {data} · pergunta {a} de {b} · lembrou {a} de {b} · aplicação {a} de {b} · volta {emDias}` | manter | | |
| T604 | telas/RevisaoSlides.tsx:208 | botão | `Revisar de novo` / `Começar a revisão` | manter | | |
| T605 | telas/RevisaoSlides.tsx:209 | duração | `{n slides} · cerca de {min} min` | manter | | |
| T606 | telas/RevisaoSlides.tsx:260 | sem questões, título | `Sem questões para começar` / `Sem questão nova agora` | manter | | |
| T607 | telas/RevisaoSlides.tsx:261 | sem questões, texto | `Este conteúdo ainda não tem questões de prova no site. A revisão segue pelos slides.` / `As questões deste conteúdo já apareceram no começo. Aplique na próxima revisão.` | manter / `As questões deste conteúdo já apareceram no começo. Na próxima revisão entram outras.` | "Aplique na próxima" soa como ordem sem meio; diz o que acontece. | |
| T608 | telas/RevisaoSlides.tsx:262 | botão | `Continuar` | manter | | |
| T609 | telas/RevisaoSlides.tsx:270 | fase, título | `Antes de rever, tente responder` / `Agora aplique numa questão nova` | manter | | |
| T610 | telas/RevisaoSlides.tsx:272-273 | fase, texto | `Ainda sem explicação: o esforço de tentar prepara o que vem depois. Marque também a sua certeza.` / `Questão real diferente das do começo, do mesmo conteúdo. Depois de responder, a correção aparece aqui embaixo.` | manter | | |
| T611 | telas/RevisaoSlides.tsx:274 | contagem | ` Questão {i} de {n}.` | manter | | |
| T612 | telas/RevisaoSlides.tsx:285 | botão | `Confirmar resposta` | manter | | |
| T613 | telas/RevisaoSlides.tsx:288 | botão | `Ver os slides` / `Concluir` / `Próxima questão` | manter | | |
| T614 | telas/RevisaoSlides.tsx:296 | veredito | `Você acertou` / `Você marcou ${letra}. A resposta é ${gab}.` | manter | | |
| T615 | telas/RevisaoSlides.tsx:298 | acertou | `Acertou no chute: para o site, ainda não é sabido. Os slides mostram o porquê.` / `Os slides vão mostrar o porquê, passo a passo.` | `Acertou no chute: ainda não conta como sabido. Os slides mostram o porquê.` / manter | "Para o site" é distante; mesmo fato. | |
| T616 | telas/RevisaoSlides.tsx:299 | errou | `Errou com certeza: este é o erro que mais vale corrigir. Os slides marcados mostram onde.` / `Os slides a seguir mostram o que faltou. No fim, a questão fica na lista para você rever.` | manter | | |
| T617 | telas/RevisaoSlides.tsx:303 | aria-label | `Correção` | manter | | |
| T618 | telas/RevisaoSlides.tsx:337 | marca no slide | `É aqui que você errou na pergunta inicial` | manter | | |
| T619 | telas/RevisaoSlides.tsx:357 | aria-label | `Slides` | manter | | |
| T620 | telas/RevisaoSlides.tsx:358 | botão | `Anterior` | manter | | |
| T621 | telas/RevisaoSlides.tsx:362 | botão | `Próximo` / `Lembrar sem olhar` / `Aplicar` | manter | | |
| T622 | telas/RevisaoSlides.tsx:379 | etiqueta | `Lembrar sem olhar` + `{n} de {m}` | manter | | |
| T623 | telas/RevisaoSlides.tsx:380 | título padrão | `Para levar` | manter | | |
| T624 | telas/RevisaoSlides.tsx:381 | instrução | `Complete de memória as {n} linhas para levar. Escreva com as suas palavras; depois confira e diga como foi.` | manter | | |
| T625 | telas/RevisaoSlides.tsx:392 | botão | `Aplicar numa questão nova` / `Concluir` | manter | | |
| T626 | telas/RevisaoSlides.tsx:411 | fim, rótulo | `Revisão concluída · {n minutos}` | manter | | |
| T627 | telas/RevisaoSlides.tsx:412 | fim, título | `Conteúdo firme por enquanto` / `Este conteúdo volta logo` | manter | | |
| T628 | telas/RevisaoSlides.tsx:414-416 | fim, números | `Pergunta primeiro` · `Lembrou sem olhar{ · n quase}` · `Aplicação` | manter | | |
| T629 | telas/RevisaoSlides.tsx:418 | fim, volta | `Volta {emDias} ({data}). Acertou a aplicação e lembrou do essencial: o intervalo cresce.` / `Algo não firmou (aplicação, certeza errada ou lacunas): volta cedo para fixar.` | manter | | |
| T630 | telas/RevisaoSlides.tsx:421 | fim, seção | `Questões que você errou` | manter | | |
| T631 | telas/RevisaoSlides.tsx:424 | fim, linha | `Gabarito do Aprendice` / `Gabarito oficial` + ` e resolução comentada` / `: {gab} · resolução comentada em preparação` | manter | | |
| T632 | telas/RevisaoSlides.tsx:428 | fim, nota | `Elas também entram na sua revisão espaçada de questões.` | `Elas também voltam na revisão de questões, a partir de amanhã.` | Dá a data. | |
| T633 | telas/RevisaoSlides.tsx:432-433 | botões | `Outros conteúdos do tema` / `Revisar de novo` | manter | | |
| T634 | telas/RevisaoSlides.tsx:438 | seção | `Resumo para levar` | manter | | |
| T635 | telas/RevisaoSlides.tsx:458 | sem resolução | `A resolução comentada desta questão está em preparação: ela só entra no site depois de passar pela banca da matéria. Os slides deste conteúdo explicam a ideia que a questão cobra.` | manter | Já sem jargão. | |

## 28. Slide da revisão (ui/revisao/SlideRevisao.tsx e peças)

| # | arquivo:linha | onde aparece | texto atual | texto novo | por quê | veredito |
|---|---|---|---|---|---|---|
| T636 | ui/revisao/SlideRevisao.tsx:17-18 | tipos de slide | `Abertura` · `Conceito` · `Fórmula` · `Gráfico` · `Exemplo` · `Pegadinha` · `Como cai na prova` · `Para levar` | manter | | |
| T637 | ui/revisao/SlideRevisao.tsx:75 | posição | `{pos} de {total}` | manter | | |
| T638 | ui/revisao/SlideRevisao.tsx:89 | lembrou | `Você lembrou.` / `Quase: releia com atenção.` / `Esta volta na próxima revisão.` | manter | | |
| T639 | ui/revisao/SlideRevisao.tsx:112 | aria-label | `Resolução passo a passo` | manter | | |
| T640 | ui/revisao/SlideRevisao.tsx:113 | título | `Resolução` / `Resolução passo a passo` | manter | | |
| T641 | ui/revisao/SlideRevisao.tsx:123 | botão | `Próximo passo` | manter | | |
| T642 | ui/revisao/SlideRevisao.tsx:124 | link | `Ver do começo` | manter | | |
| T643 | ui/revisao/SlideRevisao.tsx:136 | pergunta | `Antes de ver: qual é a ideia certa?` / `Antes de ver: qual é a fórmula?` | manter | | |
| T644 | ui/revisao/SlideRevisao.tsx:140 | opção (aria) | `Opção ${i + 1}` | manter | | |
| T645 | ui/revisao/SlideRevisao.tsx:146,206 | link | `Não lembro: mostrar` | manter | | |
| T646 | ui/revisao/SlideRevisao.tsx:147 | botão | `Isso. Ver o slide` / `Ver a resposta certa` / `Ver a fórmula certa` | manter | | |
| T647 | ui/revisao/SlideRevisao.tsx:156 | pergunta | `Antes de ver: complete a frase-chave` | manter | | |
| T648 | ui/revisao/SlideRevisao.tsx:162 | notas | `Não lembrei` · `Quase` · `Lembrei` | manter | | |
| T649 | ui/revisao/SlideRevisao.tsx:199 | placeholder | `complete de memória` | manter | | |
| T650 | ui/revisao/SlideRevisao.tsx:200 | campo (aria) | `Complete: ${pista}` | manter | | |
| T651 | ui/revisao/SlideRevisao.tsx:205 | botão | `Conferir` | manter | | |
| T652 | ui/revisao/SlideRevisao.tsx:210 | lacuna | `Você escreveu:` | manter | | |
| T653 | ui/revisao/SlideRevisao.tsx:211-212 | notas | `Como foi?` (aria `Como foi`) | manter | | |
| T654 | ui/revisao/FonteSlide.tsx:20 | fonte | `Fonte: ` | manter | | |
| T655 | ui/revisao/FonteSlide.tsx:23 | sanfona | `Fonte completa` / `Outras fontes` | manter | | |
| T656 | ui/revisao/FotoSlide.tsx:31 | aviso de imagem | `Antes da imagem:` | manter | | |
| T657 | ui/revisao/FotoSlide.tsx:32 | botão | `Ver a imagem` | manter | | |
| T658 | ui/revisao/FotoSlide.tsx:45-49 | crédito | `Pintura` · `Gravura` · `Mapa` · `Imagem` · `Foto` | manter | | |
| T659 | ui/revisao/FotoSlide.tsx:58 | aviso padrão | `imagem sensível` | manter | | |
| T660 | ui/revisao/FotoSlide.tsx:66 | origem padrão | `origem` | manter | | |
| T661 | ui/revisao/MapaMental.tsx:38 | aria-label | `Mapa mental: ${centro}` | manter | | |
| T662 | ui/revisao/MapaMental.tsx:56 | ligação | `liga com {…}` | manter | | |
| T663 | ui/revisao/ResumoSubtema.tsx:15 | aria-label | `Resumo: ${r.titulo}` | manter | | |
| T664 | ui/revisao/ResumoSubtema.tsx:21 | pegadinha | `Pegadinha` | manter | | |

## 29. Revisão essencial (telas/RevisaoEssencial.tsx)

| # | arquivo:linha | onde aparece | texto atual | texto novo | por quê | veredito |
|---|---|---|---|---|---|---|
| T665 | telas/RevisaoEssencial.tsx:34 | etiquetas | `O que mais cai` · `Mapa mental` · `Conteúdo` · `Questão Aprendice` · `Conexão` | manter | | |
| T666 | telas/RevisaoEssencial.tsx:47 | título da aba | `Revisão essencial · ${tema}` | manter | | |
| T667 | telas/RevisaoEssencial.tsx:72-74 | em preparação | `Revisão essencial em preparação` / `A revisão essencial deste tema ainda está passando pelas lentes da banca.` / `Voltar ao tema` | manter / `A revisão essencial deste tema ainda está em revisão pela banca do Aprendice.` / manter | "Lentes". | |
| T668 | telas/RevisaoEssencial.tsx:84 | voltar | `Voltar` / `Voltar (Esc)` | manter | | |
| T669 | telas/RevisaoEssencial.tsx:87 | barra | `Revisão essencial` | manter | | |
| T670 | telas/RevisaoEssencial.tsx:98 | posição | `{i} de {n}` | manter | | |
| T671 | telas/RevisaoEssencial.tsx:111 | título | `Conexão com outras matérias` | manter | | |
| T672 | telas/RevisaoEssencial.tsx:117 | aria-label | `Telas` | `Telas da revisão` | Contexto. | |
| T673 | telas/RevisaoEssencial.tsx:118,121,122 | botões | `Anterior` / `Próximo` / `Concluir` | manter | | |
| T674 | telas/RevisaoEssencial.tsx:128 | peso | `Cai muito` · `Cai às vezes` · `Cai pouco` | manter | | |
| T675 | telas/RevisaoEssencial.tsx:133 | título | `O que mais cai neste tema` | manter | | |
| T676 | telas/RevisaoEssencial.tsx:169 | pegadinha | `Pegadinha` | manter | | |
| T677 | telas/RevisaoEssencial.tsx:172 | sanfona | `Aprofundar este conteúdo` | manter | | |
| T678 | telas/RevisaoEssencial.tsx:173 | texto | `A revisão completa em slides, com as questões reais e o ciclo de 5 tempos.` | manter | | |
| T679 | telas/RevisaoEssencial.tsx:174 | botão | `{n slides} · abrir` | manter | | |
| T680 | telas/RevisaoEssencial.tsx:215 | título | `Questão resolvida` | `Questão Aprendice` | O princípio 1 pede a identificação "Questão Aprendice"; a etiqueta já diz, o título repetia outra coisa. (rec.) Alternativa: manter e confiar na etiqueta. | |
| T681 | telas/RevisaoEssencial.tsx:216 | apoio | `Questão nova, no estilo das provas, escrita para esta revisão.` | `Criada pelo Aprendice no estilo das provas. Não é questão de vestibular.` | Deixa explícito que não é questão de prova (princípio 1). | |
| T682 | telas/RevisaoEssencial.tsx:218 | aria-label | `Alternativas` | manter | | |
| T683 | telas/RevisaoEssencial.tsx:229 | botão | `Conferir` | manter | | |
| T684 | telas/RevisaoEssencial.tsx:230 | link | `Ver a resolução sem responder` | manter | | |
| T685 | telas/RevisaoEssencial.tsx:204 | resposta | `Alternativa ${l} — ${t}` / `Alternativa ${gab}` | manter | | |
| T686 | telas/RevisaoEssencial.tsx:235 | origem | `Questão Aprendice: gabarito da banca do Aprendice, conferido pela lente de fatos.` | `Questão Aprendice: gabarito da banca do Aprendice, conferido de forma independente.` | "Lente de fatos" é jargão; mantém o fato (confirmação independente). | |
| T687 | telas/RevisaoEssencial.tsx:250,255 | título | `Revisão essencial de {matéria}` | manter | | |
| T688 | telas/RevisaoEssencial.tsx:255 | subtítulo | `Por tema: o que mais cai, o mapa mental, uma tela por conteúdo, uma questão resolvida e a conexão com outras matérias.` | `Por tema: o que mais cai, o mapa mental, uma tela por conteúdo, uma Questão Aprendice e a conexão com outras matérias.` | Identificação da questão. | |
| T689 | telas/RevisaoEssencial.tsx:256 | vazio | `Em preparação` / `A revisão essencial chega tema a tema, depois de passar pelas lentes da banca.` | manter / `A revisão essencial chega tema a tema, depois de revisada pela banca do Aprendice.` | "Lentes". | |
| T690 | telas/RevisaoEssencial.tsx:261 | tema | `{n telas de conteúdo}, mapa mental e questão resolvida` | `{n telas de conteúdo}, mapa mental e Questão Aprendice` | Idem. | |

## 30. Revisão geral (telas/RevisaoGeral.tsx)

| # | arquivo:linha | onde aparece | texto atual | texto novo | por quê | veredito |
|---|---|---|---|---|---|---|
| T691 | telas/RevisaoGeral.tsx:20 | filtros | `Todos` · `Não lidos` · `Marcados` | manter | | |
| T692 | telas/RevisaoGeral.tsx:48 | título da aba | `Revisão geral · ${nome}` | manter | | |
| T693 | telas/RevisaoGeral.tsx:91 | não encontrada | `Matéria não encontrada` / `Ver matérias` | manter | | |
| T694 | telas/RevisaoGeral.tsx:117 | link | `Todos os temas` | manter | | |
| T695 | telas/RevisaoGeral.tsx:122 | título | `Revisão geral{ de Filosofia/Sociologia}` | manter | | |
| T696 | telas/RevisaoGeral.tsx:123 | apoio | `A matéria inteira em tópicos curtos, do simples ao complexo: o essencial de cada um, a pegadinha da banca e a imagem do tópico.` | manter | | |
| T697 | telas/RevisaoGeral.tsx:124 | progresso | `{lidos} de {n} tópico(s) lido(s) · {m} marcado(s) para rever` | manter | | |
| T698 | telas/RevisaoGeral.tsx:127 | aria-label | `Parte da revisão geral` | manter | | |
| T699 | telas/RevisaoGeral.tsx:136 | rótulo da busca | `Buscar na revisão geral de {nome}` | manter | | |
| T700 | telas/RevisaoGeral.tsx:142 | limpar (aria) | `Limpar a busca` | manter | | |
| T701 | telas/RevisaoGeral.tsx:144 | ajuda | `Pelo nome, pelo subtema ou pelo jeito que você lembra; acento e maiúscula não importam. Enter abre o primeiro resultado.` | `Pelo nome, pelo conteúdo ou do jeito que você lembra; acento e maiúscula não importam. Enter abre o primeiro resultado.` | "Conteúdo" é o termo do site para subtema; "do jeito" é a regência certa. | |
| T702 | telas/RevisaoGeral.tsx:150 | vazio | `Revisão geral em preparação` / `Os tópicos desta matéria ainda estão passando pelas lentes da banca.` | manter / `Os tópicos desta matéria ainda estão em revisão pela banca do Aprendice.` | "Lentes". | |
| T703 | telas/RevisaoGeral.tsx:154 | lista | `Resultado da busca` / `Tópicos por capítulo` + `{n tópicos}` | manter | | |
| T704 | telas/RevisaoGeral.tsx:155 | aria-label | `Mostrar` | `Mostrar tópicos` | Contexto. | |
| T705 | telas/RevisaoGeral.tsx:158 | status (leitor) | `{n tópico encontrado / tópicos encontrados}` / `Nenhum tópico encontrado` | manter | | |
| T706 | telas/RevisaoGeral.tsx:161 | vazio | `Nada encontrado para “{q}”.` / `Nenhum tópico marcado para rever.` / `Você já leu todos os tópicos.` | manter | | |
| T707 | telas/RevisaoGeral.tsx:162 | vazio, saída | `Tente uma parte da palavra ou outro nome do assunto.` / `Mude o filtro para ver os outros tópicos.` | manter | | |
| T708 | telas/RevisaoGeral.tsx:163 | botão | `Ver todos os tópicos` | manter | | |
| T709 | telas/RevisaoGeral.tsx:182-183 | estado | `Marcado para rever` / `marcado para rever` · `Lido` / `lido` | manter | | |
| T710 | telas/RevisaoGeral.tsx:199 | link | `Todos os tópicos` | manter | | |
| T711 | telas/RevisaoGeral.tsx:204 | aria-label | `Outros tópicos` | manter | | |
| T712 | telas/RevisaoGeral.tsx:205-206 | navegação | `Anterior` / `Próximo` | manter | | |
| T713 | telas/RevisaoGeral.tsx:226 | posição | `{pos} de {n}` | manter | | |
| T714 | telas/RevisaoGeral.tsx:230 | aria-label | `Subtemas deste tópico` | `Conteúdos deste tópico` | Vocabulário. | |
| T715 | telas/RevisaoGeral.tsx:235 | pegadinha | `Pegadinha` | manter | | |
| T716 | telas/RevisaoGeral.tsx:238 | botão | `Lido` / `Marcar como lido` | manter | | |
| T717 | telas/RevisaoGeral.tsx:239 | botão | `Marcado para rever` / `Marcar para rever` | manter | | |
| T718 | telas/RevisaoGeral.tsx:274 | atalho na matéria | `Revisão geral{ de …}` / `{n tópicos} · {n lidos}` / `, com busca` | manter | | |
| T719 | telas/RevisaoGeral.tsx:298 | cartão na Revisão | `{n tópicos} · {n lidos} · {n marcados}` | manter | | |

## 31. Desempenho (telas/Desempenho.tsx; logica/nivel.ts)

| # | arquivo:linha | onde aparece | texto atual | texto novo | por quê | veredito |
|---|---|---|---|---|---|---|
| T720 | telas/Desempenho.tsx:16,55,61 | título | `Desempenho` | manter | | |
| T721 | telas/Desempenho.tsx:56 | vazio | `Ainda sem respostas` / `Responda algumas questões para ver seu acerto por matéria, por tema e por prova.` / `Começar` | manter | | |
| T722 | telas/Desempenho.tsx:61 | subtítulo | `Onde você acerta, onde erra e como erra.` | manter | Curto e exato. | |
| T723 | telas/Desempenho.tsx:63 | número | `questões feitas` | manter | | |
| T724 | telas/Desempenho.tsx:64 | número | `de acerto nas tentativas` | manter | | |
| T725 | telas/Desempenho.tsx:65 | número | `por questão, em média` | manter | | |
| T726 | telas/Desempenho.tsx:66 | número | `de estudo no total · {n} questões nesta semana` | `de tempo registrado · {n} questões nesta semana` | `tempoTotal` usa o maior entre as sessões gravadas (só as vindas do protótipo) e a soma do tempo das respostas: "de estudo" promete mais do que mede. | |
| T727 | telas/Desempenho.tsx:70 | seção | `Por matéria` | manter | | |
| T728 | telas/Desempenho.tsx:75 | barra (aria) | `Acerto em ${matéria}` | manter | | |
| T729 | telas/Desempenho.tsx:77,91,103,114 | contagem | `feita` / `feitas` | manter | | |
| T730 | telas/Desempenho.tsx:85 | seção | `Temas de {matéria}` | manter | | |
| T731 | telas/Desempenho.tsx:97 | seção | `Por nível em {matéria}` | manter | | |
| T732 | telas/Desempenho.tsx:101 | barra (aria) | `Acerto no nível ${nome}` | manter | | |
| T733 | telas/Desempenho.tsx:110 | seção | `Onde você mais erra` | manter | | |
| T734 | telas/Desempenho.tsx:114 | linha | `{tema} · nível {nível} · {n feitas}` | manter | | |
| T735 | telas/Desempenho.tsx:121 | seção | `Como você erra` | manter | | |
| T736 | telas/Desempenho.tsx:123 | padrão | `erros com “tenho certeza”: o conceito está errado, não foi distração. Comece a revisão por eles.` | `erros com “tenho certeza”: provavelmente o conceito, não distração. A revisão traz esses primeiro.` | Não afirmar o que o site não sabe; e é verdade que vêm primeiro (questoesVencidas). | |
| T737 | telas/Desempenho.tsx:124 | padrão | `acertos no chute: não contam como sabidos e voltam na revisão.` | manter | | |
| T738 | telas/Desempenho.tsx:125 | padrão | `respostas com pista: também voltam na revisão.` | `respostas com dica: também voltam na revisão.` | "Dica". | |
| T739 | telas/Desempenho.tsx:130 | seção | `Para reforçar em {matéria}` | manter | | |
| T740 | telas/Desempenho.tsx:135 | seção | `Por prova` | manter | | |
| T741 | logica/nivel.ts:13-15 | níveis | `Básico` · `Intermediário` · `Avançado` | manter | Vocabulário fixo. | |
| T742 | logica/nivel.ts:73 | feedback | `Você vai bem no que já fez. Avance para o nível ${nível}.` | manter | | |
| T743 | logica/nivel.ts:74 | feedback | `Você vai bem em todos os níveis. Mantenha a revisão dos erros em dia.` | manter | | |
| T744 | logica/nivel.ts:79 | feedback | `Você domina a base, mas trava no ${nível} (${pct}% de acerto). Refaça as que errou desse nível antes de seguir.` | manter | | |
| T745 | logica/nivel.ts:80 | feedback | `Seu acerto no ${nível} está em ${pct}%. Leia a teoria e refaça os erros antes de subir de nível.` | manter | | |

## 32. Meu progresso da matéria (ui/ProgressoMateria.tsx)

| # | arquivo:linha | onde aparece | texto atual | texto novo | por quê | veredito |
|---|---|---|---|---|---|---|
| T746 | ui/ProgressoMateria.tsx:52-53 | título (e aria) | `Meu progresso` | manter | | |
| T747 | ui/ProgressoMateria.tsx:54 | total | `questão resolvida` / `questões resolvidas` | manter | | |
| T748 | ui/ProgressoMateria.tsx:10-12 | legenda | `Básico` · `Intermediário` · `Avançado` | manter | | |
| T749 | ui/ProgressoMateria.tsx:65-67 | números | `de acerto` · `nas questões` · `nesta semana` | manter | | |
| T750 | ui/ProgressoMateria.tsx:69 | gráfico (aria) | `Questões por dia nos últimos 14 dias: …` | manter | | |
| T751 | ui/ProgressoMateria.tsx:78 | legenda | `últimos 14 dias` | manter | | |

## 33. Filtro de região (ui/FiltroRegiao.tsx; logica/regiao.ts)

| # | arquivo:linha | onde aparece | texto atual | texto novo | por quê | veredito |
|---|---|---|---|---|---|---|
| T752 | ui/FiltroRegiao.tsx:51 | aria-label | `Questões de qual região` | manter | | |
| T753 | ui/FiltroRegiao.tsx:52-53 | chips | `Minha região` · `Todas as regiões` | manter | | |
| T754 | logica/regiao.ts:21-27 | chips de região | `Nacional` · `São Paulo` · `Sudeste` · `Sul` · `Nordeste` · `Norte` · `Centro-Oeste` (nomes longos: `Nacional (ENEM)`, `Sudeste (RJ, MG, ES)`) | manter | Nomes de região não mudam. | |
| T755 | ui/FiltroRegiao.tsx:60 | frase | `Minha região: {regiões}{, pelas suas provas-alvo}.` | manter | | |
| T756 | ui/FiltroRegiao.tsx:61 | sem região | `Escolha suas provas-alvo ou a sua região para praticar com as provas de onde você vai prestar.` | manter | | |
| T757 | ui/FiltroRegiao.tsx:62 | botão | `Fechar` / `Trocar` | manter | | |
| T758 | ui/FiltroRegiao.tsx:82 | aria-label | `Região das minhas provas` | manter | | |
| T759 | ui/FiltroRegiao.tsx:83 | título | `Onde você vai prestar a prova?` | manter | | |
| T760 | ui/FiltroRegiao.tsx:86 | chip | `Pelas provas-alvo{ (regiões)}` | manter | | |
| T761 | ui/FiltroRegiao.tsx:92 | nota | `Pode marcar mais de uma. As questões do ENEM entram sempre junto com a sua região.` | manter | | |
| T762 | ui/FiltroRegiao.tsx:108 | aviso (sem nenhuma) | `Ainda não há questões {região} {onde}. Mostrando as de todas as regiões.` | manter | | |
| T763 | ui/FiltroRegiao.tsx:109 | aviso (poucas) | `Poucas questões` / `Só {n} questão(ões)` + ` {região} {onde}.` + ` Nos conteúdos sem nenhuma, você pratica com as de outras regiões.` | manter | | |
| T764 | ui/FiltroRegiao.tsx:110 | botão | `Ver de outras regiões{ (n)}` | manter | | |
| T765 | logica/regiao.ts:120,131 | texto montado | `todas as regiões` / `de todas as regiões` | manter | | |

## 34. Provas e faculdades (telas/Provas.tsx)

| # | arquivo:linha | onde aparece | texto atual | texto novo | por quê | veredito |
|---|---|---|---|---|---|---|
| T766 | telas/Provas.tsx:18,36 | título | `Provas e faculdades` | manter | | |
| T767 | telas/Provas.tsx:36 | subtítulo | `{n} vestibulares de todas as regiões, com banca, formato e fonte. Escolha suas provas-alvo e o site prioriza por elas.` | manter | Número real do catálogo. | |
| T768 | telas/Provas.tsx:38 | busca | `Buscar` (oculto) / `Buscar faculdade, cidade, estado ou banca` | manter | | |
| T769 | telas/Provas.tsx:40-45 | chips | `Minha região` · `Todas as regiões` · regiões · `Públicas` · `Privadas` | manter | | |
| T770 | telas/Provas.tsx:54 | etiqueta | `Prova-alvo` | manter | | |
| T771 | telas/Provas.tsx:56 | linha | `banca {banca}` | manter | | |
| T772 | telas/Provas.tsx:58 | etiqueta | `Pública` / `Privada` / `Rede a verificar` | manter | | |
| T773 | telas/Provas.tsx:59 | etiqueta | `{n prova completa / provas completas}` / `{n} questões` / `questões em preparação` | manter | | |
| T774 | telas/Provas.tsx:66 | rodapé | `Dados do ciclo 2027 levantados de fontes oficiais (editais e sites das bancas) em 01/11/2026. Itens ainda não conferidos no edital aparecem marcados em cada prova.` | manter | | |
| T775 | telas/Provas.tsx:15 | ingresso | `Vestibular próprio` · `ENEM/Sisu` · `Nota do ENEM` · `Seriado` | manter | | |
| T776 | telas/Provas.tsx:75 | título da aba | `Prova` | manter | | |
| T777 | telas/Provas.tsx:78 | não encontrada | `Prova não encontrada` / `Catálogo` | `Prova não encontrada` / `Ver o catálogo` | Botão com verbo. | |
| T778 | telas/Provas.tsx:91 | migalhas | `Provas e faculdades` | manter | | |
| T779 | telas/Provas.tsx:94 | botão | `Prova-alvo` / `Adicionar às provas-alvo` | manter | | |
| T780 | telas/Provas.tsx:84-87 | ficha | `Banca` · `Rede` · `Ingresso` · `Fases` · `Questões objetivas` · `Discursivas` · `Duração` · `Dias de prova` · `Matérias` | manter | | |
| T781 | telas/Provas.tsx:102 | aviso | `Conferido no edital, exceto: ` / `Ainda a conferir no edital: ` + `formato da prova` | manter | | |
| T782 | telas/Provas.tsx:105 | fontes | `Fontes: ` | manter | | |
| T783 | telas/Provas.tsx:108 | seção | `Simulados desta prova` | manter | | |
| T784 | telas/Provas.tsx:114 | linha | `{n questões} · prova completa` | manter | | |
| T785 | telas/Provas.tsx:119 | sem simulado | `Os simulados desta prova entram quando a prova inteira, com todas as matérias, estiver no banco` + ` (provas anteriores na fonte oficial)` | `Os simulados desta prova entram quando a prova inteira estiver no site` + manter o link | "Banco" é bastidor. | |

## 35. Perfil (telas/Perfil.tsx)

| # | arquivo:linha | onde aparece | texto atual | texto novo | por quê | veredito |
|---|---|---|---|---|---|---|
| T786 | telas/Perfil.tsx:17 | título da aba | `Perfil` | manter | | |
| T787 | telas/Perfil.tsx:33 | sub (sem conta) | `Os dados ficam só neste aparelho` | manter | | |
| T788 | telas/Perfil.tsx:33 | sub (administrador) | `Administrador · o que é oculto para o aluno aparece com etiqueta` | manter | Só o dono vê. | |
| T789 | telas/Perfil.tsx:33 | sub (sincronizado) | `Progresso salvo na sua conta` | manter | | |
| T790 | telas/Perfil.tsx:33 | sub (pendente) | `Progresso salvo neste aparelho · envio para a conta quando houver internet` | `Progresso salvo neste aparelho · vai para a sua conta quando a internet voltar` | Mais natural. | |
| T791 | telas/Perfil.tsx:37 | seção | `Seus dados` | manter | | |
| T792 | telas/Perfil.tsx:39 | rótulo | `Nome` | manter | | |
| T793 | telas/Perfil.tsx:40 | rótulo | `E-mail` + title `O e-mail é o da sua conta` | manter | | |
| T794 | telas/Perfil.tsx:41 | botão | `Salvar` / `Salvo` | manter | | |
| T795 | telas/Perfil.tsx:46 | seção | `Provas-alvo` | manter | | |
| T796 | telas/Perfil.tsx:47 | texto | `O início, os simulados sugeridos e o simulado “Minhas provas-alvo” seguem esta lista.` | `A tela Hoje, a região das suas questões e o filtro “Minhas provas-alvo” dos simulados seguem esta lista.` | O Início não usa a lista; "Minhas provas-alvo" é filtro, não simulado; Hoje e região usam (conferido). | |
| T797 | telas/Perfil.tsx:54 | seção | `Região das minhas provas` | manter | | |
| T798 | telas/Perfil.tsx:56 | texto | `Você pratica com questões de {regiões}{, pelas suas provas-alvo}. Nas listas de questões, os chips trocam para outra região ou para todas.` | manter | | |
| T799 | telas/Perfil.tsx:57 | texto | `Sem provas-alvo nem região escolhida, você pratica com as questões de todas as regiões.` | manter | | |
| T800 | telas/Perfil.tsx:62 | seção | `Meta semanal` | manter | | |
| T801 | telas/Perfil.tsx:64 | chips | `{n} questões` | manter | | |
| T802 | telas/Perfil.tsx:69 | botão | `Configurações e meus dados` | manter | | |
| T803 | telas/Perfil.tsx:71 | botão | `Sair da conta` | manter | | |
| T804 | telas/Perfil.tsx:75 | nota (sem conta) | `Sair não apaga nada: o progresso, as provas-alvo, as datas e a meta continuam salvos neste aparelho e voltam quando você entrar de novo com o mesmo e-mail.` | manter | | |
| T805 | telas/Perfil.tsx:76 | nota (com conta) | `Sair não apaga nada: o progresso, as provas-alvo, as datas e a meta ficam guardados na sua conta e voltam quando você entrar de novo, neste ou em outro aparelho.` | manter | | |
| T806 | telas/Perfil.tsx:76 | link | `Privacidade` | manter | | |
| T891 | telas/Perfil.tsx:106 | seção | `Excluir minha conta` | manter | | |
| T892 | telas/Perfil.tsx:110 | texto (sem conta na nuvem) | `Apaga o perfil e todo o progresso guardados neste aparelho. Não dá para desfazer.` | manter | Diz o que some e que não volta, sem drama. | |
| T893 | telas/Perfil.tsx:111 | texto (com conta) | `Apaga a sua conta e todos os seus dados: e-mail, perfil de estudo e progresso. Não dá para desfazer.` | `Apaga a sua conta e todos os seus dados, na nuvem e neste aparelho: e-mail, perfil de estudo e progresso. Não dá para desfazer.` | Diz onde é apagado (excluir_minha_conta apaga progresso, perfil e o usuário do serviço de contas; excluirConta limpa o aparelho). | |
| T894 | telas/Perfil.tsx:112 | botão | `Excluir minha conta` | manter | | |
| T895 | telas/Perfil.tsx:116 | confirmação, título | `Excluir a conta para sempre?` | `Excluir sua conta?` | Pergunta direta; o "não tem volta" já está na frase seguinte, sem tom dramático. | |
| T896 | telas/Perfil.tsx:117 | confirmação (sem conta na nuvem) | `O perfil, as provas-alvo, as datas, a meta, todo o progresso e as cópias de segurança deste aparelho serão apagados.` | manter | | |
| T897 | telas/Perfil.tsx:118 | confirmação (com conta) | `A conta, o perfil, as provas-alvo, as datas, a meta e todo o progresso serão apagados da nuvem e deste aparelho. Para estudar de novo, será preciso criar outra conta.` | `A conta, o perfil, as provas-alvo, as datas, a meta e todo o progresso serão apagados da nuvem e deste aparelho. Para estudar de novo, será preciso criar outra conta. Se quiser guardar uma cópia, baixe o progresso em Configurações antes.` | Informação útil (Config tem "Baixar meu progresso"), sem tentar convencer a ficar. | |
| T898 | telas/Perfil.tsx:120 | rótulo da confirmação | `Para confirmar, escreva {PALAVRA}` (PALAVRA = `EXCLUIR`) | manter | A palavra em maiúsculas é o que se digita, não grito. | |
| T899 | telas/Perfil.tsx:125 | botão | `Cancelar` | manter | | |
| T900 | telas/Perfil.tsx:126 | botão | `Excluindo…` / `Excluir para sempre` | `Excluindo…` / `Excluir conta` | Botão de 2 palavras, mais curto e sem drama. | |
| T901 | telas/Perfil.tsx:123 | erro da exclusão | (mensagem de `traduzErro`, T89–T97) | manter | | |
| T807 | telas/Perfil.tsx:152 | seção | `Datas das provas` | manter | | |
| T808 | telas/Perfil.tsx:153 | texto | `A revisão conta a partir da sua próxima prova: quanto mais perto, mais curto o intervalo entre uma revisão e outra. Sem data, vale a escala de 1, 3 e 7 dias.` | manter | | |
| T809 | telas/Perfil.tsx:166 | sem provas | `Escolha suas provas-alvo acima para informar as datas.` | manter | | |
| T810 | telas/Perfil.tsx:167 | status | `A agenda conta a partir de {prova}, em {data}: faltam {n dias}.` | manter | | |

## 36. Configurações (telas/Config.tsx)

| # | arquivo:linha | onde aparece | texto atual | texto novo | por quê | veredito |
|---|---|---|---|---|---|---|
| T811 | telas/Config.tsx:17,46 | título | `Configurações` | manter | | |
| T812 | telas/Config.tsx:30 | aviso | `Arquivo de progresso baixado.` | manter | | |
| T813 | telas/Config.tsx:40 | aviso | `Progresso importado: ${q} questões e ${c} cartões, sem apagar nada do que já havia.` | manter | | |
| T814 | telas/Config.tsx:49 | seção | `Aparência` | manter | | |
| T815 | telas/Config.tsx:50 | aria-label | `Tema` | `Tema claro ou escuro` | Igual a T5. | |
| T816 | telas/Config.tsx:51 | chips | `Claro` · `Escuro` · `Igual ao aparelho` | manter | | |
| T817 | telas/Config.tsx:58 | seção | `Meus dados` | manter | | |
| T818 | telas/Config.tsx:59 | texto | `Seu progresso fica salvo neste aparelho.` / `Seu progresso fica salvo na sua conta e neste aparelho: funciona sem internet e é enviado quando a conexão volta.` + ` Baixe uma cópia de vez em quando ou traga o progresso de outro aparelho ou do protótipo antigo: a importação junta tudo e não apaga nada.` | manter | | |
| T819 | telas/Config.tsx:61 | botão | `Baixar meu progresso` | manter | | |
| T820 | telas/Config.tsx:62 | botão | `Importar progresso` | manter | | |
| T821 | telas/Config.tsx:65 | nota | `Aceita o arquivo do APRENDICE e os arquivos “Baixar meu progresso” do protótipo (uma matéria por arquivo).` + ` Progresso do protótipo trazido automaticamente deste navegador: {n} matéria(s).` | `Aceita o arquivo do Aprendice e os arquivos “Baixar meu progresso” do protótipo (uma matéria por arquivo).` + manter | "APRENDICE" em caixa alta destoa do nome no resto. | |
| T822 | telas/Config.tsx:67 | botão | `Zerar progresso` | manter | | |
| T823 | telas/Config.tsx:69 | confirmação | `Zerar todo o progresso?` + ` Uma cópia de segurança fica guardada neste aparelho, mas as estatísticas recomeçam do zero.` | sem conta: manter · com conta: ` As estatísticas recomeçam do zero, também na sua conta. Uma cópia de segurança fica guardada neste aparelho.` (precisa de condição no código) | Conferido: `zera()` guarda a cópia só no aparelho (`aprendice.v1.zerado.*`) e, com conta, o zero vai para a nuvem (docs/contas.md). | |
| T824 | telas/Config.tsx:70 | botões | `Cancelar` / `Zerar` | manter | | |
| T825 | telas/Config.tsx:70 | aviso | `Progresso zerado. A cópia de segurança ficou guardada.` | manter | | |
| T826 | telas/Config.tsx:77 | seção | `Correção dos flashcards` | manter | | |
| T827 | telas/Config.tsx:78 | texto | `Nesta versão, a “correção por IA” é simulada: quem corrige é o próprio aparelho, comparando ideias-chave e números pelo valor. Nada do que você escreve sai daqui. Na versão com servidor, a resposta vai para a IA sem nome nem e-mail.` | `Nesta versão, quem corrige é o próprio aparelho, comparando ideias-chave e números pelo valor. Nada do que você escreve sai daqui. Se um dia a correção usar IA, a resposta irá sem nome nem e-mail.` | Alinha com T454 (sem "IA simulada"); não promete versão futura como certa. | |
| T828 | telas/Config.tsx:82 | seção | `Atalhos de teclado` | manter | | |
| T829 | telas/Config.tsx:84-91 | atalhos | `escolher alternativa` · `riscar alternativa` · `confirmar / próxima` · `pista` · `pausar o cronômetro` · `flashcard: errei, quase, acertei` · `buscar` · `sair da questão ou fechar` | trocar só `pista` por `dica` | Tecla H não muda; o nome sim (botão "Dica"). | |
| T830 | telas/Config.tsx:96 | seção | `Privacidade` | manter | | |
| T831 | telas/Config.tsx:97 | texto | `Sem servidor nesta versão: nenhum dado pessoal é enviado a ninguém. Sem anúncios, sem rastreamento, fontes hospedadas no próprio site. Quando houver contas na nuvem, você poderá baixar e apagar seus dados a qualquer momento (LGPD).` | sem conta: manter · com conta: `Seu e-mail, perfil de estudo e progresso ficam na sua conta, e só você tem acesso. Sem anúncios, sem rastreamento, fontes hospedadas no próprio site. Detalhes em Privacidade.` (precisa de condição no código) | Com o login de verdade, "sem servidor" fica falso (estado/sessao.ts; telas/Privacidade.tsx). | |
| T832 | telas/Config.tsx:101 | seção | `Créditos e fontes` | manter | | |
| T833 | telas/Config.tsx:103 | crédito | `Questões: cadernos oficiais das provas; cada questão traz o link da fonte e a origem do gabarito: …` | manter | | |
| T834 | telas/Config.tsx:104-108 | créditos | `Ilustrações de flashcards: …` · `Logos de simulados: …` · `Ícones de interface: …` · `Catálogo de provas: …` | manter | | |
| T835 | telas/Config.tsx:109 | rodapé | `Aprendice · versão de demonstração: o progresso fica salvo neste aparelho` | sem conta: `Aprendice · progresso salvo neste aparelho` · com conta: `Aprendice · progresso salvo na sua conta e neste aparelho` (precisa de condição no código) | Falso com login de verdade; "demonstração" não descreve mais o site. | |
| T836 | estado/migracao.ts:122 | erro de importação | `O arquivo não é um JSON válido.` | `Este arquivo não é um progresso do Aprendice.` | "JSON" é termo técnico. | |
| T837 | estado/migracao.ts:124 | erro de importação | `Arquivo vazio ou em formato desconhecido.` | manter | | |
| T838 | estado/migracao.ts:154 | erro de importação | `Não reconheci de qual matéria é este arquivo.` | `Não foi possível saber de qual matéria é este arquivo.` | Sem primeira pessoa. | |
| T839 | estado/migracao.ts:165 | erro de importação | `Não encontrei progresso do APRENDICE neste arquivo.` | `Este arquivo não tem progresso do Aprendice.` | Sem primeira pessoa; nome com grafia do site. | |

## 37. Privacidade (telas/Privacidade.tsx)

| # | arquivo:linha | onde aparece | texto atual | texto novo | por quê | veredito |
|---|---|---|---|---|---|---|
| T840 | telas/Privacidade.tsx:12,18 | título | `Privacidade` | manter | | |
| T841 | telas/Privacidade.tsx:18 | subtítulo | `O que o Aprendice guarda e para quê` | manter | | |
| T842 | telas/Privacidade.tsx:21 | seção | `O que guardamos` | manter | | |
| T843 | telas/Privacidade.tsx:23 | item | `E-mail e senha, para você entrar na sua conta. A senha é guardada cifrada pelo serviço de contas; ninguém do Aprendice consegue lê-la.` | manter | | |
| T844 | telas/Privacidade.tsx:24 | item | `Perfil de estudo: o nome que você escolheu, as provas-alvo, as datas das provas e a meta de questões por semana.` | manter | | |
| T845 | telas/Privacidade.tsx:25 | item | `Progresso: as respostas que você deu (letra, acerto, tempo, certeza), a revisão espaçada, os flashcards, os simulados feitos e as preferências de estudo.` | manter | | |
| T846 | telas/Privacidade.tsx:30-31 | seção e texto | `Para quê` / `Só para o site funcionar para você: …` | manter | | |
| T847 | telas/Privacidade.tsx:35-36 | seção e texto | `Onde fica` / `Neste aparelho, para o site funcionar sem internet, e na nuvem, no serviço de contas Supabase (servidor em São Paulo). …` | manter | Conferido em docs/contas.md: projeto em São Paulo (`sa-east-1`). | |
| T848 | telas/Privacidade.tsx:41 | seção e texto | `Seus direitos` / `Você pode ver e corrigir o seu perfil em Perfil, baixar uma cópia do seu progresso em Configurações e excluir a sua conta, com todos os dados, em Perfil, no botão “Excluir minha conta”: a conta, o perfil e o progresso são apagados da nuvem e deste aparelho, sem volta. Os dados são tratados conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018).` | manter | Texto novo já verdadeiro (confere com a migração excluir_conta). | |
| T849 | telas/Privacidade.tsx:44 | botão | `Voltar` | manter | | |

## 38. Busca (telas/Busca.tsx; logica/busca.ts)

| # | arquivo:linha | onde aparece | texto atual | texto novo | por quê | veredito |
|---|---|---|---|---|---|---|
| T850 | telas/Busca.tsx:69 | aria-label | `Buscar` | manter | | |
| T851 | telas/Busca.tsx:72 | placeholder | `Buscar matérias, temas, conteúdos, flashcards e provas` | manter | | |
| T852 | telas/Busca.tsx:73 | campo (aria) | `O que você procura` | manter | | |
| T853 | telas/Busca.tsx:79 | fechar (aria) | `Fechar` | manter | | |
| T854 | telas/Busca.tsx:82 | vazio | `Nada encontrado para “{t}”.` | `Nada encontrado para “{t}”. Tente parte da palavra.` | Dá saída. | |
| T855 | telas/Busca.tsx:36-51 + logica/busca.ts:22 | grupos | `Matérias` · `Temas` · `Conteúdos` · `Cartões` · `Simulados` · `Provas e faculdades` | trocar só `Cartões` por `Flashcards` | Vocabulário fixo. Atenção: `Cartões` também é chave em logica/busca.ts:22,34 e no ícone de Busca.tsx:89; trocar nos três. | |
| T856 | telas/Busca.tsx:36 | detalhe | `Em preparação` | manter | | |
| T857 | telas/Busca.tsx:44-45 | detalhe | `{matéria} · {tema} · {n} questão/questões{ de outras regiões / da região}` | manter | Quantidade no conteúdo: permitido. | |
| T858 | telas/Busca.tsx:48 | detalhe | `Flashcard · {matéria}` | manter | | |
| T859 | telas/Busca.tsx:50 | detalhe | `Prova completa · {n} questões` | manter | | |

## 39. Textos de dados mostrados na interface (rótulos)

| # | arquivo:linha | onde aparece | texto atual | texto novo | por quê | veredito |
|---|---|---|---|---|---|---|
| T860 | dados/materias.ts:59 | descrição Biologia | `Célula, genética, fisiologia, ecologia e evolução.` | manter | | |
| T861 | dados/materias.ts:62 | descrição Química | `Estequiometria, soluções, orgânica, equilíbrio e eletroquímica.` | manter | | |
| T862 | dados/materias.ts:65 | descrição Matemática | `Funções, geometria, probabilidade, estatística e porcentagem.` | manter | | |
| T863 | dados/materias.ts:68 | descrição Português | `Interpretação, gramática, literatura e linguagens.` | manter | | |
| T864 | dados/materias.ts:71 | descrição Física | `Cinemática, dinâmica, energia, termologia, óptica, ondas e eletricidade.` | manter | | |
| T865 | dados/materias.ts:74 | descrição Geografia | `Cartografia, natureza, população, espaço urbano e agrário, energia e geopolítica.` | manter | | |
| T866 | dados/materias.ts:77 | descrição História | `Brasil, Geral, América e o mundo contemporâneo.` | `História do Brasil, Geral e da América, até o mundo contemporâneo.` | "Brasil, Geral, América" lido solto não faz sentido. | |
| T867 | dados/materias.ts:80 | descrição Filosofia e Sociologia | `Filosofia, dos pré-socráticos ao existencialismo, e Sociologia: cultura, trabalho, desigualdade, poder e indústria cultural.` | manter | | |
| T868 | dados/materias.ts:83 | descrição Inglês | `Leitura e interpretação de textos em inglês.` | manter | | |
| T869 | dados/tipos.ts:78 | origem do gabarito | `Gabarito do Aprendice: a banca não publicou gabarito oficial` | manter | Texto exigido pelo princípio 2. | |
| T870 | dados/tipos.ts:79 | origem do gabarito | `Gabarito de resolução publicada` | manter | | |
| T871 | dados/tipos.ts:80 | origem do gabarito | `Gabarito oficial publicado` | manter | | |
| T872 | logica/origemLink.ts:33 | origem do link | `Lista pública de exercícios` | manter | | |
| T873 | logica/origemLink.ts:35 | origem do link (aba Fonte, rodapé da correção) | `PDF de cursinho (${nome}), com a prova` | `PDF de resolução publicada, com a prova` | Sem citar o cursinho (guia de marketing); o nome continua registrado no dado `nome` de origemDoLink. | |
| T874 | logica/origemLink.ts:36 | origem do link | `Cópia da prova em site de terceiros (${nome})` | `Cópia da prova em site de terceiros` | Mesmo critério: o nome fica só no registro interno. | |
| T875 | logica/origemLink.ts:38 | origem do link | `Caderno da prova, em arquivo hospedado na internet` | manter | | |
| T876 | logica/origemLink.ts:40 | origem do link | `Site da instituição (sem link direto para o caderno)` | manter | | |
| T877 | logica/origemLink.ts:41 | origem do link | `Caderno da prova oficial` | manter | | |
| T878 | logica/rodadaTreino.ts:17-21 | capa do treino | `questões reais de prova` · `frases para completar` · `flashcards` + ` dos temas que mais caem, em ordem sorteada a cada rodada.` / `…, tudo misturado.` | manter | | |
| T879 | logica/legendaFigura.ts:18 | legenda de figura | `Desenho do Aprendice, com ${créditos}` / `Desenho do Aprendice` | manter | | |
| T880 | logica/legendaFigura.ts:8-12 | créditos | `ícones Bioicons` · `ícones Phosphor` · `dados do NIST` · `dados do CRC Handbook` · `dados da EPA` | manter | | |
| T881 | logica/revisaoGeral.ts:37-38 | partes | `Filosofia` · `Sociologia` | manter | | |
| T882 | logica/revisaoGeral.ts:196 | aviso de produção | `EM CONSTRUÇÃO — {descrição}` | manter (não chega ao aluno: CaixaImagem não mostra) | Se um dia aparecer, trocar por "Imagem em preparação". | |
| T883 | logica/revisao.ts:202 | quando volta | `hoje` / `amanhã` / `em ${d} dias` | manter | | |
| T884 | logica/revisao.ts:225-229 | botões do flashcard | `volta hoje` / `volta amanhã` / `volta em ${d} dias` / `, depois em ${n} dia(s)` | manter | | |

---

## Contagem

| Seção | Itens | Com proposta de mudança |
|---|---|---|
| 0. Página | 8 | 1 |
| 1. Casca | 36 | 6 |
| 2. Peças comuns | 7 | 0 |
| 3. Login | 41 | 19 |
| 4. Contas (mensagens) | 12 | 3 |
| 5. Boas-vindas | 13 | 3 |
| 6. Escolha de provas | 8 | 1 |
| 7. Início | 42 | 14 |
| 8. Hoje | 49 | 6 |
| 9. Matérias / matéria | 37 | 8 |
| 10. Tema | 36 | 3 |
| 11. Conteúdo (Escada) | 24 | 3 |
| 12. Questão | 29 | 2 |
| 13. Cartão da questão | 23 | 1 |
| 14. Correção | 11 | 1 |
| 15. Resolução animada | 13 | 1 |
| 16. Treino da matéria | 19 | 2 |
| 17. Treino geral / rodadas | 12 | 3 |
| 18. Flashcards | 26 | 3 |
| 19. Cartões | 25 | 1 |
| 20. Correção do flashcard | 5 | 1 |
| 21. Simulados | 32 | 5 |
| 22. Simulado (config. e execução) | 40 | 2 |
| 23. Resultado do simulado | 12 | 3 |
| 24. Revisão | 25 | 8 |
| 25. Agenda | 7 | 1 |
| 26. Domínio | 9 | 1 |
| 27. Revisão em slides | 45 | 4 |
| 28. Slide e peças | 29 | 0 |
| 29. Revisão essencial | 26 | 8 |
| 30. Revisão geral | 29 | 4 |
| 31. Desempenho | 26 | 3 |
| 32. Meu progresso | 6 | 0 |
| 33. Filtro de região | 14 | 0 |
| 34. Provas | 20 | 2 |
| 35. Perfil | 36 | 6 |
| 36. Configurações | 29 | 10 |
| 37. Privacidade | 10 | 0 |
| 38. Busca | 10 | 2 |
| 39. Dados (rótulos) | 25 | 3 |
| **Total** | **906** | **144** |

## Dúvidas de fato (conferidas em 21/11/2026)
1. **Contas na nuvem no site publicado** — confirmado pela documentação, não pelo código: `docs/contas.md` registra `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` na Vercel (produção e prévia); não há `vercel.json` nem `.env` de exemplo no repositório. Logo, no site publicado os textos fixos de T831 e T835 ("sem servidor", "versão de demonstração") estão falsos hoje: prioridade na aplicação. As propostas usam a condição `conta.fase`, que vale nos dois modos.
2. **"Gabarito oficial" nas provas completas** — não confirmado: o índice não traz a origem do gabarito, e há manifestos que citam gabarito preliminar (`fabrica_saida/ingestao/*/manifesto.json`). T536 e T543 passaram a texto neutro, sem "oficial".
3. **Tempo total no Desempenho** — conferido: `tempoTotal` (logica/estatisticas.ts:108) devolve o maior entre o tempo das sessões gravadas (só as migradas do protótipo) e a soma do tempo das respostas. T726 passou a "de tempo registrado".
4. **Cópia de segurança ao zerar** — conferido: `zera()` (estado/loja.ts:103) grava a cópia só no aparelho; com conta, o zero também vai para a nuvem (docs/contas.md). T823 ganhou a versão com conta.
5. **Nome de cursinho na origem do link** (T873, T874): resolvido com proposta: o texto ao aluno deixa de citar o nome; o nome continua no campo `nome` de `origemDoLink`, como registro interno (princípio 10).
6. **Supabase em São Paulo** — confirmado em `docs/contas.md` (`sa-east-1`). T847: manter.
7. **Item de menu "Questões" × aba "Matérias"** — não é fato de código, é escolha de produto. T21 voltou a "manter"; fica como sugestão ao dono.

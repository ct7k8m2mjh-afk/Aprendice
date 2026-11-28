# Revisão do site, 21/11/2026 (3ª rodada): casca

Revisor independente (não corrigiu nada). Parte: casca — menu lateral (com Outras matérias aberta), trilho e abas do celular, Início, Hoje, busca ("fotossíntese", "Fuvest 2024", "função"), entrada e cadastro em modo demonstração (antes de entrar, claro e escuro), boas-vindas (provas-alvo, ritmo), Perfil (com "Excluir minha conta" aberto e executado no modo demonstração), Configurações (tema, provas-alvo, sair e entrar), Privacidade (antes e depois de entrar), página não encontrada (`#/rota-que-nao-existe`).

Método: build do commit `82d57265` servido em http://localhost:4191 (modo demonstração: `VITE_CONTAS_REAIS` desligado; `nuvem()` devolve `null`, `conta.fase = 'local'`). Playwright/Chromium, deviceScaleFactor 1; 16 telas × 390, 768, 1280 e 1440 px × claro e escuro (128 combinações), com progresso de demonstração (`scripts/demo.cjs`). Medidas por script: rolagem lateral, fundos #FFF/#000, emoji, contraste (texto sobre o fundo efetivo), texto cortado, elementos fora da tela, alvo de toque < 44 px em 390 (descontando a área invisível `::before`), foco por teclado, erros de console e de rede. Fluxos à mão: entrar → boas-vindas → início; sair e entrar com outro e-mail; voltar com o primeiro; Perfil → Privacidade → Voltar; Excluir minha conta (EXCLUIR). Prints `r3-casca-*.png` no scratchpad da sessão; olhados: entrada 390 escuro e 1440 claro, provas-alvo 390 e 1280, ritmo 1280 escuro, Início 390, Hoje 390 escuro, busca "função" 390 e "Fuvest 2024" 1440 escuro, menu com Outras matérias 1440, página não encontrada 768 escuro, Perfil com exclusão 390 escuro, Configurações 768, Privacidade 768 escuro e 1440 claro.

## 1. Situação dos itens abertos das rodadas anteriores (casca)

| # | Item (resumo) | Situação | O que foi visto agora |
|---|---|---|---|
| N5 | Sair e entrar com outro e-mail entregava o perfil de quem saiu | resolvido | `perfisSalvos` por e-mail (`estado/conta.ts:37`): `outra@exemplo.com` caiu em "Quais provas você vai fazer?"; `ana@exemplo.com` (maiúsculas diferentes) voltou direto ao Início |
| N6 | Nenhuma aba ativa em `/config` (390) | resolvido | "Perfil" ativo nas abas |
| N7 | Ponto de Matemática na busca escura 1,8:1 | resolvido | `.busca-item.m-mat .ponto-sub` #6B93F6 sobre #24201A (≈5,6:1) |
| N8 | Vantagens 12,5/11,5 px e "Esqueceu" 13 px | resolvido | `.l-vantagem b` 14 px 700, `p` 13,5 px, `.l-esqueci` 13,5/14 px nas 4 larguras |
| N9 | Entrada rola em 1280/1440×900 | parcial | 1280×900: 900 = altura, sem rolar. 1440×900: ainda rola 18 px (claro) e 8 px (escuro); os cartões cabem na tela |
| N10 | Placeholder "••••••••" | resolvido | "Sua senha" |
| N11 | Dia/Noite 15 px 600 | resolvido | 14 px 500 no topo, na entrada e nas boas-vindas |
| N12 | "Personalizar" 110×35 sem área de 44 | resolvido | `::before` de 44 px em 390 |
| N13 | INEP / Inep | não | Provas-alvo: "ENEM · INEP"; Simulados: "banca Inep" |
| 29 | Contagem da busca filtrada sem aviso | resolvido | "· 23 questões de São Paulo e do ENEM" |
| N1–N4, N14–N16, 18, 19, 24, 32, 34 | Revisão e Simulados | não verificado | fora do escopo desta rodada (casca sem revisão e simulados) |

## 2. Achados novos

N1. **Privacidade com a conta aberta (modo demonstração), todas as larguras — abre fora do site e "Voltar" leva à tela de entrar.** Atual: em `App.tsx:44` a página abre sem casca quando `conta.fase !== 'dentro'`; no modo demonstração a fase é sempre `'local'`, então quem já entrou e toca em "Privacidade" no Perfil vê a página sem menu, sem topo e sem abas, com o texto em linhas de 1330 px a 1440 (`.miolo` 1330 px de largura). O "Voltar" (`Privacidade.tsx:15`, `voltar = conta.fase === 'dentro' ? '/perfil' : '/boas-vindas'`) leva a `#/boas-vindas`, que mostra a tela "Entre na sua conta" como se o aluno tivesse saído (o perfil continua lá; `#/` volta ao Início). Correção: tratar `fase === 'local'` com perfil como "dentro" nas duas condições (`App.tsx:44` e `Privacidade.tsx:15`). Print `r3-casca-privacidade-1440-claro.png`, `r3-casca-priv-voltar-1440.png`. **ERRO.**

N2. **Privacidade, modo demonstração, todas as larguras e temas — o texto promete nuvem e contas que não existem nesta versão.** Atual (`Privacidade.tsx:23-41`, sem nenhuma condição por `conta.fase`): "A senha é guardada cifrada pelo serviço de contas" (no modo demonstração a senha nem é conferida nem guardada); "entrar de qualquer aparelho"; "na nuvem, no serviço de contas Supabase (servidor em São Paulo)"; "Ao sair da conta, o progresso sai deste aparelho e continua guardado na sua conta" (no modo demonstração sair guarda tudo no aparelho, como o próprio Perfil diz); "apagados da nuvem e deste aparelho". A entrada (rodapé "Tudo fica salvo só neste aparelho"), o Perfil e as Configurações já trocam o texto por `fase`; a Privacidade não. Correção: versão local do texto (o que fica só neste aparelho, que nada é enviado, que sair não apaga, que "Excluir minha conta" apaga o que está no aparelho), escolhida por `conta.fase === 'local'`, como em `Perfil.tsx:33` e `Config.tsx:98`. **ERRO** (texto falso).

N3. **Configurações, bloco Privacidade, modo demonstração — "Quando houver contas na nuvem, você poderá baixar e apagar seus dados a qualquer momento (LGPD)."** Atual (`Config.tsx:100`): diz que baixar e apagar são do futuro, mas "Baixar meu progresso" está no bloco logo acima e "Excluir minha conta" já funciona no Perfil (testado: apaga perfil, progresso e perfis guardados e volta à entrada). O bloco também não tem link para a página Privacidade nesse modo. Correção: "Você pode baixar seu progresso aqui e apagar tudo em Perfil › Excluir minha conta. Detalhes em Privacidade." **ERRO** (texto falso).

N4. **Busca aberta, 390 (claro e escuro) — botão Fechar com 34 × 40 px.** Atual: `Busca.tsx:79` `.btn-ic` dentro de `.janela .cab` (`app.css:228`) encolhe para 34 px de largura; não tem a área invisível de 44 px. Correção: `flex: none` e área de 44 px (como `app.css:258-266`). **ERRO** (toque).

N5. **Início, 390 — links "Revisar" de "Hora de revisar" com 80 × 18 px.** Atual: `.in-link` (`inicio.css:25`; `Inicio.tsx:214`), um por matéria, um embaixo do outro, sem área de 44 px. Correção: incluir `.in-link` na regra da área invisível de 44 px. **ERRO** (toque).

N6. **Nome da banca do ENEM (continua de N13).** Atual: "ENEM · INEP" (provas-alvo, boas-vindas e Perfil) e "banca Inep" (Simulados). Correção: uma grafia só. **ERRO** (texto).

N7. **Entrada no modo demonstração — "Entre na sua conta", campo Senha e "Esqueceu sua senha?" sem conta de verdade.** Atual: qualquer senha de 6+ caracteres entra e devolve o perfil guardado daquele e-mail (testado: `ana@exemplo.com` com outra senha voltou ao perfil da Ana); "Esqueceu sua senha?" aparece e só responde "Nesta versão, sem conta na nuvem, não dá para recuperar a senha.". O rodapé "Tudo fica salvo só neste aparelho" é verdadeiro, mas nada diz que a senha não protege. Sugestão: no modo demonstração, subtítulo como "Versão de demonstração: tudo fica neste aparelho" e esconder "Esqueceu sua senha?". **DECISÃO DO DONO** (o dono pediu "conta demo no login").

N8. **Hoje, 390 — nenhuma aba do celular ativa em `/hoje`.** Atual: as abas são Início, Matérias, Simulados, Revisão, Perfil; em `/hoje` nenhuma fica marcada (no menu lateral, "Hoje" fica ativo). O mesmo em `/privacidade` e na página não encontrada. Sugestão: "Início" ativo em `/hoje`. **DECISÃO DO DONO.**

## 3. Conferido e passou

- 128 combinações (16 telas × 4 larguras × 2 temas): sem rolagem lateral, sem fundo #FFFFFF/#000000, sem emoji, sem texto cortado (fora os `.sr` de leitor de tela), nenhum erro de console e nenhuma requisição com falha.
- Contraste: nenhum texto abaixo do mínimo. O "Entrar" branco sobre o degradê verde mede 4,1:1 só no canto mais claro; no meio do botão, onde fica o texto, ≈5,4:1.
- Entrada: foco visível na ordem Dia, Noite, logo, e-mail, senha, olho, "Esqueceu", Entrar; avisos de e-mail e senha; modo Criar conta sem "Esqueceu"; Dia/Noite antes de entrar; rodapé honesto no modo demonstração.
- Boas-vindas: nome tirado do e-mail; provas-alvo com filtro por região e busca; ritmo 70/150/300; termina no Início. Ilustrações do lado entram com animação e terminam inteiras (conferido aos 5 s).
- Perfil e Configurações: textos do modo local corretos ("Os dados ficam só neste aparelho", "Sair não apaga nada… neste aparelho… com o mesmo e-mail"); Claro/Escuro/Igual ao aparelho; Excluir minha conta em duas etapas, botão travado até escrever EXCLUIR, apaga e volta à entrada.
- Busca: "fotossíntese", "Fuvest 2024" (simulado "Prova completa · 89 questões") e "função" (Temas, depois Conteúdos), com a região escrita na contagem; Ctrl+K abre; Esc fecha.
- Menu: Outras matérias aberta cabe em 1440×900; trilho de 64 px em 768; página não encontrada com h1, "Ir para o início" e "Ver matérias", dentro da casca.

Total: 6 ERROS, 2 DECISÕES DO DONO

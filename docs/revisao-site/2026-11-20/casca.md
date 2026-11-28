# Revisão do site, 20/11/2026 (2ª rodada): casca

Revisor independente (não corrigiu nada). Parte: casca — entrada/login (antes de entrar, claro e escuro), boas-vindas, início, menu lateral, trilho e abas do celular, busca ("fotossíntese", "Fuvest 2024", "função"), perfil e configurações (provas-alvo, tema, sair e entrar de novo), simulados (lista, simulado por conteúdo completo até o resultado, pausa), revisão espaçada (tela e sessão), telas de erro e vazio.

Método: build do commit `4fbccc060` servido em http://localhost:4190; Playwright/Chromium, deviceScaleFactor 1; 390, 768, 1280 e 1440 px, claro e escuro (tema escuro pelo botão Noite, inclusive na entrada); medidas por `getComputedStyle`; rolagem lateral, fundos #FFF/#000, emoji, reticências, contraste, alvo de toque (inclusive a área invisível `::before` de 44px) e erros de console/rede por script. Prints `qa2-casca-*.png` no scratchpad da sessão. Itens que o PLANO deixou "para o dono decidir depois" (casca 16 e 25) não entram como problema.

Gravidade: **erro** · **diferença do sistema** · **sugestão (decisão do dono)**.

## 1. Situação dos 38 itens da 1ª rodada

| # | Item (resumo) | Situação | O que foi visto agora |
|---|---|---|---|
| 1 | Login fora da vista no celular | resolvido | `.l-painel` em y=87 (390) e y=118 (768); botão Entrar termina em y=510/537 |
| 2 | Sem tema escuro antes de entrar | resolvido | Dia/Noite (`.l-tema`) na entrada e nas boas-vindas; escuro #1A1712 / folha #24201A. O padrão continua claro mesmo com o aparelho no escuro (aceito: "tema claro padrão") |
| 3 | Painel e Google quase brancos | resolvido | `.l-painel` #FCFAF5 / #24201A; `.l-google` #F7F2E9 / #2B261F |
| 4 | Rodapé 10px, 2,9:1 | resolvido | 13,5px; 6,12:1 claro, 6,99:1 escuro |
| 5 | Textos pequenos em 390 | resolvido em 390 | selo e faixa 13,5px, lead 16px, vantagens 14/13,5px (ver novo item N8 para 1280/1440) |
| 6 | Toque < 44px na entrada | resolvido | área invisível de 44px em `.l-esqueci`, `.l-trocar button`, `.l-olho` (`app.css:258-266`) |
| 7 | "Esqueceu" no modo Criar conta | resolvido | some no modo Criar |
| 8 | Palavra sozinha em `.l-painel-sub` (1440) | resolvido | `text-wrap: balance`, duas linhas equilibradas |
| 9 | Etapa "Provas-alvo" aberta rolada | resolvido | `scrollY` 0 nas 3 etapas, nas 4 larguras |
| 10 | Voltar apaga o e-mail | resolvido | o e-mail volta preenchido (a senha, corretamente, não) |
| 11 | Verde de "certo" em etiqueta neutra | resolvido | `.ep-item .etq` neutra (#585B64 sobre folha2); etapa feita sem verde |
| 12 | "em preparação" falso enquanto carrega | resolvido | mostra "carregando…" até o banco chegar |
| 13 | ENEM escrito de três jeitos | parcial | "ENEM" nas listas, mas ainda "ENEM · INEP" (provas-alvo) e "banca Inep" (cabeçalho do grupo em Simulados) / "questão 103 · Inep" (questão): INEP e Inep convivem. Ver N13 |
| 14 | "Minha região" com prova sem região | resolvido | com provas-alvo = ENEM só aparece o grupo ENEM (6 provas) |
| 15 | Título da prova em `lapis` | resolvido | `.cs-titulo` em `tinta` (17px 600; 15px em 390) |
| 17 | Por conteúdo promete gabarito oficial | resolvido | `entraNoSimuladoConteudo` tira `gabFonte:'aprendice'`; texto "Só questões com gabarito publicado (oficial ou de resolução reconhecida)" |
| 18 | 45 pedidas, 3 entregues sem aviso | não (não estava no pacote) | ENEM + Biologia: 44 conteúdos com 1–2 questões; pedi 10 e veio "4 conteúdos · 4 questões", sem explicar nem oferecer "Todas as regiões" |
| 19 | Barra do por conteúdo alta no celular | não (não estava no pacote) | `.sc-barra` 164px em 390 (125px em 768), sobre a lista |
| 20 | Em branco não entrava na revisão | resolvido | 3 erradas + 1 em branco geraram 4 itens na revisão |
| 21 | Toque < 44px no simulado | resolvido | `.q-volta`, `.folha-btn`, `.crono`, `.q-marca`, `.q-amplia`, `.certeza .chip` com área de 44px |
| 22 | Pausa com folha e Entregar ativos | resolvido | ambos `disabled` na pausa |
| 23 | "Simulados" não ativo em `/simulado/...` | resolvido | ativo no menu e nas abas na execução e no resultado |
| 24 | Resultado inexistente sem explicação | não (não estava no pacote) | `#/simulado/resultado/123`: só "Resultado não encontrado" e "Simulados" |
| 26 | Esc não fechava a busca fora do campo | resolvido | Esc fecha com o foco num resultado |
| 27 | Busca prometia questões | resolvido | botão "Buscar conteúdos, flashcards e provas..."; campo "Buscar matérias, temas, conteúdos, flashcards e provas" (as duas frases ainda diferem, mas nenhuma promete o que não existe) |
| 28 | "função" sem plural; cartões antes | resolvido | "função" e "funções" dão os mesmos 28 resultados: Temas, depois Conteúdos, cartões no fim |
| 29 | Contagem da busca filtrada sem aviso | não (não estava no pacote) | "Fotossíntese… · 1 questão" é a contagem da região ENEM, sem dizer |
| 30 | Contador da sessão de revisão | resolvido | 1 de 4 → 2 de 4 → 3 de 4 → 4 de 4 |
| 31 | Aba "Matérias" ativa na sessão | resolvido | aba "Revisão" ativa (ver N12 sobre o menu lateral) |
| 32 | Questões do dia muito abaixo (390) | não (não estava no pacote) | primeira questão em y≈1169 (antes 1314), ainda depois do destaque, da agenda e dos chips |
| 33 | Revisão no celular (abas, repetição, título) | resolvido em 390; regressão em 768 | 390: abas numa linha que rola, "Revisão geral" sem repetir, título inteiro com etiqueta embaixo. 768: ver N1 e N2 |
| 34 | Agenda "S S D S T Q Q" e frase confusa | não (não estava no pacote) | igual: "4 questões voltam nos próximos 7 dias, 4 hoje." |
| 35 | Menu com Outras matérias aberta passa da tela | resolvido | 1440×900 e 1280×900: `scrollHeight` 900 = altura; Configurações em y=888 (itens de 34px, como o DESIGN.md:139 prevê) |
| 36 | Ícones coloridos de His, Fil/Soc, Ing | resolvido | Lucide de traço 1,75 (ampulheta, balança, idiomas) |
| 37 | Medidas fora do DESIGN.md | resolvido em parte | chip 14,5px 500; abas do celular 12px 500; grupo do menu 14px 500; Dia/Noite com área de 44px. Fica a fonte do Dia/Noite (N11) |
| 38 | Créditos, versão, atalhos, sair apaga perfil | resolvido | créditos com gabarito do Aprendice e as 5 fontes; "versão de demonstração"; atalhos em 2 colunas com tecla e descrição juntas; sair guarda o perfil (ver N5) |

## 2. Problemas novos (inclusive regressões)

### Revisão

N1. **Revisão, 768, claro e escuro — `.linha-lista` dentro do bloco da matéria.** Atual: o bloco "Biologia" ocupa só metade da largura (266px numa grade de 2 colunas com uma matéria só); a etiqueta `.etq` "Vencida" tem 133px (metade da linha) e o título `.linha-lista .tit` fica com 77px e quebra em 3 linhas ("ENEM 2022 / · questão / 114"), cada linha com 123px de altura. Referência: a correção do item 33 ("título da questão inteiro com a etiqueta embaixo") vale só até 700px; em 768 voltou o defeito. Print `qa2-casca-revisao-768-claro.png`. **Erro (regressão).**

N2. **Revisão, 768 — `.abas-rev`.** Atual: as 6 abas medem 660px numa área de 640px; "Revisão geral" aparece cortada ("Revisão gera") na borda, sem sinal de que a fileira rola. Em 390 a fileira também rola (571px em 390) e "Domínio" fica pela metade, sem indicação. Referência: nada cortado (princípio 9). **Erro** em 768; **sugestão** em 390.

N3. **Revisão e Simulados, 390 — `.abas button` / `.abas-rev button`.** Atual: 102–116 × 37px, sem a área invisível de 44px que os chips e `.btn.peq` ganharam (`app.css:258-266` não inclui `.abas button`). Referência: 44px no celular. **Erro.**

N4. **Sessão de revisão, 1280 e 1440 — menu lateral.** Atual: dois itens ativos ao mesmo tempo, "Biologia" e "Revisão" (`.lado .item-nav.ativo`). Referência: um destino ativo, como nas abas do celular. **Sugestão.**

### Perfil, conta e configurações

N5. **Sair e entrar com outro e-mail — `voltaAConta` (`app/src/estado/conta.ts:16`).** Atual: saí como "Ana Teste" (provas ENEM e Fuvest, meta 200, data do ENEM) e entrei com `outra.pessoa@exemplo.com`; o site pulou as boas-vindas e entregou o perfil inteiro da Ana, só trocando o e-mail. O perfil salvo volta para qualquer e-mail. Referência: o aviso do Perfil promete que os dados "voltam quando você entrar de novo" (a mesma pessoa); outra pessoa no mesmo aparelho deveria começar pelas boas-vindas. **Erro.**

N6. **Configurações, 390 — abas do celular em `/config`.** Atual: nenhuma aba fica ativa (Configurações se abre pelo Perfil). **Sugestão:** "Perfil" ativo.

### Busca

N7. **Busca, escuro — ponto do conteúdo de Matemática (`.busca-item.m-mat .ponto-sub`).** Atual: #1F3FA6 sobre a janela #24201A, contraste 1,8:1 (ponto de 8px). Referência: ícone ou marca gráfica ≥ 3:1. O mesmo ponto aparece em `.sc-sub` do simulado por conteúdo e no menu. Print `qa2-casca-busca-fun_o-390-escuro.png`. **Erro.**

### Entrada (login)

N8. **Entrada, 1280 e 1440 — `.l-vantagem b` 12,5px e `.l-vantagem p` 11,5px; `.l-esqueci` 13px em todas as larguras.** Referência: secundário 13,5/14px (DESIGN.md, Tipografia). A correção do item 5 foi só para ≤580px. **Diferença do sistema.**

N9. **Entrada, 1280×900 e 1440×900.** Atual: a página rola 40–87px e os três cartões de vantagens começam em y≈860, cortados no pé da primeira tela. **Sugestão.**

N10. **Entrada, todas — campo Senha com placeholder "••••••••".** Atual: parece senha já digitada. **Sugestão:** texto como "Sua senha".

### Casca e medidas

N11. **Topo, entrada e boas-vindas — Dia/Noite (`.tema-seg button`).** Atual: 15px 600 (Familjen; DM Sans na entrada). Referência: 14px 500 (DESIGN.md:142). **Diferença do sistema.**

N12. **Início, 390 — "Personalizar" (`.in-personalizar`).** Atual: 110 × 35px, sem a área de 44px. **Erro** (toque).

N13. **Nome da banca do ENEM.** Atual: "INEP" em `EscolhaProvas` ("ENEM · INEP") e "Inep" em Simulados ("banca Inep") e na questão ("questão 103 · Inep"). Referência: uma grafia só (ver item 13). **Erro de texto.**

### Simulados e telas de erro

N14. **Simulados, aba Provas — `Provas 399` e "Todas as regiões (399)".** Atual: a aba mostra 399 enquanto a lista aberta ("Minha região") tem 6. **Sugestão.**

N15. **Simulados, aba Histórico — `.titulo-pag .sub`.** Atual: continua "Provas inteiras, com todas as matérias, no tempo oficial…", que não descreve o histórico. **Sugestão.**

N16. **`#/simulados/conteudo?m=bio&c=ZZZ&n=10` (conteúdo inexistente).** Atual: título "Simulado de ZZZ", com o código cru. Referência: nome do conteúdo ou "Conteúdo não encontrado". **Sugestão.**

## 3. Conferido e passou

- Sem rolagem lateral em 390, 768, 1280 e 1440, claro e escuro: entrada, boas-vindas (3 etapas), início, perfil, configurações, simulados (Provas, Por conteúdo, Histórico), configuração, execução, pausa e resultado do simulado, revisão, sessão de revisão, busca.
- Sem emoji; sem texto cortado com reticências; nenhum fundo ou cartão #FFFFFF/#000000 na casca (o único branco é o print da questão `.q-print-img` dentro da correção, que pertence à parte da questão).
- Contraste ≥ 4,5:1 nos textos medidos da entrada (rodapé 6,1/7,0; "Esqueceu" 5,1/9,0), boas-vindas, simulados (títulos 13,9–17; apoio 5,0–6,7) e revisão.
- Entrada: avisos de e-mail inválido e senha curta, com foco no campo; modo Criar conta sem "Esqueceu"; tema escuro completo (painel, Google, campos, vantagens).
- Boas-vindas: "carregando…" e depois as contagens; Voltar mantém o e-mail; nome tirado do e-mail ("Maria"); termina no Início.
- Busca: "fotossíntese" leva a B03.5 com Enter; "Fuvest 2024" e "enem 2023" acham o simulado; "função" = "funções"; "Nada encontrado para “xyzqw”."; Ctrl+K abre; Esc fecha com o foco num resultado; foco visível (contorno 2px na cor da matéria).
- Perfil: troca de provas-alvo (Fuvest entrou e a região virou "São Paulo e ENEM"), meta, nome, data da prova ("faltam 352 dias"); sair e entrar com o mesmo aparelho devolve o perfil.
- Configurações: Claro, Escuro e "Igual ao aparelho" funcionam e o topo acompanha; créditos e atalhos corretos.
- Simulado por conteúdo do começo ao fim: marcar tema, quantidade, configuração (12:00 para 4 questões), cronômetro, pausa (folha e Entregar travados), aviso de questões em branco, resultado por conteúdo, gabarito com certa/errada/branco, correção com "Por que eu errei", "Resposta correta" e "Resolução animada"; erros e brancos entram na revisão.
- Sessão de revisão: contador certo, aba "Revisão" ativa, Esc volta para `/revisao`.
- Telas de vazio/erro: revisão sem questões, histórico vazio, "Nenhum simulado em andamento", "Simulado não encontrado", "Questão não encontrada", "Prova não encontrada" — todas com botão de saída.
- Menu: Outras matérias aberta cabe em 1280×900 e 1440×900; recolher; trilho de 64px em 768 com item ativo; ícones Lucide 1,75 em todas as matérias.
- Nenhum erro de console e nenhuma requisição com falha em todo o percurso.

# Revisão do site, 21/11/2026 (3ª rodada, 2ª passada): casca

Revisor independente (não corrigiu nada). Parte: só o que mudou desde a 1ª passada (`casca.md`, achados N1–N6) e o que fica em volta: Privacidade aberta de dentro do site no modo demonstração (casca, menu, Voltar → Perfil) e de fora (antes de entrar); bloco Privacidade das Configurações; Fechar da busca e links "Revisar" do Início (área de toque); grafia "Inep" nas provas-alvo (boas-vindas e Perfil), em Simulados e numa questão do ENEM (`#/m/mat/q/a541e032`, que no banco ainda traz `INEP`).

Método: build servido em http://localhost:4191 (commit `dc33dfbd`; mudanças da casca em `8764a753`, `1cd6a1f5`, `25d1153f`, `b9414cee`), modo demonstração (`conta.fase = 'local'`). Playwright/Chromium, deviceScaleFactor 1; 390, 768, 1280 e 1440 px × claro e escuro, com progresso de `scripts/demo.cjs`. Medidas por script: rolagem lateral, fundos #FFF/#000, emoji, contraste, texto cortado, área de toque real (varredura com `elementFromPoint` a partir do centro do controle), erros de console e de rede. Fluxos à mão: Perfil → Privacidade → Voltar (390 e 1440); entrada → Privacidade → Voltar → entrar com `bia@exemplo.com` → provas-alvo (390 e 1440). Prints `r3-casca2-*.png` no scratchpad da sessão; olhados (depois da abertura animada, aos 5 s): Privacidade dentro 390 claro e 1440 escuro, Privacidade fora 390 escuro e 1280 claro, Configurações 390 escuro, Perfil (provas-alvo) 768 claro, questão do ENEM 390 claro, busca aberta 390 e 1440 claro.

## 1. Situação dos achados da 1ª passada

| # | Item (resumo) | Situação | O que foi visto agora |
|---|---|---|---|
| N1 | Privacidade com a conta aberta abria fora do site e "Voltar" levava à entrada | resolvido | Nas 8 combinações abre dentro da casca (menu, topo, abas do celular); "Voltar" → `#/perfil` ("Ana Souza"). Fluxo Perfil → Privacidade → Voltar certo em 390 e 1440. Antes de entrar continua sem casca e "Voltar" leva à entrada |
| N2 | Texto da Privacidade prometia nuvem no modo demonstração | parcial | "Para quê", "Onde fica" e "Seus direitos" agora dizem o que é verdade (só neste aparelho, nada enviado, sair não apaga, excluir apaga deste aparelho). Sobra uma frase falsa no primeiro item: ver R3 |
| N3 | Configurações: baixar e apagar "quando houver contas" | parcial | Frase trocada: "Você pode baixar seu progresso aqui e apagar tudo em Perfil, no botão “Excluir minha conta”. Detalhes em Privacidade." Mas "Privacidade" continua texto puro, sem link: ver R2 |
| N4 | Fechar da busca 34 × 40 px em 390 | parcial | Desenho 40 × 40 (não encolhe mais), mas a área de toque medida é 42 × 42 px, não 44: ver R1 |
| N5 | Links "Revisar" do Início 80 × 18 sem área de 44 | resolvido | 390 claro e escuro: área de toque vertical de 44 px em cada um; as linhas ficam a 81 px uma da outra, as áreas não se encostam; desenho igual (17 px, mesma cor) |
| N6 | "ENEM · INEP" × "banca Inep" | resolvido | "ENEM · Inep" nas provas-alvo (boas-vindas e Perfil), "banca Inep" em Simulados, "ENEM 2014 · 2º dia · questão 173 · Inep" na questão (banco traz `INEP`, normalizado em `dados/conteudo.ts:71`) |
| N7, N8 | Entrada no modo demonstração; aba ativa em `/hoje` | não verificado | Decisões do dono, fora desta passada |

## 2. Achados novos

R1. **Busca aberta, 390 (claro e escuro) — área de toque do Fechar com 42 × 42 px.** Atual: `app.css:273` `.janela .cab .btn-ic::before { inset: -2px }`. O `::before` posicionado se mede pela caixa de preenchimento (40 px menos 1 px de borda de cada lado = 38 px), então `inset: -2px` dá 42 px; a varredura confirma 42 × 42. Correção: `inset: -3px` (dá 44) ou a mesma regra das outras (`left: 50%; top: 50%; width: max(100%, 44px); height: max(100%, 44px); transform: translate(-50%, -50%)`, como em `app.css:266-267`), que já desconta a borda certa. **ERRO** (toque).

R2. **Configurações, bloco Privacidade, todas as larguras — "Detalhes em Privacidade." sem link.** Atual: `Config.tsx:99-100`, nos dois modos, o texto manda o aluno para a página Privacidade, mas não há link nesse bloco nem no menu; a página só é alcançada pelo Perfil e pela entrada. Correção: transformar "Privacidade" em `<Link to="/privacidade">`, como em `Perfil.tsx:76`. **ERRO** (navegação; era a 2ª metade da correção pedida em N3).

R3. **Privacidade, modo demonstração, todas as larguras e temas — "Nome e e-mail que você escreveu ao entrar".** Atual: `Privacidade.tsx:26`. Ao entrar só se escrevem e-mail e senha; o nome é tirado do e-mail nas boas-vindas (`BoasVindas.tsx:26`, `nomeDoEmail`) e muda no Perfil. O nome também já aparece no item seguinte ("Perfil de estudo: o nome que você escolheu"). Correção: "**E-mail** que você escreveu ao entrar, só neste aparelho. A senha não é guardada nem enviada." **ERRO** (texto falso).

R4. **Busca aberta, 768, 1280 e 1440 com mouse — Fechar continua amassado em 36,7 × 40 px.** Atual: a correção de N4 (`flex: none`) ficou só dentro do `@media (pointer: coarse), (max-width: 700px)` (`app.css:272`); fora dele o `.btn-ic` (desenho 40 × 40, `app.css:169`) encolhe no `.cab` em flex (`app.css:228`). Pouco visível, mas o quadrado vira retângulo. Correção: `flex: none` em `.janela .cab .btn-ic` fora do media (ou no próprio `.btn-ic`). **ERRO** (diferença do componente).

## 3. Conferido e passou

- Privacidade dentro, Privacidade fora, Configurações, Início e Perfil nas 4 larguras × 2 temas: sem rolagem lateral, sem fundo #FFFFFF/#000000, sem emoji, sem texto cortado, nenhum erro de console nem requisição com falha. (O script acusou contraste baixo em "Noite", "Meu perfil" e nas etiquetas "N questões"; eram falso positivo do leitor de cor com fundos em `color(srgb …)`; nos prints o contraste está normal.)
- Privacidade dentro da casca: aberta pelo link do Perfil, com Dia/Noite e busca no topo; Voltar com o mesmo botão secundário. Fora da casca, antes de entrar, a mesma largura máxima da página (`--pag-max`).
- Texto do modo demonstração na Privacidade confere com o código: a senha não é guardada no aparelho (`Login.tsx:10`), sair guarda o perfil por e-mail (`estado/conta.ts`), excluir apaga do aparelho.
- Busca: Ctrl+K abre, Esc fecha; Fechar 40 × 40 em 390.
- "Inep" escrito igual em provas-alvo, Simulados e questão; a busca de provas continua achando o ENEM.

Total: 4 ERROS, 0 DECISÕES DO DONO

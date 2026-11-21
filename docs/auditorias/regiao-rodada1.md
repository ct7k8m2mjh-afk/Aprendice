# Filtro de região: auditoria, rodada 1 (09/11/2026)

Auditor separado, que não fez o trabalho. Código em `app/` no commit f4c0600e. Build local (vite build) servido em http-server.
Conta de teste `teste@exemplo.com`, provas-alvo ENEM + Fuvest, ou seja, "Minha região" = São Paulo e ENEM.
Telas conferidas: conteúdo (`#/m/bio/escada/B09.3`), tema (`#/m/bio/tema/B09`), Treino geral da matéria (`#/m/bio/treino`, antes da 1ª questão e no fim),
Treino geral de todas as matérias (`#/treino-geral`, antes e no fim), Revisão (aba Questões), Provas e faculdades, Simulados e Perfil.
Larguras 390, 768, 1280 e 1440, nos temas claro e escuro. Também cliquei em Norte, Sul, São Paulo e Minha região, abri Trocar/Fechar e usei "Ver de outras regiões".
Para a tela de fim de rodada, gravei `i = it.length` no estado (`aprendice.v1`) e recarreguei a página.

Medi o seguinte em todas as telas e larguras: rolagem lateral (`scrollWidth` contra `clientWidth`), o estilo calculado do chip, da frase, do Trocar e do aviso, e o console.
O console ficou limpo: nenhum erro e nenhum aviso, fora os avisos "Future Flag" do React Router, que já existiam antes.

## Contagem
- Grave: 1
- Médio: 4
- Leve: 7

## Graves

### G1. Fim do treino no celular: os chips saem da tela e a página rola para o lado
- **Tela:** "Treino concluído", tanto do Treino geral da matéria (`#/m/bio/treino`) quanto do Treino geral de todas as matérias (`#/treino-geral`).
- **Largura e tema:** 390, nos temas claro e escuro. Até 700 px vale a mesma regra, então toda tela de celular é afetada.
- **Como reproduzir:** termine a rodada (ou grave `treino.bio.i = treino.bio.it.length` no `localStorage['aprendice.v1']` e recarregue) e role até os chips.
- **O que acontece:** `.tm-regiao` fica com 840 px de largura e começa em x = −225. O documento fica com `scrollWidth` 615 para 390 de viewport, então há rolagem lateral.
  "Minha região", "Todas as regiões" e o começo da frase ("Minha região: São Paulo e ENEM…") ficam cortados à esquerda, sem como alcançá-los. A frase aparece como "…as suas provas-alvo. Trocar".
- **Causa provável:** `.resultado-fl` é flex em coluna com `align-items: center`. O filho `.tm-regiao` encolhe até o tamanho do conteúdo, que é a linha de chips sem quebra (`nowrap`) da regra ≤700px.
  Além disso, `.tm-regiao .fr-chips { margin: 0; padding: 0 }` tira a sangria. Falta largura de 100% (ou `align-self: stretch` com `min-width: 0`) no `.tm-regiao`.
- Prints: `f-treino-390-c-b.png` (e `i-treino-fim-390-c.png`, que mostra a página com 615 px de largura) no scratchpad da auditoria.

## Médios

### M1. Texto do aviso com preposição errada: "de Norte", "de Sul", "de Nordeste"…
- **Tela:** conteúdo (Escada), tema e Simulados ("Ainda não há prova completa de …"). Em todas as larguras e nos dois temas.
- **Como reproduzir:** `#/m/bio/escada/B09.3`, chip "Norte". Aparece "Só 3 questões de Norte neste conteúdo."
- **O certo:** "do Norte", "do Sul", "do Nordeste", "do Sudeste", "do Centro-Oeste", "de São Paulo", "do ENEM".
  A causa é `descreveFiltro`, que devolve só o nome e deixa o "de" fixo em `AvisoRegiao`, na Revisão ("de fora de …") e em Simulados.

### M2. Provas e faculdades: "Públicas" e "Privadas" ficam escondidas no celular
- **Tela:** `#/provas`, em 390 (claro e escuro).
- **Como reproduzir:** abra a tela no celular. A linha de chips rola por dentro, e "Públicas" e "Privadas" ficam depois de "Centro-Oeste", a cerca de 1040 px da borda. Só aparecem para quem rolar a linha até o fim.
- Em 768, 1280 e 1440 os dois grupos ficam na mesma linha, separados só por um `<span style="width:8px">`. Filtro de região e filtro de rede parecem um grupo só. Faltam grupos separados, cada um com seu rótulo, como no sistema.

### M3. Simulados: "Mudar provas-alvo" vai para o fim da linha rolável no celular
- **Tela:** `#/simulados`, em 390. O chip-link "Mudar provas-alvo" fica a cerca de 1180 px e não aparece sem rolar a linha.
- Além disso, só "Todas as regiões (237)" e "Minhas provas-alvo (14)" mostram contagem, e os chips de região não. A mistura fica estranha.

### M4. Provas e Simulados: "Minha região" sem dizer qual é
- **Tela:** `#/provas` e `#/simulados`, em todas as larguras.
- Nessas duas telas não aparece a frase "Minha região: **São Paulo e ENEM**…" nem o "Trocar". O significado está só no `title` do chip, que o toque não mostra.
  O aluno não sabe o que "Minha região" está filtrando e não tem como trocar dali (em Simulados há "Mudar provas-alvo", em Provas não há nada).

## Leves

### L1. "Trocar" em 15 px ao lado da frase em 14 px
- **Tela:** todas as telas com a frase (Escada, tema, treinos e Revisão), em todas as larguras.
- O `regiao.css` define `.fr-trocar` com 14px, mas `tipografia.css` (`.link-sec` → `--fs-botao`, que dá 15 px) vem depois, tem a mesma especificidade e ganha. O valor calculado é 15px/600.

### L2. Cor do "Trocar" muda de uma tela para outra
- Na matéria ele sai na cor da matéria (verde em Biologia) e na Revisão sai na tinta.
- No Treino geral de todas as matérias, a cor muda a cada questão, conforme a matéria dela: azul-petróleo, azul, magenta, couro, roxo. Exemplos: `tgeral-768-c` e `tgeral-1280-e`.
  O DESIGN.md diz só "600, sublinhado". Falta decidir uma cor única (tinta, ou a cor da matéria só dentro da matéria).

### L3. Chip calculado em 15px/600, e o DESIGN.md (seção do filtro) diz 14,5px/500
- O `app.css` segue o protótipo (14,5/500), mas a regra global de botão em `tipografia.css` passa todos os `.chip` para 15/600.
  O filtro está igual aos outros chips do site, então a divergência está entre o DESIGN.md (que repete o protótipo) e o guia de tipografia. É preciso alinhar o texto do DESIGN.md ou a regra.
  O compacto (5/12, 14px) está certo.

### L4. Conteúdo (Escada) em 1280 e 1440: "Centro-Oeste" sozinho numa 2ª linha
- **Tela:** `#/m/bio/escada/B09.3`, em 1280 e 1440 (claro e escuro). A coluna estreita (880 px) não comporta os 9 chips, e "Centro-Oeste" fica sozinho embaixo.
  O mesmo acontece com "Nordeste · Norte · Centro-Oeste" na Revisão em 768. No tema, em 1280, eles cabem numa linha só.

### L5. Fim do treino em 768 ou mais: chips alinhados à esquerda num cartão todo centralizado
- **Tela:** "Treino concluído", em 768 (claro e escuro), onde os chips quebram em 2 linhas encostadas à esquerda.
  Título, números e botões ficam centralizados, e o bloco de região fica à esquerda (`text-align: left`). O alinhamento fica misturado.

### L6. Perfil: "Pelas provas-alvo (São Paulo)" contra "São Paulo e ENEM" no resto do site
- **Tela:** Perfil (seção "Região das minhas provas") e o seletor aberto pelo "Trocar", em todas as larguras.
  O chip omite o ENEM, e a frase logo acima diz "São Paulo e ENEM". O seletor também oferece "Nacional", e a nota logo abaixo diz que o ENEM entra sempre, então marcar "Nacional" não muda nada.
  No mesmo Perfil, o filtro das provas-alvo usa "Todas", e o resto do site usa "Todas as regiões".

### L7. Tema com região sem questões de um nível: "Avançado 0 de 0"
- **Tela:** `#/m/bio/tema/B09`, chip "Norte", em todas as larguras. A capa mostra "Avançado 0 de 0".
  Na Escada, o nível vazio mostra "N questões de outras regiões", como o DESIGN.md pede. Na capa do tema, o nível fica vazio, sem essa indicação.

## Não verificado
- O aviso da Revisão ("N questões de fora de … também vencem hoje") não pôde ser verificado: uma conta nova não tem questão vencida. Os chips e a frase da Revisão foram conferidos (estado vazio).

## Conferido e sem defeito
- Não há rolagem lateral em nenhuma tela, largura ou tema, fora o G1.
- Até 700 px, a linha de chips sangra até a borda e rola por dentro, e o chip escolhido fica visível.
- O chip escolhido usa tinta e papel nos dois temas. O compacto mede 5/12 e 14 px nos treinos.
- A frase usa 14 px e `lapis`, com a região em negrito na tinta.
- O aviso usa `aviso-bg`/`aviso`, canto 12, padding 10/14 e 14 px. O link "Ver de outras regiões (N)" está em 14 px, nos dois temas.
- Trocar uma região no treino refaz a rodada: a 1ª questão passou a ser da região escolhida.

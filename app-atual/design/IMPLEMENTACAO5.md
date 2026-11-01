# Implementação 5: fim do trabalho de tela + dicionário "passe o mouse" (30/10/2026)

**Arquivos editados:** `materia.js` e `materia.css`. `shell.html`, `icones.js` e `gera_design.py` já tinham a parte A da rodada anterior; conferi e não precisei mexer.
- Cópia de `materia.js`/`materia.css` antes desta rodada: `design/bak_impl5/`. A de antes da rodada 4: `design/bak_impl4/`.
- **Não mexi** em `<m>/app.js`, `<m>/index.html` nem nos dados.

**Build:** rodou só em `/home/claude/esc_test`, com cópias reais das matérias. `res/` é link só leitura. **Falta rodar `python3 design/gera_design.py` em escadas-sc.**

**Prints:** ficam em `design/depois5/`.
- Tamanhos: 1366×768 e 1920×1080 no claro, 1366 no escuro (`*_esc_*`) e 390×844.
- Caixinha do dicionário: `*_dic_*.png`.
- Telas avulsas: `*_x_*.png`.
- Animação: `anim/`.

## Parte A: conferência (o agente anterior parou no meio)
| Item | Situação |
|---|---|
| 1. Ícones realistas de conteúdo | **Ok.** Os 255 de `icones_real/sub/` e o `M-OUTRO` (`OUTRO`) entram pelo `REAL`. Aparecem como objeto solto, sem ladrilho (`img.ic-sub`); o ladrilho ficou só para o `svg.ic-sub` de reserva. Aparecem em: Conteúdos relacionados, O que você vai encontrar, Revisão (Próximos 7 dias e vencidas), Desempenho, cabeçalho do flashcard, teoria por conteúdo e da questão, e busca. Na Atividade recente e na busca do shell entra uma miniatura WebP de 64 px; o shell foi para 1,33 MB. |
| 2. Revise por área | **Ok.** Usa o realista do 1º módulo da área (`icArea`). |
| 3. Simulados | **Ok.** Por universidade, um selo dourado desenhado no próprio app, com o nome em texto: "VUNESP" para São Camilo e Unesp e "FUVEST" para Fuvest, mais a linha "Prova aplicada pela …". Não é logo de nenhuma instituição. Por objetivo, um objeto para cada: cronômetro, montanha, alvo, borracha e calendário. |
| 4. Sem ícone no título | **Ok.** O `ad-glifo` saiu do `<h1>` das 4 matérias. |
| 5. P02 (martelo no bloco) | **Ok.** O cache das miniaturas agora compara pelo md5. Conferi que o SVG novo está no `por/app.js` do build e que ele aparece em Português (print `1920_por_02_areas`). |
| 6. Resolução animada | **Ok.** A escrita é revelada em `clip-path` contínuo com `cubic-bezier(.4,0,.2,1)`, sem `steps`. Medido: o recorte foi de 29% para 1,8% para 99% para 44%. O trecho seguinte começa com o anterior em 75%. O passo entra com fade e deslize de 0,38 s. As pausas são curtas e proporcionais ao texto. A velocidade base é 1,2× e o botão multiplica por cima. Pausar, voltar, avançar, velocidade e Ver tudo continuam; com movimento reduzido, tudo aparece de uma vez. |

## Parte B: dicionário (`materia.js`, bloco "DICIONARIO"; `materia.css`, fim do arquivo)
### Onde marca
Só no texto de ensino:
- resolução inteira (`#q-corpo .resolucao`): "Em uma olhada", antes, passos, resposta, confira, erradas e armadilha;
- conceito do veredito;
- cartões de teoria (`.ad-cartao`) e resumo antigo;
- flashcards: resposta-modelo (`.ad-fl-cmp .mod`) e "Cuidado".

### Onde nunca marca
- Só percorre **nós de texto**, então não toca em atributo, `<img>` nem `src` base64.
- Pula: `code`, `.conta`, `.formula`, caderno, `button`, `a`, títulos h1–h6, `summary`, `svg`, `figure`, rótulos (Pede/Decide, tipo do passo, "Você marcou esta", "A armadilha"), a barra da animação e o termo já definido na própria lista de símbolos (`.simbolos dt`).

### Como casa
- **Palavra inteira.** Hífen colado em letra também conta como parte da palavra, para "pós-modernismo" não marcar "modernismo".
- **Caixa.** Forma com maiúscula casa só com a maiúscula exata, então "PA" não casa "pa". Forma toda minúscula casa em qualquer caixa.
- **Acentos.** Exatos, com o texto normalizado em NFC. Os algarismos casam com o subscrito (NH3 = NH₃, porque Química converte as fórmulas) e `+` casa com `⁺`.
- **Sobreposição.** A forma mais longa vence.
- **Repetição.** Só a 1ª ocorrência de cada termo por bloco (p, li, dd, armadilha…).
- **Contexto.**
  - "Kc" não marca na resolução da constante crioscópica, como anotou o revisor de Química.
  - "combinação" e "moda" só marcam se o bloco for de contagem ou estatística ("Nenhuma combinação dos fatores…" ficou de fora).

### Glossário antigo
`button.gl` cujo texto existe no dicionário vira texto comum e é marcado pelo novo. Os termos que só existem no antigo continuam como estavam.

### A caixinha
- **Aparência.** Até 320 px, fonte de 14 px, sombra suave, seta apontando a palavra (na linha certa, se o termo quebra em duas). Fica abaixo ou acima do termo e presa dentro da tela.
- **Conteúdo.** Termo em negrito; "O que é"; "Origem" num fundo leve da cor da matéria, porque é o que mais ajuda nas siglas; "Exemplo" em itálico.
- **Mouse.** Abre em 250 ms. Some 220 ms depois de o mouse sair, com tolerância para levar o mouse até a caixa.
- **Toque.** Tocar abre; tocar no mesmo termo ou fora fecha.
- **Teclado.** O termo tem `tabindex=0` e `role=button`. O foco abre e Esc fecha. Enquanto a caixa está aberta, o termo recebe `aria-describedby="ad-dic-caixa"` (`role=tooltip`) e `aria-expanded`.
- **Rolagem.** A caixa acompanha a rolagem.
- **Tema escuro.** Tem versão própria.

## Testes (Playwright, servidor em 8766)
- **Erros:** 0 pageerror e 0 erro de console em 1366 claro, 1920 claro, 1366 escuro e 390, nas 4 matérias.
- **Progresso:** persiste ao recarregar (bio 1, qui 2, mat 2, por 1 antes e depois).
- **Rolagem horizontal em 390:** 0.
- **Passar o mouse nos termos pedidos:**
  - ADH: casou "hormônio antidiurético" e mostra ADH;
  - Kps e CNTP;
  - MMC e apótema;
  - metonímia.

  Em todos:
  - a caixa não abre antes de 250 ms e está aberta aos 650 ms;
  - mede 320 px, com fonte de 14 px, dentro da tela;
  - `aria-describedby` certo;
  - continua aberta quando o mouse vai até ela e fecha quando ele sai;
  - abre com o foco e fecha com Esc.

  No celular, o toque abre, tocar de novo fecha e tocar fora fecha.
- **ANP não aparece em nenhum texto exibido de Biologia:** nem resolução, nem teoria, nem flashcard, nem enunciado. Só existe no dicionário e como lixo dentro de imagem base64, que não é marcada. Por isso foi testado numa frase de teste dentro de uma resolução aberta (`*_bio_dic_ANP.png`).
- **Flashcard:** resposta-modelo marcada nas 4 matérias, com print da caixinha na "cadeia respiratória".
- **Palavras comuns:**
  - Amostrei 20 resoluções por matéria, num total de 601 marcas, e varri o banco inteiro listando as formas curtas e as que são palavra comum, com o contexto.
  - Corrigi o que estava errado: "combinação" no sentido comum, Kc crioscópico, sufixo hifenizado e o termo repetido na lista de símbolos.
  - Restam usos discutíveis, mas coerentes com a definição: "log" com base escrita; "seção transversal", que a definição cobre; "Inferir" no "Pede", que está nos dados de Português.

## Pendências
- Rodar o build em escadas-sc (`python3 design/gera_design.py`).
- Se o dono quiser menos marcas por resolução (hoje são de 6 a 9), dá para limitar a N por resolução. Não fiz porque o pedido foi "1ª ocorrência por bloco".

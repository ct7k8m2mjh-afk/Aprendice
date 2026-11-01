# Implementação 6: resoluções mais diretas (30/10/2026)

**Arquivos editados:** só `design/materia.js` e `design/materia.css`. Os dados, `<m>/app.js` e `<m>/index.html` ficaram como estavam.
- Cópia de antes desta rodada: `design/bak_impl6/`.
- **Build:** rodou só em `/home/claude/esc_test`, que tem cópias reais das matérias (só `res/` é link). **Falta rodar `python3 design/gera_design.py` em escadas-sc.**
- **Prints:** `design/depois6/` (depois) e `design/depois6/antes/` (antes), em 1366×768 claro e 390×844.
  - `_a_vista`: o que aparece na tela.
  - `_b_longo`: o painel inteiro, costurado rolando a tela.
  - `_c_aberto`: o mesmo painel com tudo o que estava recolhido aberto.
  - Nos longos de 390, o cabeçalho fixo aparece repetido. Isso é efeito da costura das imagens, não do app.

## O que mudou (seção 5a da auditoria, 12 itens)
Tudo acontece na função `enxuga()`, chamada pelo `arranja()` no momento em que a resolução entra no painel.

Ordem nova da resolução: Resposta → "Por que a alternativa X não serve" (quando errou) → Observação → figura → Em uma olhada → Antes de tudo → Passo a passo → Confira → Por que as outras → Armadilha.

| # | Item | Como ficou |
|---|---|---|
| 1 | Resposta no topo | Logo abaixo do veredito, sempre. |
| 2 | Armadilha repetida | Quando 50% ou mais das palavras de conteúdo do "cuidado" estão na armadilha, ela fica escondida. No fim do "cuidado" aparece o link "Ver a armadilha completa", que a abre logo abaixo. Se a armadilha cita a letra que o aluno marcou, ela continua aparecendo (foi o caso de qui P1355857). |
| 3 | "Antes de tudo" | **Acertou:** vira um item recolhido, "Antes de tudo · teoria de base", com a contagem "3 fórmulas · 5 termos". **Errou:** as fórmulas ficam à vista, e o texto e os termos vão para "Teoria de base". |
| 4 | Por que as outras | **Acertou:** recolhido, com "4 alternativas". **Errou:** a letra marcada continua aberta no topo (camada anterior) e as demais ficam recolhidas, com "ver as outras 3". |
| 5 | Modo curto | Vale para questão de dificuldade até 3 acertada. Mostra o veredito, a Resposta e o "Em uma olhada". Abaixo vem o botão "Ver a resolução completa · N passos, teoria e alternativas". Ao abrir, a animação dos passos começa normalmente. |
| 6 | Largura da linha | Texto limitado a 68ch. |
| 7 | "Por que" longo | Quando passa de 40 palavras, mostra 2 linhas e o link "por quê, completo", que vira "mostrar menos". No passo que está sendo animado, o texto aparece inteiro. |
| 8 | Resultado da conta | Em conta de uma linha com número, o trecho depois do último `=`, `→` ou `≈` ganha marca-texto. Só quando esse trecho tem até 36 caracteres; frase longa depois de `→` não é marcada. A marcação foi feita dentro de `fatia()`, então funciona com a animação. |
| 9 | Passo sem conta | O "por que" ganha a moldura de caderno, mas mantém a letra de leitura. |
| 10 | Chip honesto | "calcular" não aparece quando a conta não tem número nem `=`. |
| 11 | Observação | Sobe para o topo, depois da Resposta (e do "sua não serve", quando o aluno errou). |
| 12 | Glossário duplicado | Sai da lista de termos aquele que já está marcado no texto do "Antes", como caixinha do dicionário ou como `button.gl`. A definição continua a um toque. **Divergência:** a regra da auditoria ("aparece no texto") não foi aplicada, porque aparecer no texto não quer dizer estar definido, e assim se perderia conteúdo. Exemplo: qui P1355857 passou de 4 para 3 termos, porque "massa molar" saiu. |

Nada é apagado. Todo bloco recolhido é um `<details>` ou um botão com `aria-expanded`. A caixinha do dicionário continua funcionando dentro dos recolhidos, e `summary` e botão ficam fora da marcação.

## Testes (Playwright, porta 8766, `scratchpad/i6/res6.js`)
- **Casos:** 17 resoluções, 4 ou 5 por matéria: fácil acertada, difícil errada, difícil acertada, com figura e com Observação. Testado em 1366 claro e em 390.
- **Erros:** 0 pageerror e 0 erro de console nos dois tamanhos, antes e depois.
- **Progresso:** persiste ao recarregar (5, 4, 5, 3).
- **Palavras à vista, com os passos completos:**

  | caso | antes | depois |
  |---|---|---|
  | fácil acertada | 506–636 | 67–85 |
  | difícil acertada | cerca de 580–755 | 430–524 |

  Com tudo aberto, o total volta ao de antes ou passa um pouco dele, porque os passos completos entram na conta. Isso confirma que nenhum conteúdo foi perdido.
- **Animação:** a barra (Assistir, Pausar, Ver tudo) funciona nos casos completos. No modo curto, ela é montada só ao abrir.
- **Dicionário:** continua marcando, inclusive dentro de "Teoria de base".

## Pendências
- Rodar o build em escadas-sc.
- O "por que a sua não serve" vem antes da Observação. Se o dono preferir a Observação logo depois da Resposta, basta trocar a ordem em `enxuga()`.

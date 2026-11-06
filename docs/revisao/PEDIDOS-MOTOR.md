# Pedidos ao motor de animação (revisão em slides)

Quem pede: a revisão em slides (comandos 24 e 26, fase 1). Quem atende: o agente do motor único
(`app/src/ui/motorAnima.ts`, `app/src/ui/ResolucaoAnimada.tsx`, `app/src/logica/motorConta.ts`).
A revisão NÃO edita esses arquivos: usa só a API pública (`ResolucaoAnimada`, `type Controle`). Cada pedido abaixo já tem
o lado da revisão pronto; quando o motor atender, basta trocar a ligação indicada.

## 1. Cena animada dos slides (`visual.movimento`)
- **Hoje (depois da auditoria da rodada 1, A1):** o roteiro de produção (`visual.movimento`, `visual.descricao`) NUNCA
  aparece para o aluno. O motor anima o que existe de verdade no slide: a imagem entra (`animaEntrada`) e a fórmula e a
  frase-chave são escritas à mão (`animaEscrita`), além da conta do exemplo (`animaPasso`). Cenas desenhadas (carro,
  pista, eixos, gráfico que se desenha, mapa, linha do tempo) ainda não existem, porque o JSON descreve a cena em texto
  livre; slide sem imagem fica só com o texto, a fórmula e a conta.
- **Pedido:** uma função do motor `animaCena(el: HTMLElement, cena: Cena, vel?: number): Controle` que desenhe em SVG
  objetos simples (móvel, pista com régua, eixo com reta/parábola, área sob a curva, seta de vetor, relógio, velocímetro)
  e anime cada passo do roteiro, com a mesma regra de ouro do motor (DOM final, só transform/opacity/clip-path).
- **Dado que falta:** um campo estruturado `visual.cena` nos JSON (objetos, posições, valores por passo). Proposta para a
  fábrica: `{"objetos":[{"id":"carro","tipo":"movel","x0":0}], "eixos":{"x":"t (s)","y":"v (m/s)"}, "passos":[{"move":"carro","ate":40,"dur":1.2,"rotulo":"40 m"}]}`.
- **Inglês (comando 28):** a linha do tempo dos tempos verbais é o visual principal de I04; pedido igual: primitiva
  "linha do tempo" (eixo passado–agora–futuro, marcos, intervalo, ponto) animada pelo motor a partir de `visual.cena`.
- **Ligar:** em `app/src/ui/revisao/SlideRevisao.tsx`, quando `visual.cena` existir, montar `<svg>` na coluna do visual e
  chamar `animaCena` (mesma interface `Controle` de `animaEntrada` e `animaEscrita`).

## 2. Índice com letras sem forma Unicode na conta (`f_{cat}`, `v_y`, `f_{roda}`) — ATENDIDO
- 06/11/2026: o tokenizador aceita `v_{mín}` inteiro e `latexParaMotor` escreve todo índice como `_{…}`; o motor desce o
  índice na mesma letra à mão (logica/notacao.ts). Os exemplos de F02.5 e F02.6 passaram a ir ao motor.
- **Hoje:** `latexParaMotor` (`app/src/logica/latex.ts`) devolve `null` quando a conta tem índice que não existe em
  Unicode (c, d, y...). O slide mostra então os passos com `Formula` (fração empilhada, índice em `<sub>`), um passo de
  cada vez, sem os termos se moverem. Casos em F02: exemplo de F02.5 (`v_y`) e de F02.6 (`f_{cat}`, `f_{roda}`).
- **Pedido:** o tokenizador do motor aceitar índice escrito como `f_{cat}` (ou `f_cat`) e desenhá-lo em `<sub>`.
- **Ligar:** em `latexParaMotor`, trocar o `ok.v = false` do índice sem Unicode por `_{...}`.

## 3. Fração dentro de fração
- Nenhum caso em F02. Se aparecer, `latexParaMotor` devolve `null` e o slide usa a mesma saída do pedido 2.

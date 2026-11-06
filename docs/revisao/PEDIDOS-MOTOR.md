# Pedidos ao motor de animação (revisão em slides)

Quem pede: a revisão em slides (comandos 24 e 26, fase 1). Quem atende: o agente do motor único
(`app/src/ui/motorAnima.ts`, `app/src/ui/ResolucaoAnimada.tsx`, `app/src/logica/motorConta.ts`).
A revisão NÃO edita esses arquivos: usa só a API pública (`ResolucaoAnimada`, `type Controle`). Cada pedido abaixo já tem
o lado da revisão pronto; quando o motor atender, basta trocar a ligação indicada.

## 1. Cena animada dos slides (`visual.movimento`)
- **Hoje:** `app/src/ui/revisao/RoteiroAnimado.tsx` toca o roteiro `visual.movimento` em cena: um passo de cada vez,
  na ordem do arquivo, com os números do passo marcados na cor da matéria, tocar/pausar/recomeçar, linha do tempo por
  passo e "reduzir movimento" mostrando tudo. Não desenha os objetos (carro, pista, eixos), porque o JSON descreve a
  cena em texto livre (`visual.descricao`) e não há primitivas de cena no motor.
- **Pedido:** uma função do motor `animaCena(el: HTMLElement, cena: Cena, vel?: number): Controle` que desenhe em SVG
  objetos simples (móvel, pista com régua, eixo com reta/parábola, área sob a curva, seta de vetor, relógio, velocímetro)
  e anime cada passo do roteiro, com a mesma regra de ouro do motor (DOM final, só transform/opacity/clip-path).
- **Dado que falta:** um campo estruturado `visual.cena` nos JSON (objetos, posições, valores por passo). Proposta para a
  fábrica: `{"objetos":[{"id":"carro","tipo":"movel","x0":0}], "eixos":{"x":"t (s)","y":"v (m/s)"}, "passos":[{"move":"carro","ate":40,"dur":1.2,"rotulo":"40 m"}]}`.
- **Ligar:** em `RoteiroAnimado.tsx`, quando `visual.cena` existir, montar `<svg>` e chamar `animaCena` no lugar do
  palco de texto (o controle de tocar/pausar já usa a interface `Controle`).

## 2. Índice com letras sem forma Unicode na conta (`f_{cat}`, `v_y`, `f_{roda}`)
- **Hoje:** `latexParaMotor` (`app/src/logica/latex.ts`) devolve `null` quando a conta tem índice que não existe em
  Unicode (c, d, y...). O slide mostra então os passos com `Formula` (fração empilhada, índice em `<sub>`), um passo de
  cada vez, sem os termos se moverem. Casos em F02: exemplo de F02.5 (`v_y`) e de F02.6 (`f_{cat}`, `f_{roda}`).
- **Pedido:** o tokenizador do motor aceitar índice escrito como `f_{cat}` (ou `f_cat`) e desenhá-lo em `<sub>`.
- **Ligar:** em `latexParaMotor`, trocar o `ok.v = false` do índice sem Unicode por `_{...}`.

## 3. Fração dentro de fração
- Nenhum caso em F02. Se aparecer, `latexParaMotor` devolve `null` e o slide usa a mesma saída do pedido 2.

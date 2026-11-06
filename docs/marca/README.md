# Marca do Aprendice

Logotipo e animação de abertura usados no protótipo, separados do app para servir de referência.

**Fonte de verdade no código:** `app-atual/design/marca/logo.json`:
- `d` é o contorno preenchido do logotipo, com o miolo do "A" e do "d" preenchidos;
- `t` são os traços da caneta usados na animação.

O código da animação fica em `app-atual/design/shell.html`, no bloco "logotipo Aprendice". A arte original (letra cursiva) está em `app-atual/design/marca/aprendice.png`. O vetor redesenhado é a versão oficial.

## Arquivos

| Arquivo | Uso |
|---|---|
| `aprendice-logo.svg` | Logotipo em tinta escura `#17181C`, para o tema claro |
| `aprendice-logo-branco.svg` | Logotipo em tinta clara `#EDEEF1`, para o tema escuro |
| `aprendice-logo-currentColor.svg` | Pega a cor do texto (`color`) e serve nos dois temas; é assim que o app usa |
| `aprendice-logo.png` e `aprendice-logo-branco.png` | PNG com 2400 px de largura e fundo transparente |
| `aprendice-logo-branco-fundo-preto.png` e `aprendice-logo-fundo-claro.png` | PNG 3000 × 1361 px com fundo sólido (`#0C0D10` escuro do app / `#F1F1EE` claro do app), para ver ou mandar sem depender de transparência |
| `aprendice-abertura.html` | Animação isolada; abre no navegador. Tem os botões Repetir e Tema e aceita `?tema=escuro` |
| `aprendice-abertura-computador-claro.mp4`, `aprendice-abertura-computador-escuro.mp4`, `aprendice-abertura-celular-claro.mp4` | Vídeos de referência a 60 fps |

## Como a abertura funciona

1. O fundo da tela cobre o app.
2. A palavra "Aprendice" é escrita à mão no centro, em velocidade constante, em cerca de 1,1 s. A largura é `min(560px, 70vw)`.
3. O traço vira o logotipo exato num fade cruzado de 220 ms. É aqui que o "A" e o "d" ficam preenchidos.
4. Depois de 260 ms, o logotipo voa para a barra lateral em 480 ms, com a curva `cubic-bezier(.65,0,.35,1)`, enquanto o fundo some em 420 ms. O logo da barra só aparece quando o que voa pousa.
5. Na tela estreita, sem barra lateral, a abertura some em fade de 300 ms.
6. Um clique pula a animação. Quem ativou "reduzir movimento" no sistema não vê a animação.

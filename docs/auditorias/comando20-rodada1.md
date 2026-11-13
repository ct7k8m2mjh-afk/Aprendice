# Auditoria do comando 20, rodada 1: correção em 4 blocos e motor único de animação

Auditor separado (não fez o trabalho). Data: 06/11/2026. Build local novo (`app/`, ramo `app-prototipo-completo`).

Referências conferidas: CLAUDE.md ("Como o site ensina", "A correção da questão", "Resolução animada (obrigatória)", princípios 8 e 9), DESIGN.md ("Correção da questão" e "Resolução animada"), protótipo `app-atual/design/materia.css` (`.ad-assistir`, `.ad-play2`, `.bloco.ad-tocando`) e `materia.js` (`preparaAnim`, "Assistir resolução").

Arquivos auditados: `app/src/ui/Resolucao.tsx`, `app/src/estilo/correcao.css`, `app/src/logica/motorConta.ts`, `app/src/ui/motorAnima.ts`, `app/src/ui/ResolucaoAnimada.tsx`.

Screenshots: todos em `/tmp/claude-0/-home-user-aprendice/aee5743b-68b8-515c-b692-c4a8e9011d85/scratchpad/aud20/shots/` (abaixo, `shots/` = essa pasta). O nome diz matéria, id, se errou ou acertou, largura, tema e o momento do quadro em ms depois de tocar (`-f900` = 0,9 s).

## Como foi feito

- `python3 scripts/converte.py`: a primeira execução falhou (arquivo `fmabc-2025/q/004.webp` sumiu no meio da conversão) porque havia três conversões rodando ao mesmo tempo no mesmo `public/conteudo` (outros agentes). Esperei as outras terminarem e usei a saída completa.
- `npx tsc --noEmit -p .`: sem erros.
- `npx vitest run`: `motorConta.test.ts` passa (18 de 18). As falhas restantes da suíte são de outros trabalhos em andamento (`revisaoSlides`, `conteudo`, `retiradas`), não do comando 20.
- `npx vite build` para a pasta da auditoria, servido com `python3 -m http.server 8931`.
- Playwright (Chromium), login `teste@exemplo.com`, tema escuro pelo botão "Noite". Questões respondidas errando e acertando:
  - Matemática: 857e13da (multiplicação cruzada), ef1a1d02 (cruzada), 14854ecf (termo trocando de lado), 7c57323e (divide), 907bcd2a (multiplica), Pe4abaf7 (cancelamento).
  - Química: Pd553910 e P134f0c1. Biologia: P0e6c3a7 e P76073a1. Português: Pa563c0a e P0194a23.
  - Simulado São Camilo 2024/2: Q21 a Q40 (Biologia, Química, Física e Matemática), em 1280 claro e 390 escuro, mais Q36 com quadros da animação.
- Larguras de 390, 768, 1280 e 1440 px, nos temas claro e escuro, com quadros intermediários da animação, teclado e `prefers-reduced-motion`.
- Para escolher as questões, contei as passagens que o motor reconhece em todas as resoluções (Mat 552, Quí 319, Bio 195, Por 407).

## O que está certo

- Só os 4 blocos aparecem, nesta ordem: "Por que eu errei", "Resposta correta" com "A pegadinha", "Resolução animada" e "Por que as outras estão erradas". Conferido em todas as questões testadas, nas 4 larguras e nos 2 temas.
- "Por que eu errei" some quando o aluno acerta. "Por que as outras estão erradas" começa fechado, abre ao clicar e não repete a letra explicada no bloco 1.
- Medidas conferem com o DESIGN.md:
  - título dos blocos em Familjen 600 16px; explicação em Literata 17px com entrelinha 1,6;
  - resposta em Familjen 600 17px; blocos com 16/18px de padding e canto de 12px;
  - conta em Caveat 500 26px (21px em 390); papel e grade do protótipo;
  - fundos certo, errado e aviso nos dois temas.
- Não há rolagem lateral em nenhuma largura (`scrollWidth` = largura da tela em todos os casos).
- Movimentos que funcionam:
  - Termo atravessando o "=" com troca de sinal (14854ecf passo 4: o 43 vai em arco, em vermelho, e chega como "− 43"). Screenshot: `shots/mat-troca-148-p4-1280-claro-f900.png` e `-f1700.png`.
  - Cancelamento riscado (Pe4abaf7 passo 2). Screenshot: `shots/mat-cancela-Pe4-ok-1280-claro-fim.png`.
  - Fator que vai para o outro lado dividindo (7c57323e).
  - Q36 de São Camilo: o "passe o 43 para o outro lado" agora anima.
- Com `prefers-reduced-motion`, aparece direto o estado final, sem barra de controles. Screenshot: `shots/reduz-857-768-claro-correcao.png`.
- Teclado com o foco dentro da resolução: espaço toca e pausa, → avança um passo, e Enter num botão não aciona a próxima questão.

## Defeitos

Contagem: **7 de gravidade alta, 6 média, 6 baixa (19)**.

### Alta

**A1. Fração na mesma linha com "÷" e "/" (regra "fração sempre empilhada, nunca 3/5 ou 3 ÷ 5").**
O motor e o `comFracoes` só empilham "a/b". Toda divisão escrita com "÷", e as frações com espaço ("d = m / V"), saem na linha, na conta animada e nos textos dos blocos. Há 1 381 trechos "a ÷ b" nos `res/` das 4 matérias antigas.
- Matemática 857e13da (Razão e proporção), 1280 claro.
  - Passos: responder A e assistir.
  - Na conta: passo 3, "(47 + C) ÷ (272 − C) = 3 ÷ 8"; passo 5, "C = 440 ÷ 11 = 40".
  - No bloco "Por que eu errei": "72 ÷ 247 ≈ 0,29".
  - Screenshots: `shots/mat-cruz-857-err-1280-claro-fim.png` e `-correcao.png`.
- 907bcd2a, 390 claro: "Por que eu errei" mostra "(44 000 + 20 000) ÷ (15 400 + 1 200)", quebrado em duas linhas. Screenshot: `shots/mat-multiplica-907-p3-390-claro-correcao.png`.
- São Camilo 2024/2, ainda presente:
  - Q29: "240 ÷ 60", "1 ÷ 2" e, no bloco Resposta correta, "1 g ÷ 2^4".
  - Q31: "150 ÷ 400" nas erradas.
  - Q33: "d = m / V", "n/V = d / M" e "P/T".
  - Q34: "i / f = o / p" e "3 500 / 400 000 = 7 / 800".
  - Q35: "f₁ / f₅ = 330 / 110" (o "1/√μ" já sai empilhado).
  - Q36: "140 ÷ 4", "140 ÷ 8" e "140 ÷ 9".
  - Q37: "4 · 8 ÷ 2" e "7 · 2 ÷ 2".
  - Q39: "h = 8 ÷ 16".
  - Q40: "360 ÷ 4" e "(18·15 + …) ÷ (18 + 18 + 18)".
  - Screenshots: `shots/sc-1280-light-q29.png`, `q33`, `q34`, `q35`, `q36`, `q37`, `q39`, `q40`; também `shots/sc-390-dark-q40.png`.

**A2. A barra de controles da animação fica escondida durante a reprodução.**
A barra (Pausar, anterior, próximo, "Passo i de n", Recomeçar) tem `.ra-ctl { position: sticky; top: 6px; z-index: 3 }`. O topo do site (`.topo`, sticky, z 20) e a barra da questão (`.q-barra`, sticky em `--topo`, z 15) ficam por cima dela. Assim que a conta rola, o aluno não vê nem alcança Pausar.
- Passos: 857e13da em 1280 claro, Assistir e depois → até o passo 5. Screenshot: `shots/vp-857-1280-claro-vp1500.png`.
- O mesmo acontece em 390 escuro (907bcd2a). Screenshot: `shots/vp-907-390-escuro-vp1500.png`.
- Também visível em `shots/mat-cruz-ef1-p4-768-escuro-f900.png`.

**A3. A seta → leva para a próxima questão no meio da animação.**
O botão "Próximo passo" fica desabilitado no último passo, e o foco cai no `body`. A partir daí, → é tratado pelo atalho global da tela de questão (`telas/Questao.tsx`, `ArrowRight && revelado`). O mesmo vale para qualquer clique fora da `.ra`, e o espaço rola a página em vez de pausar.
- Passos: 857e13da em 1280 claro, responder B, Assistir, clicar "Próximo passo" 4 vezes e apertar →.
- Resultado: a URL muda de `#/m/mat/q/857e13da` para `#/m/mat/q/997a85b7?ctx=escada`.
- Screenshot: `shots/seta-corpo-857-1280-correcao.png`.

**A4. Biologia e Química não têm "animação do que acontece" (CLAUDE.md: processo, estrutura, reação, molécula, fluxo).**
Cada passo de texto só é revelado da esquerda para a direita e recebe o marca-texto. Não há nenhuma animação de processo. O DESIGN.md registra "nenhum desenho científico é feito por questão", o que contradiz o CLAUDE.md.
- Bio P0e6c3a7 (768 claro). Screenshot: `shots/bio-P0e6-err-768-claro-outras.png`.
- Quí Pd553910 (1440 escuro). Screenshot: `shots/qui-Pd55-err-1440-escuro-f1200.png`.
- Quí P134f0c1 (390 claro).
- São Camilo Q21 a Q26. Screenshots: `shots/sc-1280-light-q21.png` a `q26.png`.

**A5. Contas que não se movem (CLAUDE.md: "toda conta em Física e Química" com termos se movendo).**
O motor só reconhece passagens em parte das resoluções:
- Química: 212 de 319 resoluções com conta não têm nenhuma passagem animada, e as demais só têm "resultado" (nunca troca de lado, divisão ou cruzada).
- Matemática: 93 de 552 sem nenhuma passagem.
- São Camilo:
  - Física Q31 a Q34: nenhuma passagem.
  - Q34 "i / f = o / p → … = 7 / 800 → 7 · f = 7,0 · 800" é multiplicação cruzada e não anima.
  - Q40 "corte o 18 de cima e de baixo" não risca nada.
  - Q27 e Q28 (Química): nenhuma.
- Passos: São Camilo, Q34, assistir. A conta só é escrita, nada viaja. Screenshot: `shots/sc-1280-light-q34.png`.

**A6. Os termos que voam aparecem em outra letra e outro tamanho, e duplicados.**
Na "conta feita" e no sinal que troca no meio do caminho, `motorAnima.ts` (`fantasma`) copia `getComputedStyle(base).font`. No Chromium esse valor vem vazio (`""`), conferido na página. Por isso o fantasma herda Familjen 16px em vez de Caveat 26px: os números voam pequenos, em letra de interface, e viram letra à mão ao chegar. Quando o mesmo pedaço alimenta vários resultados encadeados, aparecem cópias soltas ("N N N", ") ) )", "30 30 30").
- Passos: ef1a1d02 em 768 escuro, Assistir e → até o passo 5. Ver o quadro de 3,7 s: `shots/mat-cruz-ef1-p4-768-escuro-f3700.png`.
- 907bcd2a em 390 claro: "22000000 000" miúdo e embaralhado. Screenshot: `shots/mat-multiplica-907-p3-390-claro-f3700.png`.

**A7. Notação de texto cru e fórmulas sem índice na correção (relatório do comando 07; continua).**
- Expoente com "^":
  - Q29: "10^−2" e "10^−1" no caderno, e "2^4" e "10^−2" no bloco Resposta correta.
  - Q30: "SO4^2−".
- Índice com "_": Q39 "V_R" e Q32 "F_R".
- Fórmulas sem subscrito:
  - Q30: "C6H12O6", "H2SO4", "Na2SO4", "H+" e "Cl−".
  - Q27: "HS–CH2–CH2–CH(NH2)–COOH".
  - Q29: "m0".
- Screenshots: `shots/sc-1280-light-q29.png`, `q30.png`, `q27.png` e `q32.png`; também `shots/sc-390-dark-q39.png`.

### Média

**M1. Marca-texto no termo errado.**
- Q37: na linha "Área(PQRS) = Área(SPQ) + Área(SQR)", a marca cai em "SQ" dentro de "SQR" (continua). Screenshot: `shots/sc-1280-light-q37.png`.
- Q35: a marca cai em "3²" no meio de "μ₅ = 3² · μ₁". Antes era só o "²". Screenshot: `shots/sc-1280-light-q35.png`.
- Q40: as marcas caem em "18·" (em "média = 18·(15 + 16 + 17) ÷ (18·3)") e em "÷ 3" (em "média = (15 + 16 + 17) ÷ 3"). Screenshot: `shots/sc-390-dark-q40.png`.
- Pe4abaf7 passo 5: em "x = 5π/3" a marca só cobre a metade de baixo da fração empilhada. Screenshot: `shots/mat-cancela-Pe4-ok-1280-claro-fim.png`.
- Q29, linha "240 ÷ 60 = 4": a marca no "4" de "240" saiu, mas o resultado 4 ficou sem marca.

**M2. "μ", "√", "∝" e os índices "₁ ₅" fora da Caveat (continua).**
O `unicode-range` da Caveat não cobre U+03BC, U+221A, U+221D nem U+2080 a U+2089. O navegador troca a letra no meio da conta.
- Passos: São Camilo Q35, "Ver sem animação". Screenshot: `shots/sc-1280-light-q35.png`.

**M3. A linha da conta quebra no meio de um termo ou de um parêntese.**
`overflow-wrap: anywhere` com termos em `inline-block` permite essas quebras:
- Pe4abaf7 passo 5 em 1280: "x = 0, x" / "= π". Screenshot: `shots/mat-cancela-Pe4-ok-1280-claro-fim.png`.
- Q40 em 390: "÷ (" / "18 + 18 + 18)" e "0,4 × 360" / "= 144". Screenshot: `shots/sc-390-dark-q40.png`.
- 907bcd2a em 390: "(7k +" / "1 200)". Screenshot: `shots/vp-907-390-escuro-vp1500.png`.
- 857e13da em 768: "=" / "40" (o resultado fica sozinho na linha). Screenshot: `shots/reduz-857-768-claro-correcao.png`.
- A unidade sozinha da Q39 (cm³ e cm²) **não** acontece mais em 390. Screenshot: `shots/sc-390-dark-q39.png`.

**M4. Em 390, a barra de controles quebra em duas linhas.**
"Recomeçar" e "n de n passos" descem para uma segunda linha, desalinhados.
- Passos: São Camilo Q39 ou Q40 em 390 escuro, depois do fim da animação. Screenshots: `shots/sc-390-dark-q39.png` e `shots/sc-390-dark-q40.png`.

**M5. Os termos em voo passam por cima de títulos e explicações de outros passos.**
Os termos atravessam a explicação do passo anterior e o título do passo atual:
- o "N" sobre "Isole o N";
- o "43" sobre "Dividendo = divisor…";
- o "C" sobre o "porque" do passo 3 em 857e13da.

Não há um caminho que desvie do texto nem um fundo que separe o termo do que está embaixo.
- Passos: 14854ecf em 1280 claro, → até o passo 4. Screenshot: `shots/mat-troca-148-p4-1280-claro-f900.png`.
- 857e13da. Screenshot: `shots/mat-cruz-857-err-1280-claro-f24000.png`.

**M6. Funções do "Assistir resolução" do protótipo que sumiram (princípio 8: "nada volta atrás").**
- O controle de velocidade da escrita (0,75×, 1×, 1,5× e 2×, guardado em `ad-vel`) não existe.
- "Pular para o quadro final" durante a reprodução também não existe. "Ver sem animação" só aparece antes de tocar.
- Referência: `app-atual/design/materia.js`, `preparaAnim`, barra `.ad-play2`.

### Baixa

**B1. Aviso no console "Invalid keyframe value for property color: undefined".**
Aparece em toda "conta feita": `motorAnima.ts`, quadro com `color: cruza ? caneta : undefined`. Aparece em todas as questões de Matemática testadas e em Bio P76073a1.

**B2. O botão "Assistir resolução" difere do protótipo.**
No protótipo (`.ad-assistir .btn`): padding de 13/22px e sombra `--sombra-pri`. Aqui: altura mínima de 46px e sombra de 0 1px 2px. Screenshot: `shots/mat-cruz-857-err-1280-claro-correcao.png`.

**B3. "Por que as outras estão erradas" usa o triângulo padrão do navegador (▶/▼).**
É um glifo do navegador, não um ícone Lucide de traço 1,75. Screenshot: `shots/bio-P0e6-err-768-claro-outras.png`.

**B4. Marca-texto incompleto.**
Na última linha de Bio P0e6c3a7 ("hipertônica = 3."), a marca cobre só parte do "3". Screenshot: `shots/bio-P0e6-err-768-claro-outras.png`.

**B5. A fração empilhada dentro de texto corrido abre a entrelinha.**
A linha com a fração fica mais alta que as outras. Exemplo: 857e13da, "A razão 3/8 compara…" no bloco "Por que eu errei". Screenshot: `shots/reduz-857-768-claro-correcao.png`.

**B6. Quadro intermediário com termos sobrepostos e ilegíveis.**
Em 14854ecf, passo 3, aparecem "5O8" e "+ r±r": o termo que escorrega encosta no que está sendo escrito. Screenshot: `shots/mat-troca-148-err-1280-escuro-f16000.png`.

## Itens do relatório `rodada-comando07.md` (São Camilo 2024/2), conferidos no build local novo

| Item | Situação |
|---|---|
| Frações em linha com ÷ ou / (q29, 31, 33 a 37, 39, 40) | **Continua** em todas (A1). Na Q35, só "1/√μ" passou a empilhar. |
| "10^−2", "2^4", "SO4^2−", "V_R" | **Continua** (A7). Também "F_R" na Q32. |
| Fórmulas sem subscrito (H2SO4, C6H12O6, CH2, NH2, m0) | **Continua** (A7). |
| Destaque no termo errado: q29 "4" de "240" | **Corrigido**, mas o resultado 4 ficou sem marca (M1). |
| Destaque no termo errado: q37 "SQ" dentro de "SQR" | **Continua** (M1). |
| Destaque no termo errado: q35 só o "²" | **Continua com outro erro:** agora marca "3²" no meio da linha (M1). |
| Unidade sozinha na linha em 390 (q39 cm³/cm²) | **Corrigido.** Mas há novas quebras no meio de termos e parênteses (M3). |
| "μ" e "√" em outra fonte (q35) | **Continua** (M2). |
| Bio e Quí (q21 a q26) e Física (q32) só texto | **Continua** (A4, A5). |
| Q36 "passe o 43" sem movimento | **Corrigido:** o 43 atravessa com troca de sinal. |
| Q40 "corte o 18" sem risco | **Continua** (A5). |
| Q34 "multiplique cruzado" sem movimento | **Continua** (A5). |

## Observações fora do escopo do comando 20 (para o dono decidir)

- **Cor de Matemática:** o CLAUDE.md diz "Matemática verde-água", mas o site usa azul-marinho `#1F3FA6` (DESIGN.md, tabela de paleta; `materias.ts`). O botão "Assistir resolução" em Matemática sai azul.
- **Conversões ao mesmo tempo:** três `converte.py` rodando juntos sobre o mesmo `public/conteudo` deixam a pasta incompleta e quebram os testes. Rodar uma conversão por vez.

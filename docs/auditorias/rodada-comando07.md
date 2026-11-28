# Auditoria do comando 7: resoluções São Camilo 2024/2 com caderno animado

- Data: 06/11/2026. Auditor separado, que não fez o trabalho.
- Onde: site publicado https://aprendice.vercel.app, em `#/simulados/prova/saocamilo-2024-2`, no modo "Resolução após cada resposta". Para cada questão foi marcada uma letra errada, para ver também o bloco "por que a letra marcada parece certa".
- Como: Playwright com Chromium, entrando com teste@exemplo.com. Larguras 390 e 1280, tema claro e escuro (botão "Tema escuro"; `data-theme=dark` conferido). São 160 telas no total.
- Formato avaliado: o que está no ar hoje, anterior à correção em 4 blocos do comando 20.
- Screenshots: `/tmp/claude-0/-home-user-aprendice/aee5743b-68b8-515c-b692-c4a8e9011d85/scratchpad/aud07/`. Os arquivos seguem o padrão `<largura>-<tema>-qNN.png` (página inteira) e `<largura>-<tema>-qNN-quadro.png` (caderno ao fim da animação). Os dados brutos estão em `<largura>-<tema>.json`.

## O que passou (as 4 combinações de largura e tema)

| Item | Resultado |
|---|---|
| Resolução presente | 40 de 40 |
| Gabarito exibido ("A resposta é X" e a alternativa marcada como certa) | 40 de 40 batem com `app/conteudo-fonte/provas/saocamilo-2024-2/prova.json` e com o PDF oficial da Vunesp (CUSC2302, versão 1), baixado e conferido: EAECD BAEBC DCCBA EBDEC CADBB AECDA CAEBD ACEBD |
| "De onde vem cada alternativa errada" | 4 itens em todas as questões |
| Caderno animado | Existe nas questões 27, 28, 29, 30, 31, 33, 34, 35, 36, 37, 38, 39 e 40. Roda até o fim em todas, entre 6 e 17 segundos, e termina com o botão "Recomeçar" |
| Última linha do caderno cortada | Nenhuma, em 390 e 1280, claro e escuro. Nenhum ancestral corta a última linha e nenhuma linha passa da borda do caderno |
| Rolagem lateral | Nenhuma: `scrollWidth` é igual à largura da tela em todas as 160 telas, e nenhum elemento passa da borda direita |
| Erros no console | Nenhum, nem `pageerror` |

## Defeitos encontrados

Os defeitos valem para todas as larguras e temas, salvo quando a linha indica outra coisa.

1. **Fração na mesma linha, sem empilhar.** A regra do CLAUDE.md manda "fração sempre empilhada". No ar, as frações aparecem com "÷" ou "/" no caderno e no texto da resolução:
   - Q29: "240 ÷ 60 = 4", "1 ÷ 2 = 0,5 g" e "1 ÷ 16". Screenshot: `1280-claro-q29-quadro.png`.
   - Q31: "150 ÷ 0,25" e "15/60".
   - Q33: "d = m / V", "n/V = d / M" e "P/T".
   - Q34: "i / f = o / p" e "3 500 / 400 000 = 7 / 800".
   - Q35: "f ∝ 1/√μ" e "f₁ / f₅ = 330 / 110". Screenshot: `1280-claro-q35-quadro.png`.
   - Q36: "140 ÷ 4", "140 ÷ 8" e "140 ÷ 9". Screenshot: `390-escuro-q36-quadro.png`.
   - Q37: "4 · 8 ÷ 2" e "7 · 2 ÷ 2". Screenshot: `1280-claro-q37-quadro.png`.
   - Q39: "h = 8 ÷ 16".
   - Q40: "360 ÷ 4" e "(18·15 + …) ÷ (18 + 18 + 18)".
2. **Expoente e índice escritos como texto cru.**
   - Q29: "10^−2", "10^−1" e "2^4" no caderno e no texto. Screenshot: `1280-claro-q29-quadro.png`.
   - Q30: "SO4^2−". Screenshot: `1280-escuro-q30-quadro.png`.
   - Q39: "V_R", com sublinhado em vez de índice. Screenshot: `390-escuro-q39-quadro-quebra.png`.
3. **Fórmulas químicas sem subscrito e cargas sem sobrescrito.**
   - Q30: C6H12O6, H2SO4, Na2SO4, "H+" e "Cl−". Screenshot: `1280-escuro-q30-quadro.png`.
   - Q27: "HS–CH2–CH2–CH(NH2)–COOH". Screenshot: `1280-claro-q27-quadro.png`.
   - Q29: "m0", que deveria ser m₀.
4. **Destaque vermelho no lugar errado.**
   - Q29: na linha "240 ÷ 60 = 4", o destaque cai no "4" de dentro do "240", e não no resultado 4. Screenshot: `1280-claro-q29-quadro.png`.
   - Q37: na linha "Área(PQRS) = Área(SPQ) + Área(SQR)", o destaque cai em "SQ" dentro de "SQR", sem sentido para a conta. Screenshot: `1280-claro-q37-quadro.png`.
   - Q35: o destaque cai só no "²" de "(√μ₅)²". Screenshot: `1280-claro-q35-quadro.png`.
5. **Unidade separada do número em 390.** Na Q39, em 390 claro e escuro, "= 8" fica numa linha e "cm³" desce sozinho para a linha de baixo. O mesmo acontece com "= 25 / cm²", "= 9 / cm²" e "= 16 / cm²". Screenshot: `390-escuro-q39-quadro-quebra.png`.
6. **Letra trocada no caderno.** Na Q35, "μ" e "√" aparecem numa fonte diferente da escrita à mão (Caveat), e a diferença se vê no meio da conta. Screenshot: `1280-claro-q35-quadro.png`.
7. **A animação não move os termos.** O CLAUDE.md pede, para Matemática e para as contas de Física e Química, que cada passagem mova os termos na tela: o termo atravessa o "=" trocando de sinal, a divisão passa para o outro lado e o que se cancela é riscado. No ar, o caderno só escreve uma linha depois da outra.
   - Na Q36, "passe o 43 para o outro lado" aparece só como uma linha nova.
   - Na Q40, "corte o 18 de cima e de baixo" não risca nada.
   - Na Q34, "multiplique cruzado" não leva os números até onde são multiplicados.
8. **Biologia e Química sem animação.** As questões 21 a 26 (Biologia, e a 26 de Química) e a 32 (Física) não têm resolução animada, só texto. O CLAUDE.md exige animação do processo ou da estrutura em Biologia e Química. O comando 7 pedia o "caderno animado", que cobre as contas; a falta nessas questões fica registrada para o dono decidir.

## Resumo

Funcionamento: está em ordem. As 40 resoluções aparecem, os 40 gabaritos batem com o oficial, a animação roda até o fim sem cortar a última linha, e não há rolagem lateral nem erro no console.

Conteúdo e apresentação do caderno: há 8 grupos de defeitos, listados acima. Os principais são as frações na mesma linha (9 questões), a notação "^", "_" e as fórmulas sem subscrito (Q27, Q29, Q30 e Q39) e o destaque no lugar errado (Q29, Q35 e Q37).

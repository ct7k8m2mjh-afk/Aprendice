# Geometria básica: 20 questões de áreas e 20 de volumes (ENEM)

Pedido do dono (05/11/2026): questões básicas de geometria, 20 de áreas e 20 de volumes, só questões reais.

## O que entrou
- Dois conteúdos novos em Matemática, cada um com escada de 20 degraus (do mais fácil ao mais difícil):
  - **M08.6 — áreas básicas** (módulo M08, Geometria plana — áreas): retângulo, quadrado, triângulo, trapézio, círculo, conversão de unidades de área (m², cm², hectare), escala de área.
  - **M11.6 — volumes básicos** (módulo M11, Geometria espacial): paralelepípedo, cubo, cilindro, prisma, capacidade em litros, escala de volume.
- Todas são **questões de prova** do ENEM (2º dia, caderno 7 azul), com print fiel recortado do PDF oficial do INEP a 300 dpi e gabarito oficial do INEP. Campo `url` = PDF oficial.
- Cada uma tem resolução completa em `app-atual/mat/res/M08.6.json` e `M11.6.json`, com explicação de todas as alternativas erradas.
- Cartões de teoria novos em `teoria.M08.cartoes` e `teoria.M11.cartoes` (sub M08.6 e M11.6). Ícones 3D novos: `design/icones_real/foto3d/cenas/M08.6.py` (piso de ladrilhos com trena) e `M11.6.py` (bloco 3 × 2 × 2 de cubinhos) — só no protótipo; no site, subtema não tem ícone (pontinho na cor da matéria, `docs/icones/ONDE-USAR.md`).

## Revisão
Escrita por 4 agentes (lotes de 10); Lente A (fatos: cada questão resolvida de novo sem olhar a resolução, toda conta em Python, transcrição contra o print); Lente B (utilidade e estilo); Lente A de novo em tudo que a Lente B mudou. Nenhuma divergência de gabarito. Material e scripts em `docs/historico/geometria-basica/`.

## Lista

### M08.6 — Áreas básicas

| Degrau | Prova | Questão | Gabarito | id | O que cobra |
|---|---|---|---|---|---|
| 1 | ENEM 2014 | 173 | E | `a541e032` | Conversão de unidade de área: hectare (hectômetro quadrado) para metro quadrado, lembrando que em área o fator de conversão vai ao quadrado. |
| 2 | ENEM 2024 | 145 | D | `40ae97c0` | Diferença entre as áreas de dois retângulos: calcular cada área (comprimento × largura) e subtrair. |
| 3 | ENEM 2023 | 155 | D | `b33f37d1` | Área de uma moldura: área do quadrado externo menos a área do quadrado interno, achando o lado da piscina pela raiz da área. |
| 4 | ENEM 2011 | 140 | C | `dfc701ca` | Perímetro como restrição e área como critério: primeiro eliminar os retângulos cujo contorno passa de 180 m, depois escolher o de maior área entre os que sobram. |
| 5 | ENEM 2010 | 162 | D | `e4b913f4` | Porcentagem de área: o retângulo pequeno deve ter 4% da área da página inteira; com um lado conhecido, acha-se o outro. |
| 6 | ENEM 2015 | 155 | A | `8b92d632` | Área do círculo: achar o raio do círculo grande pela figura (soma de dois raios pequenos) e calcular o aumento como área nova menos a soma das duas áreas antigas. |
| 7 | ENEM 2019 | 142 | E | `d1b069b6` | Área de coroa circular: área do círculo maior menos a do menor, passando de diâmetro para raio antes de usar πr². |
| 8 | ENEM 2021 | 178 | C | `998247ed` | Conversão de hectare para m², subtração da área de ruas e divisão da área restante pela área de cada lote, seguida de soma em duas faixas de preço. |
| 9 | ENEM 2013 | 156 | A | `c10b7ce6` | Semelhança e área: triplicar o lado de um quadrado multiplica a área por 9; com a área total fixa, o número de placas fica dividido por 9. |
| 10 | ENEM 2016 | 156 | E | `8d55bf2f` | Área do quadrado e densidade (pessoas por m²) para contar o público inicial, somada ao crescimento por hora no intervalo de tempo certo. |
| 11 | ENEM 2015 | 144 | A | `0afe7355` | Comparar a área de um trapézio com a de um retângulo de mesma altura: (B + b) × h ÷ 2 contra base × altura. |
| 12 | ENEM 2020 | 140 | C | `38eca869` | Calcular quantas peças quadradas cobrem um piso retangular (área da sala ÷ área da peça) e escolher a combinação de caixas que dá esse número exato pelo menor preço. |
| 13 | ENEM 2009 | 140 | C | `8a7957c2` | Calcular que fração da área do terreno o quadrado ocupa e comparar com o limite de 6%, lembrando que ampliar o lado e ampliar a área são coisas diferentes. |
| 14 | ENEM 2009 | 169 | D | `6df7353a` | Área do trapézio aplicada à vazão: com a velocidade constante, a vazão é proporcional à área do corte da canaleta. |
| 15 | ENEM 2017 | 140 | C | `577e6266` | Montar as dimensões de um retângulo a partir de círculos enfileirados: o espaçamento vem do raio da borda e as pontas e a largura vêm do raio da base. |
| 16 | ENEM 2019 | 147 | B | `7005b0e9` | Área de figura composta: retângulo mais semicírculo, sem contar duas vezes a parte de baixo do círculo. |
| 17 | ENEM 2010 | 161 | E | `67c80c39` | Base média do triângulo: o triângulo formado pelos pontos médios MNC tem lados pela metade e área igual a um quarto da área de ABC. |
| 18 | ENEM 2024 | 151 | E | `43d5b5c0` | Escala de área: se os comprimentos são divididos por 200, as áreas são divididas por 200² = 40 000; depois converter m² para cm². |
| 19 | ENEM 2012 | 160 | B | `007e3626` | Área de região composta dividida em triângulos (base no segmento AC, altura até B ou D) e custo proporcional à área de cada material. |
| 20 | ENEM 2015 | 165 | B | `eba0e6af` | Área de setor circular como fração do círculo (60° é 1/6 da volta) e uma inequação com resposta em número natural. |

### M11.6 — Volumes básicos

| Degrau | Prova | Questão | Gabarito | id | O que cobra |
|---|---|---|---|---|---|
| 1 | ENEM 2010 | 146 | B | `c48f4d25` | Reconhecer que comprimento × largura × altura de um paralelepípedo mede o seu volume, e distinguir volume de área, massa e capacidade. |
| 2 | ENEM 2010 | 139 | B | `a42787dd` | Igualar o volume de um paralelepípedo ao de um cubo e achar a aresta do cubo pela raiz cúbica. |
| 3 | ENEM 2010 | 178 | D | `8927da55` | Volume de um sólido oco: volume do cubo externo menos o volume do cubo vazio interno. |
| 4 | ENEM 2015 | 178 | E | `77ee1aee` | Calcular um consumo total (pessoas × dias × consumo diário) e converter metros cúbicos em litros. |
| 5 | ENEM 2009 | 152 | E | `7d1b213d` | Converter quilômetros cúbicos em litros (1 km³ = 10⁹ m³ e 1 m³ = 10³ L) e comparar duas capacidades por divisão em notação científica. |
| 6 | ENEM 2012 | 158 | C | `ed42fec6` | Um objeto mergulhado desloca um volume de água igual ao seu; a subida do nível é esse volume dividido pela área da base do tanque. |
| 7 | ENEM 2020 | 168 | A | `0b88f380` | Bolinhas submersas deslocam água; o volume total delas deve ser igual ao volume da camada entre 8 cm e 15 cm no recipiente. |
| 8 | ENEM 2014 | 156 | E | `96a1c61b` | Escala aplicada a volume: cada medida real é 100 vezes a do projeto, então o volume real é 100³ vezes o do projeto. |
| 9 | ENEM 2010 | 168 | B | `0669e276` | Igualar o volume de meia esfera ao volume de um cone de mesmo raio e isolar a altura do cone. |
| 10 | ENEM 2025 | 170 | B | `9cbc2e51` | Volume do paralelepípedo em dm³ convertido em litros; as garrafas submersas ocupam espaço da água, e o número máximo vem de arredondar para baixo. |
| 11 | ENEM 2017 | 158 | C | `e1cfe0ad` | Escala de volume: se a escala de comprimento é 1 : 400, a de volume é 1 : 400³; depois converter cm³ para m³. |
| 12 | ENEM 2019 | 158 | C | `fa89338a` | Escala de volume (1 : 200 vira 1 : 200³), conversão de cm³ para litros e divisão pelo consumo diário. |
| 13 | ENEM 2022 | 174 | D | `ef09d5b3` | Conservação de volume: volume do cilindro dividido pelo volume de uma esfera (atenção a raio × diâmetro). |
| 14 | ENEM 2022 | 153 | C | `f2853c4f` | Com a altura fixa, o volume do cone é proporcional ao quadrado do raio; reduzir o volume a 81% reduz o raio a 90%. |
| 15 | ENEM 2022 | 169 | E | `8e4d3a99` | Volume do cilindro = área da base × altura; mudar o raio muda a área pelo quadrado (dobro do raio = quádruplo da área). |
| 16 | ENEM 2014 | 151 | D | `e34e79a5` | Mesmo volume com base maior: a área da base cresce pelo quadrado do fator (1,25² = 1,5625) e a altura cai na mesma proporção; depois expressar a redução em porcentagem. |
| 17 | ENEM 2016 | 136 | D | `b0245ad8` | Volume de sólido composto (cilindro + cone) e arredondamento para cima do número de viagens. |
| 18 | ENEM 2015 | 141 | C | `6aa6f914` | Volume do paralelepípedo e aumento percentual: o espaço que sobra é ocupado pela mistura de morango já expandida 25%. |
| 19 | ENEM 2023 | 144 | C | `b60997a0` | Vazão = volume que entra por hora; em cilindro, volume = área da base × variação do nível. |
| 20 | ENEM 2020 | 138 | B | `99879f9e` | Razão entre volumes = cubo da escala de comprimento; converter litros para cm³ antes de comparar. |

## Pendências para o produto público
- Os prints vêm do PDF oficial do INEP; antes da publicação, registrar a autorização de uso (CLAUDE.md, princípio 10).

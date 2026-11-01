# Ícones realistas dos módulos: licenças e atribuições

## Atribuição obrigatória (exibir nos créditos do app)

> Ilustrações de biologia e química: **Servier Medical Art, CC BY 3.0** (https://smart.servier.com, licença https://creativecommons.org/licenses/by/3.0/).

Os desenhos foram obtidos pelo repositório bioicons (https://github.com/duerrsimon/bioicons, pasta `static/icons/cc-by-3.0/*/Servier/`).
Alterações feitas (a CC BY 3.0 permite e pede que sejam indicadas):

| Ícone | Arquivo(s) Servier | Alteração |
|---|---|---|
| B01 | Oncology/normal-cell-1, Intracellular_components/golgi-3d-1, mitochondrium-orange, endoplasmatic-reticulum-rough-3d | composição: organelas posicionadas dentro da célula |
| B03 | Intracellular_components/mitochondrium-1 | girada |
| B04 | Genetics/chromosome-1 | cores das bandas trocadas por tons de Giemsa; girado |
| B07 | Human_physiology/heart-front | nenhuma |
| B08 | Human_physiology/brain-2 | coordenadas arredondadas (otimização) |
| B09 | General_items/summer | recorte da árvore (removidos céu, chão, sol e moldura) |
| B10 | Animals/anopheles | nenhuma |
| B12 | Animals/snail, General_items/mushroom | composição com folha desenhada no projeto |
| Q03 | Chemistry/erlenmeyer-purple | nenhuma |
| Q04 | Lab_apparatus/scale | nenhuma |
| Q05 | Chemistry/flask- (4) | nenhuma |
| Q06 | Chemistry/erlenmeyer-glass | balão de borracha desenhado no projeto sobre o gargalo |
| Q07 | Microbiology/bunsen-burner | chama desenhada no projeto |
| Q08 | General_items/stopwatch | nenhuma |
| Q10 | Chemistry/beaker-orange | líquido recolorido para água; termômetro desenhado no projeto |
| Q12 | General_items/waterbottle | tons do plástico levemente escurecidos |

Em todos: acrescentada sombra de contato, enquadramento quadrado e otimização SVGO.

## Gerados no projeto (sem restrição de terceiros)

- **Matemática (M01–M17), Português (P01–P12), Q01, Q02, Q09, Q11, B02, B05**: modelados em 3D com o motor do projeto
  (`design/gera_ilu3d.py`, o mesmo do livro e do gráfico aprovados, estendido em `icones_real/fonte_gerador/motor.py`).
  B05 é o DNA do próprio `gera_ilu3d.py`; P01 e P05 usam os livros de lá.
- **B06, B11** e a folha do B12: desenhados no projeto no mesmo acabamento da Servier.
- Geometria das moléculas B02 (glicose) e Q11 (benzeno): calculada com RDKit (BSD), apenas como dado numérico.
- Letras (calculadora, peças IN/ÚTIL, "Aa", "x", "+", "1,5 V", crase): contornos das fontes DejaVu (licença livre Bitstream Vera/DejaVu,
  que permite embutir), convertidos em `<path>`; o SVG não depende de fonte instalada.

## Como regenerar

`fonte_gerador/constroi.sh` (precisa do SVGO 3.3.2 em `SVGO`; os originais Servier usados ficam copiados em `fonte_gerador/orig_servier/`). Para buscar outros:

```
git clone --depth 1 --filter=blob:none --no-checkout https://github.com/duerrsimon/bioicons.git
# depois: git sparse-checkout set --no-cone <arquivos listados em mapa.json> && git checkout
```

## Conteúdos de Química (sub/Q01.1 … sub/Q12.5)

Mapa completo (fonte, arquivo original, licença e motivo de cada ícone): `sub/mapa_qui.json`. Gerador: `fonte_gerador/gera_qui_sub.py` (`constroi_sub_qui.sh`).

**Servier Medical Art, CC BY 3.0** (mesma atribuição obrigatória acima). Originais copiados em `fonte_gerador/orig_servier/`.

| Ícone | Arquivo(s) Servier | Alteração |
|---|---|---|
| Q02.4 | General_items/glass-cold-drink | bebida recolorida para água |
| Q03.1, Q05.4 | Microbiology/bottle-medium-green | líquido recolorido para incolor, tampas recoloridas, rótulo com texto (HCl, NaOH, 70%) |
| Q03.2 | Chemistry/mortar | cristais de CuSO4·5H2O desenhados no projeto |
| Q03.3 | Chemistry/testtube-yellow, Chemistry/pipette-plastic | composição; tubos alargados, líquido recolorido; precipitado e gota desenhados no projeto |
| Q03.4, Q05.3, Q05.5, Q08.4, Q08.5, Q09.1, Q09.2 | Chemistry/beaker-red | líquido recolorido; placas, tubos, eletrodos, cristais, ponte salina, voltímetro e lâmpada desenhados no projeto |
| Q03.5 | Chemistry/separating-funnel | duas fases (óleo/água) desenhadas no projeto |
| Q04.4 | Chemistry/vacuum-flask | funil de Büchner de porcelana, rolha, sólido retido e mangueira de vácuo desenhados no projeto |
| Q04.5 | General_items/scale-balanced | removidas as caixas brancas sobre os pratos |
| Q05.1 | Chemistry/measuringcylinder-blue | proveta alargada, líquido recolorido; densímetro desenhado no projeto |
| Q05.2 | Chemistry/flask-green | líquido recolorido para violeta; coluna no gargalo, menisco e marca de aferição desenhados no projeto |
| Q05.3 | (béquer: ver Chemistry/beaker-red acima) | pisseta e filete de água desenhados no projeto |
| Q08.1 | General_items/glass-water | comprimido e bolhas desenhados no projeto |
| Q08.6, Q12.1 | Chemistry/testtube-yellow | líquidos recoloridos (indicador universal; água de bromo); estante desenhada no projeto |
| Q08.7 | Microbiology/tube-red-bluecap | cálculo renal modelado no projeto ao lado |
| Q10.1 | General_items/pot-water-hot, General_items/salt | composição |

Em todos: sombra de contato, enquadramento quadrado e otimização SVGO (ids prefixados com o id do conteúdo).

**Gerados no projeto** (sem restrição de terceiros): Q01.1–Q01.5, Q02.1–Q02.3, Q02.5, Q04.1–Q04.3, Q06.1–Q06.3, Q07.1–Q07.3, Q08.2, Q08.3, Q09.3–Q09.5, Q10.2, Q11.1–Q11.7, Q12.2–Q12.5.
Moléculas (Q02.2, Q02.3, Q11.x, Q12.3, Q12.4) com coordenadas 3D do RDKit (BSD, otimização MMFF), usado só como dado numérico; Q04.3 e Q11.7 com geometria de água/ácido acético do RDKit ou valores de referência (O–H 0,96 Å, 104,5°). Letras (HCl, NaOH, 70%, 22,4 L, NH₃, H₂, O₂, 1,10 V) são contornos da fonte DejaVu convertidos em `<path>`.

## Conteúdos de Português (sub/P01.1 … sub/P12.5)

Mapa completo (fonte, arquivo original, licença e motivo de cada ícone): `sub/mapa_por.json`. Gerador: `fonte_gerador/gera_sub_por.py` (`constroi_sub_por.sh`; folhas de contato com `folha_sub_por.py` e `folha_sub_por.js` em `sub/folhas/por_P01.png` … `por_P12.png`).

**Servier Medical Art, CC BY 3.0** (mesma atribuição obrigatória acima). Originais copiados em `fonte_gerador/orig_servier/`.

| Ícone | Arquivo(s) Servier | Alteração |
|---|---|---|
| P02.2 | General_items/glasses | nenhuma |
| P02.4 | General_items/scale-imbalanced-left-1 | nenhuma |
| P07.3 | General_items/sand-clock | nenhuma |
| P09.4 | General_items/traffic-light-green | nenhuma |
| P10.1 | General_items/padlock-closed, General_items/key | composição; chave girada |
| P12.4 | General_items/egg | rachadura da casca desenhada no projeto |
| P12.5 | General_items/earth | nenhuma |

Em todos: sombra de contato, enquadramento quadrado e otimização SVGO (ids prefixados com o id do conteúdo).

**Gerados no projeto** (sem restrição de terceiros): todos os demais (P01.1–P01.4, P02.1, P02.3, P03.1–P03.4, P04.1–P04.4, P05.1–P05.4, P06.1–P06.3, P07.1, P07.2, P07.4, P08.1–P08.4, P09.1–P09.3, P09.5, P10.2–P10.5, P11.1–P11.4, P12.1–P12.3) — modelados com o motor 3D do projeto (`motor.py`) ou desenhados em SVG com gradientes no acabamento da Servier (P02.3, P05.2, P05.4, P09.2, P11.2, P11.3, P12.3). P05.1 usa o contorno de peça de quebra-cabeça de `gera_mat2.py`. Letras (OLÁ, EU, sinais de pontuação) são contornos da fonte DejaVu convertidos em `<path>`.

Correção de módulo (29/10): **P02** refeito com o martelo em posição de uso (cabeça batendo de pé na base, cabo inclinado para cima); o anterior está em `_bak/P02.svg`.


## Conteúdos de Matemática (sub/M01.1 … sub/M17.2, sub/M13.9, sub/M-OUTRO)

Mapa completo (fonte, arquivo original, licença e motivo de cada ícone): `sub/mapa_mat.json`. Geradores: `fonte_gerador/sub_mat_base.py` (torno, letras extrudadas, vidro), `sub_mat_a.py` (M01–M06), `sub_mat_b.py` (M07–M12), `sub_mat_c.py` (M13–M17, M13.9, M-OUTRO); montagem com `constroi_sub_mat.sh` (usa `finaliza.js`); folhas de contato com `folha_sub_mat.py` e `folha_sub_mat.js` em `sub/folhas_mat/M01.png` … `M17.png`.

**Gerados no projeto** (sem restrição de terceiros): todos os 79 — nenhum desenho da Servier. Modelados com o motor 3D do projeto (`motor.py`, mesma câmera, luz e sombra dos ícones de módulo); M03.3 (cofrinho), M07.2 (bonecas russas) e M07.4 (girassol) desenhados em SVG com gradientes no mesmo acabamento.
Figuras matemáticas calculadas pela fórmula: hipérbole xy = 6 (M02.4), parábola por tempos iguais (M05.2), y = 2x + 1 (M05.1), |x| (M05.4), 2^x e log₂x simétricas em y = x (M05.5), escalas logarítmicas da régua de cálculo (M06.3), meias-vidas (M06.5), espiral de Vogel com ângulo de ouro (M07.4), quartos de círculo e hachura (M08.5), triângulo 3-4-5 e altura (M09.1, M09.4), soma dos ângulos com os ângulos reais do triângulo (M09.5), relógio às 2 h (M10.3), y = sen x (M10.5), raízes do polinômio (M16.1), z e i·z (M16.2), binomial C(7, k) no Galton (M14.3).
Letras e números (2x + 1 = 7, x², 10⁹, ℕ ℤ ℚ ℝ, %, −10%, 80 dB, 120/80, π, naipes etc.) são contornos da fonte DejaVu (licença livre Bitstream Vera/DejaVu) convertidos em `<path>`.


## Conteúdos de Biologia (sub/B01.1 … sub/B12.6)

Mapa completo (fonte, arquivo original, licença e motivo de cada ícone): `sub/mapa_bio.json`. Gerador: `fonte_gerador/gera_bio_sub.py` (`constroi_sub_bio.sh`, que usa `finaliza_sub.js`: enquadramento pelos pixels pintados, para recortes e sombras desfocadas; `mapa_sub_bio.py` escreve o mapa); folhas de contato com `folha_sub_bio.py` e `folha_sub_bio.js` em `sub/folhas/folha_B01.png` … `folha_B12.png`.

**Servier Medical Art, CC BY 3.0** (mesma atribuição obrigatória acima). Originais copiados em `fonte_gerador/orig_servier/`.

| Ícone | Arquivo(s) Servier | Alteração |
|---|---|---|
| B01.1 | Receptors_channels/ionchannel-membrane | recorte de 2 canais |
| B01.2 | Receptors_channels/sodium-potassium-pump-membrane-ions | recorte de 2 estados da bomba |
| B01.4 | Intracellular_components/endoplasmatic-reticulum-rough-3d-2, Intracellular_components/golgi-3d-2 | composição; vesículas desenhadas no projeto |
| B01.5 | Intracellular_components/mitochondrium-2 | composição com cloroplasto desenhado no projeto |
| B01.6 | Intracellular_components/cell-microtubule | nenhuma |
| B02.1 | General_items/glass-water, General_items/salt | composição |
| B02.2 | General_items/bread, General_items/butter | composição |
| B02.4 | Intracellular_components/enzyme-orange-3d | substrato complementar desenhado no projeto sobre o contorno do sítio ativo |
| B03.4 | General_items/wine | composição; pote de iogurte desenhado no projeto |
| B03.6 | Plants_Algae/ananas, General_items/corn | composição |
| B04.2 | Genetics/Mitosis | recorte de uma das células da sequência |
| B04.5 | Oncology/cancerous-cell-1 | nenhuma |
| B05.1 | Nucleic_acids/dna-nucleotides-forked | nenhuma |
| B05.2 | Nucleic_acids/transkription | recorte |
| B05.3 | Nucleic_acids/translation | recorte (retirada a subunidade solta) |
| B05.4 | Blood_Immunology/erythrocyte, Blood_Immunology/falciform-erythrocyte-2 | composição |
| B05.5 | Blood_Immunology/pluripotent-stem-cell, Blood_Immunology/erythrocyte, Human_physiology/smooth-muscle-fiber, Human_physiology/adipocyte-1 | composição |
| B05.6 | Lab_apparatus/gel-electrophoresis | nenhuma |
| B06.6 | Human_physiology/hand | mesma mão repetida 5 vezes com filtro de cor em tons de pele |
| B07.1 | Tissues/cell-column-1, Human_physiology/muscle-1, Tissues/fibroblast-1 | composição com neurônio desenhado no projeto |
| B07.2 | Human_physiology/pancreas, Human_physiology/stomach, Human_physiology/liver | composição na posição anatômica |
| B07.3 | Human_physiology/lung, Human_physiology/trachea-bronchi | composição; recoloridos; incisura cardíaca recortada no pulmão esquerdo |
| B08.4 | Human_physiology/brain-1 | recolorido; hipotálamo, hipófise e sela turca desenhados no projeto |
| B07.4 | Human_physiology/heart-interior-1 | nenhuma |
| B07.5 | Blood_Immunology/erythrocyte, Blood_Immunology/neutrophil-granulocyte, Blood_Immunology/platetelet-1 | composição |
| B07.6 | Human_physiology/kidney-1 | nenhuma |
| B08.6 | Human_physiology/syringe, Blood_Immunology/antibody-10 | composição |
| B09.1 | Plants_Algae/cabbage, Animals/rabbit-brown | composição; coelho espelhado |
| B09.3 | General_items/arrow-circular, General_items/earth | composição |
| B10.1 | Viruses/hepatits-virus | nenhuma |
| B10.3 | Animals/bug, Parasites/trypanosoma | composição; barbeiro recolorido com o conexivo listrado; lupa e hemácias desenhadas no projeto |
| B10.4 | Parasites/ascaris-lumbricoides-female-adult | nenhuma |
| B10.5 | General_items/hand-washing | pele e água recoloridas; espuma desenhada no projeto |
| B11.3 | Chemistry/erlenmeyer-glass | contas desenhadas no projeto dentro e fora do erlenmeyer |
| B12.2 | Parasites/throphozoite-ehystolica | composição com leveduras desenhadas no projeto |
| B12.5 | Animals/fruitfly_drosophila-redeyes | composição com estrela-do-mar desenhada no projeto |
| B12.6 | Animals/monkey, Animals/mouse-gray, Animals/fish-1 | composição |

Em todos: sombra de contato, enquadramento quadrado e otimização SVGO (ids prefixados com o id do conteúdo).

**Gerados no projeto** (sem restrição de terceiros):
- Modelados com o motor 3D do projeto (`motor.py`): B03.2 (ATP sintase e complexos da cadeia respiratória na membrana), B04.1 (ciclo celular), B06.3 (heredograma), B09.2 (pirâmide de energia), B11.4 (Hardy-Weinberg), B12.1 (bacteriófago; a bactéria é desenhada), B12.3 (caule em corte).
- Moléculas em bola-e-vareta (`gera_qui.py`) com geometria do RDKit (BSD, só como dado numérico): B02.5 (ATP), B03.1 (glicose e piruvato); B03.3 (O₂ e H₂O) com distâncias e ângulo de ligação reais.
- Desenhados em SVG no acabamento da Servier: B01.3, B02.3, B03.5, B04.3, B04.4, B06.1, B06.2, B06.4, B06.5, B08.1–B08.5, B08.7, B09.4, B09.5, B11.1, B11.2, B11.5, B12.4 e as partes desenhadas das composições (cloroplasto de B01.5, vesículas de B01.4, substrato de B02.4, neurônio de B07.1, contas de B11.3, leveduras de B12.2, estrela-do-mar de B12.5).
- Letras (G₁, S, G₂, M; AB+; p², pq, q²): contornos da fonte DejaVu convertidos em `<path>`.

**B09.6 (biomas brasileiros)**: limites oficiais do IBGE (Biomas do Brasil, 2019; dados públicos, citar "IBGE"), baixados pelo pacote geobr do IPEA (`biomes_2019_simplified.gpkg`, github.com/ipea/geobr, release v1.7.0), simplificados por Douglas-Peucker em `fonte_gerador/biomas_br_simpl.json`; o Sistema Costeiro-Marinho não entra (inclui faixa de mar). Desenho do relevo próprio do projeto.

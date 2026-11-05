# Ícones 3D com cara de ilustração: técnicas para chegar perto da referência

Pesquisa feita em 03/11/2026 para responder ao dono: **como misturar 3D com desenho pintado ("desenhar e depois aplicar no 3D") para que os ícones em tempo real fiquem iguais às referências aprovadas**, que hoje recebem nota 60/100 por parecerem "computação gráfica chapada".

Escopo: navegador, muitos ícones pequenos na mesma tela, fidelidade a uma imagem de referência dada, máquina de produção **só com CPU** (4 núcleos, 15 GB, sem GPU), Python 3 + Node 22, Blender `bpy` 5.2.3 instalado, `torch` 2.15 (CPU), `onnxruntime` 1.29 e `opencv` 5.0 já instalados (conferido nesta máquina). As cenas atuais estão em `app/src/ui/icones3d/` (three.js 0.160, materiais Standard/Physical/Basic com `CanvasTexture`, `RoomEnvironment` e sombras em tempo real).
As fontes estão numeradas entre colchetes, por exemplo [3], e listadas no fim. Onde algo é estimativa minha e não dado de fonte, está escrito "estimativa".

---

## 1. Resposta curta

**O que deixa a cena "CG chapada" não é a geometria; é a luz e a textura.** A referência tem luz suave com oclusão nos cantos (AO), luz rebatida colorida, bordas arredondadas com brilho e textura pintada com variação. Um navegador de celular não calcula isso em tempo real para seis ícones de uma vez. A saída que todo projeto web de alto acabamento usa é **calcular a luz uma vez no Blender e "assar" (bake) o resultado na textura**, mostrando no three.js um material que quase não calcula nada [7][8][9][24].

Ranking geral, do que mais aproxima da referência com custo aceitável:

| # | Técnica | Fidelidade à referência | Custo no celular | Custo de produção | Quando usar |
|---|---|---|---|---|---|
| 1 | **Bake no Blender (Cycles) → GLB com textura "assada" → three.js com material barato + brilho do ambiente por cima** | Alta (é o mesmo motor que gera os PNGs aprovados) | Muito baixo | Médio (1 script `bpy` por ícone, já existe a cena) | Quase todos: célula, livros+pena, pilha+lâmpada, bússola, sólidos |
| 2 | **2,5D a partir da própria referência: imagem + mapa de profundidade (Depth Anything V2 Small) + camadas, com leve paralaxe** | Máxima (os pixels *são* a referência) | Baixo | Baixo | Ícones que só precisam "respirar" (inclinar ±8°), sem peça que gira; uso da referência decidido pelo dono (princípio 10) |
| 3 | **Projeção da referência sobre geometria parecida** (projetor de câmera / "Project from View") | Alta só perto do ângulo original | Baixo | Médio | Superfícies quase planas: o mapa topográfico, capas de livro |
| 4 | **Texturas procedurais pintadas** (cores hipsométricas + curvas de nível; Voronoi para citoplasma) + normal map gerado da altura | Média (precisa de ajuste fino de paleta) | Baixo | Médio | Complemento de 1 e 3 (mapa, membrana, papel, madeira) |
| 5 | **Matcap / rampa toon pintada** | Média; ótima para "massinha" de forma simples | Mínimo | Baixo | Átomo, sólidos geométricos, peças pequenas |
| 6 | Pós-processamento (SSAO/N8AO, bloom) | Ajuda pouco a mais do que o bake | **Alto** no celular | Baixo | Evitar nos ícones; usar AO assada e "brilho falso" com sprite |
| 7 | Imagem→3D por IA (TripoSR, Hunyuan3D, SF3D, TRELLIS) | Baixa: a IA reinterpreta e erra ciência | — | Alto em CPU | Não usar no produto; no máximo rascunho de forma |

**Recomendação:** adotar a técnica 1 como padrão (rota principal) e a 2 como rota rápida para ícones sem peça móvel, com a decisão do dono sobre o uso da referência (princípio 10). Projeção (3) e procedural (4) entram como *fonte de textura* dentro do bake, não como técnica de tempo real separada.

A seção 7 ("Como os profissionais fazem") mostra a receita de estúdios e designers de ícones 3D: bevel generoso, degradê + ruído na cor, luz grande e macia com AO e, para web, bake ou matcap. Ela confirma a escolha da técnica 1.

Uma observação honesta antes de investir: a pasta `app-atual/design/icones_real/foto3d/` já gera, com o próprio Cycles, PNGs parados e filmes de 24 quadros (`camadas_app.py` → `parado.webp` + `filme.webp`). **Para um ícone de 72–128 px que só toca uma animação curta ao passar o mouse, o filme pré-renderizado já é a forma mais fiel possível** e custa zero de GPU. Tempo real só se justifica quando o ícone precisa reagir de forma contínua ao ponteiro (inclinar seguindo o mouse) ou ser muito grande. A técnica 1 é exatamente a ponte entre os dois mundos: mesma luz do Cycles, mas interativa.

---

## 2. As seis técnicas, uma a uma

### 2.1 Projeção da referência sobre a geometria ("desenhar e aplicar no 3D")

**O que é.** Uma câmera virtual colocada no mesmo ângulo da referência funciona como projetor de slides: cada ponto da malha recebe a cor do pixel da referência que cai sobre ele.

**Ferramentas.**
- three.js: biblioteca `three-projected-material` (material baseado em `MeshPhysicalMaterial`; `material.project(mesh)` "congela" a relação câmera-malha e depois o objeto pode se mover; aceita `InstancedMesh`; `backgroundOpacity` controla as faces não projetadas) [1][2]. Tutorial de shader próprio no Codrops: usa as matrizes do projetor no vertex shader e só pinta faces voltadas para ele [3].
- Blender: fluxo de duas UVs — uma UV temporária feita com *Project from View* e transferência para a UV "de verdade" com o pincel Clone ou por bake [4]. Sem interface (headless), a forma prática é o **modificador UV Project** com uma câmera como projetor: segue a perspectiva da câmera, aceita até 10 projetores e cada face escolhe o projetor mais alinhado à sua normal [5].
- OpenCV: para tirar a perspectiva de uma superfície plana da referência (o tampo do mapa, a capa do livro), `cv2.getPerspectiveTransform` + `cv2.warpPerspective` geram uma textura "vista de cima"; o buraco deixado por objetos à frente (a bússola sobre o mapa) é preenchido com `cv2.inpaint` (Telea, bom para áreas pequenas) ou LaMa (Apache-2.0, existe em ONNX e roda no `onnxruntime` em CPU) [6].

**Limites (importantes).**
- Funciona bem **só perto do ângulo original**. Ao girar, aparecem: (a) esticamento nas faces quase paralelas aos raios do projetor; (b) faces que estavam escondidas na referência ficam sem cor (ou com cor repetida); (c) **luz e sombra pintadas giram junto com o objeto**, o que denuncia o truque. Estimativa: até ±15–20° de inclinação passa despercebido; acima disso, não.
- Projeção em perspectiva sobre malha com poucos polígonos distorce; o manual do Blender manda subdividir [5][4].
- A geometria precisa casar com a referência quase ao pixel (alinhamento manual por ícone).

**Veredito.** Ótima como **fonte de textura** para superfícies quase planas (mapa, capas, rótulo da pilha), feita uma vez no Blender e depois assada na UV normal (seção 3.1, passo 3). Ruim como técnica de tempo real para objetos que giram.

### 2.2 Bake: calcular a luz no Blender e levar para o navegador

**O que é.** O Cycles calcula luz direta, luz rebatida, oclusão e cor, e grava o resultado numa imagem sobre a UV do objeto. No navegador, o material só lê essa imagem: o resultado fica igual ao render, a custo quase zero. É a técnica usada por Bruno Simon e ensinada no curso Three.js Journey ("Portal Scene"), com sombras assadas em PNG pequenos [24].

**Pontos técnicos (com fonte).**
- Requisitos do Blender: a malha precisa de UV e de um nó *Image Texture* ativo com a imagem de destino. O bake *Combined* deixa ligar/desligar direta, indireta, difusa, brilho (glossy) e transmissão; a margem em volta das ilhas de UV evita costuras com mipmap; *Selected to Active* passa detalhe de uma malha densa para uma leve [10].
- Um bake *Combined* precisa ter pelo menos uma contribuição de luz ligada, senão sai preto [11].
- glTF não tem campo de *lightmap*. Duas saídas aceitas: (a) assar luz **dentro da cor base** e exportar como material *unlit* (`KHR_materials_unlit`, ou converter depois com o comando `unlit` do gltf-transform), mostrando com `MeshBasicMaterial` [7][8]; (b) exportar a luz no canal emissivo/segunda UV e montar `lightMap` no three.js [8][9].
- No three.js ≥ r151, cada textura escolhe sua UV por `texture.channel` (0 = `uv`, 1 = `uv1`…); o `GLTFLoader` **não** liga sozinho `aoMap`/`lightMap` à segunda UV — é preciso definir o canal à mão [12].
- Limite conhecido: `MeshBasicMaterial` não tem brilho especular; superfícies brilhantes ficam foscas [9]. Por isso a receita da seção 3.1 separa **difuso assado** (não depende do ângulo de visão) de **brilho ao vivo** (depende).

**Truque para ter os dois.** Em `MeshStandardMaterial`/`MeshPhysicalMaterial`: `color = preto`, `emissive = branco`, `emissiveMap = difuso assado`, `roughness`/`clearcoat` do material real e `scene.environment` = `RoomEnvironment` por PMREM. A cor e a sombra vêm 100% do bake; o reflexo do estúdio se move de verdade quando o ícone inclina. Custo: um material Standard sem luzes nem sombras em tempo real (as luzes e o `shadowMap` podem ser desligados). Isto é dedução minha a partir de como o material soma emissivo + especular, não receita de fonte; validar numa cena antes de padronizar.

**Compactação.** `gltf-transform optimize` com `--compress meshopt` e `--texture-compress webp` (ou `ktx2`) e `--texture-size` [13]. No three.js: `GLTFLoader` + `MeshoptDecoder` (e `KTX2Loader` se usar KTX2). WebP é mais simples (não precisa do `toktx` instalado); KTX2 economiza memória de GPU, o que importa só com muitas texturas grandes. Para ícones de 512 px, WebP basta (estimativa).

**Custo de produção nesta máquina.** Bake em CPU: estimativa de 30 s a alguns minutos por ícone com textura 1024 px e 64–128 amostras, usando denoise. Sempre sob `flock /tmp/render.lock`, como já manda `COMO_CONSTRUIR.md`.

**Limites.** Peça que muda a luz da cena (lâmpada acendendo) precisa de **dois bakes** (apagada/acesa) misturados por um uniforme. Peça que se move (agulha, elétron) não pode ter a sombra dela assada no chão de forma fixa: assar o chão sem ela e dar à peça uma sombra de contato em sprite.

### 2.3 Matcap, rampa toon e o "estúdio" do three.js

- **Matcap** (`MeshMatcapMaterial`): uma bolinha pintada guarda cor + luz; o material ignora as luzes da cena, é o mais barato possível e dá o visual "massinha de modelar" [14]. Não faz sombra própria. Pode-se **pintar a bolinha a partir da referência** (recortar um trecho esférico brilhante da referência, ex.: o próton do átomo) — assim a luz do ícone herda o tom exato da ilustração.
  - Cuidado com bibliotecas de matcaps prontos: a coleção `nidorx/matcaps` não tem licença única; as imagens vêm de sites diversos [15]. Para o produto, gerar os matcaps no próprio Blender (render de uma esfera com o material e a luz do `kit.py`) — sem problema de direito e com a luz idêntica à dos outros ícones.
- **Rampa toon** (`MeshToonMaterial.gradientMap`): textura de faixas de luz; exige `NearestFilter` para não borrar as faixas [16]. Dá visual de desenho animado, **mais longe** da referência (que é suave). Só faria sentido numa rampa com 6–8 tons suaves pintados com as cores da referência; prefira matcap.
- **`MeshPhysicalMaterial`**: `clearcoat` é a camada de verniz (bom para plástico "de brinquedo"); `sheen` é para tecido/veludo (útil só em pena, feltro, citoplasma aveludado); a documentação avisa que é o material mais caro por pixel e pede sempre um mapa de ambiente [17].
- **Ambiente**: `RoomEnvironment` + `PMREMGenerator.fromScene` uma única vez (gerar a cada quadro derruba o desempenho), um só gerador para tudo [18]. Para o "estúdio de brinquedo", uma alternativa melhor é **renderizar no Blender o próprio estúdio do `kit.py` como HDRI equirretangular** e usá-lo como ambiente: o reflexo nos objetos fica igual ao dos PNGs aprovados.
- **Pós-processamento**: N8AO tem preset "Performance" (8 amostras de AO + 4 de denoise) voltado a celular e GPU integrada, e modo meia-resolução que acelera 2–4×, com perda de detalhe; objetos transparentes são desenhados duas vezes [19]. Mesmo assim é um passe de tela cheia por quadro, somado a todos os ícones do palco único. **Para ícones, AO assada no bake é melhor e de graça.** Bloom: trocar por um sprite aditivo com gradiente radial atrás da lâmpada/elétron.

### 2.4 Texturas procedurais pintadas e normal map gerado da altura

- **Mapa topográfico**: cor hipsométrica (verde → bege → marrom → branco pela altitude) + curvas de nível no fragment shader com `fract(altura/intervalo)` e largura constante em pixels via `fwidth` + `smoothstep`; para linha uniforme também na diagonal, usar o comprimento das derivadas em x e y em vez de `fwidth` [20][21]. O artigo WSCG 2013 cobre ainda o afinamento das curvas em encostas íngremes [22]. A altitude pode vir de ruído (fBm) ou, melhor, **da própria referência** (seção 2.6). Quando o mapa não se move, gerar tudo uma vez em `CanvasTexture`/Python e assar: o shader ao vivo só é necessário se a curva de nível tiver de ficar nítida em zoom.
- **Célula**: citoplasma e membrana com ruído de Voronoi (células) + fBm suave; organelas com textura de "riscos" (cristas da mitocôndria, cisternas do Golgi) pintadas em Python. Tudo isso se faz no próprio nó de material do Blender (Voronoi, Noise, Musgrave) e é **assado** — mais rico e mais barato do que no shader do navegador.
- **Normal map a partir da altura**: Sobel em x e y sobre a imagem de altura → `(−dx·k, −dy·k, 1)` normalizado → RGB. Em Python: `cv2.Sobel`; no Blender: bake do tipo *Normal* com *Selected to Active* de uma malha esculpida [10]. Dá o relevo fino (papel, couro do livro, granulado do mapa) que tira o aspecto liso.
- **Paleta**: tirar as cores por k-means (`cv2.kmeans`) da área correspondente na referência, para não "inventar" tons.

### 2.5 Imagem → 3D e texturização por IA

| Modelo | Licença | Roda aqui (CPU)? | Serve para o Aprendice? |
|---|---|---|---|
| TripoSR | MIT [25] | Sim, lento (minutos por malha, fonte secundária) [25] | Só rascunho de forma; textura pobre (cor por vértice) |
| Hunyuan3D 2.x | Licença comunitária Tencent: **não vale na UE, Reino Unido e Coreia do Sul**; condições de uso comercial por escala [26] | Na prática exige GPU | Não: licença restritiva e GPU |
| Stable Fast 3D | Stability Community License: grátis abaixo de US$ 1 mi de receita anual; acima disso exige licença Enterprise [27] | Pensado para GPU | Não |
| TRELLIS | MIT (há relato não confirmado de dependências só para pesquisa) [27] | Exige GPU CUDA | Não |

**Veredito.** Nenhum gera algo **fiel** à referência: eles reinterpretam a imagem, inventam o lado de trás e erram detalhes — o que viola o princípio "zero erro" num ícone de ciência (número de elétrons, forma de organela). Além disso, sem GPU são lentos ou inviáveis. Não recomendado.

### 2.6 2,5D: a própria referência com profundidade

**O que é.** Em vez de reconstruir o objeto, usa-se a imagem aprovada e uma estimativa de profundidade de cada pixel. No navegador, um plano subdividido é deslocado pela profundidade (ou as coordenadas de textura são deslocadas no fragment shader), e o ícone "respira" em 3D ao inclinar.

- **Profundidade**: Depth Anything V2 **Small** é Apache-2.0 (Base/Large/Giant são CC BY-NC, não comerciais), 24,8 M parâmetros, entrada padrão de 518 px, carrega em CPU [23]. Existe versão ONNX pronta (`onnx-community/depth-anything-v2-small`) para Transformers.js/onnxruntime [28]. Alternativas com licença livre: Marigold (Apache-2.0, mas é difusão — lento em CPU) e ZoeDepth (MIT) [29]. Para objetos simples, a profundidade também pode ser **pintada à mão** em tons de cinza ou tirada do render do Blender (passe Z), que é exata.
- **Renderização**: shader que desloca mais os pixels "perto" do que os "longe"; deslocar vértices demais deforma a imagem em vez de dar volume; `displacementMap` padrão com poucos vértices fica grosseiro, por isso o normal é shader próprio [30]. Um projeto aberto divide a profundidade em **camadas** (planos transparentes em Z diferentes) [30].
- **O que esconde atrás**: um único mapa de profundidade não mostra o que está atrás da peça da frente. A solução clássica é a imagem em camadas com preenchimento (LDI + inpainting, Shih et al., CVPR 2020, código MIT) [31]. Para ícones de fundo transparente com 1 a 3 objetos, basta: separar as camadas pela profundidade ou por máscara, preencher a camada de trás com `cv2.inpaint`/LaMa e manter a inclinação pequena.
- **Luz que se mexe**: gerar normal map da profundidade (Sobel) e somar um brilho especular discreto que acompanha a inclinação — tira a sensação de "foto colada".

**Limites.** Inclinação máxima pequena (estimativa: ±8–12°); **não gira** o objeto; partes animadas (agulha, elétron, lâmpada) precisam ser camadas separadas ou peças 3D de verdade sobre o 2,5D. **Uso da referência:** as referências `REFERENCIA_*.png` e `referencia_vitor_3110.png` vieram do dono; quem decide publicar pixels delas é o dono (princípio 10). Registrar a origem de cada uma.

---

## 3. Recomendação por tipo de ícone

| Ícone | 1ª opção | 2ª opção | Observação |
|---|---|---|---|
| **Célula animal cortada** | Bake (Cycles) com texturas procedurais assadas (Voronoi no citoplasma, cristas, cisternas) + `clearcoat` leve ao vivo | 2,5D sobre o render do Blender | O corte e o "molhado" brilhante são o que dá realismo: assar AO + subsurface e deixar só o reflexo ao vivo |
| **Mapa topográfico + bússola** | Mapa: textura da referência desentortada (homografia) + inpainting sob a bússola, OU hipsométrico + curvas de nível procedurais; relevo leve por deslocamento; **tudo assado**. Bússola: bake + agulha como peça ao vivo | 2,5D só do mapa | A agulha gira na animação: ela não entra no bake do chão; sombra de contato em sprite |
| **Livros + pena** | Bake; capas e lombadas por projeção da referência no Blender (UV Project + bake EMIT para a UV final) | Matcap de "papel/couro" gerado no Blender | Pena: `sheen` baixo ou alfa com textura pintada |
| **Pilha + lâmpada (circuito)** | Bake duplo (apagada/acesa) misturado por uniforme + sprite aditivo de brilho; vidro da lâmpada com `transmission` evitado (caro): usar alfa + reflexo do ambiente | Filme pré-renderizado já existente | Corrente animada: peças pequenas ao vivo (setas/pontos) sobre o fio assado |
| **Átomo** | Matcap gerado no Blender (próton, nêutron, elétron) + sprite de brilho; geometria simples dispensa bake | Bake do núcleo + elétrons com matcap | Movimento por camadas e saltos (ver `animacao-dos-icones.md`) |
| **Sólidos geométricos** | Matcap/"clay" + AO assada em cor de vértice ou textura pequena | Bake completo | Arestas chanfradas (bevel) antes do bake: é o que dá o brilho de borda da referência |

---

## 4. Pipeline concreto da opção 1 (bake → GLB → three.js)

Tudo roda nesta máquina, sem GPU. Passos por ícone `<ID>`:

1. **Cena**: reaproveitar `app-atual/design/icones_real/foto3d/cenas/<ID>.py` (mesma luz do `kit.py`). Aplicar bevel/subdivisão antes do passo 2. Separar em objetos: *estáticos* (vão para o bake) e *móveis* (agulha, elétrons, ponteiros).
2. **UV de bake** (script `bpy`, sem interface):
   ```python
   import bpy
   for ob in estaticos:
       bpy.context.view_layer.objects.active = ob
       uv = ob.data.uv_layers.new(name="bake")      # segunda UV; a original fica intacta
       ob.data.uv_layers.active = uv
       bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT')
       bpy.ops.uv.smart_project(island_margin=0.02)  # ou uv.lightmap_pack
       bpy.ops.object.mode_set(mode='OBJECT')
   ```
3. **(Opcional) Textura pintada da referência**: câmera no ângulo da referência + modificador *UV Project* criando a UV "proj"; material emissivo lendo a referência pela UV "proj"; bake tipo `EMIT` para a imagem na UV "bake" [5][10]. Isto é o "desenhar e aplicar no 3D" do dono, feito sem interface.
4. **Bake de luz** (Cycles, CPU):
   ```python
   sc = bpy.context.scene
   sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'
   sc.cycles.samples = 128; sc.cycles.use_denoising = True
   img = bpy.data.images.new(f"{ID}_bake", 1024, 1024)
   # em cada material: nó Image Texture com img, selecionado e ativo (requisito do bake) [10]
   bpy.ops.object.bake(type='DIFFUSE', pass_filter={'DIRECT','INDIRECT','COLOR'}, margin=8)
   img.filepath_raw = f"//bake/{ID}_bake.png"; img.file_format = 'PNG'; img.save()
   ```
   `DIFFUSE` com cor + direta + indireta não depende do ângulo de visão; o brilho fica para o tempo real. Para ícones foscos e que inclinam pouco, `type='COMBINED'` (com glossy) dá o render idêntico e dispensa o ambiente ao vivo.
   Se a lâmpada acende: repetir com a emissão ligada → `<ID>_bake_acesa.png`.
5. **Material de exportação**: trocar o material de cada objeto estático por Principled com *Emission* = imagem assada (força 1), *Base Color* preto, *Roughness*/*Coat* do material original. Exportar:
   ```python
   bpy.ops.export_scene.gltf(filepath=f"out/{ID}.glb", export_format='GLB',
                             use_selection=True, export_image_format='WEBP')
   ```
6. **Compactar** (Node, sem instalar nada no app):
   ```bash
   npx @gltf-transform/cli optimize out/<ID>.glb app/public/icones3d/<ID>.glb \
       --compress meshopt --texture-compress webp --texture-size 512
   npx @gltf-transform/cli inspect app/public/icones3d/<ID>.glb   # conferir tamanho e texturas
   ```
   Para o caminho totalmente sem luz (COMBINED): acrescentar `npx @gltf-transform/cli unlit` antes do optimize [8][13]. Confirmar os nomes das opções com `--help` (fonte é guia de comunidade).
7. **three.js** (r160 já no `package.json`):
   ```js
   import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
   import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
   const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
   // ambiente uma vez só, um gerador só [18]; idealmente o HDRI do estúdio do kit.py
   scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
   // sem luzes e sem shadowMap: a luz já está na textura
   ```
   Para a lâmpada: `material.onBeforeCompile` ou um `ShaderMaterial` simples que mistura `bake_apagada` e `bake_acesa` por `uAceso` (0→1) na animação.
8. **Conferir**: render lado a lado (referência × PNG Cycles × captura do navegador em claro, escuro e 390 px), nota por critério como em `COMO_CONSTRUIR.md`. Meta de peso: GLB ≤ 150 KB por ícone (estimativa razoável para 512 px WebP + malha meshopt).

## 5. Pipeline concreto da opção 2 (2,5D)

Imagem-base: a que o dono autorizar (princípio 10); a alternativa é o PNG do nosso render.

1. **Profundidade** (CPU, uma vez por ícone):
   ```bash
   pip install transformers   # torch CPU já está instalado
   ```
   ```python
   from transformers import pipeline
   from PIL import Image
   dep = pipeline("depth-estimation", model="depth-anything/Depth-Anything-V2-Small-hf", device="cpu")
   d = dep(Image.open("base.png").convert("RGB"))["depth"]   # PIL em tons de cinza
   d.save("depth.png")
   ```
   Alternativa sem `transformers`: o ONNX de `onnx-community/depth-anything-v2-small` [28] direto no `onnxruntime` já instalado. Se a base é um render nosso, usar o passe Z do Blender em vez da IA (exato).
2. **Limpeza** (OpenCV): recortar a profundidade pelo alfa da imagem; suavizar com `cv2.bilateralFilter` (preserva bordas); dividir em 2–3 camadas por limiar ou por máscara manual; preencher o fundo de cada camada de trás com `cv2.inpaint(..., cv2.INPAINT_TELEA)` (ou LaMa em ONNX para áreas grandes) [6]; normal map por `cv2.Sobel` da profundidade.
3. **Saída**: `cor.webp` (com alfa), `prof.webp` (8 bits basta para inclinações pequenas), `normal.webp`, por camada.
4. **three.js**: um `PlaneGeometry(1,1,128,128)` por camada com `ShaderMaterial`: vertex desloca `z` por `prof` (amplitude pequena), fragment soma um brilho especular de `normal` × direção do mouse. Inclinação limitada a ±8–12°, com retorno suave; respeitar `prefers-reduced-motion`.
5. **Peças animadas** (agulha, elétron, lâmpada): camada própria ou objeto 3D real por cima, com luz assada no estilo da opção 1.

## 6. Riscos

1. **Direitos da referência** (alto): a 2,5D e a projeção publicam pixels da referência. Sem licença confirmada, não usar no produto (princípio 10). O bake com geometria e textura nossas não tem esse risco.
2. **Ciência errada** (alto): projeção, 2,5D e IA copiam ou inventam detalhe. Toda cena continua passando pela conferência de `docs/ciencia-dos-icones.md`. IA de imagem→3D descartada por isso.
3. **Animação × bake** (médio): tudo que se move não pode ter luz/sombra fixa. Separar estático e móvel desde a modelagem; sombras de contato em sprite.
4. **Brilho "congelado"** (médio): no bake totalmente sem luz, o reflexo não se move ao inclinar — fica "foto colada". Mitigação: difuso assado + especular ao vivo (truque do emissivo, seção 2.2), a validar numa cena-piloto.
5. **Tempo de CPU** (médio): bakes de 1024 px com 128 amostras disputam a CPU com os renders atuais. Usar `flock`, 512–1024 px e denoise; fazer em lote noturno.
6. **Costuras e mipmap** (baixo): margem de 8–16 px no bake [10]; testar o ícone a 72 px.
7. **Contextos WebGL** (baixo, já resolvido): manter o palco único com `setScissor` (ver `animacao-dos-icones.md`); a técnica 1 reduz ainda mais o custo por ícone porque elimina sombras e luzes em tempo real.
8. **Versões de ferramenta** (baixo): opções do gltf-transform e do exportador glTF do Blender 5.2 vêm de documentação e guias de versões anteriores; confirmar com `--help` e `help(bpy.ops.export_scene.gltf)` no primeiro piloto.

**Próximo passo sugerido (para aprovação do dono):** piloto com **um** ícone (sugestão: pilha + lâmpada, que testa bake duplo, vidro e animação) nas duas rotas — bake e 2,5D sobre o render — comparadas lado a lado com a referência e com o filme pré-renderizado atual, com nota de 0 a 100.

---

## 7. Como os profissionais fazem

**O estilo, em palavras (para buscar sem mandar as imagens do dono a lugar nenhum):** "3D icon" / "clay 3D illustration" / "glossy toy 3D icon"; objeto único ou grupinho, vista de 3/4 levemente de cima (às vezes isométrica); formas de brinquedo com **bordas bem arredondadas**; plástico brilhante ou "massinha" fosca; cores saturadas com **degradê** suave em cada peça; luz de estúdio grande e macia; oclusão escura nos encaixes; sombra de contato curta; fundo transparente.

**Como pesquisei:** tutoriais escritos, manuais do Blender e do Spline, estudos de caso publicados (3dicons na Smashing Magazine, emoji Fluent da Microsoft) e descrições de vídeos. As páginas de vídeo do YouTube e os sites de transcrição não devolveram texto legível nesta sessão (só rodapé), então os vídeos entram apenas pelo título e descrição — por exemplo, o canal Polygon Runway, com vários tutoriais de "3D icon" em Blender feitos com modificadores de subdivisão e bevel [32][33].

### 7.1 O que os casos documentados mostram

- **3dicons (Vijay Verma, biblioteca aberta CC0, 1.000+ ícones em Blender)** [34][35]: alguns ícones começaram como **rabisco no iPad** (Procreate) e depois foram modelados; **um único arquivo** com todos os ícones e **duas caixas-guia** que marcam o tamanho máximo e a margem, para que todos tenham o mesmo tamanho; **Subdivision Surface** para suavizar ("qualidade acima de low-poly"); **iluminação de 3 pontos** básica, com **um jogo de luzes por ângulo de câmera** (frente, dinâmico, isométrico) e ajuste fino por ícone; cores com **degradê de tons claros ou complementares** da cor principal, não cor chapada; lição aprendida: "a luz muda a cor percebida", foi preciso errar algumas vezes até acertar; render com **800 amostras**, 2400×2400 px em 2–4 min (com GPU); automação por script foi tentada e abandonada porque **cada forma pedia luz diferente**; PNG final 8 bits comprimido (ImageOptim cortou 60–90%). Os arquivos `.blend` fonte estão disponíveis — por ser CC0, dá para **abrir e medir a luz e os materiais deles com `bpy`** (confirmar a licença no site oficial antes).
- **Emoji 3D Fluent (Microsoft + Studio Tendril)** [36][37]: cada desenho começa como **silhueta forte desenhada em 2D** (Illustrator) e só depois vira 3D (Cinema 4D); **geometria simples e peças reaproveitáveis** deixaram a produção previsível (dezenas por semana); na versão vetorial, o 3D foi imitado com **camadas de degradê linear e radial** e reflexos feitos de formas desfocadas.
- **Spline (ferramenta de 3D para web)** [38][39][40]: definir a "língua" do conjunto **antes** de modelar (proporções, raio de canto, paleta, estilo de material); **materiais e luz compartilhados** por todos os ícones; primitivas + booleanos; para web, **matcap ou Fresnel no lugar de luzes reais**, ruído leve na superfície para parecer orgânico, e **assar materiais complexos em textura**; a exportação glTF pura **perde luz e materiais** — o visual só vem junto exportando o código da cena ou assando.
- **Manuais e guias de luz de produto** [41][42][43][44]: luz de área grande = sombra macia (pequena e longe = dura); key a ~45° acima e de lado, fill mais fraca, rim por trás para destacar a borda; plano emissivo grande imita um softbox; fundo transparente pela opção *Film > Transparent*; o nó **Bevel** do Cycles arredonda a borda só no sombreamento (sem polígonos), mas é caro e indicado para bake ou imagem parada.
- **Mapa topográfico em Blender** [45][46]: terraços pelo nó de ruído → ×N → *Floor* → ÷N (degraus de altitude); curvas de nível comparando o terreno com cópias deslocadas um pouco para os lados (onde muda de degrau = linha); relevo por deslocamento em Geometry Nodes.
- **Célula cortada / corte de seção** [47][48][49]: corte por booleano ou por plano de corte (bisect, add-ons que geram a "tampa" do corte); a **face cortada recebe material próprio** (no tutorial de osso, guiado por imagem); modelos comerciais de célula vêm "cortados ao meio" com membrana, envelope nuclear, núcleo e centrossomo como peças separadas.

### 7.2 Receita repetível, passo a passo, e como aplicamos

Valores numéricos marcados com "≈" são ponto de partida meu, a calibrar no piloto; não vêm de fonte.

| # | Passo dos profissionais | Como fazer | Como aplicamos no Aprendice |
|---|---|---|---|
| 1 | **Definir a língua do conjunto** [34][38] | Uma folha de regras: raio de canto relativo ao tamanho (≈ 4–6% da maior medida), paleta por matéria, 2 materiais base (plástico brilhante e "massinha"), ângulo de câmera e luz únicos | Já existe em parte (`COMO_FAZER_ICONES.md`). Acrescentar o raio de bevel padrão e os dois materiais em `kit.py`, para todos os ícones herdarem |
| 2 | **Silhueta 2D antes do 3D** [34][36] | A referência do dono é o esboço: colocar como imagem de fundo da câmera e modelar por cima | No script: `cam.data.background_images` (só para conferência) ou comparar contornos com OpenCV (`cv2.matchShapes`) entre referência e render, como nota objetiva de "forma" |
| 3 | **Caixa-guia de tamanho** [34] | Dois cubos-guia (limite e margem) iguais para todos | Função no `kit.py` que normaliza o objeto para a caixa e posiciona no chão; garante que nenhum ícone fique maior que outro na grade |
| 4 | **Primitivas + booleanos + bevel + subdivisão** [32][33][38] | Modificadores na ordem: Boolean → **Bevel** (≈ 3 segmentos, limite por ângulo ≈ 30°) → **Subdivision Surface** (nível 2) → Weighted Normal; aplicar tudo antes de exportar [34] | Para o bake: alta resolução vai para o Cycles; para o GLB, versão leve (decimate) + **bake de normal** da versão densa (*Selected to Active*), e o brilho de borda volta pelo normal map |
| 5 | **Borda arredondada "de graça"** [44] | Nó **Bevel** no shader (raio ≈ 0,02–0,05 m) | Usar só no bake: o bake de normal grava o arredondado numa textura; no navegador não custa nada |
| 6 | **Material plástico brilhante** [50] | Principled: Roughness ≈ 0,25–0,35, Coat ≈ 0,3–0,5 (roughness do coat ≈ 0,05–0,1), Specular padrão | Bake da difusa; no three.js `MeshPhysicalMaterial` com `clearcoat` ≈ 0,4 só nas peças que inclinam (o reflexo se move), ou matcap gerado da mesma esfera |
| 7 | **Material "massinha"/macio** [50] | Roughness ≈ 0,6–0,8, sem coat; Subsurface pequeno (raio curto) para a luz "vazar" nas bordas — bom para célula, organelas, pena | Subsurface só existe no Cycles: **obrigatoriamente assado**. No navegador vira textura; nada de `transmission` |
| 8 | **Cor em degradê, não chapada** [34][36] | Ramp de cor por altura/curvatura do objeto (nó *Geometry > Pointiness* ou *Ambient Occlusion* ligado a um *Color Ramp*), tons claros/complementares da cor base | Entra no bake da difusa. Em cena só-three.js: degradê pintado em `CanvasTexture` ou cor por vértice |
| 9 | **Ruído leve na superfície** [39] | Noise de escala fina misturado em 3–8% na cor e na roughness | Assado; quebra o aspecto de "plástico de computador" — é um dos fatores da nota 60 |
| 10 | **Luz de estúdio de 3 pontos, grande e macia** [34][41][42][43] | Key: área grande (≈ 2–3× o objeto), de frente e acima (regra do dono: luz de frente, sombra curta para trás); fill: ≈ 30–40% da key, do outro lado; rim: atrás, para contorno brilhante; mundo/HDRI fraco de estúdio para preencher reflexos | Já é o `kit.py`. Acrescentar: (a) renderizar esse estúdio como **HDRI** para o `scene.environment` do three.js (reflexos idênticos); (b) um jogo de luz por ângulo, como no 3dicons, se usarmos mais de um ângulo |
| 11 | **AO e sombra de contato** [42][43] | No Cycles a oclusão sai naturalmente; chão como **Shadow Catcher** + *Film > Transparent* | Bake de AO no próprio objeto (cantos e encaixes) e sombra de contato do chão assada num **plano com alfa** sob o ícone (estilo Bruno Simon [24]). Nada de SSAO ao vivo |
| 12 | **Gestão de cor** [51][52] | AgX (padrão do Blender desde 4.0); look "Punchy" se ficar acinzentado; AgX desatura um pouco o sRGB | **Risco de cor diferente entre Blender e navegador.** Para bake: assar em espaço linear, com o mesmo mapeamento de tom nos dois lados (three.js tem `AgXToneMapping` em versões recentes — conferir na 0.160) ou usar *Standard* nos dois. Conferir sempre pelo conta-gotas lado a lado |
| 13 | **Render** [34] | Cycles, amostras altas, fundo transparente, PNG 8 bits comprimido | Nesta máquina (sem GPU): ≈ 128–256 amostras + denoise, 512–1024 px, sob `flock`. Já é o fluxo de `COMO_CONSTRUIR.md` |
| 14 | **Exportar para web** [39][40][24] | Assar materiais complexos; matcap em vez de luzes; glTF não leva a luz | Exatamente a opção 1 (seção 4): bake → GLB → gltf-transform → three.js |
| 15 | **Mapa topográfico** [45][46] | Terraços com Floor; curvas por diferença de cópias deslocadas; relevo por Geometry Nodes | Fazer no Blender e assar; no three.js, se precisar de curva nítida em zoom, o mesmo cálculo em shader com `fwidth` (seção 2.4) |
| 16 | **Célula cortada** [47][48][49] | Casca da membrana + corte por booleano ou plano; face cortada com material próprio; organelas como peças separadas | Organelas separadas também facilitam a correção científica e a animação; face do corte com textura de citoplasma (Voronoi) assada |

### 7.3 O que isso muda no nosso plano

1. O "segredo" profissional cabe em quatro coisas que hoje faltam ou estão fracas nas cenas three.js: **bevel generoso**, **degradê + ruído na cor**, **luz grande e macia com AO**, e **bake** para levar isso ao navegador. Nenhuma delas pede GPU no navegador.
2. Os profissionais ajustam luz **por ícone** e aceitam isso (o 3dicons desistiu de automatizar) [34]. Nosso `kit.py` com luz única é bom ponto de partida, mas o piloto deve prever um ajuste fino por ícone.
3. Primeiro passo concreto e barato: baixar 2–3 `.blend` do 3dicons (CC0), ler com `bpy` as luzes (tipo, tamanho, força, posição) e os materiais, e comparar com o `kit.py`. Isso é aprender com arquivo real, não com descrição.

---

## Fontes

1. three-projected-material (GitHub/npm) — https://github.com/molnarm/three-projected-material · https://npmjs.com/package/three-projected-material
2. Documentação indexada do three-projected-material (opções, `project`, `allocateProjectionData`) — https://docsearch.algolia.com/mcp/docs/repo/marcofugaro/three-projected-material
3. Codrops, "Playing with Texture Projection in Three.js" — https://tympanus.net/codrops/2020/01/07/playing-with-texture-projection-in-three-js/
4. Versluis, "Projection Painting in Blender: The Basics" — https://www.versluis.com/2021/10/blender-projection-painting/ · tarefa de pintura por projeção de câmera no Blender — https://developer.blender.org/T81662
5. Manual do Blender, UV Project Modifier — https://docs.blender.org/manual/en/dev/modeling/modifiers/modify/uv_project.html
6. LaMa inpainting (licença Apache-2.0; ONNX no OpenCV Zoo) — https://huggingface.co/opencv/inpainting_lama/raw/main/README.md · https://huggingface.co/Carve/LaMa-ONNX
7. three.js forum, "How to bake light with textures?" — https://discourse.threejs.org/t/how-to-bake-light-with-textures/52076
8. three.js forum, lightmap × cor difusa, `MeshBasicMaterial` e comando `unlit` — https://discourse.threejs.org/t/why-should-i-use-lightmap-instead-of-draw-shadow-in-diffusemap/46759/2 · Blender Artists, lightmap para glTF — https://blenderartists.org/t/newbie-how-to-export-lightmap-for-gltf-2-0/1335887
9. mesh-baked-material (limitação de especular no Basic) — https://npmjs.com/package/mesh-baked-material · Svilenkovic, "How to bake lighting for web" — https://svilenkovic.com/3d/how-to-bake-lighting-for-web
10. Manual do Blender, Render Baking (Cycles) — https://www.blender.org/manual/en/render/cycles/baking.html
11. TexTools, `op_bake.py` (verificação de contribuições de luz) — https://www.github.com/franMarz/TexTools-Blender/blob/master/op_bake.py · bug do bake Combined preto — https://projects.blender.org/blender/blender/issues/46550
12. three.js forum, `texture.channel` e UVs extras — https://discourse.threejs.org/t/documentation-what-exactly-is-texture-channel-for/81168/2 · https://discourse.threejs.org/t/lightmap-uses-wrong-uv-in-loaded-gltf-model/57434
13. @gltf-transform/cli — https://www.npmjs.com/package/@gltf-transform/cli · guia "optimize glb for web" — https://app.cinevva.com/guides/optimize-glb-for-web
14. MeshMatcapMaterial (referência da API) — https://pub.dev/documentation/three_js_core/latest/materials_mesh_matcap_material/MeshMatcapMaterial-class.html · https://troisjs.github.io/guide/materials/matcap-material
15. nidorx/matcaps (sem licença única) — https://github.com/nidorx/matcaps
16. three.js docs, MeshToonMaterial — https://threejs.org/docs/pages/MeshToonMaterial.html
17. three.js docs, MeshPhysicalMaterial — https://threejs.org/docs/pages/MeshPhysicalMaterial.html
18. three.js docs, RoomEnvironment e PMREMGenerator — https://threejs.org/docs/pages/RoomEnvironment.html · https://threejs.org/docs/pages/PMREMGenerator.html · fórum sobre custo de regenerar PMREM — https://discourse.threejs.org/t/bad-performances-when-animating-a-pmremgenerator-environment/48043
19. N8AO (presets, meia-resolução, transparentes) — https://github.com/N8python/n8ao · https://npmjs.com/package/n8ao
20. GameDev.net, curvas de nível em pixel shader — https://gamedev.net/forums/topic/529926-terrain-contour-lines-using-pixel-shader/
21. R. Reusser, "Adaptive contouring in fragment shaders" — https://rreusser.github.io/notebooks/adaptive-contouring-in-fragment-shaders
22. Manya, Ayyala & Benger, "Cartographic Rendering of Elevation Surfaces using Procedural Contour Lines" (WSCG 2013) — https://otik.uk.zcu.cz/handle/11025/10597?locale=en
23. Depth Anything V2 (licenças por tamanho, entrada 518, CPU) — https://huggingface.co/spaces/depth-anything/Depth-Anything-V2/commit/9ebc8354fd72c259a7ba84c0eaa8bbe9148eefd3
24. Bruno Simon, estudo de caso do portfólio — https://medium.com/@bruno_simon/bruno-simon-portfolio-case-study-960402cc259b · Three.js Journey (aulas de bake) — https://threejs-journey.com/lessons
25. TripoSR (MIT) — https://huggingface.co/stabilityai/TripoSR · https://ai-tools-finder.pages.dev/tools/triposr
26. Hunyuan3D-2, LICENSE — https://huggingface.co/tencent/Hunyuan3D-2/blob/main/LICENSE
27. Stable Fast 3D (Community License) — https://huggingface.co/stabilityai/stable-fast-3d · TRELLIS (MIT) — https://huggingface.co/davidleiva4999/TRELLIS-text-large/blob/main/README.md?code=true
28. onnx-community/depth-anything-v2-small — https://huggingface.co/onnx-community/depth-anything-v2-small
29. Marigold (Apache-2.0) — https://huggingface.co/prs-eth/marigold-depth-v1-0/raw/main/README.md · ZoeDepth (MIT) — https://huggingface.co/Intel/zoedepth-nyu/raw/52ae69caf7896c927909b3ceab4249c235e16dc1/README.md
30. Paralaxe por profundidade em three.js — https://flavioow.github.io/threejs-depth-portrait/docs/en/guide/creating-the-parallax-effect.html · PR de exemplo no three.js — https://github.com/mrdoob/three.js/pull/14479 · camadas com Depth Anything no navegador — https://awesome.ecosyste.ms/projects/github.com%2Factiveguild%2Frender-image-depth · síntese de vistas e LDI — https://v2.scrollsequence.com/converting-2d-images-to-fake-3d-immersive-content/
31. Shih et al., "3D Photography using Context-aware Layered Depth Inpainting" (CVPR 2020) — https://openaccess.thecvf.com/content_CVPR_2020/html/Shih_3D_Photography_Using_Context-Aware_Layered_Depth_Inpainting_CVPR_2020_paper.html
32. Polygon Runway, "Blender X-mas 3D Icon Tutorial" (página do vídeo) — https://www.youtube.com/watch?v=9-WBWV_BAS4 · resumo — https://classcentral.com/course/youtube-blender-x-mas-3d-icon-tutorial-polygon-runway-175920
33. BlenderNation, tutorial de ícone de guitarra com subdivisão e bevel (Polygon Runway) — https://www.blendernation.com/2022/05/11/guitar-icon-tutorial/
34. Smashing Magazine, "Open-Source 3dicons Library: Case Study" — https://www.smashingmagazine.com/2022/05/3dicons-open-source-library-case-study-download/
35. 3dicons (sobre, licença CC0, arquivos .blend) — https://old.3dicons.co/about · https://blenderartists.org/t/3dicons-open-source-3d-icon-library/1333583
36. Microsoft Design, "Bringing new emoji to Windows 11" — https://microsoft.design/articles/bringing-new-emoji-to-windows-11/
37. Microsoft Design, "The making of Fluent emoji" (via fórum que reproduz o texto) — https://www.elevenforum.com/t/the-making-of-fluent-emoji-for-windows-11.4340/
38. Spline, "Design consistent 3D icon sets" — https://spline.design/solutions/3d-icons
39. "31 Things I Wish I Knew When I Started Learning Spline" — https://splinetime3d.substack.com/p/31-things-i-wish-i-knew-when-i-started
40. DEV Community, "Creating 3D models in Spline for Three.js" — https://dev.to/felixrunquist/creating-3d-models-in-spline-for-threejs-152b · Hack Design, Spline — https://www.hackdesign.org/toolkit/spline/
41. "Mastering Studio Lighting Setups in Blender for Product Renders" — https://efbmedia.vercel.app/blog/mastering-studio-lighting-blender-product-renders
42. Uhiyama Lab, "Blender Lighting Fundamentals" — https://uhiyama-lab.com/en/notes/blender/lighting-fundamentals-realistic-light/
43. Udemy, "Blender Essential 3D for UI and Visual Designers" (ementa: SVG → extrusão → bevel, Cycles, Film Transparent) — https://www.udemy.com/course/blender-essential-3d-for-ui-and-visual-designers/ · Roblox DevForum (Film > Transparent) — https://devforum.roblox.com/t/creating-roblox-styled-2d-digitally-hand-drawn-art-with-blender/2584302
44. Manual do Blender, Bevel Node — https://docs.blender.org/manual/en/4.1/render/shader_nodes/input/bevel.html
45. Edward Loveall, "Blender Shader Contour Maps" — https://blog.edwardloveall.com/blender-shader-contour-maps
46. BlenderNation, "Build a Stylized Topographic Landscape in Blender" — https://www.blendernation.com/2024/02/13/build-a-stylized-topographic-landscape-in-blender/
47. CGTrader, "How To Cut Through A 3D Model In Blender 3.5" — https://www.cgtrader.com/tutorials/9505-how-to-cut-through-a-3d-model-in-blender-3-5 · RadCut — https://superhivemarket.com/products/radcut--cutaway--cross-section-renders
48. BlenderNation, "BlenderMeds Bone Cross section tutorial" — https://www.blendernation.com/2019/08/14/blendermeds-bone-cross-section-tutorial/
49. CGTrader, modelo de célula animal cortada ao meio (referência de construção) — https://www.cgtrader.com/3d-models/science/medical/animal-cell-3d-blender
50. Manual do Blender, Principled BSDF — https://docs.blender.org/manual/en/2.91/render/shader_nodes/shader/principled.html
51. AgX (repositório do autor; adotado no Blender 4.0) — https://github.com/EaryChow/AgX · https://projects.blender.org/blender/blender/pulls/106355
52. Blender Artists, "Working in AgX color management" — https://blenderartists.org/t/working-in-agx-color-management/1408582

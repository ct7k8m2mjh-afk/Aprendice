# Ícones no estilo da referência do Vitor (30/10)

## O que o Vitor pediu (palavras dele)
"REFERENCIA DE SOMBREAMENTO DIRECAO DA LUZ E OBJETOS. AGORA SIM ARRUME TUDO. olhe a qualidade destes icones que eu te mandei
e O DESIGN DELES. ESTA MUITO MAIS REAL, SUAVE E FLUIDO. FACA EXATAMENTE OS ICONES COMO NA REFERENCIA E SE TIVEREM OUTROS EM QUE
NAO ESTA NA REFERENCIA ADEQUE O ESTILO"

Referência: REFERENCIA_mat.png, REFERENCIA_qui.png, REFERENCIA_bio.png (nesta pasta). Abra e estude antes de começar.

## O estilo (o que torna a referência boa)
- Objeto 3D realista, materiais "de verdade": plástico brilhante saturado, metal dourado/prateado, vidro com reflexo, madeira,
  papel, pedra. Bordas arredondadas (chanfro), nada de traço/contorno, nada chapado, nada de clip-art.
- UM objeto (ou um grupinho de 2-3) que qualquer pessoa reconhece na hora e que remete ao conteúdo. Leitura imediata a 72 px.
- Câmera levemente de cima (~30°), objeto de 3/4. Luz principal de FRENTE (lado da câmera, um pouco acima) — pedido do Vitor às 20:35; a sombra cai para TRÁS
  do objeto e aparece só como contato suave, curto e centralizado na base (veja REFERENCIA_por.png). Fundo transparente.
- Cores limpas e vivas (azul #1f5fd6, vermelho #d62828, verde #2e9e44, amarelo #f2b705, roxo #7b2cbf, dourado #d4a52a...),
  coerentes com a referência. Texto só se for essencial e curto (como "sin θ" ou "3.1416" da referência) e sempre correto.
- Proibido: emoji, logos oficiais, marcas, rostos de pessoas reais, qualquer coisa com cara de "desenho de IA" malfeito.
- Conteúdo científico precisa estar CERTO (zero erro: geometria de molécula, número de elétrons, forma de organela, etc.).

## Como produzir (duas rotas; prefira a 1)
1. **3D no Blender (bpy já instalado)** — rota principal, dá o mesmo acabamento da referência.
   Escreva `cenas/<ID>.py` usando `kit.py` (leia o kit: cena(), plastico(), metal(), vidro(), liquido(), fosco(), esfera(), caixa(),
   cilindro(), cone(), toro(), bastao(), texto(), render()). Pode usar qualquer recurso do bpy (modificadores, curvas, booleanos,
   subdivisão, malhas próprias). Render SEMPRE com trava de CPU (a máquina tem 2 núcleos e outros agentes renderizam junto):
       flock /tmp/render.lock python3 cenas/<ID>.py
   e grave o PNG em `render/<ID>.png`. Depois:
       python3 -I post.py render render/<ID>.png <ID>
2. **Foto real recortada** — só para coisas orgânicas/complexas difíceis de modelar (inseto, planta, animal, alimento, objeto
   antigo), quando houver foto boa e de licença livre no Wikimedia Commons (CC0, domínio público, CC BY, CC BY-SA).
   Baixe pela API do Commons com o cabeçalho `User-Agent: AprendiceStudyApp/1.0` e NADA de dado pessoal em nenhuma requisição.
   Guarde a foto em `fotos/<ID>.<ext>` e rode: `flock /tmp/render.lock python3 -I post.py foto fotos/<ID>.jpg <ID> [--flip] [--crop x0,y0,x1,y1]`
   (prefira foto com luz frontal; a sombra é sintética: contato centralizado na base, caindo para trás).
   Registre autor, licença e URL da página do arquivo.

`post.py` grava o SVG final no lugar certo (módulo B01 -> icones_real/B01.svg; conteúdo B01.3 -> icones_real/sub/B01.3.svg),
guarda backup do antigo em icones_real/_bak_3010b/ e cria a prévia `prev/<ID>.png` (sobre branco e sobre o rosa do app).

## Conferência obrigatória (cada ícone)
Abra `prev/<ID>.png` com a ferramenta Read e compare com a referência: mesmo nível de realismo? luz de frente?
sombra só de contato, centralizada? reconhecível em tamanho pequeno? cientificamente correto? Se não, refaça. Monte ao final uma folha
`prev/folha_<lote>.png` (todos os seus ícones lado a lado, 96 px cada, fundo #F5F5F3) e confira o conjunto: mesmo tamanho
aparente, mesma luz, nenhuma cor destoando.

## Registro
Atualize a entrada de cada ID no mapa (`icones_real/sub/mapa_<materia>.json` para conteúdo; `icones_real/mapa.json` para módulo):
"fonte" ("Gerado no projeto: render 3D (Blender) em icones_real/foto3d/cenas/<ID>.py" ou "Wikimedia Commons: <autor>"),
"arquivo_original", "licenca", "por_que" (o que é o objeto e por que remete ao conteúdo). Mantenha o JSON válido; use
`flock /tmp/mapa.lock` ao gravar o mapa (outros agentes também gravam).
Lista de IDs, títulos e o objeto atual de cada um: `lista.json`.
Não mexa em nada fora de icones_real/ (não rode o gerador do app, não publique nada).

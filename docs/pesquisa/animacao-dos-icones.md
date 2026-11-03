# Animação dos ícones 3D: vale a pena, e como fazer cada um

Pesquisa feita em 03/11/2026 para responder ao dono: **qual é a melhor forma de animar cada ícone pela função do que ele mostra, e se é inteligente animar.**
Ponto de partida: o catálogo `docs/animacoes-dos-icones.md`, as regras de `docs/pedidos-do-dono.md` e o código que já existe em `app/src/ui/icones3d/`.
As fontes estão numeradas entre colchetes, por exemplo [3], e listadas no fim.

---

## 1. Resposta curta

**Sim, vale animar, mas com quatro condições.** Sem elas, é melhor deixar o ícone parado.

1. **A animação só acontece quando o aluno pede.** Ela dispara ao passar o mouse ou dar foco pelo teclado; no celular, regra própria (seção 3.3). Nada fica se mexendo sozinho na tela.
2. **Ela toca uma vez e para no estado final**, com a lâmpada acesa e a agulha no norte. Fica entre 1 e 2,5 s, sempre abaixo de 5 s. Nada de repetição contínua.
3. **Só um ícone anima por vez.** Quem pede menos movimento vê o estado final parado.
4. **O movimento tem de estar cientificamente certo.** Um ícone de ciência que se mexe errado ensina errado. A pesquisa mostra que é exatamente aí que a animação faz estrago (seção 2.2).

**Por que não animar tudo à vontade:** o ícone é navegação, não aula. O aluno o vê por 1 ou 2 segundos a caminho de uma matéria. Nesse papel, a animação serve para três coisas: mostrar que o ícone é clicável, dar resposta ao toque e dar identidade ao produto. Ela **não ensina** de forma mensurável. Movimento decorativo em material de estudo tende a atrapalhar [9][10]. O valor didático real dessas cenas aparece em outro lugar: nos cartões de teoria, tocadas pelo aluno (ideia na seção 6).

---

## 2. O que a pesquisa diz

### 2.1 Interface e acessibilidade

| Tema | O que dizem as fontes | O que isso significa no Aprendice |
|---|---|---|
| Duração | Resposta simples em ~100 ms; mudanças maiores em 200–300 ms; a maioria entre 100 e 400 ms; acima de 500 ms "começa a arrastar". O que se vê com frequência deve ser mais curto e mais sutil. Use desaceleração (*ease-out*), não movimento linear [1]. | A **resposta** ao mouse começa em menos de 100 ms (o ícone "acorda": leve brilho ou inclinação). A **demonstração da função** pode durar mais (1–2,5 s), porque não bloqueia nada: o aluno pode clicar a qualquer momento [3]. |
| Movimento disparado pelo usuário | WCAG 2.3.3 (AAA): animação disparada por interação deve poder ser desligada, salvo se for essencial. Motivo: tontura, náusea e dor de cabeça em pessoas com distúrbio vestibular. Técnica: `prefers-reduced-motion` [2]. | Com "reduzir movimento" ligado, o ícone mostra direto o **estado final**, parado: lâmpada acesa, agulha no N. O código atual já congela; falta mostrar o estado final em vez do inicial. |
| Movimento que começa sozinho | WCAG 2.2.2 (A, obrigatório): movimento que começa automaticamente, dura mais de 5 s e aparece junto com outro conteúdo precisa de pausa, parada ou ocultação. **Passar o mouse e rolar a tela contam como início automático**; só o clique direto não conta [4]. | Toda animação de ícone tem de **terminar sozinha antes de 5 s**, mesmo com o mouse parado em cima. Hoje o átomo e a bússola se mexem o tempo todo, mesmo sem mouse (seção 4). |
| Clarões | WCAG 2.3.1: nada pode piscar mais de 3 vezes por segundo [4]. | Lâmpada, janelas e raios **acendem uma vez**, sem tremular. |
| Tipos de movimento que mais enjoam | Zoom e escala, rotação e espiral, camadas em velocidades diferentes (paralaxe), planos 2D girando no espaço 3D, movimento na periferia da visão [5]. | Evitar **girar o ícone inteiro sem parar** e zoom grande. Preferir movimento de uma parte pequena (agulha, elétron, gota) e mudança de luz ou cor. |
| Guias de plataforma | Apple: animação gratuita ou excessiva distrai; respeitar "Reduzir movimento"; nenhuma informação importante pode depender só da animação; o usuário não deve esperar uma animação para agir, sobretudo uma que veja muitas vezes [6]. Google/Material: priorizar a usabilidade; movimento chamativo fica para elementos pequenos, como ícones [7]. | O ícone é exatamente o lugar "permitido" para movimento expressivo, desde que curto, opcional e que nunca atrase o clique. |
| Mouse × toque | Em tela de toque não existe "passar o mouse". Efeito de hover em celular fica "grudado" depois do toque. A solução padrão é `@media (hover: hover) and (pointer: fine)` [8]. | Ver regra de gatilho na seção 3.3. |

### 2.2 Ciência da aprendizagem

- **A animação ajuda pouco no geral e ajuda quando representa o próprio processo.** A meta-análise de Höffler & Leutner (76 comparações) encontrou vantagem média pequena-moderada da animação sobre a figura parada (d = 0,37). A vantagem é maior quando a animação **representa** a mudança que se quer ensinar (d ≈ 0,40) do que quando é decorativa [11]. Uma reanálise posterior com 140 comparações achou efeito ainda menor (g ≈ 0,23), mais forte quando "o próprio jeito da mudança" é o conteúdo [12].
- **Princípio da congruência (Tversky e colegas):** a forma do movimento deve corresponder ao conceito. Animações rápidas ou complexas demais não são percebidas direito, e muitos processos são entendidos como **sequência de passos**, não como fluxo contínuo [13]. Para o ícone, isso significa **um passo claro por animação**.
- **Detalhes sedutores:** enfeites interessantes mas irrelevantes pioram retenção e transferência, com efeito pequeno a médio. O efeito é mais forte quando o tempo de estudo é curto [9][10]. Por isso **nada se mexe nas telas de questão e resolução**. O ícone anima só nas telas de navegação.
- **Saliência × relevância (Lowe & Boucheix):** o olho vai para o que se mexe ou brilha mais, não para o que importa. Animações complexas desviam a atenção para o detalhe errado [14]. Por isso cada ícone deve ter **um único elemento em destaque no movimento**, que seja o que carrega a função.
- **Sinalização, coerência e ritmo pelo aluno (Mayer):** cortar o que sobra, sinalizar o essencial e deixar o aluno controlar o ritmo em segmentos [15]. Isso vale para a versão didática das cenas (seção 6).
- **Risco de ensinar errado, com casos documentados:**
  - **Átomo:** o modelo planetário (elétron em órbita fixa como planeta) é a concepção que mais resiste ao ensino. Muitos alunos dizem que o átomo "é" o modelo de Bohr [16][17]. Os vestibulares cobram Rutherford-Bohr, então o ícone pode usá-lo, mas deve mostrar o que Bohr tem de certo: **camadas e saltos com emissão de luz**.
  - **Circuito:** "corrente sai do + e vai sendo gasta pela lâmpada" e "a lâmpada só acende quando a corrente chega nela" são o raciocínio sequencial e o modelo de consumo descritos por Shipstone e confirmados em várias pesquisas [18][19]. A animação precisa mostrar **a corrente começando no circuito todo ao mesmo tempo e igual antes e depois da lâmpada**.
  - **Lua:** muitos alunos acham que a Lua não gira. Animação de órbita sem a rotação síncrona reforça o erro [20][21].

### 2.3 Desempenho (muitos ícones 3D na mesma tela)

- Navegadores limitam os contextos WebGL ativos por processo: 16 no Chrome, Firefox e Safari de computador; **8 a 9 em Android**. Ao passar do limite, o contexto mais antigo é perdido [22][23]. **Um ícone = um canvas não funciona.**
- A técnica recomendada no manual do three.js é **um único canvas** que desenha cada cena no retângulo do seu elemento (`setViewport` + `setScissor`), pulando o que está fora da tela [24]. **O Aprendice já faz isso** (`criarPalco` em `app/src/ui/icones3d/cenas3d.js`).
- O que falta: **desenhar só quando algo muda** (*render on demand*) [25]. Pausar quando a aba some (`visibilitychange`) e quando o palco sai da tela (`IntersectionObserver`) [26]. Hoje o laço `requestAnimationFrame` redesenha **todas** as cenas, com sombras suaves e materiais físicos, **60 vezes por segundo, para sempre**. Isso gasta bateria no celular mesmo com tudo parado.
- Receita para o palco:
  1. Desenhar cada cena **uma vez** ao montar, ao mudar o tema e ao redimensionar.
  2. Ao ativar um ícone, ligar o laço **só para aquela vista** até a animação terminar; depois parar.
  3. Rolar a tela: redesenhar as vistas no novo lugar, sem animar (ou trocar por imagem fixa enquanto rola).
  4. Sombras: `shadowMap.autoUpdate = false` e atualizar só quando algo se move.
  5. Celular: `pixelRatio` no máximo 2 (já está) e mapa de sombra de 512 nos ícones pequenos.

---

## 3. Contrato de animação (vale para todos os ícones)

### 3.1 Forma
- **Repouso:** totalmente parado, no estado "antes" da função: lâmpada apagada, agulha levemente fora do norte, alfinete fora do mapa. A boa iluminação e a sombra já dão "vida" sem movimento.
- **Ativação:** em menos de 100 ms o ícone dá um sinal (sobe 2–3% de brilho ou inclina 3–5°). Em seguida toca **a função, uma vez**: 1–2,5 s com *ease-out*, ou física amortecida (molas, oscilação que diminui).
- **Fim:** fica no **estado "depois"** enquanto o mouse ou o foco estiver no ícone. Ao sair, volta ao repouso em 200–300 ms, sem repetir a função ao contrário.
- **Nunca repetir em laço.** Se a função é cíclica (corrente, onda, vento), mostrar 1–2 ciclos e parar, deixando o resultado: lâmpada acesa, onda já propagada.
- **Um elemento principal se move.** No máximo um secundário, depois do primeiro (sequência, não simultâneo).
- **Sem girar o ícone inteiro** como atração. Girar com o dedo ou arrastando (já existe) é controle do aluno e tudo bem.
- **Reduzir movimento:** mostra o estado final parado. Mudanças de luz e cor (lâmpada acendendo) podem continuar como transição suave de 200 ms, porque não são deslocamento.
- **Ritmo de abertura:** na entrada, nenhuma animação automática em grupo.

### 3.2 Onde anima
- Início e lista de matérias, faixa de temas no topo da matéria e cabeçalho da matéria.
- **Nunca** dentro de questão, resolução, flashcard ou simulado (coerência e detalhes sedutores [9][15]).

### 3.3 Gatilho por aparelho
| Aparelho | Gatilho |
|---|---|
| Mouse (`hover: hover` e `pointer: fine`) | Passar o mouse **por 150 ms** (evita disparar vários ícones quando o mouse só atravessa a lista) ou dar foco pelo teclado. |
| Teclado | `focus-visible` dispara igual ao mouse. Enter abre. |
| Toque (celular, iPad) | O toque **abre** a matéria; não dá para usar o mesmo toque para animar. A animação toca **uma vez no cabeçalho da matéria ao entrar** (ícone grande, sozinho na tela, menos de 5 s) e de novo se o aluno tocar no ícone do cabeçalho. Na lista, só a resposta de pressão (afunda 3% em 100 ms). |

Hoje o código usa `pointerenter`/`pointerdown`. No toque, `pointerleave` nem sempre chega e o ícone fica "ativo" para sempre (o hover grudado de [8]). Precisa separar mouse de toque.

---

## 4. O que o código atual faz de diferente (achados)

Lido em `app/src/ui/icones3d/` no dia 03/11. São correções a fazer quando cada ícone for refeito.

| Arquivo | Achado | Por que corrigir |
|---|---|---|
| `cenas3d.js` | Laço eterno redesenhando todas as vistas a 60 quadros por segundo | Bateria e calor no celular [25][26] |
| `cenas3d.js` | Com "reduzir movimento", chama `animar(0, false)` → mostra o estado **inicial** | Deveria mostrar o estado final (função visível parada) |
| `cenas3d.js` | `pointerdown` ativa; no toque o ícone pode ficar ativo para sempre | Hover grudado [8] |
| `atomo.js` | Elétrons giram **sempre** (velocidade 0,25 em repouso) | Movimento automático contínuo (WCAG 2.2.2 [4]) |
| `atomo.js` | Núcleo com **7 prótons (vermelhos) e 6 nêutrons** e **6 elétrons** → um cátion N⁺, não um átomo neutro | Erro de química num app de Medicina. Trocar para 6 p + 7 n (carbono-13) ou 6 p + 6 n (carbono-12), elétrons 2 + 4 em duas camadas |
| `atomo.js` | Três órbitas inclinadas com 2 elétrons cada, velocidades arbitrárias | É o "símbolo atômico", não Bohr. Ver seção 5 |
| `bussola.js` | Agulha com tremida contínua (`0.03·sin`) em repouso | Movimento automático contínuo |
| `bussola.js` | Alfinete sobe e desce (seno) ao ativar | Alfinete não quica: cai, espeta e fica |
| `circuito.js` | Lâmpada acesa (brilho 0,9) **em repouso**, sem corrente | Lâmpada acesa sem corrente é fisicamente errado |
| `circuito.js` | Brilho tremendo (`sin(t·9)`) | Pilha é corrente contínua: a lâmpada não pisca |
| `circuito.js` | Pulsos espalhados pelo circuito (bom), mas a lâmpada acende por rampa, não junto | Ver seção 5 (modelo sequencial [18]) |
| `celula.js` | Mitocôndrias "pulsam" (mudam de tamanho) e cristas piscam | Mitocôndria não pulsa nem contrai. Sugere algo falso. Remover |
| `solidos.js` | Cilindro e cone giram sobre o próprio eixo | Sólido de revolução girando no próprio eixo **não muda de aparência**: o movimento é invisível ou parece defeito. Só o cubo mostra algo |
| `solidos.js` | Esfera quica | Sem função (decorativo) |
| `livros.js` | Pena mergulha no tinteiro em laço, nunca escreve | O catálogo pede "escreve"; o laço é movimento contínuo |

---

## 5. Recomendação por ícone

Legenda: **Anima?** Sim / Talvez (baixa prioridade) / Não. **Tempo** = duração da função, sem contar a volta ao repouso. Gatilho padrão de todos: seção 3.3, uma vez por ativação, estado final mantido.

### 5.1 Ícones principais das matérias

**Biologia — célula animal em corte (1/4).** Anima? **Sim.** Tempo: 2,2 s.
- **Movimento:** a **via secretora**, uma única vez.
  1. Uma vesícula brota da face *trans* do Golgi (a face voltada para a membrana; a *cis* fica voltada para o núcleo e o retículo rugoso).
  2. Ela anda pelo citoplasma num trajeto levemente curvo, com pequenas paradas, como no transporte por motores em microtúbulos.
  3. Ela se funde com a membrana e o conteúdo sai (exocitose): um pequeno "sopro" de partículas para fora.
  - Opcional, antes: uma vesícula menor vai do retículo rugoso para a face *cis* (RER → Golgi → membrana, a sequência do clássico experimento de pulso-caça de Palade, muito cobrado).
- **Tirar:** mitocôndrias pulsando e núcleo brilhando. São enfeite e o primeiro sugere algo falso.
- **Cuidado científico:**
  - A ordem é RER → Golgi *cis* → *trans* → membrana, nunca ao contrário.
  - A vesícula se funde à membrana, não a "atravessa".
  - No corte de 1/4, a vesícula tem de sair pela parte da membrana que se vê, não pelo corte.

**Química — átomo.** Anima? **Sim, corrigindo o modelo.** Tempo: 1,8 s.
- **Proposta (mais inteligente que o catálogo): salto quântico de Bohr.**
  1. Núcleo de carbono neutro: 6 prótons, 6 ou 7 nêutrons.
  2. Duas camadas circulares no mesmo plano levemente inclinado: K com 2 elétrons, L com 4.
  3. Ao ativar, os elétrons dão **meia volta**, a camada interna mais rápida que a externa (no modelo de Bohr, a velocidade cai com o nível).
  4. Um elétron da L **salta** para uma camada externa tracejada, que aparece só nessa hora.
  5. Ele volta e **emite um fóton**: um pequeno pulso de luz colorida que sai do átomo.
  6. Para.
- **Por quê:** é o que Bohr tem de certo e o que o vestibular cobra (teste de chama, fogos de artifício, espectros). Mostra **níveis**, não "planetinhas".
- **Alternativa simples:** só a meia volta dos elétrons nas duas camadas, e parar.
- **Cuidado científico:**
  - Número de elétrons igual ao de prótons.
  - Órbitas circulares, não elipses de "logo".
  - O fóton sai **na volta** para o nível mais baixo, não na ida.
  - No cartão de teoria, deixar escrito "modelo de Rutherford-Bohr (histórico)" para não virar "o átomo é assim" [16][17].

**Matemática — sólidos (cilindro, cubo, cone, esfera).** Anima? **Sim.** Tempo: 1,5 s.
- **Movimento simples:** o **conjunto** gira 35–45° sobre uma base, como um prato giratório, com *ease-out*, e para. O cubo mostra outra face e todos revelam profundidade.
- **Tirar:** o giro individual de cilindro e cone (invisível) e o quique da esfera.
- **Ideia mais inteligente (opcional): a relação de Arquimedes.** Ajustar o desenho para cilindro, cone e esfera terem o **mesmo raio e altura = 2r**.
  - Na ativação, a esfera desce e se encaixa exatamente dentro do cilindro (tangente nas paredes, no fundo e na tampa).
  - Volumes: cone : esfera : cilindro = 1 : 2 : 3.
  - É matemática verdadeira, bonita e cobrada (volume de esfera e cone).
- **Cuidado científico:** se a ideia de Arquimedes for usada, as medidas têm de ser exatamente essas. Com as medidas atuais (raio 0,48 × 0,55, alturas diferentes), não.

**Português — livros, tinteiro e pena.** Anima? **Sim.** Tempo: 2,0 s.
- **Movimento:**
  1. A pena mergulha uma vez no tinteiro (0,5 s).
  2. Vai até a página aberta e **escreve um traço curto** em letra cursiva (1,2 s). A tinta aparece exatamente sob a ponta, como desenho progressivo do traço.
  3. Para, apoiada.
- **O que escrever:** uma palavra real e curta ("Aprendice") ou um sublinhado. Nunca rabisco que imite texto, que parece "falso".
- **Cuidado:**
  - A ordem é molhar → escrever.
  - A ponta (bico) toca o papel em ângulo de escrita, com a pena inclinada para trás.
  - A tinta sai da ponta, não do meio da pena.
  - Sem laço.

**Física — circuito (pilha, fios, lâmpada).** Anima? **Sim, corrigindo.** Tempo: 1,5 s de fluxo e depois lâmpada acesa parada.
- **Movimento:**
  - **Repouso:** lâmpada **apagada**, sem pulsos.
  - **Ativação:**
    1. Os pulsos aparecem **em todo o circuito ao mesmo tempo**, igualmente espaçados e na mesma velocidade antes e depois da lâmpada.
    2. **No mesmo instante**, a lâmpada acende (rampa de 150 ms, sem tremer).
    3. Os pulsos andam ~1 volta e somem; a lâmpada fica acesa até o mouse sair.
- **Sentido:** do polo + para o −, por fora da pilha (sentido **convencional**). Os elétrons andam ao contrário. Se houver legenda, escrever "sentido convencional".
- **Melhoria opcional:** um interruptor que se fecha no primeiro décimo de segundo dá a **causa** visível do acendimento.
- **Cuidado científico:** não fazer a corrente "sair do + e chegar à lâmpada" antes de ela acender. Não diminuir a quantidade de pulsos depois da lâmpada. Os dois desenhos ensinam o modelo sequencial e o modelo de consumo, erros clássicos [18][19]. A frase do catálogo ("corrente sai do +, corre no fio até a lâmpada...") deve mudar para "a corrente passa ao mesmo tempo no circuito todo e a lâmpada acende".

**Geografia — mapa, bússola e alfinete.** Anima? **Sim.** Tempo: 2,0 s.
- **Movimento em dois passos, contando "orientar e depois localizar":**
  1. A agulha, que estava um pouco desviada, faz uma **oscilação amortecida** e para no N (1,3 s). O código atual já faz a física certa: oscilação que diminui, como um pêndulo no campo magnético.
  2. O alfinete **cai e espeta** o mapa, com um pequeno assentamento de 2–3 mm e sem quique (0,5 s).
- **Tirar:** a tremida contínua da agulha em repouso.
- **Cuidado científico:**
  - A ponta vermelha aponta o **norte magnético**, não o geográfico.
  - No Brasil a diferença (declinação) é de vários graus para oeste e muda com o lugar e o ano. No Rio Grande do Sul era cerca de −14° em 2010 [27].
  - Num ícone estilizado é aceitável alinhar a agulha ao N do mostrador. No cartão de teoria de Cartografia, explicar a declinação.

### 5.2 Física — temas

| Tema | Anima? | O que se move (correto) | Tempo | Cuidado científico |
|---|---|---|---|---|
| F01 Fundamentos e grandezas | Sim | Só o **cronômetro**: o botão é apertado, o ponteiro corre ~1/4 de volta e para (medir = começar e parar). A régua fica parada (medir comprimento não é um movimento). | 1,2 s | Ponteiro no sentido horário. Um elemento só. |
| F02 Cinemática | Sim | O carro anda **em velocidade constante** e, a cada intervalo igual de tempo, um ponto é marcado no gráfico s × t: pontos igualmente espaçados formando **reta**. As rodas giram sem deslizar. | 2,0 s | Coerência total: se o carro acelera, a curva vira parábola. Escolher MU e manter. Giro das rodas = distância ÷ raio. |
| F03 Dinâmica e forças | Sim | **Não pulsar** os vetores (vetor que muda de tamanho sugere força variando). Os vetores **nascem** um a um a partir do ponto de aplicação (P do centro do corpo, N da superfície de contato, F e Fa na base) e ficam. | 1,6 s | Corpo em repouso ou em MRU: N = P e F = Fa (mesmo comprimento). Acelerando: F > Fa. N e P **não** são par ação-reação; não animá-los como par. |
| F04 Trabalho, energia e potência | Sim | O raio acende (fonte de energia) e **logo em seguida** o peso sobe com velocidade constante até uma marca de altura e para. | 1,6 s | Energia antes do trabalho (causa → efeito). Subida com velocidade constante = potência constante. Sem "sobrar" movimento depois. |
| F05 Impulso e quantidade de movimento | Sim | Duas esferas **iguais**: a da esquerda vem, colide de frente, **para**, e a da direita sai com a mesma velocidade (pêndulo de Newton também serve). | 1,2 s | Troca de velocidades só vale para colisão elástica, frontal e de **massas iguais**. Se o desenho tiver esferas de tamanhos diferentes, a animação tem de mudar (a menor sai mais rápida; nenhuma para). |
| F06 Gravitação e astronomia | Sim | A Lua percorre **1/4 de órbita** e para, **sempre com a mesma face voltada para a Terra** (marcar uma cratera para que se veja). A Terra fica parada. Saturno fica parado ao fundo. | 2,2 s | Rotação síncrona: Lua sem girar é um erro clássico [20][21]. Sentido anti-horário visto do norte. Órbita quase circular, sem elipse exagerada. Luz fixa (o Sol não se move), então as fases ficam coerentes. |
| F07 Hidrostática | Sim | A boia é solta, afunda um pouco, **oscila e para** com a fração submersa certa (empuxo = peso). As setas de pressão, se existirem, ficam **paradas**. | 1,5 s | Oscilação amortecida. Setas de pressão **perpendiculares** às superfícies e crescendo de forma linear com a profundidade. Não animar as duas coisas juntas. |
| F08 Termologia | Sim | A chama "acende". A coluna do termômetro sobe **depressa no começo e cada vez mais devagar** (aproximação do equilíbrio) e para. As ondas de ar quente sobem uma vez. | 2,0 s | Calor não é substância: as "ondas" representam ar quente subindo (convecção), não "calor saindo". O termômetro mostra a temperatura dele mesmo, então a subida tem atraso. A chama não tremula depois do fim. |
| F09 Óptica | Sim | O feixe branco entra, **já se separa na primeira face** (leque estreito dentro do prisma), abre mais na saída e fica. Vermelho é o menos desviado, violeta o mais. | 1,0 s | Erro comum em ícones: feixe branco dentro do prisma abrindo só na saída. A separação começa na entrada. Cores na ordem certa. O feixe dobra em direção à normal ao entrar. |
| F10 Ondulatória e acústica | Sim | O cone do alto-falante vai e volta 2–3 vezes. Dele saem **frentes de compressão** (arcos mais densos) que se afastam com velocidade constante, perdendo intensidade, e somem. | 1,5 s | Som no ar é onda **longitudinal**: não desenhar senoide subindo e descendo no ar. As partículas do ar oscilam no lugar; quem viaja é a perturbação. |
| F11 Eletricidade e circuitos | Sim | Igual ao circuito principal (5.1). Para diferenciar, pode ter **duas lâmpadas em série** acendendo **juntas e com o mesmo brilho**. | 1,5 s | Mesmos cuidados: nada sequencial, nada "consumido". |
| F12 Magnetismo e eletromagnetismo | Sim | **Proposta melhor que o catálogo:** experiência de Faraday. O ímã entra na bobina e o ponteiro do galvanômetro desvia; quando o ímã para, o ponteiro **volta a zero**. As linhas de campo aparecem desenhadas uma vez (do N para o S por fora) e ficam paradas. | 2,0 s | Corrente induzida **só enquanto o fluxo varia**: ímã parado, corrente zero. Linhas de campo não "escorrem" (animar fluxo ao longo delas sugere que algo anda nelas). Por dentro do ímã as linhas vão do S para o N (laço fechado). |

### 5.3 Geografia — temas

| Tema | Anima? | O que se move (correto) | Tempo | Cuidado científico |
|---|---|---|---|---|
| G01 Cartografia | Sim | Igual à bússola principal: a agulha se acomoda no N, depois o alfinete espeta. Para diferenciar, a **rosa dos ventos** pode se alinhar ao N do mapa. | 1,8 s | Norte magnético ≠ geográfico (declinação [27]). Alfinete não quica. |
| G02 Relevo e estrutura da Terra | Sim | As camadas se destacam **de fora para dentro** (crosta → manto → núcleo externo → núcleo interno), por luz ou cor, sem separar as peças. | 2,0 s | Proporções: crosta **finíssima** (5–70 km num raio de ~6.371 km), manto ~2.900 km, núcleo ~3.480 km de raio (pouco mais da metade do raio). Núcleo externo líquido, interno sólido. Não "desmontar" a Terra. |
| G03 Clima e atmosfera | Sim (depois de corrigir o desenho) | A Terra gira ~60° **de oeste para leste**. A divisa dia-noite fica **parada** (o Sol não se move). As nuvens, rentes à superfície, andam junto. | 2,5 s | Atmosfera é uma **casca fina** (~100 km ≈ 1,6% do raio; pode-se exagerar até ~3% para ser visível, não mais). Eixo inclinado ~23,4°. Ventos e nuvens dentro da atmosfera, em escala de região, nunca de continente. |
| G04 Hidrografia | Sim | O ciclo em 3 passos curtos: vapor sobe do mar (aquecido pelo Sol), forma nuvem, a nuvem chove sobre a terra e a água desce pelo rio até o mar. | 2,5 s | O vapor é **invisível**: usar névoa tênue, não gotas subindo. O rio corre **morro abaixo** para o mar. Opcional e muito cobrado: a evapotranspiração da floresta. |
| G05 Biomas e vegetação | Talvez | **Uma** rajada de vento: as folhas balançam e voltam ao lugar; o tronco quase não se move. | 1,0 s | Decorativo, pouco valor; aceitável por ser curto. Sem balanço contínuo (movimento periférico enjoa [5]). |
| G06 População e demografia | Sim | Se o ícone for **pirâmide etária**: transição da pirâmide do Brasil de um censo antigo para um recente, com a base estreitando e o topo alargando (transição demográfica). Se forem barras comuns, elas crescem a partir do zero e param. | 1,5 s | Usar **dados reais** (IBGE) ou deixar claro que é esquemático. Barras sempre crescendo a partir do zero. |
| G07 Urbanização | Sim | **Proposta:** os prédios **sobem do chão** em sequência rápida (crescimento urbano, verticalização), em vez de janelas acendendo. Se mantiver as janelas: acendem uma vez em ordem, sem piscar. | 1,5 s | Prédios surgindo representam processo real. Janelas piscando seriam clarão (WCAG 2.3.1 [4]). |
| G08 Agropecuária e espaço agrário | Sim | O trator avança e **deixa atrás de si** as fileiras aradas ou plantadas (causa → efeito). As rodas giram sem deslizar. | 2,0 s | Fileiras seguindo **curvas de nível** em terreno inclinado, se o desenho tiver relevo (conservação do solo, tema cobrado). |
| G09 Indústria e energia | Sim | A engrenagem dá 1/2 volta e para. A fumaça sobe e se dispersa uma vez. | 1,5 s | Engrenagens encaixadas giram em **sentidos opostos**, com velocidade inversa ao número de dentes. A fumaça se abre e clareia ao subir; todas as plumas inclinam para o mesmo lado (mesmo vento). |
| G10 Geopolítica e globalização | Sim | As rotas se desenham entre cidades reais, uma após a outra, como **arcos de círculo máximo** (o caminho mais curto na esfera). | 1,8 s | Arcos sobre círculos máximos, não retas "por dentro" do globo. Cidades em posição real. |
| G11 Brasil e regiões | Sim | As **5 regiões do IBGE** se destacam uma a uma (Norte → Nordeste → Centro-Oeste → Sudeste → Sul) e o mapa volta inteiro. | 2,2 s | Limites exatamente pelas divisas estaduais do IBGE (malha oficial). Não confundir com as regiões geoeconômicas (3 complexos). |
| G12 Meio ambiente e sustentabilidade | Sim | As 3 setas de reciclagem dão **uma** volta com *ease-out* e param. | 1,5 s | Rotação é gatilho vestibular [5]: uma volta só, devagar no fim, nunca em laço. |

**Outras matérias** (fora do pedido, para manter coerência): História (sobe do chão) → **Não animar**. Não tem função dinâmica e "subir do chão" é enfeite; basta a resposta de 100 ms. Filosofia, Sociologia e Inglês seguem as regras da seção 3 quando forem construídos.

---

## 6. Ideias além do catálogo

1. **Reaproveitar as cenas como mini-aulas, onde a animação ensina de verdade.** Cada cena 3D (salto de Bohr, Faraday, via secretora, prisma, rotação síncrona da Lua, ciclo da água) pode aparecer no **cartão de teoria** do conteúdo correspondente com:
   - botão "ver acontecer";
   - passos separados (segmentação [15]);
   - legenda curta sinalizando o elemento importante [14][15];
   - a fonte da explicação, conforme o princípio 3 do produto.

   É ali que a pesquisa mostra ganho (animação que representa a mudança [11][12]). O ícone vira a "capa" de algo que o aluno estuda depois.
2. **Estado final = resumo do conceito.** Como cada ícone para no estado final, a versão parada (reduzir movimento, miniatura, ícone do app) já mostra a função: lâmpada acesa, agulha no N, leque de cores do prisma. Projetar cada ícone para que **o estado final se explique sozinho**. Assim nenhuma informação depende da animação [6].
3. **Animação de conquista, não de enfeite.** O ícone do tema pode tocar a função uma vez como **recompensa** quando o aluno termina um nível daquele tema. É um momento raro e com significado, fora do caminho do estudo.
4. **Uma regra de narrativa para todos:** "antes → causa → depois". Quem ainda não tiver as três partes claras fica parado até ter.

---

## 7. Ordem sugerida de trabalho

1. Ajustar o palco: desenhar sob demanda, pausar fora da tela e com a aba oculta, separar mouse de toque, mostrar o estado final com "reduzir movimento".
2. Corrigir os 6 principais conforme a seção 4. Prioridade para a química (átomo com carga errada) e o circuito (lâmpada acesa sem corrente).
3. Construir os temas de Física e Geografia já com a animação da seção 5.
4. Revisão em lentes (princípio 3): 1ª lente confere cada "cuidado científico" contra livro ou fonte; 2ª lente confere tempo, clareza e acessibilidade; ver renderizado em claro, escuro e 390 px.

---

## Fontes

1. Nielsen Norman Group, "Executing UX Animations: Duration and Motion Characteristics". https://www.nngroup.com/articles/animation-duration/
2. W3C, *Understanding SC 2.3.3 Animation from Interactions* (WCAG 2.2). https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
3. Hidde de Vries, "Meeting 2.2.2 Pause, Stop, Hide with prefers-reduced-motion". https://hidde.blog/meeting-2-22-pause-stop-hide-with-prefers-reduced-motion/
4. W3C, *Understanding SC 2.2.2 Pause, Stop, Hide* (WCAG 2.2), com remissão ao SC 2.3.1 (três clarões). https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html
5. WebKit (Apple), "Responsive Design for Motion". https://webkit.org/blog/7551/responsive-design-for-motion/
6. Apple, Human Interface Guidelines — Motion. https://developer.apple.com/design/human-interface-guidelines/motion
7. Google Design, "Making Motion Meaningful" e Material Design — Motion. https://design.google/library/making-motion-meaningful · https://material.io/design/motion
8. CSS-Tricks, "Solving Sticky Hover States with @media (hover: hover)". https://css-tricks.com/solving-sticky-hover-states-with-media-hover-hover/
9. Rey, G. D. (2012). A review of research and a meta-analysis of the seductive detail effect. *Educational Research Review*, 7, 216–237. Resumo: https://en.wikipedia.org/wiki/Seductive_details
10. The Learning Scientists, "Cut It Out: Learning with Seductive Details". https://www.learningscientists.org/blog/2019/6/20-1
11. Höffler, T. N.; Leutner, D. (2007). Instructional animation versus static pictures: A meta-analysis. *Learning and Instruction*, 17(6), 722–738. https://www.leibniz-ipn.de/en/research/publications/instructional-animation-versus-static-pictures-a-meta-analysis
12. Berney, S.; Bétrancourt, M. (2016) e reanálise em *Instructional Science* (2021). https://tecfa.unige.ch/perso/sandra/pdf/Earli2016_berney_betrancourt_FINAL.pdf · https://link.springer.com/article/10.1007/s11251-021-09541-w
13. Tversky, B.; Morrison, J. B.; Bétrancourt, M. (2002). Animation: can it facilitate? *Int. J. Human-Computer Studies*, 57, 247–262. https://hci.stanford.edu/courses/cs448b/papers/Tversky_AnimationFacilitate_IJHCS02.pdf
14. Lowe, R.; Boucheix, J.-M. (2012 e 2010). Saliência × relevância e pistas em animações complexas. https://tecfa.unige.ch/tecfa/teaching/methodo/boucheix-lowe2012.pdf
15. Mayer, R. — princípios de aprendizagem multimídia (coerência, sinalização, segmentação). https://services.dartmouth.edu/TDClient/1806/Portal/KB/PrintArticle?ID=171655
16. IOP Spark, "Some students have difficulty letting go of Bohr's model". https://spark.iop.org/some-students-have-difficulty-letting-go-bohrs-model-and-do-not-easily-adopt-new-quantum-model
17. IOP Spark, "Many students hold a range of atom models, including hybrid models". https://spark.iop.org/many-students-hold-range-atom-models-including-hybrid-models-consisting-combinations-different
18. IOP Spark, "Many students see circuit behaviour as a sequence of causes and effects". https://spark.iop.org/many-students-see-circuit-behaviour-sequence-causes-and-effects-rather-seeing-whole-circuit (base: Shipstone, 1984, *European Journal of Science Education* 6(2), 185–198)
19. Artigo sobre concepções de estudantes em circuitos DC (corrente "consumida", pilha como fonte de corrente constante), arXiv physics/0304040; e Bauman, Huỳnh e Robertson (2024, *Phys. Rev. Phys. Educ. Res.*), que relativiza a ligação entre raciocínio sequencial e esses erros. https://arxiv.org/pdf/physics/0304040 · https://par.nsf.gov/servlets/purl/10541257
20. NASA Scientific Visualization Studio, "The Moon's Rotation". https://svs.gsfc.nasa.gov/4709
21. UNLV, "Tidal locking of the Moon" (animação comparando Lua com e sem rotação). https://www.physics.unlv.edu/~jeffery/astro/moon/tidal_locking_moon.html
22. Chromium, código de `WebGLRenderingContextBase` (limite de 16 contextos ativos). https://chromium.googlesource.com/chromium/blink/+/master/Source/modules/webgl/WebGLRenderingContextBase.cpp
23. Stack Overflow (arquivo), "Allowing more WebGL contexts" (medições: 16 no computador, 8–9 em Android). https://kaweah.freedombox.rocks/kiwix/stackoverflow.com_en_all_2023-11/questions/59140439/allowing-more-webgl-contexts
24. three.js manual, "Multiple Canvases, Multiple Scenes". https://threejs.org/manual/#en/multiple-scenes
25. three.js manual, "Rendering on Demand". https://threejs.org/manual/#en/rendering-on-demand
26. Umbraco, "Polite animation with IntersectionObserver, requestAnimationFrame, and reduced-motion". https://community.umbraco.com/docs/tutorials/foundations/intersection-observer-paused-animation/
27. Declinação magnética no RS 1900–2010 (UFPel/SIEPE). https://cti.ufpel.edu.br/siepe/arquivos/2013/CE_01954.pdf · Dados geomagnéticos do Observatório Nacional: https://www.gov.br/pt-br/servicos/dados-geomagneticos

*Observação sobre as fontes:* as páginas da W3C, da NN/g, da WebKit e os resumos de artigos foram lidos diretamente. Os números das meta-análises e das pesquisas de concepções vêm dos resumos e registros dos periódicos. Os valores físicos das tabelas (proporções da Terra, espessura da atmosfera, ordem das cores no prisma) são conhecimento-padrão de livro didático e **devem passar pela 1ª lente** antes de virar texto para o aluno.

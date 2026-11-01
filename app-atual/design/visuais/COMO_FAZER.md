# Como fazer um visual de resolução (APRENDICE)

O visual aparece na resolução da questão, logo abaixo do veredito, num bloco "Veja como funciona".
É para um vestibulando de Medicina. **Zero erro científico.** Português do Brasil, frases curtas.


## REGRA PRINCIPAL (pedido do dono, 30/10): o visual ENSINA o conteúdo da resposta
O APRENDICE é um app didático. O visual não é para redesenhar a figura do enunciado. É para **explicar, em desenho/animação, o conteúdo de que a resposta depende**.
- Exemplo: "No interior da estrutura indicada pela seta são produzidos..." → resposta "esporos, por meiose". O visual NÃO é a planta com a seta. É uma animação que mostra e explica o que é um esporo, como a meiose acontece dentro do esporângio (célula-mãe 2n → meiose I → meiose II → 4 esporos n), por que é meiose e não mitose, e o que o esporo vira depois.
- Antes de desenhar, **pesquise** o conteúdo em fonte confiável (livro didático de ensino médio/universitário, OpenStax Biology/Chemistry, Khan Academy, Wikipedia em português ou inglês só como apoio) e ponha a fonte em `fontes: ['título — URL']` no objeto do visual. Não desenhe de memória.
- Estrutura obrigatória de uma animação: 3 a 6 etapas, cada etapa com um título curto e 1-3 linhas de explicação que mudam junto com o desenho (o aluno lê e vê ao mesmo tempo). A última etapa liga o conteúdo à resposta da questão ("Por isso a resposta é ...").
- Pergunta-teste: um aluno que não sabia o conteúdo entende o conceito só assistindo? Se não, refaça.
- Sombras: só use sombra quando o objeto está apoiado ou flutuando e a sombra ajuda a ler a posição; sombra suave (desfocada, opacidade baixa, deslocada coerente com a luz), nunca mancha escura dura. Em esquema plano, sem sombra.

## Onde fica
- Um arquivo por visual: `design/visuais/<materia>/<vid>.js` (materia = bio, qui, mat, por). Nunca edite outros arquivos de visual, nem materia.js / materia.css / gera_design.py.
- O gerador junta `design/visuais/<materia>.js` (motor + `VIS.liga`) com todos os arquivos da pasta, cada um dentro de `(function(){ ... })();`.
- Fotos reais: `<materia>/vis/<vid>-<n>.webp` (640x480, 4:3, qualidade ~82, PIL).

## O que o arquivo faz
```js
VIS.def['<vid>'] = {
  tit: 'Título curto do que o visual mostra',
  tipo: 'anim',        // 'anim' (animação com tocar/pausar/linha do tempo), 'svg' (esquema parado) ou 'galeria' (fotos reais)
  dur: 8,              // anim: duração do ciclo em segundos (repete)
  marcas: [[0, 'Fase 1'], [4, 'Fase 2']],   // anim: rótulos sob a linha do tempo
  cred: 'Animação feita para o app (esquema fora de escala).',   // ou o crédito das fotos
  nota: 'opcional: uma frase que amarra o visual à questão',
  monta: function (svg) {          // anim/svg: recebe o <svg> vazio; desenhe e devolva desenha(t)
    svg.setAttribute('viewBox', '0 0 640 350');
    // crie os elementos uma vez; desenha(t) só atualiza atributos/texto (função pura de t, sem estado)
    return function (t) { /* ... */ };
  },
  itens: [ { src: 'vis/<vid>-1.webp', t: 'Nome', d: 'o que observar', contra: false } ]   // galeria
};
VIS.liga('<vid>', ['IDQUESTAO1', 'IDQUESTAO2']);
```
- `monta(svg, qid)` recebe também o ID da questão aberta. Use-o na etapa final para mostrar SÓ o "Por isso a resposta é…" DAQUELA questão (cada questão ligada precisa do seu).
- `marcas` e `dur` podem ser funções de `qid` (ex.: `marcas: function (qid) { return [...]; }`) quando a ordem das etapas muda por questão. A cena em que a animação TERMINA tem que ser a que decide a resposta daquela questão.
- `desenha(t)` deve ser função só de `t` (o aluno arrasta a linha do tempo para trás e para frente).
- 'svg' chama `desenha(0)` uma vez.

## Aparência (obrigatório)
- viewBox largo, ~640x350 (a coluna tem ~560-600 px). Texto do SVG com tamanho >= 13 (unidades do viewBox), nada encostado nem sobreposto, nada cortado.
- Cores: use as variáveis do app em `style` (ex.: `style="fill:var(--tinta)"`): `--tinta` (texto), `--lapis` (texto secundário), `--ad-c` (cor da matéria), `--ad-t` (cor da matéria para texto), `--linha` (linhas finas), `--folha` (fundo de cartão). Cores de objetos reais (sangue, músculo, folha) podem ser fixas, realistas e sóbrias.
- Fonte: herdada (Familjen Grotesk). Sem emoji, sem logo, sem marca d'água, sem clip-art. Desenho limpo, de livro bom.
- Rótulos no próprio desenho (não em legenda separada). Mostre só o que a questão precisa; nada decorativo.
- Animação: movimento com propósito (o processo acontecendo), fases claras, painel/rótulos que mudam junto com a fase. Ciclo de 6 a 12 s.

## Conteúdo (obrigatório)
- Leia cada questão que você liga (enunciado, alternativas, gabarito e a resolução em `<materia>/res/<sub>.json`). O visual não pode contradizer o gabarito nem a resolução.
- Só ligue a questão se o visual ajudar ESSA questão. Na dúvida, não ligue.
- Simplificação de esquema é ok se não ensinar errado; escreva "esquema fora de escala" no crédito quando couber.
- Fotos reais: só domínio público, CC0, CC BY ou CC BY-SA (Wikimedia Commons; User-Agent exatamente "AprendiceStudyApp/1.0" — NUNCA ponha e-mail ou dado pessoal em requisição nenhuma). Crédito com autor e licença. Confira que a foto mostra mesmo o que a legenda diz.

## Testar (obrigatório antes de entregar)
1. `node --check design/visuais/<materia>/<vid>.js`
2. Build: `cd /home/claude/escadas-sc && flock /tmp/gera.lock python3 design/gera_design.py > /dev/null`
3. Screenshot (servidor já roda na 8765):
   `node /tmp/claude-0/-home-claude/e5566652-8789-513e-9e19-aca7ab2e3491/scratchpad/tg/vistest.js <materia> <IDQUESTAO> <prefixo_saida> [t1 t2 t3]`
   (sem tempos: um print; com tempos: um print por instante). Olhe os prints com a ferramenta de ler imagem e corrija sobreposição, corte, texto pequeno, erro. Repita até ficar bom. Deve imprimir `ok []` (sem erros de página).
Aprovação: o coordenador copia a versão aprovada para design/visuais/<m>_ok/ (é de lá que sai a publicação).

## Lições das revisões (lotes 1-5, obrigatório)
- Etapa final "Resposta" por questão: copie o padrão `fimResposta(def, svg, desenha, TF, RESP, qid, { congela: function (q) { ... } })` de `design/visuais/bio_ok/fermentacao-x-respiracao.js`. `RESP[qid]` = ['Por isso a resposta é X', 'linha 1', 'linha 2']. A letra TEM que bater com o gabarito; o raciocínio com a resolução.
- `congela(q)` devolve o instante cujo quadro DECIDE aquela questão (não o último quadro por padrão). Erro mais comum das revisões: congelar num quadro que mostra outra coisa (ex.: 52 °C quando a questão é sobre 36 °C).
- O cartão de resposta não pode cobrir o detalhe que decide; tamanho do cartão = tamanho do texto.
- Marcas da linha do tempo sem números pulados; cada etapa com tempo para ler (≥ 2,5 s para 3-5 linhas).
- "img_real" no levantamento NÃO significa só mostrar foto: foto real dentro de uma animação que ensina (marcadores numerados na foto + texto explicando), como em bio_ok/biomas-brasileiros-fotos.js e bio_ok/tec-conj.js.
- Confira local, autor e licença na própria página do Commons; a legenda tem que descrever o que a foto realmente mostra.
- Rótulos das marcas da linha do tempo com no máximo 12 caracteres (com 5-6 etapas e o botão "Ampliar", a barra fica estreita).

# Pedidos do dono (registro permanente)

Tudo o que o dono envia (texto, imagens, pranchas) fica anotado aqui, com data e o que foi feito.
Imagem enviada nunca é "por enviar": tem uso, e o uso fica registrado.

## Imagens recebidas
| Data | O que é | Onde está no projeto | Uso |
|---|---|---|---|
| 02/11 | Prancha de 12 ícones de Física (um por tema F01–F12) | app/conteudo-fonte/materias/ic/pranchas/fisica.webp | ícones dos temas de Física e ícone principal |
| 02/11 | Prancha de 12 ícones de Geografia (G01–G12) | app/conteudo-fonte/materias/ic/pranchas/geografia.webp | ícones dos temas de Geografia e ícone principal |
| 03/11 | Pranchas de História, Filosofia, Sociologia, Inglês | app/conteudo-fonte/materias/ic/pranchas/ | ícones dos temas e principais |
| 03/11 | Referência do menu lateral | docs/referencias/menu-lateral.webp | ícones de linha verdes do menu |
| 03/11 | Referência da tela inicial | docs/referencias/tela-inicial.webp | nova tela inicial |
| 03/11 | Célula 3D de referência (corte com um quarto removido) | docs/referencias/celula-3d.webp | padrão de acabamento da célula construída (textura, proporção, organelas) |

## Regras visuais ditas pelo dono
- Ícones 3D: luz de FRENTE e de cima; o fundo branco é o chão; a sombra cai para TRÁS do objeto (nunca na frente). A sombra serve para dar contraste e destacar o ícone.
- Resolução máxima: nada borrado em tela cheia. Recorte nunca pode cortar o objeto.
- Sem fundo branco em volta do ícone recortado.
- Cores das matérias bem distintas entre si (como um caderno de cada cor): nenhuma matéria com cor parecida com outra.
- Redação não é matéria do site (removida em 03/11).
- Formas decorativas (onda verde do menu) não podem aparecer cortadas.
- O desenho do ícone precisa estar cientificamente certo (estrutura real), não só parecido.
- Ícones sem animação (05/11); trocáveis quando o dono mandar.

## Decisões de 05/11/2026
- O produto é um **site** (navegador no computador, celular e tablet), não aplicativo de loja.
- O site pode ter **Questões Aprendice** (criadas por ele), revisadas pela banca de especialistas e sempre identificadas.
- Uma banca de especialistas (doutores/mestres) por matéria resolve e revisa as questões.
- Toda mudança no `CLAUDE.md` é aplicada em todos os arquivos do projeto.
- Direitos autorais: quem decide o que de terceiros vai ao site é o dono. O Claude registra a origem e avisa riscos, sem bloquear.
- Site publicado em link público por decisão do dono (05/11/2026).

- 05/11/2026: tarefa da célula 3D cancelada. Decisão: o site passará a usar só ícones sem animação. Não mexer nos ícones até o dono mandar.
- 05/11/2026: referência é para reproduzir, não copiar; não economizar esforço (CLAUDE.md, princípio 12). Exceção expressa: o protótipo `app-atual/` é o sistema de design.
- 05/11/2026: login igual à referência (Aprendice_Login_Pacote), com a ilustração pintada do pacote (uso autorizado pelo dono) e a abertura escrita à mão. Sempre que uma aba inteira mudar, publicar a atualização no site.
- 05/11/2026: provas de 2ª fase dissertativas ficam de fora do banco agora; as questões dissertativas serão feitas pelo Claude depois, com comando do dono. Banco de provas: só múltipla escolha.

## Decisões de 05/11/2026 (noite), registradas pelo Claude da conversa de estudos a pedido do dono
- Público: todo estudante que vai prestar ENEM ou vestibular, para qualquer curso (não só Medicina).
- Trabalho autônomo: sem pedir aprovação, sem perguntas e sem mandar prints; parar só diante do que não tem volta (CLAUDE.md).
- Sistema de design = o protótipo `app-atual/` (arquivo de estudos do dono): grade, alinhamento, posição, fontes (título da matéria em Dancing Script), medidas e enquadramento. É referência do sistema, não do conteúdo: matérias, telas e ícones novos continuam. Isso é comando expresso e não fere o princípio 12.
- Ícones: sem animação; o dono vai pedir a troca (ex.: Biologia não precisa ser só a célula); sempre no lugar e enquadramento do sistema.
- Correção da questão em 4 blocos: por que eu errei · resposta correta + pegadinha · resolução animada · por que as outras estão erradas (fechado, abre ao clicar).
- Resolução animada obrigatória: Biologia e Química animam o que acontece; Matemática escreve a conta à mão movendo os termos (x atravessa o igual, número passa dividindo, multiplicação cruzada, cancelamento riscado); fração sempre empilhada.
- As 788 questões de sites didáticos saem; entram Questões Aprendice ou a questão de prova original (`docs/questoes-aprendice.md`).
- 40 questões reais do ENEM de geometria básica (áreas M08.6, volumes M11.6) entraram em `app-atual/mat` com resoluções revisadas em lentes (`docs/geometria-basica-enem.md`): levar para o site.
- 05/11/2026 (noite): guia tipográfico aprovado pelo dono em `docs/fontes/Guia-tipografico-APRENDICE.pdf`, com as fontes do site em `docs/fontes/fontes/` (Dancing Script no título da matéria, Familjen Grotesk na interface e nos temas, Literata na explicação da correção, Caveat nas contas, DM Sans só no login).
- 05/11/2026 (noite): paleta das matérias aprovada pelo dono em `docs/cores/` (PDF + `paleta.json`): Biologia verde-folha, Química magenta, Matemática azul-marinho vivo, Português roxo, Física laranja, História marrom couro, Geografia azul-petróleo, Inglês vermelho-cereja, Filosofia e Sociologia (uma matéria só) amarelo-ouro. Cada matéria muda a cor do site inteiro.
- 06/11/2026: ícones dos 12 temas de Biologia aprovados pelo dono em `docs/icones/biologia/` (PNG transparente, nome = id do tema, ex.: B01-citologia.png = tema B01). Vão na faixa de temas com rolagem lateral (início e página da matéria), um por tema, pelo id — NÃO na ordem/grade do exemplo. `docs/icones/exemplo-faixa-de-temas.png` mostra só o visual de cada ícone, não o layout: o objeto fica DENTRO de um círculo claro, sem sair dele; ao passar o mouse, o círculo (com o ícone) cresce um pouco e sobe levemente. Ícones só nos temas; subtemas sem ícone.
- 06/11/2026: ícones dos 12 temas de Química aprovados pelo dono em `docs/icones/quimica/` (Q01 a Q12, id do tema no nome). Mesmas regras dos de Biologia (comando 19, `docs/icones/ONDE-USAR.md`): dentro do círculo, cresce e sobe ao passar o mouse, substituem os antigos de Química, subtemas sem ícone.
- 06/11/2026: subtemas sem ícone levam um pontinho na cor da matéria (6 a 8 px), igual ao do protótipo (menu do `shell.html`). Ícone 3D só nos temas. Detalhes em `docs/icones/ONDE-USAR.md`.
- 06/11/2026: ícones de tema das outras sete matérias aprovados pelo dono (pasta APRENDICE › ICONES do Google Drive) e salvos em `docs/icones/matematica/` (M01–M17), `portugues/` (P01–P12), `fisica/` (F01–F12), `geografia/` (G01–G12), `historia/` (H01–H08), `ingles/` (I01–I04) e `filosofia-sociologia/` (L01–L08, S01–S08). Mesmas regras de Biologia e Química (comando 19; agora comando 23): dentro do círculo, cresce e sobe ao passar o mouse, substituem os antigos dessas matérias, subtemas com o pontinho. Agora todas as matérias têm ícones novos. Os títulos quebrados no Drive foram corrigidos para o nome oficial. Em História havia dois arquivos para H07: entrou o capacete sozinho; a versão com bandeiras continua no Drive. Ressalvas (usar o atual até nova versão): H08, G03, H04 — detalhes no comando 23.

## Decisões de 06/11/2026 (madrugada), registradas pelo Claude da conversa de estudos a pedido do dono
- Revisão de cada matéria a partir dos livros que o dono enviou (coleção PV, Poliedro): cada capítulo é lido inteiro e fichado; vira slides de revisão por conteúdo dentro dos temas já existentes (ids não mudam), escritos com nossas palavras, revisados em lentes; imagens só de licença livre (Wikimedia Commons, com crédito) ou desenhadas pelo site. Formato: `docs/revisao/FORMATO.md`.
- Estratégia de revisão exclusiva do Aprendice: `docs/estrategia-revisao.md` (comando 24).
- Resoluções de todas as questões de prova do site pela fábrica (comando 25).

# Decisões do dono que valem hoje

Uma linha por decisão, com a data. Só a versão mais nova de cada regra; o que já está escrito no `CLAUDE.md` não se repete aqui. Situação das tarefas: `docs/comandos-do-dono.md`. Registro completo anterior: `docs/historico/2026-11-09-antes-da-compactacao/pedidos-do-dono.md`.

**Já no `CLAUDE.md` (ver lá):** site e não aplicativo; público = todo vestibulando, qualquer curso; trabalho autônomo; regra de manutenção; publicar quando uma aba inteira mudar; Questões Aprendice; banca por matéria e lentes; direitos decididos pelo dono; reproduzir, nunca copiar (exceção: `app-atual/` é o sistema); sistema de design = protótipo; ícones sem animação, ícones novos substituem os antigos, subtema com pontinho; correção em 4 blocos; resolução animada e fração empilhada; 788 questões de sites fora; 40 questões ENEM de geometria; Redação fora; Método Aprendice de Revisão (`docs/estrategia-revisao.md`).

## Produto e banco
- 05/11 — Banco de provas só de múltipla escolha; dissertativas de 2ª fase ficam fora e serão feitas pelo Claude depois, por comando do dono.
- 05/11 — Filosofia e Sociologia são uma matéria só (`fs`), sem mudar ids, com migração do progresso.
- 06/11 — Treino geral do Início: questões reais de qualquer matéria, sorteadas e misturadas, sem sequência e sem escolher matéria, com a correção em 4 blocos; não substitui o Treino geral de cada matéria.

## Conteúdo e direitos
- 05/11 — Login: ilustração pintada do pacote Aprendice_Login_Pacote com uso autorizado.
- 06/11 — Revisão escrita com nossas palavras a partir dos livros PV (Poliedro) enviados pelo dono: cada capítulo lido inteiro, revisado em lentes, dentro dos temas existentes (ids não mudam). Formato: `docs/revisao/FORMATO.md`.
- 06/11 — Imagens que ajudem a entender (obras, fotos, mapas, gravuras) autorizadas na revisão; registrar origem (página, autor, licença ou acervo) e mostrar o crédito; preferir licença livre quando houver equivalente. "Tiradentes esquartejado" (H03.9) liberada.
- 06/11 — Conteúdo novo proposto em `pendencias` das revisões NÃO vira id no site sem o dono.
- 06/11 — A revisão complementa a teoria do site; não substitui os cartões nem altera a teoria sem o dono.
- 06/11 — Revisão é revisão, não aula: formato essencial do Revisaí de Matemática (8–12 telas por tema; slides completos só em "Aprofundar", fechado). Especificação: `docs/revisao/FORMATO-ESSENCIAL.md`.
- 06/11 — Química: R = 62,4 mmHg·L/(mol·K) na teoria (onde o enunciado der 62,3, a resolução segue o enunciado).

## Design, cores e fontes
- 03/11 — Cores das matérias bem distintas entre si, como um caderno de cada cor.
- 03/11 — Formas decorativas (onda verde do menu) nunca aparecem cortadas.
- 05/11 — Paleta aprovada (`docs/cores/paleta.json` + PDF): Biologia verde-folha, Química magenta, Matemática azul-marinho vivo, Português roxo, Física laranja, História marrom couro, Geografia azul-petróleo, Inglês vermelho-cereja, Filosofia e Sociologia amarelo-ouro; ao entrar na matéria o site inteiro assume a cor dela. Valores: `DESIGN.md`.
- 05/11 — Guia tipográfico aprovado (`docs/fontes/Guia-tipografico-APRENDICE.pdf`, fontes em `docs/fontes/fontes/`): Dancing Script no título da matéria, Familjen Grotesk na interface, Literata na explicação da correção, Caveat nas contas, DM Sans só no login.
- 06/11 — Título da matéria maior e páginas mais largas em telas grandes (valores em `DESIGN.md`).

## Ícones e capas
- 03/11 — Desenho do ícone cientificamente certo; resolução máxima, nada borrado em tela cheia; recorte nunca corta o objeto; sem fundo branco em volta.
- 06/11 — Ícones de tema das 9 matérias aprovados, em `docs/icones/<matéria>/` (nome = id do tema): objeto INTEIRO dentro de um círculo claro; vão na faixa de temas pelo id (não na ordem/grade de `exemplo-faixa-de-temas.png`, que mostra só o visual). Onde entram: `docs/icones/ONDE-USAR.md`.
- 06/11 — Pontinho do subtema: 8 px na cor principal da matéria, como o do menu do protótipo.
- 06/11 — Capas e ícones vêm do Drive (APRENDICE → ICONES, uma pasta por matéria, e CAPAS); capas em `docs/capas/<matéria>/` (`docs/capas/LEIA.md`); ícone novo que chegar vai para `docs/icones/<matéria>/` com a origem registrada.
- 06/11 — Aba Início reproduz `docs/referencias/aba-principal/ref-aba-principal-em-cima.png` e `-em-baixo.png`.
- 09/11 — **Nenhum ícone tem sombra** (círculos, artes das matérias, capas). Ao passar o mouse, o ícone **salta 10 px para cima e fica no alto** enquanto o mouse estiver em cima (substitui o "cresce ~6% e sobe levemente" de 06/11 e a regra antiga de sombra dos ícones 3D).

## Referências guardadas
Tudo o que o dono envia (texto, imagem, prancha) tem uso e fica registrado com data.
- `docs/referencias/menu-lateral.webp` (03/11) — ícones de linha do menu.
- `docs/referencias/tela-inicial.webp` (03/11) — onda e pontilhado no pé do menu; a tela inicial em si foi substituída pela aba Início de 06/11.
- Pranchas de 02–03/11 em `app/conteudo-fonte/materias/ic/pranchas/` — só arquivo; os ícones delas saíram do site (ícones novos de 06/11).

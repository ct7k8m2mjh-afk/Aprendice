# Estado do app em 01/11/2026 (protótipo completo, local)

## O que existe
App em `app/` (React + TypeScript + Capacitor). É o site (navegador em qualquer aparelho; aplicativo de loja fora do plano), rodando localmente com o conteúdo real do `app-atual/`.

**Conteúdo convertido:**
- Bio 507 · Quí 569 · Mat 610 · Por 535 questões, cada uma com print, fonte, gabarito e resolução;
- 240 flashcards, 27 cartões com imagem e 160 frases para completar;
- teoria por módulo e dicionário;
- 311 ícones 3D.

Os ids não mudaram e há um teste que garante isso.

**Telas:**
- boas-vindas com conta de demonstração, provas-alvo e meta;
- início;
- matérias, tema (escadas e teoria) e escada;
- questão: print, alternativas, certeza, pista, cronômetro com pausa, riscar, lupa e teclado;
- resolução que começa pela alternativa marcada;
- treino geral retomável;
- flashcards e frases, com correção local e "IA simulada";
- simulados por prova (na ordem original, no tempo oficial, com folha de respostas) e por objetivo, mais o histórico;
- revisão espaçada;
- desempenho (por matéria, por tema, por prova e como você erra);
- provas e faculdades (catálogo nacional);
- perfil e configurações (tema, meus dados, privacidade, créditos);
- matérias novas e Redação: estrutura com aviso honesto de "em preparação".

**Progresso:**
- fica salvo no aparelho;
- migra sozinho as chaves do protótipo (`saocamilo.<m>.v1`) quando o app abre no mesmo navegador;
- importa os arquivos "Baixar meu progresso" do protótipo juntando, sem apagar nada.

**Itens pessoais removidos:**
- nome fixo: o app agora usa o nome escolhido na conta;
- capa do Treino geral: trocada pelas ilustrações 3D das matérias;
- prioridade em São Camilo: virou as provas-alvo escolhidas pelo aluno;
- "São Camilo" nos títulos.

O logo manuscrito foi mantido.

## Verificação feita
- `npm test`: 56 testes passando.
- `node scripts/fluxo.cjs`: 9 fluxos de ponta a ponta passando no navegador.
- Prints de 19 telas nos temas claro e escuro, em celular (390 px) e computador, conferidos visualmente.
- Revisão visual independente feita por um agente separado: 15 correções, todas aplicadas (contraste do verde de "certo", bordas de campo, amarelo de Português como único indicador, botões e outros).

## Pendências que precisam de decisão do dono
1. **Questões de listas de sites: 788 do banco.** São de Brasil Escola (587), Mundo Educação (197), Prepara Enem e InfoEscola. Não são de provas publicadas, não têm ano de prova e o direito de uso dos prints não está verificado. O app as identifica como "lista pública de exercícios". Decidir se ficam.
2. **Prints com marca d'água de cursinho.** Muitos prints de provas vêm dos PDFs de resolução do Objetivo (aparece a marca "OBJETIVO"). A origem fica registrada; quem decide publicar é o dono (princípio 10). A alternativa é trocar pelos cadernos oficiais das bancas.
3. **Uma questão sem link da fonte:** Santa Casa 2026, questão 52 (Química, id `P054feae`). Está escondida no app até a fonte ser preenchida.
4. **Nenhuma prova completa no banco.** Os simulados por prova cobrem só as questões de Bio, Quí, Mat e Por de cada edição, e a tela diz isso ("cobre 28 das 80 questões"). Para ter a prova inteira, é preciso importar as provas oficiais.
5. **Catálogo nacional: 47 provas, 19 conferidas em fonte oficial.** As demais têm campos marcados "a conferir no edital".
6. **Rede bloqueada neste ambiente.** Os sites das bancas (fuvest.br, gov.br/inep, vunesp.com.br etc.) estão fora da lista permitida. Para baixar provas e editais, é preciso liberar o acesso à rede nas configurações do ambiente.
7. **Apps instaláveis.** Fora do plano: o produto é um site (decisão do dono, 05/11/2026).

## Próximos passos sugeridos
1. Liberar a rede e montar a ingestão de provas oficiais completas (ENEM e onda 1 do catálogo), com print fiel e gabarito oficial.
2. Fábrica de conteúdo (chave da API como segredo do ambiente) para as resoluções das questões novas, com revisão em lentes.
3. Servidor: contas reais e progresso na nuvem (Supabase), usando a mesma loja de estado.

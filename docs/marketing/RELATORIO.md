# Relatório da equipe de marketing e visual (21/11/2026)

Pedido do dono (20/11/2026): textos curtos, diretos e profissionais que façam o aluno voltar. Cada papel foi feito por
um agente separado (redator, retenção, revisor de marca, direção de arte, aplicação). Quem escreveu não aprovou.

## Fase 1: documentos (aprovados pelo revisor de marca)
- `GUIA-DE-VOZ.md`: a voz do Aprendice em uma página.
- `TEXTOS.md`: inventário de 906 textos fixos que o aluno lê. 147 com texto novo aprovado (`ok`), 759 mantidos, nenhum `refazer`.
- `RETENCAO.md`: 7 momentos de retorno e 31 mensagens aprovadas, cada uma com o dado real que a alimenta.

## Fase 2: textos trocados no site (não publicado)
| Tela | Textos |
|---|---|
| Página e casca (menu, topo, abas) | 7 |
| Entrada, mensagens da conta, boas-vindas, escolha de provas | 26 |
| Início | 13 + mensagens de retenção (primeira visita, volta depois de 3 dias parado, o que volta hoje) |
| Hoje | 6 + mensagens de retenção (data da prova, véspera, dia da prova, fim da sessão) |
| Tema, conteúdo, questão, correção, resolução animada | 12 |
| Flashcards, cartões, Treino geral de todas as matérias | 6 + fim da rodada (erros que voltam amanhã) |
| Simulados e resultado | 9 + o que entrou na revisão (resultado) |
| Revisão (tela, agenda, domínio, slides, essencial, geral) | 27 |
| Desempenho e provas | 4 |
| Perfil (com Excluir minha conta) | 6 |
| Configurações | 7 + 3 textos que mudam com conta ou sem conta |
| Busca e rótulos de dados | 5 |
| Matérias e treino da matéria | 10 |

No total foram 147 textos e 13 mensagens de retenção, com lógica pequena que só usa dados que o site já tem. A
sequência de dias passou a contar também os flashcards. Layout, cores, CSS e conteúdo de estudo não mudaram.

O revisor conferiu o código e as frases batem com as aprovadas. Dois erros de lógica no resultado do simulado foram
corrigidos: o "amanhã" ficava errado ao reabrir o resultado pelo histórico, e "nenhuma volta" era falso quando havia
chute.

Testes: `npx tsc --noEmit -p .` sem erros. `npx vitest run` com 922 de 922 passando, depois de gerar de novo os dados
com `scripts/converte.py`. A última rodada, depois da correção do resultado do simulado, deu 41 arquivos e 922 testes, todos passando.

## O que a direção de arte NÃO pôde ver renderizado
Não foi possível aprovar nesta sessão o comando que sobe o site, por isso a direção de arte foi encerrada antes de
concluir. Ficou sem conferência de largura nesta sessão:
- 768, 1280 e 1440 px, claro e escuro;
- 390 px escuro.

A coordenadora já conferiu 390 px claro (entrada, Início, Hoje, matéria e Revisão) e está conferindo 1280 escuro.
Pontos para olhar primeiro, porque o texto ficou mais longo ou depende de dado:
1. Início, subtítulo do cabeçalho: primeira visita e volta depois de dias parado.
2. Hoje: a linha da data da prova, a véspera e o fim da sessão.
3. Agenda da Revisão: o parágrafo T576, mais longo.
4. Configurações: os textos com conta e sem conta.
5. Perfil: a confirmação de Excluir minha conta.

O arquivo `VISUAL.md` não foi escrito, porque a direção de arte não terminou.

## Sugestões ao dono (detalhes em `RETENCAO.md`, seção 3)
1. Hoje como porta de entrada: link no Início, aba no celular ou fim das boas-vindas em Hoje.
2. Pedir a data da prova nas boas-vindas (campo opcional).
3. Modo véspera no plano de Hoje.
4. Sequência com dias de pausa (precisa de dado novo e de migração).
5. Tela de fim do "Treine sua evolução".
6. Voltar a gravar o tempo de cada sessão de estudo.
7. E-mail e notificação: só por decisão do dono, com consentimento (LGPD).
8. "O equívoco volta": depende de a fábrica marcar o tipo de erro de cada alternativa.
9. Linha nova na correção depois de responder: não foi feita, porque o CLAUDE.md fixa a correção em 4 blocos.

Observação técnica, não é texto: o Início recalcula o plano do Hoje a cada renderização, sem `useMemo`. O custo é
baixo hoje; vale revisar se a tela ficar lenta.

FIM

# Decisões do dono aplicadas nas telas (20/11/2026)

O dono aprovou ("todas sim", 22h20 UTC) as mudanças visuais que esperavam a permissão dele. Sessão de telas, ramo
`app-prototipo-completo`. O site **não** foi publicado (o ramo tem as contas de verdade e só vai ao ar depois que o
dono configurar o Supabase).

## O que mudou (um commit por item)
1. **Excluir minha conta (LGPD)** — fim do Perfil. Duas etapas: o botão abre o aviso do que será apagado; o aluno
   escreve EXCLUIR e confirma em "Excluir para sempre". Na nuvem, a função `public.excluir_minha_conta()`
   (`supabase/migrations/20261120230000_excluir_conta.sql`, `security definer`, só age sobre `auth.uid()`, só contas
   logadas executam) apaga progresso, perfil e o usuário; o aparelho é limpo (progresso, cópias de segurança, cópia
   pendente, perfil guardado da conta). Sem internet, nada é apagado e o erro aparece. No modo de demonstração, apaga o
   que está no aparelho. Teste: `app/src/testes/excluirConta.test.ts` (4 casos). Página Privacidade e `docs/contas.md`
   atualizadas. **Falta o dono:** rodar o arquivo da função no SQL Editor do Supabase (passo 3 de `docs/contas.md`);
   sem isso o botão responde "Não foi possível concluir agora" e não apaga nada.
2. **Ajustes de layout**
   - (a) Revisão no celular (≤640 px): a lista do dia vem logo depois das abas (antes em y≈1314, agora y≈420 a 390 px);
     o destaque "Revisão geral" e a agenda vão para o fim, na ordem do código.
   - (b) Treino geral com capa própria: `/m/<m>/treino` abre a capa (contadores, rodada, Começar/Retomar); a capa da
     página da matéria continua começando direto (`?comecar=1`). Um componente só para as duas.
   - (c) Entrada em 1280×900 e 1440×900: a ilustração encolhe (figura e gráfico juntos) só em computador com tela baixa;
     os três cartões terminam em 861–882 px, sem rolar, claro e escuro.
3. **Itens "para o dono decidir depois"** (sugestão dos revisores)
   - Casca 16: motivo dos simulados "em preparação" em frase para o aluno, sem termos de produção.
   - Casca 25: tela "Página não encontrada" com Ir para o início e Ver matérias.
   - Matérias 10 e 11: cada tema numa área só (Bio B08, B12; Quí Q03, Q08, Q10, Q12; Por P08, P09; Química passa a 5
     áreas, a área "Química da vida e do ambiente" ficou vazia e saiu) e nomes corrigidos (B07, B08, B12.3, Q03, M08.6,
     M11.5, M11.6, M13.9, F01, H02, H03, H05, H07, área História geral) em `app/conteudo-fonte/ajustes-temas.json`,
     aplicado pelo `converte.py`; ids não mudam; `app-atual/` intacto.
   - Matérias 22: ícone do tema com 74 px no celular (≤420 px) registrado como regra em `ONDE-USAR.md` e `DESIGN.md`.
   - Matérias 26: placar "0 de 6" no lugar de "0/6" (treino concluído, conteúdos do tema, resultado do simulado, etiqueta
     de simulado feito, passos da resolução animada no celular).
   - Questão 14: a fonte (prova, ano, número, banca) fica no topo do cartão também no celular, quebrando linha.
   - Questão N14 (20/11): a 768 px os cronômetros mostram "Total" e "Questão"; para caber sem cortar o nome do tema, a
     seta de voltar fica sem a palavra (aria-label mantido) e o atalho do teclado sai, só de 701 a 900 px.

## Conferência
- Prints em 390, 768, 1280 e 1440 px, claro e escuro: Entrada, Perfil (exclusão aberta), capa do Treino geral,
  Revisão, Página não encontrada, Simulados, Tema, Questão (topo e barra), Resolução animada a 390. Nenhuma rolagem
  lateral; nada cortado.
- Fluxo da capa do treino testado no navegador: da matéria abre a questão 1; pelo endereço mostra a capa; Começar abre
  "Treino geral · 1 de 15".

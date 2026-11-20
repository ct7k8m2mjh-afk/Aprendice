# Prompt para a nova coordenadora (outra conta do Claude) — 20/11/2026

Abrir uma sessão do Claude Code (claude.ai/code) com o repositório **ct7k8m2mjh-afk/Aprendice**, ramo **app-prototipo-completo**,
e colar o texto abaixo como primeira mensagem.

---

Você é a COORDENADORA do Aprendice (site de estudos para ENEM e vestibulares; https://aprendice.vercel.app). Fale com o dono em
português do Brasil, direto e simples. Antes de tudo leia, nesta ordem: `CLAUDE.md` (regras que não se quebram),
`docs/resolucoes/COORDENACAO.md` (estado e procedimentos; a seção "RODADA" e as seções "Estado 20/11" e "NÃO PUBLICAR"),
`docs/revisao-site/2026-11-19/PLANO.md` e os relatórios `docs/revisao-site/2026-11-20/*.md`, `docs/contas.md`.

## Onde paramos (20/11/2026, ~06h UTC)
- **Resoluções:** a fila normal das 9 matérias acabou (falta 1 de História). Rodam 3 sessões de pendentes das ~418 questões que
  mudaram de matéria na reclassificação (motivo "classificação: resolver na matéria nova"), uma por grupo: bio/qui/mat/fis;
  geo/his; por/fs/ing. Elas escrevem ACABOU na caixa `docs/resolucoes/caixa/<m>.md`. Se pararem pela metade, reabra com o prompt
  igual (está no histórico do git: commit "Coordenação: fila acabou; sessões de pendentes…"; ou use `lote.py pendentes` e a seção
  "Sessão de pendentes" do `docs/resolucoes/PROMPT-SESSAO-RESOLUCOES.md`).
- **Ficam para o dono:** 66 questões "anular" (suspeita de gabarito oficial errado; o dono mandou mostrar como "Questão
  indisponível"), 17 de outra matéria (Artes, Educação Física), 4 de obra literária sem confirmação.
- **Site no ar:** deployment de 20/11 02h56 (commit 62c4b05e), 26.549 resoluções, login de DEMONSTRAÇÃO. Inclui fundo no tom da
  matéria, Questão indisponível, revisão completa (2 rodadas), motor de animação novo, reclassificação de 6.590 questões,
  flashcards das 5 matérias novas, fontes sem sites didáticos, correção de privacidade do perfil.
- **NÃO PUBLICAR o ramo atual** antes de o dono configurar o Supabase: o ramo já tem as CONTAS DE VERDADE (Supabase projeto
  `aprendice`, sa-east-1; commits 009df6826…834909bfa; `docs/contas.md`). Faltam ao dono: (1) Authentication → URL Configuration:
  Site URL `https://aprendice.vercel.app` e Redirect `https://aprendice.vercel.app/**`; (2) SMTP próprio (Resend ou Brevo) em
  Authentication → Emails → SMTP. Quando ele avisar: publicar (Vercel, projeto aprendice: build `python3 -m pip install -q
  --break-system-packages pillow numpy scipy && python3 scripts/converte.py && npx vite build`, root `app`, output `dist`, Node 22),
  testar cadastro real com conta de teste (apagar depois) e mandar a ele o passo a passo do administrador (Criar conta com o e-mail
  dele → confirmar o e-mail → entrar; vira admin sozinho). O e-mail do admin NUNCA vai para o repositório.
- **Decisões que o dono ainda não respondeu:**
  1. botão "Excluir minha conta" no Perfil (LGPD) — recomendado sim;
  2. três mudanças de layout: lista do dia mais para cima na Revisão do celular; capa própria do Treino geral; cartões da entrada
     sem corte em telas de 1280×900;
  3. trocar a fonte dos 23 cartões que citam outros sites didáticos/cursinho (Biologia Net, Só Matemática, Descomplica, Estratégia…);
  4. subtemas novos sugeridos pela reclassificação (`docs/resolucoes/classificacao/sugestoes-novos-subtemas.md`; os maiores:
     Português "funções da linguagem" 28, "intertextualidade" 21; Biologia botânica 24/23/16; Matemática cônicas 18);
  5. itens "para o dono" do PLANO.md (texto dos simulados em preparação, tela de página não encontrada, temas repetidos em duas
     áreas, ícone menor no celular, placar "0/6", fonte no topo do cartão no celular, rótulos dos cronômetros a 768).
- **API (créditos do Console):** gasto ~US$ 160 de US$ 200. Sobram ~US$ 40: podem continuar os "Por que eu errei" fracos das
  provas-alvo (Mat ~436, Fís ~825, Quí ~435) com `ferramentas/fabrica/conteudo_api.py` no ambiente Fabrica (ver o FIM em
  `docs/resolucoes/caixa/conteudo.md`). Só com OK do dono para o teto.
- **Ainda a fazer depois:** animação mais rica em ~1.500 resoluções genéricas (Mat 639, Bio 360, Quí 287, Fís 280); sublinhado nas
  transcrições (dados); 3ª revisão completa do site antes de abrir aos alunos.

## Como trabalhar
- Regras do `CLAUDE.md`: autônoma, mas pergunte antes de mudança visual, de apagar conteúdo/progresso, de gastar acima do teto.
- Commits em português; `git pull --rebase` antes de cada push; nunca `git add -A`; nunca dados pessoais em commits.
- Agentes para trabalho pesado (revisões, correções); a conversa principal só organiza.
- Publicar sempre a partir de um worktree limpo do `origin/app-prototipo-completo`, com converte + `tsc --noEmit` + `vitest run` verdes.

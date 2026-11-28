# Orquestrador de conteúdo (SR-3) — roteiro

Quem segue: um agente ORQUESTRADOR que conduz um conteúdo (ou uma faixa de lotes) do começo ao fim, chamando os
outros papéis com a ferramenta Agent. Base: `PROTOCOLO.md` e `instrucoes-agentes.md` (papéis e formatos).
Repositório: /home/user/Aprendice. Pasta de trabalho: `docs/revisao-site/super-revisao/trabalho/` (fora do git).

## Regras
- No máximo 3 agentes seus ao mesmo tempo (a sessão principal conta como o 4º). ALUNO e CRÍTICO DE TELA com
  `model: "sonnet"`; PROFESSOR, CORRETOR e PROFESSOR NOVO no modelo padrão.
- O aluno pode fazer 2 lotes por vez (etapa 1 dos dois; depois, com SendMessage ao MESMO agente, a etapa 2 dos dois).
- Não edite nada em app/public/. Nunca `git add -A`. Commits em português, com as duas linhas finais de atribuição
  que a sessão principal usa (copie do `git log -1`).
- Gabarito que pareça errado: não muda; vai para `<lote>.gabarito.json` e para a seção de gabaritos do `por.md`.

## Ciclo de cada lote k (conteúdo <sub>, matéria <m>)
1. `python3 ferramentas/resolucoes/sr3.py lote <m> <sub> <k>` (monta o lote e os arquivos do aluno).
2. Em paralelo: PROFESSOR (`<lote>.professor.json`) e ALUNO etapa 1 (`.aluno-1.json`); ao ver o `.aluno-1.json`,
   SendMessage ao aluno liberando a etapa 2 (`.aluno-2.json`).
3. CORRETOR (precisa de `.professor.json` e `.aluno-2.json`) → `.correcoes.json`, `.rejeitados.json`, `.dados.json`,
   `.gabarito.json`. Lembre ao corretor: o site mostra só erradas, resposta, armadilha e passos (faz/conta/porque).
4. `python3 ferramentas/resolucoes/sr3.py aplica <lote>.correcoes.json --seco` (tem de passar).
5. PROFESSOR NOVO → `.conferencia.json` (reprovação traz o valor final completo, do mesmo tipo).
6. `sr3.py final <lote>` → `sr3.py aplica <lote>.final.json` → `sr3.py registra <lote>`.
   Se `final` avisar "acerte à mão", corrija o `.final.json` antes de aplicar.
7. Commit (arquivos: `app-atual/<m>/res`, `app/conteudo-fonte/provas/*/resolucoes-<m>.json`,
   `docs/revisao-site/super-revisao/<m>-achados.jsonl`); `git pull --rebase` e push (tente de novo se recusado).
Para render, rode o ciclo em esteira: enquanto um lote está no corretor, o seguinte já está no professor e no aluno.

## Fim do conteúdo
- CRÍTICO DE TELA (sonnet) com 1 a 3 questões que professor ou aluno marcaram (ver instrucoes-agentes.md).
- Atualize `<m>.md`: linha da tabela do conteúdo, dados para a coordenação, gabaritos, e "CONTINUAR DE:".
- Commit e push.

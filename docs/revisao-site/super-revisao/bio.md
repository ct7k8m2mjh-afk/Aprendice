# Super revisão — Biologia (SR-2)

Protocolo: `PROTOCOLO.md`. Agentes: `instrucoes-agentes-sr2.md`. Ferramenta: `ferramentas/resolucoes/sr3.py`
(`subs bio` lista os conteúdos; `lote bio <sub> <k>` monta o lote k de 15; `aplica <correcoes.json>` grava no
arquivo-fonte). Achados: `bio-achados.jsonl`. Arquivos de trabalho (fora do git): `trabalho/`.

Total: 2.869 questões com resolução em 75 conteúdos (B01.1 … B12.10), 225 lotes de até 15, na ordem de
`sr3.py subs bio`; dentro do conteúdo: ENEM, provas-alvo, demais; nível básico → avançado.
Fluxo por lote: professor + aluno (2 etapas) → corretor (aplica) → professor novo (confere; ajustes aplicados).
Crítico de tela: um agente por tema, com 1 a 2 questões de cada conteúdo do tema.

CONTINUAR DE: tema B01 completo (falta o crítico de tela do tema B01); B02.1 (corretor), B02.2 (professor; aluno na etapa 2). Aluno e crítico com model sonnet; no máximo 4 agentes.

## Andamento por conteúdo
| Conteúdo | Questões | Lotes | Corrigidas (campos) | Achados erro/clareza | Gabarito suspeito |
|---|---|---|---|---|---|
| B01.1 | 46 | 4 | 88 | 4/73 | Pe8aa4f48 (ver coordenação) |
| B01.3 | 36 | 3 | 63 | 3/29 | — |
| B01.4 | 45 | 3 | 55 | 6/39 | — |
| B01.5 | 27 | 2 | 28 | 1/15 | P71189cd1 |
| B01.6 | 18 | 2 | 20 | 5/13 | — |
| B02.1 | 18 | 2 | 13 | 2/3 | — |
| B02.2 | 28 | 2 | 24 | 0/30 | — |
| B02.3 | 21 | 2 | 25 | 3/18 | — |
| B02.4 | 22 | 2 | 41 | 2/37 | — |
| B02.5 | 26 | 2 | 15 | 2/11 | P05c39044 |
| B01.2 | 8 | 1 | 8 | 1/3 | — |

## Crítico de tela por tema
- B01 (23/11): 12 questões (2 por conteúdo) em 390/1280 px, claro/escuro (48 passadas), resposta errada + animação até o fim + "outras erradas"; escada, tema, flashcards, revisão geral, slides, essencial. Nenhum problema (bio-B01.tela.json vazio).

## Gabaritos para a coordenação (anular / errata)

## Para a coordenação (possível dupla resposta)
- P05c39044 (URCA 2024.2 q46, B02.5): oficial D mantida (gabarito corrigido, não anulada); a B também é defensável. Recursos de urca.br não acessíveis desta sessão; explicado no alerta.
- P5894717e (IME 2025 q35, B02.3): sem gabarito oficial ("gabarito do Aprendice em preparação"); professor da super revisão resolveu às cegas e deu D = preliminar.
- Pe8aa4f48 (PUC-Campinas 2025): oficial B mantida; a D também tem base fisiológica (CFTR abre com ATP, cloreto a favor do gradiente). Sem errata/anulação na web; explicado no alerta. Avaliar se é caso de anular.

## Texto da questão para a coordenação (DADO)
- DADO P97ede54c (B02.5): alternativa D veio "hemoglobina 36".
- DADO P05c39044 (B02.5): acentos e hifenização quebrados no texto e nas alternativas.
- DADO P6d033b55 (B02.3): lixo da figura no texto da alternativa D e quebra de linha depois do "I.".
- DADO P96f3a9da (B02.2): alternativa E e enunciado divergem do print (ver trabalho/bio-B02.2-2.dados.json: E = "Gorduras 2,8").
- DADO P76073a1 (B02.2): alternativa E deve ser "308." pelo print.
- DADO Pe4ae932a (B02.1): versos quebrados de forma diferente do print.
- DADO P9c02b2ee (B02.1, URCA): acentos e hifenização quebrados no texto.
- DADO P6d956a1f (B01.5): enunciado começa com "m" em vez de "Em".
- DADO P7f365563 (B01.4): alternativa D aparece como "a mitocôndria.ii".
- DADO Pf34120b0 (Unespar 2024): alternativa E traz a legenda da figura colada ("planta de mimosa imperturbada planta de mimosa quando tocada"); pelo print termina em "aumentando sua turgidez."

## Pendências do dono

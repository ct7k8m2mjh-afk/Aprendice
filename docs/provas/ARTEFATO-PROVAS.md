# Artefato "Provas para baixar" — como manter

**Link:** https://claude.ai/code/artifact/4e3fedca-aada-49a0-aa7d-aad8ab54cd41 (o mesmo artefato abre também por
https://claude.ai/artifact/AfS22NUUP69GNTWsEKV5YC, o link citado em `baixar-a-mao.md`). Privado do dono.

Serve para o dono saber, por instituição e ano (meta: provas de 2020 a 2026, ENEM e vestibulares, públicas e privadas,
todas as regiões), o que **já está no site**, o que ele **ainda precisa baixar à mão** e o que é **indisponível**.
A página tem a capacidade `db` e lê duas coleções do banco do artefato.

## Coleção `provas` (uma linha por instituição e ano, ou faixa de anos)

| Campo | Quem escreve | O que é |
|---|---|---|
| `inst`, `regiao`, `ano`, `link`, `onde` | coordenadora | instituição, região, ano(s), site e onde procurar |
| `falta` | coordenadora | o que falta baixar; quando a prova entra no site vira "Já no site: …" |
| `grupo` | coordenadora | 1 = baixar no navegador · 2 = não achei nas buscas · 3 = indisponível |
| `motivo` | coordenadora | (grupo 3) por que não há o que baixar |
| `nota` | coordenadora | contexto extra mostrado abaixo da linha |
| `noSite`, `noSiteIds`, `faltaAntes` | coordenadora | a linha já entrou no site (vai para "Da sua lista, já entraram"); ids das provas; texto antigo de `falta` |
| `grupoAntes`, `atualizadoEm` | coordenadora | grupo anterior à mudança; data da última atualização |
| `ordem` | coordenadora | ordenação (1–134 lista original; 140+ baixar novas; 190+ não achadas novas; 200+ indisponíveis novas) |
| `prova`, `gabarito`, `baixei`, `baixeiEm`, `obs` | **o dono** | marcações dele. **Nunca apagar nem alterar.** |

## Coleção `nosite` (um documento por instituição, id = `catalogoId`)

`inst`, `regiao`, `anos`, `anosMeta` (anos de 2020 a 2026 presentes), `nProvas`, `questoes`, `resolucoes`, `ordem`,
`atualizadoEm` e `provas` (lista: `id`, `ano`, `fase`, `questoes`, `resolucoes`, `semGabaritoOficial`). O documento
`_resumo` guarda os totais (a página o ignora e soma pelos demais). É regravado inteiro a cada atualização.

## Como atualizar (passo a passo)

1. `git pull -q --rebase --autostash origin app-prototipo-completo`.
2. Ler o banco: ArtifactData `action: list`, `collection: provas`, `query.limit: 1000`, `out_dir: <scratchpad>/db`
   (e o mesmo para `nosite`, se já existir). Anotar a versão de cada documento num JSON `{doc_id: versão}`; as da
   coleção `nosite` entram como `"nosite/<id>"`.
3. Revisar as tabelas de decisão no começo de `ferramentas/provas/inventario_provas.py`:
   `LINHA_NO_SITE` (linha que entrou no site), `LINHA_INDISPONIVEL` (vai para o grupo 3, com motivo), `LINHA_NOTA`,
   `NOVAS_FALTAS` e `NOVAS_INDISPONIVEIS`. Fontes: `faltantes-por-ano.md`, `baixar-a-mao.md`, `cobertura.md`,
   `ORIGEM-DRIVE-saocamilo-santacasa-unesp.md` e a observação (`obs`) que o dono escreveu em cada linha.
4. Rodar:
   ```
   python3 ferramentas/provas/inventario_provas.py --db <scratchpad>/db/provas --versoes <versoes.json> \
       --lotes <scratchpad>/lotes --saida <scratchpad>/inventario.json
   ```
   Sai o inventário (provas no site por instituição, linhas no site, indisponíveis, faltas novas e `suspeitas`: linhas
   abertas cujo ano coincide com uma prova do site — conferir à mão se é a mesma edição) e os lotes de escrita
   (`lote-01.json`…, até 50 escritas cada, com `if_version` nas linhas existentes). O script nunca escreve os campos do dono.
5. Gravar com ArtifactData `action: batch` (um lote por chamada; dá para trocar `data` por `file_path` apontando para um
   JSON por documento). Se um lote falhar por versão, reler o documento e refazer só aquela escrita.
6. Conferir: listar de novo e comparar `prova`, `gabarito`, `baixei`, `baixeiEm`, `obs` com a leitura do passo 2
   (têm de estar iguais).
7. A página só precisa ser republicada se o HTML mudar: `Artifact action: read` do link (base de qualquer
   republicação), editar, e `publish` com `url` do artefato, mantendo a capacidade `db`. Conferir com `Artifact read`.

## Situação em 19/11/2026

- No site: 399 provas de 57 instituições (381 de 2020 a 2026; as demais são edições 2027), 26.027 questões.
- Lista do dono: 158 linhas para baixar no navegador (18 já marcadas como baixadas, 140 faltam), 11 não achadas,
  43 indisponíveis, 36 linhas da lista antiga que já entraram no site.
- Linhas baixadas pelo dono e ainda não integradas: São Camilo 2020/2, 2021/1, 2022/1, 2024/1, 2026/1; UERJ 2020 e
  2024 (1º e 2º EQ); Unicamp 2020; UEA 2022–2024; UEMG 2020 e 2025; FMJ 2020 e 2023; Famema 2023 (falta o caderno
  da Prova II); UERR 2021, 2022 e 2024 (obs do dono).

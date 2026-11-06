# Capas das matérias (dono, 06/11/2026)

Originais do dono, copiados do Google Drive (`APRENDICE` → `ICONES` → `CAPAS` → `<MATÉRIA>`) em 06/11/2026, sem alteração (PNG).

Cada pasta tem:
- `REF-CLARO.png` e `REF-ESCURO.png` — a capa montada (faixa larga, cerca de 3:1) como o dono quer ver no tema claro e no escuro: fundo suave na cor da matéria, objetos à direita, espaço livre à esquerda para o título. Em Biologia, a referência única é `REFERENCIA-PRINCIPAL.png`.
- os demais PNG (objetos da matéria, com transparência) — as peças para montar a capa no site: Biologia (borboleta, célula, folha, microscópio, planeta Terra, planta), Química (bico de Bunsen, cristal, frasco, molécula, tubo de ensaio), Matemática (ábaco, compasso, cubo, esfera, pirâmide, transferidor), Português (caneta, livro roxo, máquina de escrever, papel antigo, pilha de livros, porta-tinta), Física (força, ímã, lâmpada, polia, telescópio e `SEM-NOME-e792b5e0.png`, sem nome no Drive), Geografia (bússola, globo, mapa, montanhas, satélite, vulcão), História (ampulheta, coluna antiga, livro antigo, pergaminho, vaso antigo), Inglês (balão rosa, balão vermelho, bandeira dos EUA, livro vermelho), Filosofia e Sociologia (aperto de mão, auditório, balança, bonecos, coruja, pensador).

Uso no site (comando 32): reproduzir a capa de cada matéria como nas referências (princípio 12: reproduzir, nunca copiar o código de outro trabalho), com as peças em PNG/WebP otimizados, no sistema de design do protótipo; tema claro e escuro conforme REF-CLARO/REF-ESCURO.

Referência da aba principal (Início): `docs/referencias/aba-principal/ref-aba-principal-em-cima.png` e `ref-aba-principal-em-baixo.png` (Drive `APRENDICE` → `ABA PRINCIPAL`).

## No site (comando 32, 06/11/2026)
- `app/scripts/capas.py` (chamado por `app/scripts/converte.py` no build) monta, a partir destes PNG (que ficam intactos), os WebP de `public/conteudo/capas/`:
  - `<m>.webp` — a capa da matéria: as peças na posição, no tamanho, na sobreposição e na ordem medidas nas referências (mesma montagem no claro e no escuro), com a sombra de contato no chão medida nas REF claras; o fundo suave vem da paleta (CSS), no claro e no escuro. Entra no topo da página da matéria (`CapaMateria`, `app/src/telas/Materia.tsx`), com o título em Dancing Script à esquerda.
  - `ic-<m>.webp` — a arte da matéria (um objeto por matéria, como na referência da aba principal): Biologia `CELULA`, Química `FRASCO`, Matemática `PIRAMIDE` + `CUBO` + `ESFERA`, Português `LIVRO-ROXO` + `CANETA`, Física `LAMPADA`, Geografia `GLOBO-TERRA`, História `AMPULHETA`, Inglês `BALAO-VERMELHO` + `BALAO-ROSE`, Filosofia e Sociologia `CORUJA`. Entra nos cartões "Suas matérias", "Continue de onde parou" e "Hora de revisar" do Início, na lista de matérias, no desempenho e nas boas-vindas, no lugar das ilustrações antigas (que saíram do site; `app-atual/` intacto).
  - `treino-geral.webp` — a arte do Treino geral de todas as matérias (Início): `FOLHA` (Biologia), `LIVRO-ROXO` (Português), `MOLECULA` (Química) e `CUBO` (Matemática).
- Peças que ficaram de fora das capas (não aparecem nas referências): Biologia `BORBOLETA`, `PLANETA-TERRA`, `PLANTA`; Química `BICO-DE-BUNSEN`, `CRISTAL`, `TUBO-DE-ENSAIO`; Matemática `ABACO`, `TRANSFERIDOR`; Português `MAQUINA-DE-ESCREVER`, `PAPEL-ANTIGO`, `PORTA-TINTA`; Física `FORCA`, `POLIA`, `TELESCOPIO`; Geografia `MAPA`, `SATELITE`, `VULCAO`; História `LIVRO-ANTIGO`, `VASO-ANTIGO`; Filosofia e Sociologia `APERTO-DE-MAO`, `AUDITORIO`, `PENSADOR`. A peça de Física sem nome (`SEM-NOME-e792b5e0.png`) é o pêndulo de Newton da capa.
- Ícones do Drive (`APRENDICE` → `ICONES`): a sessão do comando 32 não tinha acesso ao Drive; considerou-se que `docs/icones/<matéria>/` já tem todos os ícones de tema do dono (comandos 19 e 23).
- Origem e direitos: artes do próprio dono (Drive), sem material de terceiros.

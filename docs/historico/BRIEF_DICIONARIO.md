# Dicionário "passe o mouse" (estilo Kindle) — pedido do Vitor, 29/10 21:27

Ele estuda endócrino e trava em siglas cujo nome real é em inglês (ANP = peptídeo natriurético atrial, do inglês Atrial Natriuretic Peptide — a ordem das letras "não bate" com o português). Quer: passar o mouse (ou tocar) numa palavra difícil nas resoluções, revisões, teoria e flashcards e ver uma caixinha pequena: o que é, de onde vem (sigla/origem), um exemplo. Só para palavras que alguém provavelmente precisaria pesquisar.

## Tarefa (por matéria)
1. Levante os termos candidatos no próprio material da matéria — resoluções (<m>/res/*.json), teoria e cartões (D['teoria']), flashcards (D['flash'], D['flash_img']), conceitos (D['banco'][i]['conceito']) — por script: siglas (ex.: ANP, ADH, FSH, LH, hCG, TSH, ACTH, ATP, NADH, FADH₂, RNAm, PCR, CNTP, IUPAC, MMC, PA, PG...), termos técnicos e nomes de figuras/conceitos. Conte a frequência.
2. Escolha os 100–180 mais úteis (os difíceis e frequentes; priorize SIGLAS cuja expansão é em inglês ou latim, e termos técnicos que caem em Medicina). Não inclua palavras comuns.
3. Para cada termo, escreva:
   {"termo": "ANP", "formas": ["ANP", "peptídeo natriurético atrial", "fator natriurético atrial"],   # como aparece no texto (siglas, plural, variações); usadas para achar no texto
    "def": "Hormônio produzido pelo átrio do coração quando ele estica; faz o rim eliminar mais sódio e água e baixa a pressão.",   # ≤ 30 palavras, linguagem simples
    "origem": "Sigla do inglês Atrial Natriuretic Peptide (peptídeo natriurético atrial): natri- = sódio, -urético = na urina.",   # sigla/etimologia; obrigatório para siglas; ≤ 25 palavras
    "exemplo": "Na insuficiência cardíaca, o átrio distendido libera mais ANP.",   # ≤ 20 palavras, opcional mas desejável
    "fonte": "URL ou referência"}
4. ERRO É INACEITÁVEL: confira cada expansão de sigla e cada definição em fonte confiável na web (OpenStax, IUPAC, PubChem, Ministério da Saúde, VOLP/ABL, dicionários de termos médicos), anotando a fonte. Português: termos gramaticais/literários (metonímia, anacoluto, zeugma, catáfora...) com exemplo curto (criado, ou citação curta conferida). Matemática: termos (bissetriz, apótema, geratriz, logaritmando...) e siglas (MMC, MDC, PA, PG).
5. Grave em D['dic'] (lista de objetos) com dados_util: import sys; sys.path.insert(0,'/home/claude/escadas-sc'); import dados_util as u; D = u.le(m); D['dic'] = [...]; u.grava(m, D). Cópia antes em <m>/index.html.bak_dic e <m>/dados.json.bak_dic; depois JSON válido, banco idêntico, só 'dic' mudou. Não mexa no D['glossario'] antigo. Não rode design/gera_design.py e não edite outros arquivos.
Segunda passada: caçar expansão de sigla errada, definição imprecisa e 'formas' que casariam palavras comuns (ex.: "PA" casaria "pa" em outra palavra — use só formas inequívocas e com maiúsculas exatas para siglas curtas).
Registro: /home/claude/escadas-sc/DIC_<m>.md (lista + fontes). Relatório final em até 5 linhas.

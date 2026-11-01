# Flashcards (estilo Anki) — pedido do Vitor, 29/10

Ele quer, na revisão de cada matéria, flashcards baseados no que os vestibulares de Medicina MAIS cobram (São Camilo, Fuvest, Unesp, Einstein, Santa Casa, Famema/Famerp, ENEM). Fluxo: ele lê a frente, ESCREVE a resposta com as palavras dele, confirma, e o app corrige aceitando respostas certas ditas com outras palavras (a correção é feita por IA a partir do gabarito do cartão; sem IA, ele mesmo se avalia vendo o verso).

## Formato: D['flash'] = lista (crie se não existir) — gravar com dados_util
{
 "id": "bio-f001",            # <m>-f + número com 3 dígitos, único
 "mod": "B01", "sub": "B01.1", # módulo e conteúdo (ids de D['teoria'] / D['nomesub'])
 "tipo": "conceito" | "formula" | "identificar" | "comparar" | "processo" | "exemplo",
 "frente": "pergunta curta, direta, com uma resposta clara (≤ 25 palavras)",
 "verso": "resposta-modelo curta e completa (≤ 35 palavras), em notação correta",
 "essencial": ["ideia obrigatória 1", "ideia obrigatória 2"],   # o que PRECISA aparecer para estar certo (1–4 itens curtos)
 "aceita": ["sinônimos/formas equivalentes aceitas", "..."],     # variações que também valem (ex.: 'mitocôndria'/'mitocôndrias', 'ATP'/'adenosina trifosfato')
 "erro_comum": "a confusão mais comum (1 frase)",
 "peso": 1 a 3                  # 3 = cai muito nas provas de Medicina
}
- 120 a 160 cartões por matéria, cobrindo todos os módulos na proporção do que cai (use a distribuição das questões do banco por conteúdo como guia, e o seu conhecimento das provas).
- Perguntas que tenham UMA resposta verificável (nada de "fale sobre..."). Misture tipos: definição, "como identificar na questão", fórmula/unidade, comparação (A × B), etapa de processo, exemplo clássico.
- Português: regras, figuras, funções, coesão, concordância/regência/crase, escolas literárias (características, autores, obras com datas conferidas), interpretação. Exemplos criados marcados como criados; citações reais só se conferidas letra a letra.
- Matemática: fórmulas, propriedades, condições de existência, valores notáveis; confira com sympy.
- Química: fórmulas, nomes IUPAC (português), funções, regras; equações balanceadas (confira átomos e carga).
- Biologia: termos atuais (OpenStax 2e), processos, comparações clássicas.
- Zero emoji. Erro é inaceitável: confira com fonte confiável (WebSearch/WebFetch) qualquer dúvida.

## Gravação
import sys; sys.path.insert(0,'/home/claude/escadas-sc'); import dados_util as u; D = u.le(m); D['flash'] = [...]; u.grava(m, D)
Antes: cópia <m>/index.html.bak_flash e <m>/dados.json.bak_flash. Depois: JSON válido, banco idêntico, só 'flash' mudou.
NÃO rode design/gera_design.py e não edite outros arquivos.
Faça uma segunda passada só caçando erro factual, pergunta ambígua (duas respostas possíveis) e 'essencial' incompleto ou exigente demais.
Registro: /home/claude/escadas-sc/FLASH_<m>.md (todos os cartões + fontes). Relatório final em até 6 linhas.

# Ícones realistas dos CONTEÚDOS (subtemas) — pedido do Vitor, 29/10 20:33

O Vitor AMOU os ícones realistas dos módulos (/home/claude/escadas-sc/design/icones_real/<id>.svg — ex.: Metabolismo energético, Divisão celular: "ficaram incríveis, perfeito"). Agora os ícones dos CONTEÚDOS (os ~255 subtemas, ids como B03.6, Q11.2, M05.3, P04.1) ainda são de traço plano (design/icones_pro) e ele quer que fiquem no MESMO estilo dos módulos.

Regras:
- Mesmo estilo, luz, grau de realismo e acabamento dos ícones de módulo: leia o gerador /home/claude/escadas-sc/design/icones_real/fonte_gerador/ (motor.py, servier.py, gera_*.py, constroi.sh, finaliza.js) e REUSE-o. Servier Medical Art no bioicons (CC BY 3.0) — originais já baixados em fonte_gerador/orig_servier/ e o resto no repositório github.com/duerrsimon/bioicons (git clone --depth 1 --filter=blob:none --no-checkout + checkout só do que usar). Objetos 3D gerados pelo motor do projeto quando o Servier não tiver.
- Cada conteúdo com o objeto que o representa, SEM erro de sentido (é material de estudo). Dentro de um módulo, conteúdos com ícones diferentes entre si e diferentes do ícone do módulo (pode ser um detalhe/variação do mesmo objeto quando fizer sentido, ex.: mitocôndria em corte × cloroplasto).
- Nada de emoji, nada de traço plano.
- Nomes: `python3 -I -c "import sys;sys.path.insert(0,'/home/claude/escadas-sc');import dados_util as u;D=u.le('<m>');print(D['nomesub'])"` (não grave nos dados).
- Saída: /home/claude/escadas-sc/design/icones_real/sub/<idConteudo>.svg (ids internos prefixados com o id do conteúdo; viewBox quadrado; fundo transparente; objeto ~85%; ≤ 40 KB cada — simplifique sem perder a cara realista); acrescente ao mapa em icones_real/sub/mapa_<m>.json {id: {fonte, arquivo_original, licenca, por_que}} e atribuições em icones_real/LICENCAS.md (seção da sua matéria).
- Conferência: folha de contato por módulo (64 e 128 px, fundo branco e #F1F1EE, nome ao lado) — OLHE (Read) todas; segunda passada só caçando erro de sentido, ícone feio ou fora do estilo dos módulos.
- Não edite outros arquivos do app; não rode design/gera_design.py. Relatório final em até 6 linhas com o caminho das folhas.

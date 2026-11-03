# Especialistas por matéria (decisão do dono, 03/11/2026)

Cada matéria tem a sua banca: professores doutores/mestres na área (um arquivo por matéria nesta pasta).
Toda questão é encaminhada pela `materia` ao especialista certo, em todas as etapas:

1. **Resolvedor** = especialista da matéria + `../BRIEF_RESOLVEDOR.md`.
2. **Corretor 1 (fatos)** = OUTRO especialista da mesma matéria (agente diferente, não vê o raciocínio do primeiro antes de resolver) + `../BRIEF_LENTE_FATOS.md`.
3. **Corretor 2 (didática)** = especialista da matéria com olhar de professor + `../BRIEF_LENTE_DIDATICA.md`.
4. **Corretor 1 volta** em tudo que mudou.

Lote = questões de UMA matéria (nunca misturar matérias no mesmo agente).
Matérias: bio qui mat por fis geo his fil soc ing.

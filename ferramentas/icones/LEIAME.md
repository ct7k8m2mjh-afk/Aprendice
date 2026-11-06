# Ícones das matérias novas (pranchas)

- `app/conteudo-fonte/materias/ic/pranchas/`: pranchas aprovadas pelo dono (História, Filosofia, Sociologia, Inglês, Física, Geografia). Delas sai só o ícone principal da MATÉRIA (História, Filosofia, Sociologia e Inglês); as de Física e Geografia ficam guardadas como registro.
- `extrai_pranchas.py`: recorta o ícone da matéria com remoção de fundo local (rembg; máscaras salvas em `masc/`), tira a sombra da prancha e desenha a sombra de contato.
- Saída: o ícone principal em `app/src/assets/ilu/<matéria>.webp`. Mapa central dos ícones principais: `app/src/ui/IconeMateria.tsx`.
- Ícones de TEMA não saem mais das pranchas (comandos 19 e 23 do dono, 06/11/2026): a fonte oficial é `docs/icones/<matéria>/` (PNG original guardado), convertida por `app/scripts/icones_tema.py`. Os recortes de tema das pranchas foram excluídos do site e deste código. Lugares de uso: `docs/icones/ONDE-USAR.md`.

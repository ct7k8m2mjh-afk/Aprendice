# Ícones 3D das matérias novas

- `app/conteudo-fonte/materias/ic/pranchas/`: pranchas aprovadas pelo dono (História, Filosofia, Sociologia, Inglês).
- `extrai_pranchas.py`: recorta cada ícone com remoção de fundo local (rembg; máscaras salvas em `masc/`), tira a sombra da prancha e desenha a mesma sombra de contato em todos. Também tem retoques manuais conferidos na ampliação (FORCA, TIRA, CHAO).
- Saída: `app/conteudo-fonte/materias/ic/<matéria>/<id do tema>.png` e o ícone principal em `app/src/assets/ilu/<matéria>.webp`.
- Mapa central dos ícones principais: `app/src/ui/IconeMateria.tsx`.
- Inglês: a prancha tem 8 desenhos, mas só 4 temas (Leitura, Vocabulário, Gramática, Tempos verbais). Os 4 sem tema (ouvir, pronúncia, fala, escrita) ficam em `docs/referencias/ingles-nao-usados/`, porque o vestibular de Medicina cobra só leitura.

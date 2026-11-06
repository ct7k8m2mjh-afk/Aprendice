# Comandos do dono — situação (revisado a cada 30 min pelo /loop)

Legenda: **feito** · **em andamento** · **em espera (ordem do dono)** · **aguardando o dono**

| # | Comando | Situação | Onde conferir |
|---|---|---|---|
| 1 | Pesquisa São Camilo e pendências | feito | `app/conteudo-fonte/provas/saocamilo-2024-2` |
| 2 | Ícones das matérias, menu "Outras matérias", tela inicial nova | feito | site, Início e menu |
| 4 | Ícones sem animação no site (trabalhos antigos de célula 3D e mapa/bússola descartados; ícones serão refeitos quando o dono mandar) | **em espera: "não trabalhe nos ícones até eu mandar" (05/11)** | `docs/pedidos-do-dono.md` |
| 6 | Banca de resoluções (resolvedor, fatos, didática, especialista por matéria) | feito | `ferramentas/fabrica/agentes/` |
| 7 | Resoluções São Camilo 2024/2 (40) com caderno animado | feito, no site; auditoria: última linha do caderno cortada — corrigido | simulado São Camilo 2024/2 |
| 8 | Especialistas doutores/mestres por matéria | feito | `ferramentas/fabrica/agentes/especialistas/` |
| 9 | CLAUDE.md: site (não app), vestibulares em geral, Questões Aprendice, regra de manutenção | feito e propagado; auditoria achou 7 trechos restantes — corrigidos (ícones ficam para quando o dono liberar) | `CLAUDE.md`, `PRODUCT.md`, `DESIGN.md`, READMEs |
| 10 | Direitos: quem decide é o dono | feito e propagado | princípio 10 |
| 11 | Link público | feito; 05/11 23h: caiu (main sem o site virou produção) e foi restabelecido; produção agora só a partir de `app-prototipo-completo` | https://aprendice.vercel.app |
| 12 | Login igual à referência + abertura escrita à mão | feito e publicado; auditoria: tema escuro corrigido (login fica sempre claro, como a referência) | site, tela de entrada |
| 13 | Publicar sempre que uma aba inteira mudar | regra registrada | `CLAUDE.md` |
| 14 | Instituições e provas (82) para simulados e exercícios: baixar, separar matérias, classificar nível e subtema (sem resolução; só múltipla escolha — dissertativas depois, por comando do dono) | **em andamento** — passo 1 (inventário) | `docs/provas/inventario-*.md` |
| 15 | Revisão a cada 30 min dos comandos | em andamento (loop) | este arquivo |
| 16 | Design do site seguindo o SISTEMA do protótipo (`app-atual/design/materia.css`, `fontes.css`): grade, hierarquia, fontes (título da matéria em Dancing Script na cor da matéria), medidas, cantos, responsivo; sem perder nada; enquadramento perfeito em 390/768/1280/1440, claro e escuro; auditor separado até zerar; DESIGN.md com valores reais; commit, push, publicar | **em andamento** (agente de design, em paralelo à coleta de provas) | `DESIGN.md`, site |
| 17 | (substituído pelo comando 18) | — | — |
| 18 | Paleta aprovada (`docs/cores/paleta.json`, PDF): ao entrar numa matéria o site assume a cor dela (principal, texto claro/escuro, fundo suave claro/escuro, texto sobre a cor); Filosofia e Sociologia viram "Filosofia e Sociologia" (amarelo-ouro), sem mudar ids, com migração do progresso; guia tipográfico (`docs/fontes/`) em todas as telas, Literata no site com licença; sem mexer em ícones, textos, layout; 390/768/1280/1440 claro/escuro; agente separado revisando; testes; DESIGN.md; publicar | **em andamento** (agente de cores/fontes, em paralelo) | `DESIGN.md`, site |
| 19 | Ícones dos 12 temas de Biologia (`docs/icones/biologia/`) e de Química (`docs/icones/quimica/`, chegou 06/11), id do tema no nome: cada um DENTRO de um círculo claro; ao passar o mouse/focar, o círculo cresce ~6% e sobe levemente; nos lugares listados em `docs/icones/ONDE-USAR.md` (faixa de temas é o principal); subtemas sem ícone; objeto 100% opaco, restos do fundo apagados, WebP leve + PNG original guardado; mesma regra para as próximas matérias quando o dono mandar; 390/768/1280/1440 claro/escuro, agente separado revisando, testes, publicar | **novo — começar** (em paralelo; não interromper o 14, o 16 e o 18) | `docs/icones/ONDE-USAR.md` |

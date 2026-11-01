# Correções dos ícones de conteúdo (sub/) apontados em REVISAO_SUB.md

Feito em 29/10/2026. Os 23 apontamentos (3 P1 e 20 P2) foram corrigidos. Os grupos de repetição levaram a mexer em 26 arquivos.
As versões anteriores estão em `_bak_sub/` (SVG e geradores). Nenhum ícone de outra parte do app foi tocado e o `design/gera_design.py` não foi rodado.

**Folhas de contato antes/depois** (64 e 128 px, fundo branco): `folhas/correcoes_sub_1.png`, `_2.png` e `_3.png`. Todas foram conferidas a olho nos dois tamanhos.
As folhas por módulo também foram refeitas: `sub/folhas/` (Bio e Port.), `sub/folhas_mat/` e `folhas/sub_qui/`.

## Como foi feito

- Cada correção foi feita **no gerador** do ícone: `gera_qui_sub.py`, `gera_bio_sub.py`, `sub_mat_a.py`, `sub_mat_b.py` e `gera_sub_por.py`. Cada função alterada tem um comentário "correcao da revisao de 29/10".
- Os SVGs saíram pelo mesmo `finaliza.js` / `finaliza_sub.js`, com SVGO e ids prefixados pelo id do ícone. Todos têm até 40 KB (o maior é o B07.3, com 34,5 KB).
- Não há `<text>`, imagem externa, emoji nem marca. Os textos que aparecem foram convertidos em contorno de fonte DejaVu.
- O estilo é o mesmo: Servier Medical Art (CC BY 3.0) e o motor 3D do projeto, com a mesma luz e sombra.
- Atualizados para os ícones alterados: `sub/mapa_bio.json` e `sub/mapa_mat.json` (pelos scripts `mapa_sub_*.py`), `sub/mapa_qui.json`, `sub/mapa_por.json` e `LICENCAS.md` (arquivos Servier usados e alterações feitas).
- Arquivos Servier novos, copiados para `fonte_gerador/orig_servier/`: `Chemistry/pipette-plastic`, `Chemistry/flask-green`, `Chemistry/flask-empty` (não usado no fim) e `Human_physiology/brain-1`.

## O que mudou

| id | Grav. | Correção |
|---|---|---|
| Q05.3 | P1 | Pisseta de plástico leitoso (tampa de rosca, bico curto em gancho) inclinada sobre o béquer. O filete cai **por cima** da solução e faz ondinhas na superfície. Não tem mais mangueira mergulhada. |
| Q12.3 | P1 | A unidade –CH₂–CH₂– fica entre colchetes, com o índice **n**. As pontas são ligações soltas que seguem o zigue-zague, com reticências: a cadeia continua. O número de C caiu de 8 para 6, com o mesmo modelo RDKit. |
| B07.3 | P1 | Troca do `healthy-lung` pelo `lung` + `trachea-bronchi` da Servier, em rosa mais saturado. O pulmão direito tem 3 lobos (fissuras horizontal e oblíqua) e o esquerdo tem 2, com a **incisura cardíaca** recortada e a língula embaixo. A árvore brônquica entra pelos hilos e a traqueia está presente. As manchas soltas das costelas saíram. |
| B03.4 | P2 | Pote de iogurte desenhado: copo baixo, faixa colorida sem marca, tampa de alumínio meio aberta, iogurte branco à vista e colher. O vinho foi mantido. |
| B08.4 | P2 | Base do encéfalo (Servier `brain-1` recolorido, esmaecendo para cima) com o hipotálamo destacado em laranja e a hipófise (adeno vermelha, neuro clara) pendurada pelo infundíbulo na sela turca. O enquadramento fechado evita repetir o encéfalo inteiro do ícone do módulo B08. |
| B10.2 | P2 | Antibiograma: placa coberta de bactérias e 4 discos, 3 com halo de inibição e 1 **sem halo** (cepa resistente). Desenho próprio; a cápsula saiu. |
| B10.3 | P2 | Barbeiro escurecido, com o **conexivo listrado de laranja e preto**. O *T. cruzi* aparece só dentro de uma lupa, entre hemácias, na escala certa. |
| B10.5 | P2 | Pele em tom médio com contorno mais escuro, água mais saturada e espuma em bolhas com contorno. |
| B11.2 | P2 | Dois troncos lado a lado: no claro (com líquens) a mariposa escura fica à vista; no escuro (fuligem) é a clara que aparece. |
| B04.3 (+B04.4) | P2 | B04.3: tétrade com 4 cromátides, as irmãs presas no centrômero (cinetócoro marcado) e o **quiasma em X** entre as não irmãs internas, em cores mais saturadas. B04.4: cariótipo em grade (11 pares em lilás) com o **trio do 21** em magenta num quadro destacado. Os dois deixaram de ser parecidos. |
| Q01.2 | P2 | Os três isótopos descem em diagonal e ocupam o quadro, com núcleos e órbitas maiores. |
| Q03.3 | P2 | Dois tubos largos: KI incolor e o tubo onde a pipeta de Pasteur pinga o Pb(NO₃)₂ e se forma o PbI₂ amarelo. |
| Q04.4 | P2 | Funil de Büchner **de porcelana**, largo e baixo, com papel de filtro e o sólido. Fica na rolha do kitassato, com a mangueira de vácuo na saída lateral. |
| Q05.1 | P2 | Proveta alargada (1,9×), densímetro grande com escala e lastro e líquido azul saturado. |
| Q05.2 (+Q05.3, Q05.5) | P2 | Balão volumétrico com o **menisco na marca** de aferição. A solução é violeta (KMnO₄) porque o ícone do módulo Q05 já é um balão azul. Agora só o Q05.5 continua béquer azul; o Q05.3 é pisseta sobre béquer rosa. |
| Q09.3 | P2 | Anel grosso de zinco branco-azulado preso ao prego protegido, que ficou brilhante. Atrás fica o prego enferrujado. |
| Q11.1 (+Q11.2, Q11.5) | P2 | Q11.2: **eteno** (H₂C=CH₂, com a dupla C=C) sobre um tomate maduro e um verde, no contexto real do alceno que amadurece frutos. Q11.5: duas placas coloridas com a fórmula de linha do butano e do metilpropano e "C₄H₁₀" em ambas. Q11.1 e Q11.3 continuam bola-e-vareta. |
| M06.2 (+M06.1, M06.5) | P2 | Gangorra em equilíbrio, com o bloco **2ˣ** de um lado e um cubo 2×2×2 de 8 cubinhos do outro: 2ˣ = 8 = 2³. |
| M12.2 (+M12.1, M12.4, M12.5) | P2 | M12.2: rampa de madeira com Δx (azul), Δy (vermelho) e o ângulo α marcados, ou seja, o coeficiente angular. M12.1: mapa de papel com dois pinos e régua amarela entre eles. A folha quadriculada fica só em M12.4 e M12.5. |
| M08.3 | P2 | Compasso mais grosso, circunferência com traço escuro e largo, raio vermelho contínuo e papel mais justo. |
| P01.2 | P2 | Corte de oceano em faixa larga sem paredes, que some nas laterais. A linha d'água é reta e marcada, a água é escura atrás e o gelo submerso é mais claro que ela. |
| P07.4 | P2 | Três peças de quebra-cabeça de madeira pintada (verde-petróleo, ocre e roxo), sem pinos redondos: **des + leal + dade**. A última peça chega levantada para encaixar. |
| P10.2 | P2 | Enquadramento mais fechado, 3 pautas pretas mais grossas, notas maiores e batuta grossa com cabo de cortiça. |

## Decisões que valem conferir

1. **Q11.2 trocou propeno por eteno.** A sugestão da revisão ("gás de cozinha ou isqueiro com propano/butano") mostraria hidrocarbonetos **saturados** num ícone de insaturados, o que seria erro de conteúdo. Além disso, o botijão já é o Q07.3. O eteno com tomates mantém o assunto (alceno, dupla C=C) e é um contexto cobrado no ENEM. Se o conteúdo do Q11.2 exigir o propeno, basta voltar a função `Q11_2` do `_bak_sub/fonte_gerador/gera_qui_sub.py`.
2. **M06.2 usa gangorra em vez de balança de pratos.** A balança de dois pratos já se repete em P02.4 e Q04.5.
3. **Repetições entre matérias que ficaram (só registro):** o M12.1 (mapa com pinos) lembra o M02.3 (mapa dobrado com escala gráfica), mas os objetos e o enquadramento são diferentes. A placa de Petri aparece em B10.2, que é antibiograma, e não aparece em outro ícone de conteúdo.

## Incidente corrigido no caminho

Uma substituição por índice no `gera_bio_sub.py` duplicou temporariamente um trecho do arquivo e apagou o `B06_5`. O arquivo foi reconstruído e o `B06_5` foi restaurado do `_bak_sub`. A lista de funções agora é idêntica à do backup; as duplicatas `B09_3` e `B12_1` já existiam antes. O B06.5 não foi regerado e o SVG dele está intacto.

## Para regerar

```sh
export SVGO=<pacote svgo 3.3.2> NODE_PATH=<node_modules com playwright> BIOICONS=<clone do bioicons>
cd fonte_gerador
python3 gera_qui_sub.py Q05.3 Q12.3 ... && node finaliza.js bruto_sub_qui ../sub Q05.3 Q12.3 ...
python3 gera_bio_sub.py B07.3 ...       && node finaliza_sub.js bruto_sub_bio ../sub B07.3 ...
python3 sub_mat_a.py M06.2 && python3 sub_mat_b.py M12.1 M12.2 M08.3 && node finaliza.js bruto_sub_mat ../sub M06.2 M12.1 M12.2 M08.3
python3 gera_sub_por.py P01.2 P07.4 P10.2 && node finaliza.js bruto_sub_por ../sub P01.2 P07.4 P10.2
```

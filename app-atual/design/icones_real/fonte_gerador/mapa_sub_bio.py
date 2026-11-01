# -*- coding: utf-8 -*-
"""Escreve ../sub/mapa_bio.json: fonte, arquivo original, licenca e motivo de cada icone de conteudo de Biologia.
Os arquivos Servier usados vem de bruto_sub_bio/_usados.json (gravado pelo gera_bio_sub.py)."""
import json, os
AQUI = os.path.dirname(os.path.abspath(__file__))
U = json.load(open(os.path.join(AQUI, 'bruto_sub_bio', '_usados.json')))
SERVIER = 'Servier Medical Art (smart.servier.com), via repositório bioicons (github.com/duerrsimon/bioicons)'
LIC_S = 'CC BY 3.0 (atribuição obrigatória: "Servier Medical Art, CC BY 3.0")'
PROP = 'Próprio do projeto (sem restrição de terceiros)'
MOTOR = 'Gerado no projeto: motor 3D de fonte_gerador/motor.py (mesma câmera, luz e sombra dos ícones de módulo)'
DESENHO = 'Desenho do projeto no acabamento Servier (gradiente, contorno fino, luz de cima-esquerda)'
RDKIT = 'Gerado no projeto: bola-e-vareta do gera_qui.py com geometria 3D calculada pelo RDKit (BSD)'

# id: (tipo, alteracao/complemento, por que)
P = {
 'B01.1': ('S', 'recorte de 2 canais', 'bicamada fosfolipídica com proteínas-canal e íons atravessando a favor do gradiente: difusão facilitada, um transporte passivo'),
 'B01.2': ('S', 'recorte de 2 estados da bomba', 'bomba de sódio e potássio com Na⁺ (azul) saindo e K⁺ (roxo) entrando contra o gradiente: o exemplo clássico de transporte ativo'),
 'B01.3': ('D', '', 'célula vegetal com parede celular, vacúolo central, cloroplastos e núcleo deslocado: o envoltório extra (parede) e as organelas que a distinguem da célula animal'),
 'B01.4': ('S+', 'composição; vesículas desenhadas no projeto', 'retículo endoplasmático rugoso, vesículas de transporte e complexo golgiense: o caminho do sistema de endomembranas'),
 'B01.5': ('S+', 'composição com cloroplasto desenhado no projeto', 'mitocôndria e cloroplasto lado a lado: as duas organelas com DNA e ribossomos próprios, base da teoria da endossimbiose'),
 'B01.6': ('S', 'nenhuma', 'célula com o núcleo, a rede de microtúbulos do citoesqueleto irradiando do centrossomo e os cílios na superfície'),
 'B02.1': ('S', 'composição', 'copo de água e saleiro (NaCl, um sal mineral): os componentes inorgânicos da célula'),
 'B02.2': ('S', 'composição', 'pão (amido, um carboidrato) e manteiga (gordura, um lipídio)'),
 'B02.3': ('D', '', 'ovo frito: a clara fica branca e sólida porque o calor desnatura a albumina (perde a estrutura tridimensional, mantém a sequência de aminoácidos)'),
 'B02.4': ('S+', 'substrato complementar desenhado no projeto sobre o contorno do sítio ativo', 'enzima com o sítio ativo e o substrato de forma complementar se encaixando: especificidade (modelo chave-fechadura)'),
 'B02.5': ('R', 'smiles: ATP', 'molécula de ATP (adenina em azul, ribose e os 3 fosfatos em laranja), só os átomos pesados'),
 'B03.1': ('R', 'smiles: glicose e piruvato; seta desenhada', 'uma glicose (6 carbonos) quebrada em dois piruvatos (3 carbonos cada): o resultado da glicólise'),
 'B03.2': ('M', '', 'membrana interna da mitocôndria com complexos da cadeia transportadora de elétrons, citocromo c e a ATP sintase (anel F0 na membrana, cabeça F1 com 3 α e 3 β)'),
 'B03.3': ('R', 'coordenadas: O=O 1,21 Å; H2O com O–H 0,96 Å e ângulo de 104,5°', 'O₂ e a água que ele forma: o oxigênio é o aceptor final de elétrons da cadeia respiratória'),
 'B03.4': ('S+', 'composição: vinho da Servier e pote de iogurte desenhado no projeto (o pote da Servier lia como caixa)', 'pote de iogurte aberto, com a tampa de alumínio dobrada e a colher (fermentação láctica), e vinho (fermentação alcoólica)'),
 'B03.5': ('D', '', 'cloroplasto em corte: tilacoides empilhados em grana (fase fotoquímica) e o estroma (ciclo de Calvin), com grãos de amido'),
 'B03.6': ('S', 'composição', 'abacaxi (planta CAM) e milho (planta C4): os dois mecanismos que contornam a fotorrespiração'),
 'B04.1': ('M', 'letras G₁, S, G₂ e M: contornos da fonte DejaVu', 'ciclo celular em anel com as fases em proporção aproximada e o sentido G₁ → S → G₂ → M (intérfase = G₁ + S + G₂)'),
 'B04.2': ('S', 'recorte de uma das células da sequência', 'célula em metáfase: cromossomos alinhados na placa equatorial, fuso e centrossomos nos polos'),
 'B04.3': ('D', '', 'tétrade: dois homólogos duplicados pareados, as cromátides-irmãs presas no centrômero e as não irmãs internas cruzadas num quiasma em X, o ponto do crossing-over'),
 'B04.4': ('D', '', 'cariótipo em grade com o trio do cromossomo 21 (pequeno, acrocêntrico, com satélites) destacado em magenta: trissomia do 21, aneuploidia causada por não disjunção'),
 'B04.5': ('S', 'nenhuma', 'célula cancerosa: núcleo grande e irregular, citoplasma deformado'),
 'B05.1': ('S', 'nenhuma', 'forquilha de replicação: cada nova dupla-hélice tem uma fita antiga e uma nova (replicação semiconservativa)'),
 'B05.2': ('S', 'recorte', 'a dupla-hélice se abre e uma fita de RNA é copiada a partir de uma das fitas de DNA: transcrição'),
 'B05.3': ('S', 'recorte (retirada a subunidade solta)', 'ribossomo lendo o RNAm, RNAt trazendo aminoácidos e a cadeia polipeptídica saindo: tradução'),
 'B05.4': ('S', 'composição', 'hemácia normal e hemácia falciforme: a anemia falciforme vem de uma mutação pontual (troca de uma base, GAG → GTG)'),
 'B05.5': ('S', 'composição', 'célula-tronco e células especializadas (hemácia, fibra muscular lisa, adipócitos): o mesmo DNA com genes diferentes ativos'),
 'B05.6': ('S', 'nenhuma', 'eletroforese em gel: a amostra de DNA aplicada no poço e as bandas separadas por tamanho'),
 'B06.1': ('D', '', 'ervilha amarela (dominante) e ervilha verde (recessiva): um caráter só, a 1ª lei de Mendel'),
 'B06.2': ('D', '', 'as 4 classes da F2 diíbrida: amarela lisa, amarela rugosa, verde lisa e verde rugosa (9:3:3:1)'),
 'B06.3': ('M', '', 'heredograma em peças: quadrado = homem, círculo = mulher, cheio = afetado; casal normal com filha afetada (herança recessiva)'),
 'B06.4': ('D', 'texto "AB+": contornos da fonte DejaVu', 'bolsa de sangue com a etiqueta do tipo sanguíneo (sistema ABO e fator Rh)'),
 'B06.5': ('D', '', 'cromossomos X (grande, submetacêntrico) e Y (pequeno, acrocêntrico)'),
 'B06.6': ('S', 'mesma mão repetida 5 vezes com filtro de cor em tons de pele', 'gradação contínua da cor da pele: herança quantitativa (vários genes somando efeito)'),
 'B07.1': ('S+', 'composição com neurônio desenhado no projeto', 'os quatro tecidos: epitelial (células colunares lado a lado), muscular, conjuntivo (fibroblasto) e nervoso (neurônio)'),
 'B07.2': ('S', 'composição na posição anatômica', 'fígado, estômago e pâncreas: os órgãos da digestão citados no conteúdo'),
 'B07.3': ('S', 'composição; pulmões recoloridos, incisura cardíaca recortada no pulmão esquerdo e árvore brônquica recolorida', 'pulmões em vista anterior: o direito com 3 lobos, o esquerdo com 2 e a incisura cardíaca, a traqueia e os brônquios entrando pelos hilos'),
 'B07.4': ('S', 'nenhuma', 'coração em corte com as 4 cavidades, as valvas e os grandes vasos (circulação pulmonar e sistêmica); variação em corte do ícone do módulo'),
 'B07.5': ('S', 'composição', 'hemácias, um neutrófilo e plaquetas: os elementos do sangue'),
 'B07.6': ('S', 'nenhuma', 'rim com o ureter (órgão onde ficam os néfrons)'),
 'B08.1': ('D', '', 'neurônio: dendritos, corpo celular, axônio com bainha de mielina e nódulos de Ranvier, terminais com botões'),
 'B08.2': ('D', '', 'sinapse química: terminal pré-sináptico com vesículas liberando neurotransmissor na fenda e receptores na membrana pós-sináptica'),
 'B08.3': ('D', '', 'medula espinal em corte (substância cinzenta em H, cornos dorsais finos, ventrais largos) com raízes dorsal (com gânglio) e ventral formando os nervos espinais: o centro do arco reflexo'),
 'B08.4': ('S+', 'encéfalo da Servier recolorido; hipotálamo, hipófise e sela turca desenhados no projeto', 'encéfalo com o hipotálamo destacado e a hipófise (adeno-hipófise avermelhada, neuro-hipófise clara) pendurada pelo infundíbulo na sela turca'),
 'B08.5': ('D', '', 'glândula tireoide (dois lobos e istmo) sobre a traqueia, logo abaixo da laringe'),
 'B08.6': ('S', 'composição', 'anticorpo (imunoglobulina com cadeias pesadas e leves) e seringa: vacina × soro'),
 'B08.7': ('D', '', 'ovócito secundário com zona pelúcida, corona radiata e o 1º corpúsculo polar, e espermatozoides chegando: fecundação'),
 'B09.1': ('S', 'composição; coelho espelhado', 'produtor (couve) e consumidor primário (coelho herbívoro): o início de uma cadeia alimentar'),
 'B09.2': ('M', '', 'pirâmide de energia: produtores na base e cada nível trófico menor que o anterior (cerca de 10% passa adiante)'),
 'B09.3': ('S', 'composição', 'a Terra e as setas de um ciclo: a matéria circula entre seres vivos e ambiente'),
 'B09.4': ('D', '', 'abelha visitando a flor: mutualismo (néctar para a abelha, pólen levado para a planta)'),
 'B09.5': ('D', '', 'rocha com liquens (pioneiros), capim, arbusto e árvore: as etapas da sucessão ecológica até a comunidade clímax'),
 'B09.6': ('G', '', 'mapa do Brasil em relevo com os 6 biomas continentais: Amazônia, Cerrado, Caatinga, Mata Atlântica, Pampa e Pantanal'),
 'B10.1': ('S', 'nenhuma', 'vírus envelopado com as espículas de glicoproteína'),
 'B10.2': ('D', '', 'antibiograma: placa de Petri coberta de bactérias, discos de antibiótico com halos de inibição (sensível) e um disco sem halo (cepa resistente)'),
 'B10.3': ('S', 'composição; barbeiro escurecido com o conexivo listrado de laranja e preto; lupa e hemácias desenhadas no projeto', 'barbeiro (triatomíneo, o vetor) e o Trypanosoma cruzi ampliado na lupa, entre hemácias: doença de Chagas'),
 'B10.4': ('S', 'nenhuma', 'Ascaris lumbricoides (lombriga) adulta'),
 'B10.5': ('S', 'pele e água recoloridas; espuma desenhada no projeto', 'lavar as mãos com água e sabão: a medida de profilaxia mais básica'),
 'B11.1': ('D', '', 'braço humano e asa de morcego com os mesmos ossos na mesma cor (úmero, rádio, ulna, carpo, dedos): órgãos homólogos, evidência de ancestralidade comum'),
 'B11.2': ('D', '', 'Biston betularia: no tronco claro a mariposa escura fica à vista e no tronco escurecido pela fuligem é a clara que se destaca (e é predada): seleção natural'),
 'B11.3': ('S+', 'contas desenhadas no projeto dentro e fora do erlenmeyer', 'frasco com contas de 5 cores e as poucas que passaram pelo gargalo, só de 2 cores: efeito gargalo/fundador, a deriva genética'),
 'B11.4': ('M', 'letras p², pq, q²: contornos da fonte DejaVu', '(p + q)² = p² + 2pq + q² em azulejos de área proporcional (p = 0,6; q = 0,4): as frequências genotípicas de Hardy-Weinberg'),
 'B11.5': ('D', '', 'tentilhões de Darwin com bicos diferentes, cada um adaptado a um alimento: irradiação adaptativa e especiação'),
 'B12.1': ('M', 'bactéria desenhada no projeto', 'bacteriófago (capsídeo icosaédrico, cauda e fibras) pousado sobre uma bactéria com flagelo'),
 'B12.2': ('S+', 'composição com leveduras desenhadas no projeto', 'ameba (protozoário) e leveduras em brotamento (fungo unicelular)'),
 'B12.3': ('M', '', 'caule de dicotiledônea em corte: epiderme, córtex, feixes de xilema (para dentro) e floema (para fora) em anel, medula'),
 'B12.4': ('D', '', 'estômato: duas células-guarda com cloroplastos em volta do ostíolo, entre células da epiderme'),
 'B12.5': ('S+', 'composição com estrela-do-mar desenhada no projeto', 'mosca-das-frutas (artrópode) e estrela-do-mar (equinodermo): dois grupos de invertebrados'),
 'B12.6': ('S', 'composição', 'peixe, rato e macaco: três classes de vertebrados'),
}
out = {}
for i, (t, alt, pq) in P.items():
    arqs = ['static/icons/' + a for a in U.get(i, [])]
    if t in ('S', 'S+'):
        d = {'fonte': SERVIER + (' — ' + alt if alt and alt != 'nenhuma' else ''), 'arquivo_original': arqs if len(arqs) > 1 else arqs[0],
             'licenca': LIC_S + ('; partes desenhadas: ' + PROP.lower() if t == 'S+' else '')}
    elif t == 'D':
        d = {'fonte': DESENHO + (' — ' + alt if alt else ''), 'arquivo_original': f'fonte_gerador/gera_bio_sub.py: {i.replace(".", "_")}()', 'licenca': PROP}
    elif t == 'M':
        d = {'fonte': MOTOR + (' — ' + alt if alt else ''), 'arquivo_original': f'fonte_gerador/gera_bio_sub.py: {i.replace(".", "_")}()', 'licenca': PROP}
    elif t == 'R':
        d = {'fonte': RDKIT + (' — ' + alt if alt else ''), 'arquivo_original': f'fonte_gerador/gera_bio_sub.py: {i.replace(".", "_")}()', 'licenca': PROP}
    elif t == 'G':
        d = {'fonte': 'Gerado no projeto a partir dos limites oficiais dos biomas do IBGE (Biomas do Brasil, 2019), baixados pelo pacote geobr (IPEA), simplificados (Douglas-Peucker)',
             'arquivo_original': 'fonte_gerador/biomas_br_simpl.json (de biomes_2019_simplified.gpkg, github.com/ipea/geobr, release v1.7.0); fonte_gerador/gera_bio_sub.py: B09_6()',
             'licenca': 'Dados públicos do IBGE (uso livre com citação da fonte: "IBGE, Biomas do Brasil, 2019"); desenho próprio do projeto'}
    d['por_que'] = pq
    out[i] = d
json.dump(out, open(os.path.join(AQUI, '..', 'sub', 'mapa_bio.json'), 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print(len(out), 'ids;', sum(1 for v in P.values() if v[0] in ('S', 'S+')), 'com Servier')

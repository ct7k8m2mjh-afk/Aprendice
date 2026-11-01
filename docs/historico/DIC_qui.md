# Dicionário 'passe o mouse' — QUÍMICA (qui) — 29/10/2026

Gravado em D['dic'] de qui/index.html e qui/dados.json (180 termos). Backups: qui/index.html.bak_dic, qui/dados.json.bak_dic. Só a chave 'dic' mudou; banco (571), flash (50), glossario intactos.

## Método
1. Corpus: res/*.json (texto das resoluções, sem imagens/base64), D['teoria'], D['flash'], D['flash_img'] e D['banco'][i]['conceito'] (2,5 milhões de caracteres).
2. Contagem por script: siglas (maiúsculas), a lista 'simbolos' que as resoluções já explicam, e cerca de 330 termos técnicos candidatos. Contagem por palavra inteira (siglas e formas com maiúscula comparadas com maiúscula exata).
3. Escolha: siglas primeiro (sobretudo as de expansão em inglês: VSEPR, HDL/LDL, PET, PVC, PABA, DEET, BMDM, DDT, THC, Kw…), depois termos técnicos difíceis e frequentes. Ficaram de fora palavras comuns e termos básicos (hidrocarboneto, gás nobre, regra do octeto…). Também ficaram de fora siglas raras (GLP, IPCC, MEK, SBR, HInd), para respeitar o teto de 180.
4. Conferência: expansões de sigla conferidas na web (PubChem, ChemicalBook/BMDM, CDC/DEET, MedlinePlus/HDL-LDL, OMS/UV, ANP/QAV, Preparaenem/CNTP-CATP, Wikipedia/pH, UNEP/CFC). Definições conferidas contra OpenStax Chemistry 2e, Organic Chemistry e Biology 2e, além do IUPAC Gold Book. A nomenclatura própria do Brasil (tonoscopia, metameria, oxidação branda, nox, CNTP, CATP, Kps, diagrama de Linus Pauling) foi conferida em Feltre e Usberco. Os números (E°, Ka, Kb, ΔH, meias-vidas, faixa da fenolftaleína etc.) foram recalculados ou conferidos.
5. Segunda passada: nenhuma 'forma' repetida entre termos; siglas curtas (PS, PP, Ka, Kb, Kc, Kp, Kw, pH, Bq, UV) só com maiúsculas exatas e conferidas no contexto do corpus. Tirei 'isométrica' (ambígua) e 'NOX'. Limites de palavras (def ≤ 30, origem ≤ 25, exemplo ≤ 20) checados por script.
6. Pontos de atenção corrigidos ou explicitados: CATP = 25 °C e 1 atm → 24,5 L/mol (provas arredondam para 25 L). Faixas de UV pela OMS (UVA 315–400 nm; alguns livros usam 320). A origem do 'p' do pH é debatida. 'Diagrama de Linus Pauling' é nome só usado no Brasil (fora daqui, regra de Madelung).

Nota para quem implementar o destaque: comparar siglas e formas com maiúscula em modo sensível a maiúsculas, as demais sem diferenciar maiúsculas, sempre por palavra inteira (para 'amina' não casar 'vitamina', nem 'fenol' casar 'fenolftaleína').

## Lista (termo — formas — fonte)

- **CNTP** — CNTP  
  Condições normais de temperatura e pressão: 0 °C (273 K) e 1 atm. Nelas, 1 mol de qualquer gás ideal ocupa 22,4 L.  
  Origem: Sigla em português: Condições Normais de Temperatura e Pressão. Em inglês, STP (standard temperature and pressure).  
  Ex.: 2 mol de O2 nas CNTP ocupam 2 × 22,4 = 44,8 L.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 9 (Gases); https://www.preparaenem.com/quimica/volume-molar.htm
- **CATP** — CATP  
  Condições ambiente de temperatura e pressão: 25 °C e 1 atm. Nelas, 1 mol de gás ocupa cerca de 24,5 L (provas costumam arredondar para 25 L).  
  Origem: Sigla em português: Condições Ambiente de Temperatura e Pressão.  
  Ex.: Pela equação PV = nRT: 0,082 × 298 ÷ 1 ≈ 24,5 L por mol.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 9 (Gases); https://www.preparaenem.com/quimica/volume-molar.htm
- **pH** — pH  
  Escala de acidez: pH = −log[H⁺]. A 25 °C, pH abaixo de 7 é ácido, igual a 7 é neutro e acima de 7 é básico.  
  Origem: Criado por Sørensen em 1909. O H é de hidrogênio; o p costuma ser lido como 'potencial' ou 'potência', mas sua origem é debatida.  
  Ex.: O sangue tem pH perto de 7,4; o suco gástrico, perto de 2.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 14; https://en.wikipedia.org/wiki/PH
- **pOH** — pOH  
  Escala da concentração de OH⁻: pOH = −log[OH⁻]. A 25 °C, pH + pOH = 14.  
  Origem: Mesma lógica do pH (p = −log), aplicada ao íon hidróxido, OH⁻.  
  Ex.: Solução com pOH 3 tem pH 11, logo é básica.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 14
- **Ka** — Ka  
  Constante de ionização de um ácido. Quanto maior o Ka, mais o ácido se ioniza, ou seja, mais forte ele é.  
  Origem: K de constante; o índice a vem de ácido (em inglês, acid).  
  Ex.: Ka do ácido acético ≈ 1,8 × 10⁻⁵: ácido fraco.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 14
- **Kb** — Kb  
  Constante de ionização de uma base. Quanto maior o Kb, mais forte a base.  
  Origem: K de constante; o índice b vem de base.  
  Ex.: Kb da amônia ≈ 1,8 × 10⁻⁵: base fraca.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 14
- **Kw** — Kw, produto iônico da água  
  Produto iônico da água: [H⁺]·[OH⁻] = 1,0 × 10⁻¹⁴ a 25 °C. Por isso, nessa temperatura, pH + pOH = 14.  
  Origem: K de constante; o índice w vem do inglês water (água).  
  Ex.: Se [H⁺] = 10⁻³ mol/L, então [OH⁻] = 10⁻¹¹ mol/L.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 14
- **Kc** — Kc, constante de equilíbrio, constantes de equilíbrio  
  Constante de equilíbrio em concentrações (mol/L): produtos sobre reagentes, cada um elevado ao seu coeficiente. Sólidos e líquidos puros ficam fora.  
  Origem: K de constante; o índice c indica que se usam concentrações.  
  Ex.: Em N2 + 3 H2 ⇌ 2 NH3: Kc = [NH3]² ÷ ([N2]·[H2]³).  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 13
- **Kp** — Kp  
  Constante de equilíbrio escrita com as pressões parciais dos gases, em vez das concentrações.  
  Origem: K de constante; o índice p indica que se usam pressões.  
  Ex.: Em 2 NO2 ⇌ N2O4: Kp = pN2O4 ÷ (pNO2)².  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 13
- **Kps** — Kps, produto de solubilidade, constante do produto de solubilidade  
  Produto de solubilidade: produto das concentrações dos íons de um sal pouco solúvel na solução saturada, cada uma elevada ao seu coeficiente.  
  Origem: Sigla em português (constante do produto de solubilidade). Em inglês é Ksp, de solubility product.  
  Ex.: AgCl ⇌ Ag⁺ + Cl⁻: Kps = [Ag⁺]·[Cl⁻].  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 15
- **nox** — nox, Nox, número de oxidação, números de oxidação  
  Número de oxidação: carga que o átomo teria se os elétrons de cada ligação fossem todos para o átomo mais eletronegativo.  
  Origem: Abreviação em português de número de oxidação.  
  Ex.: No H2O, o H tem nox +1 e o O tem nox −2.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 4 (oxidation number); Nomenclatura do ensino médio brasileiro (Feltre, Química, vols. 1–3; Usberco & Salvador, Química)
- **ddp** — ddp, diferença de potencial  
  Diferença de potencial elétrico entre dois pontos, em volts. Numa pilha: ddp = E° do cátodo − E° do ânodo.  
  Origem: Sigla em português: diferença de potencial. Também chamada de tensão ou força eletromotriz.  
  Ex.: Pilha com cátodo +0,80 V e ânodo −0,76 V: ddp = 1,56 V.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 17
- **E° (potencial de redução)** — E°, potencial de redução, potenciais de redução, potencial-padrão de redução, potencial padrão de redução, potenciais-padrão de redução  
  Potencial-padrão de redução, em volts: mede a tendência de uma espécie receber elétrons. Quanto maior o E°, mais facilmente ela se reduz.  
  Origem: O sinal ° indica condições-padrão: soluções a 1 mol/L, gases a 1 atm (ou 1 bar) e, em geral, 25 °C.  
  Ex.: E°(Cu²⁺/Cu) = +0,34 V é maior que E°(Zn²⁺/Zn) = −0,76 V: o cobre se reduz.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 17
- **ΔH** — ΔH  
  Variação de entalpia: calor trocado numa reação a pressão constante. Negativo = libera calor (exotérmica); positivo = absorve calor (endotérmica).  
  Origem: Δ (delta, letra grega) indica variação, final menos inicial; H é o símbolo de entalpia.  
  Ex.: Combustão do metano: ΔH ≈ −890 kJ/mol, reação exotérmica.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 5
- **ppm** — ppm  
  Partes por milhão: 1 parte de soluto em 1 milhão de partes da mistura. Equivale a 1 mg por kg (em água, cerca de 1 mg/L).  
  Origem: Do inglês parts per million (partes por milhão).  
  Ex.: Água com 2 ppm de cloro tem 2 mg de cloro por litro.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 3 (parts per million)
- **ppb** — ppb  
  Partes por bilhão: 1 parte em 1 bilhão, mil vezes menor que o ppm. 1 ppb = 1 μg por kg.  
  Origem: Do inglês parts per billion (partes por bilhão).  
  Ex.: Limites de metais tóxicos na água costumam vir em ppb.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 3 (parts per billion)
- **Bq (becquerel)** — Bq, MBq, kBq, becquerel, becquerels, bequerel, bequerels, megabequerel, megabecquerel  
  Unidade de atividade radioativa no SI: 1 Bq é uma desintegração por segundo. 1 MBq (megabecquerel) é um milhão de becquerels.  
  Origem: Homenagem ao físico francês Henri Becquerel, que descobriu a radioatividade em 1896.  
  Ex.: Amostra de 1 000 MBq com meia-vida de 6 h cai a 500 MBq em 6 h.  
  Fonte: BIPM, Brochura do SI (https://www.bipm.org/en/publications/si-brochure); OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 21
- **mmHg** — mmHg  
  Milímetro de mercúrio: unidade de pressão igual à exercida por uma coluna de mercúrio de 1 mm. 760 mmHg = 1 atm.  
  Origem: Hg é o símbolo do mercúrio, do latim hydrargyrum ('prata líquida', do grego).  
  Ex.: Pressão arterial 120 por 80 significa 120 e 80 mmHg.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 9
- **CFC** — CFC, CFCs, clorofluorcarboneto, clorofluorcarbonetos, clorofluorocarboneto, clorofluorocarbonetos  
  Clorofluorcarbonetos: compostos de carbono, cloro e flúor usados em aerossóis e geladeiras. Na estratosfera liberam cloro, que destrói a camada de ozônio.  
  Origem: Do inglês chlorofluorocarbon (cloro + flúor + carbono). Foram banidos pelo Protocolo de Montreal (1987).  
  Ex.: CCl2F2 (freon-12) era usado em geladeiras antigas.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 12 (catalisadores e ozônio); https://ozone.unep.org/treaties/montreal-protocol
- **IUPAC** — IUPAC  
  União Internacional de Química Pura e Aplicada: entidade que define as regras oficiais de nomenclatura, símbolos e massas atômicas.  
  Origem: Do inglês International Union of Pure and Applied Chemistry, fundada em 1919.  
  Ex.: Pela IUPAC, a acetona se chama propanona.  
  Fonte: https://iupac.org/who-we-are/
- **VSEPR** — VSEPR, RPECV  
  Teoria da repulsão dos pares de elétrons da camada de valência: os pares em torno do átomo central se afastam ao máximo, e isso define a geometria.  
  Origem: Do inglês Valence Shell Electron Pair Repulsion. Em português, RPECV.  
  Ex.: No CH4, quatro pares se afastam e formam um tetraedro.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 7.6; https://www.infoescola.com/quimica/teoria-vsepr
- **ATP** — ATP, trifosfato de adenosina, adenosina trifosfato  
  Molécula que armazena e entrega energia nas células; ao perder um fosfato (virando ADP), libera energia para o trabalho celular.  
  Origem: Do inglês Adenosine TriPhosphate (trifosfato de adenosina).  
  Ex.: A respiração celular produz ATP a partir da glicose.  
  Fonte: OpenStax Biology 2e (https://openstax.org/details/books/biology-2e), cap. 6.4
- **DNA** — DNA, ácido desoxirribonucleico  
  Ácido desoxirribonucleico: polímero que guarda a informação genética, em dupla hélice unida por ligações de hidrogênio entre as bases.  
  Origem: Do inglês DeoxyriboNucleic Acid. Em português também se usa ADN.  
  Ex.: As bases A–T fazem 2 ligações de hidrogênio; C–G fazem 3.  
  Fonte: OpenStax Biology 2e (https://openstax.org/details/books/biology-2e), cap. 3.5
- **HDL** — HDL  
  Lipoproteína de alta densidade: leva o colesterol dos tecidos de volta ao fígado. Por isso é chamada de 'colesterol bom'.  
  Origem: Do inglês High-Density Lipoprotein (lipoproteína de alta densidade).  
  Ex.: Gorduras insaturadas ajudam a manter o HDL alto.  
  Fonte: MedlinePlus (https://medlineplus.gov/hdlthegoodcholesterol.html)
- **LDL** — LDL  
  Lipoproteína de baixa densidade: leva colesterol do fígado aos tecidos; em excesso, deposita-se na parede das artérias. É o 'colesterol ruim'.  
  Origem: Do inglês Low-Density Lipoprotein (lipoproteína de baixa densidade).  
  Ex.: LDL alto aumenta o risco de aterosclerose e infarto.  
  Fonte: MedlinePlus (https://medlineplus.gov/ldlthebadcholesterol.html)
- **PVC** — PVC, policloreto de vinila, poli(cloreto de vinila)  
  Policloreto de vinila: polímero de adição feito do monômero cloreto de vinila (CH2=CHCl). Usado em canos, fios e embalagens.  
  Origem: Do inglês PolyVinyl Chloride (poli(cloreto de vinila)).  
  Ex.: Os canos brancos de água em casa são de PVC (código de reciclagem 3).  
  Fonte: OpenStax Organic Chemistry (https://openstax.org/details/books/organic-chemistry), cap. 31 (Synthetic Polymers)
- **PET** — PET, politereftalato de etileno, poli(tereftalato de etileno)  
  Politereftalato de etileno: poliéster de condensação feito de ácido tereftálico e etilenoglicol. Usado em garrafas de refrigerante.  
  Origem: Do inglês PolyEthylene Terephthalate (poli(tereftalato de etileno)).  
  Ex.: Garrafa PET tem o código de reciclagem 1.  
  Fonte: OpenStax Organic Chemistry (https://openstax.org/details/books/organic-chemistry), cap. 31 (Synthetic Polymers)
- **PEAD** — PEAD  
  Polietileno de alta densidade: polietileno de cadeias pouco ramificadas, mais rígido. Usado em frascos de produtos de limpeza e engradados.  
  Origem: Sigla em português (polietileno de alta densidade). Em inglês, HDPE (High-Density PolyEthylene).  
  Ex.: Código de reciclagem 2.  
  Fonte: OpenStax Organic Chemistry (https://openstax.org/details/books/organic-chemistry), cap. 31; Nomenclatura do ensino médio brasileiro (Feltre, Química, vols. 1–3; Usberco & Salvador, Química)
- **PEBD** — PEBD  
  Polietileno de baixa densidade: polietileno de cadeias muito ramificadas, mais flexível. Usado em sacolas e filmes plásticos.  
  Origem: Sigla em português (polietileno de baixa densidade). Em inglês, LDPE (Low-Density PolyEthylene).  
  Ex.: Código de reciclagem 4.  
  Fonte: OpenStax Organic Chemistry (https://openstax.org/details/books/organic-chemistry), cap. 31; Nomenclatura do ensino médio brasileiro (Feltre, Química, vols. 1–3; Usberco & Salvador, Química)
- **PP** — PP, polipropileno  
  Polipropileno: polímero de adição do propeno. Usado em potes, seringas e para-choques.  
  Origem: Do inglês PolyPropylene (polipropileno).  
  Ex.: Código de reciclagem 5.  
  Fonte: OpenStax Organic Chemistry (https://openstax.org/details/books/organic-chemistry), cap. 31
- **PS** — PS, poliestireno  
  Poliestireno: polímero de adição do estireno (vinilbenzeno). Expandido, vira o isopor; também forma copos descartáveis rígidos.  
  Origem: Do inglês PolyStyrene (poliestireno).  
  Ex.: Código de reciclagem 6.  
  Fonte: OpenStax Organic Chemistry (https://openstax.org/details/books/organic-chemistry), cap. 31
- **PVA** — PVA, poli(álcool vinílico), poliálcool vinílico  
  Poli(álcool vinílico): polímero com muitas hidroxilas, solúvel em água. É obtido pela hidrólise do PVAc, porque o álcool vinílico não é estável.  
  Origem: Do inglês PolyVinyl Alcohol (poli(álcool vinílico)).  
  Ex.: PVAc + água → PVA + ácido acético.  
  Fonte: OpenStax Organic Chemistry (https://openstax.org/details/books/organic-chemistry), cap. 31; PubChem (https://pubchem.ncbi.nlm.nih.gov/compound/Polyvinyl-alcohol)
- **PVAc** — PVAc, poli(acetato de vinila), poliacetato de vinila  
  Poli(acetato de vinila): polímero de adição do acetato de vinila, com grupos éster na cadeia. É a base da cola branca.  
  Origem: Do inglês PolyVinyl Acetate (poli(acetato de vinila)).  
  Ex.: A hidrólise do PVAc gera PVA e ácido acético.  
  Fonte: OpenStax Organic Chemistry (https://openstax.org/details/books/organic-chemistry), cap. 31
- **PTFE (teflon)** — PTFE, teflon, Teflon, politetrafluoroetileno  
  Politetrafluoroetileno: polímero de adição do tetrafluoroeteno (CF2=CF2). Muito resistente ao calor e antiaderente.  
  Origem: Do inglês PolyTetraFluoroEthylene. Teflon é o nome comercial (marca registrada).  
  Ex.: Revestimento de panelas antiaderentes.  
  Fonte: OpenStax Organic Chemistry (https://openstax.org/details/books/organic-chemistry), cap. 31
- **PABA** — PABA, ácido para-aminobenzoico, ácido p-aminobenzoico, ácido 4-aminobenzoico  
  Ácido para-aminobenzoico: tem um grupo amino e uma carboxila em lados opostos do anel benzênico. Ele e seus ésteres foram usados como filtro solar UVB.  
  Origem: Do inglês Para-AminoBenzoic Acid (ácido para-aminobenzoico).  
  Ex.: O octildimetilPABA é um éster do PABA usado em protetores solares.  
  Fonte: PubChem (https://pubchem.ncbi.nlm.nih.gov/compound/4-Aminobenzoic-acid)
- **DEET** — DEET  
  N,N-dietil-meta-toluamida: repelente de insetos mais comum, uma amida aromática de fórmula C12H17NO.  
  Origem: Das iniciais de N,N-DiEthyl-meta-Toluamide (inglês).  
  Ex.: Muitos repelentes de farmácia trazem DEET no rótulo.  
  Fonte: PubChem (https://pubchem.ncbi.nlm.nih.gov/compound/DEET); https://wwwn.cdc.gov/TSP/Substances/ToxSubstance.aspx?toxid=201
- **BMDM (avobenzona)** — BMDM, avobenzona  
  Butil metoxidibenzoilmetano (avobenzona): filtro solar que absorve UVA. Tem duas carbonilas separadas por um CH2, o que permite tautomeria ceto-enólica.  
  Origem: Do inglês Butyl MethoxyDibenzoylMethane. Fórmula C20H22O3 (310 g/mol).  
  Fonte: https://chemicalbook.com/CASEN_70356-09-1.htm; PubChem (https://pubchem.ncbi.nlm.nih.gov/compound/Avobenzone)
- **DDT** — DDT  
  Diclorodifeniltricloroetano: inseticida organoclorado (C14H9Cl5) muito persistente, que se acumula ao longo da cadeia alimentar. Hoje é proibido no Brasil.  
  Origem: Do nome químico DicloroDifenilTricloroetano (em inglês, DichloroDiphenylTrichloroethane).  
  Ex.: Aves predadoras contaminadas com DDT punham ovos de casca fina.  
  Fonte: PubChem (https://pubchem.ncbi.nlm.nih.gov/compound/DDT)
- **THC** — THC, tetra-hidrocanabinol, tetraidrocanabinol  
  Tetra-hidrocanabinol: principal substância psicoativa da maconha (Cannabis). Na estrutura tem as funções fenol e éter.  
  Origem: Do inglês TetraHydroCannabinol (tetra-hidrocanabinol).  
  Fonte: PubChem (https://pubchem.ncbi.nlm.nih.gov/compound/Dronabinol)
- **QAV** — QAV, querosene de aviação  
  Querosene de aviação: combustível de jatos, fração do petróleo formada por hidrocarbonetos de cerca de 9 a 16 carbonos.  
  Origem: Sigla em português usada pela ANP: querosene de aviação. Em inglês, jet fuel (Jet A-1).  
  Ex.: Nas questões, costuma ser representado por C12H26.  
  Fonte: ANP, Anuário Estatístico (https://www.gov.br/anp/pt-br/centrais-de-conteudo/dados-abertos/arquivos/anuario-estatistico-2025/secao-3/anuario-abertos-metadados-tabela3-26.docx)
- **UV (UVA, UVB, UVC)** — UV, UVA, UVB, UVC, ultravioleta  
  Radiação ultravioleta, de comprimento de onda menor e energia maior que a luz visível. UVC: 100–280 nm; UVB: 280–315 nm; UVA: 315–400 nm.  
  Origem: UV = ultravioleta, 'além do violeta'. Alguns livros põem o limite UVA/UVB em 320 nm.  
  Ex.: O UVB é o principal causador de queimaduras solares.  
  Fonte: OMS (https://www.who.int/health-topics/ultraviolet-radiation)
- **estequiometria** — estequiometria, estequiométrico, estequiométrica, estequiométricos, estequiométricas, cálculo estequiométrico  
  Cálculo das quantidades (massa, mols, volume) de reagentes e produtos a partir da proporção dada pelos coeficientes da equação balanceada.  
  Origem: Do grego stoicheion (elemento) + metron (medida).  
  Ex.: 2 H2 + O2 → 2 H2O: 4 g de H2 formam 36 g de água.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 4
- **reagente limitante** — reagente limitante, reagentes limitantes  
  Reagente que acaba primeiro na reação e por isso define quanto produto se forma. O outro reagente sobra (fica em excesso).  
  Ex.: Com 3 mol de H2 e 3 mol de O2, o H2 limita: sobra 1,5 mol de O2.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 4.4
- **massa molar** — massa molar, massas molares  
  Massa de 1 mol de uma substância, em g/mol. É numericamente igual à massa da molécula em u.  
  Ex.: H2O: 2 × 1 + 16 = 18 g/mol.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 3.1
- **quantidade de matéria** — quantidade de matéria, quantidades de matéria  
  Grandeza medida em mol: conta as partículas em pacotes de 6,02 × 10²³. Símbolo n; n = massa ÷ massa molar.  
  Ex.: 36 g de água ÷ 18 g/mol = 2 mol.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 3.1
- **constante de Avogadro** — constante de Avogadro, número de Avogadro  
  Número de partículas em 1 mol: cerca de 6,02 × 10²³ por mol.  
  Origem: Homenagem ao italiano Amedeo Avogadro, que em 1811 propôs que volumes iguais de gases têm o mesmo número de moléculas.  
  Ex.: 1 mol de ferro tem 6,02 × 10²³ átomos.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 3.1; BIPM, Brochura do SI
- **volume molar** — volume molar  
  Volume ocupado por 1 mol de gás: 22,4 L nas CNTP (0 °C, 1 atm) e cerca de 24,5 L a 25 °C e 1 atm.  
  Ex.: 0,5 mol de CO2 nas CNTP ocupa 11,2 L.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 9.3
- **fórmula mínima** — fórmula mínima, fórmulas mínimas, fórmula empírica  
  Menor proporção de números inteiros entre os átomos de um composto.  
  Ex.: A glicose, C6H12O6, tem fórmula mínima CH2O.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 3.2 (empirical formula)
- **molalidade** — molalidade  
  Concentração em mols de soluto por quilograma de solvente (mol/kg). Não muda com a temperatura, porque não depende de volume.  
  Ex.: 1 mol de glicose em 1 kg de água: 1 mol/kg.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 11.4 (molality)
- **cátodo** — cátodo, cátodos, catodo, catodos  
  Eletrodo onde ocorre a redução (ganho de elétrons). Na pilha é o polo positivo; na eletrólise, o polo negativo.  
  Origem: Do grego kata (para baixo) + hodos (caminho); termo criado por Faraday e Whewell em 1834.  
  Ex.: Na pilha de Daniell, o cobre é o cátodo.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 17.2
- **ânodo** — ânodo, ânodos, anodo, anodos  
  Eletrodo onde ocorre a oxidação (perda de elétrons). Na pilha é o polo negativo; na eletrólise, o polo positivo.  
  Origem: Do grego ana (para cima) + hodos (caminho); termo criado por Faraday e Whewell em 1834.  
  Ex.: Na pilha de Daniell, o zinco é o ânodo e se desgasta.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 17.2
- **semirreação** — semirreação, semirreações, semi-reação, semi-reações  
  Metade de uma oxirredução escrita à parte: só a oxidação ou só a redução, mostrando os elétrons envolvidos.  
  Ex.: Zn → Zn²⁺ + 2 e⁻ é a semirreação de oxidação.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 17.1
- **eletrólise** — eletrólise, eletrólises  
  Reação de oxirredução não espontânea forçada por corrente elétrica de uma fonte externa, em substância fundida (ígnea) ou dissolvida (aquosa).  
  Origem: Do grego elektron (âmbar, origem de 'elétrico') + lysis (quebra).  
  Ex.: A eletrólise da salmoura produz cloro, hidrogênio e soda cáustica.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 17.7
- **constante de Faraday** — constante de Faraday  
  Carga elétrica de 1 mol de elétrons: cerca de 96 500 C/mol (96 485 C/mol).  
  Origem: Homenagem ao britânico Michael Faraday, que formulou as leis da eletrólise.  
  Ex.: Depositar 1 mol de Cu (2 e⁻) exige 2 × 96 500 C.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 17.7
- **agente oxidante** — agente oxidante, agentes oxidantes, oxidante, oxidantes  
  Espécie que provoca a oxidação da outra; para isso recebe elétrons e se reduz (seu nox diminui).  
  Ex.: Em Zn + Cu²⁺ → Zn²⁺ + Cu, o Cu²⁺ é o agente oxidante.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 4.2
- **agente redutor** — agente redutor, agentes redutores, redutor, redutores  
  Espécie que provoca a redução da outra; para isso perde elétrons e se oxida (seu nox aumenta).  
  Ex.: Em Zn + Cu²⁺ → Zn²⁺ + Cu, o Zn é o agente redutor.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 4.2
- **oxirredução** — oxirredução, oxirreduções, redox, óxido-redução, oxidorredução  
  Reação com transferência de elétrons: uma espécie se oxida (perde elétrons) e outra se reduz (ganha). Os nox mudam.  
  Origem: Também chamada redox, do inglês reduction + oxidation.  
  Ex.: A ferrugem (Fe → Fe2O3) é uma oxirredução.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 4.2
- **metal de sacrifício** — metal de sacrifício, metais de sacrifício, ânodo de sacrifício, eletrodo de sacrifício  
  Metal mais reativo (menor potencial de redução) ligado a outro para se oxidar no lugar dele, protegendo-o da corrosão.  
  Ex.: Blocos de magnésio ou zinco protegem cascos de navio de aço.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 17.6 (sacrificial anode)
- **galvanização** — galvanização, galvanizado, galvanizada, galvanizados  
  Revestimento de ferro ou aço com zinco. Mesmo se riscado, protege: o zinco, mais reativo, se oxida antes do ferro.  
  Origem: Homenagem ao italiano Luigi Galvani, pioneiro da eletricidade em seres vivos.  
  Ex.: Calhas e pregos galvanizados não enferrujam fácil.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 17.6
- **catalisador** — catalisador, catalisadores, catálise  
  Substância que acelera a reação ao diminuir a energia de ativação (abre outro caminho) e sai intacta no final. Não altera o ΔH nem a posição do equilíbrio.  
  Origem: Do grego katalysis (dissolução, desligamento); termo criado por Berzelius em 1835.  
  Ex.: As enzimas são catalisadores biológicos.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 12.7
- **energia de ativação** — energia de ativação, energias de ativação  
  Energia mínima que os reagentes precisam absorver para chegar ao complexo ativado e a reação acontecer.  
  Ex.: O fósforo do palito só acende após o atrito fornecer a energia de ativação.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 12.5
- **complexo ativado** — complexo ativado, complexos ativados, estado de transição  
  Estrutura instável, de energia máxima, no meio do caminho da reação: as ligações antigas estão se rompendo enquanto as novas se formam.  
  Ex.: No gráfico de energia, é o topo da curva.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 12.5
- **lei de velocidade** — lei de velocidade, leis de velocidade, lei cinética  
  Equação v = k·[A]ˣ·[B]ʸ. Os expoentes (ordens) vêm de experimentos e só coincidem com os coeficientes em reações elementares.  
  Ex.: Se dobrar [A] quadruplica v, a ordem em A é 2.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 12.3
- **meia-vida** — meia-vida, meias-vidas, período de semidesintegração  
  Tempo para a quantidade (ou a atividade) de uma amostra cair à metade. Em radioatividade, é constante para cada isótopo.  
  Ex.: Iodo-131 tem meia-vida de cerca de 8 dias: 100 g viram 25 g em 16 dias.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 21.3
- **radioisótopo** — radioisótopo, radioisótopos, isótopo radioativo, isótopos radioativos  
  Isótopo de núcleo instável, que emite radiação ao se desintegrar. Usado em medicina para diagnóstico e tratamento.  
  Ex.: O iodo-131 é usado no tratamento da tireoide.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 21.3 e 21.6
- **partícula alfa** — partícula alfa, partículas alfa, radiação alfa, emissão alfa, decaimento alfa  
  Núcleo de hélio (2 prótons + 2 nêutrons), de carga +2 e massa 4. Ao emiti-la, o núcleo perde 4 no número de massa e 2 no atômico.  
  Origem: Nome dado por Rutherford, com a primeira letra grega, por ser a radiação menos penetrante que ele separou.  
  Ex.: ²³⁸U emite alfa e vira ²³⁴Th.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 21.3
- **partícula beta** — partícula beta, partículas beta, radiação beta, emissão beta, decaimento beta, beta menos  
  Elétron emitido pelo núcleo quando um nêutron vira próton. O número atômico sobe 1 e o número de massa não muda.  
  Origem: Nome dado por Rutherford, com a segunda letra grega, por ser mais penetrante que a alfa.  
  Ex.: ¹⁴C emite beta e vira ¹⁴N.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 21.3
- **radiação gama** — radiação gama, raios gama, emissão gama  
  Onda eletromagnética de altíssima energia emitida pelo núcleo. Sem massa e sem carga, não altera Z nem A, mas é a mais penetrante.  
  Origem: Gama, terceira letra grega, seguindo alfa e beta.  
  Ex.: É usada para esterilizar materiais hospitalares.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 21.3
- **pósitron** — pósitron, pósitrons, positron, positrons, pósitrão  
  Antipartícula do elétron: mesma massa e carga +1. É emitido quando um próton do núcleo vira nêutron (Z cai 1, A não muda).  
  Origem: Do inglês positive + electron (elétron positivo).  
  Ex.: O exame PET-CT detecta pósitrons emitidos pelo flúor-18.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 21.3
- **fissão nuclear** — fissão nuclear, fissão  
  Quebra de um núcleo pesado, como o urânio-235, em dois núcleos menores, liberando nêutrons e muita energia.  
  Origem: Do latim fissio (fenda, divisão).  
  Ex.: É a reação das usinas nucleares de Angra.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 21.4
- **isótopo** — isótopo, isótopos, isotopia  
  Átomos do mesmo elemento (mesmo número de prótons) com número de nêutrons e, portanto, de massa diferentes.  
  Origem: Do grego isos (igual) + topos (lugar): ocupam o mesmo lugar na tabela; termo de Frederick Soddy (1913).  
  Ex.: ¹²C, ¹³C e ¹⁴C são isótopos do carbono.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 2.3
- **isóbaro** — isóbaro, isóbaros, isobaria  
  Átomos de elementos diferentes com o mesmo número de massa (A).  
  Origem: Do grego isos (igual) + barys (pesado): mesmo 'peso'.  
  Ex.: ⁴⁰K e ⁴⁰Ca são isóbaros.  
  Fonte: Nomenclatura do ensino médio brasileiro (Feltre, Química, vols. 1–3; Usberco & Salvador, Química); IUPAC Gold Book (https://goldbook.iupac.org)
- **isótono** — isótono, isótonos, isotonia  
  Átomos de elementos diferentes com o mesmo número de nêutrons.  
  Origem: Criado trocando o p de isótopo (próton) por n (nêutron): isóto-n-o.  
  Ex.: ³⁷Cl e ⁴⁰Ca têm 20 nêutrons cada: são isótonos.  
  Fonte: Nomenclatura do ensino médio brasileiro (Feltre, Química, vols. 1–3; Usberco & Salvador, Química); IUPAC Gold Book (https://goldbook.iupac.org)
- **isoeletrônico** — isoeletrônico, isoeletrônicos, isoeletrônica, isoeletrônicas  
  Espécies (átomos ou íons) que têm o mesmo número de elétrons.  
  Ex.: Na⁺, Ne e F⁻ têm 10 elétrons cada.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 6.5
- **eletronegatividade** — eletronegatividade, eletronegatividades, eletronegativo, eletronegativa, eletronegativos, eletronegativas  
  Tendência de um átomo atrair para si os elétrons de uma ligação. Cresce para a direita e para cima na tabela; o flúor é o mais eletronegativo.  
  Ex.: Na ligação H–Cl, os elétrons ficam mais perto do cloro.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 7.2
- **energia de ionização** — energia de ionização, energias de ionização, potencial de ionização  
  Energia necessária para arrancar um elétron de um átomo isolado no estado gasoso. Cresce para a direita e para cima na tabela.  
  Ex.: Os gases nobres têm as maiores energias de ionização do seu período.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 6.5
- **afinidade eletrônica** — afinidade eletrônica, afinidades eletrônicas, eletroafinidade  
  Energia liberada quando um átomo isolado, no estado gasoso, recebe um elétron. Costuma ser alta nos halogênios.  
  Ex.: O cloro libera muita energia ao virar Cl⁻.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 6.5
- **subnível** — subnível, subníveis, subcamada, subcamadas  
  Divisão de uma camada eletrônica em s, p, d e f, que comportam no máximo 2, 6, 10 e 14 elétrons.  
  Origem: As letras vêm do inglês da espectroscopia: sharp, principal, diffuse e fundamental.  
  Ex.: O subnível 3d comporta até 10 elétrons.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 6.3
- **orbital** — orbital, orbitais  
  Região ao redor do núcleo onde é mais provável encontrar um elétron. Cada orbital comporta no máximo 2 elétrons, de spins opostos.  
  Ex.: O subnível p tem 3 orbitais, logo até 6 elétrons.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 6.3
- **diagrama de Linus Pauling** — diagrama de Linus Pauling, diagrama de Pauling, diagrama de energia de Pauling  
  Esquema de diagonais que dá a ordem de preenchimento dos subníveis por energia: 1s 2s 2p 3s 3p 4s 3d 4p 5s...  
  Origem: Nome usado no Brasil; fora daqui a mesma ordem é chamada regra de Madelung ou princípio de Aufbau.  
  Ex.: Por ele, o 4s é preenchido antes do 3d.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 6.4; Nomenclatura do ensino médio brasileiro (Feltre, Química, vols. 1–3; Usberco & Salvador, Química)
- **par isolado** — par isolado, pares isolados, par não ligante, pares não ligantes, par de elétrons livre, pares de elétrons livres  
  Par de elétrons da camada de valência que não participa de ligação. Ocupa espaço e muda a geometria da molécula.  
  Ex.: Os 2 pares isolados do oxigênio deixam a água angular.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 7.6
- **hibridização** — hibridização, hibridizações, hibridação, hibridizado, hibridizados  
  Mistura de orbitais s e p (às vezes d) de um átomo, formando orbitais iguais para ligar: sp³ (tetraédrico), sp² (trigonal) e sp (linear).  
  Ex.: No metano, o carbono é sp³.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 8.2
- **ligação sigma** — ligação sigma, ligações sigma, ligação σ, ligações σ  
  Ligação covalente formada pela sobreposição frontal de orbitais, no eixo entre os núcleos. Toda ligação simples é sigma.  
  Origem: σ é o 's' grego, em analogia com o orbital s.  
  Ex.: A ligação dupla C=C tem 1 sigma e 1 pi.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 8.1
- **ligação pi** — ligação pi, ligações pi, ligação π, ligações π  
  Ligação covalente pela sobreposição lateral de orbitais p, acima e abaixo do eixo. Aparece na dupla (1 pi) e na tripla (2 pi).  
  Origem: π é o 'p' grego, em analogia com o orbital p.  
  Ex.: A tripla do etino tem 1 sigma e 2 pi.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 8.1
- **ligação de hidrogênio** — ligação de hidrogênio, ligações de hidrogênio, ponte de hidrogênio, pontes de hidrogênio  
  Atração forte entre um H ligado a F, O ou N e um par de elétrons de F, O ou N de outra molécula. Eleva muito o ponto de ebulição.  
  Ex.: Por ela, a água ferve a 100 °C, e o H2S, a cerca de −60 °C.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 10.1
- **dipolo-dipolo** — dipolo-dipolo, dipolo permanente, dipolos permanentes  
  Atração entre moléculas polares: o polo positivo de uma molécula atrai o polo negativo da vizinha.  
  Ex.: Ocorre entre moléculas de HCl.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 10.1
- **dispersão de London (dipolo induzido)** — dipolo induzido, dipolos induzidos, dispersão de London, forças de London, forças de dispersão  
  Atração fraca entre moléculas apolares: um dipolo momentâneo numa molécula induz outro na vizinha. Cresce com o tamanho da molécula.  
  Origem: Homenagem ao físico alemão Fritz London, que explicou essa força em 1930.  
  Ex.: Mantém unidas as moléculas de I2 no sólido.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 10.1
- **forças de van der Waals** — van der Waals, Van der Waals  
  Nome geral das interações intermoleculares fracas (dipolo-dipolo e dipolo induzido). Alguns livros chamam assim só a dispersão de London.  
  Origem: Homenagem ao físico holandês Johannes van der Waals, Nobel de Física de 1910.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 10.1; IUPAC Gold Book (https://goldbook.iupac.org)
- **alotropia** — alotropia, alótropo, alótropos, alotrópica, alotrópicas, variedade alotrópica, variedades alotrópicas  
  Fenômeno em que um mesmo elemento forma substâncias simples diferentes, com propriedades diferentes.  
  Origem: Do grego allos (outro) + tropos (modo): outro modo de ser; termo de Berzelius.  
  Ex.: Grafite e diamante (carbono); O2 e O3 (oxigênio).  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 18; IUPAC Gold Book (https://goldbook.iupac.org)
- **halogênio** — halogênio, halogênios  
  Elementos do grupo 17: F, Cl, Br, I e At. Ganham 1 elétron e formam ânions −1.  
  Origem: Do grego hals (sal) + genes (que gera): formadores de sal.  
  Ex.: Cloro + sódio formam NaCl, o sal de cozinha.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 18.11
- **calcogênio** — calcogênio, calcogênios  
  Elementos do grupo 16: O, S, Se, Te e Po. Têm 6 elétrons na camada de valência.  
  Origem: Do grego chalkos (cobre, minério) + genes (que gera): formadores de minérios.  
  Ex.: Oxigênio e enxofre são calcogênios.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 18.9; IUPAC Gold Book (https://goldbook.iupac.org)
- **entalpia** — entalpia, entalpias  
  Conteúdo de energia de um sistema, medido como calor a pressão constante; símbolo H. Na prática, mede-se só a variação, ΔH.  
  Origem: Do grego enthalpein (aquecer por dentro); termo atribuído a Heike Kamerlingh Onnes.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 5.3
- **exotérmica** — exotérmica, exotérmicas, exotérmico, exotérmicos  
  Reação ou processo que libera calor para o ambiente; ΔH negativo.  
  Origem: Do grego exo (para fora) + thermos (calor).  
  Ex.: Combustões e a condensação do vapor são exotérmicas.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 5.1
- **endotérmica** — endotérmica, endotérmicas, endotérmico, endotérmicos  
  Reação ou processo que absorve calor do ambiente; ΔH positivo.  
  Origem: Do grego endon (para dentro) + thermos (calor).  
  Ex.: A fusão do gelo e a fotossíntese são endotérmicas.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 5.1
- **lei de Hess** — lei de Hess  
  O ΔH de uma reação depende só dos estados inicial e final, não do caminho. Por isso dá para somar equações e somar seus ΔH.  
  Origem: Homenagem ao químico suíço-russo Germain Hess, que a enunciou em 1840.  
  Ex.: Invertendo uma equação, troca-se o sinal do ΔH.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 5.3
- **entalpia de formação** — entalpia de formação, entalpias de formação, entalpia-padrão de formação, entalpias-padrão de formação, calor de formação  
  ΔH da formação de 1 mol de uma substância a partir de substâncias simples no estado-padrão. Substância simples no estado-padrão vale zero.  
  Ex.: ΔHf do CO2 = −394 kJ/mol; do O2 = 0.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 5.3
- **entalpia de combustão** — entalpia de combustão, entalpias de combustão, calor de combustão  
  ΔH da queima completa de 1 mol de uma substância em gás oxigênio. É sempre negativo (libera calor).  
  Ex.: Etanol: cerca de −1 368 kJ/mol.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 5.3
- **poder calorífico** — poder calorífico, poderes caloríficos  
  Energia liberada na queima de uma unidade de massa (ou volume) de combustível, como kJ/g ou kcal/kg.  
  Ex.: O hidrogênio tem o maior poder calorífico por grama.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 5.3; Nomenclatura do ensino médio brasileiro (Feltre, Química, vols. 1–3; Usberco & Salvador, Química)
- **estado-padrão** — estado-padrão, estado padrão, estados-padrão  
  Forma mais estável de uma substância a 25 °C e 1 atm (ou 1 bar), usada como referência para entalpias.  
  Ex.: Carbono no estado-padrão é grafite, não diamante.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 5.3
- **princípio de Le Chatelier** — Le Chatelier, Le Châtelier  
  Quando um equilíbrio é perturbado (concentração, pressão ou temperatura), ele se desloca no sentido de diminuir a perturbação.  
  Origem: Homenagem ao químico francês Henry Le Chatelier, que o enunciou em 1884.  
  Ex.: Adicionar reagente desloca o equilíbrio para os produtos.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 13.3
- **grau de ionização** — grau de ionização, graus de ionização  
  Fração das moléculas dissolvidas que se ionizam: α = ionizadas ÷ dissolvidas. Ácido forte tem α alto.  
  Ex.: Se 2 de cada 100 moléculas se ionizam, α = 2%.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 14.3 (percent ionization)
- **lei de diluição de Ostwald** — lei de Ostwald, lei da diluição de Ostwald, lei de diluição de Ostwald, diluição de Ostwald  
  Relaciona constante de ionização, concentração e grau de ionização: Ka = α²·M (para α pequeno). Diluindo, o α aumenta.  
  Origem: Homenagem ao químico alemão Wilhelm Ostwald (Nobel de 1909).  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 14.3; Nomenclatura do ensino médio brasileiro (Feltre, Química, vols. 1–3; Usberco & Salvador, Química)
- **hidrólise** — hidrólise, hidrólises, hidrolisa, hidrolisar, hidrolisado  
  Quebra de uma substância pela reação com a água. Na hidrólise salina, íons do sal reagem com a água e mudam o pH.  
  Origem: Do grego hydor (água) + lysis (quebra).  
  Ex.: Acetato de sódio deixa a água básica por hidrólise.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 14.4
- **solução tampão** — solução tampão, solução-tampão, soluções tampão, soluções-tampão, tampão, tampões, sistema tampão  
  Solução que resiste a mudanças de pH ao receber pouco ácido ou base. É feita de ácido fraco e seu sal (ou base fraca e seu sal).  
  Ex.: O par H2CO3/HCO3⁻ mantém o pH do sangue perto de 7,4.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 14.6
- **coeficiente de solubilidade** — coeficiente de solubilidade, coeficientes de solubilidade  
  Quantidade máxima de soluto que se dissolve numa quantidade fixa de solvente (geralmente 100 g de água) a dada temperatura.  
  Ex.: NaCl: cerca de 36 g por 100 g de água a 20 °C.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 11.3
- **corpo de fundo** — corpo de fundo, corpo de chão  
  Excesso de soluto que não se dissolve e fica depositado no fundo de uma solução saturada.  
  Ex.: Açúcar demais no café: o que sobra no fundo é corpo de fundo.  
  Fonte: Nomenclatura do ensino médio brasileiro (Feltre, Química, vols. 1–3; Usberco & Salvador, Química)
- **supersaturada** — supersaturada, supersaturadas, supersaturado, supersaturação  
  Solução com mais soluto dissolvido do que o coeficiente de solubilidade permite. É instável: qualquer perturbação precipita o excesso.  
  Ex.: Bolsas térmicas de acetato de sódio cristalizam ao serem dobradas.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 11.3
- **titulação** — titulação, titulações, titulante  
  Técnica que mede a concentração de uma solução reagindo-a com outra de concentração conhecida, medindo o volume gasto até a reação se completar.  
  Origem: Do francês titrer: determinar o título (teor) de uma solução.  
  Ex.: Titula-se vinagre com NaOH, usando fenolftaleína.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 4.5 e 14.7
- **fenolftaleína** — fenolftaleína  
  Indicador ácido-base incolor em meio ácido e neutro e rosa em meio básico; muda de cor por volta de pH 8,2 a 10.  
  Ex.: Gotas de fenolftaleína ficam rosa em água com sabão.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 14.7; PubChem (https://pubchem.ncbi.nlm.nih.gov/compound/Phenolphthalein)
- **propriedade coligativa** — propriedade coligativa, propriedades coligativas, efeito coligativo, efeitos coligativos  
  Propriedade de uma solução que depende só do número de partículas de soluto dissolvidas, não da natureza delas.  
  Origem: Do latim colligatus (ligado em conjunto).  
  Ex.: 1 mol de NaCl gera 2 mol de partículas: efeito dobrado.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 11.4
- **tonoscopia** — tonoscopia, tonometria  
  Abaixamento da pressão de vapor de um solvente quando se dissolve nele um soluto não volátil.  
  Origem: Do grego tonos (tensão, aqui a pressão de vapor) + skopein (observar).  
  Ex.: Água com açúcar evapora mais devagar que água pura.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 11.4; Nomenclatura do ensino médio brasileiro (Feltre, Química, vols. 1–3; Usberco & Salvador, Química)
- **ebulioscopia** — ebulioscopia, ebuliometria  
  Aumento da temperatura de ebulição de um solvente quando se dissolve nele um soluto não volátil.  
  Origem: Do latim ebullire (ferver) + grego skopein (observar).  
  Ex.: Água com sal ferve um pouco acima de 100 °C.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 11.4; Nomenclatura do ensino médio brasileiro (Feltre, Química, vols. 1–3; Usberco & Salvador, Química)
- **crioscopia** — crioscopia, criometria  
  Abaixamento da temperatura de congelamento de um solvente quando se dissolve nele um soluto.  
  Origem: Do grego kryos (frio) + skopein (observar).  
  Ex.: Joga-se sal nas estradas com neve para o gelo derreter.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 11.4; Nomenclatura do ensino médio brasileiro (Feltre, Química, vols. 1–3; Usberco & Salvador, Química)
- **osmose** — osmose  
  Passagem de solvente por uma membrana semipermeável, do meio menos concentrado para o mais concentrado.  
  Origem: Do grego osmos (impulso, empurrão).  
  Ex.: Salada temperada murcha porque as folhas perdem água por osmose.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 11.4
- **pressão osmótica** — pressão osmótica, pressões osmóticas  
  Pressão que precisa ser aplicada sobre a solução mais concentrada para impedir a osmose. π = M·R·T·i.  
  Ex.: Na osmose reversa, aplica-se pressão maior que a osmótica para dessalinizar água.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 11.4
- **isotônico** — isotônico, isotônica, isotônicos, isotônicas  
  Solução com a mesma pressão osmótica (mesma concentração de partículas) que outra. Célula nela não ganha nem perde água.  
  Origem: Do grego isos (igual) + tonos (tensão).  
  Ex.: O soro fisiológico (NaCl 0,9%) é isotônico ao sangue.  
  Fonte: OpenStax Biology 2e (https://openstax.org/details/books/biology-2e), cap. 5.2
- **hipertônico** — hipertônico, hipertônica, hipertônicos, hipertônicas  
  Solução com pressão osmótica maior que a de outra. Uma célula colocada nela perde água e murcha.  
  Origem: Do grego hyper (acima) + tonos (tensão).  
  Ex.: Hemácias em água muito salgada murcham.  
  Fonte: OpenStax Biology 2e (https://openstax.org/details/books/biology-2e), cap. 5.2
- **hipotônico** — hipotônico, hipotônica, hipotônicos, hipotônicas  
  Solução com pressão osmótica menor que a de outra. Uma célula colocada nela ganha água e incha, podendo estourar.  
  Origem: Do grego hypo (abaixo) + tonos (tensão).  
  Ex.: Hemácias em água pura incham e sofrem hemólise.  
  Fonte: OpenStax Biology 2e (https://openstax.org/details/books/biology-2e), cap. 5.2
- **pressão de vapor** — pressão de vapor, pressões de vapor, pressão máxima de vapor  
  Pressão do vapor de um líquido em equilíbrio com o próprio líquido, num recipiente fechado. Quanto maior, mais volátil o líquido.  
  Ex.: O líquido ferve quando sua pressão de vapor iguala a pressão externa.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 10.3
- **pressão parcial** — pressão parcial, pressões parciais, lei de Dalton  
  Pressão que um gás de uma mistura exerceria se estivesse sozinho no mesmo volume. A soma das parciais dá a pressão total (lei de Dalton).  
  Ex.: Ar a 1 atm com 21% de O2: pressão parcial de O2 = 0,21 atm.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 9.3
- **equação de Clapeyron** — equação de Clapeyron, equação dos gases ideais, equação de estado dos gases  
  Equação dos gases ideais: PV = nRT, com R = 0,082 atm·L/(mol·K) ou 8,31 J/(mol·K). A temperatura sempre em kelvin.  
  Origem: Homenagem ao engenheiro francês Émile Clapeyron, que a formulou em 1834.  
  Ex.: 1 mol a 273 K e 1 atm: V = 22,4 L.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 9.2
- **isotérmica** — isotérmica, isotérmicas, isotérmico, transformação isotérmica  
  Transformação de um gás a temperatura constante: pressão e volume são inversamente proporcionais (P·V constante, lei de Boyle).  
  Origem: Do grego isos (igual) + thermos (calor).  
  Ex.: Dobrando a pressão, o volume cai à metade.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 9.2
- **isobárica** — isobárica, isobáricas, isobárico, transformação isobárica  
  Transformação de um gás a pressão constante: volume e temperatura absoluta são proporcionais (V/T constante, lei de Charles).  
  Origem: Do grego isos (igual) + baros (peso, pressão).  
  Ex.: Dobrando a temperatura em kelvin, o volume dobra.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 9.2
- **isocórica** — isocórica, isocóricas, isocórico, isovolumétrica, isovolumétricas, isovolumétrico, transformação isocórica  
  Transformação de um gás a volume constante: pressão e temperatura absoluta são proporcionais (P/T constante).  
  Origem: Do grego isos (igual) + chora (espaço).  
  Ex.: Lata de spray aquecida: sobe a pressão e pode explodir.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 9.2
- **lei de Graham** — lei de Graham, Graham  
  A velocidade de difusão (ou efusão) de um gás é inversamente proporcional à raiz quadrada da sua massa molar: gás mais leve se espalha mais rápido.  
  Origem: Homenagem ao químico escocês Thomas Graham, que a estudou no século XIX.  
  Ex.: H2 (2 g/mol) se difunde 4 vezes mais rápido que O2 (32 g/mol).  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 9.4
- **dissociação iônica** — dissociação iônica, dissociação  
  Separação dos íons que já existiam num composto iônico ao dissolvê-lo em água. Diferente da ionização, que cria íons a partir de molécula.  
  Ex.: NaCl → Na⁺ + Cl⁻ (dissociação); HCl + H2O → H3O⁺ + Cl⁻ (ionização).  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 11.2
- **mistura azeotrópica** — mistura azeotrópica, misturas azeotrópicas, azeótropo, azeótropos, azeotrópica  
  Mistura líquida que ferve a temperatura constante, como se fosse substância pura, e não se separa por destilação simples.  
  Origem: Do grego a- (não) + zein (ferver) + tropos (mudança): ferve sem mudar.  
  Ex.: Etanol com cerca de 4% de água é azeotrópico.  
  Fonte: IUPAC Gold Book (https://goldbook.iupac.org); Nomenclatura do ensino médio brasileiro (Feltre, Química, vols. 1–3; Usberco & Salvador, Química)
- **Brønsted-Lowry** — Brønsted-Lowry, Brønsted, Bronsted-Lowry  
  Teoria em que ácido é a espécie que doa próton (H⁺) e base é a espécie que recebe próton.  
  Origem: Homenagem a Johannes Brønsted (Dinamarca) e Thomas Lowry (Inglaterra), que a propuseram em 1923.  
  Ex.: Em NH3 + H2O ⇌ NH4⁺ + OH⁻, a água doa H⁺ e é o ácido.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 14.1
- **par conjugado** — par conjugado, pares conjugados, par ácido-base conjugado, base conjugada, ácido conjugado  
  Ácido e base que diferem por um único H⁺: ao perder o H⁺, o ácido vira sua base conjugada.  
  Ex.: NH4⁺/NH3 e H2O/OH⁻ são pares conjugados.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 14.1
- **hidrogênio ionizável** — hidrogênio ionizável, hidrogênios ionizáveis, H ionizável, H ionizáveis  
  Hidrogênio de um ácido que pode sair como H⁺ em água. Nos oxiácidos, é o H ligado ao oxigênio.  
  Ex.: O H3PO3 tem 3 hidrogênios, mas só 2 ionizáveis.  
  Fonte: Nomenclatura do ensino médio brasileiro (Feltre, Química, vols. 1–3; Usberco & Salvador, Química); OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 14
- **monoprótico** — monoprótico, monopróticos, monoprótica, diprótico, dipróticos, diprótica, triprótico, tripróticos, monoácido, monoácidos  
  Ácido que libera só 1 H⁺ por molécula. Diprótico libera 2; triprótico, 3.  
  Origem: Do grego monos (um), di (dois), tri (três) + próton.  
  Ex.: HCl é monoprótico; H2SO4, diprótico; H3PO4, triprótico.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 14.5
- **óxido ácido** — óxido ácido, óxidos ácidos, anidrido, anidridos  
  Óxido, em geral de não metal, que reage com água formando ácido e com base formando sal e água. Também chamado anidrido.  
  Origem: Anidrido vem do grego anhydros (sem água): é o ácido que perdeu água.  
  Ex.: SO3 + H2O → H2SO4.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 18; Nomenclatura do ensino médio brasileiro (Feltre, Química, vols. 1–3; Usberco & Salvador, Química)
- **óxido básico** — óxido básico, óxidos básicos  
  Óxido de metal, em geral alcalino ou alcalino-terroso, que reage com água formando base e com ácido formando sal e água.  
  Ex.: CaO (cal viva) + H2O → Ca(OH)2.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 18; Nomenclatura do ensino médio brasileiro (Feltre, Química, vols. 1–3; Usberco & Salvador, Química)
- **óxido neutro** — óxido neutro, óxidos neutros, óxido indiferente, óxidos indiferentes  
  Óxido que não reage com água, nem com ácido, nem com base.  
  Ex.: CO, NO e N2O são óxidos neutros.  
  Fonte: Nomenclatura do ensino médio brasileiro (Feltre, Química, vols. 1–3; Usberco & Salvador, Química)
- **anfótero** — anfótero, anfóteros, anfótera, anfóteras, anfoterismo  
  Substância que pode agir como ácido ou como base, conforme o meio.  
  Origem: Do grego amphoteros (ambos, os dois).  
  Ex.: ZnO e Al2O3 reagem tanto com ácidos quanto com bases.  
  Fonte: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e), cap. 14.1
- **craqueamento** — craqueamento, cracking  
  Quebra de hidrocarbonetos grandes do petróleo em moléculas menores, como as da gasolina e do GLP, por calor e catalisador.  
  Origem: Do inglês cracking (quebra).  
  Ex.: C16H34 → C8H18 + C8H16.  
  Fonte: Britannica (https://www.britannica.com/technology/cracking-chemical-process); Nomenclatura do ensino médio brasileiro (Feltre, Química, vols. 1–3; Usberco & Salvador, Química)
- **heteroátomo** — heteroátomo, heteroátomos  
  Átomo diferente de carbono (como O, N ou S) situado entre dois carbonos da cadeia.  
  Origem: Do grego heteros (outro, diferente).  
  Ex.: No CH3–O–CH3, o oxigênio é heteroátomo.  
  Fonte: Nomenclatura do ensino médio brasileiro (Feltre, Química, vols. 1–3; Usberco & Salvador, Química)
- **insaturação** — insaturação, insaturações, insaturada, insaturadas, insaturado, insaturados  
  Ligação dupla ou tripla entre átomos de carbono. Cadeia insaturada tem pelo menos uma.  
  Ex.: Óleos vegetais são ricos em ácidos graxos insaturados.  
  Fonte: OpenStax Organic Chemistry (https://openstax.org/details/books/organic-chemistry), cap. 7.2; Nomenclatura do ensino médio brasileiro (Feltre, Química, vols. 1–3; Usberco & Salvador, Química)
- **composto aromático** — aromático, aromáticos, aromática, aromáticas, anel aromático, anéis aromáticos, anel benzênico, anéis benzênicos  
  Composto com anel aromático, como o benzênico: seis carbonos em anel com elétrons pi distribuídos por todo o anel (ressonância).  
  Origem: Nome histórico: os primeiros compostos desse tipo estudados tinham cheiro forte.  
  Ex.: Benzeno, tolueno e naftaleno são aromáticos.  
  Fonte: OpenStax Organic Chemistry (https://openstax.org/details/books/organic-chemistry), cap. 15
- **alcano** — alcano, alcanos  
  Hidrocarboneto de cadeia aberta só com ligações simples; fórmula geral CnH2n+2.  
  Ex.: Metano (CH4), propano (C3H8).  
  Fonte: OpenStax Organic Chemistry (https://openstax.org/details/books/organic-chemistry), cap. 3
- **alceno** — alceno, alcenos  
  Hidrocarboneto de cadeia aberta com uma ligação dupla; fórmula geral CnH2n.  
  Ex.: Eteno (C2H4), que amadurece frutas.  
  Fonte: OpenStax Organic Chemistry (https://openstax.org/details/books/organic-chemistry), cap. 7
- **alcino** — alcino, alcinos  
  Hidrocarboneto de cadeia aberta com uma ligação tripla; fórmula geral CnH2n−2.  
  Ex.: Etino (acetileno), usado em maçaricos.  
  Fonte: OpenStax Organic Chemistry (https://openstax.org/details/books/organic-chemistry), cap. 9
- **carbonila** — carbonila, carbonilas  
  Grupo C=O (carbono com dupla ligação a oxigênio). Aparece em aldeídos, cetonas, ácidos carboxílicos, ésteres e amidas.  
  Ex.: A acetona tem uma carbonila no meio da cadeia.  
  Fonte: OpenStax Organic Chemistry (https://openstax.org/details/books/organic-chemistry), cap. 19
- **carboxila** — carboxila, carboxilas, grupo carboxílico  
  Grupo –COOH, que define os ácidos carboxílicos.  
  Origem: Junção de carbonila + hidroxila, os dois grupos que a formam.  
  Ex.: O ácido acético (CH3COOH) tem uma carboxila.  
  Fonte: OpenStax Organic Chemistry (https://openstax.org/details/books/organic-chemistry), cap. 20
- **hidroxila** — hidroxila, hidroxilas, oxidrila  
  Grupo –OH. Ligado a carbono saturado define os álcoois; ligado a anel aromático, os fenóis.  
  Ex.: O etanol tem uma hidroxila.  
  Fonte: OpenStax Organic Chemistry (https://openstax.org/details/books/organic-chemistry), cap. 17
- **aldeído** — aldeído, aldeídos  
  Função orgânica com carbonila na ponta da cadeia (grupo –CHO).  
  Origem: Do latim alcohol dehydrogenatus (álcool desidrogenado), nome dado por Liebig.  
  Ex.: Metanal (formol) e etanal.  
  Fonte: OpenStax Organic Chemistry (https://openstax.org/details/books/organic-chemistry), cap. 19
- **cetona** — cetona, cetonas  
  Função orgânica com carbonila entre dois carbonos (C–CO–C).  
  Origem: Do alemão Keton, derivado de Aketon (acetona).  
  Ex.: Propanona (acetona), o removedor de esmalte.  
  Fonte: OpenStax Organic Chemistry (https://openstax.org/details/books/organic-chemistry), cap. 19
- **éster** — éster, ésteres  
  Função R–COO–R′, formada por ácido carboxílico + álcool. Muitos dão aroma a frutas.  
  Origem: Termo criado pelo químico alemão Leopold Gmelin (1848), provavelmente de Essigäther (éter acético).  
  Ex.: Acetato de etila, usado em removedores.  
  Fonte: OpenStax Organic Chemistry (https://openstax.org/details/books/organic-chemistry), cap. 21
- **éter** — éter, éteres  
  Função R–O–R′: um oxigênio entre dois carbonos.  
  Origem: Do grego aither (ar puro do céu), pela volatilidade.  
  Ex.: Etoxietano, o éter comum, já usado como anestésico.  
  Fonte: OpenStax Organic Chemistry (https://openstax.org/details/books/organic-chemistry), cap. 18
- **amida** — amida, amidas  
  Função com nitrogênio ligado diretamente a uma carbonila (–CO–N–).  
  Origem: De am(ônia) + -ida.  
  Ex.: A ureia e a ligação peptídica das proteínas são amidas.  
  Fonte: OpenStax Organic Chemistry (https://openstax.org/details/books/organic-chemistry), cap. 21
- **amina** — amina, aminas  
  Função derivada da amônia (NH3) pela troca de H por grupos de carbono. Tem caráter básico.  
  Origem: De am(ônia) + -ina.  
  Ex.: Metilamina, CH3NH2, com cheiro de peixe.  
  Fonte: OpenStax Organic Chemistry (https://openstax.org/details/books/organic-chemistry), cap. 24
- **fenol** — fenol, fenóis  
  Função com hidroxila (–OH) ligada diretamente a um anel aromático. É levemente ácido.  
  Origem: De phène, nome antigo do benzeno (do grego phainein, iluminar: achado no gás de iluminação).  
  Ex.: O hidroxibenzeno é o fenol mais simples.  
  Fonte: OpenStax Organic Chemistry (https://openstax.org/details/books/organic-chemistry), cap. 17
- **haleto orgânico** — haleto orgânico, haletos orgânicos, haleto de alquila, haletos de alquila  
  Composto orgânico com halogênio (F, Cl, Br ou I) ligado a carbono.  
  Ex.: Clorometano (CH3Cl) e os CFCs.  
  Fonte: OpenStax Organic Chemistry (https://openstax.org/details/books/organic-chemistry), cap. 10
- **carbono quiral** — carbono quiral, carbonos quirais, carbono assimétrico, carbonos assimétricos, quiral, quirais, quiralidade  
  Carbono ligado a quatro grupos diferentes. Deixa a molécula sem simetria especular e pode gerar isomeria óptica.  
  Origem: Do grego cheir (mão): como as mãos, a molécula e sua imagem no espelho não se sobrepõem.  
  Ex.: No ácido lático, o carbono do meio é quiral.  
  Fonte: OpenStax Organic Chemistry (https://openstax.org/details/books/organic-chemistry), cap. 5
- **isomeria óptica** — isomeria óptica, isômeros ópticos, isômero óptico, opticamente ativo, opticamente ativa, opticamente ativos  
  Isomeria de moléculas que são imagem especular uma da outra e não se sobrepõem. Elas desviam a luz polarizada em sentidos opostos.  
  Ex.: Os dois ácidos láticos (dextrogiro e levogiro).  
  Fonte: OpenStax Organic Chemistry (https://openstax.org/details/books/organic-chemistry), cap. 5
- **enantiômero** — enantiômero, enantiômeros, enantiomorfo, enantiomorfos  
  Cada um dos dois isômeros ópticos que são imagem especular um do outro. Desviam a luz polarizada em ângulos iguais e sentidos opostos.  
  Origem: Do grego enantios (oposto) + meros (parte).  
  Ex.: Mistura de partes iguais dos dois enantiômeros é a racêmica, sem desvio.  
  Fonte: OpenStax Organic Chemistry (https://openstax.org/details/books/organic-chemistry), cap. 5
- **isomeria geométrica** — isomeria geométrica, isômeros geométricos, isômero geométrico, isomeria cis-trans, isômeros cis-trans  
  Isomeria cis-trans: mesmos átomos e ligações, mas grupos em lados diferentes de uma ligação dupla ou de um anel, que não giram.  
  Origem: Do latim cis (do mesmo lado) e trans (do outro lado).  
  Ex.: cis-but-2-eno e trans-but-2-eno.  
  Fonte: OpenStax Organic Chemistry (https://openstax.org/details/books/organic-chemistry), cap. 7
- **isomeria plana** — isomeria plana, isomeria constitucional, isômeros planos, isômeros constitucionais  
  Isômeros com a mesma fórmula molecular e fórmulas estruturais diferentes: de cadeia, posição, função, metameria ou tautomeria.  
  Ex.: Etanol e metoximetano (C2H6O) são isômeros de função.  
  Fonte: OpenStax Organic Chemistry (https://openstax.org/details/books/organic-chemistry), cap. 5; Nomenclatura do ensino médio brasileiro (Feltre, Química, vols. 1–3; Usberco & Salvador, Química)
- **tautomeria** — tautomeria, tautômero, tautômeros, tautomérico, ceto-enólica  
  Isomeria de função em que dois isômeros coexistem em equilíbrio dinâmico pela migração de um H, como cetona ⇌ enol.  
  Origem: Do grego tauto (o mesmo) + meros (parte).  
  Ex.: Propanona ⇌ prop-1-en-2-ol (equilíbrio ceto-enólico).  
  Fonte: OpenStax Organic Chemistry (https://openstax.org/details/books/organic-chemistry), cap. 22
- **metameria** — metameria, metâmero, metâmeros, isomeria de compensação  
  Isomeria plana em que muda a posição do heteroátomo na cadeia.  
  Origem: Do grego meta (mudança) + meros (parte).  
  Ex.: Etoxietano e metoxipropano (ambos C4H10O).  
  Fonte: Nomenclatura do ensino médio brasileiro (Feltre, Química, vols. 1–3; Usberco & Salvador, Química)
- **esterificação** — esterificação, esterificações, esterificação de Fischer  
  Reação de ácido carboxílico com álcool que forma éster e água. É reversível.  
  Ex.: Ácido acético + etanol ⇌ acetato de etila + água.  
  Fonte: OpenStax Organic Chemistry (https://openstax.org/details/books/organic-chemistry), cap. 21
- **saponificação** — saponificação, saponificar  
  Hidrólise de um éster em meio básico (ex.: NaOH). Com óleos e gorduras, forma sabão e glicerol.  
  Origem: Do latim sapo, saponis (sabão).  
  Ex.: Gordura + soda cáustica → sabão + glicerina.  
  Fonte: OpenStax Organic Chemistry (https://openstax.org/details/books/organic-chemistry), cap. 21 e 27
- **ozonólise** — ozonólise  
  Quebra de uma ligação dupla C=C pelo ozônio (O3), seguida de hidrólise, formando aldeídos e/ou cetonas.  
  Origem: Ozônio + grego lysis (quebra).  
  Ex.: A ozonólise do but-2-eno dá duas moléculas de etanal.  
  Fonte: OpenStax Organic Chemistry (https://openstax.org/details/books/organic-chemistry), cap. 8
- **oxidação branda** — oxidação branda, oxidações brandas, reativo de Baeyer  
  Oxidação de alceno com KMnO4 diluído e frio, em meio neutro ou levemente básico (reativo de Baeyer): adiciona OH a cada carbono da dupla, formando um diol.  
  Ex.: Eteno → etano-1,2-diol (etilenoglicol).  
  Fonte: OpenStax Organic Chemistry (https://openstax.org/details/books/organic-chemistry), cap. 8; Nomenclatura do ensino médio brasileiro (Feltre, Química, vols. 1–3; Usberco & Salvador, Química)
- **oxidação enérgica** — oxidação enérgica, oxidações enérgicas  
  Oxidação de alceno com KMnO4 ou K2Cr2O7 concentrado, a quente e em meio ácido: quebra a dupla e forma cetonas, ácidos carboxílicos ou CO2.  
  Ex.: But-2-eno → 2 ácidos acéticos.  
  Fonte: OpenStax Organic Chemistry (https://openstax.org/details/books/organic-chemistry), cap. 8; Nomenclatura do ensino médio brasileiro (Feltre, Química, vols. 1–3; Usberco & Salvador, Química)
- **hidrogenação** — hidrogenação, hidrogenações, hidrogenada, hidrogenadas, hidrogenado  
  Adição de H2 a ligações duplas ou triplas, com catalisador (Ni, Pt ou Pd).  
  Ex.: A hidrogenação de óleos vegetais produz margarina.  
  Fonte: OpenStax Organic Chemistry (https://openstax.org/details/books/organic-chemistry), cap. 8
- **regra de Markovnikov** — Markovnikov, Markovnikoff  
  Na adição de HX ou de água a um alceno, o H entra no carbono da dupla que já tem mais hidrogênios.  
  Origem: Homenagem ao químico russo Vladimir Markovnikov, que a publicou em 1870.  
  Ex.: Propeno + HCl → 2-cloropropano.  
  Fonte: OpenStax Organic Chemistry (https://openstax.org/details/books/organic-chemistry), cap. 7
- **polímero** — polímero, polímeros, polimerização, macromolécula, macromoléculas  
  Macromolécula formada pela união de muitas unidades pequenas repetidas, os monômeros.  
  Origem: Do grego poly (muitos) + meros (partes).  
  Ex.: Polietileno, PVC, amido e proteínas são polímeros.  
  Fonte: OpenStax Organic Chemistry (https://openstax.org/details/books/organic-chemistry), cap. 31
- **monômero** — monômero, monômeros  
  Molécula pequena que se une a muitas outras para formar um polímero.  
  Origem: Do grego monos (um) + meros (parte).  
  Ex.: O eteno é o monômero do polietileno.  
  Fonte: OpenStax Organic Chemistry (https://openstax.org/details/books/organic-chemistry), cap. 31
- **polímero de adição** — polímero de adição, polímeros de adição, polimerização por adição  
  Polímero formado pela abertura das ligações duplas dos monômeros, sem perda de átomos.  
  Ex.: Polietileno, PVC e poliestireno.  
  Fonte: OpenStax Organic Chemistry (https://openstax.org/details/books/organic-chemistry), cap. 31
- **polímero de condensação** — polímero de condensação, polímeros de condensação, policondensação, polimerização por condensação  
  Polímero formado com a saída de uma molécula pequena (geralmente água) a cada ligação entre monômeros.  
  Ex.: PET, náilon e proteínas.  
  Fonte: OpenStax Organic Chemistry (https://openstax.org/details/books/organic-chemistry), cap. 31
- **vulcanização** — vulcanização, vulcanizada, vulcanizado, vulcanizadas  
  Aquecimento da borracha com enxofre, que cria pontes de enxofre entre as cadeias e a deixa mais resistente e menos pegajosa.  
  Origem: De Vulcano, deus romano do fogo.  
  Ex.: Pneus são de borracha vulcanizada.  
  Fonte: OpenStax Organic Chemistry (https://openstax.org/details/books/organic-chemistry), cap. 31
- **ligação peptídica** — ligação peptídica, ligações peptídicas, peptídica  
  Ligação amida (–CO–NH–) entre aminoácidos, formada com saída de água. É ela que une os aminoácidos nas proteínas.  
  Origem: Peptídeo vem do grego peptos (digerido).  
  Ex.: Dois aminoácidos unidos formam um dipeptídeo.  
  Fonte: OpenStax Organic Chemistry (https://openstax.org/details/books/organic-chemistry), cap. 26; OpenStax Biology 2e (https://openstax.org/details/books/biology-2e), cap. 3.4
- **ligação glicosídica** — ligação glicosídica, ligações glicosídicas  
  Ligação entre dois monossacarídeos por meio de um oxigênio, formada com saída de água.  
  Ex.: Une as glicoses no amido e na celulose.  
  Fonte: OpenStax Biology 2e (https://openstax.org/details/books/biology-2e), cap. 3.2
- **aminoácido** — aminoácido, aminoácidos  
  Molécula com grupo amino (–NH2) e carboxila (–COOH); nos α-aminoácidos, ligados ao mesmo carbono. São as unidades das proteínas.  
  Ex.: Glicina é o aminoácido mais simples.  
  Fonte: OpenStax Biology 2e (https://openstax.org/details/books/biology-2e), cap. 3.4
- **triglicerídeo** — triglicerídeo, triglicerídeos, triacilglicerol, triacilgliceróis, triglicéride, triglicérides  
  Éster de glicerol com três ácidos graxos. Principal componente de óleos e gorduras.  
  Origem: Tri (três) + glicerídeo (éster do glicerol).  
  Ex.: Exame de sangue mede os triglicerídeos.  
  Fonte: OpenStax Biology 2e (https://openstax.org/details/books/biology-2e), cap. 3.3
- **ácido graxo** — ácido graxo, ácidos graxos  
  Ácido carboxílico de cadeia longa, em geral com 12 a 20 carbonos, saturado ou insaturado. Forma óleos e gorduras.  
  Origem: Graxo vem do latim crassus (gordo).  
  Ex.: Ácido oleico (do azeite) é insaturado.  
  Fonte: OpenStax Biology 2e (https://openstax.org/details/books/biology-2e), cap. 3.3
- **desnaturação** — desnaturação, desnaturada, desnaturadas, desnaturado, desnatura  
  Perda da forma tridimensional de uma proteína (por calor, pH ou sais) sem quebrar as ligações peptídicas. A proteína perde sua função.  
  Ex.: A clara do ovo fica branca ao fritar.  
  Fonte: OpenStax Biology 2e (https://openstax.org/details/books/biology-2e), cap. 3.4
- **hidrofílico** — hidrofílico, hidrofílica, hidrofílicos, hidrofílicas  
  Que tem afinidade com a água: em geral polar ou iônico, e se dissolve ou se mistura bem nela.  
  Origem: Do grego hydor (água) + philos (amigo).  
  Ex.: A ponta iônica do sabão é hidrofílica.  
  Fonte: OpenStax Biology 2e (https://openstax.org/details/books/biology-2e), cap. 2.2
- **hidrofóbico** — hidrofóbico, hidrofóbica, hidrofóbicos, hidrofóbicas  
  Que repele a água: em geral apolar, e não se mistura com ela.  
  Origem: Do grego hydor (água) + phobos (medo, aversão).  
  Ex.: A cauda de hidrocarboneto do sabão é hidrofóbica.  
  Fonte: OpenStax Biology 2e (https://openstax.org/details/books/biology-2e), cap. 2.2

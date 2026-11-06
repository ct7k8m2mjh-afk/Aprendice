import { describe, expect, it } from 'vitest';
import { contaEhTexto, materiaDoCodigo, partesFracao } from '../logica/fracao';

const fr = (s: string) => partesFracao(s).filter((p) => p.t === 'frac').map((p) => (p.t === 'frac' ? `${p.n}|${p.d}` : ''));
const junta = (s: string) => partesFracao(s).map((p) => (p.t === 'txt' ? p.v : p.orig)).join('');
const nuc = (s: string) => partesFracao(s).filter((p) => p.t === 'nuc').map((p) => (p.t === 'nuc' ? `${p.a}|${p.z}` : ''));

describe('divisão com "÷" e com "/" entre espaços também empilha (comando 20, auditoria A1)', () => {
  it('casos das resoluções', () => {
    expect(fr('(47 + C) ÷ (272 − C) = 3 ÷ 8')).toEqual(['47 + C|272 − C', '3|8']);
    expect(fr('C = 440 ÷ 11 = 40')).toEqual(['440|11']);
    expect(fr('72 ÷ 247 ≈ 0,29')).toEqual(['72|247']);
    expect(fr('1 g ÷ 2^4 = 0,0625 g')).toEqual(['1 g|2^4']);
    expect(fr('d = m / V')).toEqual(['m|V']);
    expect(fr('i / f = o / p')).toEqual(['i|f', 'o|p']);
    expect(fr('3 500 / 400 000 = 7 / 800')).toEqual(['3 500|400 000', '7|800']);
    expect(fr('7,0 mm / f = 7 / 800')).toEqual(['7,0 mm|f', '7|800']);
    expect(fr('f₁ / f₅ = 330 / 110')).toEqual(['f₁|f₅', '330|110']);
    expect(fr('média = (18·15 + 18·16 + 18·17) ÷ (18 + 18 + 18)')).toEqual(['18·15 + 18·16 + 18·17|18 + 18 + 18']);
    expect(fr('n = log 2 ÷ log 1,1')).toEqual(['log 2|log 1,1']);
    // a de fora primeiro; a de dentro empilha dentro dela
    expect(fr('6 = 2 × (x ÷ 6) ÷ (1 − x² ÷ 36)')).toEqual(['x ÷ 6|1 − x² ÷ 36']);
    // divisão encadeada: (a ÷ b) ÷ c, a primeira dentro do numerador
    expect(fr('a ÷ b ÷ c')).toEqual(['a ÷ b|c']);
  });
  it('o texto não muda', () => {
    for (const s of ['(47 + C) ÷ (272 − C) = 3 ÷ 8', 'd = m / V', 'a ÷ b ÷ c', '1 g ÷ 2^4 = 0,0625 g'])
      expect(partesFracao(s).map((p) => (p.t === 'txt' ? p.v : p.orig)).join('')).toBe(s);
  });
  it('verso, unidade e alternativas com " / " ficam na linha', () => {
    for (const s of ['calaste dez mil enganos, / tu roubaste', '10 m / s', 'e / ou', 'A / B', 'de 3 / 4 de maio']) expect(fr(s), s).toEqual(s === 'de 3 / 4 de maio' ? ['3|4'] : []);
  });
});

describe('fração empilhada', () => {
  it('acha frações numéricas e algébricas simples', () => {
    expect(fr('2/5 × 1/8')).toEqual(['2|5', '1|8']);
    expect(fr('(2 × 1) ÷ (5 × 8) = 2/40')).toEqual(['2 × 1|5 × 8', '2|40']); // ÷ também empilha (comando 20)
    expect(fr('a/b × c/d = …')).toEqual(['a|b', 'c|d']);
    expect(fr('(1/5)·90 + (1/8)·144 + (1/7)·126 = 18 + 18 + 18 = 54')).toEqual(['1|5', '1|8', '1|7']);
    expect(fr('decompondo nos quadrículos: 2·7 + (2·1)/2 + (2·8)/2')).toEqual(['2·1|2', '2·8|2']);
    expect(fr('27x/60 = √2/2')).toEqual(['27x|60', '√2|2']);
    expect(fr('2x/(x + 1)')).toEqual(['2x|x + 1']);
    expect(fr('d = m/V')).toEqual(['m|V']);
    expect(fr('1/300.')).toEqual(['1|300']);
    expect(fr('(√2/2)²')).toEqual(['√2|2']);
  });
  it('não mexe em datas, anos, unidades e textos', () => {
    for (const s of ['em 05/11/2026', 'São Camilo 2024/2', 'prova de 2020/21', 'velocidade de 10 m/s', '63,5 g/mol', 'em km/h', 'mol/L', 'kJ/mol',
      'em m/s', '3 L/h', 'calaste dez mil enganos, / tu roubaste', 'e/ou', 'átomos/mol', '140 dólares/kWh', 'C/mol', '°/s', 'https://a.b/c', 'A/B', 'o par A/a se separa', 'concentração (g/L)', '0,082 atm·L/(mol·K)', 'joule, m/s², metro', 'unidade: g/L',
      '0,05 atm · L/K', '1,2 × 10³ J/(kg °C)', 'R em J/(mol·K)', 'cor do par F/C', 'Wh/L (watt-hora por litro)', 'Mg/Fe: −0,44 − (−2,36)',
      'T só precisa diferir de A/E', '400 Wh/L', '6 m/min', 'escrita como parte/todo', '9 t × 1,7 Gcal/t', '(UFRS/modificada)'])
      expect(fr(s)).toEqual([]);
  });
  it('coeficiente e raiz ficam juntos no numerador (6√5/5 é (6√5) ÷ 5)', () => {
    // casos reais das resoluções de Matemática (M10.2, M10.3, M08.2) e da teoria
    expect(fr('Alternativa E — BC = 6√5/5 cm, que é aproximadamente 2,68 cm')).toEqual(['6√5|5']);
    expect(fr('(6 × √5) ÷ 5 = 6√5/5 ≈ 2,68 cm')).toEqual(['6 × √5|5', '6√5|5']);
    expect(fr('3 × (3 ÷ 5) ÷ (2 ÷ √5) = 9√5/10 ≈ 2,01 cm')).toEqual(['3 ÷ 5|2 ÷ √5', '9√5|10']);
    expect(fr('= 12√5/5 ≈ 5,37 cm')).toEqual(['12√5|5']);
    expect(fr('7√3/2 não confere')).toEqual(['7√3|2']);
    expect(fr('3√34/85 é 6 ÷ (5√34)')).toEqual(['3√34|85', '6|5√34']);
    expect(fr('5√34/85 é 10 ÷ (5√34)')).toEqual(['5√34|85', '10|5√34']);
    expect(fr('A = 16√3/4 = 4√3')).toEqual(['16√3|4']);
    expect(fr('(2π − 3√3/2)')).toEqual(['3√3|2']);
    expect(fr('√2/2')).toEqual(['√2|2']);
    // a raiz nunca fica fora da fração nem cobre só o numerador de outra
    for (const s of ['6√5/5', '9√5/10', '12√5/5', '7√3/2', '5√34/85', '3√34/85'])
      for (const p of partesFracao(s)) expect(p.t === 'txt' && p.v.includes('√')).toBe(false);
  });
  it('frações algébricas com segmento, área da base, abscissa e grupos', () => {
    expect(fr('o quadrado tem (AB/5)² = AB²/25. A fração é (AB²/25) ÷ (2AB²) = 2%')).toEqual(['AB|5', 'AB²|25', 'AB²|25']);
    expect(fr('como AB = BC/2, você pode escolher')).toEqual(['BC|2']);
    expect(fr('V(II) = (Ab/2) × 2P = Ab × P ; V(III) = (Ab/4) × 2P')).toEqual(['Ab|2', 'Ab|4']);
    expect(fr('multiplicou ℓ pelo fator (m + n)/(m × n) quando')).toEqual(['m + n|m × n']);
    expect(fr('pelo inverso dela: (m × n)/(m + n).')).toEqual(['m × n|m + n']);
    expect(fr('sobra a/g = 10/15')).toEqual(['a|g', '10|15']);
    expect(fr('só a razão a/g fica determinada')).toEqual(['a|g']);
    expect(fr('Então f(c/b) é a mesma coisa')).toEqual(['c|b']);
    expect(fr('PS/SR = 5/4')).toEqual(['PS|SR', '5|4']);
    expect(fr('Alternativa C — 5xP/6, ou seja')).toEqual(['5xP|6']);
    expect(fr('T(t) = -t²/4 + 400')).toEqual(['t²|4']);
    expect(fr('x = Dx/D e y = Dy/D.')).toEqual(['Dx|D', 'Dy|D']);
  });
  it('nuclídeo é índice antes do símbolo, não fração', () => {
    expect(fr('A linha Dado traz 207/82 Pb: o 207 é o número de massa')).toEqual([]);
    expect(nuc('A linha Dado traz 207/82 Pb: o 207 é o número de massa')).toEqual(['207|82']);
    expect(nuc('Em 90/38 Sr, o número')).toEqual(['90|38']);
    expect(nuc('235/92 U')).toEqual(['235|92']);
    expect(junta('traz 207/82 Pb: o 207')).toBe('traz 207/82 Pb: o 207');
    // o número de baixo tem de ser o Z do símbolo: coeficiente "3/2 O2" e genética "1/4 PP" seguem fração
    expect(nuc('3/2 O2')).toEqual([]);
    expect(fr('3/2 O2')).toEqual(['3|2']);
    expect(fr('Pp × Pp: 1/4 PP, 2/4 Pp, 1/4 pp')).toEqual(['1|4', '2|4', '1|4']);
  });
  it('o texto não muda', () => {
    for (const s of ['2/5 × 1/8 = 2/40', 'x = (2·1)/2 em 10 m/s', 'nada aqui', '']) expect(junta(s)).toBe(s);
  });
});

describe('conta ou texto', () => {
  it('Português e humanas: a "conta" do passo é sempre texto', () => {
    expect(contaEhTexto('início: rapaz de Cadillac na avenida Atlântica × fim: moça some no cemitério', 'por')).toBe(true);
    expect(contaEhTexto('27 selfies sem sucesso → "a beleza da alma é mais importante"', 'por')).toBe(true);
    expect(contaEhTexto('por conseguinte = portanto; sem dúvida = certamente; inclusive = até mesmo', 'por')).toBe(true);
    expect(contaEhTexto('preposição a + artigo a = à', 'por')).toBe(true);
    // mesmo sem saber a matéria, relação entre palavras não é conta
    expect(contaEhTexto('autor → obra')).toBe(true);
    expect(contaEhTexto('coração × tela')).toBe(true);
    expect(contaEhTexto('por isso = logo; além disso = e ainda')).toBe(true);
  });
  it('frase longa de Biologia e Química é texto', () => {
    expect(contaEhTexto('A figura da linha 7 mostra um ponto central pequeno com sinal de mais e, fora dele, um elétron marcado e⁻ com seta.', 'qui')).toBe(true);
    expect(contaEhTexto('Na tabela periódica que a prova fornece, Z = 38 corresponde ao estrôncio, Sr.', 'qui')).toBe(true);
    expect(contaEhTexto('A chance de a criança ser do sexo masculino é 1/2.', 'bio')).toBe(true);
    // conta com comentário entre parênteses continua conta
    expect(contaEhTexto('1/2 (chance de o óvulo levar o inserto) × 1 (o pai não contribui com inserto nem atrapalha) = 1/2 = 50%.', 'bio')).toBe(false);
    expect(contaEhTexto('AgNO3(aq) + NaCl(s) → AgCl(s) + NaNO3(aq)', 'qui')).toBe(false);
    expect(contaEhTexto('Aa × Aa → 1/4 aa', 'bio')).toBe(false);
  });
  it('frase explicativa com poucas expressões no meio é texto (Química e Biologia)', () => {
    for (const [s, m] of [
      ['86 prótons significa Z = 86. Número de massa 222 significa A = 222. E 86 elétrons, iguais aos 86 prótons.', 'qui'],
      ['Cátion bivalente significa carga 2+, ou seja, 2 elétrons perdidos: 38 − 2 = 36 elétrons.', 'qui'],
      ['Kw maior significa [H⁺] maior e pH menor', 'qui'],
      ['Arrhenius: ácido libera H⁺ em água; base libera OH⁻ em água', 'qui'],
      ['produtos abaixo dos reagentes, logo ΔH negativo, logo exotérmica, logo libera calor', 'qui'],
      // dado solto no começo não é conta; conta no fim de uma frase também não
      ['Z = 7 e o átomo é neutro, logo há 7 elétrons para distribuir.', 'qui'],
      ['Z = 69 e Z = 70 caem no trecho achatado e baixo do 6º período, ambos perto de 1,2; Z = 12 e Z = 20 também ficam baixos, em torno de 1,2 e 1,0. Diferenças ≈ 0,1 e ≈ 0,2', 'qui'],
      ['ΔH⁰ de reação = − 727 kJ/mol, valor negativo, logo a reação é exotérmica', 'qui'],
      ['pOH = o expoente positivo de [OH⁻]: se [OH⁻] = 10⁻⁵, pOH = 5', 'qui'],
      ['A espermátide não se divide mais: 100 espermátides × 1 = 100 espermatozoides.', 'bio'],
      ['Mg²⁺ e PO4³⁻. Para a soma dar zero: 3 Mg (3 × 2+ = 6+) com 2 fosfatos (2 × 3− = 6−), logo Mg3(PO4)2', 'qui'],
      // soma sem resultado é lista, não conta; rótulo curto com soma de palavras é frase
      ['enxofre da família VI A: 2 ligações + 2 pares isolados, logo geometria angular', 'qui'],
      ['2 H2 + O2 (reagentes) no nível Y; topo da curva no nível Z; 2 H2O (produtos) no nível X', 'qui'],
      ['no equador, dia claro ≈ 12 horas o ano todo', 'bio'],
      ['albinismo aa × Aa: metade albina, metade com pigmentação normal', 'bio'],
      ['já saiu uma dengue, sobram 4 vírus, e chikungunya é 1 deles → 1/4', 'bio'],
      ['nitrogênio com 5 elétrons de valência: 3 ligações N–H e 1 par isolado = 4 nuvens, logo geometria piramidal; assimétrica, logo polar', 'qui'],
      ['n aminoácidos unidos em cadeia formam n − 1 ligações peptídicas e liberam n − 1 águas', 'bio'],
      ['1 mol do ácido gera 18 mol de CO2. Cada CO2 tem 1 C: 18 × 1 = 18 mol de C por mol de ácido.', 'qui'],
    ]) expect(contaEhTexto(s, m)).toBe(true);
  });
  it('linha que começa com conta ou tem equação com seta continua à mão (Química e Biologia)', () => {
    for (const [s, m] of [
      ['22 átomos × 12 g/mol = 264 g de carbono em cada 423 g de losartana', 'qui'],
      ['14 ÷ 24 = 0,583, ou seja, 58,3% da massa é ouro; os 41,7% restantes são outros metais', 'qui'],
      ['[H⁺] = 1 × 10⁻¹⁵ mol/L, logo pH = 15, um valor alto e positivo', 'qui'],
      ['C2H2 + 1 HCl → C2H3Cl, ou seja, 1 mol de acetileno produz 1 mol de cloreto de vinila', 'qui'],
      ['20 °C + 273 = 293 K, e a temperatura do reservatório já é 293 K', 'qui'],
      ['CH4(g) → C(s) + 2 H2(g), por calor, com energia solar ou nuclear', 'qui'],
      ['corroer o ferro é Fe (s) → Fe²⁺ (aq) + 2 e⁻, isto é, o metal perde elétron.', 'qui'],
      ['2 porções × 1 mol de Th3N4 por porção = 2 mol de Th3N4. Confira: 2 porções gastam 2 × 6 = 12 mol de C, exatamente o que havia', 'qui'],
      ['657 milhões de toneladas − 653 milhões de toneladas = 4 milhões de toneladas por segundo de massa que some', 'qui'],
      ['ordem global = 2 (do NO) + 1 (do Cl2) = 3; a lei de velocidade é v = k multiplicado por [NO] ao quadrado e por [Cl2]', 'qui'],
      ['variação = +4 − (−2) = 6 por carbono; como há 1 carbono por molécula, 1 mol de CO2 envolve 6 mol de e⁻', 'qui'],
      ['200 L da solução 2: 0,01 mol/L × 200 L = 2 mol de OH⁻, que é exatamente o necessário', 'qui'],
      ['H: 2 × 4 = 8 dos dois lados. Se: 1 dos dois lados.', 'qui'],
      ['A = Z + N, ou seja, número de massa = prótons + nêutrons', 'qui'],
      ['B é consumido na etapa 2 (AY + B → AB + Y) e regenerado na etapa 3 (AB + X → AX + B)', 'qui'],
      ['Pu-239 (Z = 94) → alfa (massa 4) + U-235 (Z = 92): sobra um núcleo de massa 235, quase o mesmo tamanho do original', 'qui'],
      ['16 pares × 2 cromossomos por par = 32 cromossomos nas células somáticas da rainha, isto é, 2n = 32.', 'bio'],
      ['16 pares = 32 cromossomos nas células somáticas, ou seja, 2n = 32', 'bio'],
      ['1 par de bases = 2 bases, então 100 pares = 200 bases', 'bio'],
      ['3 classes de forma × 2 classes de cor = 6 classes fenotípicas.', 'bio'],
      ['1 célula → 2 → 4 → 8: o tumor cresce porque cada filha também se divide', 'bio'],
      ['Entradas = natalidade + imigração = 200 + imigração, que vai de 100 a 300. Logo as entradas vão de 300 a 500 por ano.', 'bio'],
      // equação química com "dá" no lugar da seta e fórmula com "≈"
      ['C16H34 dá C8H16 + C8H18, ou seja, 16 carbonos numa molécula viram 8 + 8 carbonos em duas moléculas', 'qui'],
      ["esquema do enunciado: R-C≡C-R' + HOH dá R-C(OH)=CH-R' , que dá R-(C=O)-CH2-R'", 'qui'],
      ['eteno C2H4 + H2 dá etano C2H6: 2 carbonos antes e 2 depois, 4 hidrogênios antes e 6 depois', 'qui'],
      ['2 H2O com corrente elétrica dá 2 H2 + O2, e a corrente vem de energia eólica ou solar', 'qui'],
      ['eletrólise da água: 2 H2O com corrente elétrica dá 2 H2 + O2', 'qui'],
      ['para ácido fraco monoprótico: [H⁺] ≈ raiz quadrada de (Ka × C)', 'qui'],
      // soma de fórmulas que fecha numa reação ou num rótulo continua conta
      ['H2SO4 + 2 NaOH: cada 1 mol de ácido precisa de 2 mol de base', 'qui'],
      ['H⁺ + OH⁻ forma H2O: é assim que o limão retira o OH⁻ do meio', 'qui'],
      ['do reagente ao pico: Z − Y, que em módulo é |Y − Z|', 'qui'],
    ]) expect(contaEhTexto(s, m)).toBe(false);
  });
  it('conta, equação química e fórmula por extenso continuam à mão (Química e Biologia)', () => {
    for (const [s, m] of [
      ['massa molar do CO2 = 12 + 2 × 16 = 44 g/mol; 1,0 × 10⁷ mol × 44 g/mol = 4,4 × 10⁸ g', 'qui'],
      ['energia de ativação = 30 kcal/mol − 20 kcal/mol = 10 kcal/mol', 'qui'],
      ['CH4(g) + H2O(g) → CO(g) + 3 H2(g). Conferindo: 1 carbono de cada lado; 1 oxigênio de cada lado; hidrogênios: 4 + 2 = 6 à esquerda e 3 × 2 = 6 à direita', 'qui'],
      ['carga total do cátion + carga total do ânion = 0', 'qui'],
      ['166 = A do produto + 0, logo A do produto = 166', 'qui'],
      ['P × M = d × R × T, logo M = d × R × T ÷ P', 'qui'],
      ['número de códons da região codificante = bases dessa região ÷ 3', 'bio'],
      ['Em 6 CO2 + 6 H2O → C6H12O6 + 6 O2: carbono 6 de um lado e 6 do outro; hidrogênio 12 e 12; oxigênio 12 + 6 = 18 à esquerda e 6 + 12 = 18 à direita.', 'bio'],
    ]) expect(contaEhTexto(s, m)).toBe(false);
    // em Matemática e Física a regra nova não vale: conta com nomes por extenso continua conta
    expect(contaEhTexto('1 par de bases = 2 bases, então 100 pares = 200 bases', 'mat')).toBe(false);
  });
  it('contas de Matemática ficam na letra à mão', () => {
    for (const s of ['43,18', '2, 3, 5, 7, 11, 13, ...', '(16, 1, 26, 15, 24, 25, 9)', '10 ; 10 ; 10 ; 6,5 ; 5', 'trajeto = AB + BC',
      'α + β = ângulo BCA | β + δ = ângulo DCE', "'ab' − 'ba' = (10a + b) − (10b + a) = 9a − 9b = 54", '6 lados → hexágono',
      'x = salário do homem branco', 'ângulo entre o plano da água e o eixo do copo = 90° − 45° = 45°'])
      expect(contaEhTexto(s, 'mat')).toBe(false);
    expect(contaEhTexto('Pedro tem 2 irmãos, os dois na Fatec; Marcelo e Sérgio estudam na Fatec sem ser irmãos de Pedro', 'mat')).toBe(true);
  });
  it('matéria pelo código do tema ou do conteúdo', () => {
    expect(materiaDoCodigo('M10.2')).toBe('mat');
    expect(materiaDoCodigo('P01')).toBe('por');
    expect(materiaDoCodigo('L03')).toBe('fs');
    expect(materiaDoCodigo('')).toBeUndefined();
  });
  it('trecho citado e frase são texto', () => {
    expect(contaEhTexto('“O passo vagaroso de quem não tem pressa”')).toBe(true);
    expect(contaEhTexto('"O jaquetão de casimira inglesa"')).toBe(true);
    expect(contaEhTexto('O samba (sujeito) conquistou (verbo) meu coração (objeto direto)')).toBe(true);
    expect(contaEhTexto('trair a existência = denunciar a existência, deixá-la escapar')).toBe(true);
    expect(contaEhTexto('Entra um acetil-CoA com 2 carbonos e saem 2 moléculas de CO2, com 1 carbono cada.')).toBe(true);
  });
  it('conta e fórmula ficam na letra à mão', () => {
    expect(contaEhTexto('16·h = 8 → h = 8 ÷ 16 = 0,5 cm.')).toBe(false);
    expect(contaEhTexto('x + y = 80 e 25x + 30y = 2290')).toBe(false);
    expect(contaEhTexto('Cu²⁺(aq) + 2 elétrons → Cu(s)')).toBe(false);
    expect(contaEhTexto('100 mL × 1 g/mL = 100 g de solução')).toBe(false);
    expect(contaEhTexto('Com n = 36, R = 4.')).toBe(false);
  });
});

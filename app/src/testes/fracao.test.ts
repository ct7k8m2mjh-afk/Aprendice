import { describe, expect, it } from 'vitest';
import { contaEhTexto, formulaEhTexto, materiaDoCodigo, partesFracao } from '../logica/fracao';

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
    expect(fr('o quadrado tem (AB/5)² = AB²/25. A fração é (AB²/25) ÷ (2AB²) = 2%')).toEqual(['AB|5', 'AB²|25', 'AB²/25|2AB²']); // a de dentro empilha dentro da de fora (19/11/2026)
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

// Auditoria da revisão em slides (rodada 1, M1): número com barra que não é fração fica em linha
import { partesFracao as pf } from '../logica/fracao';
describe('barra que não é fração (revisão em slides)', () => {
  const temFrac = (s: string) => pf(s).some((p) => p.t === 'frac');
  it('tensão de rede, lei com ano, código de avião', () => {
    expect(temFrac('a rede 220/127 V e a de 380/220 V')).toBe(false);
    expect(temFrac('a PEC 48/2023 tramita')).toBe(false);
    expect(temFrac('Lei 12.519/2011 e Lei 14.759/2023')).toBe(false);
    expect(temFrac('o caça F/A-18 rompe a barreira')).toBe(false);
  });
  it('fração de verdade continua empilhada', () => {
    expect(temFrac('x = 220/11 = 20')).toBe(true);
    expect(temFrac('a = 3/4')).toBe(true);
    expect(temFrac('t = 400/10 = 40 s')).toBe(true);
  });
});

describe('fração com Δ, índice e raiz empilha (Física, 13/11/2026)', () => {
  it('Δ antes da letra e índice depois dela', () => {
    expect(fr('C = 2U/ΔV²')).toEqual(['2U|ΔV²']);
    expect(fr('U = C·ΔV²/2')).toEqual(['ΔV²|2']);
    expect(fr('F_média = ΔQ/Δt')).toEqual(['ΔQ|Δt']);
    expect(fr('ε ∝ ΔΦ/Δt')).toEqual(['ΔΦ|Δt']);
    expect(fr('razão = v₂/v₁')).toEqual(['v₂|v₁']);
    expect(fr('λ₂/λ₁ = 2')).toEqual(['λ₂|λ₁']);
    expect(fr('v = v₁/6')).toEqual(['v₁|6']);
    expect(fr('Δε_jul/Δε_jan = 3/4')).toEqual(['Δε_jul|Δε_jan', '3|4']);
    expect(fr('k2 = (k1 × ΔL1)/ΔL2')).toEqual(['k1 × ΔL1|ΔL2']);
  });
  it('dentro de raiz', () => {
    expect(fr('v₂/v₁ = √(h₂/h₁)')).toEqual(['v₂|v₁', 'h₂|h₁']);
    expect(fr('t = √(2h/g)')).toEqual(['2h|g']);
    expect(fr('v = √(g/h)')).toEqual(['g|h']);
  });
  it('unidades continuam na linha e o texto não muda', () => {
    expect(fr('10 m/s')).toEqual([]);
    expect(fr('concentração (g/L)')).toEqual([]);
    for (const s of ['C = 2U/ΔV²', 'Δε_jul/Δε_jan = 3/4']) expect(junta(s)).toBe(s);
  });
});

// Revisão do site de 19/11/2026 (dados.md, itens 3 e 4): "÷", milhar com espaço e parênteses também empilham
describe('fração sempre empilhada: "÷", milhar com espaço e parênteses (revisão de 19/11/2026)', () => {
  it('milhar com espaço e parênteses dentro de parênteses', () => {
    expect(fr('27 000/96 500 ≈ 0,28')).toEqual(['27 000|96 500']);
    expect(fr('η = 450 000/1 000 000')).toEqual(['450 000|1 000 000']);
    expect(fr('x = −40/(2 × (−10)) = 2')).toEqual(['40|2 × (−10)']);
    expect(fr('V = ((1 · 1)/2 · 1)/3 = 1/6')).toEqual(['(1 · 1)/2 · 1|3', '1|6']);
    expect(fr('(1 × (−1) × 18)/(1 × 2) = −9')).toEqual(['1 × (−1) × 18|1 × 2']);
    expect(fr('os k(k + 1)/2 primeiros')).toEqual(['k(k + 1)|2']);
    expect(fr('y = √3(√3 − √2)/(3 − 2) = 3 − √6')).toEqual(['√3(√3 − √2)|3 − 2']);
    expect(fr('Q(0)/2 → metade')).toEqual(['Q(0)|2']);
  });
  it('número que parece ano só é data com o semestre embaixo, fora de conta', () => {
    expect(fr('2000/500 = 4,0 h')).toEqual(['2000|500']);
    expect(fr('fóssil 5: 4096/2048 = 2')).toEqual(['4096|2048']);
    expect(fr('h(2026) = 2026/2 = 1013')).toEqual(['2026|2']);
    expect(fr('= 1013/2026 − 1/2026')).toEqual(['1013|2026', '1|2026']);
    for (const s of ['São Camilo 2024/2', 'prova de 2020/21', 'a PEC 4/2018 tramita', 'Lei 13.415/2017', 'Decreto-Lei 25/1937', 'Lei nº 11.340/2006', 'em 14/04 o bloqueio'])
      expect(fr(s), s).toEqual([]);
  });
  it('"÷" com unidade, palavra, fatorial, módulo e fração dentro', () => {
    expect(fr('90 g ÷ 18 g/mol = 5 mol de H2O')).toEqual(['90 g|18 g/mol']);
    expect(fr('108 km/h ÷ 3,6 = 30 m/s')).toEqual(['108 km/h|3,6']);
    expect(fr('45° ÷ 15° = 3')).toEqual(['45°|15°']);
    expect(fr('2,64 × 10⁻³ mol ÷ 0,10 mol/L = 2,64 × 10⁻² L')).toEqual(['2,64 × 10⁻³ mol|0,10 mol/L']);
    expect(fr('Velocidade média = distância ÷ tempo.')).toEqual(['distância|tempo']);
    expect(fr('C = m(soluto) ÷ V(solução)')).toEqual(['m(soluto)|V(solução)']);
    expect(fr('densidade = massa ÷ volume')).toEqual(['massa|volume']);
    expect(fr('carga total ÷ capacitância total')).toEqual(['carga total|capacitância total']);
    expect(fr('1,9 é a média: 1 900 crianças ÷ 1 000 famílias.')).toEqual(['1 900 crianças|1 000 famílias']);
    expect(fr('32 cromossomos ÷ 2 = 16')).toEqual(['32 cromossomos|2']);
    expect(fr('4! ÷ 2! = 12')).toEqual(['4!|2!']);
    expect(fr('|5k − 3| ÷ 2')).toEqual(['|5k − 3||2']);
    expect(fr('(7/2) ÷ (37/10) = 70/74')).toEqual(['7/2|37/10', '70|74']);
    expect(fr('q = 1 ÷ 1/2 = 2')).toEqual(['1|1/2']);
    expect(fr('3^(x + 64) ÷ 5 = 81^x ÷ 45')).toEqual(['3^(x + 64)|5', '81^x|45']);
    expect(fr('P1 ÷ T1 = P2 ÷ T2, ou seja')).toEqual(['P1|T1', 'P2|T2']);
    expect(fr('(a ÷ b)/2')).toEqual(['a ÷ b|2']);
  });
  it('o que não é divisão de dois operandos fica na linha', () => {
    for (const s of ['100 mA ÷ 1000 = 0,1 A', 'k = calor por tempo ÷ (área × ΔT)', 'V de Júpiter ÷ V da Terra', '(÷ 2)', 'dividir: ÷ 4', '204 ÷ L tem de dar'])
      expect(fr(s).filter((x) => !/^\d+\|\d+$/.test(x) && !/^100 mA/.test(x) && x !== '204|L'), s).toEqual([]);
    expect(fr('100 mA ÷ 1000 = 0,1 A')).toEqual(['100 mA|1000']);
    expect(fr('204 ÷ L tem de dar')).toEqual(['204|L']);
  });
  it('unidades continuam na linha e o texto não muda', () => {
    for (const s of ['10 m/s', '22,4 L/mol', 'km/h', 'mol/L']) expect(fr(s)).toEqual([]);
    for (const s of ['90 g ÷ 18 g/mol = 5 mol', '(7/2) ÷ (37/10) = 70/74', 'x = −40/(2 × (−10))', '27 000/96 500', '|5k − 3| ÷ 2'])
      expect(junta(s)).toBe(s);
  });
});

describe('letra/letra depois de "·" e "×", função e produto de variáveis (revisão de 21/11/2026, N1)', () => {
  it('empilha a fração entre nomes depois de um sinal de produto', () => {
    expect(fr('T = 2π√(L/g) → T² = 4π² · L/g → L = g · T²/(4π²)')).toEqual(['L|g', 'L|g', 'T²|4π²']);
    expect(fr('P = nRT/V')).toEqual(['nRT|V']);
    expect(fr('GMm/r² = mv²/r')).toEqual(['GMm|r²', 'mv²|r']);
    expect(fr('fB = fA·RA/RB')).toEqual(['RA|RB']);
    expect(fr('μe = sen θ/cos θ = tg θ')).toEqual(['sen θ|cos θ']);
    expect(fr('(log x/log 2) × (log x/log 3)')).toEqual(['log x|log 2', 'log x|log 3']);
    expect(fr('AB = BC/tg 30° = √3')).toEqual(['BC|tg 30°']);
    expect(fr('NA = m v²/R')).toEqual(['v²|R']);
    expect(fr('FX/mX < FY/mY')).toEqual(['FX|mX', 'FY|mY']);
    expect(fr('mA/mB = sen 30°')).toEqual(['mA|mB']);
  });
  it('unidade, sigla, genótipo, par de metais e palavra continuam na linha', () => {
    for (const s of ['J = kg · m²/s²', '10 N · m/s', '0,05 atm · L/K', 'kg·m/s² · kg·m²/s', 'F1 = Ab/aB (trans)', 'pólio → VIP/VOP',
      'RS/rs × RS/rs', 'Mênfis → Nilo/Mar Vermelho', 'Remove rate: 1000/Sec', 'R$ 0,30/kWh', '(mL/min) ÷ kg = mL/(min · kg)',
      '+0,80 V × AgCl/Ag: +0,22 V', 'em kJ/mol', '25 mL/min', 'mata e/ou consome', 'g·m/s', 'Vazão: m² × m/s dá m³/s',
      'tem unidade de comprimento (m × m/m)', 'a unidade fica C · s/m', 'com 10⁻⁸ C/g = 10⁻⁵', 'e · v · B é C · m/s · T',
      'J/m³ = N · m/m³', 'unidade de força: kg × m/s²', '(C/m³) × m⁴ × (m/s) = C·m²/s', 'mAh/h = mA'])
      expect(fr(s).filter((x) => !x.includes('÷')), s).toEqual(s.startsWith('(mL') ? ['mL/min|kg'] : []);
  });
});

describe('lista de fórmulas da Teoria: igualdade vai para a letra da fórmula (revisão de 21/11/2026, N7)', () => {
  it('igualdade com "=" escrita com palavras é fórmula; a linha sem "=" e a explicação comprida são texto', () => {
    for (const s of ['variação = (novo − antigo) / antigo', 'x% de A = (x/100) · A', 'total = parte/(x/100)', 'sen = cateto oposto / hipotenusa'])
      expect(formulaEhTexto(s, 'mat'), s).toBe(false);
    expect(formulaEhTexto('próton = uud; nêutron = udd', 'fis')).toBe(false);
    expect(formulaEhTexto('cristas = dobras da membrana interna', 'bio')).toBe(false);
    expect(formulaEhTexto('pontos percentuais: diferença simples', 'mat')).toBe(true);
    expect(formulaEhTexto('série: mesma corrente; R equivalente = soma', 'fis')).toBe(true);
    expect(formulaEhTexto('nêutrons = número de massa − número atômico; o número de massa já tem os prótons dentro dele, então o caminho é sempre subtrair', 'qui')).toBe(true);
    // matérias de texto continuam em texto
    expect(formulaEhTexto('tema = assunto (cabe num substantivo)', 'por')).toBe(true);
  });
  it('a conta do passo continua com a regra de antes', () => {
    expect(contaEhTexto('variação = (novo − antigo) / antigo', 'mat')).toBe(true);
  });
});

describe('revisão de 21/11, dados N1: grupo com expoente, potência e cadeia empilham', () => {
  it('grupo entre parênteses com expoente em cima ou embaixo', () => {
    expect(fr('Alternativa A — (x + 4)²/25 + (y − 3)²/9 = 1')).toEqual(['(x + 4)²|25', '(y − 3)²|9']);
    expect(fr('cos θ = 1 − (x₁ − x₀)²/(2ℓ²)')).toEqual(['(x₁ − x₀)²|2ℓ²']);
    expect(fr('(mg)²/(2kF) daria 0,0005 m')).toEqual(['(mg)²|2kF']);
    expect(fr('9·10⁹·(10⁻⁷)²/(0,02)²')).toEqual(['(10⁻⁷)²|(0,02)²']);
    expect(fr('(√3)²/2')).toEqual(['(√3)²|2']);
    expect(fr('Kc = (0,012)²/0,030')).toEqual(['(0,012)²|0,030']);
  });
  it('potência com "^" é numerador ou denominador inteiro; o expoente com barra fica no expoente', () => {
    expect(fr('V(n) = 20^(n−1)/27^n')).toEqual(['20^(n−1)|27^n']);
    expect(fr('10^(−7,34)/10^(−7,44) = 10^(0,1)')).toEqual(['10^(−7,34)|10^(−7,44)']);
    expect(fr('I2 sobrou: 1×10^-4/2 = 5×10^-5 mol')).toEqual(['10^-4|2']);
    expect(fr('5^(3/2)/8')).toEqual(['5^(3/2)|8']);
    expect(fr('2744^(1/3)')).toEqual([]);
  });
  it('coeficiente colado ao grupo, grupos aninhados e função com base', () => {
    expect(fr('massa de sacarose = Mm(ΔT − 100)/(Ke + Kc).')).toEqual(['Mm(ΔT − 100)|Ke + Kc']);
    expect(fr('x = log2(y)/3')).toEqual(['log2(y)|3']);
    expect(fr('((x(x − 1))/2)/((3x(x − 1))/2) = 1/3')).toEqual(['(x(x − 1))/2|(3x(x − 1))/2', '1|3']);
    expect(fr('A = (a² × √((1 + √5)/2))/2')).toEqual(['a² × √((1 + √5)/2)|2']);
    expect(fr('(l√19/3)(l√17/3)/2 ≈ 0,998')).toEqual(['(l√19/3)(l√17/3)|2']);
    expect(fr('Sobra 90° − (Â + Ĉ)/2 = B̂/2.')).toEqual(['Â + Ĉ|2', 'B̂|2']);
    expect(fr('(x − 6)/(+) ≥ 0')).toEqual(['x − 6|+']);
  });
  it('barra em cadeia, quantidade e fórmula inteira sobre um número', () => {
    expect(fr('π = 3 × (27,1/164/3) × 0,086')).toEqual(['27,1/164|3']);
    expect(fr('em 21/11/2026 = 3')).toEqual([]);
    expect(fr('0,5 mol de H2/2 = 0,25 mol de O2')).toEqual(['0,5 mol de H2|2']);
    expect(fr('C4H10N2O4/2 = C2H5NO2')).toEqual(['C4H10N2O4|2']);
    expect(fr('o par H2O/CO2')).toEqual([]);
  });
  it('divisão com "÷": variável depois de "de", ângulo por tempo, razão entre nomes', () => {
    expect(fr('de p ÷ (p − 5) = 22 ÷ 17 sai p = 22')).toEqual(['p|p − 5', '22|17']);
    expect(fr('15° ÷ 15°/h = 1 h')).toEqual(['15°|15°/h']);
    expect(fr('alcance ÷ tempo de voo')).toEqual(['alcance|tempo de voo']);
    expect(fr('potência total ÷ potência por m²')).toEqual(['potência total|potência por m²']);
    expect(fr('[H+] final = soma dos n ÷ volume total')).toEqual([]);
    expect(fr('isola massa ÷ volume')).toEqual(['massa|volume']);
  });
  it('o texto não muda', () => {
    for (const s of ['π = 3 × (27,1/164/3) × 0,086', '0,5 mol de H2/2 = 0,25 mol', 'V(n) = 20^(n−1)/27^n', 'alcance ÷ tempo de voo'])
      expect(junta(s)).toBe(s);
  });
});

describe('revisão de 21/11, dados R1: barra que não é fração fica na linha', () => {
  const frm = (s: string, m?: string) => partesFracao(s, m).filter((p) => p.t === 'frac').map((p) => (p.t === 'frac' ? `${p.n}|${p.d}` : ''));
  it('anos e períodos, em todas as matérias', () => {
    for (const s of ['Conferência de Berlim (1884/1885).', 'safra 2009/2010', 'entre 2014/2015 e 2019/2020', 'depois de 1960/1970, com estradas',
      'Futurismo (≈1907/1909): Manifesto', 'questão 27 do IME 2022/2023, cujo gabarito', 'Em outra prova (2027/1, questão 15)'])
      expect(frm(s), s).toEqual([]);
    expect(frm('1215 e 1054/1378.', 'his')).toEqual([]);
    // Matemática: anos-número de conta continuam fração
    expect(frm('A = ln(2/3) + … + ln(1001/1002)')).toEqual(['2|3', '1001|1002']);
    expect(frm('1012/1013 não confere')).toEqual(['1012|1013']);
    expect(frm('Alternativa B — 288/2019')).toEqual(['288|2019']);
    expect(frm('o cone inteiro de (2000/3)π')).toEqual(['2000|3']);
  });
  it('lei, projeto, edital e comunicado', () => {
    for (const s of ['regulação (PL 2.338/23) só aparece', 'projeto de lei (PL 404/17)', '"LEI FEDERAL Nº 9 605/98"', 'BRASIL. Lei n. 10 639/2003',
      'Lei Complementar federal 14/1973 (oito RMs) e 20/1974 (Rio)', 'Lei Complementar estadual 90/2013, não', 'CONAMA 275/2001: verde = vidro',
      'no Comunicado 81/2025-CEV/UECE, que', 'preliminar (Edital nº 89/25-CPV), com', 'Anvisa, RDC 360/2003 (Anexo)', 'Leis Complementares 124 e 125/2007 e 129/2009',
      'Resoluções Condel/Sudene 150/2021, 155/2022, 163/2022 e 176/2024', 'art. 2º: CF/1988; ligação'])
      expect(frm(s), s).toEqual([]);
  });
  it('datas', () => {
    expect(frm('"De 31/5 a 7/6."', 'por')).toEqual([]);
    expect(frm('Declarações de guerra em 3/9.', 'his')).toEqual([]);
    expect(frm('comício (13/3), marcha (19/3), Revolta (25/3) e golpe em 31/3 e 1/4, início', 'his')).toEqual([]);
    expect(frm('13/6 MetLife (Nova York) → 19/6 Lincoln Financial Field → 24/6 Hard Rock', 'geo')).toEqual([]);
    expect(frm('"Israel anunciou nesta terça-feira (10/6) que"', 'geo')).toEqual([]);
    expect(frm('10/04 e 10/10: intermediárias', 'geo')).toEqual([]);
    expect(frm('levante em 3/10 e junta até 3/11/1930', 'his')).toEqual([]);
    // intervalo de datas também em Matemática
    expect(frm('Conte os dias de 3/1 a 15/4')).toEqual([]);
    expect(frm('a cada 18 dias (de 19/3 a 6/4)')).toEqual([]);
  });
  it('fora das matérias de texto, número/número fora de conta continua fração', () => {
    expect(frm('A sai de parar em 1/3: é a chance')).toEqual(['1|3']);
    expect(frm('a função sobe até 1/2 e depois desce')).toEqual(['1|2']);
    expect(frm('Altura da pirâmide 13/2 e meia aresta 13/2.')).toEqual(['13|2', '13|2']);
    expect(frm('Parar na soma dos três termos dados (19/6) e esquecer')).toEqual(['19|6']);
    expect(frm('22/6 → 11/3 → 3,67')).toEqual(['22|6', '11|3']);
    expect(frm('compare com 24/6 e 24/4.')).toEqual(['24|6', '24|4']);
    expect(frm('1,0 A sai de 20/20, como se')).toEqual(['20|20']);
    expect(frm('escreva 1 como 2/2')).toEqual(['2|2']);
    // nas matérias de texto, a fração de verdade continua empilhada
    expect(frm('"cerca de 1/3 dos que cumpriram pena"', 'fs')).toEqual(['1|3']);
    expect(frm('costa (3/4), área (11%)', 'ing')).toEqual(['3|4']);
    expect(frm('2 sai de dividir 40 pelo diâmetro, 40/20, o que', 'geo')).toEqual(['40|20']);
    expect(frm('125 − 63 = 62 | 62/63 ≈ 0,98', 'geo')).toEqual(['62|63']);
  });
  it('linhas, medida, siglas, pares, itens e verso', () => {
    expect(frm('linhas 16/17: assunto · linhas 28/29: a resposta', 'por')).toEqual([]);
    expect(frm('PA ≈ 120/80 mmHg (sistólica/diastólica)')).toEqual([]);
    expect(frm('o trabalho era 24/7.', 'ing')).toEqual([]);
    expect(frm('Redação 50/50 da Fuvest 2025', 'por')).toEqual([]);
    expect(frm('por isso a mistura não sai 50/50.')).toEqual([]);
    expect(frm('Hashimoto → T3/T4 ↓ → TSH ↑')).toEqual([]);
    expect(frm('mimetismo (1a/1b); camuflagem (3a/3b).')).toEqual([]);
    expect(frm('Alotropia é de elemento (O2/O3), nunca')).toEqual([]);
    expect(frm('em qualquer caso, a mistura 46/47 se forma')).toEqual([]);
    expect(frm('RJ/ES = carvão, não vegetal', 'geo')).toEqual([]);
    expect(frm('AC/DC é banda de hard rock', 'fs')).toEqual([]);
    expect(frm('Vogal + r/s dobra a consoante', 'por')).toEqual([]);
    expect(frm('V/F: basta um dado errado', 'geo')).toEqual([]);
    expect(frm('"Sem que veja a Rua 15 / E o progresso de São Paulo"', 'por')).toEqual([]);
    expect(frm('Sem que veja a Rua 15 / E o progresso')).toEqual([]);
    expect(frm('I - H / II - D / III - F / IV - C → alternativa E')).toEqual([]);
    for (const s of ['PF / PE', 'HF / HI', 'R / P', 'E / W', 'NS / NR']) expect(frm(s), s).toEqual([]);
    // conta com as mesmas formas continua fração
    expect(frm('tg 30° = DC/AC = √3/3 → AC/DC = 3/√3 = √3')).toEqual(['DC|AC', '√3|3', 'AC|DC', '3|√3']);
    expect(frm('a = 10/10 = 1 m/s²')).toEqual(['10|10']);
    expect(frm('temperatura entra direta (T2/T1).')).toEqual(['T2|T1']);
    expect(frm('Produto das raízes a/a = 1')).toEqual(['a|a']);
    expect(frm('d = m / V')).toEqual(['m|V']);
  });
  it('o texto não muda', () => {
    for (const s of ['"De 31/5 a 7/6."', 'PL 2.338/23', 'Rua 15 / E o progresso'])
      expect(partesFracao(s, 'por').map((p) => (p.t === 'txt' ? p.v : p.orig)).join('')).toBe(s);
  });
});

describe('numerador entre colchetes e fatorial embaixo (revisão de 21/11, passada 3 N3)', () => {
  it('colchete em cima empilha: valor posto no lugar, grupo, concentração e variação', () => {
    // mat Pba9549df, erradas C
    expect(fr('com x = 1 a expressão vale 2·[1]/(4·[3]) = 2/12 = 1/6.')).toEqual(['2·[1]|4·[3]', '2|12', '1|6']);
    expect(fr('[x(x + 1) − 2x(x − 1)]/((x − 1)(x + 1)) = (−x² + 3x)/((x − 1)(x + 1))')).toEqual(['[x(x + 1) − 2x(x − 1)]|(x − 1)(x + 1)', '−x² + 3x|(x − 1)(x + 1)']);
    expect(fr('4[(t + Δt)² − t²]/Δt = 4(2t + Δt)')).toEqual(['4[(t + Δt)² − t²]|Δt']);
    expect(fr('sen a cos b = [sen(a + b) + sen(a − b)]/2')).toEqual(['[sen(a + b) + sen(a − b)]|2']);
    expect(fr('Ka ≈ [H+]²/C → [H+] = √(Ka · C)')).toEqual(['[H+]²|C']);
    expect(fr('Q = [NH3]²/([N2] × [H2]³) fica menor')).toEqual(['[NH3]²|[N2] × [H2]³']);
    expect(fr('o quociente [CO][H2]³/([CH4][H2O]) abaixo de K')).toEqual(['[CO][H2]³|[CH4][H2O]']);
    expect(fr('taxa = −Δ[reagente]/Δt = Δ[produto]/Δt')).toEqual(['Δ[reagente]|Δt', 'Δ[produto]|Δt']);
    // o grupo de dentro continua uma fração, desenhada dentro do numerador
    expect(fr('[Vmáx × (T₁ + T₂)/2]/(T₁ + T₂)')).toEqual(['[Vmáx × (T₁ + T₂)/2]|T₁ + T₂']);
  });
  it('colchete embaixo não tem onde terminar: fica na linha, como antes', () => {
    expect(fr('pH = pKa + log [A⁻]/[HA]')).toEqual([]);
    expect(fr('Kc = [C]²/[A]·[B]')).toEqual([]);
    expect(fr('Ka = [H⁺] × [CN⁻]/[HCN]')).toEqual([]);
  });
  it('fatorial embaixo fica com o número de baixo', () => {
    expect(fr('C(n, 5) = [n(n − 1)(n − 2)(n − 3)(n − 4)]/5!')).toEqual(['[n(n − 1)(n − 2)(n − 3)(n − 4)]|5!']);
    expect(fr('40320 → 40320/3! = 40320/6')).toEqual(['40320|3!', '40320|6']);
    expect(fr('210/3! = 210/6 = 35')).toEqual(['210|3!', '210|6']);
    expect(fr('x/2 != 3')).toEqual(['x|2']);
  });
  it('o texto não muda', () => {
    for (const s of ['vale 2·[1]/(4·[3]) = 2/12', 'Δ[NH3]/Δt', '[n(n − 1)]/5! = 10', '40320/3! = 6720'])
      expect(junta(s)).toBe(s);
  });
});

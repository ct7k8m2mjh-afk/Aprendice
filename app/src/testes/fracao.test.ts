import { describe, expect, it } from 'vitest';
import { contaEhTexto, materiaDoCodigo, partesFracao } from '../logica/fracao';

const fr = (s: string) => partesFracao(s).filter((p) => p.t === 'frac').map((p) => (p.t === 'frac' ? `${p.n}|${p.d}` : ''));
const junta = (s: string) => partesFracao(s).map((p) => (p.t === 'txt' ? p.v : p.orig)).join('');
const nuc = (s: string) => partesFracao(s).filter((p) => p.t === 'nuc').map((p) => (p.t === 'nuc' ? `${p.a}|${p.z}` : ''));

describe('fração empilhada', () => {
  it('acha frações numéricas e algébricas simples', () => {
    expect(fr('2/5 × 1/8')).toEqual(['2|5', '1|8']);
    expect(fr('(2 × 1) ÷ (5 × 8) = 2/40')).toEqual(['2|40']);
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
    expect(fr('(6 × √5) ÷ 5 = 6√5/5 ≈ 2,68 cm')).toEqual(['6√5|5']);
    expect(fr('3 × (3 ÷ 5) ÷ (2 ÷ √5) = 9√5/10 ≈ 2,01 cm')).toEqual(['9√5|10']);
    expect(fr('= 12√5/5 ≈ 5,37 cm')).toEqual(['12√5|5']);
    expect(fr('7√3/2 não confere')).toEqual(['7√3|2']);
    expect(fr('3√34/85 é 6 ÷ (5√34)')).toEqual(['3√34|85']);
    expect(fr('5√34/85 é 10 ÷ (5√34)')).toEqual(['5√34|85']);
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
      ['1 par de bases = 2 bases, então 100 pares = 200 bases', 'bio'],
      ['16 pares = 32 cromossomos nas células somáticas, ou seja, 2n = 32', 'bio'],
    ]) expect(contaEhTexto(s, m)).toBe(true);
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

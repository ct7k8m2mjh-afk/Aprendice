import { describe, expect, it } from 'vitest';
import { contaEhTexto, partesFracao } from '../logica/fracao';

const fr = (s: string) => partesFracao(s).filter((p) => p.t === 'frac').map((p) => (p.t === 'frac' ? `${p.n}|${p.d}` : ''));
const junta = (s: string) => partesFracao(s).map((p) => (p.t === 'txt' ? p.v : p.orig)).join('');

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
      '0,05 atm · L/K', '1,2 × 10³ J/(kg °C)', 'R em J/(mol·K)', 'cor do par F/C'])
      expect(fr(s)).toEqual([]);
  });
  it('o texto não muda', () => {
    for (const s of ['2/5 × 1/8 = 2/40', 'x = (2·1)/2 em 10 m/s', 'nada aqui', '']) expect(junta(s)).toBe(s);
  });
});

describe('conta ou texto', () => {
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

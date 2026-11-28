import { describe, expect, it } from 'vitest';
import { partesFracao } from '../logica/fracao';
import { tokeniza } from '../logica/motorConta';

/* Revisão de 21/11/2026, 5ª passada, item X1: fórmula escrita com palavras ("potência = trabalho/tempo") empilha em
 * Matemática, Física e Química; a barra de "ou", unidades, versos e matérias de texto ficam na linha. */
const fr = (s: string, m?: string) => partesFracao(s, m).filter((p) => p.t === 'frac').map((p) => (p.t === 'frac' ? `${p.n}|${p.d}` : ''));
const junta = (s: string, m?: string) => partesFracao(s, m).map((p) => (p.t === 'txt' ? p.v : p.orig)).join('');
const fr2 = (s: string, m?: string, inteira = false) => partesFracao(s, m, inteira).filter((p) => p.t === 'frac').map((p) => (p.t === 'frac' ? `${p.n}|${p.d}` : ''));

describe('X1: palavra/palavra numa igualdade empilha em Mat, Fís e Quí', () => {
  it('os exemplos do pedido', () => {
    expect(fr('potência = trabalho/tempo', 'fis')).toEqual(['trabalho|tempo']);
    expect(fr('densidade = massa/volume', 'fis')).toEqual(['massa|volume']);
    expect(fr('f = voltas/tempo', 'fis')).toEqual(['voltas|tempo']);
    expect(fr('n = massa/massa molar', 'qui')).toEqual(['massa|massa molar']);
  });
  it('nome composto embaixo vai até a pontuação, outra operação ou o fim', () => {
    expect(fr('quantidade (mol) = massa/massa molar', 'qui')).toEqual(['massa|massa molar']);
    expect(fr('Mols = massa/massa molar: massa molar grande dá menos mols por grama.', 'qui')).toEqual(['massa|massa molar']);
    expect(fr('mol = massa/massa molar (H2O = 18; O2 = 32 g/mol)', 'qui')).toEqual(['massa|massa molar']);
    expect(fr('letalidade (%) = óbitos/casos × 100', 'mat')).toEqual(['óbitos|casos']);
    expect(fr('reajuste = novo salário/salário atual − 1', 'mat')).toEqual(['novo salário|salário atual']);
    expect(fr('número de fusões = energia por segundo/energia de uma fusão', 'fis')).toEqual(['energia por segundo|energia de uma fusão']);
    expect(fr('dias = população/capacidade diária, arredondado para cima', 'mat')).toEqual(['população|capacidade diária']);
    expect(fr('n = tempo total/tempo para dobrar', 'mat')).toEqual(['tempo total|tempo para dobrar']);
    expect(fr('fração restante = (1/2)ⁿ, com n = tempo/meia-vida', 'fis')).toEqual(['1|2', 'tempo|meia-vida']);
    expect(fr('razão = com restrição/sem restrição', 'mat')).toEqual(['com restrição|sem restrição']);
    const s = 'Corrente = potência/tensão = 3,0/12, mas errou a vírgula.';
    expect(fr(s, 'fis')).toEqual(['potência|tensão', '3,0|12']);
    expect(junta(s, 'fis')).toBe(s);
  });
  it('a outra parcela da soma e o outro lado da igualdade empilham junto', () => {
    const s = 'tempo = distância na areia/velocidade na areia + distância na água/velocidade na água';
    expect(fr(s, 'fis')).toEqual(['distância na areia|velocidade na areia', 'distância na água|velocidade na água']);
    expect(junta(s, 'fis')).toBe(s);
    expect(fr('Prédio/sombra do prédio = poste/sombra do poste.', 'mat')).toEqual(['Prédio|sombra do prédio', 'poste|sombra do poste']);
    expect(fr('Câmara escura: imagem/objeto = profundidade da câmara/distância do objeto.', 'fis'))
      .toEqual(['imagem|objeto', 'profundidade da câmara|distância do objeto']);
    expect(fr('peso específico = peso/volume | densidade = massa/volume | viscosidade', 'fis')).toEqual(['peso|volume', 'massa|volume']);
    expect(fr('Q fria/Q quente = T fria/T quente: rejeita 500 J', 'fis')).toEqual(['Q fria|Q quente', 'T fria|T quente']);
  });
  it('fim inseguro, "ou", unidade e símbolo com o resto da frase ficam na linha', () => {
    // sem pontuação depois, o fim do nome de baixo não é seguro
    expect(fr('mas corrente = tensão/resistência cai quando a resistência cresce', 'fis')).toEqual([]);
    expect(fr('P = favoráveis/possíveis e depois multiplica por 2', 'mat')).toEqual([]);
    // barra de "ou"
    expect(fr('altura = agudo/grave = frequência', 'fis')).toEqual([]);
    expect(fr('sexo = masculino/feminino', 'mat')).toEqual([]);
    expect(fr('HCC = alcanos/alcenos normais + mono', 'qui')).toEqual([]);
    expect(fr('responda e/ou justifique', 'mat')).toEqual([]);
    // unidades
    expect(fr('esteira = cal/min; bicicleta', 'mat')).toEqual([]);
    expect(fr('c = concentração em mol/L', 'qui')).toEqual([]);
    expect(fr('custo = 15 × saco + frete/km × km', 'mat')).toEqual([]);
    // símbolo de um lado só: a razão é a dos símbolos, como antes
    expect(fr('P = U²/R menor', 'fis')).toEqual(['U²|R']);
    expect(fr('Δm = Q/L de gelo.', 'fis')).toEqual(['Q|L']);
    // fora de igualdade
    expect(fr('a porcentagem massa/volume', 'qui')).toEqual([]);
    expect(fr('o par ácido fraco/base conjugada', 'qui')).toEqual([]);
  });
  it('dentro de outra fração e na conta animada também empilha', () => {
    // numerador e denominador inteiros (inteira = true)
    expect(fr2('força/tempo²', 'fis', true)).toEqual(['força|tempo²']);
    expect(fr2('massa/M', 'qui', true)).toEqual(['massa|M']);
    // texto solto com a mesma forma fica na linha
    expect(fr2('cis/trans', 'qui')).toEqual([]);
    expect(fr2('cis/trans', 'qui', true)).toEqual([]);
    expect(fr2('Copese/UFT', 'fis')).toEqual([]);
    expect(fr2('força/tempo²', 'por', true)).toEqual([]);
    // tokens da resolução animada levam a matéria
    const ts = tokeniza('B/A = (força/tempo²)/(força/comprimento) = comprimento/tempo²', 'fis');
    const fs = ts.filter((t) => t.k === 'frac');
    expect(fs.map((t) => `${t.n}|${t.d}`)).toEqual(['B|A', 'força/tempo²|força/comprimento', 'comprimento|tempo²']);
    expect(fs[1].nt!.filter((t) => t.k === 'frac').map((t) => `${t.n}|${t.d}`)).toEqual(['força|tempo²']);
    expect(ts.map((t) => t.v).join('')).toBe('B/A = (força/tempo²)/(força/comprimento) = comprimento/tempo²');
    expect(tokeniza('EC = consumo/massa', 'mat').filter((t) => t.k === 'frac').map((t) => `${t.n}|${t.d}`)).toEqual(['consumo|massa']);
    expect(tokeniza('EC = consumo/massa').filter((t) => t.k === 'frac')).toEqual([]);
  });
  it('nas matérias de texto e sem matéria continua na linha', () => {
    for (const m of ['por', 'his', 'geo', 'ing', 'bio', undefined]) {
      expect(fr('potência = trabalho/tempo', m)).toEqual([]);
      expect(fr('densidade = massa/volume', m)).toEqual([]);
    }
    expect(fr('Amor = fogo/que arde sem se ver,', 'por')).toEqual([]);
  });
});

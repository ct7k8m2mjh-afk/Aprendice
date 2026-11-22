import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { partesFracao } from '../logica/fracao';
import { comFracoes, MateriaDoTexto } from '../ui/Fracao';

/* Revisão de 21/11/2026, 10ª passada, C3 (questao-correcao-10.md): fração na linha no título do passo */
const fracs = (s: string, m: string, titulo = true) => partesFracao(s, m, false, titulo).filter((p) => p.t === 'frac').map((p) => p.orig);

describe('C3: título do passo com variável sobre variável empilha', () => {
  it.each([
    ['fis', 'Calcule T/V em cada ponto', 'T/V'],
    ['fis', 'h/g', 'h/g'],
    ['fis', 'Cancele L² e isole L/S', 'L/S'],
    ['fis', 'Calcule ΔT/Δt de cada uma', 'ΔT/Δt'],
    ['fis', 'Isole ΔV/ΔT', 'ΔV/ΔT'],
    ['fis', 'Mostre que V/T não muda', 'V/T'],
    ['fis', 'Escreva cada resistência com L/(k·A)', 'L/(k·A)'],
    ['mat', 'Calcule (ab)/c', '(ab)/c'],
    // os que já empilhavam continuam
    ['mat', 'Calcule a/b²', 'a/b²'],
    ['mat', 'Ache a fração AP/AC', 'AP/AC'],
    ['mat', 'Some i/j em todos os pares distintos', 'i/j'],
    ['mat', 'Calcule o quociente a/b', 'a/b'],
    ['fis', 'Iguale e isole D/R', 'D/R'],
    ['fis', 'Troque λ por c/f', 'c/f'],
    ['fis', 'Passe da aceleração para q/m', 'q/m'],
    ['fis', 'Isole v/R', 'v/R'],
  ])('%s "%s"', (m, s, f) => {
    expect(fracs(s, m)).toEqual([f]);
  });
  it.each([
    ['mat', 'Converta para m/s'], ['mat', 'Converta 45 km/h'], ['mat', 'Calcule preço/massa'], ['mat', 'Média em 07/05'],
    ['mat', 'Conte os dias de 3/1 a 15/4'], ['qui', 'Traduza 10% m/v'], ['qui', 'Avalie a concentração m/V'],
    ['qui', 'Monte a pilha M/Cu'], ['qui', 'Teste a dupla Mg / Cu2+'], ['qui', 'Converta g/L em mol/L'], ['qui', 'Elimine enantiômeros e cis/trans'],
    ['qui', 'Julgue as alternativas como aldeído/cetona'], ['bio', 'Classifique o par 1a/1b'], ['bio', 'Elimine as que não têm + / +'],
    ['fis', 'Calcule para cada mola (g = 10 m/s²)'], ['fis', 'Teste campo/carga (C)'], ['fis', 'Em k·kgf/cm²'], ['fis', 'Converta para cm/s e conclua'],
    ['por', "Teste a troca 'minha vida' / 'vida minha'"], ['geo', 'Leia o conjunto bicicleta/ciclista'],
  ])('%s "%s" continua na linha', (m, s) => {
    expect(fracs(s, m)).toEqual([]);
  });
  it('fora do título nada muda (texto corrido e contas)', () => {
    expect(fracs('Calcule T/V em cada ponto', 'fis', false)).toEqual([]);
    expect(fracs('isole L/S', 'fis', false)).toEqual([]);
  });
  it('fís P5a001974: o título sai com a fração empilhada na tela', () => {
    const html = renderToStaticMarkup(createElement(MateriaDoTexto.Provider, { value: 'fis' }, comFracoes('Calcule T/V em cada ponto', false, true)));
    expect(html).toContain('class="frac');
    expect(renderToStaticMarkup(createElement(MateriaDoTexto.Provider, { value: 'fis' }, comFracoes('Calcule T/V em cada ponto')))).not.toContain('class="frac');
  });
});

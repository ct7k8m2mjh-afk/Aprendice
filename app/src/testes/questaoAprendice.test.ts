import { describe, expect, it } from 'vitest';
import { separaArmadilhas } from '../logica/questaoAprendice';

// Revisão do site de 19/11/2026 (questao-correcao.md item 20): Questão Aprendice da revisão essencial nos 4 blocos
describe('armadilhas da Questão Aprendice por letra', () => {
  it('uma armadilha por letra, separadas por ponto e vírgula (Q01)', () => {
    const r = separaArmadilhas('Armadilhas: tomar os 36 elétrons como Z (B); subtrair 2 em vez de somar, o que dá Z = 34 (A); ler o período no íon, com 4 camadas (D); tomar o A como nêutrons (E).', 'C');
    expect(Object.keys(r.porLetra).sort()).toEqual(['A', 'B', 'D', 'E']);
    expect(r.porLetra.B).toBe('Tomar os 36 elétrons como Z (B).');
    expect(r.porLetra.A).toBe('Subtrair 2 em vez de somar, o que dá Z = 34 (A).');
    expect(r.pegadinha).toBe('Tomar os 36 elétrons como Z (B).');
  });
  it('separadas por ponto, com número decimal no meio (Q07)', () => {
    const r = separaArmadilhas('Sem inverter a equação do C₂H₄: soma −1411 e dá −2771 (A). Sem dobrar a 2ª: +337 (D). Sem dobrar nenhuma das duas primeiras: +731 (E). −51 (B) é a reação contrária, C₂H₄ → 2 C + 2 H₂.', 'C');
    expect(Object.keys(r.porLetra).sort()).toEqual(['A', 'B', 'D', 'E']);
    expect(r.porLetra.D).toBe('Sem dobrar a 2ª: +337 (D).');
    expect(r.porLetra.B).toBe('−51 (B) é a reação contrária, C₂H₄ → 2 C + 2 H₂.');
  });
  it('uma armadilha só: ela é a pegadinha e explica a letra que ela leva (Q06)', () => {
    const t = 'A armadilha típica leva à C: usar 22,4 L/mol, que só vale nas CNTP (0 °C e 1 atm), dá M ≈ 58 g/mol, que é o butano; aqui a temperatura é 27 °C, então a conta correta é por PV = nRT.';
    const r = separaArmadilhas(t, 'D');
    expect(r.porLetra.C).toMatch(/^A armadilha típica leva à C/);
    expect(r.pegadinha).toBe(t);
    expect(r.porLetra.D).toBeUndefined();
  });
  it('a letra certa nunca recebe "por que errei"', () => {
    expect(separaArmadilhas('marcar a C (C) por engano; errar a conta (A)', 'C').porLetra.C).toBeUndefined();
    expect(separaArmadilhas('', 'A')).toEqual({ porLetra: {}, pegadinha: '' });
  });
});

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/* Revisão de 21/11/2026, questão-correção 2 R10: número de massa em cima ("²³⁵U"), como nas outras resoluções; o texto
 * da prova (prova.json) não muda */
describe('R10: número de massa sobrescrito na resolução de qui Pd7109aee', () => {
  it('nenhum "235U" na linha', () => {
    const r = readFileSync(join(__dirname, '..', '..', 'conteudo-fonte', 'provas', 'ufam-psc3-2026', 'resolucoes-qui.json'), 'utf-8');
    const res = JSON.parse(r).Pd7109aee;
    const txt = JSON.stringify(res);
    expect(txt).not.toMatch(/(?<![\d⁰-⁹²³¹])235U/);
    expect(res.resolucao.passos[2].conta).toBe('²³⁵U em arma → fissão em cadeia → explosão de grande energia');
  });
});

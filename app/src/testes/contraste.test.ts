import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { MATERIAS } from '../dados/materias';
import { ALVO_LETRA, contraste, fundosDaLetra, mistura, piorContraste } from '../logica/contraste';

// Decisão do dono (19/11/2026; revisão do site, questao-correcao.md item 12): a cor da matéria como LETRA tem ≥ 4,5:1 em
// todo fundo onde aparece; só a letra muda (--t-texto), fundos, ícones e paleta ficam.
describe('tom de letra da matéria (--t-texto)', () => {
  it('contraste da conta: valores conhecidos', () => {
    expect(contraste('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
    expect(contraste('#FFFFFF', '#FFFFFF')).toBeCloseTo(1, 5);
    expect(mistura('#000000', 0.5, '#FFFFFF')).toBe('#808080');
    // medidas do revisor: Física clara sobre o fundo suave 4,40; História escura 3,94
    expect(contraste('#B2580D', '#FFF0E8')).toBeCloseTo(4.40, 1);
    expect(contraste('#B77B4C', '#472302')).toBeCloseTo(3.94, 1);
  });
  for (const m of MATERIAS) {
    it(`${m.id}: ≥ 4,5:1 nos dois temas, sem mudar o que já passava`, () => {
      const fc = fundosDaLetra(m.paleta.principal, m.paleta.fundoClaro, 'claro');
      const fe = fundosDaLetra(m.paleta.principal, m.paleta.fundoEscuro, 'escuro');
      expect(piorContraste(m.letra.claro, fc)).toBeGreaterThanOrEqual(ALVO_LETRA);
      expect(piorContraste(m.letra.escuro, fe)).toBeGreaterThanOrEqual(ALVO_LETRA);
      if (piorContraste(m.paleta.textoClaro, fc) >= ALVO_LETRA) expect(m.letra.claro).toBe(m.paleta.textoClaro);
      if (piorContraste(m.paleta.textoEscuro, fe) >= ALVO_LETRA) expect(m.letra.escuro).toBe(m.paleta.textoEscuro);
      // a mesma cor: no máximo 20% de preto ou de branco misturado
      const perto = (a: string, b: string) => [0, 2, 4].every((i) => Math.abs(parseInt(a.slice(1 + i, 3 + i), 16) - parseInt(b.slice(1 + i, 3 + i), 16)) <= 0.2 * 255);
      expect(perto(m.letra.claro, m.paleta.textoClaro)).toBe(true);
      expect(perto(m.letra.escuro, m.paleta.textoEscuro)).toBe(true);
      // a paleta não muda
      expect(m.claro.t).toBe(m.paleta.textoClaro);
      expect(m.escuro.t).toBe(m.paleta.textoEscuro);
    });
  }
  it('no CSS, letra na cor da matéria usa --t-texto (--t fica para ícone, borda, barra e foco)', () => {
    const dir = 'src/estilo';
    const ruins: string[] = [];
    for (const f of readdirSync(dir).filter((x) => x.endsWith('.css'))) {
      readFileSync(`${dir}/${f}`, 'utf8').split('\n').forEach((l, i) => {
        if (/(?<![-\w])color:\s*var\(--t\)/.test(l) && !/^\s*[^{]*\.(?:ic|g|fl-tema-ic|preparo-ic|ic3d-vazio|cm-arte-vazia)\b[^{]*\{/.test(l)) ruins.push(`${f}:${i + 1}: ${l.trim().slice(0, 80)}`);
      });
    }
    expect(ruins).toEqual([]);
  });
});

import { describe, expect, it } from 'vitest';
import { juntaQuebrasDoPdf, perdeDestaque } from '../logica/transcricao';

// Revisão do site de 19/11/2026 (questao-correcao.md itens 4 e 5): transcrição organizada como a banca organizou
describe('quebras de linha da transcrição', () => {
  it('quebra do PDF no meio da frase, num parágrafo de prosa, vira espaço', () => {
    const t = 'A fermentação láctica pode ser realizada por bactérias e fungos, enquanto as células da\nmusculatura do corpo dos animais realizam fermentação acética, segundo o que se afirma a seguir no texto.';
    expect(juntaQuebrasDoPdf(t, 'bio')).not.toContain('\n');
    const p = 'Em 1976, o compositor e cantor Belchior lançou a música que traz a seguinte estrofe sobre a vida e os horrores do mundo moderno, e a vida realmente é\ndiferente do que se canta.';
    expect(juntaQuebrasDoPdf(p, 'his')).toBe(p.replace('\n', ' '));
  });
  it('afirmativa numerada e comando da questão em linhas curtas do PDF', () => {
    expect(juntaQuebrasDoPdf('IV. A fermentação láctica pode ser realizada por\nbactérias e fungos, enquanto as células da\nmusculatura do corpo dos animais realizam\nfermentação acética.', 'bio'))
      .toBe('IV. A fermentação láctica pode ser realizada por bactérias e fungos, enquanto as células da musculatura do corpo dos animais realizam fermentação acética.');
    expect(juntaQuebrasDoPdf('Atente para o que se afirma a seguir sobre\nfermentação:', 'bio')).toBe('Atente para o que se afirma a seguir sobre fermentação:');
  });
  it('verso, estrofe, negrito atravessando a quebra e Português ficam', () => {
    const verso = 'Leia o trecho a seguir da música “Ciranda da Bailarina”, de Edu Lobo e Chico Buarque.\n**Procurando bem\nTodo mundo tem pereba\nMarca de bexiga ou vacina**\nNeste trecho';
    expect(juntaQuebrasDoPdf(verso, 'bio')).toBe(verso);
    const estrofe = 'Caminho de grota\nmaioria é calado\nremói terra de quintal\naflora na rua quando quer';
    expect(juntaQuebrasDoPdf(estrofe, 'geo')).toBe(estrofe);
    const drummond = 'Provisoriamente não cantaremos o amor, que se refugiou mais abaixo dos subterrâneos, longe de tudo o que existe.\nCantaremos o medo, que esteriliza os abraços,\nnão cantaremos o ódio porque esse não existe,';
    expect(juntaQuebrasDoPdf(drummond, 'por')).toBe(drummond);
    const negrito = 'Texto comprido de apresentação do trecho que vem a seguir, com mais de cento e dez letras para correr na largura.\n**um verso que começa com minúscula e vai longe,\ne continua no outro verso**';
    expect(juntaQuebrasDoPdf(negrito, 'his')).toContain('longe,\ne continua');
  });
  it('linha que termina a frase não se junta', () => {
    const t = 'Um texto longo de prosa que termina aqui com ponto final e tem tamanho de linha de jornal comum.\nOutra frase começa com maiúscula.';
    expect(juntaQuebrasDoPdf(t, 'bio')).toBe(t);
  });
});

describe('sublinhado da prova', () => {
  const tr = (t: string) => ({ enun: [{ a: 'e' as const, t }], alts: { A: 'nega.' } });
  it('fala do termo sublinhado sem a marcação: só o print mostra', () => {
    expect(perdeDestaque(tr('Em “não trai a sua existência”, o termo sublinhado pode ser substituído por:'))).toBe(true);
    expect(perdeDestaque(tr('A palavra grifada no texto indica'))).toBe(true);
  });
  it('com a marcação, ou sem falar de sublinhado, a transcrição basta', () => {
    expect(perdeDestaque(tr('Em “não __trai__ a sua existência”, o termo sublinhado pode ser substituído por:'))).toBe(false);
    expect(perdeDestaque(tr('Complete a lacuna: o ______ do texto.'))).toBe(false);
    expect(perdeDestaque(undefined)).toBe(false);
  });
});

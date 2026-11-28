import { describe, expect, it } from 'vitest';
import { ordenaBusca, raiz } from '../logica/busca';

describe('busca: singular e plural, relevância (revisão de 19/11/2026, casca 28)', () => {
  it('raiz casa singular e plural', () => {
    expect(raiz('funções')).toBe(raiz('função'));
    expect(raiz('células')).toBe(raiz('célula'));
    expect(raiz('animais')).toBe(raiz('animal'));
  });
  it('"função" acha o tema no plural e põe conteúdos e temas antes dos cartões', () => {
    const itens = [
      { grupo: 'Flashcards', titulo: 'Função do ribossomo?', det: 'Flashcard · Biologia' },
      { grupo: 'Temas', titulo: 'Funções afim e quadrática', det: 'Matemática' },
      { grupo: 'Conteúdos', titulo: 'Função exponencial', det: 'Matemática · Funções' },
      { grupo: 'Flashcards', titulo: 'O que é ATP?', det: 'Flashcard · Biologia' },
    ];
    const r = ordenaBusca(itens, 'função').map((x) => x.grupo + ':' + x.titulo);
    expect(r).toEqual(['Temas:Funções afim e quadrática', 'Conteúdos:Função exponencial', 'Flashcards:Função do ribossomo?']);
  });
});

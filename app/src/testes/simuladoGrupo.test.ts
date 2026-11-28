import { describe, expect, it } from 'vitest';
import { grupoDoItem } from '../telas/SimuladoExec';

// dono, 27/11/2026: no simulado de prova inteira, o grupo (rótulo e acertos por matéria) é a matéria da questão,
// não a área impressa na prova; no simulado por conteúdo continua o conteúdo.
describe('grupoDoItem', () => {
  it('prova completa usa a matéria classificada, não a área impressa', () => {
    expect(grupoDoItem({ p: 'saocamilo-2024-2', a: 'Conhecimentos gerais', m: 'mat' })).toBe('Matemática');
    expect(grupoDoItem({ p: 'saocamilo-2020-1', a: 'Geografia', m: 'fs' })).toBe('Filosofia e Sociologia');
  });
  it('prova completa sem matéria do site fica com a área', () => {
    expect(grupoDoItem({ p: 'x', a: 'Arte' })).toBe('Arte');
  });
  it('simulado por conteúdo continua agrupando pelo conteúdo', () => {
    expect(grupoDoItem({ m: 'mat', a: 'áreas compostas e hachuradas' })).toBe('áreas compostas e hachuradas');
  });
});

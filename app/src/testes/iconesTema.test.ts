// Comando 19 do dono: ícones de tema novos (docs/icones/<matéria>/<id>-<nome>.png) são os ÚNICOS ícones da matéria
// no site; subtemas sem ícone; os PNG originais ficam guardados em docs/icones/.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ICONES_TEMA } from '../dados/iconesTema';

const APP = resolve(__dirname, '../..');
const DOCS = resolve(APP, '../docs/icones');
const PASTA: Record<string, string> = { bio: 'biologia', qui: 'quimica' };

describe('ícones de tema (comando 19)', () => {
  it('Biologia e Química têm os 12 temas, cada um com o PNG original guardado', () => {
    for (const [m, l] of [['bio', 'B'], ['qui', 'Q']]) {
      expect(ICONES_TEMA[m]).toEqual(Array.from({ length: 12 }, (_, i) => l + String(i + 1).padStart(2, '0')));
      const pngs = readdirSync(resolve(DOCS, PASTA[m])).filter((f) => f.endsWith('.png'));
      for (const id of ICONES_TEMA[m]) expect(pngs.some((f) => f.startsWith(id + '-'))).toBe(true);
    }
  });

  it('o site tem só os ícones novos dessas matérias (sem os antigos de subtema), em WebP leve e com os ids dos temas', () => {
    for (const [m, ids] of Object.entries(ICONES_TEMA)) {
      const pasta = resolve(APP, 'public/conteudo', m, 'ic');
      if (!existsSync(pasta)) continue; // conteúdo ainda não gerado neste ambiente
      expect(readdirSync(pasta).sort()).toEqual(ids.map((id) => id + '.webp'));
      const temas = JSON.parse(readFileSync(resolve(APP, 'public/conteudo', m, 'materia.json'), 'utf8')).modulos.map((x: { id: string }) => x.id);
      for (const id of ids) {
        expect(temas).toContain(id);
        const b = readFileSync(resolve(pasta, id + '.webp'));
        expect(b.subarray(8, 12).toString()).toBe('WEBP');
        expect(b.length).toBeLessThan(40_000);
      }
    }
  });

  it('subtemas: ponto na cor da matéria, nunca ícone (ONDE-USAR.md)', () => {
    const src = (f: string) => readFileSync(resolve(APP, 'src', f), 'utf8');
    expect(src('telas/Tema.tsx')).not.toMatch(/chave=\{sub\.id\}/);
    expect(src('telas/Escada.tsx')).not.toMatch(/Ic3D|IcTema/);
    for (const f of ['telas/Tema.tsx', 'telas/Questao.tsx', 'telas/Treino.tsx', 'ui/Cartoes.tsx', 'telas/Busca.tsx']) expect(src(f)).toContain('ponto-sub');
    for (const f of ['telas/Questao.tsx', 'telas/Treino.tsx', 'ui/Cartoes.tsx', 'telas/Inicio.tsx']) expect(src(f)).not.toMatch(/Ic3D|IcTema/);
  });
});

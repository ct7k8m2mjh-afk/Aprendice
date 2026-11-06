// Comando 19 do dono: ícones de tema novos (docs/icones/<matéria>/<id>-<nome>.png) são os ÚNICOS ícones da matéria
// no site; subtemas sem ícone; os PNG originais ficam guardados em docs/icones/.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ICONES_TEMA } from '../dados/iconesTema';

const APP = resolve(__dirname, '../..');
const DOCS = resolve(APP, '../docs/icones');
const PASTA: Record<string, string> = { bio: 'biologia' };

describe('ícones de tema (comando 19)', () => {
  it('Biologia tem os 12 temas, cada um com o PNG original guardado', () => {
    expect(ICONES_TEMA.bio).toEqual(['B01', 'B02', 'B03', 'B04', 'B05', 'B06', 'B07', 'B08', 'B09', 'B10', 'B11', 'B12']);
    const pngs = readdirSync(resolve(DOCS, PASTA.bio)).filter((f) => f.endsWith('.png'));
    for (const id of ICONES_TEMA.bio) expect(pngs.some((f) => f.startsWith(id + '-'))).toBe(true);
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

  it('subtemas não usam ícone nas telas listadas em ONDE-USAR.md', () => {
    const src = (f: string) => readFileSync(resolve(APP, 'src', f), 'utf8');
    expect(src('telas/Tema.tsx')).not.toMatch(/chave=\{sub\.id\}/);
    expect(src('telas/Escada.tsx')).not.toMatch(/Ic3D|IcTema/);
    expect(src('ui/Cartoes.tsx')).not.toMatch(/c\.sub \|\| c\.mod/);
    expect(src('telas/Questao.tsx')).not.toMatch(/chave=\{(q\.sub|x\.id)\}/);
  });
});

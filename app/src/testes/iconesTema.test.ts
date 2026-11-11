// Comandos 19 e 23 do dono: ícones de tema novos (docs/icones/<matéria>/<id>-<nome>.png) são os ÚNICOS ícones da matéria
// no site; subtemas sem ícone; os PNG originais ficam guardados em docs/icones/.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ICONES_TEMA } from '../dados/iconesTema';

const APP = resolve(__dirname, '../..');
const DOCS = resolve(APP, '../docs/icones');
const PASTA: Record<string, string> = {
  bio: 'biologia', qui: 'quimica', mat: 'matematica', por: 'portugues', fis: 'fisica', geo: 'geografia',
  his: 'historia', ing: 'ingles', fs: 'filosofia-sociologia',
};
const seq = (l: string, n: number) => Array.from({ length: n }, (_, i) => l + String(i + 1).padStart(2, '0'));
// temas de cada matéria (TAXONOMIA.md); fs = Filosofia (L) e Sociologia (S) numa matéria só
const TEMAS: Record<string, string[]> = {
  bio: seq('B', 12), qui: seq('Q', 12), mat: seq('M', 17), por: seq('P', 12), fis: seq('F', 12), geo: seq('G', 13),
  his: seq('H', 8), ing: seq('I', 4), fs: [...seq('L', 8), ...seq('S', 8)],
};

describe('ícones de tema (comandos 19 e 23)', () => {
  it('as nove matérias têm um ícone por tema, cada um com o PNG original guardado', () => {
    expect(Object.keys(ICONES_TEMA).sort()).toEqual(Object.keys(TEMAS).sort());
    for (const [m, ids] of Object.entries(TEMAS)) {
      expect(ICONES_TEMA[m]).toEqual(ids);
      const pngs = readdirSync(resolve(DOCS, PASTA[m])).filter((f) => f.endsWith('.png'));
      expect(pngs.length).toBe(ids.length);
      for (const id of ids) expect(pngs.some((f) => f.startsWith(id + '-'))).toBe(true);
    }
  });

  it('os recortes antigos de tema das pranchas saíram do repositório do site', () => {
    const ic = resolve(APP, 'conteudo-fonte/materias/ic');
    if (existsSync(ic)) expect(readdirSync(ic).filter((f) => f !== 'pranchas')).toEqual([]);
  });

  it('o site tem só os ícones novos de cada matéria (sem os antigos de subtema), em WebP leve e com os ids dos temas', () => {
    for (const [m, ids] of Object.entries(ICONES_TEMA)) {
      const pasta = resolve(APP, 'public/conteudo', m, 'ic');
      if (!existsSync(pasta)) continue; // conteúdo ainda não gerado neste ambiente
      expect(readdirSync(pasta).sort()).toEqual(ids.map((id) => id + '.webp'));
      const temas = JSON.parse(readFileSync(resolve(APP, 'public/conteudo', m, 'materia.json'), 'utf8')).modulos.map((x: { id: string }) => x.id);
      expect([...temas].sort()).toEqual([...ids].sort()); // todo tema tem o seu ícone, e nenhum ícone sobra
      for (const id of ids) {
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

/**
 * Revisão geral da matéria (comando 37): busca sem acento e parcial, Filosofia × Sociologia pelo prefixo, capítulos,
 * imagem do dono com volta ao aviso, e o progresso do aluno (estado v8) com migração sem perder nada.
 */
import { describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import {
  agrupaPorCapitulo, alternaLido, alternaMarcado, avisoImagem, buscaTopicos, contaProgresso, escolheImagem, marcaTrechos,
  mesclaGeral, normaliza, normalizaGeral, parteDoTopico, topicosDaParte, type RevisaoGeral, type TopicoGeral,
} from '../logica/revisaoGeral';
import { importaArquivo, mesclaMateria, migraEstado, v7paraV8, VERSAO_ATUAL } from '../estado/migracao';
import { estadoMateriaVazio, estadoVazio, type Estado } from '../estado/tipos';
import type { MateriaId } from '../dados/tipos';

const RAIZ = resolve(__dirname, '../../..');
const MATERIAS: MateriaId[] = ['mat', 'bio', 'fis', 'qui', 'geo', 'his', 'por', 'ing', 'fs'];
const geral = (m: MateriaId): RevisaoGeral => JSON.parse(readFileSync(join(RAIZ, 'docs/revisao', m, 'geral.json'), 'utf-8'));
const ids = (l: { t: TopicoGeral }[]) => l.map((x) => x.t.id);

const T = (id: string, titulo: string, busca: string[] = [], subs: string[] = [], capitulo = 'Cap'): TopicoGeral =>
  ({ id, capitulo, titulo, subs, busca, pontos: ['p'], pegadinha: '', imagem: { descricao: 'd', falta_imagem: true } });

describe('busca da revisão geral', () => {
  const lista = [
    T('A1', 'Função do 2.º grau', ['Bhaskara', 'báskara', 'vértice']),
    T('A2', 'Crase', ['quando usar crase', 'à'], ['P13.2']),
    T('A3', 'Ácidos e bases', ['pH', 'Arrhenius']),
    T('A4', 'Equação do 2.º grau e Bhaskara'),
  ];
  it('não diferencia acento nem maiúscula', () => {
    expect(normaliza('ÁCIDOS É Báskara')).toBe('acidos e baskara');
    expect(ids(buscaTopicos(lista, 'acidos'))).toEqual(['A3']);
    expect(ids(buscaTopicos(lista, 'ÁCIDOS'))).toEqual(['A3']);
    expect(ids(buscaTopicos(lista, 'baskara'))).toEqual(['A1']); // grafia errada que está em busca[]
  });
  it('acha por pedaço de palavra e exige todas as palavras', () => {
    expect(ids(buscaTopicos(lista, 'arrhe'))).toEqual(['A3']);
    expect(ids(buscaTopicos(lista, 'cras'))).toEqual(['A2']);
    expect(ids(buscaTopicos(lista, 'grau bhask'))).toEqual(['A4', 'A1']); // título antes do termo de busca
    expect(buscaTopicos(lista, 'grau crase')).toEqual([]);
  });
  it('busca no subtema (id e nome) e consulta vazia não acha nada', () => {
    expect(ids(buscaTopicos(lista, 'p13.2'))).toEqual(['A2']);
    expect(ids(buscaTopicos(lista, 'acentuação grave', (s) => (s === 'P13.2' ? 'Acentuação grave e crase' : undefined)))).toEqual(['A2']);
    expect(buscaTopicos(lista, '   ')).toEqual([]);
  });
  it('destaca as palavras no título original, com acento', () => {
    expect(marcaTrechos('Ácidos e bases', 'acido')).toEqual([{ t: 'Ácido', marca: true }, { t: 's e bases', marca: false }]);
    expect(marcaTrechos('Crase', '')).toEqual([{ t: 'Crase', marca: false }]);
  });
  it('nos arquivos reais: cada tópico é achado pelo próprio título sem acento, em todas as matérias', () => {
    for (const m of MATERIAS) {
      const ts = geral(m).topicos;
      for (const t of ts) {
        const q = normaliza(t.titulo).split(' ').slice(0, 3).join(' ');
        expect(ids(buscaTopicos(ts, q)), `${m}:${t.id} "${q}"`).toContain(t.id);
      }
    }
  });
  it('nos arquivos reais: termos de exemplo levam ao tópico certo', () => {
    const casos: [MateriaId, string, string][] = [['mat', 'baskara', 'M04'], ['por', 'crase', 'PK'], ['bio', 'mitose', 'BK'], ['fs', 'socrates', 'FK'], ['fs', 'durkheim', 'SK'], ['ing', 'present perf', 'I04']];
    for (const [m, q, pre] of casos) {
      const r = buscaTopicos(geral(m).topicos, q);
      expect(r.length, `${m} "${q}"`).toBeGreaterThan(0);
      expect(r[0].t.id.startsWith(pre) || r.some((x) => x.t.id.startsWith(pre)), `${m} "${q}"`).toBe(true);
    }
  });
});

describe('Filosofia e Sociologia em duas telas (prefixo FK × SK)', () => {
  const fs = geral('fs').topicos;
  const fil = topicosDaParte(fs, 'fs', 'filosofia');
  const soc = topicosDaParte(fs, 'fs', 'sociologia');
  it('separa pelo prefixo, sem perder nem repetir tópico', () => {
    expect(fil.every((t) => t.id.startsWith('FK'))).toBe(true);
    expect(soc.every((t) => t.id.startsWith('SK'))).toBe(true);
    expect(fil.length + soc.length).toBe(fs.length);
    expect(fil.length).toBe(46);
    expect(soc.length).toBe(56);
  });
  it('a busca de uma parte não traz tópico da outra', () => {
    expect(buscaTopicos(fil, 'durkheim').every((x) => x.t.id.startsWith('FK'))).toBe(true);
    expect(buscaTopicos(soc, 'platao').every((x) => x.t.id.startsWith('SK'))).toBe(true);
  });
  it('as outras matérias ficam inteiras numa tela; FK de Física não vira Filosofia', () => {
    const fis = geral('fis').topicos;
    expect(topicosDaParte(fis, 'fis', 'sociologia')).toBe(fis);
    expect(parteDoTopico('SK05')).toBe('sociologia');
    expect(parteDoTopico('FK01')).toBe('filosofia');
    expect(parteDoTopico('M01.1')).toBeNull();
  });
});

describe('capítulos e ids', () => {
  it('agrupa na ordem do arquivo e não perde tópico', () => {
    for (const m of MATERIAS) {
      const ts = geral(m).topicos;
      const caps = agrupaPorCapitulo(ts);
      expect(caps.flatMap((c) => c.topicos)).toHaveLength(ts.length);
      expect(caps[0].capitulo).toBe(ts[0].capitulo);
      expect(new Set(ts.map((t) => t.id)).size, m).toBe(ts.length); // ids únicos dentro do arquivo (chave do progresso)
    }
  });
});

describe('caixa de imagem', () => {
  it('sem imagem do dono, ou se ela falhar, mostra "EM CONSTRUÇÃO — " + a descrição', () => {
    const im = { descricao: 'Parábola com o vértice marcado.', falta_imagem: true };
    expect(escolheImagem(im)).toBeNull();
    expect(avisoImagem(im)).toBe('EM CONSTRUÇÃO — Parábola com o vértice marcado.');
    expect(escolheImagem({ ...im, img: 'revisao/geral/M04.1.webp' })).toBe('revisao/geral/M04.1.webp');
    expect(escolheImagem({ ...im, img: 'revisao/geral/M04.1.webp' }, true)).toBeNull(); // falhou ao carregar: volta ao aviso
  });

  // o conversor resolve a imagem pelo nome (docs/imagens/<m>/<id>.png), sem código por tópico
  const temPython = (() => { try { execFileSync('python3', ['-c', 'import PIL'], { stdio: 'ignore' }); return true; } catch { return false; } })();
  it.skipIf(!temPython)('conversor: <id>.png do dono vira WebP no tópico; os outros ficam com o aviso', () => {
    const tmp = mkdtempSync(join(tmpdir(), 'geral-'));
    try {
      const py = `
import json, os, sys
sys.path.insert(0, ${JSON.stringify(join(RAIZ, 'app/scripts'))})
import revisao
from PIL import Image
img = os.path.join(${JSON.stringify(tmp)}, 'imagens')
os.makedirs(os.path.join(img, 'his'))
Image.new('RGB', (1600, 800), 'white').save(os.path.join(img, 'his', 'HK02.png'))
os.makedirs(os.path.join(img, 'fs', 'geral'))
Image.new('RGB', (40, 20), 'white').save(os.path.join(img, 'fs', 'geral', 'SK01.png'))
revisao.IMAGENS = img
saida = os.path.join(${JSON.stringify(tmp)}, 'out')
a = revisao.geral_materia('his', os.path.join(saida, 'his'))
b = revisao.geral_materia('fs', os.path.join(saida, 'fs'))
print(json.dumps([a, b]))
`;
      const [a, b] = JSON.parse(execFileSync('python3', ['-c', py], { encoding: 'utf-8' }).trim().split('\n').pop()!);
      expect(a).toMatchObject({ n: geral('his').topicos.length, imagens: 1 });
      expect(b).toMatchObject({ imagens: 1, partes: { filosofia: 46, sociologia: 56 } });
      const his: RevisaoGeral = JSON.parse(readFileSync(join(tmp, 'out/his/geral.json'), 'utf-8'));
      const hk2 = his.topicos.find((t) => t.id === 'HK02')!;
      expect(hk2.imagem.img).toBe('revisao/geral/HK02.webp');
      expect(existsSync(join(tmp, 'out/his/geral/HK02.webp'))).toBe(true);
      const outro = his.topicos.find((t) => t.id === 'HK01')!;
      expect(outro.imagem.img).toBeUndefined();
      expect(outro.imagem.falta_imagem).toBe(true);
      expect(Object.keys(outro).sort()).toEqual(['busca', 'capitulo', 'id', 'imagem', 'pegadinha', 'pontos', 'subs', 'titulo']); // sem lacunas
      const fsj: RevisaoGeral = JSON.parse(readFileSync(join(tmp, 'out/fs/geral.json'), 'utf-8'));
      expect(fsj.topicos.find((t) => t.id === 'SK01')!.imagem.img).toBe('revisao/geral/SK01.webp');
      expect(fsj.topicos.find((t) => t.id === 'FK01')!.imagem.img).toBeUndefined(); // Filosofia FK01 não pega a de outro id
    } finally { rmSync(tmp, { recursive: true, force: true }); }
  });
  it('Matemática e Inglês (sem falta_imagem no arquivo) também mostram o aviso', () => {
    for (const m of ['mat', 'ing'] as MateriaId[]) {
      const t = geral(m).topicos[0];
      expect(escolheImagem({ descricao: t.imagem.descricao, falta_imagem: t.imagem.falta_imagem ?? true })).toBeNull();
    }
  });
});

describe('progresso da revisão geral (estado v8)', () => {
  const t0 = 1762000000000;
  it('marcar como lido e para rever, e desfazer', () => {
    let g = alternaLido({}, 'PK01', t0);
    expect(g.PK01).toEqual({ lido: t0, ts: t0 });
    g = alternaMarcado(g, 'PK01', t0 + 1);
    expect(g.PK01).toEqual({ lido: t0, marc: true, ts: t0 + 1 });
    g = alternaLido(g, 'PK01', t0 + 2);
    expect(g.PK01).toEqual({ marc: true, ts: t0 + 2 });
    expect(contaProgresso([T('PK01', 'x'), T('PK02', 'y')], g)).toEqual({ lidos: 0, marcados: 1 });
  });
  it('mescla de dois aparelhos: por tópico fica a mudança mais recente; nada some', () => {
    const a = { PK01: { lido: t0, ts: t0 }, PK02: { marc: true, ts: t0 } };
    const b = { PK01: { ts: t0 + 5 }, LK03: { lido: t0 + 1, ts: t0 + 1 } };
    expect(mesclaGeral(a, b)).toEqual({ PK01: { ts: t0 + 5 }, PK02: { marc: true, ts: t0 }, LK03: { lido: t0 + 1, ts: t0 + 1 } });
    expect(mesclaGeral(a, undefined)).toEqual(a);
  });
  it('valores estranhos saem; os bons ficam', () => {
    expect(normalizaGeral({ A: { lido: t0, ts: t0 }, B: 'x', C: { lido: -1 }, D: { marc: true, ts: t0 } })).toEqual({ A: { lido: t0, ts: t0 }, D: { marc: true, ts: t0 } });
    expect(normalizaGeral(null)).toEqual({});
    expect(normalizaGeral([1, 2])).toEqual({});
  });

  const tent = { letra: 'C' as const, ok: false, ts: t0, seg: 30 };
  const v7 = (): Estado => ({
    ...estadoVazio(), versao: 7 as Estado['versao'], revisaoDesde: t0,
    perfil: { nome: 'A', email: '', provasAlvo: ['enem'], meta: 100, criadoEm: t0, datasProva: {} },
    materias: {
      por: { q: { P1: { tent: [tent], rev: true } }, ult: 'P1', sims: [], flash: { 'por-d001': { etapa: 1, vence: t0, hist: [{ ts: t0, v: 'a' }] } }, flg: {}, sessoes: [{ ts: t0, seg: 60 }], revs: {} },
      fs: { ...estadoMateriaVazio(), q: { P9: { tent: [tent] } } },
    },
  });
  it('v7 -> v8: cada matéria ganha `geral` vazio; tentativas, flashcards, revisões e ids iguais', () => {
    const antes = v7();
    const e = migraEstado(antes);
    expect(VERSAO_ATUAL).toBe(8);
    expect(e.versao).toBe(8);
    expect(e.materias.por!.geral).toEqual({});
    expect(e.materias.fs!.geral).toEqual({});
    const { geral: _g, ...por } = e.materias.por!;
    expect(por).toEqual(antes.materias.por);
    expect(e.revisaoDesde).toBe(t0);
    expect(migraEstado(e)).toEqual(e); // idempotente
  });
  it('v7 -> v8 mantém um progresso já gravado (arquivo de outra versão) e tira só o que está estragado', () => {
    const x = v7();
    (x.materias.fs as unknown as Record<string, unknown>).geral = { FK01: { lido: t0, ts: t0 }, SK02: { marc: true, ts: t0 }, lixo: 3 };
    const e = v7paraV8(x);
    expect(e.materias.fs!.geral).toEqual({ FK01: { lido: t0, ts: t0 }, SK02: { marc: true, ts: t0 } });
  });
  it('mesclar e importar arquivo antigo (sem `geral`) não apaga o progresso da revisão geral', () => {
    const base = { ...estadoMateriaVazio(), geral: { PK01: { lido: t0, ts: t0 } } };
    expect(mesclaMateria(base, { q: {} }).geral).toEqual({ PK01: { lido: t0, ts: t0 } });
    const e: Estado = { ...estadoVazio(), materias: { por: base } };
    const arquivo = JSON.stringify({ ...v7(), versao: 7 });
    const { estado } = importaArquivo(e, arquivo, { por: new Set(['P1']), fs: new Set(['P9']) });
    expect(estado.materias.por!.geral).toEqual({ PK01: { lido: t0, ts: t0 } });
    expect(estado.materias.por!.q.P1.tent).toHaveLength(1);
    // arquivo novo (v8) com progresso da revisão geral entra mesclado
    const novo = JSON.stringify({ ...estadoVazio(), materias: { por: { ...estadoMateriaVazio(), geral: { LK02: { marc: true, ts: t0 + 9 } } } } });
    const r2 = importaArquivo(estado, novo, { por: new Set(['P1']) });
    expect(r2.estado.materias.por!.geral).toEqual({ PK01: { lido: t0, ts: t0 }, LK02: { marc: true, ts: t0 + 9 } });
  });
});

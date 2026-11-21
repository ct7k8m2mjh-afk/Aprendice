// Decisão do dono (13/11/2026): questão de outra matéria, fora das 9 do site (Artes, Educação Física...), não aparece nos
// temas das matérias; fica só no simulado da prova inteira, na posição e no número originais.
// Lista única: conteudo-fonte/outra-materia.json (scripts/converte.py, aplica_outra_materia).
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { monta } from '../dados/conteudo';
import { comoQuestao, type ProvaCompleta } from '../dados/provasCompletas';
import { planoDaProva, planoDoConteudo } from '../logica/simulados';
import { questoesTreinoGeral, type RegiaoId } from '../logica/regiao';
import type { MateriaConteudo, MateriaId, Questao } from '../dados/tipos';

const APP = join(__dirname, '..', '..');
const PUB = join(APP, 'public', 'conteudo');
const MATERIAS: MateriaId[] = ['bio', 'qui', 'mat', 'por', 'fis', 'geo', 'his', 'fs', 'ing'];
const ler = <T,>(p: string): T => JSON.parse(readFileSync(p, 'utf-8')) as T;
const montado = existsSync(join(PUB, 'fs', 'banco.json')) && existsSync(join(PUB, 'provas', 'indice.json'));
const LISTA = ler<{ questoes: Record<string, { materia: string }> }>(join(APP, 'conteudo-fonte', 'outra-materia.json')).questoes;

describe.skipIf(!montado)('questões de outra matéria (fora das 9 do site)', () => {
  const bancos = Object.fromEntries(MATERIAS.map((m) => [m, ler<Questao[]>(join(PUB, m, 'banco.json'))])) as Record<MateriaId, Questao[]>;
  const conteudos = Object.fromEntries(MATERIAS.map((m) => [m, ler<MateriaConteudo>(join(PUB, m, 'materia.json'))])) as Record<MateriaId, MateriaConteudo>;
  const carregadas = MATERIAS.map((m) => monta(m, bancos[m], conteudos[m]));

  it('a lista não traz matéria do site (só matérias fora das 9)', () => {
    const doSite = new Set(['biologia', 'química', 'matemática', 'português', 'língua portuguesa', 'literatura', 'física', 'geografia',
      'história', 'inglês', 'filosofia', 'sociologia', 'filosofia e sociologia']);
    for (const [id, v] of Object.entries(LISTA)) expect(doSite.has(v.materia.toLowerCase()), `${id}: ${v.materia}`).toBe(false);
  });

  it('UEG 2026/2 q11 (Artes): fora do banco, dos conteúdos e do simulado por conteúdo de Português', () => {
    const por = carregadas[MATERIAS.indexOf('por')];
    const bruto = bancos.por.find((q) => q.id === 'P82bbfc0a');
    expect(bruto?.outraMateria).toBe('Artes');
    expect(bruto?.pendente).toBe('outra matéria: Artes');
    expect(por.porId.has('P82bbfc0a')).toBe(false);
    expect([...por.porSub.values()].flat().some((q) => q.id === 'P82bbfc0a')).toBe(false);
    const plano = planoDoConteudo('por', bancos.por, [bruto!.sub], 45, {}, { rnd: () => 0.5 });
    expect(plano.itens.some((x) => x.id === 'P82bbfc0a')).toBe(false);
  });

  it('...mas continua no simulado da prova inteira, na posição e no número originais', () => {
    const prova = ler<ProvaCompleta>(join(PUB, 'provas', 'ueg-2026-2', 'prova.json'));
    const fonte = ler<ProvaCompleta>(join(APP, 'conteudo-fonte', 'provas', 'ueg-2026-2', 'prova.json'));
    const i = prova.questoes.findIndex((q) => q.id === 'P82bbfc0a');
    expect(i).toBe(fonte.questoes.findIndex((q) => q.id === 'P82bbfc0a'));
    expect(prova.questoes).toHaveLength(fonte.questoes.length);
    const qp = prova.questoes[i];
    expect(qp.n).toBe(11);
    expect(qp.outraMateria).toBe('Artes');
    expect(comoQuestao(prova, qp).id).toBe('P82bbfc0a');
    const plano = planoDaProva(prova);
    expect(plano.itens[i]).toMatchObject({ id: 'P82bbfc0a', p: 'ueg-2026-2' });
    expect(plano.itens).toHaveLength(fonte.questoes.length);
  });

  it('nenhuma questão da lista aparece em matéria nenhuma (banco, conteúdos, treino geral); todas seguem em uma prova', () => {
    const indice = ler<{ id: string }[]>(join(PUB, 'provas', 'indice.json'));
    const naProva = new Set<string>();
    for (const p of indice) for (const q of ler<ProvaCompleta>(join(PUB, 'provas', p.id, 'prova.json')).questoes) if (q.outraMateria) naProva.add(q.id);
    expect([...naProva].sort()).toEqual(Object.keys(LISTA).sort());
    for (const mc of carregadas) {
      for (const id of Object.keys(LISTA)) expect(mc.porId.has(id), `${mc.id}/${id}`).toBe(false);
      for (const q of mc.banco) expect(q.outraMateria, `${mc.id}/${q.id}`).toBeUndefined();
      for (const id of conteudos[mc.id].essencial?.abc || []) expect(LISTA[id], `treino geral ${mc.id}/${id}`).toBeUndefined();
      const todas = new Set(['nac', 'sp', 'se', 'sul', 'ne', 'no', 'co'] as RegiaoId[]);
      for (const id of questoesTreinoGeral(conteudos[mc.id].essencial?.abc || [], mc.banco, todas)) expect(LISTA[id], `treino geral ${mc.id}/${id}`).toBeUndefined();
    }
  });

  it('S01.5 (arte, patrimônio e expressões culturais) fica só com Filosofia e Sociologia (e o que ainda vai ser reclassificado)', () => {
    const fs = carregadas[MATERIAS.indexOf('fs')];
    const s015 = fs.porSub.get('S01.5') || [];
    expect(s015.length).toBeGreaterThan(0);
    expect(s015.some((q) => LISTA[q.id])).toBe(false);
    // a contagem por conteúdo (Simulados, "quantas questões") vem do banco montado, já sem as de outra matéria
    const marcadasS015 = bancos.fs.filter((q) => q.sub === 'S01.5' && q.outraMateria).length;
    expect(marcadasS015).toBeGreaterThan(100);
  });
});

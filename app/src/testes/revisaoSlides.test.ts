// Revisão em slides (comandos 24 e 26): LaTeX das fichas, ciclo de 5 tempos, conteúdo de docs/revisao e migração v4.
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { analisaLatex, latexParaLeitura, latexParaMotor, type NoMat } from '../logica/latex';
import { contaEhTexto, partesFracao } from '../logica/fracao';
import { montaRoteiro, tokeniza } from '../logica/motorConta';
import {
  confereLacuna, escolheQuestoes, fechaSessao, lacuna, linhasFixe, nivelDoAluno, novoAndamento, opcoesFormula, pedeTentativa,
  proximaVolta, revisoesVencidas, sessaoBoa, slidesDoCiclo, termos, VOLTA_DIAS,
} from '../logica/cicloRevisao';
import { fonteLegivel, limpaRoteiro, type TemaRevisao } from '../dados/revisao';
import { passosParaMotor } from '../ui/revisao/SlideRevisao';
import { mesclaRevs, migraEstado, VERSAO_ATUAL } from '../estado/migracao';
import { estadoMateriaVazio, estadoVazio, type EstadoMateria, type Estado } from '../estado/tipos';
import type { Questao } from '../dados/tipos';
import { emNDias } from '../logica/revisao';

const RAIZ = join(__dirname, '..', '..', '..');
const PASTA = join(RAIZ, 'docs', 'revisao');
const contaFracoes = (l: string) => partesFracao(l).filter((p) => p.t === 'frac').length;

/** todos os temas de revisão existentes (os próximos entram aqui sem mudar o teste) */
const TEMAS: { m: string; t: TemaRevisao }[] = existsSync(PASTA)
  ? readdirSync(PASTA).flatMap((m) => {
    const p = join(PASTA, m);
    try { return readdirSync(p).filter((f) => /^[A-Z]\d{2}\.json$/.test(f)).map((f) => ({ m, t: JSON.parse(readFileSync(join(p, f), 'utf-8')) as TemaRevisao })).filter((x) => Object.keys(x.t.slides || {}).length > 0); } catch { return []; } // só essencial (comando 33): fora dos slides
  })
  : [];

const temFrac = (ns: NoMat[]): number => ns.reduce((a, n) => a + (n.t === 'frac' ? 1 + temFrac(n.n) + temFrac(n.d) : 'v' in n && Array.isArray(n.v) ? temFrac(n.v) : n.t === 'sobre' ? temFrac(n.topo) + temFrac(n.v) : 0), 0);
const textoDe = (ns: NoMat[]): string => ns.map((n) => (n.t === 'txt' ? n.v : n.t === 'esp' ? ' ' : n.t === 'frac' ? textoDe(n.n) + textoDe(n.d) : n.t === 'sobre' ? textoDe(n.topo) + textoDe(n.v) : 'v' in n && Array.isArray(n.v) ? textoDe(n.v) : '')).join('');

describe('LaTeX das revisões', () => {
  it('fração vira peça empilhada, com índice e expoente no lugar', () => {
    const [l] = analisaLatex('h_{máx} = \\frac{v_0^2}{2g}');
    expect(l[0]).toEqual({ t: 'txt', v: 'h' });
    expect(l[1]).toEqual({ t: 'sub', v: [{ t: 'txt', v: 'máx' }] });
    const f = l.find((n) => n.t === 'frac');
    expect(f && f.t === 'frac' && textoDe(f.d)).toBe('2g');
  });
  it('gathered quebra em linhas; {,} é vírgula decimal; \\text fica no corpo', () => {
    const ls = analisaLatex('\\begin{gathered} \\Delta s = 90 + 60 \\\\ \\Delta t = 1 + 0{,}5 \\end{gathered}');
    expect(ls).toHaveLength(2);
    expect(textoDe(ls[1])).toBe('Δt = 1 + 0,5');
    expect(textoDe(analisaLatex('20\\ \\text{m/s}')[0])).toBe('20 m/s');
  });
  it('leitura para leitor de tela diz "sobre" no lugar da barra', () => {
    expect(latexParaLeitura('v_m = \\frac{\\Delta s}{\\Delta t}')).toBe('vₘ = Δs sobre Δt');
  });
  it('texto do motor: fração "a/b" que o site empilha, uma linha por ⇒', () => {
    expect(latexParaMotor('v_0 = \\frac{72}{3{,}6} = 20\\ \\text{m/s}', contaFracoes)).toBe('v_{0} = 72/3,6 = 20 m/s');
    expect(latexParaMotor('10\\,\\Delta s = 400 \\;\\Rightarrow\\; \\Delta s = \\frac{400}{10} = 40\\ \\text{m}', contaFracoes)).toBe('10Δs = 400\nΔs = 400/10 = 40 m');
    // índice de várias letras: "_{…}", que o motor desce inteiro na mesma letra à mão (auditoria A4)
    expect(latexParaMotor('f_{cat} = \\frac{10}{4}', contaFracoes)).toBe('f_{cat} = 10/4');
    expect(tokeniza('v_{mín} = 3').filter((t) => t.k === 'var').map((t) => t.v)).toEqual(['v_{mín}']);
    // Humanas: a quebra que só corta a frase some; item novo fica em linha própria
    expect(latexParaMotor('\\begin{gathered} \\text{ética: agir pelo correto,} \\\\ \\text{não por medo} \\\\ \\text{(2) outro} \\end{gathered}', contaFracoes, true))
      .toBe('ética: agir pelo correto, não por medo\n(2) outro');
    // item novo de lista que começa com a mesma palavra fica na sua linha
    expect(latexParaMotor('\\begin{gathered} \\text{risca a: errada} \\\\ \\text{risca b: exagera} \\end{gathered}', contaFracoes, true)).toBe('risca a: errada\nrisca b: exagera');
    expect(latexParaMotor('\\begin{gathered} \\text{qual deus = teogonia} \\\\ \\text{de que é feito = arché} \\end{gathered}', contaFracoes, true)).toBe('qual deus = teogonia\nde que é feito = arché');
  });
  it('o motor anima a passagem do 10 que multiplica para o outro lado dividindo', () => {
    const conta = latexParaMotor('10\\,\\Delta s = 400 \\;\\Rightarrow\\; \\Delta s = \\frac{400}{10} = 40\\ \\text{m}', contaFracoes)!;
    const rt = montaRoteiro({ passos: [{ faz: 'Isola', conta, porque: '' }] }, 'fis');
    expect(rt.linhas).toHaveLength(2);
    expect(rt.linhas.every((l) => l.conta)).toBe(true);
    expect(rt.linhas[1].planos.length).toBeGreaterThan(0);
  });
});

describe.skipIf(!TEMAS.length)('conteúdo de docs/revisao', () => {
  for (const { m, t } of TEMAS) {
    describe(`${m}/${t.id}`, () => {
      const todos = Object.entries(t.slides).flatMap(([sub, l]) => l.map((s, k) => ({ sub, k, s })));
      it('conteúdo que não existe no site só como proposta das pendências (não vira id; o site ignora)', () => {
        const arq = join(RAIZ, 'app', 'public', 'conteudo', m, 'materia.json');
        if (!existsSync(arq)) return;
        const mod = (JSON.parse(readFileSync(arq, 'utf-8')).modulos as { id: string; subs: { id: string }[] }[]).find((x) => x.id === t.id);
        expect(mod, t.id).toBeTruthy();
        const ids = mod!.subs.map((x) => x.id);
        for (const sub of Object.keys(t.slides)) if (!ids.includes(sub)) expect((t.pendencias || []).join(' '), sub).toContain(sub);
        expect(Object.keys(t.slides).some((sub) => ids.includes(sub))).toBe(true);
      });
      it('cada conteúdo tem cartão e slides; fixe com 3 linhas', () => {
        for (const sub of Object.keys(t.slides)) {
          expect(t.cartoes?.some((c) => c.sub === sub), `cartão de ${sub}`).toBe(true);
          const c = slidesDoCiclo(t.slides[sub]);
          expect(c.ver.length, sub).toBeGreaterThan(0);
          if (c.fixe) expect(linhasFixe(c.fixe.s), sub).toHaveLength(3);
        }
      });
      it('toda fórmula, conta e linha do caderno se desenha sem sobrar comando e com toda fração empilhada', () => {
        const tex = [
          ...(t.formulas || []),
          ...todos.flatMap(({ s }) => [s.formula || '', ...(s.passos || []).map((p) => p.conta)]),
          ...(t.cartoes || []).flatMap((c) => (c.caderno || []).flatMap((x) => [...x.matchAll(/\$([^$]+)\$/g)].map((r) => r[1]))),
        ].filter(Boolean);
        for (const x of tex) {
          const ls = analisaLatex(x);
          const txt = ls.map(textoDe).join('\n');
          // "\_\_\_" é a lacuna de uma frase (Inglês): o sublinhado fica
          expect(txt, x).not.toMatch(x.includes('\\_') ? /\\|[{}^]/ : /\\|[{}^_]/);
          expect(ls.reduce((a, l) => a + temFrac(l), 0), x).toBe((x.match(/\\[dt]?frac/g) || []).length);
        }
      });
      it('textos sem fração em linha nem código de cor para o aluno', () => {
        for (const { s } of todos) {
          for (const v of s.visual?.movimento || []) expect(limpaRoteiro(v)).not.toMatch(/#[0-9A-Fa-f]{6}/);
          if (s.tipo === 'fixe') expect(s.texto).not.toMatch(/\d\/\d|\(\w\/\w\)/);
        }
      });
      it('exemplos com conta vão ao motor único (ou à saída do pedido 2 ao motor)', () => {
        const ex = todos.filter(({ s }) => s.passos?.length);
        expect(ex.length).toBeGreaterThan(0);
        const texto = contaEhTexto('1 + 1', m);
        for (const { s } of ex) {
          const r = passosParaMotor(s.passos!, texto);
          if (r) for (const p of r.passos!) expect(p.conta.replace(/[_^]\{[^{}]*\}/g, ''), p.conta).not.toMatch(/\\|[{}]/);
        }
        // F02 (o tema conferido slide a slide): quase todos pelo motor; só índices sem forma Unicode ficam de fora
        if (t.id === 'F02') expect(ex.filter(({ s }) => passosParaMotor(s.passos!)).length).toBe(ex.length);
      });
      it('lacunas: pista e resposta não vazias em toda linha do fixe e em toda frase-chave de conceito', () => {
        for (const { s } of todos) {
          const frases = s.tipo === 'fixe' ? linhasFixe(s) : pedeTentativa(s) === 'frase' ? [s.destaque!] : [];
          for (const f of frases) {
            const l = lacuna(f);
            expect(l.pista.length, f).toBeGreaterThan(0);
            expect(termos(l.falta).length, f).toBeGreaterThan(0);
            expect((l.pista + ' ' + l.falta).replace(/\s+/g, ' ')).toBe(f.trim().replace(/\s+/g, ' '));
          }
        }
      });
      it('fórmula: 3 opções diferentes, a certa entre elas', () => {
        for (const { s, sub, k } of todos) {
          if (pedeTentativa(s) !== 'formula') continue;
          const o = opcoesFormula(t, sub, k);
          expect(new Set(o.opcoes).size).toBe(o.opcoes.length);
          // com uma só (nenhuma outra fórmula no tema) o slide abre direto, sem escolha
          expect(o.opcoes[o.certa]).toBe(s.formula);
        }
      });
      it('foto com crédito: autor, licença e origem', () => {
        for (const { s } of todos) {
          const f = s.visual?.foto;
          if (!f) continue;
          expect(f.url).toMatch(/^https:\/\//);
          expect(f.autor && f.licenca).toBeTruthy();
        }
      });
    });
  }
});

/* ============================================================ ciclo */

const q = (id: string, dif: number): Questao => ({ id, escola: 'X', ano: '2024', n: '1', banca: '', fase: '', enun: '', alts: { A: '', B: '' }, gab: 'A', modulo: 'F02', sub: 'F02.1', dif,
  degrau: 0, conceito: '', pista: '', url: '', origem: 'prova', figura: false });
const tent = (ok: boolean, ts = 1) => ({ letra: 'A' as const, ok, ts, seg: 10 });

describe('ciclo de 5 tempos', () => {
  const qs = [q('a', 1), q('b', 2), q('c', 3), q('d', 4), q('e', 5), q('f', 6), q('g', 7), q('h', 8), q('i', 9), q('j', 2)];
  it('nível do aluno: o primeiro ainda não firme', () => {
    const s: EstadoMateria = estadoMateriaVazio();
    expect(nivelDoAluno(qs, s)).toBe('basico');
    s.q = { a: { tent: [tent(true)] }, b: { tent: [tent(true)] }, c: { tent: [tent(true)] } };
    expect(nivelDoAluno(qs, s)).toBe('intermediario');
  });
  it('questões antes e de aplicação: sem repetir, aplicação um nível acima', () => {
    const e = escolheQuestoes(qs, estadoMateriaVazio());
    expect(e.pre).toHaveLength(3);
    expect(e.apl.length).toBeGreaterThanOrEqual(1);
    expect(e.pre.filter((x) => e.apl.includes(x))).toHaveLength(0);
    expect(e.pre.every((id) => qs.find((x) => x.id === id)!.dif <= 3)).toBe(true);
    expect(qs.find((x) => x.id === e.apl[0])!.dif).toBeGreaterThanOrEqual(4);
    expect(escolheQuestoes([q('a', 1)], undefined)).toEqual({ nivel: 'basico', pre: ['a'], apl: [] });
    expect(escolheQuestoes([], undefined).pre).toEqual([]);
  });
  it('lacuna: pista até os dois-pontos ou o igual', () => {
    expect(lacuna('Sem tempo, Torricelli: v² = v₀² + 2·a·Δs.')).toEqual({ pista: 'Sem tempo, Torricelli:', falta: 'v² = v₀² + 2·a·Δs.' });
    expect(lacuna('Aceleração = variação da velocidade dividida pelo tempo; no MUV, constante.').pista).toBe('Aceleração =');
    expect(lacuna('Movimento, repouso e trajetória dependem do referencial.').pista).not.toMatch(/\se$/);
  });
  it('conferência da lacuna: ignora acento, pontuação e palavras de ligação', () => {
    expect(confereLacuna('v² = v₀² + 2·a·Δs.', 'v2 = v02 + 2 a Δs')).toBe('a');
    expect(confereLacuna('variação da velocidade dividida pelo tempo; no MUV, constante.', 'variacao velocidade pelo tempo')).toBe('q');
    expect(confereLacuna('variação da velocidade', '')).toBe('e');
  });
  it('volta: sessão boa sobe (1ª boa em 3 dias); ruim volta amanhã', () => {
    const ts = new Date(2026, 10, 6, 10).getTime();
    expect(proximaVolta(undefined, true, ts)).toEqual({ etapa: 1, vence: emNDias(ts, VOLTA_DIAS[1]) });
    expect(proximaVolta(undefined, false, ts)).toEqual({ etapa: 0, vence: emNDias(ts, 1) });
    const boa = { pre: [], apl: [{ id: 'x', letra: 'A' as const, ok: true }], lembrou: { 'F02.1#9:0': 'a' as const, 'F02.1#9:1': 'a' as const, 'F02.1#9:2': 'q' as const } };
    expect(sessaoBoa(boa)).toBe(true);
    expect(sessaoBoa({ ...boa, pre: [{ id: 'y', letra: 'B', ok: false, conf: 'certeza' }] })).toBe(false); // errou com certeza
    expect(sessaoBoa({ ...boa, apl: [{ id: 'x', letra: 'B', ok: false }] })).toBe(false);
  });
  it('fechar a sessão grava o histórico, a volta e limpa o andamento', () => {
    const a = { ...novoAndamento(['a'], ['b'], 1000), apl: [{ id: 'b', letra: 'A' as const, ok: true }] };
    const r = fechaSessao(undefined, a, 5000);
    expect(r.hist).toHaveLength(1);
    expect(r.and).toBeNull();
    expect(r.etapa).toBe(1);
    const r2 = fechaSessao(r, a, 6000);
    expect(r2.etapa).toBe(2);
    expect(revisoesVencidas({ ...estadoMateriaVazio(), revs: { 'F02.1': { ...r2, vence: 10 } } }, 20)).toEqual(['F02.1']);
  });
  it('fonte legível e roteiro sem código de cor', () => {
    expect(fonteLegivel('L1-F1-C02 p. 24', 'PV Física (Poliedro)')).toBe('PV Física (Poliedro), livro 1, frente 1, cap. 2, p. 24');
    expect(fonteLegivel('FIL-L1-F1-C01 p. 11', '')).toBe('PV Filosofia (Poliedro), livro 1, frente 1, cap. 1, p. 11');
    expect(fonteLegivel('ING-L2-F1-C03 p. 40', '')).toBe('PV Língua Inglesa (Poliedro), livro 2, frente 1, cap. 3, p. 40');
    expect(limpaRoteiro('2. A faixa se pinta de laranja #F27700.')).toBe('A faixa se pinta de laranja.');
  });
});

/* ============================================================ migração v4 (princípio 7) */

describe('migração v4: revisão em slides', () => {
  it('estado v3 ganha revs vazio e não perde nada', () => {
    const v3 = { ...estadoVazio(), versao: 3, materias: { fis: { q: { P1: { tent: [tent(true, 5)] } }, ult: 'P1', sims: [], flash: {}, flg: {}, sessoes: [] } } } as unknown as Estado;
    const e = migraEstado(v3);
    // v4 ganhou revs; a migração segue até a versão atual (v5: treino geral de todas as matérias, comando 32)
    expect(VERSAO_ATUAL).toBeGreaterThanOrEqual(4);
    expect(e.versao).toBe(VERSAO_ATUAL);
    expect(e.materias.fis!.revs).toEqual({});
    expect(e.materias.fis!.q.P1.tent).toHaveLength(1);
    expect(e.materias.fis!.ult).toBe('P1');
  });
  it('estado v4 com revisão passa intacto', () => {
    const r = fechaSessao(undefined, novoAndamento(['a'], [], 1), 100);
    const v4: Estado = { ...estadoVazio(), materias: { fis: { ...estadoMateriaVazio(), revs: { 'F02.1': r } } } };
    expect(migraEstado(v4).materias.fis!.revs!['F02.1']).toEqual(r);
  });
  it('mescla (importar arquivo): sessões unidas, volta do lado mais recente', () => {
    const a = fechaSessao(undefined, novoAndamento([], [], 1), 100);
    const b = fechaSessao(a, novoAndamento([], [], 1), 200);
    const m = mesclaRevs({ 'F02.1': a }, { 'F02.1': b, 'F02.2': a });
    expect(m['F02.1'].hist.map((h) => h.ts)).toEqual([100, 200]);
    expect(m['F02.1'].vence).toBe(b.vence);
    expect(m['F02.2']).toBeTruthy();
  });
});

/* ============================================================ auditoria rodada 1 */
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { SlideRevisao } from '../ui/revisao/SlideRevisao';
import { avisoDe, rotuloImagem } from '../ui/revisao/FotoSlide';
import { slideDaQuestao } from '../logica/cicloRevisao';

describe('auditoria rodada 1 da revisão em slides', () => {
  const temas = TEMAS.filter(({ m }) => ['fis', 'his', 'geo'].includes(m));
  it('A1: o roteiro de produção (movimento, descrição) nunca aparece no slide', () => {
    let vistos = 0;
    for (const { m, t } of temas) for (const [sub, l] of Object.entries(t.slides)) l.forEach((s, k) => {
      const mov = s.visual?.movimento || [];
      if (!mov.length || vistos > 400) return;
      vistos++;
      const html = renderToStaticMarkup(createElement(SlideRevisao, { m: m as never, tema: t, sub, k, s, pos: 1, total: 1 }));
      for (const x of mov) expect(html, `${sub} #${k + 1}`).not.toContain(x.replace(/^\d+\.\s*/, '').slice(0, 40).replace(/&/g, '&amp;').replace(/'/g, '&#x27;'));
      if (s.visual?.descricao) expect(html).not.toContain(s.visual.descricao.slice(0, 40).replace(/&/g, '&amp;').replace(/'/g, '&#x27;'));
    });
    expect(vistos).toBeGreaterThan(50);
  });
  it('M5: imagem com aviso no roteiro pede o aviso antes; B3: pintura não é "Foto"', () => {
    const h03 = TEMAS.find(({ t }) => t.id === 'H03');
    if (!h03) return;
    const v = h03.t.slides['H03.9']?.[0]?.visual;
    if (!v?.foto) return;
    expect(avisoDe(v)).toMatch(/execução/i);
    expect(rotuloImagem(v)).toBe('Pintura');
    expect(avisoDe({ tipo: 'foto', movimento: ['1. A foto aparece.'] })).toBeNull();
  });
  it('M4: a questão errada marca o slide que fala dela, ou nenhum', () => {
    const sl = (titulo: string, texto: string) => ({ tipo: 'conceito' as const, titulo, texto });
    const ver = [{ s: sl('Velocidade média', 'deslocamento dividido pelo tempo total, contando paradas'), k: 1 },
      { s: sl('Aceleração', 'variação da velocidade a cada segundo, frenagem e Torricelli'), k: 2 }];
    expect(slideDaQuestao('Um carro faz frenagem com aceleração constante; use Torricelli para a variação da velocidade', ver)).toBe(2);
    expect(slideDaQuestao('Sobre a Revolução Francesa e o Terceiro Estado', ver)).toBeNull();
  });
});

/* ============================================================ revisão essencial (comandos 33 e 34) */
import { itensEssencial } from '../telas/RevisaoEssencial';
const TEMAS_ESS: { m: string; t: TemaRevisao }[] = existsSync(PASTA)
  ? readdirSync(PASTA).flatMap((m) => {
    try { return readdirSync(join(PASTA, m)).filter((f) => /^[A-Z]\d{2}\.json$/.test(f)).map((f) => ({ m, t: JSON.parse(readFileSync(join(PASTA, m, f), 'utf-8')) as TemaRevisao })).filter((x) => x.t.essencial); } catch { return []; }
  })
  : [];
describe('revisão essencial', () => {
  it('há temas com essencial', () => expect(TEMAS_ESS.length).toBeGreaterThan(0));
  for (const { m, t } of TEMAS_ESS) {
    it(`${m}/${t.id}: ordem termômetro → mapa → conteúdos → questão → conexão; tudo se desenha`, () => {
      const e = t.essencial!;
      const it = itensEssencial(e).map((x) => x.t);
      expect(it[0]).toBe(e.termometro?.length ? 'termometro' : it[0]);
      expect(it.filter((x) => x === 'tela')).toHaveLength(e.telas.length);
      expect(it.indexOf('questao')).toBeGreaterThan(it.lastIndexOf('tela'));
      for (const tela of e.telas) {
        expect(tela.pontos.length).toBeLessThanOrEqual(4);
        if (tela.formula) expect(analisaLatex(tela.formula).map(textoDe).join(' ')).not.toMatch(/\\/);
      }
      const q = e.questao_resolvida;
      if (q) {
        expect('ABCDE').toContain(q.gabarito);
        if (q.passos) expect(passosParaMotor(q.passos, contaEhTexto('1 + 1', m))).not.toBeNull();
      }
      const subs = new Set(e.telas.map((x) => x.sub));
      for (const r of e.mapa?.ramos || []) for (const l of r.liga || []) expect(e.mapa!.ramos.some((x) => x.sub === l), l).toBe(true);
      expect(subs.size).toBeGreaterThan(0);
    });
  }
});

/* ============================================================ resumos por subtema (comando 35) */
describe('resumos por subtema', () => {
  const mats = existsSync(PASTA) ? readdirSync(PASTA).filter((m) => existsSync(join(PASTA, m, 'resumos.json'))) : [];
  it('há resumos', () => expect(mats.length).toBeGreaterThan(0));
  for (const m of mats) {
    it(`${m}: título, pontos e caixa de imagem; fórmulas dos pontos sem comando sobrando e fração empilhada`, () => {
      const d = JSON.parse(readFileSync(join(PASTA, m, 'resumos.json'), 'utf-8')) as Record<string, { subtemas: { sub: string; titulo: string; pontos: string[]; pegadinha?: string; imagem?: { descricao?: string } }[] }>;
      for (const [tema, v] of Object.entries(d)) for (const r of v.subtemas) {
        expect(r.sub.startsWith(tema + '.'), r.sub).toBe(true);
        expect(r.titulo && r.pontos.length, r.sub).toBeTruthy();
        expect(r.imagem?.descricao, r.sub).toBeTruthy();
        for (const p of [...r.pontos, r.pegadinha || '']) for (const [, x] of p.matchAll(/\$([^$]+)\$/g)) {
          const ls = analisaLatex(x);
          expect(ls.map(textoDe).join(' '), x).not.toMatch(/\\|[{}]/);
          expect(ls.reduce((a, l) => a + temFrac(l), 0), x).toBe((x.match(/\\[dt]?frac/g) || []).length);
        }
      }
    });
  }
});

/* ============================================================ auditoria dos resumos (rodada 1, G1) */
import { comandoConhecido } from '../logica/latex';
describe('todo comando LaTeX de docs/revisao é desenhado (nenhum sai cru)', () => {
  it('varre fórmulas, contas e $…$ de todos os arquivos', () => {
    const faltam = new Map<string, string>();
    const walk = (x: unknown, k = ''): void => {
      if (Array.isArray(x)) x.forEach((y) => walk(y, k));
      else if (x && typeof x === 'object') Object.entries(x).forEach(([kk, v]) => walk(v, kk));
      else if (typeof x === 'string') {
        const tex = ['formula', 'conta', 'formulas'].includes(k) ? [x] : [...x.matchAll(/\$([^$]+)\$/g)].map((r) => r[1]);
        for (const t of tex) for (const [, n] of t.replace(/\\\\/g, ' ').matchAll(/\\([A-Za-z]+)/g)) if (!comandoConhecido(n)) faltam.set(n, t); // "\\" é quebra de linha
      }
    };
    for (const m of existsSync(PASTA) ? readdirSync(PASTA) : []) {
      let fs: string[] = [];
      try { fs = readdirSync(join(PASTA, m)).filter((f) => f.endsWith('.json')); } catch { continue; }
      for (const f of fs) walk(JSON.parse(readFileSync(join(PASTA, m, f), 'utf-8')));
    }
    expect([...faltam.entries()]).toEqual([]);
  });
  it('símbolos novos e "&" de alinhamento', () => {
    const t = (x: string) => analisaLatex(x).map(textoDe).join(' | ');
    expect(t('\\sum F_x = 0')).toContain('ΣF');
    expect(t('p \\wedge q \\vee r')).toBe('p ∧ q ∨ r');
    expect(t('m_\\ell')).toBe('mℓ');
    expect(t('\\begin{aligned} T &: P_1V_1 = P_2V_2 \\end{aligned}')).not.toContain('&');
    expect(t('2ab\\cos\\theta')).toBe('2ab cos θ');
  });
});
import { semFracaoUnicode } from '../ui/Formula';
describe('fração de um caractere (auditoria dos resumos M2)', () => {
  it('½ vira 1/2, que o site empilha', () => {
    expect(semFracaoUnicode('spin +½ e −½; H₂ + ½ O₂')).toBe('spin +1/2 e −1/2; H₂ + 1/2 O₂');
    expect(partesFracao(semFracaoUnicode('spin +½')).some((p) => p.t === 'frac')).toBe(true);
  });
});

import { describe, expect, it } from 'vitest';
import { ehSiteDidatico, origemDoLink } from '../logica/origemLink';
import { avisoGabarito, origemGabarito } from '../dados/tipos';

// Revisão do site de 19/11/2026 (questao-correcao.md item 19): o rótulo diz de onde é o link
describe('origem do link da questão', () => {
  it('caderno no site da banca ou da instituição', () => {
    expect(origemDoLink('https://download.inep.gov.br/enem/provas/2023/cad.pdf').tipo).toBe('oficial');
    expect(origemDoLink('https://www.fuvest.br/wp-content/uploads/prova.pdf').rotulo).toBe('Caderno da prova oficial');
    expect(origemDoLink('https://storage.acafe.org.br/x.pdf').tipo).toBe('oficial');
  });
  it('PDF de cursinho e cópia em site de terceiros', () => {
    expect(origemDoLink('https://www.curso-objetivo.br/vestibular/resolucao-comentada/alberteinstein/2019/a.pdf')).toEqual({ tipo: 'cursinho', nome: 'Objetivo', rotulo: 'PDF de resolução publicada, com a prova' });
    expect(origemDoLink('https://vestibulares.estrategia.com/public/questoes/x/').nome).toBe('Estratégia');
    // revisão de 21/11 (dados N3): "PDF" só quando o link é PDF; página de questão ou post de cursinho não
    expect(origemDoLink('https://vestibulares.estrategia.com/public/questoes/x/').rotulo).toBe('Resolução publicada por cursinho');
    expect(origemDoLink('https://vestibulares.estrategia.com/portal/atualidades-e-dicas/questoes-sobre-virus/').rotulo).toBe('Resolução publicada por cursinho');
    expect(origemDoLink('https://www.quimicaparaovestibular.com.br/wp-content/uploads/a.PDF').rotulo).toBe('PDF de resolução publicada, com a prova');
    expect(origemDoLink('https://arquivos.qconcursos.com/prova/arquivo_prova/1/p.pdf').tipo).toBe('terceiros');
    expect(origemDoLink('https://storage.googleapis.com/b/p.pdf').tipo).toBe('hospedado');
  });
  // dono, 27/11/2026: só o crédito básico da banca; quem publicou a cópia fica no registro (`nome`), nunca no rótulo do aluno
  it('guarda o nome do cursinho e do site de terceiros só no registro, sem mostrar no rótulo', () => {
    expect(origemDoLink('https://cdn.blog.estrategiavestibulares.com.br/x/prova.pdf')).toEqual({ tipo: 'cursinho', nome: 'Estratégia', rotulo: 'PDF de resolução publicada, com a prova' });
    expect(origemDoLink('https://arquivos.qconcursos.com/prova/arquivo_prova/1/p.pdf')).toEqual({ tipo: 'terceiros', nome: 'Qconcursos', rotulo: 'Cópia da prova em site de terceiros' });
    expect(origemDoLink('https://vestibular.brasilescola.uol.com.br/downloads/x.pdf').rotulo).toBe('Cópia da prova em site de terceiros');
    for (const u of ['https://www.curso-objetivo.br/a.pdf', 'https://vestibulares.estrategia.com/q/', 'https://www.quimicaparaovestibular.com.br/a.pdf', 'https://www.etapa.com.br/x', 'https://arquivos.qconcursos.com/p.pdf', 'https://www.pciconcursos.com.br/p.pdf']) {
      const o = origemDoLink(u);
      expect(o.nome, u).toBeTruthy();
      expect(o.rotulo, u).not.toContain(o.nome!);
      expect(o.rotulo, u).not.toMatch(/\(/);
    }
  });
  // os links que o aluno vê levam só ao site oficial da banca, nunca ao lugar exato da cópia (`q.url`)
  it('a tela não usa o link da cópia (q.url) e não nomeia a origem', async () => {
    const { readFileSync } = await import('node:fs');
    for (const f of ['src/ui/QuestaoCartao.tsx', 'src/ui/Resolucao.tsx']) {
      const src = readFileSync(f, 'utf8');
      expect(src, f).not.toMatch(/href=\{q\.url\}/);
      expect(src, f).not.toMatch(/Abrir a fonte original/);
      expect(src, f).toMatch(/href=\{cred\.site\}/);
    }
  });
  it('lista de exercícios e link quebrado não lançam erro', () => {
    expect(origemDoLink('https://x.y', 'site').tipo).toBe('lista');
    expect(origemDoLink('não é link').tipo).toBe('oficial');
    expect(origemDoLink(undefined).tipo).toBe('oficial');
  });
});

// Princípio 2 (revisão de 19/11/2026, itens 2 e 3): o aviso do gabarito do Aprendice aparece antes, depois e na aba Fonte
describe('aviso do gabarito do Aprendice', () => {
  it('só com gabarito do Aprendice, e nunca na indisponível', () => {
    expect(avisoGabarito({ gabFonte: 'aprendice' })).toBe('Gabarito do Aprendice: a banca não publicou gabarito oficial');
    expect(avisoGabarito({})).toBeNull();
    expect(avisoGabarito({ gabFonte: 'resolucao' })).toBeNull();
    expect(avisoGabarito({ gabFonte: 'aprendice', indisponivel: true })).toBeNull();
  });
  it('a aba Fonte usa o mesmo texto da correção (nunca "Publicado" para o gabarito do Aprendice)', async () => {
    const { readFileSync } = await import('node:fs');
    const src = readFileSync('src/ui/QuestaoCartao.tsx', 'utf8');
    expect(src).not.toMatch(/Publicado \(oficial ou resolução reconhecida\)/);
    expect(src).toMatch(/\['Gabarito', q\.indisponivel \? [^\]]*: origemGabarito\(q\)\]/);
    expect(origemGabarito({ gabFonte: 'aprendice' })).toBe(avisoGabarito({ gabFonte: 'aprendice' }));
  });
});

describe('site didático não aparece na tela (revisão 20/11, dados 3)', () => {
  it('Brasil Escola, Mundo Educação, Prepara Enem, InfoEscola e Toda Matéria', () => {
    for (const u of ['https://vestibular.brasilescola.uol.com.br/downloads/ime.htm', 'https://mundoeducacao.uol.com.br/x', 'https://www.preparaenem.com/a', 'https://www.infoescola.com/b', 'https://www.todamateria.com.br/c'])
      expect(ehSiteDidatico(u), u).toBe(true);
  });
  it('site oficial passa', () => {
    expect(ehSiteDidatico('https://www.ime.eb.mil.br/vestibular')).toBe(false);
    expect(ehSiteDidatico(undefined)).toBe(false);
  });
});

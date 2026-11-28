import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { creditoProva } from '../logica/creditoProva';

// Pedido do dono de 27/11/2026: crédito curto na barra do print, com o site oficial da banca (nunca o PDF de cursinho)
describe('crédito da prova na barra do print', () => {
  it('banca e prova, com o site oficial', () => {
    expect(creditoProva({ banca: 'Inep', escola: 'ENEM', ano: '2024' })).toMatchObject({ texto: '© Inep · ENEM 2024', site: 'https://www.gov.br/inep/pt-br' });
    expect(creditoProva({ banca: 'Vunesp', escola: 'FMJ', ano: '2023' })).toMatchObject({ texto: '© Vunesp · FMJ 2023', site: 'https://www.vunesp.com.br/' });
    expect(creditoProva({ banca: 'Comvest', escola: 'Unicamp', ano: '2025' }).site).toBe('https://www.comvest.unicamp.br/');
    expect(creditoProva({ banca: 'UERJ (DSEA)', escola: 'UERJ', ano: '2024' })).toMatchObject({ texto: '© UERJ 2024', site: 'https://www.vestibular.uerj.br/' });
    expect(creditoProva({ banca: 'Fuvest', escola: 'Fuvest', ano: '2022' }).texto).toBe('© Fuvest 2022');
    // nome curto para caber no celular (390 px)
    expect(creditoProva({ banca: 'Vunesp', escola: 'Santa Casa (FCMSCSP)', ano: '2018' }).texto).toBe('© Vunesp · Santa Casa 2018');
    expect(creditoProva({ banca: '', escola: 'Santa Casa (FCMSCSP)', ano: '2026' }).texto).toBe('© Santa Casa 2026');
    expect(creditoProva({ banca: 'Núcleo de Seleção UEG', escola: 'UEG', ano: '2020' }).texto).toBe('© UEG 2020');
  });
  it('banca desconhecida: só o texto, sem link', () => {
    expect(creditoProva({ banca: 'Banca Nova', escola: 'X', ano: '2026' })).toMatchObject({ texto: '© Banca Nova · X 2026', site: null });
  });
  it('todo crédito cabe na barra do celular (até 31 caracteres, medido em 390 px)', () => {
    const base = 'public/conteudo';
    if (!existsSync(base)) return;
    const longos = new Set<string>();
    const ve = (q: { banca: string; escola: string; ano: string }) => { const t = creditoProva(q).texto; if (t.length > 31) longos.add(t); };
    for (const m of readdirSync(base)) { const f = join(base, m, 'banco.json'); if (existsSync(f)) JSON.parse(readFileSync(f, 'utf8')).forEach(ve); }
    const pv = join(base, 'provas');
    if (existsSync(pv)) for (const d of readdirSync(pv)) { const f = join(pv, d, 'prova.json'); if (existsSync(f)) ve(JSON.parse(readFileSync(f, 'utf8'))); }
    expect([...longos]).toEqual([]);
  });
  it('toda banca do banco e das provas completas tem site oficial', () => {
    const base = 'public/conteudo';
    if (!existsSync(base)) return;
    const faltam = new Set<string>();
    for (const m of readdirSync(base)) {
      const f = join(base, m, 'banco.json');
      if (existsSync(f)) for (const q of JSON.parse(readFileSync(f, 'utf8'))) if (!creditoProva(q).site) faltam.add(`${q.escola}/${q.banca}`);
    }
    const pv = join(base, 'provas');
    if (existsSync(pv)) for (const d of readdirSync(pv)) {
      const f = join(pv, d, 'prova.json');
      if (existsSync(f)) { const p = JSON.parse(readFileSync(f, 'utf8')); if (!creditoProva(p).site) faltam.add(`${p.escola}/${p.banca}`); }
    }
    expect([...faltam]).toEqual([]);
  });
});

/**
 * Legenda de crédito das figuras da teoria (revisão de 19/11/2026, item 9 das matérias). O campo `fonte` de figuras.json
 * é o registro de produção (como e com o que a figura foi feita: "SVG gerado por código, Python", "RDKit a partir do
 * SMILES…") e continua nos dados (princípio 10). Ao aluno vai só o crédito, sem jargão técnico: "Desenho do Aprendice",
 * com o nome de quem cedeu ícones ou dados quando a licença pede crédito.
 */
const TERCEIROS: [RegExp, string][] = [
  [/bioicons/i, 'ícones Bioicons'],
  [/phosphor/i, 'ícones Phosphor'],
  [/NIST/, 'dados do NIST'],
  [/CRC Handbook/i, 'dados do CRC Handbook'],
  [/\bEPA\b/, 'dados da EPA'],
];

export function legendaFigura(fonte: string | undefined): string {
  const f = fonte || '';
  const creditos = TERCEIROS.filter(([re]) => re.test(f)).map(([, n]) => n);
  return creditos.length ? `Desenho do Aprendice, com ${creditos.join(' e ')}` : 'Desenho do Aprendice';
}

/**
 * Legenda de crédito das figuras da teoria (revisão de 19/11/2026, item 9 das matérias). O campo `fonte` de figuras.json
 * é o registro de produção (como e com o que a figura foi feita: "SVG gerado por código, Python", "RDKit a partir do
 * SMILES…") e continua nos dados (princípio 10). Ao aluno vai só o crédito, sem jargão técnico: "Desenho do Aprendice",
 * com o nome de quem cedeu ícones ou dados quando a licença pede crédito.
 *
 * Pedido do dono de 27/11/2026 ("dar direito a tudo que é necessário e obrigatório"): a CC BY pede o nome do AUTOR e a
 * licença, não só o repositório. Nos ícones do Bioicons, o autor e a licença estão no caminho registrado em `fonte`
 * ("cc-by-3.0/Human_physiology/Servier/heart-front.svg" = Servier Medical Art, CC BY 3.0). Ícone CC0 não exige crédito;
 * fica o nome do repositório, por cortesia. O link de cada licença está em Configurações, "Créditos e fontes".
 */
const AUTORES_BIOICONS: Record<string, string> = {
  Servier: 'Servier Medical Art',
  DBCLS: 'DBCLS',
  Helicase_11: 'Helicase_11',
  'Frédéric_Bouché': 'Frédéric Bouché',
};

const TERCEIROS: [RegExp, string][] = [
  [/phosphor/i, 'ícones Phosphor (MIT)'],
  [/NIST/, 'dados do NIST'],
  [/IBGE/, 'dados do IBGE'],
  [/CRC Handbook/i, 'dados do CRC Handbook'],
  [/\bEPA\b/, 'dados da EPA'],
];

/** "ícones de Servier Medical Art (CC BY 3.0, via Bioicons)", pelo caminho registrado (ou pela licença, sem caminho) */
function creditoBioicons(f: string, licenca: string): string[] {
  if (!/bioicons/i.test(f)) return [];
  const porAutor = new Map<string, string>();
  let cc0 = false;
  for (const m of f.matchAll(/\b(cc-by-(\d\.\d)|cc-0)\/[^/()\s]+\/([^/()\s]+)\//g)) {
    if (m[1] === 'cc-0') { cc0 = true; continue; }
    const autor = AUTORES_BIOICONS[m[3]] || m[3].replace(/[_-]/g, ' ');
    porAutor.set(autor, `CC BY ${m[2]}`);
  }
  // registro sem caminho ("Bioicons + desenho próprio"): o autor vem da licença registrada ("CC BY 3.0 (Servier…)")
  if (!porAutor.size && !cc0 && /Servier/i.test(f + ' ' + licenca)) porAutor.set('Servier Medical Art', 'CC BY 3.0');
  const out = [...porAutor].map(([a, l]) => `ícones de ${a} (${l}, via Bioicons)`);
  if (cc0 || !out.length) out.push(cc0 ? 'ícones Bioicons (CC0)' : 'ícones Bioicons');
  return out;
}

export function legendaFigura(fonte: string | undefined, licenca = ''): string {
  const f = fonte || '';
  const creditos = [...creditoBioicons(f, licenca), ...TERCEIROS.filter(([re]) => re.test(f)).map(([, n]) => n)];
  return creditos.length ? `Desenho do Aprendice, com ${creditos.join(' e ')}` : 'Desenho do Aprendice';
}

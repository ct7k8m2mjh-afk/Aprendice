/**
 * Anos disponíveis de uma prova, curtos (dono, 27/11/2026): anos seguidos viram faixa ("2020 a 2027"); se falta algum,
 * as faixas se separam por " · " ("2020 a 2022 · 2024 a 2026"). Dois anos seguidos ficam lado a lado ("2024 · 2025").
 * Anos repetidos (1º e 2º semestre) contam uma vez; o que não for ano de 4 dígitos fica no fim, como veio.
 */
export function faixasDeAnos(anos: Iterable<string>): string {
  const lista = [...new Set(anos)];
  const nums = [...new Set(lista.map((a) => a.match(/^\d{4}/)?.[0]).filter(Boolean).map(Number))].sort((a, b) => a - b);
  const outros = lista.filter((a) => !/^\d{4}/.test(a));
  const partes: string[] = [];
  for (let i = 0; i < nums.length; ) {
    let j = i;
    while (j + 1 < nums.length && nums[j + 1] === nums[j] + 1) j++;
    if (j - i >= 2) partes.push(`${nums[i]} a ${nums[j]}`);
    else for (let k = i; k <= j; k++) partes.push(String(nums[k]));
    i = j + 1;
  }
  return [...partes, ...outros].join(' · ');
}

import { describe, expect, it } from 'vitest';
import { faixasDeAnos } from '../logica/anos';

describe('faixasDeAnos (dono, 27/11/2026)', () => {
  it('junta anos seguidos', () => expect(faixasDeAnos(['2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027'])).toBe('2020 a 2027'));
  it('separa quando falta um ano', () => expect(faixasDeAnos(['2020', '2021', '2022', '2024', '2025', '2026'])).toBe('2020 a 2022 · 2024 a 2026'));
  it('dois seguidos ou soltos ficam lado a lado; repetidos contam uma vez', () => expect(faixasDeAnos(['2025', '2024', '2024', '2021'])).toBe('2021 · 2024 · 2025'));
});

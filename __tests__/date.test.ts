import { brToISO, isoToBr, monthRange, shiftMonth } from '../src/utils/date';
test('converte data brasileira', () => expect(brToISO('19/09/2026')).toBe('2026-09-19'));
test('rejeita data impossível', () => expect(brToISO('31/02/2026')).toBeNull());
test('converte para formato brasileiro', () =>
  expect(isoToBr('2026-09-19')).toBe('19/09/2026'));
test('muda ano ao avançar mês', () =>
  expect(shiftMonth({ year: 2026, month: 12 }, 1)).toEqual({ year: 2027, month: 1 }));
test('intervalo de mês', () =>
  expect(monthRange({ year: 2026, month: 2 })).toEqual({
    start: '2026-02-01',
    endExclusive: '2026-03-01',
  }));

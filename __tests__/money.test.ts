import { formatMoney, parseMoney } from '../src/utils/money';
test('formata reais', () => expect(formatMoney(12.5)).toContain('12,50'));
test('interpreta formato brasileiro', () => expect(parseMoney('1.234,56')).toBe(1234.56));
test('interpreta decimal', () => expect(parseMoney('10,5')).toBe(10.5));
test('rejeita texto', () => expect(Number.isNaN(parseMoney('abc'))).toBe(true));

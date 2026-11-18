import {
  normalizeReceipt,
  ReceiptReadError,
  toBase64,
} from '../supabase/functions/scan-receipt/parse';
test('normaliza resposta válida', () =>
  expect(
    normalizeReceipt({
      merchant: 'Mercado',
      total: 10,
      category: 'Alimentação',
      items: [],
    }).total,
  ).toBe(10));
test('rejeita imagem que não é nota', () =>
  expect(() => normalizeReceipt({ is_receipt: false })).toThrow(ReceiptReadError));
test('infere total dos itens', () =>
  expect(
    normalizeReceipt({
      items: [{ description: 'Produto', quantity: 2, unit_price: 5, total_price: 10 }],
    }).total,
  ).toBe(10));
test('usa categoria Outros se desconhecida', () =>
  expect(normalizeReceipt({ total: 5, category: 'Outra' }).category).toBe('Outros'));
test('converte bytes em base64', () =>
  expect(toBase64(new Uint8Array([65, 66, 67]))).toBe('QUJD'));

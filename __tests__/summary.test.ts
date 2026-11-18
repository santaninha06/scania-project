import { summarizeReceipts } from '../src/utils/summary';
import type { Receipt } from '../src/types';
const base = {
  id: '1',
  user_id: 'u',
  image_path: 'x',
  status: 'done' as const,
  merchant: 'Loja',
  purchase_date: '2026-09-01',
  total: 10,
  category: 'Alimentação',
  payment_method: null,
  error_message: null,
  created_at: '2026-09-01T10:00:00Z',
} as Receipt;
test('soma notas concluídas', () =>
  expect(summarizeReceipts([base, { ...base, id: '2', total: 20 }]).total).toBe(30));
test('ignora pendentes', () =>
  expect(summarizeReceipts([{ ...base, status: 'pending', total: null }]).count).toBe(0));

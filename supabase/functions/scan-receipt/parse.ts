export const CATEGORY_NAMES = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Lazer',
  'Educação',
  'Compras',
  'Contas',
  'Outros',
] as const;
export type CategoryName = (typeof CATEGORY_NAMES)[number];
export interface ExtractedItem {
  description: string;
  quantity: number;
  unit_price: number | null;
  total_price: number;
}
export interface ExtractedReceipt {
  merchant: string;
  purchase_date: string | null;
  total: number;
  category: CategoryName;
  payment_method: string | null;
  items: ExtractedItem[];
}
export class ReceiptReadError extends Error {}
const round2 = (n: number) => Math.round(n * 100) / 100;
function toNumber(v: unknown): number | null {
  const n = typeof v === 'string' ? Number(v.replace(',', '.')) : v;
  return typeof n === 'number' && Number.isFinite(n) && n >= 0 ? n : null;
}
function toText(v: unknown, max: number) {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}
function toDate(v: unknown): string | null {
  if (typeof v !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return null;
  const [y, m, d] = v.split('-').map(Number),
    dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d
    ? v
    : null;
}
function normalizeItem(raw: unknown): ExtractedItem | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const r = raw as Record<string, unknown>,
    description = toText(r.description, 120);
  if (!description) return null;
  const q = toNumber(r.quantity),
    quantity = q !== null && q > 0 ? q : 1,
    unit = toNumber(r.unit_price);
  let total = toNumber(r.total_price);
  if (total === null && unit !== null) total = unit * quantity;
  if (total === null) return null;
  return {
    description,
    quantity,
    unit_price: unit === null ? null : round2(unit),
    total_price: round2(total),
  };
}
export function normalizeReceipt(raw: unknown): ExtractedReceipt {
  if (typeof raw !== 'object' || raw === null)
    throw new ReceiptReadError('A resposta da IA veio em formato inválido.');
  const r = raw as Record<string, unknown>;
  if (r.is_receipt === false)
    throw new ReceiptReadError('A imagem não parece ser uma nota fiscal ou recibo.');
  const items = (Array.isArray(r.items) ? r.items : [])
    .slice(0, 100)
    .map(normalizeItem)
    .filter((x): x is ExtractedItem => x !== null);
  let total = toNumber(r.total);
  if (total === null && items.length)
    total = items.reduce((s, i) => s + Math.round(i.total_price * 100), 0) / 100;
  if (total === null || total <= 0)
    throw new ReceiptReadError('Não foi possível ler o valor total da nota.');
  return {
    merchant: toText(r.merchant, 80) || 'Estabelecimento não identificado',
    purchase_date: toDate(r.purchase_date),
    total: round2(total),
    category: CATEGORY_NAMES.find((c) => c === r.category) ?? 'Outros',
    payment_method: toText(r.payment_method, 40) || null,
    items,
  };
}
export function toBase64(bytes: Uint8Array) {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000)
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
}
export const MOCK_RECEIPT: ExtractedReceipt = {
  merchant: 'Supermercado Exemplo',
  purchase_date: '2026-09-18',
  total: 87.4,
  category: 'Alimentação',
  payment_method: 'Cartão de débito',
  items: [
    { description: 'Arroz 5 kg', quantity: 1, unit_price: 29.9, total_price: 29.9 },
    { description: 'Feijão preto 1 kg', quantity: 2, unit_price: 8.5, total_price: 17 },
    {
      description: 'Leite integral 1 L',
      quantity: 6,
      unit_price: 5.25,
      total_price: 31.5,
    },
    { description: 'Sabão em pó', quantity: 1, unit_price: 9, total_price: 9 },
  ],
};

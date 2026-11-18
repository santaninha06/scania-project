const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
export function formatMoney(value: number) {
  return brl.format(value);
}
export function parseMoney(text: string): number {
  const clean = text.replace(/[^\d.,]/g, '');
  if (!/\d/.test(clean)) return NaN;
  let normalized = clean;
  if (clean.includes(',')) normalized = clean.replace(/\./g, '').replace(',', '.');
  else if ((clean.match(/\./g) || []).length > 1) normalized = clean.replace(/\./g, '');
  const n = Number(normalized);
  return Number.isFinite(n) ? n : NaN;
}

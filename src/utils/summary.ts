import { categoryInfo } from '@/constants/categories';
import type { Receipt } from '@/types';
import { monthRange } from './date';
import type { YearMonth } from './date';
export interface CategoryTotal {
  category: string;
  color: string;
  icon: string;
  total: number;
  count: number;
  percent: number;
}
export interface ReceiptSummary {
  total: number;
  count: number;
  average: number;
  byCategory: CategoryTotal[];
}
export function receiptDate(r: Receipt) {
  return r.purchase_date ?? r.created_at.slice(0, 10);
}
export function filterByMonth(list: Receipt[], month: YearMonth) {
  const { start, endExclusive } = monthRange(month);
  return list.filter((r) => {
    const d = receiptDate(r);
    return d >= start && d < endExclusive;
  });
}
export function summarizeReceipts(list: Receipt[]): ReceiptSummary {
  const totals = new Map<string, { cents: number; count: number }>();
  let all = 0,
    count = 0;
  for (const r of list) {
    if (r.status !== 'done' || r.total === null) continue;
    const cents = Math.round(r.total * 100),
      key = categoryInfo(r.category).name,
      current = totals.get(key) ?? { cents: 0, count: 0 };
    current.cents += cents;
    current.count++;
    totals.set(key, current);
    all += cents;
    count++;
  }
  const byCategory = Array.from(totals, ([category, v]) => {
    const info = categoryInfo(category);
    return {
      category,
      color: info.color,
      icon: info.icon,
      total: v.cents / 100,
      count: v.count,
      percent: all > 0 ? (v.cents / all) * 100 : 0,
    };
  }).sort((a, b) => b.total - a.total);
  return {
    total: all / 100,
    count,
    average: count ? Math.round(all / count) / 100 : 0,
    byCategory,
  };
}

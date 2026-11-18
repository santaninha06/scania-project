export interface YearMonth {
  year: number;
  month: number;
}
const MONTHS_PT = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];
const pad = (n: number) => String(n).padStart(2, '0');
export function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
export function isoToBr(iso: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}
export function brToISO(br: string): string | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(br.trim());
  if (!m) return null;
  const d = +m[1],
    mo = +m[2],
    y = +m[3],
    check = new Date(y, mo - 1, d);
  return check.getFullYear() === y && check.getMonth() === mo - 1 && check.getDate() === d
    ? `${m[3]}-${m[2]}-${m[1]}`
    : null;
}
export function maskBrDate(text: string) {
  const d = text.replace(/\D/g, '').slice(0, 8);
  return d.length <= 2
    ? d
    : d.length <= 4
      ? `${d.slice(0, 2)}/${d.slice(2)}`
      : `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}
export function currentYearMonth(): YearMonth {
  const n = new Date();
  return { year: n.getFullYear(), month: n.getMonth() + 1 };
}
export function shiftMonth(ym: YearMonth, delta: number): YearMonth {
  const i = ym.year * 12 + ym.month - 1 + delta;
  return { year: Math.floor(i / 12), month: (i % 12) + 1 };
}
export function monthRange(ym: YearMonth) {
  const n = shiftMonth(ym, 1);
  return {
    start: `${ym.year}-${pad(ym.month)}-01`,
    endExclusive: `${n.year}-${pad(n.month)}-01`,
  };
}
export function monthLabel(ym: YearMonth) {
  return `${MONTHS_PT[ym.month - 1]} ${ym.year}`;
}
export function dayLabel(iso: string, today = todayISO()) {
  if (iso === today) return 'Hoje';
  if (iso === addDaysISO(today, -1)) return 'Ontem';
  return isoToBr(iso).slice(0, 5);
}
export function addDaysISO(iso: string, days: number) {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d + days);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

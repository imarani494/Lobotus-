

export interface MonthRange {
  fromDate: string;
  toDate: string;
}

/**
 * Returns ISO date strings for the first and last day of a given month.
 * @param year
 * @param month - 0-indexed (0 = January)
 */
export const getMonthRange = (year: number, month: number): MonthRange => {
  const lastDay = new Date(year, month + 1, 0).getDate();
  const mm = String(month + 1).padStart(2, '0');
  return {
    fromDate: `${year}-${mm}-01`,
    toDate: `${year}-${mm}-${String(lastDay).padStart(2, '0')}`,
  };
};


export const formatDisplayDate = (date: Date | string): string => {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return 'N/A';
  const months = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ];
  return `${d.getDate()}-${months[d.getMonth()]}-${d.getFullYear()}`;
};


export const getWeekday = (date: Date | string): string => {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en', { weekday: 'short' });
};


export const todayISO = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(now.getDate()).padStart(2, '0')}`;
};

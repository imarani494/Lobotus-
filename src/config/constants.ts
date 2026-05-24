export const BASE_URL = 'https://apex.metricinfo.com/ords/accounts';

export const DEFAULT_SUBSCRIPTION_ID = 'SUB22106';
export const DEFAULT_USER_ID = '177';
export const DEFAULT_EMPLOYEE_ID = '177';

export const ITEMS_PER_PAGE = 20;

export const COLORS = {
  primary: '#6C3FC5',
  primaryLight: '#EDE9FD',
  primaryMid: '#9B72E8',
  background: '#F5F4FB',
  surface: '#FFFFFF',
  green: '#22A96A',
  greenLight: '#E6F7EF',
  red: '#E03B3B',
  redLight: '#FDEAEA',
  amber: '#E08C1A',
  amberLight: '#FEF4E0',
  blue: '#1A6FE0',
  blueLight: '#E6F0FE',
  gray: '#6B7280',
  grayLight: '#F3F4F6',
  textPrimary: '#1A1A2E',
  textSecondary: '#6B7280',
  border: '#EEEEEE',
} as const;

export type ColorKey = keyof typeof COLORS;

export const RADIUS = {
  sm: 8,
  md: 14,
  lg: 20,
  full: 999,
} as const;

export const MONTHS: string[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

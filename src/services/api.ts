import {
  BASE_URL,
  DEFAULT_SUBSCRIPTION_ID,
  DEFAULT_USER_ID,
  DEFAULT_EMPLOYEE_ID,
} from '../config/constants';
import { getMonthRange } from '../utils/dateUtils';

export interface ApiResult<T = unknown> {
  success: boolean;
  data: T | null;
  error: string | null;
}

export interface ClientItem {
  client_id?: string | number;
  client_name?: string;
  name?: string;
  client_code?: string;
  address?: string;
  city?: string;
  person_name?: string;
  contact_person?: string;
  mobile?: string;
  email?: string;
}

export interface AttendanceRecord {
  att_date?: string;
  date?: string;
  day?: number | string;
  day_name?: string;
  status?: string;
  attendance_status?: string;
  in_time?: string;
  out_time?: string;
  working_hours?: string;
}

export interface FetchClientListParams {
  subscriptionId?: string;
  employeeId?: string | number;
  offset?: number;
}

export interface FetchAttendanceParams {
  userId?: string | number;
  fromDate?: string;
  toDate?: string;
}

// ─── Helper ──────────────────────────────────────────────────────────────────

const handleResponse = async (response: Response): Promise<unknown> => {
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

const jsonHeaders: HeadersInit = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

export const fetchClientList = async ({
  subscriptionId = DEFAULT_SUBSCRIPTION_ID,
  employeeId = DEFAULT_EMPLOYEE_ID,
  offset = 0,
}: FetchClientListParams = {}): Promise<ApiResult> => {
  try {
    const url =
      `${BASE_URL}/clientlist/getclient` +
      `?subscription_id=${subscriptionId}` +
      `&EMPLOYEE_ID=${employeeId}` +
      `&offset=${offset}`;

    const response = await fetch(url, { method: 'GET', headers: jsonHeaders });
    const data = await handleResponse(response);
    return { success: true, data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[fetchClientList]', message);
    return { success: false, data: null, error: message };
  }
};

export const fetchAttendance = async ({
  userId = DEFAULT_USER_ID,
  fromDate,
  toDate,
}: FetchAttendanceParams = {}): Promise<ApiResult> => {
  try {
    const now = new Date();
    const { fromDate: defaultFrom, toDate: defaultTo } = getMonthRange(
      now.getFullYear(),
      now.getMonth(),
    );

    const from = fromDate ?? defaultFrom;
    const to = toDate ?? defaultTo;

    const url =
      `${BASE_URL}/attendance/getdaywise` +
      `?USER_ID=${userId}` +
      `&FROM_DATE=${from}` +
      `&TO_DATE=${to}`;

    const response = await fetch(url, { method: 'GET', headers: jsonHeaders });
    const data = await handleResponse(response);
    return { success: true, data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[fetchAttendance]', message);
    return { success: false, data: null, error: message };
  }
};

export const normalizeArray = <T = unknown>(
  responseData: unknown,
  keys: string[] = ['items', 'data', 'clients', 'attendance'],
): T[] => {
  if (Array.isArray(responseData)) return responseData as T[];
  if (responseData && typeof responseData === 'object') {
    for (const key of keys) {
      const val = (responseData as Record<string, unknown>)[key];
      if (Array.isArray(val)) return val as T[];
    }
  }
  return [];
};

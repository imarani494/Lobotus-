import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { fetchAttendance, normalizeArray } from '../services/api';
import type { AttendanceRecord } from '../services/api';
import {
  AttendanceCard,
  LoadingView,
  ErrorView,
  EmptyView,
} from '../components';
import { COLORS, RADIUS, MONTHS } from '../config/constants';
import { getMonthRange } from '../utils/dateUtils';

type CellClass =
  | 'present'
  | 'absent'
  | 'half'
  | 'leave'
  | 'holiday'
  | 'future'
  | 'empty';

interface StatusCellConfig {
  cls: CellClass;
  short: string;
}

interface CellColor {
  bg: string;
  text: string;
}

interface CalendarCell {
  type: 'empty' | 'day';
  key: string;
  day?: number;
  cls?: CellClass;
  status?: string | null;
  cfg?: StatusCellConfig | null;
  hours?: string;
  rec?: AttendanceRecord | null;
  isFuture?: boolean;
}

interface SummaryItem {
  key: string;
  color: string;
  icon: string;
}

interface SummaryCount {
  Present: number;
  Absent: number;
  'Half Day': number;
  Leave: number;
  Holiday: number;
  [key: string]: number;
}

interface DetailRowProps {
  label: string;
  value: string;
  valueStyle?: object;
}

interface DetailPanelProps {
  record: AttendanceRecord | null;
}

const WEEKDAYS: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const STATUS_CELL_CONFIG: Record<string, StatusCellConfig> = {
  Present: { cls: 'present', short: '' },
  Absent: { cls: 'absent', short: 'Absent' },
  'Half Day': { cls: 'half', short: 'Half' },
  Leave: { cls: 'leave', short: 'Leave' },
  Holiday: { cls: 'holiday', short: 'Holiday' },
};

const CELL_COLORS: Record<string, CellColor> = {
  present: { bg: '#D4F5E6', text: '#1A7A4A' },
  absent: { bg: '#FDE4E4', text: '#C0392B' },
  half: { bg: '#FEF3D0', text: '#966A00' },
  leave: { bg: '#E0EAFF', text: '#2353B0' },
  holiday: { bg: '#F0E4FF', text: '#7B3DB5' },
  future: { bg: '#F3F4F6', text: '#BBBBBB' },
  empty: { bg: 'transparent', text: 'transparent' },
};

const SUMMARY_ITEMS: SummaryItem[] = [
  { key: 'Present', color: COLORS.green, icon: '✅' },
  { key: 'Absent', color: COLORS.red, icon: '❌' },
  { key: 'Half Day', color: COLORS.amber, icon: '🌓' },
  { key: 'Leave', color: COLORS.blue, icon: '🏖️' },
];

// ─── Component ────────────────────────────────────────────────────────────────

const AttendanceScreen: React.FC = () => {
  const now = new Date();
  const [month, setMonth] = useState<number>(now.getMonth());
  const [year, setYear] = useState<number>(now.getFullYear());
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(
    null,
  );

  const recordsByDay = useMemo<Record<number, AttendanceRecord>>(() => {
    const map: Record<number, AttendanceRecord> = {};
    records.forEach(r => {
      const d = new Date(r.att_date || r.date || '');
      if (!isNaN(d.getTime())) map[d.getDate()] = r;
    });
    return map;
  }, [records]);

  const summary = useMemo<SummaryCount>(() => {
    const counts: SummaryCount = {
      Present: 0,
      Absent: 0,
      'Half Day': 0,
      Leave: 0,
      Holiday: 0,
    };
    records.forEach(r => {
      const s = r.status || r.attendance_status || '';
      if (counts[s] !== undefined) counts[s]++;
    });
    return counts;
  }, [records]);

  const loadAttendance = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    setSelectedRecord(null);

    const { fromDate, toDate } = getMonthRange(year, month);
    const result = await fetchAttendance({ fromDate, toDate });

    if (!result.success) {
      setError(result.error);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    setRecords(
      normalizeArray<AttendanceRecord>(result.data, [
        'items',
        'data',
        'attendance',
      ]),
    );
    setLoading(false);
    setRefreshing(false);
  }, [month, year]);

  useEffect(() => {
    loadAttendance();
  }, [month, year]);

  const changeMonth = (dir: number): void => {
    let m = month + dir;
    let y = year;
    if (m < 0) {
      m = 11;
      y -= 1;
    }
    if (m > 11) {
      m = 0;
      y += 1;
    }
    setMonth(m);
    setYear(y);
  };

  const onRefresh = (): void => {
    setRefreshing(true);
    loadAttendance();
  };

  const buildCalendarCells = (): CalendarCell[] => {
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const cells: CalendarCell[] = [];

    for (let i = 0; i < firstWeekday; i++) {
      cells.push({ type: 'empty', key: `e-${i}` });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const cellDate = new Date(year, month, d);
      const isFuture = cellDate > today;
      const rec = recordsByDay[d] ?? null;
      const status = rec?.status || rec?.attendance_status || null;
      const cfg: StatusCellConfig | null = status
        ? STATUS_CELL_CONFIG[status] ?? null
        : null;
      const cls: CellClass = isFuture
        ? 'future'
        : cfg?.cls || (status ? 'empty' : 'future');
      const hours = rec?.working_hours || '';

      cells.push({
        type: 'day',
        key: `d-${d}`,
        day: d,
        cls,
        status,
        cfg,
        hours,
        rec,
        isFuture,
      });
    }

    return cells;
  };

  const renderCell = (cell: CalendarCell): React.ReactElement => {
    if (cell.type === 'empty') {
      return <View key={cell.key} style={styles.calCell} />;
    }

    const colors: CellColor =
      CELL_COLORS[cell.cls ?? 'future'] ?? CELL_COLORS.future;
    const selectedDay = selectedRecord
      ? new Date(selectedRecord.att_date || selectedRecord.date || '').getDate()
      : null;
    const isSelected = selectedDay === cell.day;

    return (
      <TouchableOpacity
        key={cell.key}
        style={[
          styles.calCell,
          { backgroundColor: colors.bg },
          isSelected && styles.calCellSelected,
          cell.isFuture && styles.calCellFuture,
        ]}
        onPress={() => {
          if (!cell.isFuture && cell.rec) setSelectedRecord(cell.rec);
        }}
        activeOpacity={cell.isFuture ? 1 : 0.75}
        disabled={cell.isFuture || !cell.rec}
      >
        <Text style={[styles.calCellNum, { color: colors.text }]}>
          {cell.day}
        </Text>
        {cell.hours ? (
          <Text
            style={[styles.calCellSub, { color: colors.text }]}
            numberOfLines={1}
          >
            {cell.hours.replace(' hours', 'h').replace(' minutes', 'm')}
          </Text>
        ) : cell.cfg?.short ? (
          <Text style={[styles.calCellSub, { color: colors.text }]}>
            {cell.cfg.short}
          </Text>
        ) : null}
      </TouchableOpacity>
    );
  };

  // ─── Detail Row ───────────────────────────────────────────────────────────
  const DetailRow: React.FC<DetailRowProps> = ({
    label,
    value,
    valueStyle,
  }) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailKey}>{label}</Text>
      <Text style={[styles.detailVal, valueStyle]} numberOfLines={3}>
        {value}
      </Text>
    </View>
  );

  const getStatusColor = (s: string): string => {
    const map: Record<string, string> = {
      Present: COLORS.green,
      Absent: COLORS.red,
      'Half Day': COLORS.amber,
      Leave: COLORS.blue,
      Holiday: '#9334E6',
    };
    return map[s] ?? COLORS.gray;
  };

  const getStatusBg = (s: string): string => {
    const map: Record<string, string> = {
      Present: COLORS.greenLight,
      Absent: COLORS.redLight,
      'Half Day': COLORS.amberLight,
      Leave: COLORS.blueLight,
      Holiday: '#F3E8FF',
    };
    return map[s] ?? COLORS.grayLight;
  };

  const DetailPanel: React.FC<DetailPanelProps> = ({ record }) => {
    if (!record) return null;
    const d = new Date(record.att_date || record.date || '');
    const dayNum = d.getDate();
    const monthName = MONTHS[d.getMonth()].slice(0, 3).toUpperCase();
    const dateStr = `${dayNum}-${monthName}-${d.getFullYear()}`;
    const status = record.status || 'Unknown';

    return (
      <View style={styles.detailPanel}>
        <Text style={styles.detailTitle}>Attendance Details</Text>
        <DetailRow
          label="Date"
          value={dateStr}
          valueStyle={styles.valuePurple}
        />
        {record.working_hours ? (
          <DetailRow
            label="Working Hours"
            value={record.working_hours}
            valueStyle={styles.valueGreen}
          />
        ) : null}
        <View style={styles.detailRow}>
          <Text style={styles.detailKey}>Status</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusBg(status) },
            ]}
          >
            <Text
              style={[
                styles.statusBadgeText,
                { color: getStatusColor(status) },
              ]}
            >
              {status}
            </Text>
          </View>
        </View>
        {record.in_time ? (
          <DetailRow
            label="Check In"
            value={record.in_time}
            valueStyle={styles.valueGreen}
          />
        ) : null}
        {(record as any).check_in_location ? (
          <DetailRow
            label="Check In Location"
            value={(record as any).check_in_location}
            valueStyle={styles.valuePurple}
          />
        ) : null}
        {record.out_time ? (
          <DetailRow
            label="Check Out"
            value={record.out_time}
            valueStyle={styles.valuePurple}
          />
        ) : null}
        {(record as any).check_out_location ? (
          <DetailRow
            label="Check Out Location"
            value={(record as any).check_out_location}
            valueStyle={styles.valuePurple}
          />
        ) : null}
      </View>
    );
  };

  if (loading && !refreshing) {
    return <LoadingView message="Fetching attendance..." />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadAttendance} />;
  }

  const cells = buildCalendarCells();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Calendar Header */}
        <View style={styles.calHeader}>
          <View style={styles.titleRow}>
            <Text style={styles.screenTitle}>Attendance</Text>
          </View>

          {/* Month Navigator */}
          <View style={styles.monthNav}>
            <TouchableOpacity
              style={styles.monthNavBtn}
              onPress={() => changeMonth(-1)}
            >
              <Text style={styles.monthNavArrow}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.monthLabel}>
              {MONTHS[month]} {year}
            </Text>
            <TouchableOpacity
              style={styles.monthNavBtn}
              onPress={() => changeMonth(1)}
            >
              <Text style={styles.monthNavArrow}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Weekday labels */}
          <View style={styles.weekRow}>
            {WEEKDAYS.map(wd => (
              <Text key={wd} style={styles.weekLabel}>
                {wd}
              </Text>
            ))}
          </View>

          {/* Calendar grid */}
          <View style={styles.calGrid}>
            {cells.map(cell => renderCell(cell))}
          </View>
        </View>

        {/* Detail panel when a day is selected */}
        {selectedRecord && <DetailPanel record={selectedRecord} />}

        {/* Summary bar */}
        {!selectedRecord && records.length > 0 && (
          <View style={styles.summaryBar}>
            {SUMMARY_ITEMS.map(({ key, color, icon }) => (
              <View key={key} style={styles.summaryItem}>
                <Text style={[styles.summaryCount, { color }]}>
                  {summary[key] ?? 0}
                </Text>
                <Text style={styles.summaryLabel}>
                  {icon} {key}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Day list */}
        {!selectedRecord && records.length > 0 && (
          <View style={{ paddingBottom: 24 }}>
            {records
              .filter(r => r.status && r.status !== 'future')
              .map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedRecord(item)}
                >
                  <AttendanceCard record={item} />
                </TouchableOpacity>
              ))}
          </View>
        )}

        {!selectedRecord && records.length === 0 && (
          <EmptyView message="No attendance records found for this month." />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1 },

  calHeader: {
    backgroundColor: COLORS.surface,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  titleRow: { paddingHorizontal: 18, paddingTop: 14 },
  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    borderBottomWidth: 3,
    borderBottomColor: COLORS.primary,
    alignSelf: 'flex-start',
    paddingBottom: 4,
    marginBottom: 12,
  },

  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  monthNavBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.grayLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthNavArrow: { fontSize: 22, color: COLORS.gray, lineHeight: 24 },
  monthLabel: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary },

  weekRow: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginBottom: 4,
  },
  weekLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },

  calGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    gap: 4,
  },
  calCell: {
    width: '13.28%',
    aspectRatio: 1,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  calCellSelected: {
    borderWidth: 2.5,
    borderColor: COLORS.primary,
  },
  calCellFuture: { opacity: 0.5 },
  calCellNum: { fontSize: 14, fontWeight: '800' },
  calCellSub: {
    fontSize: 8,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 1,
  },

  summaryBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    marginHorizontal: 14,
    marginTop: 12,
    marginBottom: 4,
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  summaryItem: { flex: 1, alignItems: 'center', gap: 2 },
  summaryCount: { fontSize: 22, fontWeight: '800' },
  summaryLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },

  // Detail Panel
  detailPanel: {
    backgroundColor: COLORS.surface,
    margin: 14,
    borderRadius: RADIUS.md,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  detailTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 7,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F5F5F5',
    gap: 10,
  },
  detailKey: { fontSize: 13, color: COLORS.textSecondary, flex: 0.45 },
  detailVal: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 0.55,
    textAlign: 'right',
  },
  valuePurple: { color: COLORS.primary },
  valueGreen: { color: COLORS.green },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  statusBadgeText: { fontSize: 12, fontWeight: '700' },
});

export default AttendanceScreen;

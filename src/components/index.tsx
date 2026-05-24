import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { COLORS, RADIUS } from '../config/constants';
import type { ClientItem, AttendanceRecord } from '../services/api';

interface LoadingViewProps {
  message?: string;
}

interface ErrorViewProps {
  message?: string;
  onRetry?: () => void;
}

interface EmptyViewProps {
  message?: string;
}

interface ClientCardProps {
  client: ClientItem;
}

interface AttendanceCardProps {
  record: AttendanceRecord;
}

export const LoadingView: React.FC<LoadingViewProps> = ({
  message = 'Loading...',
}) => (
  <View style={styles.centered}>
    <ActivityIndicator size="large" color={COLORS.primary} />
    <Text style={styles.loadingText}>{message}</Text>
  </View>
);

export const ErrorView: React.FC<ErrorViewProps> = ({
  message = 'Something went wrong.',
  onRetry,
}) => (
  <View style={styles.centered}>
    <Text style={styles.errorIcon}>⚠️</Text>
    <Text style={styles.errorTitle}>Oops!</Text>
    <Text style={styles.errorMessage}>{message}</Text>
    {onRetry && (
      <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
        <Text style={styles.retryText}>Try Again</Text>
      </TouchableOpacity>
    )}
  </View>
);

export const EmptyView: React.FC<EmptyViewProps> = ({
  message = 'No data found.',
}) => (
  <View style={styles.centered}>
    <Text style={styles.emptyIcon}>📭</Text>
    <Text style={styles.emptyText}>{message}</Text>
  </View>
);

export const ClientCard: React.FC<ClientCardProps> = ({ client }) => {
  const name = client.client_name || client.name || 'N/A';
  const initials = name
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const address =
    client.address || [client.city, 'India'].filter(Boolean).join(', ');

  const personName = client.person_name || client.contact_person || '';

  return (
    <View style={styles.clientCard}>
      {/* Header row */}
      <View style={styles.cardHeaderRow}>
        <View style={styles.cardTitleRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.clientName} numberOfLines={1}>
            {name}
          </Text>
        </View>
        <TouchableOpacity style={styles.retagBtn}>
          <Text style={styles.retagText}>Re-tag</Text>
        </TouchableOpacity>
      </View>

      {/* Address */}
      {address ? (
        <Text style={styles.clientAddr} numberOfLines={2}>
          {address}
        </Text>
      ) : null}

      {/* Contact row */}
      <View style={styles.contactRow}>
        {personName ? (
          <Text style={styles.contactPerson}>👤 {personName}</Text>
        ) : null}
        {client.mobile ? (
          <Text style={styles.contactDetail}>📞 {client.mobile}</Text>
        ) : null}
        {client.email && client.email !== 'null' ? (
          <Text style={styles.contactDetail} numberOfLines={1}>
            ✉️ {client.email}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

interface StatusConfig {
  color: string;
  bg: string;
  icon: string;
}

const STATUS_CONFIG: Record<string, StatusConfig> = {
  Present: { color: COLORS.green, bg: COLORS.greenLight, icon: '✅' },
  Absent: { color: COLORS.red, bg: COLORS.redLight, icon: '❌' },
  'Half Day': { color: COLORS.amber, bg: COLORS.amberLight, icon: '🌓' },
  Leave: { color: COLORS.blue, bg: COLORS.blueLight, icon: '🏖️' },
  Holiday: { color: '#9334E6', bg: '#F3E8FF', icon: '🎉' },
  Unknown: { color: COLORS.gray, bg: COLORS.grayLight, icon: '❓' },
};

export const AttendanceCard: React.FC<AttendanceCardProps> = ({ record }) => {
  const status = record.status || record.attendance_status || 'Unknown';
  const cfg: StatusConfig = STATUS_CONFIG[status] ?? STATUS_CONFIG.Unknown;

  const rawDate = record.att_date || record.date;
  const d = rawDate ? new Date(rawDate) : null;
  const dayNum = d ? d.getDate() : record.day ?? '?';
  const weekday = d
    ? d.toLocaleDateString('en', { weekday: 'short' })
    : record.day_name ?? '';

  return (
    <View style={[styles.attCard, { borderLeftColor: cfg.color }]}>
      <View style={styles.dateBox}>
        <Text style={styles.dateNum}>{dayNum}</Text>
        <Text style={styles.dateWd}>{weekday.toUpperCase()}</Text>
      </View>

      <View style={styles.attInfo}>
        <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
          <Text style={[styles.statusText, { color: cfg.color }]}>
            {cfg.icon} {status}
          </Text>
        </View>

        <View style={styles.timeRow}>
          {record.in_time ? (
            <Text style={styles.timeText}>In: {record.in_time}</Text>
          ) : null}
          {record.out_time ? (
            <Text style={styles.timeText}>Out: {record.out_time}</Text>
          ) : null}
          {record.working_hours ? (
            <Text style={styles.timeText}>⏱ {record.working_hours}</Text>
          ) : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 8,
  },
  loadingText: { marginTop: 12, fontSize: 14, color: COLORS.textSecondary },

  errorIcon: { fontSize: 40 },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryBtn: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
  },
  retryText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  emptyIcon: { fontSize: 48 },
  emptyText: {
    marginTop: 12,
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },

  // Client Card
  clientCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    marginHorizontal: 14,
    marginVertical: 6,
    padding: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: COLORS.primary, fontSize: 13, fontWeight: '800' },
  clientName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
  },
  retagBtn: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: '#FEF3E0',
    borderRadius: RADIUS.full,
  },
  retagText: { fontSize: 11, fontWeight: '700', color: COLORS.amber },
  clientAddr: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
    marginBottom: 8,
  },
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  contactPerson: { fontSize: 12, color: COLORS.primary, fontWeight: '600' },
  contactDetail: { fontSize: 12, color: COLORS.primary, fontWeight: '500' },

  // Attendance Card
  attCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    marginHorizontal: 14,
    marginVertical: 5,
    padding: 14,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  dateBox: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  dateNum: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary },
  dateWd: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '700',
    marginTop: 2,
  },
  attInfo: { flex: 1 },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    marginBottom: 6,
  },
  statusText: { fontSize: 12, fontWeight: '700' },
  timeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  timeText: { fontSize: 12, color: COLORS.textSecondary },
});

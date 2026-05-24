import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { COLORS, RADIUS } from '../config/constants';

interface QuickAction {
  label: string;
  icon: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  { label: 'My Visit', icon: '📍' },
  { label: 'Direct', icon: '🧭' },
  { label: 'Schedule', icon: '📆' },
];

const HomeScreen: React.FC = () => {
  const [checkedIn, setCheckedIn] = useState<boolean>(true);
  const [checkInTime] = useState<string>('11:12 AM');
  const [workHours] = useState<string>('04:43');

  const handleCheckToggle = (): void => {
    Alert.alert(
      checkedIn ? 'Check Out' : 'Check In',
      checkedIn
        ? 'Are you sure you want to check out?'
        : 'Confirm check in at this location?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => setCheckedIn(prev => !prev),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.logo}>MetricInfo</Text>
              <Text style={styles.version}>v1.0.8</Text>
            </View>
            <TouchableOpacity
              hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
            >
              <Text style={styles.menuIcon}>⋮</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.profileRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>JM</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.greeting}>Hi Jagadishgouda Mudigoudra!</Text>
              <Text style={styles.dutyStatus}>
                {checkedIn ? '🟢 You are on duty...' : '🔴 You are off duty'}
              </Text>
            </View>
          </View>
        </View>

        {/* Main card */}
        <View style={styles.card}>
          {/* Quick Actions */}
          <Text style={styles.sectionLabel}>⚡ Quick Actions</Text>
          <View style={styles.qaRow}>
            {QUICK_ACTIONS.map(({ label, icon }) => (
              <TouchableOpacity
                key={label}
                style={styles.qaBtn}
                activeOpacity={0.75}
                onPress={() => Alert.alert(label)}
              >
                <Text style={styles.qaIcon}>{icon}</Text>
                <Text style={styles.qaLabel}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Current Location */}
          <View style={styles.locationBox}>
            <Text style={styles.locationTitle}>📌 Current Location</Text>
            <Text style={styles.locationText}>
              XHJG+GJV, Racecourse, Gandhi Nagar, Bengaluru, Karnataka 560009,
              India
            </Text>
          </View>

          {/* Check In/Out Button */}
          <TouchableOpacity
            style={[
              styles.checkBtn,
              { backgroundColor: checkedIn ? COLORS.red : COLORS.green },
            ]}
            activeOpacity={0.85}
            onPress={handleCheckToggle}
          >
            <Text style={styles.checkBtnText}>
              {checkedIn ? 'Check Out' : 'Check In'}
            </Text>
          </TouchableOpacity>

          {/* Time Summary */}
          <View style={styles.timeRow}>
            <View style={styles.timeBox}>
              <Text style={styles.timeIcon}>🔓</Text>
              <Text style={styles.timeValue}>{checkInTime}</Text>
              <Text style={styles.timeLabel}>Check In</Text>
            </View>
            <View style={styles.timeDivider} />
            <View style={styles.timeBox}>
              <Text style={styles.timeIcon}>🕐</Text>
              <Text style={styles.timeValue}>
                {checkedIn ? '--:--' : '05:30 PM'}
              </Text>
              <Text style={styles.timeLabel}>Check Out</Text>
            </View>
            <View style={styles.timeDivider} />
            <View style={styles.timeBox}>
              <Text style={styles.timeIcon}>⏱</Text>
              <Text style={styles.timeValue}>{workHours}</Text>
              <Text style={styles.timeLabel}>Hours</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1 },

  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 56,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  logo: { fontSize: 22, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  version: { fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 1 },
  menuIcon: { fontSize: 24, color: 'rgba(255,255,255,0.8)' },

  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 20,
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarText: { fontSize: 24, fontWeight: '800', color: '#fff' },
  profileInfo: { flex: 1 },
  greeting: { fontSize: 17, fontWeight: '700', color: '#fff', lineHeight: 22 },
  dutyStatus: {
    fontSize: 12,
    color: '#a8f0cc',
    fontWeight: '600',
    marginTop: 4,
  },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    margin: 16,
    marginTop: -36,
    padding: 18,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },

  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 14,
  },

  qaRow: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  qaBtn: {
    flex: 1,
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.sm,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 6,
  },
  qaIcon: { fontSize: 22 },
  qaLabel: { fontSize: 11, fontWeight: '700', color: COLORS.primary },

  locationBox: {
    backgroundColor: '#F8F7FD',
    borderRadius: RADIUS.sm,
    padding: 12,
    marginBottom: 14,
  },
  locationTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.red,
    textAlign: 'center',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 17,
  },

  checkBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    marginBottom: 18,
  },
  checkBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  timeBox: { alignItems: 'center', gap: 4 },
  timeIcon: { fontSize: 22 },
  timeValue: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  timeLabel: { fontSize: 10, color: COLORS.textSecondary, fontWeight: '600' },
  timeDivider: { width: 1, backgroundColor: '#F0F0F0', marginVertical: 4 },
});

export default HomeScreen;

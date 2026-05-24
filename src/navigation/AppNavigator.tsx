import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, StyleSheet } from 'react-native';
import type { RouteProp } from '@react-navigation/native';

import HomeScreen from '../screens/HomeScreen';
import CompanyScreen from '../screens/CompanyScreen';
import AttendanceScreen from '../screens/AttendanceScreen';
import { COLORS } from '../config/constants';



export type RootTabParamList = {
  Home: undefined;
  Visits: undefined;
  Companies: undefined;
  Claims: undefined;
  Settings: undefined;
};

type TabRouteName = keyof RootTabParamList;

interface PlaceholderScreenProps {
  route: RouteProp<RootTabParamList, TabRouteName>;
}

interface TabIconProps {
  label: TabRouteName;
  focused: boolean;
}

const Tab = createBottomTabNavigator<RootTabParamList>();

const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({ route }) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ fontSize: 16, color: COLORS.textSecondary }}>
      {route.name} — Coming soon
    </Text>
  </View>
);

const TAB_ICONS: Record<TabRouteName, string> = {
  Home: '🏠',
  Visits: '📍',
  Companies: '🏢',
  Claims: '🧾',
  Settings: '⚙️',
};

const TabIcon: React.FC<TabIconProps> = ({ label, focused }) => (
  <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
    <Text style={[styles.iconEmoji, !focused && { opacity: 0.55 }]}>
      {TAB_ICONS[label]}
    </Text>
  </View>
);

// ─── Navigator ────────────────────────────────────────────────────────────────
const AppNavigator: React.FC = () => (
  <NavigationContainer>
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerTintColor: '#FFFFFF',
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: '#9AA0A6',
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused }: { focused: boolean }) => (
          <TabIcon label={route.name as TabRouteName} focused={focused} />
        ),
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerTitle: 'MetricInfo', headerShown: false }}
      />
      <Tab.Screen
        name="Visits"
        component={AttendanceScreen}
        options={{ headerTitle: 'My Visits' }}
      />
      <Tab.Screen
        name="Companies"
        component={CompanyScreen}
        options={{ headerTitle: 'Clients', headerShown: false }}
      />
      <Tab.Screen
        name="Claims"
        component={PlaceholderScreen}
        options={{ headerTitle: 'Claims' }}
      />
      <Tab.Screen
        name="Settings"
        component={PlaceholderScreen}
        options={{ headerTitle: 'Settings' }}
      />
    </Tab.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.primary,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8EAED',
    height: 62,
    paddingBottom: 6,
    paddingTop: 4,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: -2 },
  },
  tabLabel: { fontSize: 11, fontWeight: '600', marginTop: 1 },
  iconWrap: { alignItems: 'center', justifyContent: 'center' },
  iconWrapActive: {},
  iconEmoji: { fontSize: 22 },
});

export default AppNavigator;

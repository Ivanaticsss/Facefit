import React, { useRef, useEffect } from 'react';
import { Tabs } from 'expo-router';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

// ASSUMPTION: adjust this import to match your real auth hook if the name differs.
// It only needs to return the current user's role ('admin' | 'hairstylist' | 'user').
import { COLORS, GRADIENTS, type Role } from '../../constants/theme';

// Which tabs are visible per role, and how they should read.
// Only routes that already exist in this folder are referenced here —
// nothing new needs to be created for this to work.
const ROLE_TABS: Record<Role, { name: string; label: string; icon: keyof typeof Ionicons.glyphMap; iconFilled: keyof typeof Ionicons.glyphMap }[]> = {
  admin: [
    { name: 'index', label: 'Home', icon: 'home-outline', iconFilled: 'home' },
    { name: 'recommendations', label: 'Flags', icon: 'flag-outline', iconFilled: 'flag' },
    { name: 'salons', label: 'Salons', icon: 'location-outline', iconFilled: 'location' },
  ],
  hairstylist: [
    { name: 'index', label: 'Home', icon: 'home-outline', iconFilled: 'home' },
    { name: 'scan', label: 'Scan', icon: 'scan-outline', iconFilled: 'scan' },
    { name: 'recommendations', label: 'Requests', icon: 'chatbubble-ellipses-outline', iconFilled: 'chatbubble-ellipses' },
  ],
  user: [
    { name: 'index', label: 'Home', icon: 'home-outline', iconFilled: 'home' },
    { name: 'scan', label: 'Scan', icon: 'scan-outline', iconFilled: 'scan' },
    { name: 'recommendations', label: 'Styles', icon: 'sparkles-outline', iconFilled: 'sparkles' },
    { name: 'salons', label: 'Salons', icon: 'location-outline', iconFilled: 'location' },
  ],
};

function TabIcon({
  focused,
  icon,
  iconFilled,
}: {
  focused: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  iconFilled: keyof typeof Ionicons.glyphMap;
}) {
  const scale = useRef(new Animated.Value(focused ? 1 : 0.92)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1 : 0.92,
      friction: 7,
      tension: 90,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      {focused ? (
        <LinearGradient
          colors={GRADIENTS.gold}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.activeIconWrap}
        >
          <Ionicons name={iconFilled} size={18} color={COLORS.onGold} />
        </LinearGradient>
      ) : (
        <View style={styles.iconWrap}>
          <Ionicons name={icon} size={18} color={COLORS.textTertiary} />
        </View>
      )}
    </Animated.View>
  );
}

function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const role: Role = 'user';
  const visibleTabs = ROLE_TABS[role];

  return (
    <View style={styles.barShadowWrap}>
      <View style={styles.bar}>
        {visibleTabs.map((tab) => {
          const routeIndex = state.routes.findIndex((r) => r.name === tab.name);
          if (routeIndex === -1) return null;
          const route = state.routes[routeIndex];
          const isFocused = state.index === routeIndex;
          const { options } = descriptors[route.key];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              activeOpacity={0.8}
              style={styles.tabButton}
            >
              <TabIcon focused={isFocused} icon={tab.icon} iconFilled={tab.iconFilled} />
              <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="scan" />
      <Tabs.Screen name="recommendations" />
      <Tabs.Screen name="salons" />
      {/* Profile lives in the AppShell drawer now, so it's kept out of the tab bar. */}
      <Tabs.Screen name="profile" options={{ href: null }} />
      {/* Rendered directly by index.tsx based on role — never shown as tabs. */}
      <Tabs.Screen name="dashboard-user" options={{ href: null }} />
      <Tabs.Screen name="dashboard-admin" options={{ href: null }} />
      <Tabs.Screen name="dashboard-hairstylist" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  barShadowWrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: Platform.OS === 'ios' ? 28 : 18,
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#14100D',
    borderRadius: 26,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 4,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#C9A96E',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  tabLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: COLORS.textTertiary,
  },
  tabLabelActive: {
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
});
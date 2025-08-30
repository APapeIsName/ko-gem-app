import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { NAVIGATION_ICONS } from '@/data';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name={NAVIGATION_ICONS.HOME} color={color} />,
        }}
      />
      <Tabs.Screen
        name="plan"
        options={{
          title: '계획',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name={NAVIGATION_ICONS.EVENT} color={color} />,
        }}
      />
      <Tabs.Screen
        name="mypage"
        options={{
          title: '마이 페이지',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name={NAVIGATION_ICONS.SETTINGS} color={color} />,
        }}
      />
    </Tabs>
  );
}

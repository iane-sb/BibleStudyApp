import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';

import { useAppTheme } from '@/contexts/ThemeContext';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

const tabIcons: Record<string, { active: IoniconName; inactive: IoniconName }> = {
  index: { active: 'home', inactive: 'home-outline' },
  bible: { active: 'book', inactive: 'book-outline' },
  plans: { active: 'calendar', inactive: 'calendar-outline' },
  journal: { active: 'create', inactive: 'create-outline' },
  profile: { active: 'person', inactive: 'person-outline' },
};

export default function AppTabs() {
  const { colors, isDark } = useAppTheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: isDark ? '#858A99' : '#A0A5B4',
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 64,
          paddingTop: 6,
          paddingBottom: 8,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          color: colors.textSecondary,
        },
        tabBarIcon: ({ color, focused }) => {
          const icons = tabIcons[route.name];
          const iconName = icons
            ? focused ? icons.active : icons.inactive
            : 'ellipse-outline';
          return <Ionicons name={iconName} size={24} color={color as string} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="bible" options={{ title: 'Bible' }} />
      <Tabs.Screen name="plans" options={{ title: 'Plans' }} />
      <Tabs.Screen name="journal" options={{ title: 'Journal' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}

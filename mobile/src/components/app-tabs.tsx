
import { Tabs } from 'expo-router';
import { Text } from 'react-native';

const COLORS = {
  background: '#10131D',
  active: '#D8B56D',
  inactive: '#858A99',
  border: '#292D39',
};

const tabIcons: Record<string, string> = {
  index: '⌂',
  bible: '▤',
  plans: '◷',
  journal: '✎',
  profile: '◉',
};

export default function AppTabs() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.active,
        tabBarInactiveTintColor: COLORS.inactive,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 68,
          paddingTop: 7,
          paddingBottom: 7,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
        tabBarIcon: ({ color }) => (
          <Text style={{ color, fontSize: 28 }}>
            {tabIcons[route.name] ?? '•'}
          </Text>
        ),
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

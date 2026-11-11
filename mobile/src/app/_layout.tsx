import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { ThemeProvider, useAppTheme } from '@/contexts/ThemeContext';
import { DailyVerseService } from '@/services/daily-verse-service';
import { ProfileService } from '@/services/profile-service';

SplashScreen.preventAutoHideAsync();

// Initialize profile, settings, and daily verse rotation on app launch
ProfileService.initialize().catch(console.warn);
DailyVerseService.initialize().catch(console.warn);

function NavigationWrapper() {
  const { isDark } = useAppTheme();
  return (
    <NavigationThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <AppTabs />
    </NavigationThemeProvider>
  );
}

export default function TabLayout() {
  return (
    <ThemeProvider>
      <NavigationWrapper />
    </ThemeProvider>
  );
}

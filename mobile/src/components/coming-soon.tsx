import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppTheme } from '@/contexts/ThemeContext';

type Props = {
  title: string;
  subtitle: string;
};

export default function ComingSoon({ title, subtitle }: Props) {
  const { colors } = useAppTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar barStyle={colors.statusBar} />
      <View style={styles.content}>
        <Text style={[styles.symbol, { color: colors.gold }]}>✦</Text>
        <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
        <View style={[styles.badge, { backgroundColor: colors.goldMuted, borderColor: `${colors.gold}55` }]}>
          <Text style={[styles.label, { color: colors.gold }]}>COMING SOON</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  symbol: {
    fontSize: 48,
    marginBottom: 20,
  },
  title: {
    fontSize: 27,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
  },
  badge: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 28,
  },
  label: {
    fontSize: 10,
    letterSpacing: 2.5,
    fontWeight: '700',
  },
});

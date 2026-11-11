import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useAppTheme } from '@/contexts/ThemeContext';
import { AppearanceTheme } from '@/types/profile';

interface AppearanceSectionProps {
  currentTheme: AppearanceTheme;
  onThemeSelect: (theme: AppearanceTheme) => void;
}

export function AppearanceSection({
  currentTheme,
  onThemeSelect,
}: AppearanceSectionProps) {
  const { colors } = useAppTheme();

  const options: {
    id: AppearanceTheme;
    title: string;
    subtitle: string;
    icon: string;
  }[] = [
    {
      id: 'dark',
      title: 'Dark Mode',
      subtitle: 'Premium deep navy & gold (Recommended)',
      icon: 'moon',
    },
    {
      id: 'light',
      title: 'Light Mode',
      subtitle: 'Crisp, clean daytime reading palette',
      icon: 'sunny-outline',
    },
    {
      id: 'system',
      title: 'System Default',
      subtitle: 'Follows your Android / iOS appearance setting',
      icon: 'phone-portrait-outline',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.eyebrow, { color: colors.gold }]}>✦ THEME & PALETTE</Text>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Appearance Settings</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Theme changes apply to the entire app immediately.
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {options.map((opt, index) => {
          const isSelected = currentTheme === opt.id;
          return (
            <View key={opt.id}>
              {index > 0 && (
                <View style={[styles.divider, { backgroundColor: colors.borderMuted }]} />
              )}
              <TouchableOpacity
                style={[
                  styles.row,
                  isSelected && { backgroundColor: `${colors.goldMuted}` },
                ]}
                onPress={() => onThemeSelect(opt.id)}
                activeOpacity={0.7}
              >
                <View style={styles.leftCol}>
                  <View
                    style={[
                      styles.iconCircle,
                      {
                        backgroundColor: isSelected
                          ? colors.goldMuted
                          : colors.cardSecondary,
                      },
                    ]}
                  >
                    <Ionicons
                      name={opt.icon as any}
                      size={18}
                      color={isSelected ? colors.gold : colors.textSecondary}
                    />
                  </View>
                  <View style={styles.textCol}>
                    <Text
                      style={[
                        styles.optTitle,
                        { color: isSelected ? colors.gold : colors.textPrimary },
                      ]}
                    >
                      {opt.title}
                    </Text>
                    <Text style={[styles.optSubtitle, { color: colors.textSecondary }]}>
                      {opt.subtitle}
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.radio,
                    {
                      borderColor: isSelected ? colors.gold : '#4A5060',
                    },
                  ]}
                >
                  {isSelected && (
                    <View style={[styles.radioDot, { backgroundColor: colors.gold }]} />
                  )}
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 24 },
  sectionHeader: { marginBottom: 12 },
  eyebrow: { fontSize: 10, fontWeight: '700', letterSpacing: 1, marginBottom: 2 },
  title: { fontSize: 18, fontWeight: '700' },
  subtitle: { fontSize: 12, marginTop: 2 },
  card: { borderRadius: 20, borderWidth: 1, padding: 6 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
  },
  leftCol: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
  iconCircle: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  textCol: { flex: 1 },
  optTitle: { fontSize: 14, fontWeight: '600' },
  optSubtitle: { fontSize: 11, marginTop: 2 },
  radio: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, alignItems: 'center', justifyContent: 'center',
  },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  divider: { height: 1, marginHorizontal: 10 },
});

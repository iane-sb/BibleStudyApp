import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AppearanceTheme } from '@/types/profile';

const COLORS = {
  card: '#191E2B',
  cardLight: '#202637',
  gold: '#D8B56D',
  goldMuted: 'rgba(216, 181, 109, 0.15)',
  textPrimary: '#F5F0E6',
  textSecondary: '#9296A3',
  border: '#2A3040',
};

interface AppearanceSectionProps {
  currentTheme: AppearanceTheme;
  onThemeSelect: (theme: AppearanceTheme) => void;
}

export function AppearanceSection({
  currentTheme,
  onThemeSelect,
}: AppearanceSectionProps) {
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
      subtitle: 'Crisp, high-contrast daytime reading',
      icon: 'sunny-outline',
    },
    {
      id: 'system',
      title: 'System Default',
      subtitle: 'Automatically sync with Android system theme',
      icon: 'phone-portrait-outline',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionEyebrow}>✦ THEME & PALETTE</Text>
        <Text style={styles.sectionTitle}>Appearance Settings</Text>
      </View>

      <View style={styles.card}>
        {options.map((opt, index) => {
          const isSelected = currentTheme === opt.id;
          return (
            <View key={opt.id}>
              {index > 0 && <View style={styles.divider} />}
              <TouchableOpacity
                style={[styles.row, isSelected && styles.rowSelected]}
                onPress={() => onThemeSelect(opt.id)}
                activeOpacity={0.7}
              >
                <View style={styles.leftCol}>
                  <View
                    style={[
                      styles.iconCircle,
                      isSelected && styles.iconCircleSelected,
                    ]}
                  >
                    <Ionicons
                      name={opt.icon as any}
                      size={18}
                      color={isSelected ? COLORS.gold : COLORS.textSecondary}
                    />
                  </View>
                  <View style={styles.textCol}>
                    <Text
                      style={[
                        styles.titleText,
                        isSelected && styles.titleTextSelected,
                      ]}
                    >
                      {opt.title}
                    </Text>
                    <Text style={styles.subtitleText}>{opt.subtitle}</Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.radioCircle,
                    isSelected && styles.radioCircleSelected,
                  ]}
                >
                  {isSelected && <View style={styles.radioDot} />}
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
  container: {
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.gold,
    letterSpacing: 1,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
  },
  rowSelected: {
    backgroundColor: 'rgba(216, 181, 109, 0.06)',
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.cardLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleSelected: {
    backgroundColor: COLORS.goldMuted,
  },
  textCol: {
    flex: 1,
  },
  titleText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  titleTextSelected: {
    color: COLORS.gold,
  },
  subtitleText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4A5060',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: COLORS.gold,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.gold,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    marginHorizontal: 10,
  },
});

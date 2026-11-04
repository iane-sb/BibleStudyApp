
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const GOLD = '#D8B56D';

type Props = {
  title: string;
  subtitle: string;
};

export default function ComingSoon({ title, subtitle }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.symbol}>✦</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <Text style={styles.label}>COMING SOON</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#10131D',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  symbol: {
    fontSize: 48,
    color: GOLD,
    marginBottom: 20,
  },
  title: {
    fontSize: 27,
    fontWeight: '700',
    color: '#F5F0E6',
  },
  subtitle: {
    color: '#9296A3',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
  },
  label: {
    color: GOLD,
    fontSize: 10,
    letterSpacing: 3,
    marginTop: 28,
    fontWeight: '700',
  },
});

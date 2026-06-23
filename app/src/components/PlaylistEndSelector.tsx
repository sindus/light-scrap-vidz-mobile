import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radius } from '@/theme';

interface PlaylistEndSelectorProps {
  value: number;
  onChange: (n: number) => void;
  disabled?: boolean;
}

// 0 = all items. Others = latest N.
const OPTIONS: Array<{ n: number; label: string }> = [
  { n: 5, label: '5' },
  { n: 10, label: '10' },
  { n: 25, label: '25' },
  { n: 50, label: '50' },
  { n: 0, label: 'All' },
];

export function PlaylistEndSelector({ value, onChange, disabled }: PlaylistEndSelectorProps) {
  return (
    <View>
      <Text style={styles.label}>How many (latest first)</Text>
      <View style={[styles.row, disabled && styles.disabled]}>
        {OPTIONS.map(({ n, label }) => {
          const active = n === value;
          return (
            <TouchableOpacity
              key={n}
              style={[styles.pill, active && styles.pillActive]}
              onPress={() => !disabled && onChange(n)}
              disabled={disabled}
              activeOpacity={0.8}
            >
              <Text style={[styles.pillText, active && styles.pillTextActive]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { color: colors.textSecondary, fontSize: 12, fontWeight: '500', marginBottom: 8 },
  row: { flexDirection: 'row', gap: 6 },
  disabled: { opacity: 0.5 },
  pill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    alignItems: 'center',
  },
  pillActive: {
    backgroundColor: 'rgba(167,139,250,0.18)',
    borderColor: 'rgba(167,139,250,0.5)',
  },
  pillText: { color: colors.textSecondary, fontSize: 13, fontWeight: '500' },
  pillTextActive: { color: colors.accent },
});

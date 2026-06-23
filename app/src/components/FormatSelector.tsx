import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radius } from '@/theme';
import type { Quality } from '@/types';

interface FormatSelectorProps {
  value: Quality;
  onChange: (q: Quality) => void;
  disabled?: boolean;
}

const OPTIONS: Quality[] = ['best', '1080p', '720p', '480p'];

export function FormatSelector({ value, onChange, disabled }: FormatSelectorProps) {
  return (
    <View>
      <Text style={styles.label}>Quality</Text>
      <View style={[styles.row, disabled && styles.disabled]}>
        {OPTIONS.map((opt) => {
          const active = opt === value;
          return (
            <TouchableOpacity
              key={opt}
              style={[styles.pill, active && styles.pillActive]}
              onPress={() => !disabled && onChange(opt)}
              disabled={disabled}
              activeOpacity={0.8}
            >
              <Text style={[styles.pillText, active && styles.pillTextActive]}>
                {opt === 'best' ? 'Best' : opt}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
  },
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

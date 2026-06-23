import { View, Text, Switch, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '@/theme';

interface AudioToggleProps {
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}

export function AudioToggle({ value, onChange, disabled }: AudioToggleProps) {
  return (
    <View style={[styles.row, disabled && styles.disabled]}>
      <View style={styles.left}>
        <Feather name="music" size={16} color={value ? colors.accent : colors.textSecondary} />
        <View>
          <Text style={styles.title}>Audio only</Text>
          <Text style={styles.sub}>Extract as MP3</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        trackColor={{ false: '#33334d', true: colors.accentDim }}
        thumbColor={value ? colors.accent : '#cbd5e1'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  disabled: { opacity: 0.5 },
  left: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: { color: colors.textPrimary, fontSize: 14, fontWeight: '500' },
  sub: { color: colors.textMuted, fontSize: 11 },
});

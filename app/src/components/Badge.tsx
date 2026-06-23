import { View, Text, StyleSheet } from 'react-native';
import { radius } from '@/theme';

interface BadgeProps {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export function Badge({ label, color, bgColor, borderColor }: BadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: bgColor, borderColor }]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  text: {
    fontSize: 10,
    fontWeight: '600',
  },
});

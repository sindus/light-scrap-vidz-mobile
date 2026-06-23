import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Badge } from './Badge';
import { PLATFORM_META } from '@/lib/platform';
import { colors } from '@/theme';
import type { HistoryEntry } from '@/types';

interface HistoryListProps {
  entries: HistoryEntry[];
  onClear: () => void;
}

function timeAgo(ts: number): string {
  const diff = Math.max(0, new Date().getTime() - ts);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function HistoryList({ entries, onClear }: HistoryListProps) {
  if (entries.length === 0) {
    return (
      <View style={styles.empty}>
        <Feather name="clock" size={24} color={colors.textMuted} />
        <Text style={styles.emptyText}>No downloads yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recent</Text>
        <TouchableOpacity onPress={onClear} hitSlop={8}>
          <Text style={styles.clear}>Clear</Text>
        </TouchableOpacity>
      </View>
      {entries.map((e) => {
        const meta = PLATFORM_META[e.platform];
        return (
          <View key={e.id} style={styles.item}>
            <Badge {...meta} />
            <Text style={styles.title} numberOfLines={2}>
              {e.title}
            </Text>
            <Text style={styles.time}>{timeAgo(e.downloaded_at)}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: colors.textPrimary, fontSize: 13, fontWeight: '600' },
  clear: { color: colors.textMuted, fontSize: 12 },
  item: {
    gap: 4,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.surfaceBorder,
  },
  title: { color: colors.textPrimary, fontSize: 13, lineHeight: 18 },
  time: { color: colors.textMuted, fontSize: 11 },
  empty: { alignItems: 'center', gap: 8, paddingVertical: 28 },
  emptyText: { color: colors.textMuted, fontSize: 13 },
});

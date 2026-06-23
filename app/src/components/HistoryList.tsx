import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Badge } from './Badge';
import { PLATFORM_META } from '@/lib/platform';
import { colors, radius } from '@/theme';
import type { HistoryEntry } from '@/types';

interface HistoryListProps {
  entries: HistoryEntry[];
  onClear: () => void;
}

function timeAgo(ts: number): string {
  const diff = Math.max(0, Date.now() - ts);
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
        <Feather name="clock" size={24} color={colors.textFaint} />
        <Text style={styles.emptyText}>No downloads yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recent</Text>
        <TouchableOpacity onPress={onClear} hitSlop={8}>
          <Text style={styles.clearText}>Clear all</Text>
        </TouchableOpacity>
      </View>
      {entries.map((e) => {
        const meta = PLATFORM_META[e.platform];
        return (
          <View key={e.id} style={styles.item}>
            <View style={styles.thumb}>
              {e.thumbnail ? (
                <Image source={{ uri: e.thumbnail }} style={styles.thumbImg} resizeMode="cover" />
              ) : (
                <View style={styles.thumbPlaceholder} />
              )}
            </View>
            <View style={styles.body}>
              <Text style={styles.title} numberOfLines={1}>
                {e.title}
              </Text>
              <View style={styles.metaRow}>
                <Badge {...meta} />
                <Text style={styles.time}>{timeAgo(e.downloaded_at)}</Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    color: colors.textBody,
    fontSize: 13,
    fontWeight: '600',
  },
  clearText: {
    color: colors.textFaint,
    fontSize: 11.5,
    fontWeight: '600',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  thumb: {
    width: 60,
    height: 38,
    borderRadius: radius.xs,
    overflow: 'hidden',
    backgroundColor: '#211F1A',
    flexShrink: 0,
  },
  thumbImg: {
    width: '100%',
    height: '100%',
  },
  thumbPlaceholder: {
    flex: 1,
    backgroundColor: '#1A1815',
  },
  body: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  title: {
    color: colors.textTitle,
    fontSize: 13,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  time: {
    color: colors.textVeryFaint,
    fontSize: 11,
  },
  empty: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 28,
  },
  emptyText: {
    color: colors.textFaint,
    fontSize: 13,
  },
});

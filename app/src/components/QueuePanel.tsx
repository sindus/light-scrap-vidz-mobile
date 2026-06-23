import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { isValidUrl } from '@/lib/url-validator';
import type { QueueItem } from '@/types';

interface QueuePanelProps {
  items: QueueItem[];
  onAddUrls: (urls: string[]) => void;
  onRemoveItem: (id: string) => void;
  onClearDone: () => void;
  onClearAll: () => void;
}

const STATUS_ICON: Record<QueueItem['status'], keyof typeof Feather.glyphMap> = {
  pending: 'clock',
  downloading: 'download',
  done: 'check-circle',
  error: 'alert-circle',
};

const STATUS_COLOR: Record<QueueItem['status'], string> = {
  pending: colors.textMuted,
  downloading: colors.accent,
  done: colors.success,
  error: colors.error,
};

export function QueuePanel({
  items,
  onAddUrls,
  onRemoveItem,
  onClearDone,
  onClearAll,
}: QueuePanelProps) {
  const [text, setText] = useState('');

  const add = () => {
    const urls = text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => isValidUrl(l));
    if (urls.length === 0) return;
    onAddUrls(urls);
    setText('');
  };

  return (
    <View style={styles.wrap}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder={'Paste URLs, one per line'}
        placeholderTextColor={colors.textMuted}
        autoCapitalize="none"
        autoCorrect={false}
        multiline
      />
      <TouchableOpacity style={styles.addBtn} onPress={add} activeOpacity={0.85}>
        <Feather name="plus" size={16} color={colors.accent} />
        <Text style={styles.addText}>Add to queue</Text>
      </TouchableOpacity>

      {items.length > 0 && (
        <View style={styles.actions}>
          <TouchableOpacity onPress={onClearDone} hitSlop={8}>
            <Text style={styles.actionText}>Clear done</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClearAll} hitSlop={8}>
            <Text style={styles.actionText}>Clear all</Text>
          </TouchableOpacity>
        </View>
      )}

      {items.map((item) => (
        <View key={item.id} style={styles.item}>
          <Feather name={STATUS_ICON[item.status]} size={15} color={STATUS_COLOR[item.status]} />
          <View style={styles.itemBody}>
            <Text style={styles.itemUrl} numberOfLines={1}>
              {item.url}
            </Text>
            {item.status === 'downloading' && item.progress != null && (
              <Text style={styles.itemMeta}>{item.progress.toFixed(0)}%</Text>
            )}
            {item.status === 'error' && !!item.error && (
              <Text style={[styles.itemMeta, { color: colors.error }]} numberOfLines={1}>
                {item.error}
              </Text>
            )}
          </View>
          {(item.status === 'pending' || item.status === 'done' || item.status === 'error') && (
            <TouchableOpacity onPress={() => onRemoveItem(item.id)} hitSlop={8}>
              <Feather name="x" size={14} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      ))}

      {items.length === 0 && (
        <View style={styles.empty}>
          <Feather name="layers" size={24} color={colors.textMuted} />
          <Text style={styles.emptyText}>Queue is empty</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10 },
  input: {
    minHeight: 64,
    color: colors.textPrimary,
    fontSize: 13,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderColor: colors.surfaceBorder,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    textAlignVertical: 'top',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: radius.md,
    backgroundColor: 'rgba(167,139,250,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.25)',
  },
  addText: { color: colors.accent, fontSize: 13, fontWeight: '600' },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 16 },
  actionText: { color: colors.textMuted, fontSize: 12 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.surfaceBorder,
  },
  itemBody: { flex: 1 },
  itemUrl: { color: colors.textSecondary, fontSize: 12 },
  itemMeta: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  empty: { alignItems: 'center', gap: 8, paddingVertical: 28 },
  emptyText: { color: colors.textMuted, fontSize: 13 },
});

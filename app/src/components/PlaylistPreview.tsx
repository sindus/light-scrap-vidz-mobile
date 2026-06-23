import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { GlassCard } from './GlassCard';
import { Badge } from './Badge';
import { PLATFORM_META } from '@/lib/platform';
import { getPlatform } from '@/lib/url-validator';
import { colors } from '@/theme';
import type { PlaylistInfo } from '@/types';

interface PlaylistPreviewProps {
  info: PlaylistInfo;
  url: string;
}

export function PlaylistPreview({ info, url }: PlaylistPreviewProps) {
  const meta = PLATFORM_META[getPlatform(url)];
  const count = info.playlist_count;

  return (
    <GlassCard style={styles.card}>
      <View style={styles.iconBox}>
        <Feather name="list" size={22} color={colors.accent} />
      </View>
      <View style={styles.body}>
        <Badge {...meta} />
        <Text style={styles.title} numberOfLines={2}>
          {info.title || 'Profile / Playlist'}
        </Text>
        <View style={styles.metaRow}>
          {!!info.uploader && (
            <Text style={styles.metaText} numberOfLines={1}>
              {info.uploader}
            </Text>
          )}
          {count != null && <Text style={styles.metaText}>{count} videos</Text>}
        </View>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: 'rgba(167,139,250,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1, gap: 6, justifyContent: 'center' },
  title: { color: colors.textPrimary, fontSize: 14, fontWeight: '500', lineHeight: 19 },
  metaRow: { flexDirection: 'row', gap: 12 },
  metaText: { color: colors.textSecondary, fontSize: 12, flexShrink: 1 },
});

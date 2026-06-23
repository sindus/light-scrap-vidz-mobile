import { View, Text, StyleSheet } from 'react-native';
import { GlassCard } from './GlassCard';
import { Badge } from './Badge';
import { PLATFORM_META } from '@/lib/platform';
import { getPlatform } from '@/lib/url-validator';
import { colors, radius } from '@/theme';
import type { PlaylistInfo } from '@/types';

interface PlaylistPreviewProps {
  info: PlaylistInfo;
  url: string;
}

export function PlaylistPreview({ info, url }: PlaylistPreviewProps) {
  const meta = PLATFORM_META[getPlatform(url)];
  const count = info.playlist_count ?? info.entries?.length ?? null;

  return (
    <GlassCard style={styles.card}>
      <View style={styles.thumb}>
        <View style={styles.thumbPlaceholder} />
      </View>

      <View style={styles.body}>
        <View style={styles.topRow}>
          <Badge {...meta} />
          <Text style={styles.kindLabel}>PLAYLIST</Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {info.title || 'Untitled Playlist'}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {[info.uploader, count != null ? `${count} videos` : null].filter(Boolean).join(' · ')}
        </Text>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  thumb: {
    width: 100,
    height: 64,
    borderRadius: radius.sm,
    overflow: 'hidden',
    backgroundColor: '#211F1A',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbPlaceholder: {
    flex: 1,
    width: '100%',
    backgroundColor: '#1A1815',
  },
  body: {
    flex: 1,
    gap: 5,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  kindLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 13.5,
    fontWeight: '700',
    lineHeight: 18,
  },
  meta: {
    color: colors.textMuted,
    fontSize: 11.5,
  },
});

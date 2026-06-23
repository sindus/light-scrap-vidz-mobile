import { View, Text, Image, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { GlassCard } from './GlassCard';
import { Badge } from './Badge';
import { PLATFORM_META } from '@/lib/platform';
import { formatDuration } from '@/lib/utils';
import { getPlatform } from '@/lib/url-validator';
import { colors } from '@/theme';
import type { VideoInfo } from '@/types';

interface VideoPreviewProps {
  info: VideoInfo;
  url: string;
}

export function VideoPreview({ info, url }: VideoPreviewProps) {
  const meta = PLATFORM_META[getPlatform(url)];

  return (
    <GlassCard style={styles.card}>
      <View style={styles.thumb}>
        {info.thumbnail ? (
          <Image source={{ uri: info.thumbnail }} style={styles.thumbImg} resizeMode="cover" />
        ) : (
          <Text style={styles.thumbFallback}>🎬</Text>
        )}
        {info.duration > 0 && (
          <View style={styles.durationTag}>
            <Text style={styles.durationText}>{formatDuration(info.duration)}</Text>
          </View>
        )}
      </View>

      <View style={styles.body}>
        <Badge {...meta} />
        <Text style={styles.title} numberOfLines={2}>
          {info.title}
        </Text>
        <View style={styles.metaRow}>
          {!!info.uploader && (
            <View style={styles.metaItem}>
              <Feather name="user" size={12} color={colors.textSecondary} />
              <Text style={styles.metaText} numberOfLines={1}>
                {info.uploader}
              </Text>
            </View>
          )}
        </View>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 14,
  },
  thumb: {
    width: 120,
    height: 76,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbImg: {
    width: '100%',
    height: '100%',
  },
  thumbFallback: {
    fontSize: 24,
  },
  durationTag: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  durationText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
  },
  body: {
    flex: 1,
    gap: 6,
    justifyContent: 'center',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 19,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 1,
  },
  metaText: {
    color: colors.textSecondary,
    fontSize: 12,
    flexShrink: 1,
  },
});

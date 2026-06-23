import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { GlassCard } from './GlassCard';
import { colors, radius } from '@/theme';
import type { DownloadProgress, DownloadStatus } from '@/types';

interface ProgressCardProps {
  status: DownloadStatus;
  progress: DownloadProgress | null;
  error: string | null;
}

export function ProgressCard({ status, progress, error }: ProgressCardProps) {
  if (status === 'idle') return null;

  const percent = progress?.percent ?? 0;
  const busy = status === 'downloading' || status === 'saving';

  return (
    <GlassCard style={styles.card}>
      {busy && (
        <>
          {progress?.current_item != null && progress.total_items != null && (
            <Text style={styles.itemCount}>
              Video {progress.current_item} / {progress.total_items}
            </Text>
          )}
          <View style={styles.headRow}>
            <View style={styles.headLeft}>
              <ActivityIndicator size="small" color={colors.accent} />
              <Text style={styles.filename} numberOfLines={1}>
                {status === 'saving'
                  ? 'Saving to device…'
                  : progress?.filename || 'Starting download…'}
              </Text>
            </View>
            {status === 'downloading' && <Text style={styles.percent}>{percent.toFixed(1)}%</Text>}
          </View>

          {status === 'downloading' && (
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${Math.max(0, Math.min(100, percent))}%` }]} />
            </View>
          )}

          {status === 'downloading' && !!progress && (
            <View style={styles.statsRow}>
              {progress.speed && progress.speed !== 'Unknown B/s' && (
                <Text style={styles.stat}>{progress.speed}</Text>
              )}
              {progress.eta && progress.eta !== 'Unknown' && (
                <Text style={styles.stat}>ETA {progress.eta}</Text>
              )}
            </View>
          )}
        </>
      )}

      {status === 'complete' && (
        <View style={styles.statusRow}>
          <Feather name="check-circle" size={16} color={colors.success} />
          <Text style={[styles.statusText, { color: colors.success }]}>Saved to device</Text>
        </View>
      )}

      {status === 'error' && (
        <View style={styles.statusRow}>
          <Feather name="alert-circle" size={16} color={colors.error} />
          <Text style={[styles.statusText, { color: colors.error }]}>
            {error ?? 'An error occurred'}
          </Text>
        </View>
      )}

      {status === 'cancelled' && (
        <View style={styles.statusRow}>
          <Feather name="x-circle" size={16} color={colors.textSecondary} />
          <Text style={[styles.statusText, { color: colors.textSecondary }]}>
            Download cancelled
          </Text>
        </View>
      )}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: { gap: 10 },
  itemCount: { color: colors.accent, fontSize: 12, fontWeight: '600' },
  headRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, marginRight: 8 },
  filename: { color: colors.textSecondary, fontSize: 12, flex: 1 },
  percent: { color: colors.accent, fontSize: 13, fontWeight: '600' },
  track: {
    height: 6,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.full,
    backgroundColor: colors.accent,
  },
  statsRow: { flexDirection: 'row', gap: 16 },
  stat: { color: colors.textMuted, fontSize: 12 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusText: { fontSize: 14, fontWeight: '500', flex: 1 },
});

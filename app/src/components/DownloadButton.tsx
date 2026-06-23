import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import type { DownloadStatus } from '@/types';

interface DownloadButtonProps {
  status: DownloadStatus;
  disabled?: boolean;
  audioOnly: boolean;
  onDownload: () => void;
  onCancel: () => void;
  onReset: () => void;
}

export function DownloadButton({
  status,
  disabled,
  audioOnly,
  onDownload,
  onCancel,
  onReset,
}: DownloadButtonProps) {
  if (status === 'downloading' || status === 'saving') {
    return (
      <TouchableOpacity
        style={[styles.button, styles.cancel]}
        onPress={onCancel}
        activeOpacity={0.85}
        disabled={status === 'saving'}
      >
        <Feather name="x" size={18} color={colors.error} />
        <Text style={[styles.label, { color: colors.error }]}>
          {status === 'saving' ? 'Saving…' : 'Cancel'}
        </Text>
      </TouchableOpacity>
    );
  }

  if (status === 'complete' || status === 'error' || status === 'cancelled') {
    return (
      <TouchableOpacity
        style={[styles.button, styles.secondary]}
        onPress={onReset}
        activeOpacity={0.85}
      >
        <Feather name="rotate-ccw" size={16} color={colors.textPrimary} />
        <Text style={styles.label}>Download another</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.button, styles.primary, disabled && styles.disabled]}
      onPress={onDownload}
      disabled={disabled}
      activeOpacity={0.85}
    >
      <Feather name={audioOnly ? 'music' : 'download'} size={18} color="#fff" />
      <Text style={[styles.label, { color: '#fff' }]}>
        {audioOnly ? 'Download MP3' : 'Download MP4'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    borderRadius: radius.md,
  },
  primary: { backgroundColor: colors.accentDim },
  cancel: {
    backgroundColor: 'rgba(248,113,113,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.3)',
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  disabled: { opacity: 0.4 },
  label: { color: colors.textPrimary, fontSize: 15, fontWeight: '600' },
});

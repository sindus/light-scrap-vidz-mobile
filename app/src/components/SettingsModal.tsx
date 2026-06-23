import { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radius, spacing } from '@/theme';
import { getServerUrl, setServerUrl, normalizeServerUrl } from '@/lib/config';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onSaved: (url: string) => void;
}

type TestState = 'idle' | 'testing' | 'ok' | 'fail';

export function SettingsModal({ visible, onClose, onSaved }: SettingsModalProps) {
  const [value, setValue] = useState('');
  const [test, setTest] = useState<TestState>('idle');

  useEffect(() => {
    if (visible) {
      void getServerUrl().then(setValue);
      setTest('idle');
    }
  }, [visible]);

  const runTest = async () => {
    const base = normalizeServerUrl(value);
    if (!base) return;
    setTest('testing');
    try {
      const res = await fetch(`${base}/api/health`);
      setTest(res.ok ? 'ok' : 'fail');
    } catch {
      setTest('fail');
    }
  };

  const save = async () => {
    const saved = await setServerUrl(value);
    onSaved(saved);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Server</Text>
            <TouchableOpacity onPress={onClose} hitSlop={10}>
              <Feather name="x" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.hint}>
            Address of your light-scrap-vidZ server (the machine running yt-dlp).
          </Text>

          <TextInput
            style={styles.input}
            value={value}
            onChangeText={(t) => {
              setValue(t);
              setTest('idle');
            }}
            placeholder="http://192.168.1.20:8787"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
          />

          <View style={styles.testRow}>
            <TouchableOpacity style={styles.testBtn} onPress={runTest} activeOpacity={0.85}>
              {test === 'testing' ? (
                <ActivityIndicator size="small" color={colors.accent} />
              ) : (
                <Feather name="wifi" size={15} color={colors.accent} />
              )}
              <Text style={styles.testText}>Test connection</Text>
            </TouchableOpacity>
            {test === 'ok' && (
              <Text style={[styles.testResult, { color: colors.success }]}>Reachable ✓</Text>
            )}
            {test === 'fail' && (
              <Text style={[styles.testResult, { color: colors.error }]}>Unreachable ✗</Text>
            )}
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={save} activeOpacity={0.85}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.surface2,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.xl,
    gap: spacing.md,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: colors.textPrimary, fontSize: 18, fontWeight: '700' },
  hint: { color: colors.textSecondary, fontSize: 13, lineHeight: 18 },
  input: {
    color: colors.textPrimary,
    fontSize: 14,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderColor: colors.surfaceBorder,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  testRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  testBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  testText: { color: colors.accent, fontSize: 13, fontWeight: '500' },
  testResult: { fontSize: 13, fontWeight: '500' },
  saveBtn: {
    backgroundColor: colors.accentDim,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  saveText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});

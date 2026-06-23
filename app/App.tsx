import { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { GlassCard } from '@/components/GlassCard';
import { UrlInput } from '@/components/UrlInput';
import { VideoPreview } from '@/components/VideoPreview';
import { PlaylistPreview } from '@/components/PlaylistPreview';
import { FormatSelector } from '@/components/FormatSelector';
import { AudioToggle } from '@/components/AudioToggle';
import { PlaylistEndSelector } from '@/components/PlaylistEndSelector';
import { ProgressCard } from '@/components/ProgressCard';
import { DownloadButton } from '@/components/DownloadButton';
import { HistoryList } from '@/components/HistoryList';
import { QueuePanel } from '@/components/QueuePanel';
import { SettingsModal } from '@/components/SettingsModal';

import { useVideoInfo } from '@/hooks/useVideoInfo';
import { usePlaylistInfo } from '@/hooks/usePlaylistInfo';
import { useDownload } from '@/hooks/useDownload';
import { useHistory } from '@/hooks/useHistory';
import { useQueue } from '@/hooks/useQueue';
import { isPlaylistUrl } from '@/lib/url-validator';
import { getServerUrl } from '@/lib/config';
import { colors, radius, spacing } from '@/theme';
import type { Quality, UrlKind } from '@/types';

function AppInner() {
  const [url, setUrl] = useState('');
  const [quality, setQuality] = useState<Quality>('best');
  const [urlKind, setUrlKind] = useState<UrlKind>('single');
  const [playlistEnd, setPlaylistEnd] = useState(10);
  const [audioOnly, setAudioOnly] = useState(false);
  const [tab, setTab] = useState<'history' | 'queue'>('history');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [serverUrl, setServerUrlState] = useState<string | null>(null);

  useEffect(() => {
    void getServerUrl().then(setServerUrlState);
  }, []);

  const { entries, addEntry, clearHistory } = useHistory();
  const {
    info,
    status: infoStatus,
    error: infoError,
    fetchInfo,
    reset: resetInfo,
  } = useVideoInfo();
  const {
    info: plInfo,
    status: plStatus,
    error: plError,
    fetchInfo: fetchPlInfo,
    reset: resetPlInfo,
  } = usePlaylistInfo();
  const {
    status,
    progress,
    error: dlError,
    download,
    cancel,
    reset: resetDownload,
  } = useDownload(addEntry);
  const {
    items: queueItems,
    isActive: queueActive,
    addItems: addToQueue,
    removeItem: removeQueueItem,
    clearDone: clearQueueDone,
    clearAll: clearQueueAll,
  } = useQueue();

  const activeInfoStatus = urlKind === 'single' ? infoStatus : plStatus;
  const activeError = urlKind === 'single' ? infoError : plError;
  const isBusy = activeInfoStatus === 'loading' || status === 'downloading' || status === 'saving';
  const isActive =
    status === 'downloading' ||
    status === 'saving' ||
    status === 'complete' ||
    status === 'error' ||
    status === 'cancelled';
  const showContent = (urlKind === 'single' && !!info) || (urlKind === 'playlist' && !!plInfo);

  const handleFetchInfo = useCallback(
    async (submittedUrl: string) => {
      setUrl(submittedUrl);
      resetDownload();
      resetInfo();
      resetPlInfo();
      if (isPlaylistUrl(submittedUrl)) {
        setUrlKind('playlist');
        await fetchPlInfo(submittedUrl);
      } else {
        setUrlKind('single');
        await fetchInfo(submittedUrl);
      }
    },
    [fetchInfo, fetchPlInfo, resetDownload, resetInfo, resetPlInfo],
  );

  const handleDownload = useCallback(() => {
    if (urlKind === 'playlist' && plInfo) {
      void download({ url, quality, info: null, playlistInfo: plInfo, playlistEnd, audioOnly });
    } else if (info) {
      void download({ url, quality, info, playlistInfo: null, playlistEnd: null, audioOnly });
    }
  }, [info, plInfo, url, quality, urlKind, playlistEnd, audioOnly, download]);

  const handleAddToQueue = useCallback(
    (urls: string[]) => {
      addToQueue(
        urls.map((u) => ({
          url: u,
          quality,
          audioOnly,
          playlistEnd: isPlaylistUrl(u) ? playlistEnd : null,
        })),
      );
      setTab('queue');
    },
    [addToQueue, quality, audioOnly, playlistEnd],
  );

  const handleReset = useCallback(() => {
    setUrl('');
    setUrlKind('single');
    resetInfo();
    resetPlInfo();
    resetDownload();
  }, [resetInfo, resetPlInfo, resetDownload]);

  useEffect(() => {
    if (queueActive) setTab('queue');
  }, [queueActive]);

  const pendingCount = queueItems.filter((i) => i.status === 'pending').length;
  const needsServer = serverUrl !== null && serverUrl === '';

  return (
    <View style={styles.root}>
      <LinearGradient colors={colors.bgGradient} style={StyleSheet.absoluteFill} />
      <StatusBar style="light" />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logo}>
              <Text style={styles.logoEmoji}>⬇️</Text>
            </View>
            <View style={styles.flex}>
              <Text style={styles.appTitle}>light-scrap-vidZ</Text>
              <Text style={styles.appSub}>Download any video as MP4</Text>
            </View>
            <TouchableOpacity onPress={() => setSettingsOpen(true)} hitSlop={10}>
              <Feather name="settings" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
          >
            {needsServer && (
              <TouchableOpacity onPress={() => setSettingsOpen(true)} activeOpacity={0.85}>
                <View style={styles.banner}>
                  <Feather name="alert-triangle" size={16} color={colors.accent} />
                  <Text style={styles.bannerText}>
                    No server set. Tap to enter your server address.
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            <GlassCard>
              <UrlInput
                onSubmit={handleFetchInfo}
                isLoading={activeInfoStatus === 'loading'}
                disabled={isBusy}
              />
              {activeInfoStatus === 'error' && <Text style={styles.error}>{activeError}</Text>}
            </GlassCard>

            {showContent && (
              <View style={styles.section}>
                {urlKind === 'single' && info && <VideoPreview info={info} url={url} />}
                {urlKind === 'playlist' && plInfo && <PlaylistPreview info={plInfo} url={url} />}

                <GlassCard style={styles.options}>
                  <AudioToggle
                    value={audioOnly}
                    onChange={setAudioOnly}
                    disabled={isBusy || isActive}
                  />
                  {!audioOnly && (
                    <>
                      <View style={styles.sep} />
                      <FormatSelector
                        value={quality}
                        onChange={setQuality}
                        disabled={isBusy || isActive}
                      />
                    </>
                  )}
                  {urlKind === 'playlist' && (
                    <>
                      <View style={styles.sep} />
                      <PlaylistEndSelector
                        value={playlistEnd}
                        onChange={setPlaylistEnd}
                        disabled={isBusy || isActive}
                      />
                    </>
                  )}
                </GlassCard>

                <ProgressCard status={status} progress={progress} error={dlError} />

                <DownloadButton
                  status={status}
                  disabled={needsServer || isBusy}
                  audioOnly={audioOnly}
                  onDownload={handleDownload}
                  onCancel={cancel}
                  onReset={handleReset}
                />
              </View>
            )}

            {/* Tabs */}
            <View style={styles.tabs}>
              <TouchableOpacity
                style={[styles.tab, tab === 'history' && styles.tabActive]}
                onPress={() => setTab('history')}
              >
                <Text style={[styles.tabText, tab === 'history' && styles.tabTextActive]}>
                  Recent
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, tab === 'queue' && styles.tabActive]}
                onPress={() => setTab('queue')}
              >
                <Text style={[styles.tabText, tab === 'queue' && styles.tabTextActive]}>
                  Queue{pendingCount > 0 ? ` (${pendingCount})` : ''}
                </Text>
              </TouchableOpacity>
            </View>

            <GlassCard>
              {tab === 'history' ? (
                <HistoryList entries={entries} onClear={clearHistory} />
              ) : (
                <QueuePanel
                  items={queueItems}
                  onAddUrls={handleAddToQueue}
                  onRemoveItem={removeQueueItem}
                  onClearDone={clearQueueDone}
                  onClearAll={clearQueueAll}
                />
              )}
            </GlassCard>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <SettingsModal
        visible={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSaved={setServerUrlState}
      />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppInner />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  safe: { flex: 1 },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(167,139,250,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: { fontSize: 16 },
  appTitle: { color: colors.textPrimary, fontSize: 15, fontWeight: '700' },
  appSub: { color: colors.textMuted, fontSize: 11, marginTop: 1 },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl, gap: spacing.md },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(167,139,250,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.25)',
    borderRadius: radius.md,
    padding: spacing.md,
  },
  bannerText: { color: colors.accent, fontSize: 13, flex: 1 },
  error: { color: colors.error, fontSize: 12, marginTop: 10 },
  section: { gap: spacing.md },
  options: { gap: spacing.md },
  sep: { height: StyleSheet.hairlineWidth, backgroundColor: colors.surfaceBorder },
  tabs: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabActive: {
    backgroundColor: 'rgba(167,139,250,0.12)',
    borderColor: 'rgba(167,139,250,0.3)',
  },
  tabText: { color: colors.textSecondary, fontSize: 13, fontWeight: '500' },
  tabTextActive: { color: colors.accent },
});

import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const SERVER_URL_KEY = 'light-scrap-vidZ:serverUrl';

let cached: string | null = null;

function fromConfig(): string {
  const extra = (Constants.expoConfig?.extra ?? {}) as { defaultServerUrl?: string };
  return (extra.defaultServerUrl ?? '').trim();
}

/** Normalise a base URL: trim, strip trailing slash, default scheme to http. */
export function normalizeServerUrl(raw: string): string {
  let url = raw.trim().replace(/\/+$/, '');
  if (url && !/^https?:\/\//i.test(url)) {
    url = `http://${url}`;
  }
  return url;
}

export async function getServerUrl(): Promise<string> {
  if (cached !== null) return cached;
  const stored = await AsyncStorage.getItem(SERVER_URL_KEY);
  cached = stored ?? fromConfig();
  return cached;
}

export async function setServerUrl(raw: string): Promise<string> {
  const url = normalizeServerUrl(raw);
  cached = url;
  await AsyncStorage.setItem(SERVER_URL_KEY, url);
  return url;
}

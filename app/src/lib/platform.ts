import type { Platform } from '@/types';

export interface PlatformMeta {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const PLATFORM_META: Record<Platform, PlatformMeta> = {
  youtube: {
    label: 'YouTube',
    color: '#FF7A7A',
    bgColor: 'rgba(255,59,48,0.14)',
    borderColor: 'rgba(255,59,48,0.25)',
  },
  tiktok: {
    label: 'TikTok',
    color: '#42E8DF',
    bgColor: 'rgba(37,244,238,0.14)',
    borderColor: 'rgba(37,244,238,0.25)',
  },
  instagram: {
    label: 'Instagram',
    color: '#FF86BD',
    bgColor: 'rgba(225,48,108,0.14)',
    borderColor: 'rgba(225,48,108,0.25)',
  },
  facebook: {
    label: 'Facebook',
    color: '#62A6FF',
    bgColor: 'rgba(24,119,242,0.14)',
    borderColor: 'rgba(24,119,242,0.25)',
  },
  dailymotion: {
    label: 'Dailymotion',
    color: '#B6B0A6',
    bgColor: 'rgba(138,131,120,0.14)',
    borderColor: 'rgba(138,131,120,0.25)',
  },
  twitter: {
    label: 'Twitter / X',
    color: '#B6B0A6',
    bgColor: 'rgba(138,131,120,0.14)',
    borderColor: 'rgba(138,131,120,0.25)',
  },
  twitch: {
    label: 'Twitch',
    color: '#B6B0A6',
    bgColor: 'rgba(138,131,120,0.14)',
    borderColor: 'rgba(138,131,120,0.25)',
  },
  vimeo: {
    label: 'Vimeo',
    color: '#B6B0A6',
    bgColor: 'rgba(138,131,120,0.14)',
    borderColor: 'rgba(138,131,120,0.25)',
  },
  unknown: {
    label: 'Link',
    color: '#B6B0A6',
    bgColor: 'rgba(138,131,120,0.14)',
    borderColor: 'rgba(138,131,120,0.25)',
  },
};

export const PLATFORM_TINT: Record<Platform, string> = {
  youtube: '#FF3B30',
  tiktok: '#25F4EE',
  instagram: '#E1306C',
  facebook: '#1877F2',
  dailymotion: '#8A8378',
  twitter: '#8A8378',
  twitch: '#8A8378',
  vimeo: '#8A8378',
  unknown: '#8A8378',
};

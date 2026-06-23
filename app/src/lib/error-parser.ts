const PATTERNS: Array<{ re: RegExp; msg: string }> = [
  {
    re: /login.*required|not logged in|sign in to|login to watch|requires.*authentication/i,
    msg: 'Login required — this content needs authentication on the server.',
  },
  {
    re: /private.*video|video.*private|this video is private/i,
    msg: 'This video is private.',
  },
  {
    re: /geo.?block|not available.*country|not available.*region|geo.?restrict/i,
    msg: 'This video is not available in the server region.',
  },
  {
    re: /age.?restrict|age.?gate|confirm your age/i,
    msg: 'Age-restricted — authentication is required on the server.',
  },
  {
    re: /video.*unavailable|this video is unavailable|has been removed/i,
    msg: 'This video is unavailable or has been removed.',
  },
  {
    re: /copyright|matched third.party/i,
    msg: 'This video was removed for copyright reasons.',
  },
  {
    re: /account.*terminated|channel.*removed|user.*not found/i,
    msg: 'The channel or account no longer exists.',
  },
  {
    re: /no formats?.*available|unable to extract/i,
    msg: 'Unable to extract video — the URL may not be supported.',
  },
  {
    re: /429|rate.?limit|too many requests/i,
    msg: 'Rate-limited by the platform — wait a moment and try again.',
  },
  {
    re: /marked as broken|extractor.*broken/i,
    msg: 'The extractor for this platform is broken — update yt-dlp on the server.',
  },
  {
    re: /failed to fetch|network request failed|connection refused|could not connect/i,
    msg: 'Cannot reach the server — check the server URL in Settings.',
  },
];

export function parseYtdlpError(raw: string): string {
  for (const { re, msg } of PATTERNS) {
    if (re.test(raw)) return msg;
  }
  const meaningful = raw
    .split('\n')
    .filter((l) => l.trim() && !l.startsWith('[debug]') && !l.startsWith('WARNING'))
    .at(-1);
  return meaningful?.trim() || raw.trim();
}

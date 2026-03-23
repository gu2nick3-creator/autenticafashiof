const ONE_DAY = 60 * 60 * 24;

function isBrowser() {
  return typeof document !== 'undefined';
}

export function getCookie(name: string): string {
  if (!isBrowser()) return '';
  const escaped = name.replace(/[-./*+?^${}()|[\]\\]/g, '\\$&');
  const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : '';
}

export function setCookie(name: string, value: string, maxAge = ONE_DAY * 30) {
  if (!isBrowser()) return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; samesite=lax`;
}

export function removeCookie(name: string) {
  if (!isBrowser()) return;
  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
}

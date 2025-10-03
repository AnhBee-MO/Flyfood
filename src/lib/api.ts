const memoryCache = new Map<string, unknown>();

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

export function getCached<T>(key: string): T | undefined {
  return memoryCache.get(key) as T | undefined;
}

export function setCached<T>(key: string, value: T) {
  memoryCache.set(key, value);
}


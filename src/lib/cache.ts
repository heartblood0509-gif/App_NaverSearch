import type { KeywordResult } from "@/types";

interface CacheEntry {
  exact: KeywordResult[];
  related: KeywordResult[];
  expiresAt: number;
}

const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

class KeywordCache {
  private store = new Map<string, CacheEntry>();
  private readonly ttlMs: number;

  constructor(ttlMs: number = DEFAULT_TTL_MS) {
    this.ttlMs = ttlMs;
  }

  /** 키워드 목록을 정규화하여 캐시 키 생성 */
  private normalizeKey(keywords: string[]): string {
    return keywords
      .map((k) => k.toLowerCase().trim())
      .sort()
      .join("|");
  }

  get(keywords: string[]): { exact: KeywordResult[]; related: KeywordResult[] } | null {
    const key = this.normalizeKey(keywords);
    const entry = this.store.get(key);

    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return { exact: entry.exact, related: entry.related };
  }

  set(keywords: string[], exact: KeywordResult[], related: KeywordResult[]): void {
    const key = this.normalizeKey(keywords);
    this.store.set(key, {
      exact,
      related,
      expiresAt: Date.now() + this.ttlMs,
    });
  }

  get size(): number {
    return this.store.size;
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
      }
    }
  }
}

// Singleton instance
export const keywordCache = new KeywordCache();

// Cleanup expired entries every 10 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => keywordCache.cleanup(), 10 * 60 * 1000);
}

import type { KeywordResult } from "@/types";

interface CacheEntry {
  data: KeywordResult;
  expiresAt: number;
}

const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

class KeywordCache {
  private store = new Map<string, CacheEntry>();
  private readonly ttlMs: number;

  constructor(ttlMs: number = DEFAULT_TTL_MS) {
    this.ttlMs = ttlMs;
  }

  private normalizeKey(keyword: string): string {
    return keyword.toLowerCase().trim();
  }

  get(keyword: string): KeywordResult | null {
    const key = this.normalizeKey(keyword);
    const entry = this.store.get(key);

    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.data;
  }

  set(keyword: string, data: KeywordResult): void {
    const key = this.normalizeKey(keyword);
    this.store.set(key, {
      data,
      expiresAt: Date.now() + this.ttlMs,
    });
  }

  getMany(keywords: string[]): {
    cached: KeywordResult[];
    uncached: string[];
  } {
    const cached: KeywordResult[] = [];
    const uncached: string[] = [];

    for (const keyword of keywords) {
      const result = this.get(keyword);
      if (result) {
        cached.push(result);
      } else {
        uncached.push(keyword);
      }
    }

    return { cached, uncached };
  }

  setMany(results: KeywordResult[]): void {
    for (const result of results) {
      this.set(result.keyword, result);
    }
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

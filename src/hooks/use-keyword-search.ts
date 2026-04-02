"use client";

import { useState, useCallback } from "react";
import type { KeywordResult, KeywordApiResponse, ApiError } from "@/types";

interface UseKeywordSearchReturn {
  results: KeywordResult[];
  relatedKeywords: KeywordResult[];
  isLoading: boolean;
  error: string | null;
  search: (keywords: string[]) => Promise<void>;
  clear: () => void;
}

export function useKeywordSearch(): UseKeywordSearchReturn {
  const [results, setResults] = useState<KeywordResult[]>([]);
  const [relatedKeywords, setRelatedKeywords] = useState<KeywordResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (keywords: string[]) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords }),
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.error || "요청 처리 중 오류가 발생했습니다.");
      }

      const data: KeywordApiResponse = await response.json();
      setResults(data.results);
      setRelatedKeywords(data.relatedKeywords || []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
      setError(message);
      setResults([]);
      setRelatedKeywords([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResults([]);
    setRelatedKeywords([]);
    setError(null);
  }, []);

  return { results, relatedKeywords, isLoading, error, search, clear };
}

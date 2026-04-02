"use client";

import { KeywordInput } from "@/components/keyword/keyword-input";
import { KeywordTable } from "@/components/keyword/keyword-table";
import { RelatedKeywords } from "@/components/keyword/related-keywords";
import { LoadingSkeleton } from "@/components/keyword/loading-skeleton";
import { useKeywordSearch } from "@/hooks/use-keyword-search";
import { toast } from "sonner";
import { useCallback, useEffect, useRef } from "react";

export default function HomePage() {
  const { results, relatedKeywords, isLoading, error, search } =
    useKeywordSearch();
  const prevError = useRef<string | null>(null);

  useEffect(() => {
    if (error && error !== prevError.current) {
      toast.error(error);
      prevError.current = error;
    }
  }, [error]);

  const handleSearch = useCallback(
    async (keywords: string[]) => {
      prevError.current = null;
      await search(keywords);
    },
    [search]
  );

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-6 py-16">
      {/* Hero */}
      <div className="space-y-4 text-center">
        <h1 className="text-6xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
            네이버
          </span>{" "}
          키워드 검색량 조회
        </h1>
        <p className="mx-auto max-w-2xl text-xl leading-relaxed text-muted-foreground">
          키워드의 월간 PC · 모바일 · 합산 검색량을 한번에 확인하세요.
          <br />
          최대 100개 키워드를 일괄 조회하고, 복사 또는 파일로 내보낼 수
          있습니다.
        </p>
      </div>

      {/* Input */}
      <KeywordInput onSearch={handleSearch} isLoading={isLoading} />

      {/* Results */}
      {isLoading && <LoadingSkeleton />}

      {!isLoading && results.length > 0 && (
        <>
          <KeywordTable results={results} />
          <RelatedKeywords keywords={relatedKeywords} />
        </>
      )}

      {!isLoading && results.length === 0 && !error && (
        <div className="py-20 text-center">
          <p className="text-xl text-muted-foreground">
            조회할 키워드를 입력하고 검색 버튼을 눌러주세요.
          </p>
        </div>
      )}
    </div>
  );
}

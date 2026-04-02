"use client";

import { useState, useCallback, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, X, Keyboard } from "lucide-react";

interface KeywordInputProps {
  onSearch: (keywords: string[]) => void;
  isLoading: boolean;
}

const MAX_KEYWORDS = 100;

function parseKeywords(text: string): string[] {
  return text
    .split(/[\n,\t]+/)
    .map((k) => k.trim().replace(/\s+/g, ""))
    .filter((k) => k.length > 0)
    .filter((k, i, arr) => arr.indexOf(k) === i);
}

export function KeywordInput({ onSearch, isLoading }: KeywordInputProps) {
  const [text, setText] = useState("");
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().includes("MAC"));
  }, []);

  const keywords = parseKeywords(text);
  const isOverLimit = keywords.length > MAX_KEYWORDS;
  const isEmpty = keywords.length === 0;

  const handleSearch = useCallback(() => {
    if (isEmpty || isOverLimit || isLoading) return;
    onSearch(keywords);
  }, [keywords, isEmpty, isOverLimit, isLoading, onSearch]);

  const handleClear = useCallback(() => {
    setText("");
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleSearch();
      }
    },
    [handleSearch]
  );

  const shortcutLabel = isMac ? "⌘ + Enter" : "Ctrl + Enter";

  return (
    <Card className="shadow-lg border-0 ring-1 ring-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-2xl font-bold">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
            <Search className="h-5 w-5 text-green-600" />
          </div>
          키워드 검색량 조회
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Textarea
            placeholder={
              "키워드를 한 줄에 하나씩 입력하세요.\n쉼표(,)로 구분해도 됩니다.\n\n예시:\n맛집\n카페\n여행"
            }
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={8}
            className="resize-y text-lg leading-relaxed rounded-xl border-muted-foreground/20 focus:border-green-500 focus:ring-green-500/20 transition-colors"
          />
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Keyboard className="h-4 w-4" />
              <span className="text-sm">
                {shortcutLabel} 로 빠른 검색
              </span>
            </div>
            <span
              className={`text-sm font-medium ${
                isOverLimit ? "text-destructive" : "text-muted-foreground"
              }`}
            >
              {keywords.length} / {MAX_KEYWORDS} 키워드
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleSearch}
            disabled={isEmpty || isOverLimit || isLoading}
            className="flex-1 h-14 text-lg font-semibold bg-green-600 hover:bg-green-700 rounded-xl transition-all"
            size="lg"
          >
            {isLoading ? (
              <>
                <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                조회 중...
              </>
            ) : (
              <>
                <Search className="mr-3 h-5 w-5" />
                검색량 조회
              </>
            )}
          </Button>
          {!isEmpty && (
            <Button
              variant="outline"
              onClick={handleClear}
              size="lg"
              className="h-14 text-lg rounded-xl px-6"
            >
              <X className="mr-2 h-5 w-5" />
              초기화
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

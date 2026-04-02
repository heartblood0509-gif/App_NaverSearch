"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, ChevronDown, ChevronUp } from "lucide-react";
import type { KeywordResult } from "@/types";
import { ExportButtons } from "./export-buttons";

interface RelatedKeywordsProps {
  keywords: KeywordResult[];
}

function formatNumber(value: number, isUnderTen: boolean): string {
  if (isUnderTen) return "< 10";
  return value.toLocaleString("ko-KR");
}

function getCompBadgeClasses(compIdx: string) {
  switch (compIdx) {
    case "높음":
      return "bg-red-100 text-red-700 border-red-200";
    case "중간":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "낮음":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

const INITIAL_SHOW = 10;

export function RelatedKeywords({ keywords }: RelatedKeywordsProps) {
  const [expanded, setExpanded] = useState(false);

  if (keywords.length === 0) return null;

  const displayKeywords = expanded
    ? keywords
    : keywords.slice(0, INITIAL_SHOW);
  const hasMore = keywords.length > INITIAL_SHOW;

  return (
    <Card className="shadow-lg border-0 ring-1 ring-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-2xl font-bold">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
              <Lightbulb className="h-5 w-5 text-amber-600" />
            </div>
            연관 키워드
            <span className="text-lg font-medium text-muted-foreground">
              {keywords.length}개
            </span>
          </CardTitle>
          <ExportButtons results={keywords} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-hidden rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-16 text-center text-base font-semibold text-muted-foreground h-14">
                  #
                </TableHead>
                <TableHead className="text-base font-semibold text-muted-foreground h-14">
                  키워드
                </TableHead>
                <TableHead className="text-right text-base font-semibold text-muted-foreground h-14">
                  월간 PC 검색량
                </TableHead>
                <TableHead className="text-right text-base font-semibold text-muted-foreground h-14">
                  월간 모바일 검색량
                </TableHead>
                <TableHead className="text-right text-base font-semibold text-muted-foreground h-14">
                  합계
                </TableHead>
                <TableHead className="text-center text-base font-semibold text-muted-foreground h-14">
                  경쟁 정도
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayKeywords.map((result, index) => (
                <TableRow
                  key={result.keyword}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="text-center text-base text-muted-foreground font-medium">
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-base font-medium">
                    {result.keyword}
                  </TableCell>
                  <TableCell className="text-right text-base tabular-nums">
                    {formatNumber(result.monthlyPcQcCnt, result.isPcUnderTen)}
                  </TableCell>
                  <TableCell className="text-right text-base tabular-nums">
                    {formatNumber(
                      result.monthlyMobileQcCnt,
                      result.isMobileUnderTen
                    )}
                  </TableCell>
                  <TableCell className="text-right text-base font-semibold tabular-nums">
                    {result.totalQcCnt.toLocaleString("ko-KR")}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className={`text-sm px-3 py-1 font-medium ${getCompBadgeClasses(result.compIdx)}`}
                    >
                      {result.compIdx}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {hasMore && (
          <div className="flex justify-center">
            <Button
              variant="ghost"
              onClick={() => setExpanded(!expanded)}
              className="text-base text-muted-foreground hover:text-foreground"
            >
              {expanded ? (
                <>
                  <ChevronUp className="mr-2 h-5 w-5" />
                  접기
                </>
              ) : (
                <>
                  <ChevronDown className="mr-2 h-5 w-5" />
                  {keywords.length - INITIAL_SHOW}개 더 보기
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

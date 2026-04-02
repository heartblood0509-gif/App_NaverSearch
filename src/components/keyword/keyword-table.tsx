"use client";

import { useState, useMemo } from "react";
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
import { ArrowUpDown, ArrowUp, ArrowDown, BarChart3 } from "lucide-react";
import type { KeywordResult } from "@/types";
import { ExportButtons } from "./export-buttons";

interface KeywordTableProps {
  results: KeywordResult[];
}

type SortField =
  | "keyword"
  | "monthlyPcQcCnt"
  | "monthlyMobileQcCnt"
  | "totalQcCnt"
  | "compIdx";
type SortDirection = "asc" | "desc";

const compIdxOrder = { 높음: 3, 중간: 2, 낮음: 1 };

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

export function KeywordTable({ results }: KeywordTableProps) {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedResults = useMemo(() => {
    if (!sortField) return results;
    return [...results].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "keyword":
          comparison = a.keyword.localeCompare(b.keyword, "ko");
          break;
        case "monthlyPcQcCnt":
          comparison = a.monthlyPcQcCnt - b.monthlyPcQcCnt;
          break;
        case "monthlyMobileQcCnt":
          comparison = a.monthlyMobileQcCnt - b.monthlyMobileQcCnt;
          break;
        case "totalQcCnt":
          comparison = a.totalQcCnt - b.totalQcCnt;
          break;
        case "compIdx":
          comparison =
            (compIdxOrder[a.compIdx] || 0) - (compIdxOrder[b.compIdx] || 0);
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [results, sortField, sortDirection]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field)
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-40" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4 text-green-600" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4 text-green-600" />
    );
  };

  const SortableHeader = ({
    field,
    children,
    align = "left",
  }: {
    field: SortField;
    children: React.ReactNode;
    align?: "left" | "right" | "center";
  }) => (
    <TableHead
      className="cursor-pointer select-none text-base font-semibold text-muted-foreground hover:text-foreground transition-colors h-14"
      onClick={() => handleSort(field)}
    >
      <div
        className={`flex items-center ${
          align === "right"
            ? "justify-end"
            : align === "center"
              ? "justify-center"
              : ""
        }`}
      >
        {children}
        <SortIcon field={field} />
      </div>
    </TableHead>
  );

  if (results.length === 0) return null;

  return (
    <Card className="shadow-lg border-0 ring-1 ring-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-2xl font-bold">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            검색 결과
            <span className="text-lg font-medium text-muted-foreground">
              {results.length}개
            </span>
          </CardTitle>
          <ExportButtons results={results} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-16 text-center text-base font-semibold text-muted-foreground h-14">
                  #
                </TableHead>
                <SortableHeader field="keyword">키워드</SortableHeader>
                <SortableHeader field="monthlyPcQcCnt" align="right">
                  월간 PC 검색량
                </SortableHeader>
                <SortableHeader field="monthlyMobileQcCnt" align="right">
                  월간 모바일 검색량
                </SortableHeader>
                <SortableHeader field="totalQcCnt" align="right">
                  합계
                </SortableHeader>
                <SortableHeader field="compIdx" align="center">
                  경쟁 정도
                </SortableHeader>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedResults.map((result, index) => (
                <TableRow
                  key={result.keyword}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="text-center text-base text-muted-foreground font-medium">
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-base font-semibold">
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
                  <TableCell className="text-right text-lg font-bold tabular-nums text-green-700">
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
      </CardContent>
    </Card>
  );
}

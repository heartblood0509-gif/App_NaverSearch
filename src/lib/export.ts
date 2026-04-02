import Papa from "papaparse";
import * as XLSX from "xlsx";
import type { KeywordResult } from "@/types";

function toExportRows(results: KeywordResult[]) {
  return results.map((r, i) => ({
    "순번": i + 1,
    "키워드": r.keyword,
    "월간 PC 검색량": r.isPcUnderTen ? "< 10" : r.monthlyPcQcCnt,
    "월간 모바일 검색량": r.isMobileUnderTen ? "< 10" : r.monthlyMobileQcCnt,
    "합계": r.totalQcCnt,
    "경쟁 정도": r.compIdx,
  }));
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function getFilename(): string {
  const date = new Date().toISOString().slice(0, 10);
  return `네이버_검색량_${date}`;
}

export function exportToCsv(results: KeywordResult[]): void {
  const rows = toExportRows(results);
  const csv = Papa.unparse(rows, { header: true });
  // UTF-8 BOM for proper Korean display in Excel
  const bom = "\uFEFF";
  const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8" });
  downloadBlob(blob, `${getFilename()}.csv`);
}

export function copyAsMarkdown(results: KeywordResult[]): string {
  const header = "| # | 키워드 | 월간 PC 검색량 | 월간 모바일 검색량 | 합계 | 경쟁 정도 |";
  const divider = "|---|--------|--------------|------------------|------|----------|";
  const rows = results.map((r, i) => {
    const pc = r.isPcUnderTen ? "< 10" : r.monthlyPcQcCnt.toLocaleString("ko-KR");
    const mobile = r.isMobileUnderTen ? "< 10" : r.monthlyMobileQcCnt.toLocaleString("ko-KR");
    const total = r.totalQcCnt.toLocaleString("ko-KR");
    return `| ${i + 1} | ${r.keyword} | ${pc} | ${mobile} | ${total} | ${r.compIdx} |`;
  });

  return [header, divider, ...rows].join("\n");
}

export function exportToExcel(results: KeywordResult[]): void {
  const rows = toExportRows(results);
  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Set column widths
  worksheet["!cols"] = [
    { wch: 6 },  // #
    { wch: 25 }, // keyword
    { wch: 18 }, // PC
    { wch: 20 }, // Mobile
    { wch: 15 }, // Total
    { wch: 12 }, // Competition
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "검색량");
  XLSX.writeFile(workbook, `${getFilename()}.xlsx`);
}

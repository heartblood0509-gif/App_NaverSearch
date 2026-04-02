"use client";

import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText, Copy, Check } from "lucide-react";
import { exportToCsv, exportToExcel, copyAsMarkdown } from "@/lib/export";
import { toast } from "sonner";
import type { KeywordResult } from "@/types";
import { useState } from "react";

interface ExportButtonsProps {
  results: KeywordResult[];
}

export function ExportButtons({ results }: ExportButtonsProps) {
  const [copied, setCopied] = useState(false);

  if (results.length === 0) return null;

  const handleCopyMarkdown = async () => {
    const markdown = copyAsMarkdown(results);
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    toast.success("마크다운 표가 클립보드에 복사되었습니다.");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="default"
        className="text-sm rounded-lg"
        onClick={handleCopyMarkdown}
      >
        {copied ? (
          <Check className="mr-1.5 h-4 w-4 text-green-600" />
        ) : (
          <Copy className="mr-1.5 h-4 w-4" />
        )}
        {copied ? "복사됨" : "복사"}
      </Button>
      <Button
        variant="outline"
        size="default"
        className="text-sm rounded-lg"
        onClick={() => exportToCsv(results)}
      >
        <FileText className="mr-1.5 h-4 w-4" />
        CSV
      </Button>
      <Button
        variant="outline"
        size="default"
        className="text-sm rounded-lg"
        onClick={() => exportToExcel(results)}
      >
        <FileSpreadsheet className="mr-1.5 h-4 w-4" />
        Excel
      </Button>
    </div>
  );
}

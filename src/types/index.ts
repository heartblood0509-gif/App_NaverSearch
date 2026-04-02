/** Raw response from Naver Search Ads API */
export interface NaverKeywordRaw {
  relKeyword: string;
  monthlyPcQcCnt: number | string;
  monthlyMobileQcCnt: number | string;
  monthlyAvePcClkCnt: number;
  monthlyAveMobileClkCnt: number;
  monthlyAvePcCtr: number;
  monthlyAveMobileCtr: number;
  plAvgDepth: number;
  compIdx: string;
}

/** Processed keyword result for frontend display */
export interface KeywordResult {
  keyword: string;
  monthlyPcQcCnt: number;
  monthlyMobileQcCnt: number;
  totalQcCnt: number;
  compIdx: "높음" | "중간" | "낮음";
  isPcUnderTen: boolean;
  isMobileUnderTen: boolean;
}

/** API response shape for /api/keywords */
export interface KeywordApiResponse {
  results: KeywordResult[];
  relatedKeywords: KeywordResult[];
  meta: {
    totalKeywords: number;
    cachedCount: number;
    timestamp: string;
  };
}

/** API error response */
export interface ApiError {
  error: string;
  detail?: string;
}

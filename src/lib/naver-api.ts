import crypto from "crypto";
import type { NaverKeywordRaw, KeywordResult } from "@/types";

const NAVER_API_BASE = "https://api.searchad.naver.com";

interface NaverApiConfig {
  apiKey: string;
  secretKey: string;
  customerId: string;
}

function getConfig(): NaverApiConfig {
  const apiKey = process.env.NAVER_API_KEY;
  const secretKey = process.env.NAVER_SECRET_KEY;
  const customerId = process.env.NAVER_CUSTOMER_ID;

  if (!apiKey || !secretKey || !customerId) {
    throw new NaverApiError(
      "네이버 API 키가 설정되지 않았습니다. 환경변수를 확인해주세요.",
      500
    );
  }

  return { apiKey, secretKey, customerId };
}

function generateSignature(
  secretKey: string,
  timestamp: string,
  method: string,
  uri: string
): string {
  const message = `${timestamp}.${method}.${uri}`;
  const hmac = crypto.createHmac("sha256", secretKey);
  hmac.update(message);
  return hmac.digest("base64");
}

function buildHeaders(method: string, uri: string): Record<string, string> {
  const config = getConfig();
  const timestamp = String(Date.now());
  const signature = generateSignature(
    config.secretKey,
    timestamp,
    method,
    uri
  );

  return {
    "X-Timestamp": timestamp,
    "X-API-KEY": config.apiKey,
    "X-Customer": config.customerId,
    "X-Signature": signature,
    "Content-Type": "application/json",
  };
}

export class NaverApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly naverCode?: string
  ) {
    super(message);
    this.name = "NaverApiError";
  }
}

function parseVolume(val: number | string): { value: number; isUnderTen: boolean } {
  if (typeof val === "number") return { value: val, isUnderTen: false };
  if (val === "< 10") return { value: 5, isUnderTen: true };
  const parsed = parseInt(val, 10);
  return { value: isNaN(parsed) ? 0 : parsed, isUnderTen: false };
}

export interface FetchKeywordResult {
  exact: KeywordResult[];
  related: KeywordResult[];
}

function rawToKeywordResult(raw: NaverKeywordRaw): KeywordResult {
  const pc = parseVolume(raw.monthlyPcQcCnt);
  const mobile = parseVolume(raw.monthlyMobileQcCnt);
  return {
    keyword: raw.relKeyword,
    monthlyPcQcCnt: pc.value,
    monthlyMobileQcCnt: mobile.value,
    totalQcCnt: pc.value + mobile.value,
    compIdx: (raw.compIdx as "높음" | "중간" | "낮음") || "낮음",
    isPcUnderTen: pc.isUnderTen,
    isMobileUnderTen: mobile.isUnderTen,
  };
}

/**
 * Fetch keyword volumes from Naver Search Ads API.
 * Chunks keywords into groups of 5 and processes them in parallel batches of 3.
 * Returns both exact matches and related keywords.
 */
export async function fetchKeywordVolumes(
  keywords: string[]
): Promise<FetchKeywordResult> {
  const uri = "/keywordstool";
  const method = "GET";

  const CHUNK_SIZE = 5;
  const chunks: string[][] = [];
  for (let i = 0; i < keywords.length; i += CHUNK_SIZE) {
    chunks.push(keywords.slice(i, i + CHUNK_SIZE));
  }

  const allRawResults: NaverKeywordRaw[] = [];

  const PARALLEL_BATCH = 3;
  for (let i = 0; i < chunks.length; i += PARALLEL_BATCH) {
    const batch = chunks.slice(i, i + PARALLEL_BATCH);
    const promises = batch.map(async (chunk) => {
      const params = new URLSearchParams({
        hintKeywords: chunk.join(","),
        showDetail: "1",
      });

      const headers = buildHeaders(method, uri);
      const response = await fetch(
        `${NAVER_API_BASE}${uri}?${params.toString()}`,
        { method, headers }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new NaverApiError(
          `네이버 API 오류 (${response.status}): ${errorText}`,
          response.status
        );
      }

      const data = await response.json();
      return (data.keywordList || []) as NaverKeywordRaw[];
    });

    const results = await Promise.all(promises);
    allRawResults.push(...results.flat());

    // Add small delay between batches to respect rate limits
    if (i + PARALLEL_BATCH < chunks.length) {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }

  // Split into exact matches and related keywords
  const keywordSet = new Set(keywords.map((k) => k.toLowerCase().trim()));
  const seenRelated = new Set<string>();

  const exact: KeywordResult[] = [];
  const related: KeywordResult[] = [];

  for (const raw of allRawResults) {
    const key = raw.relKeyword.toLowerCase().trim();
    if (keywordSet.has(key)) {
      if (!seenRelated.has(key)) {
        exact.push(rawToKeywordResult(raw));
        seenRelated.add(key);
      }
    } else {
      if (!seenRelated.has(key)) {
        related.push(rawToKeywordResult(raw));
        seenRelated.add(key);
      }
    }
  }

  // Keep original API order (sorted by relevance from Naver)
  return { exact, related };
}

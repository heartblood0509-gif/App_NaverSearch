import { NextResponse } from "next/server";
import { keywordsSchema } from "@/lib/validations";
import { fetchKeywordVolumes, NaverApiError } from "@/lib/naver-api";
import { keywordCache } from "@/lib/cache";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import type { KeywordApiResponse } from "@/types";

export async function POST(request: Request) {
  // 1. Rate limit check
  const clientIp = getClientIp(request);
  const rateLimitResult = rateLimit(clientIp);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: rateLimitResult.message },
      { status: 429 }
    );
  }

  try {
    // 2. Parse and validate input
    const body = await request.json();
    const parsed = keywordsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const keywords = parsed.data.keywords;

    // 3. Always fetch from API to get related keywords
    const { exact, related } = await fetchKeywordVolumes(keywords);
    keywordCache.setMany(exact);
    const exactResults = exact;
    const relatedResults = related;

    // 5. Sort exact results in the same order as input keywords
    const keywordOrder = new Map(
      keywords.map((k, i) => [k.toLowerCase().trim(), i])
    );
    exactResults.sort((a, b) => {
      const orderA = keywordOrder.get(a.keyword.toLowerCase().trim()) ?? 999;
      const orderB = keywordOrder.get(b.keyword.toLowerCase().trim()) ?? 999;
      return orderA - orderB;
    });

    const response: KeywordApiResponse = {
      results: exactResults,
      relatedKeywords: relatedResults,
      meta: {
        totalKeywords: exactResults.length,
        cachedCount: 0,
        timestamp: new Date().toISOString(),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof NaverApiError) {
      return NextResponse.json(
        { error: "네이버 API 오류가 발생했습니다.", detail: error.message },
        { status: 502 }
      );
    }

    const message =
      error instanceof Error
        ? error.message
        : "요청 처리 중 오류가 발생했습니다.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

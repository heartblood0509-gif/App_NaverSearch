import { NextResponse } from "next/server";
import { keywordsSchema } from "@/lib/validations";
import { fetchKeywordVolumes, NaverApiError } from "@/lib/naver-api";
import { keywordCache } from "@/lib/cache";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import type { KeywordApiResponse } from "@/types";

export const maxDuration = 60;

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

    // 3. Check cache (exact + related keywords together)
    const cached = keywordCache.get(keywords);
    if (cached) {
      const keywordOrder = new Map(
        keywords.map((k, i) => [k.toLowerCase().trim(), i])
      );
      cached.exact.sort((a, b) => {
        const orderA = keywordOrder.get(a.keyword.toLowerCase().trim()) ?? 999;
        const orderB = keywordOrder.get(b.keyword.toLowerCase().trim()) ?? 999;
        return orderA - orderB;
      });

      return NextResponse.json({
        results: cached.exact,
        relatedKeywords: cached.related,
        meta: {
          totalKeywords: cached.exact.length,
          cachedCount: cached.exact.length,
          timestamp: new Date().toISOString(),
        },
      } satisfies KeywordApiResponse);
    }

    // 4. Fetch from Naver API
    const { exact, related } = await fetchKeywordVolumes(keywords);

    // 5. Cache the results
    keywordCache.set(keywords, exact, related);

    // 6. Sort exact results in the same order as input keywords
    const keywordOrder = new Map(
      keywords.map((k, i) => [k.toLowerCase().trim(), i])
    );
    exact.sort((a, b) => {
      const orderA = keywordOrder.get(a.keyword.toLowerCase().trim()) ?? 999;
      const orderB = keywordOrder.get(b.keyword.toLowerCase().trim()) ?? 999;
      return orderA - orderB;
    });

    const response: KeywordApiResponse = {
      results: exact,
      relatedKeywords: related,
      meta: {
        totalKeywords: exact.length,
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

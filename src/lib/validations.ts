import { z } from "zod";

export const keywordsSchema = z.object({
  keywords: z
    .array(z.string().trim().min(1))
    .min(1, "키워드를 1개 이상 입력해주세요.")
    .max(100, "한 번에 최대 100개까지 조회할 수 있습니다.")
    .transform((kws) => [...new Set(kws.map((k) => k.trim()))]),
});

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const minuteStore = new Map<string, RateLimitEntry>();
const dailyStore = new Map<string, RateLimitEntry>();

const MINUTE_LIMIT = 10;
const DAILY_LIMIT = 100;
const MINUTE_MS = 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

function checkLimit(
  store: Map<string, RateLimitEntry>,
  key: string,
  limit: number,
  windowMs: number
): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { success: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

export function rateLimit(clientId: string): {
  success: boolean;
  remaining: number;
  message?: string;
} {
  const minuteCheck = checkLimit(minuteStore, clientId, MINUTE_LIMIT, MINUTE_MS);
  if (!minuteCheck.success) {
    const waitSec = Math.ceil((minuteCheck.resetAt - Date.now()) / 1000);
    return {
      success: false,
      remaining: 0,
      message: `요청이 너무 많습니다. ${waitSec}초 후에 다시 시도해주세요.`,
    };
  }

  const dailyCheck = checkLimit(dailyStore, clientId, DAILY_LIMIT, DAY_MS);
  if (!dailyCheck.success) {
    return {
      success: false,
      remaining: 0,
      message: "일일 요청 한도(100회)를 초과했습니다. 내일 다시 시도해주세요.",
    };
  }

  return { success: true, remaining: dailyCheck.remaining };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "unknown";
}

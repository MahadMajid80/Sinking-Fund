import "server-only";

/**
 * Fixed-window rate limiting per form and client IP.
 *
 * - Default: in-memory store. Correct for a single long-running Node server (`next start`,
 *   a VPS or a container with one instance). On serverless platforms each instance has its own
 *   memory, so limits become per-instance.
 * - If UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set, a shared Redis counter is
 *   used instead (works on Vercel and other multi-instance deployments). No SDK required.
 */

const MAX = Number(process.env.RATE_LIMIT_MAX || 5);
const WINDOW_SECONDS = Number(process.env.RATE_LIMIT_WINDOW_SECONDS || 600);

type Bucket = { count: number; resetAt: number };
const memory = new Map<string, Bucket>();

export interface RateResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

async function viaUpstash(key: string): Promise<RateResult | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    const res = await fetch(`${url.replace(/\/$/, "")}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, String(WINDOW_SECONDS), "NX"],
        ["TTL", key],
      ]),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { result: number }[];
    const count = Number(data[0]?.result ?? 0);
    const ttl = Math.max(1, Number(data[2]?.result ?? WINDOW_SECONDS));
    return { allowed: count <= MAX, retryAfterSeconds: count <= MAX ? 0 : ttl };
  } catch {
    return null; // Fall back to memory rather than blocking enquiries.
  }
}

export async function checkRateLimit(form: string, ip: string): Promise<RateResult> {
  const key = `rl:${form}:${ip}`;
  const shared = await viaUpstash(key);
  if (shared) return shared;

  const now = Date.now();
  if (memory.size > 5000) {
    for (const [k, b] of memory) if (b.resetAt <= now) memory.delete(k);
  }
  const bucket = memory.get(key);
  if (!bucket || bucket.resetAt <= now) {
    memory.set(key, { count: 1, resetAt: now + WINDOW_SECONDS * 1000 });
    return { allowed: true, retryAfterSeconds: 0 };
  }
  bucket.count += 1;
  if (bucket.count > MAX) return { allowed: false, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
  return { allowed: true, retryAfterSeconds: 0 };
}

/** Test helper: clears in-memory counters. */
export function resetRateLimits(): void {
  memory.clear();
}

import type { APIRoute } from 'astro';

export const prerender = false;

interface RevealPayload {
  listing_id?: string;
  contact_type?: 'reveal' | 'phone' | 'whatsapp' | 'email' | 'website';
}

const ALLOWED_TYPES = new Set(['reveal', 'phone', 'whatsapp', 'email', 'website']);

// Simple in-memory rate limiter (per IP) — replace with KV/D1 in production
const recentHits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 30;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (recentHits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (arr.length >= MAX_PER_WINDOW) {
    recentHits.set(ip, arr);
    return true;
  }
  arr.push(now);
  recentHits.set(ip, arr);
  return false;
}

async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(ip + (import.meta.env.IP_SALT ?? 'visit-petrovac'));
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .slice(0, 8)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export const POST: APIRoute = async ({ request, clientAddress, locals }) => {
  let body: RevealPayload;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'invalid_body' }), { status: 400 });
  }

  const { listing_id, contact_type } = body;

  if (!listing_id || typeof listing_id !== 'string' || listing_id.length > 80) {
    return new Response(JSON.stringify({ error: 'invalid_listing_id' }), { status: 400 });
  }
  if (!contact_type || !ALLOWED_TYPES.has(contact_type)) {
    return new Response(JSON.stringify({ error: 'invalid_contact_type' }), { status: 400 });
  }

  const ip = clientAddress ?? 'unknown';
  if (rateLimited(ip)) {
    return new Response(JSON.stringify({ error: 'rate_limited' }), { status: 429 });
  }

  const ipHash = await hashIp(ip);

  // Resolve Cloudflare bindings via the v6+ workers module; falls back to
  // Astro's legacy `locals.runtime.env` for older adapter versions; missing
  // entirely in plain `astro dev` (no D1 binding) — that's fine, we just
  // log to console.
  let db: { prepare(q: string): { bind(...args: unknown[]): { run(): Promise<unknown> } } } | undefined;
  try {
    const mod = await import('cloudflare:workers').catch(() => null);
    db = (mod as any)?.env?.DB;
  } catch {
    /* not in workers runtime */
  }
  if (!db) {
    try {
      db = (locals as any)?.runtime?.env?.DB;
    } catch {
      /* env getter throws on Astro v6+ */
    }
  }

  if (db) {
    try {
      const userAgent = request.headers.get('user-agent')?.slice(0, 200) ?? '';
      const referrer = request.headers.get('referer')?.slice(0, 200) ?? '';
      await db
        .prepare(
          'INSERT INTO contact_logs (listing_id, contact_type, ip_hash, user_agent, referrer, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        )
        .bind(listing_id, contact_type, ipHash, userAgent, referrer, Date.now())
        .run();
    } catch (err) {
      console.error('[contact] DB insert failed', err);
    }
  } else {
    console.log(`[contact] listing=${listing_id} type=${contact_type} ip_hash=${ipHash}`);
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

import type { APIRoute } from 'astro';

export const prerender = false;

interface TourInquiry {
  listing_id?: string;
  listing_title?: string;
  name?: string;
  email?: string;
  phone?: string;
  tour_date?: string;
  persons?: string | number;
  language?: string;
  message?: string;
  company?: string; // honeypot
}

const recentHits = new Map<string, number[]>();
const WINDOW_MS = 5 * 60_000;
const MAX_PER_WINDOW = 3;

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

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function isValidDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(s);
  return !Number.isNaN(d.getTime()) && d.getTime() >= Date.now() - 24 * 60 * 60 * 1000;
}

async function pushToGoogleSheets(webhookUrl: string, payload: Record<string, unknown>) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 4000);
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });
  } catch (err) {
    console.warn('[tour-inquiry] sheets webhook failed', err);
  } finally {
    clearTimeout(timer);
  }
}

export const POST: APIRoute = async ({ request, clientAddress, locals }) => {
  let body: TourInquiry;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'invalid_body' }), { status: 400 });
  }

  // Honeypot — silently succeed to bait bots
  if (body.company && body.company.length > 0) {
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }

  const ip = clientAddress ?? 'unknown';
  if (rateLimited(ip)) {
    return new Response(JSON.stringify({ error: 'rate_limited' }), { status: 429 });
  }

  // Validate
  const errors: string[] = [];
  if (!body.listing_id || typeof body.listing_id !== 'string') errors.push('listing_id');
  if (!body.name || body.name.length < 2 || body.name.length > 80) errors.push('name');
  if (!body.email || !isValidEmail(body.email) || body.email.length > 120) errors.push('email');
  if (!body.phone || body.phone.length < 5 || body.phone.length > 40) errors.push('phone');
  if (!body.tour_date || !isValidDate(body.tour_date)) errors.push('tour_date');
  const persons = Number(body.persons);
  if (!Number.isFinite(persons) || persons < 1 || persons > 50) errors.push('persons');
  if (body.message && body.message.length > 600) errors.push('message');

  if (errors.length > 0) {
    return new Response(JSON.stringify({ error: 'invalid_fields', fields: errors }), { status: 400 });
  }

  const inquiry = {
    listing_id: body.listing_id!,
    listing_title: body.listing_title ?? '',
    name: body.name!,
    email: body.email!,
    phone: body.phone!,
    tour_date: body.tour_date!,
    persons,
    language: body.language ?? 'sr',
    message: (body.message ?? '').slice(0, 600),
    received_at_iso: new Date().toISOString(),
    received_at_ms: Date.now(),
  };

  // Resolve Cloudflare bindings (v6+ workers module, then legacy locals fallback).
  let env: any = {};
  try {
    const mod = await import('cloudflare:workers').catch(() => null);
    env = (mod as any)?.env ?? {};
  } catch {
    /* not in workers runtime */
  }
  if (!env || Object.keys(env).length === 0) {
    try {
      env = (locals as any)?.runtime?.env ?? {};
    } catch {
      env = {};
    }
  }

  const db = env.DB as
    | { prepare(q: string): { bind(...args: unknown[]): { run(): Promise<unknown> } } }
    | undefined;

  if (db) {
    try {
      const ipHash = await (async () => {
        const data = new TextEncoder().encode(ip + (env.IP_SALT ?? 'visit-petrovac'));
        const buf = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(buf))
          .slice(0, 8)
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');
      })();
      await db
        .prepare(
          `INSERT INTO tour_inquiries
           (listing_id, listing_title, name, email, phone, tour_date, persons, language, message, status, ip_hash, received_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?, ?)`,
        )
        .bind(
          inquiry.listing_id,
          inquiry.listing_title,
          inquiry.name,
          inquiry.email,
          inquiry.phone,
          inquiry.tour_date,
          inquiry.persons,
          inquiry.language,
          inquiry.message,
          ipHash,
          inquiry.received_at_ms,
        )
        .run();
    } catch (err) {
      console.error('[tour-inquiry] DB insert failed', err);
    }
  }

  // Google Sheets webhook (env-configured Apps Script Web App URL)
  const webhookUrl = env.GOOGLE_SHEETS_WEBHOOK_URL ?? import.meta.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (webhookUrl) {
    await pushToGoogleSheets(webhookUrl, inquiry);
  }

  // TODO: send admin email via Resend / external SMTP
  // const resendKey = env.RESEND_API_KEY;

  console.log('[tour-inquiry] received', JSON.stringify(inquiry));

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

/**
 * Auto-translate every markdown content file from Montenegrin Serbian (sr)
 * to en/ru/de/fr using Claude Haiku.
 *
 * Per-file content hash is stored as `source_hash` in frontmatter; the script
 * skips files whose hash matches AND already has all 4 locales populated.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-... npm run translate
 *   ANTHROPIC_API_KEY=sk-... npm run translate -- --force   # re-translate everything
 *   ANTHROPIC_API_KEY=sk-... npm run translate -- --only listings/villa-azur
 */

import Anthropic from '@anthropic-ai/sdk';
import matter from 'gray-matter';
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, relative, basename } from 'node:path';

const TARGET_LOCALES = ['en', 'ru', 'de', 'fr'] as const;
type Locale = (typeof TARGET_LOCALES)[number];

const localeNames: Record<Locale, string> = {
  en: 'English',
  ru: 'Russian',
  de: 'German',
  fr: 'French',
};

interface CollectionConfig {
  name: string;
  dir: string;
  fields: string[];
  arrayFields?: string[];
  hasBody: boolean;
}

const COLLECTIONS: CollectionConfig[] = [
  {
    name: 'categories',
    dir: 'src/content/categories',
    fields: ['name', 'description'],
    hasBody: true,
  },
  {
    name: 'owners',
    dir: 'src/content/owners',
    fields: ['bio'],
    hasBody: false,
  },
  {
    name: 'listings',
    dir: 'src/content/listings',
    fields: ['title', 'excerpt'],
    arrayFields: ['amenities'],
    hasBody: true,
  },
  {
    name: 'posts',
    dir: 'src/content/posts',
    fields: ['title', 'excerpt'],
    hasBody: true,
  },
  {
    name: 'pages',
    dir: 'src/content/pages',
    fields: ['title'],
    hasBody: true,
  },
];

const PROJECT_ROOT = process.cwd();

function hashSource(payload: string): string {
  return createHash('sha256').update(payload).digest('hex').slice(0, 16);
}

function listMarkdown(dir: string): string[] {
  const out: string[] = [];
  const abs = join(PROJECT_ROOT, dir);
  for (const entry of readdirSync(abs)) {
    const full = join(abs, entry);
    if (statSync(full).isFile() && entry.endsWith('.md')) out.push(full);
  }
  return out;
}

function buildSourcePayload(
  data: Record<string, unknown>,
  body: string,
  cfg: CollectionConfig,
): { payload: Record<string, unknown>; hash: string } {
  const payload: Record<string, unknown> = {};
  for (const f of cfg.fields) {
    if (data[f] !== undefined) payload[f] = data[f];
  }
  if (cfg.arrayFields) {
    for (const f of cfg.arrayFields) {
      if (Array.isArray(data[f])) payload[f] = data[f];
    }
  }
  if (cfg.hasBody) payload.body = body;
  return { payload, hash: hashSource(JSON.stringify(payload)) };
}

function hasAllTranslations(
  data: Record<string, any>,
  cfg: CollectionConfig,
): boolean {
  const tr = data.translations as Record<string, Record<string, unknown>> | undefined;
  const bt = data.body_translations as Record<string, string> | undefined;
  if (!tr) return false;
  for (const loc of TARGET_LOCALES) {
    const t = tr[loc];
    if (!t) return false;
    for (const f of cfg.fields) {
      if (data[f] !== undefined && (t[f] === undefined || t[f] === '')) return false;
    }
    if (cfg.arrayFields) {
      for (const f of cfg.arrayFields) {
        if (Array.isArray(data[f]) && data[f].length > 0 && !Array.isArray(t[f])) return false;
      }
    }
    if (cfg.hasBody && (!bt || !bt[loc] || bt[loc].trim().length === 0)) return false;
  }
  return true;
}

function buildPrompt(cfg: CollectionConfig, payload: Record<string, unknown>): string {
  const targets = TARGET_LOCALES.map((l) => `${l} (${localeNames[l]})`).join(', ');
  return `You are a professional translator for a Montenegrin tourism directory.

Translate the JSON content below from Montenegrin Serbian (Latin script) into ${targets}.

Rules:
- Preserve markdown formatting (headings, bold, lists, links).
- Translate naturally for tourists, not literally. Keep the warm, direct, locally-grounded voice.
- Do NOT localize: prices (€), proper nouns (Petrovac, Buljarica, Sveti Stefan, etc.), phone numbers, addresses, brand names.
- For amenities arrays, output an array of the same length with each item translated.
- Output STRICT JSON only. No code fences, no commentary, no leading text.

Source content:
${JSON.stringify(payload, null, 2)}

Output JSON shape:
{
  "en": ${exampleShape(cfg)},
  "ru": ${exampleShape(cfg)},
  "de": ${exampleShape(cfg)},
  "fr": ${exampleShape(cfg)}
}`;
}

function exampleShape(cfg: CollectionConfig): string {
  const obj: Record<string, unknown> = {};
  for (const f of cfg.fields) obj[f] = '...';
  if (cfg.arrayFields) for (const f of cfg.arrayFields) obj[f] = ['...'];
  if (cfg.hasBody) obj.body = '...markdown...';
  return JSON.stringify(obj);
}

function parseClaudeJson(text: string): Record<string, Record<string, unknown>> {
  // Strip optional code fences if the model added them
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/i, '')
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    // Try to extract a JSON object substring
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start >= 0 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1));
    }
    throw err;
  }
}

async function translateFile(
  client: Anthropic,
  cfg: CollectionConfig,
  filePath: string,
  options: { force: boolean },
): Promise<'translated' | 'skipped'> {
  const raw = readFileSync(filePath, 'utf8');
  const parsed = matter(raw);
  const data = parsed.data as Record<string, any>;
  const body = parsed.content;

  const { payload, hash } = buildSourcePayload(data, body, cfg);

  if (!options.force && data.source_hash === hash && hasAllTranslations(data, cfg)) {
    return 'skipped';
  }

  const prompt = buildPrompt(cfg, payload);

  const resp = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 8000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = resp.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('');

  const out = parseClaudeJson(text);

  // Build translations map (frontmatter fields)
  const translations: Record<string, Record<string, unknown>> = data.translations ?? {};
  const bodyTranslations: Record<string, string> = data.body_translations ?? {};

  for (const loc of TARGET_LOCALES) {
    const t = out[loc];
    if (!t) continue;
    const trEntry: Record<string, unknown> = translations[loc] ?? {};
    for (const f of cfg.fields) {
      if (typeof t[f] === 'string') trEntry[f] = t[f];
    }
    if (cfg.arrayFields) {
      for (const f of cfg.arrayFields) {
        if (Array.isArray(t[f])) trEntry[f] = t[f];
      }
    }
    translations[loc] = trEntry;
    if (cfg.hasBody && typeof t.body === 'string') {
      bodyTranslations[loc] = t.body;
    }
  }

  const newData: Record<string, any> = {
    ...data,
    translations,
    source_hash: hash,
  };
  if (cfg.hasBody) newData.body_translations = bodyTranslations;

  const stringified = matter.stringify(body, newData);
  writeFileSync(filePath, stringified, 'utf8');
  return 'translated';
}

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const onlyIdx = args.indexOf('--only');
  const onlyFilter = onlyIdx >= 0 ? args[onlyIdx + 1] : null;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('✖  ANTHROPIC_API_KEY not set. Get one at https://console.anthropic.com');
    process.exit(1);
  }

  const client = new Anthropic({ apiKey });

  let translated = 0;
  let skipped = 0;
  let failed = 0;

  for (const cfg of COLLECTIONS) {
    const files = listMarkdown(cfg.dir);
    for (const filePath of files) {
      const rel = relative(PROJECT_ROOT, filePath);
      if (onlyFilter && !rel.includes(onlyFilter)) continue;
      const label = `${cfg.name}/${basename(filePath)}`;
      try {
        process.stdout.write(`  • ${label} ... `);
        const status = await translateFile(client, cfg, filePath, { force });
        if (status === 'translated') {
          translated++;
          console.log('✓ translated');
        } else {
          skipped++;
          console.log('· up to date');
        }
      } catch (err) {
        failed++;
        console.log('✖');
        console.error(`    ${(err as Error).message}`);
      }
    }
  }

  console.log(`\nDone. translated: ${translated} | up-to-date: ${skipped} | failed: ${failed}`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

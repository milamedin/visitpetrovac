#!/usr/bin/env node
/**
 * Auto-optimize images uploaded through Sveltia CMS (or any *.jpg/png in public/).
 *
 * For every JPEG/PNG in public/, ensures:
 *   1. Width is capped at MAX_WIDTH (default 1920) — keeps aspect ratio
 *   2. JPEG quality is no higher than MAX_QUALITY (default 80)
 *   3. A matching .webp variant exists alongside the JPG/PNG
 *
 * Skips files that are already optimized (smaller than threshold) and files
 * whose webp variant exists and is newer than the source.
 *
 * Runs in Cloudflare build before astro build, so every CMS upload is
 * automatically right-sized without any human intervention.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const MAX_WIDTH = 1920;
const JPEG_QUALITY = 80;
const WEBP_QUALITY = 78;
// Skip optimization for files smaller than this (already small enough)
const SKIP_BELOW_BYTES = 80 * 1024; // 80 KB

// Skip the backup folder of originals
const SKIP_DIRS = new Set(['_originals']);

let processed = 0, skipped = 0, totalSavedBytes = 0;

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else {
      yield full;
    }
  }
}

async function fileExists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

async function isNewerThan(a, b) {
  try {
    const [statA, statB] = await Promise.all([fs.stat(a), fs.stat(b)]);
    return statA.mtimeMs >= statB.mtimeMs;
  } catch { return false; }
}

async function processImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) return;

  const stat = await fs.stat(filePath);
  const beforeSize = stat.size;

  // Re-encode JPG/PNG only if oversized
  const meta = await sharp(filePath).metadata();
  const needsResize = meta.width && meta.width > MAX_WIDTH;
  const needsRecompress = beforeSize > SKIP_BELOW_BYTES && (ext === '.jpg' || ext === '.jpeg');

  if (needsResize || needsRecompress) {
    let pipeline = sharp(filePath);
    if (needsResize) pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
    if (ext === '.jpg' || ext === '.jpeg') {
      pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, progressive: true, mozjpeg: true });
    } else if (ext === '.png') {
      pipeline = pipeline.png({ compressionLevel: 9 });
    }
    const buffer = await pipeline.toBuffer();
    if (buffer.length < beforeSize) {
      await fs.writeFile(filePath, buffer);
      const saved = beforeSize - buffer.length;
      totalSavedBytes += saved;
      console.log(`  re-encoded ${path.relative(process.cwd(), filePath)}  ${(beforeSize/1024).toFixed(0)} KB -> ${(buffer.length/1024).toFixed(0)} KB`);
      processed++;
    }
  }

  // Generate WebP variant if missing or stale
  const webpPath = filePath.replace(/\.(jpe?g|png)$/i, '.webp');
  const webpExists = await fileExists(webpPath);
  const webpFresh = webpExists && await isNewerThan(webpPath, filePath);

  if (!webpFresh) {
    await sharp(filePath)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY, effort: 5 })
      .toFile(webpPath);
    console.log(`  +webp ${path.relative(process.cwd(), webpPath)}`);
    processed++;
  } else {
    skipped++;
  }
}

async function main() {
  console.log('🖼  Optimizing images in public/...');
  const start = Date.now();
  for await (const file of walk(PUBLIC_DIR)) {
    try {
      await processImage(file);
    } catch (err) {
      console.error(`  ✖ ${path.relative(process.cwd(), file)}: ${err.message}`);
    }
  }
  const ms = Date.now() - start;
  console.log(`✓ Done in ${(ms/1000).toFixed(1)}s — processed: ${processed}, skipped (up to date): ${skipped}, saved: ${(totalSavedBytes/1024).toFixed(0)} KB`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

# Deployment — Cloudflare Pages

VisitPetrovac koristi Astro 6 sa SSR-om na Cloudflare Workers preko Cloudflare Pages. Sav statički sadržaj se serviše sa edge-a, dinamičke stranice (search, API endpoints) idu kroz Worker.

---

## Prvo postavljanje (jednom)

### 1. GitHub repo

```bash
gh repo create milamedin/visitpetrovac.com --private --source=. --push
```

### 2. Cloudflare D1 baza

```bash
# Login
npx wrangler login

# Kreiraj bazu
npx wrangler d1 create visitpetrovac-db
# → copy id and paste it into wrangler.toml [[d1_databases]] database_id

# Apply schema
npx wrangler d1 migrations apply visitpetrovac-db --remote
```

### 3. Cloudflare KV (za sesije)

```bash
npx wrangler kv namespace create SESSION
# → copy id into wrangler.toml [[kv_namespaces]] id
```

### 4. Cloudflare Pages projekat

1. Idi na https://dash.cloudflare.com → Pages → Create project → Connect to Git
2. Izaberi `visitpetrovac.com` repo
3. Build settings:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Environment variables:
   - `GOOGLE_SHEETS_WEBHOOK_URL` — Apps Script Web App URL (postavi kao secret)
   - `IP_SALT` — random 32-char hex (postavi kao secret)
5. Bindings (Settings → Functions → Bindings):
   - **D1 binding:** `DB` → `visitpetrovac-db`
   - **KV binding:** `SESSION` → KV namespace
6. Custom domain: dodaj `visitpetrovac.com` → Cloudflare automatski podesi DNS

### 5. Google Sheets webhook (za tour booking)

1. Kreiraj novi Google Sheet sa kolonama: `received_at, listing_id, listing_title, name, email, phone, tour_date, persons, language, message`
2. **Extensions → Apps Script** → paste:
   ```js
   function doPost(e) {
     const sheet = SpreadsheetApp.getActiveSheet();
     const data = JSON.parse(e.postData.contents);
     sheet.appendRow([
       data.received_at_iso,
       data.listing_id,
       data.listing_title,
       data.name,
       data.email,
       data.phone,
       data.tour_date,
       data.persons,
       data.language,
       data.message,
     ]);
     return ContentService.createTextOutput(JSON.stringify({ ok: true }))
       .setMimeType(ContentService.MimeType.JSON);
   }
   ```
3. **Deploy → New deployment → Web app**
   - Execute as: Me
   - Who has access: Anyone
4. Copy Web App URL → set as `GOOGLE_SHEETS_WEBHOOK_URL` secret na Cloudflare

---

## Deploy ciklus

Push na `main` granu → Cloudflare Pages auto-build (~30-60 sek) → live.
Build na Cloudflare-u prvo pokrene `npm run translate` pa onda `astro build`,
tako da svaki novi tekst u SR markdown-u dobije EN/RU/DE/FR prevod prije deploy-a.

```bash
git add . && git commit -m "Update content"
git push
```

---

## Auto-translate (sr → en/ru/de/fr)

Sav SR sadržaj (listinzi, kategorije, blog, vlasnici, stranice) se automatski prevodi na engleski, ruski, njemački i francuski preko Claude Haiku API-ja. Skripta čuva content hash, pa se ne re-prevodi ako se ništa nije promijenilo.

### Lokalno

```bash
export ANTHROPIC_API_KEY=sk-ant-...   # https://console.anthropic.com
npm run translate                      # samo nove/izmijenjene fajlove
npm run translate:force                # re-prevedi sve (nakon promjene tona/glossara)
npm run translate -- --only listings/villa-azur  # jedan fajl
```

### Cloudflare Pages

Postavi `ANTHROPIC_API_KEY` kao **Encrypted variable** u **Settings → Environment variables** za Production. `npm run build` na Cloudflare-u tada uključuje translate korak — svaki push automatski popuni nedostajuće prevode prije deploy-a.

### Trošak

Claude Haiku 4.5 ~$0.25/M input + $1.25/M output token. Tipičan listing (title + excerpt + amenities + body): ~3—8k input + ~12k output tokena. Cijena cijelog sajta sa ~50 listinga + ~20 blog tekstova: **~$0.50—1.00 po `--force` runu**. Inkrementalni runovi (samo nove/izmijenjene) u centima.

### Kako radi pod haubom

- `scripts/translate.ts` čita sve `src/content/**/*.md`
- Za svaki fajl kompjutuje SHA-256 hash relevantnih polja + body
- Ako se hash ne mijenja i postoje prevodi za sva 4 jezika → preskače
- Šalje JSON Claude-u sa instrukcijom da vrati JSON sa svim 4 lokala odjednom (1 request po fajlu, ne 4)
- Upisuje rezultat u `translations: {...}` i `body_translations: {...}` frontmatter polja
- Body markdown se renderuje kroz `markdown-it` u runtime-u kad korisnik otvori `/en/...` rutu

### Override — kad ne želiš auto

Vlasnica može u Decap CMS-u (kasnije, kad bude konfigurisan) ručno upisati prevod u "Translations" sekciju listing edit forme. Skripta neće prepisati postojeća polja — samo popunjava prazna. Ako želiš da forsiraš re-prevod, pokreni `npm run translate:force`.

---

## Sadržaj (bez koda)

Otvori `https://visitpetrovac.com/admin/` (Decap CMS) — login sa GitHub, edituj listinge / blog / stranice. Svaki "Save" commit-uje u Git i automatski deploy-uje (~30 sek).

**Lokalni admin (testiranje bez deploy-a):**
```bash
# Terminal 1
npm run dev

# Terminal 2
npx decap-server
```
Otvori http://localhost:4321/admin/

---

## Troubleshooting

**Build fails na Cloudflare:** Provjeri Node verziju u Cloudflare Pages → Settings → Build → Node version (treba ≥22).

**Tour booking ne stigne na Sheets:** Provjeri `GOOGLE_SHEETS_WEBHOOK_URL` env var. Apps Script log: View → Executions.

**Klikovi se ne loguju u D1:** Provjeri D1 binding na Cloudflare. Inspect: `npx wrangler d1 execute visitpetrovac-db --remote --command "SELECT COUNT(*) FROM contact_logs"`

**Slike se ne učitavaju:** Slike se serviraju iz `/public/uploads/`. Cloudflare Pages auto-detect-uje `public/` folder.

# Launch checklist — VisitPetrovac

Korak-po-korak za prvi deploy. Sve što ti je potrebno: GitHub nalog, Cloudflare nalog (oba besplatna), Anthropic API key. Ukupno ~30—45 minuta.

---

## 1) Auto-prevod (~5 min)

**Čemu služi:** Prevodi sav SR sadržaj (listinge, blog, vlasnike, stranice) na EN/RU/DE/FR. Pokrećeš jednom prije prvog deploy-a, kasnije svaki put kad dodaš novi listing.

```bash
# Generiši ključ na https://console.anthropic.com (5 min, traži broj kartice)
export ANTHROPIC_API_KEY=sk-ant-...

cd ~/Documents/WORK/visitpetrovac.com
npm run translate
```

Trošak prvog runa: **~$0.50—1.00** za 20 listinga + 3 blog teksta + 4 stranice.

Provjera: otvori bilo koji listing markdown u `src/content/listings/` — trebao bi imati `translations:` i `body_translations:` polja popunjena za en/ru/de/fr.

---

## 2) Push na GitHub (~5 min)

```bash
cd ~/Documents/WORK/visitpetrovac.com
git init
git add .
git commit -m "Initial commit: v2.0 Astro build"

# Napravi novi private repo na github.com pod tvojim username-om
# Pa konektuj:
git branch -M main
git remote add origin git@github.com:milamedin/visitpetrovac.com.git
git push -u origin main
```

(Ako ne koristiš SSH, koristi HTTPS URL: `https://github.com/milamedin/visitpetrovac.com.git`)

---

## 3) Cloudflare Pages deploy (~15 min)

### 3.1 — Povezivanje repa

1. Idi na https://dash.cloudflare.com → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
2. Autorizuj GitHub, izaberi `visitpetrovac.com` repo
3. Build settings:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** ostavi prazno
4. Klikni **Save and Deploy**

Prvi build neće raditi jer fali D1 + KV bindings. To je sledeći korak.

### 3.2 — D1 baza (za click logove i tour upite)

```bash
npx wrangler login
npx wrangler d1 create visitpetrovac-db
# Kopiraj `database_id` koji ispiše i pasti ga u wrangler.toml na liniji `database_id = "..."`

npx wrangler d1 migrations apply visitpetrovac-db --remote
```

### 3.3 — KV namespace (za sesije)

```bash
npx wrangler kv namespace create SESSION
# Kopiraj `id` u wrangler.toml na liniji KV `id = "..."`
```

### 3.4 — Bindings + secrets

U Cloudflare dashboard → tvoj Pages projekat → **Settings → Bindings**:
- **D1 database:** Variable `DB`, vežeš za `visitpetrovac-db`
- **KV:** Variable `SESSION`, vežeš za KV namespace iz prethodnog koraka

U **Settings → Environment variables → Production**:
- `ANTHROPIC_API_KEY` = tvoj key (Encrypted) — bez ovog `npm run build` na Cloudflare-u neće moći da prevodi
- `GOOGLE_SHEETS_WEBHOOK_URL` = (kasnije, kad podesiš Sheets)
- `IP_SALT` = bilo koji random 32-char hex (koristi se za hashovanje IP-jeva)

### 3.5 — Push da pokreneš novi build

```bash
git commit --allow-empty -m "Trigger Cloudflare rebuild"
git push
```

Sajt bi trebao da se deploy-uje za ~60 sek na URL tipa `visitpetrovac.pages.dev`.

### 3.6 — Custom domen

U Cloudflare → tvoj Pages projekat → **Custom domains** → **Set up a custom domain** → unesi `visitpetrovac.com` i `www.visitpetrovac.com`. Ako ti je domen na Cloudflare-u, DNS se podešava automatski. Ako je negdje drugdje, dobićeš CNAME zapise.

---

## 4) Google Sheets webhook (za tour booking — opciono, 10 min)

Bez ovog, tour upiti će se logovati u D1 (vidiš ih kroz wrangler), ali bez Sheets-a vlasnice ne mogu jednostavno da ih pregledaju.

1. Kreiraj novi Google Sheet sa kolonama: `received_at, listing_id, listing_title, name, email, phone, tour_date, persons, language, message`
2. **Extensions → Apps Script** → paste:
   ```js
   function doPost(e) {
     const sheet = SpreadsheetApp.getActiveSheet();
     const data = JSON.parse(e.postData.contents);
     sheet.appendRow([
       data.received_at_iso, data.listing_id, data.listing_title,
       data.name, data.email, data.phone,
       data.tour_date, data.persons, data.language, data.message,
     ]);
     return ContentService.createTextOutput(JSON.stringify({ ok: true }))
       .setMimeType(ContentService.MimeType.JSON);
   }
   ```
3. **Deploy → New deployment → Web app** (Execute as: Me, Who has access: Anyone)
4. Kopiraj Web App URL → Cloudflare Pages → Settings → Environment variables → `GOOGLE_SHEETS_WEBHOOK_URL`
5. Trigger novi build (`git commit --allow-empty -m "wire sheets" && git push`)

---

## Posle launch-a

### Dodavanje novog listinga

**Option A — direktno u kodu (brzo):**
1. Kreiraj `src/content/listings/<slug>.md` po istom šablonu kao postojeći listinzi
2. Dodaj fotke u `public/uploads/listings/<slug>-1.jpg`, `<slug>-2.jpg`, ...
3. `npm run translate` (auto-prevod)
4. `git add . && git commit -m "New listing: <name>" && git push`
5. Cloudflare auto-rebuild za 60 sek

**Option B — kroz Decap CMS (kasnije, treba dodatni setup):**
Pogledaj `public/admin/README.md` za GitHub OAuth setup. Nakon toga:
1. Otvoriš `https://visitpetrovac.com/admin/`
2. Login sa GitHub
3. Klikneš "Listinzi → Nov" — popuniš formu
4. "Save" → auto-commit + auto-deploy

### Dodavanje blog teksta

Isto kao listing, samo `src/content/posts/<slug>.md`.

### Promjena cijena pretplate

`src/pages/postani-partner.astro` — `tiers` array na vrhu fajla.

### Dodavanje novog UI prevoda

`src/i18n/strings.ts` — dodaj ključ u `StringKey` tip + popuni za sva 4 jezika.

---

## Ako nešto pukne

- **Build fails na Cloudflare:** Provjeri Node verziju (Settings → Build → Node version ≥22)
- **`npm run translate` fails:** Provjeri da je `ANTHROPIC_API_KEY` postavljen i validan
- **Sajt prazan:** D1/KV bindings vjerovatno fali — provjeri Settings → Bindings
- **Tour booking ne stigne:** `wrangler d1 execute visitpetrovac-db --remote --command "SELECT * FROM tour_inquiries ORDER BY received_at DESC LIMIT 5"` — provjeri D1 direktno

Više detalja u [DEPLOY.md](./DEPLOY.md).

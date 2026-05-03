# Admin panel — Decap CMS

Web UI za uređivanje sadržaja (listinzi, blog, stranice, vlasnici, kategorije).
Otvara se na `/admin/` u browseru. Sve izmjene se čuvaju kao Git commit.

---

## Lokalni development (testiranje admin panela bez deploy-a)

```bash
# U jednom terminalu — Astro dev server
cd visitpetrovac.com
npm run dev

# U drugom terminalu — Decap proxy server
npx decap-server
```

Otvori `http://localhost:4321/admin/` — prijavljuje te direktno u "Working with Local Repository" mod, bez OAuth-a. Sve izmjene se pišu u tvoj lokalni `src/content/...` folder.

---

## Production setup (preko GitHub-a)

Decap CMS commituje direktno u GitHub repo. Treba podesiti GitHub OAuth aplikaciju da bi vlasnica mogla da se prijavi.

### Korak 1 — Push repo na GitHub

```bash
gh repo create milamedin/visitpetrovac.com --private --source=. --push
```

### Korak 2 — Edit `config.yml`

U `public/admin/config.yml`, postavi:
```yaml
backend:
  name: github
  repo: milamedin/visitpetrovac.com   # <— tvoj repo
  branch: main
  base_url: https://decap-oauth.tvoj-subdomain.workers.dev   # <— OAuth proxy (sledeći korak)
```

### Korak 3 — OAuth proxy (Cloudflare Worker)

Decap CMS ne može direktno da govori sa GitHub OAuth API-jem (CORS). Treba mali proxy. Najlakše rješenje: Cloudflare Worker.

1. Kreiraj OAuth App na GitHub-u: **Settings → Developer settings → OAuth Apps → New OAuth App**
   - Application name: `VisitPetrovac CMS`
   - Homepage URL: `https://visitpetrovac.com`
   - Authorization callback URL: `https://decap-oauth.tvoj-subdomain.workers.dev/callback`
2. Sačuvaj `Client ID` i generiši `Client Secret`
3. Deploy-uj OAuth proxy Worker:
   - Repo: https://github.com/sterlingwes/decap-cms-cloudflare-oauth (ili sličan)
   - Postavi `OAUTH_CLIENT_ID` i `OAUTH_CLIENT_SECRET` env varijable u Workeru
4. URL Workera staviti u `base_url` u `config.yml`

### Korak 4 — Cloudflare Pages deploy

Push na GitHub → Cloudflare Pages auto-deploy → admin panel je dostupan na `https://visitpetrovac.com/admin/`.

Vlasnica klikne "Login with GitHub" → autorizuje aplikaciju → može da edituje sadržaj.

---

## Šta vlasnica može iz admin panela

- **Listinzi** (apartmani, restorani, izleti, rent-a-car) — dodaj nov, edituj, deaktiviraj, dodaj fotografije
- **Vlasnici** — dodaj profil vlasnika sa kontaktima i bio
- **Kategorije** — promijeni naziv, opis, hero sliku
- **Blog** — piši nove tekstove sa markdown editorom
- **Stranice** — edituj o-nama, kontakt, uslove i privatnost

Svaki "Save" iz admin-a:
1. Commituje promjenu u GitHub
2. Cloudflare Pages auto-rebuilduje sajt (~30 sek)
3. Promjena je live

---

## Backup

Sav sadržaj je u Git repu (`src/content/...`). Backup = `git clone`. Fotografije su u `public/uploads/`.

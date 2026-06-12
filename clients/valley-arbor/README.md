# Valley Arbor — website rebuild

Client: **Matt Nicolaisen**, Valley Arbor (valleyarbor.com.au). Melbourne north-east climbing arborist, owner-run. Referred via Jordan (J Bryant).

- **Status:** scope locked on the 2026-06-04 call. Awaiting assets + access to start the build.
- **Deal:** A$1,000 (favour rate; normal A$2,500). Plus a free quote-follow-up automation after the site.
- **Turnaround:** ~14 days once assets are in.

## Folder layout

- `concept-v1/` — the first dark/editorial concept. Archived, off-brand ("a bit AI slop"). Reference only.
- `site/` — the build. Current chosen direction: **`concept-a3.html`**.
- `assets/` — his photos, logo, brand green. See `assets/README.md`.

### Concepts in `site/` (newest = chosen)
- **`concept-a3.html` — CHOSEN.** White, his fonts (Poppins + Epilogue, pulled from his current site), 6-up icon service grid (icons per Matt's request), eucalyptus-sprig motif, "the craft" band, Foliole-style quote form. The "beautiful, not AI slop" version.
- `concept-a2.html` — same elevation but warm bone + Fraunces serif. Superseded by a3 (Isaiah wanted more white + his fonts).
- `concept-a.html` / `concept-b.html` — earlier clean-trade vs photo-led drafts (share `concept.css`/`concept.js`).
- `img/` — stock tree photos (stand-ins). Reviews in the concepts are sample copy. Green is an approximate eucalypt (his exact Squarespace theme green still needed).

Local preview server (while running): http://127.0.0.1:8090/ → `site/concept-a3.html`.

## Direction (locked)

Keep **his** scheme: clean white background, his green, touches of gray. Light and simple. Model the layout on **Tree Range Arborist** (treerangearborist). Design **mobile-first**.

## Changes, by section

**Hero / top (priority)**
- Tap-to-call number at the very top.
- Primary CTA "Book an on-site quote" centered up top → quote form.
- Order centered: on-site quote, then number, then nav. Burger menu repeats those two first.
- Short spiel then a second CTA lower (so they don't scroll back up).

**Services** — simplify to clean uniform icons, smaller. Set: Tree Pruning, Tree Removal, Stump Grinding, Emergency Tree Removal, Mulch Delivery, Commercial. Keep Elm Leaf Beetle. Drop possum guard + service wire clearing.

**Reviews** — keep, move further down (not top). Bake real Google reviews in natively (live, auto-update, no widget).

**Work photos / Instagram** — shrink the oversized rig section, more whitespace, reframe the old 2013 photo. Instagram feed stays as work photos but opens in a new tab, plus a CTA. Use his good photos.

**Fix** — remove the duplicate FAQ.

**Quote form ("Book on-site quote")** — Matt specifically likes the **Foliole** contact section (Vercel: `foliole-tree-management`, project `prj_3RmHoYUowR4NznFtpySiWEwFfqxK`). Lift that form's STRUCTURE and UX, recoloured to the light white/green scheme (Foliole itself is dark forest + ember orange, which we do NOT use). Foliole's fields, in order: "enquiring as" toggle (owner / contractor), name + email, phone (optional), location + number of trees (dropdown 1 / 2-3 / 4-6 / 7-10 / 10+ / large site), what work (dropdown), urgency as 4 tappable cards (flexible / within a month / urgent / emergency), "tell us more" textarea, photo upload (drag-drop, max 5), "Send Quote Request" pill + "responds within 24h, kept private" line. For Valley Arbor, drop the council + electrical extras; keep it short. (The "Jordan" copy in Foliole is demo persona, not his real site, which is separate.)

**Service areas + SEO (priority for Matt)**
- Replace the visible area list with a map.
- Build hidden per-suburb landing pages ("Arborist Eltham", "Arborist Box Hill South", etc.) so those searches rank.
- **Preserve existing SEO equity:** keep his ranking page titles (e.g. "Tree Pruning [suburb] Melbourne"), the tree-pruning page, URL patterns, and the domain. Do not break what works.
- Add `sitemap.xml`.
- Isaiah is not an SEO specialist: do the wins (maps, sitemap, titles, suburb pages), refer a specialist if he wants more.

**Trust / credentials** — add Cert III Arboriculture now, Diploma later. Optional VTIO / Arboriculture Australia footer badges if he joins. Lead with call + reviews + work in the first 20 seconds. Keep the koala and the fast load.

## Build base (decided)

Do not build from scratch. Base off the **YAZ Services** template (Vercel `yaz-services` / `robert-green-carpenter` are the same codebase): light, white background, green token system (`--primary #1b6b3a`, `--accent` amber, `--radius-*`/`--shadow-*`), Manrope 400-800, sticky blurred nav + pill CTA, hero "How can we help?" checklist card, 6-icon service grid, trust bar, two-col contact. This keeps it consistent with Isaiah's existing approved style (the anti-slop fix).

Adaptations for Valley Arbor:
- Recolour green to Matt's exact brand green; keep it clean white/green/gray.
- Add a **visible tap-to-call in the nav** (YAZ hides phone in the hero; Matt wants it up top, esp. mobile) alongside the "Book on-site quote" CTA, centered.
- Populate the hero checklist card + 6 service icons with his services.
- Swap YAZ's basic contact form for **Foliole's richer pre-qualifier** (recoloured light) — see the quote-form note above.
- Reviews moved mid-page (real Google reviews baked in).

## Tech / delivery

Hand-coded HTML, GitHub repo `valleyarbor` + Vercel. Staged like Jordan's: build on a Vercel preview, Matt reviews, then repoint the Squarespace domain to Vercel. Domain unchanged, so Google Business Profile + reviews are untouched. Matt is fine not self-editing; Isaiah makes future edits (revertible via Git/Vercel).

## The free automation favour (after the site)

Quote follow-up sequence wired to **ServiceMate** (connects to Xero). Catch quotes sent with no reply, follow up heavier early (2-3 days), space out, then push for a yes/no. The retainer wedge.

## Open / next steps

- [x] Build concept drafts; chosen direction = `concept-a3.html` (white, his Poppins/Epilogue fonts, icon services).
- [x] Confirmed his fonts (Poppins + Epilogue) from valleyarbor.com.au.
- [x] Send the drafted follow-up email to Matt (logins, photos, logo, exact green). Sent 2026-06-10.
- [x] Get the brand kit from Matt (received 2026-06-10; logo suite in `assets/`, palette in `assets/README.md`).
- [x] Wire his real logo + exact palette (sage #6F7F57 / ink #1E2730 / bone #F0E8E0) into **both** concepts (a2 + a3): nav + footer lockups, mark watermarks, favicon. Web assets trimmed into `site/brand/`.
- [x] Swap in his real work photos — salvaged the professional **Claire Davie** shoot from the stalled `assets/Photos-...zip.part` (zip central dir intact), exported web-sized into `site/photos/`, wired **distinct sets** into a3 + a2 (hero = roped-up climb, craft band = on-site arborist portrait, gallery = canopy/climb/firewood).
- [x] Wire the reviews wall to a live feed (filters 5-star, sorts newest, ToS attribution, static-card fallback). Front end + Places fetcher + docs built. See `REVIEWS.md`.
- [ ] Flip live reviews on: needs a Google place id (Places path) or Matt's Business-Profile manager access (full-wall path) + Vercel env vars. Review *text* is sample until then.
- [ ] Pick final photo selection with Matt; finalise copy; add Terms/Privacy pages (required for the Google reviews API).
- [ ] Add per-service pages + hidden suburb SEO pages + sitemap.xml.
- [ ] Push to a Vercel preview; Matt reviews.
- [ ] Repoint the Squarespace domain to Vercel (keeps domain, so Google reviews safe).
- [ ] Send invoice `INV014_Valley_Arbor.pdf` (drafted 2026-06-12, in this folder; INV014 follows Peninsula Makers Hub's INV013). Complete with ABN + bank details, ready to send.
- [ ] Then: build the quote-follow-up automation (ServiceMate).

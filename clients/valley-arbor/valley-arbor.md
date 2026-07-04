---
name: Valley Arbor
type: project
status: active
owner: Isaiah Wong
colour: "#6F7F57"
created: 2026-06-04
updated: 2026-06-24
tags: [engagement, field-service]
hub: [company-brief, tone-of-voice, pricing, scope, field-service]
---

# Valley Arbor

The spoke note for the Valley Arbor build. Client: Matt Nicolaisen, owner-run climbing arborist in
Melbourne's north-east, referred via Jordan (J Bryant). A$1,000 hand-coded HTML site (favour rate),
now live, with a free quote-follow-up automation as the retainer wedge.

## Connections (to the hub)

- **Governed by:** [company-brief](../../brain/company-brief.md), [tone-of-voice](../../brain/tone-of-voice.md)
  (no em dashes in his site copy), [pricing](../../brain/pricing.md) (the favour-rate call),
  [scope](../../brain/scope.md) (DA boundary), [field-service](../../brain/field-service.md)
  (the trades / FSM positioning).
- **Referral source:** [jbryant](../../brain/engagements/jbryant.md) (Jordan referred Matt). No
  separate deal record; this is a delivered, invoiced build (INV014).
- **Map:** [Walter](../../Walter.md).

## Surfaces

- **Domain / URL:** valleyarbor.com.au (live on Vercel since 2026-06-20; also valleyarbor.vercel.app).
  Apex `A 76.76.21.21`, `www CNAME cname.vercel-dns.com`, old Squarespace URLs 301.
- **Repo / deploy:** Vercel project `valleyarbor`, CLI-deployed from `/Users/isaiahwong/valleyarbor`
  (the deploy copy). This `clients/valley-arbor/` folder is the working / source-of-record copy.
- **n8n:** `DA - Valley Arbor Lead Log` (id `4SMnQAh22ie3pr4d`, active) sends quote-form enquiries
  to Matt via Gmail.
- **Reviews:** Google Places API, Place ID `ChIJ50Nfzwwk80IR3hfYzA2IpCs` (5.0 / 51). See `REVIEWS.md`.
- **Secrets:** `clients/valley-arbor/.env` (gitignored).

## Scope

In: the marketing site, 69 council-accurate suburb landing pages (`/tree-services-{slug}`), the
sitemap/robots, the reviews wall, and the quote-form lead log. Out: ongoing SEO specialist work
(Isaiah does the wins, refers out beyond that), and self-edit CMS (Isaiah makes future edits).

## Status and next

- **Stage:** live and delivered. Domain migrated, 69 suburb pages published, real reviews wired,
  quote form active.
- **Next:** submit the sitemap in Google Search Console and monitor; keep the Squarespace site as a
  fallback a few more days; keep the Squarespace domain *registration* active (only DNS moved).
  Then build out the quote-follow-up automation (the retainer wedge).
- Full open-items history lives in `README.md`; note that README's top-of-file status predates the
  go-live and needs a refresh.

## Working docs (index)

- [README.md](README.md) — build direction, section-by-section spec, delivery notes (needs a status refresh).
- [REVIEWS.md](REVIEWS.md) — the live Google reviews wiring.
- [redirect-map.md](redirect-map.md) — old Squarespace to new URL 301 map.
- `build-suburbs.py` — the suburb-page generator.
- `site/` — the build. `assets/` — his logo, photos, palette (sage #6F7F57 / ink #1E2730 / bone #F0E8E0).

## Decisions

- Carousel/landing style locked; the dark "concept-v1" was retired as off-brand.
- Domain migrated to Vercel rather than rebuilding on Squarespace, to keep Google Business Profile
  and reviews intact. See `planning/decision-log.md`.

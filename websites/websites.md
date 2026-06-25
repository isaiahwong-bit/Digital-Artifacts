---
name: Websites (portfolio)
type: layer
status: active
owner: Isaiah Wong
colour: "#64748B"
created: 2026-06-24
updated: 2026-06-24
tags: [engagement]
hub: [company-brief, tone-of-voice, pricing]
---

# Websites (portfolio)

The index for DA's website builds. Every site DA has shipped on Vercel is a project of Digital
Artifacts (Layer 4 rendered as a front end). This folder holds one spoke per client site. The site
code itself lives in each site's own Vercel project, not in this repo, so the spokes document the
work; they are not the source.

This is distinct from `clients/`, which holds active builds whose working source lives in-repo
(Valley Arbor, Lounge Lovers). A site can appear in both: Valley Arbor is an active client *and* a
portfolio entry. Cross-link rather than duplicate.

## Connections (to the hub)

- **Governed by:** [company-brief](../brain/company-brief.md), [tone-of-voice](../brain/tone-of-voice.md)
  (site copy follows the voice, no em dashes), [pricing](../brain/pricing.md) (website tier).
- **Map:** [Walter](../Walter.md). **Live gallery:** the portfolio sections in `websites.html`
  and `index.html`.

## How DA builds a site (the method, the "how and what")

These are the shared tools and steps. Per-site specifics live in each spoke.

- **Hand-coded static HTML / CSS / JS.** No heavy CMS. The DA marketing site uses Tailwind + lucide
  icons; client sites are hand-built from the template library below.
- **A reusable trade-template library** as starting points: Yaz Services (multi-trade), Stoa Finance
  (professional services), Robert Green Carpenter, Eastern Suburbs Painting, Tom's Firewood. A new
  build starts from the closest template, then is recoloured and rewritten (e.g. Valley Arbor off
  Yaz Services). This is the anti-AI-slop move: start from an approved layout, not a blank page.
- **Vercel hosting** with custom `.com.au` domains and automatic SSL. DNS cut over from Squarespace
  or Cloudflare as needed; old URLs 301'd to preserve SEO.
- **SEO suite:** Open Graph + Twitter cards + JSON-LD structured data + `sitemap.xml` / `robots.txt`.
- **Forms:** Formspree for simple contact (e.g. Cee Ess), or n8n + Gmail for advanced lead logging
  with a Telegram approval gate (e.g. Valley Arbor, see [automations](../n8n-workflows/automations.md)).
- **Touches:** mobile-first, animated loading, custom cursor, real reviews baked in where available.

Note: these are the front-end build tools, not the Layer 2 sales [skills](../skills/skills.md),
which are a separate set of prompt recipes for the sales operation.

## The sites

| Site | URL | Kind | Spoke |
|---|---|---|---|
| Cee Ess Designs | cee-essdesigns.com.au | client | [cee-ess-designs](cee-ess-designs.md) |
| Full Circle Solutions | fullcirclesolutions.com.au | client | [full-circle-solutions](full-circle-solutions.md) |
| Peninsula Makers Hub | peninsula-makers-hub.vercel.app | client (paid, INV013) | [peninsula-makers-hub](peninsula-makers-hub.md) |
| Valley Arbor | valleyarbor.com.au | client (active) | [valley-arbor](../clients/valley-arbor/valley-arbor.md) |
| Foliole Tree Management | foliole-tree-management.vercel.app | client | TODO |
| BaySolar UK | baysolar-uk.vercel.app | client | TODO |
| Lumberjord | TODO (not yet in repo) | client | TODO |
| Templates (Yaz, Stoa, Robert Green, Eastern Suburbs Painting, Tom's Firewood) | various .vercel.app | template library | not a client project |

## Status and next

- **Stage:** portfolio captured for the three documented client sites.
- **Next:** confirm Lumberjord's details, and decide whether Foliole and BaySolar UK get their own
  spokes or stay listed here.

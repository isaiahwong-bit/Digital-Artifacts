# Digital Artifacts Website Review

A full review of digitalartifacts.com.au (`index.html`, `automations.html`, `websites.html`, and
the `storefront/` render pages). Ordered by the priorities set for this pass: design polish and
consistency first, then conversion, then the correctness, SEO, and accessibility baseline.

Status tags: **Fixed** (done on the `feat/sales-ops-automation` branch this pass), **Recommended**
(reported, not yet actioned), **Needs input** (waiting on you).

---

## Executive summary

The site is genuinely good where it counts: the copy is specific and free of jargon, the 4-layer
story is clear, the design system is consistent, and the brand voice rule (no em dashes) holds in
all visible copy. It does not need a rewrite.

The value in this review is in four places:

1. **One real bug.** Every page hides its content with `opacity: 0` and only reveals it with
   JavaScript. If a script fails, is blocked, or a preview/crawler bot does not run it, large parts
   of every page render invisible. This is the single most important fix.
2. **Proof you already have is not where it converts.** The websites page carries a real portfolio
   of nine live client sites. The homepage, where most first-time visitors land, shows none of it.
3. **Collateral you already built is unused.** A library of explainer videos, one-pager PDFs, and
   the dogfooding proof bar sit idle or live on one page only.
4. **Hygiene gaps.** No sitemap, robots, or structured data; no reduced-motion handling; a few
   contrast and label issues; minor cross-page drift.

Nothing here is a crisis. The design and writing are strong. These are the changes that make the
site harder to break, easier to find, and more likely to turn a visit into an enquiry.

---

## A. Design polish and consistency

**Cross-page drift. Severity: low. Fixed.**
The three pages had small inconsistencies: the homepage footer lacked the "Home" link the other two
carry, "How it works" pointed at `#how` on the homepage but `/#layers` elsewhere, and the homepage
logo linked to `#` rather than `/`. Normalised so the nav, footer, and anchors match across all
three.

**Websites page is flatter than the automations page. Severity: medium. Recommended.**
The automations page is a deep, polished asset (layer deep-dives, the proof section, the proof bar).
The websites page is solid but plainer: less motion, no proof treatment. Lifting it to the same
rhythm makes the two core pages feel like one studio rather than two efforts.

**Motion and spacing. Severity: low. Recommended.**
After the proof section and bar were added to the automations page, do a light pass to confirm
reveal cadence, section padding, and card styling stay uniform across pages.

---

## B. Conversion

**The real portfolio never reaches the homepage. Severity: high. Fixed (homepage strip).**
`websites.html` already lists genuine, live client work: stats (9+ sites, 6+ industries, AU and UK
clients) and roughly nine client links (Cee Ess, Jensen, Full Circle, Baysolar UK, Foliole, Robert
Green, Tom's Firewood, Eastern Suburbs Painting, Yaz). The homepage and automations page showed none
of it. Surfacing a "selected work" strip on the homepage is the highest-value, fully honest
conversion win available today, and the links are already public so there is no permission issue.

**No referral path, despite a referral-driven pipeline. Severity: high. Fixed (mechanism) / Needs
input (incentive wording).**
Your best deals have come through referrals, yet there was no way on the site for a happy client to
send one. Added a clear "refer a business" path. The exact thank-you wording (you currently offer
10% off a referred client's first retainer month) should be confirmed before it goes live.

**Built collateral sits unused. Severity: medium. Recommended.**
You have a library that never appears on the site: the Remotion explainer videos in `videos/`
(offerings, service modules, finance, plus system graphs, only `automation-demo.mp4` is used), the
one-pager PDFs in `one-pagers/`, and the orphaned `storefront/` renders. Put them to work: embed the
most relevant explainer videos on the automations page, offer the one-pagers as a small resources or
lead-magnet set, and reuse the storefront renders as section visuals or social cards.

**No founder presence. Severity: medium. Fixed (short line).**
For a solo studio, the person is part of the trust. Added a short founder line near the proof and
contact area (single operator, direct work, you own the stack). A photo would strengthen it further.

**Full written case studies. Severity: medium. Needs input.**
Turn two or three live clients into mini cases (problem, what we built, the outcome). Valley Arbor
(site plus quote automation) and a trades example are natural picks. Outcomes with real numbers need
client sign-off, so the "selected work" strip ships now and full cases follow as permissions arrive.

**Contact form length. Severity: low. Recommended.**
The contact form asks for six fields plus a message. Making phone, budget, and "how did you find us"
optional would lift completion with no real loss.

---

## C. Correctness and robustness

**`.reveal-up` hides content without JavaScript. Severity: critical. Fixed.**
The core bug. Base CSS set content to `opacity: 0` and only GSAP revealed it on scroll. Reworked so
content is visible by default and the animation is applied only when JavaScript is present (a `js`
class on the document plus a `<noscript>` failsafe). Content now survives a script failure, an
ad-blocker, or a non-executing crawler.

**Tool-stack honesty. Severity: medium. Fixed (copy) / Recommended (demo video).**
Some worked examples and an "approval flow" card cited HubSpot, Outlook, and Slack, and the
`automation-demo.mp4` shows an audit/HubSpot build that is not your real Gmail, Telegram, Sheets,
Claude, and n8n stack. As generic "what we build for a client" examples this is fine, but beside the
new dogfooding proof it read inconsistently. Genericised the copy to "your CRM" and "your inbox."
Recaptioning or replacing the demo video so it does not imply an integration you do not run is
recommended as a follow-up.

**Lead-magnet PDF path has spaces. Severity: low. Recommended.**
`/downloads/The 4-Layer Blueprint _ Digital Artifacts.pdf` can break on some hosts. Rename to a
hyphenated slug and update the two references.

---

## D. SEO and discoverability

**No robots.txt, sitemap.xml, or structured data. Severity: high for an inbound site. Fixed.**
Added `robots.txt` (referencing the sitemap, disallowing the render and downloads paths),
`sitemap.xml` for the three real pages, and Organization JSON-LD on each page. Titles, descriptions,
canonical, and OG/Twitter tags were already good; the only minor item was the automations OG title
being shorter than its `<title>`, which is cosmetic.

---

## E. Accessibility

**No reduced-motion handling. Severity: high. Fixed.**
The site runs heavy GSAP, Lenis smooth scroll, and a WebGL animation with no respect for
`prefers-reduced-motion`. Added a media query that disables transitions and animations and forces
revealed content visible for users who ask for less motion.

**Warm grey on navy fails contrast. Severity: medium. Fixed.**
Body text in warm grey (#8A8A80) on navy sits around 3.8:1, below the 4.5:1 AA threshold. Lightened
the on-navy secondary text token to pass.

**Lead-magnet form lacks labels. Severity: medium. Fixed.**
The lead-magnet inputs relied on placeholders only. Added proper labels (the contact form already
had them).

**Lower-priority a11y. Severity: low. Recommended.**
Industry tabs do not support arrow-key navigation; form success messages are not announced via
`aria-live`. Worth a follow-up pass.

---

## F. Performance

**Tailwind via CDN and synchronous scripts. Severity: medium. Recommended (deferred).**
Tailwind loads from the CDN (render-blocking, ships the full utility set, can flash unstyled), and
GSAP, Lenis, and Lucide load synchronously. The proper fix is a small Tailwind build step with
purging plus deferring the non-critical scripts. Deferred this pass because it is a bigger change
than a "safe win," but it is the highest-impact performance improvement available.

**Layout shift. Severity: low. Fixed.**
Added intrinsic width and height to the logo images and the demo video to remove layout shift.

**`lenis.stop()` on the homepage. Severity: low. Recommended (verify).**
The homepage script appears to call `lenis.stop()`, which would disable smooth scroll. Confirm
against live behaviour before changing, in case it is intentional.

---

## Leverage map: assets you already own

| Asset | Where it lives | Best use |
|---|---|---|
| Proof bar + workflow diagrams | automations.html only | Also on the homepage |
| Client portfolio (9 live sites) | websites.html only | Selected-work strip on homepage |
| Explainer videos (offerings, modules, finance) | `videos/`, unused | Embed relevant ones on automations |
| One-pager PDFs | `one-pagers/`, unused | Resources / lead magnets |
| Storefront renders | `storefront/`, orphaned | Section visuals, social/OG cards |
| Valley Arbor previews | `clients/valley-arbor/`, unused | A real case study |

---

## Verification performed

- Served locally and loaded each page.
- Disabled JavaScript and confirmed every section stays visible (the reveal-up failsafe).
- Confirmed reduced-motion stops animations.
- Validated the sitemap and JSON-LD, confirmed robots.txt references the sitemap.
- Re-grepped visible copy for em dashes (zero) and for the genericised tool references.

## Still needs you

- The exact referral thank-you wording.
- Real testimonial quotes for the cards already built on the automations page.
- Permission and numbers for full written case studies.
- A decision on the Tailwind build step (the one larger performance change).

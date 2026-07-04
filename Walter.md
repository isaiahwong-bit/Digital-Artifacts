# Walter: the Digital Artifacts brain

Walter is the brain of Digital Artifacts (DA): the single source of truth for how DA is built and
how it runs its own sales operation. Start here, then follow the links into `brain/`. Walter is the
map; the brain files are the territory.

DA is a solo Australian studio that builds AI operating systems on a reusable 4-layer framework, and
runs its own sales on that same framework. This document describes the DA-runs-on-DA system, not a
client build.

---

## The 4 layers

| Layer | What it is | Where it lives | Who edits it |
|---|---|---|---|
| 1 Context (the brain) | Everything DA knows: positioning, ICP, offer, pricing, tone, state rules | `brain/*.md` (this repo) | Humans only, via git commit |
| 2 Skills (the how) | Claude prompt recipes for each decision/draft job | `skills/*.md` | Humans, mirrored into workflow nodes |
| 3 Automation (the wiring) | n8n workflows that trigger skills and move state | n8n cloud, exported to `n8n-workflows/*.json` | Humans, in n8n |
| 4 Agent (the surfaces) | Where humans meet the system | Discord (migrating in), Telegram, Gmail, two Google Sheets, the website form | n/a |

**Governing rule: humans write, AI reads.** Layer 1 is only changed by a human through a review
step. The model reads it at runtime (via GitHub raw URLs) but never writes to it. Every outbound
message passes a human (Isaiah) on Telegram before it sends.

---

## The two funnels

Both funnels share one approval gate (Telegram, workflow-c) and write durable state to a Google
Sheet. The full outbound state machine is in `brain/prospect-state.md`.

**Inbound** (website enquiry to nurtured lead):
```
website form -> workflow-a (classify + draft) -> Telegram approve (workflow-c) -> Gmail send
                                              -> Leads sheet
   then: workflow-b nurtures by tier, workflow-e marks 'engaged' on a calendar booking,
         workflow-d handles one-click unsubscribe
```

**Outbound** (sourced prospect to teardown):
```
workflow-j (source: Places + own-website regex + suppress/dedupe + enrich) -> Prospects sheet (queued)
Prospects sheet -> workflow-f (qualify + draft opener) -> Telegram approve (workflow-c) -> Gmail send
   no reply 5+ days -> workflow-g (draft nudge) -> Telegram approve -> send
   reply arrives    -> workflow-h (classify) -> draft teardown / suppress / flag for review
```

---

## Workflow registry

Filenames in `n8n-workflows/`. The authoritative n8n IDs and the `DA -` naming boundary live in
`brain/scope.md` (do not hardcode IDs here, they drift). Active/inactive is per the repo README and
scope notes.

| File | Purpose | Trigger | State |
|---|---|---|---|
| workflow-a-lead-capture | inbound form: classify + draft reply | webhook (form) | LIVE |
| workflow-b-nurture-sequence | tiered nurture drip | cron daily 9am AEST | BUILT, INACTIVE (copy sign-off) |
| workflow-c-telegram-callback | Approve / Edit / Reject handler | Telegram button | LIVE |
| workflow-d-unsubscribe | one-click opt-out (link + RFC 8058 header) | webhook GET + POST | BUILT, INACTIVE (enable with b) |
| workflow-e-engagement-from-calendar | booking -> status engaged | Google Calendar event | BUILT, INACTIVE (needs Calendar OAuth) |
| workflow-f-cold-opener | qualify + draft cold opener | cron weekday 9am AEST | LIVE |
| workflow-g-followup-nudge | draft nudge after 5+ days | cron weekday 9:30am AEST | LIVE |
| workflow-h-reply-handler | classify replies + draft teardown | Gmail reply trigger | LIVE |
| workflow-i-inbox-monitor | triage inbox email, alert Discord | Gmail trigger (DA inbox) | PLANNED |
| workflow-j-prospect-sourcing | source defensibly: Places + own-website regex + suppress/dedupe + enrich | manual (per cohort) | BUILT, needs Places credential |

Note: the repo `.json` files are exports; the live active/inactive state is set on the n8n cloud
instance, not in these files.

---

## Where state lives

- **Inbound Leads sheet** (`LEADS_SHEET_ID` env var in n8n) - written by a, b, c, d, e.
- **Outbound Prospects sheet** (id in `brain/integrations.md`) - written by c, f, g, h.
- **Active deals** (J Bryant, Tesla) currently live as `brain/engagements/*.md`, NOT in the Sheets.
  This is a known seam: the deal pipeline and the prospect pipeline are two separate stores.

Everything else reads from or writes to these. The Sheets are the durable write-path.

---

## Skills index (`skills/`)

| Skill | Job | Reads |
|---|---|---|
| lead-qualifier | classify inbound form -> hot/warm/cool | icp, pricing |
| inbound-reply-draft | draft inbound reply (scaffolds A-G) | company-brief, pricing, tone, response-scaffolds |
| prospect-qualifier | grade a cold target -> strong/plausible/weak/not_fit | outbound-icp, icp, field-service |
| cold-opener-draft | write the cold opener (the salt) | outbound-offer, tone, company-brief, field-service |
| nudge-draft | write the follow-up nudge | outbound-offer, tone, company-brief |
| reply-classifier | route an inbound reply | outbound-offer |
| teardown-writer | write the free one-page teardown (the pretzel) | outbound-offer, company-brief, pricing, tone |
| telegram-brief | render the Telegram approval card | n/a |
| email-triage | triage an inbox email's importance for Discord alerts | icp, company-brief |

When a skill changes, the matching prompt node inside its workflow must be updated too (manual sync).

## Brain index (`brain/`)

[company-brief](brain/company-brief.md) (who we are, non-negotiables),
[icp](brain/icp.md) (inbound targets), [outbound-icp](brain/outbound-icp.md) (who we cold contact),
[outbound-offer](brain/outbound-offer.md) (the salty-pretzel strategy),
[pricing](brain/pricing.md) (tiers + walk-away signals),
[tone-of-voice](brain/tone-of-voice.md) (voice rules, no em dashes),
[integrations](brain/integrations.md) (runtime endpoints + credentials),
[prospect-state](brain/prospect-state.md) (the outbound state machine),
[field-service](brain/field-service.md) (trades positioning + the FSM honesty rule),
[response-scaffolds](brain/response-scaffolds.md) (inbound reply templates),
[scope](brain/scope.md) (the DA- boundary + workflow IDs),
[engagements/jbryant](brain/engagements/jbryant.md) and [tesla](brain/engagements/tesla.md) (active deals).

---

## Integrations and credentials

Authoritative list in `brain/integrations.md`. Summary: Gmail (`hello@digitalartifacts.com.au`),
two Google Sheets, Google Calendar (for workflow-e), Telegram bot `@DA_Adminbot`, Anthropic Claude
(`claude-sonnet-4-6`), GitHub raw (public, for runtime brain fetch). Tokens live only in n8n
credentials, never committed. SMS (ClickSend + Twilio) is NOT yet wired; it is required for the
planned retainer line (see the retainer eval), with an ACMA sender-ID deadline of 1 July 2026.

---

## Deploy model

- **Website** (`index.html`, `automations.html`, `websites.html`, `storefront/`, assets): static,
  hosted on Vercel, **auto-deploys from `main`**. DNS via Cloudflare. `vercel.json` rewrites
  `/unsubscribe` to the n8n webhook.
- **Production is `main`.** Feature work lives on branches (e.g. `feat/sales-ops-automation`) and is
  NOT live until merged to `main`. As of this writing the feature branch is ahead of `main`, so a
  chunk of finished site work is built but not yet deployed. Check `git log main..HEAD` before
  assuming the live site matches the repo.
- **Workflows** run on a shared n8n cloud instance; only `DA -` prefixed items are in scope (see
  `brain/scope.md`). Never touch JARVIS / SGA / CED workflows.

---

## Scope boundary

In scope: this repo, anything in n8n prefixed `DA -`, the two DA Sheets, the DA Telegram bot, and
`hello@digitalartifacts.com.au`. Out of scope: every other workflow and credential on the shared
instance. The brand rule (no em dashes in customer-facing copy) applies to everything that reaches a
customer.

---

## Related documents

- `digital-artifacts-system-review.md` - the State-of-DA review (live vs planned, cohesion,
  improvement roadmap).
- `website-review.md` - the marketing-site audit and fix log.
- `digital-artifacts-automation-retainers-evaluation.md` (in Downloads) - the retainer-line strategy
  evaluation.

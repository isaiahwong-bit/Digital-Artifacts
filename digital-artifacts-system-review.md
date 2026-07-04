# State of Digital Artifacts

A holistic review of the whole operation: how it fits together, what is live versus planned, and
what to improve. The system map is in `Walter.md`; this is the assessment and the roadmap.

## Headline

Digital Artifacts is a genuinely well-designed system. It dogfoods its own 4-layer framework to run
its own sales: a brain of 12 markdown files feeds 8 Claude skills, which feed 8 n8n workflows, which
meet Isaiah through Telegram, Gmail, and two Google Sheets. The design is traceable and disciplined,
and the brand voice rule holds throughout.

Cohesion sits around 65%. The pieces connect, but there is no single map (now addressed by
`Walter.md`), some state does not flow between stores, and a surprising amount of finished work is
not live. The biggest lever is unglamorous: **ship what is already built.** Collateral, a case
study, a nurture flow, and a branch of site improvements are all done and just not deployed.

## How it fits together

See `Walter.md` for the full map. In short: two funnels (inbound a/b/c/d/e and outbound f/g/h)
share one human approval gate (Telegram, workflow-c) and write durable state to two Google Sheets.
Layer 1 (the brain) is fetched at runtime from GitHub, so editing a brain file changes every
downstream output without redeploying anything. That runtime-fetch design is the cleverest part of
the stack.

## Live vs planned

| Component | State | Note |
|---|---|---|
| Inbound capture (a) + approval (c) | LIVE | website form to Telegram to Gmail |
| Outbound opener / nudge / reply (f/g/h) | LIVE | cron-driven, Telegram-gated, ~6 sends/day cap |
| Marketing website | LIVE (old state) | production `main` is behind the feature branch, see the gap below |
| Nurture (b) | BUILT, INACTIVE | blocked only on copy sign-off; high ROI when on |
| Unsubscribe (d), Calendar engagement (e) | BUILT, INACTIVE | d pairs with b; e needs Calendar OAuth |
| Explainer videos (~23), one-pagers (3), storefront renders | BUILT, UNUSED | production-grade, embedded nowhere |
| Valley Arbor | DELIVERED | live build; now being published as a case study this pass |
| J Bryant (A$24.2k) | PROPOSAL SENT | awaiting response, expires 2026-06-25 |
| Lounge Lovers | PROPOSAL SENT | enterprise NetSuite follow-up, awaiting response |
| Tesla Elevators | DRAFTED | cold email written, not yet sent |
| Hermes (nudge-decision agent) | PLANNED | specced in prospect-state/field-service, no code |
| Retainer line (Lead Response etc.) | PLANNED | evaluated and reshaped; SMS unwired; ACMA deadline 1 Jul 2026 |

## The deployment gap (most important "what is live" finding)

Production deploys from `main`. The `feat/sales-ops-automation` branch is about five commits ahead
of `main`, and the latest commits are not even pushed to the remote. So the live site is missing:
the branded HTML outbound emails, the budget-range alignment, and all of this session's work (proof
section, homepage conversion, the new portfolio gallery, founder block, case study, SEO and
accessibility fixes). The fix is a review-and-merge to `main`, gated on resolving the placeholder
testimonials and the referral incentive wording. Until then, finished work sits dark.

## The seams (cohesion gaps)

1. **The deployment gap above.** Built does not equal live.
2. **No master document** tying the system together. Addressed this pass by `Walter.md`.
3. **Two stores that do not merge.** Active deals live in `brain/engagements/*.md`; prospects live
   in the Sheet. There is no one place to see all open opportunities.
4. **Hardcoded IDs.** The Prospects sheet ID and Telegram chat ID are pasted into 5+ workflows
   instead of an n8n env var. A sheet change means editing every workflow.
5. **Manual skill-to-workflow sync.** A skill prompt lives in both `skills/*.md` and the workflow
   JSON node; they can drift.
6. **Unused collateral.** ~23 videos, 3 one-pagers, and the storefront renders convert nobody
   because they are on no page.
7. **Volume cap.** Outbound is ~6 sends/day by design (protects the domain). That is roughly 11x
   short of the throughput the retainer-growth goal would need (see the retainer eval).
8. **Trades honesty rule not automated.** The FSM caveat in `field-service.md` relies on Isaiah
   remembering it during review rather than a qualifier flag.
9. **No reporting layer.** Funnel metrics live raw in the Sheets; there is no at-a-glance dashboard.

## Improvement roadmap

| Move | Effort | Impact | Blocker |
|---|---|---|---|
| Merge the feature branch to `main` (after testimonials + referral wording) | 0.5 day | High: makes finished work live | Those two content items |
| Deploy unused collateral on the site (videos, one-pagers, case study) | 1-2 days | High: conversion, already paid for | None (started this pass) |
| Activate the nurture workflow (b) | 0.5 day | High: free, automated lead nurture | Copy sign-off |
| Publish Valley Arbor as a case study | done this pass | Medium: real, live proof | Outcome numbers from Matt |
| Write the master `Walter.md` | done this pass | Medium: cohesion, onboarding | None |
| Move active deals into the Prospects sheet | 0.5 day | Medium: one pipeline view | None |
| Env-inject the hardcoded sheet/chat IDs | 0.5 day | Medium: maintainability | None |
| Decide the strategic direction (systems vs retainers vs hybrid) | 0.5 day decision | Strategic | None |
| If pursuing retainers: wire SMS + register ACMA sender ID | 3-5 days | Critical for that line | Hard deadline 1 Jul 2026 |
| Reporting layer over the Sheets | 1-2 days | Medium: visibility | None |

## The strategic fork (surfaced, your call)

Two tracks run in parallel today. **Track 1, operating-system builds** (A$4.5k to A$30k), is proven
(J Bryant quoted, Valley Arbor shipped), high margin, sustainable solo, low volume. **Track 2, the
retainer line**, is strategically sound after the reshape but operationally incomplete: SMS is
unwired, the brand firewall does not exist, throughput is 11x short, and onboarding cannot scale
solo past roughly 15 to 20 accounts. The honest recommendation from the retainer eval is a hybrid:
lead with a one-off wedge for acquisition, convert to a value retainer, and decide on productised
onboarding before turning the volume up. No public decision has been made yet; making it explicitly
is itself a high-value move.

## What was done this pass (safe wins)

On the `feat/sales-ops-automation` branch (off production): captured real screenshots of the five
live client sites and rebuilt the homepage "selected work" into a filterable visual gallery; added a
Valley Arbor case study and a founder block; wrote `Walter.md` and this review. Not touched: the live
n8n instance (nurture activation stays a recommendation) and production (the merge is prepped, not
executed).

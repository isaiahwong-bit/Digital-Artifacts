---
name: Lead generation pipeline
status: active
owner: Isaiah Wong
created: 2026-06-29
updated: 2026-06-29
tags: [outbound, sourcing, strategy, compliance]
hub: [outbound-icp, prospect-state, offer-lead-response, field-service]
---

# Lead generation pipeline

How Digital Artifacts fills its outbound pipeline, runs the journey, and pitches, built on n8n and
public data with no paid prospecting subscriptions. This is the committed version of the plan
worked through on 2026-06-29.

## The shape of it (and the honest constraint)

The journey and the pitch already exist and run live: workflow-f (cold opener) to workflow-g
(nudge) to workflow-h (reply handler plus free teardown) to workflow-c (approve and send), all
Claude-drafted and Telegram-gated. The only top-of-funnel step that was manual is **sourcing**.
This work adds the sourcing mouth and hardens the guardrails. It does not rebuild the engine.

DA does not win on volume and does not try to. Cold-email math is unforgiving (around 3% reply, 1%
positive, under 1% of sends become meetings). Chasing ten closes a month would force generic copy,
which burns the domain and breaks the honesty rule. DA's edge is the genuinely good free teardown,
which is human and Claude labour that does not scale to thousands. So the model is a **tight,
cohort-based quality machine**: ~50 real fits at a time, same trade and same area, deeply specific.
Specificity multiplies reply rate two to four times, and that is the only lever that respects the
defensibility rules in [outbound-icp.md](../brain/outbound-icp.md).

## Decisions (2026-06-29)

- **Stay small on the primary domain.** Send cold from hello@digitalartifacts.com.au, capped at
  ~15 to 20 touches a day with tight personalised copy. No separate sending domain, no warmup,
  start now. The cap is the price of using the primary domain and fits the quality posture.
- **First cohort: trades and field services, Melbourne metro.** Leans on
  [field-service.md](../brain/field-service.md); trades publish emails on their own sites, so the
  Places then website then regex path yields best here.

## How sourcing works (workflow-j)

`workflow-j-prospect-sourcing` (n8n), one tight category and one locality per run:

1. Google Places Text Search (New) returns businesses for the cohort. Places returns the website,
   never the email, which is exactly why this path is defensible.
2. Fetch each business's own homepage and extract a published address by regex, preferring a
   same-domain role address. The source URL is recorded as `email_source` for the Spam Act trail.
3. Suppression and de-duplication (the compliance heart): drop any candidate with no published
   address, hard-drop any address that is `unsubscribed`, `suppressed`, `rejected`, or `bounced`,
   drop any address or business already in the sheet, and de-dupe within the run.
4. Claude enrichment ([prospect-enrichment.md](../skills/prospect-enrichment.md)) reads the site
   and reviews and writes an evidenced `likely_pain`. This is the bridge from contactable to a
   `strong`-grade opener. No evidence means an empty pain, never an invented one.
5. Append as `queued`. workflow-f's 9am run qualifies (the qualifier stays the authority on fit),
   drafts the opener, and Telegram-gates it as today.

Reuses the Google Places key already enabled for Valley Arbor (`clients/valley-arbor/.env`).

## Unsubscribe and compliance (set up properly)

Every cold message is defensible under the Spam Act 2003 inferred-consent path: address taken from
the business's own published page, message relevant to the role, sender identified, and a working
unsubscribe. The unsubscribe is now complete on four fronts:

- **Published one-click link** in the footer, wired by `vercel.json` (`/unsubscribe` rewrites to
  the n8n `da-unsubscribe` webhook) to workflow-d, which marks the row `unsubscribed`.
- **Reply to unsubscribe** caught by the reply-classifier and routed to suppression in workflow-h.
- **RFC 8058 one-click header** (`List-Unsubscribe` plus `List-Unsubscribe-Post`) added to the
  outbound send in workflow-c, with a matching POST endpoint added to workflow-d. This gives the
  native Gmail and Apple Mail unsubscribe button and helps inbox placement.
- **Re-contact is actually prevented** because workflow-j treats the prospects sheet as the
  suppression list and blocks any terminal address before it can be queued again. See
  [prospect-state.md](../brain/prospect-state.md).

A terminal opt-out is safe-fail: a link scanner doing a GET could unsubscribe someone who did not
click, which is the harmless direction. Honour any opt-out within five business days (the automated
paths are instant).

## Funnel math: the honest target

At ~15 a day on the primary domain (~300 openers a month, ~200 to 250 net new prospects after
nudges) and a tight-cohort reply rate of 7 to 12%: roughly 15 to 30 replies, about half positive,
8 to 15 teardown conversations, 2 to 4 scoping calls, and **1 to 2 closes a month**. At A$5k to
A$12k setup that is real solo income, not a volume machine. Levers for more, in order: a warmed
dedicated sending domain to lift the cap, more inbound (the journey page and lead magnet exist),
then referral. Generic blasting is not a lever; it destroys the asset.

## Build status

- **Done (repo, this branch):** workflow-j, the prospect-enrichment skill, the one-click
  unsubscribe headers and POST endpoint, the suppression semantics in the brain.
- **Gated (needs Isaiah or n8n):** attach the Places key credential in n8n, import or refresh
  workflows c, d, j on n8n cloud, activate workflow-d, then run a first cohort and spot-check.
- **Later (Phase 2):** nudge that carries a new angle plus one breakup touch, a timeline-hook
  opener, a Cal.com booking link in the teardown, and lifting the daily cap once a sending domain
  is warmed. Then the Walter and Hermes layer per
  [walter-outbound-migration.md](walter-outbound-migration.md).

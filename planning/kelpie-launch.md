---
name: Kelpie launch, 8 July 2026
status: active
owner: Isaiah Wong
created: 2026-07-07
updated: 2026-07-07
tags: [offer, engagement]
---

# Kelpie launch day

Rates v1 signed off 2026-07-07: A$60 quote visit, A$150 job, A$750 cap, A$0 floor, A$1,500
setup (history import included), 5-business-day grace, graduation to flat A$600 after two
months at cap. Offer file is active; collateral is rendered and current.

## What to send, to whom

- **Matt (Valley Arbor), the pilot:** email below + `one-pagers/04-lead-response-meter.pdf` +
  the real fortnight report `clients/valley-arbor/reports/2026-07-lead-report.pdf`. Decide
  before sending whether the $1,500 setup is charged, discounted, or waived for the pilot; the
  email leaves it out so the call stays yours.
- **Fire-safety prospects (batch-2):** do NOT cold-blast the PDF. It slots into the existing
  funnel at the teardown stage: when a batch-2 prospect replies, attach
  `05-kelpie-fire-safety.pdf` with the teardown. The snippet below drops into the teardown
  email. Same logic for refrigeration replies with `06`.
- **Jordan / referral network:** the 04 PDF plus one line: "this is the thing your tradie mates
  keep missing calls about."

## Email to Matt (paste-ready)

Subject: Kelpie: your quiet quotes, chased for you

Hey Matt,

The lead system on your site caught 4 enquiries in the last fortnight, two of them wanting work
this month, all in your inbox within a minute of arriving. The attached one-pager report shows
the fortnight.

I'm adding something to it and you're first in line. It's called Kelpie. It chases the
enquiries you haven't had time to book, proposes times, and puts confirmed quote visits
straight into your calendar. It also remembers cycle work, so pruning customers come back
around when they're due instead of drifting off.

The pricing is built so it's never a gamble: anything that comes through your own site stays
free, always. You only pay when Kelpie locks something in itself: $60 for a quote visit, $150
for a job it books outright. Capped at $750 a month, and if it books nothing, you pay nothing.

Two pages attached: the deal on page one, how it works on page two.

Keen to have you as the first business running it. Got 15 minutes this week?

Cheers,
Isaiah

## Teardown snippet (fire-safety replies)

Attached alongside the teardown: one extra page you did not ask for. Kelpie is the piece of our
stack most fire-protection operators ask about first: it books the six-month rounds on time,
every time, chases new enquiries that go quiet, and you only pay per inspection it locks in.
Your own enquiries stay free, always. Page one is the deal, page two is the machine.

## Launch-day truth check (what exists vs what is promised)

Capture, acknowledgment, forwarding, ledger, and the monthly report run today (Valley Arbor
proves them). The chase, the .ics booking flow, the job-history import, and SMS are the build
queue; a yes tomorrow starts with setup (capture + ledger + report live in week one) while the
chase comes online behind the approval gate. Nothing in the collateral promises a timeline, so
sell honestly and sequence delivery per client.

Still open behind the scenes, unchanged: batch-2 paste, `deploy-monitoring.sh`, the ClickSend
ACMA check before any SMS promise, and the PAT before the repo flips private.

One ask to fold into Matt's onboarding when he says yes: add Isaiah as a manager on the Valley
Arbor Google Business Profile. It unlocks the Business Profile API, which is the only way to
show his genuinely newest 5-star reviews on the site (the Places API ceiling was hit 8 July,
see `clients/valley-arbor/REVIEWS.md`), and Kelpie's review-request loop wants the same access.

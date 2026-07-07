---
name: Lead Response, metered entry offer
status: active
owner: Isaiah Wong
created: 2026-07-05
updated: 2026-07-07
tags: [offer, pricing]
---

# Lead Response, metered entry offer (MVP)

**Client-facing name: Kelpie.** The working dog that rounds up the strays: answers while the
client is on the tools, chases what wanders, never clocks off. Collateral, reports, and every
client-facing message use the name; this file and the workflows keep the internal product name.

The pay-per-output front door to Lead Response. Same system as the flat offer in
`brain/offer-lead-response.md`, different meter on the front. Built for the
first conversation with a sceptical tradie: no retainer to swallow, no bookings means no bill,
and every billed booking is a row they can point at.

Rates v1 signed off 2026-07-07 with the launch decision. This is the live offer; quote it.

## The pitch, in the customer's terms

A receptionist is $4,000 to $6,000 a month fully loaded. A tradie missing a quarter of their
enquiries at $1,000 to $5,000 a job is losing thousands every month without seeing it happen.
This system catches every enquiry the moment it arrives, answers it, and puts it in your hand.
An enquiry that comes through your own website is yours, free, always. The meter runs on one
thing only: when the agent books work into your calendar that was not otherwise happening, a
quote you had gone quiet on, a missed call it converted, a past customer it brought back.

## The billable event (the rule that makes this fair)

**The meter counts what the agent puts in the calendar that was not otherwise happening**, and
it knows the difference between a quote and a job, because a tradie certainly does. One sentence:
"you pay when the agent locks in a quote visit you were losing, or books a job outright."

| What happens | Billed |
|---|---|
| Enquiry arrives through the client's own website, email, or answered phone | never, theirs |
| Client books anything themselves, however the lead arrived | never, their craft |
| Agent chases a stalled, missed, or after-hours enquiry and locks in a confirmed **quote visit** | yes, quote rate |
| Agent secures a **job** outright: a cycle rebook with known scope, or a sent quote accepted through the agent's follow-up thread | yes, job rate |
| A quote visit the agent secured later becomes a job through the client's own close | nothing more, their margin |

Mechanics that keep it clean:

- **Grace window**: the client gets first go at every lead (5 business days default, set
  per client). The agent only chases leads still marked unbooked after the window. The client can
  mark any lead "leave it with me" at any time, which is the per-lead kill switch. The agent is
  the safety net behind their follow-up, never a competitor to it.
- **Booking is a machine event**: billable only when the booking is confirmed through the agent
  thread (customer accepts a time, entry written to the shared calendar). If the client books it
  themselves after an agent nudge, it rides free. Generous, but it deletes every attribution
  argument, and the agent secures most of them anyway because it is the one doing the chasing.
- Free leads still appear on the monthly report, marked $0. The client watches the system
  decline to charge for what was already theirs, which is exactly the opposite of the
  directories.

## The rebook engine (recurring work from their own history)

Trades with natural service cycles (pruning on 12 to 24 months, hedges annually, gutters
seasonally) have revenue sitting in their completed-jobs history. The agent logs every finished
job with service type and date (the post-job review request doubles as the job-log entry, one
flow, two outcomes), and when a cycle comes due it reaches out: "we pruned your oak in July last
year, it will be due again around now." A confirmed rebook is a billable booking like any other.

Scope clarity for the client, stated up front: this is a rebook memory on top of their job
history, not a CRM and not job-management software. The FSM honesty rule holds; we work in the
gap simPRO and ServiceM8 leave open, not on their turf.

## What the MVP includes

1. **Capture**: quote form on their site (or a DA-built landing page) wired to n8n. Missed-call
   SMS capture joins once the ACMA sender-ID position is confirmed; not promised before then.
2. **Instant acknowledgment** to the customer (email now, SMS later) so the enquiry never goes
   cold while the tradie is on the tools.
3. **Forwarding**: the lead lands in the tradie's inbox and phone within a minute, formatted to
   act on.
4. **The chase**: leads still unbooked after the grace window get a follow-up sequence from the
   agent, which proposes times and confirms by **calendar invite (.ics) to both sides**, landing
   in whatever calendar the client already runs (Google, Outlook, phone). No new tool, no
   integration project; a direct Google Calendar write is an optional extra where they use it.
5. **The rebook engine**: completed jobs logged with service type and date (the review request
   doubles as the job-log entry); cycle-due customers get the rebook nudge.
6. **The ledger**: every lead logged with timestamp, source, status, service, suburb, urgency.
   The ledger is the bill and the proof; both sides read the same rows.
7. **The monthly report**: DA-branded, plain language, itemising every lead and what it likely
   represents in job value. Template: `clients/valley-arbor/reports/2026-07-lead-report.html`.
8. **The pitch collateral**: two-page decision-then-machine PDF at
   `one-pagers/04-lead-response-meter.html` (page 1 the offer, page 2 the ledger, chase, and
   rebook engine).

## Pricing mechanics (v1, signed off 2026-07-07)

- **Setup: A$1,500** one-off. Covers capture wiring, the client brain, ledger, acknowledgment,
  forwarding, the report, and the **job-history import**: their last 18 to 24 months of jobs
  (Xero export, FSM CSV, whatever exists) loaded into the log so rebook cycles start firing in
  week one, not year two. Credited in full against a full 4-layer build (A$5k to A$12k) if
  they upgrade within 6 months.
- **Meter, two rates:** **A$60 per quote visit** the agent locks in (a confirmed time in the
  calendar, machine event, no one has to log anything), and **A$150 per job** the agent secures
  outright (cycle rebooks, or quote acceptance that lands through the agent thread). Review
  bands if the market pushes: A$50 to A$75 and A$125 to A$175. At a typical 50 to 70% quote-to-
  job close rate, A$60 a visit is an effective A$85 to A$120 per won job, on jobs worth A$1,000
  to A$5,000. Directories take A$50 to A$150 for a non-exclusive maybe.
- **Cap: A$750 a month.** They never pay more than the cap, whatever the volume. The cap is the
  buyer's safety rail and the graduation trigger.
- **Floor: A$0.** Nothing secured, no bill. This is the line that makes the offer easy to say
  yes to.
- **Every lead's source and status is machine-logged** (form, missed call, after-hours,
  follow-up, rebook), so what is billable is a fact in the ledger, not a judgment call, and the
  report shows the free ones alongside the billed ones.
- **Dispute rule**: flag any billed booking within 7 days and it comes off the bill, no
  argument. The cap bounds DA's exposure; goodwill is worth more than any single meter line.
- **Graduation**: two consecutive months at or near the cap and the offer flips to flat
  A$600 a month, which is cheaper for them and predictable for DA. The flat retainer arrives as
  a discount, not a commitment.
- **Self-diagnosis on the report**, so meter drift is caught, not guessed: the monthly report
  tracks the **suppression rate** (leads flagged "leave it with me" as a share of chaseable
  leads) and the **self-booked count** (chase-caused bookings the client closed directly, shown
  as $0 rows). Two months of high suppression or high self-booking auto-flags the client for
  the flat-retainer conversation: they are getting the value but the meter cannot see it.

## Why these numbers hold

- Valley Arbor's real fortnight (24 Jun to 5 Jul): 4 genuine enquiries through his own quote
  form. Under this rule that fortnight bills **$0**, which is the honest answer and the best
  sales demo the offer has: the report shows the system declining to charge for his own leads.
  His billable surface is what is not built yet: the chase on his two "flexible" leads that
  have not booked, missed-call capture, and the rebook engine over his pruning history.
- HiPages and Bark sell tree-work leads at roughly A$50 to A$150 each, non-exclusive, to
  multiple tradies at once, and they charge for every lead regardless of where it came from.
  Here a passed-through lead is free and A$125 buys a confirmed, exclusive booking, not a maybe.
  That prices comfortably inside the comp with a categorically fairer product.
- Consequence accepted at sign-off: secured quote visits and jobs are a fraction of raw lead
  volume, so the meter runs slower than a per-lead model would. That is the honest trade. The
  rebook engine is what compounds it (every finished job seeds a future billable job, often with
  no quote step at all), and the revenue engine is still the graduation to flat, reached with
  trust intact instead of resentment.

## Boundaries

- One capture surface in the MVP. More surfaces, reactivation, and reputation are the upgrade
  conversation.
- Billing tally, report, and invoice are generated from the ledger, not by hand. If the count
  ever requires manual work, the mechanics have failed; fix the automation, not the invoice.
- The honesty rules in `brain/outbound-offer.md` and
  `brain/field-service.md` apply unchanged: no competing with the FSM tools, no
  clinical or emergency promises, no invented pain.

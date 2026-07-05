---
name: Lead Response, metered entry offer
status: draft
owner: Isaiah Wong
created: 2026-07-05
updated: 2026-07-05
tags: [offer, pricing]
---

# Lead Response, metered entry offer (MVP)

The pay-per-output front door to Lead Response. Same system as the flat offer in
`brain/offer-lead-response.md`, different meter on the front. Built for the
first conversation with a sceptical tradie: no retainer to swallow, no leads means no bill, and
every billed lead is a row they can point at.

Status is draft until Isaiah signs off the numbers. Do not quote from this file until it is
active.

## The pitch, in the customer's terms

A receptionist is $4,000 to $6,000 a month fully loaded. A tradie missing a quarter of their
enquiries at $1,000 to $5,000 a job is losing thousands every month without seeing it happen.
This system catches every enquiry the moment it arrives, answers it, and puts it in your hand.
You pay per lead it catches. Nothing arrives, nothing is billed.

## What the MVP includes

1. **Capture**: quote form on their site (or a DA-built landing page) wired to n8n. Missed-call
   SMS capture joins once the ACMA sender-ID position is confirmed; not promised before then.
2. **Instant acknowledgment** to the customer (email now, SMS later) so the enquiry never goes
   cold while the tradie is on the tools.
3. **Forwarding**: the lead lands in the tradie's inbox and phone within a minute, formatted to
   act on.
4. **The ledger**: every lead logged with timestamp, source, service, suburb, urgency. The ledger
   is the bill and the proof; both sides read the same rows.
5. **The monthly report**: DA-branded, plain language, itemising every lead and what it likely
   represents in job value. Template: `clients/valley-arbor/reports/2026-07-lead-report.html`.

## Pricing mechanics (draft numbers for sign-off)

- **Setup: A$1,500** one-off. Covers capture wiring, the client brain, ledger, acknowledgment,
  forwarding, and the report. Credited in full against a full 4-layer build (A$5k to A$12k) if
  they upgrade within 6 months.
- **Meter: A$50 per qualified lead.** Qualified means real contact details plus service intent,
  machine-logged. Spam, tests, and duplicates are excluded and shown struck through on the
  report, so the exclusions are visible, not silent.
- **Cap: A$750 a month.** They never pay more than the cap, whatever the volume. The cap is the
  buyer's safety rail and the graduation trigger.
- **Floor: A$0.** No leads, no bill. This is the line that makes the offer easy to say yes to.
- **Billed on capture, never on outcome.** A lead is billable when it is captured, acknowledged,
  and forwarded: three machine events. Whether the job closes is the tradie's craft, not the
  meter's business. This kills the "he would have called anyway" dispute at the root.
- **Dispute rule**: flag any lead within 7 days and it comes off the bill, no argument. The cap
  bounds DA's exposure; goodwill is worth more than $50.
- **Graduation**: two consecutive months at or near the cap and the offer flips to flat
  A$600 a month, which is cheaper for them and predictable for DA. The flat retainer arrives as
  a discount, not a commitment.

## Why these numbers hold

- Valley Arbor's real fortnight (24 Jun to 5 Jul): 4 genuine enquiries, 2 marked "this month",
  estimated combined job value A$2k to A$9k. At A$50 a lead that fortnight bills A$200; a full
  month at that rate runs A$400 to A$600, converging on the flat retainer anyway. The meter is a
  palatable on-ramp to the same revenue, not a discount.
- HiPages and Bark sell tree-work leads at roughly A$50 to A$150 each, non-exclusive, to
  multiple tradies at once. These leads are exclusive, from the client's own asset, never
  resold. A$50 is priced under the comp with a better product.

## Boundaries

- One capture surface in the MVP. More surfaces, reactivation, and reputation are the upgrade
  conversation.
- Billing tally, report, and invoice are generated from the ledger, not by hand. If the count
  ever requires manual work, the mechanics have failed; fix the automation, not the invoice.
- The honesty rules in `brain/outbound-offer.md` and
  `brain/field-service.md` apply unchanged: no competing with the FSM tools, no
  clinical or emergency promises, no invented pain.

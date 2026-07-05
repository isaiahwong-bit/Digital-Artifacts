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
And the meter only runs on the ones you would have lost: an enquiry that comes through your own
website is yours, free, always. You pay when the system saves one.

## The billable event (the rule that makes this fair)

A lead is billable only when the system **rescued** it or **created** it. A lead that merely
**passed through** is never billed, because the client's own asset earned it.

| Class | Examples | Billed |
|---|---|---|
| Passed through | website quote form, direct email, someone calling and getting through | never |
| Rescued | missed call caught and converted to an enquiry, after-hours enquiry answered before it went cold, an incomplete enquiry chased to completion | yes |
| Created | reactivation booking from the dormant list, follow-up nudge that revived a quiet quote, review-driven enquiry | yes |

Free leads still appear on the monthly report, marked $0. That line is the trust builder: the
client watches the system decline to charge for what was already theirs, which is exactly the
opposite of the directories.

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
- **Meter: A$75 per rescued or created lead** (A$50 to A$100 is the defensible band; pick one at
  sign-off). Higher than the old draft's A$50 because the counterfactual is a lost job, not a
  free form. Qualified means real contact details plus service intent, machine-logged. Spam,
  tests, duplicates, and all passed-through leads are shown on the report at $0, visible, never
  silently excluded.
- **Cap: A$750 a month.** They never pay more than the cap, whatever the volume. The cap is the
  buyer's safety rail and the graduation trigger.
- **Floor: A$0.** No rescued leads, no bill. This is the line that makes the offer easy to say
  yes to.
- **Billed on rescue or creation, never on outcome, never on pass-through.** The source of every
  lead is machine-logged (form, missed call, after-hours, reactivation, follow-up), so the
  billable class is a fact in the ledger, not a judgment call. Whether the job closes is the
  tradie's craft, not the meter's business.
- **Dispute rule**: flag any lead within 7 days and it comes off the bill, no argument. The cap
  bounds DA's exposure; goodwill is worth more than $50.
- **Graduation**: two consecutive months at or near the cap and the offer flips to flat
  A$600 a month, which is cheaper for them and predictable for DA. The flat retainer arrives as
  a discount, not a commitment.

## Why these numbers hold

- Valley Arbor's real fortnight (24 Jun to 5 Jul): 4 genuine enquiries through his own quote
  form. Under this rule that fortnight bills **$0**, which is the honest answer and the best
  sales demo the offer has: the report shows the system declining to charge for his own leads.
  His billable surface is what is not built yet: missed-call capture, follow-up nudges on quiet
  quotes, review requests after jobs.
- HiPages and Bark sell tree-work leads at roughly A$50 to A$150 each, non-exclusive, to
  multiple tradies at once, and they charge for every lead regardless of where it came from.
  Here a rescued lead is exclusive and a passed-through lead is free. A$75 for a job that would
  otherwise be lost prices comfortably inside the comp with a categorically fairer product.
- Consequence to accept at sign-off: rescued volume is much lower than total volume, so the
  meter runs slower than the old draft implied. That is the honest trade. The revenue engine is
  still the graduation to flat, reached with trust intact instead of resentment.

## Boundaries

- One capture surface in the MVP. More surfaces, reactivation, and reputation are the upgrade
  conversation.
- Billing tally, report, and invoice are generated from the ledger, not by hand. If the count
  ever requires manual work, the mechanics have failed; fix the automation, not the invoice.
- The honesty rules in `brain/outbound-offer.md` and
  `brain/field-service.md` apply unchanged: no competing with the FSM tools, no
  clinical or emergency promises, no invented pain.

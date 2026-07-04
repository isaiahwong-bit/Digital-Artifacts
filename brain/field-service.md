---
name: Field-service offer surface and FSM honesty rule
updated: 2026-05-27
---

For any trades or field-service prospect with a service-contract book, this file is the offer-shape source of truth. It is read by the prospect-qualifier (to grade trades fits), the teardown-writer (to draft trades-shaped sketches), the cold-opener-draft (to name a real pain), and Hermes (to decide whether a trades prospect should get a standard nudge or be escalated for bespoke handling).

# The honesty rule that gates everything

Any trades business large enough to be worth approaching almost certainly already runs a field-service management platform. In the Australian market, the defaults are **simPRO** and **ServiceM8**. Larger operators also use AroFlo, Fergus, or ServiceTitan; smaller ones run Tradify or nothing formal.

Pitching workflow automation that duplicates FSM capability (job scheduling, dispatch, invoicing, basic CRM, route planning) is a credibility-killer because the buyer knows their FSM already does that. Digital Artifacts' opening with this audience is the layer FSM tools do badly or not at all: judgment, language, follow-through, and gluing systems that do not talk.

**Naming the FSM constraint up front is itself the credibility signal.** "I know you have simPRO. Here is what it does not do for you" lands. "Let me show you how AI can transform your operations" does not.

# The five strong workflow surfaces

In rough order of value to the prospect.

## 1. Service-due engine

Service contracts have cadences, often regulatory (annual safety checks, half-yearly inspections, quarterly service visits). Knowing which assets are due, in what window, and turning that into booked visits is recurring admin that eats a coordinator's week.

The workflow reads contract data, builds the due list, drafts the booking message in the company's voice, and chases non-responders. Revenue-critical and recurring, so it compounds. The brain holds the cadence rules, customer voice, and exception handling (who skips, who needs special handling).

## 2. Quote follow-up nurture

Big-ticket considered purchases (residential lift installs, large HVAC retrofits, commercial fitout work) silently die to no follow-up. A nurture workflow keeps every open quote warm with personal, well-timed touches.

This is high-leverage because recovering even two lost deals a year typically pays for the entire engagement. The brain holds prospect-specific context (why they were quoting, what they signaled, what comparable jobs sold for) and produces touches that read individual.

## 3. Compliance and inspection tracking

Managing N assets means N sets of registration dates, inspection dates, certification expiries. The workflow tracks status and alerts before lapse.

**Honesty line that must appear in any teardown on this surface**: it tracks and alerts, it does NOT certify. The inspection stays with the licensed human. The explicit "do not automate this" is the credibility move. Same shape as the entrapment-triage caveat for after-hours work.

## 4. Quote drafting from site notes

A technician finishes a repair visit with rough field notes. Turning those notes into a clean customer-facing quote is admin no FSM does well. A skill takes structured notes and drafts the quote in the company's voice and pricing convention.

This is the Skills layer doing real work — the brain holds the pricing logic, the technician's note style, the customer's typical scope.

## 5. Renewal and review touches

Two cheap workflows that fit naturally alongside any of the above:
- **Renewal nudges**: service contracts lapse silently; flag contracts nearing expiry and draft the renewal conversation.
- **Review collection**: after a clean job, ask the satisfied customer for a Google review. Most trades operators forget to ask; the customers who would have left a 5-star review go ungrasped.

# After-hours triage (the canonical worked example)

For any business that advertises 24/7 service (lifts, plumbing emergency, HVAC commercial, security, electrical), a triage layer in front of the digital channels (web form, email, SMS) sorts incoming after-hours messages into two buckets:

- **Genuine emergencies** (anything life-safety: lift entrapment, gas leak, electrical fault with people present, flooding) route straight through to the on-call human, **untouched**. No automation in the loop. That part stays exactly as it is today.
- **Everything else** gets parked as a clean ticket for the morning, with a brief auto-acknowledgement so the customer is not left wondering.

**The honesty caveats that must appear in any teardown using this angle**:
- Only the **sorting** is automated. The emergency response itself stays human, especially anything life-safety.
- "Cheap" applies to the **digital channels** (web/email/SMS). The actual phone line for emergencies is the high-stakes piece and is **not** part of this. Phone systems are not what this layer does.

Tesla Elevators (teslaelevators.au, Braeside VIC, ~800 service contracts) was the canonical worked example: family-owned lift company, 24/7 service across Melbourne, large enough that after-hours admin is real. The bespoke cold opener for them leads with after-hours triage as the one idea.

# The thread through all of them

One brain. Build the prospect's context once (services, cadences, compliance rules, customer voice, exception patterns) and every workflow above runs off it. This is the four-layer pitch made concrete for this audience: the brain is the asset, the workflows are surfaces.

# Deputy as the workforce-management half of the trades stack

Deputy is the AU/NZ default for workforce management (rostering, timesheets, leave, attendance). Commonly run alongside an FSM (simPRO/ServiceM8) or instead of an FSM in lighter operations. Owned by / related to Employment Hero (formerly KeyPay).

**Deputy does not run payroll itself.** It feeds a payroll engine (Xero Payroll, KeyPay/Employment Hero, MYOB) via export. Same honesty shape as the FSM rule: do not rebuild what the payroll engine already does. PAYG calculation, super, STP lodgement, award interpretation, payslip generation stay with the payroll engine. Digital Artifacts value lives in the orchestration layer.

Strong DA-shaped automation surfaces when a prospect uses Deputy:

- **Pre-approval anomaly detection on timesheets.** Webhook on Deputy's `Timesheets` resource; Claude reads context (normal pattern for that employee, shift schedule, job notes) and flags weird hours to the manager before approval. Deputy alone does not do this.
- **Auto-trigger payroll export on a schedule.** Cron fires the Deputy export to Xero/KeyPay; listen on `TimesheetExport.Begin` and `TimesheetExport.End` webhooks for status.
- **Manager nudges for pending approvals.** Telegram or email push tied to the pay cycle.
- **Post-payroll reconciliation.** Cross-check Deputy hours against the payroll engine's output, flag discrepancies.
- **Cross-system glue.** FSM job time (simPRO/ServiceM8) → Deputy timesheets → payroll engine. Single brain pulling it together.

Key Deputy API surface: `Timesheets`, `TimesheetPayReturn`, `Employee`, `Leave`, `PayRules`, plus the "mark a timesheet as paid" endpoint. Webhooks support insert/update/delete/save triggers on most resources, including `TimesheetExport.Begin/End`, so event-driven automation is feasible without polling. Developer docs at `developer.deputy.com`.

# What this means for the qualifier and teardown-writer

- **prospect-qualifier**: if the prospect is trades/field-service, the `likely_pain` should aim at one of the five surfaces above (or after-hours triage if 24/7 is advertised), not generic "admin overhead." Calling it specifically by name in the qualifier output makes the downstream cold opener better.
- **teardown-writer**: when drafting for a trades prospect, the teardown must (a) name the FSM constraint explicitly, (b) name one specific surface from this file, (c) include the relevant honesty caveat for that surface (does not certify / phone line is high-stakes / etc.).
- **cold-opener-draft**: leads with one specific surface as the "one idea." Never generic.
- **Hermes (nudge decision)**: a trades prospect deep in the funnel without a reply might warrant **escalate** rather than a standard nudge, because the bespoke teardown angle is what earns the conversation in this audience. A generic nudge does not.

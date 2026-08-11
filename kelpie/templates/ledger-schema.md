# Kelpie ledger schema

One Google Sheet per client, one row per lead. The ledger is the proof behind the flat fee:
both sides read the same rows, and the monthly report is generated from it, never by hand.
Column keys are exact; the n8n Normalise Lead node must emit them verbatim (they become the
header row via autoMapInputData).

Note on the billing columns (`billable_event`, `amount`, `billed_month`, `disputed`): Kelpie
sells flat (pivoted 2026-07-09), so these stay dormant. They remain in the schema because they
cost nothing, keep every instance's ledger identical, and back the metered variant if a future
client (one whose funnel DA did not build) ever runs it.

## Columns, in order

| Key | Filled by | Meaning |
|---|---|---|
| lead_id | machine | `KL-` + base36 epoch seconds, unique per client |
| received_at | machine | Melbourne-time timestamp of arrival |
| source | machine | `form` (v1). Phase 2 adds `missed_call`, `after_hours`, `follow_up`, `rebook` |
| name | machine | customer name as submitted |
| phone | machine | customer phone |
| email | machine | customer email (may be blank) |
| suburb | machine | as submitted |
| service | machine | as submitted |
| trees | machine | job-size field where the form has one |
| urgency | machine | as submitted |
| notes | machine | customer's message |
| photos | machine | count only; the bytes travel on the notify email, never the sheet |
| page | machine | page the form was submitted from |
| status | human/agent | see vocabulary below |
| grace_ends | machine | received_at + grace window in business days |
| billable_event | agent | blank, `quote_visit`, or `job` |
| amount | agent | blank, `0`, `60`, or `150`. Own-channel and self-booked rows get an explicit `0` |
| billed_month | agent | `YYYY-MM` the row was invoiced in, blank until then |
| disputed | human | date flagged; a dispute within 7 days removes the row from the bill |
| job_completed_at | human/agent | date work finished (seeds the rebook engine) |
| service_cycle_months | human/agent | rebook cycle, e.g. 12 to 24 for pruning; blank if none |
| last_touch | agent | last time anything happened on this row |

## Status vocabulary

| status | Meaning |
|---|---|
| new | just arrived, inside the grace window, owner's lead to run |
| client_handling | owner is on it (their craft, never billed) |
| leave_it_with_me | the per-lead kill switch; Kelpie never chases this row |
| chase_queued | grace window passed, unbooked, Kelpie may chase (phase 2) |
| quote_visit_booked | Kelpie locked in a confirmed quote visit |
| job_booked | the job itself was secured through Kelpie's thread (rare by design: jobs are the owner's phone call) |
| self_booked | Kelpie's nudge caused it but the owner closed it directly |
| lost | dead lead or test row; excluded from everything |
| complete | work done; set job_completed_at and service_cycle_months |

## What the report reads off these rows

- Volume and speed: leads in the month, and time from `received_at` to first reply.
- Outcomes: `quote_visit_booked` and `job_booked` counts, plus `self_booked` (Kelpie caused
  it even though the owner closed it; still value, say so).
- The reactivation pipeline: rows with `job_completed_at` + `service_cycle_months` are future
  nudges; the report can show how many are seeded and when the next ones fire.
- Estimated job value per lead makes the flat fee's maths land: one saved job covers months.
- The dormant billing columns only come alive if a client is ever on the metered variant.

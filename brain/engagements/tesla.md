---
name: Tesla Elevators
stage: cold_outbound_draft
updated: 2026-05-27
---

Cold outbound, bespoke send (not from the workflow-f batch). Draft prepared 2026-05-26, awaiting Isaiah's hand-scheduled send.

# Who

- **Business**: Tesla Elevators
- **Website**: teslaelevators.au
- **Location**: Braeside VIC
- **Profile**: family-owned lift company, ~800 service contracts, advertises 24/7 service across Melbourne
- **Target address**: sales@teslaelevators.au (no named contact identified)

# Why bespoke (not in the cold-opener batch)

The cold-opener workflow (workflow-f) batches openers around generic pain points. Tesla is the canonical worked example for the after-hours triage angle — that level of specificity earns a hand-crafted email, not a templated one. See [field-service.md](../field-service.md) for the offer surface logic.

# The angle

After-hours triage. The "one idea" food-for-thought opener:

- Tesla advertises 24/7 service across ~800 contracts. That is a lot of after-hours phone time, and most of those calls are not lift entrapments (door sticking, time-of-arrival questions, callback requests on quotes).
- A thin triage layer in front of the digital channels (web form, email, SMS) sorts after-hours messages into two buckets.
- Real emergencies route straight through to the on-call human, untouched. No automation in the loop.
- Everything else gets parked as a clean morning ticket with a brief auto-acknowledgement.

# Honesty caveats that must stay in the email

These are non-negotiable for any version of this pitch.

1. **Only the sorting is automated.** Emergency response stays human, especially anything life-safety (entrapments, gas leak, electrical fault with people present).
2. **The phone line itself is not part of this.** Phone systems are high-stakes and untouched. This is about the digital channels only.
3. **Does not replace simPRO or ServiceM8** (or whatever runs jobs and dispatch). It works in the gap those tools leave open.

# Status

- **Stage**: `cold_outbound_draft`
- **Draft prepared**: 2026-05-26 (in conversation, not yet sent)
- **Send method**: Isaiah hand-pastes into Gmail and uses Gmail's Schedule send (Gmail MCP doesn't expose schedule-send)
- **Recommended send window**: Tuesday morning AEST (avoids Monday inbox triage, lands when ops attention is on)
- **Quote**: none. This is a teardown invitation, no pricing in the cold email.

# If they reply

- Reply classifier (workflow-h) will tag this. Expect either `interested` (give us the sketch) or `question` (clarifying scope).
- The teardown is the canonical after-hours-triage write-up: explicit honest caveats, named tools they probably use, rough effort and savings ranges.
- The paid build, if they engage, would sit in the A$8,000–15,000 range for a single triage workflow (Phase 0 brain + Phase 1 triage layer + light HR/comms surface). A larger phased operating-system shape is possible if they want more than triage.

# Open thread

- The current bespoke send is one shot. If silent after 10 days, the call is whether to hand-nudge once or leave it. workflow-g does not apply because Tesla is not in the prospects sheet with `status=opener_sent`.
- Consider adding Tesla to the prospects sheet after the send so the reply handler (workflow-h) and the unsubscribe endpoint can pick up any response.

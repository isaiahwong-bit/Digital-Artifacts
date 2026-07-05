---
name: SMS plan for Kelpie (the chase channel)
status: draft
owner: Isaiah Wong
created: 2026-07-05
updated: 2026-07-05
tags: [integrations, compliance, offer]
---

# SMS plan: how Kelpie texts

The chase lives or dies on SMS. Tradies' customers answer texts, not emails, and the rebook
engine's "your prune is due" lands far better as a text. This is the plan for doing it properly.

## The core decision: dedicated two-way numbers, not sender IDs

Use a **dedicated virtual mobile number per client**, never an alphanumeric sender ID.

- **Two-way is non-negotiable.** The chase is a conversation ("Tuesday arvo work?"), and
  alphanumeric sender IDs cannot receive replies. A one-way channel kills the product.
- **It sidesteps the register.** The ACMA SMS Sender ID Register (enforcement from 1 Jul 2026)
  governs alphanumeric sender IDs. Real mobile numbers with two-way capability are the standard
  compliant path for conversational SMS. **Verify the current ACMA position before the first
  client send; rules were still settling at the deadline.**
- **The number belongs to the client's presence**, answered in their business name, so replies
  and STOPs stay per-client and portable.

## Provider

**ClickSend first** (already the intended stack from the retainer evaluation), Twilio as
fallback if number provisioning or the inbound webhook disappoints. Both offer AU dedicated
numbers with REST send and inbound webhooks. Budget roughly $15 to $25 a month per number plus
5 to 8 cents per message (verify current pricing); at meter economics that is noise.

## Wiring (n8n)

1. **Send**: HTTP Request node against the provider REST API, one credential per DA, sender set
   to the client's dedicated number. Send window 8am to 7pm local; nothing outside it except
   replies to an active conversation.
2. **Receive**: provider inbound webhook to n8n; the reply is matched to the lead row and
   either advances the thread (time accepted, write the booking) or routes to a human.
3. **STOP handling**: any STOP/unsubscribe keyword marks the row suppressed instantly, mirrored
   to the client's suppression list, same semantics as the outbound sheet. Never re-contact a
   suppressed number.
4. **Identity + trail**: every first-contact message names the business and carries the opt-out.
   Consent basis is logged per row: `enquiry` (they contacted the business) or
   `existing_customer` (rebook cycle). Both are solid Spam Act bases with identify + unsubscribe
   honoured.
5. **Approval gate**: new clients start with every Kelpie message human-approved (the Telegram
   or Discord gate DA already runs on itself), graduating to auto-send per client.

## Rollout order

1. Confirm ACMA register position and ClickSend's current process; buy one AU number for DA.
2. Wire send + receive + STOP end to end on DA's own number, tested against Isaiah's phone.
3. Pilot the chase on Valley Arbor's live leads behind the approval gate.
4. Template the per-client provisioning (number, webhook, brain, ledger columns) so a new
   client's SMS surface is an hour of setup, not a build.

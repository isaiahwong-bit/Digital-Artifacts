---
name: Skills (Layer 2)
type: layer
status: active
owner: Isaiah Wong
colour: "#9B59B6"
created: 2026-06-24
updated: 2026-06-24
tags: [skill]
hub: [company-brief, tone-of-voice]
---

# Skills (Layer 2)

The index spoke for Layer 2. Skills are the "how": one Claude prompt recipe per decision or draft
job in the two funnels. Each `skills/*.md` reads named hub files and returns a defined output, which
a workflow node consumes. This file is the front door to the layer; the per-skill detail lives in
each file, and the authoritative table lives in `Walter.md`.

## Connections (to the hub)

- **Governed by:** [company-brief](../brain/company-brief.md) and [tone-of-voice](../brain/tone-of-voice.md)
  (every draft a skill produces follows the voice rules, including no em dashes). Individual skills
  also read targeting and pricing files; see each skill's `reads:` block.
- **Used by:** Layer 3 workflows (see [automations](../n8n-workflows/automations.md)). Each skill
  maps to a prompt node inside its workflow.

## The skills

Authoritative list with the job and what each reads is the skills index in [Walter](../Walter.md). In short:
`lead-qualifier`, `inbound-reply-draft`, `prospect-qualifier`, `cold-opener-draft`, `nudge-draft`,
`reply-classifier`, `teardown-writer`, `telegram-brief`, `email-triage`.

## The sync rule

When a skill changes, the matching prompt node inside its n8n workflow must be updated too. This is
a manual mirror, not an automatic one. A skill edit is not live until both the file is on `main`
(what any GitHub-raw fetch reads) and the workflow node is updated in n8n.

## Status and next

- **Stage:** 8 skills live and wired into their workflows; `email-triage` is written but waiting on
  its workflow (`DA - Inbox Monitor`, see [inbox monitor](../planning/inbox-monitor-discord.md)).
- **Next:** keep skill files and their workflow nodes in sync on every change.

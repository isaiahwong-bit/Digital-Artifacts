---
name: Automations (Layer 3)
type: layer
status: active
owner: Isaiah Wong
colour: "#0E9AA7"
created: 2026-06-24
updated: 2026-06-24
tags: [integrations]
hub: [scope, integrations]
---

# Automations (Layer 3)

The index spoke for Layer 3. These are the n8n workflows that trigger skills and move state across
the two funnels. The `.json` files here are **exports**: the live workflows run on the shared n8n
cloud instance, and their active/inactive state is set there, not in these files.

## Connections (to the hub)

- **Bounded by:** [scope](../brain/scope.md) is authoritative. Touch only `DA - ` prefixed workflows
  and the known DA workflow ids listed there. Never write to, activate, or delete JARVIS / SGA / CED
  items.
- **Endpoints + credentials:** [integrations](../brain/integrations.md) (Gmail, the two Sheets,
  Telegram, Anthropic, GitHub raw for brain fetch).
- **Runs:** Layer 2 skills (see [skills](../skills/skills.md)).

## The workflows

Authoritative registry (file, purpose, trigger, live state) is the workflow registry in
[Walter](../Walter.md). The authoritative live ids and the `DA - ` naming boundary are in
[scope](../brain/scope.md). The local [README.md](README.md) in this folder covers export/import
mechanics.

Summary: workflow-a (lead capture), b (nurture), c (Telegram callback), d (unsubscribe),
e (engagement from calendar), f (cold opener), g (follow-up nudge), h (reply handler).

## The export caveat

A `.json` here is a snapshot. To change a live workflow you edit it in n8n, then re-export to keep
the repo copy current. The repo copy does not deploy itself; nothing here is live until it is in
n8n. Brain/skill content, by contrast, is read live from GitHub `main`.

## Status and next

- **Stage:** a, c, f, g, h live; b, d, e built but inactive (see `Walter.md` for why).
- **Next:** keep exports current after n8n edits; wire SMS when the retainer line is ready
  (ClickSend + Twilio, ACMA sender-id deadline 1 Jul 2026).

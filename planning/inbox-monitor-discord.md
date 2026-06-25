---
name: Inbox monitor + Discord migration
type: project
status: draft
owner: Isaiah Wong
colour: "#5865F2"
created: 2026-06-24
updated: 2026-06-24
tags: [integrations, state]
hub: [scope, integrations, tone-of-voice]
---

# Inbox monitor + Discord migration

Scoping note for a new DA project: watch the DA inbox and notify Isaiah on Discord, with Discord
becoming the primary DA comms surface over time. Status `draft` until built.

## Why

Isaiah wants to be notified about important email without watching the inbox. Claude Code cannot do
this (it only runs during a session), so the monitor must be a DA workflow running 24/7, not an
agent polling. This is a textbook DA build: a Layer 3 workflow feeding a Layer 4 surface, governed
by Walter.

## Architecture

- **Inbox:** `hello@digitalartifacts.com.au` only (in scope; reuses the existing
  `gmailOAuth2.hello@digitalartifacts` n8n credential). See [scope](../brain/scope.md).
- **Layer 2 skill, `email-triage`:** classifies one inbound email and returns
  `{ importance: urgent | normal | low, category, summary (one line), suggested_action }`. Same
  pattern as the existing [skills](../skills/skills.md) (lead-qualifier, reply-classifier).
- **Layer 3 workflow, `DA - Inbox Monitor`:** Gmail trigger → `email-triage` → route. Urgent goes
  to Discord immediately; normal/low accumulate into one daily digest. Registered in
  [Walter](../Walter.md) and [automations](../n8n-workflows/automations.md) once built.
- **Layer 4 surface, Discord:** a channel in a DA Discord server. Notifications are smart, never one
  ping per email. Voice rules still apply ([tone-of-voice](../brain/tone-of-voice.md)): plain, no em
  dashes, no noise.

## Phases

1. **Notifications (now).** Discord incoming webhook. Workflow posts urgent alerts + a daily digest.
   Low effort, no bot needed.
2. **Migrate the approval gate (later).** Move the approve / edit / reject gate (workflow-c) off
   Telegram onto Discord. This needs a real Discord bot/app (interactions for buttons), not just a
   webhook. After this, Telegram can be retired as a DA surface.

## Committed direction

Full migration to Discord. Telegram is retired as a DA surface once Phase 2 lands; everything (inbox
alerts, approvals, system notices) lives in one Discord server.

## Discord server structure (recommended)

One category, three channels:

- **Digital Artifacts**
  - `#da-inbox` — inbox alerts + daily digest (Phase 1, needs a webhook)
  - `#da-approvals` — the approve / edit / reject gate (Phase 2, needs the bot)
  - `#da-alerts` — workflow errors and system notices

## What is needed from Isaiah

- Phase 1: the Discord server + channels above, and an **incoming webhook URL** for `#da-inbox`
  (channel Settings → Integrations → Webhooks → New Webhook → Copy URL). The URL is a secret: it
  goes in n8n credentials, never committed.
- Phase 2: a Discord application/bot (token) with permission to post interactive messages in
  `#da-approvals`, so the approve / edit / reject buttons work.

## Scope and boundary

DA only. New workflow is named `DA - Inbox Monitor`. Does not touch SGA, JARVIS, or CED. Does not
watch any inbox other than the DA one. Discord is added to [integrations](../brain/integrations.md)
as a surface once Phase 1 ships.

## Workflow build spec (`DA - Inbox Monitor`)

To build in n8n (needs the n8n instance; the Discord pipe and the skill are already done):

1. **Gmail Trigger** on `hello@digitalartifacts.com.au`, poll every 1 to 5 minutes for new mail.
   Credential: the existing `gmailOAuth2.hello@digitalartifacts`.
2. **HTTP Request x2** (or one Code node): GET `brain/icp.md` and `brain/company-brief.md` from the
   GitHub raw URLs (the brain access pattern in `brain/integrations.md`).
3. **Anthropic** node running the `email-triage` prompt (model `claude-sonnet-4-6`, credential
   `anthropicApi.default`), injecting the two brain files and the email fields. Parse the JSON out.
4. **IF** `notify == true` (i.e. `importance == urgent`):
   - **True → Discord (HTTP POST)** to the `#da-inbox` webhook with an embed: title
     `{importance} · {category}`, the summary, and fields for From, Subject, and Suggested action.
   - **False →** write the row to a digest store (a `Digest` Sheet tab) for the daily roll-up.
5. **Daily digest** (a small scheduled branch or sibling workflow, 9am AEST): post the day's
   normal/low items to `#da-inbox` as one message, then clear the store.

MVP order: ship step 1 to 4 (urgent pings) first; add the digest (step 5) as a fast follow.

## The pivot: a scheduled Claude routine instead of n8n

We changed approach. Rather than an n8n workflow, the monitor is a **scheduled Claude cloud
routine** (a step toward Hermes). This makes Claude more of an agent: it reads the inbox via the
Gmail connector, triages with judgement, and posts to Discord, all on a cron, no n8n node graph.

- **Routine:** `DA Inbox Monitor`, id `trig_018tcMQe6FaV547EoH5cpmDM`.
- **Schedule:** every 2 hours, 9am to 5pm AEST daily (cron `0 23,1,3,5,7 * * *` UTC).
- **Access:** Gmail connector (read), Discord via the `#da-inbox` webhook (Bash curl). Self
  contained: no repo clone (GitHub is not connected for cloud runs), triage rules are inline in the
  routine prompt; it fetches `icp` + `company-brief` from the public raw URLs for grounding.
- **Dedup:** applies a `DA-triaged` Gmail label so the same email is not re-notified.
- **The open question this tests:** does a headless cron run keep the Gmail connector auth? If yes,
  no n8n needed. If the test run reports no Gmail access, fall back to the n8n build (spec above).
- **Manage at:** https://claude.ai/code/routines/trig_018tcMQe6FaV547EoH5cpmDM

## Status and next

- **Stage:** Discord webhook live and tested; `email-triage` skill written; cloud routine created
  and a manual test run triggered. Awaiting the test result (does headless Gmail access hold).
- **Next:** read the test run's final report (it states the Gmail-access result). If it worked,
  keep the routine and refine triage calibration (courtesy replies = normal). If not, build the
  n8n version. Either way, add the daily digest for normal/low items.

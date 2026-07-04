---
name: Integrations & endpoints
updated: 2026-06-24
---

Runtime references. The skills + n8n workflows read this to know where to send things.

# Business hours

AEST (UTC+10), Mon-Fri, 08:00-20:00. Used by the lead-capture workflow to branch between "wait for approval" and "send generic acknowledgement now."

# Email

- **Outbound address:** hello@digitalartifacts.com.au
- **Provider:** Google Workspace (Gmail)
- **n8n credential:** Gmail OAuth2 (already configured in existing workflow-a)

# Calls

No self-service booking link is in use. Calls are arranged by reply: the inbound reply drafts and the outbound teardown invite the prospect to reply to set up a short call, and Isaiah books it manually. If a booking link is reinstated later, add it here and point the reply skills back at it.

# Telegram

- **Bot handle:** @DA_Adminbot (live, created via @BotFather)
- **Bot link:** https://t.me/DA_Adminbot
- **Chat ID:** Isaiah's personal chat ID, stored in n8n credential (obtain by messaging @userinfobot)
- **Token:** stored ONLY in n8n credential `tgApi.daAdmin.fresh` (id `WqZONzynV5mpkH1f`). Never commit to repo. If ever exposed, run `/revoke` at @BotFather and update the credential. Historical note: prior credential name was `telegramApi.daAdminbot`; any workflow still referencing the old name needs to be repointed.
- **Callback buttons format:**
  - `approve:{leadId}`
  - `edit:{leadId}`
  - `reject:{leadId}`

# Discord

Becoming the primary DA notification + approval surface, migrating off Telegram. See
`planning/inbox-monitor-discord.md` for the migration plan.

- **Server:** Digital Artifacts (Isaiah's Discord). Channels: `#da-inbox` (inbox alerts + daily
  digest), `#da-approvals` (the approval gate, phase 2), `#da-alerts` (workflow errors).
- **#da-inbox webhook:** an incoming webhook posts alerts into the channel. The URL is a secret,
  stored ONLY in n8n credentials, never committed. If exposed, delete the webhook in the channel's
  Integrations panel and create a new one.
- **Phase 2 bot:** the approve / edit / reject buttons need a Discord application/bot (webhooks
  cannot handle button interactions). Not yet created. The callback format mirrors Telegram's
  (`approve:{id}` / `edit:{id}` / `reject:{id}`).

# Sheets

Two separate Google Sheets are in play. Different schemas, different purposes.

## Inbound leads sheet

- **Purpose:** inbound lead log and nurture-state tracking from the lead-capture workflow
- **Google Sheet ID:** kept in n8n env var `LEADS_SHEET_ID`
- **Tab:** `Leads`
- **Columns:** timestamp, name, email, phone, service, budget, message, icp_class, priority, draft_reply, sent_reply, status, next_action_date

## Outbound prospects sheet

- **Purpose:** outbound cold-outreach state (workflow-f / workflow-g / workflow-h / workflow-c)
- **Google Sheet ID:** `126nIrd5RM9rvvgaAN2eKlNkQktL0BQ4p6dwKkEULKLg` (referenced directly in node configs, not env-injected — env-injection is a future cleanup)
- **Tab:** `Prospects` (gid=0)
- **Columns:**
  - `prospect_id` — primary key, e.g. `OP-001`
  - `business_name`, `contact_name`, `contact_role`, `email`, `email_source`
  - `industry`, `size`, `location`, `notes` — qualifier inputs
  - `fit`, `archetype`, `role_relevant`, `likely_pain` — qualifier outputs
  - `opener_subject`, `opener_body`, `opener_confidence`, `opener_word_count`, `notes_for_isaiah` — drafted opener fields
  - `status` — one of: `queued`, `awaiting_approval`, `opener_sent`, `nudge_sent`, `engaged`, `quoted`, `won`, `lost`, `suppressed`, `dropped`
  - `next_action` — one of: `''`, `nudged`, `awaiting_reply`, `book_call`
  - `last_touch` — ISO timestamp of last outbound send
  - `qualified_at` — ISO timestamp of qualifier run

See `brain/prospect-state.md` for the state machine (which transitions are valid).

# Claude API

- **Model default:** claude-sonnet-4-6 for classification + light drafts
- **Model for long writes:** claude-opus-4-6 only when scaffolds are not enough
- **n8n credential:** `anthropicApi.default`

# Brain access pattern

n8n workflow nodes fetch brain files at runtime via GitHub raw URLs. Repo is public, so no token needed:

```
https://raw.githubusercontent.com/isaiahwong-bit/Digital-Artifacts/main/brain/{filename}.md
```

If the repo ever goes private, swap to a PAT in n8n credential `githubReadonly`.

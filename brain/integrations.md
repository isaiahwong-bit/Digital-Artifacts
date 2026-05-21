---
name: Integrations & endpoints
updated: 2026-04-22
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
- **Token:** stored ONLY in n8n credential `telegramApi.daAdminbot`. Never commit to repo. If ever exposed, run `/revoke` at @BotFather and update the credential.
- **Callback buttons format:**
  - `approve:{leadId}`
  - `edit:{leadId}`
  - `reject:{leadId}`

# Sheet

- **Purpose:** lead log and nurture-state tracking (existing pattern from workflow-a)
- **Google Sheet ID:** (kept in n8n env var `LEADS_SHEET_ID`)
- **Tab:** `Leads`
- **Columns:** timestamp, name, email, phone, service, budget, message, icp_class, priority, draft_reply, sent_reply, status, next_action_date

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

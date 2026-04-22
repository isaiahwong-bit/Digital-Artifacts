# n8n workflows

The live sales-ops layer behind digitalartifacts.com.au. The inbound contact form is itself a demo of the 4-layer framework the site pitches: a prospect submits, Claude classifies + drafts a reply, Isaiah approves on Telegram during business hours or an out-of-hours acknowledgement goes out automatically.

## Workflows

| File | Purpose |
|---|---|
| `workflow-a-lead-capture.json` | Webhook → validate → fetch brain → Claude classify → Claude draft → log → Telegram approval (in-hours) or immediate generic send (out-of-hours) |
| `workflow-b-nurture-sequence.json` | Existing nurture email drip (untouched by this pivot) |
| `workflow-c-telegram-callback.json` | Handles the Approve / Edit / Reject inline-keyboard buttons from workflow-a |

The skills these workflows invoke live in `/skills/*.md`. The context they read lives in `/brain/*.md`. Brain files are fetched at runtime via public GitHub raw URLs, so edits to `/brain` propagate without redeploying the workflow.

## Required credentials

Set these up in n8n (Settings → Credentials) before importing:

1. **`anthropicApi.default`** (HTTP Header Auth)
   - Header name: `x-api-key`
   - Header value: your Anthropic API key
   - Used by: both Claude HTTP Request nodes in workflow-a

2. **`telegramApi.daAdminbot`** (Telegram API)
   - Access Token: generate by messaging @BotFather → /mybots → DA_Adminbot → API Token
   - If the token is ever exposed anywhere outside n8n, run `/revoke` and regenerate
   - Used by: workflow-a (send) and workflow-c (trigger + send + edit)

3. **Gmail OAuth2** (existing, already wired on workflow-a and nurture)
   - Account: hello@digitalartifacts.com.au

4. **Google Sheets OAuth2** (existing)
   - Must have edit access to the leads sheet ID `1XWUc-kCP3mDln2LO_witusIwXy736fYar3k3clkLDZM`

## Environment variables

Set on the n8n cloud instance:

- `TELEGRAM_CHAT_ID`: Isaiah's personal chat ID. Get it by DMing @userinfobot; the number it returns is this value.

## Leads sheet columns

Add or verify these column headers on row 1 of the Leads sheet before the first run (order does not matter, names must match):

```
lead_id, timestamp, name, email, phone, service, budget, message, how_heard,
source, icp_class, priority, industry_archetype, scaffold, draft_subject,
draft_body, confidence, notes_for_isaiah, mode, status
```

Status values the workflow writes:
- `awaiting_approval`: in-hours submission, Telegram brief sent, waiting on button
- `sent_auto_ooh`: out-of-hours Scaffold D acknowledgement already sent
- `sent_approved`: Isaiah tapped Approve; Gmail sent
- `rejected`: Isaiah tapped Reject; no reply sent
- `editing_manual`: Isaiah tapped Edit; reply to be sent manually from Gmail

## Import order

1. Rotate the bot token (`/revoke` at @BotFather) if it was ever shared. Paste the fresh token into the `telegramApi.daAdminbot` credential.
2. Import `workflow-a-lead-capture.json`. In every node with a red credential indicator, pick the credential created above. Save.
3. Import `workflow-c-telegram-callback.json`. Same credential fix-up. Activate.
4. Smoke test: submit the live form at https://digitalartifacts.com.au/#contact with a test payload. Confirm:
   - Sheet row appended with classification + draft populated
   - Telegram message arrives with three inline buttons (if in-hours)
   - Tapping Approve actually sends the Gmail to the test address and updates the sheet row status

## Business hours

AEST, Mon to Fri, 08:00 to 20:00. Hardcoded in the `Parse Classification + Mode` code node of workflow-a. Change there if hours shift.

## Skill-to-workflow mapping

The skill `.md` files are the canonical source of truth for prompts. The Claude HTTP Request bodies in workflow-a embed the same prompt inline for operational reasons (n8n needs the string, not a file reference). If you edit a skill, copy the change into the matching workflow node body:

- `skills/lead-qualifier.md` → `Claude: Lead Qualifier (Skill)` node
- `skills/inbound-reply-draft.md` → `Claude: Inbound Reply Draft (Skill)` node
- `skills/telegram-brief.md` → `Render Telegram Brief (In-Hours)` and `Render Telegram Brief (OOH)` code nodes

## Failure modes + recovery

- **Claude returns unparseable JSON** → both parse nodes fall back to a Scaffold D style fallback draft so a lead never falls through; `notes_for_isaiah` flags it.
- **GitHub raw fetch fails** → `Fetch Brain (Layer 1)` throws, the lead is still in Formspree (which the form posts to in parallel), so nothing is lost.
- **Telegram send fails** → lead is already in the sheet, Isaiah can open the sheet directly and reply manually.

The sheet is the durable write-path. Everything else is read-path on top of it.

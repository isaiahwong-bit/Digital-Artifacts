# n8n workflows

The live sales-ops layer behind digitalartifacts.com.au. The inbound contact form is itself a demo of the 4-layer framework the site pitches: a prospect submits, Claude classifies + drafts a reply, Isaiah approves on Telegram during business hours or an out-of-hours acknowledgement goes out automatically. Everything downstream (nurture, unsubscribe, engagement detection) reads off the same Leads sheet.

## Workflows

| File | Purpose | State |
|---|---|---|
| `workflow-a-lead-capture.json` | Webhook → validate → fetch brain → Claude classify → Claude draft → log → Telegram approval (in-hours) or immediate generic send (out-of-hours) | Active |
| `workflow-b-nurture-sequence.json` | Daily 9am AEST cron. Reads Leads sheet, branches nurture cadence by `icp_class` tier, sends the right email for the lead's current `nurture_stage`, updates the stage. | **Inactive** pending copy sign-off |
| `workflow-c-telegram-callback.json` | Handles the Approve / Edit / Reject inline-keyboard buttons from workflow-a | Active |
| `workflow-d-unsubscribe.json` | GET webhook `/webhook/da-unsubscribe?lead_id=DA-...`. Flips sheet status to `unsubscribed` and returns a small HTML confirmation page. | Inactive, activate after workflow-b sends its first email |
| `workflow-e-engagement-from-calendar.json` | Google Calendar event-created trigger. On a new booking, reads attendee emails, looks them up in the sheet, flips status to `engaged` so nurture drops them, pings Telegram. | Inactive, needs `googleCalendarOAuth2Api` credential before activation |

The skills these workflows invoke live in `/skills/*.md`. The context they read lives in `/brain/*.md`. Brain files are fetched at runtime via public GitHub raw URLs, so edits to `/brain` propagate without redeploying the workflow.

## Required credentials

Set these up in n8n (Settings → Credentials) before importing:

1. **`anthropicApi.default`** (HTTP Header Auth)
   - Header name: `x-api-key`
   - Header value: Anthropic API key from https://console.anthropic.com/settings/keys
   - Used by: both Claude HTTP Request nodes in workflow-a

2. **Telegram API** (`tgApi.daAdmin.fresh` or equivalent)
   - Access Token: generate by messaging @BotFather → `/mybots` → DA_Adminbot → API Token
   - If the token is ever exposed anywhere outside n8n, run `/revoke` and regenerate
   - Used by: workflow-a (sends), workflow-c (trigger + sends + edits), workflow-e (FYI send)

3. **Gmail OAuth2** (`Gmail account`, `bMWObGun24xoeJyN`)
   - Account: hello@digitalartifacts.com.au
   - Used by: workflow-a (auto-send OOH), workflow-b (nurture emails), workflow-c (approved send)

4. **Google Sheets OAuth2** (`Google Sheets account 3`, `xyvnpCe0Is7f0c73`)
   - Authed as hello@digitalartifacts.com.au
   - Must have edit access to the leads sheet ID `1XWUc-kCP3mDln2LO_witusIwXy736fYar3k3clkLDZM`
   - Used by: workflows a, b, c, d, e

5. **Google Calendar OAuth2** (`googleCalendarOAuth2Api`) — NOT YET CREATED
   - Sign in as hello@digitalartifacts.com.au so the trigger sees the appointment-schedule calendar
   - Required before workflow-e can be activated

## Environment / hardcoded values

- Telegram chat ID: `8711637937` (Isaiah's personal chat, hardcoded on every Telegram send node since n8n cloud expressions do not resolve `$credentials.telegramApi.chatId`)
- Leads Google Sheet ID: `1XWUc-kCP3mDln2LO_witusIwXy736fYar3k3clkLDZM`
- Booking link: pulled at runtime from `brain/integrations.md` via the Parse Draft code node in workflow-a

## Leads sheet columns

Row 1 of the Leads sheet. Order does not matter, names must match:

```
lead_id, timestamp, name, email, phone, service, budget, message, how_heard,
source, source_page, source_url, icp_class, priority, industry_archetype,
scaffold, draft_subject, draft_body, confidence, notes_for_isaiah, mode,
status, nurture_stage, last_email_sent
```

Status values the workflows write:
- `awaiting_approval`: in-hours submission, Telegram brief sent, waiting on button
- `sent_auto_ooh`: out-of-hours Scaffold D acknowledgement already sent
- `sent_approved`: Isaiah tapped Approve; Gmail sent
- `rejected`: Isaiah tapped Reject; no reply sent
- `editing_manual`: Isaiah tapped Edit; reply to be sent manually from Gmail
- `engaged`: lead booked on the calendar (workflow-e) or manually flagged; nurture stops
- `unsubscribed`: lead clicked unsubscribe link (workflow-d); nurture stops
- `nurture_complete`: final stage reached in workflow-b; nurture stops

## Nurture cadence (workflow-b)

The drip branches by `icp_class` written by workflow-a's lead-qualifier skill.

| Tier | Day-schedule (days since submission → email) | Notes |
|---|---|---|
| `hot` | 2 → E1, 4 → E2 | Two quick check-ins then stop; Isaiah takes over manually |
| `warm` | 2 → E1, 5 → E2, 9 → E3, 14 → E4, 21 → E5 | Full drip |
| `cool` | 3 → E1, 7 → E2, 14 → E3, 21 → E4, 30 → E5 (unsubscribe ask) | Slower, final email is a soft off-ramp |
| `not_fit` | none | Never enters nurture |

Exclusion statuses (lead skipped entirely): `engaged`, `closed`, `unsubscribed`, `nurture_complete`, `rejected`, `editing_manual`.

Dedupe: a lead is never sent two emails on the same calendar day.

All emails use the `hello@digitalartifacts.com.au` reply-to, include the booking link, and end with an unsubscribe link pointing at workflow-d.

## Unsubscribe (workflow-d)

Every nurture email carries a link like `https://n8nbeginner-sga.app.n8n.cloud/webhook/da-unsubscribe?lead_id=DA-XXX`. Clicking it:
1. Looks up the lead by `lead_id` in the sheet
2. Flips `status` to `unsubscribed`
3. Shows a small HTML confirmation page

Activate workflow-d **before** workflow-b is activated, otherwise the unsub links 404.

## Engagement (workflow-e)

Polls Google Calendar for new events every minute. On a new booking:
1. Extracts attendee emails (excluding organiser)
2. Looks each one up in the sheet by `email` column
3. Flips `status` to `engaged` so workflow-b drops the lead from nurture
4. Pings Telegram with a "booked" FYI

Needs `googleCalendarOAuth2Api` credential. Create in n8n Settings → Credentials → + Google Calendar OAuth2, sign in as hello@digitalartifacts.com.au, then open workflow-e, map the credential to the Calendar node, activate.

## Import order for a fresh n8n instance

1. Rotate the bot token at @BotFather. Paste into Telegram credential.
2. Create Anthropic header-auth credential.
3. Verify Google Sheets OAuth is authed as hello@digitalartifacts.com.au.
4. Import a, c, b, d, e in that order.
5. Activate a + c first, smoke-test an inbound form submission end to end.
6. Activate d.
7. Activate b only after reviewing the 6 email bodies for copy.
8. Create Google Calendar credential; map onto workflow-e; activate.

## Business hours (workflow-a)

AEST, Mon to Fri, 08:00 to 20:00. Hardcoded in the `Parse Classification + Mode` code node of workflow-a. Change there if hours shift.

## Skill-to-workflow mapping

The skill `.md` files are the canonical source of truth for Claude prompts. The Claude HTTP Request bodies in workflow-a embed the same prompt inline for operational reasons (n8n needs the string, not a file reference). If you edit a skill, copy the change into the matching workflow node body:

- `skills/lead-qualifier.md` → `Claude: Lead Qualifier (Skill)` node in workflow-a
- `skills/inbound-reply-draft.md` → `Claude: Inbound Reply Draft (Skill)` node in workflow-a
- `skills/telegram-brief.md` → `Render Telegram Brief (In-Hours)` and `Render Telegram Brief (OOH)` code nodes in workflow-a

Nurture email copy lives inline in workflow-b (static, not Claude-generated) — edit via the node body or the JSON file in this folder, then PUT the workflow back via the n8n API.

## Failure modes + recovery

- **Claude returns unparseable JSON** → both parse nodes in workflow-a fall back to a Scaffold D style default draft so a lead never falls through; `notes_for_isaiah` flags it.
- **GitHub raw fetch fails** → `Fetch Brain (Layer 1)` throws; the lead is still in Formspree (form posts to both in parallel), so nothing is lost.
- **Telegram send fails** → lead is already in the sheet; Isaiah can open the sheet directly and reply manually from Gmail.
- **Sheet update fails silently** → most common cause is the `documentId` or `sheetName` being empty in a node after an API rewrite; always round-trip through the n8n API and re-fetch to verify, or open the node in the UI.

The sheet is the durable write-path. Everything else is read-path on top of it.

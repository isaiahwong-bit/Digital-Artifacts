---
name: Walter outbound migration (Telegram to Discord)
status: draft
owner: Isaiah Wong
created: 2026-06-25
updated: 2026-06-25
tags: [integrations, state]
hub: [scope, integrations, prospect-state]
---

# Walter outbound migration

Goal: move the whole Telegram setup onto Walter/Discord, drafting outreach, the approve / edit /
reject gate, and sending. Today the live engine runs on Telegram (workflows f, g, h, c). Status
`draft`: scope first, do not break the live flow.

## Two hard constraints (these shape everything)

1. **The Gmail connector can draft but NOT send.** It has `create_draft` (including replies via
   `replyToMessageId`) but no send tool. So Walter can compose a reply perfectly and leave it as a
   Gmail draft, but an *automated* send needs either n8n's Gmail send node or a human clicking send.
2. **Discord buttons need a bot, not a webhook.** A webhook can post a message but cannot receive a
   button click. Approve / edit / reject buttons require a Discord application/bot with an
   interactions endpoint (hosted somewhere: n8n, or the planned Hermes VPS).

## Do not break the live engine

Workflows f, g, h, c are LIVE on Telegram and bring in real outreach. Migrate in parallel and cut
over only when Discord is proven. Keep Telegram running until then.

## Architecture options

- **A. Interim, no new infrastructure.** Walter (a cloud routine, like the inbox monitor) drafts
  the reply into a Gmail draft and notifies `#da-approvals` with a link. You open the draft, edit
  if needed, and hit send. Approval is you sending. Works this week, the only manual step is the
  final click.
- **B. Target, the full vision.** Walter drafts and posts to `#da-approvals` with approve / edit /
  reject buttons. On approve, a thin n8n "send" workflow sends the Gmail draft. Full Discord
  approval plus automated send. n8n shrinks from the whole engine to just the sender. Needs a
  Discord bot.
- **C. Pure Walter, retire n8n entirely.** Not possible for sending today (no send tool). Would
  need a custom Gmail-send service, i.e. build it into the Hermes VPS. Future, not now.

## The chosen approach (2026-06-25): Walter sends + yes/no approval, no buttons

Isaiah wants Walter to send (not just draft) and to approve by replying yes/no rather than clicking
buttons. Both are solvable, and yes/no is genuinely lighter than buttons:

### Send tool for Walter

- **Gmail SMTP + app password (chosen direction, fully Walter, no n8n).** Walter sends from
  hello@digitalartifacts through Gmail's own SMTP using an app password, so it is authenticated
  (SPF/DKIM intact). For replies, Walter reads the original message headers first to set the
  threading. One app password from Isaiah.
- Alternative: a thin n8n send-webhook (reuses existing Gmail OAuth, most reliable for replies, but
  keeps a small n8n piece).

### Yes/no approval (no buttons)

The catch: Walter must READ the reply, and the webhook is post-only. Buttons need an always-on
interactions server; a yes/no reply does not. Two ways:

- **Discord bot token + polling (chosen direction).** Create a Discord bot once, give Walter the
  token. Walter posts "Send this? reply yes or no" via the webhook, then reads the reply by calling
  the Discord API (`GET /channels/{id}/messages`) on its schedule. No always-on server, just Walter
  checking when it runs. Tradeoff: acts on Walter's check cadence (make it every 15 to 30 min), not
  instantly. This is lighter than buttons, which is why it works.
- **Email approval (zero new setup).** Walter emails Isaiah "send this? reply yes", reads the reply
  via Gmail, and sends. Works today with nothing new, just less slick than Discord.

## What is needed from Isaiah

- A **Gmail app password** (so Walter can send), and
- A **Discord bot token** (so Walter can read the yes/no in `#da-approvals`), OR choose email
  approval and skip the bot.

## Status and next

- **Stage:** scoped, not built. The offer draft is separate (`brain/offer-lead-response.md`).
- **Next:** Isaiah picks A-now-then-B (recommended) and confirms the send model. Then build the
  Walter outbound-draft routine (A), and scope the Discord bot + n8n sender (B).

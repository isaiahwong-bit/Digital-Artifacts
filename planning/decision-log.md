---
name: Decision log
status: active
owner: Isaiah Wong
created: 2026-06-24
updated: 2026-06-24
tags: [meta, governance]
---

# Decision log

Append-only. One row per material decision: what was decided, the file it lives in, and current
status. This is the project's memory of *why*. Newest at the bottom. Do not rewrite history; if a
decision is reversed, add a new row that supersedes the old one.

Format: `YYYY-MM-DD | decision | linked file | status`

| Date | Decision | Linked file | Status |
|---|---|---|---|
| 2026-06-14 | Reshaped the automation-retainer line into a two-tier offer led by Lead Response; SMS deferred (ClickSend + Twilio, ACMA sender-ID deadline 1 Jul 2026) | `digital-artifacts-automation-retainers-evaluation.md` (Downloads) | active |
| 2026-06-18 | Rebuilt the automation journey concept as a scroll-driven page with 3 deep-linkable product flows and a "what's under the hood" section | `automations.html` | active |
| 2026-06-20 | Migrated Valley Arbor to `valleyarbor.com.au` on Vercel (Squarespace DNS cut over, old URLs 301, registration kept) | `clients/valley-arbor/` | active |
| 2026-06-23 | Replaced `/automations` with the journey experience as the live automation page | `automations.html` | active |
| 2026-06-24 | Added the Claude Code brain governance + sync layer: `CLAUDE.md`, `brain-taxonomy.md`, this log, `/prime` + `/sync` commands, branch-aware SessionStart/SessionEnd hooks | `CLAUDE.md`, `brain-taxonomy.md` | active |
| 2026-06-24 | Adopted a hub-and-spoke brain: global hub (`brain/` + governance) plus one `_brain.md` spoke per project, colour-coded, from a standard template | `brain-taxonomy.md`, `planning/templates/project-brain.md` | active |
| 2026-06-24 | Cleaned repo hygiene: gitignore `.obsidian/` and binary clutter (screenshots, *.mov/*.mp4, *.zip, decks, client PDFs) so the live monorepo stops accreting binaries | `.gitignore` | active |
| 2026-06-24 | Extended spokes to client projects (Valley Arbor, Lounge Lovers) and to layer indexes (`skills/_brain.md`, `n8n-workflows/_brain.md`), each with its own distinct colour | `brain-taxonomy.md` colour registry | superseded |
| 2026-06-24 | Renamed spoke notes from `_brain.md` to project-named folder notes (`valley-arbor.md`, `skills.md`, `automations.md`) so Obsidian labels each node by its project name, not "brain". Linked notes with real relative-path links and turned off graph orphans so the hub-and-spoke actually renders | `brain-taxonomy.md` | active |
| 2026-06-24 | Added a `websites/` portfolio: index capturing the shared build method (hand-coded static, template library, Vercel, SEO suite, Formspree/n8n forms) plus spokes for Cee Ess Designs, Full Circle Solutions, Peninsula Makers Hub. Each site gets its own colour; the `websites/` index node stays slate. Foliole, BaySolar, and templates left listed in the index for now | `websites/websites.md` | active |
| 2026-06-24 | Named the central brain: renamed `SYSTEM.md` to `Walter.md` and updated every reference. Walter is the hub node at the centre of the graph | `Walter.md` | active |
| 2026-06-24 | Scoped an inbox monitor for hello@digitalartifacts.com.au: Layer 3 workflow + new `email-triage` skill, notifying via Discord. committed to full migration to Discord (one server: inbox, approvals, alerts), retiring Telegram once the approval gate is rebuilt on a Discord bot | `planning/inbox-monitor-discord.md` | draft |
| 2026-06-24 | Discord `#da-inbox` webhook created and tested (live), `email-triage` skill written, Discord added to integrations + Walter surfaces. Workflow `DA - Inbox Monitor` specced but not built (n8n not reachable this session) | `skills/email-triage.md`, `brain/integrations.md` | superseded |
| 2026-06-25 | Pivoted the inbox monitor from an n8n workflow to a scheduled Claude cloud routine (`DA Inbox Monitor`, `trig_018tcMQe6FaV547EoH5cpmDM`): every 2h 9am-5pm AEST, Gmail connector + Discord webhook, self-contained. This is the seed of Hermes (Claude as an agent on a cron). Test run triggered; pending headless Gmail-access verification | `planning/inbox-monitor-discord.md` | superseded |
| 2026-06-25 | Test PASSED: the headless scheduled cloud run had Gmail access (created the `DA-triaged` label and triaged the inbox). The cron Claude-agent approach works, no n8n needed for the inbox monitor. Hermes v1 in practice | `trig_018tcMQe6FaV547EoH5cpmDM` | active |
| 2026-06-25 | Ran deep market research (107 agents, 24 sources). Key finding: ownership/no-lock-in is me-too in AU; the wedge is the combination (solo + brain/audit-trail + enablement) against the data-backed learning-gap pain. Lead with outcome, not stack | `planning/decision-log.md` | active |
| 2026-06-25 | Signed off the Lead Response productized offer (outcome-led, A$5-12k setup + optional A$500-2,500/mo no-lock-in support) | `brain/offer-lead-response.md` | active |
| 2026-06-25 | Chose Walter's send + approval model: Gmail SMTP + app password for sending (no n8n), and yes/no text approval read via a Discord bot-token poll (lighter than buttons), or email approval as the zero-setup fallback | `planning/walter-outbound-migration.md` | draft |
| 2026-06-25 | Evaluated Vibe Prospecting (Explorium) for sourcing and decided against it: its emails come from a private database, which `outbound-icp.md` forbids for cold outreach (address must be conspicuously published). It is a directory at best and does not remove the published-email step. Source defensibly in focused batches instead. Prospects sheet currently: 29 queued, 10 awaiting approval, 12 opener_sent | `brain/outbound-icp.md` | active |
| 2026-06-25 | Scoped the Telegram-to-Walter outbound migration. Two constraints: the Gmail connector drafts but cannot send; Discord buttons need a bot not a webhook. Recommended path A-now (Walter drafts to Gmail + Discord, manual send) then B (Discord bot + thin n8n sender), keep Telegram live until proven | `planning/walter-outbound-migration.md` | draft |

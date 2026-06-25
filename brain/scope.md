---
name: Scope and ownership
updated: 2026-05-27
---

The n8n instance, Telegram bot, Anthropic key, and Google Workspace are shared across multiple projects Isaiah runs (Digital Artifacts, JARVIS, SGA, CED). This file names the boundary.

# What is in scope for any DA agent

Anything in this repo (`Digital Artifacts/`). Anything in n8n named with the `DA - ` prefix. The outbound prospects sheet (id `126nIrd5RM9rvvgaAN2eKlNkQktL0BQ4p6dwKkEULKLg`). The inbound leads sheet referenced by `LEADS_SHEET_ID`. The Telegram bot `@DA_Adminbot`. The Gmail `hello@digitalartifacts.com.au`.

# What is out of scope (do not touch)

- **JARVIS workflows** — anything prefixed `JARVIS` in n8n. That is Isaiah's personal/SGA assistant. Different brain, different surfaces, different sheets.
- **SGA workflows** — anything prefixed `SGA ` in n8n (Professional Content Engine, Weekly Audit Report, Error Handler, etc.). Separate business.
- **CED workflows** — anything prefixed `CED - ` in n8n (Lead Sourcing, Outreach Engine, Reply Monitor, Engagement Tracker, Weekly Report). Different project.
- **Lead Triage workflows** — older SGA-era workflows, not DA.
- Any other workflow whose name does not begin with `DA - `.

# What an agent is allowed to do with out-of-scope items

- **Read** is fine for context (e.g., listing workflows to find the right `DA - ` one).
- **Write, update, activate, deactivate, delete, execute** is not. Never PUT, POST, or DELETE on a non-DA workflow. Never modify a non-DA credential. Never read or write to a non-DA sheet.

# What this means in practice

- API key scoping is a future cleanup. Until then, the boundary lives in this file and in agent instructions.
- When listing or filtering n8n workflows, an agent applies the filter `name startswith "DA - "` (or the explicit DA workflow IDs) before any modification.
- When in doubt about whether a workflow is DA, do not touch it. Ask.
- The same rule applies to credentials: only `tgApi.daAdmin.fresh`, `gmailOAuth2.hello@digitalartifacts`, `anthropicApi.default`, and the DA Google Sheets OAuth are in scope.

# Known DA workflow IDs (as of 2026-05-27)

- `pDLdYQXd3dZA2RxR` — DA - Outbound Cold Opener (workflow-f)
- `JUu8SzjH0tbPQmu3` — DA - Outbound Follow-up Nudge (workflow-g)
- `XNLgxavCZUEPIv27` — DA - Outbound Reply Handler (workflow-h)
- `iuBvWGC11ZQed8eZ` — DA - Telegram Callback (Approve / Edit / Reject)
- `3MZjEclDK9MHBqXz` — DA - Lead Capture (4-Layer Sales Ops)
- `HqMPYw6LOcK20mkk` — DA - Engagement (Calendar Book → Status Engaged)
- `iigUKEWaJFN0NOCC` — DA - Nurture Sequence (Daily 9AM AEST)
- `jAtbk9mXYZywpreO` — DA - Unsubscribe (One-Click)

This list is authoritative for the DA scope. If a workflow not on this list claims to be DA, treat as suspicious and ask.

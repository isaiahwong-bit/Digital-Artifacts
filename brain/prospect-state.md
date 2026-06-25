---
name: Outbound prospect state machine
updated: 2026-05-27
---

The state machine for a row in the outbound prospects sheet. This file is the canonical reference for what each `status` and `next_action` value means, which workflow writes it, and what transitions are valid. Hermes reads this to reason about prospect state. Anyone debugging a stuck row reads this too.

# The two state columns

- **`status`** — the prospect's current lifecycle position
- **`next_action`** — a small set of routing flags layered on top of status; mostly used to prevent double-touches

# Status values

In rough lifecycle order.

| Status | Written by | Meaning |
|---|---|---|
| (blank) | Isaiah, manual | Prospect added to sheet, not yet qualified. workflow-f's qualifier picks these up. |
| `awaiting_approval` | workflow-f, workflow-g | A draft (opener or nudge) has been written and a Telegram card is in Isaiah's chat waiting for approve / edit / reject. |
| `opener_sent` | workflow-c (approve_opener) | Opener email has been sent. The prospect is now in the listening window for workflow-h replies and the nudging window for workflow-g. |
| `rejected` | workflow-c (reject_opener) | Isaiah rejected the drafted opener. Nothing sent. Terminal unless manually re-queued. |
| `editing` | workflow-c (edit_opener) | Isaiah hit Edit. The draft has been parked, he is hand-rewriting. No automation will touch this row until he flips it manually. |
| `nudge_sent` | (currently absent — see below) | Conceptually: nudge approved and sent. **Caveat**: today, workflow-g writes `awaiting_approval` on the nudge draft, and workflow-c on approve writes back to `opener_sent` (not `nudge_sent`). The `next_action='nudged'` flag is the only persistent record that a nudge has gone out. |
| `teardown_sent` | workflow-c (approve_teardown) | The free one-page teardown has been emailed to a prospect who engaged. |
| `teardown_drafted` | workflow-h | A reply classified as `interested` arrived, teardown was drafted, in Telegram approval limbo. |
| `teardown_rejected` | workflow-c (reject_teardown) | Teardown draft rejected, not sent. |
| `replied_review` | workflow-h | A reply arrived that the classifier could not confidently route (`unclear`, `question`, `not_now`). Flagged for Isaiah to handle manually. No automation will respond. |
| `suppressed` | workflow-h | Reply classified as `not_interested`. Terminal. Address goes on the suppression list, never contacted again. |
| `unsubscribed` | workflow-h, unsubscribe endpoint | Explicit opt-out (reply with "unsubscribe" or one-click unsubscribe URL). Terminal. |

# `next_action` values

| Value | Set by | Meaning |
|---|---|---|
| (blank) | initial | Nothing special. Open to whatever the next workflow step would naturally do. |
| `nudged` | workflow-g | This row has been nudged once. workflow-g's filter excludes it from re-nudging. The only `next_action` value any workflow actually checks. |

`next_action` is intentionally lightweight. It exists to prevent double-touches that `status` alone cannot prevent (because a prospect can stay in `opener_sent` for weeks while we wait for a reply).

# Valid transitions

```
(blank)
  └─ workflow-f qualifier passes + opener drafted
       ↓
  awaiting_approval (opener)
       ├─ Isaiah taps Approve → opener_sent
       ├─ Isaiah taps Reject  → rejected (terminal)
       └─ Isaiah taps Edit    → editing (manual hold)

opener_sent
  ├─ no reply, last_touch ≥ 5 days, next_action != 'nudged'
  │    → workflow-g drafts nudge
  │      → awaiting_approval (nudge)
  │        ├─ Isaiah Approves → opener_sent (with next_action='nudged')
  │        └─ Isaiah Rejects  → opener_sent  (no nudge sent, but next_action='nudged' still set —
  │                                          a known quirk; will not re-attempt)
  │
  └─ reply arrives → workflow-h classifies
       ├─ interested + has task   → teardown_drafted → (via workflow-c approve) → teardown_sent
       ├─ not_interested           → suppressed   (terminal)
       ├─ unsubscribe              → unsubscribed (terminal)
       ├─ question | not_now | unclear → replied_review  (manual)

teardown_sent
  └─ further reply → workflow-h again, same branches

(terminal): rejected, suppressed, unsubscribed, teardown_rejected
(manual hold): editing, replied_review — no automation will touch these
```

# Known quirks worth knowing

- **Status after a nudge stays `opener_sent`, not `nudge_sent`**. The only signal a nudge has been sent is `next_action='nudged'` + `last_touch` reflecting the nudge send. A future cleanup would introduce a proper `nudge_sent` status and write it on workflow-c approve.
- **Nudge rejection still sets `next_action='nudged'`**, so a rejected nudge does not re-attempt. This is by design (Isaiah's reject is treated as "don't nudge this one") but worth knowing if a row looks oddly silent.
- **`editing` and `editing_manual`** are two values for what is logically the same state (Isaiah is hand-rewriting). Drift between older and newer workflow nodes. Treat as the same.
- **`sent_approved`** appears in workflow-c's `Sheet: Mark Approved` node but writes to the **inbound** leads sheet, not the outbound prospects sheet. Different sheet, different vocabulary. Do not treat as a valid outbound status.

# What Hermes' nudge go/no-go decision sees

For a row to be a candidate at all (before Hermes is consulted):
- `status === 'opener_sent'`
- `next_action !== 'nudged'`
- `last_touch` is ≥ 5 days ago (workflow-g's `NUDGE_AFTER_DAYS = 5`)

Of those candidates, Hermes decides one of:
- `send` — drop the nudge into the Telegram approval queue as workflow-g would today
- `hold` — skip this run, leave the row in `opener_sent` with blank `next_action`; revisit next eligible window
- `escalate` — surface to Isaiah as something that should be handled bespoke rather than auto-nudged

Hermes does **not** write to the sheet directly. It returns a decision; workflow-g acts on it.

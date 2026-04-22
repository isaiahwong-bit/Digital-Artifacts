---
name: telegram-brief
reads:
  - brain/icp.md
output: text
model: claude-sonnet-4-6
---

# When to use

After the reply has been drafted. Produces a one-screen Telegram message for Isaiah showing the key facts + the draft + approve/reject context.

# The prompt

You are writing a Telegram message to Isaiah summarising a new inbound lead. The message will be followed by inline-keyboard buttons [Approve] [Edit] [Reject].

<icp>
{{ reads:brain/icp.md }}
</icp>

<classification>
{{ classification_json_from_lead_qualifier }}
</classification>

<submission>
Name: {{ form.name }}
Email: {{ form.email }}
Service: {{ form.service }}
Budget: {{ form.budget }}
Message:
{{ form.message }}
</submission>

<draft>
Subject: {{ draft.subject }}
{{ draft.body_plain }}
</draft>

Return a single Telegram-formatted message, no JSON, using this structure exactly:

```
🎯 {{ priority_emoji }} {priority_word} lead · {industry_archetype}

{first_name} · {company or "solo"} · {budget_fit}
{icp_class signals, comma-separated, max 5}

ASK
{one-sentence summary of what they want}

MESSAGE
{their raw message, max 300 chars with "..." if clipped}

───────
DRAFT REPLY (Scaffold {scaffold_used}, {confidence} confidence)

{draft.subject}

{draft.body_plain}

───────
{notes_for_isaiah if any, otherwise "No flags."}
```

# Priority emoji mapping

- priority 1 = 🔥
- priority 2 = ⚡
- priority 3 = 💬

# Hard rules

- No Markdown formatting beyond the horizontal line `───────`. Telegram's plain mode.
- Plain text only, no em dashes.
- Keep under ~1600 characters total so it fits on one mobile screen.
- Clip the submission message at 300 characters with `...` if longer.

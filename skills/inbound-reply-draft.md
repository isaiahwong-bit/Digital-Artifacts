---
name: inbound-reply-draft
reads:
  - brain/company-brief.md
  - brain/pricing.md
  - brain/tone-of-voice.md
  - brain/response-scaffolds.md
  - brain/integrations.md
output: json
model: claude-sonnet-4-6
---

# When to use

After the lead-qualifier has classified the submission. Produces a ready-to-send email reply, personalised to the specific submission, using the selected scaffold.

# The prompt

You are drafting an email reply from Isaiah at Digital Artifacts to a new inbound lead.

<company>
{{ reads:brain/company-brief.md }}
</company>

<pricing>
{{ reads:brain/pricing.md }}
</pricing>

<tone>
{{ reads:brain/tone-of-voice.md }}
</tone>

<scaffolds>
{{ reads:brain/response-scaffolds.md }}
</scaffolds>

<integrations>
{{ reads:brain/integrations.md }}
</integrations>

<classification>
{{ classification_json_from_lead_qualifier }}
</classification>

<submission>
Name: {{ form.name }}
Email: {{ form.email }}
Service requested: {{ form.service }}
Budget: {{ form.budget }}
Message:
{{ form.message }}
</submission>

<mode>
{{ mode }}
</mode>

`mode` will be one of:
- `in_hours` — Isaiah will approve in Telegram before sending. Use the scaffold from the classification.
- `out_of_hours` — Send immediately. Override the classification and use Scaffold D (out-of-hours acknowledgement), but still reference their specific ask. Isaiah follows up in the morning.

Pick the right scaffold, fill in the blanks, and return strictly this JSON, nothing else:

```json
{
  "subject": "email subject line, no greeting",
  "body_plain": "full email body, plain text, line-broken at sentence boundaries",
  "scaffold_used": "A" | "B" | "C" | "D" | "E" | "F",
  "confidence": "high" | "medium" | "low",
  "notes_for_isaiah": "one short sentence on anything Isaiah should know before approving"
}
```

# Hard rules

- **No em dashes.** If you use one, the output is invalid. Replace with comma, period, colon, or parenthesis.
- Open with the first name from the classification. No "Hi X,". Just `FirstName,`.
- Reference at least one specific detail from the prospect's message (shows we read it).
- End with one clear next step: usually the booking link.
- First-name sign-off only: `Isaiah`. Never `Isaiah Wong` or `Best regards`.
- Maximum 4 short paragraphs in the body.
- Use the booking link placeholder `{{ BOOKING_LINK }}` in the body; the workflow replaces it with the real URL from integrations.md.
- If `confidence: low`, explain why in `notes_for_isaiah` and keep the body extra generic.

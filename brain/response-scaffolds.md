---
name: Response scaffolds
updated: 2026-04-22
---

Template scaffolds for the `inbound-reply-draft` skill to adapt. Never sent as-is. Claude pulls the right scaffold based on lead classification and fills the blanks with specifics from the prospect's message.

---

# Scaffold A: Hot lead, business hours, clear ask

**Subject:** {Specific reference to their message}

{FirstName},

{One sentence reflecting back the specific thing they asked about, showing we read it.}

{One sentence positioning what we'd build and roughly how long it takes. Reference the relevant layer(s).}

{One sentence on rough scope/pricing range if they mentioned budget. Otherwise skip.}

Quickest way to move this forward is a 15-minute call. My calendar: {BOOKING_LINK}

Isaiah

---

# Scaffold B: Warm lead, business hours, vague ask

**Subject:** Re: your note about {their_topic}

{FirstName},

{Reflect back what they asked; acknowledge it's early-stage.}

Before we jump into specifics, one question: {the single most useful question to tell hot from cool — usually "what's the one job your team does every week that's currently eating the most time?"}

Happy to scope from there. Calendar if you'd rather talk it through: {BOOKING_LINK}

Isaiah

---

# Scaffold C: Cool lead, polite redirect

**Subject:** Re: your enquiry

{FirstName},

{One sentence thanking them for reaching out.}

{One sentence honestly positioning: we're probably not the right fit if the ask is {X}.}

The 4-Layer Blueprint PDF walks through the framework we use; it might be more useful than a call right now: {BLUEPRINT_LINK}

If anything in there changes how you're thinking about it, my door's open.

Isaiah

---

# Scaffold D: Out-of-hours acknowledgement

**Subject:** Got your message

{FirstName},

Just saw this, it's outside business hours here (AEST). Reading it properly in the morning.

{One sentence reflecting what they asked, proving we actually read it.}

If you want to get a slot on my calendar before I get back to you, here: {BOOKING_LINK}

Otherwise talk tomorrow.

Isaiah

---

# Scaffold E: Asked for website only (no automation interest)

**Subject:** Re: website enquiry

{FirstName},

{Reflect their ask.}

Websites are something we do, usually as the Layer 4 surface of a bigger operating system. If you just need the marketing site on its own, that's fine; we do standalone builds too.

Rough range for a standalone site is A$2-6k depending on scope, 14-day turnaround. Can send a proper quote after a 15-min call: {BOOKING_LINK}

Isaiah

---

# Scaffold F: Pricing question only

**Subject:** Re: pricing

{FirstName},

{Acknowledge they asked about pricing specifically.}

The honest answer is it varies a lot by scope. For context:
- Initial 4-layer deploy: typically A$4,500-15,000, one-time, 4-8 weeks
- Monthly retainer after: A$800-2,500, minimum 3 months
- Standalone websites: A$2,000-6,000

Happy to scope properly after a quick call and send back a fixed-price one-pager: {BOOKING_LINK}

Isaiah

---

# Scaffold G: 4-Layer Blueprint download (lead magnet)

Use this when `source` is `lead_magnet`. They did not send a message, they downloaded the Blueprint PDF. Never say "your message was empty" or "not sure what prompted you to reach out." They opted in to learn, that is the signal. Warm by default, no hard sell.

**Subject:** The Blueprint, and the part most people miss

{FirstName},

You just grabbed the 4-Layer Blueprint. Hope the framework is useful on its own.

One thing the PDF cannot do on a page: show you which layer to build first for your specific business. That order matters more than people expect, and it is different for a services firm than a trades operator or a sales team.

If you want, reply with one line about what your business does and the task that is eating the most time right now. I will sketch back which layer to start with, no charge, no pitch. Or if you would rather talk it through: {BOOKING_LINK}

No rush. The Blueprint stands on its own. This is here if you want the next step.

Isaiah

---

# Variables the skill fills

- `{FirstName}` — from form submission
- `{their_topic}` — summarised from their message field
- `{BOOKING_LINK}` — from brain/integrations.md, Google Calendar appointment schedule URL
- `{BLUEPRINT_LINK}` — https://digitalartifacts.com.au/downloads/The%204-Layer%20Blueprint%20_%20Digital%20Artifacts.pdf

All scaffolds respect tone-of-voice.md hard rules. No em dashes. No pleasantries. Open with the specific subject. First-name sign-off only.

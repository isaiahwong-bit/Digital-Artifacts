# Digital Artifacts: Claude Code session entry point

Read this first, every session. It is the house rules and a map to the deeper docs. It is loaded
on every turn, so it stays short. The full system map is `Walter.md`; do not duplicate it here.

## Who you are working with

Isaiah Wong, solo operator of Digital Artifacts (DA), a one-person Australian studio that builds
AI operating systems on a reusable 4-layer framework and runs its own sales on that same
framework. Direct work, no team. AEST / UTC+10.

## Communication rules (apply to everything that reaches a customer, and to your own writing)

- **No em dashes. Ever.** Use commas, periods, colons, or parentheses. This is a brand signal,
  not a preference.
- Direct, warm, peer-to-peer. Never salesy, never corporate, never jargon-heavy.
- Banned words: awesome, amazing, game-changing, unlock, unleash, synergy, leverage (as a verb),
  deliverable, stakeholder. No email pleasantry formulas ("I hope this finds you well").
- Australian spelling (colour, organisation, optimise). One exclamation mark per email maximum.
- Full voice spec: `brain/tone-of-voice.md`.

## The governing rule: humans write, AI reads

Layer 1 (the `brain/`) is changed only by a human through a review step. The model reads it at
runtime (n8n fetches `brain/*.md` live from GitHub `main` via raw URLs) but never writes to it.
Every outbound message passes Isaiah on Telegram before it sends. When you edit the brain, you
are doing the human-write step on Isaiah's behalf: be deliberate, and surface what changed.

## Hard rules

- **DA scope only.** Touch only this repo, n8n items prefixed `DA - `, the two DA Google Sheets,
  the `@DA_Adminbot` Telegram bot, and `hello@digitalartifacts.com.au`. Never write to, activate,
  or delete JARVIS, SGA, or CED workflows on the shared n8n instance. Read for context is fine;
  write is not. Full boundary + workflow IDs: `brain/scope.md`.
- **Keep SGA and DA separate.** Isaiah's employer is SGA (`isaiah@sga.com.au`). Never use the
  sga.com.au address or SGA surfaces for DA or client work.
- **`main` is live.** Vercel auto-deploys the website from `main`, and n8n reads the brain from
  `main`. A push to `main` deploys the site and updates what the live workflows read. Do brain
  work on a feature branch, and only go live deliberately (see `/sync`).
- **Brain is human-write only.** No automated or unreviewed writes to `brain/*.md`.

## Where to look next

- `Walter.md` — the full map: 4 layers, the two funnels, workflow registry, where state lives,
  deploy model, scope boundary.
- `brain-taxonomy.md` — structure: folder map, naming, frontmatter schema, tags, status vocab.
- `planning/decision-log.md` — the append-only record of material decisions and why.
- `brain/` — the territory (positioning, ICP, offer, pricing, tone, state rules, engagements).

## Commands and sync

- `/prime` — load Layer 1 context and report readiness at the start of substantive work.
- `/sync` — stage `brain/` + `skills/` edits, commit, and push the current branch. On `main` it
  confirms first, because the push deploys the site and updates what n8n reads.
- A SessionStart nudge reports uncommitted brain work. On session end, work on a feature branch
  is pushed automatically (safe backup, no deploy); on `main` you are nudged, never auto-deployed.

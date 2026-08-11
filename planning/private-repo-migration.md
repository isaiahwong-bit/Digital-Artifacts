---
name: Private repo migration runbook
status: draft
owner: Isaiah Wong
created: 2026-07-05
updated: 2026-07-05
tags: [governance, integrations]
---

# Private repo migration: flip Digital-Artifacts to private without breaking the 9am run

The repo is public and now holds live pricing strategy (`brain/offer-lead-response-metered.md`,
`brain/pricing.md`), deal records (`brain/engagements/`), and prospect data. Isaiah has called
it: go private.

**The one rule: wire the token first, flip second.** Five live workflows fetch the brain from
GitHub raw on `main` at runtime: **a, f, g, h, j** (grep `raw.githubusercontent` in
`n8n-workflows/*.json`). Flip visibility before those fetches carry a token and the next 9am
run crashes exactly like the field-service 404 did.

## Steps, in order

1. **Isaiah: create a fine-grained PAT** (GitHub, Settings, Developer settings, fine-grained
   tokens): repository access = only `Digital-Artifacts`, permissions = **Contents: read-only**,
   expiry 12 months. Nothing broader. Drop it in the repo `.env` as `GITHUB_BRAIN_PAT` and set a
   calendar reminder for rotation.
2. **Repoint the brain fetches.** In each of the five workflows' brain-fetch Code nodes, the
   fetch gains an Authorization header: `Bearer <PAT>`. Update the repo JSON mirrors and PUT the
   live workflows via the n8n API (same GET-then-PUT pattern as ever; do it with Claude in an
   interactive session so the permission prompts can be approved, or hand-edit the five Code
   nodes in the n8n UI).
3. **Verify while still public**: the raw fetch with the token must return 200 (a tokened
   request against a public repo works, so this proves the header shape before anything is at
   risk). Run one live execution of workflow-f manually and confirm the brain loads.
4. **Flip**: `gh repo edit isaiahwong-bit/Digital-Artifacts --visibility private
   --accept-visibility-change-consequences`.
5. **Verify after the flip**: raw URL without token returns 404; with token returns 200; run
   workflow-f manually once more; confirm the next Vercel deploy still triggers (the Vercel
   GitHub app keeps access to private repos, but eyeball the dashboard on the next push).

## Impact checklist

- **n8n brain fetch**: the whole point of steps 1 to 3. Workflows a, f, g, h, j.
- **Vercel**: GitHub-app integration deploys private repos fine; verify on first push.
- **The live site**: unaffected; Vercel serves it regardless of repo visibility.
- **gh CLI / PRs**: unaffected, authed as the owner.
- **Anything hotlinking raw files** (email signatures, docs): grep before flipping; as of this
  writing the known raw consumers are the five workflows only.
- **Engagement files and pricing** stop being world-readable, which is the goal.

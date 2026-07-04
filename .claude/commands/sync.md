---
description: Commit and push brain + skills edits (the human-write step)
---

Sync the brain. This is the deliberate "humans write, AI reads" step: it commits Layer 1 / Layer 2
edits and pushes them so the rest of the system can see them.

Do this:

1. Run `git status -s` and `git branch --show-current`. Identify changes under `brain/` and
   `skills/`. If there are none, say so and stop.
2. Show the diff summary of the brain/skills changes so the human-write step is visible.
3. Bump the `updated:` date in the frontmatter of any brain/skills file whose body you changed
   this session (today's date), if it was not already bumped.
4. Stage only `brain/`, `skills/`, and the governance docs (`CLAUDE.md`, `brain-taxonomy.md`,
   `planning/decision-log.md`). Do not sweep in unrelated website or asset changes; mention them
   and leave them for a separate commit.
5. Commit with a clear, specific message describing what knowledge changed and why (follow the
   voice rules: no em dashes, plain and direct).
6. Push the current branch.

**Branch awareness, important:**

- On a **feature branch**: push normally. This backs up the work but does NOT go live. n8n reads
  `main`, and Vercel deploys `main`, so the brain change is not live until the branch merges.
- On **`main`**: the push deploys the live website AND updates what the live n8n workflows read.
  Before pushing on `main`, state plainly that this goes live, and confirm with Isaiah first.

7. After a material change, append a row to `planning/decision-log.md` if the edit reflects a real
   decision (not a typo fix).

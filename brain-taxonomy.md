---
name: Brain taxonomy
status: active
owner: Isaiah Wong
created: 2026-06-24
updated: 2026-06-24
tags: [meta, governance]
---

# Brain taxonomy

The single source of truth for how this repo is structured: the folder map, naming, frontmatter,
tags, and status vocabulary. The rule is simple: **if a convention is not in here, it does not
exist.** Read this before adding a new file type or folder.

`Walter.md` is the map of how DA runs. This file is the map of how the files themselves are
organised. Keep the two in sync when structure changes.

---

## The 4 layers, mapped to DA's actual folders

DA keeps a flat layout, not numbered `layer-N/` folders. The layers are conceptual; the folders
are flat on purpose. Do not rename `brain/`: the live n8n workflows fetch `brain/{file}.md` from
GitHub `main` at runtime, so renaming it breaks production.

| Layer | What it is | Folder / surface | Who edits it |
|---|---|---|---|
| 1 Context | Everything DA knows: positioning, ICP, offer, pricing, tone, state rules | `brain/*.md` | Humans only, via git |
| 2 Skills | Claude prompt recipes for each decision/draft job | `skills/*.md` | Humans, mirrored into n8n nodes |
| 3 Automation | n8n workflows that trigger skills and move state | `n8n-workflows/*.json` (exports) | Humans, in n8n |
| 4 Agent | Where humans meet the system | Telegram, Gmail, two Sheets, the website | n/a |

Supporting folders hang off these: `clients/` (per-client builds), `planning/` (decision log and
plans), `brand/`, `video/`, `one-pagers/`, `outbound/`, `storefront/`, `signature/`, `assets/`.

---

## Hub and spoke: the global brain and per-project brains

The brain is not one flat thing. It is a **hub** with **spokes**.

- **The hub (global brain):** the root `brain/*.md` plus the governance docs (`CLAUDE.md`,
  `Walter.md`, this file, `planning/`). It holds what is true for all of DA: who we are, voice,
  pricing, scope, the outbound state machine. Correct a fact here once and every spoke inherits it.
- **The spokes (project brains):** each project carries its own small brain that connects back to
  the hub. A spoke holds what is true for that one project only (its surfaces, its scope, its
  status), and it links up to the hub for the shared rules rather than copying them.

Spokes come in two kinds, distinguished by the `type:` frontmatter field:

- **`type: project`** — a thing with its own surfaces and lifecycle. Each client build under
  `clients/` is a project spoke (e.g. `clients/valley-arbor/valley-arbor.md`).
- **`type: layer`** — an index spoke for one of the framework layers, sitting at that folder's root.
  `skills/skills.md` (Layer 2) and `n8n-workflows/automations.md` (Layer 3) are layer spokes. A layer
  spoke is the front door to its folder and points at the authoritative tables in `Walter.md`
  rather than copying them.

### The spoke note: a folder note named after the project

Every project and every indexed layer gets exactly one spoke note, placed at its folder root and
**named after the project or layer in kebab-case** (e.g. `clients/valley-arbor/valley-arbor.md`,
`skills/skills.md`, `n8n-workflows/automations.md`). This is a folder note: Obsidian uses the
filename as the graph node label, so each spoke reads as its project name, not a generic "brain".
The note is thin on purpose: a front door, not a copy of the working docs. For a project, copy the
template at `planning/templates/project-brain.md` and rename it to the project slug. The standard
sections (the "certain items" every spoke must have):

1. **Overview** — one paragraph.
2. **Connections (to the hub)** — which global brain files govern it (the `hub:` frontmatter), and
   a link to its `brain/engagements/{slug}.md` deal record if one exists.
3. **Surfaces** — the live things it owns: domain, repo/Vercel project, DA n8n workflow ids, sheets.
4. **Scope** — what is in and out for this project (the global `scope.md` still applies on top).
5. **Status and next** — current stage and next action; point to the project's open-items list.
6. **Working docs (index)** — links to the project's own `README.md` and other files.
7. **Decisions** — project-level decisions; material ones also go in `planning/decision-log.md`.

The rule: the hub never documents a single project's specifics, and a spoke never re-documents a
hub rule. One fact, one home.

### Project frontmatter (extends the schema)

Spoke notes add three fields to the base schema:

```yaml
type: project            # project | layer
colour: "#6F7F57"        # this spoke's colour (registry below)
hub: [company-brief, tone-of-voice, pricing, scope]   # global files that govern it
```

### Colour registry

Every project and every layer has its own distinct colour so it reads clearly in Obsidian's graph
and file explorer. Set the `colour:` field in the spoke's frontmatter to match this table, then
mirror it in Obsidian (Graph view, Groups: add a group with the query `path:<folder>` and the same
colour). Obsidian config lives in `.obsidian/` and is gitignored, so this table is the portable
source of truth.

| Spoke | Kind | Path | Colour |
|---|---|---|---|
| Hub (global brain) | hub | `brain/`, root governance | `#378ADD` DA blue |
| Skills | layer | `skills/` | `#9B59B6` purple |
| Automations | layer | `n8n-workflows/` | `#0E9AA7` teal |
| Websites index | layer | `websites/websites.md` | `#64748B` slate |
| Cee Ess Designs | project | `websites/cee-ess-designs.md` | `#D6457E` rose |
| Full Circle Solutions | project | `websites/full-circle-solutions.md` | `#5E60CE` indigo |
| Peninsula Makers Hub | project | `websites/peninsula-makers-hub.md` | `#2E8B57` sea green |
| Valley Arbor | project | `clients/valley-arbor/` | `#6F7F57` sage |
| Lounge Lovers | project | `clients/lounge-lovers/` | `#B5651D` terracotta |
| Outbound | project | `outbound/` | `#BA7517` amber |

Add a row when you stand up a new project, and give it a colour distinct from the others. Colours
are aesthetic; change them freely, just keep the spoke frontmatter and this table in sync.

Note on the `websites/` folder: it is the portfolio of shipped sites (one spoke per client site,
whose source lives in its own Vercel project, not in this repo). It differs from `clients/`, which
holds active builds whose working source is in-repo. A site can appear in both (Valley Arbor);
cross-link, do not duplicate. Each documented site has its own colour; the `websites/websites.md`
index node stays slate as the group anchor. Sites that are only listed in the index (no spoke yet)
have no colour until they get one.

---

## Naming conventions

- Markdown files: kebab-case, `.md` (e.g. `company-brief.md`, `outbound-offer.md`).
- Active deals: `brain/engagements/{slug}.md`, slug is the client short name (e.g. `jbryant.md`).
- Skills: `skills/{job}.md`, named for the job (e.g. `cold-opener-draft.md`).
- Workflow exports: `n8n-workflows/workflow-{letter}-{name}.json`, matching the registry in
  `Walter.md`. The authoritative live IDs live in `brain/scope.md`, not in filenames.
- Slugs, once set, do not change (URLs and runtime fetches depend on them).

---

## Frontmatter schema

Every markdown file under `brain/`, `skills/`, and the governance docs carries a YAML header. The
header is metadata only: it never affects n8n runtime, which reads the markdown body.

**Full schema (use for all new files going forward):**

```yaml
---
name: Human readable title
status: active        # active | draft | archived
owner: Isaiah Wong
created: YYYY-MM-DD
updated: YYYY-MM-DD
tags: [context, pricing]
---
```

- `name` — required. Human-readable title.
- `status` — required. One of the status vocabulary below.
- `owner` — required. Who is responsible. Default `Isaiah Wong`.
- `created` — date the file was first added.
- `updated` — date of the last meaningful edit. Bump it when you change the body.
- `tags` — zero or more from the controlled vocabulary below.

**Existing files** (the 13 `brain/*.md` and 8 `skills/*.md` present before 2026-06-24) keep their
original `name` + `updated` headers. Do not churn them. When you next edit one substantively, you
may upgrade it to the full schema, but it is not required.

---

## Controlled tag vocabulary

Use these tags only. Add a new tag here first, then use it.

- `meta` — about the system itself (this file, taxonomy, governance).
- `governance` — rules, scope, boundaries.
- `context` — Layer 1 knowledge (positioning, brief, who we are).
- `icp` — targeting, inbound or outbound.
- `offer` — the offer, the salty-pretzel strategy, what we sell.
- `pricing` — tiers, walk-away signals, quotes.
- `voice` — tone, brand-voice rules.
- `state` — state machines, status values, transitions.
- `integrations` — runtime endpoints, credentials, surfaces.
- `skill` — a Layer 2 prompt recipe.
- `engagement` — an active deal or client relationship.
- `field-service` — the trades / FSM positioning surface.

## Status vocabulary

- `active` — current, in use, trustworthy.
- `draft` — being written, not yet trustworthy. Do not let runtime read a draft.
- `archived` — kept for history, no longer current. Move out of the live read path.

---

## Cross-link convention

Link related files with **real markdown links using relative paths**, e.g.
`[scope](../../brain/scope.md)`, not a backticked code span. Real links do two jobs: they stay
portable and readable for any markdown reader, and Obsidian draws a graph edge from them, so the
hub-and-spoke structure shows up visually. A backticked path is just text and connects nothing.

- **Spokes link to the hub.** Each spoke note links to the global brain files in its `hub:` list,
  and to [Walter](Walter.md). That is what makes spokes orbit the hub in the graph.
- **Keep runtime files plain.** Do not add links or `[[wikilinks]]` inside `brain/*.md` (n8n fetches
  these raw from GitHub `main`). The links live in the spokes and governance docs that point *at*
  the brain files, not inside the brain files themselves.

One fact, one home: link the canonical file, never copy it.

---

## The one rule again

If a convention is not written here, it does not exist. Before inventing a new folder, file type,
tag, or status, add it to this file first, then use it.

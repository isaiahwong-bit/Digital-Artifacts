---
name: PROJECT NAME
type: project
status: active            # active | draft | archived
owner: Isaiah Wong
colour: "#888780"         # this project's colour (see brain-taxonomy.md registry)
created: YYYY-MM-DD
updated: YYYY-MM-DD
tags: [engagement]        # add field-service, etc. as relevant
hub: [company-brief, tone-of-voice, pricing, scope]   # global brain files that govern this project
---

# PROJECT NAME

The spoke note for this project. Thin on purpose: it carries the standard frontmatter, connects
this project back to the global brain (the hub), and indexes the project's own working docs. It
does not restate them. Copy this file to the root of a new project, rename it to the project slug
(e.g. `valley-arbor.md`), and fill it in. The filename becomes the Obsidian graph label.

## Overview

One paragraph: what this project is, who it is for, and where it stands in one line.

## Connections (to the hub)

- **Governed by:** the global brain files in the `hub:` frontmatter above. Those rules (voice,
  pricing, scope) apply here. Do not re-document them; correct them once in the hub.
- **Sales / relationship:** link to `brain/engagements/{slug}.md` if there is a deal record.
- **Related projects:** link any sibling spokes this one depends on or referred from.

## Surfaces

The live things this project owns. Fill in what exists:
- Domain / URL:
- Repo / deploy (Vercel project):
- n8n workflow(s) (DA-prefixed, with id):
- Sheet / data store:
- Other (email alias, reviews API, etc.):

## Scope

What is in and out for THIS project. The global `brain/scope.md` boundary still applies on top.

## Status and next

- Current stage:
- Next action (owner, date):
- Point to the project's working open-items list rather than duplicating it.

## Working docs (index)

Link the project's own files here so the spoke is the front door:
- `README.md` — build / delivery notes
- (other project docs)

## Decisions

Project-level decisions worth remembering. Material ones also get a row in
`planning/decision-log.md`.

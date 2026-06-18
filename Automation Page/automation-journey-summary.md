# Automation Journey Page — Handoff Summary

A scroll driven, single file prototype for the Digital Artifacts AU automation page. Built as one self contained `automation-journey.html` (no build step, no dependencies beyond two Google Fonts). Drop it into Claude Code and iterate.

## The concept

The page is a custom journey rather than a static page. You look through a fixed window while a camera pans **diagonally** across a flow of connected nodes. Scrolling threads you along the path. Each node snaps into focus with one bold, outcome led statement while the others dim back.

Core rules the build follows:
- The top of the page is the **trigger event**. Everything downstream is deterministic.
- Each scroll reveals the **next node's role** in one large line.
- Copy is led by the **outcome**, never the mechanism. No tools or "how it works."
- Motion reads **diagonal**, not vertical, because nodes zigzag left and right as you descend.
- Few words, large and bold, high intent.

## How it works (technical)

| Piece | Role |
|---|---|
| `.track` (760vh tall) | Gives scroll distance to travel through. |
| `.stage` (sticky, 100vh) | The pinned window you look through. |
| `.world` | A layer holding all nodes, translated by JS to pan the camera. |
| `svg.paths` | The connecting line. Two stacked paths: dim base + bright animated overlay that draws in as you scroll, gradient cool to warm. |
| `.field` | Faint drifting dot grid for a sense of moving through space. Parallaxes at 0.35x camera speed. |
| `.hero` | Opening framing line. Fades out as the journey starts. |
| `.hud` + `.progress` | Top bar with a live FLOW counter and a progress line. |

**Scroll math:** progress `p` (0 to 1) comes from the track's position in the viewport. `f = p * (N-1)` is the position along the node chain. The camera lerps between the two nearest node coordinates and centres that point on screen. Smoothing is applied (`cur += (target-cur)*0.12`) so the pan glides rather than snaps. Everything runs in a single `requestAnimationFrame` loop.

**Node focus:** each node's brightness and scale is driven by `1 - abs(f - i)`, so the closest node to the camera is fully lit and full size, the rest fall back.

## What is easy to change

- **The whole flow** lives in one `NODES` array at the top of the script. Each entry is `{ tag, kicker, title, note, cta? }`. Swap the array to build a completely different journey. This is how you give each product or vertical its own page.
- **Diagonal intensity:** `spreadX` in the `layout()` function. Larger = steeper diagonal. Currently `vw*0.26` on desktop, `vw*0.20` on mobile.
- **Vertical spacing per node:** `spreadY` (currently `vh*0.92`).
- **Pan smoothness:** the `0.12` factor in `frame()`.
- **Scroll length:** `.track` height (760vh). More nodes need more height.

## Design tokens

```
--bg:   #0B0E18   (deep indigo slate canvas)
--ink:  #F3EFE7   (warm off white text)
--muted:#6E768C   (labels, secondary)
--cool: #6C72E8   (signal start, raw lead)
--warm: #F5A623   (signal end, valuable outcome)
--line: #1B2136   (dim path)
```

Type: **Bricolage Grotesque** for display (300 / 500 / 800), **JetBrains Mono** for node tags and HUD. The mono labels are deliberate. They make the tags read like real system node IDs.

The path gradient runs cool to warm on purpose. A raw enquiry enters cool and leaves as warm gold, so value is shown being created across the flow.

## Current copy (lead response demo)

| Stage | Title |
|---|---|
| TRIGGER · 00 | Someone reaches out. |
| NODE 01 · RESPOND | They hear back in seconds. |
| NODE 02 · QUALIFY | The right questions, asked for you. |
| NODE 03 · BOOK | A booking, already made. |
| NODE 04 · HAND OVER | You meet a ready client. |
| OUTCOME | Same result. Every time. |

Hero line: "Imagine a flow that runs the whole journey."

Lead response was chosen because real estate, allied health and clinic prospects grasp it instantly.

## Accessibility and responsiveness

- Respects `prefers-reduced-motion`: sets `spreadX` to 0 so the journey becomes a clean vertical reveal with no camera pan, and kills the drifting field and arrow animations.
- Responsive down to mobile (type clamps, reduced diagonal spread, tighter padding).
- One gap to close in Claude Code: keyboard focus and an SVG title/desc for screen readers. The path animation is decorative, but the copy and CTA should be reachable and announced in source order.

## Next steps

1. Build the **database reactivation** and **reputation engine** flows as their own `NODES` arrays, reusing the same engine.
2. Decide whether each service or vertical entry point loads its own flow, which delivers the "custom to each experience" idea.
3. Tune pacing on this one (scroll length vs node count) before duplicating.
4. Wire the CTA to the real booking or contact action.
5. Add the accessibility pass noted above.

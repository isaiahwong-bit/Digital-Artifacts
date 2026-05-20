---
name: Outbound ICP and targeting rules
updated: 2026-05-19
---

Who we cold-contact, and the rules that keep it defensible. This is read by `prospect-qualifier` before any opener is drafted. Inbound ICP (`icp.md`) still applies for who we want; this file adds who we are allowed to approach cold and how to tell a real fit from a list-filler.

# Who we approach

Same three archetypes as the inbound ICP, no exceptions:

- **Professional services firm** (law, accounting, consultancy, agency), 5-25 fee-earners
- **Trades / field services** (plumbing, electrical, building, HVAC, pest control, commercial cleaning), 3-20 crew
- **B2B sales team** (agency, SaaS, consultancy selling to other businesses), 2-15 sales headcount

Australian businesses only. Owner-operated or owner-led, not enterprise. The kind of business where one person can say yes.

# The contact has to be role-relevant

Inferred consent under the Spam Act only holds if the message is relevant to that person's role. So the contact must plausibly own the pain:

- Services: managing partner, practice manager, operations lead, founder
- Trades: owner-operator, office manager
- Sales: head of sales, founder, RevOps lead

A named role address is always preferred and grades higher. But at a genuinely small, owner-run business (a few staff, no corporate gatekeeper) a published catch-all like `info@` or `admin@` is in practice the owner's own inbox, so it is fair to contact. Treat a published catch-all at a small business as usable. Only treat a catch-all as weak when the business is large enough to have a reception or procurement layer between that inbox and the decision-maker.

# The address must be conspicuously published

Only email an address that the business has published themselves on their own website, a public directory, or a public profile, and that is connected to the role above. If the qualifier cannot point to where the address was published, it is not a defensible send. Never use addresses obtained from a private database, a scrape of someone else's list, or guesswork.

# Disqualifiers (qualifier returns not_fit)

- Outside the three archetypes
- Outside Australia
- Enterprise / corporate (more than ~50 staff, procurement gatekeepers, no owner you can reach)
- A statement on their site that they do not want unsolicited contact
- Already in the leads sheet (any status) so we never double-touch
- On the suppression list (opted out, bounced, or previously said no)
- Healthcare / medical with regulatory complexity, education, government: no context, skip
- Looks like a competitor or an agency that resells what we do

# Fit grading (qualifier returns this)

- **strong**: clear archetype match, named role contact, conspicuous address, an obvious repetitive-ops pain you can name from their public footprint
- **plausible**: archetype match with a usable conspicuous address (a role address, or a catch-all at a genuinely small owner-run business), but the specific pain is inferred not evidenced
- **weak**: a catch-all address at a business large enough to have a reception or procurement gatekeeper, or the pain is too generic to name honestly
- **not_fit**: any disqualifier above

Only `strong` and `plausible` proceed to a drafted opener. `weak` is logged for manual review, never auto-drafted. `not_fit` is logged and dropped.

# The honesty rule

This whole approach lives or dies on the free teardown being genuinely good. That starts here: if a business is not actually a fit, the qualifier says so plainly rather than stretching to keep the list full. A smaller list of real fits beats a big list of forced ones, because every weak send burns the sending domain and the brand.

# Kelpie setup kit

You are a Claude Code session inside a client project. This kit is self-contained: everything
you need to stand up Kelpie v1 for this client is in this folder. Read this file fully, then
fill or confirm `CLIENT.md`, then work the setup steps in order. Do not improvise around the
house rules; they are contractual and brand-level, not preferences.

Kit master lives in the Digital Artifacts repo at `kelpie/`. If you improve anything here,
tell Isaiah so the change flows back to the master; do not let instances drift silently.

---

## What Kelpie is

Kelpie is Digital Artifacts' lead-response agent for trades, sold as **"the receptionist that
never clocks off"** on a flat monthly rate. It catches every enquiry the moment it arrives,
replies within about a minute, forwards it to the owner's phone and inbox, logs it in a ledger
both sides can read, and (phase 2) auto-books quote visits into the owner's calendar and runs
a reactivation timer over their finished jobs. Two boundaries define it: Kelpie never books
the JOB itself (that stays the owner's phone call, their craft), and it is never the system of
record (it works in the gap ServiceM8 and simPRO leave open, not on their turf).

**v1 scope (what you are setting up now):**
1. Capture: the client site's quote form forwards every lead to a Kelpie webhook.
2. Ledger: one Google Sheet per client, one row per lead, the schema in
   `templates/ledger-schema.md`. The ledger is the bill and the proof.
3. Forwarding: a formatted email to the owner within a minute of the enquiry.
4. Monthly report: rendered from the ledger with `templates/report-template.html`.

**Phase 2 (do NOT build or promise unless Isaiah explicitly says so):**
the chase sequence, calendar auto-booking of quote visits, the job-history (backlog) import,
the reactivation timer, and SMS. SMS in particular is hard-gated: no SMS promise to anyone
until Isaiah confirms the ClickSend/ACMA sender-ID position. Nothing in v1 promises a delivery
timeline for phase 2.

## The deal (flat model, pivoted 2026-07-09; confirm numbers with Isaiah before quoting)

Kelpie is flat-rate, no meter. An earlier pay-per-booking model was stress-tested and
reversed: when DA builds the client's funnel, almost every lead arrives through their own
site, and a meter that exempts own-site leads measures an empty set. Flat is simpler to say
and fairer both ways. Rates are Isaiah's call on every deal; these are the reference points:

| Term | Value |
|---|---|
| Rack rate (client two onward) | A$350 per month, no lock-in |
| Setup | A$1,500 one-off, includes the backlog (job-history) import |
| Pilot foundation rate | A$300 per month (Valley Arbor only, setup waived) |
| Seasonal "muster" reactivation run | A$300 paid add-on |
| Enterprise bespoke | from A$5,000 per month |

The four pillars the client is buying: instant reply (about 60 seconds, straight to logistics
because their form already qualifies the lead), auto-booked quote visits into a mapped Google
Calendar (standing windows the owner sets; the invite is a heads-up and one tap bumps it),
a compounding reactivation timer (every finished job seeds a "you're due back" nudge), and
the monthly report that proves all of it.

## House rules (non-negotiable)

- **No em dashes. Ever.** Not in emails, not in reports, not in code comments, not in commit
  messages. Use commas, colons, periods, or parentheses. This is a Digital Artifacts brand
  signal and the fastest way to fail a review.
- Australian spelling (organise, colour, optimise). Direct, warm, peer-to-peer voice. Banned
  words: awesome, amazing, game-changing, unlock, unleash, synergy, leverage (as a verb),
  deliverable, stakeholder. No "I hope this finds you well". One exclamation mark per email max.
- **Every customer-facing outbound message passes Isaiah before it sends.** You prepare, he
  approves. No exceptions in v1.
- **n8n:** DA runs its own n8n Cloud instance, `digitalartifacts.app.n8n.cloud` (the hello@
  account). All Kelpie workflows go there, named `DA - {Client} ...`, and Isaiah files each
  into the client's folder in the UI afterwards (folder assignment is UI-only on this
  instance; the API cannot move workflows into folders, do not fight it). Do NOT use the old
  shared instance (`n8nbeginner-sga.app.n8n.cloud`); it is SGA's box and DA work has migrated
  off it. The API key lives in this client project's gitignored env file as `N8N_API_KEY`
  (Isaiah puts it there); if it is missing, ask him rather than hunting for it. Never commit
  it, never echo it into logs or docs.
- **Secrets** go in the client project's gitignored env file, never in committed code, never in
  this kit. Client PII never goes into a public repo: ledger data lives in the Google Sheet,
  not in git.
- Claude Code auto-mode may block n8n writes and production deploys. That is expected, not an
  error to work around: prepare the artifact and hand Isaiah the exact command or click. Never
  retry a blocked mutation through another tool.

## Architecture

```
customer submits quote form on client site
        |
site API route (existing email/notify path stays exactly as is)
        |--> existing notification to the owner (unchanged)
        `--> fire-and-forget POST to the Kelpie webhook   (templates/quote-forward.example.ts)
                    |
        n8n: DA - {Client} Kelpie Lead Log                (templates/n8n-lead-log.template.json)
          Webhook -> Normalise Lead -> Append Ledger Row -> Notify owner email
                    |
        Google Sheet "{Client} - Kelpie Ledger"           (templates/ledger-schema.md)
                    |
        monthly: report rendered from the ledger          (templates/report-template.html)
```

The webhook forward is additive. The client's existing form UX and notification email must
keep working even if Kelpie's webhook is down; that is why the forward is fire-and-forget with
a short timeout.

## Setup steps

Work these in order. Each step ends with a verification; do not move on without it.

**0. Fill `CLIENT.md`.** Every placeholder used below comes from there. If a value is unknown,
ask Isaiah rather than guessing.

**1. Wire the forward.** Find the site's quote form handler (CLIENT.md names the file). After
the existing notify succeeds (or logs), call the forward from
`templates/quote-forward.example.ts`, adapted to the project's language and style. Payload
contract (flat JSON, all strings unless noted):

```
{ source: "form", name, phone, email, suburb, service, trees, urgency,
  notes, photoCount (number), page }
```

Do not send photo bytes to the webhook; the existing email path carries attachments. Add
`KELPIE_WEBHOOK_URL` to the project's env file and hosting env vars, but leave it EMPTY until
step 4 gives you the live URL (the forward skips silently when unset, so this is safe to ship).
Verify: form still submits cleanly with the var unset.

**2. Prepare the workflow.** Copy `templates/n8n-lead-log.template.json`, replace every
`__PLACEHOLDER__` (they are listed at the top of the file) from CLIENT.md. The workflow name
must be `DA - {Client name} Kelpie Lead Log`.

**3. Import to n8n.** Create via API (or hand Isaiah the command if auto-mode blocks it):

```
curl -X POST "$N8N_API_URL/workflows" \
  -H "X-N8N-API-KEY: $N8N_API_KEY" -H "Content-Type: application/json" \
  -d @workflow.json
```

The API accepts ONLY `{name, nodes, connections, settings}` on create/update; strip anything
else or it 400s. Keep `settings` to `{"executionOrder":"v1","timezone":"Australia/Sydney"}`.

**4. Run the setup branch, once.** In the n8n UI (Isaiah does this if you cannot): execute the
`Setup (run once)` manual trigger. It creates the ledger spreadsheet and writes the header row.
Read the new `spreadsheetId` from the execution output, paste it into the `Append Ledger Row`
node (replacing `PASTE_SHEET_ID_AFTER_SETUP`), then activate the workflow:

```
curl -X POST "$N8N_API_URL/workflows/{id}/activate" -H "X-N8N-API-KEY: $N8N_API_KEY"
```

Now set `KELPIE_WEBHOOK_URL=https://digitalartifacts.app.n8n.cloud/webhook/kelpie-{slug}-lead`
in the site's hosting env and redeploy (Isaiah approves production deploys).

**5. Test end-to-end.** Submit the live form with an obvious test marker (name "KELPIE TEST",
notes "ignore, setup test"). Verify all three: the existing owner notification still arrives,
a correctly-filled row appears in the ledger, and the Kelpie notify email renders properly.
n8n reporting `success` proves the send, not the render: open the email and look at it. If any
expression shows raw code like `$json.body.name`, the field is missing its `{{ }}` wrapper
(see gotchas below). Mark the test row `status=lost` in the ledger so it never counts.

**6. Share the ledger.** The sheet is owned by hello@digitalartifacts.com.au. Share it with
the client read-only (transparency is a feature, not a risk). Isaiah sends the share.

**7. Log completion.** Report back what was created (workflow id, webhook path, sheet id,
env vars touched) so Isaiah can record it in the DA repo. Do not record any of it in a public
readme in the client repo.

## n8n crib (learned the hard way, do not rediscover)

- Expressions in node fields need `={{ ... }}` template syntax. A bare `="a" + $json.b` string
  prints literally in the sent email.
- Google Sheets append: `mappingMode: autoMapInputData` matches incoming JSON keys to the
  header row by name. The Normalise Lead code node must emit keys exactly matching
  `templates/ledger-schema.md`, and nothing else (no nested objects).
- Credentials on the DA instance, referenced by id in the template: Google Sheets
  `sPyc8afgZX7ggtDo` and Gmail `iFH9WnGm7MgLdiI3`, both the hello@digitalartifacts.com.au
  Google account (authed 2026-07-08).
- Webhook paths must be unique across the whole instance; the `kelpie-{slug}-lead` convention
  guarantees that.
- Workflow activation is a separate POST to `/workflows/{id}/activate`; saving does not
  activate, and the UI toggle is the fallback.
- n8n execution retention is short. The ledger is the record; never rely on n8n history for
  lead data.

### API quick reference

There is no n8n CLI for cloud; curl against the REST API is the tool. Base URL and key come
from the project env file (`N8N_API_URL`, `N8N_API_KEY`); every call sends the header
`X-N8N-API-KEY: $N8N_API_KEY`.

```
List:        GET  $N8N_API_URL/workflows            (touch only names starting "DA - ")
Read:        GET  $N8N_API_URL/workflows/{id}
Create:      POST $N8N_API_URL/workflows            body: {name,nodes,connections,settings} ONLY
Update:      PUT  $N8N_API_URL/workflows/{id}       same four fields ONLY, full replacement
Activate:    POST $N8N_API_URL/workflows/{id}/activate     (or .../deactivate)
Executions:  GET  $N8N_API_URL/executions?workflowId={id}  (short retention)
Live hooks:  https://digitalartifacts.app.n8n.cloud/webhook/{path}
```

Update really is full replacement: GET the workflow, modify the JSON, PUT the whole thing
back stripped to the four accepted fields. Saving never activates; activation is its own call,
and the UI toggle is the fallback when the API refuses.

## Monthly report

The report is the flat fee's proof of value, rendered from the ledger, not memory: every lead
of the month, one line each, with response times, what got booked, and what the reactivation
timer surfaced (once phase 2 exists). Estimated job value per lead makes the maths land: one
saved job usually covers months of the fee. `templates/report-template.html` is the working
example (adapt names, dates, rows). Render to PDF with headless Chrome:

```
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless \
  --print-to-pdf=report.pdf --no-pdf-header-footer --allow-file-access-from-files report.html
```

Check the page count before sending (grep the PDF for `/Count`); the template is built to hold
one page.

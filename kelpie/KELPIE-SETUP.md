# Kelpie setup kit

You are a Claude Code session inside a client project. This kit is self-contained: everything
you need to stand up Kelpie v1 for this client is in this folder. Read this file fully, then
fill or confirm `CLIENT.md`, then work the setup steps in order. Do not improvise around the
house rules; they are contractual and brand-level, not preferences.

Kit master lives in the Digital Artifacts repo at `kelpie/`. If you improve anything here,
tell Isaiah so the change flows back to the master; do not let instances drift silently.

---

## What Kelpie is

Kelpie is Digital Artifacts' metered lead-response agent for trades. It catches every enquiry
the moment it arrives, acknowledges it, forwards it to the owner's phone and inbox, logs it in
a ledger both sides can read, and (phase 2) chases the leads the owner never got to, booking
quote visits and jobs by calendar invite. The client pays only when Kelpie locks something in
itself. An enquiry through their own website is theirs, free, always, and shows on the report
as a $0 row. That $0 row is the differentiator against HiPages and Bark: the client watches the
system decline to charge for what was already theirs.

**v1 scope (what you are setting up now):**
1. Capture: the client site's quote form forwards every lead to a Kelpie webhook.
2. Ledger: one Google Sheet per client, one row per lead, the schema in
   `templates/ledger-schema.md`. The ledger is the bill and the proof.
3. Forwarding: a formatted email to the owner within a minute of the enquiry.
4. Monthly report: rendered from the ledger with `templates/report-template.html`.

**Phase 2 (do NOT build or promise unless Isaiah explicitly says so):**
the chase sequence, .ics booking confirmations, the job-history import, the rebook engine,
and SMS. SMS in particular is hard-gated: no SMS promise to anyone until Isaiah confirms the
ClickSend/ACMA sender-ID position. Nothing in v1 promises a delivery timeline for phase 2.

## The deal (rates v1, signed off 2026-07-07)

The ledger must encode these rules; billing is generated from ledger rows, never by hand.

| Term | Value |
|---|---|
| Setup | A$1,500 one-off (includes the job-history import when phase 2 lands) |
| Quote visit Kelpie locks in | A$60 |
| Job Kelpie secures outright (rebook, or quote accepted through Kelpie's thread) | A$150 |
| Monthly cap | A$750 |
| Floor | A$0 (nothing secured, no bill) |
| Grace window | 5 business days (per-client, see CLIENT.md) before Kelpie may chase |
| Kill switch | owner can mark any lead "leave it with me" at any time |
| Dispute | any billed row flagged within 7 days comes off the bill, no argument |
| Graduation | 2 consecutive months at or near cap flips to flat A$600/mo |

Billable-event rules, in one place:
- Enquiry via the client's own website, email, or answered phone: never billed.
- Client books anything themselves, however the lead arrived: never billed. If Kelpie's nudge
  caused it but the client closed it, it is a $0 row marked `self_booked`.
- Kelpie locks in a confirmed quote visit: A$60, machine event (a confirmed time, logged).
- Kelpie secures a job outright: A$150.
- A Kelpie-secured quote visit that the client later converts: nothing more.

## House rules (non-negotiable)

- **No em dashes. Ever.** Not in emails, not in reports, not in code comments, not in commit
  messages. Use commas, colons, periods, or parentheses. This is a Digital Artifacts brand
  signal and the fastest way to fail a review.
- Australian spelling (organise, colour, optimise). Direct, warm, peer-to-peer voice. Banned
  words: awesome, amazing, game-changing, unlock, unleash, synergy, leverage (as a verb),
  deliverable, stakeholder. No "I hope this finds you well". One exclamation mark per email max.
- **Every customer-facing outbound message passes Isaiah before it sends.** You prepare, he
  approves. No exceptions in v1.
- **n8n scope:** the shared n8n instance (`n8nbeginner-sga.app.n8n.cloud`) hosts other people's
  workflows (JARVIS, SGA, CED). You may only create, edit, or activate items whose names start
  with `DA - `. Never touch anything else, read-only excepted. The n8n API key comes from
  Isaiah (it lives in the DA repo's gitignored `.env` as `N8N_API_KEY`); never commit it.
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
curl -X POST "https://n8nbeginner-sga.app.n8n.cloud/api/v1/workflows" \
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
curl -X POST "https://n8nbeginner-sga.app.n8n.cloud/api/v1/workflows/{id}/activate" \
  -H "X-N8N-API-KEY: $N8N_API_KEY"
```

Now set `KELPIE_WEBHOOK_URL=https://n8nbeginner-sga.app.n8n.cloud/webhook/kelpie-{slug}-lead`
in the site's hosting env and redeploy (Isaiah approves production deploys).

**5. Test end-to-end.** Submit the live form with an obvious test marker (name "KELPIE TEST",
notes "ignore, setup test"). Verify all three: the existing owner notification still arrives,
a correctly-filled row appears in the ledger, and the Kelpie notify email renders properly.
n8n reporting `success` proves the send, not the render: open the email and look at it. If any
expression shows raw code like `$json.body.name`, the field is missing its `{{ }}` wrapper
(see gotchas below). Mark the test row `status=lost` in the ledger so it never counts.

**6. Share the ledger.** The sheet is owned by hello@digitalartifacts.com.au. Share it with
the client read-only (their view of the meter is a feature, not a risk). Isaiah sends the
share.

**7. Log completion.** Report back what was created (workflow id, webhook path, sheet id,
env vars touched) so Isaiah can record it in the DA repo. Do not record any of it in a public
readme in the client repo.

## n8n crib (learned the hard way, do not rediscover)

- Expressions in node fields need `={{ ... }}` template syntax. A bare `="a" + $json.b` string
  prints literally in the sent email.
- Google Sheets append: `mappingMode: autoMapInputData` matches incoming JSON keys to the
  header row by name. The Normalise Lead code node must emit keys exactly matching
  `templates/ledger-schema.md`, and nothing else (no nested objects).
- Credentials on the shared instance, referenced by id in the template: Google Sheets
  `xyvnpCe0Is7f0c73` (Google Sheets account 3), Gmail `bMWObGun24xoeJyN` (Gmail account,
  sends as hello@digitalartifacts.com.au). Both belong to the DA Google account.
- Webhook paths must be unique across the whole instance; the `kelpie-{slug}-lead` convention
  guarantees that.
- Workflow activation is a separate POST to `/workflows/{id}/activate`; saving does not
  activate, and the UI toggle is the fallback.
- n8n execution retention is short. The ledger is the record; never rely on n8n history for
  lead data.

## Monthly report and invoice

Render from the ledger, not memory: every lead of the month, one line each, billed rows with
amounts, free rows explicitly $0. `templates/report-template.html` is the working example
(adapt names, dates, rows). Render to PDF with headless Chrome:

```
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless \
  --print-to-pdf=report.pdf --no-pdf-header-footer --allow-file-access-from-files report.html
```

Check the page count before sending (grep the PDF for `/Count`); the template is built to hold
one page. The report must also surface the two self-diagnostics: suppression rate (share of
chaseable leads marked "leave it with me") and self-booked count ($0 rows Kelpie caused but the
client closed). Two high months of either flags the flat-retainer conversation for Isaiah.

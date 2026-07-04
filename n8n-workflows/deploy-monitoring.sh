#!/usr/bin/env bash
#
# DA monitoring deploy (step two of the outbound reliability work).
#
# What it does, in order:
#   1. Creates "DA - Error Alert" (workflow-l) if it does not already exist.
#      Error workflows fire when a referencing workflow fails; they do not need activation.
#   2. Creates and activates "DA - Outbound Heartbeat" (workflow-k):
#      weekdays 8:30am AEST, posts the prospects queue digest to Telegram
#      30 minutes before workflow-f's 9am run.
#   3. Wires errorWorkflow = "DA - Error Alert" onto every live "DA - " workflow
#      (tested on the heartbeat first; falls back to UI instructions if the API rejects it).
#   4. Fires the heartbeat's manual-test webhook so you see the digest on Telegram immediately.
#
# Run it yourself (human hands on the shared instance, by design):
#   bash n8n-workflows/deploy-monitoring.sh
#
# Needs N8N_API_KEY in the repo .env. Idempotent: re-running reuses existing workflows.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BASE="https://n8nbeginner-sga.app.n8n.cloud/api/v1"
KEY="$(grep '^N8N_API_KEY=' "$ROOT/.env" | cut -d= -f2- || true)"
[ -n "$KEY" ] || { echo "ERROR: N8N_API_KEY not found in $ROOT/.env"; exit 1; }

api() { curl -sf -H "X-N8N-API-KEY: $KEY" -H "Content-Type: application/json" "$@"; }

find_by_name() {
  api "$BASE/workflows?limit=250" | python3 -c "
import sys, json
ws = json.load(sys.stdin)['data']
m = [w['id'] for w in ws if w['name'] == '''$1''']
print(m[0] if m else '')
"
}

echo "== 1/4 Error alert workflow =="
LID="$(find_by_name 'DA - Error Alert')"
if [ -n "$LID" ]; then
  echo "already exists: $LID (reusing)"
else
  LID="$(api -X POST "$BASE/workflows" -d @"$ROOT/n8n-workflows/workflow-l-error-alert.json" \
    | python3 -c 'import sys, json; print(json.load(sys.stdin)["id"])')"
  echo "created: $LID"
fi

echo "== 2/4 Heartbeat workflow =="
KID="$(find_by_name 'DA - Outbound Heartbeat')"
if [ -n "$KID" ]; then
  echo "already exists: $KID (reusing)"
else
  KID="$(api -X POST "$BASE/workflows" -d @"$ROOT/n8n-workflows/workflow-k-outbound-heartbeat.json" \
    | python3 -c 'import sys, json; print(json.load(sys.stdin)["id"])')"
  echo "created: $KID"
fi
api -X POST "$BASE/workflows/$KID/activate" > /dev/null || true
echo "active: weekdays 8:30am AEST"

echo "== 3/4 Wiring errorWorkflow onto live DA workflows =="
KEY="$KEY" BASE="$BASE" LID="$LID" KID="$KID" python3 << 'PYEOF'
import json, os, urllib.request, urllib.error

KEY, BASE, LID, KID = os.environ['KEY'], os.environ['BASE'], os.environ['LID'], os.environ['KID']

def req(method, path, body=None):
    r = urllib.request.Request(
        BASE + path, method=method,
        headers={'X-N8N-API-KEY': KEY, 'Content-Type': 'application/json'},
        data=json.dumps(body).encode() if body is not None else None)
    with urllib.request.urlopen(r) as resp:
        return json.load(resp)

ws = req('GET', '/workflows?limit=250')['data']
targets = [w for w in ws
           if w['name'].startswith('DA - ') and w['id'] != LID and 'TEMP' not in w['name']]
# Test the settings PUT on the heartbeat first; if the API rejects errorWorkflow,
# stop and hand over to the UI rather than half-writing settings everywhere.
targets.sort(key=lambda w: 0 if w['id'] == KID else 1)

ok, failed = [], []
for w in targets:
    full = req('GET', '/workflows/' + w['id'])
    s = full.get('settings') or {}
    settings = {'executionOrder': s.get('executionOrder', 'v1'), 'errorWorkflow': LID}
    if s.get('timezone'):
        settings['timezone'] = s['timezone']
    payload = {'name': full['name'], 'nodes': full['nodes'],
               'connections': full['connections'], 'settings': settings}
    try:
        req('PUT', '/workflows/' + w['id'], payload)
        ok.append(full['name'])
    except urllib.error.HTTPError as e:
        detail = e.read().decode()[:200]
        failed.append((full['name'], f'{e.code} {detail}'))
        if w['id'] == KID:
            print(f'API rejected errorWorkflow on the first attempt: {e.code} {detail}')
            print('Fallback: open each DA workflow in the n8n UI, Settings, Error Workflow,')
            print('and pick "DA - Error Alert". Stopping the wiring loop here.')
            break

print(f'errorWorkflow wired on {len(ok)} workflows:')
for n in ok:
    print('  ' + n)
if failed:
    print(f'FAILED ({len(failed)}):')
    for n, e in failed:
        print(f'  {n}: {e}')
PYEOF

echo "== 4/4 Test heartbeat =="
sleep 2
if curl -sf "https://n8nbeginner-sga.app.n8n.cloud/webhook/da-heartbeat-test-b3e91f7c" > /dev/null; then
  echo "Test fired. Check Telegram (@DA_Adminbot chat) for the heartbeat digest."
else
  echo "Test webhook did not respond; open DA - Outbound Heartbeat in n8n and check it is active."
fi

echo "Done."

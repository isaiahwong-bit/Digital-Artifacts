// Kelpie ledger forward, reference implementation (adapt to the project's style).
//
// Drops into the site's existing quote-form handler AFTER its own notify path.
// Rules it must keep when adapted:
//   1. Fire-and-forget: the customer's submit response never depends on Kelpie.
//      Await it (serverless platforms kill dangling promises at response end)
//      but swallow every failure; the owner's notify email is the safety net.
//   2. Skip silently when KELPIE_WEBHOOK_URL is unset, so the wiring can ship
//      before the workflow is live.
//   3. Send photoCount only, never photo bytes; attachments ride the existing
//      email path.

export type KelpieLead = {
  source: "form";
  name: string;
  phone: string;
  email: string;
  suburb: string;
  service: string;
  trees: string;
  urgency: string;
  notes: string;
  photoCount: number;
  page: string;
};

export async function forwardToKelpie(lead: KelpieLead): Promise<void> {
  const url = process.env.KELPIE_WEBHOOK_URL;
  if (!url) return;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 3000);
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
  } catch (err) {
    // A ledger miss is recoverable from the notify email; the form is not.
    console.error("kelpie forward failed", err);
  }
}

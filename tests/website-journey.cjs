// Run against a local preview. All enquiry POSTs are mocked; no real leads are created.
// npm install --no-save playwright (if not already available), then node tests/website-journey.cjs
const { chromium } = require(process.env.DA_PLAYWRIGHT || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.DA_PREVIEW_URL || 'http://127.0.0.1:3000';
const output = process.env.DA_TEST_OUTPUT || '/tmp/da-journey-tests';
fs.mkdirSync(output, { recursive: true });
const pages = [
  ['home', '/'],
  ['websites', '/websites.html'],
  ['automations', '/automations.html'],
];
const results = [];
(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.DA_BROWSER_EXECUTABLE
      ? { executablePath: process.env.DA_BROWSER_EXECUTABLE }
      : {}),
  });
  try {
    for (const [name, route] of pages) {
      for (const [mode, width, height] of [
        ['desktop', 1440, 1000],
        ['mobile', 390, 844],
        ['narrow', 320, 740],
      ]) {
        const context = await browser.newContext({
          viewport: { width, height },
          reducedMotion: 'reduce',
        });
        await context.route('**/*', (r) =>
          r.request().method() === 'POST' ? r.abort() : r.continue(),
        );
        const p = await context.newPage();
        const errors = [];
        p.on('pageerror', (e) => errors.push(e.message));
        await p.goto(base + route, { waitUntil: 'networkidle' });
        await p.evaluate(() =>
          document.querySelectorAll('img').forEach((i) => (i.loading = 'eager')),
        );
        await p.waitForFunction(() => [...document.images].every((i) => i.complete));
        const diagnostics = await p.evaluate(() => ({
          width: innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
          height: document.documentElement.scrollHeight,
          h1: document.querySelector('h1').innerText,
          brokenImages: [...document.images].filter((i) => !i.naturalWidth).map((i) => i.src),
          badAnchors: [...document.querySelectorAll('a[href^="#"]')]
            .filter((a) => a.hash.length > 1 && !document.getElementById(a.hash.slice(1)))
            .map((a) => a.hash),
          duplicateIds: [...document.querySelectorAll('[id]')]
            .map((e) => e.id)
            .filter((v, i, a) => a.indexOf(v) !== i),
        }));
        assert.equal(diagnostics.scrollWidth, width, `${name} ${mode}: horizontal overflow`);
        assert.deepEqual(diagnostics.brokenImages, []);
        assert.deepEqual(diagnostics.badAnchors, []);
        assert.deepEqual(diagnostics.duplicateIds, []);
        assert.deepEqual(errors, []);
        if (mode !== 'narrow') {
          await p.screenshot({ path: path.join(output, `${name}-${mode}.png`), fullPage: true });
          await p.screenshot({ path: path.join(output, `${name}-${mode}-hero.png`) });
        }
        if (mode === 'mobile') {
          await p.locator('.menu-toggle').click();
          assert.equal(await p.locator('.menu-toggle').getAttribute('aria-expanded'), 'true');
          await p.keyboard.press('Escape');
          assert.equal(await p.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
          assert.equal(
            await p.locator('.menu-toggle').evaluate((e) => document.activeElement === e),
            true,
          );
        }
        results.push({ name, mode, ...diagnostics });
        await context.close();
      }
    }
    console.log('PASS: 9 viewport checks, images, anchors, IDs and mobile menus');

    // The content and navigation remain usable with scripts disabled.
    const nojs = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
    });
    for (const [name, route] of pages) {
      const p = await nojs.newPage();
      await p.goto(base + route);
      assert.equal(await p.locator('h1').isVisible(), true);
      assert.equal(await p.locator('#siteNav').isVisible(), true);
      assert.match(await p.locator('#contactForm').getAttribute('action'), /formspree/);
      if (name === 'automations')
        for (const key of ['lead', 'reactivation', 'reputation'])
          assert.equal(await p.locator(`#flow-${key}`).isVisible(), true);
      await p.close();
    }
    await nojs.close();
    console.log('PASS: no-JavaScript content, navigation and native form fallback');

    const c = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
      reducedMotion: 'reduce',
    });
    // Block every third-party asset. Core functionality must be independent of CDNs.
    await c.route('**/*', (r) =>
      new URL(r.request().url()).origin === new URL(base).origin ? r.continue() : r.abort(),
    );
    const p = await c.newPage();
    await p.goto(base + '/websites.html');
    await p.locator('[data-package="business"]').click();
    assert.equal(await p.locator('#service').inputValue(), 'website');
    assert.equal(await p.locator('input[name="package"]').inputValue(), 'business');
    assert.match(await p.locator('#selectionNote').innerText(), /Business Website/);
    await p.locator('#service').selectOption('both');
    assert.equal(await p.locator('input[name="package"]').inputValue(), '');
    assert.equal(await p.locator('#selectionNote').isVisible(), false);
    await p.goto(base + '/automations.html?flow=reputation');
    assert.equal(await p.locator('#flow-reputation').isVisible(), true);
    assert.equal(await p.locator('#service').inputValue(), 'reputation');
    await p.locator('#tab-reputation').focus();
    await p.keyboard.press('ArrowLeft');
    assert.equal(await p.locator('#flow-reactivation').isVisible(), true);
    assert.equal(await p.locator('#service').inputValue(), 'reactivation');
    assert.match(p.url(), /flow=reactivation/);
    await p.locator('#service').selectOption('automation');
    await p.locator('#tab-lead').click();
    assert.equal(
      await p.locator('#service').inputValue(),
      'automation',
      'Visitor choice should survive tab changes',
    );
    await p.locator('#flow-lead [data-interest]').click();
    assert.equal(await p.locator('#service').inputValue(), 'lead-response');
    await p.goto(base + '/#layers');
    assert.equal(await p.locator('#layers').getAttribute('open'), '');
    await p.goto(base + '/websites.html');
    await p.locator('a[data-interest="referral"]').click();
    assert.match(p.url(), /interest=referral/);
    assert.match(await p.locator('#selectionNote').innerText(), /Introducing/);
    await c.close();
    console.log(
      'PASS: package selection, workflow keyboard/deep links, user choice, referrals and framework link without CDNs',
    );

    const cases = [
      ['both-fail', 'abort', 'abort', false],
      ['http-errors', 500, 422, false],
      ['primary-only', 200, 503, true],
      ['backup-only', 500, 200, true],
      ['both-succeed', 200, 200, true],
    ];
    for (const [name, route] of pages) {
      for (const [scenario, primary, backup, expected] of cases) {
        const ctx = await browser.newContext({ reducedMotion: 'reduce' });
        let posts = [];
        await ctx.route('**/*', async (r) => {
          if (r.request().method() !== 'POST') return r.continue();
          posts.push({ url: r.request().url(), body: r.request().postData() });
          const action = r.request().url().includes('n8n.cloud') ? primary : backup;
          if (action === 'abort') return r.abort();
          return r.fulfill({
            status: action,
            contentType: 'application/json',
            body: JSON.stringify({ ok: action === 200 }),
          });
        });
        const page = await ctx.newPage();
        await page.addInitScript(() => {
          window.auditEvents = [];
          window.gtag = (...args) => window.auditEvents.push(args);
        });
        await page.goto(base + route);
        await page.locator('#name').fill('Local audit');
        await page.locator('#email').fill('audit@example.invalid');
        await page.locator('button[type="submit"]').click();
        assert.equal(posts.length, 0, 'Empty required message must prevent submission');
        await page.locator('#message').fill('A local intercepted test. Do not deliver.');
        await page.locator('button[type="submit"]').click();
        await page.waitForFunction(
          () => !document.querySelector('#contactForm').hasAttribute('aria-busy'),
        );
        assert.equal(
          await page.locator('#formSuccess').isVisible(),
          expected,
          `${name}/${scenario}`,
        );
        assert.equal(
          await page.locator('#formError').isVisible(),
          !expected,
          `${name}/${scenario}`,
        );
        assert.equal(posts.length, 2);
        const events = await page.evaluate(() => window.auditEvents);
        assert.equal(events.filter((e) => e[1] === 'generate_lead').length, expected ? 1 : 0);
        const payload = JSON.parse(posts.find((post) => post.url.includes('n8n.cloud')).body);
        assert.equal(payload.lead_magnet, false);
        assert.equal(payload.source_page, name);
        assert.equal(payload.message, 'A local intercepted test. Do not deliver.');
        if (!expected) assert.equal(await page.locator('#message').inputValue(), payload.message);
        results.push({ name, scenario, success: expected, requests: posts.length });
        await ctx.close();
      }
    }
    console.log(
      'PASS: 15 delivery cases, HTTP failures, fallback, validation, preserved details and confirmed-lead tracking',
    );

    const timeoutContext = await browser.newContext({ reducedMotion: 'reduce' });
    await timeoutContext.route('**/*', (r) =>
      r.request().method() === 'POST' ? new Promise(() => {}) : r.continue(),
    );
    const t = await timeoutContext.newPage();
    await t.goto(base);
    await t.locator('#name').fill('Local timeout test');
    await t.locator('#email').fill('audit@example.invalid');
    await t.locator('#message').fill('Timeout paths are intercepted locally.');
    await t.locator('button[type="submit"]').click();
    await t.waitForFunction(() => !document.querySelector('#formError').hidden, { timeout: 16000 });
    assert.equal(await t.locator('#formSuccess').isVisible(), false);
    assert.equal(await t.locator('button[type="submit"]').isEnabled(), true);
    await timeoutContext.close();
    console.log('PASS: delivery timeout returns to a recoverable form');
    fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify(results, null, 2));
    console.log(`Evidence: ${output}`);
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});

/* Essential interactions are independent of visual effects and third-party libraries. */
(() => {
  'use strict';

  // Keep campaign context when someone moves from a social landing page to the brief.
  // Store attribution only, never enquiry field values.
  const campaignKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  const attribution = (() => {
    const query = new URLSearchParams(location.search);
    const current = { landing_path: location.pathname };
    for (const key of campaignKeys) {
      if (query.has(key)) current[key] = query.get(key).slice(0, 200);
    }
    try {
      if (document.referrer) current.referrer_host = new URL(document.referrer).hostname;
    } catch (_) { /* Referrer is optional. */ }
    let saved;
    try { saved = JSON.parse(sessionStorage.getItem('da_journey_attribution')); } catch (_) { /* Storage is optional. */ }
    const valid = saved && typeof saved === 'object' && saved.first && saved.latest;
    const next = {
      first: valid ? saved.first : current,
      latest: !valid || campaignKeys.some(key => query.has(key)) ? current : saved.latest,
    };
    try { sessionStorage.setItem('da_journey_attribution', JSON.stringify(next)); } catch (_) { /* Continue without storage. */ }
    return next;
  })();

  const serviceNames = {
    'not-sure': 'Help choosing where to start',
    website: 'A website',
    'lead-response': 'Enquiry follow-up',
    both: 'Website + follow-up',
    reactivation: 'Past-client follow-up',
    reputation: 'Review requests',
    automation: 'Repeat admin or a custom workflow',
  };
  const packages = {
    landing: 'Landing Site',
    business: 'Business Website',
    custom: 'Custom Build',
  };
  const flowServices = {
    lead: 'lead-response',
    reactivation: 'reactivation',
    reputation: 'reputation',
  };
  const form = document.getElementById('contactForm');
  const service = form?.elements.namedItem('service');
  let serviceChosen = false;

  function track(name, parameters = {}) {
    // Tracking must never interrupt an enquiry or navigation.
    try {
      window.gtag?.('event', name, parameters);
    } catch (_) {
      /* non-essential */
    }
  }

  function chooseInterest(interest, packageKey) {
    if (!form || !service) return;
    const note = document.getElementById('selectionNote');
    const packageField = form.elements.namedItem('package');
    if (interest === 'referral') {
      service.value = 'not-sure';
      packageField.value = '';
      note.textContent =
        'Introducing a business? Tell me who you would like to connect and the best next step.';
    } else if (serviceNames[interest]) {
      service.value = interest;
      packageField.value = packages[packageKey] ? packageKey : '';
      note.textContent = packages[packageKey]
        ? `You’re asking about the ${packages[packageKey]} package. You can add more detail below.`
        : `You’re asking about: ${serviceNames[interest]}.`;
    } else return;
    note.hidden = false;
    serviceChosen = true;
  }

  // Register the form before optional navigation and analytics setup.
  if (form) {
    let sending = false;
    let started = false;
    form.addEventListener('input', () => {
      if (!started) {
        track('brief_start', { source_page: form.dataset.page });
        started = true;
      }
    });
    service?.addEventListener('change', () => {
      serviceChosen = true;
      form.elements.namedItem('package').value = '';
      document.getElementById('selectionNote').hidden = true;
    });

    async function deliver(url, options) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);
      try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        if (!response.ok) throw new Error(`Delivery returned ${response.status}`);
        return true;
      } finally {
        clearTimeout(timeout);
      }
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (sending || !form.reportValidity()) return;
      sending = true;
      const button = form.querySelector('button[type="submit"]');
      const label = button.querySelector('[data-submit-label]');
      const error = document.getElementById('formError');
      const status = document.getElementById('formStatus');
      error.hidden = true;
      button.disabled = true;
      form.setAttribute('aria-busy', 'true');
      label.textContent = 'Sending your brief…';
      status.textContent = 'Checking that your brief is received.';

      try {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const params = new URLSearchParams(location.search);
        data.lead_magnet = false;
        data.submitted_at = new Date().toISOString();
        data.source_page = form.dataset.page;
        data.source_url = location.href;
        for (const key of campaignKeys) {
          if (attribution.latest[key]) data[key] = attribution.latest[key];
        }
        data.first_touch = attribution.first;
        data.latest_touch = attribution.latest;
        if (params.get('interest') === 'referral') data['how-heard'] = 'referral';
        for (const [key, value] of Object.entries(data)) {
          formData.set(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
        }

        // Both services remain in use. A fulfilled request must also be HTTP-successful.
        const deliveries = await Promise.allSettled([
          deliver('https://n8nbeginner-sga.app.n8n.cloud/webhook/da-lead-capture', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          }),
          deliver(form.action, {
            method: 'POST',
            headers: { Accept: 'application/json' },
            body: formData,
          }),
        ]);
        if (!deliveries.some((result) => result.status === 'fulfilled')) {
          throw new Error('No delivery service confirmed receipt');
        }

        form.hidden = true;
        const success = document.getElementById('formSuccess');
        success.hidden = false;
        success.focus();
        document.getElementById('selectionNote').hidden = true;
        track('generate_lead', {
          source_page: form.dataset.page,
          service: data.service,
          package: data.package || 'none',
        });
      } catch (_) {
        error.textContent =
          'We could not confirm delivery. Your details are still here. Please try again, or email hello@digitalartifacts.com.au. If a request was delayed, it may still arrive.';
        error.hidden = false;
        track('brief_delivery_error', { source_page: form.dataset.page });
        error.scrollIntoView({ block: 'nearest', behavior: 'instant' });
      } finally {
        status.textContent = '';
        label.textContent = 'Send my brief';
        button.disabled = false;
        form.removeAttribute('aria-busy');
        sending = false;
      }
    });
  }

  const menu = document.getElementById('siteNav');
  const toggle = document.querySelector('.menu-toggle');
  if (menu && toggle) {
    const setMenu = (open) => {
      menu.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Close' : 'Menu';
    };
    toggle.addEventListener('click', () =>
      setMenu(toggle.getAttribute('aria-expanded') !== 'true'),
    );
    menu.addEventListener('click', (event) => {
      if (event.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });
    document.addEventListener('click', (event) => {
      if (!event.target.closest('.site-header')) setMenu(false);
    });
    toggle.hidden = false;
    document.documentElement.classList.add('menu-ready');
  }

  const tabs = [...document.querySelectorAll('[data-flow]')];
  const panels = [...document.querySelectorAll('[data-flow-panel]')];
  if (tabs.length && panels.length) {
    const selectFlow = (key, updateUrl = false) => {
      if (!flowServices[key]) key = 'lead';
      tabs.forEach((tab) => {
        const selected = tab.dataset.flow === key;
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
      });
      panels.forEach((panel) => {
        panel.hidden = panel.dataset.flowPanel !== key;
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', `tab-${panel.dataset.flowPanel}`);
        panel.tabIndex = 0;
      });
      if (service && !serviceChosen) service.value = flowServices[key];
      if (updateUrl) {
        const url = new URL(location.href);
        url.searchParams.set('flow', key);
        history.replaceState(null, '', url);
        track('workflow_select', { workflow: key });
      }
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => selectFlow(tab.dataset.flow, true));
      tab.addEventListener('keydown', (event) => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next === undefined) return;
        event.preventDefault();
        selectFlow(tabs[next].dataset.flow, true);
        tabs[next].focus();
      });
    });
    selectFlow(new URLSearchParams(location.search).get('flow'));
    document.querySelector('.flow-tabs').hidden = false;
  }

  function revealHash() {
    if (!location.hash) return;
    let id;
    try {
      id = decodeURIComponent(location.hash.slice(1));
    } catch (_) {
      return;
    }
    const target = document.getElementById(id);
    if (target?.tagName === 'DETAILS') target.open = true;
    const parent = target?.closest('details');
    if (parent) parent.open = true;
  }
  window.addEventListener('hashchange', revealHash);
  revealHash();

  const params = new URLSearchParams(location.search);
  chooseInterest(params.get('interest'), params.get('package'));

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link) return;
    if (link.dataset.interest) {
      const url = new URL(link.href, location.href);
      if (
        url.origin === location.origin &&
        (url.pathname === location.pathname ||
          (url.pathname === '/' && location.pathname === '/index.html'))
      ) {
        chooseInterest(link.dataset.interest, link.dataset.package);
        // Keep referral context in the submitted brief without changing its visible content.
        if (link.dataset.interest === 'referral') {
          const current = new URL(location.href);
          current.searchParams.set('interest', 'referral');
          history.replaceState(null, '', current);
        }
      } else {
        url.searchParams.set('interest', link.dataset.interest);
        if (link.dataset.package) url.searchParams.set('package', link.dataset.package);
        link.href = url.href;
      }
    }
    if (link.hash === '#contact')
      track('project_cta_click', { source_page: document.body.dataset.page });
    if (link.dataset.download) track('resource_download', { resource: link.dataset.download });
    if (link.classList.contains('work-card'))
      track('project_view', { project: link.querySelector('h3')?.textContent });
  });

  // Enable the same analytics on all three production pages. Local previews do not send analytics.
  if (['digitalartifacts.com.au', 'www.digitalartifacts.com.au'].includes(location.hostname)) {
    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function () {
        window.dataLayer.push(arguments);
      };
    window.gtag('js', new Date());
    window.gtag('config', 'G-FGKKW3ERQ5');
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-FGKKW3ERQ5';
    document.head.appendChild(script);
  }
})();

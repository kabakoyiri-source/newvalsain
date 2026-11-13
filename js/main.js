(() => {
  'use strict';
  const hostname = window.location.hostname.toLowerCase().replace(/\.$/, '').replace(/^www\./, '');
  const domainEmails = new Map([
    ['valsain.co', 'info@valsain.co'],
    ['valsaintconsulting.com', 'info@valsaintconsulting.com']
  ]);
  const contactEmail = domainEmails.get(hostname) || 'info@valsain.co';
  document.querySelectorAll('[data-contact-email]').forEach(element => {
    element.textContent = contactEmail;
  });
  document.querySelectorAll('[data-contact-email-link]').forEach(link => {
    link.href = `mailto:${contactEmail}`;
  });
  document.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
    try {
      const organization = JSON.parse(script.textContent);
      if (organization['@type'] === 'Organization') {
        organization.email = contactEmail;
        script.textContent = JSON.stringify(organization);
      }
    } catch (_) { /* Unrelated or invalid metadata must not interrupt the page. */ }
  });
  const root = document.documentElement;
  const languageButtons = document.querySelectorAll('[data-set-lang]');
  const languagePreferenceKey = 'valsain-language-preference';
  const titles = {fr:'Valsain SA · Carrières, Immobilier & Conseil',en:'Valsain SA · Quarrying, Real Estate & Advisory'};
  const descriptions = {
    fr:'Valsain SA, société suisse fondée en 1972 à Giubiasco. Extraction de pierre, immobilier et construction, conseil en affaires et en investissement.',
    en:'Valsain SA, a Swiss company founded in 1972 in Giubiasco. Stone extraction, real estate and construction, business and investment advisory.'
  };
  function setLanguage(value) {
    const lang = value === 'en' ? 'en' : 'fr';
    root.lang = lang;
    root.dataset.lang = lang;
    document.title = titles[lang];
    document.querySelector('meta[name="description"]').content = descriptions[lang];
    document.querySelector('meta[property="og:title"]').content = titles[lang];
    document.querySelector('meta[property="og:description"]').content = descriptions[lang];
    document.querySelector('nav').setAttribute('aria-label',lang === 'fr' ? 'Navigation principale' : 'Main navigation');
    languageButtons.forEach(button => button.setAttribute('aria-pressed',String(button.dataset.setLang === lang)));
    document.querySelectorAll('[data-alt-fr]').forEach(image => {image.alt = image.dataset[lang === 'en' ? 'altEn' : 'altFr'];});
  }
  let savedLanguage;
  try {savedLanguage = localStorage.getItem(languagePreferenceKey);} catch (_) {}
  const initialLanguage = ['fr','en'].includes(savedLanguage) ? savedLanguage : 'en';
  setLanguage(initialLanguage);
  languageButtons.forEach(button => button.addEventListener('click',() => {
    const lang = button.dataset.setLang;
    setLanguage(lang);
    try {localStorage.setItem(languagePreferenceKey,lang);} catch (_) { /* Storage is optional. */ }
  }));
  document.querySelectorAll('.year').forEach(element => {element.textContent = new Date().getFullYear();});
  const contact = document.getElementById('contact');
  const navLinks = document.querySelectorAll('[data-nav]');
  if ('IntersectionObserver' in window && contact) {
    new IntersectionObserver(entries => {
      const current = entries[0].isIntersecting ? 'contact' : 'home';
      navLinks.forEach(link => {
        const active = link.dataset.nav === current;
        link.classList.toggle('active',active);
        if (active) link.setAttribute('aria-current','location');
        else link.removeAttribute('aria-current');
      });
    },{threshold:0.15}).observe(contact);
  }
})();

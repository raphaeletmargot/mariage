(() => {
  const versions = ['famille_proche', 'loges_domaine', 'invites_complets'];
  const requestedVersion = new URLSearchParams(window.location.search).get('version');
  const version = versions.includes(requestedVersion) ? requestedVersion : versions[0];

  document.body.dataset.variant = version;

  document.querySelectorAll('[data-variants]').forEach((element) => {
    const visibleVersions = element.dataset.variants.split(',').map((item) => item.trim());
    element.hidden = !visibleVersions.includes(version);
  });

  document.querySelectorAll('a[href]').forEach((link) => {
    const target = new URL(link.getAttribute('href'), window.location.href);
    if (target.origin !== window.location.origin) return;

    if (/\.html$/.test(target.pathname) && !/\/index\.html$/.test(target.pathname)) {
      target.searchParams.set('version', version);
    }

    link.href = target.href;
  });
})();

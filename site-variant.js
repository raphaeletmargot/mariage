(() => {
  const requestedVersion = new URLSearchParams(window.location.search).get('version');
  const invitationMatch = window.location.pathname.match(/invitation-([123])\.html$/);
  const version = ['1', '2', '3'].includes(requestedVersion) ? requestedVersion : invitationMatch?.[1] || '1';

  document.body.dataset.variant = version;

  document.querySelectorAll('[data-variants]').forEach((element) => {
    const visibleVersions = element.dataset.variants.split(',').map((item) => item.trim());
    element.hidden = !visibleVersions.includes(version);
  });

  document.querySelectorAll('a[href]').forEach((link) => {
    const target = new URL(link.getAttribute('href'), window.location.href);
    if (target.origin !== window.location.origin) return;

    if (/\/invitation-[123]\.html$/.test(target.pathname)) {
      target.pathname = target.pathname.replace(/invitation-[123]\.html$/, 'invitation-1.html');
      target.searchParams.set('version', version);
    } else if (/\.html$/.test(target.pathname) && !/\/index\.html$/.test(target.pathname)) {
      target.searchParams.set('version', version);
    }

    link.href = target.href;
  });
})();

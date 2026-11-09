// Real ads load only on the production site, never on local, preview or LAN hosts
const AD_HOSTS = new Set(['6yuwei.com']);

export default defineNuxtPlugin(() => {
  if (!AD_HOSTS.has(useRequestURL().hostname)) return;
  useHead({
    script: [
      {
        src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3389697259947664',
        async: true,
        crossorigin: 'anonymous',
      },
    ],
  });
});

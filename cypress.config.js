module.exports = {
  e2e: {
    baseUrl: 'https://sweetshop.netlify.app',
    viewportWidth: 1280,
    viewportHeight: 900,
    // Increased timeouts to be more tolerant in CI (headless/browser differences)
    // Make timeouts more forgiving in CI where network and asset loading can be slower
    // Increase default command timeout for UI interactions and the page load timeout
    defaultCommandTimeout: 20000,
    pageLoadTimeout: 180000,
    // Enable recording videos when running in CI (GitHub Actions sets CI=true)
    // Keep videos off locally for faster developer runs
    video: !!process.env.CI,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    setupNodeEvents(on, config) {
    },
  },
};

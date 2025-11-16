module.exports = {
  e2e: {
    baseUrl: 'https://sweetshop.netlify.app',
    viewportWidth: 1280,
    viewportHeight: 900,
    // Increased timeouts to be more tolerant in CI (headless/browser differences)
    defaultCommandTimeout: 15000,
    pageLoadTimeout: 60000,
    video: false,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    setupNodeEvents(on, config) {
    },
  },
};

/**
 * Debug logging that only reaches the console during local development.
 *
 * Vite sets DEV for `vite` and clears it for `vite build`, so anything routed
 * through here is a no-op in a built bundle while still printing during local
 * development. The call sites and their message strings do still ship - this
 * silences the console, it isn't a way to keep strings out of the bundle.
 *
 * Warnings and errors are deliberately not gated: they're the only
 * client-side signal when something breaks for a real player, so they go
 * straight to the console everywhere.
 *
 * The no-console ESLint rule allows console.warn and console.error directly;
 * debug-level output has to come through here.
 */
const debugEnabled = import.meta.env.DEV;

export const logger = {
  info: (...args) => {
    if (debugEnabled) {
      // eslint-disable-next-line no-console
      console.info(...args);
    }
  },
  log: (...args) => {
    if (debugEnabled) {
      // eslint-disable-next-line no-console
      console.log(...args);
    }
  },
  debug: (...args) => {
    if (debugEnabled) {
      // eslint-disable-next-line no-console
      console.debug(...args);
    }
  },
};

export default logger;

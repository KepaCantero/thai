// Spike 0 placeholder.
//
// This file is intentionally empty. The current app still loads via plain
// <script> tags in index.html (data.js, app.js, etc.) and shares state
// through globals on `window`.
//
// Future spikes will turn this into the real entry point:
//   - import './modes/cards' (and the other modes)
//   - bootstrap the router
//   - register the service worker
//
// For now, Vite serves the legacy scripts as-is so the app keeps working.
export {};

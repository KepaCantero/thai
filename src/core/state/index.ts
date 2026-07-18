// Phase 2: typed state surface re-exports.
//
// Consumers (cards, dashboard, questions modes — future spikes) import from
// this barrel. The bridge installer is exported separately so main.ts can
// call it exactly once at boot.

export * from './mode';
export * from './deck';
export * from './filters';
export * from './playback';
export * from './scoring';
export { installStateBridge } from './stateBridge';

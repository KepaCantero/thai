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
export * from './events';
export * from './player';
export { wirePlayerEngine, snapshotPlayer } from './playerEngine';
export { wireQuestEngine, snapshotQuests } from './questEngine';
export {
  wireTitleEngine,
  snapshotTitles,
  setActiveTitle,
} from './titleEngine';
export {
  TITLE_DEFS,
  TITLE_CATEGORY_LABELS,
  TITLE_CATEGORY_ORDER,
  defaultTitlesInitialState,
  buildCtx,
  computeNewUnlocks,
  applyUnlocks,
} from './titles';
export type {
  TitleDef,
  TitleId,
  TitleCategory,
  TitlesState,
  TitleUnlockCtx,
} from './titles';
export { installStateBridge } from './stateBridge';

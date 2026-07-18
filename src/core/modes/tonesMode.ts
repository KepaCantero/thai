// Spike 4: Tones mode.
//
// Until Spike 5 actually extracts the rendering logic from public/app.js, this
// mode is a thin orchestrator over the legacy globals (renderTonesView,
// stopTonesPlay, stopCurrentAudio). It owns:
//   - host visibility (#tonesView show/hide)
//   - progress text
//   - cleanup on exit
//
// What it does NOT own (yet): the inline onclick handlers in renderTonesView
// (tonesPlayWord, tonesPlayGroup, ...) — those stay global until the render
// function is rewritten. The factory takes `render` and `stop` as injectable
// deps so the gateway to the legacy code is explicit and mockable.

import type { Mode, ModeContext } from './types';

export interface TonesModeDependencies {
  /** Returns the #tonesView element. Throws if missing. */
  host: () => HTMLElement;
  /** Renders the tones grid into the host. Defaults to legacy global. */
  render: () => void;
  /** Stops any in-flight tones playback + audio. Defaults to legacy globals. */
  stop: () => void;
}

export function createTonesMode(deps: TonesModeDependencies): Mode {
  const host = deps.host;
  const render = deps.render;
  const stop = deps.stop;

  return {
    key: 'tones',
    mount(ctx: ModeContext) {
      host().style.display = 'flex';
      ctx.setProgress('Tones');
      render();
    },
    unmount() {
      stop();
      host().style.display = 'none';
    },
  };
}

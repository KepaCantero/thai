// Spike 5b: Alphabet mode — extraction of public/alphabet-ui.js (65 lines).
//
// Owns mnemonic-mode state (visual | full | story) and renders the
// consonant grid. Inline onclick handlers in the rendered HTML call back into
// window.setAlphaMode / window.speakText, so legacyBridge.ts overrides both.

export type AlphaClass = 'high' | 'mid' | 'low';
export type AlphaMnMode = 'visual' | 'full' | 'story';

export interface AlphaConsonantWord {
  thai: string;
  en: string;
}

export interface AlphaConsonant {
  i: number;
  thai: string;
  cls: AlphaClass;
  sound: string;
  soundLike: string;
  word: AlphaConsonantWord;
  emoji?: string;
  obsolete?: boolean;
  mnemonic?: Partial<Record<AlphaMnMode, string>>;
}

export interface AlphaModeStore {
  getItem(k: string): string | null;
  setItem(k: string, v: string): void;
}

export interface AlphaModuleDeps {
  getConsonants(): AlphaConsonant[];
  getModes(): { id: AlphaMnMode; label: string }[];
  getStore(): AlphaModeStore;
  setHostHtml(html: string): void;
}

export interface AlphaModule {
  getMode(): AlphaMnMode;
  setMode(mode: AlphaMnMode): void;
  /** Renders the full mnemonic UI into the host element. */
  renderView(): void;
  /** Renders just the inner content (chips + grid) — exposed for tests. */
  render(): string;
}

export const DEFAULT_ALPHA_MODE: AlphaMnMode = 'visual';
export const ALPHA_MODE_STORAGE_KEY = 'thai_alpha_mn_mode';

const HINTS: Record<AlphaMnMode, string> = {
  visual: 'Visual — ancla la forma de la letra a la palabra thai',
  full: 'Completo — forma + sonido + clase (alta/media/baja)',
  story: 'Historia — mini-escena tipo memoria-palacio',
};

function classLabel(cls: string): string {
  return ({ high: 'HIGH', mid: 'MID', low: 'LOW' } as Record<string, string>)[cls] || cls.toUpperCase();
}

function escapeSingle(s: string): string {
  return (s || '').replace(/'/g, "\\'");
}

export function createAlphaModule(deps: AlphaModuleDeps): AlphaModule {
  let mode: AlphaMnMode = (() => {
    try {
      const v = deps.getStore().getItem(ALPHA_MODE_STORAGE_KEY);
      return (v === 'visual' || v === 'full' || v === 'story') ? v : DEFAULT_ALPHA_MODE;
    } catch {
      return DEFAULT_ALPHA_MODE;
    }
  })();

  function renderAlphaCard(c: AlphaConsonant): string {
    const mn = c.mnemonic && c.mnemonic[mode] ? c.mnemonic[mode] : '';
    return (
      '<div class="alpha-card alpha-cls-' + c.cls + (c.obsolete ? ' alpha-obsolete' : '') + '">' +
        '<div class="alpha-rank">#' + c.i + '</div>' +
        '<div class="alpha-class ' + c.cls + '">' + classLabel(c.cls) + '</div>' +
        '<div class="alpha-thai-row">' +
          (c.emoji ? '<div class="alpha-emoji">' + c.emoji + '</div>' : '') +
          '<div class="alpha-thai">' + c.thai + '</div>' +
          '<button class="alpha-play" onclick="event.stopPropagation();speakText(\'' + escapeSingle(c.soundLike) + '\')" title="Reproducir sonido">▶</button>' +
        '</div>' +
        '<div class="alpha-sound">' + c.sound + '</div>' +
        '<div class="alpha-mnemonic">as in <b>' + c.soundLike + '</b> ' + c.word.thai + ' (' + c.word.en + ')' +
          (c.obsolete ? ' <span class="alpha-obs">[obsolete]</span>' : '') +
        '</div>' +
        (mn ? '<div class="alpha-trick"><span class="alpha-trick-label">MN[' + mode + ']:</span> ' + mn + '</div>' : '') +
      '</div>'
    );
  }

  function render(): string {
    const modes = deps.getModes();
    const chips = modes
      .map((m) =>
        '<button class="alpha-chip' + (m.id === mode ? ' active' : '') +
        '" onclick="setAlphaMode(\'' + m.id + '\')">MN: ' + m.label + '</button>',
      )
      .join('');
    const cards = deps.getConsonants().map(renderAlphaCard).join('');
    return (
      '<div class="alpha-hint">Click ▶ para escuchar · nemotecnia: "as in [sound] [palabra] ([significado])"</div>' +
      '<div class="alpha-chips">' + chips + '</div>' +
      '<div class="alpha-hint">' + (HINTS[mode] || '') + '</div>' +
      '<div class="alpha-grid alpha-mn-' + mode + '">' + cards + '</div>'
    );
  }

  function renderView(): void {
    deps.setHostHtml('<div class="alpha-wrap">' + render() + '</div>');
  }

  return {
    getMode: () => mode,
    setMode(next) {
      if (next === mode) return;
      mode = next;
      try { deps.getStore().setItem(ALPHA_MODE_STORAGE_KEY, next); } catch {}
      renderView();
    },
    renderView,
    render,
  };
}

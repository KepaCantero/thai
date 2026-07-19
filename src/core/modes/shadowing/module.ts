// Spike 5g: Shadowing mode extraction.
//
// Moves the shadowing conversation player out of public/app.js
// (L1409-1688) into a typed module. Behavior preserved line-for-line:
//   - renderShadowingList(): list conversation cards filtered by activeLesson.
//   - openShadowing(id) / exitShadowingPlayer(): list <-> player navigation.
//   - renderShadowingPlayer(): audio-attached player OR TTS-only player.
//   - playShLine(idx): play one line (seek audio OR speakText).
//   - toggleShPlayAll() / startShPlay() / shPlayNext() / stopShPlay():
//     the TTS auto-loop with 2500ms gap, or audio play/pause.
//   - shAudioTimeUpdate(): audio-mode highlight sync.
//   - Tap-to-sync: toggleShSync() / shSyncTap() / saveShTimes() /
//     resetShTimes() / loadShTimes() — write per-line timestamps to
//     localStorage under 'sh_times_<id>'.
//
// Module owns: shConvId, shLineIdx, shPlaying, shTimeout, shSpeed,
// shSyncing, shSyncIdx.

import { getActiveLesson } from '../../state';
import { shTimesStore } from '../../persistence/stores';
import type { ShadowingConversation, ShadowingLine } from '../../types';

// ---------------------------------------------------------------------------
// Dependency injection
// ---------------------------------------------------------------------------

export interface ShadowingDom {
  setListHtml(html: string): void;
  showListView(): void;
  showPlayerView(): void;
  hidePlayerView(): void;
  setPlayerHtml(html: string): void;
  getAudio(): HTMLAudioElement | null;
  queryLines(): HTMLElement[];
  /** Returns the element with the given id, or null. */
  getById(id: string): HTMLElement | null;
  /** Returns the first element matching the selector, or null. */
  querySelector(sel: string): HTMLElement | null;
}

export interface ShadowingModuleDeps {
  /** Returns SHADOWING array (window.SHADOWING). */
  shadowing(): ShadowingConversation[];
  /** Speak arbitrary text (audio.js). */
  speakText(text: string, onDone?: () => void): void;
  /** Stop any in-flight playback (audio.js). */
  stopCurrentAudio(): void;
  /** Render a tone pill (app.js renderTone). */
  renderTone(toneStr: string | undefined): string;
  /** DOM write surface. */
  dom: ShadowingDom;
}

export interface ShadowingModule {
  renderShadowingList(): void;
  openShadowing(id: string): void;
  exitShadowingMode(): void;
  exitShadowingPlayer(): void;
  renderShadowingPlayer(): void;
  playShLine(idx: number): void;
  toggleShPlayAll(): void;
  startShPlay(fromIdx: number): void;
  stopShPlay(): void;
  shAudioTimeUpdate(): void;
  cycleShSpeed(): void;
  toggleShSync(): void;
  shSyncTap(): void;
  resetShTimes(): void;
  // Inspection helpers
  getShConvId(): string | null;
  getShLineIdx(): number;
  isShPlaying(): boolean;
  getShSpeed(): number;
  isShSyncing(): boolean;
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export function createShadowingModule(deps: ShadowingModuleDeps): ShadowingModule {
  let shConvId: string | null = null;
  let shLineIdx = -1;
  let shPlaying = false;
  let shTimeout: ReturnType<typeof setTimeout> | null = null;
  let shSpeed = 1;
  let shSyncing = false;
  let shSyncIdx = 0;

  function getShConv(): ShadowingConversation | undefined {
    if (!shConvId) return undefined;
    return deps.shadowing().find((c) => c.id === shConvId);
  }

  // ----- list view (app.js L1427-1444) --------------------------------------

  function renderShadowingList(): void {
    const al = getActiveLesson();
    const lessonNum = al === 'all' || al === 'youtube' ? null : parseInt(al, 10);
    const convs = deps.shadowing().filter((c) => !lessonNum || c.lesson === lessonNum);
    let html = '';
    convs.forEach((c) => {
      html += '<div class="sh-card" onclick="openShadowing(\'' + c.id + '\')">';
      html += '<div class="sh-card-lesson">Lesson ' + c.lesson + '</div>';
      html += '<div class="sh-card-title">' + c.title + '</div>';
      html += '<div class="sh-card-title-th">' + c.titleTh + '</div>';
      html += '<div class="sh-card-desc">' + c.description + '</div>';
      html += '<div class="sh-card-meta">' + c.lines.length + ' lines</div>';
      html += '</div>';
    });
    if (!convs.length) html = '<div class="sh-empty">No conversations for this lesson</div>';
    deps.dom.setListHtml(html);
    deps.dom.showListView();
  }

  // ----- player navigation (app.js L1446-1458) -----------------------------

  function openShadowing(id: string): void {
    shConvId = id;
    shLineIdx = -1;
    stopShPlay();
    deps.dom.showPlayerView();
    renderShadowingPlayer();
  }

  function exitShadowingMode(): void {
    shPlaying = false;
    stopShPlay();
    deps.dom.hidePlayerView();
  }

  function exitShadowingPlayer(): void {
    stopShPlay();
    shConvId = null;
    deps.dom.hidePlayerView();
    renderShadowingList();
  }

  // ----- player view (app.js L1462-1519) ------------------------------------

  function renderShadowingPlayer(): void {
    const conv = getShConv();
    if (!conv) return;
    loadShTimes(conv);
    const isAudio = !!conv.audio;
    let html = '<div class="sh-header">';
    html += '<button class="sh-back" onclick="exitShadowingPlayer()">&#8592; Conversations</button>';
    html += '<div class="sh-title">' + conv.title + '</div>';
    html += '<div class="sh-card-title-th">' + conv.titleTh + '</div>';
    html += '<div class="sh-desc">' + conv.description + '</div></div>';
    if (isAudio) {
      html += '<audio id="shAudio" src="' + conv.audio + '" preload="metadata"></audio>';
      html += '<div class="sh-audio-controls">';
      html += '<button class="sh-play-all" id="shPlayAllBtn" onclick="toggleShPlayAll()">&#9654; Play</button>';
      html += '<button class="sh-stop-btn" id="shStopBtn" onclick="stopShPlay()" style="display:none">&#9632;</button>';
      html += '<button class="sh-sync-btn" id="shSyncBtn" onclick="toggleShSync()">&#9881; Sync</button>';
      html += '<div class="sh-indicator" id="shIndicator"></div>';
      html += '</div>';
      html += '<div class="sh-sync-panel" id="shSyncPanel" style="display:none">';
      html += '<p>Play the audio. Tap <b>MARK</b> at the start of each line to sync timestamps.</p>';
      html += '<button class="sh-sync-mark" id="shSyncMark" onclick="shSyncTap()">MARK line ' + (shSyncIdx + 1) + '</button>';
      html += '<button class="sh-sync-reset" onclick="resetShTimes()">Reset</button>';
      html += '</div>';
    } else {
      html += '<div class="sh-controls">';
      html += '<button class="sh-play-all" id="shPlayAllBtn" onclick="toggleShPlayAll()">&#9654; Play All</button>';
      html += '<button class="sh-stop-btn" id="shStopBtn" onclick="stopShPlay()" style="display:none">&#9632; Stop</button>';
      html += '<button class="sh-speed-btn" onclick="cycleShSpeed()">' + shSpeed + 'x</button>';
      html += '<div class="sh-indicator" id="shIndicator"></div></div>';
    }
    html += '<div class="sh-lines" id="shLines">';
    conv.lines.forEach((line, i) => {
      const isYou = line.speaker === 'B';
      html +=
        '<div class="sh-line' +
        (isYou ? ' sh-line-you' : '') +
        (i === shLineIdx ? ' active' : '') +
        '" onclick="playShLine(' +
        i +
        ')">';
      html += '<div class="sh-speaker">' + line.speakerLabel + '</div>';
      html += '<div class="sh-line-body">';
      if (isAudio) {
        html += '<div class="sh-es">' + line.es + '</div>';
        html += '<div class="sh-en">' + line.english + '</div>';
        if (line.t) html += '<div class="sh-time">' + formatTime(line.t) + '</div>';
      } else {
        html += '<div class="sh-thai">' + line.thai + '</div>';
        html += '<div class="sh-es">' + line.es + '</div>';
        html += '<div class="sh-tone">' + deps.renderTone((line as { tone?: string }).tone) + '</div>';
        html += '<div class="sh-en">' + line.english + '</div>';
        html += '<div class="sh-sp">' + line.spanish + '</div>';
      }
      html += '</div><div class="sh-play-icon">&#9654;</div></div>';
    });
    html += '</div>';
    deps.dom.setPlayerHtml(html);
    if (isAudio) {
      const a = deps.dom.getAudio();
      if (a) {
        a.addEventListener('timeupdate', shAudioTimeUpdate);
        a.addEventListener('ended', stopShPlay);
        a.addEventListener('play', () => {
          shPlaying = true;
          updateShPlayBtn();
        });
        a.addEventListener('pause', () => {
          if (!shSyncing) {
            shPlaying = false;
            updateShPlayBtn();
          }
        });
      }
    }
  }

  function formatTime(s: number): string {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return m + ':' + (sec < 10 ? '0' : '') + sec;
  }

  // ----- per-line timestamps (app.js L1526-1546) ---------------------------

  function loadShTimes(conv: ShadowingConversation): void {
    const times = shTimesStore.get(conv.id);
    if (times && times.length) {
      conv.lines.forEach((l, i) => {
        if (times[i] != null) l.t = times[i];
      });
    }
  }

  function saveShTimes(): void {
    const conv = getShConv();
    if (!conv) return;
    const times = conv.lines.map((l) => l.t || 0);
    shTimesStore.set(conv.id, times);
  }

  function resetShTimes(): void {
    const conv = getShConv();
    if (!conv) return;
    conv.lines.forEach((l) => {
      l.t = 0;
    });
    shTimesStore.remove(conv.id);
    shSyncIdx = 0;
    renderShadowingPlayer();
  }

  // ----- playback (app.js L1548-1606) ---------------------------------------

  function playShLine(idx: number): void {
    const conv = getShConv();
    if (!conv || idx < 0 || idx >= conv.lines.length) return;
    shLineIdx = idx;
    updateShHighlight();
    if (conv.audio) {
      const a = deps.dom.getAudio();
      if (a && conv.lines[idx].t) a.currentTime = conv.lines[idx].t;
      if (a && a.paused) {
        a.play();
        shPlaying = true;
        updateShPlayBtn();
      }
    } else {
      deps.stopCurrentAudio();
      deps.speakText(conv.lines[idx].thai);
    }
  }

  function updateShHighlight(): void {
    const lines = deps.dom.queryLines();
    lines.forEach((el, i) => el.classList.toggle('active', i === shLineIdx));
    if (lines[shLineIdx]) {
      lines[shLineIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function toggleShPlayAll(): void {
    const conv = getShConv();
    if (conv && conv.audio) {
      const a = deps.dom.getAudio();
      if (!a) return;
      if (shPlaying) {
        a.pause();
        shPlaying = false;
      } else {
        a.play();
        shPlaying = true;
      }
      updateShPlayBtn();
    } else {
      if (shPlaying) stopShPlay();
      else startShPlay(shLineIdx >= 0 ? shLineIdx : 0);
    }
  }

  function shAudioTimeUpdate(): void {
    const conv = getShConv();
    if (!conv) return;
    const a = deps.dom.getAudio();
    if (!a) return;
    const t = a.currentTime;
    let newIdx = -1;
    for (let i = 0; i < conv.lines.length; i++) {
      if (conv.lines[i].t && t >= conv.lines[i].t) newIdx = i;
      else if (conv.lines[i].t && t < conv.lines[i].t) break;
    }
    if (newIdx >= 0 && newIdx !== shLineIdx) {
      shLineIdx = newIdx;
      updateShHighlight();
    }
    const ind = deps.dom.getById('shIndicator');
    if (ind) ind.textContent = formatTime(t);
  }

  function updateShPlayBtn(): void {
    const btn = deps.dom.getById('shPlayAllBtn') as HTMLButtonElement | null;
    if (!btn) return;
    const stop = deps.dom.getById('shStopBtn');
    if (shPlaying) {
      btn.innerHTML = '&#9208; Pause';
      btn.style.background = '#0f3460';
      btn.style.color = '#ffd166';
      if (stop) stop.style.display = '';
    } else {
      btn.innerHTML = '&#9654; Play';
      btn.style.background = '#e94560';
      btn.style.color = '#fff';
      if (stop) stop.style.display = 'none';
    }
  }

  // ----- tap-to-sync (app.js L1612-1653) ------------------------------------

  function toggleShSync(): void {
    shSyncing = !shSyncing;
    const panel = deps.dom.getById('shSyncPanel');
    const btn = deps.dom.getById('shSyncBtn') as HTMLButtonElement | null;
    if (shSyncing) {
      if (panel) panel.style.display = '';
      if (btn) {
        btn.style.background = '#ffd166';
        btn.style.color = '#0f3460';
      }
      shSyncIdx = 0;
      updateSyncMarkBtn();
      const a = deps.dom.getAudio();
      if (a) {
        a.currentTime = 0;
        a.play();
      }
    } else {
      if (panel) panel.style.display = 'none';
      if (btn) {
        btn.style.background = '';
        btn.style.color = '';
      }
      const a = deps.dom.getAudio();
      if (a) a.pause();
    }
  }

  function updateSyncMarkBtn(): void {
    const conv = getShConv();
    const btn = deps.dom.getById('shSyncMark') as HTMLButtonElement | null;
    if (btn && conv) {
      btn.textContent = 'MARK line ' + (shSyncIdx + 1) + ' / ' + conv.lines.length;
      btn.disabled = shSyncIdx >= conv.lines.length;
    }
  }

  function shSyncTap(): void {
    const conv = getShConv();
    if (!conv) return;
    const a = deps.dom.getAudio();
    if (!a) return;
    if (shSyncIdx >= conv.lines.length) return;
    conv.lines[shSyncIdx].t = Math.round(a.currentTime * 10) / 10;
    saveShTimes();
    shSyncIdx++;
    shLineIdx = shSyncIdx - 1;
    updateShHighlight();
    updateSyncMarkBtn();
    if (shSyncIdx >= conv.lines.length) {
      const markBtn = deps.dom.getById('shSyncMark') as HTMLButtonElement | null;
      if (markBtn) markBtn.textContent = 'DONE — synced!';
    }
  }

  // ----- TTS auto-loop (app.js L1655-1688) ----------------------------------

  function startShPlay(fromIdx: number): void {
    if (!getShConv()) return;
    shPlaying = true;
    const btn = deps.dom.getById('shPlayAllBtn') as HTMLButtonElement | null;
    if (btn) {
      btn.innerHTML = '&#9208; Pause';
      btn.style.background = '#0f3460';
      btn.style.color = '#ffd166';
    }
    const stop = deps.dom.getById('shStopBtn');
    if (stop) stop.style.display = '';
    shPlayNext(fromIdx);
  }

  function shPlayNext(idx: number): void {
    const conv = getShConv();
    if (!shPlaying || !conv || idx >= conv.lines.length) {
      stopShPlay();
      return;
    }
    shLineIdx = idx;
    updateShHighlight();
    const ind = deps.dom.getById('shIndicator');
    if (ind) ind.textContent = idx + 1 + ' / ' + conv.lines.length;
    deps.stopCurrentAudio();
    const line: ShadowingLine = conv.lines[idx];
    deps.speakText(line.thai, () => {
      if (!shPlaying) return;
      shTimeout = setTimeout(() => {
        shPlayNext(idx + 1);
      }, Math.round(2500 / shSpeed));
    });
  }

  function stopShPlay(): void {
    shPlaying = false;
    if (shTimeout !== null) {
      clearTimeout(shTimeout);
      shTimeout = null;
    }
    const conv = getShConv();
    if (conv && conv.audio) {
      const a = deps.dom.getAudio();
      if (a) a.pause();
    } else {
      deps.stopCurrentAudio();
    }
    const btn = deps.dom.getById('shPlayAllBtn') as HTMLButtonElement | null;
    if (btn) {
      btn.innerHTML = '&#9654; Play All';
      btn.style.background = '#e94560';
      btn.style.color = '#fff';
    }
    const stop = deps.dom.getById('shStopBtn');
    if (stop) stop.style.display = 'none';
    const ind = deps.dom.getById('shIndicator');
    if (ind) ind.textContent = '';
  }

  function cycleShSpeed(): void {
    const speeds = [1, 1.5, 2, 0.75];
    const i = speeds.indexOf(shSpeed);
    shSpeed = speeds[(i + 1) % speeds.length];
    renderShadowingPlayer();
  }

  return {
    renderShadowingList,
    openShadowing,
    exitShadowingMode,
    exitShadowingPlayer,
    renderShadowingPlayer,
    playShLine,
    toggleShPlayAll,
    startShPlay,
    stopShPlay,
    shAudioTimeUpdate,
    cycleShSpeed,
    toggleShSync,
    shSyncTap,
    resetShTimes,
    getShConvId: () => shConvId,
    getShLineIdx: () => shLineIdx,
    isShPlaying: () => shPlaying,
    getShSpeed: () => shSpeed,
    isShSyncing: () => shSyncing,
  };
}

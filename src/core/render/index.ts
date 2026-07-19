// Public surface for the render module (word-breakdown + Solo Leveling HUD).

export {
  __resetWordDictForTests,
  buildWordDict,
  renderWB,
  translateWords,
} from './wordDict';
export type { TranslatedWord, WordDict, WordDictEntry } from './wordDict';

// Solo Leveling Phase 2: HUD mount + boot wiring.
export {
  __resetSlHudForTests,
  mountSlHud,
  renderSlHud,
  wireSlHud,
} from './slHud';

// Solo Leveling Phase 4: Status Window overlay.
export {
  __resetSlStatusWindowForTests,
  closeSlStatusWindow,
  mountSlStatusWindow,
  openSlStatusWindow,
  wireSlStatusWindow,
} from './slStatusWindow';

// Solo Leveling Phase 5: Daily Quests panel.
export {
  __resetSlQuestsForTests,
  mountSlQuests,
  renderSlQuests,
  wireSlQuests,
} from './slQuests';

// Solo Leveling Phase 6: Notifications + rank-up modal.
export {
  __resetSlNotificationsForTests,
  mountSlNotifications,
  pushSlNotification,
  wireSlNotifications,
} from './slNotifications';
export type { SlNotificationOptions } from './slNotifications';
export {
  __resetSlLevelUpModalForTests,
  mountSlLevelUpModal,
  showSlLevelUpModal,
  wireSlLevelUpModal,
} from './slLevelUpModal';

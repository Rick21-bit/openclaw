const PREFIX = 'openclaw_';

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
}

export const loadSettings = (defaults) => load('settings', defaults);
export const saveSettings = (s) => save('settings', s);
export const loadSkillState = () => load('skills', {});
export const saveSkillState = (s) => save('skills', s);
export const loadMemory = () => load('memory', []);
export const saveMemory = (m) => save('memory', m);
export const loadChannelState = () => load('channels', {});
export const saveChannelState = (c) => save('channels', c);

const CONFIG_KEY = 'aeli.config.json';

export const DEFAULT_CONFIG = {
  preferredName: '',
  pronouns: '',
  age: '',
  zip: '',
  personality: 'nicest',
};

export function loadAeliConfig() {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveAeliConfig(config) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

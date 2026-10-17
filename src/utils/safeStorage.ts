// Safe storage helper with in-memory fallback for restricted third-party iframe and cookie environments
const inMemoryStore = new Map<string, string>();

export const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {
      // Third-party cookie / storage access blocked in iframe
      console.warn(`[SafeStorage] localStorage read blocked for key "${key}", using fallback memory.`, e);
    }
    return inMemoryStore.get(key) || null;
  },

  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
        return;
      }
    } catch (e) {
      // Third-party cookie / storage access blocked in iframe
      console.warn(`[SafeStorage] localStorage write blocked for key "${key}", storing in fallback memory.`, e);
    }
    inMemoryStore.set(key, value);
  },

  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
        return;
      }
    } catch (e) {
      console.warn(`[SafeStorage] localStorage remove blocked for key "${key}".`, e);
    }
    inMemoryStore.delete(key);
  },
};

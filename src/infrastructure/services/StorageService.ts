/** localStorage/sessionStorage abstraction. */
export const StorageService = {
  getItem(key: string) {
    return window.localStorage.getItem(key);
  },
  setItem(key: string, value: string) {
    window.localStorage.setItem(key, value);
  },
  removeItem(key: string) {
    window.localStorage.removeItem(key);
  },
  getSessionItem(key: string) {
    return window.sessionStorage.getItem(key);
  },
  setSessionItem(key: string, value: string) {
    window.sessionStorage.setItem(key, value);
  },
  removeSessionItem(key: string) {
    window.sessionStorage.removeItem(key);
  },
};

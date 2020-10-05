
export default class PreferencesService {
  constructor({ onDarkModeChanged }) {
    this.darkMode = localStorage.getItem("darkMode") === '1';
    this.onDarkModeChanged = onDarkModeChanged;
  }

  setDarkMode(enabled) {
    this.darkMode = enabled;
    this.onDarkModeChanged(enabled);
    localStorage.setItem("darkMode", enabled ? '1' : '0');
  }

  isDarkModeEnabled() {
    return this.darkMode;
  }
}

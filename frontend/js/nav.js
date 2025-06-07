import { toggleDarkMode, applySavedTheme } from './utils.js';

export function initNav() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleDarkMode);
    }
    applySavedTheme();
}
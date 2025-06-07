// frontend/js/utils.js
export function toggleDarkMode() {
    const body = document.body;
    const isDarkMode = body.classList.contains('dark-mode');
    body.classList.toggle('dark-mode', !isDarkMode);
    body.classList.toggle('light-mode', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'light' : 'dark');
}

export function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const body = document.body;
    body.classList.add(savedTheme === 'dark' ? 'dark-mode' : 'light-mode');
}
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

export const BASE_URL = 'https://vrentals-backend.onrender.com/api'; // Use this for production
// For local testing, comment the above and uncomment the below
// export const BASE_URL = 'http://localhost:5000/api';
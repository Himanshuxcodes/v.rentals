import { initNav } from './nav.js';

const BASE_URL = 'https://vrentals-backend.onrender.com/api'; // Use this for production
// For local testing, comment the above and uncomment the below
// const BASE_URL = 'http://localhost:5000/api';

function showRegister() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
}

function showLogin() {
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
}

async function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
            localStorage.setItem('isAdmin', data.isAdmin); // Added
            localStorage.setItem('userId', data.userId); // Added
            window.location.href = 'index.html';
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert(`Error connecting to the server: ${error.message}`);
    }
}

async function register() {
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    if (!username || !email || !password) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        const data = await response.json();
        if (response.ok) {
            alert('Registration successful! Please login.');
            showLogin();
        } else {
            alert(data.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Register error:', error);
        alert(`Error connecting to the server: ${error.message}`);
    }
}

// Attach event listeners
document.getElementById('login-button').addEventListener('click', login);
document.getElementById('register-button').addEventListener('click', register);
document.getElementById('show-register').addEventListener('click', showRegister);
document.getElementById('show-login').addEventListener('click', showLogin);

initNav();
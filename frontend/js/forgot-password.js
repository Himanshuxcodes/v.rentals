import { initNav } from './nav.js';

const BASE_URL = 'https://vrentals-backend.onrender.com/api'; // Use this for production
// For local testing, comment the above and uncomment the below
// const BASE_URL = 'http://localhost:5000/api';

let currentEmail = '';

async function sendOTP() {
    const email = document.getElementById('email').value;
    if (!email) {
        alert('Please enter an email');
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        const data = await response.json();
        alert(data.message || 'Failed to send OTP');
        if (response.ok) {
            currentEmail = email;
            document.getElementById('step-email').classList.remove('active');
            document.getElementById('step-otp').classList.add('active');
        }
    } catch (error) {
        console.error('Send OTP error:', error);
        alert(`Error connecting to the server: ${error.message}`);
    }
}

async function verifyOTP() {
    const otp = document.getElementById('otp').value;
    if (!otp) {
        alert('Please enter the OTP');
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/verify-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: currentEmail, otp })
        });
        const data = await response.json();
        alert(data.message || 'Failed to verify OTP');
        if (response.ok) {
            document.getElementById('step-otp').classList.remove('active');
            document.getElementById('step-password').classList.add('active');
        }
    } catch (error) {
        console.error('Verify OTP error:', error);
        alert(`Error connecting to the server: ${error.message}`);
    }
}

async function resetPassword() {
    const newPassword = document.getElementById('new-password').value;
    if (!newPassword) {
        alert('Please enter a new password');
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: currentEmail, otp: document.getElementById('otp').value, newPassword })
        });
        const data = await response.json();
        alert(data.message || 'Failed to reset password');
        if (response.ok) {
            window.location.href = 'auth.html';
        }
    } catch (error) {
        console.error('Reset password error:', error);
        alert(`Error connecting to the server: ${error.message}`);
    }
}

// Attach event listeners
document.getElementById('send-otp-button').addEventListener('click', sendOTP);
document.getElementById('verify-otp-button').addEventListener('click', verifyOTP);
document.getElementById('reset-password-button').addEventListener('click', resetPassword);

initNav();
import { initNav } from './nav.js';

const BASE_URL = 'https://vrentals-backend.onrender.com/api'; // Use this for production
// For local testing, comment the above and uncomment the below
// const BASE_URL = 'http://localhost:5000/api';

function renderAuthButtons() {
    const authButtons = document.getElementById('auth-buttons');
    const token = localStorage.getItem('token');
    if (token) {
        authButtons.innerHTML = `
            <button id="add-property-button">Add Property</button>
            <button id="logout-button">Logout</button>
        `;
        document.getElementById('add-property-button').addEventListener('click', () => {
            window.location.href = 'add-property.html';
        });
        document.getElementById('logout-button').addEventListener('click', logout);
    } else {
        authButtons.innerHTML = `
            <button id="login-register-button">Login/Register</button>
            <button id="add-property-button">Add Property</button>
        `;
        document.getElementById('login-register-button').addEventListener('click', () => {
            window.location.href = 'auth.html';
        });
        document.getElementById('add-property-button').addEventListener('click', () => {
            window.location.href = 'add-property.html';
        });
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    renderAuthButtons();
    window.location.href = 'auth.html';
}

async function markAsSold(propertyId) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to mark a property as sold');
        window.location.href = 'auth.html';
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/properties/${propertyId}/sold`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            renderProperties();
        } else {
            alert(data.message || 'Failed to mark as sold');
        }
    } catch (error) {
        console.error('Mark as sold error:', error);
        alert(`Error connecting to the server: ${error.message}`);
    }
}

async function markAsAvailable(propertyId) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to mark a property as available');
        window.location.href = 'auth.html';
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/properties/${propertyId}/available`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            renderProperties();
        } else {
            alert(data.message || 'Failed to mark as available');
        }
    } catch (error) {
        console.error('Mark as available error:', error);
        alert(`Error connecting to the server: ${error.message}`);
    }
}

async function renderProperties() {
    try {
        const response = await fetch(`${BASE_URL}/properties`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            }
        });
        const properties = await response.json();
        const propertiesGrid = document.getElementById('properties-grid');
        const token = localStorage.getItem('token');
        propertiesGrid.innerHTML = '';
        properties.forEach(property => {
            const propertyCard = document.createElement('div');
            propertyCard.classList.add('property-card');
            if (property.sold) {
                propertyCard.classList.add('sold');
            }
            propertyCard.innerHTML = `
                <img src="${property.image}" alt="${property.title}">
                <div class="property-info">
                    <h3>${property.title}</h3>
                    <p>${property.description}</p>
                    ${property.sold ? '<p class="not-available">NOT AVAILABLE!</p>' : ''}
                    <p class="price">${property.price}</p>
                    <p class="contact">Contact: ${property.contactNumber}</p>
                    <button class="inquire-button" data-contact="${property.contactNumber}" data-title="${property.title}">Inquire Now</button>
                    ${token && !property.sold ? `<button class="mark-sold-button" data-id="${property._id}">Mark as Sold</button>` : ''}
                    ${token && property.sold ? `<button class="mark-available-button" data-id="${property._id}">Mark as Available</button>` : ''}
                </div>
            `;
            propertiesGrid.appendChild(propertyCard);
        });

        // Attach event listeners for dynamic buttons
        document.querySelectorAll('.inquire-button').forEach(button => {
            button.addEventListener('click', () => {
                const contact = button.dataset.contact;
                const title = button.dataset.title;
                alert(`Contact ${contact} for more details about ${title}!`);
            });
        });
        document.querySelectorAll('.mark-sold-button').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.dataset.id;
                markAsSold(id);
            });
        });
        document.querySelectorAll('.mark-available-button').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.dataset.id;
                markAsAvailable(id);
            });
        });
    } catch (error) {
        console.error('Fetch properties error:', error);
        alert(`Error connecting to the server: ${error.message}`);
    }
}

initNav();
renderAuthButtons();
renderProperties();
import { initNav } from './nav.js';

const BASE_URL = 'https://vrentals-backend.onrender.com/api'; // Use this for production
// For local testing, comment the above and uncomment the below
// const BASE_URL = 'http://localhost:5000/api';

async function addProperty() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to add a property');
        window.location.href = 'auth.html';
        return;
    }

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const contactNumber = document.getElementById('contactNumber').value;
    const image = document.getElementById('image').files[0];

    if (!title || !description || !price || !contactNumber || !image) {
        alert('Please fill in all fields and upload an image');
        return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('contactNumber', contactNumber);
    formData.append('image', image);

    try {
        const response = await fetch(`${BASE_URL}/properties`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        const data = await response.json();
        if (response.ok) {
            alert(data.message || 'Property added successfully');
            window.location.href = 'index.html';
        } else {
            alert(data.message || 'Failed to add property');
        }
    } catch (error) {
        console.error('Add property error:', error);
        alert(`Error connecting to the server: ${error.message}`);
    }
}

// Attach event listener
document.getElementById('add-property-button').addEventListener('click', addProperty);

initNav();
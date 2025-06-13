import { initNav } from './nav.js';

const BASE_URL = 'https://vrentals-backend.onrender.com/api'; // Use this for production
// For local testing, comment the above and uncomment the below
// const BASE_URL = 'http://localhost:5000/api';

async function initAdminDashboard() {
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  if (!token || !isAdmin) {
    alert('Admin access required');
    window.location.href = 'index.html';
    return;
  }

  try {
    // Fetch overview data
    const [usersRes, propertiesRes] = await Promise.all([
      fetch(`${BASE_URL}/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }),
      fetch(`${BASE_URL}/properties`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
    ]);
    const users = await usersRes.json();
    const properties = await propertiesRes.json();

    // Update overview
    document.getElementById('total-users').textContent = users.length;
    document.getElementById('total-properties').textContent = properties.length;

    // Render users
    const usersTableBody = document.querySelector('#users-table tbody');
    usersTableBody.innerHTML = '';
    users.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.isAdmin ? 'Admin' : 'User'}</td>
        <td>
          <button class="toggle-admin" data-id="${user._id}" data-isadmin="${user.isAdmin}">
            ${user.isAdmin ? 'Demote' : 'Promote'}
          </button>
          <button class="delete-user" data-id="${user._id}">Delete</button>
        </td>
      `;
      usersTableBody.appendChild(row);
    });

    // Render properties
    const propertiesTableBody = document.querySelector('#properties-table tbody');
    propertiesTableBody.innerHTML = '';
    properties.forEach(property => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${property.title}</td>
        <td>${property.price}</td>
        <td>${property.sold ? 'Sold' : 'Available'}</td>
        <td>
          <button class="edit-property" data-id="${property._id}">Edit</button>
          <button class="delete-property" data-id="${property._id}">Delete</button>
          <button class="toggle-status" data-id="${property._id}" data-sold="${property.sold}">
            Mark as ${property.sold ? 'Available' : 'Sold'}
          </button>
        </td>
      `;
      propertiesTableBody.appendChild(row);
    });

    // Event listeners
    document.querySelectorAll('.toggle-admin').forEach(button => {
      button.addEventListener('click', async () => {
        const id = button.dataset.id;
        const isAdmin = button.dataset.isadmin === 'true';
        try {
          const res = await fetch(`${BASE_URL}/users/${id}/admin`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ isAdmin: !isAdmin })
          });
          const data = await res.json();
          alert(data.message);
          initAdminDashboard();
        } catch (error) {
          alert(`Error: ${error.message}`);
        }
      });
    });

    document.querySelectorAll('.delete-user').forEach(button => {
      button.addEventListener('click', async () => {
        if (confirm('Delete user and their properties?')) {
          const id = button.dataset.id;
          try {
            const res = await fetch(`${BASE_URL}/users/${id}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            alert(data.message);
            initAdminDashboard();
          } catch (error) {
            alert(`Error: ${error.message}`);
          }
        }
      });
    });

    document.querySelectorAll('.edit-property').forEach(button => {
      button.addEventListener('click', () => {
        const id = button.dataset.id;
        // Placeholder for edit form
        alert(`Edit property ${id} (implement form in future)`);
      });
    });

    document.querySelectorAll('.delete-property').forEach(button => {
      button.addEventListener('click', async () => {
        if (confirm('Delete property?')) {
          const id = button.dataset.id;
          try {
            const res = await fetch(`${BASE_URL}/properties/${id}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            alert(data.message);
            initAdminDashboard();
          } catch (error) {
            alert(`Error: ${error.message}`);
          }
        }
      });
    });

    document.querySelectorAll('.toggle-status').forEach(button => {
      button.addEventListener('click', async () => {
        const id = button.dataset.id;
        const sold = button.dataset.sold === 'true';
        try {
          const res = await fetch(`${BASE_URL}/properties/${id}/${sold ? 'available' : 'sold'}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          const data = await res.json();
          alert(data.message);
          initAdminDashboard();
        } catch (error) {
          alert(`Error: ${error.message}`);
        }
      });
    });

  } catch (error) {
    console.error('Admin dashboard error:', error);
    alert(`Error: ${error.message}`);
  }
}

initNav();
initAdminDashboard();
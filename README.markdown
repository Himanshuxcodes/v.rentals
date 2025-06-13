V.Rentals
A simple web app for renting and managing properties. Users can browse listings, add their own properties, mark them as sold or available, and handle accounts with login and password reset. Admins get extra tools to manage users and properties.


What’s Inside
Browse Properties: See details like title, price, and contact info.
Add Listings: Logged-in users can post properties with photos.
Mark Sold/Available: Only the property owner or admins can toggle this.
Login/Register: Create an account or sign in.
Password Reset: Get an OTP email to reset your password.
Admin Dashboard: Admins can manage users (promote/demote, delete) and properties (edit, delete).
Dark/Light Mode: Switch themes, and it remembers your choice.
Mobile-Friendly: Works great on phones and desktops.

Tech Used
Frontend: HTML, CSS, JavaScript (ES Modules)
Backend: Node.js, Express.js, MongoDB (Mongoose), JWT for login
Extras: Nodemailer (for emails), Multer (for image uploads), MongoDB Atlas (database)
Tools: live-server (frontend), npm


     ## File Structure
     ```
     vrentals/
     ├── backend/
     │   ├── Uploads/                # Directory for uploaded images
     │   ├── node_modules/           # Backend dependencies
     │   ├── package.json            # Backend dependencies and scripts
     │   ├── package-lock.json
     │   └── server.js               # Backend server logic
     ├── frontend/
     │   ├── css/                    # Stylesheets
     │   │   ├── add-property.css
     │   │   ├── auth.css
     │   │   ├── forgot-password.css
     │   │   ├── index.css
     │   │   └── styles.css
     │   ├── js/                     # JavaScript modules
     │   │   ├── add-property.js
     │   │   ├── admin.js
     │   │   ├── auth.js
     │   │   ├── forgot-password.js
     │   │   ├── index.js
     │   │   ├── nav.js
     │   │   └── utils.js
     │   ├── add-property.html       # Add property page
     │   ├── admin.html
     │   ├── auth.html               # Login/register page
     │   ├── forgot-password.html    # Password reset page
     │   ├── index.html              # Home page with property listings
     │   ├── package.json            # Frontend dependencies
     │   └── package-lock.json
     ├── .env                        # Environment variables
     └── README.md                   # Project documentation
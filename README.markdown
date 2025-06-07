# V.Rentals

     A full-stack web application for listing, renting, and managing properties. Users can browse properties, add new listings, mark properties as sold or available, and manage accounts with authentication and password reset functionality.

     ## Table of Contents
     - [Features](#features)
     - [Technologies](#technologies)
     - [File Structure](#file-structure)
     - [Prerequisites](#prerequisites)
     - [Installation](#installation)
     - [Configuration](#configuration)
     - [Running the Application](#running-the-application)
     - [Usage](#usage)
     - [API Endpoints](#api-endpoints)
     - [Troubleshooting](#troubleshooting)
     - [Contributing](#contributing)
     - [License](#license)

     ## Features
     - **Property Listings**: View properties with details like title, description, price, and contact number.
     - **Add Properties**: Authenticated users can add new properties with images.
     - **Mark Sold/Available**: Toggle properties between sold and available states.
     - **User Authentication**: Register, login, and logout functionality.
     - **Password Reset**: Forgot password feature with OTP-based email verification.
     - **Dark/Light Mode**: Toggle between themes with persistent user preference.
     - **Responsive Design**: Mobile-friendly UI with a grid-based property layout.

     ## Technologies
     - **Frontend**:
       - HTML5, CSS3, JavaScript (ES Modules)
       - Custom CSS with theme variables for dark/light modes
     - **Backend**:
       - Node.js with Express.js
       - MongoDB with Mongoose
       - JWT for authentication
       - Nodemailer for OTP emails
       - Multer for image uploads
     - **Database**: MongoDB Atlas
     - **Tools**: live-server (frontend), npm (package management)

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
     │   │   ├── auth.js
     │   │   ├── forgot-password.js
     │   │   ├── index.js
     │   │   ├── nav.js
     │   │   └── utils.js
     │   ├── add-property.html       # Add property page
     │   ├── auth.html               # Login/register page
     │   ├── forgot-password.html    # Password reset page
     │   ├── index.html              # Home page with property listings
     │   ├── package.json            # Frontend dependencies
     │   └── package-lock.json
     ├── .env                        # Environment variables
     └── README.md                   # Project documentation
     ```

     ## Prerequisites
     - **Node.js** (v14 or higher)
     - **MongoDB Atlas** account
     - **Gmail account** for Nodemailer (or another email service)
     - **Text editor** (e.g., VS Code)
     - **Terminal** (e.g., Command Prompt, Bash)
     - **Browser** (e.g., Chrome, Firefox)

     ## Installation
     1. **Clone the Repository**:
        ```bash
        git clone https://github.com/your-username/vrentals.git
        cd vrentals
        ```

     2. **Install Backend Dependencies**:
        ```bash
        cd backend
        npm install
        ```

     3. **Install Frontend Dependencies**:
        ```bash
        cd ../frontend
        npm install
        ```

     ## Configuration
     1. **Create a `.env` File** in the project root:
        ```env
        MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/vrentals?retryWrites=true&w=majority
        JWT_SECRET=your_jwt_secret_key
        EMAIL_USER=your_gmail_address
        EMAIL_PASS=your_gmail_app_password
        PORT=5000
        ```
        - Replace `<username>` and `<password>` with your MongoDB Atlas credentials.
        - Generate a secure `JWT_SECRET` (e.g., a random 32-character string).
        - Use a Gmail App Password for `EMAIL_PASS` (enable 2FA and generate via Google Account settings).
        - Ensure your IP is whitelisted in MongoDB Atlas' Network Access.

     2. **Set Up MongoDB Atlas**:
        - Create a cluster in MongoDB Atlas.
        - Create a database named `vrentals`.
        - Note: The backend seeds initial properties on first connection if the `properties` collection is empty.

     ## Running the Application
     1. **Start the Backend**:
        ```bash
        cd backend
        node server.js
        ```
        - Should log: “Connected to MongoDB” and “Server running on port 5000”.

     2. **Start the Frontend**:
        ```bash
        cd ../frontend
        npx live-server
        ```
        - Opens a browser at `http://localhost:8080` (or another port if 8080 is in use).

     ## Usage
     1. **Home Page (`index.html`)**:
        - View all properties with details.
        - Logged-in users can mark properties as sold or available.
        - Click "Inquire Now" to see contact details.
        - Toggle dark/light mode with the 🌙 icon.
        - Click ✉️ to email the admin.

     2. **Login/Register (`auth.html`)**:
        - Register a new account or log in.
        - Click "Forgot Password?" for OTP-based password reset.

     3. **Add Property (`add-property.html`)**:
        - Logged-in users can add properties with title, description, price, contact number, and image.

     4. **Forgot Password (`forgot-password.html`)**:
        - Enter email to receive OTP, verify OTP, and reset password.

     ## API Endpoints
     - **POST /api/register**: Register a new user (`username`, `email`, `password`).
     - **POST /api/login**: Log in and receive JWT (`email`, `password`).
     - **POST /api/forgot-password**: Send OTP for password reset (`email`).
     - **POST /api/verify-otp**: Verify OTP (`email`, `otp`).
     - **POST /api/reset-password**: Reset password (`email`, `otp`, `newPassword`).
     - **POST /api/properties**: Add a property (requires JWT, `title`, `description`, `price`, `contactNumber`, `image`).
     - **GET /api/properties**: Fetch all properties (contact numbers hidden for unauthenticated users).
     - **PUT /api/properties/:id/sold**: Mark a property as sold (requires JWT).
     - **PUT /api/properties/:id/available**: Mark a property as available (requires JWT).

     ## Troubleshooting
     - **Backend Errors**:
       - **MongoDB Connection**: Verify `MONGO_URI` and IP whitelist in MongoDB Atlas.
       - **Nodemailer**: Ensure `EMAIL_USER` and `EMAIL_PASS` are correct; check spam/junk for OTP emails.
       - **API 500 Errors**: Check `server.js` logs in terminal.
       - Test endpoints:
         ```bash
         curl http://localhost:5000/api/properties
         ```

     - **Frontend Errors**:
       - **Buttons Not Working**: Check console (F12) for errors (e.g., “function not defined”).
       - **Properties Not Loading**: Verify backend is running and Network tab shows successful `/api/properties` request.
       - Clear browser cache (Ctrl+Shift+R).

     - **Other Issues**:
       - Ensure all files match the provided structure.
       - Reseed database if properties are missing (drop `properties` collection, restart `server.js`).
       - Contact admin via email icon (✉️) for support.

     ## Contributing
     1. Fork the repository.
     2. Create a feature branch (`git checkout -b feature-name`).
     3. Commit changes (`git commit -m "Add feature"`).
     4. Push to the branch (`git push origin feature-name`).
     5. Open a pull request.

     ## License
     MIT License. See [LICENSE](LICENSE) for details.

     ---
     **Contact**: Reach out via the email icon (✉️) in the app or open an issue on GitHub.
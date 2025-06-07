const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');
const cloudinary = require("cloudinary").v2;
const fs = require('fs');

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
app.use(cors({ origin: 'https://vrental.netlify.app' }));
app.use(express.json());

// Multer setup for temporary image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Create uploads directory if it doesn't exist
if (!fs.existsSync('Uploads')) {
  fs.mkdirSync('Uploads');
}

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// OTP Schema
const OTPSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 } // Expires in 10 minutes
});

const OTP = mongoose.model('OTP', OTPSchema);

// User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

// Property Schema
const PropertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String, required: true },
  contactNumber: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sold: { type: Boolean, default: false }
}, { timestamps: true });

const Property = mongoose.model('Property', PropertySchema);

// Connect to MongoDB
if (!process.env.MONGO_URI || !process.env.MONGO_URI.includes('/test')) {
  console.error('Error: MONGO_URI is not defined or does not include /test database in .env file');
  process.exit(1);
}
console.log('MONGO_URI:', process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to MongoDB');
  // Seed properties
  const existingProperties = await Property.find();
  if (existingProperties.length === 0) {
    const seedProperties = [
      {
        title: "Cozy 1BHK Retreat in Chandigarh",
        description: "A compact 1BHK apartment in the heart of Chandigarh, perfect for singles or couples.",
        price: "₹7,000/month",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        contactNumber: "9876543210",
        userId: null,
        sold: false
      },
      {
        title: "Modern 1BHK Haven in Chandigarh",
        description: "Stylish 1BHK in Chandigarh with modern amenities, ideal for professionals.",
        price: "₹7,500/month",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        contactNumber: "9876543211",
        userId: null,
        sold: false
      },
      {
        title: "Spacious 2BHK Home in Chandigarh",
        description: "Comfortable 2BHK apartment in Chandigarh, great for small families.",
        price: "₹8,500/month",
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        contactNumber: "9876543212",
        userId: null,
        sold: false
      },
      {
        title: "Luxury 2BHK Suite in Chandigarh",
        description: "Elegant 2BHK in Chandigarh with premium furnishings and city views.",
        price: "₹9,000/month",
        image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        contactNumber: "9876543213",
        userId: null,
        sold: false
      },
      {
        title: "Grand 3BHK Villa in Chandigarh",
        description: "Spacious 3BHK villa in Chandigarh, perfect for large families.",
        price: "₹9,500/month",
        image: "https://images.unsplash.com/photo-1512917774080-9991f7c4c60d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        contactNumber: "9876543214",
        userId: null,
        sold: false
      },
      {
        title: "Premium 3BHK Residence in Chandigarh",
        description: "Luxurious 3BHK in Chandigarh with a large balcony and modern facilities.",
        price: "₹10,000/month",
        image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        contactNumber: "9876543215",
        userId: null,
        sold: false
      }
    ];
    await Property.insertMany(seedProperties);
    console.log('Seeded 6 properties');
  }
}).catch(err => console.error('MongoDB connection error:', err));

// Register Route
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Middleware to verify JWT
const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    req.userId = null;
    return next();
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    req.userId = null;
    next();
  }
};

// Forgot Password Route
app.post('/api/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Please provide an email' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.create({ email, otp });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP - V.Rentals',
      text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`
    };
    await transporter.sendMail(mailOptions);
    res.json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Verify OTP Route
app.post('/api/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Please provide email and OTP' });
    }
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset Password Route
app.post('/api/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Please provide email, OTP, and new password' });
    }
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    await OTP.deleteMany({ email });
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add Property Route with Cloudinary
app.post('/api/properties', authenticate, upload.single('image'), async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Please login to add a property' });
    }
    const { title, description, price, contactNumber } = req.body;
    if (!title || !description || !price || !contactNumber || !req.file) {
      return res.status(400).json({ message: 'Please fill in all fields and upload an image' });
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'vrentals_properties'
    });
    // Clean up local file after upload
    fs.unlinkSync(req.file.path);
    const property = new Property({
      title,
      description,
      price,
      image: result.secure_url,
      contactNumber,
      userId: req.userId,
      sold: false
    });
    await property.save();
    res.status(201).json({ message: 'Property added successfully', property });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get Properties Route
app.get('/api/properties', authenticate, async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });
    const response = properties.map(property => ({
      _id: property._id,
      title: property.title,
      description: property.description,
      price: property.price,
      image: property.image,
      contactNumber: req.userId ? property.contactNumber : 'Login to view contact number',
      userId: property.userId,
      sold: property.sold
    }));
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark Property as Sold Route
app.put('/api/properties/:id/sold', authenticate, async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Please login to mark a property as sold' });
    }
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    property.sold = true;
    await property.save();
    res.json({ message: 'Property marked as sold' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark Property as Available Route
app.put('/api/properties/:id/available', authenticate, async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Please login to mark a property as available' });
    }
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    property.sold = false;
    await property.save();
    res.json({ message: 'Property marked as available' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
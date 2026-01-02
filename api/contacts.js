const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');

// MongoDB Connection
let cachedDb = null;

async function connectDB() {
  if (cachedDb) {
    return cachedDb;
  }

  const conn = await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  });

  cachedDb = conn;
  return conn;
}

// Contact Schema
const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address'
      ]
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      unique: true,
      match: [
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
        'Please enter a valid phone number'
      ]
    },
    message: {
      type: String,
      trim: true,
      maxlength: [500, 'Message cannot exceed 500 characters']
    }
  },
  {
    timestamps: true
  }
);

const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

// CORS headers
const setCorsHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

// Main handler
module.exports = async (req, res) => {
  setCorsHeaders(res);

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectDB();

    // GET all contacts
    if (req.method === 'GET') {
      const contacts = await Contact.find().sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        data: contacts
      });
    }

    // POST create contact
    if (req.method === 'POST') {
      const { name, email, phone, message } = req.body;

      // Basic validation
      if (!name || !email || !phone) {
        return res.status(400).json({
          success: false,
          message: 'Name, email, and phone are required'
        });
      }

      // Check for duplicates
      const existingEmail = await Contact.findOne({ email: email.toLowerCase() });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'A contact with this email already exists'
        });
      }

      const existingPhone = await Contact.findOne({ phone });
      if (existingPhone) {
        return res.status(400).json({
          success: false,
          message: 'A contact with this phone number already exists'
        });
      }

      // Create contact
      const contact = new Contact({ name, email, phone, message });
      await contact.save();

      return res.status(201).json({
        success: true,
        message: 'Contact created successfully!',
        data: contact
      });
    }

    // DELETE contact
    if (req.method === 'DELETE') {
      const id = req.url.split('/').pop();
      
      const contact = await Contact.findByIdAndDelete(id);
      
      if (!contact) {
        return res.status(404).json({
          success: false,
          message: 'Contact not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Contact deleted successfully!'
      });
    }

    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

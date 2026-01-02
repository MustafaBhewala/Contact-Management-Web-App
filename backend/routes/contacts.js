const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');

// Validation middleware
const contactValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)
    .withMessage('Please enter a valid phone number'),
  body('message')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Message cannot exceed 500 characters')
];

// @route   POST /api/contacts
// @desc    Create a new contact
// @access  Public
router.post('/', contactValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const { name, email, phone, message } = req.body;

    // Check for duplicate email
    const existingEmail = await Contact.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'A contact with this email already exists'
      });
    }

    // Check for duplicate phone number
    const existingPhone = await Contact.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: 'A contact with this phone number already exists'
      });
    }

    // Create new contact
    const contact = new Contact({
      name,
      email,
      phone,
      message
    });

    await contact.save();

    res.status(201).json({
      success: true,
      message: 'Contact created successfully!',
      data: contact
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
      error: error.message
    });
  }
});

// @route   GET /api/contacts
// @desc    Get all contacts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
      error: error.message
    });
  }
});

// @route   DELETE /api/contacts/:id
// @desc    Delete a contact
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    await Contact.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully!',
      data: {}
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
      error: error.message
    });
  }
});

module.exports = router;

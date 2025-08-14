const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    const user = req.user;
    res.json({ 
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        first_name: user.displayFirstName,
        last_name: user.displayLastName,
        phone_number: user.phone_number || '',
        date_of_birth: user.date_of_birth || '',
        occupation: user.occupation || '',
        annual_income: user.annual_income || 0,
        risk_tolerance: user.risk_tolerance || 'moderate',
        created_at: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  body('first_name').optional().isString().withMessage('First name must be a string'),
  body('last_name').optional().isString().withMessage('Last name must be a string'),
  body('email').optional().isEmail().withMessage('Email must be valid'),
  body('phone_number').optional().isString().withMessage('Phone number must be a string'),
  body('date_of_birth').optional().isISO8601().withMessage('Date of birth must be a valid date'),
  body('occupation').optional().isString().withMessage('Occupation must be a string'),
  body('annual_income').optional().isFloat({ min: 0 }).withMessage('Annual income must be a positive number'),
  body('risk_tolerance').optional().isIn(['conservative', 'moderate', 'aggressive']).withMessage('Invalid risk tolerance')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      first_name,
      last_name,
      email,
      phone_number,
      date_of_birth,
      occupation,
      annual_income,
      risk_tolerance
    } = req.body;

    const updateFields = {};

    if (first_name !== undefined) updateFields.first_name = first_name;
    if (last_name !== undefined) updateFields.last_name = last_name;
    if (email !== undefined) updateFields.email = email;
    if (phone_number !== undefined) updateFields.phone_number = phone_number;
    if (date_of_birth !== undefined) updateFields.date_of_birth = date_of_birth;
    if (occupation !== undefined) updateFields.occupation = occupation;
    if (annual_income !== undefined) updateFields.annual_income = annual_income;
    if (risk_tolerance !== undefined) updateFields.risk_tolerance = risk_tolerance;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateFields,
      { new: true, runValidators: true }
    );

    res.json({ 
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        first_name: user.displayFirstName,
        last_name: user.displayLastName,
        phone_number: user.phone_number || '',
        date_of_birth: user.date_of_birth || '',
        occupation: user.occupation || '',
        annual_income: user.annual_income || 0,
        risk_tolerance: user.risk_tolerance || 'moderate',
        created_at: user.createdAt
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/users/password
// @desc    Change password
// @access  Private
router.put('/password', [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;

    // Verify current password
    const isMatch = await req.user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Update password
    req.user.password = newPassword;
    await req.user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 
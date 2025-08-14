const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  // Support both old and new field names
  first_name: {
    type: String,
    required: function() {
      return !this.firstName; // Only required if firstName doesn't exist
    },
    trim: true
  },
  last_name: {
    type: String,
    required: function() {
      return !this.lastName; // Only required if lastName doesn't exist
    },
    trim: true
  },
  // Keep old field names for backward compatibility
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  phone_number: {
    type: String,
    trim: true,
    default: ''
  },
  date_of_birth: {
    type: String,
    default: ''
  },
  occupation: {
    type: String,
    trim: true,
    default: ''
  },
  annual_income: {
    type: Number,
    default: 0
  },
  risk_tolerance: {
    type: String,
    enum: ['conservative', 'moderate', 'aggressive'],
    default: 'moderate'
  },
  profile_picture: {
    type: String,
    default: ''
  },
  is_active: {
    type: Boolean,
    default: true
  },
  last_login: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Virtual getters for consistent name access
userSchema.virtual('displayFirstName').get(function() {
  return this.first_name || this.firstName || '';
});

userSchema.virtual('displayLastName').get(function() {
  return this.last_name || this.lastName || '';
});

// Ensure virtuals are included in JSON output
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON response
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema); 
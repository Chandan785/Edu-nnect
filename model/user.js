const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  userType: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    required: true
  },
  semester: {
    type: String,
    default: null
  },
  department: {
    type: String,
    default: null
  },
  roleTitle: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Custom pre-save validation for required fields based on userType
userSchema.pre('save', function (next) {
  if (this.userType === 'student' && !this.semester) {
    return next(new Error('Semester is required for student'));
  }
  if (this.userType === 'teacher' && !this.department) {
    return next(new Error('Department is required for teacher'));
  }
  if (this.userType === 'admin' && !this.roleTitle) {
    return next(new Error('Role title is required for admin'));
  }
  next();
});

module.exports = mongoose.model('User', userSchema);

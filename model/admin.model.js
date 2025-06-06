// models/Admin.js
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    required: true,
    default: 'admin'
  },
  password: {
    type: String,
    required: true
  }
},{timestamps: true});

module.exports = mongoose.model('Admin', adminSchema);

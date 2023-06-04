const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  adminName: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'admin',
  },
});

module.exports = mongoose.model('admin', adminSchema);

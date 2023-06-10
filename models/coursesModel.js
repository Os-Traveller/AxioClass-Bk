const mongoose = require('mongoose');

const coursesSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  credit: { type: String, required: true },
  type: { type: String, required: true },
  semester: { type: Number, required: true },
  dept: { type: String, default: 'cse' },
});

module.exports = mongoose.model('course', coursesSchema);

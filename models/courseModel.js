const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  credit: { type: String, required: true },
  type: { type: String, required: true },
});

module.exports = mongoose.model('course', CourseSchema);

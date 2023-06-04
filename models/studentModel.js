const mongoose = require('mongoose');
const studentSchema = new mongoose.Schema({
  studentName: String,
  id: {
    type: String,
    unique: true,
  },
});

module.exports = mongoose.model('students', studentSchema);

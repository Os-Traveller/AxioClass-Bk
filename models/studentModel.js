const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  studentName: { type: String, required: true },
  dob: { type: Date, required: true },
  birthPlace: { type: String },
  guardianName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  ssc: { type: Number, required: true },
  hsc: { type: Number, required: true },
  graduate: { type: Boolean, default: false },
  demand: { type: Number, default: 36000 },
  paid: { type: Number, default: 0 },
  due: { type: Number, default: 36000 },
  waiver: { type: Number, default: 0 },
  dept: { type: String, default: 'CSE' },
  currentSemester: { type: String },
  image: String,
});

module.exports = mongoose.model('student', StudentSchema);

const mongoose = require('mongoose');

const educationSubSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  subject: { type: String, required: true },
  passingYear: { type: Number, required: true },
});

const TeacherSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  dob: { type: Date, required: true },
  birthPlace: { type: String },
  address: { type: String, required: true },
  dept: { type: String, default: 'CSE' },
  image: String,
  sex: { type: String, required: true, Option: 'male' | 'female' | 'other' },
  password: { type: String, required: true },
  joiningDate: { type: Date, immutable: true, default: Date.now() },
  education: educationSubSchema,
});

module.exports = mongoose.model('teacher', TeacherSchema);

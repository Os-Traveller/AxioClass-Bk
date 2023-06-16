const mongoose = require('mongoose');

const transactionSubSchema = new mongoose.Schema({
  trxId: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now() },
});

const coursesSubSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  credit: { type: String, required: true },
  type: { type: String, required: true },
});

const allCoursesSubSchema = new mongoose.Schema({
  completed: [coursesSubSchema],
  onGoing: [coursesSubSchema],
  retake: [coursesSubSchema],
});

const sscSubSchema = new mongoose.Schema({
  result: { type: String, required: true },
  board: { type: String, required: true },
  year: { type: String, required: true },
});

const hscSubSchema = new mongoose.Schema({
  result: { type: String, required: true },
  board: { type: String, required: true },
  year: { type: String, required: true },
});

const studentSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  dob: { type: Date, required: true },
  birthPlace: { type: String },
  guardianName: { type: String, required: true },
  guardianNumber: { type: String, required: true },
  address: { type: String, required: true },
  ssc: sscSubSchema,
  hsc: hscSubSchema,
  graduated: { type: Boolean, default: false },
  demand: { type: Number, required: true },
  paid: { type: Number, default: 0 },
  due: { type: Number, required: true },
  waiver: { type: Number, default: 1 },
  dept: { type: String, default: 'CSE' },
  completedSemester: { type: Number, required: true, default: 0 },
  image: String,
  sex: { type: String, required: true, Option: 'male' | 'female' | 'other' },
  intake: { type: Number, required: true },
  password: { type: String, required: true },
  admissionDate: { type: Date, immutable: true, default: Date.now() },
  transactions: [transactionSubSchema],
  allCourses: allCoursesSubSchema,
  registered: { type: Boolean, default: false },
  cgpa: String,
  sgpa: String,
});

module.exports = mongoose.model('student', studentSchema);

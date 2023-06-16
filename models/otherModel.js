const mongoose = require('mongoose');

const tuitionFeesSubSchema = new mongoose.Schema({
  CSE: { type: Number, required: true },
  EEE: { type: Number, required: true },
});

const admissionFeesSchema = new mongoose.Schema({
  CSE: { type: Number, required: true },
  EEE: { type: Number, required: true },
});

const otherSchema = new mongoose.Schema({
  currentSemester: String,
  tuitionFees: tuitionFeesSubSchema,
  admissionFees: admissionFeesSchema,
});

module.exports = mongoose.model('other', otherSchema);

const mongoose = require('mongoose');

const otherSchema = new mongoose.Schema({
  currentSemester: String,
  totalDemand: Number,
  totalRevenue: Number,
});

module.exports = mongoose.model('other', otherSchema);

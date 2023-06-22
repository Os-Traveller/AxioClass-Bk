const mongoClient = require('./mongoConfig');

const db = mongoClient.db('axio-class');
const studentsCollection = db.collection('students');
const adminCollection = db.collection('admin');
const courses = db.collection('courses');
const teachers = db.collection('teachers');
const transactions = db.collection('transactions');
const others = db.collection('others');

module.exports = {
  studentsCollection,
  adminCollection,
  courses,
  teachers,
  transactions,
  others,
};

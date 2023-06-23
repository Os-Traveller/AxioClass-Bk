const mongoClient = require('./mongoConfig');

const db = mongoClient.db('axio-class');
const studentsCollection = db.collection('students');
const adminCollection = db.collection('admin');
const coursesCollection = db.collection('courses');
const teachersCollection = db.collection('teachers');
const transactionsCollection = db.collection('transactions');
const othersCollection = db.collection('others');
const departmentsCollection = db.collection('departments');

module.exports = {
  studentsCollection,
  adminCollection,
  coursesCollection,
  teachersCollection,
  transactionsCollection,
  othersCollection,
  departmentsCollection,
};

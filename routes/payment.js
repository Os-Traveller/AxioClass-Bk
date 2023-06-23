const express = require('express');
// const studentModel = require('../models/studentModel');
// const transactionModel = require('../models/transactionModel');
const {
  studentsCollection,
  transactionsCollection,
} = require('../db/collections');

const router = express.Router();

router.get('/student/:id', async (req, res) => {
  const stdId = req.params.id;

  const student = await studentsCollection.findOne({ id: stdId });
  if (!student) return res.send({ okay: false, msg: 'Student not found' });

  const studentInfo = {
    name: student.name,
    dept: student.dept,
    image: student.image,
    id: student.id,
    intake: student.intake,
    demand: student.demand,
    paid: student.paid,
  };

  res.send({ okay: true, data: studentInfo });
});

router.post('/', async (req, res) => {
  const { id, amount } = req.body;

  // ******* getting student info ******* \\
  const studentInfo = await studentsCollection.findOne({ id });

  // ******* no student found ******* \\
  if (!studentInfo) return res.send({ okay: false, msg: 'Student not found' });

  // ******* student found ******* \\
  let { paid, transactions } = studentInfo;
  const timeNow = new Date();
  const trxId = 'axio' + timeNow;

  if (!transactions) transactions = []; // if no transaction found
  transactions = [...transactions, { amount, date: timeNow, trxId }];

  paid += amount; // student's paid info

  const newTransaction = {
    trxId,
    amount,
    date: timeNow,
    name: studentInfo.name,
    id: studentInfo.id,
    dept: studentInfo.dept,
    intake: studentInfo.intake,
  };
  // ******* storing transaction info to the database ******* \\
  const newTransactionDoc = await transactionsCollection.insertOne(
    newTransaction
  );

  // ******* store unsuccessful ******* \\
  if (!newTransactionDoc.acknowledged)
    return res.send({ okay: false, msg: 'Could not add payment' });

  // ******* updating student information ******* \\
  const studentInfoDoc = await studentsCollection.updateOne(
    { id },
    { $set: { paid, transactions } },
    { upsert: true }
  );

  if (!studentInfoDoc.acknowledged)
    return res.send({
      okay: false,
      msg: "Could not update in student's database",
    });

  res.send({ okay: true, data: newTransaction });
});

module.exports = router;

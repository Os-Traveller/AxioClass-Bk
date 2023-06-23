const express = require('express');
// const studentModel = require('../models/studentModel');
// const transactionModel = require('../models/transactionModel');
const { studentsCollection } = require('../db/collections');

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
  try {
    const { id, amount } = req.body;
    const studentInfo = await studentModel.findOne({ id });
    let { paid, due } = studentInfo;
    let transactions = studentInfo.transactions;

    // generating trxId id
    const timeNow = Date.now();
    const trxId = 'axio-' + timeNow;

    // updating transactions of student
    transactions = [
      ...transactions,
      { amount: amount, date: timeNow, trxId: trxId },
    ];

    // updating paid and due
    paid += amount;
    due -= amount;

    // updating transaction collection for admin
    const newTransaction = await transactionModel.create({
      trxId,
      amount,
      date: timeNow,
      name: studentInfo.name,
      id: studentInfo.id,
      dept: studentInfo.dept,
      intake: studentInfo.intake,
    });

    // updating students collection
    const doc = await studentModel.findOneAndUpdate(
      { id },
      { due, paid, transactions },
      { new: true }
    );

    res.send({ okay: true, data: newTransaction });
  } catch (err) {
    console.log(err.message);
    res.send({ okay: false, msg: 'Something went wrong' });
  }
});

module.exports = router;

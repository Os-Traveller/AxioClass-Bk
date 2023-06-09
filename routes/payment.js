const express = require('express');
const studentModel = require('../models/studentModel');
const transactionModel = require('../models/transactionModel');
const router = express.Router();

router.get('/student/:id', async (req, res) => {
  const stdId = req.params.id;

  const [studentInfo] = await studentModel.find(
    { id: stdId },
    'name dept image id intake demand paid waiver due'
  );

  if (!studentInfo) return res.send({ okay: false, msg: 'Student not found' });

  res.send({ data: studentInfo, okay: true });
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

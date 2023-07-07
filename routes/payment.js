const express = require('express');

const {
  studentsCollection,
  transactionsCollection,
  othersCollection,
  activitiesCollection,
} = require('../db/collections');
const { getDateObject } = require('../utils/helper');

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
  const date = new Date();
  const dateObject = getDateObject(date);

  // ******* getting student info ******* \\
  const studentInfo = await studentsCollection.findOne({ id });

  // ******* no student found ******* \\
  if (!studentInfo) return res.send({ okay: false, msg: 'Student not found' });

  // ******* student found ******* \\
  let { paid, transactions } = studentInfo;
  const trxId = 'axio' + date.getTime();

  if (!transactions) transactions = []; // if no transaction found
  transactions = [...transactions, { amount, date: dateObject.date, trxId }];

  paid += amount; // student's paid info

  // for transaction collections
  const newTransaction = {
    trxId,
    amount,
    date: dateObject.date,
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

  // ******* updating university total revenue ******* \\
  const othersInfo = await othersCollection.findOne({});
  let totalRevenue = othersInfo.totalRevenue;
  totalRevenue += amount;

  console.log(totalRevenue);

  await othersCollection.updateOne(
    {},
    { $set: { totalRevenue } },
    { upsert: true }
  );

  if (!studentInfoDoc.acknowledged)
    return res.send({
      okay: false,
      msg: "Could not update in student's database",
    });

  await activitiesCollection.insertOne({
    date: dateObject.date,
    activity: `${studentInfo.name} paid ${amount}`,
    data: `ID : ${trxId}`,
    time: dateObject.time,
  });

  res.send({ okay: true, data: newTransaction });
});

module.exports = router;

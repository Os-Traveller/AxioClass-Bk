const express = require('express');
const router = express.Router();
const {
  studentsCollection,
  transactionsCollection,
} = require('../db/collections');
// const studentModel = require('../models/studentModel');

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;

    // ******* finding a student based on his\her id ******* \\
    const student = await studentsCollection.findOne({ id });

    // ******* no student found ******* \\
    if (!student) return res.send({ okay: false, msg: 'Student not found' });

    const studentInfo = {
      basicInfo: {
        name: student.name,
        dept: student.dept,
        id: student.id,
        intake: student.intake,
        image: student.image,
      },
      financialInfo: {
        demand: student.demand,
        paid: student.paid,
        waiver: student.waiver,
        due: student.due,
      },
      personalInfo: {
        address: student.address,
        phone: student.phone,
        email: student.email,
      },
      guardianInfo: student.guardianInfo,
      education: student.education,
      completedSemester: student.completedSemester,
      registered: student.registered,
    };
    res.send({ okay: true, data: studentInfo });
  } catch (err) {
    console.log(err);
    res.send({ okay: false, msg: 'Something went wrong' });
  }
});

router.get('/document/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const studentInfo = await studentsCollection.findOne({ id });
    if (!studentInfo) return res.send({ okay: false, msg: 'No data found' });

    const studentDocument = {
      name: studentInfo.name,
      dept: studentInfo.dept,
      intake: studentInfo.intake,
      id: studentInfo.id,
      password: studentInfo.password,
      image: studentInfo.image,
      phone: studentInfo.phone,
      email: studentInfo.email,
    };
    res.send({ okay: true, data: studentDocument });
  } catch (err) {
    console.log(err);
    res.send({ okay: false, msg: 'Something went wrong' });
  }
});

router.get('/fees/:id', async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const studentInfo = await studentsCollection.findOne({ id });
    const { demand, paid, waiver } = studentInfo;
    const transactionCursor = transactionsCollection.find({ id });
    const transactions = await transactionCursor.toArray();

    res.send({
      okay: true,
      data: { transactions, stat: { demand, paid, waiver } },
    });
  } catch (err) {
    console.log(err);
    res.send({ okay: false, msg: 'Something went wrong' });
  }
});
module.exports = router;

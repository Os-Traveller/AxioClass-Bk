const express = require('express');
const router = express.Router();
const { studentsCollection } = require('../db/collections');
// const studentModel = require('../models/studentModel');

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  res.send({ msg: 'Wait' });
  // try {
  //   const student = await studentModel.findOne({ id });
  //   if (!student) return res.send({ okay: false, msg: 'Student not found' });

  //   const studentInfo = {
  //     basicInfo: {
  //       name: student.name,
  //       dept: student.dept,
  //       id: student.id,
  //       intake: student.intake,
  //       image: student.image,
  //     },
  //     financialInfo: {
  //       demand: student.demand,
  //       paid: student.paid,
  //       waiver: student.waiver,
  //       due: student.due,
  //     },
  //     academicInfo: {},
  //     personalInfo: {
  //       address: student.address,
  //       phone: student.phone,
  //       email: student.email,
  //     },
  //     guardianInfo: {
  //       guardianName: student.guardianName,
  //       guardianNumber: student.guardianNumber,
  //     },
  //     education: {
  //       hsc: student.hsc,
  //       ssc: student.ssc,
  //     },
  //   };

  //   res.send({ okay: true, data: studentInfo });
  // } catch (err) {
  //   console.log(err);
  //   res.send({ okay: false, msg: 'Something went wrong' });
  // }
});

router.get('/document/:id', async (req, res) => {
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
});

module.exports = router;

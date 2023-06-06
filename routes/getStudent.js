const express = require('express');
const router = express.Router();
const studentModel = require('../models/studentModel');

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const student = await studentModel.findOne({ id });
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
      academicInfo: {},
      personalInfo: {
        address: student.address,
        phone: student.phone,
        email: student.email,
      },
      guardianInfo: {
        guardianName: student.guardianName,
        guardianNumber: student.guardianNumber,
      },
      education: {
        hsc: student.hsc,
        ssc: student.ssc,
      },
    };

    res.send({ okay: true, data: studentInfo });
  } catch (err) {
    console.log(err);
    res.send({ okay: false, msg: 'Something went wrong' });
  }
});

router.get('/document/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const student = await studentModel.findOne({ id });
    if (!student) return res.send({ okay: false, msg: 'Student not found' });

    const studentInfo = {
      name: student.name,
      dept: student.dept,
      intake: student.intake,
      id: student.id,
      password: student.password,
      image: student.image,
    };
    res.send({ okay: true, data: studentInfo });
  } catch (err) {
    console.log(err);
    res.send({ okay: false, msg: 'something went wrong' });
  }
});

module.exports = router;

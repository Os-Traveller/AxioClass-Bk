const express = require('express');
const router = express.Router();
const studentModel = require('../models/studentModel');

router.post('/', async (req, res) => {
  const {
    fName,
    lName,
    pName,
    dob,
    birthPlace,
    email,
    phone,
    address,
    hsc,
    ssc,
  } = req.body;
  const studentName = fName + ' ' + lName;

  try {
    const newStudent = await studentModel.create({
      studentName,
      id: 'CSE-2023-01-001',
      dob,
      birthPlace,
      guardianName: pName,
      email,
      phone,
      address,
      hsc,
      ssc,
    });

    await newStudent.save();

    res.send({ data: newStudent, msg: 'Admitted-Successfully', ok: true });
  } catch (err) {
    console.log(err);
    res.send({ msg: 'Error Occurred', ok: false });
  }
});

module.exports = router;

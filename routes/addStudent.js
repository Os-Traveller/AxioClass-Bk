const express = require('express');
const router = express.Router();
const studentModel = require('../models/studentModel');
const { roundDigit } = require('../utils/helper');
const utilityData = require('../utils/data');

router.post('/', async (req, res) => {
  const {
    fName,
    lName,
    dob,
    birthPlace,
    sex,
    email,
    number,
    pName,
    pNum,
    address,
    hsc,
    ssc,
    dept,
    semester,
    intake,
    image,
  } = req.body;
  const studentName = fName + ' ' + lName;
  const count = await studentModel.count({ dept, intake });
  const id = `${dept}-${intake}-${roundDigit(count + 1, 3)}`;

  const admissionFees = utilityData.admissionFees[dept];
  const password = process.env.passwordSecret + number;

  try {
    const newStudent = await studentModel.create({
      name: studentName,
      id,
      dob,
      birthPlace,
      guardianName: pName,
      email,
      phone: number,
      address,
      hsc,
      ssc,
      image,
      intake,
      dept,
      sex,
      guardianNumber: pNum,
      currentSemester: semester,
      demand: admissionFees,
      due: admissionFees,
      password,
    });

    await newStudent.save();

    res.send({ id: newStudent.id, msg: 'Admitted-Successfully', ok: true });
  } catch (err) {
    console.log(err);
    res.send({ msg: 'Error Occurred', ok: false });
  }
});

module.exports = router;

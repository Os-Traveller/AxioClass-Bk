const express = require('express');
const router = express.Router();
const studentModel = require('../models/studentModel');
const { roundDigit } = require('../utils/helper');
const { admissionFees } = require('../utils/data');
const otherModel = require('../models/otherModel');

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
    dept,
    intake,
    image,
    hscResult,
    hscYear,
    hscBoard,
    sscResult,
    sscBoard,
    sscYear,
  } = req.body;
  const studentName = fName + ' ' + lName;
  const count = await studentModel.count({ dept, intake });
  const id = `${dept}-${intake}-${roundDigit(count + 1, 3)}`;
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
      ssc: { result: sscResult, board: sscBoard, year: sscYear },
      hsc: { result: hscResult, board: hscBoard, year: hscYear },
      image,
      intake,
      dept,
      sex,
      guardianNumber: pNum,
      demand: admissionFees,
      due: admissionFees,
      password,
    });

    // updating total demand for university
    const otherInfo = await otherModel.findOne({});

    res.send({ id: newStudent.id, msg: 'Admitted-Successfully', ok: true });
  } catch (err) {
    console.log(err.message);
    res.send({ msg: 'Error Occurred', ok: false });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const teacherModel = require('../models/teacherModel');
const { roundDigit } = require('../utils/helper');

router.post('/', async (req, res) => {
  const {
    name,
    dob,
    birthPlace,
    address,
    email,
    phone,
    sex,
    image,
    education,
    dept,
  } = req.body;

  // generating id
  const count = await teacherModel.count({ dept });
  const id = `T-${dept}-${roundDigit(count + 1, 2)}`;
  const password = process.env.passwordSecret + phone;

  try {
    const newTeacher = await teacherModel.create({
      id,
      password,
      image,
      name,
      dob,
      birthPlace,
      sex,
      address,
      dept,
      education,
      email,
      phone,
    });
    res.send({ okay: true, id: newTeacher.id });
  } catch (err) {
    console.log(err.message);
    return res.send({ okay: false, msg: err.message });
  }
});

module.exports = router;

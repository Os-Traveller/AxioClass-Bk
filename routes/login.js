const express = require('express');
const adminModel = require('../models/adminModel');
const studentModel = require('../models/studentModel');
const router = express.Router();

router.post('/admin', async (req, res) => {
  const { id, password } = req.body;
  try {
    const admin = await adminModel.findOne({ id: id });

    if (!admin?.id) {
      // user not found
      return res.send({ msg: 'Admin not found 🥲', okay: false });
    } else if (password !== admin.password) {
      // wrong password
      return res.send({ msg: 'Wrong Password 🥲', okay: false });
    }

    // user found && password match
    res.send({
      id: admin.id,
      role: admin.role,
      image: admin.image,
      okay: true,
      msg: 'Login Success! 😊',
    });
  } catch (err) {
    // if any error occurs
    console.log(err);
  }
});

router.post('/student', async (req, res) => {
  const { id, password } = req.body;
  const student = await studentModel.findOne({ id: id });
  if (!student?.id) {
    // student not found
    return res.send({ okay: false, msg: 'Student not found! 🥲' });
  } else if (password !== student.password) {
    return res.send({ okay: false, msg: 'Wrong password 🥲' });
  }

  res.send({
    id: student.id,
    role: 'student',
    image: student.image,
    okay: true,
    msg: 'Login Success! 😊',
  });
});
router.post('/teacher', (req, res) => {});

module.exports = router;

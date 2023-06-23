const express = require('express');
const { adminCollection, studentsCollection } = require('../db/collections');

const router = express.Router();

router.post('/admin', async (req, res) => {
  const { id, password } = req.body;
  const adminInfo = await adminCollection.findOne({ id });

  // admin not found
  if (!adminInfo) return res.send({ msg: 'Admin not found', okay: false });
  // wrong password
  else if (adminInfo.password !== password)
    return res.send({ msg: 'Wrong Password', okay: false });

  res.send({
    id: adminInfo.id,
    role: 'admin',
    image: adminInfo.image,
    okay: true,
    msg: 'Login Success!',
  });
});

router.post('/student', async (req, res) => {
  const { id, password } = req.body;
  const studentInfo = await studentsCollection.findOne({ id });

  // student not found
  if (!studentInfo) return res.send({ msg: 'Student not found', okay: false });
  else if (studentInfo.password !== password)
    return res.send({ msg: 'Wrong Password', okay: false });

  res.send({
    id: studentInfo.id,
    role: 'student',
    image: studentInfo.image,
    okay: true,
    msg: 'Login Success! 😊',
  });
});
router.post('/teacher', (req, res) => {});

module.exports = router;

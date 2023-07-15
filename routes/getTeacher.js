const express = require('express');
const { teachersCollection } = require('../db/collections');
const router = express.Router();

router.get('/document/:id', async (req, res) => {
  const { id } = req.params;

  // ******* finding teacher in database ******* \\
  const teacher = await teachersCollection.findOne({ id });

  // ******* teacher not found ******* \\
  if (!teacher) return res.send({ okay: false, msg: 'Teacher Not Found' });

  // ******* teacher found ******* \\
  const teacherInfo = {
    id: teacher.id,
    name: teacher.name,
    image: teacher.image,
    password: teacher.password,
    dept: teacher.dept,
    phone: teacher.phone,
    email: teacher.email,
  };
  res.send({ okay: true, data: teacherInfo });
});

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const teacherInfo = teachersCollection.findOne({ id });
    if (!teacherInfo)
      return res.send({ okay: false, msg: 'Teacher not found' });
    res.send({ okay: true, data: teacherInfo });
  } catch (err) {
    console.log(err);
    res.send({ okay: false, msg: 'Something went wrong' });
  }
});

module.exports = router;

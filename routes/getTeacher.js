const express = require('express');
const router = express.Router();
const teacherModel = require('../models/teacherModel');

router.get('/document/:id', async (req, res) => {
  const { id } = req.params;
  const teacher = await teacherModel.findOne({ id });

  if (!teacher) return res.send({ okay: false, msg: 'Teacher Not Found' });

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

module.exports = router;

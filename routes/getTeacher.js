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

module.exports = router;

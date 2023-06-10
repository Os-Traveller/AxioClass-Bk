const express = require('express');
const router = express.Router();
const coursesModel = require('../models/coursesModel');
const studentModel = require('../models/studentModel');

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const studentInfo = await studentModel.findOne({ id });
    if (!studentInfo)
      return res.send({
        okay: false,
        msg: 'User Corrupted',
        userCorrupted: true,
      });

    const courses = await coursesModel.find({
      $and: [
        { dept: studentInfo.dept },
        { semester: studentInfo.currentSemester },
      ],
    });
    if (!courses)
      return res.send({ okay: false, msg: 'You are not eligible!' });

    res.send({ okay: true, data: courses });
  } catch (err) {
    console.log(err);
    res.send({ okay: false, msg: 'Error Occurred!' });
  }
});

module.exports = router;

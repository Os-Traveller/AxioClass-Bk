const express = require('express');
const router = express.Router();
const coursesModel = require('../models/coursesModel');
const studentModel = require('../models/studentModel');
const otherModel = require('../models/otherModel');

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

    if (studentInfo.registered) {
      return res.send({
        okay: false,
        msg: 'You are already registered',
        registered: true,
      });
    }

    const courses = await coursesModel.find({
      $and: [
        { dept: studentInfo.dept.toLocaleLowerCase() }, // in course table dept are in lower case
        { semester: studentInfo.completedSemester },
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

router.post('/registration', async (req, res) => {
  let { selectedCourses, id } = req.body;
  selectedCourses = Object.values(selectedCourses);
  const otherInfo = await otherModel.findOne({});
  const uniDemand = otherInfo.totalDemand;

  res.send({ msg: 'Found' });
  // try {
  //   const student = await studentModel.findOne({ id });
  //   let allCourses = student.allCourses;
  //   if (allCourses) {
  //     // all courses exist in database
  //     allCourses.onGoing = selectedCourses;
  //   } else {
  //     // if all courses does not exist
  //     allCourses = { onGoing: selectedCourses };
  //   }

  //   const doc = await studentModel.findOneAndUpdate(
  //     { id },
  //     { allCourses },
  //     { new: true }
  //   );

  //   if (!doc) {
  //     return res.send({ okay: false, msg: 'Can not add courses' });
  //   }

  //   res.send({ okay: true, data: doc.allCourses });
  // } catch (err) {
  //   console.log(err.message);
  //   res.send({ okay: false, msg: 'Something went wrong' });
  // }
});

router.get('/current/:id', async (req, res) => {
  const { id } = req.params;
  const student = await studentModel.findOne({ id });
  const onGoing = student.allCourses?.onGoing;

  if (!onGoing) {
    return res.send({ okay: false, msg: 'No Course Found' });
  }

  res.send({ okay: true, data: onGoing });
});

module.exports = router;

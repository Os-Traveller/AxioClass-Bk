const express = require('express');
const router = express.Router();
const coursesModel = require('../models/coursesModel');
const studentModel = require('../models/studentModel');
const otherModel = require('../models/otherModel');
const { tuitionFees } = require('../utils/data');
const { studentsCollection, coursesCollection } = require('../db/collections');

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  // ******* getting student's information ******* \\
  const studentInfo = await studentsCollection.findOne({ id });

  // ******* checking if student found or not ******* \\
  if (!studentInfo)
    return res.send({
      okay: false,
      userCorrupted: true,
      msg: 'User Corrupted, Logging out',
    });

  // ******* checking if the student is already registered ******* \\
  if (studentInfo.registered)
    return res.send({
      okay: false,
      registered: true,
      msg: 'Already Registered',
    });

  // ******* student is not registered ******* \\
  const coursesCursor = coursesCollection.find({
    dept: studentInfo.dept.toLocaleLowerCase(),
    semester: studentInfo.completedSemester + 1,
  });

  const courseList = await coursesCursor.toArray();

  // ******* course list not found ******* \\
  if (!courseList) res.send({ okay: false, msg: 'Course List not found' });

  res.send({ data: courseList });
});

router.post('/registration', async (req, res) => {
  let { selectedCourses, id } = req.body;
  selectedCourses = Object.values(selectedCourses);
  try {
    const otherInfo = await otherModel.findOne({});
    const student = await studentModel.findOne({ id });
    let uniDemand = otherInfo.totalDemand;
    if (!uniDemand) uniDemand = 0;
    let studentDemand = student.demand;
    let totalDemand = 0;

    selectedCourses.forEach((element) => {
      totalDemand += +element.credit * tuitionFees;
    });

    uniDemand += totalDemand; // updated demand of university
    studentDemand += totalDemand; // updated demand of student

    let allCourses = student.allCourses;
    if (allCourses) {
      // all courses exist in database
      allCourses.onGoing = selectedCourses;
    } else {
      // if all courses does not exist
      allCourses = { onGoing: selectedCourses };
    }

    // updating student info
    const doc = await studentModel.updateOne(
      { id },
      {
        $set: {
          allCourses: allCourses,
          demand: studentDemand,
          registered: true,
        },
      },
      { $upsert: true }
    );

    if (!doc) {
      return res.send({ okay: false, msg: 'Can not add courses' });
    }

    //  updating university db
    await otherModel.findOneAndUpdate(
      {},
      { totalDemand: uniDemand },
      { $upsert: true }
    );

    res.send({ okay: true, data: doc });
  } catch (err) {
    console.log(err.message);
    res.send({ okay: false, msg: 'Something went wrong' });
  }
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

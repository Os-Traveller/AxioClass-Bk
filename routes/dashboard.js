const express = require('express');
const router = express.Router();
const {
  studentsCollection,
  teachersCollection,
  coursesCollection,
  othersCollection,
} = require('../db/collections');

router.get('/', async (req, res) => {
  try {
    // finding total student collection
    const othersInfo = await othersCollection.findOne({});
    const totalStudent = await studentsCollection.countDocuments();
    const totalTeacher = await teachersCollection.countDocuments();
    const totalCourses = await coursesCollection.countDocuments();
    const totalRevenue = othersInfo.totalRevenue;
    const totalDemand = othersInfo.totalDemand;

    const data = {
      totalStudent,
      totalTeacher,
      totalCourses,
      totalRevenue,
      totalDemand,
    };

    res.send({ okay: true, data });
  } catch (err) {
    console.log(err);
    res.send({ okay: false, msg: 'Something went wrong!' });
  }
});

module.exports = router;

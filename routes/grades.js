const express = require('express');
const { othersCollection, studentsCollection } = require('../db/collections');
const router = express.Router();

router.post('/add', async (req, res) => {
  try {
    const { mid, final, thirty, id, courseCode } = req.body;
    const otherInfo = othersCollection.findOne({});
    const currentSemester = otherInfo.currentSemester;
    const studentInfo = studentsCollection.findOne({ id });

    let newGrades = [];
    if (mid) newGrades.mid = mid;
    if (final) newGrades.final = final;
    if (thirty) newGrades.thirty = thirty;

    const courses = studentInfo.courses;
    const currentCourses = courses[currentSemester];
    let course = currentCourses.filter((data) => data.code === courseCode);

    course = { ...course, newGrades };
    courses[currentSemester] = course;

    const updatedStatus = await studentsCollection.updateOne(
      { id },
      { $set: { courses } },
      { upsert: true }
    );

    res.send({ okay: true, msg: 'Result Updated' });
  } catch (err) {
    console.log(err);
    res.send({ okay: false, msg: 'Something went wrong' });
  }
});

module.exports = router;

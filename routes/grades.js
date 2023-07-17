const express = require('express');
const { othersCollection, studentsCollection } = require('../db/collections');
const router = express.Router();

router.post('/add', async (req, res) => {
  try {
    const { mid, final, thirty, id, courseCode } = req.body;
    const otherInfo = await othersCollection.findOne({});
    const currentSemester = otherInfo.currentSemester;
    const studentInfo = await studentsCollection.findOne({ id });

    let newGrades = {};
    if (mid) newGrades.mid = mid;
    if (final) newGrades.final = final;
    if (thirty) newGrades.thirty = thirty;

    const courses = studentInfo.courses;
    let currentCourses = courses[currentSemester];

    let [targetCourse] = currentCourses.filter(
      (data) => data.code === courseCode
    );

    targetCourse = { ...targetCourse, ...newGrades };
    currentCourses = currentCourses.filter((data) => data.code !== courseCode);
    currentCourses = [...currentCourses, { ...targetCourse }];
    courses[currentSemester] = currentCourses;

    const updatedStatus = await studentsCollection.updateOne(
      { id },
      { $set: { courses } },
      { upsert: true }
    );

    if (!updatedStatus.acknowledged)
      return res.send({ okay: false, msg: 'Could not update result' });

    res.send({ okay: true, msg: 'Result Updated' });
  } catch (err) {
    console.log(err);
    res.send({ okay: false, msg: 'Something went wrong' });
  }
});

module.exports = router;

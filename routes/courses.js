const express = require('express');
const router = express.Router();

const {
  studentsCollection,
  coursesCollection,
  othersCollection,
} = require('../db/collections');

router.get('/:id', async (req, res) => {
  try {
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

    res.send({ data: courseList, okay: true });
  } catch (err) {
    console.log(err);
    res.send({ okay: false, msg: 'Error Occurred' });
  }
});

router.post('/registration', async (req, res) => {
  try {
    let { selectedCourses, id } = req.body;
    selectedCourses = Object.values(selectedCourses);

    // ******* getting all collection && other properties ******* \\
    const studentInfo = await studentsCollection.findOne({ id });
    const otherInfo = await othersCollection.findOne({});
    const currentSemester = otherInfo.currentSemester;
    const tuitionFees = otherInfo.tuitionFees;
    let uniDemand = otherInfo.totalDemand;
    let studentDemand = studentInfo.demand;

    // ******* student not found ******* \\
    if (!studentInfo)
      return res.send({
        okay: false,
        msg: 'User Corrupted',
        userCorrupted: true,
      });

    // ******* student found ******* \\

    // ******* calculating tuition fees for student and university ******* \\
    if (!uniDemand) uniDemand = 0;
    let currentSemesterDemand = 0;
    selectedCourses.forEach((course) => {
      currentSemesterDemand += +course.credit * tuitionFees;
    });

    uniDemand += currentSemesterDemand; // updating university's demand
    studentDemand += currentSemesterDemand; // updating student's demand

    // ******* updating student's course list ******* \\
    let courses = studentInfo.courses;
    if (!courses) courses = {}; //  all courses does not exist in database
    courses[currentSemester] = selectedCourses;

    const updatedDoc = await studentsCollection.updateOne(
      { id },
      { $set: { courses, demand: studentDemand, registered: true } },
      { upsert: true }
    );

    // ******* could not update course list ******* \\
    if (!updatedDoc.acknowledged)
      return res.send({ okay: true, msg: 'Can add course now!' });

    // ******* after updating course list now update  ******* \\
    const otherInfoUpdateDoc = await othersCollection.updateOne(
      {},
      { $set: { totalDemand: uniDemand } },
      { upsert: true }
    );

    res.send({ okay: true, msg: 'Successfully registered' });
  } catch (err) {
    console.log(err);
    res.send({ okay: false, msg: 'Error Occurred' });
  }
});

router.get('/current/:id', async (req, res) => {
  const { id } = req.params;
  const student = await studentsCollection.findOne({ id }); // finding student info
  const otherInfo = await othersCollection.findOne({});
  const currentSemester = otherInfo.currentSemester;

  // ******* if student not found  ******* \\
  if (!student)
    return res.send({
      okay: false,
      msg: 'Corrupted User',
      userCorrupted: true,
    });

  const onGoing = student.courses[currentSemester];

  if (!onGoing) {
    return res.send({ okay: false, msg: 'No Course Found' });
  }

  res.send({ okay: true, data: onGoing });
});

module.exports = router;

const express = require('express');
const {
  studentsCollection,
  teachersCollection,
  othersCollection,
} = require('../db/collections');
const router = express.Router();

router.put('/password', async (req, res) => {
  const { id, role } = req.body;
  let user = {};
  if (role === 'student') user = await studentsCollection.findOne({ id });
  else if (role === 'teacher') user = await teachersCollection.findOne({ id });

  if (!user) return res.send({ okay: false, msg: 'User not found' });
  // generating new password
  const password = process.env.passwordSecret + user.phone;
  // updating the password
  let updateDoc;
  if (role === 'student')
    updateDoc = await studentsCollection.updateOne(
      { id },
      { $set: { password } }
    );
  else if (role === 'teacher')
    updateDoc = await teachersCollection.updateOne(
      { id },
      { $set: { password } }
    );

  // if update successfully
  if (!updateDoc.acknowledged)
    return res.send({ okay: false, msg: "Password can't be reset" });

  const userData = {
    name: user.name,
    id: user.id,
    image: user.image,
    password,
  };

  res.send({ okay: true, data: userData });
});

router.put('/course', async (req, res) => {
  const { id } = req.body;
  // ******* finding the student ******* \\
  const studentInfo = await studentsCollection.findOne({ id });
  if (!studentInfo) return res.send({ okay: false, msg: 'Student not found' });
  // checking if the student is registered or not
  if (!studentInfo.registered)
    return res.send({ okay: false, msg: "You haven't registered yet" });

  // checking if student has any course ongoing
  let allCourses = studentInfo.allCourses;
  if (!allCourses || Object.keys(allCourses).length === 0) {
    // ? allCourses is an object
    // when allCourses is empty or undefined
    allCourses = {};
    allCourses.onGoing = [];
    return res.send({ okay: false, msg: "You haven't registered yet" });
  } else if (!allCourses.onGoing || allCourses.onGoing.length === 0) {
    // ? allCourses.onGoing is an array
    // when onGoing is Empty  or undefined
    allCourses.onGoing = [];
    return res.send({ okay: false, msg: "You haven't registered yet" });
  }

  // if student registered
  let currentSemesterFee = 0;
  const otherInfo = await othersCollection.findOne({});
  const tuitionFees = otherInfo.tuitionFees;
  let totalDemand = otherInfo.totalDemand;
  let stdDemand = studentInfo.demand;

  studentInfo.allCourses.onGoing.forEach(
    (course) => (currentSemesterFee += course.credit * tuitionFees)
  );

  // Removing ongoing course form all courses
  allCourses.onGoing = [];
  stdDemand -= currentSemesterFee;
  totalDemand -= currentSemesterFee;

  // updating student's database
  const updateStudentDoc = await studentsCollection.updateOne(
    { id },
    { $set: { demand: stdDemand, allCourses, registered: false } },
    { upsert: true }
  );
  if (!updateStudentDoc.acknowledged)
    return res.send({ okay: false, msg: 'Could not modify Registration' });

  //  after updating student database now update otherInfo
  const updateUniDoc = await othersCollection.updateOne(
    {},
    { $set: { totalDemand } }
  );

  if (!updateUniDoc.acknowledged)
    return res.send({ okay: false, msg: 'Can not update university database' });

  // if all okay
  res.send({ okay: true, msg: 'Course Modified' });
});

module.exports = router;

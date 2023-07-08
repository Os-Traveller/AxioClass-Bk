const express = require('express');
const {
  classRoomCollection,
  activitiesCollection,
  studentsCollection,
  teachersCollection,
  coursesCollection,
  departmentsCollection,
} = require('../db/collections');
const { getDateObject } = require('../utils/helper');
const router = express.Router();

router.post('/add', async (req, res) => {
  const classData = req.body;
  const { dept, intake, courseCode } = classData;

  // finding students of that intake and dept
  const studentsCursor = studentsCollection.find({
    $and: [{ dept, intake }],
  });
  let studentList = await studentsCursor.toArray();
  if (!studentList) return res.send({ okay: false, msg: 'No Student found' });

  // getting specific properties from the student
  studentList = studentList.map((student) => {
    return {
      name: student.name,
      id: student.id,
      image: student.image,
    };
  });
  // got all students who are in that dept and intake
  const classCode = courseCode + '-' + intake;
  // now creating the classroom
  const classCreateStatus = await classRoomCollection.insertOne({
    ...classData,
    classCode,
    studentList,
  });

  const date = new Date();
  const dateObject = getDateObject(date);

  await activitiesCollection.insertOne({
    date: dateObject.date,
    activity: 'Created a classroom',
    data: `Class Code : ${classCode}`,
    time: dateObject.time,
  });

  if (!classCreateStatus.acknowledged)
    return res.send({ okay: false, msg: 'Could not create the class room' });
  res.send({ okay: true, classCode });
});

router.get('/creation-info/:dept/:intake', async (req, res) => {
  try {
    const { dept, intake } = req.params;
    // getting all teacher list
    const teachersListCursor = teachersCollection.find({ dept });
    let teacherList = await teachersListCursor.toArray();
    if (!teacherList) teacherList = [];

    // getting current semester for that intake
    const deptIntake = await departmentsCollection.findOne({
      $and: [{ deptName: dept, intake }],
    });

    const completedSemester = deptIntake.completedSemester;

    // finding subjects given dept and intake
    const subjectsCursor = coursesCollection.find({
      $and: [
        { dept: dept.toLocaleLowerCase(), semester: completedSemester + 1 },
      ],
    });

    let subjectList = await subjectsCursor.toArray();
    if (!subjectList) subjectList = [];

    // getting only course code
    const courseCodeList = subjectList.map((course) => course.code);
    const teacherInfoList = teacherList.map((teacher) => {
      return { name: teacher.name, id: teacher.id };
    });

    res.send({ okay: true, data: { courseCodeList, teacherInfoList } });
  } catch (err) {
    console.log(err);
    res.send({ okay: false, msg: err });
  }
});

module.exports = router;

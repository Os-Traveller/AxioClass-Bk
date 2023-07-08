const express = require('express');
const {
  classRoomCollection,
  activitiesCollection,
  studentsCollection,
} = require('../db/collections');
const { getDateObject } = require('../utils/helper');
const router = express.Router();

router.post('/add', async (req, res) => {
  const classData = req.body;
  const { dept, intake, courseCode } = classData;

  // finding students of that intake and dept
  const studentsCursor = studentsCollection.find({ $and: [{ dept, intake }] });
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
    data: `Class Code : ${id}`,
    time: dateObject.time,
  });

  if (!classCreateStatus.acknowledged)
    return res.send({ okay: false, msg: 'Could not create the class room' });
  res.send({ okay: true, classCode });
});

module.exports = router;

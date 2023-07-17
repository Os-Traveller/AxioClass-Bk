const express = require('express');
const {
  classRoomCollection,
  activitiesCollection,
  studentsCollection,
  teachersCollection,
  coursesCollection,
  departmentsCollection,
  postCollection,
} = require('../db/collections');
const { getDateObject } = require('../utils/helper');
const router = express.Router();

router.post('/add', async (req, res) => {
  const classData = req.body;
  const { dept, intake, courseCode } = classData;

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
  let classCode = courseCode.split(' ').join('-');
  classCode = classCode + '-' + intake;
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

router.get('/get-admin', async (req, res) => {
  try {
    const classRoomCursor = classRoomCollection.find({});
    let classRooms = await classRoomCursor.toArray();
    if (!classRooms) classRooms = [];

    res.send({ okay: true, data: classRooms });
  } catch (err) {
    console.log(err);
    res.send({ okay: false, msg: err.massage });
  }
});

router.get('/search', async (req, res) => {
  const type = req.query.type;
  let query;
  switch (type) {
    case 'code': {
      const classCode = req.query.classCode;
      query = { classCode };
      break;
    }
    case 'teacher': {
      const teacherId = req.query.teacherId;
      query = { teacherId };
      break;
    }
    case 'intake-dept': {
      const intake = req.query.intake;
      const dept = req.query.dept;
      query = { dept, intake };
      break;
    }
    default: {
      return res.send({ okay: false, msg: 'Invalid option' });
    }
  }
  const cursor = classRoomCollection.find(query);
  const classList = await cursor.toArray();

  res.send({ okay: true, data: classList });
});

router.post('/add-post', async (req, res) => {
  try {
    const postInformation = req.body;
    const date = new Date();
    const dateObject = getDateObject(date);
    const postInsertStatus = await postCollection.insertOne({
      ...postInformation,
      date: dateObject.date,
      time: dateObject.time,
    });
    if (!postInsertStatus)
      return res.send({ okay: false, msg: 'Could not post' });

    res.send({ okay: true, msg: 'Successfully posted' });
  } catch (err) {
    console.log(err);
    res.send({ okay: false, msg: 'Something went wrong' });
  }
});

router.get('/:classCode', async (req, res) => {
  try {
    const classCode = req.params.classCode;
    const postCursor = postCollection.find({ classCode });
    const posts = await postCursor.toArray();
    if (!posts) return res.send({ okay: false, msg: 'Nothing found' });
    const classInfo = await classRoomCollection.findOne({ classCode });
    res.send({ okay: true, data: { posts, classInfo } });
  } catch (err) {
    console.log(err);
    res.send({ okay: false, msg: 'Something went wrong' });
  }
});

router.get('/student/:id', async (req, res) => {
  const id = req.params.id;
  const studentInfo = await studentsCollection.findOne({ id });
  if (!studentInfo) return res.send({ okay: false, msg: 'No student Found' });

  const intake = studentInfo.intake;
  const dept = studentInfo.dept;

  const classListCursor = classRoomCollection.find({
    $and: [{ intake, dept }],
  });

  const classList = await classListCursor.toArray();
  res.send({ okay: true, data: classList });
});

router.get('/teacher/:name', async (req, res) => {
  const name = req.params.name;
  const classListCursor = classRoomCollection.find({ instructor: name });
  const classList = await classListCursor.toArray();
  res.send({ okay: true, data: classList });
});

module.exports = router;

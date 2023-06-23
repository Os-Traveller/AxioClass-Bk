const express = require('express');
const router = express.Router();
const {
  studentsCollection,
  othersCollection,
  departmentsCollection,
} = require('../db/collections');
const { roundDigit } = require('../utils/helper');

router.post('/', async (req, res) => {
  const studentInfo = req.body;
  const { dept, intake, number } = studentInfo;
  const intakeInfo = await departmentsCollection.findOne({
    deptName: dept,
    intake: intake,
  });

  // ******* generating student id ******* \\
  const totalAdmittedStudents = intakeInfo.totalAdmitted;
  const id = `${dept}-${intake}-${roundDigit(totalAdmittedStudents + 1, 3)}`;

  // ******* finding student fees ******* \\
  const otherInfo = await othersCollection.findOne({});
  const admissionFees = otherInfo.admissionFees;

  // ******* generating password ******* \\
  const password = process.env.passwordSecret + number;

  // ******* creating a new student ******* \\
  const doc = {
    id,
    ...studentInfo,
    password,
    demand: admissionFees,
    paid: 0,
    completedSemester: 0,
  };
  const insertResult = await studentsCollection.insertOne(doc);
  if (!insertResult.acknowledged)
    return res.send({ okay: false, msg: 'Could not add student' });

  // ******* if student successfully created ******* \\

  // ******* updating total student count ******* \\
  await departmentsCollection.updateOne(
    { deptName: dept, intake: intake },
    { $set: { totalAdmitted: totalAdmittedStudents + 1 } },
    { upsert: true }
  );

  // ******* updating total demand of university ******* \\
  const uniDemand = otherInfo.totalDemand;
  await othersCollection.updateOne(
    {},
    { $set: { totalDemand: uniDemand + admissionFees } },
    { upsert: true }
  );
  res.send({ okay: true, id });
});

module.exports = router;

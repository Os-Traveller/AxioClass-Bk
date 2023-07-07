const express = require('express');
const router = express.Router();
const { roundDigit, getDateObject } = require('../utils/helper');
const {
  othersCollection,
  teachersCollection,
  activitiesCollection,
} = require('../db/collections');

router.post('/', async (req, res) => {
  try {
    const teacherInfo = req.body;
    const { phone, dept } = teacherInfo;
    const date = new Date();
    const dateObject = getDateObject(date);

    // ******* generating teacher's id ******* \\
    const otherInfo = await othersCollection.findOne({});
    const teachersCount = otherInfo.teachersCount;
    const id = `T-${dept}-${roundDigit(teachersCount[dept] + 1, 3)}`;

    // ******* generating password ******* \\
    const password = process.env.passwordSecret + phone;

    // ******* creating a new teacher ******* \\
    const doc = { id, ...teacherInfo, password, joinedAt: dateObject.date };
    const insertResult = await teachersCollection.insertOne(doc);

    // ******* teacher is not created ******* \\
    if (!insertResult.acknowledged)
      return res.send({ okay: false, msg: 'Could not add the teacher' });

    // ******* teacher is created ******* \\
    teachersCount[dept] = teachersCount[dept] + 1;

    console.log(teachersCount);

    await othersCollection.updateOne(
      {},
      { $set: { teachersCount } },
      { upsert: true }
    );

    await activitiesCollection.insertOne({
      date: dateObject.date,
      activity: 'Added a teacher',
      data: `ID : ${id}`,
      time: dateObject.time,
    });

    res.send({ okay: true });
  } catch (err) {
    console.log(err.massage);
    res.send({ okay: false, msg: err.massage });
  }
});

module.exports = router;

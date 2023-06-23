const express = require('express');
const router = express.Router();
const { roundDigit } = require('../utils/helper');
const { othersCollection, teachersCollection } = require('../db/collections');

router.post('/', async (req, res) => {
  const teacherInfo = req.body;
  const { phone, dept } = teacherInfo;

  // ******* generating teacher's id ******* \\
  const otherInfo = await othersCollection.findOne({});
  const teachersCount = otherInfo.teachersCount;
  const id = `T-${dept}-${roundDigit(teachersCount[dept] + 1, 3)}`;

  // ******* generating password ******* \\
  const password = process.env.passwordSecret + phone;

  // ******* creating a new teacher ******* \\
  const doc = { id, ...teacherInfo, password };
  const insertResult = await teachersCollection.insertOne(doc);

  // ******* teacher is not created ******* \\
  if (!insertResult.acknowledged)
    return res.send({ okay: false, msg: 'Could not add the teacher' });

  // ******* teacher is created ******* \\
  teachersCount[dept] = teachersCount[dept] + 1;
  await othersCollection.updateOne(
    {},
    { $set: { teachersCount } },
    { upsert: true }
  );
  res.send({ okay: true });
});

module.exports = router;

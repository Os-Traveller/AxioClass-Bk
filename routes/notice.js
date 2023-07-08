const express = require('express');
const {
  noticesCollection,
  activitiesCollection,
} = require('../db/collections');
const { getDateObject } = require('../utils/helper');
const { ObjectId } = require('mongodb');
const router = express.Router();

router.post('/add', async (req, res) => {
  try {
    const { title, category, description } = req.body;
    const date = new Date();
    const dateObject = getDateObject(date);

    const newNotice = await noticesCollection.insertOne({
      title,
      category,
      description,
      date: dateObject.date,
    });

    if (!newNotice.acknowledged)
      return res.send({ okay: false, msg: "Notice Can't be added" });

    await activitiesCollection.insertOne({
      date: dateObject.date,
      activity: 'Posted a notice',
      data: `ID : ${newNotice.insertedId}`,
      time: dateObject.time,
    });

    res.send({ okay: true, msg: 'Notice added' });
  } catch (err) {
    console.log(err.massage);
    res.send({ okay: false, msg: err.massage });
  }
});

router.get('/', async (req, res) => {
  try {
    const cursor = noticesCollection.find({});
    const notices = await cursor.toArray();
    if (!notices) return res.send({ okay: false, msg: 'No notices found' });

    res.send({ okay: true, data: notices });
  } catch (err) {
    console.log(err.massage);
    res.send(err.massage);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStat = await noticesCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (!deletedStat.acknowledged)
      return res.send({ okay: false, msg: 'Could not delete' });

    res.send({ okay: true, msg: 'Deleted Successfully' });
  } catch (err) {
    console.log(err.massage);
    res.send({ okay: false, msg: err.massage });
  }
});

module.exports = router;

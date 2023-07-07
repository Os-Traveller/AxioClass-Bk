const express = require('express');
const { noticesCollection } = require('../db/collections');
const ObjectId = require('mongodb').ObjectId;
const router = express.Router();

router.post('/add', async (req, res) => {
  const { title, category, description } = req.body;
  const date = new Date();

  const newNotice = await noticesCollection.insertOne({
    title,
    category,
    description,
    date,
  });

  if (!newNotice.acknowledged)
    return res.send({ okay: false, msg: "Notice Can't be added" });

  res.send({ okay: true, msg: 'Notice added' });
});

router.get('/', async (req, res) => {
  const cursor = noticesCollection.find({});
  const notices = await cursor.toArray();
  if (!notices) return res.send({ okay: false, msg: 'No notices found' });

  res.send({ okay: true, data: notices });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const deletedStat = await noticesCollection.deleteOne({
    _id: ObjectId(id),
  });

  if (!deletedStat.acknowledged)
    return res.send({ okay: false, msg: 'Could not delete' });

  res.send({ okay: true, msg: 'Deleted Successfully' });
});

module.exports = router;

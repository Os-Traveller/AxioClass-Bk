const express = require('express');
const { noticesCollection } = require('../db/collections');
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

module.exports = router;

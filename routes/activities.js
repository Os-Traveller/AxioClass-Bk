const express = require('express');
const { activitiesCollection } = require('../db/collections');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const cursor = activitiesCollection.find();
    const activities = await cursor.toArray();
    if (!activities) res.send({ okay: false, msg: 'No Activity Found' });
    return res.send({ okay: true, data: activities });
  } catch (err) {
    console.log(err);
    return res.send({ okay: false, msg: err.massage });
  }
});

module.exports = router;

const express = require('express');
const {
  transactionsCollection,
  othersCollection,
} = require('../db/collections');

const router = express.Router();

// getting latest transaction
router.get('/get-/:count', async (req, res) => {
  const count = req.params.count;
  const cursor = transactionsCollection.find({});
  let transactions = await cursor.toArray();

  if (!transactions) return res.send({ okay: false, msg: 'Nothing Found' });
  transactions = transactions.reverse();

  if (count !== 'all' && transactions.length > count)
    transactions = transactions.slice(0, count);

  res.send({ okay: true, data: transactions });
});

router.get('/get-stat', async (req, res) => {
  const othersInfo = await othersCollection.findOne({});
  const { totalDemand, totalRevenue } = othersInfo;
  const due = totalDemand || 0 - totalRevenue || 0;
  res.send({ totalRevenue, due });
});

module.exports = router;

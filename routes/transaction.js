const express = require('express');
const { transactionsCollection } = require('../db/collections');

const router = express.Router();

// getting latest transaction
router.get('/:count', async (req, res) => {
  const count = req.params.count;
  const cursor = transactionsCollection.find({});
  let transactions = await cursor.toArray();

  if (!transactions) return res.send({ okay: false, msg: 'Nothing Found' });
  transactions = transactions.reverse();

  if (count !== 'all' && transactions.length > count)
    transactions = transactions.slice(0, count);

  res.send({ okay: true, data: transactions });
});

module.exports = router;

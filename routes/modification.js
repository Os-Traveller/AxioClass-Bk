const express = require('express');
const { studentsCollection, teachersCollection } = require('../db/collections');
const router = express.Router();

router.put('/password', async (req, res) => {
  const { id, role } = req.body;
  let user = {};
  if (role === 'student') user = await studentsCollection.findOne({ id });
  else if (role === 'teacher') user = await teachersCollection.findOne({ id });

  if (!user) return res.send({ okay: false, msg: 'User not found' });
  // generating new password
  const password = process.env.passwordSecret + user.phone;
  // updating the password
  let updateDoc;
  if (role === 'student')
    updateDoc = await studentsCollection.updateOne(
      { id },
      { $set: { password } }
    );
  else if (role === 'teacher')
    updateDoc = await teachersCollection.updateOne(
      { id },
      { $set: { password } }
    );

  // if update successfully
  if (!updateDoc.acknowledged)
    return res.send({ okay: false, msg: "Password can't be reset" });

  const userData = {
    name: user.name,
    id: user.id,
    image: user.image,
    password,
  };

  res.send({ okay: true, data: userData });
});

module.exports = router;

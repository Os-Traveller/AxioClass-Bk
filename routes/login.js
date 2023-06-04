const express = require('express');
const adminModel = require('../models/adminModel');
const router = express.Router();

router.post('/admin', async (req, res) => {
  try {
    const { id, password } = req.body;
    const admin = await adminModel.findOne({ id: id });

    if (!admin?.id) {
      // user not found
      return res.send({ msg: 'ID not found' });
    } else if (password !== admin.password) {
      // wrong password
      return res.send({ msg: 'Wrong Password' });
    }

    // user found && password match
    res.send({ id: admin.id, role: admin.role, msg: 'Login Success!' });
  } catch (err) {
    console.log(err);
  }
});

router.post('/student', (req, res) => {});
router.post('/teacher', (req, res) => {});

module.exports = router;

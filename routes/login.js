const express = require("express");
const router = express.Router();

router.post("/admin", (req, res) => {
  console.log(req.body);
  res.send({ msg: "Found It" });
});

module.exports = router;

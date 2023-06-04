import express from "express";
const router = express.Router();

router.post("/", (req, res) => {
  const { studentName, id } = req.body;
  console.log(studentName, id);
});

import express from "express";
import dotEnv from "dotenv";
import mongoose from "mongoose";
import { StudentModel } from "./models/userModel.js";

//  to read env file
const env = dotEnv.config();
const app = express();
const port = process.env.PORT || 5000;

// listening to port
app.listen(port, () => console.log("Connected"));

// connecting with mongo db
mongoose.connect(process.env.mongoUrl);

app.get("/", (req, res) => {
  // const user = new StudentModel({ studentName: "Shahid", id: "19202103135" });
  // user
  //   .save()
  //   .then(() => console.log("User Saved"))
  //   .catch((error) => console.log(error));
  // res.send(user);
  res.send("Server Connected");
});

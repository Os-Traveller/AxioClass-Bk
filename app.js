const express = require("express");
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

//  to read env file
dotEnv.config();
const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 5000;

// importing routes
const createStudent = require("./routes/createStudent");
const login = require("./routes/login");
// listening to port
app.listen(port, () => console.log("Connected"));

// connecting with mongo db
mongoose.connect(process.env.mongoUrl);

// routes
app.use("/create-student", createStudent);
app.use("/login", login);

app.get("/", (req, res) => {
  res.send("Server Connected");
});

admin = [{ adminId: "admin-super", password: "_admin_", role: "super" }];

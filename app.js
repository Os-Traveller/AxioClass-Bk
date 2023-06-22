const express = require('express');
const dotEnv = require('dotenv');
// const mongoose = require('mongoose');
const cors = require('cors');

//  to read env file
dotEnv.config();
const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 5000;

// importing routes
const addStudent = require('./routes/addStudent');
const addTeacher = require('./routes/addTeacher');
const login = require('./routes/login');
const getStudent = require('./routes/getStudent');
const getTeacher = require('./routes/getTeacher');
const payment = require('./routes/payment');
const courses = require('./routes/courses');
// listening to port
app.listen(port, () => console.log('Connected'));

// routes
app.use('/add-student', addStudent);
app.use('/add-teacher', addTeacher);
app.use('/login', login);
app.use('/get-student', getStudent);
app.use('/get-teacher', getTeacher);
app.use('/payment', payment);
app.use('/courses', courses);

app.get('/', async (req, res) => {
  res.send('Server Connected');
});

const express = require('express');
const dotEnv = require('dotenv');
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
const modification = require('./routes/modification');
const notice = require('./routes/notice');
const transaction = require('./routes/transaction');
const activities = require('./routes/activities');
const classroom = require('./routes/classroom');
const dashboard = require('./routes/dashboard');
const grade = require('./routes/grades');

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
app.use('/modification', modification);
app.use('/notice', notice);
app.use('/transaction', transaction);
app.use('/activities', activities);
app.use('/classroom', classroom);
app.use('/dashboard', dashboard);
app.use('/grade', grade);

app.get('/', async (req, res) => {
  res.send('server running');
});

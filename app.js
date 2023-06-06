const express = require('express');
const dotEnv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

//  to read env file
dotEnv.config();
const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 5000;

// importing routes
const addStudent = require('./routes/addStudent');
const login = require('./routes/login');
const getStudent = require('./routes/getStudent');
// listening to port
app.listen(port, () => console.log('Connected'));

// connecting with mongo db
mongoose.connect(process.env.mongoUrl);

// routes
app.use('/add-student', addStudent);
app.use('/login', login);
app.use('/get-student', getStudent);

app.get('/', async (req, res) => {
  res.send('Server Connected');
});

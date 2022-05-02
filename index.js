const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
dotenv.config();


const app = express();

//connect to db
mongoose.connect(process.env.MONGODB_URL,
    () => console.log('connected to db'));

//routes
const authRoute = require('./routes/auth');
const userData = require('./routes/userData');
const userManagement = require('./routes/userManagement');

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use('/api/user', authRoute);
app.use('/api/data', userData);
app.use('/api/umanagement', userManagement);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
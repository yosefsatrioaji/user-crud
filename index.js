const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();


const app = express();

//connect to db
mongoose.connect(process.env.MONGODB_URL,
    () => console.log('connected to db'));

//routes
const authRoute = require('./routes/auth');


//middlewares
app.use('/api/user', authRoute);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
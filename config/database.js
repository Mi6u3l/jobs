'use strict';

const mongoose = require('mongoose');
const database = 'job-app';
require('dotenv').config({'path': '.env'});

// connect to the database
mongoose.connect(`${process.env.MONGODB_URI}${database}`);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log(`Connected to the ${database} database`);
});

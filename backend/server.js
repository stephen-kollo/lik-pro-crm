const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

const exercisesRouter = require('./routes/exercises');
const usersRouter = require('./routes/users');
const clientsRouter = require('./routes/clients');

app.use('/exercises', exercisesRouter);
app.use('/users', usersRouter);
app.use('/clients', clientsRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

const googlesheetsAPI = require('./google_sheets/gs.api');
console.log(googlesheetsAPI.connectAPI('google_sheets/likpro-366122-75dfee8feca3.json'));

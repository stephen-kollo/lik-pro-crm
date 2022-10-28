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

const clientsRouter = require('./routes/clients');
const settingsRouter = require('./routes/settings');
const leadsRouter = require('./routes/leads');
const webUTMrouter = require('./routes/webUTMs');

app.use('/clients', clientsRouter);
app.use('/settings', settingsRouter);
app.use('/leads', leadsRouter);
app.use('/webutms', webUTMrouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
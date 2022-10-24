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

// const axios = require('axios')

//   const srcstr = {
//       autopayID: 14880,
//   }
//   axios.get('http://localhost:8080/clients/autopayclient', srcstr)
//               .then(res => {
//                 if(res.data.length > 0) {
//                   console.log(res)
//                 } else {
//                   console.log(res.data)
//                 }
//             })

// const axios = require("axios");
// async function getData() {
//   return await axios.get("https://jsonplaceholder.typicode.com/todos");
// }
// module.exports = { getData };


// async function findClient(id) {
//     const data = await Client.find({ autopayID: 14880 })
//     .then(data => {
//         console.log(data)
//     })
//     .catch(err => {
//         console.log(err)
//     })
// }

// findClient(14880)

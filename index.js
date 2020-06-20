const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
// const busboy = require('connect-busboy');
const path = require('path');
const db = require('./db')
const User = require('./routes/user.js');
const File = require('./routes/file.js');
// apps
// app.use(busboy());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cors());

// db
db.authenticate()
 .then(() => console.log('Connection has been established successfully.'))
 .catch((error) =>  console.error('Unable to connect to the database:', error))
// db.sync({force: true})
// routes
app.use('/', User);
app.use('/file', File);

app.listen(3000);
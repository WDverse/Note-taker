const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3001;
const app = express();

const uuid = require('./helpers/uuid');

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to serve up static assets from the public folder
app.use(express.static('public'));

const { readFromFile, readAndAppend } = require('./helpers/fsUtilis');

app.get('/api/notes', (req, res) => {
  console.info(`${req.method} request received to read notes`);

  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to save notes`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;
  console.log('body: ', req.body);

  console.log(title, text)
  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title: title,
      text: text,
      id: uuid(),
    };

    readAndAppend(newNote, './db/db.json');

    const response = {
      status: 'success',
      body: newNote,
    };

    res.json(response);
  } else {
    res.json('Error in saving notes');
  }
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
})
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
})

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);

module.exports = app;
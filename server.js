const express = require('express');
const path = require('path');
const PORT = 3001;
const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to serve up static assets from the public folder
app.use(express.static('public'));

const { readFromFile, readAndAppend } = require('./helpers/fsUtilis');

app.get('/notes',(req, res)=> {
    res.sendFile(path.join(__dirname,'notes.html'));
})
app.get('*',(req, res)=> {
    res.sendFile(path.join(__dirname,'index.html'));
})


app.get('/', (req, res) => {
    console.info(`${req.method} request received for notes`);
  
    readFromFile('./db/notes.json').then((data) => res.json(JSON.parse(data)));
  });


  app.post('/', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to submit notes`);
  
    // Destructuring assignment for the items in req.body
    const {noteTitile, noteText } = req.body;
  
    // If all the required properties are present
    if (noteTitile && noteText) {
      // Variable for the object we will save
      const newNote = {
        noteTitile,
        noteText,
        notes_id: uuid(),
      };
  
      readAndAppend(newNote, './db/notes.json');
  
      const response = {
        status: 'success',
        body: newNote,
      };
  
      res.json(response);
    } else {
      res.json('Error in saving notes');
    }
  });

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);

module.exports = app;
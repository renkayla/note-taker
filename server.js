const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse request body as JSON
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static('public'));

// GET route to retrieve notes from the JSON file
app.get('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(JSON.parse(data));
    }
  });
});

// POST route to save a new note to the JSON file
app.post('/api/notes', (req, res) => {
  const newNote = req.body;

  fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
    if (err) {
      
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      const notes = JSON.parse(data);
      newNote.id = Date.now().toString(); // Generate a unique ID for the note
      notes.push(newNote);

      fs.writeFile(
        path.join(__dirname, 'db', 'db.json'),
        JSON.stringify(notes),
        (err) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
          } else {
            res.json(newNote);
          }
        }
      );
    }
  });
});

// DELETE route to delete a note from the JSON file
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;

  fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      let notes = JSON.parse(data);
      notes = notes.filter((note) => note.id !== noteId);

      fs.writeFile(
        path.join(__dirname, 'db', 'db.json'),
        JSON.stringify(notes),
        (err) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
          } else {
            res.json({ message: 'Note deleted successfully' });
          }
        }
      );
    }
  });
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

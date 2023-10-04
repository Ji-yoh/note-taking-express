// TODO: write get and post routes for /api/notes 
// get /notes should read db.json for user notes and return notes.html
// get * should return index.html

const express = require("express");
const path = require("path");
const fs = require("fs");
const db = require("./db/db.json");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

// this should return index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// this should return notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
    // res.status(200).json(db);
    // console.log(db);
});

// added get route to read db.json for user notes
app.get('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    res.json(notes);
});

// refactored to use fs.writeFileSync instead of fs.writeFile and remove extra code
// post route to add new notes to db.json
app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    // note body, id should be a random number
    if (title && text) {
        const newNote = {
            title,
            text,
            id: Math.floor((1 + Math.random()) * 0x1000)
        }
    // get existing notes from db.json and add new notes to it
    // corrected path to db.json
    db.push(newNote); // add new notes
    fs.writeFileSync('./db/db.json', JSON.stringify(db, null, 4), (err) => 
    err ? console.error(err) : console.log('New note added!'))
    // have notes show on notes.html
    res.json(db);
    } 
});

// try to delete notes? ..notes are being deleted but need to restart server to see changes
app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id; // get note id from db.json
    const deleteNote = db.find((note) => note.id === id); // find note to delete
    db.splice(deleteNote, 1); // delete note
    fs.writeFileSync('./db/db.json', JSON.stringify(db, null, 4))
    res.json(db); // return db.json
    // console.log(id);
    /*if (id) {
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                const savedNotes = JSON.parse(data)
                const deletedNotes = savedNotes.filter((note) => note.id != id)
                fs.writeFile('./db/db.json', JSON.stringify(deletedNotes, null, 4), (err) => {
                    err ? console.error(err) : console.log('Note deleted!')
                })
            }
        })
    } */
})

app.listen(3000, () => console.log(`App listening at http://localhost:${PORT}`))